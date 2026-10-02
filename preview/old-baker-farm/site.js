/* Old Baker Farm — concept preview by Williams Digital
   One schedule drives the "today" pill, the hero ticket, the calendar and the .ics downloads. */
(function () {
  'use strict';

  var Y = 2026;
  // Hours by weekday during the pumpkin patch (0 = Sunday)
  var PATCH_HOURS = { 0: [13, 17], 1: [15, 17], 2: [15, 17], 3: [15, 17], 4: [15, 17], 5: [15, 17], 6: [9, 17] };
  // Days that break the weekly pattern
  var SPECIAL = {
    '2026-10-12': { h: [9, 17], note: 'Columbus Day' },
    '2026-10-25': { h: [9, 17], note: 'Festival Weekend' }
  };

  var EVENTS = [
    { id: 'shindig', name: 'Summer Shindig', start: '2026-08-15', end: '2026-08-15', h: [18, 21], blurb: 'Food trucks, vendors, fireworks, lemonade and acres of sunflowers.' },
    { id: 'kickoff', name: 'Harvest Kickoff Weekend', start: '2026-09-26', end: '2026-09-27', blurb: 'Come kick off the harvest season with us!' },
    { id: 'oct3', name: 'Pumpkin Patch Weekend', start: '2026-10-03', end: '2026-10-04', blurb: 'Enjoy all the fun the farm has to offer!' },
    { id: 'cowboy', name: 'Cowboy Weekend', start: '2026-10-10', end: '2026-10-11', blurb: 'Stroll through Tombstone, catch live-action shootouts and hear the bluegrass band Big Canoe Creek.' },
    { id: 'columbus', name: 'Columbus Day', start: '2026-10-12', end: '2026-10-12', h: [9, 17], blurb: 'Open 9am–5pm to the public.' },
    { id: 'history', name: 'Living History Weekend', start: '2026-10-17', end: '2026-10-18', blurb: 'Demonstrations and reenactments, living history around the farm and the Southeastern American Indian Camp.' },
    { id: 'festival', name: 'Festival Weekend', start: '2026-10-24', end: '2026-10-25', blurb: 'Vendors, live music and the 1800s-inspired carnival. Open 9am–5pm both days.' },
    { id: 'patch', name: 'Pumpkin Patch', start: '2026-09-26', end: '2026-10-31', season: true, blurb: 'Weekdays 3–5pm · Saturday 9am–5pm · Sunday 1–5pm.' },
    { id: 'trees', name: 'Christmas Tree Farm', start: '2026-11-27', end: '2026-12-24', h: [9, 17], season: true, blurb: 'Choose-and-cut trees, wreaths, hot apple cider and candy canes. Open 9am–5pm, 7 days a week.' },
    { id: 'xmas', name: 'Christmas on the Farm', start: '2026-12-05', end: '2026-12-05', h: [17, 20], blurb: 'An evening on the farm for the holidays.' }
  ];

  function d(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function key(dt) { return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'); }
  function hr(h) { var ap = h >= 12 ? 'pm' : 'am'; var x = h % 12 || 12; return x + ap; }
  function span(h) { return hr(h[0]).replace(/(am|pm)$/, h[0] < 12 === h[1] < 12 ? '' : '$1') + '–' + hr(h[1]); }
  var DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // ?date=2026-10-10T10:00 lets Dylan demo any day
  function now() {
    var q = /[?&]date=([\d-]+)(?:T(\d+):?(\d*))?/.exec(location.search);
    if (q) { var t = d(q[1]); t.setHours(+(q[2] || 10), +(q[3] || 0)); return t; }
    return new Date();
  }

  // Opening hours for a calendar day, or null when the farm is closed to the public
  function hoursOn(dt) {
    var k = key(dt);
    if (SPECIAL[k]) return { h: SPECIAL[k].h, label: SPECIAL[k].note };
    for (var i = 0; i < EVENTS.length; i++) {
      var e = EVENTS[i];
      if (k < e.start || k > e.end) continue;
      if (e.id === 'patch') return { h: PATCH_HOURS[dt.getDay()], label: 'Pumpkin Patch' };
      if (e.id === 'trees') return { h: e.h, label: 'Christmas Tree Farm' };
    }
    for (var j = 0; j < EVENTS.length; j++) {
      var f = EVENTS[j];
      if (f.h && k >= f.start && k <= f.end && !f.season) return { h: f.h, label: f.name };
    }
    return null;
  }

  // The named weekend/event happening on a day (not the season umbrella)
  function featureOn(k) {
    for (var i = 0; i < EVENTS.length; i++) { var e = EVENTS[i]; if (!e.season && k >= e.start && k <= e.end) return e; }
    return null;
  }

  function nextOpening(from) {
    var t = new Date(from); t.setHours(0, 0, 0, 0);
    for (var i = 0; i < 400; i++) {
      var o = hoursOn(t);
      if (o) {
        var open = new Date(t); open.setHours(o.h[0], 0, 0, 0);
        var close = new Date(t); close.setHours(o.h[1], 0, 0, 0);
        if (close > from) return { day: new Date(t), open: open, close: close, o: o };
      }
      t.setDate(t.getDate() + 1);
    }
    return null;
  }

  function status() {
    var n = now(), x = nextOpening(n);
    if (!x) return { state: 'closed', short: 'See the 2027 calendar soon', long: '' };
    var isToday = key(x.day) === key(n);
    var tomorrow = new Date(n); tomorrow.setDate(n.getDate() + 1);
    var when = isToday ? 'today' : key(x.day) === key(tomorrow) ? 'tomorrow' : DOW[x.day.getDay()] + ', ' + MON[x.day.getMonth()] + ' ' + x.day.getDate();
    var feat = featureOn(key(x.day));
    if (isToday && n >= x.open) {
      return { state: 'open', short: 'Open now · until ' + hr(x.o.h[1]), long: 'Open now until ' + hr(x.o.h[1]), label: x.o.label, feat: feat, x: x, when: 'today' };
    }
    return { state: 'soon', short: 'Opens ' + when + ' · ' + hr(x.o.h[0]), long: 'Next open ' + when + ', ' + span(x.o.h), label: x.o.label, feat: feat, x: x, when: when };
  }

  function paintStatus() {
    var s = status();
    document.querySelectorAll('[data-status]').forEach(function (el) {
      el.textContent = s.short;
      el.closest('.pill') && el.closest('.pill').setAttribute('data-state', s.state);
    });
    var t = document.querySelector('[data-ticket]');
    if (t && s.x) {
      t.querySelector('[data-t-when]').textContent = s.state === 'open' ? 'Open now' : s.when === 'today' ? 'Later today' : s.when.charAt(0).toUpperCase() + s.when.slice(1);
      t.querySelector('[data-t-hours]').textContent = span(s.x.o.h);
      t.querySelector('[data-t-what]').textContent = s.feat ? s.feat.name : s.label;
      t.querySelector('[data-t-blurb]').textContent = s.feat ? s.feat.blurb : (s.label === 'Pumpkin Patch' ? 'Find your perfect pumpkin, meet the animals and soak up the history.' : '');
      t.setAttribute('data-state', s.state);
    }
    // Highlight the current / next weekend card
    var k = key(now()), marked = false;
    document.querySelectorAll('[data-ev]').forEach(function (el) {
      var e = EVENTS.filter(function (x) { return x.id === el.getAttribute('data-ev'); })[0];
      if (!e) return;
      if (k > e.end) el.classList.add('is-past');
      else if (!marked && !e.season) { el.classList.add('is-next'); marked = true; var b = el.querySelector('[data-flag]'); if (b) b.textContent = k >= e.start ? 'Happening now' : 'Up next'; }
    });
    // Week strip on the events page
    var wk = document.querySelector('[data-week]');
    if (wk) {
      var base = now(); base.setHours(0, 0, 0, 0);
      var html = '';
      for (var i = 0; i < 7; i++) {
        var day = new Date(base); day.setDate(base.getDate() + i);
        var o = hoursOn(day), f = featureOn(key(day));
        html += '<li class="' + (o ? 'open' : 'shut') + (i === 0 ? ' today' : '') + '"><b>' + (i === 0 ? 'Today' : DOW[day.getDay()].slice(0, 3)) + '</b><span class="dt">' + MON[day.getMonth()] + ' ' + day.getDate() + '</span><span class="hrs">' + (o ? span(o.h) : 'Closed') + '</span>' + (f ? '<em>' + f.name.replace(' Weekend', '') + '</em>' : '') + '</li>';
      }
      wk.innerHTML = html;
    }
  }

  // .ics download for any event
  function ics(id) {
    var e = EVENTS.filter(function (x) { return x.id === id; })[0]; if (!e) return;
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Old Baker Farm//Concept//EN'];
    var a = d(e.start), b = d(e.end);
    for (var t = new Date(a); t <= b; t.setDate(t.getDate() + 1)) {
      var o = e.h || (hoursOn(t) || {}).h; if (!o) continue;
      var ds = key(t).replace(/-/g, '');
      lines.push('BEGIN:VEVENT', 'UID:' + e.id + ds + '@oldbakerfarm.com', 'DTSTAMP:20261001T000000Z',
        'DTSTART;TZID=America/Chicago:' + ds + 'T' + String(o[0]).padStart(2, '0') + '0000',
        'DTEND;TZID=America/Chicago:' + ds + 'T' + String(o[1]).padStart(2, '0') + '0000',
        'SUMMARY:' + e.name + ' — Old Baker Farm', 'LOCATION:184 Furrow Lane\\, Harpersville\\, AL 35078',
        'DESCRIPTION:' + e.blurb.replace(/,/g, '\\,') + ' Admission $15 per person\\; children 1 & under free.', 'END:VEVENT');
      if (e.season) break; // seasons: one entry for the first day is enough
    }
    lines.push('END:VCALENDAR');
    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    var a2 = document.createElement('a'); a2.href = URL.createObjectURL(blob); a2.download = e.id + '-old-baker-farm.ics';
    document.body.appendChild(a2); a2.click(); a2.remove();
  }
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-ics]'); if (b) { ev.preventDefault(); ics(b.getAttribute('data-ics')); toast('Added to your calendar download'); }
  });

  // Admission calculator
  function calc() {
    var root = document.querySelector('[data-calc]'); if (!root) return;
    function run() {
      var n = +root.querySelector('[data-n="guests"]').textContent, l = +root.querySelector('[data-n="little"]').textContent;
      var card = root.querySelector('input[name=pay]:checked').value === 'card';
      var sub = n * 15, fee = card ? Math.round(sub * 3.5) / 100 : 0;
      root.querySelector('[data-out="sub"]').textContent = '$' + sub.toFixed(2);
      root.querySelector('[data-out="fee"]').textContent = card ? '$' + fee.toFixed(2) : '—';
      root.querySelector('[data-out="total"]').textContent = '$' + (sub + fee).toFixed(2);
      root.querySelector('[data-out="free"]').textContent = l ? l + ' free' : 'none';
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-step]'); if (!b) return;
      var el = root.querySelector('[data-n="' + b.getAttribute('data-for') + '"]');
      el.textContent = Math.max(0, Math.min(60, +el.textContent + +b.getAttribute('data-step'))); run();
    });
    root.addEventListener('change', run); run();
  }

  // Menu
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('site-menu');
  if (btn && nav) btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', open); document.body.classList.toggle('menu-open', open);
  });

  // Concept forms
  document.querySelectorAll('form[data-concept]').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); toast('Concept preview — on the live site this lands in the farm inbox'); f.reset(); });
  });

  var tEl;
  function toast(msg) {
    if (!tEl) { tEl = document.createElement('div'); tEl.className = 'toast'; tEl.setAttribute('role', 'status'); document.body.appendChild(tEl); }
    tEl.textContent = msg; tEl.classList.add('show'); clearTimeout(tEl._t); tEl._t = setTimeout(function () { tEl.classList.remove('show'); }, 2600);
  }

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  } else document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });

  paintStatus(); calc();
  setInterval(paintStatus, 60000);
})();
