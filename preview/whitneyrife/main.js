/* Whitney Rife concept — small, dependency-free */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* hero: one orchestrated entrance. The class is added by JS, so a page without JS stays visible. */
  var hero = $('.hero');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.classList.add('anim');
    var start = function () { requestAnimationFrame(function () { hero.classList.add('in'); }); };
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
    setTimeout(function () { hero.classList.add('in'); }, 1800); /* belt and braces: never leave cards hidden */
  }

  /* rail: arrows + mouse drag (touch scrolls natively) */
  var track = $('.rail-track');
  if (track) {
    var step = function () { var c = track.querySelector('.look'); return c ? c.getBoundingClientRect().width + 18 : 320; };
    $$('.rail-nav button').forEach(function (b) {
      b.addEventListener('click', function () { track.scrollBy({ left: (b.dataset.dir === 'prev' ? -1 : 1) * step() * 2, behavior: 'smooth' }); });
    });
    var down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 4 && !moved) { moved = true; track.classList.add('dragging'); }
      if (moved) track.scrollLeft = sl - dx;
    });
    var up = function () { if (!down) return; down = false; setTimeout(function () { track.classList.remove('dragging'); }, 0); };
    track.addEventListener('pointerup', up); track.addEventListener('pointercancel', up); track.addEventListener('pointerleave', up);
  }

  /* drawer */
  var drawer = $('.drawer'), menuBtn = $('.menu-btn'), scrim = $('.scrim');
  var openDrawer = function (on) {
    document.body.classList.toggle('drawer-open', on);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (drawer) drawer.setAttribute('aria-hidden', on ? 'false' : 'true');
    if (on && drawer) { var first = drawer.querySelector('button, a'); if (first) first.focus(); }
    else if (menuBtn && on === false) menuBtn.focus();
  };
  if (menuBtn) menuBtn.addEventListener('click', function () { openDrawer(!document.body.classList.contains('drawer-open')); });
  if (scrim) scrim.addEventListener('click', function () { openDrawer(false); });
  $$('.drawer-close').forEach(function (b) { b.addEventListener('click', function () { openDrawer(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) openDrawer(false); });

  /* header search */
  var sBtn = $('.search-btn'), sForm = $('.search');
  if (sBtn && sForm) {
    sBtn.addEventListener('click', function () {
      var open = sForm.classList.toggle('open');
      sBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) sForm.querySelector('input').focus();
    });
  }

  /* blog grid: show more */
  var foot = $('.grid-foot'), moreBtn = $('.show-more');
  var revealAll = function () { $$('.grid .card.extra').forEach(function (c) { c.classList.remove('extra'); }); if (foot) foot.classList.add('done'); };
  if (moreBtn) moreBtn.addEventListener('click', function () {
    $$('.grid .card.extra').slice(0, 8).forEach(function (c) { c.classList.remove('extra'); });
    if (!$('.grid .card.extra') && foot) foot.classList.add('done');
  });

  /* blog filter chips */
  var chips = $$('.chip'), cards = $$('.grid .card'), empty = $('.empty');
  chips.forEach(function (ch) {
    ch.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.toggle('on', c === ch); c.setAttribute('aria-pressed', c === ch ? 'true' : 'false'); });
      var f = ch.dataset.f, shown = 0;
      if (f !== 'all') revealAll();
      cards.forEach(function (card) {
        var ok = f === 'all' || (' ' + card.dataset.cats + ' ').indexOf(' ' + f + ' ') > -1;
        card.classList.toggle('hide', !ok); if (ok) shown++;
      });
      if (empty) empty.classList.toggle('show', shown === 0);
    });
  });

  /* copy a discount code */
  var toastEl = $('.toast'), toastT;
  var toast = function (msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  };
  var copyText = function (text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (res, rej) {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); res(); } catch (e) { rej(e); }
      document.body.removeChild(ta);
    });
  };
  $$('.ticket .copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var code = b.dataset.code, label = b.textContent;
      copyText(code).then(function () {
        b.textContent = 'Copied'; b.classList.add('done'); toast('Copied ' + code);
        setTimeout(function () { b.textContent = label; b.classList.remove('done'); }, 1600);
      }, function () { toast('Code: ' + code); });
    });
  });

  /* codes page search */
  var q = $('#code-q');
  if (q) {
    var tix = $$('.codes-pg .ticket'), count = $('.codes-count');
    var apply = function () {
      var v = q.value.trim().toLowerCase(), n = 0;
      tix.forEach(function (t) { var ok = !v || t.dataset.s.indexOf(v) > -1; t.classList.toggle('hide', !ok); if (ok) n++; });
      if (count) count.textContent = n === tix.length ? tix.length + ' codes' : n + ' of ' + tix.length + ' codes';
    };
    q.addEventListener('input', apply); apply();
  }

  /* newsletter: UI only in this concept */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = f.querySelector('input[type=email]');
      if (inp && !inp.checkValidity()) { inp.reportValidity(); return; }
      toast("You're on the list");
      if (inp) inp.value = '';
    });
  });

  /* article table of contents */
  var toc = $('.toc');
  if (toc && 'IntersectionObserver' in window) {
    var links = $$('.toc a'), heads = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    var setOn = function (id) { links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + id); }); };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) setOn(en.target.id); });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
    heads.forEach(function (h) { io.observe(h); });
    if (heads[0]) setOn(heads[0].id);
  }
})();
