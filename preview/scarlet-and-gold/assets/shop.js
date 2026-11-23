/* ==========================================================================
   Scarlet & Gold — shop / collection listing (assets/shop.js). Runs after sg.js.
   URL contract (components.md): c, school, who, cat, ship, size, color, price, sale, q, sort.
   Filters and sort are URL-synced with history.replaceState; "Show more" depth rides in
   history.state so Back from a product page lands on the same grid.
   Render order matters: SG.pickPhoto hands each photo to the first slot that asks.
   ========================================================================== */
(function () {
  'use strict';
  var SG = window.SG, D = SG.data;
  var COLS = D.cols || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var PER = 24;
  var CATALOGUE = (D.products || []).length;

  /* ---------- vocabulary ---------- */
  var CAT = {
    crewneck: 'Crewnecks', mockneck: 'Mocknecks', 'quarter-zip': 'Quarter-zips', tee: 'Tees', 'long-sleeve': 'Long sleeves', tank: 'Tanks',
    skort: 'Skorts', shorts: 'Shorts', set: 'Sets', dress: 'Dresses', 'cheer-dress': 'Cheer dresses', hat: 'Hats', scarf: 'Scarves', bow: 'Bows',
    book: 'Books', accessory: 'Accessories', other: 'Other'
  };
  var CAT_ORDER = Object.keys(CAT);
  var WHO = { women: 'Women', kids: 'Girls & kids', men: 'Men' };
  /* ship filter = SG.shipKind(p): only in-stock and made-to-order make a timeline claim (vendor/check pieces match neither) */
  var SHIP = { 'in': ['In stock', 'Ships in 5–7 business days', 'In stock · 5–7 days'], mto: ['Made for you', 'In Auburn · 10–14 business days', 'Made for you · 10–14 days'] };
  var PRICES = [['0-40', 'Under $40'], ['40-50', '$40 – $50'], ['50-75', '$50 – $75'], ['75-', '$75 & up']];
  var SORTS = ['featured', 'new', 'price-asc', 'price-desc'];
  var SIZE_ORDER = ['NB', '0-3M', '3-6M', '6M', '6-12M', '9M', '12M', '18M', '24M', '2T', '3T', '4T', '5T', '2', '3', '4', '5', '6', '6X', '7', '8', '9', '10', '12', '14', '16',
    'YXS', 'YS', 'YM', 'YL', 'YXL', 'XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL', '5XL', 'OS', 'ONE SIZE'];
  var SCHOLARSHIP = 'Officially licensed: a portion of every purchase goes back to your school to support student scholarships.';
  var JORDAN_HARE = 'Designed in-house in Auburn, a few miles from Jordan-Hare, by women who wear it to the game too.';
  var SIGNATURES = ['mallory-gingham-mocknecks', 'the-becca-collection', 'the-alli-collection', 'the-ava-collection', 'grace-gingham-dresses',
    'the-kristen-collection', 'the-madi-collection', 'katy-camo-sets', 'sophia-scarves', 'limited-release-script-embroidered-sweatshirts'];

  /* ---------- URL → state ---------- */
  function splitList(v) { return v ? String(v).split(',').map(function (x) { return x.trim(); }).filter(Boolean) : []; }
  function readUrl() {
    var u = new URLSearchParams(location.search);
    var price = u.get('price') || '';
    var s = {
      c: u.get('c') || '', school: u.get('school') || '', q: (u.get('q') || '').trim(),
      who: u.get('who') || '', cat: splitList(u.get('cat')), ship: u.get('ship') || '',
      size: splitList(u.get('size')), color: splitList(u.get('color')),
      price: /^\d+(\.\d+)?-(\d+(\.\d+)?)?$/.test(price) ? price : '', sale: u.get('sale') === '1',
      sort: u.get('sort') || 'featured'
    };
    if (!WHO[s.who]) s.who = '';
    if (!SHIP[s.ship]) s.ship = '';
    if (SORTS.indexOf(s.sort) < 0) s.sort = 'featured';
    if (s.school && !SG.school(s.school)) s.school = '';
    return s;
  }
  function filtersOf(s) {
    return { who: s.who, cat: s.cat.slice(), ship: s.ship, size: s.size.slice(), color: s.color.slice(), price: s.price, sale: !!s.sale };
  }
  function emptyFilters() { return { who: '', cat: [], ship: '', size: [], color: [], price: '', sale: false }; }
  function activeCount(f) {
    return (f.who ? 1 : 0) + f.cat.length + (f.ship ? 1 : 0) + f.size.length + f.color.length + (f.price ? 1 : 0) + (f.sale ? 1 : 0);
  }

  var URL0 = readUrl();
  var V = { c: URL0.c, school: URL0.school, q: URL0.q, sort: URL0.sort };   // the view (what is listed)
  var F = filtersOf(URL0);                                                   // live filters
  var unknownC = V.c && !COLS[V.c] ? V.c : '';
  var C = unknownC ? '' : (V.c || (!V.school && !V.q ? 'auburn' : ''));    // effective collection
  var SCH = V.school ? SG.school(V.school) : null;
  var searchOnly = !!V.q && !V.c && !V.school;
  var auburnLabel = V.school === 'auburn' || (!V.school && (!!C && /auburn|aubie/.test(C)));
  var otherSchool = !!V.school && V.school !== 'auburn';
  /* partial data (brief/data-schema.md): what this view lists vs. their real totals. Never present their total, or
     "every piece", as what is listed; point to their live store for the rest. */
  var PART = D.partial ? Object.keys(D.partial.loaded || {}).filter(function (h) { return SG.isPartial(h); }) : [];
  var partialView = !unknownC && !!PART.length && (C ? SG.isPartial(C) : true);
  function countLabel(h) {   // collection link sub-label: their total, or "first N of M" when only part is loaded
    var n = COLS[h] && COLS[h].n;
    if (!n) return '';
    if (SG.isPartial(h)) return fmt(SG.loaded(h)) + ' of ' + fmt(n) + ' styles here';
    return D.partial && !SG.loaded(h) ? fmt(n) + ' on their store' : fmt(n) + ' styles';
  }
  var shown = PER;
  try { var hs = history.state; if (hs && hs.shown > PER) shown = hs.shown; } catch (e) { /* no state */ }

  /* a view that is exactly a rule-built link (SG.fromAuburn: Shop women, In stock, Auburn gifts…) is headed by that rule */
  var RULE_HEAD = {
    'auburn-womens-specialty': ['Auburn women’s,', 'on the Plains.'], 'auburn-adult-apparel': ['Auburn tees,', 'crewnecks & quarter-zips.'],
    'auburn-kids-specialty': ['Auburn girls & kids,', 'on the Plains.'], 'auburn-kids-apparel': ['Auburn kids’', 'tees & crewnecks.'],
    'auburn-mens-collection': ['Auburn men’s,', 'on the Plains.'], 'auburn-hat-collection-1': ['Auburn', 'hats.'],
    'auburn-accessories-gifts': ['Auburn', 'accessories & gifts.'], 'auburn-university-in-stock-items': ['Auburn,', 'in stock now.'],
    'auburn-gifts-in-stock': ['Auburn gifts,', 'in stock now.'], 'girls-cheer-dresses': ['Auburn', 'cheer dresses.'],
    'auburn-basketball': ['Auburn', 'basketball.'], 'original-aubie-basketball': ['The Original', 'Aubie.'], 'closeout-sale': ['Auburn,', 'on sale.'],
    // signature lines (their titles name the line): "The Alli, on the Plains."
    'the-alli-collection': ['The Alli,', 'on the Plains.'], 'the-ava-collection': ['The Ava,', 'on the Plains.'],
    'the-becca-collection': ['The Becca,', 'on the Plains.'], 'the-kristen-collection': ['The Kristen,', 'on the Plains.'],
    'mallory-gingham-mocknecks': ['The Mallory,', 'on the Plains.'], 'grace-gingham-dresses': ['The Grace,', 'on the Plains.'],
    'the-madi-collection': ['The Madi,', 'on the Plains.']
  };
  function normQs(qs) {
    var u = new URLSearchParams(qs), o = [];
    ['c', 'school', 'who', 'cat', 'ship', 'sale', 'q'].forEach(function (k) {
      var v = u.get(k);
      if (v) o.push(k + '=' + (k === 'cat' ? v.split(',').sort().join(',') : v.toLowerCase()));
    });
    return o.join('&');
  }
  var RULE = (function () {
    if (!D.partial || V.c !== 'auburn' || V.school !== 'auburn') return '';
    var cur = normQs(location.search);
    var keys = Object.keys(RULE_HEAD);
    for (var i = 0; i < keys.length; i++) {
      var d = SG.fromAuburn(keys[i]);
      if (d && normQs(d.url.split('?')[1] || '') === cur) return keys[i];
    }
    return '';
  })();
  /* a rule view lists exactly the rule's pieces: its who / cat / ship / sale are the BASE of what is listed (so no
     filter pills, no ticked boxes, a filter count of 0, and the results count is out of the rule's own pieces), never
     shopper filters. RULE_F is that base as a filter object; F only ever holds what the shopper adds on top. */
  var RULE_F = null;
  if (RULE) {
    var ru = new URLSearchParams(SG.fromAuburn(RULE).url.split('?')[1] || '');
    RULE_F = emptyFilters();
    RULE_F.who = WHO[ru.get('who')] ? ru.get('who') : ''; RULE_F.cat = splitList(ru.get('cat'));
    RULE_F.ship = SHIP[ru.get('ship')] ? ru.get('ship') : ''; RULE_F.sale = ru.get('sale') === '1';
  }
  /* the shopper's own filters from URL state s (a rule view's base values are not the shopper's) */
  function ownFilters(s) {
    var f = filtersOf(s);
    if (!RULE_F) return f;
    if (f.who === RULE_F.who) f.who = '';
    if (f.cat.slice().sort().join() === RULE_F.cat.slice().sort().join()) f.cat = [];
    if (f.ship === RULE_F.ship) f.ship = '';
    if (f.sale === RULE_F.sale) f.sale = false;
    return f;
  }
  F = ownFilters(URL0);

  /* ---------- titles ---------- */
  var TITLE_FIX = {
    'auburn-university-in-stock-items': 'Auburn In Stock Now', 'auburn-accessories-gifts': 'Auburn Accessories & Gifts',
    'auburn-in-stock-sale-eligible': 'Auburn In Stock: Sale Eligible', 'auburn-kids-specialty': 'Auburn Kids’ Specialty',
    'auburn-adult-tees-fleece-2026': 'Auburn Adult Tees & Fleece 2026', 'girls-cheer-dresses': 'Cheer Dresses', 'book': 'Books',
    'auburn-hat-collection-1': 'Auburn Hats', 'auburn-best-sellers': 'Auburn Best Sellers', 'auburn-mens-collection': 'Auburn Men’s Collection',
    'auburn-mens-specialty': 'Auburn Men’s Specialty', 'auburn-womens-specialty': 'Auburn Women’s Specialty'
  };
  var SMALL = { and: 1, of: 1, the: 0, '&': 1, 'in': 1, a: 1 };
  function pretty(h) {
    if (TITLE_FIX[h]) return TITLE_FIX[h];
    var t = (COLS[h] && COLS[h].t) || h.replace(/-/g, ' ');
    t = t.replace(/\s+-\s+/g, ' ').replace(/'/g, '’').replace(/\s+/g, ' ').trim();
    return t.split(' ').map(function (w, i) {
      if (i > 0 && SMALL[w.toLowerCase()]) return w.toLowerCase();
      return /^[a-z]/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w;
    }).join(' ');
  }
  /* split a title into a roman first line and an italic second line (the site's headline rhythm) */
  function splitTitle(t, lead) {
    if (lead) {
      var rest = t.replace(new RegExp('^' + lead.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*', 'i'), '').replace(/^NCAA\s+/i, '');
      return [lead, rest || ''];
    }
    var colon = t.indexOf(':');
    if (colon > 0) return [t.slice(0, colon + 1), t.slice(colon + 1).trim()];
    if (/^Auburn\s/.test(t)) return ['Auburn', t.slice(7)];
    if (/\sCollection$/.test(t)) return [t.replace(/\sCollection$/, ''), 'Collection'];
    var w = t.split(' ');
    return w.length > 1 ? [w.slice(0, -1).join(' '), w[w.length - 1]] : [t, ''];
  }

  /* ---------- the listed source ---------- */
  function sourceList() {
    var f = { sch: V.school || null, q: V.q || null };
    if (C) f.cols = [C];
    var list = unknownC ? [] : SG.products(f);
    if (RULE_F) list = list.filter(function (p) { return pass(p, RULE_F); });   // a rule view: exactly the rule's pieces
    return V.school ? list : SG.auburnFirst(list);
  }
  var SRC = sourceList();
  var SIZES = Object.create(null);
  function availSizes(p) {
    if (!SIZES[p.h]) SIZES[p.h] = SG.sizesFor(p).filter(function (x) { return x.avail; }).map(function (x) { return x.s; });
    return SIZES[p.h];
  }
  function lower(a) { return a.map(function (x) { return String(x).toLowerCase(); }); }
  /* colours the filter offers and matches: only colours with an available variant (as the size filter), by the name
     shoppers read (SG.colorName: "Bella + Canvas Navy" is Navy) */
  var COLS_AV = Object.create(null);
  function availColors(p) {
    if (COLS_AV[p.h]) return COLS_AV[p.h];
    var V = p.v || [], out = [];
    (p.co || []).forEach(function (c) {
      var ok = !V.length ? !!p.av : V.some(function (v) { return v[1] === c && v[2]; });
      var n = SG.colorName(c);
      if (ok && out.indexOf(n) < 0) out.push(n);
    });
    return (COLS_AV[p.h] = out);
  }
  function range(v) {
    var m = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)?$/.exec(v || '');
    return m ? [+m[1], m[2] ? +m[2] : Infinity] : null;
  }
  function onSale(p) { return !!(p.cp && p.cp > p.p); }
  /* does p pass filters f, ignoring group `skip` (for facet counts)? */
  function pass(p, f, skip) {
    if (skip !== 'who' && f.who && p.who !== f.who) return false;
    if (skip !== 'cat' && f.cat.length && f.cat.indexOf(p.cat) < 0) return false;
    if (skip !== 'ship' && f.ship && (SG.shipKind(p) !== f.ship || SG.isSoldOut(p))) return false;   // "In stock" never lists a sold-out piece
    if (skip !== 'size' && f.size.length) {
      var as = availSizes(p);
      if (!f.size.some(function (s) { return as.indexOf(s) > -1; })) return false;
    }
    if (skip !== 'color' && f.color.length) {
      var want = lower(f.color), co = lower(availColors(p));
      if (!want.some(function (c) { return co.indexOf(c) > -1; })) return false;
    }
    if (skip !== 'price' && f.price) {
      var r = range(f.price);
      if (r && !(p.p >= r[0] && p.p < r[1])) return false;
    }
    if (skip !== 'sale' && f.sale && !onSale(p)) return false;
    return true;
  }
  function sortList(list, by) {
    var idx = list.map(function (p, i) { return [p, i]; });
    // newest = most recently CREATED (they re-publish older styles for a new season, so pub is not age)
    if (by === 'new') idx.sort(function (a, b) { return (b[0]['new'] || 0) - (a[0]['new'] || 0) || String(b[0].cr || b[0].pub || '').localeCompare(String(a[0].cr || a[0].pub || '')) || a[1] - b[1]; });
    if (by === 'price-asc') idx.sort(function (a, b) { return a[0].p - b[0].p || a[1] - b[1]; });
    if (by === 'price-desc') idx.sort(function (a, b) { return b[0].p - a[0].p || a[1] - b[1]; });
    var out = idx.map(function (x) { return x[0]; });
    // fully sold-out styles go last, whatever the sort
    return out.filter(function (p) { return p.av !== 0; }).concat(out.filter(function (p) { return p.av === 0; }));
  }
  function sizeRank(s) {
    var u = String(s).toUpperCase(), i = SIZE_ORDER.indexOf(u);
    var m = i < 0 ? /^(\d+)\/\d+$/.exec(u) : null;   // '6/7', '10/12' sit just after 6, 10
    if (m && SIZE_ORDER.indexOf(m[1]) > -1) return SIZE_ORDER.indexOf(m[1]) + 0.5;
    return i < 0 ? 999 : i;
  }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  function priceLabel(v) {
    for (var i = 0; i < PRICES.length; i++) if (PRICES[i][0] === v) return PRICES[i][1];
    var r = range(v);
    if (!r) return v;
    if (!r[0]) return 'Under ' + SG.money(r[1]);
    return r[1] === Infinity ? SG.money(r[0]) + ' & up' : SG.money(r[0]) + ' – ' + SG.money(r[1]);
  }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }

  /* ======================================================================
     Header
     ====================================================================== */
  var EDITORIAL_AU = [{ k: 'group-auburn-tees-outdoor', pos: '50% 40%' }, { k: 'auburn-blue-cropped-crewneck-model', pos: '50% 12%' },
    { k: 'auburn-tee-grid-flatlay', pos: '50% 50%' }, { k: 'auburn-embroidered-crewneck-model', pos: '50% 10%' }];
  var MADE = {
    'auburn-hat-collection-1': { tone: 'navy', patch: 'Auburn hats', note: 'Local pickup available at our Auburn shop' },
    'auburn-accessories-gifts': { tone: 'scarlet', big: '&', note: 'Little extras for every Auburn fan' },
    'auburn-baseball': { tone: 'navy', patch: 'Auburn baseball', note: 'Ballpark days, sunny Saturdays' },
    'auburn-gymnastics': { tone: 'scarlet', patch: 'Auburn gymnastics', note: 'Meet day, front row' },
    'auburn-mens-collection': { tone: 'navy', patch: 'Auburn men', note: 'For the men in your crew' },
    'auburn-mens-specialty': { tone: 'navy', patch: 'Auburn men', note: 'For the men in your crew' },
    'closeout-sale': { tone: 'scarlet', patch: 'Sale', note: 'Closeout styles, while they last' },
    'katy-camo-sets': { tone: 'cream', patch: 'The S&G Signatures', note: 'Katy camo sets' },
    'the-madi-collection': { tone: 'cream', patch: 'The S&G Signatures', note: 'The Madi' }
  };
  var HEAD = {
    'auburn': ['col:auburn'].concat(EDITORIAL_AU),
    'auburn-womens-specialty': [{ k: 'four-models-sets', pos: '50% 30%' }, { k: 'auburn-blue-cropped-crewneck-model', pos: '50% 12%' }, { k: 'auburn-embroidered-crewneck-model', pos: '50% 10%' }],
    'auburn-hat-collection-1': ['col:auburn-hat-collection-1', { k: 'p:the-vintage-war-eagle-hat-navy-natural#1', pos: '50% 30%' }, 'rule:auburn-hat-collection-1'],
    'auburn-accessories-gifts': ['col:auburn-accessories-gifts', { k: 'p:the-auburn-university-needlepoint-pillow', pos: '50% 50%' }, 'rule:auburn-accessories-gifts'],
    'auburn-gifts-in-stock': [{ k: 'p:the-auburn-university-needlepoint-pillow', pos: '50% 50%' }, 'rule:auburn-gifts-in-stock'],
    'auburn-adult-apparel': [{ k: 'group-auburn-tees-outdoor', pos: '50% 40%' }, 'auburn-tee-grid-flatlay-2'],
    'auburn-adult-tees-fleece-2026': ['auburn-tee-grid-flatlay-2', { k: 'group-auburn-tees-outdoor', pos: '50% 40%' }],
    'auburn-kids-apparel': ['col:auburn-kids-apparel', { k: 'auburn-cheer-dress-flat', pos: '50% 45%' }],
    'auburn-kids-specialty': [{ k: 'auburn-cheer-dress-flat', pos: '50% 45%' }],
    'auburn-girls-collection': [{ k: 'auburn-cheer-dress-flat', pos: '50% 45%' }],
    'auburn-university-in-stock-items': [{ k: 'auburn-embroidered-crewneck-model', pos: '50% 10%' }, { k: 'auburn-blue-cropped-crewneck-model', pos: '50% 12%' }],
    'auburn-in-stock-sale-eligible': [{ k: 'auburn-embroidered-crewneck-model', pos: '50% 10%' }, { k: 'auburn-blue-cropped-crewneck-model', pos: '50% 12%' }],
    'auburn-basketball': [{ k: 'original-aubie-collab', fit: 'contain', bg: '#F1E9DC' }],
    'original-aubie-basketball': [{ k: 'col:original-aubie-basketball', fit: 'contain', bg: '#F1E9DC' }],
    'auburn-baseball': ['col:auburn-baseball'],
    'auburn-gymnastics': ['col:auburn-gymnastics'],
    'auburn-alumni': [{ k: 'group-auburn-tees-outdoor', pos: '50% 40%' }],
    'auburn-mens-collection': ['col:auburn-mens-collection'],
    'auburn-mens-specialty': ['col:auburn-mens-specialty'],
    'auburn-best-sellers': [{ k: 'col:auburn-best-sellers', pos: '50% 40%' }],
    'limited-release-script-embroidered-sweatshirts': [{ k: 'auburn-embroidered-crewneck-model', pos: '50% 10%' }],
    's-g-christmas': [{ k: 'col:s-g-christmas', pos: '50% 14%' }],
    'girls-cheer-dresses': [{ k: 'col:girls-cheer-dresses', pos: '50% 24%' }, { k: 'auburn-cheer-dress-flat', pos: '50% 45%' }],
    'mallory-gingham-mocknecks': [{ k: 'col:mallory-gingham-mocknecks', pos: '50% 16%' }],
    'grace-gingham-dresses': [{ k: 'col:grace-gingham-dresses', pos: '50% 16%' }],
    'the-alli-collection': [{ k: 'col:the-alli-collection', pos: '50% 30%' }],
    'the-ava-collection': [{ k: 'col:the-ava-collection', pos: '50% 20%' }],
    'the-becca-collection': [{ k: 'col:the-becca-collection', pos: '50% 20%' }],
    'the-kristen-collection': [{ k: 'col:the-kristen-collection', pos: '50% 12%' }],
    'sophia-scarves': [{ k: 'col:sophia-scarves', pos: '50% 30%' }],
    'give-grace': ['col:book'],
    'closeout-sale': [],
    'book': ['col:book']
  };
  /* photo cautions (INDEX.md) live in sg.js (SG.photo never returns Megan's family photo or the logo graphic;
     SG.isOtherSchoolPhoto flags rival-school marks and the Alabama-print scarf). Auburn views never show those; another
     school's view shows neither Auburn photos nor a third school's (the Alabama scarf only on Alabama). */
  function isAuburnPhoto(key) { return /^(auburn-|war-eagle|aubie|original-aubie|mom-mini-auburn|group-auburn|white-crewneck)/.test(key); }
  function photoOk(ph) {
    if (!ph) return false;
    if (auburnLabel || (!V.school && !C)) return !SG.isOtherSchoolPhoto(ph.key);
    if (otherSchool) return !isAuburnPhoto(ph.key) && (!SG.isOtherSchoolPhoto(ph.key) || (ph.key === 'sophia-scarf' && V.school === 'alabama'));
    return true;
  }
  function headCandidates() {
    var list = (C && HEAD[C]) || (C && COLS[C] && COLS[C].img ? ['col:' + C] : []);
    if (V.school === 'auburn' && !V.c) list = EDITORIAL_AU;
    if (RULE) list = (HEAD[RULE] || []).concat(['rule:' + RULE], EDITORIAL_AU);   // a rule view: its own photo (women → the sets photo…)
    var ok = list.filter(function (cand) { return photoOk(SG.photo(cand, 1200)); });
    if (!ok.length && auburnLabel && !(C && MADE[C])) ok = EDITORIAL_AU;
    return ok;
  }

  function crumbs() {
    var out = [['Home', 'index.html']];
    if (searchOnly) out.push(['Search', null]);
    else if (V.school && !V.c) { out.push(['Shop your school', 'index.html#schools']); out.push([SCH.name, null]); }
    else if (V.school === 'auburn' && C === 'auburn') out.push(['Shop Auburn', null]);   // the Auburn collection, Auburn pieces only
    else {
      if (V.school) out.push([SCH.name, SG.shopUrl({ school: V.school })]);
      else if (C && /auburn|aubie/.test(C) && C !== 'auburn') out.push(['Auburn', 'auburn.html']);
      else if (SIGNATURES.indexOf(C) > -1) out.push(['Signature styles', 'index.html#signatures']);
      out.push([unknownC ? 'Shop' : (C === 'auburn' && !V.school ? 'Shop Auburn' : pretty(C)), null]);
    }
    return '<ol>' + out.map(function (c) {
      return '<li>' + (c[1] ? '<a href="' + SG.esc(c[1]) + '">' + SG.esc(c[0]) + '</a>' : '<span aria-current="page">' + SG.esc(c[0]) + '</span>') + '</li>';
    }).join('') + '</ol>';
  }

  function headCopy() {
    var o = { eyebrow: 'Shop', dot: false, l1: '', l2: '', lede: '', title: '' };
    if (searchOnly) {
      o.eyebrow = 'Search the shop'; o.l1 = 'Results for'; o.l2 = '“' + V.q + '”'; o.title = 'Search: ' + V.q;
      return o;
    }
    if (unknownC) { o.l1 = 'We couldn’t find'; o.l2 = 'that collection.'; o.title = 'Collection not found'; o.lede = JORDAN_HARE; return o; }
    if (V.school && !V.c) {
      o.eyebrow = 'Shop your school';
      if (V.school === 'auburn') { o.dot = true; o.l1 = 'Shop Auburn,'; o.l2 = partialView ? 'on the Plains.' : 'every piece.'; o.lede = JORDAN_HARE; o.title = 'Shop Auburn'; }
      else { o.l1 = SCH.name + ','; o.l2 = 'officially licensed.'; o.lede = SCHOLARSHIP; o.title = 'Shop ' + SCH.name; }
      return o;
    }
    var t = pretty(C);
    // "our home team" belongs to the Auburn hub; the shop's Auburn page is one step deeper
    var parts = RULE ? RULE_HEAD[RULE] : C === 'auburn' && (!V.school || V.school === 'auburn') ? ['Shop Auburn,', partialView ? 'on the Plains.' : 'every piece.'] : splitTitle(t, V.school ? SCH.name : null);
    o.l1 = parts[0]; o.l2 = parts[1];
    o.title = RULE ? (parts[0] + ' ' + parts[1]).replace(/[,.]/g, '') : V.school && t.indexOf(SCH.name) !== 0 ? SCH.name + ' ' + parts[1] : (C === 'auburn' ? 'Shop Auburn' : t);
    if (auburnLabel) { o.eyebrow = 'Our home team'; o.dot = true; }
    if (C === 's-g-christmas') o.eyebrow = 'The Christmas collection';
    else if (SIGNATURES.indexOf(C) > -1) o.eyebrow = 'Our own designs';
    else if (C === 'girls-cheer-dresses' || C === 'cheer-accessories') o.eyebrow = V.school ? o.eyebrow : 'Cheer';
    else if (C === 'closeout-sale') o.eyebrow = 'Sale';
    else if (C === 'give-grace' || C === 'book') o.eyebrow = 'From our founder';
    else if (otherSchool) o.eyebrow = 'Shop your school';
    var L = {
      'auburn': JORDAN_HARE,
      'auburn-womens-specialty': 'Team pride and style, together. Women shouldn’t have to choose between repping their team and feeling like themselves.',
      'auburn-adult-apparel': 'Made to order: printed or embroidered in our Auburn shop, and shipped in 10–14 business days.',
      'auburn-adult-tees-fleece-2026': 'Made to order: printed or embroidered in our Auburn shop, and shipped in 10–14 business days.',
      'auburn-kids-apparel': 'Made to order: printed or embroidered in our Auburn shop, and shipped in 10–14 business days.',
      'auburn-kids-specialty': 'Girls’ sizes from 12M, and cheer dresses in sizes 12M–10 that go with the mom tops.',
      'auburn-girls-collection': 'Girls’ sizes from 12M, and cheer dresses in sizes 12M–10 that go with the mom tops.',
      'girls-cheer-dresses': 'Cheer dresses in sizes 12M–10, in a soft, stretchy, non-itchy fabric she can jump and cheer in all game long.',
      'auburn-university-in-stock-items': 'In stock items ship in 5–7 business days, and orders of $100+ ship free.',
      'auburn-in-stock-sale-eligible': 'In stock items ship in 5–7 business days, and orders of $100+ ship free.',
      'auburn-hat-collection-1': 'Order online and pick up at our Auburn shop: local pickup is available for apparel and hats.',
      'auburn-accessories-gifts': 'Gifts for every Auburn fan on your list.',
      's-g-christmas': 'The Game Day Nutcracker: a holiday classic in your school colors. Holiday purchases are returnable through January 30.',
      'original-aubie-basketball': 'The Original Aubie Collection, in collaboration with Scarlet & Gold.',
      'auburn-basketball': 'The Original Aubie Collection, in collaboration with Scarlet & Gold.',
      'the-ava-collection': 'Our signature soft fabric, now in the Ava Airy Crewneck, Kristen Airy Tee, Alli Airy Tank and Campbell Cap Sleeve Dress.',
      'the-kristen-collection': 'Our signature soft fabric, now in the Ava Airy Crewneck, Kristen Airy Tee, Alli Airy Tank and Campbell Cap Sleeve Dress.',
      'the-alli-collection': 'Our signature soft fabric, now in the Ava Airy Crewneck, Kristen Airy Tee, Alli Airy Tank and Campbell Cap Sleeve Dress.',
      'give-grace': 'From our founder Megan Smalley, author of Give Grace and creator of the Overcome Journal.',
      'book': 'From our founder Megan Smalley, author of Give Grace and creator of the Overcome Journal.',
      'apparel-best-sellers': 'Our favorite styles sell out fast. Get on the List for early access to new drops and restock alerts.',
      'auburn-best-sellers': 'Our favorite styles sell out fast. Get on the List for early access to new drops and restock alerts.'
    };
    o.lede = L[C] || (SIGNATURES.indexOf(C) > -1 ? 'Cute, comfy, and made to wear long after the final whistle.' : (otherSchool ? SCHOLARSHIP : (auburnLabel ? JORDAN_HARE : SCHOLARSHIP)));
    // partial data: an unloaded made-to-order collection's page links to derived pieces with mixed ship times, so its
    // ship-time lede (true of the collection, not of those pieces) gives way to the plain one
    if (C && D.partial && !SG.loaded(C) && /^Made to order/.test(o.lede) && SG.fromAuburn(C)) o.lede = JORDAN_HARE;
    if (V.school === 'auburn' && C === 'girls-cheer-dresses') o.lede = L[C];
    return o;
  }

  function legendHTML() {
    var has = { 'in': 0, mto: 0 };
    if (SRC.length) SRC.forEach(function (p) { var k = SG.shipKind(p); if (has[k] != null) has[k]++; });
    else if (/in-stock/.test(C)) has['in'] = 1;
    else if (C === 'book' || C === 'give-grace' || unknownC) return '';
    else { has['in'] = 1; has.mto = 1; }
    return '<ul class="sh-legend" aria-label="How shipping works">' +
      (has['in'] ? '<li><i class="sh-dot sh-dot--in" aria-hidden="true"></i>In stock · ships in 5–7 business days</li>' : '') +
      (has.mto ? '<li><i class="sh-dot sh-dot--mto" aria-hidden="true"></i>Made for you in Auburn · 10–14 business days</li>' : '') + '</ul>';
  }

  var EXT = function (label) { return label + SG.icons.ext + '<span class="sr"> (opens their store in a new tab)</span>'; };
  /* "first N of M" note for a view built from partially loaded collections, with a link to the rest on their store */
  function partialNote() {
    if (!partialView || !SRC.length) return '';
    var h = C && SG.isPartial(C) ? C : (PART.length === 1 ? PART[0] : '');
    var live = searchOnly ? 'https://scarletandgoldshop.com/search?q=' + encodeURIComponent(V.q) : SG.liveUrl(h || 'all');
    var what = h ? 'the first <strong>' + fmt(SG.loaded(h)) + '</strong> of their <strong>' + fmt(SG.total(h)) + '</strong> ' + SG.esc(h === 'auburn' ? 'Auburn' : pretty(h)) + ' styles'
      : '<strong>' + fmt(CATALOGUE) + '</strong> of their styles';
    var lead = C && C === h && !V.school && !V.q ? 'Showing ' + what + ' in this preview.' : 'This preview has ' + what + ' loaded' + (searchOnly ? ', so this search covers those.' : '.');
    return '<p class="sh-partial">' + lead + ' <a class="sh-partial__a" href="' + SG.esc(live) + '" target="_blank" rel="noopener">' +
      EXT(searchOnly ? 'Search their full catalogue' : 'See every style on their store') + '</a></p>';
  }
  function renderMeta() {
    var n = C && COLS[C] && !V.school && !V.q ? COLS[C].n : 0;
    var count = SRC.length ? ''   /* the results bar carries the live count */
      : (n ? '<p class="sh-head__count"><strong>' + fmt(n) + '</strong> styles in the live collection</p>' : '');
    $('[data-sh="meta"]').innerHTML = searchOnly && !SRC.length ? '' : count + partialNote() + legendHTML();
  }

  function renderHead() {
    var o = headCopy();
    var head = $('[data-sh="head"]');
    $('[data-sh="crumbs"]').innerHTML = crumbs();
    var eb = $('[data-sh="eyebrow"]');
    eb.innerHTML = o.dot ? '<span><span class="eyebrow__dot" aria-hidden="true"></span>' + SG.esc(o.eyebrow) + '</span>' : SG.esc(o.eyebrow);
    $('[data-sh="title"]').innerHTML = SG.esc(o.l1) + (o.l2 ? ' <span class="l2">' + SG.esc(o.l2) + '</span>' : '');
    document.title = o.title + ' · Scarlet & Gold';
    var lede = $('[data-sh="lede"]');
    lede.textContent = o.lede;
    lede.hidden = !o.lede;

    var qf = $('[data-sh="qform"]');
    if (searchOnly) {
      head.classList.add('sh-head--search');
      qf.hidden = false;
      $('#sh-q').value = V.q;
    }
    renderMeta();
    if (SRC.length) head.classList.add('has-products');

    // media: a real collection photo when it's appropriate, else editorial, else a designed tile. Phones listing products skip
    // it, so the first row of cards is in the first screen (and the decorative photo is never downloaded there)
    if (searchOnly) return;
    var phoneList = SRC.length && window.matchMedia('(max-width: 719px)').matches;
    var media = $('[data-sh="media"]');
    var tile = V.school ? '<span class="sh-head__tile"><img src="' + SG.esc(SG.img(SCH.img, 400)) + '" alt="' + SG.esc(SCH.name) + '" width="400" height="400" decoding="async"></span>' : '';
    if (phoneList) {   // phones listing products: only the school's own tile (small), never the decorative photo
      if (!tile) return;
      media.innerHTML = tile;
      media.hidden = false;
      head.classList.add('has-media');
      return;
    }
    var ph = unknownC ? null : SG.pickPhoto(headCandidates(), 1200, true, { ratio: 1.3 });
    if (ph) {
      var torso = ph.isTorso;   // torso crops (SG.pickPhoto): a wide 1.3 frame, anchored at the bottom
      var r = torso ? 1.3 : Math.min(1.5, Math.max(0.8, ph.w / ph.h));
      // phones crop the header to 3:2: people photos anchor at the top there so no one loses the top of their head
      var people = !torso && ph.fit !== 'contain' && ph.h >= ph.w && !/flat|grid|collab|scarf|^col:book$/.test(ph.key);
      var style = '--ar:' + r.toFixed(3) + ';--pos:' + (ph.pos || '50% 30%') + (people ? ';--pos-sm:50% 0%' : '') + (ph.bg ? ';--bg:' + ph.bg : '');
      media.innerHTML = '<figure class="sh-head__fig mat' + (ph.fit === 'contain' ? ' is-contain' : '') + '" style="' + style + '">' +
        SG.imgTag(ph, { eager: true }) + '</figure>' + tile;
    } else if (V.school && otherSchool) {
      media.innerHTML = '<div class="sh-head__made sh-head__made--school"><img src="' + SG.esc(SG.img(SCH.img, 400)) + '" alt="' + SG.esc(SCH.name) + '" width="400" height="400" decoding="async">' +
        '<span class="patch patch--navy">Officially licensed</span></div>';
    } else {
      var m = MADE[C] || { tone: 'navy', patch: auburnLabel ? 'Auburn, AL · Est. 2013' : 'Scarlet & Gold', note: auburnLabel ? 'Designed in Auburn, AL' : 'Officially licensed game day apparel' };
      media.innerHTML = '<div class="sh-head__made sh-head__made--' + m.tone + '">' +
        (m.big ? '<span class="sh-head__big" aria-hidden="true">' + SG.esc(m.big) + '</span>' : '') +
        (m.patch ? '<span class="patch' + (m.tone === 'cream' ? ' patch--navy' : '') + '">' + (auburnLabel ? '<span class="patch__dot" aria-hidden="true"></span>' : '') + SG.esc(m.patch) + '</span>' : '') +
        (m.note ? '<span class="sh-head__note">' + SG.esc(m.note) + '</span>' : '') + '</div>' + tile;
    }
    media.hidden = false;
    head.classList.add('has-media');
  }

  /* ======================================================================
     Collection switcher + schools
     ====================================================================== */
  function renderSwitch() {
    var chips = [['All Auburn', 'auburn']].concat(SG.nav.auburn);
    var curC = RULE ? (RULE === 'auburn-womens-specialty' ? '' : RULE)   // (the women rule is every Auburn women's piece, not that collection)
      : ((!V.school || V.school === 'auburn') && !searchOnly ? (V.c || (V.school === 'auburn' ? 'auburn' : C)) : '');
    var el = $('[data-sh="chips"]');
    el.innerHTML = chips.map(function (ch) {
      var on = ch[1] === curC;
      return '<li><a class="chip' + (on ? ' is-on' : '') + '" href="' + SG.esc(SG.shopUrl({ c: ch[1] })) + '"' + (on ? ' aria-current="page"' : '') + '>' + SG.esc(ch[0]) + '</a></li>';
    }).join('') +
      '<li><button type="button" class="chip sh-chip-schools' + (otherSchool ? ' is-on' : '') + '" aria-expanded="' + otherSchool + '" aria-controls="sh-schools">' +
      'Other schools' + SG.icons.chev + '</button></li>';
    var panel = $('[data-sh="schools"]');
    var btn = $('.sh-chip-schools', el);
    function fill() {
      if (panel.getAttribute('data-filled')) return;
      panel.innerHTML = '<p class="sh-schools__h">Shop your school <span>Auburn is our home team. Every school we make, officially licensed.</span></p>' + SG.schoolsHTML({ tag: true });
      if (V.school) {
        var cur = $('a[href="' + SG.shopUrl({ school: V.school }) + '"]', panel);
        if (cur) { cur.setAttribute('aria-current', 'page'); cur.classList.add('sh-school--cur'); }
      }
      panel.setAttribute('data-filled', '1');
    }
    if (otherSchool) { fill(); panel.hidden = false; }
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      if (open) fill();
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.classList.toggle('is-on', open || otherSchool);
    });
    // keep the current chip in view on the phone scroller
    var on = $('.chip.is-on', el);
    if (on && el.scrollWidth > el.clientWidth) el.scrollLeft = Math.max(0, on.offsetLeft - 16);
  }

  /* ======================================================================
     Filters (rail = live, sheet = staged draft)
     ====================================================================== */
  var UI = { live: { closed: {}, all: {} }, draft: { closed: {}, all: {} } };

  function tally(list, fn) {
    var t = Object.create(null);
    list.forEach(function (p) { [].concat(fn(p)).forEach(function (k) { if (k == null || k === '') return; t[k] = (t[k] || 0) + 1; }); });
    return t;
  }
  function distinct(fn) { return Object.keys(tally(SRC, fn)); }

  function opt(type, name, value, label, n, checked, swatch) {
    return '<li><label class="sh-opt' + (checked ? ' is-on' : '') + '"><input type="' + type + '" name="' + name + '" value="' + SG.esc(value) + '"' + (checked ? ' checked' : '') + '>' +
      '<span class="sh-box sh-box--' + type + '" aria-hidden="true"></span>' + (swatch || '') +
      '<span class="sh-opt__t">' + SG.esc(label) + '</span>' +
      (n == null ? '' : '<span class="sh-opt__n">' + n + '<span class="sr"> ' + (n === 1 ? 'style' : 'styles') + '</span></span>') + '</label></li>';
  }
  function group(scope, id, title, nSel, body, moreBtn) {
    var closed = UI[scope].closed[id];
    return '<details class="sh-fg" data-g="' + id + '"' + (closed ? '' : ' open') + '>' +
      '<summary class="sh-fg__sum"><span class="sh-fg__t">' + SG.esc(title) + '</span>' +
      (nSel ? '<span class="sh-fg__n">' + nSel + '<span class="sr"> selected</span></span>' : '') + SG.icons.chev + '</summary>' +
      '<div class="sh-fg__body">' + body + (moreBtn || '') + '</div></details>';
  }
  function moreToggle(scope, id, total, limit) {
    if (total <= limit) return '';
    var all = UI[scope].all[id];
    return '<button type="button" class="sh-fg__more" data-more="' + id + '" aria-expanded="' + !!all + '">' + (all ? 'Show fewer' : 'Show all ' + total) + '</button>';
  }

  function filtersHTML(f, scope) {
    var html = '';
    // Who
    var whoBase = SRC.filter(function (p) { return pass(p, f, 'who'); });
    var whoT = tally(whoBase, function (p) { return p.who; });
    if (distinct(function (p) { return p.who; }).length > 1 || f.who) {
      html += group(scope, 'who', 'Who it’s for', f.who ? 1 : 0, '<ul class="sh-opts">' +
        opt('radio', 'who', '', 'Everyone', whoBase.length, !f.who) +
        Object.keys(WHO).filter(function (k) { return whoT[k] || f.who === k; }).map(function (k) { return opt('radio', 'who', k, WHO[k], whoT[k] || 0, f.who === k); }).join('') + '</ul>');
    }
    // Category
    var catBase = SRC.filter(function (p) { return pass(p, f, 'cat'); });
    var catT = tally(catBase, function (p) { return p.cat; });
    var cats = CAT_ORDER.filter(function (k) { return catT[k] || f.cat.indexOf(k) > -1; });
    f.cat.forEach(function (k) { if (cats.indexOf(k) < 0) cats.push(k); });
    if (distinct(function (p) { return p.cat; }).length > 1 || f.cat.length) {
      var catAll = UI[scope].all.cat, LIM = 8;
      html += group(scope, 'cat', 'Category', f.cat.length, '<ul class="sh-opts">' + cats.map(function (k, i) {
        var li = opt('checkbox', 'cat', k, CAT[k] || k, catT[k] || 0, f.cat.indexOf(k) > -1);
        return i >= LIM && !catAll && f.cat.indexOf(k) < 0 ? li.replace('<li>', '<li hidden>') : li;
      }).join('') + '</ul>', moreToggle(scope, 'cat', cats.length, LIM));
    }
    // Ships
    var shipBase = SRC.filter(function (p) { return pass(p, f, 'ship'); });
    var shipT = tally(shipBase, function (p) { var k = SG.shipKind(p); return SHIP[k] && !SG.isSoldOut(p) ? k : null; });
    if (distinct(function (p) { return SG.shipKind(p); }).length > 1 || f.ship) {
      html += group(scope, 'ship', 'Ships', f.ship ? 1 : 0, '<ul class="sh-opts">' +
        opt('radio', 'ship', '', 'Any', shipBase.length, !f.ship) +
        ['in', 'mto'].map(function (k) {
          var dot = '<i class="sh-dot sh-dot--' + k + '" aria-hidden="true"></i>';
          return opt('radio', 'ship', k, SHIP[k][2], shipT[k] || 0, f.ship === k, dot);
        }).join('') + '</ul>');
    }
    // Size
    var sizeBase = SRC.filter(function (p) { return pass(p, f, 'size'); });
    var sizeT = tally(sizeBase, availSizes);
    var sizes = Object.keys(sizeT);
    f.size.forEach(function (s) { if (sizes.indexOf(s) < 0) sizes.push(s); });
    sizes.sort(function (a, b) { return sizeRank(a) - sizeRank(b) || a.localeCompare(b); });
    if (distinct(availSizes).length > 1 || f.size.length) {
      html += group(scope, 'size', 'Size', f.size.length, '<ul class="sh-sizes">' + sizes.map(function (s) {
        var on = f.size.indexOf(s) > -1, n = sizeT[s] || 0;
        return '<li><label class="sh-size' + (on ? ' is-on' : '') + '"><input type="checkbox" name="size" value="' + SG.esc(s) + '"' + (on ? ' checked' : '') + '>' +
          '<span>' + SG.esc(s) + '<span class="sr">, ' + n + ' ' + (n === 1 ? 'style' : 'styles') + '</span></span></label></li>';
      }).join('') + '</ul>');
    }
    // Colour
    var colBase = SRC.filter(function (p) { return pass(p, f, 'color'); });
    var colT = tally(colBase, availColors);
    var cols = Object.keys(colT).sort(function (a, b) { return colT[b] - colT[a] || a.localeCompare(b); });
    f.color.forEach(function (c) { if (lower(cols).indexOf(c.toLowerCase()) < 0) cols.push(c); });
    if (distinct(availColors).length > 1 || f.color.length) {
      var colAll = UI[scope].all.color, CL = 10, want = lower(f.color);
      html += group(scope, 'color', 'Colour', f.color.length, '<ul class="sh-opts">' + cols.map(function (c, i) {
        var on = want.indexOf(c.toLowerCase()) > -1;
        var sw = '<i class="sh-sw" style="--c:' + SG.colorBg(c) + '" aria-hidden="true"></i>';
        var li = opt('checkbox', 'color', c, c, colT[c] || 0, on, sw);
        return i >= CL && !colAll && !on ? li.replace('<li>', '<li hidden>') : li;
      }).join('') + '</ul>', moreToggle(scope, 'color', cols.length, CL));
    }
    // Price
    var priceBase = SRC.filter(function (p) { return pass(p, f, 'price'); });
    var buckets = PRICES.map(function (b) {
      var r = range(b[0]);
      return [b[0], b[1], priceBase.filter(function (p) { return p.p >= r[0] && p.p < r[1]; }).length];
    });
    var custom = f.price && !PRICES.some(function (b) { return b[0] === f.price; });
    var srcBuckets = PRICES.filter(function (b) { var r = range(b[0]); return SRC.some(function (p) { return p.p >= r[0] && p.p < r[1]; }); }).length;
    if (srcBuckets > 1 || f.price) {
      html += group(scope, 'price', 'Price', f.price ? 1 : 0, '<ul class="sh-opts">' +
        opt('radio', 'price', '', 'Any price', priceBase.length, !f.price) +
        buckets.filter(function (b) { return b[2] || f.price === b[0]; }).map(function (b) { return opt('radio', 'price', b[0], b[1], b[2], f.price === b[0]); }).join('') +
        (custom ? opt('radio', 'price', f.price, priceLabel(f.price), priceBase.filter(function (p) { return pass(p, { who: '', cat: [], ship: '', size: [], color: [], price: f.price, sale: false }); }).length, true) : '') +
        '</ul>');
    }
    // Sale
    var saleBase = SRC.filter(function (p) { return pass(p, f, 'sale'); });
    var saleN = saleBase.filter(onSale).length;
    var srcSale = SRC.filter(onSale).length;
    if ((srcSale && srcSale < SRC.length) || f.sale) {
      html += group(scope, 'sale', 'Offers', f.sale ? 1 : 0, '<ul class="sh-opts">' + opt('checkbox', 'sale', '1', 'On sale', saleN, f.sale) + '</ul>');
    }
    return html;
  }

  function readForm(form) {
    var fd = new FormData(form);
    return {
      who: fd.get('who') || '', cat: fd.getAll('cat'), ship: fd.get('ship') || '', size: fd.getAll('size'), color: fd.getAll('color'),
      price: fd.get('price') || '', sale: fd.get('sale') === '1'
    };
  }

  /* re-render a filter form without losing focus, open groups or scroll position */
  function paintForm(form, f, scope, scroller) {
    var a = document.activeElement;
    var key = null;
    if (a && form.contains(a)) {
      if (a.name) key = 'input[name="' + a.name + '"][value="' + (window.CSS && CSS.escape ? CSS.escape(a.value) : a.value) + '"]';
      else if (a.hasAttribute('data-more')) key = '[data-more="' + a.getAttribute('data-more') + '"]';
      else if (a.matches('summary')) key = '[data-g="' + a.parentNode.getAttribute('data-g') + '"] > summary';
    }
    var st = scroller ? scroller.scrollTop : 0;
    form.innerHTML = filtersHTML(f, scope);
    if (scroller) scroller.scrollTop = st;
    if (key) { var n = $(key, form); if (n) n.focus({ preventScroll: true }); }
  }

  function wireForm(form, scope, onChange, scroller) {
    form.addEventListener('change', function (e) {
      if (!e.target.name) return;
      onChange(readForm(form));
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    form.addEventListener('toggle', function (e) {
      var d = e.target;
      if (d.matches && d.matches('details[data-g]')) UI[scope].closed[d.getAttribute('data-g')] = !d.open;
    }, true);
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-more]');
      if (!b) return;
      var id = b.getAttribute('data-more');
      UI[scope].all[id] = !UI[scope].all[id];
      paintForm(form, scope === 'live' ? F : draft, scope, scroller);
    });
  }

  /* ======================================================================
     Results: count, pills, grid, more, none
     ====================================================================== */
  var listEl = $('[data-sh="list"]'), gridEl = $('[data-sh="grid"]'), moreEl = $('[data-sh="more"]'), noneEl = $('[data-sh="none"]');
  var railForm = $('[data-sh="rail"]'), railScroll = $('.sh-rail__in');
  var countEl = $('[data-sh="count"]'), pillsEl = $('[data-sh="pills"]'), sortEl = $('[data-sh="sort"]');
  var mixed = Object.keys(tally(SRC, function (p) { return p.sch || 'none'; })).length > 1;
  var RES = [];

  function pillsHTML(f) {
    var out = [];
    if (f.who) out.push(['who', f.who, WHO[f.who]]);
    f.cat.forEach(function (c) { out.push(['cat', c, CAT[c] || c]); });
    if (f.ship) out.push(['ship', f.ship, SHIP[f.ship][0]]);
    f.size.forEach(function (s) { out.push(['size', s, 'Size ' + s]); });
    f.color.forEach(function (c) { out.push(['color', c, c]); });
    if (f.price) out.push(['price', f.price, priceLabel(f.price)]);
    if (f.sale) out.push(['sale', '1', 'On sale']);
    if (V.q && !searchOnly && !RULE) out.push(['q', V.q, '“' + V.q + '”']);   // (a line rule's own words are its base)
    if (!out.length) return '';
    return out.map(function (p) {
      return '<li><button type="button" class="sh-pill" data-rm="' + p[0] + '" data-v="' + SG.esc(p[1]) + '" aria-label="Remove filter: ' + SG.esc(p[2]) + '">' +
        '<span>' + SG.esc(p[2]) + '</span>' + SG.icons.close + '</button></li>';
    }).join('') + (out.length > 1 ? '<li><button type="button" class="tlink sh-pills__clear" data-sh-clear>Clear all</button></li>' : '');
  }

  function writeUrl() {
    var R = RULE_F || emptyFilters();   // a rule view keeps its base in the URL; a shopper filter in the same group narrows it
    var url = SG.shopUrl({
      c: V.c, school: V.school, q: V.q, who: F.who || R.who, cat: F.cat.length ? F.cat : R.cat, ship: F.ship || R.ship, size: F.size, color: F.color, price: F.price,
      sale: F.sale || R.sale ? '1' : '', sort: V.sort !== 'featured' ? V.sort : ''
    });
    try { history.replaceState({ shown: shown }, '', url); } catch (e) { /* file:// or sandboxed */ }
  }

  function renderResults(focusFrom) {
    RES = sortList(SRC.filter(function (p) { return pass(p, F); }), V.sort);
    var total = SRC.length, n = RES.length, act = activeCount(F) + (V.q && !searchOnly && !RULE ? 1 : 0);
    countEl.innerHTML = n === total ? '<strong>' + fmt(n) + '</strong> ' + (n === 1 ? 'style' : 'styles')
      : '<strong>' + fmt(n) + '</strong> of ' + plural(total, 'style');
    pillsEl.innerHTML = pillsHTML(F);
    pillsEl.hidden = !act;
    $$('[data-sh-clear]', railScroll).forEach(function (b) { b.hidden = !activeCount(F); });
    var fc = $('[data-sh="fcount"]');
    fc.textContent = activeCount(F);
    fc.hidden = !activeCount(F);
    $('[data-sh-sheet]').setAttribute('aria-label', 'Filter' + (activeCount(F) ? ', ' + activeCount(F) + ' active' : ''));
    sortEl.value = V.sort;

    shown = Math.min(Math.max(PER, shown), Math.max(PER, n));
    var whoNow = F.who || (RULE_F ? RULE_F.who : '');
    var cardOpts = { school: mixed ? (auburnLabel ? 'others' : true) : false, ship: true, fam: whoNow === 'women' || whoNow === 'men' ? 'adult' : null };   // SG.card marks sold-out styles
    if (focusFrom != null && focusFrom > 0 && gridEl.children.length === focusFrom) {
      // "Show more": append only the next cards (the ones already shown stay as they are)
      gridEl.insertAdjacentHTML('beforeend', RES.slice(focusFrom, shown).map(function (p) { return '<div role="listitem">' + SG.card(p, cardOpts) + '</div>'; }).join(''));
    } else SG.grid(gridEl, RES.slice(0, shown), { hide: gridEl, card: cardOpts });

    if (!n) {
      noneEl.innerHTML = '<p class="sh-none__k">No matches</p>' +
        '<h2 class="h3">Nothing matches <em>all of those.</em></h2>' +
        '<p>Try removing a filter or two, or clear them all to see every style' + (searchOnly ? ' for “' + SG.esc(V.q) + '”' : '') + (PART.length ? ' in this preview' : '') + '.</p>' +
        '<button type="button" class="btn btn--scarlet" data-sh-clear>Clear all filters</button>';
    }
    noneEl.hidden = !!n;

    if (n > shown) {
      var next = Math.min(PER, n - shown);
      moreEl.innerHTML = '<p class="sh-more__t">Showing ' + fmt(shown) + ' of ' + fmt(n) + '</p>' +
        '<div class="sh-more__bar" aria-hidden="true"><i style="width:' + Math.round(shown / n * 100) + '%"></i></div>' +
        '<button type="button" class="btn btn--line-ink" data-sh-more>Show ' + next + ' more</button>';
      moreEl.hidden = false;
    } else if (n > PER) {
      moreEl.innerHTML = '<p class="sh-more__t">Showing all ' + fmt(n) + '</p><div class="sh-more__bar" aria-hidden="true"><i style="width:100%"></i></div>';
      moreEl.hidden = false;
    } else { moreEl.innerHTML = ''; moreEl.hidden = true; }

    paintForm(railForm, F, 'live', railScroll);
    writeUrl();
    if (focusFrom != null) {
      var links = $$('.pc__title a', gridEl);
      if (links[focusFrom]) links[focusFrom].focus();
    }
  }

  function setFilters(f) { F = f; shown = PER; renderResults(); }

  /* ======================================================================
     Empty states (honest: the catalogue loads from their Shopify store)
     ====================================================================== */
  function otherCollections() {
    var pool = [['auburn', 'All Auburn']].concat(SG.nav.auburn.map(function (r) { return [r[1], null]; }));
    pool.push(['s-g-christmas', null]);
    var seen = {};
    return pool.filter(function (r) {
      if (r[0] === C || seen[r[0]] || !COLS[r[0]]) return false;
      seen[r[0]] = 1;
      return true;
    }).slice(0, 7);
  }
  function searchMatches(q) {
    var ql = q.toLowerCase();
    var schools = (D.schools || []).filter(function (s) { return s.name.toLowerCase().indexOf(ql) > -1; })
      .map(function (s) { return [s.name, SG.shopUrl({ school: s.slug }), 'School']; });
    var toks = ql.split(/\s+/).filter(Boolean);
    var cols = Object.keys(COLS).filter(function (h) {
      var t = (COLS[h].t + ' ' + h).toLowerCase();
      return toks.every(function (k) { return t.indexOf(k) > -1 || t.indexOf(k.replace(/s$/, '')) > -1; });
    }).map(function (h) { return [pretty(h), SG.shopUrl({ c: h }), countLabel(h)]; });
    return schools.concat(cols).slice(0, 8);
  }
  function linkRows(rows) {
    return '<ul class="sh-cat__links">' + rows.map(function (r) {
      return '<li><a href="' + SG.esc(r[1]) + '"><span>' + SG.esc(r[0]) + '</span>' + (r[2] ? '<small>' + SG.esc(r[2]) + '</small>' : '') + SG.icons.right + '</a></li>';
    }).join('') + '</ul>';
  }

  /* what a derived link (SG.fromAuburn) actually lists: named by its rule, never as the unloaded collection */
  var DER_LABEL = {
    'auburn-womens-specialty': 'Auburn women’s pieces', 'auburn-adult-apparel': 'Auburn women’s tees, crewnecks & quarter-zips',
    'auburn-kids-specialty': 'Auburn girls’ & kids’ pieces', 'auburn-kids-apparel': 'Auburn kids’ tees & crewnecks',
    'auburn-girls-collection': 'Auburn girls’ & kids’ pieces', 'auburn-adult-tees-fleece-2026': 'Auburn women’s tees, crewnecks & quarter-zips',
    'auburn-mens-collection': 'Auburn men’s pieces', 'auburn-mens-specialty': 'Auburn men’s pieces', 'auburn-hat-collection-1': 'Auburn hats',
    'auburn-accessories-gifts': 'Auburn accessories & gifts', 'auburn-university-in-stock-items': 'Auburn pieces in stock now',
    'auburn-in-stock-sale-eligible': 'Auburn pieces in stock now', 'auburn-basketball': 'Auburn pieces with basketball in the name',
    'original-aubie-basketball': 'Original Aubie pieces', 'girls-cheer-dresses': 'Auburn cheer dresses', 'closeout-sale': 'Auburn pieces on sale'
  };
  /* signature lines read by the line's own name: "see the 14 Becca pieces", "see the 3 Mallory pieces" */
  var LINE_NAME = { 'the-becca-collection': 'Becca', 'the-alli-collection': 'Alli', 'the-ava-collection': 'Ava', 'the-kristen-collection': 'Kristen',
    'mallory-gingham-mocknecks': 'Mallory', 'grace-gingham-dresses': 'Grace', 'the-madi-collection': 'Madi' };
  function derLabel(h, n) {
    if (DER_LABEL[h]) return DER_LABEL[h];
    var line = LINE_NAME[h] || pretty(h).replace(/\s+Collection$/, '').replace(/^The\s+/, '');
    return line + (n === 1 ? ' piece' : ' pieces');
  }
  var railCfg = null;
  function renderCatalogueState() {
    var el = $('[data-sh="cat"]');
    var name = unknownC || searchOnly ? '' : (V.school && !V.c ? SCH.name : (C === 'auburn' && !V.school ? 'Auburn' : headCopy().title));
    var n = C && COLS[C] && !V.school ? COLS[C].n : 0;
    var h2, body, ctas, asideH, aside;
    if (searchOnly) {
      var rows = searchMatches(V.q);
      if (CATALOGUE && PART.length) {
        // partial data: "no match" only means none of the loaded styles match, so say so and point to their search
        h2 = 'None of the styles in this preview <em class="br">match “' + SG.esc(V.q) + '”.</em>';
        body = 'This preview has ' + fmt(CATALOGUE) + ' of their styles loaded, so this search only covers those. ' +
          '<a href="https://scarletandgoldshop.com/search?q=' + encodeURIComponent(V.q) + '" target="_blank" rel="noopener">' + EXT('Search their full catalogue') + '</a>, try a simpler word, or browse the collections.';
      } else if (CATALOGUE) {
        h2 = 'No styles match <em class="br">“' + SG.esc(V.q) + '”.</em>';
        body = 'Try a simpler word, like “crewneck”, “cheer dress” or a school name, or browse the collections.';
      } else {
        h2 = 'Product search runs on <em class="br">Scarlet &amp; Gold’s Shopify catalogue.</em>';
        body = 'Search results for “' + SG.esc(V.q) + '” appear here, with live sizes, prices and stock, once this preview is connected to their store.' +
          (rows.length ? ' In the meantime, these collections and schools match.' : ' In the meantime, start with a collection.');
      }
      ctas = '<a class="btn btn--scarlet" href="auburn.html">Shop Auburn</a><a class="btn btn--line-ink" href="index.html#schools">Shop your school</a>';
      asideH = rows.length ? 'Collections &amp; schools that match' : 'Popular right now';
      aside = linkRows(rows.length ? rows : [['Auburn', SG.shopUrl({ c: 'auburn' }), countLabel('auburn')], [pretty('s-g-christmas'), SG.shopUrl({ c: 's-g-christmas' }), ''],
        [pretty('girls-cheer-dresses'), SG.shopUrl({ c: 'girls-cheer-dresses' }), ''], [pretty('auburn-university-in-stock-items'), SG.shopUrl({ c: 'auburn-university-in-stock-items' }), '']]);
    } else if (unknownC) {
      h2 = 'That collection isn’t <em class="br">in this preview.</em>';
      body = 'The link may be from their current site. Every collection below loads from Scarlet &amp; Gold’s Shopify catalogue.';
      ctas = '<a class="btn btn--scarlet" href="' + SG.shopUrl({ c: 'auburn' }) + '">Shop all Auburn</a><a class="btn btn--line-ink" href="index.html">Back to home</a>';
      asideH = 'Keep browsing';
      aside = linkRows(otherCollections().map(function (r) { return [r[1] || pretty(r[0]), SG.shopUrl({ c: r[0] }), countLabel(r[0])]; }));
    } else {
      h2 = (V.school && !V.c ? SG.esc(SCH.name) + ' styles load' : 'This collection loads') + ' from <em class="br">Scarlet &amp; Gold’s Shopify catalogue.</em>';
      body = 'When this preview is connected to their store, ' + (n ? 'all ' + fmt(n) + ' styles in ' + SG.esc(name) + ' appear' : 'every style in ' + SG.esc(name) + ' appears') +
        ' right here, with live sizes, colors, prices and stock, and new drops show up the moment they launch.';
      // partial data: this collection isn't loaded, but the matching pieces of the loaded Auburn collection are
      var der = C && !V.school ? SG.fromAuburn(C) : null;
      var STAND_IN = { 's-g-christmas': 'auburn-gifts-in-stock' };   // no rule of its own: a rule-labelled stand-in
      var standIn = !der && C && STAND_IN[C] ? SG.fromAuburn(STAND_IN[C]) : null;
      if (der || standIn) railCfg = { d: der || standIn, h: der ? C : STAND_IN[C] };
      if (standIn) body += ' Meanwhile, <a href="' + SG.esc(standIn.url) + '">see the ' + standIn.products.length + ' Auburn gifts tagged in stock in this preview</a>.';
      if (der) {
        var dn = der.products.length, lbl = derLabel(C, dn);
        // (no "each card shows how it ships": pieces whose tags give no ship time print no ship line at all)
        body += ' Meanwhile, <a href="' + SG.esc(der.url) + '">see the ' + dn + ' ' + SG.esc(lbl) + ' in this preview</a>.';
      }
      // their live collection is one tap away
      if (C && !V.school && n) body += ' <a class="sh-cat__live" href="' + SG.esc(SG.liveUrl(C)) + '" target="_blank" rel="noopener">' + EXT('See all ' + fmt(n) + ' on their store') + '</a>';
      ctas = '<a class="btn btn--scarlet" href="#sg-list">Get new-drop alerts</a>' +
        (otherSchool ? '<a class="btn btn--line-ink" href="' + SG.shopUrl({ c: 'auburn' }) + '">Shop Auburn</a>' : '<a class="btn btn--line-ink" href="#sh-depts">Shop by department</a>');
      asideH = otherSchool ? 'Shop Auburn, our home team' : 'Keep browsing';
      aside = linkRows(otherCollections().map(function (r) { return [r[1] || pretty(r[0]), SG.shopUrl({ c: r[0] }), countLabel(r[0])]; }));
    }
    el.innerHTML = '<div class="wrap sh-cat__grid">' +
      '<div class="sh-cat__cardwrap"><div class="ticket sh-cat__card">' +
        '<span class="patch patch--navy">' + (auburnLabel ? '<span class="patch__dot" aria-hidden="true"></span>' : '') + (searchOnly ? 'Search' : 'Live catalogue') + '</span>' +
        '<h2 class="h2 h2--md" id="sh-cat-h">' + h2 + '</h2>' +
        '<p class="sh-cat__p">' + body + '</p>' +
        '<span class="ticket__perf" aria-hidden="true"></span>' +
        '<div class="sh-cat__ctas">' + ctas + '</div>' +
      '</div></div>' +
      '<div class="sh-cat__aside"><p class="eyebrow">' + asideH + '</p>' + aside + '</div>' +
      '</div>' +
      (railCfg ? '<div class="wrap sh-cat__more"><div class="sechead"><div><p class="eyebrow">While the collection loads</p>' +
        '<h2 class="h3">' + SG.esc(railCfg.h === 'auburn-gifts-in-stock' ? 'Auburn gifts tagged in stock' : derLabel(railCfg.h, railCfg.d.products.length).replace(/^./, function (c) { return c.toUpperCase(); })) + ', <em>in this preview.</em></h2></div>' +
        '<div class="sechead__side"><a class="tlink" href="' + SG.esc(railCfg.d.url) + '">See all ' + railCfg.d.products.length + '</a><div data-sh="cat-nav"></div></div></div>' +
        '<div data-sh="cat-rail"></div></div>' : '');
    el.hidden = false;
    if (railCfg) SG.rail($('[data-sh="cat-rail"]', el), railCfg.d.products, { limit: 12, nav: $('[data-sh="cat-nav"]', el), hide: $('.sh-cat__more', el),
      card: { school: false, ship: true, fam: railCfg.d.who === 'women' || railCfg.d.who === 'men' ? 'adult' : null } });   // Women / Men price from adult sizes
  }

  /* ======================================================================
     Auburn departments (photo-led links to other collections)
     ====================================================================== */
  /* photo, card, photo, card…: Auburn departments only (the all-school Christmas collection isn't one). A department with
     no fitting photo is a designed card; real collection photos ('col:') take over once the catalogue has them. */
  var DEPTS = [
    { t: 'Women', c: 'auburn-womens-specialty', img: ['col:auburn-womens-specialty', { k: 'four-models-sets', pos: '50% 30%' }, { k: 'auburn-blue-cropped-crewneck-model', pos: '50% 10%' },
      { k: 'auburn-embroidered-crewneck-model', pos: '50% 10%' }], made: { patch: 'Auburn women', dot: true, note: 'Women’s XS–2XL' } },
    { t: 'Hats', c: 'auburn-hat-collection-1', img: ['col:auburn-hat-collection-1', { k: 'p:the-vintage-war-eagle-hat-navy-natural#1', pos: '50% 30%' }, 'rule:auburn-hat-collection-1'], made: { patch: 'Auburn hats', dot: true, note: 'Local pickup at our Auburn shop' } },
    { t: 'Girls & kids', c: 'auburn-kids-specialty', img: ['col:auburn-kids-specialty', { k: 'mom-mini-auburn-stripes', pos: '30% 40%' }, { k: 'auburn-cheer-dress-flat', pos: '50% 45%' }],
      made: { patch: 'Girls & kids', dot: true, note: 'Girls’ sizes from 12M' } },
    { t: 'Gifts', c: 'auburn-accessories-gifts', img: ['col:auburn-accessories-gifts', { k: 'p:the-auburn-university-needlepoint-pillow', pos: '50% 50%' }, 'rule:auburn-accessories-gifts'], made: { big: '&', note: 'Little extras for every Auburn fan' } },
    { t: 'Tees & fleece', c: 'auburn-adult-apparel', img: ['col:auburn-adult-apparel', { k: 'auburn-tee-grid-flatlay-2', pos: '50% 50%' }, { k: 'auburn-tee-grid-flatlay', pos: '50% 50%' }],
      made: { patch: 'Tees & fleece', dot: true, note: 'Printed or embroidered in Auburn' } },
    { t: 'In stock now', c: 'auburn-university-in-stock-items', img: ['rule:auburn-university-in-stock-items'], made: { patch: 'In stock', dot: true, note: 'Ships in 5–7 business days' } },
    { t: 'Men', c: 'auburn-mens-collection', img: ['col:auburn-mens-collection', 'rule:auburn-mens-collection'], made: { patch: 'Auburn men', dot: true, note: 'For the men in your crew' } }
  ];
  function renderDepts(empty) {
    var band = $('[data-sh="depts-band"]');
    if (otherSchool) { band.hidden = true; return; }
    var items = DEPTS.filter(function (d) { return d.c !== C && d.c !== RULE; }).slice(0, 6)
      .map(function (d) { return d.c === 'auburn-adult-apparel' ? d : Object.assign({}, d, { href: SG.ctaUrl(d.c) }); });   // (the tees tile names a collection)
    SG.deptTiles($('[data-sh="depts"]'), items);
    $('[data-sh="depts-title"]').innerHTML = empty ? 'Shop Auburn <em>by department.</em>' : 'Keep shopping <em>Auburn.</em>';
    band.hidden = false;
  }

  /* ======================================================================
     Phone filter sheet (staged)
     ====================================================================== */
  var sheet = $('#sh-sheet'), sheetForm = $('[data-sh="sheet"]'), applyBtn = $('[data-sh-apply]'), fbtn = $('[data-sh-sheet]');
  var draft = emptyFilters(), inerted = [], sheetT = null;
  function paintSheet() {
    paintForm(sheetForm, draft, 'draft', sheetForm);
    var n = SRC.filter(function (p) { return pass(p, draft); }).length;
    applyBtn.textContent = n ? 'Show ' + plural(n, 'style') : 'No matches';
    applyBtn.disabled = !n;
  }
  function openSheet() {
    draft = JSON.parse(JSON.stringify(F));
    UI.draft = JSON.parse(JSON.stringify(UI.live));
    paintSheet();
    clearTimeout(sheetT);
    sheet.hidden = false;
    void sheet.offsetWidth;
    sheet.classList.add('is-on');
    document.body.classList.add('is-locked');
    fbtn.setAttribute('aria-expanded', 'true');
    inerted = Array.prototype.filter.call(document.body.children, function (el) { return el !== sheet && el.tagName !== 'SCRIPT' && !el.inert; });
    inerted.forEach(function (el) { el.inert = true; });
    window.setTimeout(function () { $('.sh-x', sheet).focus({ preventScroll: true }); }, 40);
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.classList.remove('is-on');
    document.body.classList.remove('is-locked');
    inerted.forEach(function (el) { el.inert = false; });
    inerted = [];
    fbtn.setAttribute('aria-expanded', 'false');
    sheetT = window.setTimeout(function () { sheet.hidden = true; }, 320);
    fbtn.focus({ preventScroll: true });
  }
  function trapTab(e) {
    if (e.key !== 'Tab' || sheet.hidden) return;
    var f = $$('button:not([disabled]), input, select, summary, a[href]', sheet).filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ======================================================================
     Boot (top to bottom so the header gets first pick of photos)
     ====================================================================== */
  renderHead();
  renderSwitch();
  var hasList = SRC.length > 0;
  if (hasList) {
    listEl.hidden = false;
    wireForm(railForm, 'live', setFilters, railScroll);
    wireForm(sheetForm, 'draft', function (f) { draft = f; paintSheet(); }, sheetForm);
    renderResults();
  } else {
    renderCatalogueState();
  }
  renderDepts(!hasList);
  document.documentElement.classList.remove('sg-wait');   // the real view is in: show it (shop.html head script hid the placeholder)

  /* ---------- events ---------- */
  sortEl.addEventListener('change', function () { V.sort = sortEl.value; shown = PER; renderResults(); });
  document.addEventListener('click', function (e) {
    var t = e.target, b;
    if ((b = t.closest('[data-sh-more]'))) {
      var from = shown;
      shown += PER;
      renderResults(from);
      return;
    }
    if ((b = t.closest('.sh-pill'))) {
      var k = b.getAttribute('data-rm'), v = b.getAttribute('data-v');
      var f = JSON.parse(JSON.stringify(F));
      if (k === 'q') { V.q = ''; SRC = sourceList(); mixed = Object.keys(tally(SRC, function (p) { return p.sch || 'none'; })).length > 1; renderMeta(); }
      else if (Array.isArray(f[k])) f[k] = f[k].filter(function (x) { return x !== v; });
      else f[k] = k === 'sale' ? false : '';
      setFilters(f);
      var nb = $('.sh-pill', pillsEl) || $('[data-sh="count"]');
      if (nb && nb.focus) { if (!nb.hasAttribute('tabindex') && nb.tagName === 'P') nb.setAttribute('tabindex', '-1'); nb.focus({ preventScroll: true }); }
      return;
    }
    if (t.closest('[data-sh-clear]')) {
      var hadQ = V.q && !searchOnly && !RULE;
      if (hadQ) { V.q = ''; SRC = sourceList(); renderMeta(); }
      setFilters(emptyFilters());
      return;
    }
    if (t.closest('[data-sh-sheet]')) { openSheet(); return; }
    if (t.closest('[data-sh-close]')) { closeSheet(); return; }
    if (t.closest('[data-sh-sheet-clear]')) { draft = emptyFilters(); paintSheet(); return; }
    if (t.closest('[data-sh-apply]')) {
      setFilters(draft);
      closeSheet();
      if (listEl.getBoundingClientRect().top < 0) listEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
  document.addEventListener('keydown', function (e) {
    if (sheet.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeSheet(); }
    trapTab(e);
  });
  var mq = window.matchMedia('(min-width: 1024px)');
  var onMq = function () { if (mq.matches) closeSheet(); };
  if (mq.addEventListener) mq.addEventListener('change', onMq); else mq.addListener(onMq);

  // Back/forward: filters live in the URL; a different view (c / school / q) is a different page
  window.addEventListener('popstate', function () {
    var s = readUrl();
    if (s.c !== V.c || s.school !== V.school || s.q !== V.q) { location.reload(); return; }
    V.sort = s.sort;
    if (hasList) { F = ownFilters(s); renderResults(); }
  });
})();
