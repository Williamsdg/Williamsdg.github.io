/* D1Baseball concept — Williams Digital. Vanilla JS, no dependencies. Data comes from data.js (window.D1). */
(function () {
  var D = window.D1 || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var TODAY = '2026-10-03';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function niceDate(iso) { var p = iso.split('-'); var d = new Date(+p[0], +p[1] - 1, +p[2]); return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate(); }

  /* storage (private windows can throw) */
  var store = {
    get: function (k, f) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };
  var myTeams = store.get('d1c-teams', []);
  var myPlayers = store.get('d1c-players', []);

  /* toast */
  var toastEl = $('#toast'), toastT;
  function toast(msg) { if (!toastEl) return; toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 3200); }

  /* overlays */
  function openOv(id) { var o = $('#' + id); if (!o) return; o.classList.add('open'); var f = $('input,button', o); if (f) f.focus(); }
  function closeOv() { $$('.ov.open').forEach(function (o) { o.classList.remove('open'); }); }
  $$('.ov').forEach(function (o) { o.addEventListener('click', function (e) { if (e.target === o) closeOv(); }); });
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', closeOv); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeOv(); var dr = $('#drawer'); if (dr) dr.classList.remove('open'); }
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openOv('search'); }
  });

  /* mobile drawer */
  var drawer = $('#drawer');
  $$('[data-menu]').forEach(function (b) { b.addEventListener('click', function () { drawer.classList.toggle('open'); }); });

  /* search */
  $$('[data-search]').forEach(function (b) { b.addEventListener('click', function () { if (drawer) drawer.classList.remove('open'); openOv('search'); }); });
  var sIn = $('#search-in'), sRes = $('#search-res');
  function teamMatch(q) { return (D.teams || []).filter(function (t) { return t.toLowerCase().indexOf(q) > -1; }).slice(0, 6); }
  function runSearch() {
    var q = sIn.value.trim().toLowerCase();
    if (q.length < 2) { sRes.innerHTML = '<p class="meta" style="padding:14px 4px">Type a team, a writer or a headline. Try “Auburn”, “Rogers” or “portal”.</p>'; return; }
    var h = '';
    var t = teamMatch(q);
    if (t.length) h += '<h4>Teams</h4>' + t.map(function (n) { var c = (D.exhibitions || []).filter(function (g) { return g.a === n || g.h === n; }).length; return '<a href="fall-ball.html?team=' + encodeURIComponent(n) + '">' + esc(n) + '<small>' + (c ? c + ' fall exhibition' + (c > 1 ? 's' : '') + ' on the schedule' : 'Team hub') + '</small></a>'; }).join('');
    var w = (D.writers || []).filter(function (x) { return x.name.toLowerCase().indexOf(q) > -1; }).slice(0, 5);
    if (w.length) h += '<h4>Writers</h4>' + w.map(function (x) { return '<a href="' + x.href + '"' + (x.ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(x.name) + '<small>' + esc(x.role) + '</small></a>'; }).join('');
    var s = (D.stories || []).filter(function (x) { return x.t.toLowerCase().indexOf(q) > -1; }).slice(0, 8);
    if (s.length) h += '<h4>Stories</h4>' + s.map(function (x) { return '<a href="' + x.u + '"' + (x.ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(x.t) + '<small>' + esc(x.a) + ' · ' + esc(x.d) + '</small></a>'; }).join('');
    sRes.innerHTML = h || '<p class="meta" style="padding:14px 4px">Nothing matches “' + esc(sIn.value) + '”.</p>';
  }
  if (sIn) { sIn.addEventListener('input', runSearch); runSearch(); }

  /* My Teams picker */
  var tp = $('#tpick'), tpIn = $('#tpick-in'), tpCount = $('#tpick-count');
  function drawPicker() {
    if (!tp) return;
    var q = (tpIn.value || '').trim().toLowerCase();
    var list = (D.teams || []).filter(function (t) { return !q || t.toLowerCase().indexOf(q) > -1; });
    list.sort(function (a, b) { return (myTeams.indexOf(b) > -1) - (myTeams.indexOf(a) > -1) || a.localeCompare(b); });
    tp.innerHTML = list.map(function (t) { return '<button type="button" aria-pressed="' + (myTeams.indexOf(t) > -1) + '" data-t="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') || '<p class="meta">No team by that name.</p>';
    tpCount.textContent = myTeams.length ? myTeams.length + ' team' + (myTeams.length > 1 ? 's' : '') + ' followed' : 'Pick as many as you like';
  }
  if (tp) {
    tp.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var t = b.getAttribute('data-t'), i = myTeams.indexOf(t);
      if (i > -1) myTeams.splice(i, 1); else myTeams.push(t);
      store.set('d1c-teams', myTeams); b.setAttribute('aria-pressed', i === -1);
      tpCount.textContent = myTeams.length ? myTeams.length + ' team' + (myTeams.length > 1 ? 's' : '') + ' followed' : 'Pick as many as you like';
      refresh();
    });
    tpIn.addEventListener('input', drawPicker);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-teams]'); if (!b) return;
    if (drawer) drawer.classList.remove('open'); if (tpIn) tpIn.value = ''; drawPicker(); openOv('teams');
  });

  function gamesFor(team, onlyUpcoming) { return (D.exhibitions || []).filter(function (g) { return (g.a === team || g.h === team) && (!onlyUpcoming || g.d >= TODAY); }); }
  function storiesFor(name) {
    var q = function (x) { return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
    var re = new RegExp('(^|[^A-Za-z])' + q(name) + '([^A-Za-z&]|$)');
    var longer = (D.teams || []).filter(function (t) { return t !== name && t.indexOf(name) > -1; });
    return (D.stories || []).filter(function (s) { var t = s.t; longer.forEach(function (l) { t = t.split(l).join(' '); }); return re.test(t); });
  }

  /* home: My Teams band */
  function drawMyTeams() {
    var el = $('#myteams'); if (!el) return;
    if (!myTeams.length) {
      el.innerHTML = '<div class="mt-empty"><p>Follow a few teams and players once. The homepage, the fall schedule, the portal tracker and the recruiting map all sort themselves around them, and your watchlist gathers everything in one feed.</p><button class="btn btn-lime" data-teams>Pick your teams</button></div>';
      return;
    }
    el.innerHTML = '<div class="mt-grid">' + myTeams.map(function (t) {
      var g = gamesFor(t, true).slice(0, 3), s = storiesFor(t).slice(0, 3);
      return '<div class="mt-card"><h3>' + esc(t) + '</h3><div class="lbl">Next fall exhibitions</div><ul>' +
        (g.length ? g.map(function (x) { return '<li><b>' + niceDate(x.d).replace(/^\w+, /, '') + '</b> · ' + esc(x.a === t ? 'at ' + x.h : 'vs. ' + x.a) + '</li>'; }).join('') : '<li class="none">None left on the fall schedule</li>') +
        '</ul><div class="lbl">In the headlines</div><ul>' +
        (s.length ? s.map(function (x) { return '<li><a href="' + x.u + '"' + (x.ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(x.t) + '</a></li>'; }).join('') : '<li class="none">No headline mentions this week</li>') +
        '</ul></div>';
    }).join('') + '</div><p style="margin:16px 0 0;display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-lime" href="watchlist.html">Open my watchlist</a><button class="btn btn-ghost" data-teams style="color:#fff">Edit teams</button></p>';
  }

  /* home: wire */
  (function () {
    var w = $('#wire'); if (!w) return;
    var g = (D.exhibitions || []).filter(function (x) { return x.d === TODAY; });
    w.innerHTML = g.map(function (x) { return '<span>' + esc(x.a) + ' <i>at</i> ' + esc(x.h) + '</span>'; }).join('');
    var c = $('#wire-count'); if (c) c.textContent = g.length;
  })();

  /* fall ball finder */
  var fb = $('#fb-list');
  var fbState = { q: '', month: '', st: '', mine: false, past: false, shown: 6 };
  function drawFB() {
    if (!fb) return;
    var q = fbState.q.toLowerCase();
    var rows = (D.exhibitions || []).filter(function (g) {
      if (!fbState.past && g.d < TODAY) return false;
      if (fbState.month && g.d.slice(5, 7) !== fbState.month) return false;
      if (fbState.st && g.s !== fbState.st) return false;
      if (fbState.mine && myTeams.indexOf(g.a) === -1 && myTeams.indexOf(g.h) === -1) return false;
      if (q && (g.a + ' ' + g.h + ' ' + g.l).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    var days = {}, order = [];
    rows.forEach(function (g) { if (!days[g.d]) { days[g.d] = []; order.push(g.d); } days[g.d].push(g); });
    order.sort();
    $('#fb-count').innerHTML = '<b>' + rows.length + '</b> of ' + D.exhibitions.length + ' exhibitions' + (fbState.mine ? ' for your watchlist' : '') + ' · ' + order.length + ' day' + (order.length === 1 ? '' : 's');
    var show = order.slice(0, fbState.shown);
    fb.innerHTML = show.map(function (d) {
      return '<div class="day"><h3>' + niceDate(d) + (d === TODAY ? ' <em>Today</em>' : '') + '<small>' + days[d].length + ' game' + (days[d].length > 1 ? 's' : '') + '</small></h3>' +
        days[d].map(function (g) { return '<div class="game"><div class="m">' + esc(g.a) + '<i>at</i>' + esc(g.h) + '</div><div class="loc">' + esc(g.l) + '</div><button class="cal" data-ics="' + g.i + '" aria-label="Add ' + esc(g.a) + ' at ' + esc(g.h) + ' to your calendar">+ Calendar</button></div>'; }).join('') + '</div>';
    }).join('') || '<p class="meta" style="padding:26px 0">No exhibitions match. ' + (fbState.mine && !myTeams.length ? 'You have not picked any teams yet.' : 'Try clearing a filter.') + '</p>';
    var more = $('#fb-more'); more.hidden = order.length <= fbState.shown;
    more.textContent = 'Show ' + Math.min(6, order.length - fbState.shown) + ' more days';
  }
  if (fb) {
    var p = new URLSearchParams(location.search);
    if (p.get('team')) { fbState.q = p.get('team'); $('#fb-q').value = fbState.q; fbState.past = true; $('#fb-past').setAttribute('aria-pressed', 'true'); }
    $('#fb-q').addEventListener('input', function (e) { fbState.q = e.target.value; fbState.shown = 6; drawFB(); });
    $('#fb-month').addEventListener('change', function (e) { fbState.month = e.target.value; fbState.shown = 6; drawFB(); });
    $('#fb-st').addEventListener('change', function (e) { fbState.st = e.target.value; fbState.shown = 6; drawFB(); });
    $('#fb-mine').addEventListener('click', function (e) { fbState.mine = !fbState.mine; e.currentTarget.setAttribute('aria-pressed', fbState.mine); if (fbState.mine && !myTeams.length) { drawPicker(); openOv('teams'); } drawFB(); });
    $('#fb-past').addEventListener('click', function (e) { fbState.past = !fbState.past; e.currentTarget.setAttribute('aria-pressed', fbState.past); drawFB(); });
    $('#fb-more').addEventListener('click', function () { fbState.shown += 6; drawFB(); });
    fb.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ics]'); if (!b) return;
      var g = D.exhibitions[+b.getAttribute('data-ics')], d = g.d.replace(/-/g, '');
      var nd = new Date(+g.d.slice(0, 4), +g.d.slice(5, 7) - 1, +g.d.slice(8) + 1);
      var end = nd.getFullYear() + ('0' + (nd.getMonth() + 1)).slice(-2) + ('0' + nd.getDate()).slice(-2);
      var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//D1Baseball concept//EN', 'BEGIN:VEVENT', 'UID:d1c-' + g.i + '@williamsdigital.io', 'DTSTAMP:20261003T000000Z', 'DTSTART;VALUE=DATE:' + d, 'DTEND;VALUE=DATE:' + end, 'SUMMARY:' + g.a + ' at ' + g.h + ' (fall exhibition)', 'LOCATION:' + g.l.replace(/,/g, '\\,'), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = (g.a + '-at-' + g.h).replace(/[^A-Za-z0-9]+/g, '-').toLowerCase() + '.ics';
      document.body.appendChild(a); a.click(); a.remove(); toast('Calendar file downloaded: ' + g.a + ' at ' + g.h);
    });
  }

  /* portal tracker (demo rows) */
  var pt = $('#pt-body');
  var ptState = { q: '', pos: '', status: '', mine: false, sub: false };
  function drawPT() {
    if (!pt) return;
    var q = ptState.q.toLowerCase();
    var rows = (D.portal || []).filter(function (r) {
      if (ptState.pos && r.p !== ptState.pos) return false;
      if (ptState.status && r.s !== ptState.status) return false;
      if (ptState.mine && myTeams.indexOf(r.f) === -1 && myTeams.indexOf(r.to) === -1) return false;
      if (q && (r.n + ' ' + r.f + ' ' + r.to).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    var tr = function (r) { return '<tr><td class="stick">' + esc(r.n) + '</td><td>' + r.p + '</td><td>' + r.c + '</td><td>' + esc(r.f) + '</td><td>' + (r.to ? esc(r.to) : '<span class="no">Uncommitted</span>') + '</td><td>' + r.s + '</td><td class="n">' + r.d + '</td></tr>'; };
    var head = '<thead><tr><th class="stick">Player</th><th>Pos</th><th>Class</th><th>From</th><th>To</th><th>Status</th><th class="n">Updated</th></tr></thead>';
    var free = 8;
    $('#pt-count').innerHTML = '<b>' + rows.length + '</b> of ' + D.portal.length + ' demo entries' + (ptState.mine ? ' touching your watchlist' : '');
    if (ptState.sub || rows.length <= free) {
      pt.innerHTML = '<div class="tbl-wrap"><table class="t">' + head + '<tbody>' + (rows.map(tr).join('') || '<tr><td colspan="7">No entries match.</td></tr>') + '</tbody></table></div>';
    } else {
      pt.innerHTML = '<div class="tbl-wrap"><table class="t">' + head + '<tbody>' + rows.slice(0, free).map(tr).join('') + '</tbody></table></div>' +
        '<div class="gate"><div class="blur" aria-hidden="true"><table class="t"><tbody>' + rows.slice(free, free + 8).map(tr).join('') + '</tbody></table></div>' +
        '<div class="gate-card"><h3>' + (rows.length - free) + ' more moves behind this line</h3><p>Subscribers get the full tracker, filters by team and position, and an alert when a team they follow gains or loses a player.</p>' +
        '<div class="gate-plans"><a class="best" href="subscribe.html"><b>$139.99</b><span>a year · most popular</span></a><a href="subscribe.html"><b>$15.99</b><span>a month · cancel anytime</span></a></div>' +
        '<small>Already a subscriber? <a href="#" data-sub>Log in</a></small></div></div>';
    }
  }
  if (pt) {
    $('#pt-q').addEventListener('input', function (e) { ptState.q = e.target.value; drawPT(); });
    $('#pt-pos').addEventListener('change', function (e) { ptState.pos = e.target.value; drawPT(); });
    $('#pt-status').addEventListener('change', function (e) { ptState.status = e.target.value; drawPT(); });
    $('#pt-mine').addEventListener('click', function (e) { ptState.mine = !ptState.mine; e.currentTarget.setAttribute('aria-pressed', ptState.mine); if (ptState.mine && !myTeams.length) { drawPicker(); openOv('teams'); } drawPT(); });
    var setSub = function (v) { ptState.sub = v; $$('#pt-view button').forEach(function (b) { b.setAttribute('aria-pressed', (b.getAttribute('data-v') === 'sub') === v); }); drawPT(); };
    $$('#pt-view button').forEach(function (b) { b.addEventListener('click', function () { setSub(b.getAttribute('data-v') === 'sub'); }); });
    pt.addEventListener('click', function (e) { if (e.target.closest('[data-sub]')) { e.preventDefault(); setSub(true); toast('Viewing as a subscriber'); } });
  }

  /* sortable tables */
  $$('table[data-sort]').forEach(function (tb) {
    var body = tb.tBodies[0];
    tb.tHead.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var th = b.parentNode, i = Array.prototype.indexOf.call(th.parentNode.children, th);
      var dir = b.getAttribute('aria-sort') === 'descending' ? 'ascending' : 'descending';
      $$('button', tb.tHead).forEach(function (x) { x.removeAttribute('aria-sort'); x.lastChild.textContent = ''; });
      b.setAttribute('aria-sort', dir); b.lastChild.textContent = dir === 'descending' ? ' ▼' : ' ▲';
      var rows = Array.prototype.slice.call(body.rows);
      rows.sort(function (a, c) {
        var x = a.cells[i].textContent.trim(), y = c.cells[i].textContent.trim(), nx = parseFloat(x), ny = parseFloat(y), r;
        r = (isNaN(nx) || isNaN(ny)) ? x.localeCompare(y) : nx - ny;
        return dir === 'descending' ? -r : r;
      });
      rows.forEach(function (r) { body.appendChild(r); });
    });
  });
  var lbq = $('#lb-q');
  if (lbq) lbq.addEventListener('input', function () { var q = lbq.value.toLowerCase(); $$('#lb tbody tr').forEach(function (r) { r.hidden = r.cells[1].textContent.toLowerCase().indexOf(q) === -1; }); });

  /* author page filter */
  var af = $('#au-filters');
  if (af) af.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    $$('button', af).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    var k = b.getAttribute('data-k'), n = 0;
    $$('#au-list .row').forEach(function (r) { var on = !k || r.getAttribute('data-k') === k; r.hidden = !on; if (on) n++; });
    $('#au-count').textContent = n;
  });
  var fol = $('#follow');
  if (fol) {
    var f = store.get('d1c-follow', []);
    var paint = function () { var on = f.indexOf('kendall-rogers') > -1; fol.textContent = on ? 'Following ✓' : 'Follow Kendall'; fol.setAttribute('aria-pressed', on); };
    fol.addEventListener('click', function () { var i = f.indexOf('kendall-rogers'); if (i > -1) f.splice(i, 1); else f.push('kendall-rogers'); store.set('d1c-follow', f); paint(); toast(i > -1 ? 'Unfollowed' : 'You would get an email when Kendall publishes'); });
    paint();
  }

  /* subscribe toggle */
  var bill = $('#bill');
  if (bill) bill.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var yr = b.getAttribute('data-b') === 'y';
    $$('button', bill).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    $$('[data-y]').forEach(function (el) { el.textContent = el.getAttribute(yr ? 'data-y' : 'data-m'); });
  });

  /* newsletter (concept: nothing is sent) */
  $$('form[data-nl]').forEach(function (fm) {
    fm.addEventListener('submit', function (e) { e.preventDefault(); var i = $('input', fm); if (!/^\S+@\S+\.\S+$/.test(i.value)) { toast('Enter a valid email address'); i.focus(); return; } i.value = ''; toast('Concept only: nothing was sent or saved.'); });
  });

  /* copy link */
  $$('[data-copy]').forEach(function (b) { b.addEventListener('click', function () { var done = function () { toast('Link copied'); }; if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done); else done(); }); });

  /* US map: shades states by a count and reports taps */
  function drawMap(box, counts, sel, onPick) {
    if (!box || !window.US_PATHS) return;
    if (!box.firstChild) {
      box.innerHTML = '<svg viewBox="0 0 960 600" role="img" aria-label="' + esc(box.getAttribute('aria-label') || 'Map') + '">' + window.US_PATHS + '</svg>';
      box.addEventListener('click', function (e) { var s = e.target.closest('[data-st]'); if (s) box._pick(s.getAttribute('data-st')); });
    }
    box._pick = onPick;
    var max = 1, k; for (k in counts) if (counts[k] > max) max = counts[k];
    $$('[data-st]', box).forEach(function (el) {
      var c = counts[el.getAttribute('data-st')] || 0, st = el.getAttribute('data-st');
      el.style.fill = c ? 'rgba(6,81,134,' + (0.22 + 0.78 * Math.sqrt(c / max)).toFixed(2) + ')' : '#e4e0d4';
      el.style.stroke = st === sel ? '#00d26a' : '#fff'; el.style.strokeWidth = st === sel ? 4 : 1;
      el.style.cursor = c ? 'pointer' : 'default';
      var t = el.querySelector('title'); if (!t) { t = document.createElementNS('http://www.w3.org/2000/svg', 'title'); el.appendChild(t); }
      t.textContent = st + ': ' + c;
    });
  }

  /* fall ball map (real counts) */
  var fbPostal = '';
  function drawFBMap() {
    var box = $('#fb-map'); if (!box) return;
    var counts = {}; (D.exhibitions || []).forEach(function (g) { if (g.p && (fbState.past || g.d >= TODAY)) counts[g.p] = (counts[g.p] || 0) + 1; });
    drawMap(box, counts, fbPostal, function (st) {
      var g = (D.exhibitions || []).filter(function (x) { return x.p === st; })[0]; if (!g) return;
      fbPostal = fbPostal === st ? '' : st; fbState.st = fbPostal ? g.s : ''; $('#fb-st').value = fbState.st; fbState.shown = 6; drawFB(); drawFBMap();
    });
  }
  if ($('#fb-st')) $('#fb-st').addEventListener('change', function () { var g = (D.exhibitions || []).filter(function (x) { return x.s === fbState.st; })[0]; fbPostal = g ? g.p : ''; drawFBMap(); });
  if ($('#fb-past')) $('#fb-past').addEventListener('click', drawFBMap);

  /* recruiting map (sample commitments) */
  var rcState = { st: '', school: '', cls: '', mine: false };
  function drawRC() {
    var body = $('#rc-body'); if (!body) return;
    var base = (D.commits || []).filter(function (c) { return (!rcState.school || c.to === rcState.school) && (!rcState.cls || c.y === rcState.cls) && (!rcState.mine || myTeams.indexOf(c.to) > -1); });
    var counts = {}; base.forEach(function (c) { counts[c.st] = (counts[c.st] || 0) + 1; });
    var rows = base.filter(function (c) { return !rcState.st || c.st === rcState.st; });
    drawMap($('#rc-map'), counts, rcState.st, function (st) { rcState.st = rcState.st === st ? '' : st; drawRC(); });
    $('#rc-clear').hidden = !rcState.st; $('#rc-clear').textContent = 'Clear state: ' + rcState.st;
    $('#rc-count').innerHTML = '<b>' + rows.length + '</b> sample commitment' + (rows.length === 1 ? '' : 's') + (rcState.st ? ' from ' + rcState.st : '') + (rcState.school ? ' to ' + esc(rcState.school) : '');
    body.innerHTML = rows.map(function (c) { return '<tr><td class="stick">' + c.n + '</td><td>' + c.p + '</td><td>' + c.y + '</td><td>' + c.st + '</td><td>' + esc(c.to) + '</td></tr>'; }).join('') || '<tr><td colspan="5">No sample commitments match' + (rcState.mine && !myTeams.length ? '. Your watchlist has no teams yet.' : '.') + '</td></tr>';
  }
  if ($('#rc-body')) {
    $('#rc-school').addEventListener('change', function (e) { rcState.school = e.target.value; drawRC(); });
    $('#rc-class').addEventListener('change', function (e) { rcState.cls = e.target.value; drawRC(); });
    $('#rc-mine').addEventListener('click', function (e) { rcState.mine = !rcState.mine; e.currentTarget.setAttribute('aria-pressed', rcState.mine); drawRC(); });
    $('#rc-clear').addEventListener('click', function () { rcState.st = ''; drawRC(); });
  }

  /* follow players */
  function togglePlayer(n) { var i = myPlayers.indexOf(n); if (i > -1) myPlayers.splice(i, 1); else myPlayers.push(n); store.set('d1c-players', myPlayers); refresh(); return i === -1; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-fp]'); if (b) { var on = togglePlayer(b.getAttribute('data-fp')); toast(on ? b.getAttribute('data-fp') + ' added to your watchlist' : 'Removed from your watchlist'); return; }
    var r = e.target.closest('[data-rm-team]'); if (r) { myTeams.splice(myTeams.indexOf(r.getAttribute('data-rm-team')), 1); store.set('d1c-teams', myTeams); refresh(); return; }
    var q = e.target.closest('[data-add-team]'); if (q) { if (myTeams.indexOf(q.getAttribute('data-add-team')) === -1) myTeams.push(q.getAttribute('data-add-team')); store.set('d1c-teams', myTeams); refresh(); }
  });

  /* watchlist page */
  function drawWL() {
    var feed = $('#wl-feed'); if (!feed) return;
    $('#wl-teams').innerHTML = myTeams.map(function (t) { return '<button class="chip" data-rm-team="' + esc(t) + '" aria-label="Remove ' + esc(t) + '">' + esc(t) + ' ✕</button>'; }).join('') || '<span class="meta">No teams yet.</span>';
    $('#wl-players').innerHTML = myPlayers.map(function (n) { return '<button class="chip" data-fp="' + esc(n) + '">' + esc(n) + ' ✕</button>'; }).join('') || '<span class="meta">No players yet.</span>';
    if (!myTeams.length && !myPlayers.length) {
      feed.innerHTML = '<div class="idea"><h3>Start with a team or two</h3><p>Tap any of these to follow it. Your feed fills in straight away.</p><div class="chips" style="margin-top:12px">' +
        (D.top25 || []).slice(0, 10).map(function (t) { return '<button class="chip" data-add-team="' + esc(t) + '">+ ' + esc(t) + '</button>'; }).join('') + '</div>' +
        '<p style="margin-top:14px">Or a player from the Synergy leaderboard:</p><div class="chips" style="margin-top:8px">' +
        (D.players || []).slice(0, 5).map(function (p) { return '<button class="chip" data-fp="' + esc(p.n) + '">+ ' + esc(p.n) + '</button>'; }).join('') + '</div></div>';
      $('#wl-n').textContent = ''; drawPush(); return;
    }
    var h = '', n = 0;
    myTeams.forEach(function (t) {
      var g = gamesFor(t, true).slice(0, 4), s = storiesFor(t).slice(0, 5), rk = (D.top25 || []).indexOf(t);
      var moves = (D.portal || []).filter(function (r) { return r.f === t || r.to === t; }).slice(0, 3);
      n += g.length + s.length;
      h += '<div class="wl-block"><h3>' + esc(t) + (rk > -1 ? ' <span class="badge sub">No. ' + (rk + 1) + ' · May 25 poll</span>' : '') + '</h3>' +
        '<div class="lbl">Coverage</div>' + (s.length ? s.map(function (x) { return '<a class="wl-item" href="' + x.u + '"' + (x.ext ? ' target="_blank" rel="noopener"' : '') + '><b>' + esc(x.t) + '</b><span>' + esc(x.a) + ' · ' + esc(x.d) + '</span></a>'; }).join('') : '<p class="meta">No headline has mentioned ' + esc(t) + ' in the last 144 stories.</p>') +
        '<div class="lbl">Next on the fall schedule</div>' + (g.length ? g.map(function (x) { return '<div class="wl-item"><b>' + niceDate(x.d) + ' · ' + esc(x.a === t ? 'at ' + x.h : 'vs. ' + x.a) + '</b><span>' + esc(x.l) + '</span></div>'; }).join('') : '<p class="meta">No exhibitions left on the list.</p>') +
        (moves.length ? '<div class="lbl">Portal moves <span class="badge extra">Demo rows</span></div>' + moves.map(function (r) { return '<div class="wl-item"><b>' + r.n + ' · ' + r.p + '</b><span>' + esc(r.f) + ' → ' + (r.to ? esc(r.to) : 'uncommitted') + ' · ' + r.d + '</span></div>'; }).join('') : '') + '</div>';
    });
    myPlayers.forEach(function (name) {
      var p = (D.players || []).filter(function (x) { return x.n === name; })[0]; if (!p) return;
      var s = storiesFor(name).slice(0, 3); n += 1 + s.length;
      h += '<div class="wl-block"><h3>' + esc(p.n) + ' <span class="badge sub">' + esc(p.t) + '</span></h3><div class="lbl">Where he stands</div>' +
        '<a class="wl-item" href="rankings.html#synergy"><b>No. ' + p.r + ' nationally in Contact% · ' + p.v + '</b><span>Synergy leaderboard, 2026 season, all pitch types</span></a>' +
        '<div class="lbl">Coverage</div>' + (s.length ? s.map(function (x) { return '<a class="wl-item" href="' + x.u + '"' + (x.ext ? ' target="_blank" rel="noopener"' : '') + '><b>' + esc(x.t) + '</b><span>' + esc(x.a) + ' · ' + esc(x.d) + '</span></a>'; }).join('') : '<p class="meta">No headline mentions yet. You would hear the moment one is published.</p>') + '</div>';
    });
    feed.innerHTML = h; $('#wl-n').textContent = n + ' updates'; drawPush();
  }
  function drawPush() {
    var box = $('#wl-push'); if (!box) return;
    var prefs = store.get('d1c-alerts', {}), any = false; $$('#wl-alerts input').forEach(function (i) { i.checked = !!prefs[i.getAttribute('data-a')]; any = any || i.checked; });
    var t = myTeams[0], s = t ? storiesFor(t)[0] : null, g = t ? gamesFor(t, true)[0] : null;
    box.hidden = !(any && t && (s || g));
    if (box.hidden) return;
    if (prefs.story && s) { $('#wl-push-t').textContent = 'New on ' + t; $('#wl-push-b').textContent = s.t; }
    else if (g) { $('#wl-push-t').textContent = t + ' plays ' + niceDate(g.d); $('#wl-push-b').textContent = (g.a === t ? 'At ' + g.h : 'Hosting ' + g.a) + ' · ' + g.l; }
    else { $('#wl-push-t').textContent = 'New on ' + t; $('#wl-push-b').textContent = s.t; }
  }
  var wa = $('#wl-alerts');
  if (wa) wa.addEventListener('change', function () { var p = {}; $$('input', wa).forEach(function (i) { p[i.getAttribute('data-a')] = i.checked; }); store.set('d1c-alerts', p); drawPush(); toast('Alert choices saved in this browser'); });
  var pq = $('#wl-pq');
  if (pq) pq.addEventListener('input', function () { var q = pq.value.trim().toLowerCase(); $('#wl-pres').innerHTML = q.length < 2 ? '' : ((D.players || []).filter(function (p) { return (p.n + ' ' + p.t).toLowerCase().indexOf(q) > -1; }).slice(0, 6).map(function (p) { return '<a href="#" data-fp="' + esc(p.n) + '" data-keep>' + esc(p.n) + '<small>' + esc(p.t) + ' · ' + p.v + ' Contact%</small></a>'; }).join('') || '<p class="meta" style="padding:8px 0">No player by that name on the leaderboard.</p>'); });
  document.addEventListener('click', function (e) { if (e.target.closest('a[data-fp]')) e.preventDefault(); });

  /* projection board: light up followed teams */
  function drawReg() { $$('.reg').forEach(function (r) { r.classList.toggle('mine', myTeams.indexOf(r.getAttribute('data-team')) > -1); }); }

  function refresh() {
    drawMyTeams(); drawFB(); drawFBMap(); drawPT(); drawRC(); drawWL(); drawReg(); paintFollowSafe();
    var n = $('#mt-n'), c = myTeams.length + myPlayers.length; if (n) n.textContent = c ? ' (' + c + ')' : '';
  }
  function paintFollowSafe() { $$('table [data-fp]').forEach(function (b) { var on = myPlayers.indexOf(b.getAttribute('data-fp')) > -1; b.setAttribute('aria-pressed', on); b.textContent = on ? 'Following ✓' : 'Follow'; }); }
  refresh();
})();
