/* EIB Systems concept — small behaviours only; every page works without this file. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* ---- mobile menu */
  var btn = $('.menu-btn'), nav = $('#nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus();
      }
    });
  }

  /* ---- office hours: Monday–Friday, 9–5 Central */
  function officeNow() {
    var parts = {};
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false })
      .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
    var mins = (parseInt(parts.hour, 10) % 24) * 60 + parseInt(parts.minute, 10);
    var weekday = day >= 1 && day <= 5;
    var open = weekday && mins >= 540 && mins < 1020;
    var next;
    if (weekday && mins < 540) next = 'today at 9:00am';
    else if (day === 5 || day === 6) next = 'Monday at 9:00am';
    else next = 'tomorrow at 9:00am';
    return { open: open, next: next };
  }
  try {
    var o = officeNow();
    $$('[data-open]').forEach(function (el) {
      if (el.getAttribute('data-open') === 'short') {
        el.textContent = o.open ? 'Open now' : 'Closed now';
        if (o.open) el.classList.add('is-open');
      } else {
        el.textContent = o.open ? 'Open now · until 5:00pm' : 'Closed · opens ' + o.next;
      }
    });
  } catch (err) { /* keep the printed hours */ }

  /* ---- tax deadlines */
  var DEADLINES = [
    { m: 1, d: 15, title: 'Q4 Estimated Payment Due' }, { m: 1, d: 31, title: 'W-2s & 1099s Issued' },
    { m: 3, d: 15, title: 'S-Corp & Partnership Returns' }, { m: 4, d: 15, title: 'Tax Day' },
    { m: 6, d: 15, title: 'Q2 Estimated Payment Due' }, { m: 9, d: 15, title: 'Q3 Estimate + Extended Pass-Throughs' },
    { m: 10, d: 15, title: 'Extended Individual Returns Due' }, { m: 12, d: 31, title: 'Year-End Planning Deadline' }
  ];
  var dataEl = $('#deadline-data');
  if (dataEl) DEADLINES = JSON.parse(dataEl.textContent);

  var today = new Date(); today.setHours(0, 0, 0, 0);
  // A deadline on a weekend moves to the next business day. Dec 31 is a planning cut-off, not a filing date, so it stays put.
  function occurrence(x, year) {
    var dt = new Date(year, x.m - 1, x.d);
    if (!(x.m === 12 && x.d === 31)) {
      if (dt.getDay() === 6) dt.setDate(dt.getDate() + 2);
      if (dt.getDay() === 0) dt.setDate(dt.getDate() + 1);
    }
    return dt;
  }
  function upcoming(x) {
    var dt = occurrence(x, today.getFullYear());
    if (dt < today) dt = occurrence(x, today.getFullYear() + 1);
    return dt;
  }
  function daysTo(dt) { return Math.round((dt - today) / 86400000); }
  function countdown(n) { return n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : 'In ' + n + ' days'; }
  function shortDate(dt) { return MONTHS[dt.getMonth()].slice(0, 3) + ' ' + dt.getDate(); }
  var list = DEADLINES.map(function (x) { return { x: x, date: upcoming(x) }; }).sort(function (a, b) { return a.date - b.date; });
  var next = list[0];

  $$('[data-next-deadline]').forEach(function (box) {
    var d = $('[data-nd-date]', box), t = $('[data-nd-title]', box), c = $('[data-nd-count]', box);
    if (d) d.textContent = c ? DAYS[next.date.getDay()] + ', ' + MONTHS[next.date.getMonth()] + ' ' + next.date.getDate() : shortDate(next.date) + ' · ' + countdown(daysTo(next.date)).toLowerCase();
    if (t) t.textContent = next.x.title;
    if (c) c.textContent = countdown(daysTo(next.date));
  });

  var up = $('[data-upnext-list]');
  if (up) {
    list.slice(0, 3).forEach(function (it) {
      var li = document.createElement('li'), b = document.createElement('b'), s = document.createElement('span');
      b.textContent = shortDate(it.date); s.textContent = it.x.title;
      li.appendChild(b); li.appendChild(s); up.appendChild(li);
    });
  }

  // The year starts from whatever is due next, not from January.
  var cal = $('[data-cal]');
  if (cal) {
    list.forEach(function (it) {
      var li = $('[data-deadline="' + it.x.m + '-' + it.x.d + '"]', cal);
      if (li) cal.appendChild(li);
    });
  }

  $$('[data-deadline]').forEach(function (li) {
    var key = li.getAttribute('data-deadline');
    var it = list.filter(function (i) { return i.x.m + '-' + i.x.d === key; })[0];
    if (!it) return;
    var when = $('[data-when]', li);
    if (when) when.textContent = DAYS[it.date.getDay()].slice(0, 3) + ' ' + shortDate(it.date) + ', ' + it.date.getFullYear();
    if (it === next) li.classList.add('is-next');
  });

  /* ---- add a deadline to the visitor's own calendar */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function stamp(dt) { return dt.getFullYear() + pad(dt.getMonth() + 1) + pad(dt.getDate()); }
  $$('[data-ics]').forEach(function (b) {
    b.addEventListener('click', function () {
      var key = b.getAttribute('data-ics');
      var it = list.filter(function (i) { return i.x.m + '-' + i.x.d === key; })[0];
      if (!it) return;
      var end = new Date(it.date); end.setDate(end.getDate() + 1);
      var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//EIB Systems//Tax Calendar//EN', 'BEGIN:VEVENT',
        'UID:' + stamp(it.date) + '-' + key + '@eibsystems.com', 'DTSTAMP:' + stamp(new Date()) + 'T000000Z',
        'DTSTART;VALUE=DATE:' + stamp(it.date), 'DTEND;VALUE=DATE:' + stamp(end),
        'SUMMARY:' + it.x.title.replace(/([,;])/g, '\\$1'),
        'DESCRIPTION:' + ((it.x.detail || '') + ' Questions? Call EIB Systems at (205) 854-1957.').replace(/([,;])/g, '\\$1'),
        'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      a.download = 'eib-' + it.x.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.ics';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
  });

  /* ---- "What brings you in?" tabs */
  $$('[role=tablist]').forEach(function (tl) {
    var tabs = $$('[role=tab]', tl);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
      if (tl.scrollWidth > tl.clientWidth) tl.scrollTo({ left: tab.offsetLeft - 16, behavior: 'smooth' });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (ev) {
        var step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[ev.key];
        if (!step) return;
        ev.preventDefault();
        select(tabs[(i + step + tabs.length) % tabs.length], true);
      });
    });
  });

  /* ---- article topic filter */
  var arts = $('[data-arts]');
  if (arts) {
    var chips = $$('.chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var want = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        $$('.art', arts).forEach(function (a) { a.hidden = !!want && a.getAttribute('data-cat') !== want; });
      });
    });
  }

  /* ---- contact form (not connected in this preview) */
  var form = $('[data-form]');
  if (form) {
    var want = new URLSearchParams(location.search).get('service');
    if (want && form.elements.service.querySelector('option[value="' + want.replace(/[^a-z-]/g, '') + '"]')) form.elements.service.value = want;
    var msg = $('[data-form-msg]', form);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var bad = $$('[required]', form).filter(function (f) { return !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)); });
      $$('.is-bad', form).forEach(function (f) { f.classList.remove('is-bad'); });
      msg.hidden = false;
      if (bad.length) {
        bad.forEach(function (f) { f.classList.add('is-bad'); });
        msg.textContent = 'Please add your name, a valid email and a short message.';
        bad[0].focus();
        return;
      }
      msg.textContent = 'This is a design preview, so the form is not connected yet and nothing was sent. To reach EIB Systems today, call (205) 854-1957 or email info@eiboffice.com.';
    });
  }
})();
