/* Leaf & Petal concept — Williams Digital */
(function () {
  'use strict';
  var LP = window.LP;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.h); toast.h = setTimeout(function () { t.classList.remove('show'); }, 4200);
  }

  /* ---------- Birmingham time + current season ---------- */
  function cst() {
    var p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', weekday: 'short', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { dow: days[p.weekday], month: +p.month, day: +p.day, mins: (+p.hour % 24) * 60 + (+p.minute) };
  }
  var NOW = cst();
  function currentSeason() {
    var m = NOW.month, d = NOW.day;
    if (m <= 2) return 'winter';
    if (m <= 5) return 'spring';
    if (m <= 8) return 'summer';
    if (m < 11 || (m === 11 && d < 15)) return 'fall';
    return 'holiday';
  }
  var SEASON = currentSeason();
  $$('[data-season], [data-now]').forEach(function (el) {
    var s = el.getAttribute('data-season') || el.getAttribute('data-now');
    if (s === SEASON && !el.querySelector('.now')) {
      var b = document.createElement('span'); b.className = 'now'; b.textContent = 'Now';
      if (el.classList.contains('sblock')) { var h = el.querySelector('h2'); if (h) h.appendChild(b); }
      else el.appendChild(b);
    }
  });

  /* ---------- header menu ---------- */
  var menuBtn = $('.menu-btn'), nav = $('#nav');
  if (menuBtn) menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.querySelector('span').textContent = open ? 'Close' : 'Menu';
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && nav && nav.classList.contains('open')) { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.querySelector('span').textContent = 'Menu'; menuBtn.focus(); }
  });

  /* ---------- call / visit sheet (phones) ---------- */
  var sheet = $('#sheet'), lastFocus = null;
  function openSheet() {
    lastFocus = document.activeElement;
    sheet.classList.add('open'); sheet.setAttribute('aria-hidden', 'false');
    $('.sheet-panel', sheet).setAttribute('tabindex', '-1'); $('.sheet-panel', sheet).focus();
  }
  function closeSheet() {
    sheet.classList.remove('open'); sheet.setAttribute('aria-hidden', 'true');
    if (lastFocus) lastFocus.focus();
  }
  $$('[data-sheet]').forEach(function (b) { b.addEventListener('click', openSheet); });
  $$('[data-close]', sheet).forEach(function (b) { b.addEventListener('click', closeSheet); });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && sheet.classList.contains('open')) closeSheet(); });

  /* hide the dock where it would duplicate what's on screen */
  var dock = $('#dock');
  if (dock && document.body.getAttribute('data-page') === 'events') { var dl = dock.querySelector('a'); dl.href = '#ask'; dl.textContent = 'Ask about a date'; }
  if (dock && 'IntersectionObserver' in window) {
    var hideFor = $$('.foot, #ask, #shops, .shop-big .btns');
    var seen = new Set();
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target); });
      dock.classList.toggle('hide', seen.size > 0);
    }, { threshold: 0.15 });
    hideFor.forEach(function (el) { io.observe(el); });
  }

  /* ---------- open now ---------- */
  function fmt(mins) {
    var h = Math.floor(mins / 60), m = mins % 60, ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12; return h + (m ? ':' + String(m).padStart(2, '0') : '') + ' ' + ap;
  }
  function todayHours(shop, dow) {
    if (!shop.hours) return null;
    for (var i = 0; i < shop.hours.length; i++) { var r = shop.hours[i]; if (dow >= r[0] && dow <= r[1]) return [r[2], r[3]]; }
    return null;
  }
  $$('[data-hours]').forEach(function (el) {
    var shop = LP.shops.filter(function (s) { return s.id === el.getAttribute('data-hours'); })[0];
    var t = todayHours(shop, NOW.dow);
    if (t && NOW.mins >= t[0] && NOW.mins < t[1]) { el.className = 'status open'; el.textContent = 'Open now until ' + fmt(t[1]); }
    else {
      var next = t && NOW.mins < t[0] ? 'Opens today at ' + fmt(t[0]) : 'Opens ' + (function () { var n = todayHours(shop, (NOW.dow + 1) % 7); return n ? 'tomorrow at ' + fmt(n[0]) : 'soon'; })();
      el.className = 'status closed'; el.textContent = 'Closed now. ' + next;
    }
  });

  /* ---------- greenhouse window (home hero) ---------- */
  var gh = $('#gh');
  if (gh) {
    var panes = $$('.gh-pane', gh), cur = null, gen = 0, timers = [];
    var title = $('#ghTitle'), sub = $('#ghSub'), link = $('#ghLink');
    var order = [0, 1, 3, 2, 4, 6, 5, 7, 8]; // diagonal sweep
    var preload = function (s) { LP.panes[s].forEach(function (n) { var i = new Image(); i.src = 'img/s/' + n + '.webp'; }); };
    var setSeason = function (s, first) {
      if (s === cur) return;
      cur = s; var g = ++gen;
      timers.forEach(clearTimeout); timers = [];
      $$('.season', gh).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-season') === s ? 'true' : 'false'); });
      title.textContent = LP.names[s] + ' at Leaf & Petal';
      sub.textContent = LP.seasons[s].length + ' photos from our shops';
      link.href = 'seasons.html#' + s;
      var names = LP.panes[s];
      order.forEach(function (pi, k) {
        var pane = panes[pi], img = pane.querySelector('img');
        var swap = function () {
          if (g !== gen) return; // a newer season was picked
          var n = names[pi]; img.onload = img.onerror = null;
          var alt = LP.seasons[s].filter(function (x) { return x[0] === n; })[0]; img.alt = alt ? alt[1] : '';
          var show = function () { if (g === gen) pane.classList.remove('out', 'load'); };
          if (img.getAttribute('src') === 'img/s/' + n + '.webp' && img.complete) { requestAnimationFrame(show); return; }
          img.onload = show; img.onerror = show; img.src = 'img/s/' + n + '.webp';
          if (img.complete) requestAnimationFrame(show);
        };
        if (reduce) { swap(); return; }
        timers.push(setTimeout(function () {
          if (first) swap();
          else { pane.classList.add('out'); timers.push(setTimeout(swap, 300)); }
        }, k * (first ? 90 : 60)));
      });
      LP.order.forEach(function (o) { if (o !== s) setTimeout(function () { preload(o); }, 1500); });
    };
    $$('.season', gh).forEach(function (b) { b.addEventListener('click', function () { setSeason(b.getAttribute('data-season')); }); });
    setSeason(SEASON, true);
  }

  /* ---------- shop picker (home) ---------- */
  var rows = $$('.shop-row');
  if (rows.length) {
    var photos = $$('.shop-photo img');
    rows.forEach(function (row) {
      var btn = row.querySelector('.row-btn');
      btn.addEventListener('click', function () {
        var opening = !row.hasAttribute('data-open');
        var desktop = window.matchMedia('(min-width: 901px)').matches;
        if (!opening && desktop) return; // desktop always keeps one open
        rows.forEach(function (r) { r.removeAttribute('data-open'); r.querySelector('.row-btn').setAttribute('aria-expanded', 'false'); });
        if (opening) {
          row.setAttribute('data-open', ''); btn.setAttribute('aria-expanded', 'true');
          photos.forEach(function (p) { p.hidden = p.getAttribute('data-shop') !== row.getAttribute('data-shop'); });
        }
      });
    });
  }

  /* ---------- seasons page: order from now, tabs, lightbox ---------- */
  var sblocks = $('#sblocks');
  if (sblocks) {
    var o = LP.order, i0 = o.indexOf(SEASON);
    o.slice(i0).concat(o.slice(0, i0)).forEach(function (s) { sblocks.appendChild($('#' + s)); });
    var tabs = $('.stabs .wrap');
    o.slice(i0).concat(o.slice(0, i0)).forEach(function (s) { tabs.appendChild($('.stabs [data-season="' + s + '"]')); });
    var tabLinks = $$('.stabs .season');
    if ('IntersectionObserver' in window) {
      var sio = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) {
            var id = en.target.id;
            tabLinks.forEach(function (a) { var on = a.getAttribute('data-season') === id; a.setAttribute('aria-current', on ? 'true' : 'false'); if (on && a.scrollIntoView && window.innerWidth < 900) a.parentNode.scrollTo({ left: a.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' }); });
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      $$('.sblock').forEach(function (b) { sio.observe(b); });
    }
    if (location.hash && $(location.hash)) setTimeout(function () { $(location.hash).scrollIntoView(); }, 50);

    var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
    var list = [], idx = 0, opener = null;
    var show = function () {
      var b = list[idx]; lbImg.src = b.getAttribute('data-full'); lbImg.alt = b.querySelector('img').alt;
      lbCap.textContent = b.querySelector('img').alt;
      var s = b.closest('.sblock').getAttribute('data-season');
      lbCount.textContent = LP.names[s] + ', ' + (idx + 1) + ' of ' + list.length;
    };
    $$('.mosaic button').forEach(function (b) {
      b.addEventListener('click', function () {
        list = $$('button', b.closest('.mosaic')); idx = list.indexOf(b); opener = b;
        show(); if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
      });
    });
    var step = function (d) { idx = (idx + d + list.length) % list.length; show(); };
    $('#lbPrev').addEventListener('click', function () { step(-1); });
    $('#lbNext').addEventListener('click', function () { step(1); });
    $('#lbX').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('close', function () { if (opener) opener.focus(); });
    lb.addEventListener('keydown', function (ev) { if (ev.key === 'ArrowLeft') step(-1); if (ev.key === 'ArrowRight') step(1); });
    lb.addEventListener('click', function (ev) { if (ev.target === lb || ev.target.classList.contains('lb-stage') || ev.target.tagName === 'FIGURE') lb.close(); });
    var tx = null;
    lb.addEventListener('touchstart', function (ev) { tx = ev.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (ev) { if (tx === null) return; var dx = ev.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); tx = null; });
  }

  /* ---------- shops page: map pins + nearest shop ---------- */
  $$('.map .pin').forEach(function (p) {
    var go = function () { var t = $('#' + p.getAttribute('data-go')); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
    p.addEventListener('click', go);
    p.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(); } });
  });
  var locBtn = $('#locBtn');
  if (locBtn) {
    var out = $('#locOut');
    var miles = function (a, b, c, d) {
      var R = 3958.8, r = Math.PI / 180, x = (d - b) * r * Math.cos((a + c) / 2 * r), y = (c - a) * r;
      return Math.sqrt(x * x + y * y) * R;
    };
    locBtn.addEventListener('click', function () {
      if (!navigator.geolocation) { out.textContent = 'Your browser can’t share a location. All three shops are listed below.'; return; }
      out.textContent = 'Finding your location…';
      navigator.geolocation.getCurrentPosition(function (pos) {
        var la = pos.coords.latitude, ln = pos.coords.longitude;
        var ranked = LP.shops.map(function (s) { return { s: s, d: miles(la, ln, s.lat, s.lng) }; }).sort(function (a, b) { return a.d - b.d; });
        var box = $('#shopSecs');
        ranked.forEach(function (r) {
          box.appendChild($('#' + r.s.id));
          var el = $('[data-dist="' + r.s.id + '"]'); el.textContent = r.d < 0.1 ? 'You’re here' : r.d.toFixed(1) + ' mi away';
        });
        out.textContent = 'Closest: ' + ranked[0].s.name + ', about ' + ranked[0].d.toFixed(1) + ' miles away. Shops are now listed nearest first.';
      }, function () {
        out.textContent = 'We couldn’t get your location. All three shops are listed below, or tap a pin on the map.';
      }, { timeout: 10000, maximumAge: 600000 });
    });
  }

  /* ---------- events: tabs ---------- */
  var ktabs = $$('.ktab');
  if (ktabs.length) {
    var sel = function (t, focus) {
      ktabs.forEach(function (x) {
        var on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
        $('#' + x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
    };
    ktabs.forEach(function (t, i) {
      t.addEventListener('click', function () { sel(t); });
      t.addEventListener('keydown', function (ev) {
        var k = ev.key, n = null;
        if (k === 'ArrowDown' || k === 'ArrowRight') n = ktabs[(i + 1) % ktabs.length];
        if (k === 'ArrowUp' || k === 'ArrowLeft') n = ktabs[(i - 1 + ktabs.length) % ktabs.length];
        if (n) { ev.preventDefault(); sel(n, true); }
      });
    });
  }

  /* ---------- events: month detail ---------- */
  var monthOut = $('#monthOut');
  var LABEL = { yes: 'Open for events', ask: 'Ask us', no: 'Closed for events' };
  if (monthOut) {
    var mbtns = $$('#months button');
    var showMonth = function (i) {
      var m = LP.months[i];
      mbtns.forEach(function (b, j) { b.parentNode.setAttribute('aria-current', j === i ? 'true' : 'false'); });
      monthOut.innerHTML = '<b>' + m[0] + ': ' + LABEL[m[1]] + '.</b> ' + m[2];
    };
    mbtns.forEach(function (b, i) { b.addEventListener('click', function () { showMonth(i); }); });
  }

  /* ---------- events: estimator ---------- */
  var cpN = $('#cpN');
  if (cpN) {
    var n = 8;
    var money = function (v) { return '$' + v.toLocaleString('en-US'); };
    var calc = function () {
      var two = $('input[name=att]:checked').value === '2';
      var att = two ? 350 : 225, cp = n * 25;
      cpN.textContent = n;
      $('#attLab').textContent = two ? 'Two attendants' : 'One attendant';
      $('#attAmt').textContent = money(att);
      $('#cpLine').textContent = n === 0 ? 'No centerpieces' : n + (n === 1 ? ' centerpiece' : ' centerpieces') + ' at $25';
      $('#cpAmt').textContent = money(cp);
      $('#estTotal').textContent = money(1500 + att + cp);
      $('#cpMinus').disabled = n === 0; $('#cpPlus').disabled = n === 20;
    };
    $('#cpMinus').addEventListener('click', function () { if (n > 0) { n--; calc(); } });
    $('#cpPlus').addEventListener('click', function () { if (n < 20) { n++; calc(); } });
    $$('input[name=att]').forEach(function (r) { r.addEventListener('change', calc); });
    calc();
  }

  /* ---------- events: inquiry form (concept, not connected) ---------- */
  var form = $('#inq');
  if (form) {
    var fm = $('#f-month'), flag = $('#dateFlag');
    fm.addEventListener('change', function () {
      if (fm.value === '') { flag.textContent = ''; flag.className = 'date-flag'; return; }
      var m = LP.months[+fm.value];
      flag.className = 'date-flag ' + m[1];
      flag.textContent = m[1] === 'yes' ? 'Good news: we host events in ' + m[0] + '.' : m[1] === 'ask' ? m[0] + ' is busy for us. Some dates may work, so ask.' : 'We’re unable to host events in ' + m[0] + '. Try another month.';
    });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var bad = $$('[required]', form).filter(function (f) { return !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)); });
      $$('[required]', form).forEach(function (f) { f.setAttribute('aria-invalid', bad.indexOf(f) > -1 ? 'true' : 'false'); });
      if (bad.length) { bad[0].focus(); toast('Add your ' + bad.map(function (f) { return f.name; }).join(', ') + ' so we can reply.'); return; }
      var done = $('#formDone');
      done.textContent = 'This is a design concept, so the form isn’t connected yet. On the live site, your inquiry goes straight to the Event Coordinator.';
      done.classList.add('show');
    });
  }
})();
