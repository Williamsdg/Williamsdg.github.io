/* ==========================================================================
   Scarlet & Gold — the Auburn hub (assets/auburn.js). Runs after sg.js.
   Renders top to bottom so SG.pickPhoto hands each photo to the first slot
   that asks. Every department keeps its photo-led feature; a product rail is
   added under it only when SG_DATA has products for its collections.
   ========================================================================== */
(function () {
  'use strict';
  var SG = window.SG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Photos placed in the HTML (hero strip + Original Aubie artwork) are reserved first. */
  ['group-auburn-tees-outdoor', 'auburn-blue-cropped-crewneck-model', 'war-eagle-tank-skort-torso', 'original-aubie-collab'].forEach(SG.markPhotoUsed);

  /* ---------- departments: collections + photo candidates (Auburn-only photos) ---------- */
  var isAuburn = function (p) { return !p.sch || p.sch === 'auburn'; };
  var DEPTS = [
    { id: 'women', cols: ['auburn-womens-specialty', 'auburn-adult-apparel', 'auburn-adult-tees-fleece-2026'], who: 'women',
      photo: [{ k: 'auburn-embroidered-crewneck-model', pos: '50% 4%' }, { k: 'four-models-sets', pos: '50% 26%' }], alt: true },
    { id: 'kids', cols: ['auburn-kids-specialty', 'auburn-kids-apparel', 'auburn-girls-collection'],
      photo: [{ k: 'auburn-cheer-dress-flat', pos: '50% 46%' }], alt: true },
    { id: 'men', cols: ['auburn-mens-collection', 'auburn-mens-specialty'],
      photo: [{ k: 'auburn-tee-grid-flatlay', pos: '50% 38%' }, { k: 'auburn-tee-grid-flatlay-2', pos: '50% 50%' }], alt: true },
    { id: 'hats', cols: ['auburn-hat-collection-1'] },
    { id: 'gifts', cols: ['auburn-accessories-gifts'], photo: [{ k: 'aubie-tee-flatlay', pos: '42% 50%' }] },
    { id: 'in-stock', cols: ['auburn-university-in-stock-items', 'auburn-in-stock-sale-eligible'] },
    { id: 'basketball', cols: ['original-aubie-basketball', 'auburn-basketball'] },
    { id: 'baseball', cols: ['auburn-baseball'], photo: [{ k: 'four-models-sets', pos: '50% 30%' }, { k: 'auburn-tee-grid-flatlay-2', pos: '50% 50%' }] },
    { id: 'gymnastics', cols: ['auburn-gymnastics'] },
    { id: 'alumni', cols: ['auburn-alumni'], photo: [{ k: 'auburn-tee-grid-flatlay-2', pos: '50% 50%' }, { k: 'auburn-tee-grid-flatlay', pos: '50% 50%' }] }
  ];

  DEPTS.forEach(function (d) {
    var sec = document.getElementById(d.id);
    if (!sec) throw new Error('auburn.js: missing section #' + d.id);

    // photo slot (decorative inside card links; described in split features and the banner)
    var slot = $('[data-au-photo]', sec);
    if (slot && d.photo) {
      var ph = SG.pickPhoto(d.photo, 1200);
      if (ph) {
        if (ph.pos) slot.style.setProperty('--pos', ph.pos);
        slot.innerHTML = SG.imgTag(ph, { alt: d.alt ? ph.alt : '' });
      }
    }

    // product rail (hidden, with the photo feature left in place, when there are no products)
    var list = SG.collections(d.cols).filter(function (p) { return isAuburn(p) && (!d.who || p.who === d.who); });
    var wrap = $('[data-r="wrap"]', sec);
    var n = SG.rail($('[data-r="rail"]', wrap), list, { limit: 12, nav: $('[data-r="nav"]', wrap), hide: wrap, card: { school: false } });
    sec.classList.toggle('has-products', n > 0);
  });

  /* Clusters (hats + gifts, the three seasons): cards when every department is empty, rows with rails otherwise. */
  $$('[data-cluster]').forEach(function (cl) {
    var any = $$('.au-dept', cl).some(function (s) { return s.classList.contains('has-products'); });
    cl.classList.toggle('is-rows', any);
  });

  /* ---------- colleges & programs (their real client stores) ---------- */
  var progEl = $('[data-au="programs"]'), progMore = $('[data-au="programs-more"]');
  var programs = (SG.data.programs || []).map(function (p) {
    var name = p.t.replace(/^Auburn University /, '').replace(/^Auburn /, '').replace(/^AU /, '');
    var kicker = '';
    var colon = name.indexOf(': ');
    if (colon > -1) { kicker = name.slice(0, colon); name = name.slice(colon + 2); }
    return { p: p, name: name, kicker: kicker };
  }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  progEl.innerHTML = programs.map(function (x) {
    var n = Number(x.p.n) || 0;
    var count = n ? n + (n === 1 ? ' piece' : ' pieces') : '';
    return '<li><a class="au-prog" href="' + SG.esc(x.p.url) + '" target="_blank" rel="noopener">' +
      '<span class="au-prog__name">' + (x.kicker ? '<span class="au-prog__k">' + SG.esc(x.kicker) + '</span>' : '') +
      '<span class="au-prog__t">' + SG.esc(x.name) + '</span></span>' +
      '<span class="au-prog__n">' + SG.esc(count) + SG.icons.ext + '</span>' +
      '<span class="sr"> (' + SG.esc(x.p.t) + ' store, opens in a new tab)</span></a></li>';
  }).join('');
  if (programs.length > 6) {
    var progLabel = function (all) { return all ? 'Show fewer' : 'Show all ' + programs.length + ' colleges & programs'; };
    progMore.hidden = false;
    progMore.textContent = progLabel(false);
    progMore.addEventListener('click', function () {
      var all = !progEl.classList.contains('is-all');
      progEl.classList.toggle('is-all', all);
      progMore.setAttribute('aria-expanded', String(all));
      progMore.textContent = progLabel(all);
      if (!all) document.getElementById('programs').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- match your mini (Auburn only on the Auburn hub) ---------- */
  var media = $('[data-au="mini-media"]');
  var big = SG.pickPhoto([{ k: 'mom-mini-auburn-stripes', pos: '60% 30%' }, { k: 'auburn-cheer-dress-flat', pos: '50% 45%' }], 900);
  media.innerHTML = '<div class="look__shot au-mini__shot" style="--look-ratio:' + big.w + '/' + big.h + ';--pos:' + (big.pos || '50% 30%') + '">' + SG.imgTag(big) + '</div>';
  if (SG.miniSet('auburn') && SG.mini($('[data-au="mini-look"]'), { school: 'auburn' })) {
    $('[data-au="mini-look"]').hidden = false;
    $('[data-au="mini-fallback"]').hidden = true;
  }

  /* ---------- sticky chips: live height, stuck shadow, scroll spy ---------- */
  var chips = $('[data-au="chips"]');
  var chipList = $('.au-chips__list', chips);
  var links = $$('a.au-chip', chips);
  var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  function measure() { document.documentElement.style.setProperty('--au-chips-h', chips.offsetHeight + 'px'); }
  measure();
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(chips);

  var active = -1, pinned = -1, pinnedUntil = 0;
  function px(v) { return parseFloat(v) || 0; }
  function setActive(i) {
    if (i === active) return;
    active = i;
    links.forEach(function (a, j) { if (j === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    if (i < 0) return;
    var a = links[i];
    var left = a.parentNode.offsetLeft - (chipList.clientWidth - a.offsetWidth) / 2;
    chipList.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  function spy() {
    var top = chips.getBoundingClientRect().top;
    var stuck = top <= px(getComputedStyle(document.documentElement).getPropertyValue('--sticky-top')) + 1 && window.scrollY > 0;
    chips.classList.toggle('is-stuck', stuck);
    if (pinned > -1) {
      var landing = px(getComputedStyle(targets[pinned]).scrollMarginTop);
      if (Date.now() < pinnedUntil || Math.abs(targets[pinned].getBoundingClientRect().top - landing) < 80) { setActive(pinned); return; }
      pinned = -1;
    }
    var line = chips.getBoundingClientRect().bottom + window.innerHeight * 0.25;
    var idx = -1, last = -Infinity;
    targets.forEach(function (t, i) {
      var r = t.getBoundingClientRect();
      var reach = Math.max(line, px(getComputedStyle(t).scrollMarginTop) + 8);   // where a jump to it lands, at least
      // side-by-side cards share a top: the first of them wins
      if (r.top <= reach && r.top > last + 2) { idx = i; last = r.top; }
    });
    // past the last department's content (mini, visit band): nothing is current
    var lastT = targets[targets.length - 1].getBoundingClientRect();
    if (idx === targets.length - 1 && lastT.bottom < chips.getBoundingClientRect().bottom) idx = -1;
    setActive(stuck ? idx : -1);   // above the departments (hero) nothing is current
  }
  links.forEach(function (a, i) {
    a.addEventListener('click', function () { pinned = i; pinnedUntil = Date.now() + 1200; setActive(i); });
  });
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { spy(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', spy);
  spy();

  /* Arriving with a hash (e.g. auburn.html#programs from the menu): rails and photos above may have changed the
     layout since the browser's first jump, so land on the target again once the page has loaded. (Scrolling any
     earlier cancels WebKit's own fragment jump and leaves the page at the top.) */
  var hashT = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  if (hashT) {
    // the browser's own first jump must be instant: a smooth one keeps animating toward a stale offset and wins
    document.documentElement.style.scrollBehavior = 'auto';
    var land = function () {
      window.setTimeout(function () {
        var i = targets.indexOf(hashT);
        if (i > -1) { pinned = i; pinnedUntil = Date.now() + 600; }
        var y = hashT.getBoundingClientRect().top + window.scrollY - px(getComputedStyle(hashT).scrollMarginTop);
        window.scrollTo(0, Math.max(0, Math.round(y)));
        spy();
        window.setTimeout(function () { document.documentElement.style.scrollBehavior = ''; }, 100);
      }, 60);
    };
    if (document.readyState === 'complete') land(); else window.addEventListener('load', land, { once: true });
  }
})();
