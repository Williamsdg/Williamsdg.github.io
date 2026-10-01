/* Auburn-Opelika concept — shared helpers. Plain JS, no build step. Expects data.js (window.AO) first. */
(function () {
  var AO = window.AO || (window.AO = { places: [], events: [], img: '', snap: '2026-10-01' });

  AO.CAT = {
    eat: 'Restaurants', bites: 'Best Bites', bars: 'Bars & breweries', trucks: 'Food trucks',
    shop: 'Shopping', arts: 'Arts & culture', music: 'Music & nightlife', family: 'Family fun',
    parks: 'Parks & playgrounds', golf: 'Golf', stay: 'Hotels & inns', camp: 'RV parks & camping',
    group: 'Group activities', venue: 'Meeting venues', wedvenue: 'Wedding venues',
    vendor: 'Wedding vendors', catering: 'Catering', groupdining: 'Group dining'
  };
  AO.ECAT = {
    free: 'Free', family: 'Family friendly', music: 'Live music', arts: 'Arts', food: 'Food & drink',
    sports: 'Sports', outdoors: 'Outdoors', halloween: 'Halloween', holiday: 'Holiday', learn: 'Classes & talks', shop: 'Markets'
  };
  AO.TOWN = { A: 'Auburn', O: 'Opelika', B: 'Auburn-Opelika', N: 'Nearby' };
  // which categories a visitor browses (planner-only ones live on the Groups page)
  AO.VISIT = ['eat', 'bites', 'bars', 'trucks', 'shop', 'arts', 'music', 'family', 'parks', 'golf', 'stay', 'camp'];

  AO.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  AO.src = function (path, w, h) {
    if (!path) return '';
    if (/^https?:/.test(path)) return path;
    return AO.img + 'c_fill,f_jpg,q_65,w_' + w + ',h_' + h + '/v1/' + path;
  };
  AO.qs = function (k) { return new URLSearchParams(location.search).get(k); };
  AO.place = function (id) { id = +id; return AO.places.find(function (p) { return p.i === id; }); };
  AO.event = function (id) { id = +id; return AO.events.find(function (e) { return e.i === id; }); };
  AO.primaryCat = function (p) {
    var order = ['stay', 'camp', 'golf', 'bars', 'trucks', 'eat', 'bites', 'arts', 'music', 'family', 'parks', 'shop', 'wedvenue', 'venue', 'group', 'catering', 'vendor', 'groupdining'];
    for (var i = 0; i < order.length; i++) if (p.c.indexOf(order[i]) > -1) return order[i];
    return p.c[0];
  };
  // the feed lists some places twice (once per category); keep the first of each name
  AO.uniq = function (list) {
    var seen = {};
    return list.filter(function (p) { var k = p.n.toLowerCase(); if (seen[k]) return false; seen[k] = 1; return true; });
  };
  // fit a map to the two towns, ignoring the few outlying listings that would zoom it out to county scale
  AO.fit = function (map, pts) {
    if (!pts.length) return;
    var core = pts.filter(function (p) { return p[0] > 32.52 && p[0] < 32.72 && p[1] > -85.56 && p[1] < -85.30; });
    map.fitBounds(core.length ? core : pts, { padding: [28, 28], maxZoom: 15 });
  };
  AO.miles = function (a, b, c, d) {
    var R = 3958.8, r = Math.PI / 180, x = Math.sin((c - a) * r / 2), y = Math.sin((d - b) * r / 2);
    return 2 * R * Math.asin(Math.sqrt(x * x + Math.cos(a * r) * Math.cos(c * r) * y * y));
  };

  /* ---- dates (all local calendar days, 'YYYY-MM-DD') ---- */
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONF = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var DOWF = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  AO.d = function (s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  AO.iso = function (d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  AO.add = function (s, n) { var d = AO.d(s); d.setDate(d.getDate() + n); return AO.iso(d); };
  AO.fmt = function (s, long) {
    var d = AO.d(s);
    return long ? DOWF[d.getDay()] + ', ' + MONF[d.getMonth()] + ' ' + d.getDate() : DOW[d.getDay()] + ', ' + MON[d.getMonth()] + ' ' + d.getDate();
  };
  AO.parts = function (s) { var d = AO.d(s); return { m: MON[d.getMonth()], d: d.getDate(), w: DOW[d.getDay()] }; };
  // The listings are a snapshot. Use the viewer's real date while the snapshot still covers it.
  AO.today = function () {
    var t = AO.iso(new Date()), ev = AO.events, last = ev.length ? ev[ev.length - 1].d : AO.snap;
    return (t < AO.snap || t > last) ? AO.snap : t;
  };
  AO.range = function (when) {
    var t = AO.today(), dow = AO.d(t).getDay();
    if (when === 'today') return [t, t];
    if (when === 'weekend') {
      var fri = dow === 0 ? AO.add(t, -2) : dow === 6 ? AO.add(t, -1) : AO.add(t, 5 - dow);
      return [fri < t ? t : fri, AO.add(fri, 2)];
    }
    if (when === 'week') return [t, AO.add(t, 6)];
    if (/^\d{4}-\d{2}$/.test(when || '')) {
      var p = when.split('-'), end = new Date(+p[0], +p[1], 0);
      var a = when + '-01';
      return [a < t ? t : a, AO.iso(end)];
    }
    return [t, '9999-12-31'];
  };
  AO.inRange = function (e, r) { return e.d <= r[1] && (e.e || e.d) >= r[0]; };
  AO.eventsIn = function (r) { return AO.events.filter(function (e) { return AO.inRange(e, r); }); };
  AO.when = function (e) {
    if (e.e) return (e.rc ? 'Select days through ' : 'Through ') + AO.fmt(e.e);
    return AO.fmt(e.d);
  };

  /* ---- trip (per-viewer convenience; the page works without storage) ---- */
  var KEY = 'ao-trip';
  AO.trip = {
    get: function () {
      try { var t = JSON.parse(localStorage.getItem(KEY)); if (t && t.p && t.e) return t; } catch (err) { }
      return AO.trip._mem || { p: [], e: [] };
    },
    set: function (t) {
      AO.trip._mem = t;
      try { localStorage.setItem(KEY, JSON.stringify(t)); } catch (err) { }
      AO.trip.paint();
    },
    has: function (kind, id) { return AO.trip.get()[kind].indexOf(+id) > -1; },
    toggle: function (kind, id) {
      var t = AO.trip.get(), i = t[kind].indexOf(+id), added = i < 0;
      if (added) t[kind].push(+id); else t[kind].splice(i, 1);
      AO.trip.set(t);
      return added;
    },
    count: function () { var t = AO.trip.get(); return t.p.length + t.e.length; },
    paint: function () {
      var n = AO.trip.count();
      document.querySelectorAll('[data-trip-count]').forEach(function (el) { el.textContent = n; });
      document.querySelectorAll('.save[data-id]').forEach(function (b) {
        var on = AO.trip.has(b.dataset.kind, b.dataset.id);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (b.dataset.label) b.querySelector('span').textContent = on ? 'Saved to my trip' : 'Save to my trip';
      });
    }
  };

  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg>';
  AO.saveBtn = function (kind, id, name) {
    return '<button class="save" type="button" data-kind="' + kind + '" data-id="' + id + '" aria-pressed="' + (AO.trip.has(kind, id) ? 'true' : 'false') +
      '" aria-label="Save ' + AO.esc(name) + ' to my trip">' + HEART + '</button>';
  };

  /* ---- shared renderers ---- */
  AO.placeCard = function (p, opt) {
    opt = opt || {};
    var key = opt.cat || AO.primaryCat(p);
    var cat = AO.CAT[key === 'bites' ? 'eat' : key] || '';   // the Best Bites badge already says it
    var img = p.m ? '<img loading="lazy" src="' + AO.src(p.m, 520, 390) + '" alt="">' : '';
    return '<article class="card">' +
      '<div class="card-img">' + img + (p.c.indexOf('bites') > -1 ? '<span class="badge">Best Bites</span>' : '') + '</div>' +
      AO.saveBtn('p', p.i, p.n) +
      '<h3><a class="main" href="place.html?id=' + p.i + '">' + AO.esc(p.n) + '</a></h3>' +
      '<p class="meta"><span>' + AO.esc(cat) + '</span><span class="dot ' + p.t + '">' + AO.esc(p.r || AO.TOWN[p.t]) + '</span>' +
      (opt.dist != null ? '<span>' + (opt.dist < 0.1 ? 'Next door' : opt.dist.toFixed(1) + ' mi away') + '</span>' : '') + '</p>' +
      (opt.blurb ? '<p class="blurb">' + AO.esc(p.s) + '</p>' : '') +
      '</article>';
  };
  AO.eventRow = function (e, opt) {
    opt = opt || {};
    var r = opt.range, show = e.d;
    if (r && e.e && e.d < r[0]) show = r[0];            // ongoing event: show it on the day being browsed
    var pt = AO.parts(show);
    var tags = (e.c.indexOf('free') > -1 ? '<span class="tag tag-free">Free</span>' : '');
    var meta = [];
    if (e.e) meta.push('<span>' + AO.esc(AO.when(e)) + '</span>');
    if (e.tm) meta.push('<span>' + AO.esc(e.tm) + '</span>');
    if (e.l) meta.push('<span class="dot ' + e.t + '">' + AO.esc(e.l) + '</span>');
    return '<a class="ev" href="event.html?id=' + e.i + '">' +
      '<div class="ev-date"><span class="m">' + pt.m + '</span><span class="d">' + pt.d + '</span><span class="w">' + pt.w + '</span></div>' +
      '<div><h3>' + AO.esc(e.n) + '</h3><p class="ev-meta">' + tags + meta.join('') + '</p></div>' +
      (e.m ? '<img class="ev-img" loading="lazy" src="' + AO.src(e.m, 264, 176) + '" alt="">' : '<span></span>') +
      '</a>';
  };

  AO.toast = function (html) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.innerHTML = html;
    t.classList.add('show');
    clearTimeout(AO._tt);
    AO._tt = setTimeout(function () { t.classList.remove('show'); }, 3200);
  };

  /* ---- map ---- */
  AO.COLOR = { A: '#a13d08', O: '#14606a', B: '#15130f', N: '#5d564a' };
  AO.map = function (el, opt) {
    if (!window.L) { el.innerHTML = '<p class="empty">The map could not load. The list still works.</p>'; return null; }
    var map = L.map(el, { scrollWheelZoom: false, preferCanvas: true, zoomControl: true }).setView([32.627, -85.43], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    el.addEventListener('click', function () { map.scrollWheelZoom.enable(); });
    return map;
  };
  AO.pin = function (p, color) {
    return L.circleMarker([p.la, p.lo], { radius: 7, weight: 2, color: '#fffdf8', fillColor: color || AO.COLOR[p.t], fillOpacity: 1 });
  };
  AO.popup = function (p, href) {
    return '<a class="pop" href="' + href + '">' + (p.m ? '<img src="' + AO.src(p.m, 420, 220) + '" alt="">' : '') +
      '<b>' + AO.esc(p.n) + '</b><span>' + AO.esc(p.a || p.l || '') + '</span></a>';
  };

  /* ---- page chrome ---- */
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('.save[data-id]');
    if (b) {
      ev.preventDefault();
      var added = AO.trip.toggle(b.dataset.kind, b.dataset.id);
      AO.toast(added ? 'Saved to your trip. <a href="trip.html">View trip</a>' : 'Removed from your trip.');
      return;
    }
    if (ev.target.closest('[data-menu-open]')) { document.getElementById('drawer').classList.add('open'); document.querySelector('[data-menu-close]').focus(); }
    if (ev.target.closest('[data-menu-close]')) { document.getElementById('drawer').classList.remove('open'); document.querySelector('[data-menu-open]').focus(); }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { var d = document.getElementById('drawer'); if (d) d.classList.remove('open'); }
  });
  document.addEventListener('DOMContentLoaded', AO.trip.paint);
})();
