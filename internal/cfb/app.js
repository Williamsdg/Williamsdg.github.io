/* Williams Digital · CFB Predictor — page logic. Plain JS, no build step. */
(function () {
  'use strict';
  var M = window.CFBModel;
  var API = 'https://api.collegefootballdata.com';
  var GM_URL = 'https://raw.githubusercontent.com/gmalbert/college-football-predictions/HEAD/data_files/best_bets_today.json';
  var LS = 'wdcfb:';
  var HOUR = 3600e3;
  var view = document.getElementById('view');

  /* ---------- storage (every access guarded: private windows can throw) ---------- */
  var mem = {};
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(LS + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del: function (k) { try { localStorage.removeItem(LS + k); } catch (e) { } },
    keys: function () { var out = []; try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(LS) === 0) out.push(k.slice(LS.length)); } } catch (e) { } return out; }
  };

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function f1(x) { return x == null ? '–' : (Math.round(x * 10) / 10).toFixed(1); }
  function half(x) { return Math.round(x * 2) / 2; }
  function pct(x, d) { return x == null ? '–' : (x * 100).toFixed(d == null ? 0 : d) + '%'; }
  function signed(x) { return x == null ? '–' : (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(half(x)).toString(); }
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function monthKey() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
  function currentSeason() { var d = new Date(); return d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1; }
  /** "Tulane -7" style text from a home-perspective margin (home − away). */
  function favText(margin, home, away) {
    if (margin == null) return '–';
    var m = half(margin);
    if (m === 0) return 'Pick’em';
    return m > 0 ? home + ' −' + Math.abs(m) : away + ' −' + Math.abs(m);
  }
  function lineText(spread, home, away) { return spread == null ? 'No line yet' : favText(-spread, home, away); }
  function kickoff(g) {
    if (!g.startDate) return 'TBD';
    var d = new Date(g.startDate);
    var day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (g.startTimeTBD) return day + ' · TBD';
    return day + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  /* ---------- settings ---------- */
  function loadSettings() {
    var s = store.get('settings', {}) || {};
    var out = Object.assign({}, M.DEFAULTS, s);
    out.weights = Object.assign({}, M.DEFAULTS.weights, s.weights || {});
    if (out.second == null) out.second = true;
    if (out.propEdge == null) out.propEdge = 3;
    return out;
  }
  function saveSettings() { store.set('settings', state.settings); }
  function getKey() { return store.get('key', '') || mem.key || ''; }

  var state = {
    settings: loadSettings(),
    season: currentSeason(),
    week: null,
    raw: {}, ctx: {}, loading: {}, errors: {},
    second: null, secondMeta: null,
    filters: { q: '', conf: '', fbsOnly: true, picksOnly: false, sort: 'time' },
    rsort: { k: 'overall', dir: -1 }, rfbs: true, rconf: '', rq: '',
    btSeason: currentSeason(),
    matchup: store.get('matchup', null) || { home: 'Alabama', away: 'Auburn', neutral: false, line: '' },
    updatedAt: null
  };

  /* ---------- API layer: cache-first, slimmed payloads, monthly call counter ---------- */
  function bumpUsage() { var k = 'usage:' + monthKey(); store.set(k, (store.get(k, 0) || 0) + 1); }
  function usage() { return store.get('usage:' + monthKey(), 0) || 0; }

  function pick(o, keys) { var r = {}; keys.forEach(function (k) { if (o[k] !== undefined) r[k] = o[k]; }); return r; }
  var GAME_KEYS = ['id', 'season', 'week', 'seasonType', 'startDate', 'startTimeTBD', 'completed', 'neutralSite', 'conferenceGame', 'venue', 'notes',
    'homeTeam', 'awayTeam', 'homeConference', 'awayConference', 'homeClassification', 'awayClassification',
    'homePoints', 'awayPoints', 'homePregameElo', 'awayPregameElo', 'homePostgameElo', 'awayPostgameElo'];
  function slim(path, d) {
    if (!Array.isArray(d)) return d;
    var p = path.split('?')[0];
    if (p === 'games') return d.map(function (g) { return pick(g, GAME_KEYS); });
    if (p === 'lines') return d.map(function (l) {
      return { id: l.id, week: l.week, seasonType: l.seasonType, homeTeam: l.homeTeam, awayTeam: l.awayTeam,
        lines: (l.lines || []).map(function (x) { return pick(x, ['provider', 'spread', 'spreadOpen', 'overUnder', 'homeMoneyline', 'awayMoneyline']); }) };
    });
    if (p === 'ratings/sp') return d.map(function (r) { return { team: r.team, conference: r.conference, rating: r.rating, ranking: r.ranking, offense: { rating: r.offense && r.offense.rating }, defense: { rating: r.defense && r.defense.rating } }; });
    if (p === 'ratings/fpi') return d.map(function (r) { return { team: r.team, conference: r.conference, fpi: r.fpi }; });
    if (p === 'games/players') return window.CFBProps.slimBox(d);
    if (p === 'ppa/teams') return d.map(function (r) { return { team: r.team, conference: r.conference, offense: { overall: r.offense && r.offense.overall }, defense: { overall: r.defense && r.defense.overall } }; });
    return d;
  }
  function pruneCache(keepYear) {
    store.keys().forEach(function (k) { if (k.indexOf('c:') === 0 && k.indexOf('year=' + keepYear) < 0) store.del(k); });
  }
  function cfbd(path, ttl, force) {
    var ck = 'c:' + path;
    var hit = mem[ck] || store.get(ck, null);
    if (!force && hit && Date.now() - hit.t < ttl) { mem[ck] = hit; return Promise.resolve(hit.d); }
    var key = getKey();
    if (!key) return Promise.reject(new Error('NO_KEY'));
    return fetch(API + '/' + path, { headers: { Authorization: 'Bearer ' + key, Accept: 'application/json' } })
      .then(function (r) {
        bumpUsage();
        if (r.status === 401 || r.status === 403) throw new Error('BAD_KEY');
        if (r.status === 429) { if (hit) return { stale: hit.d }; throw new Error('LIMIT'); }
        if (!r.ok) { if (hit) return { stale: hit.d }; throw new Error('HTTP ' + r.status + ' on /' + path.split('?')[0]); }
        return r.json();
      }, function (err) { if (hit) return { stale: hit.d }; throw err; })
      .then(function (d) {
        if (d && d.stale) return d.stale;
        d = slim(path, d);
        var entry = { t: Date.now(), d: d };
        mem[ck] = entry;
        if (!store.set(ck, entry)) { pruneCache(state.season); store.set(ck, entry); }
        return d;
      });
  }

  function loadSeason(year, force) {
    if (state.loading[year]) return state.loading[year];
    var live = year >= currentSeason();
    var tLive = live ? 3 * HOUR : 30 * 24 * HOUR, tRat = live ? 12 * HOUR : 30 * 24 * HOUR, tTal = 7 * 24 * HOUR;
    var jobs = {
      games: cfbd('games?year=' + year + '&seasonType=both&classification=fbs', tLive, force),
      lines: cfbd('lines?year=' + year + '&seasonType=both', tLive, force),
      sp: cfbd('ratings/sp?year=' + year, tRat, force),
      fpi: cfbd('ratings/fpi?year=' + year, tRat, force),
      srs: cfbd('ratings/srs?year=' + year, tRat, force),
      ppa: cfbd('ppa/teams?year=' + year + '&excludeGarbageTime=true', tRat, force),
      talent: cfbd('talent?year=' + year, tTal, force)
    };
    var names = Object.keys(jobs);
    setStatus();
    var p = Promise.all(names.map(function (n) {
      return jobs[n].then(function (d) { return { n: n, d: d }; }, function (e) { return { n: n, e: e }; });
    })).then(function (res) {
      var data = {}, errs = [];
      res.forEach(function (r) { if (r.e) errs.push(r); else data[r.n] = r.d; });
      var fatal = res.filter(function (r) { return r.e && (r.e.message === 'NO_KEY' || r.e.message === 'BAD_KEY'); })[0];
      if (fatal) throw fatal.e;
      if (!data.games) throw (errs[0] && errs[0].e) || new Error('Could not load games');
      state.raw[year] = data;
      state.errors[year] = errs.map(function (r) { return r.n + ': ' + r.e.message; });
      state.ctx[year] = M.buildContext(data, state.settings);
      state.updatedAt = Date.now();
      return state.ctx[year];
    });
    state.loading[year] = p;
    p.then(function () { delete state.loading[year]; setStatus(); }, function () { delete state.loading[year]; setStatus(); });
    return p;
  }
  function rebuildAll() { Object.keys(state.raw).forEach(function (y) { state.ctx[y] = M.buildContext(state.raw[y], state.settings); }); }

  /* gmalbert/college-football-predictions publishes today's picks as JSON — read it as a second opinion. */
  function loadSecond(force) {
    if (!state.settings.second) return Promise.resolve(null);
    var ck = 'gm';
    var hit = store.get(ck, null);
    if (!force && hit && Date.now() - hit.t < 3 * HOUR) { applySecond(hit.d); return Promise.resolve(hit.d); }
    return fetch(GM_URL, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('gmalbert ' + r.status); return r.json(); })
      .then(function (d) { store.set(ck, { t: Date.now(), d: d }); applySecond(d); return d; })
      .catch(function () { if (hit) applySecond(hit.d); return null; });
  }
  function applySecond(d) {
    var map = {};
    (d && d.bets || []).forEach(function (b) {
      var item = { type: b.bet_type, pick: (b.pick || '').replace(/^Take\s+/, ''), prob: b.probability, edge: b.edge, tier: b.tier, side: null };
      if (b.bet_type === 'Spread') {
        var name = item.pick.replace(/\s+[+\-−]?\d+(\.\d+)?\s*$/, '');
        item.side = name === b.home_team ? 'home' : name === b.away_team ? 'away' : null;
      }
      (map[b.game_id] = map[b.game_id] || []).push(item);
    });
    state.second = map; state.secondMeta = d && d.meta;
  }

  /* ---------- status / tooltip / sheet ---------- */
  function setStatus() {
    var el = document.getElementById('status');
    var busy = Object.keys(state.loading).length;
    var t = state.updatedAt ? new Date(state.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null;
    el.innerHTML = busy ? '<span class="spin" aria-hidden="true"></span> Loading' : (t ? '<span class="st-l">Data </span>' + esc(t) + '<span class="st-l"> · ' + usage() + '/1000 calls</span>' : '');
  }
  var tip = document.getElementById('tip');
  function showTip(html, x, y) {
    tip.innerHTML = html; tip.classList.remove('hidden');
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.min(window.innerWidth - w - 8, Math.max(8, x + 14)), top = y + 16;
    if (top + h > window.innerHeight - 8) top = y - h - 12;
    tip.style.left = left + 'px'; tip.style.top = Math.max(8, top) + 'px';
  }
  function hideTip() { tip.classList.add('hidden'); }
  document.addEventListener('pointermove', function (e) {
    var t = e.target.closest && e.target.closest('[data-tip]');
    if (t) showTip(t.getAttribute('data-tip'), e.clientX, e.clientY); else hideTip();
  });
  document.addEventListener('scroll', hideTip, true);

  var sheet = document.getElementById('sheet');
  function openSheet(html) { $('#sheetBody').innerHTML = html; sheet.classList.remove('hidden'); document.body.style.overflow = 'hidden'; $('#sheetClose').focus(); }
  function closeSheet() { sheet.classList.add('hidden'); document.body.style.overflow = ''; hideTip(); }
  $('#sheetClose').addEventListener('click', closeSheet);
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.classList.contains('hidden')) closeSheet(); });

  /* ---------- prediction helpers ---------- */
  function secondFor(g) { return state.second && state.settings.second && g.season === currentSeason() ? (state.second[g.id] || null) : null; }
  function predictGame(g, ctx) {
    var sec = secondFor(g), spreadSec = sec && sec.filter(function (b) { return b.type === 'Spread'; })[0];
    return M.predict(g, ctx, { second: spreadSec || null });
  }
  function pickText(p, g) {
    if (!p.pick) return null;
    var s = p.market.spread;
    return p.pick === 'home' ? g.homeTeam + ' ' + signed(s) : g.awayTeam + ' ' + signed(-s);
  }
  function atsResult(p, g) {
    if (!p.pick || !g.completed || g.homePoints == null) return null;
    var cover = (g.homePoints - g.awayPoints) - p.market.margin;
    if (cover === 0) return 'P';
    return (cover > 0) === (p.pick === 'home') ? 'W' : 'L';
  }
  function tierChip(t) { return t ? '<span class="chip ' + t + '">' + (t === 'HIGH' ? 'High' : t === 'MEDIUM' ? 'Medium' : 'Low') + ' confidence</span>' : ''; }

  /* ---------- component chart (diverging bars, right = home favored) ---------- */
  function compChart(p, home, away) {
    var w = state.settings.weights, rows = M.COMPONENTS.map(function (c) { return { c: c, v: p.comps[c.key], wt: +w[c.key] || 0 }; });
    var vals = rows.map(function (r) { return r.v; }).concat([p.margin, p.market && p.market.margin]).filter(function (v) { return v != null; });
    var max = Math.max(7, Math.ceil(Math.max.apply(null, vals.map(Math.abs).concat([0])) / 7) * 7);
    function bar(v, color) {
      if (v == null) return '';
      var wpct = Math.abs(v) / max * 50;
      return v >= 0 ? '<i class="bar r" style="left:50%;width:' + wpct + '%;background:' + color + '"></i>'
        : '<i class="bar lft" style="left:' + (50 - wpct) + '%;width:' + wpct + '%;background:' + color + '"></i>';
    }
    var mk = p.market && p.market.margin != null ? '<i class="mk" style="left:' + (50 + p.market.margin / max * 50) + '%"></i>' : '';
    function row(label, v, wt, cls, srcText) {
      var color = v != null && v >= 0 ? 'var(--home)' : 'var(--away)';
      var tipHtml = '<b>' + esc(label) + '</b><br>' + (v == null ? 'No data for this game' : esc(favText(v, home, away))) +
        (wt != null ? '<br>Weight ' + wt + (wt === 0 ? ' (off)' : '') : '') + (srcText ? '<br><span class="muted">' + esc(srcText) + '</span>' : '');
      return '<div class="crow ' + (cls || '') + '"><div class="cl">' + esc(label) + '</div><div class="ctrack"><i class="axis"></i>' +
        bar(v, color) + mk + '<i class="hit" data-tip="' + esc(tipHtml) + '"></i></div><div class="cv">' + (v == null ? '–' : signed(v)) + '</div></div>';
    }
    var html = '<div class="comp-legend"><span><i style="background:var(--home)"></i>' + esc(home) + ' favored (right)</span>' +
      '<span><i style="background:var(--away)"></i>' + esc(away) + ' favored (left)</span>' +
      (mk ? '<span><i class="ln"></i>Vegas line</span>' : '') + '</div><div class="comp-chart" role="img" aria-label="Predicted margin by signal">';
    rows.forEach(function (r) { html += row(r.c.label, r.v, r.wt, (r.v == null || r.wt === 0) ? 'off' : '', r.c.src); });
    html += row('Blend', p.margin, null, 'total', 'Weighted average of the signals above');
    return html + '</div><p class="small muted" style="margin-top:8px">Numbers are points from ' + esc(home) + '’s side: +7 means ' + esc(home) + ' by 7.</p>';
  }

  function predictionBlock(g, p) {
    var home = g.homeTeam, away = g.awayTeam, wp = p.homeWP;
    var sec = secondFor(g);
    var out = '<div class="score-hero"><div class="t">' + esc(away) + '</div><div class="sc">' + (g.completed && g.homePoints != null
      ? g.awayPoints + ' – ' + g.homePoints : Math.round(p.awayPts) + ' – ' + Math.round(p.homePts)) + '</div><div class="t r">' + esc(home) + '</div></div>';
    out += '<p class="small soft" style="text-align:center;margin-bottom:14px">' + (g.completed && g.homePoints != null ? 'Final. Model projected ' + Math.round(p.awayPts) + '–' + Math.round(p.homePts) + '.' : 'Projected score') + '</p>';
    out += '<div class="wpbar" aria-hidden="true"><i style="width:' + ((1 - wp) * 100) + '%;background:var(--away)"></i><i style="width:' + (wp * 100) + '%;background:var(--home)"></i></div>' +
      '<div class="wplab"><span>' + esc(away) + ' ' + pct(1 - wp) + '</span><span>' + esc(home) + ' ' + pct(wp) + '</span></div>';
    out += '<div class="kpis" style="margin-top:18px">' +
      kpi('Model line', favText(p.margin, home, away), 'Blend of every signal') +
      kpi('Vegas line', p.market ? lineText(p.market.spread, home, away) : 'None yet', p.market ? (p.market.books.join(', ') + (p.market.spreadOpen != null && p.market.spreadOpen !== p.market.spread ? ' · opened ' + lineText(p.market.spreadOpen, home, away) : '')) : 'Model only') +
      kpi('Edge vs line', p.edge == null ? '–' : f1(Math.abs(p.edge)) + ' pts', p.edge == null ? 'Needs a line' : 'Toward ' + (p.edge >= 0 ? home : away) + ', ratings only') +
      kpi('Total', f1(p.total), p.market && p.market.total != null ? 'Vegas O/U ' + p.market.total : 'From SP+ offense and defense') + '</div>';
    if (p.pick) out += '<p><span class="chip pick">Pick: ' + esc(pickText(p, g)) + '</span> ' + tierChip(p.tier) + '</p>';
    else if (p.edge != null) out += '<p class="soft">No pick. The ratings land within ' + state.settings.edgeMin + ' points of the line.</p>';
    if (p.reasons.length) out += '<ul class="why">' + p.reasons.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>';
    if (p.market && p.market.homeWP != null) out += '<p class="small soft" style="margin-top:10px">Moneyline odds put ' + esc(home) + ' at ' + pct(p.market.homeWP) + ' to win, after removing the bookmaker margin.</p>';
    if (sec && sec.length) out += '<p class="small soft">gmalbert model: ' + sec.map(function (b) { return esc(b.pick) + ' (' + esc(b.tier) + ', ' + pct(b.prob) + ')'; }).join(' · ') + '</p>';
    out += '<h3 style="margin-top:22px">What each signal says</h3>' + compChart(p, home, away);
    return out;
  }
  function kpi(label, v, s) { return '<div class="kpi"><div class="label">' + esc(label) + '</div><div class="v">' + esc(v) + '</div>' + (s ? '<div class="s">' + esc(s) + '</div>' : '') + '</div>'; }

  /* ---------- views ---------- */
  function needKey() {
    view.innerHTML = '<div class="onboard"><div class="eyebrow">// Private · Williams Digital</div><h1>College football predictor</h1>' +
      '<p class="lede">This page pulls live data from CollegeFootballData and blends SP+, FPI, Elo, SRS, play-by-play efficiency, roster talent, an in-house power rating and the Vegas line into a prediction for every game.</p>' +
      '<div class="panel"><h3>Connect your data key</h3><ol><li>Search your email for “CFBD API Key Request”, or get a free key at <a href="https://collegefootballdata.com/key" target="_blank" rel="noopener">collegefootballdata.com/key</a>.</li>' +
      '<li>Paste it below. It is saved only in this browser and is never sent anywhere except CollegeFootballData.</li></ol>' +
      '<form id="keyForm" class="keybox" autocomplete="off"><input id="keyIn" type="password" autocomplete="new-password" placeholder="Paste API key" aria-label="API key" required><button class="btn primary" type="submit">Save and load</button></form>' +
      '<p class="err" id="keyErr"></p></div></div>';
    $('#keyForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var k = $('#keyIn').value.trim().replace(/^Bearer\s+/i, '');
      if (!k) return;
      if (!store.set('key', k)) mem.key = k;
      $('#keyErr').textContent = '';
      route();
    });
  }
  function loadingView(msg) { view.innerHTML = '<div class="empty"><span class="spin" aria-hidden="true"></span> ' + esc(msg || 'Loading the season…') + '</div>'; }
  function errorView(e) {
    if (e && e.message === 'NO_KEY') return needKey();
    if (e && e.message === 'BAD_KEY') { store.del('key'); delete mem.key; needKey(); $('#keyErr').textContent = 'CollegeFootballData rejected that key. Paste it again.'; return; }
    var msg = e && e.message === 'LIMIT' ? 'The monthly limit of 1,000 calls has been reached. Cached data will return when it is available.' : (e && e.message) || 'Something went wrong.';
    view.innerHTML = '<div class="empty"><p class="err">' + esc(msg) + '</p><button class="btn" id="retry">Try again</button></div>';
    $('#retry').addEventListener('click', function () { route(); });
  }

  function withSeason(year, fn) {
    if (!getKey()) return needKey();
    if (state.ctx[year]) return fn(state.ctx[year]);
    loadingView('Loading the ' + year + ' season…');
    loadSeason(year).then(function () { route(); }, errorView);
  }

  function seasonOptions(sel) {
    var cur = currentSeason(), out = '';
    for (var y = cur; y >= cur - 3; y--) out += '<option value="' + y + '"' + (y === sel ? ' selected' : '') + '>' + y + ' season</option>';
    return out;
  }
  function weekList(ctx) {
    var reg = {}, post = false;
    ctx.games.forEach(function (g) { if (g.seasonType === 'postseason') post = true; else reg[g.week] = true; });
    var weeks = Object.keys(reg).map(Number).sort(function (a, b) { return a - b; }).map(function (w) { return { v: 'regular:' + w, label: 'Week ' + w }; });
    if (post) weeks.push({ v: 'postseason', label: 'Bowls & playoff' });
    return weeks;
  }
  function defaultWeek(ctx) {
    var open = ctx.games.filter(function (g) { return !g.completed; }).sort(function (a, b) { return (a.startDate || '').localeCompare(b.startDate || ''); })[0];
    if (open) return open.seasonType === 'postseason' ? 'postseason' : 'regular:' + open.week;
    var wl = weekList(ctx); return wl.length ? wl[wl.length - 1].v : 'regular:1';
  }
  function gamesFor(ctx, wk) {
    if (wk === 'postseason') return ctx.games.filter(function (g) { return g.seasonType === 'postseason'; });
    var w = +wk.split(':')[1];
    return ctx.games.filter(function (g) { return g.seasonType === 'regular' && g.week === w; });
  }

  function renderSlate() {
    withSeason(state.season, function (ctx) {
      if (!state.week || !weekList(ctx).some(function (w) { return w.v === state.week; })) state.week = defaultWeek(ctx);
      var F = state.filters, all = gamesFor(ctx, state.week);
      var confs = {}; all.forEach(function (g) { [g.homeConference, g.awayConference].forEach(function (c) { if (c) confs[c] = 1; }); });
      var items = all.map(function (g) { return { g: g, p: predictGame(g, ctx) }; });
      var shown = items.filter(function (it) {
        var g = it.g;
        if (F.fbsOnly && (g.homeClassification !== 'fbs' || g.awayClassification !== 'fbs')) return false;
        if (F.conf && g.homeConference !== F.conf && g.awayConference !== F.conf) return false;
        if (F.q && (g.homeTeam + ' ' + g.awayTeam).toLowerCase().indexOf(F.q.toLowerCase()) < 0) return false;
        if (F.picksOnly && !it.p.pick) return false;
        return true;
      });
      shown.sort(function (a, b) {
        if (F.sort === 'edge') return Math.abs(b.p.edge || 0) - Math.abs(a.p.edge || 0);
        if (F.sort === 'sure') return Math.abs((b.p.homeWP || .5) - .5) - Math.abs((a.p.homeWP || .5) - .5);
        if (!!a.g.completed !== !!b.g.completed) return a.g.completed ? 1 : -1; // upcoming first
        return (a.g.startDate || '').localeCompare(b.g.startDate || '');
      });
      var picks = shown.filter(function (it) { return it.p.pick; });
      var high = picks.filter(function (it) { return it.p.tier === 'HIGH'; });
      var done = shown.filter(function (it) { return it.g.completed && it.g.homePoints != null && it.g.homePoints !== it.g.awayPoints; });
      var su = done.filter(function (it) { return (it.p.margin > 0) === (it.g.homePoints > it.g.awayPoints); }).length;
      var atsW = 0, atsL = 0; done.forEach(function (it) { var r = atsResult(it.p, it.g); if (r === 'W') atsW++; if (r === 'L') atsL++; });
      var wl = weekList(ctx), wLabel = (wl.filter(function (w) { return w.v === state.week; })[0] || {}).label || '';

      var h = '<div class="eyebrow">// ' + state.season + ' · ' + esc(wLabel) + '</div><h1>This week’s games</h1>' +
        '<p class="lede">Every game gets a projected score, win odds and a model line. A pick only appears when the ratings disagree with Vegas by ' + state.settings.edgeMin + ' or more points. Tap a game for the full breakdown.</p>';
      h += '<div class="toolbar">' +
        '<div class="fld"><label class="f" for="fSeason">Season</label><select id="fSeason">' + seasonOptions(state.season) + '</select></div>' +
        '<div class="fld"><label class="f" for="fWeek">Week</label><select id="fWeek">' + wl.map(function (w) { return '<option value="' + w.v + '"' + (w.v === state.week ? ' selected' : '') + '>' + esc(w.label) + '</option>'; }).join('') + '</select></div>' +
        '<div class="fld"><label class="f" for="fConf">Conference</label><select id="fConf"><option value="">All</option>' + Object.keys(confs).sort().map(function (c) { return '<option' + (c === F.conf ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') + '</select></div>' +
        '<div class="fld grow"><label class="f" for="fQ">Team</label><input id="fQ" type="search" placeholder="Search a team" value="' + esc(F.q) + '"></div>' +
        '<div class="fld sortfld"><label class="f">Sort</label><div class="seg" id="fSort">' + [['time', 'Kickoff'], ['edge', 'Edge'], ['sure', 'Surest']].map(function (s) { return '<button type="button" data-v="' + s[0] + '" class="' + (F.sort === s[0] ? 'on' : '') + '">' + s[1] + '</button>'; }).join('') + '</div></div>' +
        '</div><div class="toolbar" style="margin-top:-6px"><label class="check"><input type="checkbox" id="fFbs"' + (F.fbsOnly ? ' checked' : '') + '> FBS vs FBS only</label>' +
        '<label class="check"><input type="checkbox" id="fPicks"' + (F.picksOnly ? ' checked' : '') + '> Picks only</label>' +
        '<span style="flex:1"></span><button class="btn small" id="refresh" type="button">Refresh data</button></div>';
      h += '<div class="kpis">' + kpi('Games', String(shown.length), all.length !== shown.length ? all.length + ' before filters' : 'This week') +
        kpi('Model picks', String(picks.length), 'Off the line by ' + state.settings.edgeMin + '+ pts') +
        kpi('High confidence', String(high.length), 'Big gap and the ratings agree') +
        (done.length ? kpi('Winners called', su + '–' + (done.length - su), (atsW + atsL ? 'Picks ' + atsW + '–' + atsL + ' vs line. ' : '') + 'Hindsight, see Track record') : kpi('Second opinion', state.second ? 'gmalbert' : 'Off', state.second ? 'Their picks show as dashed chips' : 'Turn on in Settings')) + '</div>';
      if (state.errors[state.season] && state.errors[state.season].length) h += '<div class="note">Some data did not load, so those signals are skipped: ' + esc(state.errors[state.season].join('; ')) + '</div>';
      if (done.length && state.season === currentSeason()) h += '<div class="note info">Finished games are scored with today’s ratings, which already include those results. The Track record tab is the honest test.</div>';
      h += shown.length ? '<div class="games">' + shown.map(function (it) { return card(it.g, it.p); }).join('') + '</div>' : '<div class="empty">No games match these filters.</div>';
      view.innerHTML = h;

      $('#fSeason').addEventListener('change', function () { state.season = +this.value; state.week = null; renderSlate(); });
      $('#fWeek').addEventListener('change', function () { state.week = this.value; renderSlate(); });
      $('#fConf').addEventListener('change', function () { F.conf = this.value; renderSlate(); });
      $('#fFbs').addEventListener('change', function () { F.fbsOnly = this.checked; renderSlate(); });
      $('#fPicks').addEventListener('change', function () { F.picksOnly = this.checked; renderSlate(); });
      $$('#fSort button').forEach(function (b) { b.addEventListener('click', function () { F.sort = b.getAttribute('data-v'); renderSlate(); }); });
      var qt; $('#fQ').addEventListener('input', function () { var v = this.value; clearTimeout(qt); qt = setTimeout(function () { F.q = v; renderSlate(); var q = $('#fQ'); q.focus(); q.setSelectionRange(v.length, v.length); }, 200); });
      $('#refresh').addEventListener('click', function () {
        delete state.ctx[state.season]; loadingView('Refreshing…');
        Promise.all([loadSeason(state.season, true), loadSecond(true)]).then(renderSlate, errorView);
      });
      $$('.game').forEach(function (el) { el.addEventListener('click', function () { openGame(+el.getAttribute('data-id')); }); });
    });
  }

  function card(g, p) {
    var final = g.completed && g.homePoints != null, wp = p.homeWP == null ? .5 : p.homeWP;
    var H = state.ctx[state.season].teams[g.homeTeam] || {}, A = state.ctx[state.season].teams[g.awayTeam] || {};
    function rank(t) { return t.spRank ? '<small>SP+ #' + t.spRank + '</small>' : (t.cls === 'fcs' ? '<small>FCS</small>' : ''); }
    var tags = [g.neutralSite ? 'Neutral' : null, g.conferenceGame ? 'Conference' : null].filter(Boolean).join(' · ');
    var res = atsResult(p, g);
    var chips = '';
    if (p.pick) chips += '<span class="chip pick">Pick: ' + esc(pickText(p, g)) + '</span>' + tierChip(p.tier);
    else if (p.edge != null) chips += '<span class="chip">No edge · ' + f1(Math.abs(p.edge)) + ' pts off</span>';
    else chips += '<span class="chip">No line yet</span>';
    if (res) chips += '<span class="chip ' + res + '">' + (res === 'W' ? 'Covered' : res === 'L' ? 'Missed' : 'Push') + '</span>';
    if (final && g.homePoints !== g.awayPoints) {
      var right = (p.margin > 0) === (g.homePoints > g.awayPoints);
      chips += '<span class="chip ' + (right ? 'W' : 'L') + '">' + (right ? 'Winner right' : 'Winner wrong') + '</span>';
    }
    (secondFor(g) || []).forEach(function (b) { chips += '<span class="chip second" data-tip="' + esc('<b>gmalbert model v2.2</b><br>' + esc(b.pick) + ' · ' + esc(b.tier) + '<br>' + pct(b.prob) + ' chance, edge ' + f1(b.edge)) + '">gmalbert: ' + esc(b.pick) + '</span>'; });
    return '<button class="game" type="button" data-id="' + g.id + '" aria-label="' + esc(g.awayTeam + ' at ' + g.homeTeam + ', details') + '">' +
      '<div class="meta"><span>' + esc(kickoff(g)) + '</span><span>' + esc(final ? 'Final' + (tags ? ' · ' + tags : '') : tags) + '</span></div>' +
      '<div class="team-row"><i class="sw" style="background:var(--away)"></i><div class="nm">' + esc(g.awayTeam) + rank(A) + '</div><div class="pts' + (final ? ' final' : '') + '">' + (final ? g.awayPoints : Math.round(p.awayPts)) + '</div></div>' +
      '<div class="team-row"><i class="sw" style="background:var(--home)"></i><div class="nm">' + esc(g.homeTeam) + rank(H) + '</div><div class="pts' + (final ? ' final' : '') + '">' + (final ? g.homePoints : Math.round(p.homePts)) + '</div></div>' +
      '<div class="wpbar" aria-hidden="true"><i style="width:' + ((1 - wp) * 100) + '%;background:var(--away)"></i><i style="width:' + (wp * 100) + '%;background:var(--home)"></i></div>' +
      '<div class="wplab"><span>' + pct(1 - wp) + ' win</span><span>' + pct(wp) + ' win</span></div>' +
      '<div class="lines"><div><div class="k">Vegas</div><div class="val">' + esc(p.market ? lineText(p.market.spread, g.homeTeam, g.awayTeam) : 'No line yet') + (p.market && p.market.total != null ? ' · ' + p.market.total : '') + '</div></div>' +
      '<div><div class="k">Model</div><div class="val">' + esc(favText(p.margin, g.homeTeam, g.awayTeam)) + ' · ' + f1(p.total) + '</div></div></div>' +
      '<div class="chips">' + chips + '</div></button>';
  }

  function openGame(id) {
    var ctx = state.ctx[state.season], g = ctx.games.filter(function (x) { return x.id === id; })[0];
    if (!g) return;
    var p = predictGame(g, ctx);
    openSheet('<div class="eyebrow">// ' + esc(kickoff(g)) + (g.venue ? ' · ' + esc(g.venue) : '') + '</div><h2 id="sheetTitle" style="margin:6px 0 0">' + esc(g.awayTeam) + ' at ' + esc(g.homeTeam) + '</h2>' +
      (g.notes ? '<p class="small soft">' + esc(g.notes) + '</p>' : '') + predictionBlock(g, p) +
      '<p style="margin-top:18px" class="row-btns"><button class="btn small" id="toProps">Player props for this game</button> <button class="btn small" id="toMatchup">Open in Matchup to try a different line</button></p>');
    $('#toProps').addEventListener('click', function () { state.props.gid = g.id; store.set('propsGid', g.id); closeSheet(); location.hash = '#props'; });
    $('#toMatchup').addEventListener('click', function () {
      state.matchup = { home: g.homeTeam, away: g.awayTeam, neutral: !!g.neutralSite, line: p.market && p.market.spread != null ? String(p.market.spread) : '' };
      store.set('matchup', state.matchup); closeSheet(); location.hash = '#matchup';
    });
  }

  function renderMatchup() {
    var year = currentSeason();
    withSeason(year, function (ctx) {
      var S = state.matchup, names = Object.keys(ctx.teams).filter(function (n) { var t = ctx.teams[n]; return t.sp != null || t.elo != null || t.power != null; });
      var fbs = names.filter(function (n) { return ctx.teams[n].cls === 'fbs' || ctx.teams[n].sp != null; }).sort();
      var other = names.filter(function (n) { return fbs.indexOf(n) < 0; }).sort();
      function opts(sel) {
        return '<optgroup label="FBS">' + fbs.map(function (n) { return '<option' + (n === sel ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('') + '</optgroup>' +
          (other.length ? '<optgroup label="FCS and others">' + other.map(function (n) { return '<option' + (n === sel ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('') + '</optgroup>' : '');
      }
      if (names.indexOf(S.home) < 0) S.home = fbs[0]; if (names.indexOf(S.away) < 0) S.away = fbs[1];
      var h = '<div class="eyebrow">// ' + year + ' · Any two teams</div><h1>Matchup</h1><p class="lede">Pick any two teams and where they play. Add a line to see which side the model would take.</p>' +
        '<div class="toolbar"><div class="fld grow"><label class="f" for="mAway">Away team</label><select id="mAway">' + opts(S.away) + '</select></div>' +
        '<div class="fld" style="min-width:auto;justify-content:flex-end"><button class="btn" id="mSwap" type="button" aria-label="Swap teams">⇄ Swap</button></div>' +
        '<div class="fld grow"><label class="f" for="mHome">Home team</label><select id="mHome">' + opts(S.home) + '</select></div>' +
        '<div class="fld"><label class="f" for="mLine">Home team’s line</label><input id="mLine" type="text" inputmode="decimal" placeholder="e.g. -7.5" value="' + esc(S.line) + '"></div>' +
        '</div><div class="toolbar" style="margin-top:-6px"><label class="check"><input type="checkbox" id="mNeutral"' + (S.neutral ? ' checked' : '') + '> Neutral site</label></div>';
      var game = { id: -1, season: year, homeTeam: S.home, awayTeam: S.away, neutralSite: !!S.neutral, completed: false };
      var ln = parseFloat(String(S.line).replace('−', '-'));
      var market = isFinite(ln) ? { spread: ln, margin: -ln, total: null, books: ['Your line'], spreadOpen: null, homeWP: null } : null;
      var p = M.predict(game, ctx, { market: market });
      h += S.home === S.away ? '<div class="empty">Pick two different teams.</div>' : '<div class="panel">' + predictionBlock(game, p) + '</div>';
      view.innerHTML = h;
      function upd() {
        S.away = $('#mAway').value; S.home = $('#mHome').value; S.neutral = $('#mNeutral').checked; S.line = $('#mLine').value.trim();
        store.set('matchup', S); renderMatchup();
      }
      ['#mAway', '#mHome', '#mNeutral'].forEach(function (s) { $(s).addEventListener('change', upd); });
      $('#mLine').addEventListener('change', upd);
      $('#mSwap').addEventListener('click', function () { var t = S.home; S.home = S.away; S.away = t; S.line = S.line ? String(-parseFloat(S.line)) : ''; store.set('matchup', S); renderMatchup(); });
    });
  }

  function renderRatings() {
    var year = state.season;
    withSeason(year, function (ctx) {
      var o = ctx.opts, w = state.settings.weights;
      var fbsElos = Object.keys(ctx.teams).map(function (n) { return ctx.teams[n]; }).filter(function (t) { return t.sp != null && t.elo != null; }).map(function (t) { return t.elo; });
      var eloMean = fbsElos.length ? fbsElos.reduce(function (a, b) { return a + b; }, 0) / fbsElos.length : 1500;
      var rows = Object.keys(ctx.teams).map(function (n) {
        var t = ctx.teams[n], s = 0, ws = 0;
        var vals = { sp: t.sp, fpi: t.fpi, srs: t.srs, power: t.power, epa: t.epaR, talent: t.talentR, elo: t.elo != null ? (t.elo - eloMean) / o.eloPerPt : null };
        Object.keys(vals).forEach(function (k) { if (vals[k] != null && (+w[k] || 0) > 0) { s += vals[k] * w[k]; ws += +w[k]; } });
        return { name: n, conf: t.conf || '', fbs: t.cls === 'fbs' || t.sp != null, overall: ws ? s / ws : null, sp: t.sp, off: t.spOff, def: t.spDef, fpi: t.fpi, srs: t.srs, elo: t.elo, power: t.power, epa: t.epaNet, talent: t.talent };
      }).filter(function (r) { return r.overall != null; });
      var confs = {}; rows.forEach(function (r) { if (r.fbs && r.conf) confs[r.conf] = 1; });
      var R = state.rsort;
      var shown = rows.filter(function (r) { return (!state.rfbs || r.fbs) && (!state.rconf || r.conf === state.rconf) && (!state.rq || r.name.toLowerCase().indexOf(state.rq.toLowerCase()) >= 0); });
      var ranked = rows.filter(function (r) { return r.fbs; }).sort(function (a, b) { return b.overall - a.overall; });
      var rankOf = {}; ranked.forEach(function (r, i) { rankOf[r.name] = i + 1; });
      shown.sort(function (a, b) {
        var x = a[R.k], y = b[R.k];
        if (R.k === 'name' || R.k === 'conf') return R.dir * String(x).localeCompare(String(y));
        if (x == null) return 1; if (y == null) return -1;
        return R.dir * (x - y);
      });
      var cols = [['rank', '#', 'l'], ['name', 'Team', 'l'], ['conf', 'Conf', 'l hide-sm'], ['overall', 'Overall'], ['sp', 'SP+'], ['off', 'Off'], ['def', 'Def'], ['fpi', 'FPI'], ['srs', 'SRS'], ['elo', 'Elo'], ['power', 'WD power'], ['epa', 'EPA/play'], ['talent', 'Talent']];
      var tips = { overall: 'Weighted blend of every rating, in points better than an average FBS team', def: 'SP+ points allowed: lower is better', epa: 'Offense minus defense expected points added per play', power: 'In-house rating from game margins, adjusted for opponent' };
      var h = '<div class="eyebrow">// ' + year + ' · Power ratings</div><h1>Team ratings</h1><p class="lede">Every rating on one table. “Overall” blends them with your Settings weights, in points better than an average FBS team on a neutral field.</p>' +
        '<div class="toolbar"><div class="fld"><label class="f" for="rSeason">Season</label><select id="rSeason">' + seasonOptions(year) + '</select></div>' +
        '<div class="fld"><label class="f" for="rConf">Conference</label><select id="rConf"><option value="">All</option>' + Object.keys(confs).sort().map(function (c) { return '<option' + (c === state.rconf ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') + '</select></div>' +
        '<div class="fld grow"><label class="f" for="rQ">Team</label><input id="rQ" type="search" placeholder="Search a team" value="' + esc(state.rq) + '"></div>' +
        '<label class="check"><input type="checkbox" id="rFbs"' + (state.rfbs ? ' checked' : '') + '> FBS only</label></div>';
      h += '<div class="tbl-wrap"><table><thead><tr>' + cols.map(function (c) {
        var sortable = c[0] !== 'rank';
        return '<th class="' + (c[2] || '') + (sortable ? ' sort' : '') + (R.k === c[0] ? ' on' : '') + '"' + (sortable ? ' data-k="' + c[0] + '" tabindex="0" role="button" aria-sort="' + (R.k === c[0] ? (R.dir < 0 ? 'descending' : 'ascending') : 'none') + '"' : '') + (tips[c[0]] ? ' data-tip="' + esc(tips[c[0]]) + '"' : '') + '>' + c[1] + (R.k === c[0] ? (R.dir < 0 ? ' ↓' : ' ↑') : '') + '</th>';
      }).join('') + '</tr></thead><tbody>' + shown.map(function (r) {
        function n(v, d) { return v == null ? '<td class="num muted">–</td>' : '<td class="num">' + v.toFixed(d) + '</td>'; }
        return '<tr><td class="num muted">' + (rankOf[r.name] || '') + '</td><td class="l"><b>' + esc(r.name) + '</b></td><td class="l soft hide-sm">' + esc(r.conf) + '</td>' +
          '<td class="num ' + (r.overall >= 0 ? 'pos' : 'neg') + '">' + (r.overall > 0 ? '+' : r.overall < 0 ? '−' : '') + Math.abs(r.overall).toFixed(1) + '</td>' +
          n(r.sp, 1) + n(r.off, 1) + n(r.def, 1) + n(r.fpi, 1) + n(r.srs, 1) + n(r.elo, 0) + n(r.power, 1) + n(r.epa, 2) + n(r.talent, 0) + '</tr>';
      }).join('') + '</tbody></table></div><p class="small muted" style="margin-top:10px">' + shown.length + ' teams. Click a column to sort.</p>';
      view.innerHTML = h;
      $('#rSeason').addEventListener('change', function () { state.season = +this.value; state.week = null; renderRatings(); });
      $('#rConf').addEventListener('change', function () { state.rconf = this.value; renderRatings(); });
      $('#rFbs').addEventListener('change', function () { state.rfbs = this.checked; renderRatings(); });
      var qt; $('#rQ').addEventListener('input', function () { var v = this.value; clearTimeout(qt); qt = setTimeout(function () { state.rq = v; renderRatings(); var q = $('#rQ'); q.focus(); q.setSelectionRange(v.length, v.length); }, 200); });
      $$('th.sort').forEach(function (th) {
        function go() { var k = th.getAttribute('data-k'); if (R.k === k) R.dir = -R.dir; else { R.k = k; R.dir = (k === 'name' || k === 'conf' || k === 'def') ? 1 : -1; } renderRatings(); }
        th.addEventListener('click', go); th.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      });
    });
  }

  function lineChart(byWeek) {
    var pts = byWeek.filter(function (w) { return w.n > 0; });
    if (pts.length < 2) return '<p class="soft">Not enough finished weeks for a chart yet.</p>';
    var W = 760, H = 250, padL = 44, padR = 96, padT = 14, padB = 30;
    var ys = pts.map(function (w) { return w.model / w.n; }).concat(pts.map(function (w) { return w.market / w.n; }));
    var lo = Math.max(0, Math.floor(Math.min.apply(null, ys) * 10) / 10 - 0.05), hi = Math.min(1, Math.ceil(Math.max.apply(null, ys) * 10) / 10);
    function X(i) { return padL + (W - padL - padR) * (pts.length === 1 ? 0.5 : i / (pts.length - 1)); }
    function Y(v) { return padT + (H - padT - padB) * (1 - (v - lo) / (hi - lo || 1)); }
    var grid = '';
    for (var g = Math.ceil(lo * 10); g <= Math.floor(hi * 10); g++) { var y = Y(g / 10); grid += '<line class="gl" x1="' + padL + '" x2="' + (W - padR) + '" y1="' + y + '" y2="' + y + '"/><text class="ax" x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + (g * 10) + '%</text>'; }
    var xl = pts.map(function (w, i) { return (pts.length > 10 && i % 2) ? '' : '<text class="ax" x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle">W' + w.week + '</text>'; }).join('');
    function series(key, color) {
      var d = pts.map(function (w, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(w[key] / w.n).toFixed(1); }).join(' ');
      var dots = pts.map(function (w, i) { return '<circle cx="' + X(i) + '" cy="' + Y(w[key] / w.n) + '" r="4" fill="' + color + '" stroke="#0E0E1C" stroke-width="2"/>'; }).join('');
      return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' + dots;
    }
    var last = pts[pts.length - 1], li = pts.length - 1;
    var ym = Y(last.model / last.n), yv = Y(last.market / last.n);
    if (Math.abs(ym - yv) < 16) { if (ym < yv) { ym -= 8; yv += 8; } else { ym += 8; yv -= 8; } }
    var labels = '<text x="' + (X(li) + 10) + '" y="' + (ym + 4) + '" fill="#fff" font-size="12" font-family="Inter">Model ' + pct(last.model / last.n) + '</text>' +
      '<text x="' + (X(li) + 10) + '" y="' + (yv + 4) + '" fill="#fff" font-size="12" font-family="Inter">Vegas ' + pct(last.market / last.n) + '</text>';
    var colW = (W - padL - padR) / Math.max(1, pts.length - 1);
    var hits = pts.map(function (w, i) {
      var t = '<b>Week ' + w.week + '</b> · ' + w.n + ' games<br>Model picked ' + w.model + ' winners (' + pct(w.model / w.n) + ')<br>Vegas picked ' + w.market + ' (' + pct(w.market / w.n) + ')' + (w.atsW + w.atsL ? '<br>Model vs line: ' + w.atsW + '–' + w.atsL : '');
      return '<rect x="' + (X(i) - colW / 2) + '" y="' + padT + '" width="' + colW + '" height="' + (H - padT - padB) + '" fill="transparent" data-tip="' + esc(t) + '"/>';
    }).join('');
    return '<div class="comp-legend"><span><i style="background:var(--home)"></i>Model (no Vegas input)</span><span><i style="background:var(--away)"></i>Vegas line</span></div>' +
      '<div class="lc"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Share of winners picked each week, model versus Vegas">' + grid + xl + series('market', 'var(--away)') + series('model', 'var(--home)') + labels + hits + '</svg></div>';
  }

  function renderBacktest() {
    var year = state.btSeason;
    withSeason(year, function (ctx) {
      var b = M.backtest(ctx, state.settings), s = b.stats, a = b.ats;
      var atsPct = a.w + a.l ? a.w / (a.w + a.l) : null;
      var h = '<div class="eyebrow">// ' + year + ' · Walk-forward test</div><h1>Track record</h1>' +
        '<p class="lede">Each finished game is re-predicted using only what was known before kickoff: the Vegas line, pregame Elo, roster talent and the WD power rating rebuilt from earlier weeks. SP+, FPI, SRS and EPA are left out here because CollegeFootballData only serves today’s values, which already know the results.</p>' +
        '<div class="toolbar"><div class="fld"><label class="f" for="bSeason">Season</label><select id="bSeason">' + seasonOptions(year) + '</select></div></div>';
      if (!s.model.n) { view.innerHTML = h + '<div class="empty">No finished games with lines yet this season.</div>'; bindBt(); return; }
      h += '<div class="kpis">' +
        kpi('Picks vs the line', a.w + '–' + a.l + (a.p ? '–' + a.p : ''), (atsPct == null ? '–' : pct(atsPct, 1)) + ' · profit needs 52.4%') +
        kpi('Winners picked', pct(s.model.suPct, 1), 'Vegas favorite won ' + pct(s.market.suPct, 1)) +
        kpi('Average miss', f1(s.model.mae) + ' pts', 'Vegas line missed by ' + f1(s.market.mae)) +
        kpi('Games tested', String(s.model.n), 'Finished games with a line') + '</div>';
      h += '<div class="note">' + (atsPct != null && atsPct >= 0.524 ? 'The model is above break-even so far, but ' + (a.w + a.l) + ' picks is a small sample. Treat it as a hot streak until it holds for a full season.' :
        'The model does not beat the Vegas line in this test. Every repo this page draws on reports the same thing: the closing line is very hard to beat. Use the picks as a second look, not as betting advice.') + '</div>';
      var lab = { market: 'Vegas line', power: 'WD power', elo: 'Elo', talent: 'Talent', model: 'Model blend (no Vegas)' };
      h += '<div class="grid2"><div><h2>Each signal on the same ' + s.model.n + ' games</h2><div class="tbl-wrap"><table><thead><tr><th>Signal</th><th>Winners</th><th data-tip="Average points between predicted and actual margin">Avg miss</th><th data-tip="Lower is better. 0.25 is a coin flip">Brier</th></tr></thead><tbody>' +
        ['market', 'model', 'power', 'elo', 'talent'].map(function (k) { var x = s[k]; return '<tr><td class="l"><b>' + lab[k] + '</b></td><td class="num">' + pct(x.suPct, 1) + '</td><td class="num">' + f1(x.mae) + '</td><td class="num">' + (x.brierAvg == null ? '–' : x.brierAvg.toFixed(3)) + '</td></tr>'; }).join('') +
        '</tbody></table></div></div>';
      h += '<div><h2>Hit rate by size of disagreement</h2><div class="tbl-wrap"><table><thead><tr><th>Model vs line</th><th>Record</th><th>Hit rate</th></tr></thead><tbody>' +
        b.buckets.map(function (x) { var n = x.w + x.l, r = n ? x.w / n : null; return '<tr><td class="l">' + (x.hi > 100 ? x.lo + '+ pts' : x.lo + '–' + x.hi + ' pts') + '</td><td class="num">' + x.w + '–' + x.l + (x.p ? '–' + x.p : '') + '</td><td class="num ' + (r == null ? '' : r >= 0.524 ? 'pos' : 'neg') + '">' + pct(r, 1) + '</td></tr>'; }).join('') +
        '</tbody></table></div><p class="small muted" style="margin-top:8px">Picks count once the gap reaches ' + state.settings.edgeMin + ' points. Change that in Settings.</p></div></div>';
      h += '<h2>Winners picked, week by week</h2><div class="panel">' + lineChart(b.byWeek) + '</div>';
      var recent = b.rows.filter(function (r) { return r.result; }).slice(-25).reverse();
      if (recent.length) h += '<h2>Latest graded picks</h2><div class="tbl-wrap"><table><thead><tr><th>Week</th><th class="l">Game</th><th class="l">Model pick</th><th>Winner</th><th>Result</th></tr></thead><tbody>' +
        recent.map(function (r) {
          var side = r.edge > 0 ? r.home + ' ' + signed(-r.market) : r.away + ' ' + signed(r.market);
          return '<tr><td class="num">' + r.week + '</td><td class="l">' + esc(r.away) + ' at ' + esc(r.home) + '</td><td class="l">' + esc(side) + '</td><td class="num">' + esc(r.actual === 0 ? 'Tie' : (r.actual > 0 ? r.home : r.away) + ' by ' + Math.abs(r.actual)) + '</td><td class="num ' + (r.result === 'W' ? 'pos' : r.result === 'L' ? 'neg' : '') + '">' + (r.result === 'W' ? 'Win' : r.result === 'L' ? 'Loss' : 'Push') + '</td></tr>';
        }).join('') + '</tbody></table></div>';
      view.innerHTML = h; bindBt();
    });
    function bindBt() { var s = $('#bSeason'); if (s) s.addEventListener('change', function () { state.btSeason = +this.value; renderBacktest(); }); }
  }

  function renderSettings() {
    var S = state.settings, has = !!getKey();
    var size = 0; store.keys().forEach(function (k) { try { size += (localStorage.getItem(LS + k) || '').length; } catch (e) { } });
    var h = '<div class="eyebrow">// Settings</div><h1>Settings</h1><p class="lede">Saved in this browser only.</p><div class="grid2">';
    h += '<div class="panel"><h3>Data key</h3><p class="soft small">' + (has ? 'A CollegeFootballData key is saved in this browser.' : 'No key saved yet.') + ' The free tier allows 1,000 calls a month. A full refresh uses 7, and data is cached for hours, so normal use stays far below that.</p>' +
      '<form id="keyForm" class="keybox" autocomplete="off"><input id="keyIn" type="password" autocomplete="new-password" placeholder="' + (has ? 'Paste a new key to replace it' : 'Paste API key') + '" aria-label="API key"><button class="btn primary" type="submit">Save</button>' + (has ? '<button class="btn" type="button" id="keyDel">Remove</button>' : '') + '</form>' +
      '<p class="small soft" style="margin-top:12px">Calls from this browser this month: <b>' + usage() + '</b> · cached data ' + (size / 1024 / 1024).toFixed(1) + ' MB</p>' +
      '<div class="keybox"><button class="btn small" id="clearCache" type="button">Clear cached data</button></div><p class="err" id="keyErr"></p></div>';
    h += '<div class="panel"><h3>Signal weights</h3><p class="soft small">How much each signal counts in the blend. Set one to 0 to switch it off. Picks compare the blend <em>without</em> Vegas against the line.</p>' +
      M.COMPONENTS.map(function (c) { return '<div class="wrow"><label for="w_' + c.key + '" data-tip="' + esc(c.src) + '">' + esc(c.label) + '</label><input type="range" min="0" max="50" step="1" id="w_' + c.key + '" value="' + S.weights[c.key] + '"><span class="wv" id="wv_' + c.key + '">' + S.weights[c.key] + '</span></div>'; }).join('') + '</div>';
    h += '<div class="panel"><h3>Model tuning</h3>' +
      num('edgeMin', 'Points off the line before a pick', 0.5, 'Raise it for fewer, stronger picks.') +
      num('hfa', 'Home-field advantage (points)', 0.5, 'Not applied at neutral sites.') +
      num('sigma', 'Spread of outcomes (points)', 0.5, 'Turns a margin into win odds. Vegas misses by about 15.') +
      num('eloPerPt', 'Elo points per point of margin', 1, 'Fit on 2025 results: 23.') +
      num('propEdge', 'Prop value threshold (EV %)', 0.5, 'A prop is tagged Value when its expected value is at least this.') +
      '<label class="check" style="margin-top:8px"><input type="checkbox" id="second"' + (S.second ? ' checked' : '') + '> Show gmalbert’s published picks as a second opinion</label>' +
      '<div class="keybox" style="margin-top:12px"><button class="btn small" id="resetDefaults" type="button">Reset to defaults</button></div></div>';
    h += '<div class="panel"><h3>Where this comes from</h3><ul class="credits small">' +
      '<li><b><a href="https://github.com/CFBD/cfbd-python" target="_blank" rel="noopener">CFBD/cfbd-python</a></b>: the same CollegeFootballData API, called straight from this page.</li>' +
      '<li><b><a href="https://github.com/zachringnight/cfbmodel" target="_blank" rel="noopener">zachringnight/cfbmodel</a></b>: blending Elo, SP+, FPI and SRS, and confidence tiers from how much the signals agree.</li>' +
      '<li><b><a href="https://github.com/blaizerlahman/CFB-Model" target="_blank" rel="noopener">blaizerlahman/CFB-Model</a></b>: predicting the margin from team strength, talent and SP+, and the hit rate by size of disagreement with Vegas.</li>' +
      '<li><b><a href="https://github.com/sportsdataverse/cfbfastR" target="_blank" rel="noopener">sportsdataverse/cfbfastR</a></b>: play-by-play efficiency (EPA per play) as a strength signal.</li>' +
      '<li><b><a href="https://github.com/gmalbert/college-football-predictions" target="_blank" rel="noopener">gmalbert/college-football-predictions</a></b>: using the market as the anchor, removing the bookmaker margin from moneylines, walk-forward testing, and its daily published picks.</li>' +
      '<li><b><a href="https://github.com/LeSingh1/edge-ncaaf" target="_blank" rel="noopener">LeSingh1/edge-ncaaf</a></b>: player props from a recency-weighted game log, line to over-probability, quarter-Kelly sizing. Its calibrator is not used because it was trained on made-up lines.</li>' +
      '<li><b><a href="https://github.com/fongster87/CFB-Player-Betting" target="_blank" rel="noopener">fongster87/CFB-Player-Betting</a></b>: adjusting passing, rushing and receiving yards for the opponent’s defense and the game script.</li>' +
      '<li><b><a href="https://github.com/popcawn/cfb-td-predictor" target="_blank" rel="noopener">popcawn/cfb-td-predictor</a></b>: anytime-TD odds from the Vegas-implied total, split by carries and catches with shrunk TD rates.</li>' +
      '</ul><p class="small muted">Ideas were rebuilt in JavaScript. No code was copied. ' + (state.secondMeta ? 'gmalbert picks file: model ' + esc(state.secondMeta.model_version) + ', release status “' + esc(state.secondMeta.release_status) + '”, updated ' + esc(new Date(state.secondMeta.generated_at).toLocaleString('en-US')) + '.' : '') + '</p></div>';
    h += '</div>';
    view.innerHTML = h;
    function num(k, label, step, hint) { return '<div style="margin-bottom:12px"><label class="f" for="n_' + k + '">' + esc(label) + '</label><input type="number" id="n_' + k + '" step="' + step + '" value="' + S[k] + '"><div class="small muted" style="margin-top:4px">' + esc(hint) + '</div></div>'; }
    $('#keyForm').addEventListener('submit', function (e) {
      e.preventDefault(); var k = $('#keyIn').value.trim().replace(/^Bearer\s+/i, ''); if (!k) return;
      if (!store.set('key', k)) mem.key = k; state.ctx = {}; state.raw = {};
      $('#keyErr').textContent = 'Saved. Testing…';
      loadSeason(currentSeason(), true).then(function () { $('#keyErr').textContent = 'Key works. Data loaded.'; }, function (err) { $('#keyErr').textContent = err.message === 'BAD_KEY' ? 'CollegeFootballData rejected that key.' : err.message; });
    });
    if ($('#keyDel')) $('#keyDel').addEventListener('click', function () { store.del('key'); delete mem.key; renderSettings(); });
    $('#clearCache').addEventListener('click', function () { store.keys().forEach(function (k) { if (k.indexOf('c:') === 0 || k === 'gm') store.del(k); }); mem = {}; state.ctx = {}; state.raw = {}; renderSettings(); });
    M.COMPONENTS.forEach(function (c) {
      var el = $('#w_' + c.key);
      el.addEventListener('input', function () { $('#wv_' + c.key).textContent = el.value; });
      el.addEventListener('change', function () { S.weights[c.key] = +el.value; saveSettings(); rebuildAll(); });
    });
    ['edgeMin', 'hfa', 'sigma', 'eloPerPt', 'propEdge'].forEach(function (k) {
      $('#n_' + k).addEventListener('change', function () { var v = parseFloat(this.value); if (isFinite(v) && v > 0 || (k === 'hfa' && v === 0)) { S[k] = v; saveSettings(); rebuildAll(); } });
    });
    $('#second').addEventListener('change', function () { S.second = this.checked; saveSettings(); if (S.second) loadSecond(); else { state.second = null; } });
    $('#resetDefaults').addEventListener('click', function () { var sec = S.second; state.settings = Object.assign({}, M.DEFAULTS, { weights: Object.assign({}, M.DEFAULTS.weights), second: sec, propEdge: 3 }); saveSettings(); rebuildAll(); renderSettings(); });
  }

  /* ---------- player props ---------- */
  var PR = window.CFBProps;
  var PROP_CAL = [ // walk-forward test on 2025 + 2026 FBS box scores (see props.js)
    ['Passing yards', '1,646', '30 / 51 / 70', '71 vs 73'],
    ['Passing TDs', '1,646', '31 / 47 / 64', '1.0 vs 1.1'],
    ['Rushing yards', '3,102', '32 / 52 / 71', '32 vs 33'],
    ['Receiving yards', '5,186', '35 / 54 / 71', '28 vs 29'],
    ['Receptions', '5,186', '26 / 52 / 74', '1.7 vs 1.8'],
    ['Rush + rec yards', '3,102', '32 / 53 / 71', '34 vs 35']
  ];
  var MARKETS = { QB: ['passYds', 'passTD', 'rushYds'], RB: ['rushYds', 'rushRec', 'rec'], WR: ['recYds', 'rec'] };
  state.props = { gid: store.get('propsGid', null), showAllTD: {} };

  function loadTeamBox(year, team) {
    return cfbd('games/players?year=' + year + '&team=' + encodeURIComponent(team) + '&seasonType=both', year >= currentSeason() ? 6 * HOUR : 30 * 24 * HOUR);
  }
  function propLines(gid) { return store.get('pl:' + gid, {}) || {}; }
  function savePropLine(gid, key, v) { var all = propLines(gid); if (v) all[key] = v; else delete all[key]; store.set('pl:' + gid, all); }
  function modelLine(proj) { return Math.floor(PR.quantile(proj, 0.5)) + 0.5; }
  function amText(am) { return am == null ? '–' : (am > 0 ? '+' : '') + am; }

  function playersFor(logs, team, before) {
    var tl = logs.teams[team]; if (!tl) return [];
    var tg = tl.games.filter(function (g) { return g.t < before; });
    if (!tg.length) return [];
    var recent = tg.slice(-3), lastGid = tg[tg.length - 1].gid;
    var out = [];
    Object.keys(logs.players).forEach(function (pid) {
      var p = logs.players[pid];
      var mine = p.games.filter(function (g) { return g.team === team && g.t < before; });
      if (!mine.length || p.team !== team) return;
      var a = { att: 0, car: 0, rec: 0 };
      recent.forEach(function (tgm) { var g = mine.filter(function (x) { return x.gid === tgm.gid; })[0]; if (g) { a.att += g.r[2]; a.car += g.r[6]; a.rec += g.r[9]; } });
      Object.keys(a).forEach(function (k) { a[k] /= recent.length; });
      var role = a.att >= 10 && a.att > a.car ? 'QB' : (a.car >= 5 && a.car >= a.rec ? 'RB' : (a.rec >= 1.5 ? 'WR' : null));
      if (!role) return;
      var last = mine.filter(function (g) { return g.gid === lastGid; })[0];
      out.push({ p: Object.assign({}, p, { games: mine }), role: role, use: role === 'QB' ? a.att : role === 'RB' ? a.car : a.rec, missedLast: !last });
    });
    var lim = { QB: 2, RB: 3, WR: 5 };
    return ['QB', 'RB', 'WR'].reduce(function (acc, r) {
      return acc.concat(out.filter(function (x) { return x.role === r; }).sort(function (x, y) { return y.use - x.use; }).slice(0, lim[r]));
    }, []);
  }

  function miniBars(proj, line, games) {
    var vals = proj.log.slice(-8), gs = games.slice(-8);
    if (!vals.length) return '';
    var max = Math.max.apply(null, vals.concat([line || 0, proj.mean, 1])) * 1.1, W = 160, H = 40, bw = W / 8;
    var ref = line != null ? line : modelLine(proj);
    var bars = vals.map(function (v, i) {
      var h = Math.max(2, Math.max(0, v) / max * H), x = i * bw + 2, over = v > ref;
      var g = gs[i], tip = (g ? 'Wk ' + g.week + ' vs ' + esc(g.opp) + ': ' : '') + '<b>' + v + '</b>';
      return '<rect x="' + x + '" y="' + (H - h) + '" width="' + (bw - 4) + '" height="' + h + '" rx="2" fill="' + (over ? 'var(--indigo)' : '#4b4b63') + '"/><rect x="' + (i * bw) + '" y="0" width="' + bw + '" height="' + H + '" fill="transparent" data-tip="' + esc(tip) + '"/>';
    }).join('');
    var ly = H - ref / max * H;
    return '<svg class="mini" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Last ' + vals.length + ' games: ' + vals.join(', ') + '">' + bars +
      '<line x1="0" x2="' + W + '" y1="' + ly + '" y2="' + ly + '" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/></svg>';
  }

  function propResult(proj, v, actual) {
    if (!v || v.line === '' || v.line == null || !isFinite(+v.line)) return '<span class="muted">Type the book’s line to get odds. Model’s even line: <b>' + modelLine(proj) + '</b></span>';
    var line = +v.line, odds = isFinite(+v.odds) && Math.abs(+v.odds) >= 100 ? +v.odds : -110;
    var pr = PR.probs(proj, line), side = pr.over >= pr.under ? 'over' : 'under', pw = pr[side], pl = side === 'over' ? pr.under : pr.over;
    var dec = PR.amToDec(odds), evv = pw * (dec - 1) - pl, kel = Math.max(0, evv / (dec - 1)) * 0.25;
    var thr = (state.settings.propEdge || 3) / 100, value = evv >= thr;
    var h = '<span class="pp"><b>Over ' + pct(pr.over) + '</b> · Under ' + pct(pr.under) + (pr.push > 0.005 ? ' · Push ' + pct(pr.push) : '') + '</span> ' +
      '<span class="chip ' + (value ? 'pick' : '') + '" data-tip="' + esc('Fair price for the ' + side + ': ' + amText(PR.probToAm(pw / (pw + pl))) + '<br>Expected value at ' + amText(odds) + ': ' + (evv * 100).toFixed(1) + '% per bet' + (kel > 0 ? '<br>Quarter-Kelly: ' + (kel * 100).toFixed(1) + '% of bankroll' : '')) + '">' +
      (value ? 'Value: ' + (side === 'over' ? 'Over ' : 'Under ') + line : 'No value') + ' · EV ' + (evv >= 0 ? '+' : '') + (evv * 100).toFixed(1) + '%</span>';
    if (actual != null) {
      var res = actual === line ? 'P' : ((actual > line) === (side === 'over') ? 'W' : 'L');
      h += ' <span class="chip ' + res + '">Actual ' + actual + '</span>';
    }
    return h;
  }

  function renderProps() {
    var year = currentSeason();
    withSeason(year, function (ctx) {
      if (!state.week || !weekList(ctx).some(function (w) { return w.v === state.week; })) state.week = defaultWeek(ctx);
      var games = gamesFor(ctx, state.week).slice().sort(function (a, b) {
        if (!!a.completed !== !!b.completed) return a.completed ? 1 : -1;
        return (a.startDate || '').localeCompare(b.startDate || '');
      });
      if (!games.length) { view.innerHTML = '<div class="empty">No games this week.</div>'; return; }
      var g = games.filter(function (x) { return x.id === state.props.gid; })[0] || games[0];
      state.props.gid = g.id; store.set('propsGid', g.id);
      var wl = weekList(ctx);
      var head = '<div class="eyebrow">// ' + year + ' · ' + esc((wl.filter(function (w) { return w.v === state.week; })[0] || {}).label || '') + ' · Player props</div><h1>Player props</h1>' +
        '<p class="lede">Pick a game, then type the line and price from your sportsbook. You get the model’s projection, the chance of the over, a fair price, and whether the bet is worth it.</p>' +
        '<div class="toolbar"><div class="fld"><label class="f" for="pWeek">Week</label><select id="pWeek">' + wl.map(function (w) { return '<option value="' + w.v + '"' + (w.v === state.week ? ' selected' : '') + '>' + esc(w.label) + '</option>'; }).join('') + '</select></div>' +
        '<div class="fld grow full"><label class="f" for="pGame">Game</label><select id="pGame">' + games.map(function (x) {
          return '<option value="' + x.id + '"' + (x.id === g.id ? ' selected' : '') + '>' + esc(x.awayTeam + ' at ' + x.homeTeam + ' · ' + (x.completed ? 'Final' : kickoff(x))) + '</option>';
        }).join('') + '</select></div></div>';
      view.innerHTML = head + '<div class="empty"><span class="spin" aria-hidden="true"></span> Loading box scores…</div>';
      bindTop();
      Promise.all([loadTeamBox(year, g.homeTeam), loadTeamBox(year, g.awayTeam)]).then(function (res) {
        if (currentView() !== 'props' || state.props.gid !== g.id) return;
        var seen = {}, box = [];
        res.forEach(function (arr) { (arr || []).forEach(function (b) { if (!seen[b.id]) { seen[b.id] = 1; box.push(b); } }); });
        var meta = {}; ctx.games.forEach(function (x) { meta[x.id] = x; });
        var logs = PR.buildLogs(box, meta);
        var before = g.startDate ? Date.parse(g.startDate) : Date.now();
        var mk = M.marketFromLines(ctx.lineById[g.id]);
        var im = mk && mk.spread != null && mk.total != null ? PR.implied(mk.spread, mk.total) : null;
        var lines = propLines(g.id);
        var html = head;
        if (g.completed) html += '<div class="note info">This game is final. Projections use only games before kickoff, and each row shows what actually happened.</div>';
        if (!im) html += '<div class="note">No Vegas line for this game yet, so projections skip the game-script adjustment and touchdown odds are unavailable.</div>';
        [[g.awayTeam, g.homeTeam, im && im.away, mk ? mk.spread : null], [g.homeTeam, g.awayTeam, im && im.home, mk ? -mk.spread : null]].forEach(function (side) {
          var team = side[0], opp = side[1], ip = side[2], fav = side[3];
          var list = playersFor(logs, team, before);
          html += '<h2>' + esc(team) + (ip != null ? ' <span class="soft small" style="font-weight:500">· Vegas-implied ' + f1(ip) + ' pts</span>' : '') + '</h2>';
          var ofP = PR.oppFactor(logs, opp, 'passYds', before, PR.P.league), ofR = PR.oppFactor(logs, opp, 'rushYds', before, PR.P.league);
          html += '<p class="small soft">' + esc(opp) + ' allows ' + pct(ofP) + ' of the average team’s passing yards and ' + pct(ofR) + ' of its rushing yards.</p>';
          if (!list.length) { html += '<div class="empty">No player history for ' + esc(team) + ' yet.</div>'; return; }
          html += '<div class="pcards">' + list.map(function (it) {
            var p = it.p, played = PR.gamesBefore(p, before);
            var actualG, allG = logs.players[p.id] ? logs.players[p.id].games : [];
            actualG = g.completed ? allG.filter(function (x) { return x.gid === g.id; })[0] : null;
            var rows = MARKETS[it.role].map(function (stat) {
              var proj = PR.project(p, stat, { logs: logs, before: before, opp: opp, impliedPts: ip, lg: PR.P.league });
              if (!proj || !proj.n) return '';
              var key = p.id + ':' + stat, v = lines[key] || {};
              var lo = PR.quantile(proj, 0.1), hi = PR.quantile(proj, 0.9);
              var actual = g.completed ? (actualG ? PR.statOf(actualG.r, stat) : null) : null;
              var dec = stat === 'passTD' || stat === 'rec' ? 1 : 0;
              return '<div class="prow" data-key="' + esc(key) + '" data-stat="' + stat + '" data-pid="' + esc(p.id) + '">' +
                '<div class="ptop"><span class="pm">' + esc(PR.P.stats[stat].label) + '</span><span class="pproj" data-tip="' + esc('Recent form ' + f1(proj.base) + ' × opponent ' + f1(Math.pow(proj.oppF, PR.P.stats[stat].opp)) + ' × game script ' + f1(Math.pow(Math.max(.3, proj.volF), PR.P.stats[stat].vol)) + ' × usual regression ' + (PR.P.stats[stat].cal || 1)) + '">' + proj.mean.toFixed(dec) + '</span></div>' +
                '<div class="pmid"><span class="small muted">Likely ' + Math.max(0, Math.round(lo)) + '–' + Math.round(hi) + '</span>' + miniBars(proj, v.line !== '' && v.line != null && isFinite(+v.line) ? +v.line : null, played) + '</div>' +
                '<div class="pin"><label>Line<input type="text" inputmode="decimal" class="pl-line" value="' + esc(v.line == null ? '' : v.line) + '" placeholder="' + modelLine(proj) + '"></label>' +
                '<label>Odds<input type="text" inputmode="numeric" class="pl-odds" value="' + esc(v.odds == null ? '' : v.odds) + '" placeholder="-110"></label></div>' +
                '<div class="pres">' + propResult(proj, v, actual) + '</div></div>';
            }).join('');
            var lastNote = it.missedLast ? '<span class="chip L">Missed last game</span>' : '';
            return '<div class="pcard"><div class="phead"><b>' + esc(p.name) + '</b><span class="chip">' + (it.role === 'WR' ? 'WR / TE' : it.role) + '</span><span class="small muted">' + played.length + ' games</span>' + lastNote + '</div>' + rows + '</div>';
          }).join('') + '</div>';
          // anytime TD
          if (ip != null) {
            var td = PR.tdTable(logs, team, ip, fav, before, PR.P.league).filter(function (r) { return r.p >= 0.01; });
            var showAll = state.props.showAllTD[team];
            var shown = showAll ? td : td.slice(0, 8);
            html += '<h3 style="margin-top:18px">Anytime touchdown · ' + esc(team) + '</h3><div class="tbl-wrap"><table class="tdt"><thead><tr><th class="l">Player</th><th>Chance</th><th>Fair odds</th><th>Book odds</th><th>EV</th>' + (g.completed ? '<th>Scored</th>' : '') + '</tr></thead><tbody>' +
              shown.map(function (r) {
                var key = r.id + ':td', v = lines[key] || {};
                var ag = g.completed ? (logs.players[r.id] ? logs.players[r.id].games.filter(function (x) { return x.gid === g.id; })[0] : null) : null;
                return '<tr data-key="' + esc(key) + '" data-p="' + r.p + '"><td class="l"><b>' + esc(r.name) + '</b>' + (r.idle ? ' <span class="small muted" data-tip="No touches or missed last game, scaled down">idle</span>' : '') + '</td><td class="num">' + pct(r.p, 1) + '</td><td class="num">' + amText(r.fair) + '</td>' +
                  '<td class="num"><input type="text" inputmode="numeric" class="td-odds" value="' + esc(v.odds == null ? '' : v.odds) + '" placeholder="+250" aria-label="Book odds for ' + esc(r.name) + '"></td><td class="num td-ev">' + tdEv(r.p, v.odds) + '</td>' +
                  (g.completed ? '<td class="num">' + (ag ? (ag.r[8] + ag.r[11] > 0 ? '<span class="pos">Yes</span>' : 'No') : '<span class="muted">DNP</span>') + '</td>' : '') + '</tr>';
              }).join('') + '</tbody></table></div>' +
              (td.length > 8 ? '<p><button class="btn small td-more" data-team="' + esc(team) + '">' + (showAll ? 'Show fewer' : 'Show all ' + td.length + ' players') + '</button></p>' : '');
          }
        });
        html += '<h2>How well it’s calibrated</h2><div class="panel"><p class="small soft">Every player game in 2025 and 2026 was re-predicted from earlier games only. Lines were placed where the model saw a 30%, 50% and 70% chance of the over. The middle column shows how often the over actually hit.</p>' +
          '<div class="tbl-wrap"><table><thead><tr><th class="l">Stat</th><th>Player games</th><th>Over hit at 30 / 50 / 70%</th><th data-tip="Average miss, model vs plain season average">Avg miss vs season avg</th></tr></thead><tbody>' +
          PROP_CAL.map(function (r) { return '<tr><td class="l">' + r[0] + '</td><td class="num">' + r[1] + '</td><td class="num">' + r[2] + '</td><td class="num">' + r[3] + '</td></tr>'; }).join('') +
          '</tbody></table></div><p class="small soft" style="margin-top:10px">Anytime TD: fit on 2025 and tested on 2026, it scored 8% better than guessing the average rate, about what the popcawn model reports. The probabilities are honest, but the projections are only a little sharper than a season average. Sportsbooks have the same data, so real value is rare. Treat a “Value” tag as a reason to look closer, not a lock.</p></div>';
        view.innerHTML = html; bindTop(); bindRows(g, logs, before, ctx);
      }, errorView);
    });
    function bindTop() {
      var w = $('#pWeek'), s = $('#pGame');
      if (w) w.addEventListener('change', function () { state.week = this.value; state.props.gid = null; renderProps(); });
      if (s) s.addEventListener('change', function () { state.props.gid = +this.value; renderProps(); });
    }
  }
  function tdEv(p, odds) {
    if (odds == null || odds === '' || !isFinite(+odds) || Math.abs(+odds) < 100) return '<span class="muted">–</span>';
    var e = PR.ev(p, +odds).ev, thr = (state.settings.propEdge || 3) / 100;
    return '<span class="' + (e >= thr ? 'pos' : e < 0 ? 'neg' : '') + '">' + (e >= 0 ? '+' : '') + (e * 100).toFixed(1) + '%</span>';
  }
  function bindRows(g, logs, before, ctx) {
    var mk = M.marketFromLines(ctx.lineById[g.id]);
    var im = mk && mk.spread != null && mk.total != null ? PR.implied(mk.spread, mk.total) : null;
    $$('.prow').forEach(function (row) {
      var key = row.getAttribute('data-key'), stat = row.getAttribute('data-stat'), pid = row.getAttribute('data-pid');
      var p = logs.players[pid], team = p.team, opp = team === g.homeTeam ? g.awayTeam : g.homeTeam;
      var ip = im ? (team === g.homeTeam ? im.home : im.away) : null;
      var mine = Object.assign({}, p, { games: p.games.filter(function (x) { return x.team === team; }) });
      var proj = PR.project(mine, stat, { logs: logs, before: before, opp: opp, impliedPts: ip, lg: PR.P.league });
      var ag = g.completed ? p.games.filter(function (x) { return x.gid === g.id; })[0] : null;
      var actual = g.completed ? (ag ? PR.statOf(ag.r, stat) : null) : null;
      var li = $('.pl-line', row), oi = $('.pl-odds', row), t;
      function upd() {
        var v = { line: li.value.trim().replace('−', '-'), odds: oi.value.trim().replace('−', '-') };
        savePropLine(g.id, key, (v.line || v.odds) ? v : null);
        $('.pres', row).innerHTML = propResult(proj, v, actual);
        var svg = $('svg.mini', row);
        if (svg) svg.outerHTML = miniBars(proj, v.line !== '' && isFinite(+v.line) ? +v.line : null, PR.gamesBefore(mine, before));
      }
      [li, oi].forEach(function (inp) { inp.addEventListener('input', function () { clearTimeout(t); t = setTimeout(upd, 250); }); });
    });
    $$('table.tdt tbody tr').forEach(function (tr) {
      var key = tr.getAttribute('data-key'), p = +tr.getAttribute('data-p'), inp = $('.td-odds', tr);
      inp.addEventListener('input', function () {
        var o = inp.value.trim().replace('−', '-');
        savePropLine(g.id, key, o ? { odds: o } : null);
        $('.td-ev', tr).innerHTML = tdEv(p, o);
      });
    });
    $$('.td-more').forEach(function (b) { b.addEventListener('click', function () { var t = b.getAttribute('data-team'); state.props.showAllTD[t] = !state.props.showAllTD[t]; renderProps(); }); });
  }

  /* ---------- router ---------- */
  var VIEWS = { slate: renderSlate, props: renderProps, matchup: renderMatchup, ratings: renderRatings, backtest: renderBacktest, settings: renderSettings };
  function currentView() { var v = (location.hash || '#slate').slice(1); return VIEWS[v] ? v : 'slate'; }
  function route() {
    var v = currentView();
    $$('#nav a').forEach(function (a) { var on = a.getAttribute('data-view') === v; a.classList.toggle('active', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    closeSheet();
    if (v !== 'settings' && !getKey()) return needKey();
    VIEWS[v]();
  }
  window.addEventListener('hashchange', function () { route(); window.scrollTo(0, 0); });
  loadSecond().then(function () { if (currentView() === 'slate' && state.ctx[state.season]) renderSlate(); });
  route();
})();
