/* The Lonely Broomstick concept — menu, shop filter, quick look, basket (preview only: nothing is sent). */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- mobile menu ---------- */
  var drawer = $('#drawer');
  function openDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
    var btn = $('#menuBtn'); if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var c = $('.close', drawer); if (c) c.focus(); }
  }
  var menuBtn = $('#menuBtn');
  if (menuBtn) menuBtn.addEventListener('click', function () { openDrawer(true); });
  if (drawer) {
    $$('.scrim, .close, a', drawer).forEach(function (el) { el.addEventListener('click', function () { openDrawer(false); }); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { openDrawer(false); openBasket(false); }
  });

  /* ---------- basket (in memory, mirrored to localStorage when allowed) ---------- */
  var KEY = 'lb-concept-basket';
  var basket = [];
  try { basket = JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { basket = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(basket)); } catch (e) { /* private mode */ } }
  function money(n) { return '£' + n.toFixed(2); }
  function renderBasket() {
    var count = basket.reduce(function (a, l) { return a + l.qty; }, 0);
    $$('.basket-btn .n').forEach(function (n) { n.textContent = count; });
    var lines = $('#basketLines'); if (!lines) return;
    lines.innerHTML = '';
    if (!basket.length) {
      lines.innerHTML = '<p class="fine">Your basket is empty. Everything on the shelves is handmade by our witches and wizards in Falkirk.</p>';
    }
    basket.forEach(function (l, i) {
      var row = document.createElement('div'); row.className = 'bl';
      row.innerHTML = '<img src="' + l.img + '" alt=""><div><b></b><span></span></div><button type="button" aria-label="Remove">×</button>';
      $('b', row).textContent = l.title + (l.variant ? ' (' + l.variant + ')' : '');
      $('span', row).textContent = l.qty + ' × ' + money(l.price);
      $('button', row).addEventListener('click', function () { basket.splice(i, 1); save(); renderBasket(); });
      lines.appendChild(row);
    });
    var tot = basket.reduce(function (a, l) { return a + l.qty * l.price; }, 0);
    var t = $('#basketTotal'); if (t) t.textContent = money(tot);
    var s = $('#basketShip'); if (s) s.textContent = tot > 0 ? 'Free tracked UK delivery. International shipping £8.99.' : '';
  }
  function addToBasket(p, variant, price) {
    var key = p.urlId + '|' + (variant || '');
    var found = basket.filter(function (l) { return l.key === key; })[0];
    if (found) found.qty += 1; else basket.push({ key: key, urlId: p.urlId, title: p.title, variant: variant || '', price: price, qty: 1, img: p.img });
    save(); renderBasket(); toast(p.title + ' added to your basket');
  }
  var basketEl = $('#basket');
  function openBasket(open) {
    if (!basketEl) return;
    basketEl.classList.toggle('open', open);
    basketEl.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var c = $('.close', basketEl); if (c) c.focus(); }
  }
  $$('.basket-btn').forEach(function (b) { b.addEventListener('click', function () { renderBasket(); openBasket(true); }); });
  if (basketEl) $$('.scrim, .close', basketEl).forEach(function (el) { el.addEventListener('click', function () { openBasket(false); }); });
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }
  renderBasket();

  /* ---------- quick look ---------- */
  var products = window.LB_PRODUCTS || [];
  var byId = {}; products.forEach(function (p) { byId[p.urlId] = p; });
  var dlg = $('#quick');
  function quickLook(id) {
    var p = byId[id]; if (!p || !dlg) return;
    $('#qImg').src = p.img; $('#qImg').alt = p.title;
    $('#qTitle').textContent = p.title;
    $('#qDesc').innerHTML = p.desc;
    var sel = $('#qVar'), lab = $('#qVarLab');
    sel.innerHTML = '';
    if (p.variants && p.variants.length > 1) {
      p.variants.forEach(function (v) {
        var o = document.createElement('option'); o.value = v.name; o.textContent = v.name + ' — ' + money(v.price); o.dataset.price = v.price; sel.appendChild(o);
      });
      lab.hidden = false;
    } else { lab.hidden = true; }
    function price() {
      if (p.variants && p.variants.length > 1) return parseFloat(sel.options[sel.selectedIndex].dataset.price);
      return p.price;
    }
    function showPrice() { $('#qPrice').textContent = money(price()); }
    sel.onchange = showPrice; showPrice();
    $('#qAdd').onclick = function () { addToBasket(p, (p.variants && p.variants.length > 1) ? sel.value : '', price()); dlg.close(); };
    $('#qLive').href = 'https://www.lonelybroomstick.co.uk' + p.fullUrl;
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }
  if (dlg) {
    $('.x', dlg).addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-quick]'); if (!a) return;
    e.preventDefault(); quickLook(a.getAttribute('data-quick'));
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]'); if (!b) return;
    e.preventDefault(); var p = byId[b.getAttribute('data-add')]; if (!p) return;
    if (p.variants && p.variants.length > 1) quickLook(p.urlId); else addToBasket(p, '', p.price);
  });

  /* ---------- shop filter ---------- */
  var grid = $('#shopGrid');
  if (grid && products.length) {
    var chips = $$('.chip'), search = $('#search'), countEl = $('#count'), emptyEl = $('#empty');
    var cat = 'All';
    var params = new URLSearchParams(location.search);
    if (params.get('cat')) cat = params.get('cat');
    function card(p) {
      return '<article class="item" data-id="' + p.urlId + '">' +
        '<a href="#" data-quick="' + p.urlId + '" aria-label="Quick look: ' + p.title.replace(/"/g, '&quot;') + '"><figure class="ph"><img src="' + p.img + '" alt="" loading="lazy" width="640" height="640"></figure>' +
        '<p class="t">' + p.title + '</p><p class="pr">' + (p.variants && p.variants.length > 1 ? 'from ' : '') + money(p.price) + '</p></a>' +
        '<button type="button" class="btn btn-paper btn-sm" data-add="' + p.urlId + '">Add to basket</button></article>';
    }
    function render() {
      var q = (search && search.value || '').trim().toLowerCase();
      var list = products.filter(function (p) {
        var okC = cat === 'All' || p.cats.indexOf(cat) !== -1;
        var okQ = !q || (p.title + ' ' + p.cats.join(' ') + ' ' + p.plain).toLowerCase().indexOf(q) !== -1;
        return okC && okQ;
      });
      // shelves of 4
      var html = '';
      for (var i = 0; i < list.length; i += 4) {
        html += '<div class="shelf-row"><div class="grid-shop">' + list.slice(i, i + 4).map(card).join('') + '</div></div>';
      }
      grid.innerHTML = html;
      if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' magical item' : ' magical items') + (cat !== 'All' ? ' in ' + cat : '') + (q ? ' matching “' + q + '”' : '');
      if (emptyEl) emptyEl.hidden = list.length > 0;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.cat === cat ? 'true' : 'false'); });
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        cat = c.dataset.cat; render();
        try { history.replaceState(null, '', cat === 'All' ? location.pathname : '?cat=' + encodeURIComponent(cat)); } catch (e) { /* file:// */ }
      });
    });
    if (search) search.addEventListener('input', render);
    render();
  }

  /* ---------- newsletter (preview) ---------- */
  var nf = $('#newsForm');
  if (nf) nf.addEventListener('submit', function (e) {
    e.preventDefault();
    toast('Preview only: nothing was sent. On the live site this would join the newsletter.');
  });

  /* ---------- map ---------- */
  var mapEl = $('#map');
  if (mapEl && window.L) {
    var map = L.map(mapEl, { scrollWheelZoom: false }).setView([56.0013, -3.7838], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    var icon = L.divIcon({ className: 'pin', html: '<svg width="34" height="44" viewBox="0 0 34 44"><path d="M17 1C8 1 1 8 1 17c0 11 16 26 16 26s16-15 16-26C33 8 26 1 17 1z" fill="#8A1C2B" stroke="#F2CC72" stroke-width="2"/><circle cx="17" cy="17" r="6" fill="#F2CC72"/></svg>', iconSize: [34, 44], iconAnchor: [17, 44] });
    L.marker([56.0013, -3.7838], { icon: icon }).addTo(map).bindPopup('<b>The Lonely Broomstick</b><br>36 High Street, Falkirk FK1 1EU');
  }
})();
