/* ==========================================================================
   Scarlet & Gold — product detail page (assets/pdp.js). Runs after sg.js.
   product.html?h=<handle>. Everything renders from SG_DATA: gallery, real
   variants (sold-out combos disabled), the shipping ticket with a ship-by
   date in business days (America/Chicago), accordions, "Match your mini" /
   "Wear it with" (SG.look) and the More Auburn rail. An unknown handle, or
   the catalogue not loaded yet, shows a photo-led not-found state instead.
   Render order matters: SG.pickPhoto hands each photo to the first slot.
   ========================================================================== */
(function () {
  'use strict';
  var SG = window.SG, D = SG.data, STORE = SG.store, CH = SG.chapter;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var E = SG.esc;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phoneMQ = window.matchMedia('(max-width: 1023px)');

  var APPAREL = ['crewneck', 'mockneck', 'quarter-zip', 'tee', 'long-sleeve', 'tank', 'skort', 'shorts', 'set', 'dress', 'cheer-dress', 'hat'];
  var TOPS = ['crewneck', 'mockneck', 'quarter-zip', 'tee', 'long-sleeve', 'tank'];
  var BOTTOMS = ['skort', 'shorts'];
  var TYPE = { crewneck: 'Top', mockneck: 'Top', 'quarter-zip': 'Top', tee: 'Top', 'long-sleeve': 'Top', tank: 'Top', skort: 'Bottom', shorts: 'Bottom',
    set: 'Set', dress: 'Dress', 'cheer-dress': 'Cheer dress', hat: 'Hat', scarf: 'Scarf', bow: 'The finishing touch', accessory: 'The finishing touch' };
  var SIGS = SG.nav.signatures.map(function (s) { return [s[0], s[2]]; })
    .concat(SG.nav.signaturesMore.map(function (s) { return [s[0], s[1]]; }));

  var IC = {
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke-linecap="round"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 6.5h11.5v9.5H2.5zM14 9.5h3.7l3.8 3.6V16H14" stroke-linejoin="round"/><circle cx="6.5" cy="17.5" r="1.9"/><circle cx="17.5" cy="17.5" r="1.9"/></svg>',
    ret: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4.5 9.5h10a5 5 0 0 1 0 10H9" stroke-linecap="round"/><path d="m8.5 5.5-4 4 4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4.5 11v9h15v-9M3 7.5h18V11H3zM12 7.5V20" stroke-linejoin="round"/><path d="M12 7.5C10.5 4 7 3.8 7 5.8c0 1.4 2.6 1.7 5 1.7 2.4 0 5-.3 5-1.7 0-2-3.5-1.8-5 1.7" stroke-linejoin="round"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5zM3.5 7.5 12 12l8.5-4.5M12 12v9" stroke-linejoin="round"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3 19 6v5c0 4.6-3 8-7 10-4-2-7-5.4-7-10V6z" stroke-linejoin="round"/><path d="m9 12 2.2 2.2L15.5 10" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------- dates: business days from today, America/Chicago ---------- */
  function chicagoToday() {
    var o = {};
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    return new Date(Date.UTC(+o.year, +o.month - 1, +o.day));
  }
  /* US holidays UPS Ground doesn't move on (Thanksgiving, Christmas, New Year's Day): skipped like weekends, so the
     estimate never promises a day early. (Whether the shop also closes the Friday after Thanksgiving is the client's call.) */
  function isHoliday(x) {
    var m = x.getUTCMonth(), d = x.getUTCDate(), wd = x.getUTCDay();
    if (m === 0 && d === 1) return true;                              // New Year's Day
    if (m === 11 && d === 25) return true;                            // Christmas Day
    if (m === 10 && wd === 4 && d >= 22 && d <= 28) return true;      // Thanksgiving: 4th Thursday of November
    return false;
  }
  function addBusinessDays(d, n) {
    var x = new Date(d.getTime());
    while (n > 0) {
      x.setUTCDate(x.getUTCDate() + 1);
      if (x.getUTCDay() !== 0 && x.getUTCDay() !== 6 && !isHoliday(x)) n--;
    }
    return x;
  }
  function fmtDay(d) {   // "Tuesday, Dec 1"
    return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'long', month: 'short', day: 'numeric' }).format(d);
  }
  var TODAY = chicagoToday();
  var HOLIDAY = TODAY.getUTCMonth() >= 10;   // purchases Nov 1 – Dec 31 are returnable through Jan 30

  var clamp = function (n, lo, hi) { return Math.max(lo, Math.min(hi, n)); };
  function setMeta(title, desc) {
    document.title = title;
    var m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', desc);
  }

  /* ======================================================================
     Route
     ====================================================================== */
  var gal = { idx: 0, n: 0, track: null };   // gallery state
  var bar = null, barOn = false;              // phone sticky bar
  var handle = SG.qs('h');
  var p = handle ? SG.product(handle) : null;
  if (!p) { notFound(); return; }

  var school = p.sch ? SG.school(p.sch) : null;
  var isAuburn = p.sch === 'auburn';
  var sizes = (p.sz || []).filter(Boolean);
  var colors = (p.co || []).filter(Boolean);
  var V = p.v || [];
  var sizeDim = sizes.length > 0 && V.some(function (v) { return sizes.indexOf(v[0]) > -1; });
  var colorDim = colors.length > 0 && V.some(function (v) { return colors.indexOf(v[1]) > -1; });
  var needsSize = sizes.length > 1 || (sizes.length === 1 && !/^(os|one size|o\/s)$/i.test(sizes[0]));
  var state = { color: null, size: null, qty: 1 };

  function variants(size, color) {
    return V.filter(function (v) {
      return (!sizeDim || size == null || v[0] === size) && (!colorDim || color == null || v[1] === color);
    });
  }
  function avail(size, color) { return V.length ? variants(size, color).some(function (v) { return v[2]; }) : !!p.av; }
  function priceRange(size, color) {
    var vs = variants(size, color).filter(function (v) { return v[3] != null; });
    var live = vs.filter(function (v) { return v[2]; });
    var list = (live.length ? live : vs).map(function (v) { return Number(v[3]); });
    if (!list.length) return { lo: p.p, hi: p.p };
    return { lo: Math.min.apply(null, list), hi: Math.max.apply(null, list) };
  }

  /* initial selection: ?color= / ?size= when valid, else the first colour with stock */
  var qColor = SG.qs('color'), qSize = SG.qs('size');
  if (colors.length) {
    state.color = (qColor && colors.indexOf(qColor) > -1) ? qColor
      : (colors.filter(function (c) { return avail(null, c); })[0] || colors[0]);
  }
  if (sizes.length === 1) state.size = sizes[0];
  else if (qSize && sizes.indexOf(qSize) > -1 && avail(qSize, state.color)) state.size = qSize;

  var view = $('[data-pdp="view"]');
  view.hidden = false;
  document.body.classList.add('pdp-on');

  var FINAL = !!p.fs;   // final sale (prep.py: their description says no returns / exchanges): no returns promise anywhere
  if (FINAL) {   // the store-wide ticker lines about returns don't apply to this piece
    $$('.tick__item').forEach(function (t) { if (/return/i.test(t.textContent)) t.remove(); });
  }
  var shipKind = SG.shipKind(p);   // 'in' | 'mto' | 'vendor' | 'check' (only in/mto claim a timeline)
  var shipLong = SG.shipLabel(p, true);
  setMeta(p.t + ' · Scarlet & Gold',
    'Shop ' + p.t + ' at Scarlet & Gold in Auburn, Alabama. ' + shipLong + '. Free shipping on all orders $100+.');

  renderCrumbs();
  renderGallery();
  renderTop();
  renderOptions();
  renderShip();
  renderLicensed();
  renderAccordions();
  wireBuy();
  var pairRows = renderPair();
  renderMore(pairRows);
  wireBar();

  /* ======================================================================
     Breadcrumbs
     ====================================================================== */
  function primaryCol() {
    var cols = p.cols || [];
    var auNav = SG.nav.auburn.filter(function (r) { return cols.indexOf(r[1]) > -1; })[0];
    if (auNav) return { label: auNav[0], c: auNav[1] };
    var sig = SIGS.filter(function (s) { return cols.indexOf(s[1]) > -1; })[0];
    if (sig) return { label: sig[0], c: sig[1] };
    var any = cols.filter(function (c) { return D.cols[c] && ['auburn', 'apparel-best-sellers', 'closeout-sale'].indexOf(c) < 0; })[0];
    return any ? { label: D.cols[any].t, c: any } : null;
  }
  function renderCrumbs() {
    var col = primaryCol();
    var items = ['<li><a href="index.html">Home</a></li>'];
    if (isAuburn) items.push('<li><a href="auburn.html">Auburn</a></li>');
    else if (school) items.push('<li><a href="' + SG.shopUrl({ school: school.slug }) + '">' + E(school.name) + '</a></li>');
    if (col) items.push('<li><a href="' + SG.shopUrl({ c: col.c }) + '">' + E(col.label) + '</a></li>');
    items.push('<li class="pdp-crumbs__cur" aria-current="page"><span>' + E(p.t) + '</span></li>');
    $('[data-pdp="crumbs"]').innerHTML = items.join('');
  }

  /* ======================================================================
     Gallery: one snap track; thumbs (desktop) and dots (phone) drive it
     ====================================================================== */
  function renderGallery() {
    var el = $('[data-pdp="gallery"]');
    var imgs = (p.img || []).filter(Boolean);
    var ratio = clamp(p.ir || 0.8, 0.667, 1);
    el.style.setProperty('--ratio', String(Math.round(ratio * 1000) / 1000));
    gal.n = imgs.length;
    if (!imgs.length) {
      el.classList.add('pdp-gal--empty');
      el.innerHTML = '<div class="pdp-stage"><div class="pdp-stage__none"><span class="pdp-stage__amp" aria-hidden="true">&amp;</span>' +
        '<span class="patch patch--cream">Scarlet &amp; Gold</span></div></div>';
      return;
    }
    var h1200 = Math.round(1200 / (p.ir || 0.8));
    var slides = imgs.map(function (path, i) {
      var alt = i === 0 ? p.t : p.t + ', view ' + (i + 1) + ' of ' + imgs.length;
      var set = E(SG.img(path, 900)) + ' 900w, ' + E(SG.img(path, 1200)) + ' 1200w, ' + E(SG.img(path, 1600)) + ' 1600w';
      return '<figure class="pdp-slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + imgs.length + '">' +
        '<img ' + (i === 0 ? 'src="' + E(SG.img(path, 1200)) + '" srcset="' + set + '"' : 'data-src="' + E(SG.img(path, 1200)) + '" data-srcset="' + set + '"') + ' ' +
        'sizes="(max-width: 1023px) 100vw, 46vw" alt="' + E(alt) + '" width="1200" height="' + h1200 + '"' +
        (i === 0 ? ' fetchpriority="high"' : '') + ' decoding="async"></figure>';
    }).join('');
    var multi = imgs.length > 1;
    var thumbs = multi ? '<div class="pdp-thumbs" role="group" aria-label="Product images">' + imgs.map(function (path, i) {
      return '<button type="button" class="pdp-thumb" data-go="' + i + '" aria-label="Show image ' + (i + 1) + ' of ' + imgs.length + '" aria-current="' + (i === 0) + '">' +
        '<img src="' + E(SG.img(path, 400)) + '" alt="" width="400" height="' + Math.round(400 / ratio) + '" loading="lazy" decoding="async"></button>';
    }).join('') + '</div>' : '';
    var dots = multi ? '<div class="pdp-dots" role="group" aria-label="Product images">' + imgs.map(function (_, i) {
      return '<button type="button" class="pdp-dot" data-go="' + i + '" aria-label="Show image ' + (i + 1) + ' of ' + imgs.length + '" aria-current="' + (i === 0) + '"><i></i></button>';
    }).join('') + '</div>' : '';
    el.innerHTML = thumbs +
      '<div class="pdp-gal__main">' +
        '<div class="pdp-stage">' +
          '<div class="pdp-track" tabindex="0" role="region" aria-roledescription="carousel" aria-label="' + E(p.t) + ' images' + (multi ? ', use the arrow keys to browse' : '') + '">' + slides + '</div>' +
          (multi ? '<button type="button" class="pdp-arrow pdp-arrow--prev" data-step="-1" aria-label="Previous image">' + SG.icons.left + '</button>' +
            '<button type="button" class="pdp-arrow pdp-arrow--next" data-step="1" aria-label="Next image">' + SG.icons.right + '</button>' +
            '<span class="pdp-count" aria-hidden="true"><b>1</b> / ' + imgs.length + '</span>' : '') +
        '</div>' + dots +
      '</div>';
    if (!multi) el.classList.add('pdp-gal--single');

    var track = $('.pdp-track', el), stage = $('.pdp-stage', el);
    gal.track = track;
    /* slides 2+ carry data-src: they load once slide 0 has (when the browser is idle), or right away on a swipe or tap,
       so they never compete with the first photo */
    var slideImgs = $$('.pdp-slide img', track);
    function wakeAt(i) {   // load slide i (if it is still waiting)
      var im = slideImgs[i];
      if (!im || !im.hasAttribute('data-src')) return;
      im.srcset = im.getAttribute('data-srcset'); im.src = im.getAttribute('data-src');
      im.removeAttribute('data-srcset'); im.removeAttribute('data-src');
    }
    function wake() { wakeAt(gal.idx - 1); wakeAt(gal.idx + 1); }   // the neighbours of the slide on screen
    gal.wake = wake;
    var first = slideImgs[0];
    var later = function () { (window.requestIdleCallback || function (fn) { return window.setTimeout(fn, 200); })(function () { wakeAt(1); }, { timeout: 2500 }); };
    if (first && first.complete) later(); else if (first) { first.addEventListener('load', later, { once: true }); first.addEventListener('error', later, { once: true }); }
    ['pointerdown', 'touchstart', 'focusin'].forEach(function (ev) { el.addEventListener(ev, function () { wakeAt(1); }, { once: true, passive: true }); });

    /* cover only when the photo's shape already matches the frame (≤ 6% trim, top-biased); otherwise contain on the frame colour */
    function fit(img, box, tol) {
      if (!img.naturalWidth || !box.clientHeight) return;
      var a = img.naturalWidth / img.naturalHeight, b = box.clientWidth / box.clientHeight;
      img.classList.toggle('is-cover', Math.abs(a - b) / b <= tol);
    }
    function fitAll() {
      $$('.pdp-slide img', el).forEach(function (img) { fit(img, stage, 0.06); });
      $$('.pdp-thumb img', el).forEach(function (img) { fit(img, img.parentNode, 0.22); });
    }
    $$('img', el).forEach(function (img) {
      if (img.complete) fit(img, img.closest('.pdp-thumb') || stage, img.closest('.pdp-thumb') ? 0.22 : 0.06);
      img.addEventListener('load', function () { fit(img, img.closest('.pdp-thumb') || stage, img.closest('.pdp-thumb') ? 0.22 : 0.06); });
    });
    // re-fit whenever the stage changes size (also catches styles settling after this script ran)
    var onStage = function () { fitAll(); track.scrollLeft = gal.idx * track.clientWidth; };
    if ('ResizeObserver' in window) new ResizeObserver(onStage).observe(stage);
    else window.addEventListener('resize', onStage);
    window.addEventListener('load', fitAll);
    if (!multi) return;

    function mark() {
      if (gal.live) { wakeAt(gal.idx); wake(); }   // not on the first paint: slide 2 waits for slide 1
      $$('[data-go]', el).forEach(function (b) { b.setAttribute('aria-current', String(+b.getAttribute('data-go') === gal.idx)); });
      $('.pdp-count b', el).textContent = String(gal.idx + 1);
      $('.pdp-arrow--prev', el).disabled = gal.idx === 0;
      $('.pdp-arrow--next', el).disabled = gal.idx === gal.n - 1;
    }
    function go(i) {
      gal.idx = clamp(i, 0, gal.n - 1);
      track.scrollTo({ left: gal.idx * track.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
      mark();
    }
    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        var i = clamp(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)), 0, gal.n - 1);
        if (i !== gal.idx) { gal.idx = i; mark(); }
      });
    }, { passive: true });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-go]');
      if (b) { go(+b.getAttribute('data-go')); return; }
      var s = e.target.closest('[data-step]');
      if (s) go(gal.idx + +s.getAttribute('data-step'));
    });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(gal.idx + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(gal.idx - 1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(gal.n - 1); }
    });
    mark();
    gal.live = true;
  }

  /* ======================================================================
     School chip, title, price
     ====================================================================== */
  function titleHTML(t) {
    var k = t.lastIndexOf(' | ');
    if (k > 2 && k < t.length - 3) return E(t.slice(0, k)) + ' <span class="pdp-title__sub"><span class="sr">| </span>' + E(t.slice(k + 3)) + '</span>';
    var i = t.lastIndexOf(' - ');
    if (i < 8 || i > t.length - 4) return E(t);
    return E(t.slice(0, i)) + ' <span class="pdp-title__sub"><span class="sr">- </span>' + E(t.slice(i + 3)) + '</span>';
  }
  function renderTop() {
    var tags = [];
    if (school) {
      tags.push(isAuburn
        ? '<span class="patch patch--navy pdp-school"><span class="patch__dot" aria-hidden="true"></span>' + E(school.name) + '</span>'
        : '<span class="patch patch--cream pdp-school">' + E(school.name) + '</span>');
    }
    var sale = p.cp && p.cp > p.p;
    if (sale) tags.push('<span class="pdp-tag pdp-tag--sale">Sale</span>');
    else if (p['new']) tags.push('<span class="pdp-tag">New</span>');
    var tagEl = $('[data-pdp="tags"]');
    tagEl.innerHTML = tags.join('');
    tagEl.hidden = !tags.length;
    $('[data-pdp="title"]').innerHTML = titleHTML(p.t);
    renderPrice();
  }
  function current() {
    var r = priceRange(state.size, state.color);
    var exact = r.lo === r.hi || (!!state.size || !needsSize);
    return { lo: r.lo, hi: r.hi, exact: exact };
  }
  function renderPrice() {
    var c = current();
    var sale = p.cp && p.cp > c.lo;
    $('[data-pdp="price"]').innerHTML =
      (!c.exact ? '<span class="pdp-price__from">From</span>' : '') +
      '<span class="pdp-price__now' + (sale ? ' is-sale' : '') + '">' + SG.money(c.lo) + '</span>' +
      (sale ? '<s aria-hidden="true">' + SG.money(p.cp) + '</s><span class="sr">, was ' + SG.money(p.cp) + '</span>' : '');
    $('[data-pdp="atc-price"]').textContent = c.exact && p.av ? SG.money(c.lo * state.qty) : '';
    syncBar();
  }

  /* ======================================================================
     Colour swatches + size pills, wired to real variants
     ====================================================================== */
  /* size families (toddler / youth / adult): a piece spanning several, like The Brooke ($92 / $98 / $118), shows each
     family on its own labelled row with that family's price */
  function famOf(s) { var f = SG.sizeFam(s); return f === 'baby' ? 'baby' : f || 'other'; }
  function isMultiFam() {   // (a function: renderOptions runs before this part of the file is reached)
    var fams = sizes.map(famOf).filter(function (f, i, a) { return a.indexOf(f) === i; });
    return fams.length > 1 && fams.indexOf('other') < 0;
  }
  function famLabel(f) {
    var name = f === 'baby' ? 'Baby & toddler' : f === 'kids' ? 'Youth' : (p.who === 'men' ? 'Men' : p.who === 'women' ? 'Women' : 'Adult');
    var v = V.filter(function (x) { return x[0] && famOf(x[0]) === f && x[3] != null; });
    var live = v.filter(function (x) { return x[2]; });
    var list = (live.length ? live : v).map(function (x) { return Number(x[3]); });
    if (!list.length) return name;
    var lo = Math.min.apply(null, list), hi = Math.max.apply(null, list);
    return name + ' · ' + (hi > lo ? 'from ' : '') + SG.money(lo);
  }
  function renderOptions() {
    var colEl = $('[data-pdp="colors"]'), sizeEl = $('[data-pdp="sizes"]');
    if (colors.length) {
      colEl.hidden = false;
      colEl.innerHTML = '<div class="pdp-opt__head"><span class="pdp-opt__label" id="pdp-col-l">' + E(p.ol || 'Color') + '</span><span class="pdp-opt__val" data-pdp="col-val"></span></div>' +
        '<div class="pdp-swatches" role="radiogroup" aria-labelledby="pdp-col-l">' + colors.map(function (c, i) {
          var out = !avail(null, c);
          return '<label class="pdp-sw' + (out ? ' is-out' : '') + '" style="--c:' + SG.colorBg(c) + '" title="' + E(c) + (out ? ' (sold out)' : '') + '">' +
            '<input type="radio" name="pdp-color" value="' + E(c) + '" id="pdp-c' + i + '"' + (out ? ' disabled' : '') + (c === state.color ? ' checked' : '') + '>' +
            '<span class="pdp-sw__dot" aria-hidden="true"></span><span class="sr">' + E(c) + (out ? ', sold out' : '') + '</span></label>';
        }).join('') + '</div>';
    }
    if (needsSize) {
      sizeEl.hidden = false;
      var multi = isMultiFam();
      sizeEl.innerHTML = '<div class="pdp-opt__head"><span class="pdp-opt__label" id="pdp-size-l">Size</span><span class="pdp-opt__val" data-pdp="size-val"></span>' +
        '<a class="pdp-guide" href="' + STORE.sizeGuides + '" target="_blank" rel="noopener">Size guide' + SG.icons.ext + '<span class="sr"> (opens in a new tab)</span></a></div>' +
        '<div class="pdp-sizes" role="radiogroup" aria-labelledby="pdp-size-l" aria-describedby="pdp-err">' + sizes.map(function (s, i) {
          var fam = famOf(s), prev = i ? famOf(sizes[i - 1]) : null;
          var head = multi && fam !== prev ? '<span class="pdp-sizes__fam" aria-hidden="true">' + E(famLabel(fam)) + '</span>' : '';
          return head + '<label class="pdp-sz"><input type="radio" name="pdp-size" value="' + E(s) + '" id="pdp-s' + i + '"><span class="pdp-sz__t">' + E(s) + '</span><span class="sr pdp-sz__sr"></span></label>';
        }).join('') + '</div>';
    } else if (sizes.length === 1) {
      var one = $('[data-pdp="onesize"]');
      one.hidden = false;
      one.innerHTML = '<span class="pdp-opt__label">Size</span><span class="pdp-opt__val">' + E(/^(os|o\/s)$/i.test(sizes[0]) ? 'One size' : sizes[0]) + '</span>';
    }
    syncOptions();
  }

  function syncOptions() {
    var cv = $('[data-pdp="col-val"]');
    if (cv) cv.textContent = state.color || '';
    if (needsSize) {
      $$('.pdp-sz').forEach(function (lab) {
        var inp = $('input', lab), s = inp.value, ok = avail(s, state.color);
        inp.disabled = !ok;
        inp.checked = s === state.size;
        lab.classList.toggle('is-out', !ok);
        $('.pdp-sz__sr', lab).textContent = ok ? '' : ', sold out' + (colorDim && state.color ? ' in ' + state.color : '');
      });
      $('[data-pdp="size-val"]').textContent = state.size || 'Choose a size';
      $('[data-pdp="size-val"]').classList.toggle('is-empty', !state.size);
    }
    renderPrice();
    var atc = $('[data-pdp="atc"]');
    atc.disabled = !p.av;
    $('[data-pdp="atc-label"]').textContent = p.av ? 'Add to bag' : 'Sold out';
    $('[data-pdp="soldout"]').hidden = !!p.av;
    $('.pdp-qtyrow').hidden = !p.av;
  }

  function setErr(msg) {
    var err = $('[data-pdp="err"]');
    err.textContent = msg || '';
    var box = $('.pdp-sizes');
    if (box) box.classList.toggle('is-missing', !!msg);
  }

  /* ======================================================================
     Buy box: options, quantity, add to bag, heart
     ====================================================================== */
  function wireBuy() {
    var form = $('[data-pdp="buy"]'), qty = $('[data-pdp="qty"]'), heart = $('[data-pdp="heart"]');
    form.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'pdp-color') {
        state.color = t.value;
        var note = '';
        if (state.size && needsSize && !avail(state.size, state.color)) {
          note = state.size + ' is sold out in ' + state.color + '. Choose another size.';
          state.size = null;
        }
        syncOptions();
        setErr(note);
        syncLook();
      } else if (t.name === 'pdp-size') {
        state.size = t.value;
        setErr('');
        syncOptions();
        syncLook();
      } else if (t === qty) {
        setQty(qty.value);
      }
    });
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-qty]');
      if (b) setQty(state.qty + +b.getAttribute('data-qty'));
    });
    function setQty(n) {
      state.qty = clamp(parseInt(n, 10) || 1, 1, 10);
      qty.value = state.qty;
      $$('[data-qty]').forEach(function (b) { b.disabled = (+b.getAttribute('data-qty') < 0 && state.qty <= 1) || (+b.getAttribute('data-qty') > 0 && state.qty >= 10); });
      renderPrice();
    }
    setQty(1);
    form.addEventListener('submit', function (e) { e.preventDefault(); addNow(); });

    heart.innerHTML = SG.icons.heart;
    function syncHeart() {
      var on = SG.saved.has(p.h);
      heart.setAttribute('aria-pressed', String(on));
      heart.setAttribute('aria-label', (on ? 'Saved: ' : 'Save ') + p.t);
    }
    heart.addEventListener('click', function () {
      var on = SG.saved.toggle(p.h);
      syncHeart();
      SG.toast(on ? 'Saved for later.' : 'Removed from saved.');
    });
    syncHeart();
  }

  function addNow() {
    if (!p.av) return false;
    if (needsSize && !state.size) {
      setErr('Choose a size to add this to your bag.');
      var first = $('.pdp-sizes input:not(:disabled)');
      if (first) first.focus({ preventScroll: true });
      return false;
    }
    if (!avail(state.size, state.color)) { setErr('That combination is sold out. Choose another size or color.'); return false; }
    setErr('');
    SG.addToBag({ h: p.h, size: state.size || '', color: state.color || '', qty: state.qty }, { open: true });
    return true;
  }

  /* ======================================================================
     Shipping truth: ticket stub
     ====================================================================== */
  function renderShip() {
    // A sold-out piece makes no shipping promise: no "In stock" patch, no ship time, no ship-by date (shipLong is
    // already "Sold out for now" via SG.shipLabel). The store-wide policies below stay true either way.
    var out = SG.isSoldOut(p);
    var inStock = !out && shipKind === 'in', timed = !out && (shipKind === 'in' || shipKind === 'mto');
    var eta = timed ? addBusinessDays(TODAY, inStock ? 7 : 14) : null;
    var pickup = APPAREL.indexOf(p.cat) > -1 || (p.cat === 'other' && /\b(onesies?|bodysuit|polo|pants|joggers?)\b/i.test(p.t));   // onesies, polos, pants are apparel too
    var patch = out ? 'Sold out' : inStock ? 'In stock' : shipKind === 'mto' ? 'Made for you' : shipKind === 'vendor' ? 'From our maker' : '';   // no ship time known: no patch
    var rows = [];
    if (pickup) rows.push([SG.icons.pin, '<strong>Local pickup</strong> for apparel &amp; hats at our Auburn shop']);
    else rows.push([IC.box, 'Accessories and other items <strong>may ship separately</strong> from our manufacturer']);
    rows.push([IC.truck, '<strong>Free shipping</strong> on all orders $100+']);
    if (FINAL) rows.push([IC.ret, '<strong>Final sale.</strong> No returns or exchanges on this piece']);   // its own description says so
    else {
      rows.push([IC.ret, '<strong>Free returns &amp; exchanges</strong> with Checkout+']);
      if (HOLIDAY) rows.push([IC.gift, '<strong>Holiday purchases</strong> (Nov 1–Dec 31) are returnable through Jan 30']);
    }
    $('[data-pdp="ship"]').innerHTML =
      '<div class="pdp-tix__main">' +
        '<div class="pdp-tix__head"><p class="ticket__label">Shipping</p>' +
          (patch ? '<span class="patch' + (inStock ? ' patch--navy' : '') + ' pdp-tix__patch">' + patch + '</span>' : '') + '</div>' +
        '<p class="pdp-tix__line">' + E(out ? 'Sold out for now, so there’s no ship date yet' : shipLong) +
          '</p>' + (!out && shipKind === 'check' ? '<p class="pdp-tix__how"><a class="tlink" href="visit.html#shipping">See how shipping works</a></p>' : '') +
        (eta ? '<p class="pdp-tix__eta">' + IC.cal + '<span>Estimated to ship by <strong>' + E(fmtDay(eta)) + '</strong></span></p>' : '') +
      '</div>' +
      '<span class="ticket__perf" aria-hidden="true"></span>' +
      '<ul class="pdp-tix__list">' + rows.map(function (r) { return '<li>' + r[0] + '<span>' + r[1] + '</span></li>'; }).join('') + '</ul>';
  }

  function renderLicensed() {
    if (!school) return;
    var el = $('[data-pdp="licensed"]');
    el.hidden = false;
    el.innerHTML = IC.shield + '<span><strong>Officially licensed.</strong> A portion of every purchase goes back to ' + E(school.name) + ' to support student scholarships.</span>';
  }

  /* ======================================================================
     Accordions: Description · Size & fit · Shipping & returns
     ====================================================================== */
  function descHTML(lines) {
    var out = '', list = [];
    var flush = function () { if (list.length) { out += '<ul>' + list.join('') + '</ul>'; list = []; } };
    lines.forEach(function (ln) {
      var t = String(ln || '').trim();
      if (!t) return;
      var m = t.match(/^[•\-*–·]\s*(.+)$/);
      if (m) list.push('<li>' + E(m[1]) + '</li>');
      else { flush(); out += '<p>' + E(t) + '</p>'; }
    });
    flush();
    return out;
  }
  function sizeRange() {
    if (!sizes.length) return '';
    return sizes.length > 2 ? sizes[0] + '–' + sizes[sizes.length - 1] : sizes.join(' and ');
  }
  function renderAccordions() {
    var items = [];
    // descriptions ship in data-desc.js (window.SG_DESC, product page only); p.d is the older inline form
    var d = ((window.SG_DESC || {})[p.h] || p.d || []).filter(function (x) { return String(x || '').trim(); });
    if (d.length) items.push(['desc', 'Description', descHTML(d)]);

    var fit = '';
    if (needsSize) fit += '<p>This piece comes in <strong>' + E(sizeRange()) + '</strong>.' + (sizes.some(function (s) { return !avail(s, null); }) ? ' Sold-out sizes are crossed out above.' : '') + '</p>';
    if (p.cat === 'cheer-dress') fit += '<p>Our cheer dresses come in sizes 12M–10, in a soft, stretchy, non-itchy fabric she can jump and cheer in all game long.</p>';
    fit += '<p>Need a little extra guidance on fit? Check out our size guides.</p>' +
      (FINAL ? '<p>This piece is <strong>final sale</strong>, so it can’t be returned or exchanged. Check the size guide before you order.</p>'
        : '<p>Not quite right? Returns for store credit or exchange are free with Checkout+. Live nearby? <a href="visit.html">Come try it on</a> at our shop on Shug Jordan Parkway.</p>') +
      '<p><a class="tlink" href="' + STORE.sizeGuides + '" target="_blank" rel="noopener">Open our size guides' + SG.icons.ext + '<span class="sr"> (opens in a new tab)</span></a></p>';
    items.push(['fit', 'Size & fit', fit]);

    var inStock = shipKind === 'in', mto = shipKind === 'mto', vendor = shipKind === 'vendor';
    var ship = '<ul class="pdp-policy">' +
      '<li' + (inStock ? ' class="is-this"' : '') + '><strong>In stock</strong> items are ready to ship in 5–7 business days.' + (inStock ? ' <span class="pdp-this">This piece</span>' : '') + '</li>' +
      '<li' + (mto ? ' class="is-this"' : '') + '><strong>Made to order</strong> pieces (tees, fleece and client collections) are printed or embroidered in our Auburn shop in 10–14 business days.' + (mto ? ' <span class="pdp-this">This piece</span>' : '') + '</li>' +
      '<li' + (vendor ? ' class="is-this"' : '') + '><strong>Accessories</strong> ship directly from our manufacturer, so they may arrive separately from apparel and hats.' + (vendor ? ' <span class="pdp-this">This piece</span>' : '') + '</li>' +
      '<li>Every order ships UPS Ground, and shipping is free on all orders $100+.</li>' +
      // a final-sale piece (its description: "we cannot offer returns or exchanges") gets no returns promise at all
      (FINAL ? '<li class="is-this"><strong>Final sale:</strong> this piece can’t be returned or exchanged. <span class="pdp-this">This piece</span></li>'
        : '<li>Returns for store credit or exchange can be requested within 14 days of delivery.</li>' +
          '<li>Holiday purchases made November 1 through December 31 can be returned through January 30.</li>' +
          '<li>Choose Hassle Free Returns with Checkout+ for free returns and exchanges, plus package protection.</li>' +
          '<li>Live nearby? Bring your item and order number to our Auburn store to return or exchange it in person.</li>') +
      '</ul><p class="pdp-acc__links"><a class="tlink" href="visit.html#returns">Shipping &amp; returns FAQ</a>' +
      (FINAL ? '' : '<a class="tlink" href="' + STORE.returns + '" target="_blank" rel="noopener">Start a return' + SG.icons.ext + '<span class="sr"> (opens in a new tab)</span></a>') + '</p>';
    items.push(['ship', 'Shipping & returns', ship]);

    var acc = $('[data-pdp="acc"]');
    acc.innerHTML = items.map(function (it, i) {
      var open = i === 0 && it[0] === 'desc';
      return '<div class="pdp-acc__item">' +
        '<h2 class="pdp-acc__h"><button type="button" class="pdp-acc__b" id="pdp-a-' + it[0] + '-b" aria-expanded="' + open + '" aria-controls="pdp-a-' + it[0] + '">' +
          E(it[1]) + '<span class="pdp-acc__ic" aria-hidden="true"></span></button></h2>' +
        '<div class="pdp-acc__p" id="pdp-a-' + it[0] + '" role="region" aria-labelledby="pdp-a-' + it[0] + '-b"' + (open ? '' : ' hidden') + '>' + it[2] + '</div></div>';
    }).join('');
    acc.addEventListener('click', function (e) {
      var b = e.target.closest('.pdp-acc__b');
      if (!b) return;
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      document.getElementById(b.getAttribute('aria-controls')).hidden = !open;
    });
  }

  /* ======================================================================
     Match your mini / Wear it with
     ====================================================================== */
  /* signature line: its collection when loaded, else the line their own title names ("The Alli Tennis Skort …") */
  function sigOf(x) {
    var c = x.cols || [];
    var s = SIGS.filter(function (s) { return c.indexOf(s[1]) > -1; })[0];
    if (s) return s;
    var m = /^the\s+([a-z]+)\b/i.exec(x.t || '');
    if (!m) return null;
    var nm = 'the ' + m[1].toLowerCase();
    return SIGS.filter(function (s) { return s[0].toLowerCase() === nm; })[0] || null;
  }
  /* college / program client-store pieces (webstore tag or a program tag) are never suggested as a pairing */
  function isProgram(x) { return SG.isProgramPiece(x); }   // (sg.js: webstore tag, a program collection or their program tags)
  function sameSchool(x) { return x.h !== p.h && x.av && !isProgram(x) && (p.sch ? x.sch === p.sch : x.sch === 'auburn'); }
  /* first match, preferring one that shares a colour with `ref` (a navy cheer dress → a navy top) */
  function base(c) { return String(c).toLowerCase().split(/[\s/]+/)[0]; }
  /* rotate: choose among the matches by this page's handle, so neighbouring pages don't all get the identical look */
  function spin(list) {
    if (list.length < 2) return list[0] || null;
    var h = 0; for (var i = 0; i < p.h.length; i++) h = (h * 31 + p.h.charCodeAt(i)) >>> 0;
    return list[h % list.length];
  }
  function pick(list, test, ref, rotate) {
    var hits = list.filter(test);
    if (ref && hits.length > 1) {
      var rc = (ref.co || []).map(base);
      var same = hits.filter(function (x) { return (x.co || []).some(function (c) { return rc.indexOf(base(c)) > -1; }); });
      if (same.length) return rotate ? spin(same) : same[0];
    }
    return rotate ? spin(hits) : (hits[0] || null);
  }
  function pool() { return SG.auburnFirst(SG.products({})).filter(sameSchool); }

  function buildPair() {
    var all = pool(), mySig = sigOf(p);
    var sameSig = function (x) { var s = sigOf(x); return !!(mySig && s && s[1] === mySig[1]); };
    /* the finishing touch is something you WEAR, colour-matched: a hat, then a scarf, then (for her) a bow or cheer
       piece. Never a blanket, pillow, bag, sticker or button. */
    var WEARABLE_ACC = /\b(bows?|poms?|pom poms?|tattoos?)\b/i;
    var finish = function (exclude) {
      // never a second piece of the same kind (a hat page gets a scarf, not another hat)
      var ok = function (x) { return exclude.indexOf(x.h) < 0 && x.h !== p.h && x.cat !== p.cat; };
      return pick(all, function (x) { return ok(x) && x.cat === 'hat'; }, p, true) ||
        pick(all, function (x) { return ok(x) && x.cat === 'scarf'; }, p, true) ||
        (p.who === 'kids' ? pick(all, function (x) { return ok(x) && (x.cat === 'bow' || (x.cat === 'accessory' && WEARABLE_ACC.test(x.t))); }, p, true) : null);
    };
    var mom, dress, partner, extra;
    var famLive = function (x, fam) { return (x.v || []).some(function (v) { return v[0] && SG.famOk(v[0], fam) && v[2]; }); };
    if (p.h === SG.momMiniHandle && famLive(p, 'adult') && famLive(p, 'kids')) {
      dress = pick(all, function (x) { return x.cat === 'cheer-dress'; }, p);
      return { kind: 'mini', brooke: true, items: [{ p: p, type: 'For you' }, { p: p, type: 'For your mini' }].concat(dress ? [{ p: dress, type: 'Or her cheer dress', off: true }] : []) };
    }

    // her cheer dress → a mom top (+ a bow)
    if (p.cat === 'cheer-dress') {
      mom = pick(all, function (x) { return x.who === 'women' && TOPS.concat(['set']).indexOf(x.cat) > -1; }, p);
      if (mom) {
        extra = pick(all, function (x) { return x.who === 'kids' && (x.cat === 'bow' || (x.cat === 'accessory' && /\b(bows?|poms?)\b/i.test(x.t))); });
        return { kind: 'mini', dress: p, items: [{ p: p, type: 'For your mini' }, { p: mom, type: 'For you' }].concat(extra ? [{ p: extra, type: 'The finishing touch' }] : []) };
      }
    }
    // a kids piece → the matching women's piece (same signature, then same category)
    if (p.who === 'kids' && p.cat !== 'cheer-dress' && ['bow', 'accessory'].indexOf(p.cat) < 0) {
      mom = pick(all, function (x) { return x.who === 'women' && sameSig(x) && x.cat === p.cat; }, p);
      if (mom) return { kind: 'mini', matched: true, sig: mySig, items: [{ p: p, type: 'For your mini' }, { p: mom, type: 'For you' }] };
      // the same line, another garment: "more from" the line, never "made to match"
      mom = pick(all, function (x) { return x.who === 'women' && sameSig(x); }, p);
      if (mom) return { kind: 'mini', line: true, sig: mySig, items: [{ p: p, type: 'For your mini' }, { p: mom, type: 'For you' }] };
      // no grown-up version of this line: a same-category piece for her, presented as a suggestion, never as a match
      mom = pick(all, function (x) { return x.who === 'women' && x.cat === p.cat; }, p, true);
      if (mom) return { kind: 'mini', items: [{ p: p, type: 'For your mini' }, { p: mom, type: 'For you' }] };
    }
    if (p.who === 'women') {
      // the same signature, complementary piece (tank ↔ skort, crewneck ↔ shorts)
      if (mySig) {
        partner = pick(all, function (x) {
          return x.who === 'women' && sameSig(x) && ((TOPS.indexOf(p.cat) > -1 && BOTTOMS.indexOf(x.cat) > -1) || (BOTTOMS.indexOf(p.cat) > -1 && TOPS.indexOf(x.cat) > -1));
        }, p);
        if (partner) {
          extra = finish([partner.h]);
          return { kind: 'wear', sig: mySig, items: [{ p: p, type: 'Your pick' }, { p: partner, type: TYPE[partner.cat] || 'To pair' }].concat(extra ? [{ p: extra, type: TYPE[extra.cat] || 'The finishing touch' }] : []) };
        }
      }
      // a mom top → her mini's cheer dress (+ a bow); never for a college / program client-store piece
      if (TOPS.concat(['set', 'dress']).indexOf(p.cat) > -1 && !isProgram(p)) {
        dress = pick(all, function (x) { return x.cat === 'cheer-dress'; }, p);
        if (dress) {
          extra = pick(all, function (x) { return x.who === 'kids' && (x.cat === 'bow' || (x.cat === 'accessory' && /\b(bows?|poms?)\b/i.test(x.t))); });
          return { kind: 'mini', dress: dress, items: [{ p: p, type: 'For you' }, { p: dress, type: 'For your mini' }].concat(extra ? [{ p: extra, type: 'The finishing touch' }] : []) };
        }
        // or her mini's version of the same signature
        var kid = pick(all, function (x) { return x.who === 'kids' && sameSig(x) && x.cat === p.cat; }, p);
        if (kid) return { kind: 'mini', matched: true, sig: mySig, items: [{ p: p, type: 'For you' }, { p: kid, type: 'For your mini' }] };
        kid = pick(all, function (x) { return x.who === 'kids' && sameSig(x); }, p);
        if (kid) return { kind: 'mini', line: true, sig: mySig, items: [{ p: p, type: 'For you' }, { p: kid, type: 'For your mini' }] };
      }
      // anything else: a complementary piece from the same school (a hat or scarf gets a top; other accessories,
      // stickers and gifts get no outfit at all), colour-matched and rotated so pages don't all repeat one look
      partner = pick(all, function (x) {
        return x.who === 'women' && ((TOPS.indexOf(p.cat) > -1 && BOTTOMS.indexOf(x.cat) > -1) || (BOTTOMS.indexOf(p.cat) > -1 && TOPS.indexOf(x.cat) > -1) ||
          (['hat', 'scarf'].indexOf(p.cat) > -1 && TOPS.indexOf(x.cat) > -1));
      }, p, true);
      if (partner) {
        extra = finish([partner.h, p.h]);
        return { kind: 'wear', items: [{ p: p, type: 'Your pick' }, { p: partner, type: TYPE[partner.cat] || 'To pair' }].concat(extra && extra.h !== p.h ? [{ p: extra, type: TYPE[extra.cat] || 'The finishing touch' }] : []) };
      }
    }
    return null;
  }

  function shotHTML(x, cls, caption) {
    var ir = clamp(x.ir || 0.8, 0.667, 1);
    var cover = x.ir && Math.abs(x.ir - ir) / ir <= 0.06;
    return '<div class="' + cls + '" style="--look-ratio:' + ir + '">' +
      '<img src="' + E(SG.img(x.img[0], 900)) + '" alt="' + E(x.t) + '" width="900" height="' + Math.round(900 / ir) + '" loading="lazy" decoding="async"' + (cover ? ' class="is-cover"' : '') + '>' +
      (caption ? '<span>' + E(caption) + '</span>' : '') + '</div>';
  }

  function renderPair() {
    var sec = $('[data-pdp="pair"]');
    if (!p.sch) return [];   // multi-school basics (poms, plain shorts): no Auburn outfit built around them
    var pair = buildPair();
    if (!pair) return [];
    var items = pair.items.filter(function (it) { return it.p; });
    var others = pair.brooke ? items.slice(1) : items.filter(function (it) { return it.p.h !== p.h; });
    if (!others.length) return [];
    // a sold-out piece can't be added: the look leaves it out (and its price out of the total); with fewer than two
    // pieces left there is no look to shop
    var soldOut = SG.isSoldOut(p);
    if (soldOut) {
      items = others;
      if (items.length < 2) return [];
    }
    var media = $('[data-pdp="pair-media"]');
    var mini = pair.kind === 'mini';
    var you = items.filter(function (it) { return it.type === 'For you'; })[0];
    var word = !you ? 'piece' : you.p.cat === 'dress' ? 'dress' : you.p.cat === 'set' ? 'set' : TOPS.indexOf(you.p.cat) > -1 ? 'top' : 'piece';
    // 'Match your mini' only for the same garment in both sizes (the Brooke, or the same line in the same category);
    // a cheer dress with a different top is never a match, whatever colour words their names share
    $('[data-pdp="pair-eyebrow"]').textContent = mini ? (pair.brooke || pair.matched ? 'Match your mini' : 'Mom & mini') : 'Complete the look';
    if (soldOut) {
      $('[data-pdp="pair-title"]').innerHTML = 'Shop the rest <em class="br">of the look.</em>';
      $('[data-pdp="pair-lede"]').textContent = 'This piece is sold out for now. These are still available. Take them all, or untick anything you don’t need.';
    } else if (pair.brooke) {             // the Brooke in both sizes, as in the mom & mini photo
      $('[data-pdp="pair-title"]').innerHTML = 'Two of a kind, <em class="br">on the Plains.</em>';
      $('[data-pdp="pair-lede"]').textContent = 'Matching Brooke crewnecks, for you and for her. Add her cheer dress too, if you like.';
    } else if (mini && pair.dress) {
      $('[data-pdp="pair-title"]').innerHTML = 'Her cheer dress, <em class="br">your ' + word + '.</em>';
      $('[data-pdp="pair-lede"]').textContent = 'Her cheer dress, in sizes 12M–10, and a ' + word + ' for you to wear with it.';
    } else if (mini && pair.matched) {   // the same signature line, the same garment, in both sizes
      $('[data-pdp="pair-title"]').innerHTML = 'Made to match <em class="br">your mini.</em>';
      $('[data-pdp="pair-lede"]').textContent = (pair.sig ? pair.sig[0] : 'The same line') + ' for you and for her, so you’re both ready for kickoff.';
    } else if (mini && pair.line) {      // the same line, a different garment: no matching claim
      $('[data-pdp="pair-title"]').innerHTML = 'More from <em>' + E(pair.sig ? pair.sig[0] : 'the line') + '.</em>';
      $('[data-pdp="pair-lede"]').textContent = (pair.sig ? pair.sig[0] : 'The same line') + ', one piece for you and one for her. Take both, or untick anything you don’t need.';
    } else if (mini) {                    // a suggestion only: different designs, no matching claim
      $('[data-pdp="pair-title"]').innerHTML = 'Something for you, <em class="br">too.</em>';
      $('[data-pdp="pair-lede"]').textContent = 'A piece we’d pick for you to wear with it on game day. Take both, or untick anything you don’t need.';
    } else {
      $('[data-pdp="pair-title"]').innerHTML = 'We’d wear it <em>with…</em>';
      $('[data-pdp="pair-lede"]').textContent = pair.sig
        ? 'More from ' + pair.sig[0] + (items.length > 2 ? ', plus a finishing touch' : '') + '. Take the whole look, or untick anything you don’t need.'
        : 'Pieces we’d pair with it. Take the whole look, or untick anything you don’t need.';
    }

    // photo: the paired piece leads (sharp product shot); for an Auburn mom & mini pair the 600px mom & mini photo is
    // the small polaroid inset, where it stays at or above 1:1 on every screen
    // (only when the look has the Brooke in it: that photo shows both of them wearing the Brooke)
    var hasBrooke = items.some(function (it) { return it.p.h === SG.momMiniHandle; });
    var ed = mini && hasBrooke && isAuburn ? SG.pickPhoto([{ k: 'mom-mini-auburn-stripes', pos: '60% 30%' }], 600, true) : null;
    var lead = others[0].p, mine = items.filter(function (it) { return it.p.h === p.h; })[0];
    if (pair.brooke) lead = p;
    if (ed && lead.img && lead.img[0]) {
      media.innerHTML = shotHTML(lead, 'look__shot pdp-pair__shot', '') +
        '<figcaption class="look__inset pdp-pair__inset"><div class="pdp-pair__th" style="--look-ratio:' + ed.w + '/' + ed.h + '">' + SG.imgTag(ed) + '</div><span>' + E($('[data-pdp="pair-eyebrow"]').textContent) + '</span></figcaption>';
    } else if (lead.img && lead.img[0]) {
      media.innerHTML = shotHTML(lead, 'look__shot pdp-pair__shot', '') +
        (p.img && p.img[0] && !soldOut ? '<figcaption class="look__inset pdp-pair__inset">' + shotHTML(p, 'pdp-pair__th', '') + '<span>' + E(mine ? mine.type : 'Your pick') + '</span></figcaption>' : '');
    } else {
      media.hidden = true;
      sec.classList.add('pdp-pair--noimg');
    }

    var lookEl = $('[data-pdp="pair-look"]');
    SG.look(lookEl, items, { cta: items.length === 2 && mini ? 'Add both to bag' : 'Add the look to bag' });
    sec.hidden = false;
    $('[data-pdp="divider"]').hidden = false;
    syncLook();
    return others.map(function (it) { return it.p.h; });
  }

  /* the main picker pre-fills this piece's row in the look */
  function syncLook() {
    var row = $$('.look__row').filter(function (r) { var a = $('.look__name', r); return a && a.getAttribute('href') === SG.productUrl(p.h); })[0];
    if (!row) return;
    var setSel = function (sel, val) {
      if (!sel || !val) return;
      var o = $$('option', sel).filter(function (x) { return x.value === val && !x.disabled; })[0];
      if (o && sel.value !== val) { sel.value = val; row.dispatchEvent(new Event('change', { bubbles: true })); }   // the row re-gates its sizes for the colour
    };
    setSel($('[data-k="color"]', row), state.color);   // colour first: which sizes exist depends on it
    setSel($('[data-k="size"]', row), state.size);
  }

  /* ======================================================================
     More rails: this school (non-Auburn), then More Auburn
     ====================================================================== */
  function ranked(list, skip) {
    var mySig = sigOf(p), myKey = SG.styleKey(p);
    return list.filter(function (x) { return x.h !== p.h && skip.indexOf(x.h) < 0 && SG.styleKey(x) !== myKey; })
      .map(function (x, i) {
        var s = sigOf(x);
        var score = (x.av ? 0 : 20) + (isProgram(x) && !isProgram(p) ? 15 : 0) - (x.cat === p.cat ? 3 : 0) - (x.who === p.who ? 2 : 0) - (mySig && s && s[1] === mySig[1] ? 2 : 0);
        return [x, score, i];
      })
      .sort(function (a, b) { return a[1] - b[1] || a[2] - b[2]; })
      .map(function (a) { return a[0]; });
  }
  function renderMore(skip) {
    skip = skip || [];
    if (school && !isAuburn) {
      var ms = $('[data-pdp="more-school"]');
      $('[data-pdp="ms-title"]').innerHTML = 'More <em>' + E(school.name) + '.</em>';
      var all = $('[data-pdp="ms-all"]');
      all.textContent = 'Shop all ' + school.name;
      all.href = SG.shopUrl({ school: school.slug });
      SG.rail($('[data-pdp="ms-rail"]'), ranked(SG.products({ sch: school.slug }), skip), { nav: $('[data-pdp="ms-nav"]'), hide: ms, card: { school: false } });
    }
    var more = $('[data-pdp="more"]');
    SG.rail($('[data-pdp="more-rail"]'), ranked(SG.products({ sch: 'auburn' }), skip), { nav: $('[data-pdp="more-nav"]'), hide: more, card: { school: false } });
  }

  /* ======================================================================
     Phone: sticky add-to-bag bar once the main button scrolls away
     ====================================================================== */
  function syncBar() {
    if (!bar) return;
    var c = current();
    $('[data-pdp="bar-price"]').textContent = (c.exact ? SG.money(c.lo * state.qty) : 'From ' + SG.money(c.lo)) +
      (state.size && needsSize ? ' · ' + state.size : '') + (state.color && colors.length > 1 ? ' · ' + state.color : '');
    var btn = $('[data-pdp="bar-btn"]');
    btn.disabled = !p.av;
    btn.textContent = !p.av ? 'Sold out' : (needsSize && !state.size ? 'Choose a size' : 'Add to bag');
  }
  function showBar(on) {
    on = on && phoneMQ.matches;
    if (on === barOn) return;
    barOn = on;
    bar.classList.toggle('is-on', on);
    if (on) bar.removeAttribute('inert'); else bar.setAttribute('inert', '');
    document.body.classList.toggle('pdp-bar-on', on);
  }
  function wireBar() {
    bar = $('[data-pdp="bar"]');
    bar.hidden = false;
    $('[data-pdp="bar-title"]').textContent = p.t;
    $('[data-pdp="bar-th"]').innerHTML = p.img && p.img[0]
      ? '<img src="' + E(SG.img(p.img[0], 200)) + '" alt="" width="48" height="60" loading="lazy" decoding="async">' : '';
    syncBar();
    $('[data-pdp="bar-btn"]').addEventListener('click', function () {
      if (needsSize && !state.size) {
        // message first: inserting it above the viewport mid-scroll makes WebKit's scroll anchoring cancel a smooth scroll
        setErr('Choose a size to add this to your bag.');
        var box = $('[data-pdp="sizes"]'), first = $('.pdp-sizes input:not(:disabled)');
        window.requestAnimationFrame(function () {
          box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
          if (first) window.setTimeout(function () { first.focus({ preventScroll: true }); }, reduced ? 0 : 500);
        });
        return;
      }
      addNow();
    });
    /*
     * The button counts as gone once it slides under the sticky header, not only off the screen.
     * Read the header height live on every check: at script time WebKit can report a stale
     * --sticky-top (sg.js corrects it from a ResizeObserver), so nothing is baked in up front.
     */
    var cta = $('.pdp-cta'), hdr = document.getElementById('sg-hdr');
    var check = function () { showBar(cta.getBoundingClientRect().bottom <= (hdr ? hdr.getBoundingClientRect().bottom : 0)); };
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; check(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if (phoneMQ.addEventListener) phoneMQ.addEventListener('change', check); else phoneMQ.addListener(check);
    check();
  }

  /* ======================================================================
     Not found: unknown handle, or the catalogue hasn't loaded yet
     ====================================================================== */
  function notFound() {
    var nf = $('[data-pdp="nf"]');
    nf.hidden = false;
    setMeta('Piece not found · Scarlet & Gold',
      'Shop officially licensed Auburn game day apparel from Scarlet & Gold, designed in Auburn, Alabama, a few miles from Jordan-Hare.');

    var links = [
      ['In stock now', 'auburn-university-in-stock-items', 'Ships in 5–7 business days'],
      ['Women’s specialty', 'auburn-womens-specialty', 'Women’s XS–2XL'],
      ['Girls & kids', 'auburn-kids-specialty', 'Girls’ sizes from 12M'],
      ['Hats', 'auburn-hat-collection-1', 'Local pickup in Auburn'],
      ['Original Aubie', 'original-aubie-basketball', 'In collaboration with S&G'],
      [CH.nav, CH.featured.c, CH.featured.eyebrow]
    ];
    $('[data-pdp="nf-links"]').innerHTML = links.map(function (l) {
      return '<li><a href="' + SG.shopUrl({ c: l[1] }) + '"><strong>' + E(l[0]) + '</strong><span>' + E(l[2]) + '</span></a></li>';
    }).join('');
    $('[data-pdp="nf-note"]').hidden = (D.products || []).length > 0;

    var ph = SG.pickPhoto([{ k: 'group-auburn-tees-outdoor' }, { k: 'auburn-blue-cropped-crewneck-model' }], 1200);
    $('[data-pdp="nf-photo"]').innerHTML = SG.imgTag(ph, { eager: true });

    SG.deptTiles($('[data-pdp="nf-depts"]'), [
      { t: 'Women', c: 'auburn-womens-specialty', img: ['col:auburn-womens-specialty', { k: 'four-models-sets', pos: '50% 30%' }, { k: 'auburn-embroidered-crewneck-model', pos: '50% 10%' }],
        made: { patch: 'Auburn women', dot: true, note: 'Women’s XS–2XL' } },
      { t: 'Hats', c: 'auburn-hat-collection-1', img: ['col:auburn-hat-collection-1'], made: { patch: 'Auburn hats', dot: true, note: 'Local pickup at our Auburn shop' } },
      { t: 'Girls & Kids', c: 'auburn-kids-specialty', img: ['col:auburn-kids-specialty', { k: 'auburn-cheer-dress-flat', pos: '50% 45%' }, { k: 'mom-mini-auburn-stripes', pos: '30% 40%' }],
        made: { patch: 'Girls & kids', dot: true, note: 'Girls’ sizes from 12M' } },
      { t: 'Men', c: 'auburn-mens-collection', img: ['col:auburn-mens-collection'], made: { patch: 'Auburn men', dot: true, note: 'For the men in your crew' } },
      { t: 'Tees & fleece', c: 'auburn-adult-apparel', img: ['col:auburn-adult-apparel', { k: 'auburn-tee-grid-flatlay-2', pos: '50% 50%' }],
        made: { patch: 'Tees & fleece', dot: true, note: 'Printed or embroidered in Auburn' } },
      { t: 'Gifts', c: 'auburn-accessories-gifts', img: ['col:auburn-accessories-gifts'], made: { big: '&', note: 'Little extras for every Auburn fan' } }
    ]);

    // when the catalogue is loaded, a rail of real Auburn pieces follows
    var more = $('[data-pdp="more"]');
    var au = SG.products({ sch: 'auburn', avail: true });
    au = au.filter(function (x) { return x['new']; }).concat(au.filter(function (x) { return !x['new']; }));   // new = created within 45 days (prep.py)
    SG.rail($('[data-pdp="more-rail"]'), au, { nav: $('[data-pdp="more-nav"]'), hide: more, card: { school: false } });
  }
})();
