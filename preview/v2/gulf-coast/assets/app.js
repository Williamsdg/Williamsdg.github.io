/* Build your day — planner + explorer. Sample data only; nothing is booked or charged. */
(function () {
  'use strict';
  var GC = window.GC;
  var $ = function (id) { return document.getElementById(id); };
  var mqMobile = window.matchMedia('(max-width: 899px)');

  var DEFAULT = { exp: null, slot: null, guests: 2, addons: [], filters: { bucket: 'any', group: 'any', vibe: 'any' } };
  var state = Object.assign({}, DEFAULT, GC.store.get('draft', {}));
  state.filters = Object.assign({}, DEFAULT.filters, state.filters || {});
  if (!GC.byId(state.exp)) { state.exp = null; state.slot = null; }
  var tbOpen = false;
  var lastSheetTrigger = null;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function exp() { return GC.byId(state.exp); }
  function slot() { var e = exp(); if (!e || !state.slot) return null; return e.slots.filter(function (s) { return s.id === state.slot; })[0] || null; }
  function maxGuests() { var e = exp(); if (!e) return 12; var s = slot(); return s ? Math.max(1, Math.min(e.capacity, s.left)) : e.capacity; }
  function persist() { GC.store.set('draft', state); }
  function matches(e) {
    var f = state.filters;
    return (f.bucket === 'any' || e.bucket === f.bucket) && (f.group === 'any' || e.groups.indexOf(f.group) > -1) && (f.vibe === 'any' || e.vibes.indexOf(f.vibe) > -1);
  }
  function dashLine(e) {
    var r = GC.ROUTES[e.id];
    return '<svg class="dash-sample" viewBox="0 0 58 6" aria-hidden="true"><line x1="2" y1="3" x2="56" y2="3"' + (r.dash ? ' stroke-dasharray="' + r.dash.split(' ').map(function (n) { return n * 0.5; }).join(' ') + '"' : '') + ' stroke-linecap="round"/></svg>';
  }

  /* ---------- list ---------- */
  function itemHtml(e, isMatch) {
    return '<li class="exp-item' + (isMatch ? '' : ' nomatch') + '"><button type="button" class="exp-btn" data-id="' + e.id + '" aria-pressed="' + (state.exp === e.id) + '">' +
      '<span class="rnum" aria-hidden="true">' + e.n + '</span>' +
      '<span class="exp-name"><span class="visually-hidden">Route ' + e.n + ': </span>' + esc(e.name) + '</span>' +
      '<span class="exp-meta">' + e.duration + ' · ' + esc(e.boat) + '<br>' + GC.priceLine(e) + ' <span class="visually-hidden">(sample price)</span>' + dashLine(e) + '</span>' +
      '</button></li>';
  }
  function renderList() {
    var inn = '', out = '', count = 0;
    GC.EXPERIENCES.forEach(function (e) { if (matches(e)) { inn += itemHtml(e, true); count++; } else out += itemHtml(e, false); });
    $('exp-list').innerHTML = inn || '<li class="placeholder" style="padding:10px 6px">No routes match. Try "Any" on a filter.</li>';
    $('exp-list-out').innerHTML = out;
    $('nomatch-wrap').hidden = !out;
    $('match-count').textContent = count + ' of ' + GC.EXPERIENCES.length + ' match';
  }

  /* ---------- map ---------- */
  function renderMapOnce() {
    $('map').innerHTML = GC.buildMap({ interactive: true, uid: 'main', viewBox: '0 100 1000 680', label: 'Schematic chart of Pelican Bay and Driftwood Pass with five numbered routes. Fictional, not for navigation.' });
  }
  function renderMapState() {
    var svg = $('map').querySelector('svg');
    svg.classList.toggle('has-selection', !!state.exp);
    svg.querySelectorAll('.route').forEach(function (g) {
      var id = g.getAttribute('data-id'), e = GC.byId(id), on = id === state.exp;
      g.classList.toggle('is-selected', on);
      g.classList.toggle('is-dim', !on && !matches(e));
      g.setAttribute('aria-pressed', on);
    });
    var e = exp();
    $('stop-legend').innerHTML = e ? GC.ROUTES[e.id].stops.map(function (s, i) { return '<li><b aria-hidden="true">' + (i + 1) + '</b>' + esc(s[2]) + '</li>'; }).join('') : '<li>Select a route to see its numbered stops.</li>';
    centerMap();
    $('map-hint').textContent = e ? 'Route ' + e.n + ' selected · ' + e.duration : (mqMobile.matches ? 'Drag the chart sideways; tap a route line or number.' : 'Select a route line or its number.');
  }

  function centerMap() {
    var sc = $('map'), e = exp();
    if (!e || sc.scrollWidth <= sc.clientWidth) return;
    var pts = GC.ROUTES[e.id].pts, xs = pts.map(function (q) { return q[0]; });
    var cx = (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2 / 1000;
    sc.scrollLeft = Math.max(0, cx * sc.scrollWidth - sc.clientWidth / 2);
  }

  /* ---------- planner ---------- */
  function renderPlanner() {
    var e = exp();
    $('pl-exp').innerHTML = e
      ? '<div class="pl-exp"><img src="' + e.img + '" alt="" width="78" height="58"><div><b>' + e.n + ' · ' + esc(e.name) + '</b><span>' + e.duration + ' · ' + GC.priceLine(e) + ' (sample)</span><br><a href="experience.html?id=' + e.id + '">Field notes for this route</a></div></div>'
      : '<p class="pl-exp-empty">Pick a route on the chart or from the route key to start.</p>';

    if (!e) {
      $('slots-area').innerHTML = '<p class="placeholder">Departures appear once you pick a route.</p>';
    } else {
      var html = '<div class="slots" role="radiogroup" aria-labelledby="slots-h" id="slots">';
      var focusable = state.slot || (e.slots.filter(function (s) { return s.left > 0; })[0] || e.slots[0]).id;
      e.slots.forEach(function (s) {
        var full = s.left <= 0, low = !full && s.left <= 3;
        html += '<button type="button" role="radio" class="slot' + (low ? ' low' : '') + '" data-slot="' + s.id + '" aria-checked="' + (state.slot === s.id) + '"' + (full ? ' aria-disabled="true"' : '') + ' tabindex="' + (s.id === focusable ? 0 : -1) + '">' +
          '<b>' + s.day + ' · ' + s.time + '</b><span>' + (e.pricing === 'boat' ? (full ? 'Boat booked (sample)' : 'Boat available') : full ? 'Full (sample)' : s.left + ' seat' + (s.left === 1 ? '' : 's') + ' left') + '</span></button>';
      });
      html += '</div><div class="tide-box">' + GC.tideSvg(e.slots, state.slot) + '<p class="tide-cap">Sample tide curve, 6 a.m.–8 p.m. — illustrative, not a forecast.</p></div>';
      $('slots-area').innerHTML = html;
    }

    var max = maxGuests();
    if (state.guests > max) state.guests = max;
    if (state.guests < 1) state.guests = 1;
    $('g-count').textContent = state.guests;
    $('g-minus').disabled = state.guests <= 1;
    $('g-plus').disabled = state.guests >= max;
    var s = slot();
    $('g-note').textContent = !e ? 'Up to 12 on the largest boat' : s ? 'Max ' + max + ' for this departure (sample seats)' : 'Max ' + e.capacity + ' on ' + e.boat + '; pick a departure for seats';

    if (!e) {
      $('addons-area').innerHTML = '<p class="placeholder">Extras depend on the route.</p>';
    } else {
      $('addons-area').innerHTML = '<div class="addons">' + e.addons.map(function (a) {
        var ad = GC.ADDONS[a];
        return '<label class="addon"><input type="checkbox" data-addon="' + a + '"' + (state.addons.indexOf(a) > -1 ? ' checked' : '') + '> <span>' + esc(ad.label) + '</span><em>+' + GC.money(ad.price) + (ad.per === 'guest' ? ' / guest' : ' / trip') + '</em></label>';
      }).join('') + '</div>';
    }
    $('pass-live').innerHTML = passHtml(state, false);
  }

  function passHtml(t, saved) {
    var e = GC.byId(t.exp);
    var s = e && t.slot ? e.slots.filter(function (x) { return x.id === t.slot; })[0] : null;
    var dash = '—';
    var addons = e ? t.addons.filter(function (a) { return e.addons.indexOf(a) > -1; }).map(function (a) { return GC.ADDONS[a].label; }) : [];
    var total = e ? GC.computeTotal(e, t.guests, t.addons.filter(function (a) { return e.addons.indexOf(a) > -1; })) : 0;
    var code = e ? 'GC-' + e.n + (s ? '-' + s.id.toUpperCase() : '') : 'GC-—';
    return '<div class="pass' + (e ? '' : ' is-empty') + '"' + (saved ? '' : ' aria-label="Boarding pass preview"') + '>' +
      '<div class="pass-main">' +
      '<div class="pass-top"><span>' + (saved ? 'Saved sample trip' : 'Boarding pass · sample') + '</span><span>' + code + '</span></div>' +
      '<p class="pass-title">' + (e ? esc(e.name) : 'Your route goes here') + '</p>' +
      '<dl class="pass-fields">' +
      '<div><dt>Boat</dt><dd>' + (e ? esc(e.boat) : dash) + '</dd></div>' +
      '<div><dt>Departure</dt><dd>' + (s ? s.day + ' · ' + s.time : dash) + '</dd></div>' +
      '<div class="wide"><dt>Meeting point</dt><dd>' + (e ? esc(e.meeting) : dash) + '</dd></div>' +
      '<div><dt>Duration</dt><dd>' + (e ? e.duration : dash) + '</dd></div>' +
      '<div><dt>Guests</dt><dd>' + (e ? t.guests : dash) + '</dd></div>' +
      '<div class="wide"><dt>Add-ons</dt><dd>' + (addons.length ? esc(addons.join(', ')) : (e ? 'None' : dash)) + '</dd></div>' +
      '</dl>' +
      '<div class="pass-total"><span>Sample total · illustrative price' + (e && e.pricing === 'boat' ? ' (whole boat)' : '') + '</span><b>' + (e ? GC.money(total) : '$—') + '</b></div>' +
      '</div>' +
      '<div class="pass-stub" aria-hidden="true"><small>Route</small><span class="big">' + (e ? e.n : '·') + '</span>' +
      '<svg viewBox="0 0 56 28"><path d="M2 10 C 9 4, 14 16, 21 10 S 33 4, 40 10 S 50 16, 54 10" fill="none" stroke="#F2C855" stroke-width="2.4" stroke-linecap="round"/><path d="M2 20 C 9 14, 14 26, 21 20 S 33 14, 40 20 S 50 26, 54 20" fill="none" stroke="#D9E9DD" stroke-width="2" stroke-linecap="round" opacity=".6"/></svg>' +
      '<small>Sample</small></div>' +
      '</div>';
  }

  /* ---------- trip bar (mobile) ---------- */
  function renderTripbar() {
    var e = exp(), s = slot();
    var total = e ? GC.computeTotal(e, state.guests, state.addons) : 0;
    var h = '<div class="tb-row">' +
      (e ? '<span class="rnum" aria-hidden="true">' + e.n + '</span>' : '') +
      '<div class="tb-text"><b>' + (e ? esc(e.name) : 'No trip yet') + '</b><span>' + (e ? (s ? s.day + ' ' + s.time : 'Pick a departure') + ' · ' + state.guests + ' guest' + (state.guests === 1 ? '' : 's') : 'Choose a route to start your day') + '</span></div>' +
      (e ? '<span class="tb-total" aria-label="Sample total ' + GC.money(total) + '">' + GC.money(total) + '</span>' : '') +
      '<button type="button" class="tb-toggle" id="tb-toggle" aria-expanded="' + tbOpen + '" aria-controls="tb-more"><span class="visually-hidden">' + (tbOpen ? 'Hide' : 'Show') + ' trip details</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 12 L10 6 L16 12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>' +
      '</div>' +
      '<div class="tb-more" id="tb-more"' + (tbOpen ? '' : ' hidden') + '>' +
      (e ? '<dl><div><dt>Boat</dt><dd>' + esc(e.boat) + '</dd></div><div><dt>Meet</dt><dd>' + esc(e.meeting) + '</dd></div><div><dt>Duration</dt><dd>' + e.duration + '</dd></div><div><dt>Add-ons</dt><dd>' + (state.addons.length || 'None') + '</dd></div></dl>' : '') +
      '<div class="tb-actions"><button type="button" class="btn-primary" id="tb-edit">' + (e ? 'Edit in planner' : 'Browse routes') + '</button></div>' +
      '<p class="tb-note">Sample prices and seats — nothing is booked or charged.</p>' +
      '</div>';
    $('tripbar').innerHTML = h;
  }
  function syncTripbarPad() {
    var bar = $('tripbar');
    document.body.classList.toggle('has-tripbar', mqMobile.matches);
    document.documentElement.style.setProperty('--tripbar-h', (mqMobile.matches ? bar.offsetHeight : 0) + 'px');
    document.body.style.setProperty('--tripbar-h', (mqMobile.matches ? bar.offsetHeight : 0) + 'px');
  }

  /* ---------- saved trip ---------- */
  function renderTrip() {
    var t = GC.store.get('trip', null);
    var e = t && GC.byId(t.exp);
    if (!e) {
      $('trip-area').innerHTML = '<div class="trip-empty"><svg viewBox="0 0 90 56" aria-hidden="true"><rect x="2" y="6" width="86" height="44" rx="6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4"/><path d="M62 6 V50" stroke="currentColor" stroke-width="2" stroke-dasharray="3 4"/><path d="M12 22 H48 M12 32 H38" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="75" cy="28" r="7" fill="#F2C855" stroke="currentColor" stroke-width="2"/></svg><div><p><strong>No saved trip yet.</strong></p><p class="small-print" style="margin-top:4px">Build a day in the planner and press “Save sample trip”. Your pass, meeting instructions and packing checklist will appear here.</p></div></div>';
      return;
    }
    var s = e.slots.filter(function (x) { return x.id === t.slot; })[0];
    var checks = GC.store.get('checklist', {});
    var items = GC.BASE_CHECKLIST.concat(e.checklist);
    var boatLine = e.id === 'kayak' ? 'Look for the guide flag and the kayak racks at the water’s edge.' : 'Walk to the slip sign and look for ' + esc(e.boat) + '; the crew boards 10 minutes before departure.';
    $('trip-area').innerHTML = '<div class="trip-grid">' +
      '<div>' + passHtml(t, true) + '<p class="small-print">Saved in this browser only. Nothing was booked, sent, or charged.</p></div>' +
      '<div class="trip-card"><h3>Meeting instructions</h3><ol>' +
      '<li>Arrive by <strong>' + minus20(s) + '</strong> (' + s.day + ') at <strong>' + esc(e.meeting) + '</strong>.</li>' +
      '<li>' + boatLine + '</li>' +
      '<li>Check in under the lead guest’s first name. <span class="small-print">(In this concept there is no real check-in list.)</span></li>' +
      '<li>Parking: Gull Street lot (fictional). A real site would list fees and walking time here.</li>' +
      '<li>Weather: if a captain called the trip, a real operator would contact you to reschedule. This demo contacts no one.</li>' +
      '</ol></div>' +
      '<div class="trip-card"><h3>Pack &amp; prepare</h3><ul class="checklist">' +
      items.map(function (it, i) {
        var must = /required/i.test(it);
        return '<li' + (must ? ' class="must"' : '') + '><label><input type="checkbox" data-check="' + i + '"' + (checks[e.id + ':' + i] ? ' checked' : '') + '><span>' + esc(it) + '</span></label></li>';
      }).join('') +
      '</ul></div>' +
      '</div>' +
      '<div class="trip-actions"><button type="button" class="btn-secondary" id="trip-edit">Edit in planner</button><a class="btn-secondary" href="experience.html?id=' + e.id + '">Field notes for route ' + e.n + '</a><button type="button" class="btn-ghost" id="trip-delete" style="min-height:48px">Delete sample trip</button></div>';
  }
  function minus20(s) {
    var m = Math.round(s.h * 60) - 20, hh = Math.floor(m / 60), mm = m % 60;
    var ap = hh >= 12 ? 'PM' : 'AM', h12 = hh % 12 === 0 ? 12 : hh % 12;
    return h12 + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap;
  }

  /* ---------- almanac ---------- */
  function renderAlmanac() {
    $('alm-list').innerHTML = GC.EXPERIENCES.map(function (e) {
      return '<li class="alm-row"><span class="rnum" aria-hidden="true">' + e.n + '</span>' +
        '<img src="' + e.img + '" alt="" width="150" height="96" loading="lazy">' +
        '<div><h3>' + esc(e.name) + '</h3><p>' + e.duration + ' · ' + esc(e.boat) + ' · ' + GC.priceLine(e) + ' (sample)</p></div>' +
        '<div class="alm-sp" aria-label="Might spot">' + e.species.map(function (k) { return '<span>' + GC.icon(k) + esc(GC.SPECIES[k].name) + '</span>'; }).join('') + '</div>' +
        '<a class="btn-secondary" href="experience.html?id=' + e.id + '">Field notes<span class="visually-hidden">: ' + esc(e.name) + '</span></a></li>';
    }).join('');
  }

  /* ---------- actions ---------- */
  function renderAll() { renderList(); renderMapState(); renderPlanner(); renderTripbar(); syncTripbarPad(); syncFilters(); }

  function select(id) {
    var e = GC.byId(id);
    if (!e) return;
    if (state.exp !== id) {
      state.exp = id; state.slot = null;
      state.addons = state.addons.filter(function (a) { return e.addons.indexOf(a) > -1; });
      if (e.id === 'private' && state.guests < 3) state.guests = 3;
    }
    setMsg('', '');
    persist(); renderAll();
  }
  function setMsg(text, cls) { var m = $('save-msg'); m.textContent = text; m.className = 'save-msg' + (cls ? ' ' + cls : ''); }

  function save() {
    var e = exp(), s = slot(), missing = [];
    if (!e) missing.push('a route');
    else if (!s) missing.push('a departure');
    if (missing.length) { setMsg('Choose ' + missing.join(' and ') + ' before saving.', 'err'); return false; }
    GC.store.set('trip', { exp: state.exp, slot: state.slot, guests: state.guests, addons: state.addons.slice() });
    GC.store.del('checklist');
    renderTrip();
    setMsg('Sample trip saved in this browser only — nothing was booked or charged.', 'ok');
    var h = $('trip-h');
    h.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    h.focus({ preventScroll: true });
    return true;
  }

  function resetDemo() {
    GC.store.clearAll();
    state = JSON.parse(JSON.stringify(DEFAULT));
    tbOpen = false;
    renderAll(); renderTrip();
    setMsg('Demo reset. Nothing was stored anywhere else.', 'ok');
  }

  function goPlanner() {
    var p = $('planner');
    p.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    $('planner-h').focus({ preventScroll: true });
  }

  /* ---------- filters (radiogroups with arrows) ---------- */
  function filterSummary() {
    var f = state.filters, n = ['bucket', 'group', 'vibe'].filter(function (k) { return f[k] !== 'any'; }).length;
    var el = $('filters-count'); if (el) el.textContent = n ? n + ' on' : 'none on';
  }
  function syncFilters() {
    filterSummary();
    document.querySelectorAll('.seg[data-filter]').forEach(function (g) {
      var key = g.getAttribute('data-filter');
      g.querySelectorAll('button').forEach(function (b) {
        var on = b.getAttribute('data-v') === state.filters[key];
        b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1;
      });
    });
  }
  function radioKeys(container, selector, onPick, skipDisabled) {
    container.addEventListener('keydown', function (ev) {
      var keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
      if (keys.indexOf(ev.key) < 0) return;
      var group = ev.target.closest('[role="radiogroup"],[role="tablist"]');
      if (!group) return;
      var items = Array.prototype.slice.call(group.querySelectorAll(selector));
      var i = items.indexOf(ev.target);
      if (i < 0) return;
      ev.preventDefault();
      var n = items.length, j = i, tries = 0;
      do {
        if (ev.key === 'Home') j = tries === 0 ? 0 : j + 1;
        else if (ev.key === 'End') j = tries === 0 ? n - 1 : j - 1;
        else j = (j + (ev.key === 'ArrowRight' || ev.key === 'ArrowDown' ? 1 : -1) + n) % n;
        tries++;
      } while (skipDisabled && items[j].getAttribute('aria-disabled') === 'true' && tries < n);
      onPick(items[j]);
    });
  }

  /* ---------- sheet ---------- */
  function openSheet(id, trigger) {
    var e = GC.byId(id); if (!e) return;
    lastSheetTrigger = trigger || document.activeElement;
    var open = e.slots.filter(function (s) { return s.left > 0; });
    $('sheet').innerHTML = '<div class="sheet-grab" aria-hidden="true"></div>' +
      '<div class="sheet-top"><div><p class="kicker">Route ' + e.n + ' · sample</p><h2 id="sheet-title">' + esc(e.name) + '</h2></div><button type="button" class="sheet-close" id="sheet-close" aria-label="Close">×</button></div>' +
      '<img src="' + e.img + '" alt="' + esc(e.imgAlt) + '" width="640" height="170">' +
      '<div class="sheet-body"><p>' + esc(e.short) + '</p>' +
      '<dl class="facts"><div><dt>Duration</dt><dd>' + e.duration + '</dd></div><div><dt>Boat</dt><dd>' + esc(e.boat) + '</dd></div><div><dt>Meet at</dt><dd>' + esc(e.meeting) + '</dd></div><div><dt>Sample price</dt><dd>' + GC.priceLine(e) + '</dd></div>' +
      '<div style="grid-column:1/-1"><dt>Sample departures with seats</dt><dd>' + open.map(function (s) { return s.day + ' ' + s.time; }).join(' · ') + '</dd></div></dl>' +
      '<div><p class="kicker" style="margin-bottom:6px">You might spot</p><div class="sheet-sp">' + e.species.map(function (k) { return '<div>' + GC.icon(k) + esc(GC.SPECIES[k].name) + '</div>'; }).join('') + '</div></div>' +
      '<div class="sheet-actions"><button type="button" class="btn-primary" id="sheet-plan">Plan this trip</button><a class="btn-secondary" href="experience.html?id=' + e.id + '">Field notes</a></div>' +
      '</div>';
    $('sheet-root').hidden = false;
    ['main', 'tripbar'].forEach(function (x) { $(x).inert = true; });
    document.querySelectorAll('.site-head, .site-foot, .concept-strip, .skip').forEach(function (el) { el.inert = true; });
    document.body.style.overflow = 'hidden';
    $('sheet-close').focus();
    $('sheet-close').onclick = function () { closeSheet(true); };
    $('sheet-plan').onclick = function () { closeSheet(false); select(id); goPlanner(); };
  }
  function closeSheet(returnFocus) {
    $('sheet-root').hidden = true;
    ['main', 'tripbar'].forEach(function (x) { $(x).inert = false; });
    document.querySelectorAll('.site-head, .site-foot, .concept-strip, .skip').forEach(function (el) { el.inert = false; });
    document.body.style.overflow = '';
    if (returnFocus && lastSheetTrigger) {
      var id = lastSheetTrigger.getAttribute && lastSheetTrigger.getAttribute('data-id');
      var again = id && document.querySelector('.exp-btn[data-id="' + id + '"]');
      (document.contains(lastSheetTrigger) ? lastSheetTrigger : again || $('explorer')).focus();
    }
  }

  function choose(id, trigger) {
    if (mqMobile.matches) openSheet(id, trigger); else select(id);
  }

  /* ---------- tabs (mobile) ---------- */
  var currentTab = 'list';
  function applyTabs() {
    var mobile = mqMobile.matches;
    $('tab-list').setAttribute('aria-selected', currentTab === 'list');
    $('tab-map').setAttribute('aria-selected', currentTab === 'map');
    $('tab-list').tabIndex = currentTab === 'list' ? 0 : -1;
    $('tab-map').tabIndex = currentTab === 'map' ? 0 : -1;
    $('panel-list').hidden = mobile && currentTab !== 'list';
    $('panel-map').hidden = mobile && currentTab !== 'map';
    if (mobile && currentTab === 'map') centerMap();
    ['panel-list', 'panel-map'].forEach(function (p) {
      if (mobile) $(p).setAttribute('role', 'tabpanel'); else $(p).removeAttribute('role');
    });
  }

  /* ---------- events ---------- */
  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target;
      var b = t.closest('.exp-btn'); if (b) { choose(b.getAttribute('data-id'), b); return; }
      var r = t.closest('.route'); if (r) { choose(r.getAttribute('data-id'), r); return; }
      var f = t.closest('.seg[data-filter] button');
      if (f) { state.filters[f.parentNode.getAttribute('data-filter')] = f.getAttribute('data-v'); persist(); renderList(); renderMapState(); syncFilters(); return; }
      var s = t.closest('.slot');
      if (s) {
        if (s.getAttribute('aria-disabled') === 'true') { setMsg('That sample departure is full — choose another.', 'err'); return; }
        state.slot = s.getAttribute('data-slot'); persist(); setMsg('', '');
        renderPlanner(); renderTripbar(); syncTripbarPad();
        var again = document.querySelector('.slot[data-slot="' + state.slot + '"]'); if (again) again.focus();
        return;
      }
      if (t.closest('#g-minus')) { state.guests = Math.max(1, state.guests - 1); persist(); renderPlanner(); renderTripbar(); if ($('g-minus').disabled) $('g-plus').focus(); return; }
      if (t.closest('#g-plus')) { state.guests = Math.min(maxGuests(), state.guests + 1); persist(); renderPlanner(); renderTripbar(); if ($('g-plus').disabled) $('g-minus').focus(); return; }
      if (t.closest('#save-btn')) { save(); return; }
      if (t.closest('#reset-btn') || t.closest('#reset-btn-2')) { resetDemo(); return; }
      if (t.closest('#tb-toggle')) { tbOpen = !tbOpen; renderTripbar(); syncTripbarPad(); $('tb-toggle').focus(); return; }
      if (t.closest('#tb-edit')) { tbOpen = false; renderTripbar(); syncTripbarPad(); if (exp()) goPlanner(); else { $('explorer').scrollIntoView(); $('tab-list').focus(); } return; }
      if (t.closest('#trip-edit')) {
        var trip = GC.store.get('trip', null);
        if (trip) { state.exp = trip.exp; state.slot = trip.slot; state.guests = trip.guests; state.addons = trip.addons || []; persist(); renderAll(); }
        goPlanner(); return;
      }
      if (t.closest('#trip-delete')) { GC.store.del('trip'); GC.store.del('checklist'); renderTrip(); $('trip-h').focus(); return; }
      if (t.closest('#sheet-backdrop')) { closeSheet(true); return; }
      if (t.closest('#filters-toggle')) { var ft = $('filters-toggle'), open = ft.getAttribute('aria-expanded') !== 'true'; ft.setAttribute('aria-expanded', open); $('filters').classList.toggle('is-collapsed', !open); return; }
      var tab = t.closest('.view-tabs [role="tab"]');
      if (tab) { currentTab = tab.id === 'tab-map' ? 'map' : 'list'; applyTabs(); return; }
    });

    document.addEventListener('change', function (ev) {
      var a = ev.target.getAttribute('data-addon');
      if (a) {
        var i = state.addons.indexOf(a);
        if (ev.target.checked && i < 0) state.addons.push(a);
        if (!ev.target.checked && i > -1) state.addons.splice(i, 1);
        persist(); $('pass-live').innerHTML = passHtml(state, false); renderTripbar(); syncTripbarPad();
        return;
      }
      var c = ev.target.getAttribute('data-check');
      if (c !== null) {
        var trip = GC.store.get('trip', null); if (!trip) return;
        var checks = GC.store.get('checklist', {});
        checks[trip.exp + ':' + c] = ev.target.checked;
        GC.store.set('checklist', checks);
      }
    });

    // map routes: Enter / Space
    $('map').addEventListener('keydown', function (ev) {
      var r = ev.target.closest && ev.target.closest('.route');
      if (r && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); choose(r.getAttribute('data-id'), r); }
    });

    radioKeys($('filters'), 'button', function (b) { b.focus(); b.click(); });
    radioKeys($('slots-area'), '.slot', function (b) { b.click(); }, true);
    radioKeys(document.querySelector('.view-tabs'), '[role="tab"]', function (b) { b.click(); b.focus(); });

    // sheet: trap + Esc
    document.addEventListener('keydown', function (ev) {
      if ($('sheet-root').hidden) return;
      if (ev.key === 'Escape') { ev.preventDefault(); closeSheet(true); return; }
      if (ev.key === 'Tab') {
        var f = Array.prototype.slice.call($('sheet').querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])'));
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (!$('sheet').contains(document.activeElement)) { ev.preventDefault(); first.focus(); }
        else if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
    });

    var onMq = function () { applyTabs(); syncTripbarPad(); if (!mqMobile.matches && !$('sheet-root').hidden) closeSheet(false); };
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', onMq); else mqMobile.addListener(onMq);
    if (window.ResizeObserver) new ResizeObserver(syncTripbarPad).observe($('tripbar'));
  }

  /* ---------- init ---------- */
  renderMapOnce();
  renderAlmanac();
  renderTrip();
  bind();
  applyTabs();
  var params = new URLSearchParams(location.search);
  var planId = params.get('plan');
  if (planId && GC.byId(planId)) {
    if (state.exp !== planId) { state.exp = planId; state.slot = null; state.addons = []; if (planId === 'private' && state.guests < 3) state.guests = 3; }
    persist();
  }
  renderAll();
  if (planId && GC.byId(planId)) {
    requestAnimationFrame(function () { $('planner').scrollIntoView({ block: 'start' }); $('planner-h').focus({ preventScroll: true }); });
  }
})();
