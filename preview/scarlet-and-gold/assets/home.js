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
    { label: 'Women', cols: ['auburn-womens-specialty', 'auburn-adult-tees-fleece-2026', 'auburn-adult-apparel'], who: 'women', c: 'auburn-womens-specialty',
      img: [{ k: 'war-eagle-tank-skort-torso', pos: '50% 30%' }, { k: 'white-crewneck-shorts-set-model', pos: '50% 30%' }, { k: 'auburn-blue-cropped-crewneck-model', pos: '50% 10%' }] },
    { label: 'Girls & Kids', cols: ['auburn-kids-specialty', 'auburn-girls-collection', 'auburn-kids-apparel'], c: 'auburn-kids-specialty',
      img: [{ k: 'auburn-cheer-dress-flat', pos: '50% 45%' }, { k: 'mom-mini-auburn-stripes', pos: '80% 30%' }] },
    { label: 'Men', cols: ['auburn-mens-collection', 'auburn-mens-specialty'], c: 'auburn-mens-collection',
      img: [{ k: 'auburn-tee-grid-flatlay', pos: '50% 50%' }, { k: 'auburn-tee-grid-flatlay-2', pos: '50% 50%' }] },
    { label: 'Hats', cols: ['auburn-hat-collection-1'], c: 'auburn-hat-collection-1',
      made: { tone: 'navy', patch: 'Auburn hats', note: 'Local pickup available at our Auburn shop' } },
    { label: 'Gifts', cols: ['auburn-accessories-gifts'], c: 'auburn-accessories-gifts',
      made: { tone: 'scarlet', big: '&', note: 'Gifts for every age and occasion' } },
    { label: 'In stock now', cols: ['auburn-university-in-stock-items'], c: 'auburn-university-in-stock-items',
      made: { tone: 'cream', ticket: true, patch: 'In stock', note: 'Ships in 5–7 business days' } }
  ];
  var tabsEl = $('[data-home="team-tabs"]'), deptEl = $('[data-home="team-depts"]');
  var tabs = TEAM.map(function (t) {
    var list = SG.collections(t.cols).filter(function (p) { return (!t.who || p.who === t.who) && (!p.sch || p.sch === 'auburn'); });
    return { label: t.label, products: list, href: SG.shopUrl({ c: t.c }) };
  });
  var shown = SG.tabbedRail(tabsEl, tabs, { label: 'Auburn departments', hide: false, limit: 12 });
  if (!shown) {
    tabsEl.hidden = true;
    deptEl.hidden = false;
    SG.deptTiles(deptEl, TEAM.map(function (t) { return { t: t.label, c: t.c, img: t.img, made: t.made }; }));
  }

  /* ---------- Every season on the Plains (Auburn) ---------- */
  SG.tileBand($('[data-home="seasons"]'), {
    tone: 'navy',
    pill: 'Every season on the Plains',
    title: 'From kickoff <em class="br">to the ballpark.</em>',
    items: [
      { t: 'Game day', sub: 'Tees, crewnecks & more', c: 'auburn', img: [{ k: 'group-auburn-tees-outdoor', pos: '50% 45%' }, 'auburn-tee-grid-flatlay'] },
      { t: 'Basketball', sub: 'The Original Aubie collection', c: 'original-aubie-basketball',
        img: [{ k: 'original-aubie-collab', fit: 'contain', bg: '#F1E9DC' }, { k: 'auburn-tee-grid-flatlay-2', pos: '50% 50%' }] },
      { t: 'Baseball', c: 'auburn-baseball', img: [{ k: 'four-models-sets', pos: '50% 36%' }, { k: 'war-eagle-tank-skort-torso', pos: '50% 30%' }, 'auburn-tee-grid-flatlay-2'] },
      { t: 'Gymnastics', c: 'auburn-gymnastics', img: [{ k: 'white-crewneck-shorts-set-model', pos: '50% 30%' }, { k: 'auburn-embroidered-crewneck-model', pos: '50% 12%' }, { k: 'auburn-blue-cropped-crewneck-model', pos: '50% 12%' }] }
    ]
  });

  /* ---------- chapter band + featured rail ---------- */
  SG.tileBand($('[data-home="chapter-band"]'), CH.tiles);
  var feat = $('[data-home="featured"]');
  $('[data-f="eyebrow"]', feat).textContent = CH.featured.eyebrow;
  $('[data-f="title"]', feat).innerHTML = CH.featured.title;
  var more = $('[data-f="more"]', feat);
  more.textContent = CH.featured.more || 'Shop all';
  more.href = SG.shopUrl({ c: CH.featured.c });
  SG.rail($('[data-f="rail"]', feat), SG.auburnFirst(SG.collection(CH.featured.c)), { nav: $('[data-f="nav"]', feat), hide: feat, card: { school: true } });

  /* ---------- Match your mini ---------- */
  var media = $('[data-home="mini-media"]');
  var big = SG.pickPhoto([{ k: 'mom-mini-auburn-stripes', pos: '60% 30%' }, { k: 'auburn-cheer-dress-flat', pos: '50% 45%' }], 900);
  var inset = SG.pickPhoto(['auburn-cheer-dress-flat'], 600, true);
  media.innerHTML =
    '<div class="look__shot hm-mini__shot" style="--look-ratio:' + big.w + '/' + big.h + ';--pos:' + (big.pos || '50% 30%') + '">' + SG.imgTag(big) + '</div>' +
    (inset && inset.key !== big.key ? '<figcaption class="look__inset">' + SG.imgTag(inset) + '<span>Her first cheer dress</span></figcaption>' : '');
  var miniLook = $('[data-home="mini-look"]');
  if (hasProducts && SG.mini(miniLook, { teamsEl: $('[data-home="mini-teams"]') })) {
    miniLook.hidden = false;
    $('[data-home="mini-fallback"]').hidden = true;
  }

  /* ---------- The S&G Signatures collage ---------- */
  var SIG_SLOTS = [
    [{ k: 'grace-gingham-dresses-three-models', label: 'The Grace', sub: 'Gingham dresses', c: 'grace-gingham-dresses', pos: '50% 20%' },
     { k: 'mallory-four-models-other-schools', label: 'The Mallory', sub: 'Gingham mockneck', c: 'mallory-gingham-mocknecks', pos: '50% 22%' }],
    [{ k: 'ava-airy-set-two-models', label: 'The Ava', sub: 'Airy crewneck & shorts', c: 'the-ava-collection', pos: '50% 20%' },
     { k: 'kristen-airy-tee-model', label: 'The Kristen', sub: 'Airy tee', c: 'the-kristen-collection', pos: '50% 12%' }],
    [{ k: 'becca-two-girls', label: 'The Becca', sub: 'Boxy crewneck', c: 'the-becca-collection', pos: '50% 20%' },
     { k: 'kristen-airy-tee-model', label: 'The Kristen', sub: 'Airy tee', c: 'the-kristen-collection', pos: '50% 12%' }]
  ];
  $('[data-home="sig-collage"]').innerHTML = SIG_SLOTS.map(function (cands, i) {
    var ph = SG.pickPhoto(cands, 900);
    return '<a class="hm-sig__ph' + (i === 0 ? ' hm-sig__ph--tall' : '') + '" href="' + SG.shopUrl({ c: ph.c }) + '" style="--pos:' + ph.pos + '">' +
      SG.imgTag(ph) + '<span class="hm-sig__cap"><strong>' + SG.esc(ph.label) + '</strong> ' + SG.esc(ph.sub) + '</span></a>';
  }).join('');
  $('[data-home="sig-names"]').innerHTML = SG.nav.signatures.map(function (s) {
    return '<li><a href="' + SG.shopUrl({ c: s[2] }) + '"><strong>' + SG.esc(s[0]) + '</strong><span>' + SG.esc(s[1]) + '</span></a></li>';
  }).join('');

  /* ---------- Find your game day look (quiz) ---------- */
  var Q = [
    { k: 'who', q: 'Who\'s getting dressed for game day?', opts: [
      { v: 'women', t: 'Me', s: 'Women\'s XS–2XL', lbl: 'for you' },
      { v: 'kids', t: 'My mini', s: 'Girls\' sizes from 12M', lbl: 'for your mini' },
      { v: 'both', t: 'Both of us', s: 'Mom & mini, matching', lbl: 'for you both' },
      { v: 'men', t: 'Him', s: 'Men\'s tees & more', lbl: 'for him' }] },
    { k: 'style', q: 'What do you reach for first?', opts: [
      { v: 'cozy', t: 'A cozy crewneck', s: 'Crewnecks, mocknecks & quarter-zips', cat: ['crewneck', 'mockneck', 'quarter-zip'], lbl: 'Cozy crewnecks' },
      { v: 'tee', t: 'A classic tee', s: 'Tees & long sleeves', cat: ['tee', 'long-sleeve'], lbl: 'Classic tees' },
      { v: 'set', t: 'A tank & skort', s: 'Tanks, skorts & sets', cat: ['tank', 'skort', 'set', 'shorts'], lbl: 'Tanks, skorts & sets' },
      { v: 'dress', t: 'A dress', s: 'Dresses & cheer dresses', cat: ['dress', 'cheer-dress'], lbl: 'Dresses' }] },
    { k: 'when', q: 'When\'s the game?', two: true, opts: [
      { v: 'in', t: 'This week', s: 'In stock · ships in 5–7 business days', lbl: 'In stock, ships in 5–7 business days' },
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

  function picks() {
    var who = ans.who, cats = opt(1, ans.style).cat, ship = ans.when === 'in' ? 'in' : null;
    var base = SG.products({ sch: 'auburn', avail: true });
    var whoOk = function (p) { return who === 'both' ? (p.who === 'women' || p.who === 'kids') : p.who === who; };
    var r = base.filter(function (p) { return whoOk(p) && cats.indexOf(p.cat) > -1 && (!ship || p.ship === ship); });
    if (r.length < 4) r = base.filter(function (p) { return whoOk(p) && cats.indexOf(p.cat) > -1; });
    if (r.length < 4) r = base.filter(function (p) { return whoOk(p) && (!ship || p.ship === ship); });
    return r;
  }

  function renderResult() {
    var w = opt(0, ans.who), st = opt(1, ans.style), wh = opt(2, ans.when);
    var url = ans.who === 'both'
      ? '#mini'
      : SG.shopUrl({ c: 'auburn', who: ans.who, cat: st.cat, ship: ans.when === 'in' ? 'in' : null });
    var list = hasProducts ? picks() : [];
    quiz.innerHTML = '<div class="quiz__result">' +
      '<div class="quiz__resulthead"><div><p class="eyebrow">Your game day look</p>' +
      '<p class="h3" id="quiz-res" tabindex="-1">' + SG.esc(st.lbl + ' ' + w.lbl) + ', <em>in Auburn colors.</em></p></div>' +
      '<button type="button" class="tlink" data-q="restart">Start over</button></div>' +
      '<div class="quiz__summary"><span class="quiz__tag">' + SG.esc(w.t) + '</span><span class="quiz__tag">' + SG.esc(st.s) + '</span><span class="quiz__tag">' + SG.esc(wh.lbl) + '</span></div>' +
      '<div class="quiz__rail" data-hide-empty hidden><div data-q="rail"></div></div>' +
      '<div class="look__ctas">' +
        (ans.who === 'both'
          ? '<a class="btn btn--scarlet" href="#mini">Match your mini</a><a class="btn btn--line-ink" href="' + SG.shopUrl({ c: 'girls-cheer-dresses', school: 'auburn' }) + '">Shop cheer dresses</a>'
          : '<a class="btn btn--scarlet" href="' + SG.esc(url) + '">' + (list.length ? 'See all your picks' : 'Shop your picks') + '</a>') +
      '</div></div>';
    SG.rail($('[data-q="rail"]', quiz), list, { limit: 8, hide: $('.quiz__rail', quiz), card: { ship: true } });
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
