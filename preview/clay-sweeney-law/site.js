(function () {
  // mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // phone call bar: only once the hero buttons have scrolled away
  var dock = document.querySelector('.dock');
  if (dock) {
    var onScroll = function () { dock.classList.toggle('show', window.scrollY > 520); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // reveal on scroll
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (n) { io.observe(n); });
  } else {
    rv.forEach(function (n) { n.classList.add('in'); });
  }

  // tabs
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = group.querySelectorAll('.tab');
    var panels = group.querySelectorAll('.panel');
    function pick(id) {
      tabs.forEach(function (t) { t.setAttribute('aria-selected', t.dataset.tab === id ? 'true' : 'false'); });
      panels.forEach(function (p) { p.classList.toggle('on', p.dataset.panel === id); });
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { pick(t.dataset.tab); }); });
    var want = location.hash.replace('#', '');
    if (want && group.querySelector('[data-tab="' + want + '"]')) {
      pick(want);
      group.scrollIntoView();
    }
  });

  // Alabama recording tax estimate (Ala. Code 40-22-1 and 40-22-2)
  var calc = document.getElementById('taxcalc');
  if (calc) {
    var price = calc.querySelector('[name=price]');
    var loan = calc.querySelector('[name=loan]');
    var usd = function (n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    var num = function (el) { return Math.max(0, parseFloat(String(el.value).replace(/[^0-9.]/g, '')) || 0); };
    var run = function () {
      var p = num(price), l = Math.min(num(loan), p || num(loan));
      var deed = Math.ceil(Math.max(p - l, 0) / 500) * 0.5;   // $0.50 per $500 not covered by the mortgage
      var mort = Math.ceil(l / 100) * 0.15;                    // $0.15 per $100 borrowed
      calc.querySelector('[data-o=deed]').textContent = usd(deed);
      calc.querySelector('[data-o=mort]').textContent = usd(mort);
      calc.querySelector('[data-o=total]').textContent = usd(deed + mort);
    };
    [price, loan].forEach(function (el) {
      el.addEventListener('input', run);
      el.addEventListener('blur', function () { var n = num(el); el.value = n ? n.toLocaleString('en-US') : ''; });
    });
    run();
  }

  // contact form (preview only)
  var form = document.getElementById('startform');
  if (form) {
    var role = new URLSearchParams(location.search).get('i');
    var sel = form.querySelector('[name=role]');
    if (role && sel && sel.querySelector('option[value="' + role + '"]')) sel.value = role;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('formmsg');
      msg.classList.add('on');
      msg.scrollIntoView({ block: 'nearest' });
    });
  }
})();
