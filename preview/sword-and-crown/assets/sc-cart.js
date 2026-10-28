/* Sword and Crown — the bag.
 *
 * A real cart on Shopify's Cart API, so a visitor can put several pieces in
 * one bag across pages and pay for them together. Before this, "Add to bag"
 * was a cart permalink, and Shopify permalinks REPLACE the bag — the second
 * piece silently threw the first one out.
 *
 * Only the cart's id lives here (localStorage). The lines, prices and stock
 * are Shopify's; we re-read them every time the bag opens. Checkout is
 * Shopify's own page, reached through cart.checkoutUrl.
 *
 * Markup it expects: a header link with data-bag (and an optional .bag-n
 * badge inside it) and buttons with data-add="<variant gid>".
 */
(function () {
  'use strict';

  var S = window.SCShop;
  if (!S || !S.live) return;

  var KEY = 'sc_cart_id';
  var esc = (window.SC && window.SC.esc) || function (x) {
    return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var cart = null, panel = null, veil = null, lastFocus = null;

  function money(n) {
    n = Number(n);
    var whole = Math.abs(n % 1) < 0.005;
    return '$' + n.toLocaleString(undefined, { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 });
  }
  function storedId() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function remember(c) {
    try { c ? localStorage.setItem(KEY, c.id) : localStorage.removeItem(KEY); } catch (e) { /* private mode */ }
  }
  function set(c) { cart = c; remember(c); paint(); return c; }

  /* ── talking to Shopify ───────────────────────────────────────── */
  function load() {
    var id = storedId();
    if (!id) return Promise.resolve(null);
    return S.cartGet(id).then(function (c) {
      if (!c) remember(null);           // expired or never existed
      cart = c; paint(); return c;
    });
  }
  function add(variantId, qty) {
    var id = storedId();
    var line = [{ variantId: variantId, qty: qty || 1 }];
    var p = id ? S.cartAdd(id, line) : S.cartCreate(line);
    return p.then(function (c) {
      // A stored cart Shopify no longer knows about: start a fresh one.
      if (!c && id) { remember(null); return S.cartCreate(line); }
      return c;
    }).then(set);
  }
  function update(lineId, qty) {
    if (!cart) return Promise.resolve(null);
    return (qty > 0 ? S.cartUpdate(cart.id, lineId, qty) : S.cartRemove(cart.id, lineId))
      .then(function (c) { return c ? set(c) : (message('We couldn’t update the bag — please try again.'), cart); });
  }

  /* ── the panel ────────────────────────────────────────────────── */
  function build() {
    if (panel) return;
    veil = document.createElement('div');
    veil.className = 'bag-veil'; veil.hidden = true;
    panel = document.createElement('aside');
    panel.className = 'bag'; panel.id = 'bag'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Your bag');
    panel.innerHTML =
      '<div class="bag-top"><h2 class="d3">Your bag</h2>' +
      '<button class="icon-btn" type="button" data-bag-close aria-label="Close bag"><svg><use href="#i-close"/></svg></button></div>' +
      '<div class="bag-msg" hidden></div>' +
      '<div class="bag-lines"></div>' +
      '<div class="bag-foot"></div>';
    document.body.appendChild(veil); document.body.appendChild(panel);
    veil.addEventListener('click', close);
    panel.addEventListener('click', function (e) {
      var t = e.target.closest('[data-bag-close],[data-qty],[data-rm]');
      if (!t) return;
      if (t.hasAttribute('data-bag-close')) { close(); return; }
      var lineId = t.getAttribute('data-line');
      var line = lineOf(lineId);
      if (!line) return;
      if (t.hasAttribute('data-rm')) { update(lineId, 0); return; }
      update(lineId, line.quantity + Number(t.getAttribute('data-qty')));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel && !panel.hidden) close();
    });
  }
  function lineOf(id) {
    var nodes = (cart && cart.lines && cart.lines.nodes) || [];
    for (var i = 0; i < nodes.length; i++) if (nodes[i].id === id) return nodes[i];
    return null;
  }
  function message(text) {
    if (!panel) return;
    var m = panel.querySelector('.bag-msg');
    m.textContent = text || ''; m.hidden = !text;
  }

  function paint() {
    // header badge, on every page
    [].forEach.call(document.querySelectorAll('[data-bag] .bag-n'), function (b) {
      var n = cart ? cart.totalQuantity : 0;
      b.textContent = n; b.hidden = !n;
    });
    if (!panel) return;
    var lines = (cart && cart.lines && cart.lines.nodes) || [];
    var box = panel.querySelector('.bag-lines'), foot = panel.querySelector('.bag-foot');
    if (!lines.length) {
      box.innerHTML = '<p class="bag-empty">Your bag is empty.</p>';
      foot.innerHTML = '<a class="btn ghost" href="boutique.html">Browse the boutique</a>';
      return;
    }
    box.innerHTML = lines.map(function (l) {
      var v = l.merchandise, img = v.image;
      var sub = v.title && v.title !== 'Default Title' ? v.title : '';
      return '<div class="bag-line">' +
        '<div class="ph">' + (img ? '<img src="' + esc(img.url) + '" alt="' + esc(img.altText || v.product.title) + '">' : '') + '</div>' +
        '<div><b><a href="product.html?p=' + encodeURIComponent(v.product.handle) + '">' + esc(v.product.title) + '</a></b>' +
          (sub ? '<small>' + esc(sub) + '</small>' : '') +
          '<div class="bag-qty"><button type="button" data-qty="-1" data-line="' + esc(l.id) + '" aria-label="One fewer">&minus;</button>' +
          '<span>' + l.quantity + '</span>' +
          '<button type="button" data-qty="1" data-line="' + esc(l.id) + '" aria-label="One more">+</button></div></div>' +
        '<div><div class="price">' + money(Number(v.price.amount) * l.quantity) + '</div>' +
          '<button type="button" class="bag-rm" data-rm data-line="' + esc(l.id) + '">Remove</button></div>' +
      '</div>';
    }).join('');
    foot.innerHTML =
      '<div class="bag-sub"><span>Subtotal · ' + cart.totalQuantity + (cart.totalQuantity === 1 ? ' item' : ' items') + '</span>' +
      '<b>' + money(cart.cost.subtotalAmount.amount) + '</b></div>' +
      '<a class="btn pink" href="' + esc(cart.checkoutUrl) + '">Checkout</a>' +
      '<p class="hint">Shipping and tax are added at checkout, which runs on Shopify’s secure page.</p>';
  }

  function open() {
    build();
    lastFocus = document.activeElement;
    veil.hidden = false; panel.hidden = false;
    document.body.style.overflow = 'hidden';
    message('');
    paint();
    var c = panel.querySelector('[data-bag-close]'); c && c.focus();
    // Always re-read: stock or prices may have moved since the id was stored.
    load().then(function () { if (!panel.hidden) paint(); });
  }
  function close() {
    if (!panel) return;
    veil.hidden = true; panel.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ── wiring ───────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var bag = e.target.closest('[data-bag]');
    if (bag) { e.preventDefault(); open(); return; }
    var btn = e.target.closest('[data-add]');
    if (!btn || btn.disabled) return;
    var was = btn.textContent;
    btn.disabled = true; btn.textContent = 'Adding…';
    add(btn.getAttribute('data-add'), 1).then(function (c) {
      btn.disabled = false;
      if (c) { btn.textContent = 'Added ✓'; setTimeout(function () { btn.textContent = was; }, 1800); open(); }
      else { btn.textContent = was; alert('We couldn’t add that to your bag just now. Please try again, or call us on (205) 259-6911.'); }
    });
  });

  window.SCCart = { open: open, close: close, add: add, reload: load };
  load();
})();
