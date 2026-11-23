/* ==========================================================================
   Scarlet & Gold — shared runtime (assets/sg.js)
   Plain ES2019, no modules, no frameworks. Load order (all `defer`):
     data.js → assets/sg-chapters.js → assets/sg.js → assets/<page>.js
   On load it injects the ticker, header (+ nav, mega menus), phone menu,
   search overlay, bag drawer, toast, footer and the season pill, and fills
   any [data-sg="visit|reviews|schools"] mounts. Page scripts then use the
   helpers on window.SG. Contract: brief/components.md
   ========================================================================== */
(function () {
  'use strict';

  var SG = window.SG = window.SG || {};
  var D = window.SG_DATA;
  if (!D) throw new Error('Scarlet & Gold: data.js must load before assets/sg.js');
  if (typeof SG.currentChapter !== 'function') throw new Error('Scarlet & Gold: assets/sg-chapters.js must load before assets/sg.js');

  SG.data = D;
  var PRODUCTS = D.products || [];
  var COLS = D.cols || {};
  var BY_H = Object.create(null);
  PRODUCTS.forEach(function (p) { BY_H[p.h] = p; });
  SG.chapter = SG.currentChapter();
  var CH = SG.chapter;

  /* ======================================================================
     Basic helpers
     ====================================================================== */
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  SG.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); };

  var WIDTHS = [200, 400, 600, 900, 1200, 1600];
  /** Image URL. Local paths (img/, assets/, http) pass through; catalogue paths get the Shopify CDN + ?width= (200/400/600/900/1200/1600). */
  SG.img = function (path, w) {
    if (!path) return '';
    if (/^(https?:)?\/\//.test(path) || /^(img|assets)\//.test(path) || path.indexOf('data:') === 0) return path;
    var want = w || 600, ww = 1600;
    for (var i = 0; i < WIDTHS.length; i++) { if (WIDTHS[i] >= want) { ww = WIDTHS[i]; break; } }
    return D.cdn + path + (path.indexOf('?') > -1 ? '&' : '?') + 'width=' + ww;
  };

  SG.money = function (n) {
    n = Number(n);
    if (!isFinite(n)) return '';
    return '$' + (Math.round(n * 100) % 100 ? n.toFixed(2) : String(Math.round(n)));
  };

  /** "The Brooke Crewneck | Orange & Blue Striped" → name + a muted variant line (cls__name / cls__var), so the pipe never starts a line */
  SG.titleHTML = function (t, cls, hideName) {
    t = String(t || '');
    var i = t.lastIndexOf(' | ');
    if (i < 3 || i > t.length - 4) return SG.esc(t);
    var a = t.slice(0, i), b = t.slice(i + 3);
    // one-line rails (the rail head already names the line): the variant is the title ("Ice Blue Fleece Crew")
    if (hideName) return '<span class="' + cls + '__name">' + SG.esc(b.replace(/^adult\s+/i, '')) + '</span><span class="sr"> (' + SG.esc(a) + ')</span>';
    // "The Auburn University | Navy Classic Cheer Dress": the product leads, the school is the muted line
    if (/^the (collegiate )?auburn university$/i.test(a)) return '<span class="' + cls + '__name">' + SG.esc(b) + '</span><span class="sr"> | </span><span class="' + cls + '__var">' + SG.esc(a) + '</span>';
    return '<span class="' + cls + '__name">' + SG.esc(a) + '</span><span class="sr"> | </span><span class="' + cls + '__var">' + SG.esc(b) + '</span>';
  };

  SG.qs = function (name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } };

  /** shop.html URL from a params object: {c, school, who, cat, ship, size, color, price, sale, sort, q}. Arrays join with commas. */
  SG.shopUrl = function (params) {
    var u = new URLSearchParams();
    Object.keys(params || {}).forEach(function (k) {
      var v = params[k];
      if (v == null || v === '' || (Array.isArray(v) && !v.length)) return;
      u.set(k, Array.isArray(v) ? v.join(',') : String(v));
    });
    var s = u.toString();
    return 'shop.html' + (s ? '?' + s : '');
  };
  SG.productUrl = function (h) { return 'product.html?h=' + encodeURIComponent(h); };

  /* ======================================================================
     Catalogue
     ====================================================================== */
  SG.product = function (h) { return BY_H[h] || null; };

  /** Products in a collection, in their merch order. Falls back to p.cols membership if items[] is empty. */
  SG.collection = function (h) {
    var c = COLS[h];
    if (!c) return [];
    var list = (c.items || []).map(SG.product).filter(Boolean);
    if (!list.length) list = PRODUCTS.filter(function (p) { return p.cols && p.cols.indexOf(h) > -1; });
    return list;
  };

  /** Several collections merged in order, de-duplicated. */
  SG.collections = function (handles) {
    var seen = Object.create(null), out = [];
    (handles || []).forEach(function (h) {
      SG.collection(h).forEach(function (p) { if (!seen[p.h]) { seen[p.h] = 1; out.push(p); } });
    });
    return out;
  };

  /** Filter products. f: {cols:[], sch, who, cat (string|array), ship, avail:true, sale:true, q, limit} */
  SG.products = function (f) {
    f = f || {};
    var list = f.cols ? SG.collections(f.cols) : PRODUCTS.slice();
    var cats = f.cat ? [].concat(f.cat) : null;
    var toks = f.q ? String(f.q).toLowerCase().split(/\s+/).filter(Boolean) : null;
    list = list.filter(function (p) {
      if (f.sch && p.sch !== f.sch) return false;
      if (f.who && p.who !== f.who) return false;
      if (cats && cats.indexOf(p.cat) < 0) return false;
      if (f.ship && p.ship !== f.ship) return false;
      if (f.avail && !p.av) return false;
      if (f.sale && !(p.cp && p.cp > p.p)) return false;
      if (toks) {
        var hay = (p.t + ' ' + (p.sch || '') + ' ' + (p.ty || '') + ' ' + (p.cat || '')).toLowerCase();
        for (var i = 0; i < toks.length; i++) if (hay.indexOf(toks[i]) < 0) return false;
      }
      return true;
    });
    return f.limit ? list.slice(0, f.limit) : list;
  };

  /* ---------- partial data (brief/data-schema.md "Partial data") ----------
     SG.loaded(h)   → how many of collection h's products this preview actually has (0 = not loaded)
     SG.total(h)    → THEIR real total for h (cols[h].n), or null
     SG.isPartial(h)→ loaded, but fewer than their total: say "the first N of M", never imply it is everything
     SG.liveUrl(h)  → their live collection page (where the rest is)
     SG.fromAuburn(h) → for an Auburn department/feature collection that is NOT loaded, the matching pieces of the loaded
       main Auburn collection by a rule read from their own data (audience, category, their in-stock tags, their tags or
       the line their titles name), with a shop URL that lists exactly those pieces. Callers label the result by that
       rule (Women, Hats, In stock now…), never with the unloaded collection's name. null when h is loaded, has no rule,
       or nothing matches. */
  SG.loaded = function (h) { return SG.collection(h).length; };
  SG.total = function (h) { return COLS[h] && COLS[h].n ? Number(COLS[h].n) : null; };
  SG.isPartial = function (h) { var n = SG.loaded(h), t = SG.total(h); return !!(n && t && n < t); };
  SG.liveUrl = function (h) { return 'https://scarletandgoldshop.com/collections/' + encodeURIComponent(h); };
  var titleLine = function (name) { var rx = new RegExp('^the ' + name + '\\b', 'i'); return function (p) { return rx.test(p.t || ''); }; };
  var hasTag = function (tag) { return function (p) { return (p.tags || []).some(function (t) { return String(t).toLowerCase() === tag; }); }; };
  /* department rails list clothing only (no blanket in Women); program-webstore pieces and kids-cut pieces in an adult
     department are kept (so the shop link's count still matches) but go to the back of the rail */
  var WEAR = ['cheer-dress', 'dress', 'set', 'skort', 'shorts', 'tank', 'mockneck', 'quarter-zip', 'crewneck', 'long-sleeve', 'tee', 'other'];
  var wear = function (p) { return WEAR.indexOf(p.cat) > -1; };
  var DERIVE = {
    'auburn-womens-specialty': [{ who: 'women', cat: WEAR }, function (p) { return p.who === 'women' && wear(p); }, 'adult'],
    'auburn-adult-apparel': [{ who: 'women', cat: ['tee', 'long-sleeve', 'crewneck', 'quarter-zip'] }, function (p) { return p.who === 'women' && ['tee', 'long-sleeve', 'crewneck', 'quarter-zip'].indexOf(p.cat) > -1; }],
    'auburn-kids-specialty': [{ who: 'kids', cat: WEAR }, function (p) { return p.who === 'kids' && wear(p); }],
    'auburn-kids-apparel': [{ who: 'kids', cat: ['tee', 'long-sleeve', 'crewneck', 'quarter-zip'] }, function (p) { return p.who === 'kids' && ['tee', 'long-sleeve', 'crewneck', 'quarter-zip'].indexOf(p.cat) > -1; }],
    'auburn-mens-collection': [{ who: 'men', cat: WEAR }, function (p) { return p.who === 'men' && wear(p); }, 'adult'],
    'auburn-hat-collection-1': [{ cat: ['hat'] }, function (p) { return p.cat === 'hat'; }],
    'auburn-accessories-gifts': [{ cat: ['accessory', 'scarf', 'bow'] }, function (p) { return ['accessory', 'scarf', 'bow'].indexOf(p.cat) > -1; }],
    'auburn-university-in-stock-items': [{ ship: 'in' }, function (p) { return SG.shipKind(p) === 'in' && !SG.isSoldOut(p); }],   // in stock NOW: sold-out pieces never count
    'girls-cheer-dresses': [{ cat: ['cheer-dress'] }, function (p) { return p.cat === 'cheer-dress'; }],
    'closeout-sale': [{ sale: '1' }, function (p) { return !!(p.cp && p.cp > p.p); }],   // pieces with a compare-at price, NOT their Closeout Sale collection
    'auburn-basketball': [{ q: 'basketball' }, function (p) { return hasTag('basketball')(p) && /basketball/i.test(p.t); }],
    'original-aubie-basketball': [{ q: 'original aubie' }, function (p) { return hasTag('original-aubie-basketball')(p) && /original aubie/i.test(p.t); }],
    'the-alli-collection': [{ q: 'the alli' }, titleLine('alli')], 'the-ava-collection': [{ q: 'the ava airy' }, titleLine('ava airy')],
    'the-becca-collection': [{ q: 'the becca' }, titleLine('becca')], 'the-kristen-collection': [{ q: 'the kristen' }, titleLine('kristen')],
    'mallory-gingham-mocknecks': [{ q: 'the mallory' }, titleLine('mallory')], 'grace-gingham-dresses': [{ q: 'the grace' }, titleLine('grace')],
    'the-madi-collection': [{ q: 'the madi' }, titleLine('madi')]
  };
  // not a collection of theirs: a rule-labelled stand-in ("Auburn gifts, in stock now") while S&G Christmas isn't loaded
  DERIVE['auburn-gifts-in-stock'] = [{ cat: ['accessory', 'scarf', 'bow'], ship: 'in' }, function (p) { return ['accessory', 'scarf', 'bow'].indexOf(p.cat) > -1 && SG.shipKind(p) === 'in' && !SG.isSoldOut(p); }];
  DERIVE['auburn-in-stock-sale-eligible'] = DERIVE['auburn-university-in-stock-items'];
  DERIVE['auburn-mens-specialty'] = DERIVE['auburn-mens-collection'];
  // unloaded sibling collections land on their department's loaded pieces (labelled by the rule, never by their name)
  DERIVE['auburn-girls-collection'] = DERIVE['auburn-kids-specialty'];
  DERIVE['auburn-adult-tees-fleece-2026'] = DERIVE['auburn-adult-apparel'];
  SG.fromAuburn = function (h) {
    var r = DERIVE[h];
    if (!r || SG.loaded(h) || !SG.loaded('auburn')) return null;
    var list = SG.collection('auburn').filter(function (p) { return p.sch === 'auburn' && r[1](p); });
    if (!list.length) return null;
    var kidCut = /\b(kids?|youth|toddler|baby|infant)\b/i;
    list = list.map(function (p, i) { return [p, (isProgramPiece(p) ? 2 : 0) + (r[2] === 'adult' && (kidCut.test(p.t) || kidCut.test(p.h.replace(/-/g, ' '))) ? 1 : 0), i]; })
      .sort(function (a, b) { return a[1] - b[1] || a[2] - b[2]; }).map(function (x) { return x[0]; });
    var u = { c: 'auburn', school: 'auburn' };   // school=auburn: the shop view lists exactly these (no multi-school basics)
    Object.keys(r[0]).forEach(function (k) { u[k] = r[0][k]; });
    return { products: list, url: SG.shopUrl(u), who: r[0].who || null };   // who: a Women / Men rule prices cards from adult sizes
  };

  /**
   * SG.ctaUrl(h, extra) → where a button labelled by a RULE (Shop women, Shop in stock, Gifts, Cheer, Sale…) should go:
   * the collection when it is loaded; else, when at least 4 loaded Auburn pieces match its rule, the shop view of
   * exactly those pieces; else the collection page (which explains it loads from their catalogue). Links that NAME an
   * unloaded collection (Women's Specialty, Tees & Fleece 2026, S&G Christmas) keep SG.shopUrl({c}).
   */
  SG.ctaUrl = function (h, extra) {
    var u = { c: h };
    Object.keys(extra || {}).forEach(function (k) { u[k] = extra[k]; });
    if (SG.loaded(h)) return SG.shopUrl(u);
    var d = SG.fromAuburn(h);
    return d && d.products.length >= 4 ? d.url : SG.shopUrl(u);
  };

  /** Stable sort: Auburn products first, merch order otherwise. */
  SG.auburnFirst = function (list) {
    return list.map(function (p, i) { return [p, i]; })
      .sort(function (a, b) { return ((a[0].sch === 'auburn') ? 0 : 1) - ((b[0].sch === 'auburn') ? 0 : 1) || a[1] - b[1]; })
      .map(function (x) { return x[0]; });
  };

  SG.school = function (slug) {
    for (var i = 0; i < (D.schools || []).length; i++) if (D.schools[i].slug === slug) return D.schools[i];
    return null;
  };

  /**
   * SG.shipKind(p) → 'in' | 'mto' | 'vendor' | 'check'. The FAQ (source/faq.txt) only makes these claims:
   *   in     — In Stock items ship in 5–7 business days (p.ship === 'in', from an In Stock collection)
   *   mto    — Made to Order is "our tees, fleece and Client Collections", printed or embroidered in Auburn, 10–14 business days
   *   vendor — accessories (stickers, notebooks, bottles…) "ship directly from our manufacturer"
   *   check  — anything else not in an In Stock collection: no timeline is claimed ("check the shipping timeline")
   * Full data: data.js marks every non-in-stock piece 'mto', so the finer split is derived here from category + collections.
   * Partial data (D.partial.ship === 'tags', see brief/data-schema.md): p.ship was read from THEIR tags/vendor and is
   * honoured as is: 'in' and 'mto' claim their FAQ timelines, null claims nothing ('check'). Never guessed from category.
   */
  var MTO_CATS = { tee: 1, 'long-sleeve': 1, crewneck: 1, 'quarter-zip': 1, mockneck: 1 };
  var VENDOR_CATS = { accessory: 1, bow: 1, book: 1, scarf: 1 };
  var PROGRAM_COLS = Object.create(null);
  (D.programs || []).forEach(function (pr) { if (pr.h) PROGRAM_COLS[pr.h] = 1; });
  var SHIP_FROM_TAGS = !!(D.partial && D.partial.ship === 'tags');
  SG.shipKind = function (p) {
    if (!p) return 'check';
    if (p.ship === 'in') return 'in';
    if (SHIP_FROM_TAGS) return p.ship === 'mto' ? 'mto' : 'check';
    if (VENDOR_CATS[p.cat]) return 'vendor';
    var cols = p.cols || [];
    var client = cols.some(function (c) { return PROGRAM_COLS[c]; });
    var teesFleece = !!MTO_CATS[p.cat] && cols.some(function (c) { return /-(apparel|tees-fleece(-\d+)?)$/.test(c); });
    return (client || teesFleece) ? 'mto' : 'check';
  };
  /** Sold out: every variant gone (data.js p.av === 0). Cards, the PDP and shipping labels all ask this one helper. */
  SG.isSoldOut = function (p) { return !!p && (p.av === 0 || p.av === false); };
  /**
   * Card micro-label (short) or PDP wording (long=true) for SG.shipKind(p). A sold-out piece claims no ship time at
   * all ("Sold out for now"); SG.shipKind(p) still says how it ships once it is back (used by the shop's Ships filter).
   */
  SG.shipLabel = function (p, long) {
    if (SG.isSoldOut(p)) return 'Sold out for now';
    var k = SG.shipKind(p);
    if (k === 'in') return long ? 'In stock · ships in 5–7 business days' : 'Ships in 5–7 days';
    if (k === 'mto') return long ? 'Made for you in our Auburn shop · ships in 10–14 business days' : 'Made for you · 10–14 days';
    if (k === 'vendor') return 'Ships from our manufacturer';
    return long ? 'Ship time depends on the piece' : 'Ship time varies';
  };

  /** Swatch colour for a colour option name. */
  var COLORS = {
    navy: '#1F2A4A', midnight: '#1B2236', white: '#FFFFFF', 'off white': '#F4EFE4', ivory: '#F6F0E1', cream: '#F2E8D5', natural: '#EFE6D2', oatmeal: '#E3D8C3',
    sand: '#D9C7A6', tan: '#C9A97E', khaki: '#BFAE86', orange: '#E2621B', 'burnt orange': '#BF5700', red: '#C42A2F', crimson: '#9E1B32', cardinal: '#9D2235',
    garnet: '#73000A', maroon: '#5D1725', burgundy: '#6D1F2E', wine: '#6A2235', black: '#1A1A1A', charcoal: '#3E4045', grey: '#A7A9AC', gray: '#A7A9AC',
    'heather grey': '#B9B9B9', 'heather gray': '#B9B9B9', heather: '#B9B9B9', ash: '#D3D3D0', silver: '#C8C9CB', blue: '#3D6FB6', royal: '#2350A0',
    'light blue': '#A9C6E3', 'powder blue': '#B7D0E8', 'carolina blue': '#7BAFD4', 'columbia blue': '#9BC4E2', 'baby blue': '#BCD6EE', denim: '#5A7397',
    purple: '#5B3A8C', lavender: '#C3B4DC', lilac: '#C8A9D6', pink: '#F1A7C1', 'light pink': '#F6CCD9', blush: '#F2CFC6', rose: '#D9879A', coral: '#EE7D6B',
    peach: '#F6C3A0', yellow: '#F2C94C', gold: '#C9A44C', mustard: '#C99A2E', green: '#2F7A4B', 'kelly green': '#2E8B3E', forest: '#254D32', olive: '#6B6B3A',
    sage: '#A9B79A', mint: '#BFE3CF', seafoam: '#A8D8C8', teal: '#1F7A7A', camo: '#6F6A4F', brown: '#6B4A33', chocolate: '#4E3427', gingham: '#9FB3D1',
    // colour names in their Auburn catalogue
    chambray: '#9DB4CC', 'ice blue': '#CFE2EC', terracotta: '#C2683F', bone: '#E9E0CD', 'blue jean': '#6E8BAA', jean: '#6E8BAA', 'stone blue': '#8FA6BA',
    'heritage blue': '#4F6F96', 'columbia blue': '#9BC4E2', 'flint blue': '#6D7F95', azure: '#5C8FC8', crunchberry: '#D9507E', orchid: '#C37FB6',
    ballerina: '#F2C9D2', taupe: '#A3907A', 'warm taupe': '#A3907A', steel: '#8A9099', beige: '#D8C7A8', 'soft beige': '#DDCDB0', frost: '#DDE6EC',
    'oatmeal heather': '#DCD2BF', 'natural heather': '#E3DACA', 'flint blue heather': '#7D8DA0', 'athletic heather': '#B9B9B9', 'dark heather': '#5A5C61',
    'deep orange': '#D9531E', 'bright orange': '#F26B1D', 'bright red': '#D7262E', 'deep red': '#9E1B23', 'neon orange': '#FF6A1A', 'night navy': '#1B2440'
  };
  /* a colour word followed by a modifier keeps its base ("Navy Frost" is navy, "Oatmeal Heather" is oatmeal) */
  var MODIFIERS = { frost: 1, heather: 1, classic: 1, vintage: 1, washed: 1, triblend: 1, 'tri-blend': 1, solid: 1, marble: 1, marbled: 1, dye: 1, tie: 1 };
  function oneColor(n) {
    n = String(n || '').toLowerCase().replace(/\s+/g, ' ').trim();
    if (!n) return null;
    if (COLORS[n]) return COLORS[n];
    var words = n.split(/[\s&-]+/).filter(Boolean);
    // first colour word (or two-word name) that is not a modifier: "Navy Frost" → navy, "Flint Blue Heather" → flint blue
    for (var i = 0; i < words.length; i++) {
      var two = words[i + 1] ? words[i] + ' ' + words[i + 1] : null;
      if (two && COLORS[two]) return COLORS[two];
      if (COLORS[words[i]] && !MODIFIERS[words[i]]) return COLORS[words[i]];
    }
    for (var j = 0; j < words.length; j++) if (COLORS[words[j]]) return COLORS[words[j]];
    return null;
  }
  /* colour family of a colour name: navy, blue, orange, red, white, grey, pink, purple, green, brown, black, camo, gingham, multi */
  var FAMS = [['navy', /navy|midnight/], ['camo', /camo/], ['gingham', /gingham/], ['multi', /stripe|multi|tie ?dye|plaid/], ['orange', /orange|terracotta|peach|coral/],
    ['red', /red|crimson|cardinal|garnet|maroon|burgundy|wine/], ['pink', /pink|blush|rose|crunchberry|ballerina|orchid/], ['purple', /purple|lavender|lilac/],
    ['blue', /blue|chambray|denim|jean|azure|royal|frost|columbia|carolina/], ['green', /green|olive|sage|mint|seafoam|teal|forest/],
    ['black', /black|charcoal/], ['grey', /grey|gray|heather|ash|silver|steel|smoke/],
    ['brown', /brown|chocolate|tan|khaki|taupe|sand|beige|oatmeal|mocha/], ['white', /white|ivory|cream|natural|bone|pearl/], ['yellow', /yellow|gold|mustard/]];
  SG.colorFam = function (name) {
    var n = String(name || '').toLowerCase().split('/')[0];
    for (var i = 0; i < FAMS.length; i++) if (FAMS[i][1].test(n)) return FAMS[i][0];
    return n.trim() || null;
  };
  /* what shoppers read: their supplier's brand prefix dropped ("Bella + Canvas Navy" → "Navy"); the raw value still matches variants */
  SG.colorName = function (name) {
    var n = String(name || '').replace(/^\s*(bella\s*\+\s*canvas|comfort colors|port authority|rabbit skins|lat|next level|gildan|champion|sport-tek)\s+/i, '').trim();
    return n || String(name || '');
  };
  SG.colorHex = function (name) {
    var parts = String(name || '').split('/').map(function (x) { return x.trim(); }).filter(Boolean);
    for (var i = 0; i < parts.length; i++) { var c = oneColor(parts[i]); if (c) return c; }   // "Navy/ White" → navy (the first colour)
    return '#D9D3C7';
  };
  /** CSS background for a swatch: two-colour names ("Navy/ White") render split; everything else one colour */
  SG.colorBg = function (name) {
    var parts = String(name || '').split('/').map(function (x) { return x.trim(); }).filter(Boolean);
    if (parts.length === 2) {
      var a = oneColor(parts[0]), b = oneColor(parts[1]);
      if (a && b && a !== b) return 'linear-gradient(135deg,' + a + ' 50%,' + b + ' 50%)';
    }
    return SG.colorHex(name);
  };

  /* ======================================================================
     Editorial photos (local webp copies) + no-repeat picker
     ====================================================================== */
  var P = function (w, h, alt) { return { w: w, h: h, alt: alt }; };
  /* dup: the product whose own photo this editorial image is: once the photo is on the page, rails keep that product
     out of their first slots (SG.rail), so one screen never shows the same picture twice */
  var PHOTO_DUP = {
    'auburn-cheer-dress-flat': 'the-auburn-university-navy-stripe-cheer-dress',
    'auburn-embroidered-crewneck-model': 'the-auburn-university-gingham-mallory-mockneck-ash',
    'auburn-blue-cropped-crewneck-model': 'the-auburn-university-gingham-mallory-mockneck-denim',
    'war-eagle-tank-skort-torso': 'the-navy-ali-tennis-skirt-war-eagle-woven-label',
    'mom-mini-auburn-stripes': 'the-brooke-kids-orange-blue-striped-crewneck'
  };
  SG.railSeen = Object.create(null);
  SG.photos = {
    'alli-three-models': P(1600, 900, 'Three women in Alli ribbed tanks and skorts in blue, purple and red'),
    'aubie-tee-flatlay': P(960, 640, 'A grey Aubie graphic tee laid flat with sandals and jeans'),
    'auburn-blue-cropped-crewneck-model': P(1600, 1600, 'Smiling woman in a light blue cropped Auburn crewneck and jeans'),
    'auburn-cheer-dress-flat': P(1600, 1600, 'A navy Auburn cheer dress with orange and white stripes, laid flat'),
    'auburn-embroidered-crewneck-model': P(1600, 1600, 'Smiling woman in a light grey mockneck sweatshirt with blue gingham AUBURN letters and white pants'),
    'auburn-tee-grid-flatlay': P(1600, 1600, 'A grid of Auburn graphic tees laid flat'),
    'auburn-tee-grid-flatlay-2': P(1600, 1598, 'A second grid of Auburn graphic tees laid flat'),
    'ava-airy-set-two-models': P(1443, 1443, 'Two women in Ava Airy crewneck and shorts sets in orange and light blue'),
    'becca-two-girls': P(1600, 1600, 'Two girls in Becca boxy crewneck sets in navy and red'),
    'cheer-dresses-three-girls-other-schools': P(1067, 1600, 'Three little girls in cheer dresses holding poms'),
    'christmas-three-models': P(1067, 1600, 'Three women in Scarlet & Gold Christmas tees and sweatshirts'),
    'crewnecks-four-models-other-schools': P(1600, 897, 'Four women in school crewnecks'),
    'four-models-sets': P(1067, 1600, 'Four women in tee and skort sets in light blue, orange, navy and white'),
    'four-women-tees-outdoor': P(1108, 512, 'Four women in graphic tees outdoors'),
    'grace-gingham-dresses-three-models': P(1067, 1600, 'Three women in Grace gingham dresses'),
    'group-auburn-tees-outdoor': P(1600, 1568, 'Seven women in Auburn graphic tees and jeans under a white colonnade'),
    'kristen-airy-tee-model': P(1600, 1600, 'Woman in a grey Kristen Airy tee and shorts'),
    'mallory-four-models-other-schools': P(1067, 1600, 'Four women in Mallory gingham mocknecks'),
    'megan-family-bw': P(1064, 1600, 'Founder Megan Smalley with her husband Blake and their children on a porch, in black and white'),
    'mom-mini-auburn-stripes': P(600, 630, 'A mom and her little girl in matching orange and navy Auburn striped sweatshirts with poms'),
    'original-aubie-collab': P(1200, 1200, 'The Original Aubie Collection artwork, in collaboration with Scarlet & Gold'),
    'sophia-scarf': P(1067, 1600, 'A printed Sophia scarf hanging'),
    'war-eagle-tank-skort-torso': P(1600, 1600, 'A navy tank and matching navy skort with small orange patches'),
    'white-crewneck-shorts-set-model': P(1600, 1450, 'A white marbled crewneck and shorts set with a small embroidered AU')   // re-exported from the neck down (the source cut through the mouth)
  };

  /* Collection photos that are the same image as a local webp: resolve to the local copy so the no-repeat picker sees one photo.
     One substitution: the Alli collection photo (alli-three-models) cuts all three faces at the mouth and shows rival-school
     patches, so col:the-alli-collection resolves to the Alli tank & skort torso shot instead. */
  var COL_ALIAS = {
    's-g-christmas': 'christmas-three-models', 'the-ava-collection': 'ava-airy-set-two-models', 'the-becca-collection': 'becca-two-girls',
    'the-kristen-collection': 'kristen-airy-tee-model', 'grace-gingham-dresses': 'grace-gingham-dresses-three-models',
    'mallory-gingham-mocknecks': 'mallory-four-models-other-schools', 'the-alli-collection': 'war-eagle-tank-skort-torso', 'sophia-scarves': 'sophia-scarf',
    'original-aubie-basketball': 'original-aubie-collab', 'auburn': 'auburn-tee-grid-flatlay', 'auburn-kids-apparel': 'auburn-tee-grid-flatlay-2',
    'auburn-best-sellers': 'group-auburn-tees-outdoor', 'girls-cheer-dresses': 'cheer-dresses-three-girls-other-schools',
    'closeout-sale': 'crewnecks-four-models-other-schools'
  };
  /*
   * Photo cautions (~/.config/wd/scarletgold-build/assets/editorial/INDEX.md), enforced here for every page:
   *   NEVER — never resolved as a photo: Megan's family photo (placed by hand, natural ratio, story + Meet Megan only),
   *           the mouth-cut Alli group, the In Stock collection image (a bare AU logo graphic, not a photo) and the
   *           Give Grace collection image (also Megan's family photo).
   *   OTHER — shows another school's marks (or the Alabama-print scarf): skipped by pickPhoto in Auburn slots (ctx.auburn,
   *           the default for SG.hero / SG.tile / SG.deptTiles). Signature and school contexts may still use them.
   *   TORSO — photographer's torso crops: only in boxes at least 1.25:1 wide, or where a slot opts in with {torso:true}
   *           (a product-labelled tile); anchored at the bottom (50% 100%) unless the slot gives a pos.
   */
  var NEVER = { 'megan-family-bw': 1, 'alli-three-models': 1, 'col:auburn-university-in-stock-items': 1, 'col:give-grace': 1 };
  var OTHER = { 'mallory-four-models-other-schools': 1, 'cheer-dresses-three-girls-other-schools': 1, 'crewnecks-four-models-other-schools': 1,
    'four-women-tees-outdoor': 1, 'becca-two-girls': 1, 'kristen-airy-tee-model': 1, 'sophia-scarf': 1, 'col:cheer-accessories': 1 };
  var TORSO = { 'white-crewneck-shorts-set-model': 1, 'war-eagle-tank-skort-torso': 1 };
  var PHOTO_ALT = { 'col:book': 'Megan Smalley’s book Give Grace' };
  SG.isOtherSchoolPhoto = function (key) { return !!OTHER[key]; };
  SG.isTorsoPhoto = function (key) { return !!TORSO[key]; };

  /**
   * Resolve a photo candidate → {key, src, w, h, alt, pos?, fit?, bg?, label?, sub?, c?} or null.
   * A candidate is a local key ("auburn-cheer-dress-flat" → img/<key>.webp), "col:<handle>" (that collection's photo),
   * or an object {k, pos, fit:'contain', bg, label, sub, c} whose extra fields ride along with the photo.
   */
  SG.photo = function (cand, w) {
    if (!cand) return null;
    var extra = typeof cand === 'object' ? cand : null;
    var key = extra ? extra.k : cand;
    var out = null;
    if (!key || NEVER[key]) return null;
    if (key.indexOf('p:') === 0) {   // a loaded product's own photo (null when that product isn't in this preview)
      var pm = /^p:([^#]+)(?:#(\d+))?$/.exec(key), pr = pm && BY_H[pm[1]], ix = pm && pm[2] ? +pm[2] : 0;
      if (!pr || !pr.img || !pr.img[ix]) return null;
      var lk = /^img\/([a-z0-9-]+)\.webp$/.exec(pr.img[ix]);   // a product photo that IS a local editorial file: same key, so it never repeats
      if (lk && SG.photos[lk[1]]) return SG.photo(extra ? Object.assign({}, extra, { k: lk[1] }) : lk[1], w);
      var pw = w || 900, prr = ix === 0 && pr.ir ? pr.ir : 1;
      out = { key: key, src: SG.img(pr.img[ix], pw), w: pw, h: Math.round(pw / prr), alt: pr.t,
        set: [600, 900, 1200].map(function (x) { return SG.img(pr.img[ix], x) + ' ' + x + 'w'; }).join(', ') };
    } else if (key.indexOf('col:') === 0) {
      var h = key.slice(4);
      if (COL_ALIAS[h]) return SG.photo(extra ? Object.assign({}, extra, { k: COL_ALIAS[h] }) : COL_ALIAS[h], w);
      var c = COLS[h];
      if (!c || !c.img) return null;
      out = { key: key, src: SG.img(c.img, w || 900), w: 900, h: 900, alt: PHOTO_ALT[key] || c.t };
    } else {
      var m = SG.photos[key];
      if (!m) return null;
      out = { key: key, src: 'img/' + key + '.webp', w: m.w, h: m.h, alt: m.alt, set: localSet(key, m.w) };
    }
    if (extra) ['pos', 'fit', 'bg', 'label', 'sub', 'c', 'alt', 'torso'].forEach(function (f) { if (extra[f] != null) out[f] = extra[f]; });
    return out;
  };

  SG.usedPhotos = Object.create(null);
  /**
   * SG.pickPhoto(cands, w, strict, ctx) → first candidate not yet used on this page (and marks it used).
   * If every candidate is used: returns the first allowed one, or null when strict is true.
   * ctx {auburn:true, ratio:<box width/height>}: auburn skips OTHER (rival-school) photos; ratio decides whether a
   * TORSO crop may be used (≥ 1.25, or the candidate says torso:true). A torso pick comes back with pos '50% 100%'.
   */
  SG.pickPhoto = function (cands, w, strict, ctx) {
    ctx = ctx || {};
    // 'rule:<h>' = the photos of the loaded Auburn pieces matching that department's rule (SG.fromAuburn), first unused wins
    cands = [].concat(cands || []).reduce(function (a, c) {
      var k = typeof c === 'object' && c ? c.k : c;
      if (typeof k === 'string' && k.indexOf('rule:') === 0) {
        var d = SG.fromAuburn(k.slice(5)) || { products: SG.collection(k.slice(5)) };
        d.products.filter(function (p) { return p.av && !isProgramPiece(p) && p.img && p.img[0]; }).slice(0, 6).forEach(function (p) {
          a.push(typeof c === 'object' ? Object.assign({}, c, { k: 'p:' + p.h }) : 'p:' + p.h);
        });
        return a;
      }
      a.push(c);
      return a;
    }, []);
    var first = null;
    for (var i = 0; i < cands.length; i++) {
      var ph = SG.photo(cands[i], w);
      if (!ph) continue;
      if (ctx.auburn && OTHER[ph.key]) continue;
      if (TORSO[ph.key]) {
        if (!(ph.torso || (ctx.ratio && ctx.ratio >= 1.25))) continue;
        ph.pos = ph.pos || '50% 100%';   // a slot may aim higher (no faces in either file; the Alli shot's tank patch sits near the top)
        ph.isTorso = true;
      }
      if (!first) first = ph;
      if (!SG.usedPhotos[ph.key]) { SG.markPhotoUsed(ph.key); return ph; }
    }
    if (!strict && first) SG.markPhotoUsed(first.key);
    return strict ? null : first;
  };
  /* the same picture under two keys (the editorial cheer-dress flat lay IS that dress's product photo) */
  var SAME_AS = { 'auburn-cheer-dress-flat': 'p:the-auburn-university-navy-stripe-cheer-dress', 'p:the-auburn-university-navy-stripe-cheer-dress': 'auburn-cheer-dress-flat' };
  SG.markPhotoUsed = function (key) {
    SG.usedPhotos[key] = 1;
    if (SAME_AS[key]) SG.usedPhotos[SAME_AS[key]] = 1;
    if (PHOTO_DUP[key]) SG.railSeen[PHOTO_DUP[key]] = 1;
    var pm = /^p:([^#]+)/.exec(key);
    if (pm) SG.railSeen[pm[1]] = 1;   // its card goes to the back of rails on this page
  };
  /* the Brooke striped crewneck: the piece both of them wear in the mom & mini photo */
  SG.momMiniHandle = PHOTO_DUP['mom-mini-auburn-stripes'];

  /* local photos ship as img/<key>.webp (full size) plus img/<key>-800.webp / -1200.webp for every width the original
     exceeds by 10%+ (generated by the asset step; same rule as here), so phones never download the 1600px file */
  function localSet(key, w) {
    var set = [800, 1200].filter(function (x) { return w > x * 1.1; }).map(function (x) { return 'img/' + key + '-' + x + '.webp ' + x + 'w'; });
    return set.length ? set.concat(['img/' + key + '.webp ' + w + 'w']).join(', ') : '';
  }
  SG.photoSet = localSet;
  function imgTag(ph, opts) {
    opts = opts || {};
    if (!ph) return '';
    var set = ph.set ? ' srcset="' + SG.esc(ph.set) + '" sizes="' + SG.esc(opts.sizes || '(max-width: 719px) 92vw, 50vw') + '"' : '';
    return '<img src="' + SG.esc(ph.src) + '"' + set + ' alt="' + SG.esc(opts.alt != null ? opts.alt : ph.alt) + '" width="' + ph.w + '" height="' + ph.h + '"' +
      (opts.eager ? ' fetchpriority="high"' : (opts.low ? ' fetchpriority="low"' : '') + ' loading="lazy"') + ' decoding="async"' + (opts.cls ? ' class="' + opts.cls + '"' : '') + '>';
  }
  SG.imgTag = imgTag;

  /* ======================================================================
     Icons
     ====================================================================== */
  var I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5" stroke-linecap="round"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c1.3-3.8 4.2-5.6 7.5-5.6s6.2 1.8 7.5 5.6" stroke-linecap="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 20.3s-7.8-4.6-7.8-10.4A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 7.8 2.5c0 5.8-7.8 10.4-7.8 10.4Z" stroke-linejoin="round"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 8.5h14l-1 12H6l-1-12Z" stroke-linejoin="round"/><path d="M8.8 8.5V7a3.2 3.2 0 0 1 6.4 0v1.5" stroke-linecap="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke-linecap="round"/></svg>',
    caret: '<svg class="nav__caret" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m2 3.5 3 3 3-3"/></svg>',
    chev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>',
    left: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg>',
    right: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg>',
    ext: '<svg class="ext" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4.5 2.5h5v5M9.5 2.5 3 9"/></svg>',
    star: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.8l-5.1 2.8L6 11.8l-4.3-4 5.8-.7L10 1.8Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.3a10.5 10.5 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" stroke-linejoin="round"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="m4 6.5 8 6 8-6"/></svg>',
    insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>'
  };
  SG.icons = I;

  /* ======================================================================
     Store facts (all from source/*.txt)
     ====================================================================== */
  var STORE = {
    street: '1850 Shug Jordan Pkwy, Suite 103', city: 'Auburn, AL 36830',
    phone: '334-209-0299', tel: '+13342090299', email: 'info@scarletandgoldshop.com',
    maps: 'https://www.google.com/maps/search/?api=1&query=1850+Shug+Jordan+Pkwy+Suite+103+Auburn+AL+36830',
    instagram: 'https://www.instagram.com/scarletandgoldshop/',
    custom: 'https://scarletandgoldcustom.com/',
    sizeGuides: 'https://scarletandgoldshop.com/pages/size-guides',
    returns: 'https://scarletandgoldshop.com/pages/returns',
    hours: [['Mon–Fri', '10:00 AM – 4:30 PM'], ['Saturday', '10:00 AM – 2:00 PM'], ['Sunday', 'Closed']],
    teamHours: '8:30am–5:00pm Mon–Fri'
  };
  SG.store = STORE;

  /* ======================================================================
     Saved (hearts) — per-viewer convenience in localStorage
     ====================================================================== */
  var SAVED_KEY = 'sg_saved_v1';
  function readJSON(key, dflt) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : dflt; } catch (e) { return dflt; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
  }
  var saved = readJSON(SAVED_KEY, []);
  if (!Array.isArray(saved)) saved = [];
  SG.saved = {
    has: function (h) { return saved.indexOf(h) > -1; },
    list: function () { return saved.slice(); },
    toggle: function (h) {
      var i = saved.indexOf(h);
      if (i > -1) saved.splice(i, 1); else saved.push(h);
      writeJSON(SAVED_KEY, saved);
      return i < 0;
    }
  };

  /* ======================================================================
     Prices by size family. Their variants can cost more in bigger sizes (The Brooke: $92 12M–5T, $98 youth, $118
     adult), so a single price is only shown when every (available) variant costs the same; otherwise "From $X".
     SG.sizeFam(s) → 'baby' | 'kids' | 'adult' | null. SG.priceInfo(p, fam?) → {lo, hi, multi} over p's available
     variants (all variants when none is available), optionally only sizes of one family ('adult' / 'kids', where
     kids includes baby & toddler), falling back to every size when the family has none.
     ====================================================================== */
  SG.sizeFam = function (s) {
    var u = String(s || '').toUpperCase().trim();
    if (!u) return null;
    if (/^(NB|\d+(-\d+)?M|\dT)$/.test(u)) return 'baby';
    if (/^Y/.test(u) || /^\d+(\/\d+)?X?$/.test(u)) return 'kids';
    if (/^(XXS|XS|S|M|L|XL|XXL|\dXL)$/.test(u)) return 'adult';
    return null;
  };
  SG.famOk = function (s, fam) {
    if (!fam) return true;
    var f = SG.sizeFam(s);
    return fam === 'kids' ? (f === 'kids' || f === 'baby') : f === fam;
  };
  /** variant rows of p limited to one size family (none of that family → all rows) */
  SG.famVariants = function (p, fam) {
    var v = p.v || [];
    if (!fam) return v;
    var f = v.filter(function (x) { return x[0] && SG.famOk(x[0], fam); });
    return f.length ? f : v;
  };
  SG.priceInfo = function (p, fam) {
    var v = SG.famVariants(p, fam).filter(function (x) { return x[3] != null; });
    var live = v.filter(function (x) { return x[2]; });
    var list = (live.length ? live : v).map(function (x) { return Number(x[3]); });
    if (!list.length) return { lo: p.p, hi: p.p, multi: false };
    var lo = Math.min.apply(null, list), hi = Math.max.apply(null, list);
    return { lo: lo, hi: hi, multi: hi > lo };
  };

  /* ======================================================================
     Product card
     ====================================================================== */
  /**
   * SG.card(p, opts) → HTML string for one product card.
   * opts: { school:true (show school eyebrow), eager:false, ship:true (shipping micro-label), w:600 (image width) }
   * Sold out (p.av === 0): "Sold out" badge, muted image, "Sold out for now" in place of the shipping label, class .is-out.
   */
  SG.card = function (p, opts) {
    opts = opts || {};
    if (!p) return '';
    var w = opts.w || 600;
    var img0 = p.img && p.img[0], img1 = p.img && p.img[1];
    var ir = p.ir || 0.8;
    var cover = ir >= 0.6 && ir <= 1.12;    // 2:3 to a touch wider than square (centred flat lays) → cover, anchored near the top; taller or wider → contain
    var hgt = Math.round(w / ir);
    var pi = SG.priceInfo(p, opts.fam);   // fam 'adult' in Women/Men contexts: The Brooke reads $118, not the toddler $92
    var sale = p.cp && p.cp > pi.lo;
    var out = SG.isSoldOut(p);
    // school: true = always label; 'others' = label only pieces that are not Auburn (an Auburn listing)
    var sch = opts.school && p.sch && !(opts.school === 'others' && p.sch === 'auburn') ? SG.school(p.sch) : null;
    var co = (p.co || []).filter(Boolean);
    var shownBg = co.slice(0, 5).map(SG.colorBg);
    var sib = (opts.siblings || []).filter(function (x) {   // a sibling whose swatch looks like one already shown adds nothing
      if (!x || x.h === p.h || !x.co || !x.co[0]) return false;
      var bg = SG.colorBg(x.co[0]);
      if (shownBg.indexOf(bg) > -1) return false;
      shownBg.push(bg);
      return true;
    });
    var nDots = co.length + sib.length;
    if (nDots === 1 && !sib.length) nDots = 0;   // one colour, no siblings: the variant line already names it
    var dots = !nDots ? '' : co.slice(0, 5).map(function (c) {
      return '<li style="--c:' + SG.colorBg(c) + '" title="' + SG.esc(c) + '"></li>';
    }).join('') + sib.slice(0, Math.max(0, 5 - co.length)).map(function (x) {
      // the same style in another colour (folded out of the rail): a real swatch that opens that colour's page
      return '<li class="is-sib" style="--c:' + SG.colorBg(x.co[0]) + '"><a href="' + SG.productUrl(x.h) + '" title="' + SG.esc(x.co[0]) + '" aria-label="' + SG.esc(x.t) + '"></a></li>';
    }).join('') + (nDots > 5 ? '<li class="more">+' + (nDots - 5) + '</li>' : '');
    var shipK = out ? 'out' : SG.shipKind(p);
    var on = SG.saved.has(p.h);
    // rails defer their images (data-src) until the page's hero photo has loaded (SG.rail wakes them)
    var sa = opts.defer ? 'data-src' : 'src', ss = opts.defer ? 'data-srcset' : 'srcset';
    var set = function (path) { return ' ' + ss + '="' + SG.esc(SG.img(path, 400)) + ' 400w, ' + SG.esc(SG.img(path, 600)) + ' 600w" sizes="(max-width: 719px) 44vw, 260px"'; };
    return '<article class="pc' + (out ? ' is-out' : '') + '" data-h="' + SG.esc(p.h) + '">' +
      '<div class="pc__media">' +
        (img0 ? '<img ' + sa + '="' + SG.esc(SG.img(img0, w)) + '"' + (w === 600 ? set(img0) : '') + ' alt="" width="' + w + '" height="' + hgt + '"' + (cover ? ' class="is-cover"' : '') +
          (opts.eager ? '' : ' loading="lazy"') + ' decoding="async">' : '') +
        (img1 ? '<img class="pc__alt' + (cover ? ' is-cover' : '') + '" ' + sa + '="' + SG.esc(SG.img(img1, w)) + '"' + (w === 600 ? set(img1) : '') + ' alt="" width="' + w + '" height="' + hgt + '" loading="lazy" decoding="async">' : '') +
        (out ? '<span class="pc__badge pc__badge--out">Sold out</span>' : sale ? '<span class="pc__badge pc__badge--sale">Sale</span>' : (p['new'] ? '<span class="pc__badge">New</span>' : '')) +
      '</div>' +
      '<button type="button" class="pc__heart" data-h="' + SG.esc(p.h) + '" aria-pressed="' + on + '" aria-label="Save ' + SG.esc(p.t) + '"><span>' + I.heart + '</span></button>' +
      '<div class="pc__body">' +
        (sch ? '<p class="pc__school">' + SG.esc(sch.name) + '</p>' : '') +
        '<h3 class="pc__title"><a href="' + SG.productUrl(p.h) + '">' + SG.titleHTML(p.t, 'pc', opts.hideName) + '</a></h3>' +
        '<p class="pc__price">' + (pi.multi ? '<span class="pc__from">From </span>' : '') + (sale ? '<span class="is-sale">' + SG.money(pi.lo) + '</span><s>' + SG.money(p.cp) + '</s><span class="sr"> (was ' + SG.money(p.cp) + ')</span>' : SG.money(pi.lo)) + '</p>' +
        '<ul class="pc__dots"' + (nDots ? ' aria-label="' + nDots + ' color' + (nDots === 1 ? '' : 's') + ': ' + SG.esc(co.concat(sib.map(function (x) { return x.co[0]; })).slice(0, 5).join(', ')) + '"' : ' aria-hidden="true"') + '>' + dots + '</ul>' +
        // no ship time known ('check'): the card says nothing rather than hedging; the product page explains
        (opts.ship === false || shipK === 'check' ? '' : '<p class="pc__ship pc__ship--' + shipK + '">' + SG.shipLabel(p) + '</p>') +
      '</div>' +
    '</article>';
  };

  function hideTarget(el, opts) {
    return (opts && opts.hide) || el.closest('[data-hide-empty]') || el;
  }

  /**
   * SG.onLayout(els, fn) → dispose(). For anything that measures scroll/overflow (rail arrows, tab-row edge fade).
   * WebKit can run the deferred scripts BEFORE any stylesheet has applied, so a measurement taken at script time (or in
   * the next frame) sees unstyled boxes: a tab row that will scroll reads scrollWidth === clientWidth. So fn runs now,
   * next frame, and again whenever the numbers can change: a ResizeObserver on els (styles applying resize them), the
   * load event (all stylesheets in), web fonts ready, and window resize. Calls are coalesced to one per frame.
   */
  SG.onLayout = function (els, fn) {
    els = [].concat(els).filter(Boolean);
    var dead = false, queued = false;
    var run = function () {
      if (dead || queued) return;
      queued = true;
      window.requestAnimationFrame(function () { queued = false; if (!dead) fn(); });
    };
    var ro = 'ResizeObserver' in window ? new ResizeObserver(run) : null;
    if (ro) els.forEach(function (e) { ro.observe(e); });
    window.addEventListener('resize', run);
    if (document.readyState !== 'complete') window.addEventListener('load', run, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    fn();
    run();
    return function () {
      dead = true;
      if (ro) ro.disconnect();
      window.removeEventListener('resize', run);
      window.removeEventListener('load', run);
    };
  };

  /**
   * SG.rail(el, products, opts) → number rendered. Renders a snap rail into el.
   * Empty list → hides opts.hide || closest [data-hide-empty] || el. opts: {limit:12, nav: element for arrows, card:{…SG.card opts}}
   */
  /** style key: their title before " | " plus audience ("The Mallory Mockneck Auburn Gingham|women") */
  SG.styleKey = function (p, noWho) {
    var parts = String(p.t || '').split(' | '), k = parts[0].trim().toLowerCase();
    if (/^the (collegiate )?auburn university$/.test(k) && parts[1]) k += ':' + parts[1].toLowerCase().replace(/\b(power stripe|stripe)\b/g, 'stripe').replace(/\b(navy|orange|light blue|light|blue|white|red|pink|classic)\b/g, '').replace(/\s+/g, ' ').trim();
    return noWho ? k : k + '|' + p.who;
  };
  /*
   * Rail curation (rails only; the shop grid keeps their merch order): one card per style (two for The Auburn University
   * cheer dresses), the folded colours become that card's swatch dots; available pieces first (a sold-out card never
   * leads); pieces an earlier rail on the page already led with, or whose photo an editorial image already shows, go
   * to the back. Returns {list, sib: {handle: [sibling products]}}.
   */
  /* buttons, stickers and temporary tattoos are one "line" for the variety cap: a rail never leads with three of them */
  var SMALL_GOODS = /\b(buttons?|stickers?|tattoos?)\b/i;
  function lineKey(p) { return /war eagle woven label/i.test(p.t || '') ? 'wewl' : SMALL_GOODS.test(p.t || '') ? 'small-goods' : SG.styleKey(p, true); }
  function curate(list, opts) {
    opts = opts || {};
    var seenKey = Object.create(null), keep = [], sib = Object.create(null), owner = Object.create(null);
    // a line rail (one signature line / collaboration): the youth and adult cuts of a style are one card, led by the adult
    if (opts.line) list = list.filter(function (p) { return p.who !== 'kids'; }).concat(list.filter(function (p) { return p.who === 'kids'; }));
    list.forEach(function (p) {
      var k = SG.styleKey(p, !!opts.line), n = seenKey[k] || 0;
      if (n < 1) { seenKey[k] = 1; keep.push(p); if (!owner[k]) owner[k] = p.h; }
      else (sib[owner[k]] = sib[owner[k]] || []).push(p);
    });
    // a short list (few styles, many colours) keeps its colours as cards rather than leaving the rail near-empty
    if (keep.length < 4) {
      list.forEach(function (p) {
        if (keep.length >= 4 || keep.indexOf(p) > -1) return;
        keep.push(p);
        Object.keys(sib).forEach(function (h) { sib[h] = sib[h].filter(function (x) { return x !== p; }); });
      });
    }
    // sold out last; then pieces already shown on the page; college/program webstore pieces after the shop's own
    var score = function (p) { return (SG.isSoldOut(p) ? 4 : 0) + (isProgramPiece(p) ? 2 : 0) + (SG.railSeen[p.h] ? 1 : 0); };
    var ranked = keep.map(function (p, i) { return [p, score(p), i]; })
      .sort(function (a, b) { return a[1] - b[1] || a[2] - b[2]; }).map(function (x) { return x[0]; });
    // variety: in the first four cards one line (their "War Eagle Woven Label" pieces count as one) or one colour family
    // appears at most twice; the next eligible piece of the SAME rank moves up (a sold-out, program or already-shown
    // piece never jumps ahead of the shop's own available pieces). Pieces with no colour option don't count as a family.
    var famOf = function (p) { return (p.co || [])[0] && !p.ol ? SG.colorFam(p.co[0]) : null; };
    var out = [], rest = ranked.slice(), lines = Object.create(null), fams = Object.create(null);
    var fits = function (x) { var fk = famOf(x); return (lines[lineKey(x)] || 0) < 2 && (!fk || (fams[fk] || 0) < 2); };
    while (rest.length && out.length < 4) {
      var j = -1, s0 = score(rest[0]);
      for (var k = 0; k < rest.length && score(rest[k]) === s0; k++) {
        if (fits(rest[k])) { j = k; break; }
      }
      // every piece of this rank breaks a cap (a gift pool of buttons and stickers): a piece that differs only by having
      // been shown higher up the page may step up, rather than a third button leading the rail
      if (j < 0 && s0 % 2 === 0) {
        for (k = 0; k < rest.length; k++) if (score(rest[k]) === s0 + 1 && fits(rest[k])) { j = k; break; }
      }
      if (j < 0) j = 0;
      var q = rest.splice(j, 1)[0];
      lines[lineKey(q)] = (lines[lineKey(q)] || 0) + 1;
      var fm = famOf(q);
      if (fm) fams[fm] = (fams[fm] || 0) + 1;
      out.push(q);
    }
    return { list: out.concat(rest), sib: sib };
  }

  /* Rail images wait for the page's hero photo (the high-priority image already on the page) to load, or 2.5s, so
     below-the-fold cards never compete with it; then only cards near the rail's visible width get a src (the rest
     follow as the rail scrolls). Cards keep loading="lazy", so the browser still waits until a rail nears the screen. */
  var heroGate = null;
  SG.heroGate = function () {
    if (heroGate) return heroGate;
    heroGate = new Promise(function (res) {
      var done = false, go = function () { if (!done) { done = true; res(); } };
      window.setTimeout(go, 2500);
      var im = document.querySelector('main img[fetchpriority="high"]');   // (main: not the header logo)
      if (!im || (im.complete && (im.currentSrc || im.getAttribute('src')))) { go(); return; }
      im.addEventListener('load', go, { once: true });
      im.addEventListener('error', go, { once: true });
    });
    return heroGate;
  };
  function wakeImgs(root) {
    Array.prototype.forEach.call(root.querySelectorAll('img[data-src]'), function (im) {
      if (im.hasAttribute('data-srcset')) { im.setAttribute('srcset', im.getAttribute('data-srcset')); im.removeAttribute('data-srcset'); }
      im.setAttribute('src', im.getAttribute('data-src'));
      im.removeAttribute('data-src');
    });
  }
  function wakeRail(track) {
    var lis = Array.prototype.slice.call(track.children);
    var near = 3;
    lis.slice(0, near).forEach(wakeImgs);
    var later = lis.slice(near).filter(function (li) { return li.querySelector('img[data-src]'); });
    if (!later.length) return;
    if (!('IntersectionObserver' in window)) { later.forEach(wakeImgs); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { wakeImgs(e.target); io.unobserve(e.target); } });
    }, { root: track, rootMargin: '0px 100% 0px 0px' });
    later.forEach(function (li) { io.observe(li); });
    track._sgIO = io;
  }
  SG.rail = function (el, list, opts) {
    opts = opts || {};
    if (!el) throw new Error('SG.rail: missing element');
    var cur = opts.curate === false ? { list: list || [], sib: {} } : curate(list || [], opts);
    list = cur.list.slice(0, opts.limit || 12);
    if (opts.mark !== false) list.slice(0, 4).forEach(function (p) { SG.railSeen[p.h] = 1; });
    var target = hideTarget(el, opts);
    if (opts.nav && opts.nav._sgOff) { opts.nav._sgOff(); opts.nav._sgOff = null; }
    if (!list.length) { el.innerHTML = ''; target.hidden = true; if (opts.nav) opts.nav.innerHTML = ''; return 0; }
    target.hidden = false;
    el.classList.add('rail');
    var end = opts.end && list.length < 4 ? '<li><a class="pc-end" href="' + SG.esc(opts.end.href) + '" target="_blank" rel="noopener">' +
      '<span class="pc-end__amp" aria-hidden="true">&amp;</span><span class="pc-end__t">' + SG.esc(opts.end.label) + I.ext + '</span>' +
      '<span class="sr"> (opens their store in a new tab)</span></a></li>' : '';
    var old = el.querySelector('.rail__track');
    if (old && old._sgIO) old._sgIO.disconnect();
    el.innerHTML = '<ul class="rail__track" role="list">' + list.map(function (p) {
      var co = Object.assign({}, opts.card || {}, { defer: true }, cur.sib[p.h] ? { siblings: cur.sib[p.h] } : {});
      return '<li>' + SG.card(p, co) + '</li>';
    }).join('') + end + '</ul>';
    var track = el.querySelector('.rail__track');
    SG.heroGate().then(function () { if (track.isConnected) wakeRail(track); });
    if (opts.nav) {
      opts.nav.classList.add('rail__nav');
      opts.nav.innerHTML = '<button type="button" class="rail__btn" data-dir="-1" aria-label="Previous">' + I.left + '</button>' +
        '<button type="button" class="rail__btn" data-dir="1" aria-label="Next">' + I.right + '</button>';
      var btns = opts.nav.querySelectorAll('.rail__btn');
      var sync = function () {
        var max = track.scrollWidth - track.clientWidth - 2;
        btns[0].disabled = track.scrollLeft <= 2;
        btns[1].disabled = track.scrollLeft >= max;
        opts.nav.hidden = max <= 0;
      };
      btns.forEach(function (b) {
        b.onclick = function () { track.scrollBy({ left: +b.getAttribute('data-dir') * track.clientWidth * 0.9, behavior: 'smooth' }); };
      });
      track.addEventListener('scroll', function () { window.requestAnimationFrame(sync); }, { passive: true });
      // one live measurer per nav (a tabbed rail re-renders into the same nav on every tab switch)
      if (opts.nav._sgOff) opts.nav._sgOff();
      opts.nav._sgOff = SG.onLayout([track, track.firstElementChild], sync);
    }
    return list.length;
  };

  /** end card for a short rail: their live collection, when they have more than the preview shows */
  SG.liveEnd = function (h, shown) {
    var t = SG.total(h);
    return t && t > shown ? { href: SG.liveUrl(h), label: 'See all ' + Number(t).toLocaleString('en-US') + ' on their store' } : null;
  };
  /** SG.grid(el, products, opts) → number rendered. 4-col grid (2 on phones). Empty → hides like SG.rail. */
  SG.grid = function (el, list, opts) {
    opts = opts || {};
    list = (list || []).slice(0, opts.limit || 999);
    var target = hideTarget(el, opts);
    if (!list.length) { el.innerHTML = ''; target.hidden = true; return 0; }
    target.hidden = false;
    el.classList.add('grid4');
    el.setAttribute('role', 'list');
    el.innerHTML = list.map(function (p) { return '<div role="listitem">' + SG.card(p, opts.card) + '</div>'; }).join('');
    return list.length;
  };

  /**
   * SG.tabbedRail(el, tabs, opts) → number of tabs shown. tabs: [{id, label, products:[], href}].
   * Tabs with no products are dropped; if none remain, hides like SG.rail and returns 0.
   */
  SG.tabbedRail = function (el, tabs, opts) {
    opts = opts || {};
    var live = (tabs || []).filter(function (t) { return t.products && t.products.length; });
    var target = hideTarget(el, opts);
    if (el._sgTabsOff) { el._sgTabsOff(); el._sgTabsOff = null; }
    if (!live.length) { el.innerHTML = ''; if (opts.hide !== false) target.hidden = true; return 0; }
    target.hidden = false;
    var uid = 'tr' + Math.random().toString(36).slice(2, 7);
    // one control line: tabs left, "Shop all" + arrows right (the same place every other rail puts them)
    el.innerHTML =
      '<div class="tr-head"><div class="tabs" role="tablist" aria-label="' + SG.esc(opts.label || 'Departments') + '">' + live.map(function (t, i) {
        return '<button type="button" class="tab" role="tab" id="' + uid + '-t' + i + '" aria-controls="' + uid + '-p" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' + SG.esc(t.label) + '</button>';
      }).join('') + '</div>' +
      '<div class="tr-side"><a class="tlink tr-more" href="#"></a><div class="tr-nav"></div></div></div>' +
      '<div id="' + uid + '-p" role="tabpanel" aria-labelledby="' + uid + '-t0"><div class="tr-rail"></div></div>';
    var btns = el.querySelectorAll('.tab'), panel = el.querySelector('[role=tabpanel]'), tablist = el.querySelector('.tabs');
    var railEl = el.querySelector('.tr-rail'), more = el.querySelector('.tr-more'), nav = el.querySelector('.tr-nav');
    // phones: the tab row scrolls; its edge fades until the end is reached, and the active tab is kept in view.
    // Measured live (SG.onLayout), never only at script time: WebKit can run this before CSS applies, when the unstyled
    // row reads as not overflowing and would get .is-end (no fade) with tabs hidden past the edge.
    var syncEnd = function () { tablist.classList.toggle('is-end', tablist.scrollLeft + tablist.clientWidth >= tablist.scrollWidth - 2); };
    var shownOnce = false;   // only the first tab's lead cards count as "already shown" to later rails
    tablist.addEventListener('scroll', syncEnd, { passive: true });
    function show(i, scroll) {
      btns.forEach(function (b, j) { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
      panel.setAttribute('aria-labelledby', btns[i].id);
      SG.rail(railEl, live[i].products, { limit: opts.limit || 12, nav: nav, hide: railEl, card: Object.assign({}, opts.card || {}, live[i].card || {}), mark: !shownOnce });
      shownOnce = true;
      more.href = live[i].href || '#';
      more.textContent = live[i].more || ('Shop all ' + live[i].label);
      more.hidden = !live[i].href;
      if (scroll && tablist.scrollWidth > tablist.clientWidth) {
        var b = btns[i], pad = 16;
        if (b.offsetLeft - pad < tablist.scrollLeft) tablist.scrollTo({ left: Math.max(0, b.offsetLeft - pad), behavior: 'smooth' });
        else if (b.offsetLeft + b.offsetWidth + pad > tablist.scrollLeft + tablist.clientWidth) tablist.scrollTo({ left: b.offsetLeft + b.offsetWidth + pad - tablist.clientWidth, behavior: 'smooth' });
      }
      syncEnd();
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { show(i, true); });
      b.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var n = (i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length;
        btns[n].focus(); show(n, true);
      });
    });
    show(0);
    el._sgTabsOff = SG.onLayout([tablist].concat([].slice.call(btns)), syncEnd);
    return live.length;
  };

  /* ======================================================================
     Section renderers (hero, intro, tile band, department tiles, schools)
     ====================================================================== */
  /**
   * SG.hero(el, cfg): split hero. cfg = chapter.hero shape {eyebrow,line1,line2,body,ctas:[{label,href}x2],cols,images:[{img:[cands],pos,fit,bg}]}
   * 2 or 3 images (cols sets the widths). Panels are tall and narrow, so torso crops and rival-school photos are never picked.
   */
  SG.hero = function (el, cfg) {
    el.classList.add('hero');
    var imgs = (cfg.images || []).map(function (im, i) {
      var ph = SG.pickPhoto(im.img, 1200, false, { auburn: !cfg.anySchool, ratio: 0.5 }) || {};
      var pos = ph.pos || im.pos, bg = ph.bg || im.bg, fit = ph.fit || im.fit;
      var style = (pos ? '--pos:' + pos + ';' : '') + (bg ? '--ph-bg:' + bg + ';' : '');
      return '<figure class="trip__ph' + (fit === 'contain' ? ' trip__ph--contain' : '') + '"' + (style ? ' style="' + style + '"' : '') + '>' + imgTag(ph.src ? ph : null, { eager: i === 0, low: i > 0, alt: im.alt, sizes: '(max-width: 719px) 78vw, 30vw' }) + '</figure>';
    }).join('');
    var c = (cfg.ctas || []).map(function (x) {
      if (x.live && x.c && D.partial && !SG.loaded(x.c)) return { label: x.live, href: SG.liveUrl(x.c), ext: true };
      return x;
    });
    c = c.filter(function (x) { return !x.ext; }).concat(c.filter(function (x) { return x.ext; }));
    var ctaA = function (x, cls) {
      return '<a class="btn ' + cls + '" href="' + SG.esc(x.ext ? x.href : ctaHref(x)) + '"' + (x.ext ? ' target="_blank" rel="noopener"' : '') + '>' + SG.esc(x.label) +
        (x.ext ? I.ext + '<span class="sr"> (opens their store in a new tab)</span>' : '') + '</a>';
    };
    el.innerHTML =
      '<div class="hero__panel dark">' +
        '<p class="eyebrow">' + SG.esc(cfg.eyebrow) + '</p>' +
        '<h1 class="display">' + SG.esc(cfg.line1) + ' <span class="l2">' + SG.esc(cfg.line2) + '</span></h1>' +
        '<p class="hero__body">' + SG.esc(cfg.body) + '</p>' +
        '<div class="hero__ctas">' +
          (c[0] ? ctaA(c[0], 'btn--ivory') : '') +
          (c[1] ? ctaA(c[1], 'btn--line-ivory') : '') +
        '</div>' +
      '</div>' +
      '<div class="trip" style="--trip-cols:' + SG.esc(cfg.cols || '1fr 1fr 1fr') + '">' + imgs + '</div>';
  };

  /* a chapter CTA labelled by a rule ({rule: handle}) goes where those pieces are (SG.ctaUrl); others keep their href */
  function ctaHref(c) { return c.rule ? SG.ctaUrl(c.rule, c.extra) : c.href; }
  /** SG.intro(el, cfg): intro strip. cfg {eyebrow, title (may contain <em>), body, cta:{label,href,rule?}} */
  SG.intro = function (el, cfg) {
    el.innerHTML = '<div class="wrap intro"><div>' +
      '<p class="eyebrow">' + SG.esc(cfg.eyebrow) + '</p>' +
      '<h2 class="h2">' + cfg.title + '</h2>' +
      (cfg.body ? '<p class="lede">' + SG.esc(cfg.body) + '</p>' : '') +
      '</div>' + (cfg.cta ? '<a class="btn btn--line-ink" href="' + SG.esc(ctaHref(cfg.cta)) + '">' + SG.esc(cfg.cta.label) + '</a>' : '') + '</div>';
  };

  /**
   * Single tile HTML. t: {t, sub, c|href, img:[cands], pos, fit:'contain', bg, go:'Shop now', anySchool, made:{tone, patch, big, note}}
   * Photos come from pickPhoto in an Auburn context (no rival-school photos; torso crops only with torso:true).
   * With `made`, a designed tile (gold field by default; tone 'scarlet' | 'navy' | 'ivory') is used whenever no photo is
   * free, so a tile never repeats a photo or shows the wrong one.
   */
  SG.tile = function (t, w) {
    var ph = SG.pickPhoto(t.img, w || 900, !!t.made, { auburn: !t.anySchool, ratio: t.ratio || 1 }) || {};
    var href = t.href || (t.rule ? SG.ctaUrl(t.c, t.extra) : SG.shopUrl({ c: t.c }));   // rule: true = the tile is labelled by a rule, not a collection name
    var txt = '<span class="tile__txt"><span class="tile__title">' + SG.esc(t.t) + '</span>' +
      (t.sub ? '<span class="tile__sub">' + SG.esc(t.sub) + '</span>' : '') +
      '<span class="tile__go">' + SG.esc(t.go || 'Shop now') + '</span></span>';
    if (!ph.src && t.made) {
      var m = t.made;
      return '<a class="tile tile--made tile--t-' + SG.esc(m.tone || 'gold') + '" href="' + SG.esc(href) + '">' +
        '<span class="tile__face" aria-hidden="true">' +
          (m.big ? '<span class="tile__big">' + SG.esc(m.big) + '</span>' : '') +
          (m.patch ? '<span class="patch' + (m.tone === 'navy' ? '' : ' patch--navy') + '">' + (m.dot ? '<span class="patch__dot"></span>' : '') + SG.esc(m.patch) + '</span>' : '') +
        '</span>' + txt + '</a>';
    }
    var pos = ph.pos || t.pos, bg = ph.bg || t.bg, fit = ph.fit || t.fit;
    var style = (pos ? '--pos:' + pos + ';' : '') + (bg ? '--tile-bg:' + bg + ';' : '');
    return '<a class="tile' + (fit === 'contain' ? ' tile--contain' : '') + '" href="' + SG.esc(href) + '"' + (style ? ' style="' + style + '"' : '') + '>' +
      imgTag(ph.src ? ph : null, { alt: '', sizes: '(max-width: 719px) 80vw, 25vw' }) + txt + '</a>';
  };

  /** SG.tileBand(el, cfg): full-width coloured band with pill, big H2 and four photo tiles (snap carousel on phones). cfg {tone, pill, title(html), items:[tile]} */
  SG.tileBand = function (el, cfg) {
    el.classList.add('band', 'band--' + (cfg.tone || 'scarlet'));
    el.innerHTML = '<div class="wrap"><div class="tband__head">' +
      '<span class="pill">' + SG.esc(cfg.pill) + '</span>' +
      '<h2 class="h2">' + cfg.title + '</h2>' +
      (cfg.lede ? '<p class="lede" style="margin-top:var(--s-4)">' + SG.esc(cfg.lede) + '</p>' : '') +
      '</div><ul class="tiles tiles--snap" role="list">' +
      cfg.items.map(function (t) { return '<li>' + SG.tile(t) + '</li>'; }).join('') + '</ul></div>';
  };

  /**
   * SG.deptTiles(el, items): 3:4 department tiles with the name + SHOP NOW on the photo (bottom gradient).
   * item {t, c|href, img:[cands], pos, made:{patch, big, note}}. A photo item that finds no free photo falls back to its
   * `made` card (a quiet paper card with a gold hairline); an item with `made` and no `img` is always a card.
   * Photos are picked in an Auburn context (no rival-school photos, no torso crops in these portrait tiles).
   */
  SG.deptTiles = function (el, items) {
    el.classList.add('dept', 'dept--snap');
    el.setAttribute('role', 'list');
    el.innerHTML = items.map(function (it) {
      var href = it.href || SG.shopUrl({ c: it.c });
      var ph = it.img ? SG.pickPhoto(it.img, 600, !!it.made, { auburn: true, ratio: 0.75 }) : null;
      var face, made = !(ph && ph.src);
      if (made) {
        var m = it.made || {};
        face = '<span class="dept__ph dept__ph--made" aria-hidden="true">' +
          (m.big ? '<span class="dept__big">' + SG.esc(m.big) + '</span>' : '') +
          (m.patch ? '<span class="patch patch--navy">' + (m.dot ? '<span class="patch__dot"></span>' : '') + SG.esc(m.patch) + '</span>' : '') +
          (m.note ? '<span class="dept__note">' + SG.esc(m.note) + '</span>' : '') + '</span>';
      } else {
        var pos = ph.pos || it.pos;
        face = '<span class="dept__ph"' + (pos ? ' style="--pos:' + pos + '"' : '') + '>' + imgTag(ph, { alt: '', sizes: '(max-width: 719px) 46vw, 17vw' }) + '</span>';
      }
      return '<li><a class="dept__a' + (made ? ' dept__a--made' : '') + '" href="' + SG.esc(href) + '">' + face +
        '<span class="tile__txt dept__txt"><span class="dept__name">' + SG.esc(it.t) + '</span><span class="dept__go">' + SG.esc(it.go || 'Shop now') + '</span></span></a></li>';
    }).join('');
  };

  /** Shop Your School grid HTML (16 school tiles from SG_DATA.schools → shop.html?school=<slug>). opts {limit, w} */
  SG.schoolsHTML = function (opts) {
    opts = opts || {};
    var list = (D.schools || []).slice(0, opts.limit || 99);
    var more = opts.collapse && list.length > 8
      ? '<button type="button" class="btn btn--line-ink btn--block schools__more" aria-expanded="false" data-sg-schools-more>Show all schools</button>' : '';   // never print a count (their own site says 58, 59 and "more than 20")
    return '<ul class="schools' + (opts.collapse ? ' schools--collapse' : '') + '" role="list">' + list.map(function (s) {
      var home = s.slug === 'auburn';
      return '<li><a class="school' + (home ? ' school--home' : '') + '" href="' + SG.shopUrl({ school: s.slug }) + '">' +
        '<span class="school__img"><img src="' + SG.esc(SG.img(s.img, opts.w || 400)) + '" alt="" width="400" height="400" loading="lazy" decoding="async">' +
        (home && opts.tag !== false ? '<span class="school__tag"><span class="school__tag-l">Home team</span><span class="school__tag-s" aria-hidden="true">Home</span></span>' : '') + '</span>' +
        '<span class="school__name">' + SG.esc(s.name) + '</span></a></li>';
    }).join('') + '</ul>' + more;
  };

  /**
   * SG.schoolsCompact() → compact Shop your school (homepage): the Auburn tile as the single logo (with its Home team tag),
   * every other school as a text chip (wraps on desktop, swipes on phones). No school count anywhere.
   */
  SG.schoolsCompact = function () {
    var list = D.schools || [], au = list.filter(function (s) { return s.slug === 'auburn'; })[0];
    var others = list.filter(function (s) { return s.slug !== 'auburn'; });
    return '<div class="schools-c">' +
      (au ? '<a class="school school--home" href="' + SG.shopUrl({ school: au.slug }) + '"><span class="school__img"><img src="' + SG.esc(SG.img(au.img, 400)) + '" alt="" width="400" height="400" loading="lazy" decoding="async">' +
        '<span class="school__tag"><span class="school__tag-l">Home team</span><span class="school__tag-s" aria-hidden="true">Home</span></span></span><span class="school__name">' + SG.esc(au.name) + '</span></a>' : '') +
      '<ul class="schools-c__chips" role="list" aria-label="Every other school we make">' + others.map(function (s) {
        return '<li><a href="' + SG.shopUrl({ school: s.slug }) + '">' + SG.esc(s.name) + '</a></li>';
      }).join('') + '</ul></div>';
  };

  /** Visit band (navy, ticket-stub card). Fills [data-sg="visit"] automatically. */
  SG.visitBand = function (el) {
    el.classList.add('band', 'band--navy');
    if (!el.id) el.id = 'visit';
    el.innerHTML = '<div class="wrap visit">' +
      '<div>' +
        '<p class="eyebrow">Shug Jordan Parkway · Auburn</p>' +
        '<h2 class="h2">Online is nice. <em class="br">Come try it on.</em></h2>' +
        '<p class="lede">Our shop carries officially licensed apparel for women, men and kids, plus gifts for every age and occasion, including faith-based books and resources. Order online and pick up in store, or come try things on. You might even meet the team behind your order.</p>' +
        '<div class="visit__ctas"><a class="btn btn--ivory" href="visit.html">Plan your visit</a>' +
        '<a class="btn btn--line-ivory" href="' + STORE.maps + '" target="_blank" rel="noopener">Get directions</a></div>' +
      '</div>' +
      '<div class="ticket visit__card">' +
        '<dl>' +
          '<div><dt class="ticket__label">The shop</dt><dd>' + STORE.street + '<br>' + STORE.city + '</dd></div>' +
          '<div><dt class="ticket__label">Store hours</dt><dd class="visit__hours">' + STORE.hours.map(function (h) { return '<span>' + h[0] + '</span><span>' + h[1] + '</span>'; }).join('') + '</dd></div>' +
          '<div><dt class="ticket__label">Call or email</dt><dd><a href="tel:' + STORE.tel + '">' + STORE.phone + '</a><br><a href="mailto:' + STORE.email + '">' + STORE.email + '</a></dd></div>' +
        '</dl>' +
        '<span class="ticket__perf ticket__perf--v" aria-hidden="true"></span>' +
        '<div class="visit__stub"><span class="patch">Local pickup</span>' +
          '<p>Order apparel and hats online, pick them up at the shop.</p>' +
          '<p>Hours occasionally change, so check <a href="' + STORE.instagram + '" target="_blank" rel="noopener">Instagram</a> before you stop by.</p></div>' +
      '</div></div>';
  };

  /** Reviews (the three real ones, Auburn first) + "As seen on". Fills [data-sg="reviews"] automatically. */
  var REVIEWS = [
    'They have some really cute Auburn things that are different from what you see at all the other shops.',
    'Everything is perfect quality, and we always get compliments because it is so original. From babies to adults, there is truly something nice for everyone.',
    'I have ordered online and I have purchased in store and I LOVE this shop. The uniqueness of the products is exceptional.'
  ];
  SG.reviews = function (el) {
    if (!el.classList.contains('band')) el.classList.add('band', 'band--cream');
    var stars = '<div class="rev__stars" aria-label="5 out of 5 stars">' + I.star + I.star + I.star + I.star + I.star + '</div>';
    var fig = function (q, lead) {
      return '<figure class="rev' + (lead ? ' rev--lead' : '') + '">' + stars + '<blockquote class="rev__q">' + SG.esc(q) + '</blockquote>' +
        '<figcaption class="rev__by">Scarlet &amp; Gold customer</figcaption></figure>';
    };
    el.innerHTML = '<div class="wrap">' +
      '<div class="sechead"><div><p class="eyebrow">Kind words</p><h2 class="h2">Something nice <em class="br">for everyone.</em></h2></div></div>' +
      '<div class="reviews">' + fig(REVIEWS[0], true) + '<div class="reviews__side">' + fig(REVIEWS[1]) + fig(REVIEWS[2]) + '</div></div>' +
      '<p class="press"><span class="press__label">As seen on</span><span class="press__name">Sports Illustrated</span><i class="press__sep" aria-hidden="true"></i>' +
      '<span class="press__name">Us Weekly</span><i class="press__sep" aria-hidden="true"></i><span class="press__name press__name--caps">TODAY</span></p>' +
      '</div>';
  };

  /* ======================================================================
     Look builder ("Match your mini" / "Wear it with")
     ====================================================================== */
  /* sizesFor(p, color?) → [{s, avail}] (colour given: availability in that colour only). Used by the shop's size filter. */
  function sizesFor(p, color) {
    var out = [];
    (p.sz || []).forEach(function (s) {
      var avail = (p.v || []).some(function (v) { return v[0] === s && (!color || v[1] === color) && v[2]; });
      out.push({ s: s, avail: avail || !(p.v && p.v.length) });
    });
    return out;
  }
  function priceFor(p, size, color) {
    var v = (p.v || []).filter(function (x) { return (!size || x[0] === size) && (!color || x[1] === color); });
    return v.length && v[0][3] != null ? v[0][3] : p.p;
  }
  SG.sizesFor = sizesFor;
  SG.priceFor = priceFor;
  function needsSize(p) { return (p.sz || []).length > 1 || ((p.sz || []).length === 1 && !/^(os|one size|o\/s)$/i.test(p.sz[0])); }

  /**
   * SG.look(el, items, opts) → renders a look list (thumb, type label, name, size/colour pickers, price, checkbox, total, CTA).
   * items: [{p, type:'For you'}]. opts {cta:'Add the look to bag'}. Returns the number of rows.
   * Every row works on p's REAL variants: a "For you" row offers adult sizes only and a "For your mini" row kids' sizes
   * only (when the piece has them); sold-out colours are disabled; the size list follows the chosen colour (a size that
   * doesn't exist in that colour is disabled, and a picked size that stops existing is cleared with a note); add-to-bag
   * refuses any (size, colour) that is not an available variant. A row whose sizes cost different amounts reads
   * "From $X" until a size is chosen, and so does the look total.
   */
  SG.look = function (el, items, opts) {
    opts = opts || {};
    items = (items || []).filter(function (it) { return it && it.p; });
    if (!items.length) { el.innerHTML = ''; return 0; }
    var M = items.map(function (it) {
      var p = it.p;
      var fam = /^for you$/i.test(it.type || '') ? 'adult' : /mini/i.test(it.type || '') ? 'kids' : null;
      var V = SG.famVariants(p, fam);
      var famSizes = (p.sz || []).filter(function (s) { return V.some(function (v) { return v[0] === s; }); });
      var sizes = famSizes.length ? famSizes : (p.sz || []);
      var cols = (p.co || []).filter(Boolean).filter(function (c) { return !V.length || V.some(function (v) { return v[1] === c; }); });
      var hasV = V.length > 0;
      var ok = function (size, color) {   // is (size, colour) an available variant? (null = any)
        if (!hasV) return !!p.av;
        return V.some(function (v) { return (!size || v[0] === size) && (!color || v[1] == null || v[1] === color) && v[2]; });
      };
      var color0 = cols.filter(function (c) { return ok(null, c); })[0] || cols[0] || '';
      return { p: p, fam: fam, V: V, sizes: sizes, cols: cols, ok: ok, color0: color0, need: needsSize(p) && sizes.length > 0 };
    });
    el.innerHTML = '<ul class="look__list">' + items.map(function (it, i) {
      var m = M[i], p = m.p;
      return '<li class="look__row" data-i="' + i + '">' +
        '<a class="look__th" href="' + SG.productUrl(p.h) + '" tabindex="-1" aria-hidden="true">' + (p.img && p.img[0] ? '<img src="' + SG.esc(SG.img(p.img[0], 200)) + '" alt="" width="64" height="80" loading="lazy" decoding="async">' : '') + '</a>' +
        '<div><span class="look__type">' + SG.esc(it.type || '') + (p.fs ? ' · Final sale' : '') + '</span>' +
          '<a class="look__name" href="' + SG.productUrl(p.h) + '">' + SG.esc(p.t) + '</a>' +
          '<div class="look__opts">' +
            (m.need ? '<span class="sel"><select data-k="size" aria-label="Size for ' + SG.esc(p.t) + '"><option value="">Choose a size</option>' +
              m.sizes.map(function (s) { return '<option value="' + SG.esc(s) + '">' + SG.esc(s) + '</option>'; }).join('') + '</select></span>' : '') +
            (m.cols.length > 1 ? '<span class="sel"><select data-k="color" aria-label="Color for ' + SG.esc(p.t) + '">' +
              m.cols.map(function (c) { var out = !m.ok(null, c); return '<option value="' + SG.esc(c) + '"' + (out ? ' disabled' : '') + (c === m.color0 ? ' selected' : '') + '>' + SG.esc(c) + (out ? ' (sold out)' : '') + '</option>'; }).join('') + '</select></span>' : '') +
          '</div><p class="look__msg" role="status"></p></div>' +
        '<span class="look__price"></span>' +
        '<label class="look__chk"><input type="checkbox"' + (it.off ? '' : ' checked') + ' aria-label="Include ' + SG.esc(p.t) + '"><span></span></label>' +
      '</li>';
    }).join('') + '</ul>' +
    '<div class="look__total"><span>Look total</span><strong></strong></div>' +
    '<button type="button" class="btn btn--scarlet btn--block look__add">' + SG.esc(opts.cta || 'Add the look to bag') + '</button>' +
    '<p class="look__note"></p>';

    var rows = el.querySelectorAll('.look__row');
    function state(i) {
      var r = rows[i], m = M[i];
      var size = r.querySelector('[data-k=size]'), color = r.querySelector('[data-k=color]');
      return { m: m, p: m.p, on: r.querySelector('input[type=checkbox]').checked,
        size: size ? size.value : (m.need ? '' : (m.sizes[0] || '')), color: color ? color.value : (m.cols[0] || ''), sizeEl: size, row: r };
    }
    /* size options follow the chosen colour; a picked size that doesn't exist in it is cleared, with a note */
    function syncSizes(i, announce) {
      var s = state(i), msg = s.row.querySelector('.look__msg');
      if (!s.sizeEl) return;
      var cleared = '';
      Array.prototype.forEach.call(s.sizeEl.options, function (o) {
        if (!o.value) return;
        var good = s.m.ok(o.value, s.color);
        o.disabled = !good;
        o.textContent = o.value + (good ? '' : ' (sold out' + (s.m.cols.length > 1 && s.color ? ' in this color' : '') + ')');
        if (!good && o.selected) cleared = o.value;
      });
      if (cleared) {
        s.sizeEl.value = '';
        if (announce) msg.textContent = cleared + ' isn’t available in ' + s.color + '. Choose another size.';
      }
    }
    function rowPrice(s) {
      if (s.size) return { lo: priceFor(s.p, s.size, s.color || null), exact: true };
      var v = s.m.V.filter(function (x) { return (!s.color || x[1] == null || x[1] === s.color) && x[3] != null; });
      var live = v.filter(function (x) { return x[2]; });
      var list = (live.length ? live : v).map(function (x) { return Number(x[3]); });
      if (!list.length) return { lo: s.p.p, exact: true };
      var lo = Math.min.apply(null, list), hi = Math.max.apply(null, list);
      return { lo: lo, exact: lo === hi };
    }
    function total() {
      var t = 0, exact = true;
      rows.forEach(function (r, i) {
        var s = state(i), pr = rowPrice(s);
        r.querySelector('.look__price').textContent = (pr.exact ? '' : 'From ') + SG.money(pr.lo);
        r.classList.toggle('is-off', !s.on);   // unticked: the photo dims, the text stays readable (AA)
        if (s.on) { t += pr.lo; if (!pr.exact) exact = false; }
      });
      el.querySelector('.look__total strong').textContent = (exact ? '' : 'From ') + SG.money(t);
      // a returns promise only when no ticked piece is final sale (data.js p.fs: its own description says no returns)
      var fsOn = M.some(function (m, i) { return m.p.fs && state(i).on; });
      el.querySelector('.look__note').textContent = 'Pick a size on each piece. ' + (fsOn ? 'Pieces marked final sale can’t be returned or exchanged.' : 'Free returns & exchanges with Checkout+.');
    }
    el.onchange = function (e) {   // property, not addEventListener: re-renders (team switch) replace it
      var r = e.target.closest('.look__row');
      if (e.target.matches('select')) e.target.classList.remove('is-missing');
      if (r) {
        r.querySelector('.look__msg').textContent = '';
        if (e.target.matches('[data-k=color]')) syncSizes(+r.getAttribute('data-i'), true);
        else if (!e.target.matches('select')) syncSizes(+r.getAttribute('data-i'), false);   // a row pre-filled from outside (the PDP picker)
      }
      total();
    };
    el.querySelector('.look__add').addEventListener('click', function () {
      var picks = [], missing = false, bad = null;
      rows.forEach(function (r, i) {
        var s = state(i);
        if (!s.on) return;
        if (s.sizeEl && !s.size) { s.sizeEl.classList.add('is-missing'); missing = true; }
        else if (!s.m.ok(s.size || null, s.color || null)) { bad = bad || s; }
        picks.push(s);
      });
      if (!picks.length) { SG.toast('Tick at least one piece to add.'); return; }
      if (missing) { SG.toast('Pick a size on each piece first.'); var m = el.querySelector('.is-missing'); if (m) m.focus(); return; }
      if (bad) {   // never add a size/colour combination that isn't a real, available variant
        bad.row.querySelector('.look__msg').textContent = 'That size and color isn’t available. Choose another.';
        if (bad.sizeEl) { bad.sizeEl.classList.add('is-missing'); bad.sizeEl.focus(); }
        SG.toast('One piece isn’t available in that size and color.');
        return;
      }
      picks.forEach(function (s) { SG.addToBag({ h: s.p.h, size: s.size, color: s.color }, { open: false, quiet: true }); });
      SG.bag.open();
      SG.toast('Added ' + picks.length + ' piece' + (picks.length === 1 ? '' : 's') + ' to your bag.');
    });
    rows.forEach(function (r, i) { syncSizes(i, false); });
    total();
    return items.length;
  };

  /**
   * SG.mini(el, opts) → true if a look was rendered. "Match your mini": a mom piece + her mini's cheer dress (+ bow/accessory).
   * Auburn by default; team chips appear when 2+ schools have both pieces. opts {school:'auburn', teamsEl: element for chips}
   */
  /* a college/program client-store piece ("webstore" tag, or tagged with a program collection or one of their own
     program tags, spelling as in their data) is not a mom top, a pairing or a lead card in a department rail */
  var PROGRAM_TAGS = { 'auburn-nursing': 1, 'auburn-univeristy-college-of-education': 1, 'au-speech-language-hearing-sciences': 1 };
  function isProgramPiece(p) {
    return (p.tags || []).some(function (t) { t = String(t).toLowerCase(); return t === 'webstore' || !!PROGRAM_COLS[t] || !!PROGRAM_TAGS[t]; });
  }
  SG.isProgramPiece = isProgramPiece;
  SG.miniSet = function (slug) {
    var dress = SG.collection('girls-cheer-dresses').concat(PRODUCTS).filter(function (p) { return p.sch === slug && p.cat === 'cheer-dress' && p.av; })[0];
    var moms = SG.collections(['auburn-womens-specialty', 'the-ava-collection', 'the-kristen-collection', 'the-becca-collection', 'mallory-gingham-mocknecks', 'the-alli-collection', 'auburn-adult-apparel'])
      .concat(PRODUCTS)
      .filter(function (p) { return p.sch === slug && p.who === 'women' && p.av && !isProgramPiece(p) && ['crewneck', 'mockneck', 'tee', 'set', 'quarter-zip', 'long-sleeve', 'tank'].indexOf(p.cat) > -1; });
    // the top that goes with the dress: same colour first (a navy dress → a navy top), else their merch order
    var dc = dress ? (dress.co || []).map(function (c) { return String(c).toLowerCase().split(/[\s/]+/)[0]; }) : [];
    var mom = moms.filter(function (p) { return (p.co || []).some(function (c) { return dc.indexOf(String(c).toLowerCase().split(/[\s/]+/)[0]) > -1; }); })[0] || moms[0];
    // Auburn: the Brooke striped crewneck is the mom & mini piece in the inset photo; it leads whenever an adult size is in stock
    var brooke = slug === 'auburn' ? SG.product(PHOTO_DUP['mom-mini-auburn-stripes']) : null;
    var famLive = function (p, fam) { return (p.v || []).some(function (v) { return v[0] && SG.famOk(v[0], fam) && v[2]; }); };
    if (brooke && brooke.av && famLive(brooke, 'adult')) {
      // the photo shows both of them in the Brooke: the look is the Brooke for you and the Brooke for her (kids' sizes)
      if (famLive(brooke, 'kids')) return [{ p: brooke, type: 'For you' }, { p: brooke, type: 'For your mini' }].concat(dress ? [{ p: dress, type: 'Or her cheer dress', off: true }] : []);
      mom = brooke;
    }
    // the finishing touch is a cheer piece (bow, poms), never just any accessory (a blanket or a sticker)
    var acc = SG.collection('cheer-accessories').concat(PRODUCTS).filter(function (p) {
      return p.sch === slug && p.av && (p.cat === 'bow' || (p.cat === 'accessory' && (p.cols || []).indexOf('cheer-accessories') > -1) || (p.cat === 'accessory' && /\b(bows?|poms?|pom poms?)\b/i.test(p.t)));
    })[0];
    if (!mom || !dress) return null;
    return [{ p: mom, type: 'For you' }, { p: dress, type: 'For your mini' }].concat(acc ? [{ p: acc, type: 'The finishing touch' }] : []);
  };
  SG.mini = function (el, opts) {
    opts = opts || {};
    var cur = opts.school || 'auburn';
    var teams = (D.schools || []).filter(function (s) { return SG.miniSet(s.slug); });
    if (!SG.miniSet(cur)) { if (!teams.length) return false; cur = teams[0].slug; }
    if (opts.teamsEl) {
      if (teams.length > 1) {
        opts.teamsEl.hidden = false;
        opts.teamsEl.innerHTML = '<div class="chips" role="group" aria-label="Choose a team">' + teams.slice(0, 8).map(function (s) {
          return '<button type="button" class="chip" data-s="' + SG.esc(s.slug) + '" aria-pressed="' + (s.slug === cur) + '">' + SG.esc(s.name) + '</button>';
        }).join('') + '</div>';
        opts.teamsEl.onclick = function (e) {
          var b = e.target.closest('.chip');
          if (!b) return;
          cur = b.getAttribute('data-s');
          opts.teamsEl.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); });
          SG.look(el, SG.miniSet(cur), { cta: 'Add both to bag' });
        };
      } else { opts.teamsEl.hidden = true; }
    }
    SG.look(el, SG.miniSet(cur), { cta: 'Add the look to bag' });
    return true;
  };

  /* ======================================================================
     Toast
     ====================================================================== */
  var toastEl, toastT;
  /** SG.toast(msg, {html:false, ms:3800}) */
  SG.toast = function (msg, o) {
    o = o || {};
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    if (o.html) toastEl.innerHTML = msg; else toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, o.ms || 3800);
  };

  /* ======================================================================
     Overlay plumbing (scrim, focus, Escape)
     ====================================================================== */
  var scrim, openLayer = null, lastFocus = null;
  function ensureScrim() {
    if (scrim) return scrim;
    scrim = document.createElement('div');
    scrim.className = 'scrim';
    scrim.addEventListener('click', function () { closeLayer(); });
    document.body.appendChild(scrim);
    return scrim;
  }
  var hideT = null, inerted = [];
  /*
   * Modal layers (menu drawer, bag, search): everything else on the page is made inert while one is open, so Tab and
   * screen readers stay inside it (the toast stays live). `trigger` is the control that opened it: Safari never focuses
   * a tapped button, so document.activeElement would be <body> and focus could not return to the trigger on close.
   */
  function openLayerEl(el, focusSel, trigger) {
    if (openLayer && openLayer !== el) closeLayer(true);
    lastFocus = trigger || document.activeElement;
    clearTimeout(hideT);
    el.hidden = false;          // closed layers are hidden (out of layout); unhide, reflow, then animate in
    void el.offsetWidth;
    ensureScrim().classList.add('is-on');
    el.classList.add('is-on');
    el.removeAttribute('inert');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    openLayer = el;
    inerted = Array.prototype.filter.call(document.body.children, function (c) {
      return c !== el && c !== scrim && !c.classList.contains('toast') && c.tagName !== 'SCRIPT' && !c.inert;
    });
    inerted.forEach(function (c) { c.inert = true; });
    var f = focusSel && el.querySelector(focusSel);
    window.setTimeout(function () { (f || el).focus({ preventScroll: true }); }, 60);
  }
  function closeLayer(silent) {
    if (!openLayer) return;
    var el = openLayer;
    el.classList.remove('is-on');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('inert', '');
    hideT = setTimeout(function () { if (!el.classList.contains('is-on')) el.hidden = true; }, 380);
    if (scrim) scrim.classList.remove('is-on');
    document.body.classList.remove('is-locked');
    inerted.forEach(function (c) { c.inert = false; });
    inerted = [];
    openLayer = null;
    document.querySelectorAll('[aria-expanded="true"][data-sg-opens]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (!silent && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  SG.closeOverlay = closeLayer;
  // Tab / Shift+Tab wrap inside the open layer (the rest of the page is inert, so focus would otherwise fall to <body>)
  function trapTab(e) {
    if (e.key !== 'Tab' || !openLayer) return;
    var f = Array.prototype.filter.call(openLayer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])'),
      function (el) { return !el.closest('[hidden]') && (el.offsetParent !== null || el === document.activeElement); });
    if (!f.length) return;
    // move focus ourselves: WebKit's native Tab skips links, so its idea of "the last control" differs from ours
    e.preventDefault();
    var i = f.indexOf(document.activeElement);
    var n = i < 0 ? (e.shiftKey ? f.length - 1 : 0) : (i + (e.shiftKey ? -1 : 1) + f.length) % f.length;
    f[n].focus();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openLayer) { closeLayer(); return; }
    trapTab(e);
  });

  /* ======================================================================
     Bag (localStorage sg_bag_v1, demo only)
     ====================================================================== */
  var BAG_KEY = 'sg_bag_v1';
  var FREE_SHIP = 100;
  var bag = readJSON(BAG_KEY, []);
  if (!Array.isArray(bag)) bag = [];
  function saveBag() { writeJSON(BAG_KEY, bag); renderBag(); updateCounts(); }
  function bagCount() { return bag.reduce(function (n, it) { return n + (it.q || 1); }, 0); }
  function bagTotal() { return bag.reduce(function (n, it) { return n + (it.p || 0) * (it.q || 1); }, 0); }

  /**
   * SG.addToBag(item, opts). item {h, size, color, qty} — title/price/image are looked up from SG_DATA
   * (or pass t, p, img yourself). opts {open:true, quiet:false}
   */
  SG.addToBag = function (item, opts) {
    opts = opts || {};
    var p = SG.product(item.h) || {};
    var it = {
      h: item.h, s: item.size || '', c: item.color || '', q: Math.max(1, item.qty || 1),
      t: item.t || p.t || item.h, p: item.p != null ? item.p : priceFor(p, item.size, item.color) || p.p || 0,
      img: item.img || (p.img && p.img[0]) || ''
    };
    it.k = [it.h, it.s, it.c].join('|');
    var found = bag.filter(function (b) { return b.k === it.k; })[0];
    if (found) found.q += it.q; else bag.push(it);
    saveBag();
    if (!opts.quiet) SG.toast('Added to your bag: ' + it.t + (it.s ? ' (' + it.s + ')' : ''));
    if (opts.open !== false) SG.bag.open();
    return it;
  };

  var bagEl;
  function renderBag() {
    if (!bagEl) return;
    var body = bagEl.querySelector('.drawer__body'), foot = bagEl.querySelector('.drawer__foot');
    var tot = bagTotal(), left = Math.max(0, FREE_SHIP - tot);
    bagEl.querySelector('.drawer__title').textContent = 'Your bag' + (bag.length ? ' (' + bagCount() + ')' : '');
    if (!bag.length) {
      body.innerHTML = '<div class="bag__empty"><p>Your bag is empty.</p><small>Start with our home team. Most orders ship from right here in Auburn.</small>' +
        '<a class="btn btn--scarlet btn--block" href="auburn.html">Shop Auburn</a><a class="btn btn--line-ink btn--block" href="' + SG.esc(SG.shopUrl({ c: CH.featured.c })) + '">Shop ' + SG.esc(CH.nav) + '</a></div>';
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = '<div class="bag__ship">' + (left > 0 ? 'You’re <strong>' + SG.money(left) + '</strong> away from free shipping.' : 'Your order ships free.') +
      '<div class="bag__bar" aria-hidden="true"><i style="width:' + Math.min(100, Math.round(tot / FREE_SHIP * 100)) + '%"></i></div></div>' +
      '<ul class="bag__list">' + bag.map(function (it, i) {
        return '<li class="bag__item"><a class="bag__th" href="' + SG.productUrl(it.h) + '" tabindex="-1" aria-hidden="true">' +
          (it.img ? '<img src="' + SG.esc(SG.img(it.img, 200)) + '" alt="" width="76" height="95" loading="lazy">' : '') + '</a>' +
          '<div><p class="bag__t"><a href="' + SG.productUrl(it.h) + '">' + SG.esc(it.t) + '</a></p>' +
          '<p class="bag__v">' + SG.esc([it.s, it.c, bagFs(it) ? 'Final sale' : ''].filter(Boolean).join(' · ')) + '</p>' +
          '<div class="bag__qty"><button type="button" data-bag="dec" data-i="' + i + '" aria-label="Decrease quantity">−</button><span aria-live="polite">' + it.q + '</span>' +
          '<button type="button" data-bag="inc" data-i="' + i + '" aria-label="Increase quantity">+</button></div><br>' +
          '<button type="button" class="bag__rm" data-bag="rm" data-i="' + i + '">Remove</button></div>' +
          '<span class="bag__p">' + SG.money(it.p * it.q) + '</span></li>';
      }).join('') + '</ul>';
    foot.querySelector('.bag__sub strong').textContent = SG.money(tot);
    // a returns promise only when no piece in the bag is final sale (data.js p.fs: its own description says no returns)
    foot.querySelector('.bag__fine').innerHTML = 'Free shipping on orders $100+. Local pickup for apparel &amp; hats at our Auburn shop. ' +
      (bag.some(bagFs) ? 'Pieces marked final sale can’t be returned or exchanged.' : 'Add Checkout+ for free returns &amp; exchanges.');
  }
  function bagFs(it) { var x = BY_H[it.h]; return !!(x && x.fs); }
  function updateCounts() {
    var n = bagCount();
    document.querySelectorAll('.hdr__count').forEach(function (c) { c.textContent = n; c.setAttribute('data-n', n); });
    document.querySelectorAll('[data-sg-bag]').forEach(function (b) { b.setAttribute('aria-label', 'Bag, ' + n + ' item' + (n === 1 ? '' : 's')); });
  }
  SG.bag = {
    items: function () { return bag.slice(); },
    count: bagCount,
    total: bagTotal,
    open: function (trigger) { renderBag(); openLayerEl(bagEl, '.drawer__x', trigger); },
    close: function () { closeLayer(); },
    clear: function () { bag = []; saveBag(); }
  };

  /* ======================================================================
     Navigation config (Auburn first after the chapter link)
     ====================================================================== */
  var AU_SHOP = [
    ['Women’s specialty', 'auburn-womens-specialty'], ['Tees & fleece', 'auburn-adult-apparel'], ['Girls & kids', 'auburn-kids-specialty'],
    ['Kids tees & fleece', 'auburn-kids-apparel'], ['Men’s collection', 'auburn-mens-collection'], ['Hats', 'auburn-hat-collection-1'],
    ['Accessories & gifts', 'auburn-accessories-gifts']
  ];
  var AU_MORE = [
    ['In stock now', 'auburn-university-in-stock-items'], ['Basketball', 'auburn-basketball'], ['Original Aubie', 'original-aubie-basketball'],
    ['Baseball', 'auburn-baseball'], ['Gymnastics', 'auburn-gymnastics'], ['Alumni', 'auburn-alumni'], ['Best sellers', 'auburn-best-sellers']
  ];
  var SIGS = [
    ['The Mallory', 'Gingham mockneck', 'mallory-gingham-mocknecks'], ['The Becca', 'Boxy crewneck', 'the-becca-collection'],
    ['The Alli', 'Tank & skort', 'the-alli-collection'], ['The Ava', 'Airy crewneck & shorts', 'the-ava-collection'],
    ['The Grace', 'Gingham dresses', 'grace-gingham-dresses'], ['The Kristen', 'Airy tee', 'the-kristen-collection']
  ];
  var SIG_MORE = [['The Madi', 'the-madi-collection'], ['Katy camo sets', 'katy-camo-sets'], ['Sophia scarves', 'sophia-scarves'], ['Script embroidery', 'limited-release-script-embroidered-sweatshirts']];
  SG.nav = { auburn: AU_SHOP.concat(AU_MORE), signatures: SIGS, signaturesMore: SIG_MORE };
  var CHEER_AU = SG.ctaUrl('girls-cheer-dresses', { school: 'auburn' });   // Auburn cheer dresses (the all-school cheer page leads with other schools' photos)
  var GIFTS_AU = SG.ctaUrl('auburn-accessories-gifts');
  var INSTOCK_AU = SG.ctaUrl('auburn-university-in-stock-items');
  /* Sale: the loaded Auburn pieces with a compare-at price (labelled "Sale", never presented as their Closeout Sale collection) */
  var SALE_URL = SG.ctaUrl('closeout-sale');
  /* rule-labelled menu rows go where their pieces are (SG.ctaUrl); rows that name a collection keep the collection page */
  var RULE_ROWS = { 'auburn-kids-specialty': 1, 'auburn-hat-collection-1': 1, 'auburn-accessories-gifts': 1, 'auburn-university-in-stock-items': 1, 'auburn-basketball': 1 };
  function rowUrl(h) { return RULE_ROWS[h] ? SG.ctaUrl(h) : SG.shopUrl({ c: h }); }
  function shortProgram(t) { return t.replace(/^Auburn University /, '').replace(/^Auburn /, '').replace(/^AU /, ''); }

  function megaList(title, rows) {
    return '<div><p class="mega__h">' + SG.esc(title) + '</p><ul class="mega__list">' + rows.map(function (r) {
      return '<li><a href="' + SG.esc(r[1].indexOf('.html') > -1 || r[1].indexOf('http') === 0 ? r[1] : rowUrl(r[1])) + '">' + SG.esc(r[0]) + '</a></li>';
    }).join('') + '</ul></div>';
  }
  function megaAuburn() {
    var progs = (D.programs || []).map(function (p) { return [shortProgram(p.t), 'auburn.html#programs']; })
      .filter(function (r) { return r[0].length <= 30; }).slice(0, 6);
    progs.push(['All colleges & programs', 'auburn.html#programs']);
    var feat = SG.photo('auburn-tee-grid-flatlay');
    return '<div class="mega" id="mega-auburn"><div class="wrap mega__in">' +
      megaList('Shop Auburn', AU_SHOP) + megaList('Seasons & more', AU_MORE) + megaList('Colleges & programs', progs) +
      '<a class="mega__feature" href="auburn.html"><figure>' + imgTag(feat, { alt: '' }) + '</figure>' +
      '<p>The Auburn shop</p><span>Everything we make for our home team, designed a few miles from Jordan-Hare.</span></a>' +
      '</div></div>';
  }
  function megaSignatures() {
    return '<div class="mega" id="mega-sig"><div class="wrap mega__in mega__in--sig">' +
      megaList('Our own designs', SIGS.map(function (s) { return [s[0], s[2]]; }).concat(SIG_MORE)) +
      '<div class="mega__sig">' + SIGS.map(function (s) {
        // SG.photo applies the photo cautions (the Alli card gets the tank & skort shot, not the mouth-cut group)
        var ph = SG.photo('col:' + s[2], 400);
        var pos = ph && TORSO[ph.key] ? '50% 100%' : null;
        return '<a class="mega__card" href="' + SG.shopUrl({ c: s[2] }) + '"><figure>' +
          (ph ? '<img src="' + SG.esc(ph.src) + '" alt="" width="400" height="400" loading="lazy" decoding="async"' + (pos ? ' style="object-position:' + pos + '"' : '') + '>' : '') +
          '</figure><p>' + SG.esc(s[0]) + '</p><span>' + SG.esc(s[1]) + '</span></a>';
      }).join('') + '</div></div></div>';
  }
  function megaSchools() {
    return '<div class="mega" id="mega-schools"><div class="wrap mega__in mega__in--schools">' +
      '<div><p class="mega__h">Shop your school</p>' + SG.schoolsHTML() +
      '<div class="mega__foot"><span class="small muted">Auburn is our home team. Every school we make, officially licensed.</span>' +
      '<a class="tlink" href="index.html#schools">Shop all schools</a></div></div></div></div>';
  }

  var NAV = [
    { k: 'chapter', label: CH.nav, href: SG.shopUrl({ c: CH.featured.c }), chapter: true },
    { k: 'auburn', label: 'Auburn', href: 'auburn.html', mega: megaAuburn, page: 'auburn' },
    { k: 'signatures', label: 'Signature Styles', href: 'index.html#signatures', mega: megaSignatures },
    { k: 'cheer', label: 'Cheer', href: CHEER_AU },
    { k: 'schools', label: 'Shop Your School', href: 'index.html#schools', mega: megaSchools },
    { k: 'gifts', label: 'Gifts', href: GIFTS_AU },
    { k: 'custom', label: 'Custom', href: STORE.custom, ext: true },
    { k: 'sale', label: 'Sale', href: SALE_URL },
    { k: 'story', label: 'Our Story', href: 'story.html', page: 'story' }
  ];

  /* ======================================================================
     Chrome: ticker, header, nav, drawers, search, footer
     ====================================================================== */
  var PAGE = document.body.getAttribute('data-page') || '';

  function buildTicker() {
    var items = CH.ticker.map(function (m) { return '<span class="tick__item">' + SG.esc(m) + '</span>'; }).join('');
    return '<div class="tick" role="region" aria-label="Store announcements"><div class="tick__track">' + items +
      '<span class="tick__dup" aria-hidden="true">' + items + '</span></div></div><div class="stripe stripe--edge" aria-hidden="true"></div>';
  }

  function buildHeader() {
    var nav = NAV.map(function (n) {
      var cur = n.page && n.page === PAGE ? ' aria-current="page"' : '';
      var cls = 'nav__link' + (n.chapter ? ' nav__link--chapter' : '');
      var a = '<a class="' + cls + '" href="' + SG.esc(n.href) + '"' + cur + (n.ext ? ' target="_blank" rel="noopener"' : '') +
        (n.mega ? ' aria-haspopup="true" aria-expanded="false"' : '') + '>' +
        (n.chapter ? '<span aria-hidden="true">★</span> ' : '') + SG.esc(n.label) + (n.mega ? I.caret : '') + (n.ext ? I.ext + '<span class="sr"> (opens Scarlet &amp; Gold Custom)</span>' : '') + '</a>';
      return '<li class="nav__item' + (n.mega ? ' nav__item--mega' : '') + '" data-k="' + n.k + '">' + a + (n.mega ? n.mega() : '') + '</li>';
    }).join('');
    return '<header class="hdr" id="sg-hdr">' +
      '<div class="wrap hdr__bar">' +
        '<div class="hdr__left">' +
          '<button type="button" class="hdr__btn hdr__burger" data-sg-menu data-sg-opens aria-label="Menu" aria-controls="sg-mnav" aria-expanded="false">' + I.menu + '</button>' +
          '<button type="button" class="hdr__btn hdr__search" data-sg-search data-sg-opens aria-label="Search" aria-controls="sg-search" aria-expanded="false">' + I.search + '<span class="hdr__label" aria-hidden="true">Search</span></button>' +
        '</div>' +
        '<a class="hdr__logo" href="index.html"><img src="' + SG.esc(CH.logo || 'assets/logo-scarlet.png') + '" alt="Scarlet &amp; Gold" width="1400" height="153" fetchpriority="high"></a>' +
        '<div class="hdr__right">' +
          '<button type="button" class="hdr__btn hdr__signin" data-sg-signin>' + I.user + '<span class="hdr__label">Sign in</span></button>' +
          '<button type="button" class="hdr__btn hdr__heart" data-sg-saved aria-label="Saved items">' + I.heart + '</button>' +
          '<button type="button" class="hdr__btn hdr__bag" data-sg-bag data-sg-opens aria-label="Bag" aria-controls="sg-bag" aria-expanded="false">' + I.bag +
            '<span class="hdr__label" aria-hidden="true">Bag</span><span class="hdr__count" data-n="0" aria-hidden="true">0</span></button>' +
        '</div>' +
      '</div>' +
      '<nav class="nav" aria-label="Main"><ul class="nav__list wrap">' + nav + '</ul></nav>' +
    '</header>';
  }

  function buildMenuDrawer() {
    var acc = function (id, label, inner) {
      return '<li><button type="button" class="mnav__acc" aria-expanded="false" aria-controls="mn-' + id + '">' + SG.esc(label) + I.chev + '</button>' +
        '<div class="mnav__panel" id="mn-' + id + '" hidden>' + inner + '</div></li>';
    };
    var links = function (rows) { return rows.map(function (r) { return '<a href="' + SG.esc(r[1].indexOf('.html') > -1 ? r[1] : rowUrl(r[1])) + '">' + SG.esc(r[0]) + '</a>'; }).join(''); };
    var li = function (label, href, cls, ext) {
      return '<li><a class="mnav__link' + (cls ? ' ' + cls : '') + '" href="' + SG.esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + label + '</a></li>';
    };
    return '<aside class="drawer drawer--left" id="sg-mnav" tabindex="-1" aria-label="Menu" aria-hidden="true" inert hidden>' +
      '<div class="drawer__head"><a class="hdr__logo" href="index.html"><img src="' + SG.esc(CH.logo || 'assets/logo-scarlet.png') + '" alt="Scarlet &amp; Gold" width="1400" height="153"></a>' +
      '<button type="button" class="drawer__x" aria-label="Close menu">' + I.close + '</button></div>' +
      '<div class="drawer__body">' +
        '<form class="mnav__search" role="search" action="shop.html"><label class="sr" for="mn-q">Search the shop</label>' + I.search +
        '<input id="mn-q" name="q" type="search" placeholder="Search the shop" autocomplete="off"></form>' +
        '<ul class="mnav__list">' +
          li('<span aria-hidden="true">★ </span>' + SG.esc(CH.nav), SG.shopUrl({ c: CH.featured.c }), 'mnav__link--chapter') +
          acc('auburn', 'Auburn', '<a href="auburn.html"><strong>The Auburn shop</strong></a>' + links(AU_SHOP) + links(AU_MORE) + '<a href="auburn.html#programs">Colleges &amp; programs</a>') +
          acc('sig', 'Signature Styles', links(SIGS.map(function (s) { return [s[0] + ' · ' + s[1], s[2]]; })) + links(SIG_MORE)) +
          li('Cheer', CHEER_AU) +
          acc('schools', 'Shop Your School', SG.schoolsHTML({ tag: false })) +
          li('Gifts', GIFTS_AU) +
          li('Custom orders <span class="sr">(opens Scarlet &amp; Gold Custom)</span>', STORE.custom, '', true) +
          li('Sale', SALE_URL) +
          li('Our Story', 'story.html') +
          li('Visit the shop', 'visit.html') +
        '</ul>' +
        '<div class="mnav__extra">' +
          '<button type="button" data-sg-signin>' + I.user + 'Sign in</button>' +
          '<a href="visit.html#help">' + I.mail + 'Help &amp; FAQ</a>' +
          '<a href="tel:' + STORE.tel + '">' + I.phone + STORE.phone + '</a>' +
          '<a href="' + STORE.maps + '" target="_blank" rel="noopener">' + I.pin + STORE.street + ', Auburn</a>' +
        '</div>' +
      '</div></aside>';
  }

  function buildBagDrawer() {
    return '<aside class="drawer" id="sg-bag" tabindex="-1" aria-label="Your bag" aria-hidden="true" inert hidden>' +
      '<div class="drawer__head"><p class="drawer__title">Your bag</p><button type="button" class="drawer__x" aria-label="Close bag">' + I.close + '</button></div>' +
      '<div class="drawer__body"></div>' +
      '<div class="drawer__foot" hidden>' +
        '<div class="bag__sub"><span>Subtotal</span><strong></strong></div>' +
        '<button type="button" class="btn btn--scarlet btn--block" data-sg-checkout>Checkout</button>' +
        '<p class="bag__fine">Free shipping on orders $100+. Local pickup for apparel &amp; hats at our Auburn shop. Add Checkout+ for free returns &amp; exchanges.</p>' +
      '</div></aside>';
  }

  function buildSearch() {
    var popular = [['Auburn', 'auburn'], ['S&G Christmas', 's-g-christmas'], ['Cheer dresses', 'girls-cheer-dresses'], ['The Alli', 'the-alli-collection'], ['Original Aubie', 'original-aubie-basketball'], ['In stock now', 'auburn-university-in-stock-items']];
    return '<div class="srch" id="sg-search" role="dialog" aria-modal="true" aria-label="Search" tabindex="-1" aria-hidden="true" inert hidden>' +
      '<form class="wrap srch__bar" role="search" action="shop.html">' + I.search +
        '<label class="sr" for="sg-q">Search Scarlet &amp; Gold</label><input id="sg-q" name="q" type="search" placeholder="Search tees, cheer dresses, schools…" autocomplete="off">' +
        '<button type="button" class="drawer__x" data-sg-close aria-label="Close search">' + I.close + '</button></form>' +
      '<div class="wrap srch__body">' +
        '<div><p class="srch__h" id="srch-lh">Popular</p><ul class="srch__links" id="srch-links">' + popular.map(function (r) {
          return '<li><a href="' + SG.esc(r[1] === 'girls-cheer-dresses' ? CHEER_AU : rowUrl(r[1])) + '">' + SG.esc(r[0]) + '</a></li>'; }).join('') + '</ul></div>' +
        '<div id="srch-right"><p class="srch__h">Shop your school</p>' + SG.schoolsHTML({ limit: 8, tag: false }) + '</div>' +
      '</div></div>';
  }

  function runSearch(q) {
    var left = document.getElementById('srch-links'), lh = document.getElementById('srch-lh'), right = document.getElementById('srch-right');
    q = (q || '').trim();
    if (!q) {
      var fresh = document.createElement('div');
      fresh.innerHTML = buildSearch();
      left.innerHTML = fresh.querySelector('#srch-links').innerHTML; lh.textContent = 'Popular';
      right.innerHTML = fresh.querySelector('#srch-right').innerHTML;
      return;
    }
    var ql = q.toLowerCase();
    var schools = (D.schools || []).filter(function (s) { return s.name.toLowerCase().indexOf(ql) > -1; })
      .map(function (s) { return [s.name, SG.shopUrl({ school: s.slug }), 'School']; });
    var schoolNames = schools.map(function (r) { return r[0].toLowerCase(); });
    var cols = Object.keys(COLS).filter(function (h) { var t = COLS[h].t.toLowerCase(); return t.indexOf(ql) > -1 && schoolNames.indexOf(t) < 0; })
      .map(function (h) { return [COLS[h].t, SG.shopUrl({ c: h })]; });
    var links = schools.concat(cols).slice(0, 8);
    lh.textContent = links.length ? 'Collections & schools' : 'Collections';
    left.innerHTML = links.length ? links.map(function (r) { return '<li><a href="' + SG.esc(r[1]) + '">' + SG.esc(r[0]) + (r[2] ? '<small>' + r[2] + '</small>' : '') + '</a></li>'; }).join('')
      : '<li class="srch__empty">No collections match “' + SG.esc(q) + '”.</li>';
    var prods = SG.auburnFirst(SG.products({ q: q }));
    if (prods.length) {
      right.innerHTML = '<p class="srch__h">' + (D.partial ? 'Products in this preview' : 'Products') + '</p><div class="srch__prods">' + prods.slice(0, 8).map(function (p) { return SG.card(p, { ship: false, w: 400 }); }).join('') + '</div>' +
        '<a class="btn btn--line-ink srch__all" href="' + SG.shopUrl({ q: q }) + '">See all ' + prods.length + ' results</a>';
    } else {
      right.innerHTML = '<p class="srch__h">Products</p><p class="srch__empty">Press Enter to search the shop for “' + SG.esc(q) + '”, or try “Auburn”, “cheer dress” or “crewneck”.</p>';
    }
  }

  function buildFooter() {
    var col = function (cls, title, rows) {
      return '<div class="' + cls + '"><p class="ft__h">' + title + '</p><ul class="ft__list">' + rows.map(function (r) {
        return '<li><a href="' + SG.esc(r[1]) + '"' + (r[2] ? ' target="_blank" rel="noopener"' : '') + '>' + r[0] + '</a></li>';
      }).join('') + '</ul></div>';
    };
    return '<footer class="ft">' +
      '<div class="wrap">' +
        '<div class="ft__top"><div><a class="ft__logo" href="index.html"><img src="assets/logo-ivory.png" alt="Scarlet &amp; Gold" width="1400" height="153" loading="lazy"></a>' +
          '<p class="ft__line" data-sg-ftline>Show up proud. Stay comfortable. <em>Wear it again on Tuesday.</em></p></div>' +
          '<div class="ft__social"><a href="' + STORE.instagram + '" target="_blank" rel="noopener" aria-label="Scarlet &amp; Gold on Instagram">' + I.insta + '</a></div></div>' +
        '<div class="ft__cols">' +
          col('ft__col--auburn', 'Auburn', [['The Auburn shop', 'auburn.html'], ['In stock now', INSTOCK_AU], ['Girls &amp; kids', SG.ctaUrl('auburn-kids-specialty')],
            ['Hats', SG.ctaUrl('auburn-hat-collection-1')], ['Original Aubie', SG.shopUrl({ c: 'original-aubie-basketball' })], ['Colleges &amp; programs', 'auburn.html#programs']]) +
          col('ft__col--shop', 'Shop', [['Auburn', 'auburn.html'], ['Signature styles', 'index.html#signatures'], ['Cheer dresses', CHEER_AU],
            [SG.esc(CH.nav), SG.shopUrl({ c: CH.featured.c })], ['Gifts', GIFTS_AU], ['Sale', SALE_URL], ['Custom orders', STORE.custom, 1]]) +
          col('ft__col--help', 'Help', [['Shipping', 'visit.html#shipping'], ['Returns &amp; exchanges', 'visit.html#returns'], ['Start a return', STORE.returns, 1], ['Size guides', STORE.sizeGuides, 1],
            ['FAQ', 'visit.html#help'], ['Our story', 'story.html']]) +
          '<div class="ft__col--visit"><p class="ft__h">Visit</p><address class="ft__addr">' +
            '<a href="' + STORE.maps + '" target="_blank" rel="noopener">' + STORE.street + '<br>' + STORE.city + '</a><br><br>' +
            'Mon–Fri 10:00 AM – 4:30 PM<br>Sat 10:00 AM – 2:00 PM · Sun closed<br><br>' +
            '<a href="tel:' + STORE.tel + '">' + STORE.phone + '</a><br><a href="mailto:' + STORE.email + '">' + STORE.email + '</a></address></div>' +
          '<div class="ft__news" id="sg-list"><p class="ft__h">Get on the List</p><p>15% off your first order.</p>' +
            '<small>Plus early access to new drops and restock alerts.</small>' +
            '<form class="ft__form" data-sg-news><label class="sr" for="ft-email">Email address</label><input id="ft-email" type="email" name="email" placeholder="Email address" autocomplete="email" required>' +
            '<button type="submit">Join</button></form></div>' +
        '</div>' +
        '<div class="ft__bottom"><span>© 2026 Scarlet &amp; Gold · Auburn, Alabama · Officially licensed game day apparel, designed by women, for women and girls.</span>' +
          '<span>Concept by Williams Digital</span></div>' +
      '</div></footer>';
  }

  /* ======================================================================
     Mount
     ====================================================================== */
  function mount(selector, html, where) {
    var slot = document.querySelector(selector);
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    var frag = document.createDocumentFragment();
    while (wrap.firstChild) frag.appendChild(wrap.firstChild);
    if (slot) slot.replaceWith(frag);
    else if (where === 'start') document.body.insertBefore(frag, document.body.firstChild);
    else document.body.appendChild(frag);
  }

  mount('[data-sg="header"]', '<a class="skip" href="#main">Skip to content</a>' + buildTicker() + buildHeader(), 'start');
  mount('[data-sg="footer"]', buildFooter(), 'end');
  document.body.insertAdjacentHTML('beforeend', buildMenuDrawer() + buildBagDrawer() + buildSearch());

  bagEl = document.getElementById('sg-bag');
  var hdr = document.getElementById('sg-hdr');
  var mnav = document.getElementById('sg-mnav');
  var srch = document.getElementById('sg-search');
  renderBag();
  updateCounts();

  // auto-mounts
  document.querySelectorAll('[data-sg="visit"]').forEach(SG.visitBand);
  document.querySelectorAll('[data-sg="reviews"]').forEach(SG.reviews);
  document.querySelectorAll('[data-sg="schools"]').forEach(function (el) {
    el.innerHTML = el.hasAttribute('data-compact') ? SG.schoolsCompact() : SG.schoolsHTML({ collapse: true });
  });

  /*
   * Sticky header height → --sticky-top (used by scroll-margin-top on every [id] and by sticky sub-navs).
   * WebKit can run the deferred scripts (this file and the page script) BEFORE any stylesheet has applied: the header is
   * then position:static with its mega menus open in the flow, and offsetHeight reads ~14,000px. So the value is only
   * written once the header is actually styled (position:sticky); until then the CSS default (121px / 61px on phones)
   * stands. A ResizeObserver and the load event re-sync it. Page scripts should call SG.stickyTop() (live, never stale)
   * instead of reading the custom property at script time.
   */
  function headerStyled() { return getComputedStyle(hdr).position === 'sticky'; }
  SG.stickyTop = function () {
    if (headerStyled()) return hdr.offsetHeight;
    // no stylesheet yet: the CSS default if it has applied, else the same defaults sg.css uses
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sticky-top')) ||
      (window.matchMedia('(max-width: 1023px)').matches ? 61 : 121);
  };
  function syncHeader() {
    if (!headerStyled()) return;
    document.documentElement.style.setProperty('--sticky-top', hdr.offsetHeight + 'px');
  }
  syncHeader();
  if ('ResizeObserver' in window) new ResizeObserver(syncHeader).observe(hdr);
  window.addEventListener('load', syncHeader);
  var tick = document.querySelector('.tick');
  var stuckTick = false;
  window.addEventListener('scroll', function () {
    if (stuckTick) return;
    stuckTick = true;
    window.requestAnimationFrame(function () {
      hdr.classList.toggle('is-stuck', window.scrollY > (tick ? tick.offsetHeight + 8 : 8));
      stuckTick = false;
    });
  }, { passive: true });

  // mega menus: hover (with a short close delay), focus, tap-to-open on touch, Escape
  var megaItems = hdr.querySelectorAll('.nav__item--mega');
  var megaT = null;
  var megaFocusLock = false;   // Escape moves focus back to the nav link; that focusin must not re-open the menu
  function setMega(li, open) {
    megaItems.forEach(function (m) {
      var on = open && m === li;
      m.classList.toggle('is-open', on);
      m.querySelector('.nav__link').setAttribute('aria-expanded', String(on));
    });
  }
  megaItems.forEach(function (li) {
    var link = li.querySelector('.nav__link');
    li.addEventListener('mouseenter', function () { clearTimeout(megaT); setMega(li, true); });
    li.addEventListener('mouseleave', function () { megaT = setTimeout(function () { setMega(li, false); }, 160); });
    li.addEventListener('focusin', function () { if (megaFocusLock) return; clearTimeout(megaT); setMega(li, true); });
    li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) setMega(li, false); });
    link.addEventListener('click', function (e) {
      if (window.matchMedia('(hover: none)').matches && !li.classList.contains('is-open')) { e.preventDefault(); setMega(li, true); }
      else setMega(li, false);
    });
    li.querySelector('.mega').addEventListener('click', function (e) { if (e.target.closest('a')) setMega(li, false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = hdr.querySelector('.nav__item--mega.is-open');
    if (!open) return;
    megaFocusLock = true;
    open.querySelector('.nav__link').focus();
    setMega(open, false);
    window.setTimeout(function () { megaFocusLock = false; }, 0);
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav__item--mega')) setMega(null, false); });

  // phone menu accordions
  mnav.addEventListener('click', function (e) {
    var b = e.target.closest('.mnav__acc');
    if (!b) return;
    var open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    document.getElementById(b.getAttribute('aria-controls')).hidden = !open;
  });

  // search
  var sInput = document.getElementById('sg-q'), sT = null;
  sInput.addEventListener('input', function () { clearTimeout(sT); sT = setTimeout(function () { runSearch(sInput.value); }, 90); });
  SG.search = {
    open: function (q, trigger) { if (q != null) { sInput.value = q; runSearch(q); } openLayerEl(srch, '#sg-q', trigger); },
    close: function () { closeLayer(); }
  };

  // global click delegation
  document.addEventListener('click', function (e) {
    var t = e.target;
    var el;
    // the clicked control is passed along so focus can return to it on close (Safari doesn't focus tapped buttons)
    if ((el = t.closest('[data-sg-menu]'))) { el.setAttribute('aria-expanded', 'true'); openLayerEl(mnav, '.drawer__x', el); return; }
    if ((el = t.closest('[data-sg-search]'))) { el.setAttribute('aria-expanded', 'true'); SG.search.open(null, el); return; }
    if ((el = t.closest('[data-sg-bag]'))) { el.setAttribute('aria-expanded', 'true'); SG.bag.open(el); return; }
    if (t.closest('.drawer__x, [data-sg-close]')) { closeLayer(); return; }
    if ((el = t.closest('[data-sg-schools-more]'))) {
      var ul = el.previousElementSibling, all = !ul.classList.contains('is-all');
      ul.classList.toggle('is-all', all);
      el.setAttribute('aria-expanded', String(all));
      el.textContent = all ? 'Show fewer schools' : 'Show all schools';
      return;
    }
    if (t.closest('[data-sg-signin]')) { closeLayer(true); SG.toast('Sign in would open your Scarlet & Gold account on their Shopify store. This concept doesn’t store accounts.'); return; }
    if (t.closest('[data-sg-saved]')) {
      var n = SG.saved.list().length;
      SG.toast(n ? 'You’ve saved ' + n + ' piece' + (n === 1 ? '' : 's') + '. In the live store, saved items sync to your account.' : 'Tap the heart on any piece to save it for later.');
      return;
    }
    if (t.closest('[data-sg-checkout]')) {
      SG.toast('<b>Concept preview.</b> Checkout would hand off to Scarlet &amp; Gold’s real Shopify checkout here' + (bag.some(bagFs) ? '.' : ', with Checkout+ free returns.'), { html: true, ms: 5200 });
      return;
    }
    if ((el = t.closest('.pc__heart'))) {
      // the handle rides on the heart itself (SG.card); a heart placed outside a card can carry its own data-h
      var host = el.hasAttribute('data-h') ? el : el.closest('[data-h]');
      var h = host && host.getAttribute('data-h');
      if (!h) return;
      var on = SG.saved.toggle(h);
      var hq = window.CSS && CSS.escape ? CSS.escape(h) : h;
      document.querySelectorAll('.pc__heart[data-h="' + hq + '"], [data-h="' + hq + '"] .pc__heart').forEach(function (b) { b.setAttribute('aria-pressed', String(on)); });
      SG.toast(on ? 'Saved for later.' : 'Removed from saved.');
      return;
    }
    if ((el = t.closest('[data-bag]'))) {
      var i = +el.getAttribute('data-i'), act = el.getAttribute('data-bag');
      if (!bag[i]) return;
      if (act === 'inc') bag[i].q += 1;
      if (act === 'dec') bag[i].q = Math.max(1, bag[i].q - 1);
      if (act === 'rm') bag.splice(i, 1);
      saveBag();
      return;
    }
    // in-page links to #sg-list focus the newsletter field
    if ((el = t.closest('a[href="#sg-list"]'))) {
      e.preventDefault();
      var f = document.getElementById('ft-email');
      document.getElementById('sg-list').scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(function () { f.focus({ preventScroll: true }); }, 500);
    }
  });

  document.addEventListener('submit', function (e) {
    if (e.target.matches('[data-sg-news]')) {
      e.preventDefault();
      SG.toast('<b>You’re on the List.</b> (Concept preview: no email was sent. The live store would send your 15% welcome code.)', { html: true, ms: 5200 });
      e.target.reset();
    }
  });

  /*
   * The footer's real line ("Show up proud… Wear it again on Tuesday.") is swapped for their other real line when the
   * page itself already uses it (football hero, Auburn hub women's lede), so it is never repeated on one page.
   */
  function dedupeFooterLine() {
    var line = document.querySelector('[data-sg-ftline]'), main = document.getElementById('main');
    if (!line || !main) return;
    var used = /wear it again on tuesday/i.test(main.textContent);
    if (used && !/feel like yourself/i.test(main.textContent)) line.innerHTML = 'Rep your school. <em>Feel like yourself.</em>';
    else if (used) line.innerHTML = 'Cute, comfy, and made to wear <em>long after the final whistle.</em>';
  }

  /*
   * Arriving on a URL #hash (index.html#schools, auburn.html#programs, visit.html#shipping …), one routine for every page.
   * The browser's own fragment jump happens before the header is measured and before page scripts render the sections
   * above the target (and WebKit may run this file before CSS applies), so it lands short. Smooth scrolling stays off
   * (html.sg-smooth is added only afterwards) so nothing animates toward a stale offset; then, once the page has loaded,
   * the target is re-landed below the sticky header, twice (after load, and once more after late layout such as web
   * fonts). A visitor who scrolls in the meantime wins. Pages can listen for 'sg:hashland' (detail.target) to sync a
   * scroll spy. Don't scroll before 'load' yourself: an early scroll cancels WebKit's own fragment jump.
   */
  SG.landOn = function (target) {
    var y = target.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
    window.scrollTo(0, Math.max(0, Math.round(y)));
    document.dispatchEvent(new CustomEvent('sg:hashland', { detail: { target: target } }));
  };
  (function hashLanding() {
    var root = document.documentElement;
    var id = '';
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { id = location.hash.slice(1); }
    var smoothOn = function () { root.classList.add('sg-smooth'); };
    if (!id || !document.getElementById(id)) { if (document.readyState === 'complete') smoothOn(); else window.addEventListener('load', smoothOn, { once: true }); return; }
    var userMoved = false;
    var stop = function () { userMoved = true; };
    ['wheel', 'touchmove', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, stop, { passive: true, once: true }); });
    var land = function () {
      var t = document.getElementById(id);
      if (t && !userMoved) SG.landOn(t);
    };
    var afterLoad = function () {
      syncHeader();
      window.setTimeout(land, 60);
      window.setTimeout(function () { land(); smoothOn(); }, 450);
    };
    if (document.readyState === 'complete') afterLoad(); else window.addEventListener('load', afterLoad, { once: true });
  })();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dedupeFooterLine); else window.setTimeout(dedupeFooterLine, 0);

  // season pill (defined in sg-chapters.js)
  SG.chapterPill();
})();
