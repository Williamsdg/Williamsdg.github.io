/* HeadCase Golf — shared cart (persists across pages via localStorage) */
(function () {
  'use strict';
  var KEY = 'hc_cart_v1';
  var FREE_SHIP = 75;

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save(c) {
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
  }

  var cart = load();

  /* ---- Inject drawer + toast markup if the page doesn't already have it ---- */
  function ensureDom() {
    if (!document.getElementById('drawer')) {
      var d = document.createElement('div');
      d.innerHTML =
        '<div class="scrim" id="scrim"></div>' +
        '<aside class="drawer" id="drawer">' +
          '<div class="drawer-head"><h3>Your Bag</h3><button id="hcCartClose" aria-label="Close">×</button></div>' +
          '<div class="drawer-body" id="cartBody">' +
            '<div class="cart-empty" id="cartEmpty"><div class="ce-ic">🛍️</div>' +
            '<p>Your bag is empty.<br>Time to protect those clubs.</p></div>' +
          '</div>' +
          '<div class="drawer-foot" id="drawerFoot" style="display:none">' +
            '<div class="row"><span>Subtotal</span><span id="subtotal">$0.00</span></div>' +
            '<div class="ship-note" id="shipNote"></div>' +
            '<a href="#" class="btn btn-dark" style="width:100%;justify-content:center">Checkout →</a>' +
          '</div>' +
        '</aside>';
      while (d.firstChild) document.body.appendChild(d.firstChild);
    }
    if (!document.getElementById('toast')) {
      var t = document.createElement('div');
      t.className = 'toast'; t.id = 'toast';
      t.innerHTML = '<span>✓</span><span id="toastMsg">Added to bag</span>';
      document.body.appendChild(t);
    }
    // wire close handlers (drawer may be injected or inline)
    var scrim = document.getElementById('scrim');
    var closeBtn = document.getElementById('hcCartClose');
    if (scrim) scrim.onclick = close;
    if (closeBtn) closeBtn.onclick = close;
  }

  /* ---- Toast (works whether toast has the span structure or not) ---- */
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    var m = document.getElementById('toastMsg');
    if (m) m.textContent = msg; else t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  function open() {
    var d = document.getElementById('drawer'), s = document.getElementById('scrim');
    if (d) d.classList.add('open');
    if (s) s.classList.add('open');
  }
  function close() {
    var d = document.getElementById('drawer'), s = document.getElementById('scrim');
    if (d) d.classList.remove('open');
    if (s) s.classList.remove('open');
  }

  function key(it) { return it.name + '|' + (it.variant || ''); }

  function add(opts, btn) {
    // opts: {name, color, price, variant}
    var existing = cart.find(function (i) { return key(i) === key(opts); });
    if (existing) existing.qty += (opts.qty || 1);
    else cart.push({
      name: opts.name, color: opts.color || '#1f5e3c',
      price: +opts.price, variant: opts.variant || '', qty: opts.qty || 1
    });
    save(cart);
    render();
    toast('Added — ' + opts.name);
    open();
    if (btn) {
      var orig = btn.textContent;
      btn.textContent = '✓ Added';
      setTimeout(function () { btn.textContent = orig; }, 1100);
    }
  }

  function setQty(idx, delta) {
    if (!cart[idx]) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    save(cart); render();
  }
  function removeItem(idx) {
    if (!cart[idx]) return;
    cart.splice(idx, 1); save(cart); render();
  }

  function count() { return cart.reduce(function (s, i) { return s + i.qty; }, 0); }

  function render() {
    var badges = document.querySelectorAll('#cartCount, .cart-count');
    var c = count();
    badges.forEach(function (b) { b.textContent = c; });

    var body = document.getElementById('cartBody');
    var empty = document.getElementById('cartEmpty');
    var foot = document.getElementById('drawerFoot');
    if (!body) return;

    body.querySelectorAll('.cart-item').forEach(function (n) { n.remove(); });

    if (!cart.length) {
      if (empty) empty.style.display = 'block';
      if (foot) foot.style.display = 'none';
      return;
    }
    if (empty) empty.style.display = 'none';
    if (foot) foot.style.display = 'block';

    var sub = 0;
    cart.forEach(function (i, idx) {
      sub += i.price * i.qty;
      var el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML =
        '<div class="cart-thumb" style="background:radial-gradient(circle at 50% 30%,' + i.color + ',#0c2a1a)">🏌️</div>' +
        '<div style="flex:1">' +
          '<h4>' + i.name + '</h4>' +
          '<small>' + (i.variant ? i.variant + ' · ' : '') + '$' + i.price.toFixed(2) + '</small>' +
          '<div class="ci-qty">' +
            '<button data-act="dec" data-i="' + idx + '">−</button>' +
            '<span>' + i.qty + '</span>' +
            '<button data-act="inc" data-i="' + idx + '">+</button>' +
            '<button class="ci-rm" data-act="rm" data-i="' + idx + '">Remove</button>' +
          '</div>' +
        '</div>' +
        '<div class="ci-price">$' + (i.price * i.qty).toFixed(2) + '</div>';
      body.appendChild(el);
    });

    var st = document.getElementById('subtotal');
    if (st) st.textContent = '$' + sub.toFixed(2);
    var note = document.getElementById('shipNote');
    if (note) {
      if (sub >= FREE_SHIP) note.innerHTML = "🎉 You've unlocked <b>free shipping!</b>";
      else note.textContent = 'Add $' + (FREE_SHIP - sub).toFixed(2) + ' for free shipping 🚚';
    }
  }

  // Event delegation for qty/remove buttons inside the drawer
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var idx = +b.getAttribute('data-i');
    var act = b.getAttribute('data-act');
    if (act === 'inc') setQty(idx, 1);
    else if (act === 'dec') setQty(idx, -1);
    else if (act === 'rm') removeItem(idx);
  });

  // Keep multiple tabs / back-forward navigation in sync
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { cart = load(); render(); }
  });
  window.addEventListener('pageshow', function () { cart = load(); render(); });

  function init() { ensureDom(); render(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* ---- Public API + back-compat globals ---- */
  var API = {
    add: add, open: open, close: close, render: render,
    count: count, toast: toast, items: function () { return cart.slice(); }
  };
  window.HCCart = API;
  window.openCart = open;
  window.closeCart = close;
  window.toast = toast;
  // legacy signature used by existing inline onclicks: addToCart(name,color,price,btn)
  window.addToCart = function (name, color, price, btn) {
    add({ name: name, color: color, price: price }, btn);
  };
  window.signup = function (e) {
    e.preventDefault();
    var input = e.target.querySelector('input');
    if (input) input.value = '';
    toast('Welcome to the Clubhouse! Check your inbox.');
  };
})();
