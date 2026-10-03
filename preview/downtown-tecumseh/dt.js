/* Downtown Tecumseh concept — Williams Digital */
(function () {
  'use strict';
  var DT = window.DT;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* ---- staff edits made in the dashboard demo live in this browser only ---- */
  var cms = { events: [], removed: [], featured: null, notices: {}, alert: '' };
  try { var saved = JSON.parse(localStorage.getItem('dt_cms') || '{}'); for (var k in saved) cms[k] = saved[k]; } catch (e) {}
  function saveCms() { try { localStorage.setItem('dt_cms', JSON.stringify(cms)); } catch (e) {} }
  var FEATURED = ['harvest-chocolate', 'pentamere-winery', 'british-tea-garden-and-roof-top-cafe', 'the-boulevard-market'];
  function featured() { return cms.featured || FEATURED; }

  /* ---- dates ---- */
  function pd(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  var qp = new URLSearchParams(location.search);
  var today = /^\d{4}-\d\d-\d\d$/.test(qp.get('today') || '') ? pd(qp.get('today')) : new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  var todayIso = iso(today);

  function allEvents() {
    return DT.events.concat(cms.events).filter(function (e) { return cms.removed.indexOf(e.id) < 0; });
  }
  /* one row per date; a weekly series expands into its occurrences */
  function occurrences() {
    var out = [];
    allEvents().forEach(function (e) {
      if (e.recur) {
        for (var t = pd(e.recur.from), end = pd(e.recur.to); t <= end; t = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 7)) {
          var o = Object.assign({}, e, { start: iso(t), end: iso(t), series: true });
          out.push(o);
        }
      } else out.push(Object.assign({}, e, { end: e.end || e.start }));
    });
    return out.sort(function (a, b) { return a.start < b.start ? -1 : a.start > b.start ? 1 : 0; });
  }
  function upcoming() { return occurrences().filter(function (o) { return o.end >= todayIso; }); }
  function dateText(o) {
    var s = pd(o.start), e = pd(o.end);
    if (o.end === o.start) return DOW[s.getDay()] + ', ' + MON[s.getMonth()] + ' ' + s.getDate() + ', ' + s.getFullYear();
    return DOW[s.getDay()].slice(0, 3) + '–' + DOW[e.getDay()].slice(0, 3) + ', ' + MON[s.getMonth()] + ' ' + s.getDate() + '–' + (e.getMonth() !== s.getMonth() ? MON[e.getMonth()] + ' ' : '') + e.getDate() + ', ' + s.getFullYear();
  }
  function dateBox(o) {
    var s = pd(o.start), now = o.start <= todayIso && o.end >= todayIso;
    return '<span class="date' + (now ? ' today' : '') + '" aria-hidden="true"><span>' + (now ? 'Today' : MON[s.getMonth()].slice(0, 3)) + '</span><b>' + s.getDate() + '</b></span>';
  }
  function evRow(o, withTag) {
    var meta = [o.time, o.where].filter(Boolean).join(' · ');
    return '<button type="button" class="evr' + (o.end < todayIso ? ' past' : '') + '" data-ev="' + esc(o.id) + '" data-d="' + o.start + '">' + dateBox(o) +
      '<span><span class="evr-t">' + esc(o.title) + '</span><span class="evr-m"><span class="vh">' + esc(dateText(o)) + '. </span>' + esc(meta) +
      (o.series ? (meta ? ' · ' : '') + 'Every Saturday through ' + MON[pd(o.recur.to).getMonth()] + ' ' + pd(o.recur.to).getDate() : '') + '</span></span>' +
      (withTag ? '<span class="tag">' + esc(o.cat) + '</span>' : '') + '</button>';
  }

  /* ---- dialog ---- */
  var dlg;
  function openDlg(html) {
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('.dlg-x')) dlg.close(); });
      document.body.appendChild(dlg);
    }
    dlg.innerHTML = '<button class="dlg-x" type="button" aria-label="Close">×</button>' + html;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function mapsUrl(q) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q + ', Tecumseh, MI 49286'); }
  function ics(o) {
    var s = o.start.replace(/-/g, ''), e = pd(o.end); e = iso(new Date(e.getFullYear(), e.getMonth(), e.getDate() + 1)).replace(/-/g, '');
    var body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Downtown Tecumseh//EN', 'BEGIN:VEVENT', 'UID:' + o.id + '-' + s + '@downtowntecumseh.com', 'DTSTAMP:' + s + 'T000000Z',
      'DTSTART;VALUE=DATE:' + s, 'DTEND;VALUE=DATE:' + e, 'SUMMARY:' + o.title, 'LOCATION:' + (o.where || 'Downtown Tecumseh') + '\\, Tecumseh\\, MI', 'DESCRIPTION:' + (o.time || ''), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(body);
  }
  function showEvent(id, d) {
    var o = occurrences().filter(function (x) { return x.id === id && (!d || x.start === d); })[0];
    if (!o) return;
    openDlg((o.img ? '<div class="dlg-img' + (/gather/.test(o.img) ? ' logo-fit' : '') + '"><img src="img/' + esc(o.img) + '" alt=""></div>' : '') +
      '<div class="dlg-b"><span class="tag">' + esc(o.cat) + '</span>' + (o.series ? ' <span class="tag gold">Weekly</span>' : '') +
      '<h2>' + esc(o.title) + '</h2><dl><dt>When</dt><dd>' + esc(dateText(o)) + (o.time ? '<br>' + esc(o.time) : '') + '</dd><dt>Where</dt><dd>' + esc(o.where || 'Downtown Tecumseh') + '</dd></dl>' +
      (o.desc ? '<p>' + esc(o.desc) + '</p>' : '') +
      '<div class="dlg-act"><a class="btn sm" href="' + ics(o) + '" download="' + esc(o.id) + '.ics">Add to calendar</a>' +
      '<a class="btn sm ghost" target="_blank" rel="noopener" href="' + mapsUrl(o.where || 'Downtown Tecumseh') + '">Directions</a>' +
      '<button class="btn sm ghost" type="button" data-share="' + esc(o.title) + '">Share</button>' +
      (o.link ? '<a class="btn sm ghost" href="' + esc(o.link) + '">More details</a>' : '') + '</div></div>');
  }
  function bizImg(b, cls) {
    return '<div class="' + cls + (b.pic ? ' logo-fit' : '') + '">' + (b.pic ? '<img loading="lazy" src="img/biz/' + b.id + '.jpg" alt="">' : '<span class="mono" aria-hidden="true">' + esc(b.name.replace(/^The /, '').charAt(0)) + '</span>') + '</div>';
  }
  function showBiz(id) {
    var b = DT.biz.filter(function (x) { return x.id === id; })[0];
    if (!b) return;
    var n = cms.notices[b.id];
    openDlg(bizImg(b, 'dlg-img') + '<div class="dlg-b">' + b.cats.map(function (c) { return '<span class="tag">' + esc(c) + '</span>'; }).join(' ') +
      '<h2>' + esc(b.name) + '</h2>' + (n ? '<p class="notice">' + esc(n) + '</p>' : '') +
      '<dl><dt>Address</dt><dd>' + esc(b.addr) + ', Tecumseh, MI</dd>' + (b.phone ? '<dt>Phone</dt><dd><a href="tel:' + esc(b.phone.replace(/[^\d]/g, '')) + '">' + esc(b.phone) + '</a></dd>' : '') +
      (b.web ? '<dt>Website</dt><dd><a target="_blank" rel="noopener" href="' + esc(b.web) + '">' + esc(b.web.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')) + '</a></dd>' : '') + '</dl>' +
      (b.desc ? '<p>' + esc(b.desc) + '</p>' : '') +
      '<div class="dlg-act"><a class="btn sm" target="_blank" rel="noopener" href="' + mapsUrl(b.name + ', ' + b.addr) + '">Directions</a>' +
      (b.phone ? '<a class="btn sm ghost" href="tel:' + esc(b.phone.replace(/[^\d]/g, '')) + '">Call</a>' : '') +
      (b.web ? '<a class="btn sm ghost" target="_blank" rel="noopener" href="' + esc(b.web) + '">Visit website</a>' : '') + '</div></div>');
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-ev]'); if (t) { showEvent(t.dataset.ev, t.dataset.d); return; }
    t = e.target.closest('[data-biz]'); if (t) { showBiz(t.dataset.biz); return; }
    t = e.target.closest('[data-share]');
    if (t) {
      var data = { title: t.dataset.share + ' · Downtown Tecumseh', url: location.href };
      if (navigator.share) navigator.share(data).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { t.textContent = 'Link copied'; });
    }
  });

  /* ---- chrome ---- */
  var mb = $('.menu-btn'), dr = $('#drawer');
  if (mb && dr) mb.addEventListener('click', function () { var o = dr.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
  if (cms.alert && $('.hdr')) { var al = document.createElement('div'); al.className = 'alert'; al.setAttribute('role', 'status'); al.textContent = cms.alert; $('.hdr').before(al); }

  function bizCard(b) {
    var n = cms.notices[b.id];
    return '<button type="button" class="card" data-biz="' + b.id + '">' + bizImg(b, 'card-img') + '<span class="card-b">' +
      (featured().indexOf(b.id) >= 0 ? '<span><span class="tag gold">Featured</span></span>' : '') +
      '<h3>' + esc(b.name) + '</h3><p>' + esc(b.cats[0]) + '</p><p>' + esc(b.addr) + (b.phone ? ' · ' + esc(b.phone) : '') + '</p>' +
      (n ? '<span class="notice">' + esc(n) + '</span>' : '') + '</span></button>';
  }
  function nextOnly(list) { /* a series shows once, at its next date */
    var seen = {}; return list.filter(function (o) { if (!o.series) return true; if (seen[o.id]) return false; seen[o.id] = 1; return true; });
  }

  /* ---- home ---- */
  if ($('#wk')) {
    var up = nextOnly(upcoming());
    $('#wk').innerHTML = up.slice(0, 4).map(function (o) { return evRow(o); }).join('') || '<p>New events are posted here as soon as they are scheduled.</p>';
    var feat = up.filter(function (o) { return o.img && !o.series; }).slice(0, 3);
    $('#ev-feat').innerHTML = feat.map(function (o) {
      return '<button type="button" class="card" data-ev="' + esc(o.id) + '" data-d="' + o.start + '"><span class="card-img' + (/gather/.test(o.img) ? ' logo-fit' : '') + '"><img loading="lazy" src="img/' + esc(o.img) + '" alt=""></span>' +
        '<span class="card-b"><span><span class="tag brick">' + esc(dateText(o).replace(/, \d{4}$/, '')) + '</span></span><h3>' + esc(o.title) + '</h3><p>' + esc([o.time, o.where].filter(Boolean).join(' · ')) + '</p></span></button>';
    }).join('');
    $('#biz-feat').innerHTML = featured().map(function (id) { return DT.biz.filter(function (b) { return b.id === id; })[0]; }).filter(Boolean).slice(0, 4).map(bizCard).join('');
    $('#biz-n').textContent = DT.biz.length;
    $('#home-search').addEventListener('submit', function (e) { e.preventDefault(); location.href = 'directory.html?q=' + encodeURIComponent($('#hq').value); });
  }

  /* ---- farmers market status (home + market page) ---- */
  $$('[data-market]').forEach(function (el) {
    var next = upcoming().filter(function (o) { return o.id === 'farmers-market'; })[0];
    if (!next) { el.className = 'live off'; el.textContent = 'Season has ended. The market returns in May.'; return; }
    el.className = 'live';
    el.textContent = next.start === todayIso ? 'Open today, 9:00 am – 1:00 pm' : 'Next market: ' + dateText(next).replace(/, \d{4}$/, '') + ', 9:00 am – 1:00 pm';
  });

  /* ---- events page ---- */
  if ($('#ev-list')) {
    var st = { q: '', cat: '', month: '', past: false, view: 'list', cal: new Date(today.getFullYear(), today.getMonth(), 1) };
    var cats = []; allEvents().forEach(function (e) { if (cats.indexOf(e.cat) < 0) cats.push(e.cat); });
    $('#ev-cat').innerHTML = '<option value="">All categories</option>' + cats.sort().map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('');
    $('#ev-month').innerHTML = '<option value="">Any month</option>' + MON.map(function (m, i) { return '<option value="' + i + '">' + m + '</option>'; }).join('');
    var match = function (o) {
      if (st.cat && o.cat !== st.cat) return false;
      if (st.q && (o.title + ' ' + (o.desc || '') + ' ' + (o.where || '') + ' ' + o.cat).toLowerCase().indexOf(st.q) < 0) return false;
      return true;
    };
    var drawList = function () {
      var list = occurrences().filter(match).filter(function (o) { return st.past || o.end >= todayIso; });
      if (st.month !== '') list = list.filter(function (o) { return pd(o.start).getMonth() === +st.month; });
      else list = nextOnly(list.filter(function (o) { return !o.series || o.end >= todayIso; }));
      $('#ev-count').textContent = list.length + (list.length === 1 ? ' event' : ' events') + (st.past ? '' : ' coming up');
      var html = '', cur = '';
      list.forEach(function (o) {
        var s = pd(o.start), h = MON[s.getMonth()] + ' ' + s.getFullYear();
        if (h !== cur) { html += '<h2 class="month-h">' + h + '</h2>'; cur = h; }
        html += evRow(o, true);
      });
      $('#ev-list').innerHTML = html || '<p>No events match. Try clearing a filter.</p>';
    };
    var drawCal = function () {
      var y = st.cal.getFullYear(), m = st.cal.getMonth(), first = new Date(y, m, 1), occ = occurrences().filter(match);
      $('#cal-title').textContent = MON[m] + ' ' + y;
      var html = DOW.map(function (d) { return '<div class="dow">' + d.slice(0, 3) + '</div>'; }).join('');
      for (var i = 0; i < 42; i++) {
        var d = new Date(y, m, 1 - first.getDay() + i), di = iso(d);
        if (i >= 35 && d.getMonth() !== m) break;
        html += '<div class="day' + (d.getMonth() !== m ? ' out' : '') + (di === todayIso ? ' now' : '') + '"><span class="n">' + d.getDate() + '</span>' +
          occ.filter(function (o) { return o.start <= di && o.end >= di; }).map(function (o) {
            return '<button type="button" class="' + (o.cat === 'Market' ? 'mk' : '') + '" data-ev="' + esc(o.id) + '" data-d="' + o.start + '" aria-label="' + esc(o.title + ', ' + dateText(o)) + '">' + esc(o.title) + '</button>';
          }).join('') + '</div>';
      }
      $('#cal').innerHTML = html;
    };
    var draw = function () {
      $('#view-list').hidden = st.view !== 'list'; $('#view-cal').hidden = st.view !== 'cal';
      $$('#ev-view button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === st.view); });
      st.view === 'list' ? drawList() : drawCal();
    };
    $('#ev-q').addEventListener('input', function () { st.q = this.value.trim().toLowerCase(); draw(); });
    $('#ev-cat').addEventListener('change', function () { st.cat = this.value; draw(); });
    $('#ev-month').addEventListener('change', function () { st.month = this.value; if (this.value !== '') st.cal = new Date(today.getFullYear(), +this.value, 1); draw(); });
    $('#ev-past').addEventListener('change', function () { st.past = this.checked; draw(); });
    $$('#ev-view button').forEach(function (b) { b.addEventListener('click', function () { st.view = b.dataset.v; draw(); }); });
    $('#cal-prev').addEventListener('click', function () { st.cal = new Date(st.cal.getFullYear(), st.cal.getMonth() - 1, 1); drawCal(); });
    $('#cal-next').addEventListener('click', function () { st.cal = new Date(st.cal.getFullYear(), st.cal.getMonth() + 1, 1); drawCal(); });
    draw();
    /* schema.org Event markup, generated from the same records */
    var ld = document.createElement('script'); ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify(nextOnly(upcoming()).map(function (o) {
      return { '@context': 'https://schema.org', '@type': 'Event', name: o.title, startDate: o.start, endDate: o.end, description: o.desc || undefined, eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@type': 'Place', name: o.where || 'Downtown Tecumseh', address: { '@type': 'PostalAddress', addressLocality: 'Tecumseh', addressRegion: 'MI', postalCode: '49286' } } };
    }));
    document.head.appendChild(ld);
    if (location.hash) showEvent(location.hash.slice(1));
  }

  /* ---- maps ---- */
  function makeMap(el, zoom) {
    var map = L.map(el, { scrollWheelZoom: false }).setView([42.0042, -83.945], zoom || 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
    return map;
  }
  function pin(label, navy) { return L.divIcon({ className: '', html: '<span class="pin' + (navy ? ' navy' : '') + '">' + label + '</span>', iconSize: [30, 30], iconAnchor: [15, 15] }); }
  /* several listings share a building: fan them out so every pin can be tapped */
  function spread(items) {
    var seen = {};
    return items.map(function (it) {
      var key = it.ll.join(','), n = seen[key] = (seen[key] || 0) + 1;
      if (n === 1) return it.ll;
      var a = n * 2.4, r = 0.00007 * Math.ceil(n / 2);
      return [it.ll[0] + Math.sin(a) * r, it.ll[1] + Math.cos(a) * r * 1.3];
    });
  }

  /* ---- directory ---- */
  if ($('#dir')) {
    var ds = { q: (qp.get('q') || '').toLowerCase(), cat: qp.get('cat') || '', view: 'grid' }, dmap, dlayer;
    var dcats = []; DT.biz.forEach(function (b) { b.cats.forEach(function (c) { if (dcats.indexOf(c) < 0) dcats.push(c); }); }); dcats.sort();
    $('#dir-q').value = qp.get('q') || '';
    $('#dir-cats').innerHTML = [''].concat(dcats).map(function (c) { return '<button type="button" class="chip" data-c="' + esc(c) + '" aria-pressed="' + (c === ds.cat) + '">' + esc(c || 'All') + '</button>'; }).join('');
    var dfilter = function () {
      var f = featured();
      return DT.biz.filter(function (b) {
        if (ds.cat && b.cats.indexOf(ds.cat) < 0) return false;
        return !ds.q || (b.name + ' ' + b.cats.join(' ') + ' ' + b.desc + ' ' + b.addr).toLowerCase().indexOf(ds.q) >= 0;
      }).sort(function (a, b) { return (f.indexOf(b.id) >= 0) - (f.indexOf(a.id) >= 0) || a.name.localeCompare(b.name); });
    };
    var ddraw = function () {
      var list = dfilter();
      $('#dir-count').textContent = list.length + (list.length === 1 ? ' business' : ' businesses') + (ds.cat ? ' in ' + ds.cat : '') + (ds.q ? ' matching “' + ds.q + '”' : '');
      $('#dir').hidden = ds.view !== 'grid'; $('#dir-map').hidden = ds.view !== 'map';
      $$('#dir-view button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === ds.view); });
      if (ds.view === 'grid') { $('#dir').innerHTML = list.map(bizCard).join('') || '<p>No businesses match. Try a different search.</p>'; return; }
      if (!dmap) { dmap = makeMap($('#dir-map')); dlayer = L.layerGroup().addTo(dmap); }
      dlayer.clearLayers(); dmap.invalidateSize();
      list = list.filter(function (b) { return b.ll; });
      var pts = spread(list);
      list.forEach(function (b, i) {
        L.marker(pts[i], { icon: pin(esc(b.name.replace(/^The /, '').charAt(0)), true), title: b.name }).addTo(dlayer)
          .bindPopup('<b>' + esc(b.name) + '</b><br>' + esc(b.addr) + '<br><a href="#" data-biz="' + b.id + '">Details</a>');
      });
      if (pts.length > 30) dmap.setView([42.0041, -83.9449], 17); else if (pts.length) dmap.fitBounds(pts, { padding: [40, 40], maxZoom: 18 });
    };
    $('#dir-q').addEventListener('input', function () { ds.q = this.value.trim().toLowerCase(); ddraw(); });
    $('#dir-cats').addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (!c) return; ds.cat = c.dataset.c; $$('.chip', this).forEach(function (x) { x.setAttribute('aria-pressed', x === c); }); ddraw(); });
    $$('#dir-view button').forEach(function (b) { b.addEventListener('click', function () { ds.view = b.dataset.v; ddraw(); }); });
    $('#dir-map').addEventListener('click', function (e) { if (e.target.closest('[data-biz]')) e.preventDefault(); });
    ddraw();
    if (location.hash) showBiz(location.hash.slice(1));
  }

  /* ---- art trail ---- */
  if ($('#art-map')) {
    var amap = makeMap($('#art-map'), 15), marks = {}, sale = false, apts = spread(DT.art);
    DT.art.forEach(function (a, i) {
      marks[a.n] = L.marker(apts[i], { icon: pin(a.n), title: a.title }).addTo(amap)
        .bindPopup('<b>' + a.n + '. ' + esc(a.title) + '</b><br>' + (a.artist ? esc(a.artist) + '<br>' : '') + esc(a.place) + (a.price ? '<br>Available: ' + esc(a.price) : ''));
      marks[a.n].on('click', function () { pick(a.n, true); });
    });
    amap.fitBounds(apts, { padding: [30, 30] });
    var pick = function (n, fromMap) {
      $$('.stop').forEach(function (s) { s.classList.toggle('on', +s.dataset.n === n); });
      if (!fromMap) { amap.setView(marks[n].getLatLng(), 18); marks[n].openPopup(); if (window.innerWidth < 900) $('#art-map').scrollIntoView({ block: 'center' }); }
    };
    var adraw = function () {
      var list = DT.art.filter(function (a) { return !sale || a.price; });
      $('#art-count').textContent = list.length + ' stops' + (sale ? ' with artwork available to purchase' : ' on the 2026 trail');
      $('#art-list').innerHTML = list.map(function (a) {
        return '<button type="button" class="stop" data-n="' + a.n + '"><span class="pin">' + a.n + '</span><span><b>' + esc(a.title) + '</b>' +
          '<small>' + (a.artist ? 'Artist: ' + esc(a.artist) : esc(a.note)) + '</small><small>' + esc(a.place) + ' · ' + esc(a.addr) + '</small>' +
          (a.price ? '<em class="tag gold">Available · ' + esc(a.price) + '</em>' : (a.artist && a.note ? '<small>' + esc(a.note) + '</small>' : '')) + '</span></button>';
      }).join('');
    };
    $('#art-list').addEventListener('click', function (e) { var s = e.target.closest('.stop'); if (s) pick(+s.dataset.n); });
    $('#art-sale').addEventListener('change', function () { sale = this.checked; adraw(); });
    adraw();
  }
  if ($('#mkt-map')) {
    var mm = makeMap($('#mkt-map'), 17), ml = DT.art.filter(function (a) { return a.n === 13; })[0].ll;
    mm.setView(ml, 17); L.marker(ml, { icon: pin('M'), title: 'The Market on Evans' }).addTo(mm).bindPopup('<b>The Market on Evans</b><br>213 N. Evans St.').openPopup();
  }

  /* ---- staff dashboard demo ---- */
  if ($('#admin')) {
    var toast = function (msg) { var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200); };
    $$('.adm-side button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.adm-side button').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
        $$('[data-tab]').forEach(function (p) { p.hidden = p.dataset.tab !== b.dataset.go; });
      });
    });
    var evAdmin = function () {
      var list = allEvents().filter(function (e) { return e.recur || (e.end || e.start) >= todayIso; }).sort(function (a, b) { return (a.start || a.recur.from) < (b.start || b.recur.from) ? -1 : 1; });
      $('#adm-ev').innerHTML = list.map(function (e) {
        return '<div class="row"><div class="grow"><b>' + esc(e.title) + '</b><span>' + (e.recur ? 'Weekly, Saturdays through ' + MON[pd(e.recur.to).getMonth()] + ' ' + pd(e.recur.to).getDate() : esc(dateText(Object.assign({ end: e.start }, e)))) + ' · ' + esc(e.cat) + '</span></div>' +
          '<button class="btn sm ghost" type="button" data-dup="' + esc(e.id) + '">Duplicate</button><button class="btn sm ghost" type="button" data-rm="' + esc(e.id) + '">Remove</button></div>';
      }).join('');
    };
    $('#ev-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = this.elements, ev = { id: 'staff-' + Date.now(), title: f.title.value.trim(), start: f.start.value, time: f.time.value.trim(), where: f.where.value.trim() || 'Downtown Tecumseh', cat: f.cat.value, desc: f.desc.value.trim() };
      if (f.end.value && f.end.value > ev.start) ev.end = f.end.value;
      cms.events.push(ev); saveCms(); this.reset(); evAdmin(); toast('Event published. It is on the homepage and calendar now.');
    });
    $('#adm-ev').addEventListener('click', function (e) {
      var d = e.target.closest('[data-dup]'), r = e.target.closest('[data-rm]');
      if (d) {
        var src = allEvents().filter(function (x) { return x.id === d.dataset.dup; })[0], f = $('#ev-form').elements;
        f.title.value = src.title; f.time.value = src.time || ''; f.where.value = src.where || ''; f.cat.value = src.cat; f.desc.value = src.desc || ''; f.start.value = ''; f.end.value = '';
        f.start.focus(); toast('Copied into the form. Pick the new date.');
      }
      if (r) {
        var id = r.dataset.rm, own = cms.events.filter(function (x) { return x.id !== id; });
        if (own.length !== cms.events.length) cms.events = own; else cms.removed.push(id);
        saveCms(); evAdmin(); toast('Event removed from the site.');
      }
    });
    var bizAdmin = function () {
      var q = $('#adm-bq').value.trim().toLowerCase(), f = featured();
      $('#adm-biz').innerHTML = DT.biz.filter(function (b) { return !q || b.name.toLowerCase().indexOf(q) >= 0; }).slice(0, 12).map(function (b) {
        return '<div class="row"><div class="grow"><b>' + esc(b.name) + '</b><span>' + esc(b.cats[0]) + ' · ' + esc(b.addr) + '</span></div>' +
          '<label class="check"><input type="checkbox" data-feat="' + b.id + '"' + (f.indexOf(b.id) >= 0 ? ' checked' : '') + '> Featured</label>' +
          '<label class="vh" for="n-' + b.id + '">Notice for ' + esc(b.name) + '</label><input type="text" id="n-' + b.id + '" data-note="' + b.id + '" placeholder="Notice, e.g. Closed for remodeling until Nov. 1" value="' + esc(cms.notices[b.id] || '') + '"></div>';
      }).join('');
    };
    $('#adm-bq').addEventListener('input', bizAdmin);
    $('#adm-biz').addEventListener('change', function (e) {
      var t = e.target;
      if (t.dataset.feat) { var f = featured().slice(), i = f.indexOf(t.dataset.feat); t.checked ? i < 0 && f.unshift(t.dataset.feat) : i >= 0 && f.splice(i, 1); cms.featured = f; toast(t.checked ? 'Now featured on the homepage.' : 'Removed from featured.'); }
      if (t.dataset.note) { if (t.value.trim()) cms.notices[t.dataset.note] = t.value.trim(); else delete cms.notices[t.dataset.note]; toast('Notice saved to the listing.'); }
      saveCms();
    });
    $('#alert-form').addEventListener('submit', function (e) { e.preventDefault(); cms.alert = this.elements.alert.value.trim(); saveCms(); toast(cms.alert ? 'Banner is live on every page.' : 'Banner cleared.'); });
    $('#alert-form').elements.alert.value = cms.alert;
    $('#adm-reset').addEventListener('click', function () { try { localStorage.removeItem('dt_cms'); } catch (e) {} location.reload(); });
    evAdmin(); bizAdmin();
  }
})();
