/* Marbleyard Goods — shared demo state: bag, drawer, simulated checkout, reset. */
(function () {
  'use strict';
  var D = window.MY_DATA;
  var PREFIX = 'v2-marbleyard-';

  var Store = {
    get: function (k, fallback) {
      try { var v = window.localStorage.getItem(PREFIX + k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set: function (k, v) { try { window.localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) { /* storage unavailable: demo still works in memory */ } },
    clear: function () {
      try {
        var keys = [];
        for (var i = 0; i < window.localStorage.length; i++) { var k = window.localStorage.key(i); if (k && k.indexOf(PREFIX) === 0) keys.push(k); }
        keys.forEach(function (k) { window.localStorage.removeItem(k); });
      } catch (e) { /* ignore */ }
    }
  };

  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function colorOf(p, key) { return p.colors.filter(function (c) { return c.key === key; })[0] || p.colors[0]; }

  /* ---------- bag model ---------- */
  var bag = { lines: sanitize(Store.get('bag', [])) };
  function sanitize(lines) {
    if (!Array.isArray(lines)) return [];
    return lines.filter(function (l) {
      if (!l || typeof l.qty !== 'number' || l.qty < 1) return false;
      if (l.type === 'item') return !!D.byId(l.id);
      if (l.type === 'set') return Array.isArray(l.items) && l.items.length >= D.GIFT.min && l.items.every(function (i) { return D.byId(i.id); });
      return false;
    });
  }
  function save() { Store.set('bag', bag.lines); emit(); }
  function emit() { document.dispatchEvent(new CustomEvent('my:bag')); }
  var seq = Store.get('seq', 1);

  var Bag = {
    lines: function () { return bag.lines; },
    totals: function () { return D.bagTotals(bag.lines); },
    addItem: function (id, color, qty) {
      var p = D.byId(id); if (!p) return;
      color = colorOf(p, color).key; qty = Math.max(1, Math.min(9, qty || 1));
      var key = 'i-' + id + '-' + color;
      var ex = bag.lines.filter(function (l) { return l.key === key; })[0];
      if (ex) ex.qty = Math.min(9, ex.qty + qty); else bag.lines.push({ key: key, type: 'item', id: id, color: color, qty: qty });
      save();
    },
    addSet: function (items, pack, note) {
      seq += 1; Store.set('seq', seq);
      bag.lines.push({ key: 's-' + seq, type: 'set', items: items.map(function (i) { return { id: i.id, color: i.color }; }), pack: pack, note: String(note || '').slice(0, D.GIFT.noteMax), qty: 1 });
      save();
    },
    setQty: function (key, qty) {
      var l = bag.lines.filter(function (x) { return x.key === key; })[0]; if (!l) return;
      l.qty = Math.max(1, Math.min(9, qty)); save();
    },
    remove: function (key) { bag.lines = bag.lines.filter(function (x) { return x.key !== key; }); save(); },
    empty: function () { bag.lines = []; save(); }
  };

  /* ---------- small helpers exposed to pages ---------- */
  function toast(msg, withOpen) {
    var t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.innerHTML = '<span>' + esc(msg) + '</span>' + (withOpen ? '<button type="button" data-bag-open>Open bag</button>' : '');
    t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, 4200);
  }

  function renderCounts() {
    var tot = Bag.totals();
    document.querySelectorAll('[data-bag-count]').forEach(function (el) { el.textContent = tot.count; });
    document.querySelectorAll('[data-bag-total]').forEach(function (el) { el.textContent = D.money(tot.subtotal); });
    document.querySelectorAll('[data-bag-label]').forEach(function (el) { el.setAttribute('aria-label', 'Open demo bag, ' + tot.count + (tot.count === 1 ? ' item' : ' items') + ', subtotal ' + D.money(tot.subtotal)); });
  }

  /* ---------- drawer ---------- */
  var drawer, scrim, lastFocus, view = 'bag', order = null;

  function buildDrawer() {
    scrim = document.createElement('div'); scrim.className = 'drawer-scrim'; scrim.hidden = true;
    drawer = document.createElement('div');
    drawer.className = 'drawer'; drawer.hidden = true;
    drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'true'); drawer.setAttribute('aria-labelledby', 'drawer-title');
    drawer.innerHTML = '<div class="drawer-head"><h2 id="drawer-title" tabindex="-1">Your demo bag</h2><button type="button" class="icon-btn" data-close aria-label="Close bag">×</button></div>' +
      '<div class="drawer-body" data-body></div><div class="drawer-foot" data-foot></div>';
    document.body.appendChild(scrim); document.body.appendChild(drawer);
    scrim.addEventListener('click', close);
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === drawer.querySelector('#drawer-title'))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    drawer.addEventListener('click', onDrawerClick);
  }
  function focusables() {
    return Array.prototype.slice.call(drawer.querySelectorAll('button:not([disabled]), a[href], input, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }
  function setInert(on) {
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el === drawer || el === scrim || el.tagName === 'SCRIPT') return;
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }
  function open(opener) {
    lastFocus = opener || document.activeElement;
    view = 'bag'; render();
    scrim.hidden = false; drawer.hidden = false; setInert(true);
    document.documentElement.style.overflow = 'hidden';
    drawer.querySelector('#drawer-title').focus();
  }
  function close() {
    if (drawer.hidden) return;
    drawer.hidden = true; scrim.hidden = true; setInert(false);
    document.documentElement.style.overflow = '';
    if (view === 'done') { view = 'bag'; }
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
  }
  function isOpen() { return drawer && !drawer.hidden; }

  function thumb(line) {
    if (line.type === 'set') {
      return '<div class="bag-thumb set" aria-hidden="true">' + line.items.map(function (i) { return D.art(D.byId(i.id), 0, i.color); }).join('') + '</div>';
    }
    var p = D.byId(line.id);
    return '<div class="bag-thumb pc-' + p.plinth + '" style="background:var(--pc)" aria-hidden="true">' + D.art(p, 0, line.color) + '</div>';
  }
  function lineTitle(line) {
    if (line.type === 'set') return 'Gift set · ' + D.packBy(line.pack).label;
    return D.byId(line.id).name;
  }
  function stepper(line) {
    var name = lineTitle(line);
    return '<div class="stepper" role="group" aria-label="Quantity for ' + esc(name) + '">' +
      '<button type="button" data-dec="' + line.key + '" aria-label="Decrease quantity of ' + esc(name) + '"' + (line.qty <= 1 ? ' disabled' : '') + '>−</button>' +
      '<span class="qty" aria-live="polite" data-qty="' + line.key + '">' + line.qty + '</span>' +
      '<button type="button" data-inc="' + line.key + '" aria-label="Increase quantity of ' + esc(name) + '"' + (line.qty >= 9 ? ' disabled' : '') + '>+</button></div>';
  }
  function totalsTable(tot) {
    return '<table class="totals"><caption class="sr-only">Bag totals</caption>' +
      '<tr><th scope="row">Subtotal</th><td data-subtotal>' + D.money(tot.subtotal) + '</td></tr>' +
      '<tr><th scope="row">Shipping <span class="sample-chip">Sample</span></th><td data-shipping>' + (tot.shipping ? D.money(tot.shipping) : 'Free') + '</td></tr>' +
      '<tr class="grand"><th scope="row">Total</th><td data-total>' + D.money(tot.total) + '</td></tr></table>';
  }

  function orderNumber() {
    var s = JSON.stringify(bag.lines), h = 7;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 90000;
    return 'MYG-SAMPLE-' + (10000 + h);
  }

  function render() {
    if (!drawer) return;
    var body = drawer.querySelector('[data-body]'), foot = drawer.querySelector('[data-foot]'), title = drawer.querySelector('#drawer-title');
    var lines = bag.lines, tot = Bag.totals();

    if (view === 'bag') {
      title.textContent = 'Your demo bag';
      if (!lines.length) {
        body.innerHTML = '<div class="empty-bag">' + D.art(D.byId('marble-jar'), 2, 'cherry') + '<p><strong>Your bag is empty.</strong></p><p>Pick something off the shelf, or build a gift set.</p><button type="button" class="btn btn-cobalt" data-close>Keep browsing</button></div>';
        foot.innerHTML = '<p class="demo-note">Demo bag — saved in this browser only.</p>';
        return;
      }
      body.innerHTML = '<p class="demo-note">Demo bag · saved in this browser only · prices are fictional.</p><ul class="bag-lines">' + lines.map(function (l) {
        var unit = D.lineUnit(l), meta;
        if (l.type === 'set') {
          var pr = D.giftPricing(l.items, l.pack);
          meta = '<ul class="set-items">' + l.items.map(function (i) { var p = D.byId(i.id); return '<li>' + esc(p.name) + ' (' + esc(colorOf(p, i.color).label) + ')</li>'; }).join('') + '</ul>' +
            '<p class="meta">' + D.money(unit) + ' each' + (pr.savingsCents ? ' · includes ' + D.money(pr.savingsCents) + ' set savings' : '') + '</p>' + (l.note ? '<p class="meta">Note: “' + esc(l.note) + '”</p>' : '');
        } else {
          var p = D.byId(l.id);
          meta = '<p class="meta">' + esc(colorOf(p, l.color).label) + ' · ' + D.money(unit) + ' each</p>';
        }
        return '<li class="bag-line" data-line="' + l.key + '">' + thumb(l) + '<div><h3>' + esc(lineTitle(l)) + '</h3>' + meta +
          '<div class="line-row">' + stepper(l) + '<span class="line-price" data-line-total="' + l.key + '">' + D.money(unit * l.qty) + '</span></div>' +
          '<button type="button" class="remove-btn" data-remove="' + l.key + '">Remove<span class="sr-only"> ' + esc(lineTitle(l)) + '</span></button></div></li>';
      }).join('') + '</ul>';
      foot.innerHTML = totalsTable(tot) +
        '<p class="demo-note">Shipping is a sample policy: $6.00 flat, free from $75.00.</p>' +
        '<button type="button" class="btn btn-cherry" data-checkout>Checkout (simulated)</button>';
      return;
    }

    if (view === 'review' || view === 'slip') {
      order = order || { no: orderNumber() };
      title.textContent = view === 'slip' ? 'Sample packing slip' : 'Order review (simulated)';
      var honest = '<div class="honest" role="note"><strong>No payment taken — this is a fictional demo shop.</strong><p>Nothing was charged, sent or shipped. This review exists only in your browser.</p></div>';
      if (view === 'review') {
        body.innerHTML = honest + '<p class="order-no">Sample order number: <b data-order-no>' + order.no + '</b></p>' +
          '<ul class="review-list">' + lines.map(function (l) {
            return '<li><span>' + l.qty + ' × ' + esc(lineTitle(l)) + '</span><span>' + D.money(D.lineUnit(l) * l.qty) + '</span></li>';
          }).join('') + '</ul>' + totalsTable(tot);
        foot.innerHTML = '<button type="button" class="btn btn-cobalt" data-slip>View sample packing slip</button><div class="row"><button type="button" class="btn" data-back>Back to bag</button><button type="button" class="btn" data-finish>Finish &amp; empty bag</button></div>';
      } else {
        body.innerHTML = honest + '<div class="slip" data-slip-view><p class="pdp-kicker">Marbleyard Goods · sample</p><h3>Packing slip</h3><p class="slip-meta">Order <b>' + order.no + '</b> · fictional, not a real shipment</p>' +
          '<table><thead><tr><th scope="col">Qty</th><th scope="col">Contents</th><th scope="col"><span class="sr-only">Packed</span></th></tr></thead><tbody>' +
          lines.map(function (l) {
            if (l.type === 'set') {
              return '<tr><td class="q">' + l.qty + '</td><td><b>Gift set</b> — ' + esc(D.packBy(l.pack).label) + '<div class="sub">' +
                l.items.map(function (i) { var p = D.byId(i.id); return esc(p.name) + ' (' + esc(colorOf(p, i.color).label) + ')'; }).join('<br>') + '</div>' +
                (l.note ? '<p class="slip-note">Gift note: “' + esc(l.note) + '”</p>' : '<p class="sub">No gift note</p>') + '</td><td><span class="tick"></span></td></tr>';
            }
            var p = D.byId(l.id);
            return '<tr><td class="q">' + l.qty + '</td><td><b>' + esc(p.name) + '</b><div class="sub">' + esc(colorOf(p, l.color).label) + ' · Standard kraft mailer</div></td><td><span class="tick"></span></td></tr>';
          }).join('') + '</tbody></table></div>';
        foot.innerHTML = '<div class="row"><button type="button" class="btn" data-review>Back to review</button><button type="button" class="btn" data-finish>Finish &amp; empty bag</button></div>';
      }
      return;
    }

    if (view === 'done') {
      title.textContent = 'All done (demo)';
      body.innerHTML = '<div class="empty-bag">' + D.art(D.byId('stripe-candle'), 2, 'cherry') + '<p><strong>Demo order cleared.</strong></p><p>No payment was taken and nothing will ship. Your demo bag is empty again.</p><button type="button" class="btn btn-cobalt" data-close>Back to the shop</button></div>';
      foot.innerHTML = '';
    }
  }

  function focusAfterRender(selector) {
    var el = drawer.querySelector(selector) || drawer.querySelector('#drawer-title');
    el.focus();
  }

  function onDrawerClick(e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.hasAttribute('data-close')) { close(); return; }
    var k;
    if ((k = t.getAttribute('data-inc')) || (k = t.getAttribute('data-dec'))) {
      var line = bag.lines.filter(function (l) { return l.key === k; })[0]; if (!line) return;
      var inc = t.hasAttribute('data-inc');
      Bag.setQty(k, line.qty + (inc ? 1 : -1));
      var sel = '[data-' + (inc ? 'inc' : 'dec') + '="' + k + '"]';
      var btn = drawer.querySelector(sel);
      focusAfterRender(btn && !btn.disabled ? sel : '[data-' + (inc ? 'dec' : 'inc') + '="' + k + '"]');
      return;
    }
    if ((k = t.getAttribute('data-remove'))) {
      var idx = bag.lines.findIndex(function (l) { return l.key === k; });
      Bag.remove(k);
      var rem = drawer.querySelectorAll('[data-remove]');
      if (rem.length) rem[Math.min(idx, rem.length - 1)].focus(); else focusAfterRender('[data-close]');
      return;
    }
    if (t.hasAttribute('data-checkout')) { order = null; view = 'review'; render(); focusAfterRender('#drawer-title'); return; }
    if (t.hasAttribute('data-slip')) { view = 'slip'; render(); focusAfterRender('#drawer-title'); return; }
    if (t.hasAttribute('data-review')) { view = 'review'; render(); focusAfterRender('[data-slip]'); return; }
    if (t.hasAttribute('data-back')) { view = 'bag'; render(); focusAfterRender('[data-checkout]'); return; }
    if (t.hasAttribute('data-finish')) { view = 'done'; Bag.empty(); order = null; render(); focusAfterRender('.drawer-body [data-close]'); }
  }

  document.addEventListener('my:bag', function () { renderCounts(); if (isOpen() && view === 'bag') render(); });

  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-bag-open]');
    if (o) { e.preventDefault(); open(o.closest('.toast') ? document.querySelector('.bag-btn') : o); }
    var r = e.target.closest('[data-reset]');
    if (r) {
      Store.clear(); bag.lines = []; emit();
      document.dispatchEvent(new CustomEvent('my:reset'));
      var s = document.querySelector('[data-reset-status]'); if (s) s.textContent = 'Demo reset — bag, gift set and choices cleared.';
    }
  });

  function init() {
    buildDrawer(); renderCounts();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.MY = { Store: Store, Bag: Bag, esc: esc, colorOf: colorOf, toast: toast, openBag: open, closeBag: close };
})();
