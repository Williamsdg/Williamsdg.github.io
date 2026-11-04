/* Williams Digital · College basketball predictor — page logic. Plain JS, no build step.
 * Shares the football page's stylesheet and odds math; data comes through the same Vercel proxy (sport=cbb). */
(function () {
  'use strict';
  var M = window.CFBModel, PR = window.CFBProps, B = window.CBBModel, CP = window.CBBProps;
  var API = 'https://wd-cfb-proxy.vercel.app/api/cfbd';
  var LS = 'wdcbb:', HOUR = 3600e3, DAY = 864e5;
  var view = document.getElementById('view');

  /* ---------- storage ---------- */
  var mem = {};
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(LS + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del: function (k) { try { localStorage.removeItem(LS + k); } catch (e) { } },
    keys: function () { var o = []; try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(LS) === 0) o.push(k.slice(LS.length)); } } catch (e) { } return o; }
  };

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function f1(x) { return x == null ? '–' : (Math.round(x * 10) / 10).toFixed(1); }
  function half(x) { return Math.round(x * 2) / 2; }
  function pct(x, d) { return x == null ? '–' : (x * 100).toFixed(d == null ? 0 : d) + '%'; }
  function signed(x) { return x == null ? '–' : (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(half(x)); }
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return ymd(new Date()); }
  function localDay(g) { return ymd(new Date(g.t)); }
  function addDays(s, n) { var p = s.split('-'); var d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() + n); return ymd(d); }
  function dayLabel(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }); }
  function monthKey() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
  function currentSeason() { var d = new Date(); return d.getMonth() >= 9 ? d.getFullYear() + 1 : d.getFullYear(); }
  function seasonLabel(s) { return (s - 1) + '–' + String(s).slice(2); }
  function favText(m, home, away) { if (m == null) return '–'; var h = half(m); if (h === 0) return 'Pick’em'; return h > 0 ? home + ' −' + Math.abs(h) : away + ' −' + Math.abs(h); }
  function lineText(spread, home, away) { return spread == null ? 'No line yet' : favText(-spread, home, away); }
  function tipoff(g) { var d = new Date(g.t); var day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); return g.tbd ? day + ' · TBD' : day + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
  function kpi(label, v, s) { return '<div class="kpi"><div class="label">' + esc(label) + '</div><div class="v">' + esc(v) + '</div>' + (s ? '<div class="s">' + esc(s) + '</div>' : '') + '</div>'; }
  function amText(am) { return am == null ? '–' : (am > 0 ? '+' : '') + am; }

  /* ---------- settings ---------- */
  function loadSettings() {
    var s = store.get('settings', {}) || {};
    var out = Object.assign({}, B.DEFAULTS, s); out.weights = Object.assign({}, B.DEFAULTS.weights, s.weights || {});
    if (out.propEdge == null) out.propEdge = 3;
    return out;
  }
  var state = {
    settings: loadSettings(), season: currentSeason(), date: null, raw: {}, ctx: {}, loading: {}, errors: {}, updatedAt: null,
    filters: { q: '', conf: '', d1: true, picksOnly: false, sort: 'time' },
    rsort: { k: 'overall', dir: -1 }, rconf: '', rq: '', btSeason: currentSeason() - 1,
    matchup: store.get('matchup', null) || { home: 'Alabama', away: 'Auburn', neutral: false, line: '' },
    props: { gid: store.get('propsGid', null) }
  };
  function saveSettings() { store.set('settings', state.settings); }

  /* ---------- data ---------- */
  function callsLeft() { var c = store.get('callsLeft', null); return c && c.m === monthKey() ? c.n : null; }
  function slim(path, d) {
    if (!Array.isArray(d)) return d;
    if (path === 'games/players') return CP.slimBox(d);
    if (path === 'teams/roster') return d.map(function (t) { return { team: t.team, players: (t.players || []).map(function (p) { return { id: String(p.id), name: p.name, pos: p.position, jersey: p.jersey }; }) }; });
    if (path === 'stats/player/season') return d.filter(function (p) { return p.games && p.minutes / p.games >= 8; }).map(function (p) { return [String(p.athleteId), p.team, p.games, p.minutes, p.points, p.rebounds ? p.rebounds.total : 0, p.assists, p.threePointFieldGoals ? p.threePointFieldGoals.made : 0, p.name]; });
    if (path === 'games') return d.map(function (g) { var o = {}; ['id', 'season', 'seasonType', 'tournament', 'startDate', 'startTimeTbd', 'neutralSite', 'conferenceGame', 'status', 'gameNotes', 'homeTeam', 'homeConference', 'homeSeed', 'homePoints', 'homeTeamEloStart', 'awayTeam', 'awayConference', 'awaySeed', 'awayPoints', 'awayTeamEloStart', 'venue', 'city', 'state'].forEach(function (k) { o[k] = g[k]; }); return o; });
    if (path === 'lines') return d.map(function (l) { return { gameId: l.gameId, lines: (l.lines || []).map(function (x) { return { provider: x.provider, spread: x.spread, spreadOpen: x.spreadOpen, overUnder: x.overUnder, homeMoneyline: x.homeMoneyline, awayMoneyline: x.awayMoneyline }; }) }; });
    if (path === 'stats/team/season') return d.map(function (s) { return { team: s.team, conference: s.conference, games: s.games, wins: s.wins, losses: s.losses, pace: s.pace,
      teamStats: { points: s.teamStats && s.teamStats.points && { total: s.teamStats.points.total } },
      opponentStats: s.opponentStats && { points: { total: s.opponentStats.points && s.opponentStats.points.total }, rebounds: { total: s.opponentStats.rebounds && s.opponentStats.rebounds.total }, assists: s.opponentStats.assists, threePointFieldGoals: { made: s.opponentStats.threePointFieldGoals && s.opponentStats.threePointFieldGoals.made } } }; });
    return d;
  }
  function api(path, qs, ttl, force) {
    var key = 'c:' + path + '?' + qs, hit = mem[key] || store.get(key, null);
    if (!force && hit && Date.now() - hit.t < ttl) { mem[key] = hit; return Promise.resolve(hit.d); }
    return fetch(API + '?sport=cbb&path=' + encodeURIComponent(path) + '&' + qs).then(function (r) {
      var left = r.headers.get('X-CallLimit-Remaining'); if (left != null && isFinite(+left)) store.set('callsLeft', { n: +left, m: monthKey() });
      if (r.status === 403) throw new Error('ORIGIN');
      if (r.status === 429) { if (hit) return { stale: hit.d }; throw new Error('LIMIT'); }
      if (!r.ok) { if (hit) return { stale: hit.d }; throw new Error('HTTP ' + r.status + ' on ' + path); }
      return r.json();
    }, function (e) { if (hit) return { stale: hit.d }; throw e; }).then(function (d) {
      if (d && d.stale) return d.stale;
      d = slim(path, d); var entry = { t: Date.now(), d: d }; mem[key] = entry;
      if (!store.set(key, entry)) { store.keys().forEach(function (k) { if (k.indexOf('c:') === 0 && k.indexOf('season=' + state.season) < 0) store.del(k); }); store.set(key, entry); }
      return d;
    });
  }
  /** Month windows covering a season (Nov → Apr), trimmed to now for the current season. */
  function windows(season) {
    var out = [], now = Date.now();
    for (var i = 0; i < 6; i++) {
      var y = i < 2 ? season - 1 : season, m = i < 2 ? 11 + i : i - 1;
      var start = new Date(y, m - 1, 1), end = new Date(y, m, 0);
      if (season >= currentSeason() && start.getTime() > now + 7 * DAY) break;
      out.push({ s: ymd(start), e: ymd(end), past: end.getTime() < now - 3 * DAY });
    }
    return out;
  }
  function loadSeason(season, force) {
    if (state.loading[season]) return state.loading[season];
    var live = season >= currentSeason(), W = windows(season);
    var tGames = live ? 1 * HOUR : 30 * DAY, tRat = live ? 6 * HOUR : 30 * DAY;
    var jobs = [];
    W.forEach(function (w) {
      var q = 'season=' + season + '&startDateRange=' + w.s + '&endDateRange=' + w.e, t = w.past ? 7 * DAY : tGames;
      jobs.push(['games', api('games', q, t, force)], ['lines', api('lines', q, t, force)]);
    });
    jobs.push(['adj', api('ratings/adjusted', 'season=' + season, tRat, force)], ['srs', api('ratings/srs', 'season=' + season, tRat, force)],
      ['stats', api('stats/team/season', 'season=' + season, tRat, force)],
      ['prevAdj', api('ratings/adjusted', 'season=' + (season - 1), 30 * DAY)], ['prevStats', api('stats/team/season', 'season=' + (season - 1), 30 * DAY)]);
    setStatus();
    var p = Promise.all(jobs.map(function (j) { return j[1].then(function (d) { return { n: j[0], d: d }; }, function (e) { return { n: j[0], e: e }; }); })).then(function (res) {
      var data = { games: [], lines: [] }, errs = [];
      res.forEach(function (r) {
        if (r.e) { errs.push(r); return; }
        if (r.n === 'games' || r.n === 'lines') data[r.n] = data[r.n].concat(r.d || []); else data[r.n] = r.d;
      });
      var fatal = errs.filter(function (r) { return r.e.message === 'ORIGIN' || r.e.message === 'LIMIT'; })[0];
      if (fatal) throw fatal.e;
      if (!data.games.length && errs.length) throw errs[0].e;
      state.raw[season] = data; state.errors[season] = errs.map(function (r) { return r.n + ': ' + r.e.message; });
      state.ctx[season] = B.buildContext(data, state.settings);
      state.allowed = state.allowed || {}; state.allowed[season] = CP.allowedFromStats(data.stats);
      state.updatedAt = Date.now();
      return state.ctx[season];
    });
    state.loading[season] = p;
    p.then(function () { delete state.loading[season]; setStatus(); }, function () { delete state.loading[season]; setStatus(); });
    return p;
  }
  function rebuildAll() { Object.keys(state.raw).forEach(function (s) { state.ctx[s] = B.buildContext(state.raw[s], state.settings); }); }

  /* ---------- status / tooltip / sheet ---------- */
  function setStatus() {
    var el = document.getElementById('status'), busy = Object.keys(state.loading).length, left = callsLeft();
    var t = state.updatedAt ? new Date(state.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null;
    el.innerHTML = busy ? '<span class="spin" aria-hidden="true"></span> Loading' : (t ? '<span class="st-l">Data </span>' + esc(t) + (left != null ? '<span class="st-l"> · ' + left + ' calls left</span>' : '') : '');
  }
  var tip = document.getElementById('tip');
  document.addEventListener('pointermove', function (e) {
    var t = e.target.closest && e.target.closest('[data-tip]');
    if (!t) { tip.classList.add('hidden'); return; }
    tip.innerHTML = t.getAttribute('data-tip'); tip.classList.remove('hidden');
    var w = tip.offsetWidth, h = tip.offsetHeight, left = Math.min(window.innerWidth - w - 8, Math.max(8, e.clientX + 14)), top = e.clientY + 16;
    if (top + h > window.innerHeight - 8) top = e.clientY - h - 12;
    tip.style.left = left + 'px'; tip.style.top = Math.max(8, top) + 'px';
  });
  document.addEventListener('scroll', function () { tip.classList.add('hidden'); }, true);
  var sheet = document.getElementById('sheet');
  function openSheet(html) { $('#sheetBody').innerHTML = html; sheet.classList.remove('hidden'); document.body.style.overflow = 'hidden'; $('#sheetClose').focus(); }
  function closeSheet() { sheet.classList.add('hidden'); document.body.style.overflow = ''; tip.classList.add('hidden'); }
  $('#sheetClose').addEventListener('click', closeSheet);
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.classList.contains('hidden')) closeSheet(); });

  /* ---------- views: shared ---------- */
  function loadingView(msg) { view.innerHTML = '<div class="empty"><span class="spin" aria-hidden="true"></span> ' + esc(msg || 'Loading the season…') + '</div>'; }
  function errorView(e) {
    var msg = e && e.message === 'LIMIT' ? 'The monthly limit of 1,000 data calls has been reached. Cached data will return when it is available.'
      : e && e.message === 'ORIGIN' ? 'This page only loads data on williamsdigital.io.' : (e && e.message) || 'Something went wrong.';
    view.innerHTML = '<div class="empty"><p class="err">' + esc(msg) + '</p><button class="btn" id="retry">Try again</button></div>';
    $('#retry').addEventListener('click', route);
  }
  function withSeason(season, fn) {
    if (state.ctx[season]) return fn(state.ctx[season]);
    loadingView('Loading the ' + seasonLabel(season) + ' season…');
    loadSeason(season).then(route, errorView);
  }
  function seasonOptions(sel, from) {
    var cur = currentSeason(), out = '';
    for (var y = from || cur; y >= cur - 2; y--) out += '<option value="' + y + '"' + (y === sel ? ' selected' : '') + '>' + seasonLabel(y) + (y === cur ? ' (this season)' : '') + '</option>';
    return out;
  }
  function pickText(p, g) { if (!p.pick) return null; var s = p.market.spread; return p.pick === 'home' ? g.homeTeam + ' ' + signed(s) : g.awayTeam + ' ' + signed(-s); }
  function atsResult(p, g) {
    if (!p.pick || !g.completed || g.homePoints == null) return null;
    var c = (g.homePoints - g.awayPoints) - p.market.margin; if (c === 0) return 'P';
    return (c > 0) === (p.pick === 'home') ? 'W' : 'L';
  }
  function tierChip(t) { return t ? '<span class="chip ' + t + '">' + (t === 'HIGH' ? 'High' : t === 'MEDIUM' ? 'Medium' : 'Low') + ' confidence</span>' : ''; }

  function compChart(p, home, away) {
    var w = state.settings.weights, rows = B.COMPONENTS.map(function (c) { return { c: c, v: p.comps[c.key], wt: +w[c.key] || 0 }; });
    var vals = rows.map(function (r) { return r.v; }).concat([p.margin, p.market && p.market.margin]).filter(function (v) { return v != null; });
    var max = Math.max(6, Math.ceil(Math.max.apply(null, vals.map(Math.abs).concat([0])) / 6) * 6);
    function bar(v, color) {
      if (v == null) return ''; var wp = Math.abs(v) / max * 50;
      return v >= 0 ? '<i class="bar r" style="left:50%;width:' + wp + '%;background:' + color + '"></i>' : '<i class="bar lft" style="left:' + (50 - wp) + '%;width:' + wp + '%;background:' + color + '"></i>';
    }
    var mk = p.market && p.market.margin != null ? '<i class="mk" style="left:' + (50 + p.market.margin / max * 50) + '%"></i>' : '';
    function row(label, v, wt, cls, src) {
      var color = v != null && v >= 0 ? 'var(--home)' : 'var(--away)';
      var t = '<b>' + esc(label) + '</b><br>' + (v == null ? 'No data for this game' : esc(favText(v, home, away))) + (wt != null ? '<br>Weight ' + wt + (wt === 0 ? ' (off)' : '') : '') + (src ? '<br><span class="muted">' + esc(src) + '</span>' : '');
      return '<div class="crow ' + (cls || '') + '"><div class="cl">' + esc(label) + '</div><div class="ctrack"><i class="axis"></i>' + bar(v, color) + mk + '<i class="hit" data-tip="' + esc(t) + '"></i></div><div class="cv">' + (v == null ? '–' : signed(v)) + '</div></div>';
    }
    var html = '<div class="comp-legend"><span><i style="background:var(--home)"></i>' + esc(home) + ' favored (right)</span><span><i style="background:var(--away)"></i>' + esc(away) + ' favored (left)</span>' + (mk ? '<span><i class="ln"></i>Vegas line</span>' : '') + '</div><div class="comp-chart" role="img" aria-label="Predicted margin by signal">';
    rows.forEach(function (r) { html += row(r.c.label, r.v, r.wt, (r.v == null || r.wt === 0) ? 'off' : '', r.c.src); });
    html += row('Blend', p.margin, null, 'total', 'Weighted average of the signals above');
    return html + '</div><p class="small muted" style="margin-top:8px">Numbers are points from ' + esc(home) + '’s side: +4 means ' + esc(home) + ' by 4.</p>';
  }
  function predictionBlock(g, p) {
    var home = g.homeTeam, away = g.awayTeam, wp = p.homeWP == null ? 0.5 : p.homeWP, fin = g.completed && g.homePoints != null;
    var out = '<div class="score-hero"><div class="t">' + esc(away) + '</div><div class="sc">' + (fin ? g.awayPoints + ' – ' + g.homePoints : Math.round(p.awayPts) + ' – ' + Math.round(p.homePts)) + '</div><div class="t r">' + esc(home) + '</div></div>';
    out += '<p class="small soft" style="text-align:center;margin-bottom:14px">' + (fin ? 'Final. Model projected ' + Math.round(p.awayPts) + '–' + Math.round(p.homePts) + '.' : 'Projected score') + '</p>';
    out += '<div class="wpbar" aria-hidden="true"><i style="width:' + ((1 - wp) * 100) + '%;background:var(--away)"></i><i style="width:' + (wp * 100) + '%;background:var(--home)"></i></div><div class="wplab"><span>' + esc(away) + ' ' + pct(1 - wp) + '</span><span>' + esc(home) + ' ' + pct(wp) + '</span></div>';
    out += '<div class="kpis" style="margin-top:18px">' + kpi('Model line', favText(p.margin, home, away), 'Blend of every signal') +
      kpi('Vegas line', p.market ? lineText(p.market.spread, home, away) : 'None yet', p.market ? p.market.books.join(', ') + (p.market.spreadOpen != null && p.market.spreadOpen !== p.market.spread ? ' · opened ' + lineText(p.market.spreadOpen, home, away) : '') : 'Model only') +
      kpi('Edge vs line', p.edge == null ? '–' : f1(Math.abs(p.edge)) + ' pts', p.edge == null ? 'Needs a line' : 'Toward ' + (p.edge >= 0 ? home : away) + ', ratings only') +
      kpi('Total', f1(p.total), p.market && p.market.total != null ? 'Vegas O/U ' + p.market.total : 'From offense and defense ratings') + '</div>';
    if (p.pick) out += '<p><span class="chip pick">Pick: ' + esc(pickText(p, g)) + '</span> ' + tierChip(p.tier) + '</p>';
    else if (p.edge != null) out += '<p class="soft">No pick. The ratings land within ' + state.settings.edgeMin + ' points of the line.</p>';
    if (p.reasons.length) out += '<ul class="why">' + p.reasons.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>';
    if (p.market && p.market.homeWP != null) out += '<p class="small soft" style="margin-top:10px">Moneyline odds put ' + esc(home) + ' at ' + pct(p.market.homeWP) + ' to win, after removing the bookmaker margin.</p>';
    return out + '<h3 style="margin-top:22px">What each signal says</h3>' + compChart(p, home, away);
  }

  /* ---------- slate (by date) ---------- */
  function datesWithGames(ctx) { var s = {}; ctx.games.forEach(function (g) { s[localDay(g)] = 1; }); return Object.keys(s).sort(); }
  function defaultDate(ctx) {
    var ds = datesWithGames(ctx), t = today();
    if (ds.indexOf(t) >= 0) return t;
    var next = ds.filter(function (d) { return d > t; })[0]; return next || ds[ds.length - 1] || t;
  }
  function renderSlate() {
    var season = currentSeason();
    withSeason(season, function (ctx) {
      if (!state.date) state.date = defaultDate(ctx);
      var F = state.filters, all = ctx.games.filter(function (g) { return localDay(g) === state.date && g.status !== 'cancelled'; });
      var confs = {}; all.forEach(function (g) { [g.homeConference, g.awayConference].forEach(function (c) { if (c) confs[c] = 1; }); });
      var items = all.map(function (g) { return { g: g, p: B.predict(g, ctx) }; });
      var shown = items.filter(function (it) {
        var g = it.g;
        if (F.d1 && (!g.homeConference || !g.awayConference)) return false;
        if (F.conf && g.homeConference !== F.conf && g.awayConference !== F.conf) return false;
        if (F.q && (g.homeTeam + ' ' + g.awayTeam).toLowerCase().indexOf(F.q.toLowerCase()) < 0) return false;
        if (F.picksOnly && !it.p.pick) return false;
        return true;
      }).sort(function (a, b) {
        if (F.sort === 'edge') return Math.abs(b.p.edge || 0) - Math.abs(a.p.edge || 0);
        if (F.sort === 'sure') return Math.abs((b.p.homeWP || .5) - .5) - Math.abs((a.p.homeWP || .5) - .5);
        if (!!a.g.completed !== !!b.g.completed) return a.g.completed ? 1 : -1;
        return a.g.t - b.g.t;
      });
      var picks = shown.filter(function (it) { return it.p.pick; }), high = picks.filter(function (it) { return it.p.tier === 'HIGH'; });
      var done = shown.filter(function (it) { return it.g.completed && it.g.homePoints != null; });
      var su = done.filter(function (it) { return (it.p.margin > 0) === (it.g.homePoints > it.g.awayPoints); }).length;
      var aw = 0, al = 0; done.forEach(function (it) { var r = atsResult(it.p, it.g); if (r === 'W') aw++; if (r === 'L') al++; });
      var isToday = state.date === today();
      var h = '<div class="eyebrow">// ' + seasonLabel(season) + ' · ' + esc(dayLabel(state.date)) + '</div><h1>' + (isToday ? 'Today’s games' : 'Games on ' + esc(dayLabel(state.date))) + '</h1>' +
        '<p class="lede">Every game gets a projected score, win odds and a model line. A pick only appears when the ratings disagree with Vegas by ' + state.settings.edgeMin + ' or more points. Tap a game for the full breakdown.</p>';
      h += '<div class="toolbar"><div class="fld datefld"><label class="f" for="fDate">Date</label><div class="datebox"><button class="btn small" id="dPrev" type="button" aria-label="Previous day">‹</button><input id="fDate" type="date" value="' + state.date + '" ><button class="btn small" id="dNext" type="button" aria-label="Next day">›</button>' + (isToday ? '' : '<button class="btn small" id="dToday" type="button">Today</button>') + '</div></div>' +
        '<div class="fld"><label class="f" for="fConf">Conference</label><select id="fConf"><option value="">All</option>' + Object.keys(confs).sort().map(function (c) { return '<option' + (c === F.conf ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') + '</select></div>' +
        '<div class="fld grow"><label class="f" for="fQ">Team</label><input id="fQ" type="search" placeholder="Search a team" value="' + esc(F.q) + '"></div>' +
        '<div class="fld sortfld"><label class="f">Sort</label><div class="seg" id="fSort">' + [['time', 'Tip-off'], ['edge', 'Edge'], ['sure', 'Surest']].map(function (s) { return '<button type="button" data-v="' + s[0] + '" class="' + (F.sort === s[0] ? 'on' : '') + '">' + s[1] + '</button>'; }).join('') + '</div></div></div>' +
        '<div class="toolbar" style="margin-top:-6px"><label class="check"><input type="checkbox" id="fD1"' + (F.d1 ? ' checked' : '') + '> Division I vs Division I only</label><label class="check"><input type="checkbox" id="fPicks"' + (F.picksOnly ? ' checked' : '') + '> Picks only</label><span style="flex:1"></span><button class="btn small" id="refresh" type="button">Refresh data</button></div>';
      h += '<div class="kpis">' + kpi('Games', String(shown.length), all.length !== shown.length ? all.length + ' before filters' : 'On this date') + kpi('Model picks', String(picks.length), 'Off the line by ' + state.settings.edgeMin + '+ pts') +
        kpi('High confidence', String(high.length), 'Big gap and the ratings agree') +
        (done.length ? kpi('Winners called', su + '–' + (done.length - su), (aw + al ? 'Picks ' + aw + '–' + al + ' vs line. ' : '') + 'Hindsight, see Track record') : kpi('Season', seasonLabel(season), ctx.games.filter(function (g) { return g.completed; }).length + ' games played so far')) + '</div>';
      var early = ctx.games.filter(function (g) { return g.completed; }).length < 1500;
      if (early) h += '<div class="note info">Early season: ratings lean on last season’s numbers, regressed toward average, until teams have played about eight games.</div>';
      if ((state.errors[season] || []).length) h += '<div class="note">Some data did not load, so those signals are skipped: ' + esc(state.errors[season].join('; ')) + '</div>';
      h += shown.length ? '<div class="games">' + shown.map(function (it) { return card(it.g, it.p, ctx); }).join('') + '</div>' : '<div class="empty">No games match on this date.</div>';
      view.innerHTML = h;
      function go(d) { state.date = d; renderSlate(); }
      $('#dPrev').addEventListener('click', function () { go(addDays(state.date, -1)); });
      $('#dNext').addEventListener('click', function () { go(addDays(state.date, 1)); });
      if ($('#dToday')) $('#dToday').addEventListener('click', function () { go(today()); });
      $('#fDate').addEventListener('change', function () { if (this.value) go(this.value); });
      $('#fConf').addEventListener('change', function () { F.conf = this.value; renderSlate(); });
      $('#fD1').addEventListener('change', function () { F.d1 = this.checked; renderSlate(); });
      $('#fPicks').addEventListener('change', function () { F.picksOnly = this.checked; renderSlate(); });
      $$('#fSort button').forEach(function (b) { b.addEventListener('click', function () { F.sort = b.getAttribute('data-v'); renderSlate(); }); });
      var qt; $('#fQ').addEventListener('input', function () { var v = this.value; clearTimeout(qt); qt = setTimeout(function () { F.q = v; renderSlate(); var q = $('#fQ'); q.focus(); q.setSelectionRange(v.length, v.length); }, 200); });
      $('#refresh').addEventListener('click', function () { delete state.ctx[season]; loadingView('Refreshing…'); loadSeason(season, true).then(renderSlate, errorView); });
      $$('.game').forEach(function (el) { el.addEventListener('click', function () { openGame(+el.getAttribute('data-id')); }); });
    });
  }
  function rankOf(ctx) {
    if (ctx._rank) return ctx._rank;
    var arr = Object.keys(ctx.teams).map(function (n) { return ctx.teams[n]; }).filter(function (t) { return t.d1 && t.net != null; }).sort(function (a, b) { return b.net - a.net; });
    var r = {}; arr.forEach(function (t, i) { r[t.name] = i + 1; }); ctx._rank = r; return r;
  }
  function card(g, p, ctx) {
    var fin = g.completed && g.homePoints != null, wp = p.homeWP == null ? .5 : p.homeWP, rk = rankOf(ctx);
    function rank(n, seed) { return (seed ? '<small>(' + seed + ')</small>' : '') + (rk[n] ? '<small>#' + rk[n] + '</small>' : (ctx.teams[n] && !ctx.teams[n].d1 ? '<small>Non-D1</small>' : '')); }
    var tags = [g.neutralSite ? 'Neutral' : null, g.conferenceGame ? 'Conference' : null].filter(Boolean).join(' · ');
    var chips = '', res = atsResult(p, g);
    if (p.pick) chips += '<span class="chip pick">Pick: ' + esc(pickText(p, g)) + '</span>' + tierChip(p.tier);
    else if (p.edge != null) chips += '<span class="chip">No edge · ' + f1(Math.abs(p.edge)) + ' pts off</span>'; else chips += '<span class="chip">No line yet</span>';
    if (res) chips += '<span class="chip ' + res + '">' + (res === 'W' ? 'Covered' : res === 'L' ? 'Missed' : 'Push') + '</span>';
    if (fin && g.homePoints !== g.awayPoints) { var right = (p.margin > 0) === (g.homePoints > g.awayPoints); chips += '<span class="chip ' + (right ? 'W' : 'L') + '">' + (right ? 'Winner right' : 'Winner wrong') + '</span>'; }
    return '<button class="game" type="button" data-id="' + g.id + '" aria-label="' + esc(g.awayTeam + ' at ' + g.homeTeam + ', details') + '">' +
      '<div class="meta"><span>' + esc(tipoff(g)) + '</span><span>' + esc(fin ? 'Final' + (tags ? ' · ' + tags : '') : (g.status === 'postponed' ? 'Postponed' : tags)) + '</span></div>' +
      '<div class="team-row"><i class="sw" style="background:var(--away)"></i><div class="nm">' + esc(g.awayTeam) + rank(g.awayTeam, g.awaySeed) + '</div><div class="pts' + (fin ? ' final' : '') + '">' + (fin ? g.awayPoints : Math.round(p.awayPts)) + '</div></div>' +
      '<div class="team-row"><i class="sw" style="background:var(--home)"></i><div class="nm">' + esc(g.homeTeam) + rank(g.homeTeam, g.homeSeed) + '</div><div class="pts' + (fin ? ' final' : '') + '">' + (fin ? g.homePoints : Math.round(p.homePts)) + '</div></div>' +
      '<div class="wpbar" aria-hidden="true"><i style="width:' + ((1 - wp) * 100) + '%;background:var(--away)"></i><i style="width:' + (wp * 100) + '%;background:var(--home)"></i></div><div class="wplab"><span>' + pct(1 - wp) + ' win</span><span>' + pct(wp) + ' win</span></div>' +
      '<div class="lines"><div><div class="k">Vegas</div><div class="val">' + esc(p.market ? lineText(p.market.spread, g.homeTeam, g.awayTeam) : 'No line yet') + (p.market && p.market.total != null ? ' · ' + p.market.total : '') + '</div></div><div><div class="k">Model</div><div class="val">' + esc(favText(p.margin, g.homeTeam, g.awayTeam)) + ' · ' + f1(p.total) + '</div></div></div>' +
      '<div class="chips">' + chips + '</div></button>';
  }
  function openGame(id) {
    var ctx = state.ctx[currentSeason()], g = ctx.games.filter(function (x) { return x.id === id; })[0]; if (!g) return;
    var p = B.predict(g, ctx);
    openSheet('<div class="eyebrow">// ' + esc(tipoff(g)) + (g.venue ? ' · ' + esc(g.venue) : '') + '</div><h2 id="sheetTitle" style="margin:6px 0 0">' + esc(g.awayTeam) + ' at ' + esc(g.homeTeam) + '</h2>' + (g.notes ? '<p class="small soft">' + esc(g.notes) + '</p>' : '') + predictionBlock(g, p) +
      '<p style="margin-top:18px" class="row-btns"><button class="btn small" id="toProps">Player props for this game</button> <button class="btn small" id="toMatchup">Open in Matchup to try a different line</button></p>');
    $('#toProps').addEventListener('click', function () { state.props.gid = g.id; store.set('propsGid', g.id); state.date = localDay(g); closeSheet(); location.hash = '#props'; });
    $('#toMatchup').addEventListener('click', function () { state.matchup = { home: g.homeTeam, away: g.awayTeam, neutral: !!g.neutralSite, line: p.market && p.market.spread != null ? String(p.market.spread) : '' }; store.set('matchup', state.matchup); closeSheet(); location.hash = '#matchup'; });
  }

  /* ---------- matchup ---------- */
  function renderMatchup() {
    var season = currentSeason();
    withSeason(season, function (ctx) {
      var S = state.matchup, d1 = Object.keys(ctx.teams).filter(function (n) { return ctx.teams[n].d1 && (ctx.teams[n].net != null || ctx.teams[n].power != null); }).sort();
      if (d1.indexOf(S.home) < 0) S.home = d1[0]; if (d1.indexOf(S.away) < 0) S.away = d1[1];
      function opts(sel) { return d1.map(function (n) { return '<option' + (n === sel ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join(''); }
      var h = '<div class="eyebrow">// ' + seasonLabel(season) + ' · Any two teams</div><h1>Matchup</h1><p class="lede">Pick any two Division I teams and where they play. Add a line to see which side the model would take.</p>' +
        '<div class="toolbar"><div class="fld grow"><label class="f" for="mAway">Away team</label><select id="mAway">' + opts(S.away) + '</select></div><div class="fld" style="min-width:auto;justify-content:flex-end"><button class="btn" id="mSwap" type="button">⇄ Swap</button></div>' +
        '<div class="fld grow"><label class="f" for="mHome">Home team</label><select id="mHome">' + opts(S.home) + '</select></div><div class="fld"><label class="f" for="mLine">Home team’s line</label><input id="mLine" type="text" inputmode="decimal" placeholder="e.g. -4.5" value="' + esc(S.line) + '"></div></div>' +
        '<div class="toolbar" style="margin-top:-6px"><label class="check"><input type="checkbox" id="mNeutral"' + (S.neutral ? ' checked' : '') + '> Neutral site</label></div>';
      var g = { id: -1, homeTeam: S.home, awayTeam: S.away, neutralSite: !!S.neutral, completed: false };
      var ln = parseFloat(String(S.line).replace('−', '-'));
      var p = B.predict(g, ctx, { market: isFinite(ln) ? { spread: ln, margin: -ln, total: null, books: ['Your line'], spreadOpen: null, homeWP: null } : null });
      h += S.home === S.away ? '<div class="empty">Pick two different teams.</div>' : '<div class="panel">' + predictionBlock(g, p) + '</div>';
      view.innerHTML = h;
      function upd() { S.away = $('#mAway').value; S.home = $('#mHome').value; S.neutral = $('#mNeutral').checked; S.line = $('#mLine').value.trim(); store.set('matchup', S); renderMatchup(); }
      ['#mAway', '#mHome', '#mNeutral', '#mLine'].forEach(function (s) { $(s).addEventListener('change', upd); });
      $('#mSwap').addEventListener('click', function () { var t = S.home; S.home = S.away; S.away = t; S.line = S.line ? String(-parseFloat(S.line)) : ''; store.set('matchup', S); renderMatchup(); });
    });
  }

  /* ---------- ratings ---------- */
  function renderRatings() {
    var season = state.season;
    withSeason(season, function (ctx) {
      var w = state.settings.weights, R = state.rsort, o = ctx.opts;
      var rows = Object.keys(ctx.teams).map(function (n) { return ctx.teams[n]; }).filter(function (t) { return t.d1; }).map(function (t) {
        var v = { adj: t.adj, power: t.power, srs: t.srs, prior: t.prior }, s = 0, ws = 0;
        Object.keys(v).forEach(function (k) { if (v[k] != null && (+w[k] || 0) > 0) { s += v[k] * w[k]; ws += +w[k]; } });
        return { name: t.name, conf: t.conf || '', overall: ws ? s / ws : null, net: t.net, off: t.off, def: t.def, tempo: t.tempo, srs: t.srs, power: t.power, prior: t.prior, rec: (t.wins != null ? t.wins + '–' + t.losses : '') };
      }).filter(function (r) { return r.overall != null; });
      var ranked = rows.slice().sort(function (a, b) { return b.overall - a.overall; }), rk = {}; ranked.forEach(function (r, i) { rk[r.name] = i + 1; });
      var confs = {}; rows.forEach(function (r) { if (r.conf) confs[r.conf] = 1; });
      var shown = rows.filter(function (r) { return (!state.rconf || r.conf === state.rconf) && (!state.rq || r.name.toLowerCase().indexOf(state.rq.toLowerCase()) >= 0); });
      shown.sort(function (a, b) { var x = a[R.k], y = b[R.k]; if (R.k === 'name' || R.k === 'conf' || R.k === 'rec') return R.dir * String(x).localeCompare(String(y)); if (x == null) return 1; if (y == null) return -1; return R.dir * (x - y); });
      var cols = [['rank', '#', 'l'], ['name', 'Team', 'l'], ['conf', 'Conf', 'l hide-sm'], ['overall', 'Overall'], ['net', 'Net / 100'], ['off', 'Off'], ['def', 'Def'], ['tempo', 'Tempo'], ['srs', 'SRS'], ['power', 'WD power'], ['prior', 'Last season'], ['rec', 'Record']];
      var tips = { overall: 'Blend of the ratings, in points better than an average D1 team on a neutral floor', net: 'Points per 100 possessions better than average (offense − defense), blended with last season early on', def: 'Points allowed per 100 possessions: lower is better', tempo: 'Possessions per 40 minutes', prior: 'Last season’s rating, regressed toward average' };
      var h = '<div class="eyebrow">// ' + seasonLabel(season) + ' · Power ratings</div><h1>Team ratings</h1><p class="lede">Every Division I team on one table. “Overall” blends the ratings with your Settings weights, in points better than an average team on a neutral floor.</p>' +
        '<div class="toolbar"><div class="fld"><label class="f" for="rSeason">Season</label><select id="rSeason">' + seasonOptions(season) + '</select></div><div class="fld"><label class="f" for="rConf">Conference</label><select id="rConf"><option value="">All</option>' + Object.keys(confs).sort().map(function (c) { return '<option' + (c === state.rconf ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') + '</select></div>' +
        '<div class="fld grow"><label class="f" for="rQ">Team</label><input id="rQ" type="search" placeholder="Search a team" value="' + esc(state.rq) + '"></div></div>';
      h += '<div class="tbl-wrap"><table><thead><tr>' + cols.map(function (c) { var s = c[0] !== 'rank'; return '<th class="' + (c[2] || '') + (s ? ' sort' : '') + (R.k === c[0] ? ' on' : '') + '"' + (s ? ' data-k="' + c[0] + '" tabindex="0" role="button"' : '') + (tips[c[0]] ? ' data-tip="' + esc(tips[c[0]]) + '"' : '') + '>' + c[1] + (R.k === c[0] ? (R.dir < 0 ? ' ↓' : ' ↑') : '') + '</th>'; }).join('') + '</tr></thead><tbody>' +
        shown.map(function (r) { function nn(v, d) { return v == null ? '<td class="num muted">–</td>' : '<td class="num">' + v.toFixed(d) + '</td>'; }
          return '<tr><td class="num muted">' + rk[r.name] + '</td><td class="l"><b>' + esc(r.name) + '</b></td><td class="l soft hide-sm">' + esc(r.conf) + '</td><td class="num ' + (r.overall >= 0 ? 'pos' : 'neg') + '">' + (r.overall > 0 ? '+' : r.overall < 0 ? '−' : '') + Math.abs(r.overall).toFixed(1) + '</td>' + nn(r.net, 1) + nn(r.off, 1) + nn(r.def, 1) + nn(r.tempo, 1) + nn(r.srs, 1) + nn(r.power, 1) + nn(r.prior, 1) + '<td class="num">' + esc(r.rec) + '</td></tr>'; }).join('') +
        '</tbody></table></div><p class="small muted" style="margin-top:10px">' + shown.length + ' teams. Click a column to sort.</p>';
      view.innerHTML = h;
      $('#rSeason').addEventListener('change', function () { state.season = +this.value; renderRatings(); });
      $('#rConf').addEventListener('change', function () { state.rconf = this.value; renderRatings(); });
      var qt; $('#rQ').addEventListener('input', function () { var v = this.value; clearTimeout(qt); qt = setTimeout(function () { state.rq = v; renderRatings(); var q = $('#rQ'); q.focus(); q.setSelectionRange(v.length, v.length); }, 200); });
      $$('th.sort').forEach(function (th) { function go() { var k = th.getAttribute('data-k'); if (R.k === k) R.dir = -R.dir; else { R.k = k; R.dir = (k === 'name' || k === 'conf' || k === 'def') ? 1 : -1; } renderRatings(); } th.addEventListener('click', go); th.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
    });
  }

  /* ---------- track record ---------- */
  function lineChart(byWeek) {
    var pts = byWeek.filter(function (w) { return w.n >= 10; });
    if (pts.length < 2) return '<p class="soft">Not enough finished weeks for a chart yet.</p>';
    var W = 760, H = 250, pl = 44, pr = 96, pt = 14, pb = 30;
    var ys = pts.map(function (w) { return w.model / w.n; }).concat(pts.map(function (w) { return w.market / w.n; }));
    var lo = Math.max(0, Math.floor(Math.min.apply(null, ys) * 10) / 10 - 0.05), hi = Math.min(1, Math.ceil(Math.max.apply(null, ys) * 10) / 10);
    function X(i) { return pl + (W - pl - pr) * i / (pts.length - 1); } function Y(v) { return pt + (H - pt - pb) * (1 - (v - lo) / (hi - lo || 1)); }
    var grid = ''; for (var g = Math.ceil(lo * 10); g <= Math.floor(hi * 10); g++) { var y = Y(g / 10); grid += '<line class="gl" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y + '" y2="' + y + '"/><text class="ax" x="' + (pl - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + g * 10 + '%</text>'; }
    var step = Math.ceil(pts.length / 10), xl = pts.map(function (w, i) { return i % step ? '' : '<text class="ax" x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + new Date(w.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + '</text>'; }).join('');
    function series(k, c) { return '<path d="' + pts.map(function (w, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(w[k] / w.n).toFixed(1); }).join(' ') + '" fill="none" stroke="' + c + '" stroke-width="2" stroke-linejoin="round"/>' + pts.map(function (w, i) { return '<circle cx="' + X(i) + '" cy="' + Y(w[k] / w.n) + '" r="4" fill="' + c + '" stroke="#0E0E1C" stroke-width="2"/>'; }).join(''); }
    var last = pts[pts.length - 1], li = pts.length - 1, ym = Y(last.model / last.n), yv = Y(last.market / last.n);
    if (Math.abs(ym - yv) < 16) { if (ym < yv) { ym -= 8; yv += 8; } else { ym += 8; yv -= 8; } }
    var cw = (W - pl - pr) / (pts.length - 1);
    var hits = pts.map(function (w, i) { var t = '<b>Week of ' + new Date(w.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + '</b> · ' + w.n + ' games<br>Model picked ' + pct(w.model / w.n) + ' of winners<br>Vegas picked ' + pct(w.market / w.n) + (w.atsW + w.atsL ? '<br>Model vs line: ' + w.atsW + '–' + w.atsL : ''); return '<rect x="' + (X(i) - cw / 2) + '" y="' + pt + '" width="' + cw + '" height="' + (H - pt - pb) + '" fill="transparent" data-tip="' + esc(t) + '"/>'; }).join('');
    return '<div class="comp-legend"><span><i style="background:var(--home)"></i>Model (no Vegas input)</span><span><i style="background:var(--away)"></i>Vegas line</span></div><div class="lc"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Share of winners picked each week, model versus Vegas">' + grid + xl + series('market', 'var(--away)') + series('model', 'var(--home)') +
      '<text x="' + (X(li) + 10) + '" y="' + (ym + 4) + '" fill="#fff" font-size="12" font-family="Inter">Model ' + pct(last.model / last.n) + '</text><text x="' + (X(li) + 10) + '" y="' + (yv + 4) + '" fill="#fff" font-size="12" font-family="Inter">Vegas ' + pct(last.market / last.n) + '</text>' + hits + '</svg></div>';
  }
  function renderBacktest() {
    var season = state.btSeason, cur = currentSeason();
    withSeason(season, function (ctx) {
      var b = B.backtest(ctx, state.settings);
      var tuned = season === cur - 1;
      var h = '<div class="eyebrow">// ' + seasonLabel(season) + ' · Walk-forward test</div><h1>Track record</h1>' +
        '<p class="lede">Each finished game is re-predicted using only what was known before tip-off: the Vegas line, pregame Elo, last season’s ratings and the WD power rating rebuilt each week from earlier games. This season’s efficiency ratings and SRS are left out because they already know the results.</p>' +
        '<div class="toolbar"><div class="fld"><label class="f" for="bSeason">Season</label><select id="bSeason">' + seasonOptions(season) + '</select></div></div>';
      if (!b || !b.stats.model.n) { view.innerHTML = h + '<div class="empty">No finished games with lines yet this season.</div>'; bind(); return; }
      var s = b.stats, a = b.ats, ap = a.w + a.l ? a.w / (a.w + a.l) : null;
      h += '<div class="kpis">' + kpi('Picks vs the line', a.w + '–' + a.l + (a.p ? '–' + a.p : ''), (ap == null ? '–' : pct(ap, 1)) + ' · profit needs 52.4%') + kpi('Winners picked', pct(s.model.suPct, 1), 'Vegas favorite won ' + pct(s.market.suPct, 1)) +
        kpi('Average miss', f1(s.model.mae) + ' pts', 'Vegas line missed by ' + f1(s.market.mae)) + kpi('Games tested', String(s.model.n), 'Finished games with a line') + '</div>';
      if (tuned) h += '<div class="note">The model’s settings were tuned on this season, so this record is flattering. The 2024–25 season was never used for tuning: there the model went 811–824 against the spread (49.6%).</div>';
      else h += '<div class="note">' + (ap != null && ap >= 0.524 && (a.w + a.l) > 300 ? 'Above break-even here, but the out-of-sample 2024–25 test came in at 49.6%. Treat it as variance until it holds up.' : 'The model does not beat the Vegas line in this test. Use the picks as a second look, not as betting advice.') + '</div>';
      var lab = { market: 'Vegas line', model: 'Model blend (no Vegas)', power: 'WD power', elo: 'Elo', prior: 'Last season only' };
      h += '<div class="grid2"><div><h2>Each signal on the same games</h2><div class="tbl-wrap"><table><thead><tr><th>Signal</th><th>Games</th><th>Winners</th><th data-tip="Average points between predicted and actual margin">Avg miss</th><th data-tip="Lower is better. 0.25 is a coin flip">Brier</th></tr></thead><tbody>' +
        ['market', 'model', 'power', 'elo', 'prior'].map(function (k) { var x = s[k]; return '<tr><td class="l"><b>' + lab[k] + '</b></td><td class="num">' + x.n + '</td><td class="num">' + pct(x.suPct, 1) + '</td><td class="num">' + f1(x.mae) + '</td><td class="num">' + (x.brierAvg == null ? '–' : x.brierAvg.toFixed(3)) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
        '<div><h2>Hit rate by size of disagreement</h2><div class="tbl-wrap"><table><thead><tr><th>Model vs line</th><th>Record</th><th>Hit rate</th></tr></thead><tbody>' +
        b.buckets.map(function (x) { var n = x.w + x.l, r = n ? x.w / n : null; return '<tr><td class="l">' + (x.hi > 100 ? x.lo + '+ pts' : x.lo + '–' + x.hi + ' pts') + '</td><td class="num">' + x.w + '–' + x.l + (x.p ? '–' + x.p : '') + '</td><td class="num ' + (r == null ? '' : r >= 0.524 ? 'pos' : 'neg') + '">' + pct(r, 1) + '</td></tr>'; }).join('') +
        '</tbody></table></div><p class="small muted" style="margin-top:8px">Picks count once the gap reaches ' + state.settings.edgeMin + ' points.</p></div></div>';
      h += '<h2>Winners picked, week by week</h2><div class="panel">' + lineChart(b.byWeek) + '</div>';
      view.innerHTML = h; bind();
    });
    function bind() { var s = $('#bSeason'); if (s) s.addEventListener('change', function () { state.btSeason = +this.value; renderBacktest(); }); }
  }

  /* ---------- player props ---------- */
  var MARKETS = ['pts', 'reb', 'ast', 'tpm', 'pra'];
  var PROP_CAL = [['Points', '30 / 50 / 70', '31 / 50 / 70'], ['Rebounds', '31 / 50 / 70', '32 / 51 / 70'], ['Assists', '33 / 52 / 70', '34 / 52 / 70'], ['Made threes', '41 / 58 / 72', '44 / 59 / 72'], ['Pts + reb + ast', '30 / 50 / 70', '31 / 50 / 70']];
  function propLines(gid) { return store.get('pl:' + gid, {}) || {}; }
  function savePropLine(gid, key, v) { var all = propLines(gid); if (v) all[key] = v; else delete all[key]; store.set('pl:' + gid, all); }
  function modelLine(pj) { return Math.floor(PR.quantile(pj, 0.5)) + 0.5; }
  function teamBox(season, team) { return api('games/players', 'season=' + season + '&team=' + encodeURIComponent(team), season >= currentSeason() ? 6 * HOUR : 30 * DAY); }
  /**
   * Who plays: this season's roster when available. History = this season's games plus last season's games
   * with the same team; a transfer with no history here gets last season's per-game averages from his old school.
   */
  function rotation(logs, team, before, season, roster, prevSeason) {
    var out = [], ids = roster && roster.length ? roster.map(function (r) { return r.id; }) : Object.keys(logs.players);
    var meta = {}; (roster || []).forEach(function (r) { meta[r.id] = r; });
    ids.forEach(function (id) {
      var p = logs.players[id], mine = p ? p.games.filter(function (g) { return g.team === team && g.t < before; }) : [];
      var cur = mine.filter(function (g) { return g.season === season; }), note = null;
      if (!roster || !roster.length) { if (!cur.length) return; }
      if (!mine.length) {
        var ps = prevSeason && prevSeason[id]; if (!ps) return;
        // [id, team, games, minutes, pts, reb, ast, tpm, name] → a short synthetic log at last season's averages
        var k = Math.min(10, ps[2]), r = [id, ps[8], (meta[id] || {}).pos || '', ps[3] / ps[2], ps[4] / ps[2], ps[5] / ps[2], ps[6] / ps[2], ps[7] / ps[2], 0];
        for (var i = 0; i < k; i++) mine.push({ gid: 'prev' + i, t: before - (k - i) * 3 * DAY - 200 * DAY, team: team, opp: ps[1] + ' (last season)', r: r.map(function (x, j) { return j >= 3 && j <= 7 ? Math.round(x * 10) / 10 : x; }), season: season - 1 });
        note = 'Transfer · last season at ' + ps[1];
        p = { id: id, name: (meta[id] || {}).name || ps[8], pos: (meta[id] || {}).pos || '', team: team, games: mine };
      }
      var recent = (cur.length >= 2 ? cur : mine).slice(-5), mpg = recent.reduce(function (s2, g) { return s2 + g.r[3]; }, 0) / recent.length;
      if (mpg < 15) return;
      var nm = (meta[id] && meta[id].name) || p.name, pos = (meta[id] && meta[id].pos) || p.pos;
      out.push({ p: Object.assign({}, p, { name: nm, pos: pos, games: mine }), mpg: mpg, cur: cur.length, prev: mine.length - cur.length, note: note });
    });
    return out.sort(function (a, b) { return b.mpg - a.mpg; }).slice(0, 8);
  }
  function miniBars(pj, line, games) {
    var vals = pj.log.slice(-10), gs = games.slice(-10); if (!vals.length) return '';
    var max = Math.max.apply(null, vals.concat([line || 0, pj.mean, 1])) * 1.1, W = 160, H = 40, bw = W / 10, ref = line != null ? line : modelLine(pj);
    var bars = vals.map(function (v, i) { var h = Math.max(2, v / max * H), g = gs[i], t = (g ? new Date(g.t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' vs ' + esc(g.opp) + ': ' : '') + '<b>' + v + '</b>';
      return '<rect x="' + (i * bw + 2) + '" y="' + (H - h) + '" width="' + (bw - 4) + '" height="' + h + '" rx="2" fill="' + (v > ref ? 'var(--indigo)' : '#4b4b63') + '"/><rect x="' + i * bw + '" y="0" width="' + bw + '" height="' + H + '" fill="transparent" data-tip="' + esc(t) + '"/>'; }).join('');
    var ly = H - ref / max * H;
    return '<svg class="mini" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Last ' + vals.length + ' games: ' + vals.join(', ') + '">' + bars + '<line x1="0" x2="' + W + '" y1="' + ly + '" y2="' + ly + '" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/></svg>';
  }
  function propResult(pj, v, actual) {
    if (!v || v.line == null || v.line === '' || !isFinite(+v.line)) return '<span class="muted">Type the book’s line to get odds. Model’s even line: <b>' + modelLine(pj) + '</b></span>';
    var line = +v.line, odds = isFinite(+v.odds) && Math.abs(+v.odds) >= 100 ? +v.odds : -110;
    var pr = PR.probs(pj, line), side = pr.over >= pr.under ? 'over' : 'under', pw = pr[side], pl = side === 'over' ? pr.under : pr.over;
    var dec = PR.amToDec(odds), ev = pw * (dec - 1) - pl, kel = Math.max(0, ev / (dec - 1)) * 0.25, value = ev >= (state.settings.propEdge || 3) / 100;
    var h = '<span class="pp"><b>Over ' + pct(pr.over) + '</b> · Under ' + pct(pr.under) + (pr.push > 0.005 ? ' · Push ' + pct(pr.push) : '') + '</span> <span class="chip ' + (value ? 'pick' : '') + '" data-tip="' + esc('Fair price for the ' + side + ': ' + amText(PR.probToAm(pw / (pw + pl))) + '<br>Expected value at ' + amText(odds) + ': ' + (ev * 100).toFixed(1) + '% per bet' + (kel > 0 ? '<br>Quarter-Kelly: ' + (kel * 100).toFixed(1) + '% of bankroll' : '')) + '">' + (value ? 'Value: ' + (side === 'over' ? 'Over ' : 'Under ') + line : 'No value') + ' · EV ' + (ev >= 0 ? '+' : '') + (ev * 100).toFixed(1) + '%</span>';
    if (actual != null) { var res = actual === line ? 'P' : ((actual > line) === (side === 'over') ? 'W' : 'L'); h += ' <span class="chip ' + res + '">Actual ' + actual + '</span>'; }
    return h;
  }
  function renderProps() {
    var season = currentSeason();
    withSeason(season, function (ctx) {
      if (!state.date) state.date = defaultDate(ctx);
      var games = ctx.games.filter(function (g) { return localDay(g) === state.date && g.homeConference && g.awayConference && g.status !== 'cancelled'; })
        .sort(function (a, b) { if (!!a.completed !== !!b.completed) return a.completed ? 1 : -1; return a.t - b.t; });
      var head = '<div class="eyebrow">// ' + seasonLabel(season) + ' · ' + esc(dayLabel(state.date)) + ' · Player props</div><h1>Player props</h1>' +
        '<p class="lede">Pick a game, then type the line and price from your sportsbook. You get the model’s projection, the chance of the over, a fair price, and whether the bet is worth it.</p>' +
        '<div class="toolbar"><div class="fld datefld"><label class="f" for="pDate">Date</label><div class="datebox"><button class="btn small" id="pPrev" type="button" aria-label="Previous day">‹</button><input id="pDate" type="date" value="' + state.date + '" ><button class="btn small" id="pNext" type="button" aria-label="Next day">›</button></div></div>' +
        (games.length ? '<div class="fld grow full"><label class="f" for="pGame">Game</label><select id="pGame">' + games.map(function (x) { return '<option value="' + x.id + '"' + (x.id === state.props.gid ? ' selected' : '') + '>' + esc(x.awayTeam + ' at ' + x.homeTeam + ' · ' + (x.completed ? 'Final' : tipoff(x))) + '</option>'; }).join('') + '</select></div>' : '') + '</div>';
      if (!games.length) { view.innerHTML = head + '<div class="empty">No Division I games on this date.</div>'; bindTop(); return; }
      var g = games.filter(function (x) { return x.id === state.props.gid; })[0] || games[0];
      state.props.gid = g.id; store.set('propsGid', g.id);
      view.innerHTML = head + '<div class="empty"><span class="spin" aria-hidden="true"></span> Loading box scores…</div>'; bindTop();
      $('#pGame').value = String(g.id);
      var rq = function (t) { return api('teams/roster', 'season=' + season + '&team=' + encodeURIComponent(t), 24 * HOUR); };
      Promise.all([teamBox(season, g.homeTeam), teamBox(season, g.awayTeam), teamBox(season - 1, g.homeTeam), teamBox(season - 1, g.awayTeam),
        rq(g.homeTeam), rq(g.awayTeam), api('stats/player/season', 'season=' + (season - 1), 30 * DAY)].map(function (p) { return p.catch(function () { return []; }); })).then(function (res) {
        var rosters = {}; [res[4], res[5]].forEach(function (r) { (r || []).forEach(function (t) { rosters[t.team] = t.players; }); });
        var prevSeason = {}; (res[6] || []).forEach(function (r) { prevSeason[r[0]] = r; });
        res = res.slice(0, 4);
        if (currentView() !== 'props' || state.props.gid !== g.id) return;
        var box = []; res.forEach(function (arr, i) { (arr || []).forEach(function (r) { box.push(Object.assign({ season: i < 2 ? season : season - 1 }, r)); }); });
        var logs = CP.buildLogs(box);
        // tag each game log row with its season so the rotation filter can tell this season from last
        var seasonOf = {}; box.forEach(function (r) { seasonOf[r.gid] = r.season; });
        Object.keys(logs.players).forEach(function (k) { logs.players[k].games.forEach(function (x) { x.season = seasonOf[x.gid]; }); });
        var mk = M.marketFromLines(ctx.lineById[g.id]), im = mk && mk.spread != null && mk.total != null ? PR.implied(mk.spread, mk.total) : null;
        var allowed = state.allowed && state.allowed[season];
        var prevAllowed = CP.allowedFromStats(state.raw[season] && state.raw[season].prevStats);
        // early season: use last season's defensive numbers until a team has 4+ games
        var allow = {}; Object.keys(prevAllowed).forEach(function (k) { allow[k] = prevAllowed[k]; });
        Object.keys(allowed || {}).forEach(function (k) { if (k === '_avg' || (allowed[k].games || 0) >= 4) allow[k] = allowed[k]; });
        if (!allow._avg) allow._avg = prevAllowed._avg;
        var lines = propLines(g.id), before = g.t, html = head, shownPlayers = {};
        if (g.completed) html += '<div class="note info">This game is final. Projections use only games before tip-off, and each row shows what actually happened.</div>';
        if (!im) html += '<div class="note">No Vegas line for this game yet, so projections skip the game-script adjustment.</div>';
        [[g.awayTeam, g.homeTeam, im && im.away], [g.homeTeam, g.awayTeam, im && im.home]].forEach(function (side) {
          var team = side[0], opp = side[1], ip = side[2], T = ctx.teams[team];
          var a = allowed && allowed[team], scored = a && a.games >= 4 && a.scored ? a.scored : (prevAllowed[team] && prevAllowed[team].scored) || null;
          var list = rotation(logs, team, before, season, rosters[team], prevSeason);
          html += '<h2>' + esc(team) + (ip != null ? ' <span class="soft small" style="font-weight:500">· Vegas-implied ' + f1(ip) + ' pts</span>' : '') + '</h2>';
          var of = CP.oppFactor(allow, opp, 'pts'), orb = CP.oppFactor(allow, opp, 'reb');
          html += '<p class="small soft">' + esc(opp) + ' allows ' + pct(of) + ' of the average team’s points and ' + pct(orb) + ' of its rebounds.</p>';
          if (!list.length) { html += '<div class="empty">No rotation players with game history yet.</div>'; return; }
          list.forEach(function (it) { shownPlayers[it.p.id] = it.p; });
          html += '<div class="pcards">' + list.map(function (it) {
            var p = it.p, played = p.games.filter(function (x) { return x.t < before; });
            var ag = g.completed && logs.players[p.id] ? (logs.players[p.id].games.filter(function (x) { return x.gid === g.id; })[0]) : null;
            var rows = MARKETS.map(function (stat) {
              var pj = CP.project(p, stat, { before: before, allowed: allow, opp: opp, impliedPts: ip, teamScored: scored });
              if (!pj) return '';
              var key = p.id + ':' + stat, v = lines[key] || {}, lo = PR.quantile(pj, 0.1), hi = PR.quantile(pj, 0.9);
              var actual = g.completed ? (ag ? CP.val(ag.r, stat) : null) : null, cfg = CP.P.stats[stat];
              return '<div class="prow" data-key="' + esc(key) + '" data-stat="' + stat + '" data-pid="' + esc(p.id) + '"><div class="ptop"><span class="pm">' + esc(cfg.label) + '</span><span class="pproj" data-tip="' + esc('Recent form ' + f1(pj.base) + ' × opponent ' + f1(Math.pow(pj.oppF, cfg.opp)) + ' × game script ' + f1(Math.pow(Math.max(.5, Math.min(1.6, pj.volF)), cfg.vol)) + ' × usual adjustment ' + cfg.cal) + '">' + pj.mean.toFixed(1) + '</span></div>' +
                '<div class="pmid"><span class="small muted">Likely ' + Math.max(0, Math.round(lo)) + '–' + Math.round(hi) + '</span>' + miniBars(pj, v.line != null && v.line !== '' && isFinite(+v.line) ? +v.line : null, played) + '</div>' +
                '<div class="pin"><label>Line<input type="text" inputmode="decimal" class="pl-line" value="' + esc(v.line == null ? '' : v.line) + '" placeholder="' + modelLine(pj) + '"></label><label>Odds<input type="text" inputmode="numeric" class="pl-odds" value="' + esc(v.odds == null ? '' : v.odds) + '" placeholder="-110"></label></div>' +
                '<div class="pres">' + propResult(pj, v, actual) + '</div></div>';
            }).join('');
            return '<div class="pcard"><div class="phead"><b>' + esc(p.name) + '</b>' + (p.pos ? '<span class="chip">' + esc(p.pos) + '</span>' : '') + '<span class="small muted">' + it.mpg.toFixed(0) + ' min · ' + (it.note ? esc(it.note) : it.cur + (it.cur === 1 ? ' game' : ' games') + ' this season' + (it.prev ? ' + ' + it.prev + ' last season' : '')) + '</span></div>' + rows + '</div>';
          }).join('') + '</div>';
        });
        html += '<h2>How well it’s calibrated</h2><div class="panel"><p class="small soft">Every player game in 2025–26 (41,774 games by players averaging 20+ minutes) was re-predicted from earlier games only. Lines were placed where the model saw a 30%, 50% and 70% chance of the over.</p><div class="tbl-wrap"><table><thead><tr><th class="l">Stat</th><th>Model said over</th><th>Over actually hit</th></tr></thead><tbody>' +
          PROP_CAL.map(function (r) { return '<tr><td class="l">' + r[0] + '</td><td class="num">' + r[1] + '</td><td class="num">' + r[2] + '</td></tr>'; }).join('') +
          '</tbody></table></div><p class="small soft" style="margin-top:10px">The probabilities are honest, but the projections are only about 1% sharper than a plain average of recent games. Early in the season, players lean on last season’s games, which was not part of the test. Treat a “Value” tag as a reason to look closer, not a lock.</p></div>';
        view.innerHTML = html; bindTop(); $('#pGame').value = String(g.id); bindRows(g, logs, before, allow, im, scoredFor, shownPlayers);
        function scoredFor(team) { var a = allowed && allowed[team]; return a && a.games >= 4 && a.scored ? a.scored : (prevAllowed[team] && prevAllowed[team].scored) || null; }
      }, errorView);
    });
    function bindTop() {
      function go(d) { state.date = d; state.props.gid = null; renderProps(); }
      $('#pPrev').addEventListener('click', function () { go(addDays(state.date, -1)); });
      $('#pNext').addEventListener('click', function () { go(addDays(state.date, 1)); });
      $('#pDate').addEventListener('change', function () { if (this.value) go(this.value); });
      var s = $('#pGame'); if (s) s.addEventListener('change', function () { state.props.gid = +this.value; renderProps(); });
    }
  }
  function bindRows(g, logs, before, allow, im, scoredFor, shown) {
    $$('.prow').forEach(function (row) {
      var key = row.getAttribute('data-key'), stat = row.getAttribute('data-stat'), p = shown[row.getAttribute('data-pid')];
      var team = p.team, opp = team === g.homeTeam ? g.awayTeam : g.homeTeam, ip = im ? (team === g.homeTeam ? im.home : im.away) : null;
      var p0 = logs.players[p.id] || p;
      var pj = CP.project(p, stat, { before: before, allowed: allow, opp: opp, impliedPts: ip, teamScored: scoredFor(team) });
      var ag = g.completed ? p0.games.filter(function (x) { return x.gid === g.id; })[0] : null, actual = g.completed ? (ag ? CP.val(ag.r, stat) : null) : null;
      var li = $('.pl-line', row), oi = $('.pl-odds', row), t;
      function upd() {
        var v = { line: li.value.trim().replace('−', '-'), odds: oi.value.trim().replace('−', '-') };
        savePropLine(g.id, key, (v.line || v.odds) ? v : null);
        $('.pres', row).innerHTML = propResult(pj, v, actual);
        var svg = $('svg.mini', row); if (svg) svg.outerHTML = miniBars(pj, v.line !== '' && isFinite(+v.line) ? +v.line : null, p.games.filter(function (x) { return x.t < before; }));
      }
      [li, oi].forEach(function (inp) { inp.addEventListener('input', function () { clearTimeout(t); t = setTimeout(upd, 250); }); });
    });
  }

  /* ---------- settings ---------- */
  function renderSettings() {
    var S = state.settings, left = callsLeft(), size = 0;
    store.keys().forEach(function (k) { try { size += (localStorage.getItem(LS + k) || '').length; } catch (e) { } });
    var h = '<div class="eyebrow">// Settings</div><h1>Settings</h1><p class="lede">Basketball settings are separate from football and saved in this browser only.</p><div class="grid2">';
    h += '<div class="panel"><h3>Data</h3><p class="soft small">Data comes from CollegeBasketballData through a Williams Digital server, so there is no key to enter and the link can be shared. Responses are cached for an hour or more, so extra viewers barely touch the 1,000 free calls a month.</p><p class="small soft" style="margin-top:12px">' + (left != null ? 'Calls left this month: <b>' + left + '</b> · ' : '') + 'cached in this browser: ' + (size / 1048576).toFixed(1) + ' MB</p><div class="keybox"><button class="btn small" id="clearCache" type="button">Clear cached data</button></div></div>';
    h += '<div class="panel"><h3>Signal weights</h3><p class="soft small">How much each signal counts in the blend. Set one to 0 to switch it off. Picks compare the blend <em>without</em> Vegas against the line.</p>' +
      B.COMPONENTS.map(function (c) { return '<div class="wrow"><label for="w_' + c.key + '" data-tip="' + esc(c.src) + '">' + esc(c.label) + '</label><input type="range" min="0" max="50" step="1" id="w_' + c.key + '" value="' + S.weights[c.key] + '"><span class="wv" id="wv_' + c.key + '">' + S.weights[c.key] + '</span></div>'; }).join('') + '</div>';
    function nf(k, label, step, hint) { return '<div style="margin-bottom:12px"><label class="f" for="n_' + k + '">' + esc(label) + '</label><input type="number" id="n_' + k + '" step="' + step + '" value="' + S[k] + '"><div class="small muted" style="margin-top:4px">' + esc(hint) + '</div></div>'; }
    h += '<div class="panel"><h3>Model tuning</h3>' + nf('edgeMin', 'Points off the line before a pick', 0.5, 'Raise it for fewer, stronger picks.') + nf('hfa', 'Home-court advantage (points)', 0.5, 'Fit on 2025–26: 3.5. Not applied at neutral sites.') +
      nf('sigma', 'Spread of outcomes (points)', 0.5, 'Turns a margin into win odds. Vegas misses by about 11.') + nf('carry', 'Share of last season that carries over', 0.05, '2025 → 2026 measured 0.89.') +
      nf('propEdge', 'Prop value threshold (EV %)', 0.5, 'A prop is tagged Value when its expected value is at least this.') + '<div class="keybox" style="margin-top:12px"><button class="btn small" id="resetDefaults" type="button">Reset to defaults</button></div></div>';
    h += '<div class="panel"><h3>How basketball works here</h3><ul class="credits small"><li><b>Same approach as football:</b> the Vegas line is the anchor, independent ratings are blended on a points scale, and picks only appear when they disagree with the line.</li>' +
      '<li><b>Efficiency:</b> points per 100 possessions on offense and defense, scaled by both teams’ tempo, the standard way to rate college basketball teams.</li><li><b>Early season:</b> each team starts from last season’s rating, regressed toward average, and shifts to this season’s numbers over about eight games.</li>' +
      '<li><b>Player props:</b> the same engine as the football props, refit for points, rebounds, assists and made threes.</li><li><b>Data:</b> <a href="https://collegebasketballdata.com" target="_blank" rel="noopener">CollegeBasketballData</a>, the basketball sister site of CollegeFootballData.</li></ul></div>';
    view.innerHTML = h + '</div>';
    $('#clearCache').addEventListener('click', function () { store.keys().forEach(function (k) { if (k.indexOf('c:') === 0) store.del(k); }); mem = {}; state.ctx = {}; state.raw = {}; renderSettings(); });
    B.COMPONENTS.forEach(function (c) { var el = $('#w_' + c.key); el.addEventListener('input', function () { $('#wv_' + c.key).textContent = el.value; }); el.addEventListener('change', function () { S.weights[c.key] = +el.value; saveSettings(); rebuildAll(); }); });
    ['edgeMin', 'hfa', 'sigma', 'carry', 'propEdge'].forEach(function (k) { $('#n_' + k).addEventListener('change', function () { var v = parseFloat(this.value); if (isFinite(v) && (v > 0 || (k === 'hfa' && v === 0))) { S[k] = v; saveSettings(); rebuildAll(); } }); });
    $('#resetDefaults').addEventListener('click', function () { state.settings = Object.assign({}, B.DEFAULTS, { weights: Object.assign({}, B.DEFAULTS.weights), propEdge: 3 }); saveSettings(); rebuildAll(); renderSettings(); });
  }

  /* ---------- router ---------- */
  var VIEWS = { slate: renderSlate, props: renderProps, matchup: renderMatchup, ratings: renderRatings, backtest: renderBacktest, settings: renderSettings };
  function currentView() { var v = (location.hash || '#slate').slice(1); return VIEWS[v] ? v : 'slate'; }
  function route() {
    var v = currentView();
    $$('#nav a').forEach(function (a) { var on = a.getAttribute('data-view') === v; a.classList.toggle('active', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    closeSheet(); VIEWS[v]();
  }
  window.addEventListener('hashchange', function () { route(); window.scrollTo(0, 0); });
  route();
})();
