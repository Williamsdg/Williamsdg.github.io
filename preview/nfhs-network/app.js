/* NFHS Network concept — shared behaviour. No build step, no dependencies. */
(function () {
  'use strict';
  var D = window.NFHS_DATA || { events: [], schools: {}, meta: { totals: {} }, hoover: null };
  var LIVE_SITE = 'https://www.nfhsnetwork.com';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var nf = function (n) { return Number(n || 0).toLocaleString('en-US'); };
  var norm = function (s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); };

  /* ---------- time, always in the viewer's own zone ---------- */
  var tFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
  var dFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  var tzName = (function () {
    try {
      var p = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(new Date(D.meta.snapshot || Date.now()));
      for (var i = 0; i < p.length; i++) if (p[i].type === 'timeZoneName') return p[i].value;
    } catch (e) {}
    return 'local time';
  })();
  function clock(iso) {
    var parts = tFmt.formatToParts(new Date(iso)), h = '', ap = '';
    parts.forEach(function (p) {
      if (p.type === 'hour' || p.type === 'minute' || (p.type === 'literal' && p.value.trim() === ':')) h += p.value;
      if (p.type === 'dayPeriod') ap = p.value;
    });
    return { h: h, ap: ap, text: h + ' ' + ap };
  }
  var day = function (iso) { return dFmt.format(new Date(iso)); };
  function runtime(sec) {
    if (!sec) return '';
    var m = Math.round(sec / 60);
    return m >= 60 ? Math.floor(m / 60) + 'h ' + (m % 60) + 'm' : m + ' min';
  }
  function mmss(sec) {
    var s = Math.round(sec || 0);
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  /* ---------- school-colour swatch ---------- */
  function initials(n) {
    var w = String(n || '?').replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
    return (w.length > 1 ? w[0][0] + w[1][0] : (w[0] || '?').slice(0, 2)).toUpperCase();
  }
  function mark(t) {
    return t.l ? '<img src="img/logos/' + t.l + '.png" alt="" loading="lazy" width="64" height="64">' : '<i>' + esc(initials(t.n)) + '</i>';
  }
  function swatch(teams, extra) {
    var a = teams[0] || {}, b = teams[1];
    var c1 = a.c || '#3a4150', c2 = b ? (b.c || '#566076') : c1;
    var bg = b
      ? 'linear-gradient(105deg,' + c1 + ' calc(50% - 1px),rgba(10,12,17,.55) calc(50% - 1px),rgba(10,12,17,.55) calc(50% + 1px),' + c2 + ' calc(50% + 1px))'
      : c1;
    return '<span class="sw' + (b ? '' : ' solo') + '" style="background:' + bg + '" aria-hidden="true">' +
      mark(a) + (b ? mark(b) : '') + (extra || '') + '</span>';
  }

  /* ---------- event helpers ---------- */
  // a listing with no named opponent still belongs to its host school
  function sides(e) { return e.t.length ? e.t : [D.schools[e.hs] || { n: 'Game' }]; }
  function matchup(e) {
    var t = sides(e);
    return t.length > 1 ? esc(t[0].n) + ' <em>vs</em> ' + esc(t[1].n) : esc(t[0].n);
  }
  function kind(e) {
    return [e.lv, e.sp === 'Football' ? '' : e.g, e.sp].filter(Boolean).join(' ');
  }
  function place(e) { return [e.city, e.st].filter(Boolean).join(', '); }
  function cta(e) {
    if (e.s === 'live') return '<span class="cta live">Watch live</span>';
    if (e.s === 'vod') return '<span class="cta">Replay' + (e.dur ? ' · ' + runtime(e.dur) : '') + '</span>';
    return '<span class="cta">Details</span>';
  }
  function row(e, withWhen) {
    var bits = [];
    if (withWhen) bits.push(e.s === 'live' ? 'Live now' : day(e.d) + ' · ' + clock(e.d).text);
    bits.push(kind(e));
    if (e.t.length < 2) bits.push(e.mt ? 'Multi-team event' : 'Opponent TBA');
    if (place(e)) bits.push(place(e));
    return '<a class="row" href="' + esc(e.u) + '" target="_blank" rel="noopener">' + swatch(sides(e)) +
      '<span><h3>' + matchup(e) + '</h3><p>' + esc(bits.join(' · ')) + '</p></span>' + cta(e) + '</a>';
  }
  function tile(e) {
    return '<a class="tile" href="' + esc(e.u) + '" target="_blank" rel="noopener">' +
      swatch(sides(e), '<span class="badge"><span class="dot"></span>LIVE</span>') +
      '<h3>' + matchup(e) + '</h3><p>' + esc(kind(e) + (place(e) ? ' · ' + place(e) : '')) + '</p></a>';
  }

  function filterEvents(f) {
    var q = norm(f.q);
    return D.events.filter(function (e) {
      if (f.tab && e.s !== f.tab) return false;
      if (f.sport && e.sp !== f.sport) return false;
      if (f.state && e.st !== f.state) return false;
      if (f.level && e.lv !== f.level) return false;
      if (q) {
        var hay = norm(e.t.map(function (t) { return t.n; }).join(' ') + ' ' + e.city + ' ' + e.st + ' ' + e.sp);
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
  }

  /* The slate: games grouped under the time they start, like a broadcast rundown. */
  function slateHTML(list, tab, limit) {
    if (tab === 'vod') list = list.slice().reverse();
    var shown = limit ? list.slice(0, limit) : list, groups = [], by = {};
    shown.forEach(function (e) {
      var key = tab === 'live' ? 'live' : tab === 'vod' ? day(e.d) : day(e.d) + '|' + clock(e.d).text;
      if (!by[key]) { by[key] = { e: e, rows: [] }; groups.push(by[key]); }
      by[key].rows.push(e);
    });
    return groups.map(function (g) {
      var head;
      if (tab === 'live') head = '<span class="now"><span class="dot"></span>On now</span><span>' + nf(list.length) + ' in this preview</span>';
      else if (tab === 'vod') head = '<b>' + esc(day(g.e.d).split(', ')[1] || day(g.e.d)) + '</b><span>' + esc(day(g.e.d).split(', ')[0]) + ' · on demand</span>';
      else { var c = clock(g.e.d); head = '<b class="num">' + c.h + '<small>' + c.ap + '</small></b><span>' + esc(day(g.e.d)) + '</span>'; }
      return '<div class="slot"><div class="slot-time">' + head + '</div><div class="rows">' +
        g.rows.map(function (e) { return row(e, tab === 'vod'); }).join('') + '</div></div>';
    }).join('');
  }

  /* ---------- follows (per-browser convenience only) ---------- */
  var follows = {
    get: function () { try { return JSON.parse(localStorage.getItem('nfhs-follow') || '[]'); } catch (e) { return []; } },
    set: function (a) { try { localStorage.setItem('nfhs-follow', JSON.stringify(a)); } catch (e) {} },
    has: function (s) { return this.get().indexOf(s) > -1; },
    toggle: function (s) { var a = this.get(), i = a.indexOf(s); if (i > -1) a.splice(i, 1); else a.push(s); this.set(a); return i < 0; }
  };
  function eventsFor(slug) {
    var s = D.schools[slug]; if (!s) return [];
    return D.events.filter(function (e) {
      return e.hs === slug || (e.st === s.st && e.t.some(function (t) { return t.n === s.n; }));
    });
  }

  /* ---------- school finder ---------- */
  var schoolList = Object.keys(D.schools).map(function (slug) {
    var s = D.schools[slug];
    return { slug: slug, s: s, hay: norm(s.n + ' ' + (s.city || '') + ' ' + s.st) };
  }).sort(function (a, b) { return a.s.n.localeCompare(b.s.n); });

  function finder(root, onPick) {
    var input = $('input', root), list = $('.finder-list', root), active = -1, hits = [];
    function close() { list.hidden = true; input.setAttribute('aria-expanded', 'false'); active = -1; }
    function paint() {
      var q = norm(input.value);
      if (!q) { close(); return; }
      hits = schoolList.filter(function (x) { return x.hay.indexOf(q) > -1; })
        .sort(function (a, b) { return (a.hay.indexOf(q) === 0 ? 0 : 1) - (b.hay.indexOf(q) === 0 ? 0 : 1); }).slice(0, 7);
      list.innerHTML = hits.length ? hits.map(function (x, i) {
        return '<li role="option" id="' + root.id + '-o' + i + '"><a href="school.html?s=' + esc(x.slug) + '" data-i="' + i + '"' + (i === active ? ' class="on"' : '') + '>' +
          swatch([x.s]) +
          '<span><b>' + esc(x.s.n) + '</b><small>' + esc([x.s.city, x.s.st].filter(Boolean).join(', ')) + '</small></span><span class="go">' + (onPick ? 'Choose' : 'School page') + '</span></a></li>';
      }).join('') : '<li class="none">No match among the ' + schoolList.length + ' schools in this preview. The live network covers every member school.</li>';
      list.hidden = false; input.setAttribute('aria-expanded', 'true');
    }
    function choose(i) {
      var x = hits[i]; if (!x) return;
      if (onPick) { onPick(x); input.value = ''; close(); } else location.href = 'school.html?s=' + encodeURIComponent(x.slug);
    }
    input.addEventListener('input', function () { active = -1; paint(); });
    input.addEventListener('focus', paint);
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
        if (!hits.length) return; ev.preventDefault();
        active = (active + (ev.key === 'ArrowDown' ? 1 : -1) + hits.length) % hits.length; paint();
        input.setAttribute('aria-activedescendant', root.id + '-o' + active);
      } else if (ev.key === 'Enter') { ev.preventDefault(); choose(active < 0 ? 0 : active); }
      else if (ev.key === 'Escape') close();
    });
    list.addEventListener('click', function (ev) {
      var a = ev.target.closest('a[data-i]'); if (!a) return;
      if (onPick) { ev.preventDefault(); choose(+a.dataset.i); }
    });
    document.addEventListener('click', function (ev) { if (!root.contains(ev.target)) close(); });
  }

  /* ---------- chips ---------- */
  function sportCounts(list) {
    var c = {}; list.forEach(function (e) { c[e.sp] = (c[e.sp] || 0) + 1; });
    return Object.keys(c).sort(function (a, b) { return c[b] - c[a]; }).map(function (k) { return { k: k, n: c[k] }; });
  }
  function chipsHTML(list, current) {
    return '<button class="chip" type="button" data-sport="" aria-pressed="' + (!current) + '">All sports</button>' +
      sportCounts(list).map(function (s) {
        return '<button class="chip" type="button" data-sport="' + esc(s.k) + '" aria-pressed="' + (current === s.k) + '">' + esc(s.k) + '<sup>' + s.n + '</sup></button>';
      }).join('');
  }
  function stateOptions(sel, list, current) {
    var seen = {}; list.forEach(function (e) { if (e.st) seen[e.st] = 1; });
    sel.innerHTML = '<option value="">All states</option>' + Object.keys(seen).sort().map(function (s) {
      return '<option' + (s === current ? ' selected' : '') + '>' + s + '</option>';
    }).join('');
  }

  /* ---------- plans ---------- */
  var PLANS = [
    { id: 'basic', name: 'Basic', why: 'Follow your school.', yr: 79.99, mo: 13.99, feats: ['1 school', 'Up to 3 sports', 'Single viewer'] },
    { id: 'family', name: 'Family', tag: 'Most popular', why: 'Never miss a moment.', yr: 89.99, mo: 14.99, feats: ['1 school', 'All sports', 'Up to 6 devices'], pick: true },
    { id: 'all', name: 'All-Access', tag: 'Best value', why: 'Unlimited access to everything.', yr: 99.99, mo: 19.99, feats: ['All schools', 'All sports', 'Up to 6 devices'] }
  ];
  function planHTML(p, annual, selectable, chosen) {
    var price = annual ? p.yr : p.mo;
    var inner = '<span class="label">' + esc(p.tag || 'Pass') + '</span><h3>' + esc(p.name) + '</h3><p class="why">' + esc(p.why) + '</p>' +
      '<div class="price"><b class="num">$' + price.toFixed(2) + '</b><span>/' + (annual ? 'year' : 'month') + '</span></div>' +
      '<p class="billed">' + (annual ? 'Works out to $' + (p.yr / 12).toFixed(2) + ' a month' : 'Billed monthly') + '</p>' +
      '<ul>' + p.feats.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>';
    if (selectable) {
      return '<div class="plan' + (p.pick ? ' pick' : '') + '" role="radio" tabindex="0" aria-checked="' + (chosen === p.id) + '" data-plan="' + p.id + '">' + inner +
        '<span class="state">' + (chosen === p.id ? 'Selected' : 'Choose ' + esc(p.name)) + '</span></div>';
    }
    return '<article class="plan' + (p.pick ? ' pick' : '') + '">' + inner +
      '<a class="btn ' + (p.pick ? 'btn-solid' : 'btn-ink') + '" href="plans.html?plan=' + p.id + (annual ? '' : '&bill=mo') + '">Choose ' + esc(p.name) + '</a></article>';
  }
  function billToggle(root, onChange) {
    $$('button', root).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        onChange(b.dataset.bill === 'yr');
      });
    });
  }

  /* ---------- pages ---------- */
  var params = new URLSearchParams(location.search);

  function initChrome() {
    $$('[data-live]').forEach(function (n) { n.textContent = nf(D.meta.totals.live); });
    $$('[data-upcoming]').forEach(function (n) { n.textContent = nf(D.meta.totals.upcoming); });
    $$('[data-ondemand]').forEach(function (n) { n.textContent = nf(D.meta.totals.ondemand); });
    $$('[data-tz]').forEach(function (n) { n.textContent = tzName; });
    var btn = $('.menu-btn'), sheet = $('#menu');
    if (btn && sheet) btn.addEventListener('click', function () {
      var open = sheet.hidden; sheet.hidden = !open; btn.setAttribute('aria-expanded', String(open));
    });
  }

  function initHome() {
    finder($('#find'));

    // your teams — only once someone has followed a school
    var mine = follows.get().filter(function (s) { return D.schools[s]; });
    if (mine.length) {
      $('#mine').hidden = false;
      $('#mine-list').innerHTML = mine.map(function (slug) {
        var s = D.schools[slug], next = eventsFor(slug).filter(function (e) { return e.s !== 'vod'; })[0];
        var line = next ? (next.s === 'live' ? 'Live now · ' : day(next.d) + ', ' + clock(next.d).text + ' · ') + next.sp : 'No games in this preview';
        return '<a href="school.html?s=' + esc(slug) + '">' + swatch([s]) + '<span><b>' + esc(s.n) + '</b><small>' + esc(line) + '</small></span></a>';
      }).join('');
    }

    // on now
    var live = filterEvents({ tab: 'live' }).filter(function (e) { return e.t.length > 1 && e.lv === 'Varsity'; });
    $('#rail').innerHTML = live.slice(0, 12).map(tile).join('');

    // slate
    var state = { tab: 'up', sport: '', state: '' };
    var chips = $('#slate-chips'), sel = $('#slate-state'), out = $('#slate'), more = $('#slate-more');
    function paint() {
      var base = filterEvents({ tab: state.tab, state: state.state });
      chips.innerHTML = chipsHTML(base, state.sport);
      var list = filterEvents(state);
      out.innerHTML = list.length ? slateHTML(list, state.tab, 8) : '<p class="empty">Nothing matches in this preview. <a href="watch.html">See every game</a>.</p>';
      var qs = new URLSearchParams(); qs.set('tab', state.tab);
      if (state.sport) qs.set('sport', state.sport); if (state.state) qs.set('state', state.state);
      more.href = 'watch.html?' + qs.toString();
      more.textContent = list.length > 8 ? 'See all ' + nf(list.length) + ' in the guide' : 'Open the full guide';
    }
    stateOptions(sel, D.events, '');
    chips.addEventListener('click', function (ev) { var b = ev.target.closest('.chip'); if (b) { state.sport = b.dataset.sport; paint(); } });
    sel.addEventListener('change', function () { state.state = sel.value; state.sport = ''; paint(); });
    $$('#slate-tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('#slate-tabs button').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
        state.tab = b.dataset.tab; state.sport = ''; paint();
      });
    });
    paint();

    // plans
    var grid = $('#plans');
    var draw = function (annual) { grid.innerHTML = PLANS.map(function (p) { return planHTML(p, annual); }).join(''); };
    billToggle($('#bill'), draw); draw(true);
  }

  function initWatch() {
    var state = { tab: params.get('tab') || 'live', sport: params.get('sport') || '', state: params.get('state') || '', level: params.get('level') || '', q: params.get('q') || '' };
    if (['live', 'up', 'vod'].indexOf(state.tab) < 0) state.tab = 'live';
    // arriving from a sport link: open on the first tab that has that sport
    if (!params.get('tab') && state.sport) {
      state.tab = ['live', 'up', 'vod'].filter(function (t) { return filterEvents({ tab: t, sport: state.sport }).length; })[0] || 'live';
    }
    var chips = $('#w-chips'), sel = $('#w-state'), lev = $('#w-level'), q = $('#w-q'), out = $('#w-slate'), count = $('#w-count');
    var names = { live: 'live now', up: 'coming up', vod: 'on demand' };
    function paint() {
      $$('#w-tabs button').forEach(function (b) {
        b.setAttribute('aria-selected', String(b.dataset.tab === state.tab));
        $('sup', b).textContent = filterEvents({ tab: b.dataset.tab }).length;
      });
      chips.innerHTML = chipsHTML(filterEvents({ tab: state.tab, state: state.state, level: state.level, q: state.q }), state.sport);
      var list = filterEvents(state);
      count.textContent = nf(list.length) + ' ' + (list.length === 1 ? 'game' : 'games') + ' ' + names[state.tab] + ' in this preview';
      out.innerHTML = list.length ? slateHTML(list, state.tab) :
        '<p class="empty">No games match those filters in this preview. <a href="watch.html">Clear filters</a> or search the full network at <a href="' + LIVE_SITE + '/watch-events" target="_blank" rel="noopener">nfhsnetwork.com</a>.</p>';
      var qs = new URLSearchParams();
      Object.keys(state).forEach(function (k) { if (state[k] && !(k === 'tab' && state[k] === 'live')) qs.set(k, state[k]); });
      history.replaceState(null, '', location.pathname + (qs.toString() ? '?' + qs.toString() : ''));
    }
    stateOptions(sel, D.events, state.state);
    lev.value = state.level; q.value = state.q;
    chips.addEventListener('click', function (ev) { var b = ev.target.closest('.chip'); if (b) { state.sport = b.dataset.sport; paint(); } });
    sel.addEventListener('change', function () { state.state = sel.value; paint(); });
    lev.addEventListener('change', function () { state.level = lev.value; paint(); });
    q.addEventListener('input', function () { state.q = q.value; paint(); });
    $$('#w-tabs button').forEach(function (b) { b.addEventListener('click', function () { state.tab = b.dataset.tab; state.sport = ''; paint(); }); });
    paint();
  }

  function initSchool() {
    var H = D.hoover, slug = params.get('s') || (H && H.slug);
    var s = D.schools[slug];
    if (!s) { slug = H.slug; s = D.schools[slug]; }
    var rich = H && slug === H.slug;
    var name = rich ? H.full : s.n;
    document.title = name + ' — NFHS Network concept';
    document.documentElement.style.setProperty('--school', s.c || '#3a4150');
    $('#crest').innerHTML = s.l ? '<img src="img/logos/' + s.l + '.png" alt="' + esc(name) + ' logo">' : esc(initials(s.n));
    $('#s-name').textContent = name;
    $('#s-where').textContent = [[s.city, s.st].filter(Boolean).join(', '), rich ? H.assoc : s.a].filter(Boolean).join(' · ');

    var fb = $('#follow');
    var setF = function (on) { fb.setAttribute('aria-pressed', String(on)); fb.textContent = on ? 'Following' : 'Follow ' + s.n; };
    setF(follows.has(slug));
    fb.addEventListener('click', function () { setF(follows.toggle(slug)); });
    var links = '<a class="btn btn-ghost" href="' + LIVE_SITE + '/schools/' + esc(slug) + '" target="_blank" rel="noopener">Open on nfhsnetwork.com</a>';
    if (rich) links = '<a class="btn btn-ghost" href="' + LIVE_SITE + '/buy-tickets" target="_blank" rel="noopener">Tickets</a>' +
      '<a class="btn btn-ghost" href="' + esc(H.maxpreps) + '" target="_blank" rel="noopener">Scores on MaxPreps</a>' +
      '<a class="btn btn-ghost" href="' + esc(H.web) + '" target="_blank" rel="noopener">School athletics site</a>';
    $('#s-links').innerHTML = links;

    var all = eventsFor(slug), byKey = {};
    D.events.forEach(function (e) { byKey[e.k] = e; });
    var up = all.filter(function (e) { return e.s !== 'vod'; });
    var rep = all.filter(function (e) { return e.s === 'vod'; }).reverse();
    if (rich) {
      up = H.up.map(function (k) { return byKey[k]; }).filter(Boolean);
      rep = H.rep.map(function (k) { return byKey[k]; }).filter(Boolean);
    }
    var next = up[0];
    $('#next').innerHTML = next
      ? '<a class="next" href="' + esc(next.u) + '" target="_blank" rel="noopener"><span><span class="label">' + (next.s === 'live' ? 'Live now' : 'Next up') + '</span>' +
        '<h2 class="display">' + matchup(next).replace(/<em>vs<\/em>/, 'vs') + '</h2><p>' +
        esc((next.s === 'live' ? '' : day(next.d) + ' · ' + clock(next.d).text + ' ' + tzName + ' · ') + kind(next) + (place(next) ? ' · ' + place(next) : '')) + '</p></span>' + swatch(sides(next)) + '</a>'
      : '';
    var rest = next ? up.slice(1) : up;
    $('#s-up').innerHTML = rest.length ? rest.map(function (e) { return row(e, true); }).join('') : '<p class="empty">No more scheduled games for this school in the preview.</p>';
    $('#s-up-note').innerHTML = rich ? 'Showing ' + up.length + ' of ' + nf(H.totals.up) + ' scheduled broadcasts. <a href="' + LIVE_SITE + '/schools/' + esc(slug) + '" target="_blank" rel="noopener">Full schedule</a>' : '';
    $('#s-rep').innerHTML = rep.length ? rep.map(function (e) { return row(e, true); }).join('') : '<p class="empty">No replays for this school in the preview.</p>';
    $('#s-rep-note').innerHTML = rich ? 'Showing ' + rep.length + ' of ' + nf(H.totals.rep) + ' replays on demand.' : '';

    // phones: long lists start trimmed
    ['#s-up', '#s-rep'].forEach(function (id) {
      var box = $(id), n = $$('.row', box).length;
      if (n < 6) return;
      box.classList.add('clip');
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn btn-ghost btn-sm showall'; b.textContent = 'Show all ' + n;
      b.addEventListener('click', function () { box.classList.remove('clip'); b.remove(); });
      box.after(b);
    });

    if (rich) {
      $('#s-hl').hidden = false;
      $('#hl').innerHTML = H.hl.map(function (h) {
        var t = h.t.split(': '), kindOf = t.length > 1 ? t.shift() : 'Highlight';
        var title = t.join(': ').replace(/THOMPSON BROADCAST-/, '').replace(/^Varsity Football /, '').replace(/ High School/g, '').replace(/ - Hoover$/, '');
        return '<a href="' + esc(h.u) + '" target="_blank" rel="noopener"><span class="th"><img src="img/hl/' + h.img + '.jpg" alt="" loading="lazy" width="640" height="360"><span class="dur num">' + mmss(h.dur) + '</span></span>' +
          '<h3>' + esc(title) + '</h3><p>' + esc(kindOf + ' · ' + day(h.d)) + '</p></a>';
      }).join('');
      $('#hl-note').textContent = 'Showing 6 of ' + nf(H.totals.hl) + ' highlights and recaps.';
      $('#s-side').hidden = false;
      var max = Math.max.apply(null, H.sports.map(function (x) { return x.count; }));
      $('#bars').innerHTML = H.sports.slice().sort(function (a, b) { return b.count - a.count; }).map(function (x) {
        return '<li>' + esc(x.displayName) + '<span class="num">' + x.count + '</span><i style="--w:' + Math.round(x.count / max * 100) + '%"></i></li>';
      }).join('');
      $('#rivals').innerHTML = H.rivals.map(function (r) {
        var x = D.schools[r]; if (!x) return '';
        return '<a href="school.html?s=' + esc(r) + '">' + swatch([x]) + '<span><b>' + esc(x.n + (x.m ? ' ' + x.m : '')) + '</b><small>' + esc([x.city, x.st].filter(Boolean).join(', ')) + '</small></span></a>';
      }).join('');
    }
  }

  function initPlans() {
    var state = { plan: params.get('plan') || 'family', annual: params.get('bill') !== 'mo', school: null };
    if (!PLANS.some(function (p) { return p.id === state.plan; })) state.plan = 'family';
    var grid = $('#p-plans');
    function paint() {
      grid.innerHTML = PLANS.map(function (p) { return planHTML(p, state.annual, true, state.plan); }).join('');
      var p = PLANS.filter(function (x) { return x.id === state.plan; })[0];
      $('#sum-plan').textContent = p.name;
      $('#sum-bill').textContent = state.annual ? 'Annual' : 'Monthly';
      $('#sum-school').textContent = p.id === 'all' ? 'All schools' : (state.school ? state.school.s.n : 'Not chosen yet');
      $('#sum-total').textContent = '$' + (state.annual ? p.yr : p.mo).toFixed(2) + (state.annual ? ' / year' : ' / month');
      $('#sum-save').textContent = state.annual
        ? 'That is $' + (p.mo * 12 - p.yr).toFixed(2) + ' less than paying monthly for a year.'
        : 'Annual is $' + p.yr.toFixed(2) + ' — $' + (p.mo * 12 - p.yr).toFixed(2) + ' less over a year.';
      $('#pick').hidden = p.id === 'all';
      var c = $('#chosen');
      if (state.school && p.id !== 'all') {
        c.hidden = false;
        c.innerHTML = swatch([state.school.s]) + '<span><b>' + esc(state.school.s.n) + '</b><small>' + esc([state.school.s.city, state.school.s.st].filter(Boolean).join(', ')) + '</small></span><button type="button" id="unpick">Change</button>';
        $('#unpick').addEventListener('click', function () { state.school = null; paint(); $('#pfind input').focus(); });
      } else c.hidden = true;
    }
    grid.addEventListener('click', function (ev) { var c = ev.target.closest('[data-plan]'); if (c) { state.plan = c.dataset.plan; paint(); } });
    grid.addEventListener('keydown', function (ev) {
      var c = ev.target.closest('[data-plan]'); if (!c) return;
      if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); state.plan = c.dataset.plan; paint(); $('[data-plan="' + state.plan + '"]').focus(); }
    });
    var bill = $('#p-bill');
    $$('button', bill).forEach(function (b) { b.setAttribute('aria-pressed', String((b.dataset.bill === 'yr') === state.annual)); });
    billToggle(bill, function (a) { state.annual = a; paint(); });
    finder($('#pfind'), function (x) { state.school = x; paint(); });
    paint();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initChrome();
    var page = document.body.dataset.page;
    if (page === 'home') initHome();
    if (page === 'watch') initWatch();
    if (page === 'school') initSchool();
    if (page === 'plans') initPlans();
  });
})();
