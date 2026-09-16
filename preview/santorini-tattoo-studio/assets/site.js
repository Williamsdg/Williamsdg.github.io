/* Santorini Tattoo Studio — concept interactions. No dependencies. */
(function () {
  'use strict';
  var doc = document, body = doc.body;
  var BASE = body.getAttribute('data-base') || '';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header: compact on scroll ---------- */
  var hdr = doc.querySelector('.hdr');
  function onScroll() {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle('is-scrolled', y > 24);
    var bar = doc.querySelector('.mbar');
    if (bar) {
      var trigger = doc.querySelector('[data-mbar-after]');
      var after = trigger ? trigger.getBoundingClientRect().bottom < 0 : y > 420;
      bar.classList.toggle('is-on', after);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var menuBtn = doc.querySelector('.menu-btn'), drawer = doc.getElementById('drawer');
  function setMenu(open) {
    if (!menuBtn || !drawer) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.hidden = !open;
    body.classList.toggle('has-overlay', open);
    body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = drawer.querySelector('a'); if (f) f.focus(); }
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 980) setMenu(false); });
  }

  /* ---------- hide action bar while typing (on-screen keyboard) ---------- */
  doc.addEventListener('focusin', function (e) {
    if (e.target.matches('input:not([type=radio]):not([type=checkbox]):not([type=file]), textarea, select')) body.classList.add('kb-open');
  });
  doc.addEventListener('focusout', function () { body.classList.remove('kb-open'); });

  /* ---------- reveals + ink stroke ---------- */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;
  function observe(el) { if (io && !reduce) io.observe(el); else el.classList.add('is-in'); }
  doc.querySelectorAll('.rv, .stroke').forEach(observe);

  /* ---------- video: explicit play / pause ---------- */
  doc.querySelectorAll('.film').forEach(function (fig) {
    var v = fig.querySelector('video'), b = fig.querySelector('.film__btn');
    if (!v || !b) return;
    function sync() { var p = !v.paused; b.setAttribute('aria-pressed', String(p)); b.querySelector('span').textContent = p ? 'Pause film' : 'Play film'; b.querySelector('i').textContent = p ? '❚❚' : '▶'; }
    b.addEventListener('click', function () { if (v.paused) v.play(); else v.pause(); });
    v.addEventListener('play', sync); v.addEventListener('pause', sync); sync();
  });

  /* ---------- gallery + lightbox ---------- */
  var WORK = window.STT_WORK || [];
  var FILTERS = [
    { key: 'all', label: 'All work', test: function () { return true; } },
    { key: 'santorini', label: 'Santorini & Greece', test: function (w) { return has(w, 'island') || has(w, 'greek'); } },
    { key: 'botanical', label: 'Botanical', test: function (w) { return has(w, 'botanical'); } },
    { key: 'figurative', label: 'Figurative', test: function (w) { return has(w, 'figurative'); } },
    { key: 'minimal', label: 'Minimal', test: function (w) { return has(w, 'minimal'); } },
    { key: 'lettering', label: 'Lettering', test: function (w) { return has(w, 'lettering'); } },
    { key: 'couples', label: 'Couples', test: function (w) { return has(w, 'couples'); } }
  ];
  var TAGNAME = { island: 'Santorini', greek: 'Greek motif', botanical: 'Botanical', figurative: 'Figurative', minimal: 'Minimal', lettering: 'Lettering', couples: 'Matching / couples' };
  function has(w, t) { return w.tags.indexOf(t) > -1; }
  function byId(id) { for (var i = 0; i < WORK.length; i++) if (WORK[i].id === id) return WORK[i]; return null; }

  doc.querySelectorAll('[data-gallery]').forEach(function (root) {
    var limit = parseInt(root.getAttribute('data-limit') || '0', 10);
    var persist = root.hasAttribute('data-persist');
    var pick = (root.getAttribute('data-pick') || '').split(',').filter(Boolean);
    var grid = root.querySelector('.grid'), bar = root.querySelector('.filters'), countEl = root.querySelector('[data-count]');
    var current = 'all', visible = [];

    if (persist) {
      var h = location.hash.replace('#', '');
      if (FILTERS.some(function (f) { return f.key === h; })) current = h;
    }

    FILTERS.forEach(function (f) {
      var n = WORK.filter(f.test).length;
      if (!n) return;                         // never show an empty filter
      var b = doc.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.dataset.key = f.key;
      b.innerHTML = f.label + '<sup>' + n + '</sup>';
      b.setAttribute('aria-pressed', String(f.key === current));
      b.addEventListener('click', function () { setFilter(f.key, true); });
      bar.appendChild(b);
    });

    function list() {
      var f = FILTERS.filter(function (x) { return x.key === current; })[0];
      var items = WORK.filter(f.test);
      if (current === 'all' && pick.length) {
        items = pick.map(byId).filter(Boolean);
      }
      return limit ? items.slice(0, limit) : items;
    }

    var cols = 0;
    function colCount() { return window.innerWidth <= 760 ? 2 : 3; }
    function render() {
      visible = list();
      grid.innerHTML = '';
      cols = colCount();
      var stacks = [], heights = [];
      for (var c = 0; c < cols; c++) {
        var d = doc.createElement('div'); d.className = 'grid__col'; grid.appendChild(d);
        stacks.push(d); heights.push(0);
      }
      visible.forEach(function (w, i) {
        var b = doc.createElement('button');
        b.type = 'button'; b.className = 'tile';
        b.setAttribute('aria-label', 'View larger: ' + w.caption);
        b.innerHTML = '<img src="' + BASE + 'img/work/' + w.id + '-s.webp" width="' + w.w + '" height="' + w.h + '" alt="Tattoo: ' + esc(w.caption) + '" loading="' + (i < 3 ? 'eager' : 'lazy') + '" decoding="async"><span class="tile__cap" aria-hidden="true">' + esc(w.caption) + '</span>';
        b.addEventListener('click', function () { openLb(visible, i, b); });
        var k = heights.indexOf(Math.min.apply(null, heights));   // shortest column
        stacks[k].appendChild(b); heights[k] += w.h / w.w;
      });
      if (countEl) {
        var total = WORK.filter(FILTERS.filter(function (x) { return x.key === current; })[0].test).length;
        countEl.textContent = limit && total > visible.length ? ('Showing ' + visible.length + ' of ' + total) : (total + ' pieces');
      }
    }

    function setFilter(key, user) {
      if (key === current && user) return;
      current = key;
      bar.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.key === key)); });
      if (persist) history.replaceState(null, '', key === 'all' ? location.pathname + location.search : '#' + key);
      var all = root.querySelector('[data-all-link]');
      if (all) all.href = BASE + 'work/' + (key === 'all' ? '' : '#' + key);
      if (reduce) return render();
      grid.classList.add('is-fading');
      setTimeout(function () { render(); grid.classList.remove('is-fading'); }, 180);
    }
    render();
    window.addEventListener('resize', function () { if (colCount() !== cols) render(); });
  });

  var lb, lbImg, lbTitle, lbTags, lbCount, lbCta, lbSet = [], lbIdx = 0, lbReturn = null;
  function buildLb() {
    lb = doc.createElement('div');
    lb.className = 'lb'; lb.hidden = true;
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-labelledby', 'lbTitle');
    lb.innerHTML =
      '<div class="lb__stage">' +
        '<button class="lb__nav lb__prev" type="button" aria-label="Previous piece">&larr;</button>' +
        '<img alt="">' +
        '<button class="lb__nav lb__next" type="button" aria-label="Next piece">&rarr;</button>' +
      '</div>' +
      '<div class="lb__side">' +
        '<p class="lb__count" aria-live="polite"></p>' +
        '<h2 id="lbTitle"></h2>' +
        '<ul class="lb__tags"></ul>' +
        '<p>Every piece is drawn for the person wearing it. Share this as a reference and the studio will design something of your own.</p>' +
        '<a class="btn btn--solid" href="#">Request something in this style <span class="arr" aria-hidden="true">&rarr;</span></a>' +
      '</div>' +
      '<button class="lb__close" type="button" aria-label="Close">&times;</button>';
    body.appendChild(lb);
    lbImg = lb.querySelector('img'); lbTitle = lb.querySelector('h2'); lbTags = lb.querySelector('.lb__tags');
    lbCount = lb.querySelector('.lb__count'); lbCta = lb.querySelector('.btn');
    lb.querySelector('.lb__close').addEventListener('click', closeLb);
    lb.querySelector('.lb__prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb__next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb.querySelector('.lb__stage')) closeLb(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') {
        var f = [].slice.call(lb.querySelectorAll('button, a[href]'));
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var x0 = null;
    lbImg.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lbImg.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    });
  }
  function show() {
    var w = lbSet[lbIdx];
    lbImg.src = BASE + 'img/work/' + w.id + '-l.webp';
    lbImg.alt = 'Tattoo: ' + w.caption;
    lbTitle.textContent = w.caption;
    lbTags.innerHTML = w.tags.map(function (t) { return '<li>' + TAGNAME[t] + '</li>'; }).join('');
    lbCount.textContent = (lbIdx + 1) + ' / ' + lbSet.length;
    lbCta.href = BASE + 'book/?service=tattoo&ref=' + w.id;
    var n = lbSet[(lbIdx + 1) % lbSet.length]; (new Image()).src = BASE + 'img/work/' + n.id + '-l.webp';
  }
  function step(d) { lbIdx = (lbIdx + d + lbSet.length) % lbSet.length; show(); }
  function openLb(set, i, from) {
    if (!lb) buildLb();
    lbSet = set; lbIdx = i; lbReturn = from;
    show();
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    body.classList.add('has-overlay'); body.style.overflow = 'hidden';
    lb.querySelector('.lb__close').focus();
  }
  function closeLb() {
    lb.classList.remove('is-open'); lb.hidden = true;
    body.classList.remove('has-overlay'); body.style.overflow = '';
    if (lbReturn) lbReturn.focus();
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  window.STT = { byId: byId, esc: esc, BASE: BASE };
})();
