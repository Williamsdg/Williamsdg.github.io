/* Marbleyard Goods — home page: window shelf, mood filter, collection, gift builder. */
(function () {
  'use strict';
  var D = window.MY_DATA, M = window.MY, esc = M.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* shelf layout: which objects, which shelf, display size (px) and shown color */
  var SHELF = [
    [['marble-jar', 124, 'cobalt'], ['enamel-mug', 132, 'cherry'], ['wobble-mirror', 206, 'cherry'], ['stripe-candle', 162, 'cherry'], ['dot-notebook', 158, 'mint']],
    [['tomato-pincushion', 104, 'red'], ['bumpy-vase', 128, 'mint']],
    [['checker-coasters', 128, 'cobalt'], ['incense-dog', 168, 'butter'], ['big-pip-cards', 140, 'cherry'], ['wiggle-socks', 150, 'cobalt'], ['fish-opener', 128, 'polished']]
  ];
  var MOOD_ART = { all: ['marble-jar', 'enamel-mug'], desk: ['dot-notebook', 'tomato-pincushion'], evenings: ['stripe-candle', 'wiggle-socks'], gifts: ['big-pip-cards', 'fish-opener'], kitchen: ['checker-coasters', 'bumpy-vase'] };

  var state = {
    mood: M.Store.get('mood', 'all'),
    gift: M.Store.get('gift', { items: [], pack: 'kraft', note: '' })
  };
  if (!D.MOODS.some(function (m) { return m.key === state.mood; })) state.mood = 'all';
  function cleanGift(g) {
    g = g && typeof g === 'object' ? g : {};
    var items = Array.isArray(g.items) ? g.items.filter(function (i) { return i && D.byId(i.id); }).slice(0, D.GIFT.max) : [];
    return { items: items, pack: D.PACKAGING.some(function (p) { return p.key === g.pack; }) ? g.pack : 'kraft', note: String(g.note || '').slice(0, D.GIFT.noteMax) };
  }
  state.gift = cleanGift(state.gift);

  /* ---------- window shelf ---------- */
  function renderShelf() {
    SHELF.forEach(function (row, i) {
      var ul = $('.shelf[data-shelf="' + i + '"] .shelf-row');
      ul.innerHTML = row.map(function (s) {
        var p = D.byId(s[0]), tagId = 'tag-' + p.id;
        return '<li class="item" data-id="' + p.id + '">' +
          '<button type="button" class="obj" style="--w:' + s[1] + 'px" aria-expanded="false" aria-controls="' + tagId + '" aria-label="' + esc(p.name) + ', ' + D.money(p.price) + '">' + D.art(p, 0, s[2]) + '</button>' +
          '<div class="tag" id="' + tagId + '"><span class="tag-name">' + esc(p.name) + '</span><span class="tag-price">' + D.money(p.price) + '</span>' +
          '<span class="tag-actions"><a class="btn btn-cherry" href="product.html?id=' + p.id + '" tabindex="-1">See it<span class="sr-only"> — ' + esc(p.name) + '</span></a>' +
          '<button type="button" class="btn" data-quick-add="' + p.id + '" data-color="' + s[2] + '" tabindex="-1">Add<span class="sr-only"> ' + esc(p.name) + ' to bag</span></button></span></div></li>';
      }).join('');
    });
    $('#shelf-list').innerHTML = D.PRODUCTS.map(function (p) {
      return '<li data-id="' + p.id + '"><a href="product.html?id=' + p.id + '">' + D.art(p, 0) + '<span class="n">' + esc(p.name) + '</span><span class="p">' + D.money(p.price) + '</span></a></li>';
    }).join('');
  }

  function setOpen(item, on) {
    var btn = $('.obj', item);
    item.classList.toggle('is-open', on);
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    $$('.tag-actions a, .tag-actions button', item).forEach(function (el) { el.tabIndex = on ? 0 : -1; });
  }
  function closeAllTags(except) { $$('.item.is-open').forEach(function (it) { if (it !== except) setOpen(it, false); }); }

  document.addEventListener('click', function (e) {
    var obj = e.target.closest('.obj');
    if (obj) { var it = obj.closest('.item'); var on = !it.classList.contains('is-open'); closeAllTags(it); setOpen(it, on); return; }
    var qa = e.target.closest('[data-quick-add]');
    if (qa) { var p = D.byId(qa.getAttribute('data-quick-add')); M.Bag.addItem(p.id, qa.getAttribute('data-color'), 1); M.toast(p.name + ' added to your demo bag.', true); return; }
    if (!e.target.closest('.item')) closeAllTags();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = $('.item.is-open'); if (!open) return;
    var inside = open.contains(document.activeElement);
    setOpen(open, false); if (inside) $('.obj', open).focus();
  });

  $('[data-list-toggle]').addEventListener('click', function () {
    var list = $('#shelf-list'), show = list.hidden;
    list.hidden = !show; this.setAttribute('aria-expanded', show ? 'true' : 'false');
    this.textContent = show ? 'Hide list' : 'View all as list';
  });

  /* ---------- moods ---------- */
  function renderMoods() {
    var row = $('[data-moods]');
    row.innerHTML = D.MOODS.map(function (m) {
      var pressed = m.key === state.mood;
      return '<button type="button" class="mood" data-mood="' + m.key + '" aria-pressed="' + pressed + '" tabindex="' + (pressed ? 0 : -1) + '">' +
        '<span class="mood-art" aria-hidden="true">' + MOOD_ART[m.key].map(function (id) { return D.art(D.byId(id), 0); }).join('') + '</span>' +
        '<span class="mood-label">' + esc(m.label) + '</span><span class="mood-note">' + esc(m.note) + '</span></button>';
    }).join('');
  }
  function applyMood(announce) {
    var mood = D.MOODS.filter(function (m) { return m.key === state.mood; })[0];
    $$('.mood').forEach(function (b) { var on = b.getAttribute('data-mood') === state.mood; b.setAttribute('aria-pressed', on); b.tabIndex = on ? 0 : -1; });
    $$('.item').forEach(function (it) { it.classList.toggle('is-dim', !D.inMood(D.byId(it.getAttribute('data-id')), state.mood)); });
    $$('#shelf-list li').forEach(function (li) { li.classList.toggle('is-dim', !D.inMood(D.byId(li.getAttribute('data-id')), state.mood)); });
    renderGrid();
    var n = D.PRODUCTS.filter(function (p) { return D.inMood(p, state.mood); }).length;
    $('[data-collection-title]').textContent = state.mood === 'all' ? 'Everything on the shelf' : mood.label;
    $('[data-count]').textContent = n + (n === 1 ? ' object' : ' objects') + (state.mood === 'all' ? '' : ' · ' + mood.note.toLowerCase());
    $('[data-shelf-hint]').innerHTML = state.mood === 'all'
      ? '<b>Select any object</b> to see its name and price. <span class="swipe-hint">Swipe each shelf sideways for more →</span>'
      : '<b>' + esc(mood.label) + ':</b> ' + n + ' objects highlighted on the shelf. <span class="swipe-hint">Swipe each shelf sideways for more →</span>';
    M.Store.set('mood', state.mood);
  }
  $('[data-moods]').addEventListener('click', function (e) {
    var b = e.target.closest('.mood'); if (!b) return;
    state.mood = b.getAttribute('data-mood'); applyMood(true);
  });
  $('[data-moods]').addEventListener('keydown', function (e) {
    var keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    var btns = $$('.mood'), i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    var next;
    if (keys[e.key]) next = (i + keys[e.key] + btns.length) % btns.length;
    else if (e.key === 'Home') next = 0; else if (e.key === 'End') next = btns.length - 1; else return;
    e.preventDefault();
    btns.forEach(function (b, j) { b.tabIndex = j === next ? 0 : -1; });
    btns[next].focus();
  });

  /* ---------- collection grid ---------- */
  function renderGrid() {
    var list = D.PRODUCTS.filter(function (p) { return D.inMood(p, state.mood); });
    $('[data-grid]').innerHTML = list.map(function (p) {
      return '<li class="card">' +
        '<a class="plinth-link" href="product.html?id=' + p.id + '" tabindex="-1" aria-hidden="true">' + D.art(p, 0) + '<div class="plinth pc-' + p.plinth + '"></div></a>' +
        '<div class="card-body"><h3><a href="product.html?id=' + p.id + '">' + esc(p.name) + '</a></h3><span class="card-price">' + D.money(p.price) + '</span>' +
        '<p class="card-meta"><span class="swatches" aria-hidden="true">' + p.colors.map(function (c) { return '<i style="background:' + (c.c.body || c.c.stripe || c.c.glaze || c.c.frame || c.c.skin || c.c.lid || c.c.a || c.c.cover || c.c.back || c.c.metal) + '"></i>'; }).join('') + '</span>' +
        p.colors.length + ' colors · ' + esc(p.size) + '</p></div>' +
        '<button type="button" class="btn btn-cherry" data-card-add="' + p.id + '">Add to bag<span class="sr-only"> — ' + esc(p.name) + ', ' + esc(p.colors[0].label) + '</span></button>' +
        '<p class="added-note" data-added="' + p.id + '" aria-live="polite"></p></li>';
    }).join('');
  }
  $('[data-grid]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-card-add]'); if (!b) return;
    var p = D.byId(b.getAttribute('data-card-add'));
    M.Bag.addItem(p.id, p.colors[0].key, 1);
    $('[data-added="' + p.id + '"]').textContent = 'Added (' + p.colors[0].label + '). Other colors on the product page.';
    M.toast(p.name + ' added to your demo bag.', true);
  });

  /* ---------- gift builder ---------- */
  function saveGift() { M.Store.set('gift', state.gift); }
  function picked(id) { return state.gift.items.some(function (i) { return i.id === id; }); }

  function renderPicks() {
    $('[data-picks]').innerHTML = D.PRODUCTS.map(function (p) {
      return '<li><button type="button" class="pick" data-pick="' + p.id + '" aria-pressed="false">' + D.art(p, 0) +
        '<span class="pn">' + esc(p.name) + '</span><span class="pp">' + D.money(p.price) + '</span></button></li>';
    }).join('');
    $('[data-packs]').innerHTML = D.PACKAGING.map(function (k) {
      var sw = k.key === 'kraft' ? '#C99E6C' : k.key === 'tin' ? '#3153D9' : '#D44948';
      return '<div class="pack-opt"><input type="radio" name="pack" id="pack-' + k.key + '" value="' + k.key + '"><label for="pack-' + k.key + '"><span class="sw" style="background:' + sw + '"></span>' +
        '<span class="pl">' + esc(k.label) + '</span><span class="pp">+' + D.money(k.price) + '</span></label></div>';
    }).join('');
  }

  function renderGift() {
    var g = state.gift, full = g.items.length >= D.GIFT.max;
    $$('[data-pick]').forEach(function (b) {
      var on = picked(b.getAttribute('data-pick'));
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (!on && full) b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled');
    });
    $$('input[name="pack"]').forEach(function (r) { r.checked = r.value === g.pack; });
    var pack = D.packBy(g.pack);
    var stage = $('[data-pack-stage]');
    stage.className = 'pack pack-' + pack.key;
    $('[data-pack-label]').textContent = pack.label;

    var slots = '';
    for (var s = 0; s < D.GIFT.max; s++) {
      var it = g.items[s];
      if (it) {
        var p = D.byId(it.id);
        slots += '<li class="slot is-filled">' + D.art(p, 0, it.color) + '<span class="slot-name">' + esc(p.name) + '</span>' +
          '<button type="button" class="slot-remove" data-unpick="' + p.id + '" aria-label="Remove ' + esc(p.name) + ' from gift set">×</button></li>';
      } else {
        slots += '<li class="slot"><span class="slot-empty"><b aria-hidden="true">+</b>Slot ' + (s + 1) + (s === 2 ? '<br>(optional)' : '') + '</span></li>';
      }
    }
    $('[data-slots]').innerHTML = slots;

    var note = $('[data-note]');
    if (note.value !== g.note) note.value = g.note;
    $('[data-note-count]').textContent = g.note.length + ' / ' + D.GIFT.noteMax;
    $('[data-note-preview]').innerHTML = g.note ? esc(g.note) : '<span class="empty">Your note will appear here.</span>';

    var pr = D.giftPricing(g.items, g.pack), rows = '';
    if (!pr.lines.length) rows += '<tr class="empty-row"><td colspan="2">No objects picked yet.</td></tr>';
    pr.lines.forEach(function (l) { rows += '<tr><th scope="row">' + esc(l.name) + '</th><td>' + D.money(l.price) + '</td></tr>'; });
    rows += '<tr><th scope="row">Packaging: ' + esc(pr.pack.label) + '</th><td data-sum-pack>+' + D.money(pr.packCents) + '</td></tr>';
    rows += '<tr class="sub"><th scope="row">Objects subtotal</th><td data-sum-items>' + D.money(pr.itemsCents) + '</td></tr>';
    rows += '<tr class="save' + (pr.savingsCents ? '' : ' off') + '"><th scope="row">Gift set savings: 10% when 3 items</th><td data-sum-savings>' + (pr.savingsCents ? '−' + D.money(pr.savingsCents) : '$0.00') + '</td></tr>';
    rows += '<tr class="total"><th scope="row">Set total</th><td data-sum-total>' + D.money(pr.totalCents) + '</td></tr>';
    $('[data-summary] tbody').innerHTML = rows;

    var n = g.items.length, hint;
    if (n === 0) hint = 'Pick 2 or 3 objects to start.';
    else if (n === 1) hint = 'One more object to make a set.';
    else if (n === 2) hint = 'Ready as a pair. Add a third object to save 10%.';
    else hint = 'Set is full — 10% off the objects applied.';
    $('[data-gift-hint]').textContent = hint;
    var ready = n >= D.GIFT.min;
    $('[data-add-set]').setAttribute('aria-disabled', ready ? 'false' : 'true');
  }

  $('[data-picks]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick]'); if (!b) return;
    var id = b.getAttribute('data-pick'), g = state.gift;
    $('[data-gift-status]').textContent = '';
    if (picked(id)) g.items = g.items.filter(function (i) { return i.id !== id; });
    else if (g.items.length >= D.GIFT.max) { $('[data-gift-status]').textContent = 'The set holds 3 objects. Remove one to swap.'; return; }
    else g.items.push({ id: id, color: D.byId(id).colors[0].key });
    saveGift(); renderGift();
  });
  $('[data-slots]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-unpick]'); if (!b) return;
    var id = b.getAttribute('data-unpick');
    state.gift.items = state.gift.items.filter(function (i) { return i.id !== id; });
    saveGift(); renderGift();
    var pk = $('[data-pick="' + id + '"]'); if (pk) pk.focus();
  });
  $('[data-packs]').addEventListener('change', function (e) {
    if (e.target.name !== 'pack') return;
    state.gift.pack = e.target.value; saveGift(); renderGift();
  });
  $('[data-note]').addEventListener('input', function () {
    state.gift.note = this.value.slice(0, D.GIFT.noteMax); saveGift(); renderGift();
  });
  $('[data-add-set]').addEventListener('click', function () {
    var g = state.gift, status = $('[data-gift-status]');
    if (g.items.length < D.GIFT.min) { status.textContent = 'Pick at least 2 objects first.'; return; }
    var total = D.giftPricing(g.items, g.pack).totalCents;
    M.Bag.addSet(g.items, g.pack, g.note);
    status.textContent = 'Gift set (' + D.money(total) + ') added to your demo bag.';
    state.gift = { items: [], pack: 'kraft', note: '' }; saveGift(); renderGift();
    M.toast('Gift set added to your demo bag.', true);
  });
  $('[data-clear-set]').addEventListener('click', function () {
    state.gift = { items: [], pack: 'kraft', note: '' }; saveGift(); renderGift();
    $('[data-gift-status]').textContent = 'Gift set cleared.';
  });

  document.addEventListener('my:reset', function () {
    state.mood = 'all'; state.gift = { items: [], pack: 'kraft', note: '' };
    applyMood(); renderGift();
  });

  renderShelf(); renderMoods(); applyMood(); renderPicks(); renderGift();
})();
