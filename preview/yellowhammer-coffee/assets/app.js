/* The Yellowhammer app concept: a working prototype inside the phone on app.html.
   Menu, prices and store hours come from data.js (the same data the website uses).
   Orders are practice orders: nothing leaves the page. */
(function () {
  'use strict';
  var YH = window.YH, root = document.getElementById('app');
  if (!root || !YH) return;

  var S = { tab: 'home', store: 'the-bank', cat: YH.menu[0].id, cart: [], sheet: null, last: null, placed: null };
  var money = function (n) { return '$' + n.toFixed(2); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var store = function () { return YH.byslug[S.store]; };
  var count = function () { return S.cart.reduce(function (n, l) { return n + l.qty; }, 0); };
  var subtotal = function (lines) { return lines.reduce(function (n, l) { return n + l.each * l.qty; }, 0); };
  var MARK = (document.querySelector('.hd__logo img') || {}).src || 'img/mark-black.png';

  var ICON = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5V20h-6v-5H9v5H3z"/></svg>',
    order: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M6 8h12l-1.4 12H7.4zM5 8l1-4h12l1 4M9 13h6"/></svg>',
    rewards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z"/></svg>',
    account: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4-6 8-6s7 1.5 8 6"/></svg>'
  };
  var TABS = [['home', 'Home'], ['order', 'Order'], ['rewards', 'Rewards'], ['account', 'Account']];

  function greeting() {
    var h = Math.floor(YH.now().m / 60);
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }
  function findEntry(name) {
    for (var i = 0; i < YH.menu.length; i++) for (var j = 0; j < YH.menu[i].entries.length; j++)
      if (YH.menu[i].entries[j].n === name && (YH.menu[i].id === 'fall')) return YH.menu[i].entries[j];
    return null;
  }

  // ------------------------------------------------ screens
  function storePill() {
    var l = store(), s = YH.status(l);
    return '<button class="a-store' + (s.open ? ' is-open' : '') + '" data-act="stores"><span><b>' + esc(l.name) + '</b><small>' + esc(s.text) + '</small></span><em>Change</em></button>';
  }
  function home() {
    var rail = YH.picks.map(function (p, i) {
      var short = p.choice.split(' (')[0].split(' w/')[0];
      return '<button class="a-fall" data-act="pick" data-i="' + i + '"><span>' + (p['new'] ? 'New this fall' : 'Fall menu') + '</span><b>' + esc(short) + '</b><i>' + money(p.p) + '</i></button>';
    }).join('');
    var again = S.last ? '<div class="a-sec"><h3 class="a-h">Order it again</h3><button class="a-card" data-act="again"><b>' +
      esc(S.last.lines.map(function (l) { return (l.qty > 1 ? l.qty + ' × ' : '') + l.name; }).join(', ')) + '</b><br><span class="a-muted">' +
      money(subtotal(S.last.lines)) + ' at ' + esc(YH.byslug[S.last.store].name) + '. Tap to add it to your order.</span></button></div>' : '';
    return '<div class="a-scr"><div class="a-top"><div class="a-top__row"><img src="' + MARK + '" alt="Yellowhammer Coffee"><span class="a-sample">Sample account</span></div>' +
      '<h2 class="a-hi d">' + greeting() + '</h2>' + storePill() + '</div>' +
      '<div class="a-pad"><button class="a-cta" data-act="tab" data-tab="order"><span>Start an order</span></button>' + again +
      '<div class="a-sec"><h3 class="a-h">On the fall menu <button data-act="cat" data-cat="fall">See all</button></h3><div class="a-rail">' + rail + '</div></div>' +
      '<div class="a-sec"><h3 class="a-h">Rewards <button data-act="tab" data-tab="rewards">Details</button></h3>' +
      '<button class="a-card" data-act="tab" data-tab="rewards"><b>128 points</b><div class="a-bar"><i style="width:64%"></i></div><span class="a-muted">Your points and rewards status, at a glance.</span></button></div>' +
      '</div></div>';
  }
  function sub(en) {
    if (en.groups) {
      var n = en.groups.reduce(function (t, g) { return t + (g.when === undefined || g.when === 0 ? g.choices.length : 0); }, 0);
      return n + ' ' + (en.groups[0].label === 'Drink' ? 'drinks' : en.groups[0].label === 'Tea' ? 'teas' : en.groups[0].label === 'Chips' ? 'kinds' : en.groups[0].key === 'bagel' ? 'bagels' : 'flavors');
    }
    if (en.rows) return en.rows.map(function (r) { return r[0]; }).join(', ');
    return en.sf ? 'Can be made sugar-free' : '';
  }
  function order() {
    var sec = YH.menu.filter(function (m) { return m.id === S.cat; })[0];
    var chips = YH.menu.map(function (m) { return '<button data-act="cat" data-cat="' + m.id + '" aria-pressed="' + (m.id === S.cat) + '">' + esc(m.title) + '</button>'; }).join('');
    var items = sec.entries.map(function (en, i) {
      var price = en.p !== undefined ? money(en.p) : 'from ' + money(Math.min.apply(null, en.rows.map(function (r) { return r[1]; })));
      var s = sub(en);
      return '<button class="a-item" data-act="item" data-i="' + i + '"><span><b>' + esc(en.n) + '</b>' + (s ? '<small>' + esc(s) + '</small>' : '') + '</span><em>' + price + '</em><u aria-hidden="true">+</u></button>';
    }).join('');
    var l = store();
    var bag = count() ? '<button class="a-bag" data-act="bag"><span>View order (' + count() + ')</span><span>' + money(subtotal(S.cart)) + '</span></button>' : '';
    return '<div class="a-scr" id="a-order"><div class="a-head"><h2 class="d">Order</h2><button class="a-pick" data-act="stores">Pickup at ' + esc(l.name) + '</button><div class="a-chips">' + chips + '</div></div>' +
      '<div class="a-pad" style="padding-top:6px">' + (sec.note ? '<p class="a-note">' + esc(sec.note) + '</p>' : '') + items + '</div></div>' + bag;
  }
  function rewards() {
    return '<div class="a-scr"><div class="a-head" style="padding-bottom:14px"><h2 class="d">Rewards</h2></div><div class="a-pad" style="text-align:center">' +
      '<span class="a-sample">Sample account</span><div class="a-ring" style="--pct:64%;margin-top:18px"><div><b>128</b><span>points</span></div></div>' +
      '<p style="font-weight:800">Every order adds to your points.</p><p class="a-muted" style="margin-top:6px">Your points and your rewards status, in one place.</p>' +
      '<div class="a-sec"><button class="a-cta" data-act="tab" data-tab="order"><span>Start an order</span></button></div></div></div>';
  }
  function account() {
    var rows = [['Account settings', 'Contact info', ''], ['Gift cards', 'Add and view gift cards', ''], ['Payment', 'Saved payment methods', ''], ['Past orders', 'View orders and receipts', 'past']];
    return '<div class="a-scr"><div class="a-head" style="padding-bottom:14px"><h2 class="d">Account</h2></div><div class="a-pad a-rows" style="padding-top:4px">' +
      rows.map(function (r) { return '<button data-act="' + (r[2] || 'soon') + '"><span><b>' + r[0] + '</b><small>' + r[1] + '</small></span><i aria-hidden="true">›</i></button>'; }).join('') +
      '<div class="a-sec"><h3 class="a-h">Your store</h3>' + storePill().replace('a-store', 'a-store a-store--acct') + '</div></div></div>';
  }
  function placed() {
    var p = S.placed, l = YH.byslug[p.store];
    return '<div class="a-ok"><h2 class="d">Order in</h2><p>Pickup at ' + esc(l.name) + ', ' + esc(l.street) + '.</p>' +
      '<div class="a-card">' + p.lines.map(function (x) { return '<div class="a-line" style="border:0;padding:5px 0"><span><b>' + (x.qty > 1 ? x.qty + ' × ' : '') + esc(x.name) + '</b>' + (x.detail ? '<small>' + esc(x.detail) + '</small>' : '') + '</span><em>' + money(x.each * x.qty) + '</em></div>'; }).join('') +
      '<div class="a-total"><span>Subtotal</span><span>' + money(subtotal(p.lines)) + '</span></div></div>' +
      '<p class="a-muted" style="color:#443C00">Practice order. Nothing was sent to the store and nothing was charged.</p>' +
      '<button class="a-cta" data-act="done"><span>Back to home</span></button></div>';
  }

  // ------------------------------------------------ sheets
  function itemPrice(sh) {
    var en = sh.en, p = en.rows ? en.rows[sh.row][1] : en.p;
    Object.keys(sh.pick).forEach(function (k) { if (sh.pick[k].add) p += sh.pick[k].add; });
    if (sh.foam) p += 1; if (sh.cream) p += 0.75;
    return p;
  }
  function visibleGroups(sh) { return (sh.en.groups || []).filter(function (g) { return g.when === undefined || g.when === sh.row; }); }
  function missing(sh) {
    var keys = {}, out = null;
    visibleGroups(sh).forEach(function (g) { if (!keys[g.key]) keys[g.key] = g.label; });
    Object.keys(keys).forEach(function (k) { if (!sh.pick[k] && !out) out = k === 'flavor' ? (sh.en.groups[0].label === 'Drink' ? 'a drink' : sh.en.groups[0].label === 'Tea' ? 'a tea' : sh.en.groups[0].label === 'Chips' ? 'your chips' : 'a flavor') : k === 'bagel' ? 'a bagel' : 'a spread'; });
    return out;
  }
  function canSF(sh) { return !!(sh.en.sf || Object.keys(sh.pick).some(function (k) { return sh.pick[k].sf; })); }
  function itemSheet() {
    var sh = S.sheet, en = sh.en, h = '';
    if (en.d) h += '<p class="a-muted" style="font-size:14.5px">' + esc(en.d) + '</p>';
    if (en.rows) h += '<div class="a-opt"><h3>Choose one</h3><div class="a-pills">' + en.rows.map(function (r, i) { return '<button data-act="row" data-i="' + i + '" aria-pressed="' + (sh.row === i) + '">' + esc(r[0]) + ' ' + money(r[1]) + '</button>'; }).join('') + '</div></div>';
    if (en.temp) h += '<div class="a-opt"><h3>How do you want it?</h3><div class="a-pills">' + en.temp.map(function (t, i) { return '<button data-act="temp" data-i="' + i + '" aria-pressed="' + (sh.temp === i) + '">' + esc(t) + '</button>'; }).join('') + '</div></div>';
    visibleGroups(sh).forEach(function (g) {
      var gi = en.groups.indexOf(g);
      h += '<div class="a-opt"><h3>' + esc(g.label) + '</h3><div class="a-pills">' + g.choices.map(function (c, i) {
        return '<button data-act="choice" data-g="' + gi + '" data-i="' + i + '" aria-pressed="' + (sh.pick[g.key] === c) + '">' + esc(c.n) + (c['new'] ? ' (new)' : '') + '</button>';
      }).join('') + '</div></div>';
    });
    var togs = '';
    if (canSF(sh)) togs += '<button class="a-tog" data-act="tog" data-k="sf" aria-pressed="' + sh.sf + '"><span>Make it sugar-free</span><i></i></button>';
    if (en.foam) togs += '<button class="a-tog" data-act="tog" data-k="foam" aria-pressed="' + sh.foam + '"><span>Add cold foam, $1.00</span><i></i></button>';
    if (en.cream) togs += '<button class="a-tog" data-act="tog" data-k="cream" aria-pressed="' + sh.cream + '"><span>Add Super Cream, $.75</span><i></i></button>';
    if (togs) h += '<div class="a-opt">' + togs + '</div>';
    h += '<div class="a-qty"><button data-act="qty" data-d="-1" aria-label="One fewer">−</button><span aria-live="polite">' + sh.qty + '</span><button data-act="qty" data-d="1" aria-label="One more">+</button></div>';
    var need = missing(sh);
    return sheet(en.n, h, '<button class="a-cta" data-act="add"' + (need ? ' disabled' : '') + '><span>' + (need ? 'Choose ' + need : 'Add to order, ' + money(itemPrice(sh) * sh.qty)) + '</span></button>');
  }
  function bagSheet() {
    var l = store(), s = YH.status(l);
    var lines = S.cart.map(function (x, i) {
      return '<div class="a-line"><span><b>' + (x.qty > 1 ? x.qty + ' × ' : '') + esc(x.name) + '</b>' + (x.detail ? '<small>' + esc(x.detail) + '</small>' : '') + '</span><em>' + money(x.each * x.qty) + '<button data-act="remove" data-i="' + i + '">Remove</button></em></div>';
    }).join('');
    var can = !!l.order;
    return sheet('Your order', lines + '<div class="a-total"><span>Subtotal</span><span>' + money(subtotal(S.cart)) + '</span></div><p class="a-muted">Tax is added at checkout.</p>' +
      '<div class="a-opt"><h3>Pickup at</h3>' + storePill() + (s.open ? '' : '<p class="a-muted" style="margin-top:8px">This store is closed right now. Your order will be ready when it opens.</p>') + '</div>',
      '<button class="a-cta" data-act="place"' + (can ? '' : ' disabled') + '><span>' + (can ? 'Place order, ' + money(subtotal(S.cart)) : 'Choose a store with ordering') + '</span></button>');
  }
  function storesSheet() {
    var rows = YH.locs.map(function (l) {
      var s = YH.status(l), can = !!l.order;
      return '<button class="a-storerow' + (s.open ? ' is-open' : '') + '" data-act="store" data-s="' + l.slug + '"' + (can ? '' : ' disabled') + '><span class="row__lamp" aria-hidden="true"></span><span><b>' + esc(l.name) + '</b><small>' + esc(l.street) + '</small><small>' + esc(can ? s.text : 'Order in store at this location') + '</small></span><em>' + (l.slug === S.store ? 'Selected' : '') + '</em></button>';
    }).join('');
    return sheet('Choose a store', rows, '');
  }
  function pastSheet() {
    var body = S.last ? S.last.lines.map(function (x) { return '<div class="a-line"><span><b>' + (x.qty > 1 ? x.qty + ' × ' : '') + esc(x.name) + '</b>' + (x.detail ? '<small>' + esc(x.detail) + '</small>' : '') + '</span><em>' + money(x.each * x.qty) + '</em></div>'; }).join('') +
      '<p class="a-muted" style="margin-top:10px">Practice order at ' + esc(YH.byslug[S.last.store].name) + '.</p>'
      : '<p style="font-weight:800;margin-top:6px">No orders yet.</p><p class="a-muted">Place a practice order and it shows up here, and on your home screen to order again.</p>';
    return sheet('Past orders', body, S.last ? '' : '<button class="a-cta" data-act="tab" data-tab="order"><span>Start an order</span></button>');
  }
  function sheet(title, body, foot) {
    var fresh = !S.sheet.seen; S.sheet.seen = true;
    return '<div class="a-dim" data-act="close"></div><div class="a-sheet' + (fresh ? ' a-sheet--in' : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><div class="a-sheet__top"><h2 class="d">' + esc(title) + '</h2><button class="a-x" data-act="close" aria-label="Close">×</button></div><div class="a-sheet__body">' + body + '</div>' + (foot ? '<div class="a-sheet__foot">' + foot + '</div>' : '') + '</div>';
  }

  // ------------------------------------------------ render
  var toastTimer;
  function toast(msg) {
    var t = root.querySelector('.a-toast');
    t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('on'); }, 2200);
  }
  function render(keep) {
    var scr = root.querySelector('.a-scr'), sb = root.querySelector('.a-sheet__body');
    var y = keep && scr ? scr.scrollTop : 0, sy = keep && sb ? sb.scrollTop : 0;
    var chips = root.querySelector('.a-chips'), cx = chips ? chips.scrollLeft : 0;
    var was = root.contains(document.activeElement) ? document.activeElement : null, sel = '';
    if (was) ['act', 'i', 'g', 'tab', 'cat', 'k', 'd', 's'].forEach(function (a) { var v = was.getAttribute('data-' + a); if (v !== null) sel += '[data-' + a + '="' + v + '"]'; });
    var h;
    if (S.placed) h = placed();
    else {
      h = { home: home, order: order, rewards: rewards, account: account }[S.tab]();
      h += '<nav class="a-tabs" aria-label="App sections">' + TABS.map(function (t) {
        return '<button data-act="tab" data-tab="' + t[0] + '" aria-current="' + (S.tab === t[0]) + '">' + ICON[t[0]] + '<span>' + t[1] + (t[0] === 'order' && count() ? ' (' + count() + ')' : '') + '</span></button>';
      }).join('') + '</nav>';
      if (S.sheet) h += { item: itemSheet, bag: bagSheet, stores: storesSheet, past: pastSheet }[S.sheet.type]();
    }
    root.innerHTML = h + '<div class="a-toast" role="status"></div>';
    scr = root.querySelector('.a-scr'); if (scr) scr.scrollTop = y;
    sb = root.querySelector('.a-sheet__body'); if (sb) sb.scrollTop = sy;
    chips = root.querySelector('.a-chips');
    var back = sel && root.querySelector((S.sheet ? '.a-sheet ' : '') + sel) || (S.sheet && was && root.querySelector('.a-x'));
    if (back) back.focus({ preventScroll: true });
    if (chips) { chips.scrollLeft = cx; var on = chips.querySelector('[aria-pressed=true]'); if (on && !keep) chips.scrollLeft = Math.max(0, on.offsetLeft - 20); }
  }
  function openItem(en, preset) {
    S.sheet = { type: 'item', en: en, row: 0, temp: en.temp ? 0 : null, pick: {}, sf: false, foam: false, cream: false, qty: 1 };
    if (preset) (en.groups || []).forEach(function (g) { g.choices.forEach(function (c) { if (c.n === preset) S.sheet.pick[g.key] = c; }); });
    if (en.groups) en.groups.forEach(function (g) { if (g.choices.length === 1) S.sheet.pick[g.key] = g.choices[0]; });
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-act'), sh = S.sheet, i = +b.getAttribute('data-i'), keep = true;
    if (act === 'tab') { S.tab = b.getAttribute('data-tab'); S.sheet = null; keep = false; }
    else if (act === 'cat') { S.cat = b.getAttribute('data-cat'); keep = S.tab === 'order'; S.tab = 'order'; if (keep) { render(true); root.querySelector('.a-scr').scrollTop = 0; return; } }
    else if (act === 'stores') S.sheet = { type: 'stores', back: sh && sh.type === 'bag' ? 'bag' : null };
    else if (act === 'store') { S.store = b.getAttribute('data-s'); S.sheet = sh.back ? { type: sh.back } : null; }
    else if (act === 'item') openItem(YH.menu.filter(function (m) { return m.id === S.cat; })[0].entries[i]);
    else if (act === 'pick') { var p = YH.picks[i]; openItem(findEntry(p.entry), p.choice); }
    else if (act === 'row') { sh.row = i; delete sh.pick.spread; }
    else if (act === 'temp') sh.temp = i;
    else if (act === 'choice') { var g = sh.en.groups[+b.getAttribute('data-g')]; sh.pick[g.key] = g.choices[i]; if (!canSF(sh)) sh.sf = false; }
    else if (act === 'tog') { var k = b.getAttribute('data-k'); sh[k] = !sh[k]; }
    else if (act === 'qty') sh.qty = Math.max(1, Math.min(12, sh.qty + +b.getAttribute('data-d')));
    else if (act === 'add') {
      var en = sh.en, bits = [];
      var name = en.n, pk = sh.pick.flavor;
      if (pk && (en.groups[0].label === 'Drink')) name = pk.n;
      else if (pk) bits.push(pk.n);
      if (en.rows) bits.unshift(en.rows[sh.row][0]);
      if (sh.pick.bagel) bits.push(sh.pick.bagel.n.replace(' (+$1.50)', '').replace('*', ''));
      if (sh.pick.spread) bits.push(sh.pick.spread.n);
      if (en.temp) bits.push(en.temp[sh.temp]);
      if (sh.sf && canSF(sh)) bits.push('Sugar-free');
      if (sh.foam) bits.push('Cold foam');
      if (sh.cream) bits.push('Super Cream');
      S.cart.push({ name: name, detail: bits.join(', '), each: itemPrice(sh), qty: sh.qty });
      S.sheet = null; S.tab = 'order'; render(true); toast('Added to your order'); return;
    }
    else if (act === 'bag') S.sheet = { type: 'bag' };
    else if (act === 'remove') { S.cart.splice(i, 1); if (!S.cart.length) S.sheet = null; }
    else if (act === 'place') { S.placed = { store: S.store, lines: S.cart.slice() }; S.last = S.placed; S.cart = []; S.sheet = null; keep = false; }
    else if (act === 'done') { S.placed = null; S.tab = 'home'; keep = false; }
    else if (act === 'again') { S.cart = S.cart.concat(S.last.lines.map(function (l) { return { name: l.name, detail: l.detail, each: l.each, qty: l.qty }; })); S.sheet = { type: 'bag' }; S.tab = 'order'; keep = false; }
    else if (act === 'past') S.sheet = { type: 'past' };
    else if (act === 'soon') { toast('This screen keeps what your app has today'); return; }
    else if (act === 'close') S.sheet = sh && sh.back ? { type: sh.back } : null;
    render(keep);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && S.sheet) { S.sheet = null; render(true); } });
  render();
})();
