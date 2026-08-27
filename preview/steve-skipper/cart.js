/* Steve R. Skipper Studio — cart
   Holds items in localStorage; hands the whole cart to the checkout function.
   Prices are never trusted from here — the server re-reads every price from
   Stripe before charging. What's stored is only for display. */
(function () {
  'use strict';
  var KEY = 'skipper.cart.v1';
  var CHECKOUT = 'https://steve-skipper-studio.netlify.app/.netlify/functions/checkout';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    paint();
  }
  var money = function (c) {
    return '$' + (c / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  function add(item) {
    var items = read();
    var same = items.find(function (i) { return i.price === item.price && i.framing === item.framing; });
    if (same) same.quantity = Math.min(same.quantity + item.quantity, 10);
    else items.push(item);
    write(items);
    open();
  }
  function remove(i) { var it = read(); it.splice(i, 1); write(it); }
  function setQty(i, q) {
    var it = read();
    if (!it[i]) return;
    it[i].quantity = Math.min(Math.max(parseInt(q, 10) || 1, 1), 10);
    write(it);
  }

  function subtotal(items) {
    return items.reduce(function (s, i) { return s + (i.cents + (i.framingCents || 0)) * i.quantity; }, 0);
  }

  /* ---------- drawer ---------- */
  function el(id) { return document.getElementById(id); }
  function open() { document.body.classList.add('cart-open'); el('cart-drawer').setAttribute('aria-hidden', 'false'); }
  function close() { document.body.classList.remove('cart-open'); el('cart-drawer').setAttribute('aria-hidden', 'true'); }

  function paint() {
    var items = read();
    var count = items.reduce(function (s, i) { return s + i.quantity; }, 0);
    document.querySelectorAll('.cart-count').forEach(function (n) {
      n.textContent = count;
      n.hidden = count === 0;
    });
    var body = el('cart-items');
    if (!body) return;
    if (!items.length) {
      body.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      el('cart-foot').hidden = true;
      return;
    }
    el('cart-foot').hidden = false;
    body.innerHTML = items.map(function (i, n) {
      return '<div class="cart-row">' +
        '<div class="cr-main"><p class="cr-title">' + esc(i.title) + '</p>' +
        '<p class="cr-ed">' + esc(i.edition || '') + (i.framingLabel ? ' &middot; ' + esc(i.framingLabel) : '') + '</p></div>' +
        '<div class="cr-side">' +
        '<label class="vh" for="q' + n + '">Quantity</label>' +
        '<input id="q' + n + '" class="cr-qty" type="number" min="1" max="10" value="' + i.quantity + '" data-i="' + n + '">' +
        '<p class="cr-price">' + money((i.cents + (i.framingCents || 0)) * i.quantity) + '</p>' +
        '<button class="cr-rm" data-i="' + n + '" aria-label="Remove ' + esc(i.title) + '">Remove</button>' +
        '</div></div>';
    }).join('');
    el('cart-subtotal').textContent = money(subtotal(items));
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m];
    });
  }

  async function checkout(btn) {
    var items = read();
    if (!items.length) return;
    btn.disabled = true;
    btn.textContent = 'Opening secure checkout…';
    try {
      var res = await fetch(CHECKOUT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(function (i) {
            return { price: i.price, quantity: i.quantity, framing: i.framing || '' };
          }),
        }),
      });
      var data = await res.json();
      if (data.url) { window.location = data.url; return; }
      throw new Error(data.error || 'Checkout is unavailable right now.');
    } catch (e) {
      btn.disabled = false;
      btn.textContent = 'Checkout';
      var err = el('cart-error');
      err.textContent = e.message;
      err.hidden = false;
    }
  }

  /* ---------- wiring ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    // Intercept the per-work forms so they add to the cart instead of posting.
    document.querySelectorAll('form.buy').forEach(function (f) {
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var sel = f.querySelector('select[name=price]');
        var fr = f.querySelector('select[name=framing]');
        var opt = sel.options[sel.selectedIndex];
        var frOpt = fr.options[fr.selectedIndex];
        add({
          price: sel.value,
          title: f.closest('.shop-card').querySelector('h3').textContent.trim(),
          edition: opt.textContent.replace(/\s+—\s+\$[\d,]+$/, '').trim(),
          cents: Math.round(parseFloat((opt.textContent.match(/\$([\d,]+)$/) || [0, '0'])[1].replace(/,/g, '')) * 100),
          framing: fr.value,
          framingLabel: fr.value ? frOpt.textContent.replace(/\s*\(\+\$[\d,]+\)$/, '').trim() : '',
          framingCents: fr.value
            ? Math.round(parseFloat((frOpt.textContent.match(/\+\$([\d,]+)/) || [0, '0'])[1].replace(/,/g, '')) * 100)
            : 0,
          quantity: 1,
        });
      });
      f.querySelector('button[type=submit]').textContent = 'Add to Cart';
    });

    document.addEventListener('click', function (ev) {
      if (ev.target.closest('.cart-toggle')) { ev.preventDefault(); open(); }
      if (ev.target.closest('.cart-close') || ev.target.classList.contains('cart-scrim')) close();
      if (ev.target.classList.contains('cr-rm')) remove(+ev.target.dataset.i);
      if (ev.target.id === 'cart-checkout') checkout(ev.target);
    });
    document.addEventListener('change', function (ev) {
      if (ev.target.classList.contains('cr-qty')) setQty(+ev.target.dataset.i, ev.target.value);
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') close();
    });
    paint();
  });
})();
