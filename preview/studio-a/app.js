(function () {
  'use strict';

  // Studio hours, keyed by weekday (0 = Sunday). Times are 24h, studio is on Central time.
  var HOURS = { 2: [10, 18], 3: [10, 18], 4: [10, 20], 5: [10, 18], 6: [10, 15] };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function clock(h) { var s = h % 12 || 12; return s + (h < 12 ? ' am' : ' pm'); }

  function centralNow() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
    return { day: day, mins: (+o.hour % 24) * 60 + (+o.minute) };
  }

  function nextOpening(day) {
    for (var i = 1; i <= 7; i++) {
      var d = (day + i) % 7;
      if (HOURS[d]) return { day: d, inDays: i };
    }
  }

  function statusText() {
    var now = centralNow(), today = HOURS[now.day];
    if (today && now.mins >= today[0] * 60 && now.mins < today[1] * 60) {
      return { open: true, text: 'Open now until ' + clock(today[1]) };
    }
    if (today && now.mins < today[0] * 60) {
      return { open: false, text: 'Opens today at ' + clock(today[0]) };
    }
    var n = nextOpening(now.day);
    var when = n.inDays === 1 ? 'tomorrow' : DAYS[n.day];
    return { open: false, text: 'Closed now. Opens ' + when + ' at ' + clock(HOURS[n.day][0]) };
  }

  var st = statusText();
  document.querySelectorAll('[data-status]').forEach(function (el) {
    el.textContent = st.text;
    el.classList.toggle('open', st.open);
  });
  var today = centralNow().day;
  document.querySelectorAll('.hours tr[data-day]').forEach(function (tr) {
    if (tr.getAttribute('data-day').split(',').indexOf(String(today)) > -1) tr.classList.add('today');
  });

  // Header border once the page moves
  var head = document.querySelector('.head');
  function onScroll() { head.classList.toggle('scrolled', window.scrollY > 4); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Phone menu
  var burger = document.querySelector('.burger'), sheet = document.getElementById('sheet');
  if (burger && sheet) {
    var setOpen = function (open) {
      sheet.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    burger.addEventListener('click', function () { setOpen(!sheet.classList.contains('open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  }

  // Phone action bar: hidden while the page's own book/call buttons are on screen
  var bar = document.querySelector('.bar'), anchor = document.querySelector('[data-bar-anchor]');
  if (bar && anchor && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var e = es[0];
      bar.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe(anchor);
  }

  // The storefront's string lights come on once the photo has loaded
  var store = document.querySelector('.store');
  if (store) {
    var BULBS = [[7.22,32.28],[11.2,35.35],[11.7,31.53],[15.36,35.85],[16.5,30.78],[19.34,36.7],[19.53,29.64],[21.71,29.94],[22.1,36.68],[26.5,36.25],[26.86,29.1],[30.6,35.66],[34.21,28.02],[35.22,35.14],[40.2,34.7],[40.51,26.94],[45.04,26.43],[45.06,33.88],[47.21,25.97],[50.79,33.02],[54.15,24.97],[56.21,24.85],[56.26,32.44],[61.6,23.73],[62.17,31.7],[68.33,31.06],[68.43,20.43],[68.55,23.45],[71.45,22.38],[71.59,25.34],[74.3,23.72],[74.45,27.38],[76.64,25.38],[76.79,28.99],[77.24,26.95]];
    var layer = store.querySelector('.bulbs'), html = '';
    BULBS.forEach(function (b, i) {
      html += '<i style="left:' + b[0] + '%;top:' + b[1] + '%;animation-delay:' + (350 + i * 52) + 'ms"></i>';
    });
    layer.innerHTML = html;
    var img = store.querySelector('img');
    var light = function () { store.classList.add('lit'); };
    if (img.complete && img.naturalWidth) light(); else img.addEventListener('load', light);
  }

  // Prices page: highlight the section in view
  var jump = document.querySelector('.jump');
  if (jump && 'IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(jump.querySelectorAll('a'));
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var mark = function (id) {
      links.forEach(function (a) { a.classList.toggle('on', a === byId[id]); });
      var on = byId[id];
      if (on) {
        var row = jump.querySelector('.wrap');
        var left = on.offsetLeft - 16;
        if (left < row.scrollLeft || on.offsetLeft + on.offsetWidth > row.scrollLeft + row.clientWidth) row.scrollTo({ left: left, behavior: 'smooth' });
      }
    };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) mark(e.target.id); });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }
})();
