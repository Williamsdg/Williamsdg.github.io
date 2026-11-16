/* Catering request + live estimate, using only the prices on Bendy's catering page. */
(function () {
  'use strict';
  var form = document.querySelector('[data-catering]');
  if (!form) return;
  var out = document.querySelector('[data-estimate]');
  var barTotal = document.querySelector('[data-est-bar-total]');
  var money = function (n) { return '$' + n.toFixed(2).replace(/\.00$/, ''); };
  var TREATS = {
    cookie: { name: 'Cookies', each: 1.75 },
    scoop: { name: 'Single scoops of ice cream', each: 4 },
    combo: { name: 'Single scoop + a cookie', each: 5.75 },
    mini: { name: 'Mini ice cream sandwiches', each: 4.5, noTruck: true },
    sandwich: { name: 'Ice cream sandwiches', each: 7.5 }
  };

  function val(name) { var el = form.querySelector('[name="' + name + '"]:checked') || form.querySelector('[name="' + name + '"]:not([type=radio])'); return el ? el.value : ''; }

  function isWeekend(dateStr, timeStr) {
    if (!dateStr) return null;
    var p = dateStr.split('-'), d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay();
    if (d === 0 || d === 6) return true;
    if (d === 5) { if (!timeStr) return null; return +timeStr.split(':')[0] >= 17; }
    return false;
  }

  function daysAway(dateStr) {
    var p = dateStr.split('-'), t = new Date(), today = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
    return Math.round((Date.UTC(+p[0], +p[1] - 1, +p[2]) - today) / 864e5);
  }

  function update() {
    var how = val('catering_option'), treat = TREATS[val('treat')], n = parseInt(val('servings'), 10) || 0;
    var date = val('event_date'), start = val('start_time');

    // option-dependent fields
    form.querySelectorAll('[data-for]').forEach(function (el) { el.hidden = el.getAttribute('data-for').split(' ').indexOf(how) < 0; });
    var mini = form.querySelector('#treat-mini');
    mini.disabled = how === 'truck';
    if (mini.disabled && mini.checked) { mini.checked = false; treat = null; }
    form.querySelectorAll('[data-for] input').forEach(function (i) { i.required = !i.closest('[data-for]').hidden && i.hasAttribute('data-req'); });

    var warn = '';
    if (date) {
      var away = daysAway(date);
      if (away < 0) warn = 'That date has already passed.';
      else if (away < 7) warn = 'Typically, we need at least a week to prepare for events.';
      else if (away > 183) warn = 'We do not book events more than 6 months in advance.';
    }
    form.querySelector('[data-date-warn]').textContent = warn;

    var lines = [], total = 0, note = '';
    barTotal.textContent = 'Fill in the form';
    if (!how || !treat || !n) {
      out.innerHTML = '<p class="est-empty">Choose how you want it, what to serve and how many servings, and the estimate fills in here.</p>';
      return;
    }
    var food = n * treat.each;
    lines.push([n + ' × ' + treat.name.toLowerCase() + ' at ' + money(treat.each), money(food)]);
    if (how === 'truck') {
      var wk = isWeekend(date, start);
      if (wk === null) {
        out.innerHTML = '<p class="est-empty">Add the event date' + (date ? ' and start time' : '') + ' so we know whether weekday or weekend truck pricing applies.</p>';
        return;
      }
      var min = wk ? 600 : 400, fee = wk ? 150 : 100;
      if (food < min) lines.push([(wk ? 'Weekend' : 'Weekday') + ' minimum purchase is ' + money(min), '+' + money(min - food)]);
      lines.push([(wk ? 'Weekend' : 'Weekday') + ' truck reservation fee', money(fee)]);
      total = Math.max(food, min) + fee;
      note = 'The food truck will not drive more than 30 miles (60-mile round trip) from our Cahaba Heights store.';
    } else if (how === 'delivery') {
      if (food < 100) lines.push(['Delivery minimum purchase is $100', '+' + money(100 - food)]);
      total = Math.max(food, 100);
      note = 'Plus a delivery fee of $1 per mile from our Cahaba Heights location.';
    } else {
      total = food;
      note = 'Pick up at ' + (val('pickup_location') || 'Cahaba Heights or Trussville') + '.';
    }
    barTotal.textContent = money(total);
    out.innerHTML = '<div class="est-total"><span>Estimate</span><b>' + money(total) + '</b></div>' +
      '<ul class="est-lines">' + lines.map(function (l) { return '<li><span>' + l[0] + '</span><span>' + l[1] + '</span></li>'; }).join('') + '</ul>' +
      '<p class="small muted">' + note + '</p>';
  }

  // date input limits: today .. 6 months
  var d = form.querySelector('[name=event_date]'), t = new Date(), m = new Date(); m.setMonth(m.getMonth() + 6);
  var iso = function (x) { return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
  d.min = iso(t); d.max = iso(m);

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    window.bendysToast('This preview isn\'t connected yet. On the live site your request goes straight to Bendy\'s.');
  });
  update();
})();
