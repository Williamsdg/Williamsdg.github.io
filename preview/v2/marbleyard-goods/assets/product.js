/* Marbleyard Goods — product detail page (product.html?id=…) */
(function () {
  'use strict';
  var D = window.MY_DATA, M = window.MY, esc = M.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = $('[data-pdp-root]');

  var id = null;
  try { id = new URLSearchParams(window.location.search).get('id'); } catch (e) { id = null; }
  var p = D.byId(id);

  if (!p) {
    document.title = 'Object not found — Marbleyard Goods (concept shop)';
    $('[data-crumb]').textContent = 'Not found';
    root.innerHTML = '<div class="not-found">' + D.art(D.byId('incense-dog'), 0, 'butter') +
      '<h1 class="display-h">Not on the shelf</h1><p class="lede" style="margin-inline:auto">We couldn’t find that object in this demo shop. It may have been a mistyped link.</p>' +
      '<p><a class="btn btn-cobalt" href="./#collection">See all objects</a></p></div>';
    return;
  }

  var state = { view: 0, color: p.colors[0].key, qty: 1 };
  var saved = M.Store.get('pdp-' + p.id, null);
  if (saved && p.colors.some(function (c) { return c.key === saved.color; })) state.color = saved.color;

  document.title = p.name + ' — Marbleyard Goods (concept shop)';
  $('[data-crumb]').textContent = p.name;

  function swatchColor(c) { var v = c.c; return v.body || v.stripe || v.glaze || v.frame || v.skin || v.lid || v.a || v.cover || v.back || v.metal; }

  var pairs = D.PRODUCTS.filter(function (x) { return x.id !== p.id; })
    .map(function (x, i) { var shared = x.moods.filter(function (m) { return p.moods.indexOf(m) > -1; }).length; return { x: x, score: shared * 100 - i }; })
    .sort(function (a, b) { return b.score - a.score; }).slice(0, 4).map(function (o) { return o.x; });

  root.innerHTML =
    '<section class="pdp" aria-labelledby="pdp-title">' +
      '<div class="pdp-stage pc-' + p.plinth + '">' +
        '<div class="pdp-object" id="pdp-view" role="tabpanel" aria-labelledby="view-tab-0" data-object></div>' +
        '<div class="plinth pc-' + p.plinth + '" aria-hidden="true"></div>' +
        '<div class="view-tabs" role="tablist" aria-label="Illustration views">' +
          p.views.map(function (v, i) { return '<button type="button" role="tab" class="view-tab" id="view-tab-' + i + '" aria-controls="pdp-view" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-view="' + i + '">' + esc(v) + '</button>'; }).join('') +
        '</div>' +
        '<p class="stage-caption">Original illustration · shown in <span data-color-caption></span></p>' +
      '</div>' +
      '<div class="pdp-info">' +
        '<p class="pdp-kicker">' + p.moods.map(function (m) { return D.MOODS.filter(function (x) { return x.key === m; })[0].label; }).join(' · ') + '</p>' +
        '<h1 id="pdp-title">' + esc(p.name) + '</h1>' +
        '<p class="pdp-price"><span class="sr-only">Price: </span>' + D.money(p.price) + '</p>' +
        '<p class="pdp-blurb">' + esc(p.blurb) + '</p>' +
        '<dl class="specs"><dt>Size</dt><dd>' + esc(p.size) + '</dd><dt>Material</dt><dd>' + esc(p.material) + '</dd><dt>Colors</dt><dd>' + p.colors.length + ' options</dd></dl>' +
        '<fieldset class="variant-set"><legend>Color: <span data-color-label></span></legend><div class="variants">' +
          p.colors.map(function (c) {
            return '<div class="variant"><input type="radio" name="color" id="color-' + c.key + '" value="' + c.key + '"><label for="color-' + c.key + '"><i style="background:' + swatchColor(c) + '" aria-hidden="true"></i>' + esc(c.label) + '</label></div>';
          }).join('') + '</div></fieldset>' +
        '<div class="buy-row"><div class="qty-wrap"><label id="qty-label">Quantity</label>' +
          '<div class="stepper" role="group" aria-labelledby="qty-label"><button type="button" data-q="-1" aria-label="Decrease quantity">−</button><span class="qty" data-qty aria-live="polite">1</span><button type="button" data-q="1" aria-label="Increase quantity">+</button></div></div>' +
          '<button type="button" class="btn btn-cherry" data-add>Add to demo bag · <span data-add-total></span></button></div>' +
        '<p class="buy-status" data-status role="status"></p>' +
        '<div class="policy">' +
          '<details><summary>Delivery <span class="sample-chip">Sample</span></summary><p>Sample policy for this fictional shop: packed in a kraft mailer within 2 business days, $6.00 flat shipping, free from $75.00. Nothing actually ships.</p></details>' +
          '<details><summary>Returns <span class="sample-chip">Sample</span></summary><p>Sample policy: unused objects can be returned within 30 days. This is demo copy, not a real returns promise.</p></details>' +
          '<details><summary>Care</summary><p>' + esc(careFor(p)) + '</p></details>' +
        '</div>' +
      '</div>' +
    '</section>' +
    '<section class="pairs" aria-labelledby="pairs-title"><div class="wrap"><h2 id="pairs-title">Pairs well with</h2>' +
      '<ul class="pair-shelf">' + pairs.map(function (x) {
        return '<li><a href="product.html?id=' + x.id + '" tabindex="-1" aria-hidden="true">' + D.art(x, 0) + '</a><div class="pair-plank" aria-hidden="true"></div>' +
          '<p class="pair-label"><a href="product.html?id=' + x.id + '">' + esc(x.name) + '</a><span>' + D.money(x.price) + '</span></p></li>';
      }).join('') + '</ul>' +
      '<p style="margin:28px 0 0"><a class="btn btn-cobalt" href="./#gift">Put a few in a gift set</a></p>' +
    '</div></section>';

  function careFor(x) {
    return { mug: 'Hand wash. Not for the microwave.', candle: 'Trim the wick and never leave a flame unattended.', dog: 'Wipe clean. Use with a heatproof surface underneath.', mirror: 'Dust with a dry cloth.',
      tomato: 'Spot clean only.', marbles: 'Not a toy for small children — choking hazard.', coasters: 'Wipe dry after use.', notebook: 'Keep dry.', vase: 'Hand wash. Top up water often.',
      cards: 'Keep dry.', opener: 'Polish occasionally, or let it age.', socks: 'Machine wash cold, dry flat.' }[x.art] || 'Handle kindly.';
  }

  function render() {
    var col = M.colorOf(p, state.color);
    $('.pdp-stage').classList.toggle('on-cherry', swatchColor(col) === '#3153D9');
    $('[data-object]').innerHTML = D.art(p, state.view, state.color);
    $('[data-object]').setAttribute('aria-labelledby', 'view-tab-' + state.view);
    $('[data-object]').insertAdjacentHTML('beforeend', '<span class="sr-only">Illustration of the ' + esc(p.name) + ' in ' + esc(col.label) + ', ' + esc(p.views[state.view].toLowerCase()) + ' view.</span>');
    $$('.view-tab').forEach(function (t, i) { var on = i === state.view; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    $$('input[name="color"]').forEach(function (r) { r.checked = r.value === state.color; });
    $('[data-color-label]').textContent = col.label;
    $('[data-color-caption]').textContent = col.label;
    $('[data-qty]').textContent = state.qty;
    $('[data-q="-1"]').disabled = state.qty <= 1;
    $('[data-q="1"]').disabled = state.qty >= 9;
    $('[data-add-total]').textContent = D.money(p.price * state.qty);
  }

  $('.view-tabs').addEventListener('click', function (e) {
    var t = e.target.closest('[data-view]'); if (!t) return;
    state.view = +t.getAttribute('data-view'); render();
  });
  $('.view-tabs').addEventListener('keydown', function (e) {
    var n = p.views.length, next = null;
    if (e.key === 'ArrowRight') next = (state.view + 1) % n;
    else if (e.key === 'ArrowLeft') next = (state.view - 1 + n) % n;
    else if (e.key === 'Home') next = 0; else if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault(); state.view = next; render(); $('#view-tab-' + next).focus();
  });
  $('.variants').addEventListener('change', function (e) {
    state.color = e.target.value; M.Store.set('pdp-' + p.id, { color: state.color }); render();
  });
  $$('[data-q]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.qty = Math.max(1, Math.min(9, state.qty + +b.getAttribute('data-q'))); render();
      if (b.disabled) $('[data-q="' + (-b.getAttribute('data-q')) + '"]').focus();
    });
  });
  $('[data-add]').addEventListener('click', function () {
    var col = M.colorOf(p, state.color);
    M.Bag.addItem(p.id, state.color, state.qty);
    $('[data-status]').innerHTML = 'Added ' + state.qty + ' × ' + esc(p.name) + ' (' + esc(col.label) + ') to your demo bag. <button type="button" class="btn btn-small btn-plain" data-bag-open>Open bag</button>';
  });
  document.addEventListener('my:reset', function () { state = { view: 0, color: p.colors[0].key, qty: 1 }; render(); $('[data-status]').textContent = ''; });

  render();
})();
