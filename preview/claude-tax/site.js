/* Claude.Tax concept — office status, deadline countdown, packet chooser, calculators, mail form. */
(function () {
  var TZ = 'America/Chicago';
  // Office hours, Central time: [open, close] in 24h. Sunday closed.
  var HOURS = { 1: [9, 19], 2: [9, 19], 3: [9, 19], 4: [9, 19], 5: [9, 19], 6: [9, 12] };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var DOW = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function officeNow() {
    var o = {};
    new Intl.DateTimeFormat('en-US', {
      timeZone: TZ, weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    return { dow: DOW[o.weekday], mins: (Number(o.hour) % 24) * 60 + Number(o.minute),
             y: Number(o.year), m: Number(o.month), d: Number(o.day) };
  }
  function hr(h) { return (h % 12 || 12) + (h < 12 ? ' AM' : ' PM'); }
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  // ---- open / closed
  var n = officeNow();
  var today = HOURS[n.dow];
  var open = !!today && n.mins >= today[0] * 60 && n.mins < today[1] * 60;
  var text;
  if (open) {
    text = 'Open now until ' + hr(today[1]) + ' Central';
  } else if (today && n.mins < today[0] * 60) {
    text = 'Closed now. Opens today at ' + hr(today[0]) + ' Central';
  } else {
    var i = 1;
    while (!HOURS[(n.dow + i) % 7]) i++;
    var next = (n.dow + i) % 7;
    text = 'Closed now. Opens ' + (i === 1 ? 'tomorrow' : DAYS[next]) + ' at ' + hr(HOURS[next][0]) + ' Central';
  }
  each('[data-status]', function (el) {
    el.textContent = text;
    el.classList.add(open ? 'is-open' : 'is-closed');
  });
  each('tr[data-dow="' + n.dow + '"]', function (tr) { tr.classList.add('today'); });

  // ---- days left to the filing deadline (counted on the office's calendar)
  function daysTo(iso) {
    var p = iso.split('-');
    return Math.round((Date.UTC(+p[0], +p[1] - 1, +p[2]) - Date.UTC(n.y, n.m - 1, n.d)) / 864e5);
  }
  each('[data-days]', function (el) {
    var d = daysTo(el.getAttribute('data-days'));
    el.textContent = d > 1 ? d + ' days left' : d === 1 ? '1 day left' : d === 0 ? 'Due today' : '';
  });
  each('[data-until]', function (el) {
    if (daysTo(el.getAttribute('data-until')) >= 0) el.hidden = false;
  });

  // ---- mobile menu
  var head = document.querySelector('.head');
  var menu = document.querySelector('.menu');
  if (head && menu) {
    menu.addEventListener('click', function () {
      var on = head.classList.toggle('open');
      menu.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  }

  // ---- organizer packet chooser
  var chooser = document.querySelector('[data-chooser]');
  if (chooser) {
    var count = chooser.querySelector('[data-count]');
    var sync = function () {
      var shown = 0;
      Array.prototype.forEach.call(chooser.querySelectorAll('[data-doc]'), function (li) {
        var need = li.getAttribute('data-doc');
        var box = need === 'all' ? null : chooser.querySelector('input[name="' + need + '"]');
        var show = !box || box.checked;
        li.hidden = !show;
        if (show) shown++;
      });
      count.textContent = shown + ' documents';
    };
    chooser.addEventListener('change', sync);
    sync();
  }

  // ---- calculators
  function usd(v) { return v.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); }
  function amount(input) { var v = parseFloat(String(input.value).replace(/[^0-9.]/g, '')); return isFinite(v) && v > 0 ? v : 0; }
  var card = document.querySelector('[data-calc="card"]');
  if (card) {
    var cIn = card.querySelector('input');
    var cRun = function () {
      var v = amount(cIn);
      card.querySelector('[data-o="plain"]').textContent = usd(v);
      card.querySelector('[data-o="fee"]').textContent = usd(v * 0.038);
      card.querySelector('[data-o="card"]').textContent = usd(v * 1.038);
    };
    cIn.addEventListener('input', cRun); cRun();
  }
  var ext = document.querySelector('[data-calc="ext"]');
  if (ext) {
    var eIn = ext.querySelector('input');
    var eRun = function () { ext.querySelector('[data-o="ext"]').textContent = usd(amount(eIn) * 0.5); };
    eIn.addEventListener('input', eRun); eRun();
  }

  // ---- contact form: writes the email for them, sends through their own mail app
  var form = document.querySelector('[data-mail]');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = form.elements;
      var body = [f.message.value.trim(), '', 'Name: ' + f.name.value.trim(), 'Phone: ' + f.phone.value.trim()].join('\n');
      window.location.href = 'mailto:' + form.getAttribute('data-mail') +
        '?subject=' + encodeURIComponent('Taxes: ' + f.topic.value) +
        '&body=' + encodeURIComponent(body);
      form.querySelector('[data-sent]').hidden = false;
    });
  }
})();
