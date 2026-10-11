// Williams Digital — site.js (no dependencies)
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');

  // Header: border on scroll
  var head = document.querySelector('.site-head');
  function onScroll() { if (head) head.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  if (btn && head) {
    btn.addEventListener('click', function () {
      var open = head.classList.toggle('menu-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && head.classList.contains('menu-open')) {
        head.classList.remove('menu-open'); btn.setAttribute('aria-expanded', 'false'); btn.focus();
      }
    });
    head.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { head.classList.remove('menu-open'); btn.setAttribute('aria-expanded', 'false'); });
    });
  }

  // Reveal on scroll
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }
  // Safety net: never leave content hidden
  setTimeout(function () { rv.forEach(function (el) { el.classList.add('in'); }); }, 2500);

  // Front-of-house / back-of-house comparator
  document.querySelectorAll('[data-compare]').forEach(function (box) {
    var stage = box.querySelector('.compare-stage');
    var range = box.querySelector('input[type=range]');
    function set(p) {
      p = Math.max(0, Math.min(100, p));
      stage.style.setProperty('--pos', p + '%');
      range.value = p;
      range.setAttribute('aria-valuetext', p < 15 ? 'Showing the dashboard' : p > 85 ? 'Showing the website' : Math.round(p) + '% website');
    }
    range.addEventListener('input', function () { set(+range.value); });
    // Gentle intro sweep so people discover it's interactive
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && 'IntersectionObserver' in window) {
      var played = false;
      new IntersectionObserver(function (en, obs) {
        if (en[0].isIntersecting && !played) {
          played = true; obs.disconnect();
          var t0 = performance.now(), dur = 1800;
          (function tick(t) {
            var k = Math.min(1, (t - t0) / dur);
            set(50 + (k < 1 ? -32 * Math.sin(k * Math.PI * 2) : 0));
            if (k < 1 && !box.dataset.touched) requestAnimationFrame(tick); else if (!box.dataset.touched) set(50);
          })(t0);
        }
      }, { threshold: 0.5 }).observe(box);
    }
    ['pointerdown', 'keydown'].forEach(function (ev) { range.addEventListener(ev, function () { box.dataset.touched = '1'; }); });
    set(50);
  });

  // Mobile sticky CTA: hide near footer / when a primary CTA is visible
  var mcta = document.querySelector('.m-cta');
  if (mcta && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.cta, .site-foot, .hero .actions, .page-hero .actions');
    var visible = new Set();
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.isIntersecting ? visible.add(en.target) : visible.delete(en.target); });
      mcta.classList.toggle('hide', visible.size > 0);
    });
    targets.forEach(function (t) { mio.observe(t); });
  }

  var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
