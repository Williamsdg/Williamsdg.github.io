/* ==========================================================================
   Scarlet & Gold — chapters (assets/sg-chapters.js)
   The storefront re-dresses itself on Auburn's calendar. Load order:
   data.js → sg-chapters.js → sg.js → page script (all `defer`).
   Every fact in this file comes from source/*.txt (see brief/copy-deck.md).
   Image entries are candidate lists: the first photo not already used on the
   page wins (SG.pickPhoto in sg.js), so no photo repeats on a page.
   Keys are local photos (img/<key>.webp) or "col:<collection handle>".
   ========================================================================== */
(function () {
  'use strict';
  var SG = window.SG = window.SG || {};

  var SHARED_TICKER = [
    'Get on the List for 15% off your first order',
    'Free shipping on all orders $100+',
    'Free returns & exchanges with Checkout+',
    'In stock styles ship in 5–7 business days',
    'Designed in Auburn, AL'
  ];

  /*
   * Tile and hero photos are candidate lists picked top to bottom with no repeats (SG.pickPhoto). In these Auburn-first
   * slots rival-school photos are skipped and torso crops are only used where a tile opts in ({torso:true}). A tile
   * with `made` falls back to a designed (gold / scarlet / navy / ivory) tile whenever none of its photos is free, so a
   * slot never shows the wrong photo. Hero panels hold only single-person or flat-lay photos (narrow, tall frames).
   * 'p:<handle>[#i]' is a loaded product's own photo and 'rule:<handle>' the photos of the loaded pieces a department
   * rule matches (sg.js SG.photo / SG.pickPhoto): with an empty catalogue they resolve to nothing and the designed tile shows.
   */
  var CH = {
    christmas: {
      id: 'christmas', label: 'Christmas', nav: 'Christmas', dates: 'Nov 16 – Dec 31',
      from: [11, 16], to: [12, 31], accent: 'scarlet', logo: 'assets/logo-scarlet.png', themeColor: '#7C1019',
      ticker: ['Holiday purchases returnable through Jan 30'],
      hero: {
        eyebrow: 'Christmas in Auburn',
        line1: 'A holiday classic,',
        line2: 'in your school colors.',
        body: 'The Game Day Nutcracker: tees and white crewneck sweatshirts for every team on your list.',
        ctas: [
          // while S&G Christmas isn't loaded this opens it on their store, marked ↗ + "opens their store" (sg.js SG.hero);
          // kept short so both hero buttons stay on one row like the approved design
          { label: 'Shop Christmas', href: 'shop.html?c=s-g-christmas', c: 's-g-christmas', live: 'Shop Christmas' },
          { label: 'Auburn gifts', href: 'shop.html?c=auburn-accessories-gifts', rule: 'auburn-accessories-gifts' }
        ],
        cols: '1fr 1.5fr 1fr',
        images: [   // images[0] is preloaded by the inline <head> script in index.html: keep them in sync
          { img: ['auburn-blue-cropped-crewneck-model'], pos: '50% 12%' },
          { img: ['christmas-three-models'], pos: '50% 22%' },
          { img: ['auburn-tee-grid-flatlay'], pos: '50% 50%' }
        ]
      },
      intro: {
        eyebrow: 'Holiday returns, extended',
        title: 'Shop early. <em>Wrap happy.</em>',
        body: 'Holiday purchases made November 1 through December 31 can be returned for store credit or exchanged through January 30, and orders of $100 or more ship free.',
        cta: { label: 'Shipping & returns', href: 'visit.html#returns' }
      },
      tiles: {
        tone: 'scarlet',
        pill: 'The gift shop',
        title: 'Gifts for every age <em class="br">and occasion.</em>',
        items: [
          { t: 'Auburn tees & fleece', sub: 'Adult tees & fleece', c: 'auburn-adult-apparel', img: [{ k: 'aubie-tee-flatlay', pos: '32% 50%' }, 'auburn-tee-grid-flatlay-2'] },
          { t: 'Auburn sets', sub: 'Women’s specialty', c: 'auburn-womens-specialty', img: [{ k: 'four-models-sets', pos: '50% 30%' }, { k: 'ava-airy-set-two-models', pos: '50% 20%' }] },
          { t: 'Auburn gifts', sub: 'Accessories & gifts', c: 'auburn-accessories-gifts', rule: true, img: ['col:auburn-accessories-gifts', { k: 'p:the-auburn-university-needlepoint-pillow', pos: '50% 50%' }, 'rule:auburn-accessories-gifts'],
            made: { tone: 'gold', big: '&', patch: 'Auburn gifts', dot: true } },
          { t: 'Give Grace', sub: 'By our founder, Megan Smalley', c: 'book', img: [{ k: 'col:book', pos: '38% 50%' }],
            made: { tone: 'ivory', patch: 'Give Grace' } }
        ]
      },
      featured: { c: 's-g-christmas', eyebrow: 'New for Christmas', title: 'The Game Day <em>Nutcracker</em>', more: 'Shop the collection',
        // S&G Christmas not loaded: a rail labelled by its rule (Auburn gifts tagged in stock), never by the collection name
        derive: 'auburn-gifts-in-stock', alt: { eyebrow: 'Ready to wrap', title: 'Auburn gifts, <em>in stock now</em>' } }
    },

    football: {
      id: 'football', label: 'Game Day', nav: 'Game Day', dates: 'Aug 15 – Nov 15',
      from: [8, 15], to: [11, 15], accent: 'scarlet', logo: 'assets/logo-navy.png', themeColor: '#0C2340',
      ticker: ['Local pickup for apparel & hats in Auburn'],
      hero: {
        eyebrow: 'Game Day on the Plains',
        line1: 'Show up proud.',
        line2: 'Wear it again on Tuesday.',
        body: 'Cute, comfy, and made to wear long after the final whistle. Designed in-house in Auburn, a few miles from Jordan-Hare.',
        ctas: [
          { label: 'Shop Auburn', href: 'auburn.html' },
          { label: 'In stock now', href: 'shop.html?c=auburn-university-in-stock-items', rule: 'auburn-university-in-stock-items' }
        ],
        cols: '1fr 1fr 1fr',
        images: [   // images[0] is preloaded by the inline <head> script in index.html: keep them in sync
          { img: ['auburn-blue-cropped-crewneck-model'], pos: '50% 12%' },
          { img: ['auburn-tee-grid-flatlay'], pos: '50% 50%' },
          { img: ['auburn-embroidered-crewneck-model'], pos: '50% 12%' }
        ]
      },
      intro: {
        eyebrow: 'Game coming up?',
        title: 'In stock ships in <em>5–7 business days.</em>',
        body: 'In Stock styles are already made and waiting in our warehouse. Tees, fleece and client collections are printed or embroidered for you in our Auburn shop in 10–14 business days.',
        cta: { label: 'Shop in stock', href: 'shop.html?c=auburn-university-in-stock-items', rule: 'auburn-university-in-stock-items' }
      },
      tiles: {
        tone: 'scarlet',
        pill: 'Saturday checklist',
        title: 'Ready for <em>kickoff.</em>',
        items: [
          { t: 'Tees & fleece', sub: 'Auburn adult tees & fleece', c: 'auburn-adult-apparel', img: ['auburn-tee-grid-flatlay-2', { k: 'aubie-tee-flatlay', pos: '32% 50%' }], pos: '50% 50%' },
          { t: 'Cheer dresses', sub: 'Sizes 12M–10', c: 'girls-cheer-dresses', rule: true, extra: { school: 'auburn' }, img: ['rule:girls-cheer-dresses'],
            made: { tone: 'gold', patch: 'Auburn cheer', dot: true } },
          { t: 'The Alli', sub: 'Tank & skort', c: 'the-alli-collection', img: [{ k: 'war-eagle-tank-skort-torso', torso: true }, { k: 'four-models-sets', pos: '50% 30%' }] },
          { t: 'Hats', sub: 'Local pickup in Auburn', c: 'auburn-hat-collection-1', rule: true, img: ['col:auburn-hat-collection-1', { k: 'p:the-vintage-war-eagle-hat-navy-natural#1', pos: '50% 30%' }, 'rule:auburn-hat-collection-1'],
            made: { tone: 'ivory', patch: 'Auburn hats', dot: true } }
        ]
      },
      featured: { c: 'auburn-university-in-stock-items', eyebrow: 'Ready for game week', title: 'Auburn, <em>in stock now</em>', more: 'Shop in stock' }
    },

    hoops: {
      id: 'hoops', label: 'Hoops', nav: 'Hoops', dates: 'Jan 1 – Mar 15',
      from: [1, 1], to: [3, 15], accent: 'navy', logo: 'assets/logo-ball.png', themeColor: '#13294B',
      ticker: ['The Original Aubie Collection, in collaboration with Scarlet & Gold'],
      hero: {
        eyebrow: 'The Original Aubie Collection',
        line1: 'Courtside,',
        line2: 'in Auburn colors.',
        body: 'The Original Aubie basketball collection, made in collaboration with Scarlet & Gold. Cozy layers for the tip-off, designed in Auburn.',
        ctas: [
          { label: 'Shop Original Aubie', href: 'shop.html?c=original-aubie-basketball' },
          { label: 'Auburn basketball', href: 'shop.html?c=auburn-basketball', rule: 'auburn-basketball' }
        ],
        cols: '1fr 1.5fr 1fr',
        images: [   // images[0] is preloaded by the inline <head> script in index.html: keep them in sync
          { img: ['auburn-embroidered-crewneck-model'], pos: '50% 12%' },
          { img: [{ k: 'original-aubie-collab', fit: 'contain', bg: '#F1E9DC' }] },
          { img: ['auburn-blue-cropped-crewneck-model'], pos: '50% 12%' }
        ]
      },
      intro: {
        eyebrow: 'Local to Auburn?',
        title: 'Order online. <em>Pick up in store.</em>',
        body: 'Local pickup is available for apparel and hats at our shop on Shug Jordan Parkway. Or come try things on — you might even meet the team behind your order.',
        cta: { label: 'Plan a visit', href: 'visit.html' }
      },
      tiles: {
        tone: 'scarlet',
        pill: 'Cozy season',
        title: 'Courtside <em>& cozy.</em>',
        items: [
          { t: 'Auburn basketball', sub: 'The Original Aubie & more', c: 'auburn-basketball', rule: true, img: ['col:auburn-basketball', 'p:the-basketball-aubie-navy-sweatshirt'],
            made: { tone: 'gold', patch: 'Auburn basketball', dot: true } },
          { t: 'The Ava', sub: 'Airy crewneck & shorts', c: 'the-ava-collection', img: [{ k: 'ava-airy-set-two-models', pos: '50% 20%' }] },
          { t: 'Hats', sub: 'Local pickup in Auburn', c: 'auburn-hat-collection-1', rule: true, img: ['col:auburn-hat-collection-1', { k: 'p:the-vintage-war-eagle-hat-navy-natural#1', pos: '50% 30%' }, 'rule:auburn-hat-collection-1'],
            made: { tone: 'ivory', patch: 'Auburn hats', dot: true } },
          { t: 'Tees & fleece', sub: 'Auburn adult tees & fleece', c: 'auburn-adult-apparel', img: [{ k: 'aubie-tee-flatlay', pos: '32% 50%' }, 'auburn-tee-grid-flatlay-2'] }
        ]
      },
      featured: { c: 'original-aubie-basketball', eyebrow: 'In collaboration with Scarlet & Gold', title: 'The Original <em>Aubie</em>', more: 'Shop the collection' }
    },

    spring: {
      id: 'spring', label: 'Spring', nav: 'Spring', dates: 'Mar 16 – Aug 14',
      from: [3, 16], to: [8, 14], accent: 'scarlet', logo: 'assets/logo-sage.png', themeColor: '#2F5D50',
      ticker: ['Auburn baseball & gymnastics collections'],
      hero: {
        eyebrow: 'Spring on the Plains',
        line1: 'Ballpark days,',
        line2: 'sunny Saturdays.',
        body: 'Auburn baseball and gymnastics, the Alli tank & skort and Grace gingham dresses for warm-weather game days.',
        ctas: [
          { label: 'Shop Auburn baseball', href: 'shop.html?c=auburn-baseball' },
          { label: 'The Alli Collection', href: 'shop.html?c=the-alli-collection' }
        ],
        cols: '1fr 1.5fr 1fr',
        images: [   // images[0] is preloaded by the inline <head> script in index.html: keep them in sync
          { img: ['auburn-embroidered-crewneck-model'], pos: '50% 12%' },
          { img: ['auburn-tee-grid-flatlay-2'], pos: '50% 50%' },
          { img: ['auburn-blue-cropped-crewneck-model'], pos: '50% 12%' }
        ]
      },
      intro: {
        eyebrow: 'Get on the List',
        title: 'First looks at <em>every launch.</em>',
        body: 'Our favorite styles sell out fast. Get early access to new drops, restock alerts, and 15% off your first order.',
        cta: { label: 'Join the List', href: '#sg-list' }
      },
      tiles: {
        tone: 'scarlet',
        pill: 'Warm-weather game days',
        title: 'Made for <em>the sunshine.</em>',
        items: [
          { t: 'The Alli', sub: 'Tank & skort', c: 'the-alli-collection', img: [{ k: 'war-eagle-tank-skort-torso', torso: true }, { k: 'four-models-sets', pos: '50% 30%' }] },
          { t: 'Hats', sub: 'Local pickup in Auburn', c: 'auburn-hat-collection-1', rule: true, img: ['col:auburn-hat-collection-1', { k: 'p:the-vintage-war-eagle-hat-navy-natural#1', pos: '50% 30%' }, 'rule:auburn-hat-collection-1'],
            made: { tone: 'gold', patch: 'Auburn hats', dot: true } },
          { t: 'Grace gingham', sub: 'Dresses', c: 'grace-gingham-dresses', img: [{ k: 'grace-gingham-dresses-three-models', pos: '50% 8%' }] },
          { t: 'The Ava', sub: 'Airy crewneck & shorts', c: 'the-ava-collection', img: [{ k: 'ava-airy-set-two-models', pos: '50% 20%' }],
            made: { tone: 'ivory', patch: 'The Ava' } }
        ]
      },
      featured: { c: 'the-alli-collection', eyebrow: 'Tank & skort', title: 'The <em>Alli</em>', more: 'Shop the Alli' }
    }
  };

  // Shared ticker is appended to each chapter's own messages.
  Object.keys(CH).forEach(function (k) { CH[k].ticker = CH[k].ticker.concat(SHARED_TICKER); });
  var ORDER = ['football', 'christmas', 'hoops', 'spring'];   // Auburn's calendar, from August
  window.SG_CHAPTERS = CH;
  SG.chapterOrder = ORDER;

  // ---------- resolve by date (America/Chicago) ----------
  function chicagoMonthDay(date) {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', month: 'numeric', day: 'numeric' }).formatToParts(date);
    var m = 0, d = 0;
    parts.forEach(function (p) { if (p.type === 'month') m = +p.value; if (p.type === 'day') d = +p.value; });
    return [m, d];
  }
  function inRange(md, from, to) {
    var v = md[0] * 100 + md[1], a = from[0] * 100 + from[1], b = to[0] * 100 + to[1];
    return a <= b ? (v >= a && v <= b) : (v >= a || v <= b);
  }
  SG.chapterFor = function (date) {
    var md = chicagoMonthDay(date || new Date());
    for (var i = 0; i < ORDER.length; i++) { var c = CH[ORDER[i]]; if (inRange(md, c.from, c.to)) return c; }
    return CH.christmas;
  };

  var KEY = 'sg_chapter';
  SG.currentChapter = function () {
    var q = null;
    try { q = new URLSearchParams(location.search).get('chapter'); } catch (e) { q = null; }
    if (q === 'auto' || q === 'today') {
      try { sessionStorage.removeItem(KEY); } catch (e) { /* storage blocked */ }
    } else if (q && Object.prototype.hasOwnProperty.call(CH, q)) {
      try { sessionStorage.setItem(KEY, q); } catch (e) { /* storage blocked */ }
      return CH[q];
    }
    var s = null;
    try { s = sessionStorage.getItem(KEY); } catch (e) { s = null; }
    if (s && Object.prototype.hasOwnProperty.call(CH, s)) return CH[s];
    return SG.chapterFor(new Date());
  };
  SG.isChapterOverride = function () { return SG.currentChapter().id !== SG.chapterFor(new Date()).id; };

  /*
   * Season themes: the resolved chapter goes on <html data-chapter> (sg-themes.css keys every colour off it). The inline
   * <head> script on each page sets it before first paint; this corrects it if the two ever disagree, and points the
   * browser-chrome colour (theme-color) and the SVG favicon at the chapter's --scarlet-deep.
   */
  SG.applyChapterTheme = function () {
    var c = SG.currentChapter(), root = document.documentElement;
    if (root.getAttribute('data-chapter') !== c.id) root.setAttribute('data-chapter', c.id);
    var deep = c.themeColor || '#7C1019', mark = { football: '#F59A4A', hoops: '#F2B36B', spring: '#F7E08F' }[c.id] || '#E2BE77';
    var tc = document.querySelector('meta[name="theme-color"]');
    if (tc && tc.getAttribute('content') !== deep) tc.setAttribute('content', deep);
    var ic = document.querySelector('link[rel="icon"]');
    if (ic && c.id !== 'christmas') {
      ic.setAttribute('href', 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='" + deep +
        "'/><text x='32' y='45' font-family='Georgia,serif' font-size='40' font-style='italic' text-anchor='middle' fill='" + mark + "'>&amp;</text></svg>"));
    }
  };
  SG.applyChapterTheme();

  // ---------- "Preview a season" pill (part of the pitch: lets a reviewer switch chapters) ----------
  function urlWithChapter(id) {
    var u = new URL(location.href);
    u.searchParams.set('chapter', id);
    return u.pathname.split('/').pop() + u.search + u.hash;
  }
  SG.chapterPill = function () {
    if (document.querySelector('.chap')) return;
    var cur = SG.currentChapter(), today = SG.chapterFor(new Date());
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var box = document.createElement('div');
    box.className = 'chap';
    box.innerHTML =
      '<div class="chap__panel" id="sg-chap-panel" hidden>' +
        '<p class="chap__h">Preview a season</p>' +
        '<p class="chap__p">The shop re-dresses itself on Auburn’s calendar. Today it’s <strong>' + esc(today.label) + '</strong>.</p>' +
        '<ul class="chap__list">' + ORDER.map(function (id) {
          var c = CH[id];
          return '<li><a class="chap__opt" href="' + esc(urlWithChapter(id)) + '"' + (c.id === cur.id ? ' aria-current="true"' : '') + '>' +
            '<strong>' + esc(c.label) + '</strong><small>' + esc(c.dates) + '</small></a></li>';
        }).join('') + '</ul>' +
        (cur.id !== today.id ? '<a class="chap__reset" href="' + esc(urlWithChapter('auto')) + '">Back to today’s season</a>' : '') +
      '</div>' +
      '<button type="button" class="chap__btn" aria-expanded="false" aria-controls="sg-chap-panel">' +
        '<b aria-hidden="true">★</b><span class="chap__lbl">Preview a season</span><span class="sr"> (now showing ' + esc(cur.label) + ')</span>' +
      '</button>';
    document.body.appendChild(box);
    var btn = box.querySelector('.chap__btn'), panel = box.querySelector('.chap__panel');
    /*
     * Visibility: shown unless (a) the visitor is scrolling down, or (b) the button would sit on top of anything they
     * read or use: a link, button or field (a hero CTA on a phone, a chip on a laptop…) or any visible TEXT (a headline,
     * a paragraph, an address line). Home corner: bottom-left on desktop, bottom-right on phones (clear of left-aligned
     * copy). When the home corner is busy and the opposite bottom corner is clear, it uses that one (.chap--alt), e.g.
     * beside the shop's sticky filter column. It only changes corner while tucked, so it never jumps across a screen.
     * Checked on load, once web fonts are in (they reflow the hero), when scrolling settles and on resize; while the
     * panel is open it always shows and stays put. The geometry is the collapsed 44px button's
     * untransformed box (offsetLeft/Top ignore the tuck transform) plus a small margin, so the check is the same whether
     * it is currently shown or not.
     */
    var SEL = 'a[href], button, input, select, textarea, summary, label, [role="button"], [tabindex]:not([tabindex="-1"])';
    var PAD = 4;
    var scrollingDown = false, covering = false;
    // both candidate boxes, from the anchored edge (the label can be slid out, so the width is the collapsed 44px)
    function spots() {
      var vw = document.documentElement.clientWidth, S = 44;
      var t = box.offsetTop + btn.offsetTop, b = t + btn.offsetHeight;
      var leftSide = box.offsetLeft + box.offsetWidth / 2 < vw / 2;
      var inset = leftSide ? box.offsetLeft : vw - (box.offsetLeft + box.offsetWidth);
      var L = { left: inset - PAD, top: t - PAD, right: inset + S + PAD, bottom: b + PAD };
      var R = { left: vw - inset - S - PAD, top: t - PAD, right: vw - inset + PAD, bottom: b + PAD };
      var alt = box.classList.contains('chap--alt');
      var cur = leftSide ? L : R, other = leftSide ? R : L;
      return { cur: cur, home: alt ? other : cur, alt: alt ? cur : other };
    }
    // overlap of two rects, at least 2px each way (ignores hairline touches and 1px visually-hidden boxes)
    function meets(a, b) { return Math.min(a.right, b.right) - Math.max(a.left, b.left) >= 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) >= 2; }
    // is the part of text rect `tr` under the pill actually painted? (not transparent, not clipped away by a scroller/overflow box)
    function painted(el, tr, r) {
      var cs = getComputedStyle(el);
      if (cs.visibility === 'hidden') return false;
      var v = { left: Math.max(tr.left, r.left), top: Math.max(tr.top, r.top), right: Math.min(tr.right, r.right), bottom: Math.min(tr.bottom, r.bottom) };
      for (var a = el; a && a !== document.body; a = a.parentElement) {
        var s = a === el ? cs : getComputedStyle(a);
        if (+s.opacity < 0.05) return false;
        if (s.overflowX !== 'visible' || s.overflowY !== 'visible' || s.clipPath !== 'none') {
          var b = a.getBoundingClientRect();
          v = { left: Math.max(v.left, b.left), top: Math.max(v.top, b.top), right: Math.min(v.right, b.right), bottom: Math.min(v.bottom, b.bottom) };
          if (v.right - v.left < 2 || v.bottom - v.top < 2) return false;
        }
      }
      return true;
    }
    function coversText(r) {
      var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), rg = document.createRange(), t;
      while ((t = w.nextNode())) {
        if (!/\S/.test(t.data)) continue;
        var el = t.parentElement;
        // text paints inside its parent's box, so that box is a cheap first filter before measuring the glyph runs
        if (!el || box.contains(el)) continue;
        var pb = el.getBoundingClientRect();
        if (!pb.width || !pb.height || !meets(pb, r) || el.closest('.sr, script, style, noscript, template')) continue;
        rg.selectNodeContents(t);
        var rs = rg.getClientRects();
        for (var i = 0; i < rs.length; i++) if (meets(rs[i], r) && painted(el, rs[i], r)) return true;
      }
      return false;
    }
    function coversSomething(r) {
      var els = document.querySelectorAll(SEL);
      for (var i = 0; i < els.length; i++) {
        var e = els[i];
        if (box.contains(e)) continue;
        var b = e.getBoundingClientRect();
        if (!b.width || !b.height || b.right <= r.left || b.left >= r.right || b.bottom <= r.top || b.top >= r.bottom) continue;
        if (e.closest('[hidden], [inert]') || getComputedStyle(e).visibility === 'hidden') continue;
        return true;
      }
      return coversText(r);
    }
    var FADE = 380, tuckedAt = -1e9, swapT = null;   // FADE ≥ the .35s tuck transition in sg.css
    function apply() {
      var tuck = panel.hidden && (scrollingDown || covering);
      if (tuck && !box.classList.contains('is-tucked')) tuckedAt = Date.now();
      box.classList.toggle('is-tucked', tuck);
    }
    function later(ms) { clearTimeout(swapT); swapT = window.setTimeout(check, ms); }
    function check() {
      // a modal (menu, bag, search) is open, or the panel is: leave the pill where it is
      if (!panel.hidden || document.body.classList.contains('is-locked')) { apply(); return; }
      var g = spots(), alt = box.classList.contains('chap--alt');
      var curFree = !coversSomething(g.cur);
      var hiddenFor = box.classList.contains('is-tucked') ? Date.now() - tuckedAt : -1;
      // shown (or still fading out): keep this corner while it is clear; otherwise tuck, and choose a corner once hidden
      if (curFree && (hiddenFor < 0 || !alt || hiddenFor < FADE)) { covering = false; apply(); return; }
      if (hiddenFor < FADE) { covering = true; apply(); later(FADE - Math.max(0, hiddenFor) + 20); return; }
      var other = alt ? g.home : g.alt;
      // hidden: prefer the home corner, else the opposite one, else stay tucked
      var homeFree = alt ? !coversSomething(g.home) : curFree;
      if (homeFree) { if (alt) box.classList.remove('chap--alt'); covering = false; }
      else if (alt ? curFree : !coversSomething(other)) { if (!alt) box.classList.add('chap--alt'); covering = false; }
      else covering = true;
      apply();
    }
    function set(open) { panel.hidden = !open; btn.setAttribute('aria-expanded', String(open)); apply(); }
    btn.addEventListener('click', function () { set(panel.hidden); });
    // First reveal once the page has loaded (sections rendered, web fonts normally in), then again if fonts land later,
    // so it doesn't appear on the pre-font layout and then hop away.
    box.classList.add('is-tucked');
    function firstCheck() { check(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(check); }
    if (document.readyState === 'complete') firstCheck(); else window.addEventListener('load', firstCheck, { once: true });
    var lastY = window.scrollY, ticking = false, settleT = null;
    window.addEventListener('scroll', function () {
      clearTimeout(settleT);
      settleT = window.setTimeout(check, 140);
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY, dy = y - lastY;
        if (Math.abs(dy) > 6) {
          scrollingDown = dy > 0 && y > 240;
          if (!scrollingDown) check();   // coming back up: only reappear on a clear spot
          else apply();
          lastY = y;
        }
        ticking = false;
      });
    }, { passive: true });
    window.addEventListener('resize', function () { clearTimeout(settleT); settleT = window.setTimeout(check, 140); });
    document.addEventListener('click', function (e) {
      if (box.contains(e.target) || panel.hidden) return;
      set(false);
      check();   // closed by a click elsewhere: the page may have moved under it while it was open
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
  };
})();
