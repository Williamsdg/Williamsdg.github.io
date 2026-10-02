(function () {
  var doc = document.documentElement;
  doc.classList.add('js');

  // mobile menu
  var mm = document.getElementById('mobile-menu');
  var burger = document.querySelector('.burger');
  function setMenu(open) {
    mm.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) mm.querySelector('.mm-close').focus();
  }
  if (mm && burger) {
    burger.addEventListener('click', function () { setMenu(true); });
    mm.querySelector('.mm-close').addEventListener('click', function () { setMenu(false); burger.focus(); });
    mm.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mm.classList.contains('open')) { setMenu(false); burger.focus(); } });
  }

  // first-steps tabs
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { pick(i); });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var next = (i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      pick(next);
      tabs[next].focus();
    });
  });
  function pick(n) {
    tabs.forEach(function (t, i) {
      var on = i === n;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }

  // reveal on scroll
  var rv = [].slice.call(document.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (n) { io.observe(n); });
  } else {
    rv.forEach(function (n) { n.classList.add('in'); });
  }
  // wall-clock escape so nothing stays hidden if the observer never fires
  setTimeout(function () { rv.forEach(function (n) { n.classList.add('in'); }); }, 2500);

  // case-review form (concept preview: nothing is transmitted)
  var form = document.getElementById('case-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      [].forEach.call(form.querySelectorAll('[required]'), function (el) {
        var bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value)) || (el.type === 'tel' && el.value.replace(/\D/g, '').length < 10);
        el.closest('.f').classList.toggle('bad', bad);
        if (bad && ok) { el.focus(); ok = false; }
      });
      if (!ok) return;
      var first = form.elements.name.value.trim().split(/\s+/)[0];
      document.getElementById('sent-name').textContent = first;
      form.hidden = true;
      var sent = document.getElementById('sent');
      sent.classList.add('show');
      sent.focus();
    });
    // pre-select the matter type from ?about=
    var m = /[?&]about=(injury|criminal)/.exec(location.search);
    if (m) form.elements.about.value = m[1];
  }

  // hide the phone dock while the form, the footer, or the same two buttons are on screen
  var dock = document.querySelector('.dock');
  var watch = [].slice.call(document.querySelectorAll('.form, .ftr, .phero .acts, .cta .acts, .side-card.call'));
  if (dock && watch.length && 'IntersectionObserver' in window) {
    var seen = new Set();
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target); });
      dock.classList.toggle('hide', seen.size > 0);
    }, { threshold: 0.15 });
    watch.forEach(function (n) { dio.observe(n); });
  }
})();
