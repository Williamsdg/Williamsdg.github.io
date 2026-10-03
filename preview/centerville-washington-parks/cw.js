/* Centerville-Washington Park District concept. Plain JavaScript, no framework. */
(function () {
  'use strict';
  var CW = window.CW || { parks: [], amen: [], programs: [], news: [], fields: [] };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var page = document.body.getAttribute('data-page');

  /* ---------- staff demo overrides (saved in this browser only) ---------- */
  var store = {
    get: function () { try { return JSON.parse(localStorage.getItem('cw_demo') || '{}'); } catch (e) { return {}; } },
    set: function (v) { try { localStorage.setItem('cw_demo', JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  var ov = store.get();
  if (ov.am) CW.parks.forEach(function (p) { if (ov.am[p.slug]) p.am = ov.am[p.slug]; });

  var bySlug = {}; CW.parks.forEach(function (p) { bySlug[p.slug] = p; });
  var parkName = function (p) { return /park$/i.test(p.name) ? p.name : p.name + ' Park'; };

  /* ---------- dates ---------- */
  var parseDate = function (s) { var m = s.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+)/); return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]); };
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var fmtTime = function (d) { var h = d.getHours(), m = d.getMinutes(); return ((h % 12) || 12) + (m ? ':' + (m < 10 ? '0' : '') + m : '') + (h < 12 ? ' a.m.' : ' p.m.'); };
  var fmtWhen = function (p) { var s = parseDate(p.start), e = parseDate(p.end); return DAYS[s.getDay()] + ', ' + MONTHS[s.getMonth()] + ' ' + s.getDate() + ' · ' + fmtTime(s) + ' to ' + fmtTime(e); };
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var upcoming = CW.programs.filter(function (p) { return parseDate(p.start) >= today; });
  if (upcoming.length < 8) upcoming = CW.programs.slice(); /* keep the concept populated after the sample dates pass */
  upcoming.sort(function (a, b) { return parseDate(a.start) - parseDate(b.start); });
  var audience = function (p) {
    var a = (p.age || '').toLowerCase();
    if (!a || a.indexOf('all ages') === 0) return 'All ages';
    var m = a.match(/(\d+)/); if (!m) return 'All ages';
    var n = +m[1];
    if (a.indexOf('months') > -1 || n < 5) return 'Preschool';
    if (n >= 14) return 'Adults';
    return 'Kids and teens';
  };

  /* ---------- shared pieces ---------- */
  var LEAF = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24 4l9 11h-5l8 10h-6l8 10H27v9h-6v-9H10l8-10h-6l8-10h-5z"/></svg>';
  var photo = function (p, cls) {
    if (p.imgs && p.imgs.length) return '<img src="' + esc(p.imgs[0].src) + '" alt="" loading="lazy" width="1200" height="450">';
    return '<span class="noPhoto">' + LEAF + esc(p.type) + ' park</span>';
  };
  var progCard = function (p) {
    var park = p.park && bySlug[p.park];
    return '<article class="prog"><div class="ph">' + (p.img ? '<img src="' + esc(p.img) + '" alt="" loading="lazy">' : '') + '</div><div class="bd">' +
      '<span class="when">' + esc(fmtWhen(p)) + '</span>' +
      '<h3>' + esc(p.title) + '</h3>' +
      '<span class="meta">' + (park ? '<a href="park.html?p=' + park.slug + '">' + esc(p.venue) + '</a>' : esc(p.venue)) + (p.age ? ' · ' + esc(p.age) : '') + '</span>' +
      '<p class="clamp">' + esc(p.desc) + '</p>' +
      '<div class="act"><a class="btn sm" href="' + esc(p.url) + '" rel="noopener">Register<span class="sr"> for ' + esc(p.title) + ' on RecDesk</span></a></div>' +
      '</div></article>';
  };
  var statusKind = function (s) { s = s.toLowerCase(); return s === 'open' ? 'open' : s.indexOf('closed') > -1 ? 'closed' : s === 'scheduled' ? 'sched' : 'idle'; };
  var ICON = {
    open: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    closed: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    sched: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 4.5V8l2.4 1.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    idle: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
  };
  var pill = function (s) { var k = statusKind(s); return '<span class="st ' + k + '">' + ICON[k] + esc(s) + '</span>'; };
  var fieldPark = function (f) {
    var hit = null;
    CW.parks.forEach(function (p) { if (f.name.indexOf(parkName(p)) === 0) hit = p; });
    return hit;
  };

  /* ---------- header menu + alert ---------- */
  var mb = $('.menuBtn'), nw = $('.navWrap');
  if (mb && nw) {
    mb.addEventListener('click', function () { var o = nw.classList.toggle('open'); mb.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nw.classList.contains('open')) { nw.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.focus(); } });
  }
  var al = $('.alert');
  if (al) {
    var a = ov.alert;
    if (a) {
      if (a.on === false) al.hidden = true;
      if (a.title) $('.alert b').textContent = a.title;
      if (a.text) $('.alert span').textContent = a.text;
    }
    var closed = false; try { closed = sessionStorage.getItem('cw_alert') === (al.textContent || '').length + ''; } catch (e) { }
    if (closed) al.hidden = true;
    $('.alert button').addEventListener('click', function () { al.hidden = true; try { sessionStorage.setItem('cw_alert', (al.textContent || '').length + ''); } catch (e) { } });
  }

  /* ---------- home ---------- */
  if (page === 'home') {
    var open = CW.fields.filter(function (f) { return statusKind(f.status) === 'open'; }).length;
    var shut = CW.fields.filter(function (f) { return statusKind(f.status) === 'closed'; }).length;
    $('#fieldLive').textContent = open + ' open · ' + shut + ' closed';
    $('#homeProgs').innerHTML = upcoming.slice(0, 6).map(progCard).join('');
    $('#homeParks').innerHTML = CW.parks.filter(function (p) { return p.big; }).slice(0, 8).map(function (p) {
      return '<article class="card"><div class="ph">' + photo(p) + '</div><div class="bd"><span class="tag t-' + p.type + '">' + p.type + ' park</span><h3><a href="park.html?p=' + p.slug + '">' + esc(parkName(p)) + '</a></h3><span class="meta">' + Math.round(p.acres) + ' acres · ' + p.am.length + ' features</span></div></article>';
    }).join('');
    $('#homeNews').innerHTML = CW.news.filter(function (n) { return n.img; }).slice(0, 3).map(function (n) {
      var d = n.date.split('-');
      return '<article class="card"><div class="ph"><img src="' + esc(n.img) + '" alt="" loading="lazy"></div><div class="bd"><span class="when">' + MONTHS[+d[1] - 1] + ' ' + (+d[2]) + ', ' + d[0] + '</span><h3><a href="' + esc(n.url) + '" rel="noopener">' + esc(n.title) + '</a></h3></div></article>';
    }).join('');
    var quick = ['Playground Equipment (age 2-5)', 'Paved Trails', 'Pickleball Courts', 'Hiking Trails', 'Shelters - Large (reservable)', 'Sled Hills', 'Fishing Ponds', 'All-access playground surface'];
    $('#quickAm').innerHTML = quick.map(function (n) {
      var a = CW.amen.filter(function (x) { return x.name === n; })[0];
      var c = CW.parks.filter(function (p) { return p.am.indexOf(a.id) > -1; }).length;
      return '<a class="btn ghost sm" href="find-a-park.html?a=' + a.id + '">' + esc(n.replace('Shelters - Large (reservable)', 'Reservable shelters').replace('Playground Equipment (age 2-5)', 'Playgrounds for ages 2 to 5')) + ' <span aria-hidden="true">(' + c + ')</span><span class="sr">, ' + c + ' parks</span></a>';
    }).join('');
    $('#heroSearch').addEventListener('submit', function (e) { e.preventDefault(); location.href = 'find-a-park.html?q=' + encodeURIComponent($('#heroQ').value.trim()); });
  }

  /* ---------- park finder ---------- */
  if (page === 'finder') {
    var qs = new URLSearchParams(location.search);
    var state = {
      q: qs.get('q') || '',
      types: (qs.get('t') || '').split(',').filter(Boolean),
      am: (qs.get('a') || '').split(',').filter(Boolean).map(Number),
      sort: 'name', here: null
    };
    var groups = {}; CW.amen.forEach(function (a) { (groups[a.group] = groups[a.group] || []).push(a); });
    var countFor = function (id) { return CW.parks.filter(function (p) { return p.am.indexOf(id) > -1; }).length; };
    $('#amFilters').innerHTML = Object.keys(groups).map(function (g, i) {
      var sel = groups[g].some(function (a) { return state.am.indexOf(a.id) > -1; });
      return '<details' + (i === 0 || sel ? ' open' : '') + '><summary>' + esc(g) + '<span class="n" data-g="' + esc(g) + '"></span></summary><fieldset><legend class="sr">' + esc(g) + '</legend>' +
        groups[g].map(function (a) { return '<label class="check"><input type="checkbox" name="am" value="' + a.id + '"' + (state.am.indexOf(a.id) > -1 ? ' checked' : '') + '>' + esc(a.name) + '<small aria-hidden="true">' + countFor(a.id) + '</small></label>'; }).join('') +
        '</fieldset></details>';
    }).join('');
    $('#q').value = state.q;
    $$('#typePills .pill').forEach(function (b) { if (state.types.indexOf(b.value) > -1) b.setAttribute('aria-pressed', 'true'); });

    var map = null, layer = null, markers = {};
    if (window.L) {
      map = L.map('parkMap', { scrollWheelZoom: false }).setView([39.628, -84.16], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
      layer = L.layerGroup().addTo(map);
    } else { $('#parkMap').innerHTML = '<p style="padding:20px">The map could not load. The list below has every park.</p>'; }

    var miles = function (p) {
      if (!state.here) return null;
      var R = 3958.8, r = Math.PI / 180, dLat = (p.lat - state.here[0]) * r, dLng = (p.lng - state.here[1]) * r;
      var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(state.here[0] * r) * Math.cos(p.lat * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    };
    var amName = function (id) { return CW.amen[id].name; };
    var render = function () {
      var q = state.q.toLowerCase();
      var list = CW.parks.filter(function (p) {
        if (q && (parkName(p) + ' ' + p.addr.join(' ') + ' ' + p.features.join(' ')).toLowerCase().indexOf(q) === -1) return false;
        if (state.types.length && state.types.indexOf(p.type) === -1) return false;
        return state.am.every(function (id) { return p.am.indexOf(id) > -1; });
      });
      list.sort(function (a, b) {
        if (state.sort === 'near' && state.here) return miles(a) - miles(b);
        if (state.sort === 'size') return b.acres - a.acres;
        return a.name.localeCompare(b.name);
      });
      $('#count').textContent = list.length === CW.parks.length ? 'All ' + list.length + ' parks' : list.length + (list.length === 1 ? ' park matches' : ' parks match');
      $('#active').innerHTML = state.types.map(function (t) { return '<button type="button" data-t="' + t + '">' + t + ' <span aria-hidden="true">×</span><span class="sr">remove filter</span></button>'; }).join('') +
        state.am.map(function (id) { return '<button type="button" data-a="' + id + '">' + esc(amName(id)) + ' <span aria-hidden="true">×</span><span class="sr">remove filter</span></button>'; }).join('') +
        (state.am.length + state.types.length + (state.q ? 1 : 0) > 0 ? '<button type="button" data-clear="1">Clear all</button>' : '');
      $$('#amFilters .n').forEach(function (n) { var c = groups[n.getAttribute('data-g')].filter(function (a) { return state.am.indexOf(a.id) > -1; }).length; n.textContent = c || ''; });
      $('#results').innerHTML = list.length ? list.map(function (p) {
        var d = miles(p);
        var hit = p.am.filter(function (id) { return state.am.indexOf(id) > -1; });
        var rest = p.am.filter(function (id) { return state.am.indexOf(id) === -1; });
        var show = rest.slice(0, Math.max(0, 6 - hit.length)), more = rest.length - show.length;
        return '<li class="pk"><div class="ph">' + photo(p) + '</div><div class="bd">' +
          '<div class="row"><span class="tag t-' + p.type + '">' + p.type + '</span><span class="meta">' + (p.acres >= 10 ? Math.round(p.acres) : p.acres.toFixed(1)) + ' acres</span>' + (d != null ? '<span class="dist">' + d.toFixed(1) + ' mi away</span>' : '') + '</div>' +
          '<h3><a href="park.html?p=' + p.slug + '">' + esc(parkName(p)) + '</a></h3>' +
          '<span class="meta">' + esc(p.addr[0] || '') + '</span>' +
          (p.am.length ? '<ul class="chips" aria-label="Features">' + hit.map(function (id) { return '<li class="chip hit">' + esc(amName(id)) + '</li>'; }).join('') + show.map(function (id) { return '<li class="chip">' + esc(amName(id)) + '</li>'; }).join('') + (more > 0 ? '<li class="chip">+' + more + ' more</li>' : '') + '</ul>' : '') +
          '<div class="row" style="margin-top:4px"><a class="btn sm" href="park.html?p=' + p.slug + '">Park details<span class="sr">: ' + esc(parkName(p)) + '</span></a><a class="btn ghost sm" href="https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lng + '" rel="noopener">Directions<span class="sr"> to ' + esc(parkName(p)) + '</span></a></div>' +
          '</div></li>';
      }).join('') : '<li class="note" style="grid-column:1/-1"><b>No park has every feature you picked.</b> Remove one filter to see the closest matches.</li>';
      if (map) {
        layer.clearLayers(); var pts = [];
        list.forEach(function (p) {
          var m = L.marker([p.lat, p.lng], { icon: L.divIcon({ className: '', html: '<span class="mk ' + p.type + '"></span>', iconSize: [22, 22], iconAnchor: [11, 11] }), title: parkName(p), alt: parkName(p) });
          m.bindPopup('<b>' + esc(parkName(p)) + '</b>' + esc(p.type) + ' park · ' + Math.round(p.acres * 10) / 10 + ' acres<br>' + esc(p.addr[0] || '') + '<br><a href="park.html?p=' + p.slug + '">Park details</a>');
          m.addTo(layer); pts.push([p.lat, p.lng]);
        });
        if (state.here) L.circleMarker(state.here, { radius: 8, color: '#143a22', fillColor: '#f5a81c', fillOpacity: 1, weight: 3 }).bindPopup('Your location').addTo(layer);
        if (pts.length) map.fitBounds(pts, { padding: [30, 30], maxZoom: 15 });
      }
      var u = new URLSearchParams();
      if (state.q) u.set('q', state.q); if (state.types.length) u.set('t', state.types.join(',')); if (state.am.length) u.set('a', state.am.join(','));
      history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u.toString() : ''));
    };
    $('#amFilters').addEventListener('change', function (e) {
      if (e.target.name !== 'am') return;
      var id = +e.target.value; var i = state.am.indexOf(id);
      if (e.target.checked && i === -1) state.am.push(id); else if (!e.target.checked && i > -1) state.am.splice(i, 1);
      render();
    });
    var t; $('#q').addEventListener('input', function () { clearTimeout(t); var v = this.value; t = setTimeout(function () { state.q = v.trim(); render(); }, 150); });
    $('#finderForm').addEventListener('submit', function (e) { e.preventDefault(); });
    $$('#typePills .pill').forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') === 'true'; b.setAttribute('aria-pressed', on ? 'false' : 'true');
        var i = state.types.indexOf(b.value); if (on && i > -1) state.types.splice(i, 1); else if (!on) state.types.push(b.value);
        render();
      });
    });
    $('#sort').addEventListener('change', function () { state.sort = this.value; if (state.sort === 'near' && !state.here) locate(); else render(); });
    var locate = function () {
      var msg = $('#nearMsg');
      if (!navigator.geolocation) { msg.textContent = 'This browser cannot share a location.'; return; }
      msg.textContent = 'Finding your location…';
      navigator.geolocation.getCurrentPosition(function (pos) {
        state.here = [pos.coords.latitude, pos.coords.longitude]; state.sort = 'near'; $('#sort').value = 'near'; msg.textContent = 'Sorted by distance from you.'; render();
      }, function () { msg.textContent = 'Location was not shared. Parks are sorted by name.'; state.sort = 'name'; $('#sort').value = 'name'; render(); }, { timeout: 8000 });
    };
    $('#nearBtn').addEventListener('click', locate);
    $('#active').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-clear')) { state.am = []; state.types = []; state.q = ''; $('#q').value = ''; }
      else if (b.hasAttribute('data-a')) state.am.splice(state.am.indexOf(+b.getAttribute('data-a')), 1);
      else state.types.splice(state.types.indexOf(b.getAttribute('data-t')), 1);
      $$('#amFilters input').forEach(function (c) { c.checked = state.am.indexOf(+c.value) > -1; });
      $$('#typePills .pill').forEach(function (p) { p.setAttribute('aria-pressed', state.types.indexOf(p.value) > -1 ? 'true' : 'false'); });
      render(); $('#count').focus();
    });
    var ft = $('.filterToggle');
    ft.addEventListener('click', function () { var o = $('.filters').classList.toggle('open'); ft.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    $$('.viewToggle .pill').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.viewToggle .pill').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        $('.finder').setAttribute('data-view', b.value); if (b.value === 'map' && map) setTimeout(function () { map.invalidateSize(); render(); }, 60);
      });
    });
    render();
  }

  /* ---------- park page ---------- */
  if (page === 'park') {
    var slug = new URLSearchParams(location.search).get('p') || 'oak-grove';
    var p = bySlug[slug] || bySlug['oak-grove'];
    var nm = parkName(p);
    document.title = nm + ' | Centerville-Washington Park District (concept)';
    var hero = $('#parkHero');
    hero.className = 'parkHero' + (p.imgs.length ? '' : ' plain');
    hero.innerHTML = (p.imgs.length ? '<img src="' + esc(p.imgs[0].src) + '" alt="' + esc(p.imgs[0].alt) + '" width="1200" height="450">' : '') +
      '<div class="cap"><div class="wrap"><p class="crumbs"><a href="./">Home</a> / <a href="find-a-park.html">Find a park</a></p><h1>' + esc(nm) + '</h1><p style="margin:6px 0 0;color:#fff;font-weight:700">' + p.type + ' park · ' + p.acres + ' acres</p></div></div>';
    var here = upcoming.filter(function (x) { return x.park === p.slug; });
    var flds = CW.fields.filter(function (f) { var fp = fieldPark(f); return fp && fp.slug === p.slug; });
    var std = p.am.map(function (id) { return CW.amen[id]; });
    var main = '';
    if (p.about.length) main += '<h2>About the park</h2>' + p.about.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    if (p.imgs.length > 1) main += '<div class="gal">' + p.imgs.slice(1, 4).map(function (i) { return '<img src="' + esc(i.src) + '" alt="' + esc(i.alt) + '" loading="lazy" width="1200" height="450">'; }).join('') + '</div>';
    if (std.length) main += '<h2>Find it here</h2><ul class="chips" style="margin-bottom:6px">' + std.map(function (a) { return '<li class="chip"><a href="find-a-park.html?a=' + a.id + '" style="text-decoration:none;color:inherit">' + esc(a.name) + '</a></li>'; }).join('') + '</ul><p class="meta">Tap a feature to see every park that has it.</p>';
    if (p.features.length) main += '<h2>Everything at this park</h2><ul class="feat">' + p.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>';
    if (flds.length) {
      var nOpen = flds.filter(function (f) { return statusKind(f.status) === 'open'; }).length;
      var rows = '<div class="fgroup" style="margin-top:8px">' + flds.map(function (f) { return '<div class="frow"><span class="nm">' + esc(f.name.replace(nm + ' ', '')) + '</span>' + pill(f.status) + '</div>'; }).join('') + '</div>';
      main += '<h2>Athletic field status</h2><p><b>' + nOpen + ' of ' + flds.length + ' fields open.</b> <span class="meta">Sample from October 3, 2026. <a href="field-status.html">All fields</a></span></p>' +
        (flds.length > 6 ? '<details class="fold" style="margin-top:8px"><summary>Show each field at this park</summary>' + rows + '</details>' : rows);
    }
    main += '<h2>Coming up at ' + esc(nm) + '</h2>' + (here.length ? '<div class="progs" style="grid-template-columns:1fr">' + here.slice(0, 5).map(progCard).join('') + '</div>' + (here.length > 5 ? '<p style="margin-top:12px"><a class="more" href="programs.html?park=' + p.slug + '">All ' + here.length + ' programs at this park</a></p>' : '') : '<p>No programs are scheduled here right now. <a href="programs.html">See all programs</a>.</p>');
    if (p.history.length) main += '<details class="fold"><summary>History of the park</summary>' + p.history.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</details>';
    $('#parkMain').innerHTML = main;
    $('#parkFacts').innerHTML = '<dl>' +
      '<dt>Hours</dt><dd>' + esc(p.hours || 'Open during daylight hours.') + '</dd>' +
      '<dt>' + (p.addr.length > 1 ? 'Entrances' : 'Address') + '</dt><dd>' + p.addr.map(esc).join('<br>') + '</dd>' +
      (p.pets ? '<dt>Pets</dt><dd>' + esc(p.pets) + '</dd>' : '') +
      '</dl><div class="act"><a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lng + '" rel="noopener">Get directions</a>' +
      (p.trailmap ? '<a class="btn ghost" href="' + esc(p.trailmap) + '" rel="noopener">Trail map (PDF)</a>' : '') +
      (p.am.some(function (id) { return CW.amen[id].name === 'Shelters - Large (reservable)'; }) ? '<a class="btn ghost" href="https://cwpd.org/parks/reserving-group-shelters/" rel="noopener">Reserve a shelter</a>' : '') +
      '</div><div id="miniMap" role="group" aria-label="Map showing the location of ' + esc(nm) + '"></div>';
    if (window.L) {
      var mm = L.map('miniMap', { scrollWheelZoom: false, zoomControl: true }).setView([p.lat, p.lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(mm);
      L.marker([p.lat, p.lng], { icon: L.divIcon({ className: '', html: '<span class="mk ' + p.type + '"></span>', iconSize: [22, 22], iconAnchor: [11, 11] }), keyboard: false }).addTo(mm);
    }
    var near = CW.parks.filter(function (x) { return x.slug !== p.slug; }).map(function (x) { return { p: x, d: Math.pow(x.lat - p.lat, 2) + Math.pow((x.lng - p.lng) * 0.77, 2) }; }).sort(function (a, b) { return a.d - b.d; }).slice(0, 3);
    $('#nearParks').innerHTML = near.map(function (o) { var x = o.p; return '<article class="card"><div class="ph">' + photo(x) + '</div><div class="bd"><span class="tag t-' + x.type + '">' + x.type + ' park</span><h3><a href="park.html?p=' + x.slug + '">' + esc(parkName(x)) + '</a></h3><span class="meta">' + esc(x.addr[0] || '') + '</span></div></article>'; }).join('');
    $('#tplNote').textContent = p.big ? 'This is the full template used for the ten largest parks: photo gallery, standard features, field status, and programs at this park.' : 'This is the simpler version of the same template, used for neighborhood and smaller nature parks. It fills in only the sections this park has content for.';
  }

  /* ---------- programs ---------- */
  if (page === 'programs') {
    var ps = new URLSearchParams(location.search);
    var st = { q: '', park: ps.get('park') || '', aud: '', when: 'all' };
    var withProg = CW.parks.filter(function (p) { return upcoming.some(function (x) { return x.park === p.slug; }); });
    $('#fPark').innerHTML = '<option value="">All parks</option>' + withProg.map(function (p) { return '<option value="' + p.slug + '"' + (st.park === p.slug ? ' selected' : '') + '>' + esc(parkName(p)) + '</option>'; }).join('');
    var draw = function () {
      var q = st.q.toLowerCase(), lim = null;
      if (st.when === 'week') { lim = new Date(today); lim.setDate(lim.getDate() + 7); }
      if (st.when === 'month') { lim = new Date(today); lim.setDate(lim.getDate() + 30); }
      var list = upcoming.filter(function (p) {
        if (q && (p.title + ' ' + p.desc + ' ' + p.venue).toLowerCase().indexOf(q) === -1) return false;
        if (st.park && p.park !== st.park) return false;
        if (st.aud && audience(p) !== st.aud && !(st.aud !== 'All ages' && audience(p) === 'All ages')) return false;
        if (lim && parseDate(p.start) > lim) return false;
        return true;
      });
      $('#pCount').textContent = list.length + (list.length === 1 ? ' program' : ' programs');
      $('#pList').innerHTML = list.length ? list.map(progCard).join('') : '<p class="note" style="grid-column:1/-1"><b>Nothing matches yet.</b> Try a different park, age group or date range.</p>';
    };
    $('#fQ').addEventListener('input', function () { st.q = this.value.trim(); draw(); });
    $('#fPark').addEventListener('change', function () { st.park = this.value; draw(); });
    $('#fAud').addEventListener('change', function () { st.aud = this.value; draw(); });
    $('#fWhen').addEventListener('change', function () { st.when = this.value; draw(); });
    $('#progForm').addEventListener('submit', function (e) { e.preventDefault(); });
    draw();
  }

  /* ---------- field status ---------- */
  if (page === 'fields') {
    var sport = function (n) { n = n.toLowerCase(); return n.indexOf('soccer') > -1 ? 'Soccer' : n.indexOf('baseball') > -1 ? 'Baseball and softball' : n.indexOf('football') > -1 ? 'Football' : n.indexOf('lacrosse') > -1 ? 'Lacrosse' : 'Other'; };
    var cur = '';
    var counts = { open: 0, closed: 0, sched: 0, idle: 0 };
    CW.fields.forEach(function (f) { counts[statusKind(f.status)]++; });
    $('#fSum').innerHTML = '<div><b>' + counts.open + '</b><span>Open</span></div><div><b>' + counts.closed + '</b><span>Closed</span></div><div><b>' + counts.sched + '</b><span>Scheduled</span></div><div><b>' + counts.idle + '</b><span>Not scheduled today</span></div>';
    var sports = []; CW.fields.forEach(function (f) { var s = sport(f.name); if (sports.indexOf(s) === -1) sports.push(s); });
    $('#fSport').innerHTML = '<button type="button" class="pill" value="" aria-pressed="true">All sports</button>' + sports.map(function (s) { return '<button type="button" class="pill" value="' + s + '" aria-pressed="false">' + s + '</button>'; }).join('');
    var drawF = function () {
      var g = {}, order = [];
      CW.fields.forEach(function (f) {
        if (cur && sport(f.name) !== cur) return;
        var fp = fieldPark(f), k = fp ? parkName(fp) : 'Other';
        if (!g[k]) { g[k] = { park: fp, rows: [] }; order.push(k); }
        g[k].rows.push(f);
      });
      $('#fList').innerHTML = order.map(function (k) {
        var o = g[k], op = o.rows.filter(function (f) { return statusKind(f.status) === 'open'; }).length;
        return '<section class="fgroup" style="padding:0"><h2>' + esc(k) + ' <span class="meta" style="font-weight:700">' + op + ' of ' + o.rows.length + ' open</span>' + (o.park ? '<a href="park.html?p=' + o.park.slug + '">Park details</a>' : '') + '</h2>' +
          o.rows.map(function (f) { return '<div class="frow"><span class="nm">' + esc(f.name.replace(k + ' ', '')) + '<small>' + sport(f.name) + '</small></span>' + pill(f.status) + '</div>'; }).join('') + '</section>';
      }).join('');
    };
    $('#fSport').addEventListener('click', function (e) {
      var b = e.target.closest('.pill'); if (!b) return; cur = b.value;
      $$('#fSport .pill').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); drawF();
    });
    drawF();
  }

  /* ---------- staff demo ---------- */
  if (page === 'staff') {
    var sel = $('#sPark');
    sel.innerHTML = CW.parks.map(function (p) { return '<option value="' + p.slug + '">' + esc(parkName(p)) + '</option>'; }).join('');
    sel.value = 'oak-grove';
    var drawAm = function () {
      var p = bySlug[sel.value];
      $('#sAm').innerHTML = CW.amen.map(function (a) { return '<label class="check"><input type="checkbox" value="' + a.id + '"' + (p.am.indexOf(a.id) > -1 ? ' checked' : '') + '>' + esc(a.name) + '</label>'; }).join('');
      $('#sView').href = 'park.html?p=' + p.slug;
    };
    sel.addEventListener('change', drawAm); drawAm();
    var flash = function (el) { el.hidden = false; setTimeout(function () { el.hidden = true; }, 2600); };
    $('#sSaveAm').addEventListener('click', function () {
      var ids = $$('#sAm input:checked').map(function (c) { return +c.value; });
      var o = store.get(); o.am = o.am || {}; o.am[sel.value] = ids; store.set(o); bySlug[sel.value].am = ids; flash($('#sAmSaved'));
    });
    var o0 = store.get().alert || {};
    $('#sAlertOn').checked = o0.on !== false;
    if (o0.title) $('#sAlertTitle').value = o0.title;
    if (o0.text) $('#sAlertText').value = o0.text;
    $('#sSaveAlert').addEventListener('click', function () {
      var o = store.get(); o.alert = { on: $('#sAlertOn').checked, title: $('#sAlertTitle').value.trim(), text: $('#sAlertText').value.trim() }; store.set(o);
      try { sessionStorage.removeItem('cw_alert'); } catch (e) { } flash($('#sAlertSaved'));
    });
    $('#sReset').addEventListener('click', function () { try { localStorage.removeItem('cw_demo'); sessionStorage.removeItem('cw_alert'); } catch (e) { } location.reload(); });
  }
})();
