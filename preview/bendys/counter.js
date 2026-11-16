/* The counter, from above: a sheet pan of cookies, a dipping case of ice cream,
   and the ice cream sandwich you get from one of each. Drawn in ink like the logo. */
(function () {
  'use strict';

  var COOKIES = [
    { id: 'chocolate-chip', name: 'Chocolate Chip', gfDough: true },
    { id: 'snickerdoodle', name: 'Snickerdoodle', gfDough: true },
    { id: 'double-chocolate', name: 'Double Chocolate' },
    { id: 'pretzel-toffee', name: 'Pretzel Toffee' },
    { id: 'sprinkle', name: 'Sprinkle' },
    { id: 'peanut-butter', name: 'Peanut Butter' },
    { id: 'oatmeal', name: 'Oatmeal' }
  ];
  var SCOOPS = [
    { id: 'sweet-cream', name: 'Sweet Cream', gf: true },
    { id: 'chocolate', name: 'Chocolate', gf: true },
    { id: 'cookies-and-cream', name: 'Cookies & Cream' },
    { id: 'cookie-butter', name: 'Cookie Butter' },
    { id: 'ooey-gooey-cake', name: 'Ooey Gooey Cake' },
    { id: 'coffee', name: 'Coffee', gf: true },
    { id: 'strawberry-buttermilk', name: 'Strawberry Buttermilk', gf: true },
    { id: 'mint-chocolate-chip', name: 'Mint Chocolate Chip', gf: true }
  ];

  var CK = {
    'chocolate-chip': { base: '#DCA866', edge: '#B97E3F', hi: '#EEC991', bits: 'chips', bit: '#3A2314' },
    'snickerdoodle': { base: '#EFD6A9', edge: '#CFA56E', hi: '#F9EACB', bits: 'crackle', bit: '#A86F3A' },
    'double-chocolate': { base: '#5E3722', edge: '#3E2213', hi: '#7D4D31', bits: 'chips', bit: '#1F1007' },
    'pretzel-toffee': { base: '#D8A867', edge: '#B4803F', hi: '#EBC690', bits: 'pretzel', bit: '#7A461B', bit2: '#EDB54A' },
    'sprinkle': { base: '#F3DEB9', edge: '#D5B37F', hi: '#FBF0DA', bits: 'sprinkles' },
    'peanut-butter': { base: '#D59D59', edge: '#AF7738', hi: '#E8BD83', bits: 'fork', bit: '#9C6830' },
    'oatmeal': { base: '#CC9D67', edge: '#A77944', hi: '#DFBB8B', bits: 'oats', bit: '#EED9B0' }
  };
  var IC = {
    'sweet-cream': { base: '#FBF4E1', ridge: '#E2D1A9', hi: '#FFFEF8' },
    'chocolate': { base: '#704329', ridge: '#4B2A17', hi: '#93603F' },
    'cookies-and-cream': { base: '#F7F4ED', ridge: '#D8D1C3', hi: '#FFFFFF', bits: 'crumbs', bit: '#1A1613' },
    'cookie-butter': { base: '#DDA96F', ridge: '#BB8446', hi: '#EEC897', bits: 'swirl', bit: '#A3652B' },
    'ooey-gooey-cake': { base: '#F8E9BE', ridge: '#E0CA8C', hi: '#FFF7DC', bits: 'chunks', bit: '#E2B65C', bit2: '#B98526' },
    'coffee': { base: '#C59B77', ridge: '#A37956', hi: '#DBBB9B', bits: 'specks', bit: '#6A4630' },
    'strawberry-buttermilk': { base: '#F8DEE2', ridge: '#E7B7BF', hi: '#FFF2F4', bits: 'berries', bit: '#CF3B56' },
    'mint-chocolate-chip': { base: '#E2F2E4', ridge: '#BBD9C1', hi: '#F5FBF6', bits: 'shards', bit: '#2A1A10' }
  };
  var SPRINKLES = ['#E5486A', '#2F9BDA', '#F3C22E', '#5DB867', '#9466CF', '#FFFFFF'];
  var INK = '#000';

  /* ---------- small helpers ---------- */
  function rng(seed) {
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h += 0x6D2B79F5; var t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function f(n) { return Math.round(n * 10) / 10; }
  function smooth(p) {
    var n = p.length, d = 'M' + f(p[0][0]) + ',' + f(p[0][1]);
    for (var i = 0; i < n; i++) {
      var p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
      d += 'C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ',' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
        f(p2[0] - (p3[0] - p1[0]) / 6) + ',' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f(p2[0]) + ',' + f(p2[1]);
    }
    return d + 'Z';
  }
  function blob(cx, cy, r, amp, n, R, sx) {
    var ph = [R() * 6.3, R() * 6.3, R() * 6.3], pts = [];
    sx = sx || 1;
    for (var i = 0; i < n; i++) {
      var t = i / n * Math.PI * 2;
      var k = 1 + amp * (Math.sin(3 * t + ph[0]) * 0.5 + Math.sin(5 * t + ph[1]) * 0.3 + Math.sin(2 * t + ph[2]) * 0.2) + amp * 0.5 * (R() - 0.5);
      pts.push([cx + r * k * Math.cos(t) * sx, cy + r * k * Math.sin(t)]);
    }
    return smooth(pts);
  }
  // scatter n points from sample(), keeping them apart
  function scatter(n, sample, gap, R) {
    var out = [], tries = 0;
    while (out.length < n && tries < n * 40) {
      tries++;
      var p = sample(R);
      var ok = true;
      for (var i = 0; i < out.length; i++) {
        var dx = out[i][0] - p[0], dy = out[i][1] - p[1];
        if (dx * dx + dy * dy < gap * gap) { ok = false; break; }
      }
      if (ok) out.push(p);
    }
    return out;
  }
  function inDisc(cx, cy, r) {
    return function (R) {
      var a = R() * Math.PI * 2, d = Math.sqrt(R()) * r;
      return [cx + Math.cos(a) * d, cy + Math.sin(a) * d];
    };
  }
  function path(d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function line(x1, y1, x2, y2, stroke, w, extra) {
    return '<path d="M' + f(x1) + ',' + f(y1) + 'L' + f(x2) + ',' + f(y2) + '" stroke="' + stroke + '" stroke-width="' + w + '" stroke-linecap="round" fill="none"' + (extra || '') + '/>';
  }
  var uid = 0;

  /* ---------- toppings shared by the cookie views ---------- */
  function cookieBits(c, pts, R, scale) {
    var s = '', k = scale || 1;
    pts.forEach(function (p, i) {
      var x = p[0], y = p[1], a = R() * Math.PI;
      switch (c.bits) {
        case 'chips':
          s += path(blob(x, y, (3.6 + R() * 2.2) * k, 0.4, 6, R), c.bit);
          break;
        case 'crackle':
          var l = (7 + R() * 7) * k;
          s += '<path d="M' + f(x - Math.cos(a) * l) + ',' + f(y - Math.sin(a) * l) + 'Q' + f(x + (R() - 0.5) * 6) + ',' + f(y + (R() - 0.5) * 6) + ' ' + f(x + Math.cos(a) * l) + ',' + f(y + Math.sin(a) * l) + '" stroke="' + c.bit + '" stroke-width="' + (1.6 * k) + '" fill="none" stroke-linecap="round" opacity=".75"/>';
          s += '<circle cx="' + f(x + 4) + '" cy="' + f(y - 3) + '" r="' + (1 * k) + '" fill="' + c.bit + '"/>';
          break;
        case 'pretzel':
          if (i % 2) {
            s += '<rect x="' + f(x - 5 * k) + '" y="' + f(y - 2.6 * k) + '" width="' + (10 * k) + '" height="' + (5.2 * k) + '" rx="' + (2.6 * k) + '" fill="' + c.bit + '" transform="rotate(' + f(a * 57) + ' ' + f(x) + ' ' + f(y) + ')"/>' +
              '<circle cx="' + f(x - 1.5) + '" cy="' + f(y) + '" r="' + (0.9 * k) + '" fill="#fff"/><circle cx="' + f(x + 2) + '" cy="' + f(y - 0.6) + '" r="' + (0.8 * k) + '" fill="#fff"/>';
          } else {
            s += '<rect x="' + f(x - 2.4 * k) + '" y="' + f(y - 2.4 * k) + '" width="' + (4.8 * k) + '" height="' + (4.8 * k) + '" rx="1" fill="' + c.bit2 + '" transform="rotate(' + f(a * 57) + ' ' + f(x) + ' ' + f(y) + ')"/>';
          }
          break;
        case 'sprinkles':
          var L = 3.2 * k;
          s += line(x - Math.cos(a) * L, y - Math.sin(a) * L, x + Math.cos(a) * L, y + Math.sin(a) * L, SPRINKLES[Math.floor(R() * SPRINKLES.length)], 2.6 * k);
          break;
        case 'oats':
          s += '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + (3.4 * k) + '" ry="' + (1.9 * k) + '" fill="' + c.bit + '" stroke="' + c.edge + '" stroke-width=".7" transform="rotate(' + f(a * 57) + ' ' + f(x) + ' ' + f(y) + ')"/>';
          break;
      }
    });
    return s;
  }

  /* ---------- cookie from above (viewBox 120) ---------- */
  function cookieTop(id) {
    var c = CK[id], R = rng('top' + id), cid = 'ck' + (uid++);
    var outer = blob(60, 60, 47, 0.06, 22, R);
    var s = '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">';
    s += '<defs><clipPath id="' + cid + '"><path d="' + outer + '"/></clipPath></defs>';
    s += path(outer, '#000', ' opacity=".14" transform="translate(2.5 3.5)"');
    s += path(outer, c.edge);
    s += '<g clip-path="url(#' + cid + ')">';
    s += path(blob(60, 60, 39, 0.09, 18, R), c.base);
    s += path(blob(52, 50, 20, 0.2, 10, R), c.hi, ' opacity=".55"');
    if (c.bits === 'fork') {
      var g = '';
      for (var i = -2; i <= 2; i++) {
        g += line(30, 60 + i * 9, 90, 60 + i * 9, c.bit, 2.3);
        g += line(60 + i * 9, 30, 60 + i * 9, 90, c.bit, 2.3);
      }
      s += '<g transform="rotate(20 60 60)" opacity=".7">' + g + '</g>';
      s += cookieBits({ bits: 'crackle', bit: c.bit }, scatter(3, inDisc(60, 60, 30), 14, R), R);
    } else {
      var n = { chips: 11, crackle: 9, pretzel: 10, sprinkles: 26, oats: 15 }[c.bits];
      var gap = { chips: 11, crackle: 12, pretzel: 11, sprinkles: 6, oats: 8 }[c.bits];
      s += cookieBits(c, scatter(n, inDisc(60, 60, 37), gap, R), R);
    }
    s += '</g>';
    s += path(outer, 'none', ' stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"');
    return s + '</svg>';
  }

  /* ---------- ice cream tub from above (viewBox 140) ---------- */
  function tubTop(id) {
    var c = IC[id], R = rng('tub' + id), cid = 'tb' + (uid++);
    var s = '<svg viewBox="0 0 140 140" aria-hidden="true" focusable="false">';
    s += '<defs><clipPath id="' + cid + '"><circle cx="70" cy="70" r="55"/></clipPath></defs>';
    s += '<circle cx="70" cy="70" r="67" fill="#C9CDD0"/>';
    s += '<circle cx="70" cy="70" r="63" fill="#7E8487"/>';
    s += '<circle cx="70" cy="70" r="61" fill="#F4F4F1" stroke="' + INK + '" stroke-width="2.4"/>';
    s += '<g clip-path="url(#' + cid + ')">';
    s += '<circle cx="70" cy="70" r="55" fill="' + c.base + '"/>';
    // tub wall shading
    s += '<circle cx="70" cy="72" r="55" fill="none" stroke="' + c.ridge + '" stroke-width="10" opacity=".55"/>';
    // scooped curls
    for (var i = 0; i < 3; i++) {
      var a = i * 2.1 + R() * 0.8, d = 14 + R() * 18, x = 70 + Math.cos(a) * d, y = 70 + Math.sin(a) * d;
      var w = 15 + R() * 10, rot = R() * 360;
      var curl = 'M' + f(x - w) + ',' + f(y) + 'Q' + f(x) + ',' + f(y - w * 0.85) + ' ' + f(x + w) + ',' + f(y);
      var tr = ' transform="rotate(' + f(rot) + ' ' + f(x) + ' ' + f(y) + ')"';
      s += '<path d="' + curl + '" stroke="' + c.ridge + '" stroke-width="7" fill="none" stroke-linecap="round"' + tr + '/>';
      s += '<path d="' + curl + '" stroke="' + c.hi + '" stroke-width="3" fill="none" stroke-linecap="round" transform="rotate(' + f(rot) + ' ' + f(x) + ' ' + f(y) + ') translate(0 -2.6)"/>';
    }
    s += icBits(c, inDisc(70, 70, 50), R, 1);
    s += '</g>';
    s += '<circle cx="70" cy="70" r="55" fill="none" stroke="' + INK + '" stroke-width="2"/>';
    return s + '</svg>';
  }

  function icBits(c, sample, R, k, count) {
    var s = '', pts, m = count || 1;
    switch (c.bits) {
      case 'crumbs':
        scatter(Math.round(30 * m), sample, 6, R).forEach(function (p) { s += path(blob(p[0], p[1], (1.6 + R() * 3.2) * k, 0.55, 5, R), c.bit); });
        break;
      case 'swirl':
        for (var i = 0; i < 2; i++) {
          var p0 = sample(R), r0 = 6 * k, d = 'M' + f(p0[0]) + ',' + f(p0[1]);
          for (var t = 0; t < 9; t++) { var a = t * 0.9 + i * 2; r0 += 2.6 * k; d += 'L' + f(p0[0] + Math.cos(a) * r0) + ',' + f(p0[1] + Math.sin(a) * r0 * 0.8); }
          s += '<path d="' + d + '" stroke="' + c.bit + '" stroke-width="' + (4.2 * k) + '" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>';
        }
        scatter(Math.round(8 * m), sample, 9, R).forEach(function (p) { s += path(blob(p[0], p[1], 2.2 * k, 0.5, 5, R), c.bit); });
        break;
      case 'chunks':
        scatter(Math.round(8 * m), sample, 13, R).forEach(function (p) {
          var w = (6 + R() * 3) * k;
          s += '<rect x="' + f(p[0] - w / 2) + '" y="' + f(p[1] - w / 2) + '" width="' + f(w) + '" height="' + f(w) + '" rx="2" fill="' + c.bit + '" stroke="' + c.bit2 + '" stroke-width="1.2" transform="rotate(' + f(R() * 90) + ' ' + f(p[0]) + ' ' + f(p[1]) + ')"/>';
        });
        break;
      case 'specks':
        scatter(Math.round(46 * m), sample, 4, R).forEach(function (p) { s += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="' + f((0.7 + R() * 0.7) * k) + '" fill="' + c.bit + '" opacity=".8"/>'; });
        break;
      case 'berries':
        scatter(Math.round(10 * m), sample, 11, R).forEach(function (p) { s += path(blob(p[0], p[1], (2.6 + R() * 1.8) * k, 0.45, 6, R), c.bit); });
        break;
      case 'shards':
        scatter(Math.round(16 * m), sample, 8, R).forEach(function (p) { s += path(blob(p[0], p[1], (2 + R() * 1.6) * k, 0.6, 5, R, 1.6), c.bit); });
        break;
    }
    return s;
  }

  /* ---------- the sandwich, side view (viewBox 320 x 230) ---------- */
  function stadium(x0, x1, y0, y1, amp, R, bulge) {
    var r = (y1 - y0) / 2, cy = (y0 + y1) / 2, pts = [], n = 10, i, a;
    bulge = bulge || 0;
    for (i = 0; i <= n; i++) pts.push([x0 + r + (x1 - x0 - 2 * r) * i / n, y0 + (R() - 0.5) * amp]);
    for (i = 1; i < 6; i++) { a = -Math.PI / 2 + i / 6 * Math.PI; pts.push([x1 - r + Math.cos(a) * (r + bulge), cy + Math.sin(a) * r]); }
    for (i = n; i >= 0; i--) pts.push([x0 + r + (x1 - x0 - 2 * r) * i / n, y1 + (R() - 0.5) * amp]);
    for (i = 1; i < 6; i++) { a = Math.PI / 2 + i / 6 * Math.PI; pts.push([x0 + r + Math.cos(a) * (r + bulge), cy + Math.sin(a) * r]); }
    return smooth(pts);
  }
  function dome(R) {
    var pts = [], i;
    for (i = 0; i <= 14; i++) {
      var t = i / 14, x = 42 + 236 * t, top = 108 - 50 * Math.sqrt(Math.max(0, 1 - Math.pow((x - 160) / 122, 2)));
      pts.push([x, top + (R() - 0.5) * 2.4]);
    }
    pts.push([284, 112]);
    for (i = 10; i >= 0; i--) pts.push([42 + 236 * i / 10, 118 + (R() - 0.5) * 2]);
    pts.push([36, 112]);
    return smooth(pts);
  }

  function sandwichParts(cookieId, scoopId) {
    var c = CK[cookieId], ic = IC[scoopId], R = rng('sw' + cookieId), Ri = rng('swi' + scoopId), id = 'sw' + (uid++);
    var bottom = stadium(44, 276, 160, 198, 2.2, R);
    var scoop = stadium(40, 280, 98, 168, 5, Ri, 12);
    var top = dome(R);
    var parts = {};

    var b = path(bottom, c.edge, ' stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"');
    b += '<clipPath id="' + id + 'b"><path d="' + bottom + '"/></clipPath><g clip-path="url(#' + id + 'b)">';
    b += '<rect x="40" y="160" width="240" height="12" fill="' + c.base + '" opacity=".8"/>';
    if (c.bits !== 'fork' && c.bits !== 'oats') {
      b += cookieBits(c, scatter(c.bits === 'sprinkles' ? 22 : 9, function (r) { return [56 + r() * 208, 168 + r() * 26]; }, c.bits === 'sprinkles' ? 9 : 22, R), R, 1.1);
    } else if (c.bits === 'oats') {
      b += cookieBits(c, scatter(10, function (r) { return [56 + r() * 208, 170 + r() * 22]; }, 18, R), R, 1.1);
    }
    b += '</g>';
    parts.bottom = b;

    var m = path(scoop, ic.base, ' stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"');
    m += '<clipPath id="' + id + 'm"><path d="' + scoop + '"/></clipPath><g clip-path="url(#' + id + 'm)">';
    m += '<path d="M30,150 Q100,140 160,150 T290,148" stroke="' + ic.ridge + '" stroke-width="9" fill="none" opacity=".6"/>';
    m += '<path d="M60,132 Q110,124 150,134" stroke="' + ic.hi + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    m += '<path d="M190,140 Q230,132 262,140" stroke="' + ic.hi + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    m += icBits(ic, function (r) { return [44 + r() * 232, 112 + r() * 54]; }, Ri, 1.25, 1.5);
    m += '</g>';
    parts.scoop = m;

    var t = path(top, c.edge, ' stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"');
    t += '<clipPath id="' + id + 't"><path d="' + top + '"/></clipPath><g clip-path="url(#' + id + 't)">';
    t += '<ellipse cx="160" cy="100" rx="118" ry="44" fill="' + c.base + '"/>';
    t += '<ellipse cx="138" cy="80" rx="60" ry="16" fill="' + c.hi + '" opacity=".6"/>';
    var inDome = function (r) {
      var x = 58 + r() * 204, top = 108 - 50 * Math.sqrt(Math.max(0, 1 - Math.pow((x - 160) / 122, 2)));
      return [x, top + 6 + r() * (106 - top - 8)];
    };
    if (c.bits === 'fork') {
      var g = '';
      for (var i = -5; i <= 5; i++) g += line(160 + i * 18 - 20, 60, 160 + i * 18 + 20, 116, c.bit, 2.4) + line(160 + i * 18 + 20, 60, 160 + i * 18 - 20, 116, c.bit, 2.4);
      t += '<g opacity=".55">' + g + '</g>';
    } else {
      var n = { chips: 10, crackle: 9, pretzel: 10, sprinkles: 30, oats: 16 }[c.bits];
      var gap = { chips: 22, crackle: 24, pretzel: 20, sprinkles: 10, oats: 14 }[c.bits];
      t += cookieBits(c, scatter(n, inDome, gap, R), R, 1.35);
    }
    t += '</g>';
    t += path(top, 'none', ' stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"');
    parts.top = t;
    return parts;
  }

  /* ---------- wire it up ---------- */
  function pickHTML(list, name, draw, isCookie) {
    return list.map(function (it) {
      var gf = !isCookie && it.gf;
      return '<li class="pick"' + (gf ? ' data-gf' : '') + '><input type="radio" name="' + name + '" id="' + name + '-' + it.id + '" value="' + it.id + '">' +
        '<label for="' + name + '-' + it.id + '">' + draw(it.id) + '<span><span class="nm">' + it.name + '</span>' + (gf ? ' <abbr class="gf" title="gluten-free">GF</abbr>' : '') + '</span></label></li>';
    }).join('');
  }

  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

  function init(root) {
    var tray = root.querySelector('[data-tray]'), cas = root.querySelector('[data-case]');
    var views = Array.prototype.slice.call(document.querySelectorAll('[data-sandwich]'));
    if (!tray || !cas) return;
    tray.innerHTML = pickHTML(COOKIES, 'cookie', cookieTop, true);
    cas.innerHTML = pickHTML(SCOOPS, 'scoop', tubTop, false);

    var q = new URLSearchParams(location.search);
    var state = {
      cookie: find(COOKIES, q.get('cookie')) ? q.get('cookie') : 'chocolate-chip',
      scoop: find(SCOOPS, q.get('scoop')) ? q.get('scoop') : 'cookies-and-cream'
    };
    root.querySelector('#cookie-' + state.cookie).checked = true;
    root.querySelector('#scoop-' + state.scoop).checked = true;

    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    function render(changed) {
      var ck = find(COOKIES, state.cookie), sc = find(SCOOPS, state.scoop);
      var name = ck.name + ' cookies with ' + sc.name + ' ice cream';
      var notes = [];
      if (sc.gf) notes.push(sc.name + ' ice cream is gluten-free.');
      if (ck.gfDough) notes.push(ck.name + ' also comes gluten-free as frozen cookie dough.');
      views.forEach(function (sw) {
        var svg = sw.querySelector('svg');
        var p = sandwichParts(state.cookie, state.scoop);
        svg.innerHTML = '<ellipse cx="160" cy="210" rx="128" ry="9" fill="#000" opacity=".12"/>' +
          '<g class="sw-b">' + p.bottom + '</g><g class="sw-m">' + p.scoop + '</g><g class="sw-t">' + p.top + '</g>';
        if (changed && !reduce) {
          (changed === 'cookie' ? ['.sw-b', '.sw-t'] : ['.sw-m', '.sw-t']).forEach(function (sel, i) {
            var g = svg.querySelector(sel);
            g.style.animationDelay = (i * 0.09) + 's';
            g.classList.add('sw-drop');
          });
        }
        sw.querySelector('[data-sw-name]').textContent = name;
        var noteEl = sw.querySelector('[data-sw-note]');
        if (noteEl) noteEl.textContent = notes.join(' ');
        svg.setAttribute('aria-label', 'Drawing of an ice cream sandwich: ' + name);
      });
    }

    root.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'cookie' || t.name === 'scoop') {
        state[t.name] = t.value;
        render(t.name);
        var u = new URL(location.href);
        u.searchParams.set('cookie', state.cookie); u.searchParams.set('scoop', state.scoop);
        history.replaceState(null, '', u);
      }
      if (t.matches('[data-gf-toggle]')) cas.closest('.case').classList.toggle('gf-only', t.checked);
    });
    render();
  }

  document.querySelectorAll('[data-counter]').forEach(init);
  window.BendysCounter = { cookieTop: cookieTop, tubTop: tubTop, COOKIES: COOKIES, SCOOPS: SCOOPS };
})();
