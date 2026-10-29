/* Sword and Crown — the boutique's category structure (Elana, 2026-10-28).
 *
 * Four main departments in her order, each with its dropdown categories and,
 * for Tops and Hats, a further submenu. Plus a Holiday edit and Shop All.
 *
 * Where a product lands is DELIBERATE, never a guess from words in its title:
 *   1. an explicit assignment below, by Shopify handle (the ones she named,
 *      plus the audit of 2026-10-28), else
 *   2. one of her own Shopify TAGS (earrings, sweater, turban, makeup bag …),
 *      which she sets product by product, else
 *   3. her Shopify Product type, which only places a piece in a department
 *      (it shows under that department's Shop All, with no sub-category).
 * Anything that matches none of those is an ORPHAN: the boutique has no
 * whole-assortment view any more (her brief of 2026-10-28), so an orphan is
 * not reachable from the departments until she places it. They are listed
 * for her in window.SC_ORPHANS.
 *
 * To move a piece: give it the tag of the category you want (the tag names
 * are the `tags` lists below) or add it to OVERRIDES. "holiday" as a tag puts
 * a piece in the Holiday edit as well as its department.
 */
window.SC_CATALOG = (function () {
  'use strict';

  var MAIN = [
    { key: 'clothing', name: 'Clothing / Apparel', short: 'Clothing', subs: [
      { key: 'tops', name: 'Tops', subs: [
        { key: 'tees', name: 'Tees' }, { key: 'sweaters', name: 'Sweaters' }, { key: 'shirts', name: 'Shirts' }
      ] },
      { key: 'bottoms', name: 'Bottoms' }, { key: 'skirts', name: 'Skirts' }, { key: 'sets', name: 'Sets' },
      { key: 'dresses', name: 'Dresses' }, { key: 'bralettes-tanks', name: 'Bralettes / Tanks' }
    ] },
    { key: 'accessories', name: 'Accessories', short: 'Accessories', subs: [
      { key: 'hats', name: 'Hats', subs: [
        { key: 'turbans', name: 'Turbans' }, { key: 'trucker-hats', name: 'Trucker Hats' }, { key: 'beanies', name: 'Beanies' }
      ] },
      { key: 'keychains', name: 'Keychains' }, { key: 'purses', name: 'Purses' }, { key: 'socks', name: 'Socks' },
      { key: 'scarves', name: 'Scarves' }, { key: 'pins', name: 'Pins' }, { key: 'hair-accessories', name: 'Hair Accessories' }
    ] },
    { key: 'products', name: 'Products', short: 'Products', subs: [
      { key: 'hair-care', name: 'Hair Care' }, { key: 'makeup', name: 'Makeup' }, { key: 'makeup-bags', name: 'Makeup Bags' },
      { key: 'hair-regrowth', name: 'Hair Regrowth' }, { key: 'hair-tools', name: 'Hair Tools' }
    ] },
    { key: 'jewelry', name: 'Jewelry', short: 'Jewelry', subs: [
      { key: 'earrings', name: 'Earrings' }, { key: 'necklaces', name: 'Necklaces' }, { key: 'bracelets', name: 'Bracelets' },
      { key: 'rings', name: 'Rings' }, { key: 'jewelry-boxes', name: 'Jewelry Boxes' }
    ] },
    { key: 'holiday', name: 'Holiday', short: 'Holiday', edit: true, subs: [] }
  ];

  /* her Shopify tags → category key (lower-cased, spaces to hyphens) */
  var TAGS = {
    'earrings': 'earrings', 'necklace': 'necklaces', 'bracelet': 'bracelets', 'rings': 'rings', 'jewelry-box': 'jewelry-boxes',
    'graphic-tee': 'tees', 'sweater': 'sweaters', 'cardigan': 'sweaters', 'shirts': 'shirts', 'crop-top': 'tops',
    'jacket': 'tops', 'outerwear': 'tops', 'vest': 'tops', 'bralette': 'bralettes-tanks',
    'dresses': 'dresses', 'skirts': 'skirts', 'skirt': 'skirts', 'pants': 'bottoms', 'shorts': 'bottoms', 'suit': 'sets', 'sets': 'sets',
    'turban': 'turbans', 'trucker-hat': 'trucker-hats', 'beanie': 'beanies', 'hats': 'hats',
    'keychain': 'keychains', 'purse': 'purses', 'bags': 'purses', 'crossbody': 'purses', 'clutch': 'purses', 'tote-bag': 'purses', 'weekender': 'purses',
    'socks': 'socks', 'scarf': 'scarves', 'pins': 'pins', 'lapel-pin': 'pins',
    'hair-accessories': 'hair-accessories', 'scrunchie': 'hair-accessories', 'clips': 'hair-accessories', 'claw-clips': 'hair-accessories',
    'bonnets': 'hair-accessories', 'hair-towel': 'hair-accessories',
    'hair-care': 'hair-care', 'hair-treatment': 'hair-care', 'makeup': 'makeup', 'makeup-bag': 'makeup-bags',
    'cosmetic-accessories': 'makeup-bags', 'hair-regrowth': 'hair-regrowth', 'hair-tools': 'hair-tools', 'brush': 'hair-tools'
  };

  /* her Shopify Product types → a department only */
  var TYPES = {
    'jewelry': 'jewelry', 'clothing': 'clothing', 'accessories': 'accessories', 'hair-accessories': 'hair-accessories',
    'cosmetics': 'products', 'hair-tools': 'hair-tools', 'hair-care': 'hair-care', 'hats': 'hats', 'purse': 'purses'
  };

  /* explicit placements by handle — the ones she named on 2026-10-28 and the
     pieces the tag/type pass could not place. Listed in the same order as the
     report sent to her. */
  var OVERRIDES = {
    'holiday-candy-cane-crew-socks': 'socks',
    'nice-beanie': 'beanies', 'naughty-beanie': 'beanies',
    'atmosphere-multi-peptide-hair-density-scalp-serum': 'hair-regrowth',
    'obsidian-volumizing-anti-pollution-scalp-scrub-shampoo': 'hair-care',
    'nourish-grow-system': 'hair-regrowth',
    'waffle-turban': 'turbans',
    'pink-heat-protector-pad': 'hair-tools'
  };
  /* Ceramide Hydra-Balms → Makeup: matched by title prefix because there are
     several colourways with separate handles. */
  var TITLE_OVERRIDES = [[/^ceramide hydra-balm/i, 'makeup']];

  /* The Holiday edit. A piece is in it when she tags it "holiday", or it is
     one of these (the audit of 2026-10-28). Every piece also keeps its
     department; Holiday is a seasonal edit, not a home. */
  var HOLIDAY = [
    'holiday-sweater',
    'festive-jotter-gel-pen-set-of-3',
    'santa-list-holiday-mini-jotter-notebook',
    'nice-beanie',
    'holiday-candy-cane-crew-socks',
    'extra-naughty-tumbler-gold',
    'jingle-juice-holiday-tumbler-gold',
    'holiday-bow-earrings-single-silver',
    'holiday-retro-deer-ornament-pink',
    'holiday-bow-earrings-single-red',
    'naughty-beanie',
    'elf-ornament-nifty-nyah',
    'luxe-christmas-santa-hat-light-pink',
    'retro-dancing-christmas-santa-red',
    'a-vintage-christmas-graphic-tee',
    'see-you-under-the-mistletoe-holiday-boxy-cotton-t-shirt'
  ];

  /* ── lookups ─────────────────────────────────────────────────── */
  var BY_KEY = {};
  MAIN.forEach(function (m) {
    BY_KEY[m.key] = { key: m.key, name: m.name, main: m.key, sub: null, parent: null };
    (m.subs || []).forEach(function (s) {
      BY_KEY[s.key] = { key: s.key, name: s.name, main: m.key, sub: s.key, parent: m.key };
      (s.subs || []).forEach(function (t) {
        BY_KEY[t.key] = { key: t.key, name: t.name, main: m.key, sub: s.key, leaf: t.key, parent: s.key };
      });
    });
  });

  function norm(s) { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  /* the most specific category key for a product, or null (orphan) */
  function keyOf(p) {
    if (OVERRIDES[p.handle]) return OVERRIDES[p.handle];
    for (var i = 0; i < TITLE_OVERRIDES.length; i++) if (TITLE_OVERRIDES[i][0].test(p.title || '')) return TITLE_OVERRIDES[i][1];
    var tags = (p.tags || []).map(norm);
    for (var j = 0; j < tags.length; j++) if (TAGS[tags[j]]) return TAGS[tags[j]];
    var t = norm(p.type);
    if (TYPES[t]) return TYPES[t];
    return null;
  }
  /* every key the product belongs under, from department down */
  function keysOf(p) {
    var k = keyOf(p), out = [];
    var node = k && BY_KEY[k];
    while (node) { out.push(node.key); node = node.parent ? BY_KEY[node.parent] : null; }
    if (isHoliday(p)) out.push('holiday');
    return out;
  }
  function isHoliday(p) {
    return HOLIDAY.indexOf(p.handle) > -1 || (p.tags || []).map(norm).indexOf('holiday') > -1;
  }
  /* breadcrumb trail for a product: [{key,name}…] from department to leaf */
  function trail(p) {
    var k = keyOf(p), out = [];
    var node = k && BY_KEY[k];
    while (node) { out.unshift({ key: node.key, name: node.name }); node = node.parent ? BY_KEY[node.parent] : null; }
    return out;
  }
  function find(key) { return BY_KEY[key] || null; }
  function main(key) { var n = BY_KEY[key]; return n ? BY_KEY[n.main] : null; }
  function children(key) {
    var m = null;
    MAIN.forEach(function (x) { if (x.key === key) m = x; (x.subs || []).forEach(function (s) { if (s.key === key) m = s; }); });
    return (m && m.subs) || [];
  }

  return { MAIN: MAIN, keyOf: keyOf, keysOf: keysOf, trail: trail, find: find, main: main, children: children, isHoliday: isHoliday };
})();
