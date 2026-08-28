/* Minimal zero-dependency Supabase client for the Vestlake admin.
   Plain fetch + localStorage only — no eval, no new Function, no third-party code,
   so no browser extension CSP can break it. Mirrors the supabase-js API surface
   that admin.js uses ({ data, error } shapes included). */
(function () {
  'use strict';

  function createClient(url, anonKey) {
    var AUTH = url + '/auth/v1';
    var REST = url + '/rest/v1';
    var KEY = 'vl_session';
    var recoveryCb = null;

    function loadSession() {
      try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
    }
    function saveSession(d) {
      if (!d.expires_at && d.expires_in) d.expires_at = Math.floor(Date.now() / 1000) + d.expires_in;
      localStorage.setItem(KEY, JSON.stringify(d));
      return d;
    }
    function clearSession() { localStorage.removeItem(KEY); }

    async function authFetch(path, opts, token) {
      opts = opts || {};
      opts.headers = Object.assign({ apikey: anonKey, 'Content-Type': 'application/json' }, opts.headers || {});
      if (token) opts.headers.Authorization = 'Bearer ' + token;
      var res;
      try { res = await fetch(AUTH + path, opts); } catch (e) {
        return { data: null, error: { message: 'Network error — a firewall, VPN, or browser extension is blocking the sign-in service (' + url + '). Try another network or browser.' } };
      }
      var body = null;
      try { body = await res.json(); } catch (e) { /* empty responses are fine */ }
      if (!res.ok) {
        var msg = (body && (body.msg || body.message || body.error_description || body.error)) || ('Request failed (' + res.status + ')');
        return { data: null, error: { message: msg } };
      }
      return { data: body, error: null };
    }

    // Returns a valid session, refreshing the token if it is close to expiry.
    async function ensureSession() {
      var s = loadSession();
      if (!s || !s.access_token) return null;
      if (s.expires_at && Date.now() / 1000 > s.expires_at - 60) {
        var r = await authFetch('/token?grant_type=refresh_token', {
          method: 'POST', body: JSON.stringify({ refresh_token: s.refresh_token }),
        });
        if (r.error || !r.data || !r.data.access_token) { clearSession(); return null; }
        s = saveSession(r.data);
      }
      return s;
    }

    var auth = {
      async getSession() {
        var s = await ensureSession();
        return { data: { session: s } };
      },
      onAuthStateChange(cb) { recoveryCb = cb; },
      async signInWithPassword(creds) {
        var r = await authFetch('/token?grant_type=password', { method: 'POST', body: JSON.stringify(creds) });
        if (!r.error && r.data && r.data.access_token) saveSession(r.data);
        return { data: { user: r.data && r.data.user, session: r.data }, error: r.error };
      },
      async resetPasswordForEmail(email, opts) {
        var q = opts && opts.redirectTo ? '?redirect_to=' + encodeURIComponent(opts.redirectTo) : '';
        return authFetch('/recover' + q, { method: 'POST', body: JSON.stringify({ email: email }) });
      },
      async updateUser(attrs) {
        var s = await ensureSession();
        if (!s) return { data: null, error: { message: 'Not signed in' } };
        return authFetch('/user', { method: 'PUT', body: JSON.stringify(attrs) }, s.access_token);
      },
      async signOut() {
        var s = loadSession();
        if (s) { try { await authFetch('/logout', { method: 'POST' }, s.access_token); } catch (e) {} }
        clearSession();
        return { error: null };
      },
    };

    // PostgREST query builder covering select/insert/update + eq/gte/order/limit/single.
    function from(table) {
      var q = { table: table, method: 'select', cols: '*', body: null, filters: [], orders: [], limitN: null, mode: null };
      var b = {
        select(cols) { if (q.method === 'select') q.cols = cols || '*'; return b; },
        insert(obj) { q.method = 'insert'; q.body = obj; return b; },
        update(obj) { q.method = 'update'; q.body = obj; return b; },
        eq(col, val) { q.filters.push(col + '=eq.' + encodeURIComponent(val)); return b; },
        gte(col, val) { q.filters.push(col + '=gte.' + encodeURIComponent(val)); return b; },
        order(col, opts) { q.orders.push(col + '.' + ((opts && opts.ascending === false) ? 'desc' : 'asc')); return b; },
        limit(n) { q.limitN = n; return b; },
        single() { q.mode = 'single'; return b; },
        maybeSingle() { q.mode = 'maybe'; return b; },
        then(resolve, reject) { return run().then(resolve, reject); },
      };
      async function run() {
        var s = await ensureSession();
        var headers = { apikey: anonKey, 'Content-Type': 'application/json' };
        if (s) headers.Authorization = 'Bearer ' + s.access_token;
        var params = [];
        if (q.method === 'select') params.push('select=' + encodeURIComponent(q.cols));
        params = params.concat(q.filters);
        if (q.orders.length) params.push('order=' + q.orders.join(','));
        if (q.limitN != null) params.push('limit=' + q.limitN);
        var urlq = REST + '/' + q.table + (params.length ? '?' + params.join('&') : '');
        var opts = { method: 'GET', headers: headers };
        if (q.method === 'insert') { opts.method = 'POST'; opts.body = JSON.stringify(q.body); headers.Prefer = 'return=minimal'; }
        if (q.method === 'update') { opts.method = 'PATCH'; opts.body = JSON.stringify(q.body); headers.Prefer = 'return=minimal'; }
        var res, body = null;
        try { res = await fetch(urlq, opts); } catch (e) {
          return { data: null, error: { message: 'Network error — a firewall, VPN, or browser extension may be blocking ' + url } };
        }
        if (res.status !== 204) { try { body = await res.json(); } catch (e) {} }
        if (!res.ok) {
          var msg = (body && (body.message || body.msg || body.error)) || ('Request failed (' + res.status + ')');
          return { data: null, error: { message: msg } };
        }
        if (q.mode === 'single' || q.mode === 'maybe') {
          var row = Array.isArray(body) ? body[0] : body;
          if (!row && q.mode === 'single') return { data: null, error: { message: 'Row not found' } };
          return { data: row || null, error: null };
        }
        return { data: body, error: null };
      }
      return b;
    }

    // Password-recovery links land here with tokens in the hash fragment.
    (function handleRecoveryHash() {
      if (location.hash.indexOf('type=recovery') !== -1 && location.hash.indexOf('access_token=') !== -1) {
        var params = {};
        location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
          var p = kv.split('=');
          params[p[0]] = decodeURIComponent(p[1] || '');
        });
        saveSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
          expires_in: +params.expires_in || 3600,
        });
        history.replaceState(null, '', location.pathname);
        setTimeout(function () { if (recoveryCb) recoveryCb('PASSWORD_RECOVERY'); }, 0);
      }
    })();

    return { auth: auth, from: from };
  }

  window.supabase = { createClient: createClient };
})();
