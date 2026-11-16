(function () {
  'use strict';
  var doc = document.documentElement;

  /* header + drawer */
  var head = document.querySelector('.head');
  function onScroll() { head && head.classList.toggle('scrolled', window.scrollY > 4); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var btn = document.querySelector('.menu-btn'), drawer = document.querySelector('.drawer');
  function setMenu(open) {
    doc.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open);
    drawer.setAttribute('aria-hidden', !open);
    if (open) drawer.querySelector('a').focus({ preventScroll: true });
  }
  if (btn && drawer) {
    btn.addEventListener('click', function () { setMenu(!doc.classList.contains('menu-open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && doc.classList.contains('menu-open')) { setMenu(false); btn.focus(); } });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  }

  /* Birmingham time. ?now=2026-11-20T15:30 pretends it's that time (for checking) */
  function chicago() {
    var q = new URLSearchParams(location.search).get('now');
    if (q && /^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(q)) {
      var d = new Date(q + ':00Z');
      return { y: d.getUTCFullYear(), mo: d.getUTCMonth() + 1, d: d.getUTCDate(), wd: d.getUTCDay(), h: d.getUTCHours() + d.getUTCMinutes() / 60 };
    }
    var parts = {};
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    return { y: +parts.year, mo: +parts.month, d: +parts.day, wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday), h: +parts.hour + (+parts.minute) / 60 };
  }
  var now = chicago();
  function closes(wd) { return wd === 5 || wd === 6 ? 21.5 : 21; }
  function label(h) { return h === 21.5 ? '9:30 pm' : '9 pm'; }
  var open = now.h >= 12 && now.h < closes(now.wd);
  var text;
  if (open) text = 'Open now until ' + label(closes(now.wd));
  else if (now.h < 12) text = 'Opens today at noon';
  else text = 'Closed now. Opens tomorrow at noon';
  document.querySelectorAll('[data-status]').forEach(function (el) {
    var where = el.getAttribute('data-status');
    el.textContent = text + (where ? ' ' + where : '');
    el.classList.toggle('is-open', open);
  });
  document.querySelectorAll('.hours [data-days]').forEach(function (dt) {
    if (dt.getAttribute('data-days').split(',').indexOf(String(now.wd)) > -1) {
      dt.classList.add('today'); dt.nextElementSibling.classList.add('today');
    }
  });

  /* seasonal blocks disappear after their last day */
  var stamp = now.y * 10000 + now.mo * 100 + now.d;
  document.querySelectorAll('[data-until]').forEach(function (el) {
    if (stamp > +el.getAttribute('data-until').replace(/-/g, '')) el.hidden = true;
  });

  /* toast */
  var toast;
  window.bendysToast = function (msg) {
    if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { toast.classList.remove('show'); }, 4200);
  };
  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      window.bendysToast(f.getAttribute('data-demo'));
    });
  });

  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = now.y;
})();
