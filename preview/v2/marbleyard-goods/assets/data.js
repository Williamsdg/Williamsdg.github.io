/* Marbleyard Goods — fictional demo data + the shop's original SVG illustrations.
   Every price, product and policy here is sample data for a concept project. */
(function () {
  'use strict';

  var INK = '#1E1E2A', CREAM = '#FFF6E5', COBALT = '#3153D9', CHERRY = '#D44948',
      BUTTER = '#F6D77A', MINT = '#9ED9BF', BRASS = '#D9A441', GLASS = '#DCE7F5',
      LEAF = '#3E9B6B', TEA = '#8A5A3C';

  /* ---------- deterministic demo data ---------- */
  var MOODS = [
    { key: 'all', label: 'Everything', note: 'The whole shelf' },
    { key: 'desk', label: 'Desk joy', note: 'Small things to fidget with between emails' },
    { key: 'evenings', label: 'Slow evenings', note: 'Candles, cards and warm socks' },
    { key: 'gifts', label: 'Gifts under $30', note: 'Easy yeses under thirty dollars' },
    { key: 'kitchen', label: 'Kitchen table', note: 'For coffee, supper and card games' }
  ];

  var PACKAGING = [
    { key: 'kraft', label: 'Kraft box', price: 0, note: 'Brown card box, butter tissue' },
    { key: 'tin', label: 'Cobalt tin', price: 600, note: 'Keepable painted tin' },
    { key: 'wrap', label: 'Cherry wrap', price: 400, note: 'Cherry paper, cream ribbon' }
  ];

  var GIFT = { min: 2, max: 3, savingsRate: 0.10, savingsAt: 3, noteMax: 120 };
  var SHIPPING = { flat: 600, freeFrom: 7500 };

  var PRODUCTS = [
    { id: 'enamel-mug', art: 'mug', name: 'Speckle Enamel Mug', price: 2200, moods: ['kitchen', 'evenings'],
      plinth: 'butter', size: '350 ml · 9 cm tall', material: 'Enamel-coated steel',
      blurb: 'A camp-style mug with a rolled cream rim and a spatter of speckles. Tough enough for the porch, cheerful enough for the desk.',
      colors: [{ key: 'cobalt', label: 'Cobalt', c: { body: COBALT } }, { key: 'cherry', label: 'Cherry', c: { body: CHERRY } }, { key: 'mint', label: 'Mint', c: { body: MINT } }],
      views: ['Front', 'From above', 'Tea time'] },
    { id: 'stripe-candle', art: 'candle', name: 'Stripe Pillar Candle', price: 1800, moods: ['evenings'],
      plinth: 'mint', size: '6 cm wide · 13 cm tall', material: 'Rapeseed wax, cotton wick',
      blurb: 'A chunky pillar wrapped in painted candy stripes. It looks like a party even before you light it.',
      colors: [{ key: 'cherry', label: 'Cherry & cream', c: { wax: CREAM, stripe: CHERRY } }, { key: 'cobalt', label: 'Cobalt & butter', c: { wax: BUTTER, stripe: COBALT } }],
      views: ['Front', 'From above', 'Lit'] },
    { id: 'incense-dog', art: 'dog', name: 'Good Boy Incense Holder', price: 3400, moods: ['evenings'],
      plinth: 'cherry', size: '17 cm long · 7 cm tall', material: 'Glazed stoneware',
      blurb: 'A long, patient ceramic dog with a hole in his back for one incense stick. He does not mind the smoke.',
      colors: [{ key: 'butter', label: 'Butter', c: { glaze: BUTTER, ear: TEA } }, { key: 'mint', label: 'Mint', c: { glaze: MINT, ear: COBALT } }],
      views: ['Side', 'From above', 'Burning'] },
    { id: 'wobble-mirror', art: 'mirror', name: 'Wobble Mirror', price: 6800, moods: ['desk'],
      plinth: 'butter', size: '24 × 32 cm', material: 'Lacquered birch ply, mirror glass',
      blurb: 'An oval mirror with a frame that could not sit still. Leans on a shelf or hangs from one nail.',
      colors: [{ key: 'cherry', label: 'Cherry', c: { frame: CHERRY } }, { key: 'cobalt', label: 'Cobalt', c: { frame: COBALT } }],
      views: ['Front', 'Side', 'On the wall'] },
    { id: 'tomato-pincushion', art: 'tomato', name: 'Tomato Pincushion', price: 1600, moods: ['desk', 'gifts'],
      plinth: 'cobalt', size: '9 cm wide', material: 'Cotton velvet, wool stuffing',
      blurb: 'The classic sewing-box tomato, plumped up and softened. Also a very good place to park a paperclip.',
      colors: [{ key: 'red', label: 'Tomato red', c: { skin: CHERRY } }, { key: 'yellow', label: 'Heirloom yellow', c: { skin: BUTTER } }],
      views: ['Front', 'From above', 'Full of pins'] },
    { id: 'marble-jar', art: 'marbles', name: 'Jar of Marbles', price: 2400, moods: ['desk', 'gifts'],
      plinth: 'cherry', size: '30 marbles · 11 cm jar', material: 'Glass, painted tin lid',
      blurb: 'Thirty glass marbles in a squat jar. Roll them, sort them, or just enjoy the rattle.',
      colors: [{ key: 'cobalt', label: 'Cobalt lid', c: { lid: COBALT } }, { key: 'cherry', label: 'Cherry lid', c: { lid: CHERRY } }],
      views: ['Front', 'Lid', 'Spilled'] },
    { id: 'checker-coasters', art: 'coasters', name: 'Checker Coaster Set', price: 2800, moods: ['kitchen', 'gifts'],
      plinth: 'butter', size: 'Set of 4 · 10 cm square', material: 'Cork-backed printed ash',
      blurb: 'Four square coasters in a bold checkerboard. Stack them, scatter them, play a very small game on them.',
      colors: [{ key: 'cobalt', label: 'Cobalt check', c: { a: COBALT, b: CREAM } }, { key: 'cherry', label: 'Cherry check', c: { a: CHERRY, b: CREAM } }],
      views: ['Stacked', 'Set of four', 'Under a mug'] },
    { id: 'dot-notebook', art: 'notebook', name: 'Dot Grid Notebook', price: 1400, moods: ['desk', 'gifts'],
      plinth: 'mint', size: 'A5 · 160 pages', material: 'Cloth cover, 100 gsm paper',
      blurb: 'A lay-flat notebook with a cloth cover, dot grid pages and an elastic band that actually stays put.',
      colors: [{ key: 'cobalt', label: 'Cobalt', c: { cover: COBALT } }, { key: 'cherry', label: 'Cherry', c: { cover: CHERRY } }, { key: 'mint', label: 'Mint', c: { cover: MINT } }],
      views: ['Cover', 'Open', 'In use'] },
    { id: 'bumpy-vase', art: 'vase', name: 'Bumpy Bud Vase', price: 3800, moods: ['kitchen', 'desk'],
      plinth: 'cobalt', size: '14 cm tall', material: 'Hand-glazed earthenware',
      blurb: 'A small hobnail vase for one stem, one feather, or one very good pencil.',
      colors: [{ key: 'mint', label: 'Mint', c: { glaze: MINT } }, { key: 'butter', label: 'Butter', c: { glaze: BUTTER } }, { key: 'cherry', label: 'Cherry', c: { glaze: CHERRY } }],
      views: ['Front', 'From above', 'With a tulip'] },
    { id: 'big-pip-cards', art: 'cards', name: 'Big Pip Playing Cards', price: 1200, moods: ['evenings', 'kitchen', 'gifts'],
      plinth: 'mint', size: '52 cards + 2 jokers', material: 'Linen-finish card stock',
      blurb: 'A full deck with oversized pips you can read from across the table. Built for long games and loud rematches.',
      colors: [{ key: 'cherry', label: 'Cherry backs', c: { back: CHERRY } }, { key: 'cobalt', label: 'Cobalt backs', c: { back: COBALT } }],
      views: ['Box', 'Fanned', 'Card house'] },
    { id: 'fish-opener', art: 'opener', name: 'Brass Fish Opener', price: 2600, moods: ['kitchen', 'gifts'],
      plinth: 'cherry', size: '11 cm long', material: 'Solid brass',
      blurb: 'A flat brass fish whose mouth pops caps. Gets a warm patina the more it is used.',
      colors: [{ key: 'polished', label: 'Polished brass', c: { metal: BRASS } }, { key: 'aged', label: 'Aged brass', c: { metal: '#B8873A' } }],
      views: ['Face', 'Back', 'Popping a cap'] },
    { id: 'wiggle-socks', art: 'socks', name: 'Wiggle Stripe Socks', price: 1500, moods: ['evenings', 'gifts'],
      plinth: 'butter', size: 'One pair · fits US 6–11', material: 'Combed cotton blend',
      blurb: 'Crew socks with fat stripes and a contrast heel and toe. Made for slow evenings with your feet up.',
      colors: [{ key: 'cobalt', label: 'Cobalt stripe', c: { base: CREAM, stripe: COBALT, heel: CHERRY } }, { key: 'cherry', label: 'Cherry stripe', c: { base: CREAM, stripe: CHERRY, heel: COBALT } }],
      views: ['Pair', 'Folded', 'On the line'] }
  ];

  /* ---------- illustration helpers ---------- */
  function st(w) { return 'stroke="' + INK + '" stroke-width="' + (w || 4) + '" stroke-linejoin="round" stroke-linecap="round"'; }
  function ground(cx, rx) { return '<ellipse cx="' + cx + '" cy="190" rx="' + rx + '" ry="6" fill="' + INK + '" opacity=".2"/>'; }
  function shade(d, o) { return '<path d="' + d + '" fill="' + INK + '" opacity="' + (o || '.13') + '"/>'; }
  function line(d, w, color, o) { return '<path d="' + d + '" fill="none" stroke="' + (color || INK) + '" stroke-width="' + (w || 4) + '" stroke-linecap="round" stroke-linejoin="round"' + (o ? ' opacity="' + o + '"' : '') + '/>'; }
  function tube(d, w, color) { return line(d, w + 7) + line(d, w, color); }
  function wavy(cx, cy, rx, ry, amp, n) {
    var d = '', steps = 96;
    for (var i = 0; i < steps; i++) {
      var t = i / steps * Math.PI * 2, k = amp * Math.sin(n * t);
      d += (i ? 'L' : 'M') + (cx + (rx + k) * Math.cos(t)).toFixed(1) + ' ' + (cy + (ry + k) * Math.sin(t)).toFixed(1);
    }
    return d + 'Z';
  }
  function heart(cx, cy, s, fill) {
    return '<path d="M' + cx + ' ' + (cy + s * .9) + 'C' + (cx - s * 1.5) + ' ' + cy + ' ' + (cx - s) + ' ' + (cy - s * 1.2) + ' ' + cx + ' ' + (cy - s * .35) +
      'C' + (cx + s) + ' ' + (cy - s * 1.2) + ' ' + (cx + s * 1.5) + ' ' + cy + ' ' + cx + ' ' + (cy + s * .9) + 'Z" fill="' + fill + '"/>';
  }
  function diamond(cx, cy, s, fill) {
    return '<path d="M' + cx + ' ' + (cy - s) + 'L' + (cx + s * .72) + ' ' + cy + 'L' + cx + ' ' + (cy + s) + 'L' + (cx - s * .72) + ' ' + cy + 'Z" fill="' + fill + '"/>';
  }
  function dots(x0, x1, y0, y1, step, r, fill, o) {
    var s = '';
    for (var x = x0; x <= x1; x += step) for (var y = y0; y <= y1; y += step) s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
    return '<g fill="' + fill + '" opacity="' + (o || 1) + '">' + s + '</g>';
  }
  function g(inner, transform) { return '<g transform="' + transform + '">' + inner + '</g>'; }

  /* ---------- the drawings (viewBox 0 0 200 200, objects rest on y≈186) ---------- */
  var ART = {
    mug: function (v, c) {
      function front() {
        var speck = [[70, 108], [94, 124], [78, 150], [106, 102], [112, 158], [66, 172], [124, 136], [92, 172], [118, 112]]
          .map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.4"/>'; }).join('');
        return ground(98, 58) + tube('M136 106C166 104 166 150 136 152', 9, c.body) +
          '<path d="M54 84H138V166Q138 186 118 186H74Q54 186 54 166Z" fill="' + c.body + '" ' + st() + '/>' +
          shade('M116 88H135V166Q135 183 118 183H116Z') +
          '<g fill="' + CREAM + '" opacity=".85">' + speck + '</g>' +
          '<rect x="50" y="76" width="92" height="12" rx="6" fill="' + CREAM + '" ' + st() + '/>';
      }
      if (v === 1) return '<circle cx="106" cy="112" r="62" fill="' + INK + '" opacity=".15"/>' +
        '<rect x="146" y="94" width="40" height="22" rx="11" fill="' + c.body + '" ' + st() + '/>' +
        '<circle cx="98" cy="104" r="60" fill="' + CREAM + '" ' + st() + '/>' +
        '<circle cx="98" cy="104" r="50" fill="' + c.body + '" ' + st(3) + '/>' +
        '<circle cx="98" cy="104" r="40" fill="' + TEA + '" ' + st(3) + '/>' +
        line('M74 92Q84 74 106 72', 5, CREAM, '.6');
      if (v === 2) return front() + line('M78 64C64 50 92 44 78 26', 4, INK, '.45') + line('M100 62C86 48 114 40 100 18', 4, INK, '.45') +
        line('M122 64C108 50 136 44 122 28', 4, INK, '.45') +
        line('M100 80Q90 100 82 120', 2.5) + '<rect x="68" y="118" width="28" height="22" rx="3" fill="' + BUTTER + '" ' + st(3) + '/>';
      return front();
    },
    candle: function (v, c) {
      function body() {
        var s = '';
        [74, 100, 126, 152].forEach(function (y) { s += '<path d="M72 ' + (y + 12) + 'L128 ' + (y - 2) + 'L128 ' + (y + 10) + 'L72 ' + (y + 24) + 'Z" fill="' + c.stripe + '"/>'; });
        return ground(100, 42) + '<rect x="70" y="58" width="60" height="128" rx="8" fill="' + c.wax + '"/>' + s +
          shade('M112 60H122Q128 60 128 66V178Q128 184 122 184H112Z') +
          '<rect x="70" y="58" width="60" height="128" rx="8" fill="none" ' + st() + '/>' +
          line('M76 66Q100 74 124 66', 3, INK, '.35') + line('M100 60V44', 4);
      }
      if (v === 1) return '<circle cx="106" cy="108" r="58" fill="' + INK + '" opacity=".15"/>' +
        '<circle cx="100" cy="102" r="58" fill="' + c.stripe + '" ' + st() + '/>' +
        '<circle cx="100" cy="102" r="44" fill="' + c.wax + '" ' + st(3) + '/>' +
        '<circle cx="100" cy="102" r="26" fill="none" stroke="' + INK + '" stroke-width="3" opacity=".25"/>' +
        '<circle cx="100" cy="102" r="5" fill="' + INK + '"/>';
      if (v === 2) return '<circle cx="100" cy="34" r="30" fill="' + BUTTER + '" opacity=".5"/>' + body() +
        '<path d="M70 70Q66 84 72 92Q78 84 76 70Z" fill="' + c.wax + '" ' + st(3) + '/>' +
        '<path d="M100 8C114 24 114 40 100 45C86 40 86 24 100 8Z" fill="' + BUTTER + '" ' + st(3) + '/>' +
        '<path d="M100 24C106 32 106 40 100 42C94 40 94 32 100 24Z" fill="' + CHERRY + '"/>';
      return body();
    },
    dog: function (v, c) {
      function side() {
        return ground(96, 76) + tube('M36 132Q18 112 26 94', 5, c.glaze) +
          [44, 64, 116, 136].map(function (x) { return '<rect x="' + x + '" y="148" width="16" height="38" rx="7" fill="' + c.glaze + '" ' + st() + '/>'; }).join('') +
          '<rect x="30" y="110" width="126" height="52" rx="26" fill="' + c.glaze + '" ' + st() + '/>' +
          shade('M44 146H142Q150 146 146 154Q140 159 130 159H56Q46 159 42 153Q40 146 44 146Z') +
          '<circle cx="62" cy="128" r="8" fill="' + c.ear + '" opacity=".35"/><circle cx="116" cy="140" r="6" fill="' + c.ear + '" opacity=".35"/>' +
          '<circle cx="154" cy="100" r="26" fill="' + c.glaze + '" ' + st() + '/>' +
          '<rect x="160" y="100" width="32" height="22" rx="11" fill="' + c.glaze + '" ' + st() + '/>' +
          '<circle cx="190" cy="106" r="5" fill="' + INK + '"/>' +
          '<path d="M140 84Q124 96 132 126Q146 130 150 106Z" fill="' + c.ear + '" ' + st() + '/>' +
          '<circle cx="164" cy="94" r="3.8" fill="' + INK + '"/>' +
          '<ellipse cx="88" cy="111" rx="7" ry="3" fill="' + INK + '"/>';
      }
      if (v === 1) return g(
        '<ellipse cx="100" cy="104" rx="70" ry="30" fill="' + INK + '" opacity=".15" transform="translate(6 6)"/>' +
        tube('M34 104Q14 100 12 82', 5, c.glaze) +
        [[56, 74], [56, 134], [128, 74], [128, 134]].map(function (p) { return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="10" ry="8" fill="' + c.glaze + '" ' + st(3) + '/>'; }).join('') +
        '<rect x="30" y="80" width="124" height="48" rx="24" fill="' + c.glaze + '" ' + st() + '/>' +
        '<ellipse cx="148" cy="78" rx="10" ry="18" fill="' + c.ear + '" ' + st(3) + '/><ellipse cx="148" cy="130" rx="10" ry="18" fill="' + c.ear + '" ' + st(3) + '/>' +
        '<circle cx="158" cy="104" r="22" fill="' + c.glaze + '" ' + st() + '/>' +
        '<rect x="170" y="94" width="24" height="20" rx="10" fill="' + c.glaze + '" ' + st(3) + '/><circle cx="192" cy="104" r="4" fill="' + INK + '"/>' +
        '<circle cx="90" cy="104" r="5" fill="' + INK + '"/>', 'translate(-4 0)');
      if (v === 2) return side() + line('M88 110L62 26', 4, TEA) + '<circle cx="62" cy="26" r="4" fill="' + CHERRY + '"/>' +
        line('M60 18C48 8 70 2 58 -8', 3.5, INK, '.35') + line('M66 20C80 12 70 4 82 -4', 3, INK, '.25');
      return side();
    },
    mirror: function (v, c) {
      function front(dy) {
        return '<path d="' + wavy(100, 102 + dy, 62, 78, 6, 9) + '" fill="' + c.frame + '" ' + st() + '/>' +
          '<path d="' + wavy(100, 102 + dy, 45, 61, 4, 9) + '" fill="' + GLASS + '" ' + st(3) + '/>';
      }
      var glint = line('M72 86L96 62', 6, '#fff', '.9') + line('M80 104L112 72', 4, '#fff', '.7');
      if (v === 1) return ground(100, 26) + '<rect x="86" y="20" width="26" height="166" rx="12" fill="' + c.frame + '" ' + st() + '/>' +
        shade('M100 24H106Q108 24 108 30V176Q108 182 102 182H100Z') + '<rect x="84" y="176" width="44" height="10" rx="4" fill="' + INK + '"/>';
      if (v === 2) return line('M58 40L100 6L142 40', 3) + '<circle cx="100" cy="6" r="4" fill="' + INK + '"/>' + front(4) +
        '<path d="M86 140H114L110 160H90Z" fill="' + CHERRY + '" ' + st(3) + '/>' +
        line('M100 140Q96 110 82 96', 4, LEAF) + line('M100 140Q106 108 122 100', 4, LEAF) + line('M100 140V92', 4, LEAF) +
        '<ellipse cx="82" cy="96" rx="10" ry="6" fill="' + LEAF + '" transform="rotate(-30 82 96)"/><ellipse cx="122" cy="100" rx="10" ry="6" fill="' + LEAF + '" transform="rotate(30 122 100)"/><ellipse cx="100" cy="88" rx="6" ry="10" fill="' + LEAF + '"/>' +
        line('M66 70L80 56', 5, '#fff', '.9');
      return ground(100, 56) + front(0) + glint;
    },
    tomato: function (v, c) {
      var calyx = function (cx, cy, s) {
        return '<path d="M' + cx + ' ' + cy + 'l' + (-24 * s) + ' ' + (-12 * s) + 'l' + (18 * s) + ' ' + (2 * s) + 'l' + (-6 * s) + ' ' + (-20 * s) + 'l' + (14 * s) + ' ' + (16 * s) +
          'l' + (14 * s) + ' ' + (-16 * s) + 'l' + (-4 * s) + ' ' + (20 * s) + 'l' + (22 * s) + ' ' + (-2 * s) + 'l' + (-22 * s) + ' ' + (14 * s) + 'Z" fill="' + LEAF + '" ' + st(3) + '/>';
      };
      function front() {
        return ground(100, 60) + '<ellipse cx="100" cy="140" rx="62" ry="46" fill="' + c.skin + '" ' + st() + '/>' +
          line('M100 96Q72 134 88 184', 3, INK, '.3') + line('M100 96Q130 134 114 184', 3, INK, '.3') + line('M70 104Q44 140 62 176', 3, INK, '.3') + line('M130 104Q156 140 138 176', 3, INK, '.3') +
          shade('M140 108Q170 142 140 178Q152 142 140 108Z') + line('M58 132Q60 116 74 108', 5, CREAM, '.7') +
          tube('M100 92Q100 76 110 68', 4, LEAF) + calyx(100, 98, 1);
      }
      if (v === 1) {
        var seg = '';
        for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; seg += line('M100 102L' + (100 + 56 * Math.cos(a)).toFixed(1) + ' ' + (102 + 56 * Math.sin(a)).toFixed(1), 3, INK, '.25'); }
        return '<circle cx="106" cy="108" r="64" fill="' + INK + '" opacity=".15"/><circle cx="100" cy="102" r="64" fill="' + c.skin + '" ' + st() + '/>' + seg +
          calyx(100, 112, 1.6) + '<circle cx="100" cy="100" r="6" fill="' + LEAF + '" ' + st(3) + '/>';
      }
      if (v === 2) {
        var pins = [[70, 124, 50, 94, COBALT], [124, 120, 146, 90, BUTTER], [92, 140, 78, 110, CREAM], [140, 146, 170, 126, MINT], [58, 150, 30, 136, BUTTER], [112, 140, 118, 110, COBALT]];
        return front() + pins.map(function (p) { return line('M' + p[0] + ' ' + p[1] + 'L' + p[2] + ' ' + p[3], 2.5, '#6b6b78') + '<circle cx="' + p[2] + '" cy="' + p[3] + '" r="6" fill="' + p[4] + '" ' + st(2.5) + '/>'; }).join('');
      }
      return front();
    },
    marbles: function (v, c) {
      var cols = [COBALT, CHERRY, BUTTER, MINT, CREAM, CHERRY, MINT, COBALT, BUTTER, CREAM, COBALT, CHERRY];
      function marble(x, y, r, i) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + cols[i % cols.length] + '" ' + st(2.5) + '/><circle cx="' + (x - r * .35) + '" cy="' + (y - r * .35) + '" r="' + (r * .28) + '" fill="#fff" opacity=".8"/>'; }
      function jar(dx, lid) {
        var pos = [[66, 170], [92, 172], [118, 170], [134, 150], [80, 150], [106, 150], [64, 128], [92, 130], [120, 128], [78, 108], [106, 106], [132, 108]];
        return g('<rect x="50" y="70" width="100" height="116" rx="18" fill="' + GLASS + '" opacity=".55"/>' +
          pos.map(function (p, i) { return marble(p[0], p[1], 12, i); }).join('') +
          '<rect x="50" y="70" width="100" height="116" rx="18" fill="none" ' + st() + '/>' + line('M62 92V160', 6, '#fff', '.75') +
          '<rect x="60" y="60" width="80" height="14" rx="4" fill="' + GLASS + '" ' + st(3) + '/>' +
          (lid ? '<rect x="54" y="38" width="92" height="26" rx="6" fill="' + c.lid + '" ' + st() + '/>' + [66, 78, 90, 102, 114, 126, 138].map(function (x) { return line('M' + x + ' 44V58', 2, INK, '.3'); }).join('') : ''), 'translate(' + dx + ' 0)');
      }
      if (v === 1) return '<circle cx="106" cy="108" r="62" fill="' + INK + '" opacity=".15"/><circle cx="100" cy="102" r="62" fill="' + c.lid + '" ' + st() + '/>' +
        '<circle cx="100" cy="102" r="54" fill="none" stroke="' + INK + '" stroke-width="3" stroke-dasharray="3 7" opacity=".35"/>' +
        '<circle cx="100" cy="102" r="40" fill="none" stroke="' + INK + '" stroke-width="3" opacity=".3"/>' + line('M70 80Q84 64 104 62', 5, '#fff', '.5');
      if (v === 2) return ground(96, 70) + jar(-18, false) +
        '<rect x="134" y="162" width="62" height="24" rx="6" fill="' + c.lid + '" ' + st() + '/>' + [146, 158, 170, 182].map(function (x) { return line('M' + x + ' 167V181', 2, INK, '.3'); }).join('') +
        marble(62, 180, 9, 0) + marble(112, 182, 8, 1) + marble(166, 148, 9, 2);
      return ground(100, 56) + jar(0, true);
    },
    coasters: function (v, c) {
      function checker(ox, oy, e, n) {
        var s = '', sz = e / n;
        for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) s += '<rect x="' + (ox + i * sz) + '" y="' + (oy + j * sz) + '" width="' + sz + '" height="' + sz + '" fill="' + ((i + j) % 2 ? c.b : c.a) + '"/>';
        return s + '<rect x="' + ox + '" y="' + oy + '" width="' + e + '" height="' + e + '" rx="3" fill="none" ' + st() + '/>';
      }
      function slab(dy, top) {
        var y = function (n) { return n + dy; };
        return '<path d="M40 ' + y(132) + 'L100 ' + y(150) + 'L100 ' + y(158) + 'L40 ' + y(140) + 'Z" fill="' + c.a + '" ' + st(3) + '/>' +
          '<path d="M100 ' + y(150) + 'L160 ' + y(132) + 'L160 ' + y(140) + 'L100 ' + y(158) + 'Z" fill="' + c.a + '" ' + st(3) + '/>' + shade('M100 ' + y(150) + 'L160 ' + y(132) + 'L160 ' + y(140) + 'L100 ' + y(158) + 'Z', '.25') +
          (top ? '<g transform="matrix(15 -4.5 15 4.5 40 ' + y(132) + ')">' + [0, 1, 2, 3].map(function (i) { return [0, 1, 2, 3].map(function (j) { return '<rect x="' + i + '" y="' + j + '" width="1.02" height="1.02" fill="' + ((i + j) % 2 ? c.b : c.a) + '"/>'; }).join(''); }).join('') + '</g>' : '') +
          '<path d="M40 ' + y(132) + 'L100 ' + y(114) + 'L160 ' + y(132) + 'L100 ' + y(150) + 'Z" fill="' + (top ? 'none' : c.b) + '" ' + st(3) + '/>';
      }
      if (v === 1) return '<rect x="34" y="34" width="140" height="140" rx="6" fill="' + INK + '" opacity=".15"/>' +
        checker(24, 24, 70, 4) + checker(106, 24, 70, 4) + checker(24, 106, 70, 4) + checker(106, 106, 70, 4);
      if (v === 2) return ground(100, 66) + g(slab(0, true), 'translate(-40 -60) scale(1.4)') +
        g(ART.mug(0, { body: COBALT === c.a ? CHERRY : COBALT }), 'translate(38 -8) scale(.62)');
      return ground(100, 62) + slab(27, false) + slab(18, false) + slab(9, false) + slab(0, true);
    },
    notebook: function (v, c) {
      function spread(dy) {
        return g('<path d="M10 66Q56 54 100 70Q144 54 190 66V166Q144 156 100 172Q56 156 10 166Z" fill="' + c.cover + '" ' + st() + '/>' +
          '<path d="M18 62Q58 52 100 64V160Q58 148 18 158Z" fill="' + CREAM + '" ' + st(3) + '/>' +
          '<path d="M182 62Q142 52 100 64V160Q142 148 182 158Z" fill="' + CREAM + '" ' + st(3) + '/>' +
          dots(32, 88, 80, 144, 12, 1.6, INK, '.3') + dots(112, 170, 80, 144, 12, 1.6, INK, '.3') + shade('M100 64Q92 62 90 64V158Q96 158 100 160Z', '.12'), 'translate(0 ' + dy + ')');
      }
      if (v === 1) return '<ellipse cx="100" cy="176" rx="90" ry="8" fill="' + INK + '" opacity=".15"/>' + spread(0);
      if (v === 2) return '<ellipse cx="100" cy="176" rx="90" ry="8" fill="' + INK + '" opacity=".15"/>' + spread(0) +
        '<path d="M50 96l5 10 11 1-8 7 3 11-11-6-10 6 3-11-8-7 11-1z" fill="' + BUTTER + '" ' + st(2.5) + '/>' +
        line('M34 136Q46 124 56 136T78 136', 3, CHERRY) + line('M116 90H164M116 106H156M116 122H166', 3, COBALT, '.7') +
        '<g transform="rotate(-38 150 136)"><rect x="104" y="128" width="88" height="14" rx="3" fill="' + BUTTER + '" ' + st(3) + '/><rect x="180" y="128" width="14" height="14" rx="3" fill="' + CHERRY + '" ' + st(3) + '/><path d="M104 128L88 135L104 142Z" fill="' + CREAM + '" ' + st(3) + '/></g>';
      return ground(100, 50) + '<rect x="56" y="40" width="88" height="146" rx="6" fill="' + c.cover + '" ' + st() + '/>' +
        dots(84, 124, 108, 168, 12, 2, CREAM, '.35') + shade('M60 44H72V182H60Z', '.18') +
        '<rect x="78" y="62" width="50" height="28" rx="3" fill="' + CREAM + '" ' + st(3) + '/>' + line('M86 72H120M86 80H108', 2.5, INK, '.5') +
        line('M132 40V186', 5) + '<path d="M112 186V200L118 194L124 200V186" fill="' + CHERRY + '" ' + st(2.5) + '/>';
    },
    vase: function (v, c) {
      var hob = [[82, 116], [100, 110], [118, 116], [74, 138], [92, 134], [110, 134], [128, 138], [80, 160], [100, 158], [120, 160], [92, 176], [110, 176]];
      function front() {
        return ground(100, 38) + '<path d="M90 56H110V92Q140 104 138 140Q136 176 118 186H82Q64 176 62 140Q60 104 90 92Z" fill="' + c.glaze + '" ' + st() + '/>' +
          hob.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="' + CREAM + '" opacity=".55" stroke="' + INK + '" stroke-width="1.5" stroke-opacity=".35"/>'; }).join('') +
          shade('M118 100Q138 112 136 140Q134 174 118 184Q128 150 118 100Z') +
          '<rect x="84" y="50" width="32" height="10" rx="5" fill="' + c.glaze + '" ' + st(3) + '/>';
      }
      if (v === 1) {
        var ring = '';
        for (var i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2; ring += '<circle cx="' + (100 + 30 * Math.cos(a)).toFixed(1) + '" cy="' + (102 + 30 * Math.sin(a)).toFixed(1) + '" r="5" fill="' + CREAM + '" opacity=".6"/>'; }
        return '<circle cx="106" cy="108" r="46" fill="' + INK + '" opacity=".15"/><circle cx="100" cy="102" r="46" fill="' + c.glaze + '" ' + st() + '/>' + ring +
          '<circle cx="100" cy="102" r="16" fill="' + c.glaze + '" ' + st(3) + '/><circle cx="100" cy="102" r="9" fill="' + INK + '"/>';
      }
      if (v === 2) return line('M100 54Q96 30 104 18', 4, LEAF) + '<path d="M100 60Q80 40 84 26Q96 34 100 52Z" fill="' + LEAF + '" ' + st(2.5) + '/>' + front() +
        '<path d="M92 20Q90 0 98 -2L104 6L110 -2Q118 0 116 20Q104 30 92 20Z" fill="' + CHERRY + '" ' + st(3) + '/>';
      return front();
    },
    cards: function (v, c) {
      function card(x, y, w, h, pip, rot, cx, cy) {
        var t = rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : '';
        return '<g' + t + '><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + CREAM + '" ' + st(3) + '/>' +
          (pip === 'h' ? heart(x + w / 2, y + h / 2, w * .2, CHERRY) + heart(x + 9, y + 12, 4, CHERRY) : diamond(x + w / 2, y + h / 2, w * .26, INK) + diamond(x + 9, y + 12, 5, INK)) + '</g>';
      }
      if (v === 1) {
        var s = '<ellipse cx="100" cy="184" rx="70" ry="7" fill="' + INK + '" opacity=".15"/>';
        [-44, -22, 0, 22, 44].forEach(function (a, i) { s += card(70, 60, 60, 90, i % 2 ? 'd' : 'h', a, 100, 176); });
        return s;
      }
      if (v === 2) {
        var leg = function (x0, y0, x1, y1) { return tube('M' + x0 + ' ' + y0 + 'L' + x1 + ' ' + y1, 5, c.back); };
        return ground(100, 80) + leg(34, 186, 58, 128) + leg(82, 186, 58, 128) + leg(118, 186, 142, 128) + leg(166, 186, 142, 128) +
          tube('M52 124H148', 5, c.back) + leg(76, 120, 100, 62) + leg(124, 120, 100, 62) +
          card(150, 164, 38, 26, 'h', 0);
      }
      return ground(96, 70) + card(24, 104, 52, 78, 'd', -16, 50, 182) +
        '<rect x="70" y="66" width="70" height="120" rx="6" fill="' + c.back + '" ' + st() + '/>' + line('M70 80Q105 62 140 80', 3) +
        '<rect x="80" y="92" width="50" height="84" rx="4" fill="' + CREAM + '" ' + st(3) + '/>' + heart(105, 134, 12, CHERRY) +
        shade('M126 70H136V182H126Z', '.15');
    },
    opener: function (v, c) {
      var fish = 'M24 110Q64 58 136 92L176 68Q166 110 176 152L136 128Q64 162 24 110Z M40 110a16 12 0 1 0 32 0a16 12 0 1 0 -32 0Z';
      function face(extra) {
        return '<path d="' + fish + '" fill="' + c.metal + '" fill-rule="evenodd" ' + st() + '/>' +
          shade('M44 124Q90 150 136 128L176 152Q166 138 168 128L136 118Q92 140 60 124Z', '.14') + extra;
      }
      var scales = line('M92 92Q100 110 92 128', 3, INK, '.3') + line('M108 94Q116 110 108 126', 3, INK, '.3') + line('M124 96Q130 110 124 122', 3, INK, '.3') + '<circle cx="84" cy="100" r="3.5" fill="' + INK + '"/>';
      if (v === 1) return ground(100, 70) + g(face(line('M112 102l5 10 11 1-8 7 3 11-11-6-10 6 3-11-8-7 11-1z', 2.5, INK, '.45')), 'translate(200 40) scale(-1 1)');
      if (v === 2) return ground(100, 40) + '<path d="M84 186V122Q84 102 92 92V44H108V92Q116 102 116 122V186Z" fill="' + MINT + '" ' + st() + '/>' + line('M92 120V170', 5, '#fff', '.6') +
        '<g transform="rotate(-24 100 30)"><rect x="86" y="24" width="28" height="12" rx="3" fill="' + CHERRY + '" ' + st(3) + '/></g>' +
        line('M70 22L60 14M130 20L142 12M100 10V0', 3, INK, '.5') +
        g(face(scales), 'translate(100 32) rotate(24) scale(.6) translate(-56 -110)');
      return ground(100, 74) + g(face(scales), 'translate(0 44)');
    },
    socks: function (v, c) {
      var sockPath = 'M60 40H104V132Q104 144 116 146H150Q172 146 172 166Q172 186 150 186H86Q60 186 60 160Z';
      function sock(tint) {
        return '<path d="' + sockPath + '" fill="' + c.base + '"/>' +
          [60, 82, 104].map(function (y) { return '<rect x="60" y="' + y + '" width="44" height="11" fill="' + c.stripe + '"/>'; }).join('') +
          '<path d="M60 150Q60 186 92 186H100Q74 176 74 150Z" fill="' + c.heel + '"/>' +
          '<path d="M150 146Q172 146 172 166Q172 186 150 186Q160 166 150 146Z" fill="' + c.heel + '"/>' +
          (tint ? shade(sockPath, '.07') : '') +
          '<path d="' + sockPath + '" fill="none" ' + st() + '/>' + '<rect x="56" y="34" width="52" height="16" rx="5" fill="' + c.stripe + '" ' + st() + '/>';
      }
      if (v === 1) return ground(100, 64) + '<rect x="36" y="112" width="128" height="74" rx="14" fill="' + c.base + '" ' + st() + '/>' +
        [124, 150, 172].map(function (y) { return '<rect x="38" y="' + y + '" width="124" height="8" fill="' + c.stripe + '"/>'; }).join('') +
        '<rect x="36" y="112" width="128" height="74" rx="14" fill="none" ' + st() + '/>' +
        '<rect x="84" y="104" width="32" height="90" rx="3" fill="' + BUTTER + '" ' + st(3) + '/>' + '<circle cx="100" cy="149" r="7" fill="' + CHERRY + '"/>';
      if (v === 2) return line('M0 30Q100 52 200 30', 3) +
        g(sock(true), 'translate(-12 12) scale(.72)') + g(sock(false), 'translate(76 16) scale(.72)') +
        '<rect x="30" y="26" width="10" height="26" rx="3" fill="' + BUTTER + '" ' + st(2.5) + '/><rect x="118" y="30" width="10" height="26" rx="3" fill="' + BUTTER + '" ' + st(2.5) + '/>';
      return ground(96, 72) + g(sock(true), 'translate(-26 -4)') + g(sock(false), 'translate(8 0)');
    }
  };

  function art(product, view, colorKey) {
    var col = product.colors.filter(function (x) { return x.key === colorKey; })[0] || product.colors[0];
    return '<svg class="obj-svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false" overflow="visible">' + ART[product.art](view || 0, col.c) + '</svg>';
  }

  /* ---------- pure pricing (all cents) ---------- */
  function byId(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function inMood(p, mood) { return mood === 'all' ? true : mood === 'gifts' ? p.price < 3000 : p.moods.indexOf(mood) > -1; }
  function packBy(key) { return PACKAGING.filter(function (p) { return p.key === key; })[0] || PACKAGING[0]; }

  function giftPricing(items, packKey) {
    var lines = items.map(function (it) { var p = byId(it.id); return { id: it.id, color: it.color, name: p.name, price: p.price }; });
    var itemsCents = lines.reduce(function (s, l) { return s + l.price; }, 0);
    var savingsCents = lines.length >= GIFT.savingsAt ? Math.round(itemsCents * GIFT.savingsRate) : 0;
    var pack = packBy(packKey);
    return { lines: lines, itemsCents: itemsCents, savingsCents: savingsCents, pack: pack, packCents: pack.price, totalCents: itemsCents - savingsCents + pack.price };
  }

  function lineUnit(line) {
    if (line.type === 'set') return giftPricing(line.items, line.pack).totalCents;
    return byId(line.id).price;
  }

  function bagTotals(lines) {
    var subtotal = 0, count = 0;
    lines.forEach(function (l) { subtotal += lineUnit(l) * l.qty; count += l.qty; });
    var shipping = subtotal === 0 || subtotal >= SHIPPING.freeFrom ? 0 : SHIPPING.flat;
    return { subtotal: subtotal, shipping: shipping, total: subtotal + shipping, count: count };
  }

  function money(cents) { return '$' + (cents / 100).toFixed(2); }

  window.MY_DATA = {
    INK: INK, PRODUCTS: PRODUCTS, MOODS: MOODS, PACKAGING: PACKAGING, GIFT: GIFT, SHIPPING: SHIPPING,
    art: art, byId: byId, inMood: inMood, packBy: packBy, giftPricing: giftPricing, lineUnit: lineUnit, bagTotals: bagTotals, money: money
  };
})();
