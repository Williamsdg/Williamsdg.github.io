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
  ['group-auburn-tees-outdoor', 'auburn-blue-cropped-crewneck-model', 'auburn-embroidered-crewneck-model', 'original-aubie-collab'].forEach(SG.markPhotoUsed);

  /* Buttons labelled by a rule (Shop women, Shop in stock, Auburn cheer dresses…) go where those pieces are: the
     collection when it is loaded, else the matching loaded Auburn pieces (SG.ctaUrl). Collection-named links stay. */
  $$('a[data-rule]').forEach(function (a) {
    var sch = a.getAttribute('data-rule-school');
    a.href = SG.ctaUrl(a.getAttribute('data-rule'), sch ? { school: sch } : null);
  });

  /* ---------- departments: collections + photo candidates (Auburn-only photos) ---------- */
  var isAuburn = function (p) { return !p.sch || p.sch === 'auburn'; };
  /* A department without a fitting photo of its own (men, hats, gifts, baseball, gymnastics) gets a designed face, never a
     photo of something else: real collection photos ('col:<handle>') take over once the catalogue has them. */
  var DEPTS = [
    { id: 'women', cols: ['auburn-womens-specialty', 'auburn-adult-apparel', 'auburn-adult-tees-fleece-2026'], who: 'women', fam: 'adult',
      photo: ['col:auburn-womens-specialty', { k: 'four-models-sets', pos: '50% 26%' }], alt: true },
    { id: 'kids', cols: ['auburn-kids-specialty', 'auburn-kids-apparel', 'auburn-girls-collection'],
      photo: ['col:auburn-kids-specialty', { k: 'auburn-cheer-dress-flat', pos: '50% 46%' }], alt: true },
    { id: 'men', cols: ['auburn-mens-collection', 'auburn-mens-specialty'], photo: ['col:auburn-mens-collection'], alt: true, fam: 'adult',
      made: '<span class="au-made__big">Men</span><span class="au-made__band"><span class="patch"><span class="patch__dot"></span>Auburn, AL</span></span><span class="au-made__note">For the men in your crew</span>' },
    { id: 'hats', cols: ['auburn-hat-collection-1'] },
    { id: 'gifts', cols: ['auburn-accessories-gifts'] },
    { id: 'in-stock', cols: ['auburn-university-in-stock-items', 'auburn-in-stock-sale-eligible'] },
    { id: 'basketball', cols: ['original-aubie-basketball', 'auburn-basketball'], derive: 'auburn-basketball' },
    { id: 'baseball', cols: ['auburn-baseball'] },
    { id: 'gymnastics', cols: ['auburn-gymnastics'] },
    { id: 'alumni', cols: ['auburn-alumni'], photo: [{ k: 'auburn-tee-grid-flatlay-2', pos: '50% 50%' }, { k: 'auburn-tee-grid-flatlay', pos: '50% 50%' }] }
  ];

  DEPTS.forEach(function (d) {
    var sec = document.getElementById(d.id);
    if (!sec) throw new Error('auburn.js: missing section #' + d.id);

    // photo slot (decorative inside card links; described in split features and the banner)
    var slot = $('[data-au-photo]', sec);
    if (slot && d.photo) {
      var ph = SG.pickPhoto(d.photo, 1200, !!d.made, { auburn: true, ratio: 0.8 });
      if (ph) {
        if (ph.pos) slot.style.setProperty('--pos', ph.pos);
        slot.innerHTML = SG.imgTag(ph, { alt: d.alt ? ph.alt : '' });
      } else if (d.made) {
        slot.classList.add('au-made', 'au-made--navy', 'au-made--band');
        slot.setAttribute('aria-hidden', 'true');
        slot.innerHTML = d.made;
      }
    }

    // product rail (hidden, with the photo feature left in place, when there are no products)
    var list = SG.collections(d.cols).filter(function (p) { return isAuburn(p) && (!d.who || p.who === d.who); });
    var wrap = $('[data-r="wrap"]', sec);
    // partial data: the department's collections aren't loaded, so show its pieces from the loaded Auburn collection
    // (rule from their own data, see SG.fromAuburn) with a link to a shop view of exactly those pieces
    var der = list.length ? null : SG.fromAuburn(d.derive || d.cols[0]);
    if (der && d.id === 'basketball') {   // the band is "The Original Aubie collection": its pieces lead
      var oa = SG.fromAuburn('original-aubie-basketball');
      if (oa) {
        var lead = oa.products.filter(function (p) { return der.products.indexOf(p) > -1; });
        der = { products: lead.concat(der.products.filter(function (p) { return lead.indexOf(p) < 0; })), url: der.url };
      }
    }
    if (der) {
      list = der.products;
      var head = $('.au-rail__head', wrap);
      // a section whose body already has a rule-labelled link (hats, gifts) gets that link pointed at these pieces,
      // with their count, instead of a second link right under it. Counts are the PREVIEW's (their store has more, and
      // the rail's end card says so): "Shop the 3 hats in this preview", never "Shop all hats (3)"
      var bodyLink = $('.tlink[data-rule]', sec);
      if (bodyLink && sec.closest('[data-cluster]')) {
        bodyLink.href = der.url;
        var what = (bodyLink.getAttribute('data-label') || bodyLink.textContent).replace(/^Shop (all )?/, '');
        bodyLink.setAttribute('data-label', bodyLink.getAttribute('data-label') || bodyLink.textContent);
        bodyLink.textContent = list.length > 1 ? 'Shop the ' + list.length + ' ' + what + ' in this preview' : 'Shop ' + what + ' in this preview';
        bodyLink.setAttribute('data-der', '1');
        $$('a.au-card__media[data-rule]', sec).forEach(function (a) { a.href = der.url; });
      } else if (head && !$('.au-rail__all', head)) {
        var a = document.createElement('a');
        a.className = 'tlink au-rail__all';
        a.href = der.url;
        a.textContent = 'See all ' + list.length + ' in this preview';   // the preview's pieces, not their whole collection
        head.insertBefore(a, $('[data-r="nav"]', head));
      }
    }
    var n = SG.rail($('[data-r="rail"]', wrap), list, { limit: 12, nav: $('[data-r="nav"]', wrap), hide: wrap, card: { school: false, fam: d.fam }, end: SG.liveEnd(d.derive || d.cols[0], list.length) });
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
  /* the cheer-dress photo leads the Girls & kids section above, so here the 600px mom & mini photo is shown small
     (capped so it stays at 2x); if the cheer dress is free it leads and the mom & mini photo becomes the polaroid inset */
  var media = $('[data-au="mini-media"]');
  var miniSet = SG.miniSet('auburn');
  var brookeLook = !!(miniSet && miniSet[1] && miniSet[0].p.h === SG.momMiniHandle && miniSet[1].p.h === SG.momMiniHandle);
  // the Brooke look (both wear it in the mom & mini photo): the Brooke's own sharp photo fills the column, the mom & mini photo is the inset
  var big = SG.pickPhoto((brookeLook ? [{ k: 'p:' + SG.momMiniHandle, pos: '50% 25%' }] : []).concat([{ k: 'auburn-cheer-dress-flat', pos: '50% 45%' }, { k: 'mom-mini-auburn-stripes', pos: '60% 30%' }]), 1200);
  if (brookeLook) $('#mini .lede').textContent = 'Matching Brooke crewnecks, for you and for her. Add her cheer dress too, if you like.';
  var small = big.key === 'mom-mini-auburn-stripes';
  var inset = small ? null : SG.pickPhoto(['mom-mini-auburn-stripes'], 600, true);
  media.innerHTML = '<div class="look__shot au-mini__shot' + (small ? ' au-mini__shot--small' : '') + '" style="--look-ratio:' + big.w + '/' + big.h + ';--pos:' + (big.pos || '50% 30%') + '">' + SG.imgTag(big) + '</div>' +
    (inset ? '<figcaption class="look__inset">' + SG.imgTag(inset) + '<span>Match your mini</span></figcaption>' : '');
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
    var stuck = top <= SG.stickyTop() + 1 && window.scrollY > 0;
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

  /* Arriving with a hash (auburn.html#programs …): sg.js lands it once the page has loaded (SG.landOn); pin the chip. */
  document.addEventListener('sg:hashland', function (e) {
    var i = targets.indexOf(e.detail.target);
    if (i > -1) { pinned = i; pinnedUntil = Date.now() + 600; }
    spy();
  });
})();
