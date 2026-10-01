/* Sword and Crown — publishing system.
 *
 * One storage interface, two backings:
 *   • Supabase, once config.js carries a URL and anon key.
 *   • A local preview, so the thing can be demonstrated and tested before the
 *     backend exists. Preview mode is announced in a banner that cannot be
 *     dismissed, because someone typing real inventory into a browser-only
 *     store and losing it would be much worse than an ugly banner.
 */
(function () {
  'use strict';

  var CFG = window.SC_CONFIG || {};
  var LIVE = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);
  var sb = LIVE ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ─────────────────────── tiny helpers ─────────────────────── */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function slugify(s) {
    return String(s || '').toLowerCase().trim()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70);
  }

  function money(cents) {
    if (cents == null || cents === '') return null;
    var whole = cents % 100 === 0;
    return '$' + (cents / 100).toLocaleString(undefined, {
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: 2
    });
  }

  function parseMoney(str) {
    if (str == null) return null;
    var t = String(str).replace(/[^0-9.]/g, '').trim();
    if (!t) return null;
    var n = Math.round(parseFloat(t) * 100);
    return isFinite(n) ? n : null;
  }

  var toastTimer;
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.classList.add('up');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('up'); }, 2600);
  }

  function uuid() {
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  /* ─────────────────────── storage ─────────────────────── */

  var LS_KEY = 'sc-admin-preview-v1';

  function localAll() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function localWrite(db) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(db)); }
    catch (e) { toast('This browser is blocking local storage, so nothing can be kept.'); }
  }

  var store = {
    list: function (table, filter) {
      if (LIVE) {
        var q = sb.from(table).select('*');
        if (filter && filter.kind) q = q.eq('kind', filter.kind);
        q = table === 'products'
          ? q.order('sort', { ascending: true }).order('created_at', { ascending: false })
          : q.order('created_at', { ascending: false });
        return q.then(function (r) { if (r.error) throw r.error; return r.data || []; });
      }
      var db = localAll();
      var rows = db[table] || [];
      if (filter && filter.kind) rows = rows.filter(function (x) { return x.kind === filter.kind; });
      return Promise.resolve(rows);
    },

    save: function (table, row) {
      row = Object.assign({}, row);
      if (LIVE) {
        var p = row.id
          ? sb.from(table).update(row).eq('id', row.id).select().single()
          : sb.from(table).insert(row).select().single();
        return p.then(function (r) { if (r.error) throw r.error; return r.data; });
      }
      var db = localAll();
      db[table] = db[table] || [];
      if (!row.id) {
        row.id = uuid();
        row.created_at = new Date().toISOString();
        db[table].unshift(row);
      } else {
        db[table] = db[table].map(function (x) { return x.id === row.id ? Object.assign({}, x, row) : x; });
      }
      localWrite(db);
      return Promise.resolve(row);
    },

    remove: function (table, id) {
      if (LIVE) {
        return sb.from(table).delete().eq('id', id)
          .then(function (r) { if (r.error) throw r.error; });
      }
      var db = localAll();
      db[table] = (db[table] || []).filter(function (x) { return x.id !== id; });
      localWrite(db);
      return Promise.resolve();
    },

    setting: function (key) {
      if (LIVE) {
        return sb.from('settings').select('value').eq('key', key).maybeSingle()
          .then(function (r) { if (r.error) throw r.error; return (r.data && r.data.value) || {}; });
      }
      return Promise.resolve((localAll().settings || {})[key] || {});
    },

    saveSetting: function (key, value) {
      if (LIVE) {
        return sb.from('settings').upsert({ key: key, value: value }, { onConflict: 'key' })
          .then(function (r) { if (r.error) throw r.error; });
      }
      var db = localAll();
      db.settings = db.settings || {};
      db.settings[key] = value;
      localWrite(db);
      return Promise.resolve();
    }
  };

  /* ─────────────────────── auth ─────────────────────── */

  function showApp(label) {
    $('#authView').classList.add('hide');
    $('#appView').classList.remove('hide');
    $('#whoLabel').innerHTML = label ? 'Signed in as <b>' + esc(label) + '</b>' : '';
    loadProducts();
    loadArticles('wig-bible');
    loadArticles('journal');
    loadNonprofit();
    loadSettings();
  }

  function showAuth(msg, kind) {
    $('#appView').classList.add('hide');
    $('#authView').classList.remove('hide');
    $('#authMsg').innerHTML = msg
      ? '<div class="msg ' + (kind || 'err') + '">' + esc(msg) + '</div>' : '';
  }

  $('#authForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('#email').value.trim();
    var pw = $('#pw').value;
    if (!email || !pw) { showAuth('Enter your email and password.'); return; }

    if (!LIVE) {
      // Preview mode has no real identity. Anything gets you in, and the
      // banner makes the situation impossible to misread.
      sessionStorage.setItem('sc-preview-user', email);
      showApp(email + ' (preview)');
      return;
    }

    var btn = $('#signInBtn');
    btn.disabled = true; btn.textContent = 'Signing in…';
    sb.auth.signInWithPassword({ email: email, password: pw })
      .then(function (r) {
        btn.disabled = false; btn.textContent = 'Sign in';
        if (r.error) { showAuth(r.error.message); return; }
        return sb.from('admins').select('email').maybeSingle().then(function (a) {
          if (!a.data) {
            return sb.auth.signOut().then(function () {
              showAuth('That account exists but has not been given publishing access yet.');
            });
          }
          showApp(r.data.user.email);
        });
      })
      .catch(function (err) {
        btn.disabled = false; btn.textContent = 'Sign in';
        showAuth(err.message || 'Could not sign in.');
      });
  });

  $('#signOut').addEventListener('click', function () {
    if (!LIVE) { sessionStorage.removeItem('sc-preview-user'); showAuth(''); return; }
    sb.auth.signOut().then(function () { showAuth(''); });
  });

  /* ─────────────────────── tabs ─────────────────────── */

  $$('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tabs button').forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
      b.setAttribute('aria-selected', 'true');
      $$('.tabpane').forEach(function (p) { p.classList.add('hide'); });
      $('#tab-' + b.dataset.tab).classList.remove('hide');
    });
  });

  /* ─────────────────────── shop ─────────────────────── */

  var prodCat = 'all';
  var products = [];

  $('#prodFilters').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    prodCat = b.dataset.cat;
    $$('#prodFilters button').forEach(function (x) {
      x.setAttribute('aria-pressed', String(x === b));
    });
    renderProducts();
  });

  function loadProducts() {
    store.list('products').then(function (rows) {
      products = rows; renderProducts();
    }).catch(function (e) { toast('Could not load the shop: ' + e.message); });
  }

  function renderProducts() {
    var rows = prodCat === 'all' ? products
      : products.filter(function (p) { return p.category === prodCat; });
    var host = $('#prodRows');

    if (!rows.length) {
      host.innerHTML = '<div class="empty"><h3>Nothing here yet</h3>' +
        '<p>Add your first product and it will appear in the shop as soon as you publish it.</p></div>';
      return;
    }

    host.innerHTML = rows.map(function (p) {
      var spec = [p.cap, p.length, p.texture, p.colour].filter(Boolean).join(' · ');
      var pills = p.published ? '<span class="pill live">Live</span>'
                              : '<span class="pill draft">Draft</span>';
      if (p.published && Number(p.stock) === 0) pills += ' <span class="pill out">Out of stock</span>';
      return '<div class="row">' +
        (p.image_url
          ? '<img class="thumb" src="' + esc(p.image_url) + '" alt="">'
          : '<div class="thumb ph">NO<br>PHOTO</div>') +
        '<div><h3>' + esc(p.name || 'Untitled') + '</h3>' +
        '<div class="meta">' + pills + ' &nbsp; ' +
        (money(p.price_cents) || 'no price') + ' · ' + (p.stock || 0) + ' in stock' +
        (spec ? ' · ' + esc(spec) : '') + '</div></div>' +
        '<div class="acts"><button class="btn ghost sm" data-edit-product="' + esc(p.id) + '">Edit</button></div>' +
        '</div>';
    }).join('');
  }

  function productForm(p) {
    p = p || {};
    return '' +
      '<div class="field"><label for="f_name">Name</label>' +
      '<input id="f_name" type="text" value="' + esc(p.name) + '" placeholder="What you would call it on the shelf"></div>' +
      '<div class="grid3">' +
        '<div class="field"><label for="f_cat">Category</label><select id="f_cat">' +
          ['wigs', 'toppers', 'accessories', 'care'].map(function (c) {
            return '<option value="' + c + '"' + (p.category === c ? ' selected' : '') + '>' +
              c.charAt(0).toUpperCase() + c.slice(1) + '</option>';
          }).join('') + '</select></div>' +
        '<div class="field"><label for="f_price">Price</label>' +
        '<input id="f_price" type="text" value="' + (p.price_cents != null ? esc(money(p.price_cents)) : '') + '" placeholder="$0.00"></div>' +
        '<div class="field"><label for="f_stock">In stock</label>' +
        '<input id="f_stock" type="number" min="0" value="' + esc(p.stock != null ? p.stock : 0) + '"></div>' +
      '</div>' +
      '<div class="field"><label for="f_blurb">Short description</label>' +
      '<textarea id="f_blurb" placeholder="A sentence or two. This shows on the product card.">' + esc(p.blurb) + '</textarea></div>' +
      '<h2 style="margin:26px 0 4px">Wig specification</h2>' +
      '<p class="hint" style="margin-bottom:14px">Leave blank for anything that is not a wig or topper.</p>' +
      '<div class="grid3">' +
        '<div class="field"><label for="f_cap">Cap construction</label><input id="f_cap" type="text" value="' + esc(p.cap) + '" placeholder="Lace front, full lace…"></div>' +
        '<div class="field"><label for="f_len">Length</label><input id="f_len" type="text" value="' + esc(p.length) + '" placeholder="18 inches"></div>' +
        '<div class="field"><label for="f_tex">Texture</label><input id="f_tex" type="text" value="' + esc(p.texture) + '" placeholder="Straight, body wave…"></div>' +
        '<div class="field"><label for="f_den">Density</label><input id="f_den" type="text" value="' + esc(p.density) + '" placeholder="150%"></div>' +
        '<div class="field"><label for="f_col">Colour</label><input id="f_col" type="text" value="' + esc(p.colour) + '" placeholder="Natural black, #27…"></div>' +
      '</div>' +
      '<div class="field"><label for="f_img">Photograph (link)</label>' +
      '<input id="f_img" type="url" value="' + esc(p.image_url) + '" placeholder="https://…">' +
      '<p class="hint">Paste an image link for now. Once the backend is connected this becomes an upload button.</p></div>' +
      '<div class="field"><label for="f_alt">Photograph description</label>' +
      '<input id="f_alt" type="text" value="' + esc(p.image_alt) + '" placeholder="Describe the photo for anyone using a screen reader">' +
      '</div>';
  }

  function readProduct(id) {
    return {
      id: id || undefined,
      name: $('#f_name').value.trim(),
      category: $('#f_cat').value,
      price_cents: parseMoney($('#f_price').value),
      stock: parseInt($('#f_stock').value, 10) || 0,
      blurb: $('#f_blurb').value.trim() || null,
      cap: $('#f_cap').value.trim() || null,
      length: $('#f_len').value.trim() || null,
      texture: $('#f_tex').value.trim() || null,
      density: $('#f_den').value.trim() || null,
      colour: $('#f_col').value.trim() || null,
      image_url: $('#f_img').value.trim() || null,
      image_alt: $('#f_alt').value.trim() || null
    };
  }

  /* ─────────────────────── articles ─────────────────────── */

  var articles = { 'wig-bible': [], 'journal': [] };

  function loadArticles(kind) {
    store.list('articles', { kind: kind }).then(function (rows) {
      articles[kind] = rows; renderArticles(kind);
    }).catch(function (e) { toast('Could not load articles: ' + e.message); });
  }

  function renderArticles(kind) {
    var host = $(kind === 'wig-bible' ? '#wbRows' : '#jrRows');
    var rows = articles[kind];

    if (!rows.length) {
      host.innerHTML = '<div class="empty"><h3>Nothing written yet</h3><p>' +
        (kind === 'wig-bible'
          ? 'The first article is the hardest. Pick the question you answer most often in consultations.'
          : 'Announce something — an opening, a new arrival, a workshop.') +
        '</p></div>';
      return;
    }

    host.innerHTML = rows.map(function (a) {
      var when = a.published_at ? new Date(a.published_at).toLocaleDateString(undefined,
        { year: 'numeric', month: 'short', day: 'numeric' }) : 'not dated';
      return '<div class="row">' +
        (a.cover_url ? '<img class="thumb" src="' + esc(a.cover_url) + '" alt="">'
                     : '<div class="thumb ph">NO<br>COVER</div>') +
        '<div><h3>' + esc(a.title || 'Untitled') + '</h3><div class="meta">' +
        (a.published ? '<span class="pill live">Live</span>' : '<span class="pill draft">Draft</span>') +
        ' &nbsp; ' + esc(when) + ' · /' + esc(a.slug || '') + '</div></div>' +
        '<div class="acts"><button class="btn ghost sm" data-edit-article="' + esc(a.id) + '" data-kind="' + esc(a.kind) + '">Edit</button></div>' +
        '</div>';
    }).join('');
  }

  function articleForm(a) {
    a = a || {};
    return '' +
      '<div class="field"><label for="f_title">Title</label>' +
      '<input id="f_title" type="text" value="' + esc(a.title) + '"></div>' +
      '<div class="grid2">' +
        '<div class="field"><label for="f_slug">Web address</label>' +
        '<input id="f_slug" type="text" value="' + esc(a.slug) + '" placeholder="filled in automatically">' +
        '<p class="hint">The end of the link. Leave it alone unless you have a reason.</p></div>' +
        '<div class="field"><label for="f_read">Reading time (minutes)</label>' +
        '<input id="f_read" type="number" min="1" value="' + esc(a.read_minutes || '') + '"></div>' +
      '</div>' +
      '<div class="field"><label for="f_ex">Excerpt</label>' +
      '<textarea id="f_ex" placeholder="One or two sentences. Shows on the card and in search results.">' + esc(a.excerpt) + '</textarea></div>' +
      '<div class="field"><label for="f_body">The article</label>' +
      '<textarea id="f_body" class="tall" placeholder="Write here.&#10;&#10;## A heading looks like this&#10;&#10;**Bold** and *italic* work the way you would expect.">' + esc(a.body) + '</textarea>' +
      '<p class="hint">Start a line with ## for a heading. Wrap words in **stars** for bold. A blank line starts a new paragraph.</p></div>' +
      '<div class="grid2">' +
        '<div class="field"><label for="f_cov">Cover image (link)</label>' +
        '<input id="f_cov" type="url" value="' + esc(a.cover_url) + '" placeholder="https://…"></div>' +
        '<div class="field"><label for="f_covalt">Cover description</label>' +
        '<input id="f_covalt" type="text" value="' + esc(a.cover_alt) + '"></div>' +
      '</div>';
  }

  function readArticle(id, kind) {
    var title = $('#f_title').value.trim();
    return {
      id: id || undefined,
      kind: kind,
      title: title,
      slug: $('#f_slug').value.trim() || slugify(title),
      excerpt: $('#f_ex').value.trim() || null,
      body: $('#f_body').value,
      read_minutes: parseInt($('#f_read').value, 10) || null,
      cover_url: $('#f_cov').value.trim() || null,
      cover_alt: $('#f_covalt').value.trim() || null
    };
  }

  /* ─────────────────────── editor sheet ─────────────────────── */

  var sheetState = { table: null, id: null, kind: null };

  function openSheet(opts) {
    sheetState = { table: opts.table, id: opts.id || null, kind: opts.kind || null };
    $('#sheetTitle').textContent = opts.title;
    $('#sheetBody').innerHTML = opts.html;
    $('#sheetDelete').classList.toggle('hide', !opts.id);
    $('#sheet').setAttribute('open', '');
    document.body.style.overflow = 'hidden';

    if (opts.table === 'articles') {
      var t = $('#f_title'), s = $('#f_slug');
      t.addEventListener('input', function () {
        if (!s.dataset.touched) s.value = slugify(t.value);
      });
      s.addEventListener('input', function () { s.dataset.touched = '1'; });
    }
    var first = $('#sheetBody input, #sheetBody textarea');
    if (first) first.focus();
  }

  function closeSheet() {
    $('#sheet').removeAttribute('open');
    document.body.style.overflow = '';
  }

  $('#sheetClose').addEventListener('click', closeSheet);
  $('#sheet').addEventListener('click', function (e) { if (e.target === $('#sheet')) closeSheet(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && $('#sheet').hasAttribute('open')) closeSheet();
  });

  function commit(published) {
    var row;
    if (sheetState.table === 'products') {
      row = readProduct(sheetState.id);
      if (!row.name) { toast('Give it a name first.'); return; }
    } else {
      row = readArticle(sheetState.id, sheetState.kind);
      if (!row.title) { toast('Give it a title first.'); return; }
      if (published && !row.published_at) row.published_at = new Date().toISOString();
    }
    row.published = published;

    store.save(sheetState.table, row).then(function () {
      closeSheet();
      toast(published ? 'Published — it is on the website now.' : 'Saved as a draft.');
      if (sheetState.table === 'products') loadProducts();
      else loadArticles(sheetState.kind);
    }).catch(function (e) { toast('Could not save: ' + e.message); });
  }

  $('#sheetPublish').addEventListener('click', function () { commit(true); });
  $('#sheetSaveDraft').addEventListener('click', function () { commit(false); });

  $('#sheetDelete').addEventListener('click', function () {
    if (!sheetState.id) return;
    if (!confirm('Delete this permanently? This cannot be undone.')) return;
    store.remove(sheetState.table, sheetState.id).then(function () {
      closeSheet();
      toast('Deleted.');
      if (sheetState.table === 'products') loadProducts();
      else loadArticles(sheetState.kind);
    }).catch(function (e) { toast('Could not delete: ' + e.message); });
  });

  /* new / edit triggers */
  document.addEventListener('click', function (e) {
    var nb = e.target.closest('[data-new]');
    if (nb) {
      var what = nb.dataset.new;
      if (what === 'product') {
        openSheet({ table: 'products', title: 'New product', html: productForm(null) });
      } else {
        openSheet({
          table: 'articles', kind: what,
          title: what === 'wig-bible' ? 'New Wig Bible article' : 'New Journal post',
          html: articleForm(null)
        });
      }
      return;
    }
    var pe = e.target.closest('[data-edit-product]');
    if (pe) {
      var p = products.filter(function (x) { return x.id === pe.dataset.editProduct; })[0];
      if (p) openSheet({ table: 'products', id: p.id, title: 'Edit product', html: productForm(p) });
      return;
    }
    var ae = e.target.closest('[data-edit-article]');
    if (ae) {
      var k = ae.dataset.kind;
      var a = articles[k].filter(function (x) { return x.id === ae.dataset.editArticle; })[0];
      if (a) openSheet({ table: 'articles', id: a.id, kind: k, title: 'Edit', html: articleForm(a) });
    }
  });

  /* ─────────────────────── non-profit & settings ─────────────────────── */

  function loadNonprofit() {
    store.setting('nonprofit').then(function (v) {
      $('#npName').value = v.name || '';
      $('#npMission').value = v.mission || '';
      $('#npBody').value = v.body || '';
      $('#npInvolve').value = v.involve || '';
      $('#npContact').value = v.contact || '';
    }).catch(function () {});
  }

  $('#npForm').addEventListener('submit', function (e) {
    e.preventDefault();
    store.saveSetting('nonprofit', {
      name: $('#npName').value.trim(),
      mission: $('#npMission').value.trim(),
      body: $('#npBody').value.trim(),
      involve: $('#npInvolve').value.trim(),
      contact: $('#npContact').value.trim()
    }).then(function () { toast('Saved.'); })
      .catch(function (err) { toast('Could not save: ' + err.message); });
  });

  function loadSettings() {
    store.setting('contact').then(function (v) {
      $('#stPhone').value = v.phone || '';
      $('#stHours').value = v.hours || '';
      $('#stBooking').value = v.booking_url || '';
    }).catch(function () {});
    store.setting('policies').then(function (v) {
      $('#poShip').value = v.ship_days || '';
      $('#poArea').value = v.ship_area || '';
      $('#poDelivery').value = v.delivery_days || '';
      $('#poCustom').value = v.custom_weeks || '';
      $('#poReturn').value = v.return_days || '';
      $('#poOutcome').value = v.return_outcome || '';
      $('#poDamaged').value = v.damaged_days || '';
      $('#poCare').value = v.care_days || '';
      $('#poDeposit').value = v.deposit || '';
      $('#poNotice').value = v.notice_hours || '';
      $('#poNoticeOut').value = v.notice_outcome || '';
      $('#poLate').value = v.late_minutes || '';
      $('#poNoshow').value = v.noshow || '';
    }).catch(function () {});
  }

  $('#setForm').addEventListener('submit', function (e) {
    e.preventDefault();
    Promise.all([
      store.saveSetting('contact', {
        phone: $('#stPhone').value.trim(),
        hours: $('#stHours').value.trim(),
        booking_url: $('#stBooking').value.trim()
      }),
      store.saveSetting('policies', {
        ship_days: $('#poShip').value.trim(),
        ship_area: $('#poArea').value.trim(),
        delivery_days: $('#poDelivery').value.trim(),
        custom_weeks: $('#poCustom').value.trim(),
        return_days: $('#poReturn').value.trim(),
        return_outcome: $('#poOutcome').value.trim(),
        damaged_days: $('#poDamaged').value.trim(),
        care_days: $('#poCare').value.trim(),
        deposit: $('#poDeposit').value.trim(),
        notice_hours: $('#poNotice').value.trim(),
        notice_outcome: $('#poNoticeOut').value.trim(),
        late_minutes: $('#poLate').value.trim(),
        noshow: $('#poNoshow').value.trim()
      })
    ]).then(function () { toast('Saved.'); })
      .catch(function (err) { toast('Could not save: ' + err.message); });
  });

  /* ─────────────────────── boot ─────────────────────── */

  if (!LIVE) {
    $('#pmode').classList.remove('hide');
    var who = sessionStorage.getItem('sc-preview-user');
    if (who) showApp(who + ' (preview)'); else showAuth('');
  } else {
    sb.auth.getSession().then(function (r) {
      var s = r.data && r.data.session;
      if (!s) { showAuth(''); return; }
      sb.from('admins').select('email').maybeSingle().then(function (a) {
        if (a.data) showApp(s.user.email);
        else sb.auth.signOut().then(function () { showAuth(''); });
      });
    });
  }
})();
