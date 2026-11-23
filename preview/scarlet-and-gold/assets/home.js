/* ==========================================================================
   Scarlet & Gold — homepage (assets/home.js). Runs after sg.js.
   Render order matters: SG.pickPhoto hands each photo to the first slot that
   asks, so sections are rendered top to bottom.
   ========================================================================== */
(function () {
  'use strict';
  var SG = window.SG, CH = SG.chapter;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var hasProducts = SG.data.products.length > 0;

  /* ---------- hero + intro (chapter) ---------- */
  SG.hero($('[data-home="hero"]'), CH.hero);
  SG.intro($('[data-home="intro"]'), CH.intro);

  /* ---------- Home team: Auburn department ---------- */
  var TEAM = [
    { label: 'Women', cols: ['auburn-womens-specialty', 'auburn-adult-tees-fleece-2026', 'auburn-adult-apparel'], who: 'women', c: 'auburn-womens-specialty', fam: 'adult' },
    { label: 'Girls & Kids', cols: ['auburn-kids-specialty', 'auburn-girls-collection', 'auburn-kids-apparel'], c: 'auburn-kids-specialty' },
    { label: 'Men', cols: ['auburn-mens-collection', 'auburn-mens-specialty'], c: 'auburn-mens-collection', fam: 'adult' },
    { label: 'Hats', cols: ['auburn-hat-collection-1'], c: 'auburn-hat-collection-1' },
    { label: 'Gifts', cols: ['auburn-accessories-gifts'], c: 'auburn-accessories-gifts' },
    { label: 'In stock now', cols: ['auburn-university-in-stock-items'], c: 'auburn-university-in-stock-items' }
  ];
  /* No-product fallback: photo and designed cards alternate (never two cards side by side). Real collection photos come
     first so they take over once the catalogue has them; the editorial fallbacks are photos that are not on their
     current homepage, and a department without a fitting photo (Men, Hats, Gifts) is a designed card, never a stand-in. */
  var TEAM_TILES = [
    { t: 'Women', c: 'auburn-womens-specialty', img: ['col:auburn-womens-specialty', { k: 'four-models-sets', pos: '50% 30%' }],
      made: { patch: 'Auburn women', dot: true, note: 'Women’s XS–2XL' } },
    { t: 'Hats', c: 'auburn-hat-collection-1', img: ['col:auburn-hat-collection-1'], made: { patch: 'Auburn hats', dot: true, note: 'Local pickup at our Auburn shop' } },
    { t: 'Girls & Kids', c: 'auburn-kids-specialty', img: ['col:auburn-kids-specialty', { k: 'mom-mini-auburn-stripes', pos: '30% 40%' }],
      made: { patch: 'Girls & kids', dot: true, note: 'Girls’ sizes from 12M' } },
    { t: 'Men', c: 'auburn-mens-collection', img: ['col:auburn-mens-collection'], made: { patch: 'Auburn men', dot: true, note: 'For the men in your crew' } },
    { t: 'Tees & fleece', c: 'auburn-adult-apparel', img: ['col:auburn-adult-apparel', { k: 'auburn-tee-grid-flatlay-2', pos: '50% 50%' }],
      made: { patch: 'Tees & fleece', dot: true, note: 'Printed or embroidered in Auburn' } },
    { t: 'Gifts', c: 'auburn-accessories-gifts', img: ['col:auburn-accessories-gifts'], made: { big: '&', note: 'Little extras for every Auburn fan' } }
  ];
  var tabsEl = $('[data-home="team-tabs"]'), deptEl = $('[data-home="team-depts"]');
  var tabs = TEAM.map(function (t) {
    var list = SG.collections(t.cols).filter(function (p) { return (!t.who || p.who === t.who) && (!p.sch || p.sch === 'auburn'); });
    // department collection not loaded (partial data): the same department's pieces from the loaded Auburn collection,
    // linked to a shop view of exactly those pieces (the tab label names the department, not the unloaded collection)
    var d = list.length ? null : SG.fromAuburn(t.c);
    var card = t.fam ? { fam: t.fam } : null;   // Women / Men cards price from adult sizes (The Brooke: $118, not the toddler $92)
    return d ? { label: t.label, products: d.products, href: d.url, card: card } : { label: t.label, products: list, href: SG.shopUrl({ c: t.c }), card: card };
  });
  var shown = SG.tabbedRail(tabsEl, tabs, { label: 'Auburn departments', hide: false, limit: 12 });
  if (!shown) {
    tabsEl.hidden = true;
    deptEl.hidden = false;
    SG.deptTiles(deptEl, TEAM_TILES);
  }

  /* ---------- Every season on the Plains (Auburn) ---------- */
  SG.tileBand($('[data-home="seasons"]'), {
    tone: 'navy',
    pill: 'Every season on the Plains',
    title: 'From kickoff <em class="br">to the ballpark.</em>',
    /* sport tiles show their own collection photo once the catalogue has one; until then a designed tile, never a photo
       of something else. The Original Aubie artwork is the only basketball image (designed tile if the hero has it). */
    items: [
      { t: 'Game day', sub: 'Tees, crewnecks & more', c: 'auburn', img: [{ k: 'group-auburn-tees-outdoor', pos: '50% 45%' }, 'auburn-tee-grid-flatlay'] },
      { t: 'Basketball', sub: 'The Original Aubie collection', c: 'original-aubie-basketball',
        img: [{ k: 'original-aubie-collab', fit: 'contain', bg: '#F1E9DC' }], made: { tone: 'scarlet', patch: 'Original Aubie', dot: true } },
      { t: 'Baseball', c: 'auburn-baseball', img: ['col:auburn-baseball'], made: { tone: 'gold', patch: 'Auburn baseball', dot: true } },
      { t: 'Gymnastics', c: 'auburn-gymnastics', img: ['col:auburn-gymnastics'], made: { tone: 'scarlet', patch: 'Auburn gymnastics', dot: true } }
    ]
  });

  /* ---------- chapter band + featured rail ---------- */
  SG.tileBand($('[data-home="chapter-band"]'), CH.tiles);
  var feat = $('[data-home="featured"]');
  var FT = CH.featured;
  var more = $('[data-f="more"]', feat);
  var featList = SG.auburnFirst(SG.collection(FT.c));
  // partial data: the collection isn't loaded, so its pieces by a rule read from their own data (SG.fromAuburn); a chapter
  // whose collection has no such rule (S&G Christmas) may name a stand-in rule, shown under that rule's own heading
  var featD = featList.length ? null : (SG.fromAuburn(FT.c) || (FT.derive ? SG.fromAuburn(FT.derive) : null));
  var standIn = !!(featD && FT.derive && !SG.fromAuburn(FT.c));
  var head = standIn && FT.alt ? FT.alt : FT;
  $('[data-f="eyebrow"]', feat).textContent = head.eyebrow;
  $('[data-f="title"]', feat).innerHTML = head.title;
  more.textContent = FT.more || 'Shop all';
  more.href = SG.shopUrl({ c: FT.c });
  var cardO = { school: 'others' };   // an Auburn-only rail: no AUBURN eyebrow on every card
  if (featD) {
    featList = featD.products;
    more.href = featD.url;
    // a link to a rule-built view is labelled by what it lists, never "Shop the collection"
    if (standIn || /collection/i.test(FT.more || '')) more.textContent = 'See all ' + featList.length;
    // one line (all cards share the name before " | "): the variant is each card's title
    var names = featList.map(function (p) { return String(p.t).split(' | ')[0]; });
    if (featList.length > 1 && names.every(function (n) { return n === names[0]; }) && featList.every(function (p) { return / \| /.test(p.t); })) cardO.hideName = true;
  }
  SG.rail($('[data-f="rail"]', feat), featList, { nav: $('[data-f="nav"]', feat), hide: feat, card: cardO, line: !!featD && !standIn,
    end: standIn ? null : SG.liveEnd(FT.c, featList.length) });

  /* ---------- Match your mini ---------- */
  /* the big photo is the sharp 1600px cheer dress; the mom & mini photo is only 600px wide, so it rides as the small
     polaroid inset (shown at or above 1:1 on every screen) when the Home team tiles haven't already used it */
  var media = $('[data-home="mini-media"]');
  var miniSet = hasProducts ? SG.miniSet('auburn') : null;
  var brookeLook = !!(miniSet && miniSet[1] && miniSet[0].p.h === SG.momMiniHandle && miniSet[1].p.h === SG.momMiniHandle);
  // the Brooke look (both wear it in the mom & mini photo): the Brooke's own sharp photo leads, the mom & mini photo is the inset
  var big = SG.pickPhoto((brookeLook ? [{ k: 'p:' + SG.momMiniHandle, pos: '50% 25%' }] : []).concat([{ k: 'auburn-cheer-dress-flat', pos: '50% 45%' }, { k: 'mom-mini-auburn-stripes', pos: '60% 30%' }]), 1200);
  if (brookeLook) $('#mini .lede').textContent = 'Matching Brooke crewnecks, for you and for her. Add her cheer dress too, if you like.';
  var inset = big.key === 'mom-mini-auburn-stripes' ? null : SG.pickPhoto(['mom-mini-auburn-stripes'], 600, true);
  media.innerHTML =
    '<div class="look__shot hm-mini__shot' + (big.key === 'mom-mini-auburn-stripes' ? ' hm-mini__shot--small' : '') + '" style="--look-ratio:' + big.w + '/' + big.h + ';--pos:' + (big.pos || '50% 30%') + '">' + SG.imgTag(big) + '</div>' +
    (inset ? '<figcaption class="look__inset">' + SG.imgTag(inset) + '<span>Match your mini</span></figcaption>' : '');
  var miniLook = $('[data-home="mini-look"]');
  if (hasProducts && SG.mini(miniLook, { teamsEl: $('[data-home="mini-teams"]') })) {
    miniLook.hidden = false;
    $('[data-home="mini-fallback"]').hidden = true;
  }

  /* ---------- The S&G Signatures collage ---------- */
  /* signature-only photos may show other schools' patches (INDEX.md); lead with photos that aren't on their current homepage */
  var SIG_SLOTS = [
    [{ k: 'grace-gingham-dresses-three-models', label: 'The Grace', sub: 'Gingham dresses', c: 'grace-gingham-dresses', pos: '50% 20%' },
     { k: 'four-models-sets', label: 'Tee & skort sets', sub: 'in Auburn colors', c: 'auburn-womens-specialty', pos: '50% 30%' },
     { k: 'mallory-four-models-other-schools', label: 'The Mallory', sub: 'Gingham mockneck', c: 'mallory-gingham-mocknecks', pos: '50% 22%' }],
    [{ k: 'kristen-airy-tee-model', label: 'The Kristen', sub: 'Airy tee', c: 'the-kristen-collection', pos: '50% 12%' },
     { k: 'ava-airy-set-two-models', label: 'The Ava', sub: 'Airy crewneck & shorts', c: 'the-ava-collection', pos: '50% 20%' }],
    [{ k: 'four-models-sets', label: 'Tee & skort sets', sub: 'in Auburn colors', c: 'auburn-womens-specialty', pos: '50% 30%' },
     { k: 'ava-airy-set-two-models', label: 'The Ava', sub: 'Airy crewneck & shorts', c: 'the-ava-collection', pos: '50% 20%' },
     { k: 'becca-two-girls', label: 'The Becca', sub: 'Boxy crewneck', c: 'the-becca-collection', pos: '50% 20%' },
     { k: 'mallory-four-models-other-schools', label: 'The Mallory', sub: 'Gingham mockneck', c: 'mallory-gingham-mocknecks', pos: '50% 22%' }]
  ];
  $('[data-home="sig-collage"]').innerHTML = SIG_SLOTS.map(function (cands, i) {
    var ph = SG.pickPhoto(cands, 900);
    return '<a class="hm-sig__ph' + (i === 0 ? ' hm-sig__ph--tall' : '') + '" href="' + SG.shopUrl({ c: ph.c }) + '" style="--pos:' + ph.pos + '">' +
      SG.imgTag(ph) + '<span class="hm-sig__cap"><strong>' + SG.esc(ph.label) + '</strong> ' + SG.esc(ph.sub) + '</span></a>';
  }).join('');
  $('[data-home="sig-names"]').innerHTML = SG.nav.signatures.map(function (s) {
    return '<li><a href="' + SG.shopUrl({ c: s[2] }) + '"><strong>' + SG.esc(s[0]) + '</strong><span>' + SG.esc(s[1]) + '</span></a></li>';
  }).join('');

  /* best sellers: while that collection isn't loaded the button says so and opens it on their store */
  var best = $('a[href="shop.html?c=apparel-best-sellers"]');
  if (best && SG.data.partial && !SG.loaded('apparel-best-sellers') && SG.total('apparel-best-sellers')) {
    best.href = SG.liveUrl('apparel-best-sellers');
    best.target = '_blank';
    best.rel = 'noopener';
    best.innerHTML = 'Best sellers on their store' + SG.icons.ext + '<span class="sr"> (opens their store in a new tab)</span>';
  }

  /* ---------- Find your game day look (quiz) ---------- */
  var Q = [
    { k: 'who', q: 'Who’s getting dressed for game day?', opts: [
      { v: 'women', t: 'Me', s: 'Women’s XS–2XL', lbl: 'for you' },
      { v: 'kids', t: 'My mini', s: 'Girls’ sizes from 12M', lbl: 'for your mini' },
      { v: 'both', t: 'Both of us', s: 'Mom & mini, matching', lbl: 'for you both' },
      { v: 'men', t: 'Him', s: 'Men’s tees & more', lbl: 'for him' }] },
    { k: 'style', q: 'What do you reach for first?', opts: [
      { v: 'cozy', t: 'A cozy crewneck', s: 'Crewnecks, mocknecks & quarter-zips', cat: ['crewneck', 'mockneck', 'quarter-zip'], lbl: 'Cozy crewnecks' },
      { v: 'tee', t: 'A classic tee', s: 'Tees & long sleeves', cat: ['tee', 'long-sleeve'], lbl: 'Classic tees' },
      { v: 'set', t: 'A tank & skort', s: 'Tanks, skorts & sets', cat: ['tank', 'skort', 'set', 'shorts'], lbl: 'Tanks, skorts & sets' },
      { v: 'dress', t: 'A dress', s: 'Dresses & cheer dresses', cat: ['dress', 'cheer-dress'], lbl: 'Dresses' }] },
    { k: 'when', q: 'When’s the game?', two: true, opts: [
      { v: 'in', t: 'Coming up soon', s: 'In stock · ships in 5–7 business days', lbl: 'In stock, ships in 5–7 business days' },
      { v: 'any', t: 'I can plan ahead', s: 'Made for you in Auburn · 10–14 business days', lbl: 'In stock or made for you' }] }
  ];
  var quiz = $('[data-home="quiz"]');
  var ans = {}, step = 0;
  function opt(qi, v) { return Q[qi].opts.filter(function (o) { return o.v === v; })[0]; }

  function renderStep() {
    var q = Q[step];
    quiz.innerHTML =
      '<div class="quiz__progress"><span class="quiz__step">Q' + (step + 1) + ' of 3</span><span class="quiz__dots" aria-hidden="true">' +
        Q.map(function (_, i) { return '<i' + (i <= step ? ' class="is-on"' : '') + '></i>'; }).join('') + '</span></div>' +
      '<p class="quiz__q" id="quiz-q" tabindex="-1">' + SG.esc(q.q) + '</p>' +
      '<div class="quiz__opts' + (q.two ? ' quiz__opts--2' : '') + '" role="group" aria-labelledby="quiz-q">' + q.opts.map(function (o) {
        return '<button type="button" class="quiz__opt" data-v="' + o.v + '" aria-pressed="' + (ans[q.k] === o.v) + '"><strong>' + SG.esc(o.t) + '</strong><span>' + SG.esc(o.s) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="quiz__nav"><button type="button" class="tlink quiz__back' + (step ? ' is-on' : '') + '" data-q="back">Back</button>' +
      '<span class="micro muted">Auburn picks first</span></div>';
  }

  /*
   * picks() → {list, cat, ship}: the answers that actually produced the list. With part of the catalogue loaded an exact
   * match can be empty, so the quiz widens step by step (drop the timing, then the style) and the header, tags and the
   * "See all" link say what was really matched, never the answers that were dropped.
   */
  function picks() {
    var who = ans.who, cats = opt(1, ans.style).cat, ship = ans.when === 'in' ? 'in' : null;
    var base = SG.products({ sch: 'auburn', avail: true });
    var whoOk = function (p) { return who === 'both' ? (p.who === 'women' || p.who === 'kids') : p.who === who; };
    var steps = [{ cat: true, ship: !!ship }, { cat: true, ship: false }, { cat: false, ship: !!ship }, { cat: false, ship: false }];
    for (var i = 0; i < steps.length; i++) {
      var st = steps[i];
      var r = base.filter(function (p) { return whoOk(p) && (!st.cat || cats.indexOf(p.cat) > -1) && (!st.ship || SG.shipKind(p) === 'in'); });
      if (r.length) return { list: r, cat: st.cat, ship: st.ship };
    }
    return { list: [], cat: true, ship: !!ship };
  }

  function renderResult() {
    var w = opt(0, ans.who), st = opt(1, ans.style), wh = opt(2, ans.when);
    var res = hasProducts ? picks() : { list: [], cat: true, ship: ans.when === 'in' };
    var list = res.list;
    var wantIn = ans.when === 'in';
    // the link lists what the rail was built from (the answers that matched), Auburn pieces only
    var url = ans.who === 'both'
      ? '#mini'
      : SG.shopUrl({ c: 'auburn', school: 'auburn', who: ans.who, cat: res.cat ? st.cat : null, ship: res.ship ? 'in' : null });
    var head = (res.cat ? st.lbl + ' ' + w.lbl : 'Auburn picks ' + w.lbl);
    var tags = [w.t];
    if (res.cat) tags.push(st.s);
    if (res.ship) tags.push(wh.lbl);
    var notes = [];
    if (hasProducts && list.length && !res.cat) notes.push('No ' + st.lbl.toLowerCase() + ' ' + w.lbl + ' in this preview yet, so here are other Auburn pieces ' + w.lbl + '.');
    if (hasProducts && list.length && wantIn && !res.ship) notes.push('None of these are tagged in stock in this preview.');
    quiz.innerHTML = '<div class="quiz__result">' +
      '<div class="quiz__resulthead"><div><p class="eyebrow">Your game day look</p>' +
      '<p class="h3" id="quiz-res" tabindex="-1">' + SG.esc(head) + ', <em>in Auburn colors.</em></p></div>' +
      '<button type="button" class="tlink" data-q="restart">Start over</button></div>' +
      '<div class="quiz__summary">' + tags.map(function (t) { return '<span class="quiz__tag">' + SG.esc(t) + '</span>'; }).join('') + '</div>' +
      (notes.length ? '<p class="quiz__note micro muted">' + SG.esc(notes.join(' ')) + '</p>' : '') +
      '<div class="quiz__rail" data-hide-empty hidden><div data-q="rail"></div></div>' +
      '<div class="look__ctas">' +
        (ans.who === 'both'
          ? '<a class="btn btn--scarlet" href="#mini">Match your mini</a><a class="btn btn--line-ink" href="' + SG.ctaUrl('girls-cheer-dresses', { school: 'auburn' }) + '">Shop cheer dresses</a>'
          : '<a class="btn btn--scarlet" href="' + SG.esc(url) + '">' + (list.length ? 'See all your picks' : 'Shop your picks') + '</a>') +
      '</div></div>';
    // 'Me' / 'Him' price from adult sizes (The Brooke: $118, not the toddler $92)
    SG.rail($('[data-q="rail"]', quiz), list, { limit: 8, hide: $('.quiz__rail', quiz), card: { ship: true, fam: ans.who === 'women' || ans.who === 'men' ? 'adult' : null } });
    if (list.length) $('.quiz__rail', quiz).style.marginBottom = 'var(--s-6)';
    $('#quiz-res').focus({ preventScroll: true });
  }

  quiz.addEventListener('click', function (e) {
    var b = e.target.closest('.quiz__opt');
    if (b) {
      ans[Q[step].k] = b.getAttribute('data-v');
      quiz.querySelectorAll('.quiz__opt').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      window.setTimeout(function () {
        if (step < Q.length - 1) { step++; renderStep(); $('#quiz-q').focus({ preventScroll: true }); }
        else renderResult();
      }, 160);
      return;
    }
    var a = e.target.closest('[data-q]');
    if (!a) return;
    var act = a.getAttribute('data-q');
    if (act === 'back' && step > 0) { step--; renderStep(); $('#quiz-q').focus({ preventScroll: true }); }
    if (act === 'restart') { ans = {}; step = 0; renderStep(); $('#quiz-q').focus({ preventScroll: true }); }
  });
  renderStep();
})();
