(function () {
  'use strict';
  var doc = document.documentElement;

  /* header shadow + drawer */
  var top = document.querySelector('.top');
  function onScroll() { if (top) top.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var menuBtn = document.querySelector('.menu-btn');
  var drawer = document.querySelector('.drawer');
  function setDrawer(open) {
    doc.classList.toggle('drawer-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && drawer) drawer.querySelector('a,button').focus();
    else if (menuBtn && !open) menuBtn.focus({ preventScroll: true });
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setDrawer(true); });
  document.querySelectorAll('[data-close-drawer]').forEach(function (el) {
    el.addEventListener('click', function () { setDrawer(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && doc.classList.contains('drawer-open')) setDrawer(false);
  });

  /* phone dock: hidden while the hero's own buttons are on screen */
  var heroCta = document.querySelector('[data-hero-cta]');
  if (!heroCta || !('IntersectionObserver' in window)) document.body.classList.add('dock-on');
  else new IntersectionObserver(function (en) {
    document.body.classList.toggle('dock-on', en[0].intersectionRatio < 0.99);
  }, { threshold: [0, 0.5, 1] }).observe(heroCta);

  /* open / closed, from the posted hours (Central time) */
  var HOURS = { 2: [9, 17], 3: [9, 17], 4: [9, 18], 5: [9, 17], 6: [9, 15] };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function nowCentral() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
      return { day: day, h: (parseInt(o.hour, 10) % 24) + parseInt(o.minute, 10) / 60 };
    } catch (e) { var d = new Date(); return { day: d.getDay(), h: d.getHours() + d.getMinutes() / 60 }; }
  }
  function fmt(h) { var s = h > 12 ? h - 12 : h; return s + (h >= 12 ? ' pm' : ' am'); }
  var now = nowCentral();
  var text, open = false, today = HOURS[now.day];
  if (today && now.h >= today[0] && now.h < today[1]) { open = true; text = 'Open now, until ' + fmt(today[1]) + ' today'; }
  else if (today && now.h < today[0]) { text = 'Opens today at ' + fmt(today[0]); }
  else {
    var n = now.day, i = 0;
    do { n = (n + 1) % 7; i++; } while (!HOURS[n] && i < 8);
    text = 'Closed now. Opens ' + (i === 1 ? 'tomorrow' : DAYS[n]) + ' at ' + fmt(HOURS[n][0]);
  }
  document.querySelectorAll('[data-status]').forEach(function (el) {
    el.classList.toggle('open', open);
    el.querySelector('span').textContent = text;
  });
  document.querySelectorAll('[data-day="' + now.day + '"]').forEach(function (el) {
    el.classList.add('today');
    var lab = el.querySelector('[data-today-label]');
    if (lab) lab.textContent = 'Today';
  });

  /* visit builder: shared across pages through localStorage */
  var KEY = 'ss-visit';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  var picked = load();
  var params = new URLSearchParams(location.search);
  if (params.get('svc')) { params.get('svc').split(',').forEach(function (id) { if (picked.indexOf(id) < 0) picked.push(id); }); save(picked); }

  var catalog = {};
  try { catalog = JSON.parse(document.getElementById('catalog').textContent); } catch (e) {}
  var tally = document.querySelector('.tally');

  function total(list) { return list.reduce(function (s, id) { return s + (catalog[id] ? catalog[id].price : 0); }, 0); }
  function money(n) { return '$' + n.toLocaleString('en-US'); }

  function render() {
    document.querySelectorAll('button[data-svc]').forEach(function (b) {
      b.setAttribute('aria-pressed', picked.indexOf(b.dataset.svc) > -1 ? 'true' : 'false');
    });
    document.querySelectorAll('input[data-svc]').forEach(function (inp) {
      inp.checked = picked.indexOf(inp.dataset.svc) > -1;
    });
    var valid = picked.filter(function (id) { return catalog[id]; });
    if (tally) {
      tally.classList.toggle('show', valid.length > 0);
      var c = tally.querySelector('[data-count]');
      if (c) c.textContent = valid.length + (valid.length === 1 ? ' service' : ' services');
      var t = tally.querySelector('[data-total]');
      if (t) t.textContent = 'from ' + money(total(valid));
    }
    var list = document.querySelector('[data-visit-list]');
    if (list) {
      list.innerHTML = '';
      valid.forEach(function (id) {
        var li = document.createElement('li');
        var a = document.createElement('span'); a.textContent = catalog[id].name;
        var s = catalog[id];
        var b = document.createElement('span'); b.textContent = s.price ? money(s.price) + (s.fixed ? '' : '+') : 'Free';
        li.appendChild(a); li.appendChild(b); list.appendChild(li);
      });
      document.querySelector('[data-visit-empty]').hidden = valid.length > 0;
      document.querySelector('[data-visit-total]').textContent = money(total(valid));
    }
  }
  function toggle(id, on) {
    var i = picked.indexOf(id);
    if (on === undefined) on = i < 0;
    if (on && i < 0) picked.push(id);
    if (!on && i > -1) picked.splice(i, 1);
    save(picked); render();
  }
  document.querySelectorAll('button[data-svc]').forEach(function (b) {
    b.addEventListener('click', function () { toggle(b.dataset.svc); });
  });
  document.querySelectorAll('input[data-svc]').forEach(function (inp) {
    inp.addEventListener('change', function () { toggle(inp.dataset.svc, inp.checked); });
  });
  document.querySelectorAll('[data-clear]').forEach(function (b) {
    b.addEventListener('click', function () { picked = []; save(picked); render(); });
  });
  render();

  /* forms: validate required fields, then show the confirmation */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      form.querySelectorAll('[required]').forEach(function (inp) {
        var f = inp.closest('.field');
        var ok = inp.value.trim() !== '' && (inp.type !== 'email' || /.+@.+\..+/.test(inp.value));
        if (inp.type === 'tel') ok = inp.value.replace(/\D/g, '').length >= 10;
        f.classList.toggle('bad', !ok);
        if (!ok && !firstBad) firstBad = inp;
      });
      if (firstBad) { firstBad.focus(); return; }
      var box = form.closest('[data-form-box]');
      box.classList.add('sent');
      if (form.dataset.demo === 'visit') { picked = []; save(picked); render(); }
      var done = box.querySelector('.done');
      done.setAttribute('tabindex', '-1'); done.focus();
      box.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
    form.querySelectorAll('[required]').forEach(function (inp) {
      inp.addEventListener('input', function () { inp.closest('.field').classList.remove('bad'); });
    });
  });

  /* product shelf arrows */
  document.querySelectorAll('[data-shelf]').forEach(function (wrap) {
    var shelf = wrap.querySelector('.shelf');
    var prev = wrap.querySelector('[data-prev]'), next = wrap.querySelector('[data-next]');
    if (!shelf || !prev) return;
    function step() { var c = shelf.querySelector('.prod'); return c ? c.getBoundingClientRect().width + 22 : 300; }
    function upd() {
      prev.disabled = shelf.scrollLeft < 4;
      next.disabled = shelf.scrollLeft + shelf.clientWidth >= shelf.scrollWidth - 4;
    }
    prev.addEventListener('click', function () { shelf.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { shelf.scrollBy({ left: step(), behavior: 'smooth' }); });
    shelf.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
  });

  /* press lightbox */
  var lb = document.querySelector('dialog.lb');
  if (lb && lb.showModal) {
    var lbImg = lb.querySelector('img');
    document.querySelectorAll('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () { lbImg.src = b.dataset.zoom; lbImg.alt = b.querySelector('img').alt; lb.showModal(); });
    });
    lb.querySelector('button').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }
})();
