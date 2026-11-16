/* Cahaba Cycles concept — shared behaviour */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };
  var SHOPS = window.CC_SHOPS || [], BIKES = window.CC_BIKES || [], CREW = window.CC_CREW || [];
  var BY = {}; BIKES.forEach(function (b) { BY[b.id] = b; });
  var SHOP = {}; SHOPS.forEach(function (s) { SHOP[s.id] = s; });

  /* ---------- toast ---------- */
  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 4200);
  }
  window.ccToast = toast;

  /* ---------- live hours (America/Chicago) ---------- */
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var DAY3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function nowCT() {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
    return { dow: DAY3.indexOf(o.weekday), h: (+o.hour % 24) + (+o.minute) / 60, ymd: o.year + '-' + o.month + '-' + o.day };
  }
  function fmtH(h) {
    var hr = Math.floor(h), mn = Math.round((h - hr) * 60), ap = hr >= 12 ? 'pm' : 'am', h12 = hr % 12 || 12;
    return h12 + (mn ? ':' + String(mn).padStart(2, '0') : '') + ' ' + ap;
  }
  function hoursFor(shop, dow) { return shop.hours[dow]; }
  function status(shop) {
    var n = nowCT(), today = hoursFor(shop, n.dow);
    if (today && n.h >= today[0] && n.h < today[1]) {
      var left = today[1] - n.h;
      return left <= 1 ? { cls: 'soon', text: 'Closes soon, ' + fmtH(today[1]) } : { cls: 'open', text: 'Open till ' + fmtH(today[1]) };
    }
    if (today && n.h < today[0]) return { cls: 'closed', text: 'Opens today ' + fmtH(today[0]) };
    for (var i = 1; i <= 7; i++) {
      var d = (n.dow + i) % 7, hh = hoursFor(shop, d);
      if (hh) return { cls: 'closed', text: 'Closed, opens ' + (i === 1 ? 'tomorrow' : DAY3[d]) + ' ' + fmtH(hh[0]) };
    }
    return { cls: 'closed', text: 'Closed' };
  }
  function paintStatus() {
    $$('[data-status]').forEach(function (el) {
      var s = SHOP[el.getAttribute('data-status')]; if (!s) return;
      var st = status(s);
      el.className = 'st ' + st.cls; el.textContent = st.text;
    });
    var dow = nowCT().dow;
    $$('table.hours tr[data-dow]').forEach(function (tr) { tr.classList.toggle('today', +tr.getAttribute('data-dow') === dow); });
    var openN = SHOPS.filter(function (s) { return !s.demo && status(s).cls !== 'closed'; }).length;
    $$('[data-open-count]').forEach(function (el) {
      el.textContent = openN === 0 ? 'All five shops are closed right now. Here’s when each one opens.' : openN === 5 ? 'All five shops are open right now.' : (openN === 1 ? 'One shop is open right now.' : ['', '', 'Two', 'Three', 'Four'][openN] + ' of our five shops are open right now.');
    });
  }
  paintStatus(); setInterval(paintStatus, 60000);

  /* ---------- nearest shop ---------- */
  function miles(a, b) {
    var R = 3958.8, toR = Math.PI / 180, dLa = (b[0] - a[0]) * toR, dLo = (b[1] - a[1]) * toR;
    var x = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a[0] * toR) * Math.cos(b[0] * toR) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  $$('[data-near]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!navigator.geolocation) { toast('This browser can’t share location. Pick a shop from the list.'); return; }
      btn.disabled = true; var lbl = btn.textContent; btn.textContent = 'Finding you…';
      navigator.geolocation.getCurrentPosition(function (pos) {
        var me = [pos.coords.latitude, pos.coords.longitude];
        var best = SHOPS.filter(function (s) { return !s.demo; }).map(function (s) { return { s: s, d: miles(me, s.ll) }; }).sort(function (a, b) { return a.d - b.d; })[0];
        $$('.route li').forEach(function (li) { li.classList.toggle('near', li.getAttribute('data-shop') === best.s.id); });
        $$('.netmap .stop').forEach(function (c) { c.classList.toggle('hl', c.getAttribute('data-shop') === best.s.id); });
        var li = $('.route li[data-shop="' + best.s.id + '"]'); if (li) li.scrollIntoView({ block: 'center', behavior: 'smooth' });
        toast('Closest shop: ' + best.s.name + ', about ' + Math.max(1, Math.round(best.d)) + ' mi away. ' + status(best.s).text + '.');
        btn.disabled = false; btn.textContent = lbl;
      }, function () {
        toast('Location is off. Pick a shop from the list below.');
        btn.disabled = false; btn.textContent = lbl;
      }, { timeout: 10000, maximumAge: 600000 });
    });
  });

  /* ---------- menu ---------- */
  var menu = $('#menu'), mbtn = $('.menu-btn');
  if (menu && mbtn) {
    mbtn.addEventListener('click', function () {
      var open = !menu.classList.contains('open');
      menu.classList.toggle('open', open); mbtn.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) { menu.classList.remove('open'); mbtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; } });
  }

  /* ---------- overlays ---------- */
  var scrim = $('.scrim'), lastFocus = null, openLayer = null;
  function openL(el) {
    lastFocus = document.activeElement; openLayer = el;
    el.classList.add('open'); scrim.classList.add('open'); document.body.style.overflow = 'hidden';
    var f = el.querySelector('[data-autofocus]') || el.querySelector('button,a,input,select'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 30);
  }
  function closeL() {
    if (!openLayer) return;
    var el = openLayer; openLayer = null;
    el.classList.remove('open'); scrim.classList.remove('open'); document.body.style.overflow = '';
    if (el.id === 'sheet') syncURL(null);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  if (scrim) scrim.addEventListener('click', closeL);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeL();
    if (e.key === 'Tab' && openLayer) {
      var f = $$('button:not([disabled]),a[href],input,select,textarea', openLayer).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', closeL); });

  /* ---------- cart ---------- */
  var cart = store.get('cc_cart_v1', []);
  function saveCart() { store.set('cc_cart_v1', cart); paintCart(); }
  function paintCart() {
    var n = cart.reduce(function (a, i) { return a + i.q; }, 0);
    $$('.count[data-cart]').forEach(function (c) { c.textContent = n; c.setAttribute('data-n', n); });
    var body = $('#cart-items'); if (!body) return;
    if (!cart.length) { body.innerHTML = '<p class="mute" style="padding:28px 0">Your cart is empty. <a href="bikes.html">See bikes in stock</a>.</p>'; }
    else body.innerHTML = cart.map(function (it, i) {
      var b = BY[it.id]; if (!b) return '';
      return '<div class="line-item"><img src="img/b/' + b.id + '.webp" alt=""><div><b>' + esc(b.b + ' ' + b.n) + '</b><div class="small mute">' + esc([it.s && ('Size ' + it.s), it.k].filter(Boolean).join(', ')) + (it.q > 1 ? ' (×' + it.q + ')' : '') + '</div><button class="rm" data-rm="' + i + '">Remove</button></div><div class="price">' + money(b.p * it.q) + '</div></div>';
    }).join('');
    var sub = cart.reduce(function (a, it) { return a + (BY[it.id] ? BY[it.id].p * it.q : 0); }, 0);
    var st = $('#cart-sub'); if (st) st.textContent = money(sub);
  }
  document.addEventListener('click', function (e) {
    var rm = e.target.closest('[data-rm]');
    if (rm) { cart.splice(+rm.getAttribute('data-rm'), 1); saveCart(); }
    if (e.target.closest('[data-open-cart]')) { paintCart(); openL($('#cart')); }
    if (e.target.closest('[data-checkout]')) toast('Checkout isn’t connected in this concept. On the live site this button opens Shopify checkout.');
  });
  paintCart();

  /* ---------- sizing ---------- */
  var MTB = { XS: [53.9, 61], S: [60.2, 63.8], M: [63.4, 67.7], ML: [66.9, 70.5], L: [69.7, 74], XL: [73.2, 77.2], XXL: [76.8, 79] };
  var HYB = { S: [60.6, 65.7], M: [64.6, 69.7], L: [68.2, 73.6], XL: [72.8, 77.6] };
  var ROAD = { 47: [59.8, 62.2], 50: [62.2, 64.2], 52: [64.2, 66.1], 54: [66.1, 68.5], 56: [68.5, 70.9], 58: [70.9, 72.8], 60: [72.8, 74.8], 62: [74.8, 76.8] };
  var KIDS = { '12"': [36, 39], '16"': [41, 48], '20"': [45, 54], '24"': [49, 59], '26"': [56, 99] };
  var AVENTON = { Regular: [63, 70], L: [67, 73] };
  function sizeRange(size, b) {
    if (b.c === 'kids') return KIDS[size] || null;
    if (b.c === 'comfort') return null;
    if (b.b === 'Aventon' && AVENTON[size]) return AVENTON[size];
    var cm = /^(\d+(?:\.\d)?)cm$/.exec(size);
    if (cm) {
      var v = +cm[1], best = null, bd = 9;
      Object.keys(ROAD).forEach(function (k) { var d = Math.abs(+k - v); if (d <= 1.01 && d < bd) { bd = d; best = ROAD[k]; } });
      return best;
    }
    if (b.c === 'hybrid' && HYB[size]) return HYB[size];
    return MTB[size] || null;
  }
  function fitsOf(b, h) {
    if (!h) return null;
    var known = b.s.filter(function (s) { return sizeRange(s, b); });
    if (!known.length) return { unknown: true, sizes: [] };
    return { sizes: known.filter(function (s) { var r = sizeRange(s, b); return h >= r[0] - 0.3 && h <= r[1] + 0.3; }) };
  }
  function fmtHeight(h) { return Math.floor(h / 12) + '′ ' + (h % 12) + '″'; }
  var height = +store.get('cc_height', 0) || 0;

  /* ---------- bike cards ---------- */
  var CATS = { mtb: 'Mountain', road: 'Road', gravel: 'Gravel', ebike: 'E-bikes', hybrid: 'Hybrid & fitness', comfort: 'Comfort', kids: 'Kids', used: 'Pre-owned & demo' };
  function card(b, tag) {
    var f = fitsOf(b, height);
    var flag = '';
    if (f && !f.unknown) flag = f.sizes.length ? '<span class="fitflag">Fits you: ' + esc(f.sizes.join(', ')) + '</span>' : '<span class="fitflag no">Not in your size</span>';
    var sizes = b.s.length ? '<div class="sizes" aria-label="Sizes in stock">' + b.s.slice(0, 8).map(function (s) { return '<span' + (f && f.sizes && f.sizes.indexOf(s) > -1 ? ' class="fit"' : '') + '>' + esc(s) + '</span>'; }).join('') + '</div>' : (b.u > 1 ? '<div class="small mute">' + b.u + ' available</div>' : '');
    var price = '<span class="price' + (b.w ? ' sale' : '') + '">' + money(b.p) + '</span>' + (b.w ? '<span class="was">' + money(b.w) + '</span>' : '');
    return '<' + (tag || 'button') + ' class="bike" type="button" data-bike="' + b.id + '" aria-label="' + esc(b.b + ' ' + b.n + ', ' + money(b.p)) + '">' + flag +
      '<span class="ph"><img src="img/b/' + b.id + '.webp" alt="" loading="lazy" width="560" height="420"></span>' +
      '<span class="bd"><span class="br">' + esc(b.c === 'used' ? CATS.used : b.b) + '</span><span class="nm">' + esc(b.n) + '</span>' + sizes + '<span class="pz">' + price + '</span></span></' + (tag || 'button') + '>';
  }
  document.addEventListener('click', function (e) { var c = e.target.closest('[data-bike]'); if (c) openBike(c.getAttribute('data-bike')); });

  // home rail
  var rail = $('#rail');
  if (rail) rail.innerHTML = rail.getAttribute('data-ids').split(',').map(function (id) { return BY[id] ? card(BY[id]) : ''; }).join('');

  /* ---------- catalog ---------- */
  var cat = $('#catalog'), state = { c: 'all', b: 'all', q: '', sort: 'feat', mine: false };
  function syncURL(bikeId) {
    if (!cat) { return; }
    var p = new URLSearchParams();
    if (state.c !== 'all') p.set('c', state.c);
    if (state.b !== 'all') p.set('brand', state.b);
    if (state.q) p.set('q', state.q);
    if (state.sort !== 'feat') p.set('sort', state.sort);
    if (bikeId) p.set('bike', bikeId);
    var qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }
  function renderCatalog() {
    var list = BIKES.filter(function (b) {
      if (state.c !== 'all' && b.c !== state.c) return false;
      if (state.b !== 'all' && b.b !== state.b) return false;
      if (state.q) { var hay = (b.b + ' ' + b.n + ' ' + CATS[b.c] + ' ' + b.k.join(' ')).toLowerCase(); if (state.q.toLowerCase().split(/\s+/).some(function (w) { return hay.indexOf(w) < 0; })) return false; }
      if (state.mine && height) { var f = fitsOf(b, height); if (!f || f.unknown || !f.sizes.length) return false; }
      return true;
    });
    if (state.sort === 'lo') list.sort(function (a, b) { return a.p - b.p; });
    else if (state.sort === 'hi') list.sort(function (a, b) { return b.p - a.p; });
    else if (state.sort === 'deal') list.sort(function (a, b) { return ((b.w ? 1 - b.p / b.w : 0) - (a.w ? 1 - a.p / a.w : 0)); });
    else {
      var order = ['mtb', 'ebike', 'road', 'gravel', 'hybrid', 'kids', 'comfort', 'used'];
      list.sort(function (a, b) {
        if (height) { var fa = fitsOf(a, height), fb = fitsOf(b, height); var sa = fa && fa.sizes && fa.sizes.length ? 0 : 1, sb = fb && fb.sizes && fb.sizes.length ? 0 : 1; if (sa !== sb) return sa - sb; }
        return order.indexOf(a.c) - order.indexOf(b.c) || (a.b === 'Trek' ? 0 : 1) - (b.b === 'Trek' ? 0 : 1) || a.p - b.p;
      });
    }
    $('#grid').innerHTML = list.length ? list.map(function (b) { return card(b); }).join('') : '<div class="empty" style="grid-column:1/-1"><p class="d4">No bikes match all of that.</p><p class="mute" style="margin-top:6px">Clear a filter, or text a shop about what you’re after.</p><p style="margin-top:14px"><button class="btn btn-sm" type="button" data-clear>Clear filters</button></p></div>';
    $('#count').textContent = list.length + (list.length === 1 ? ' bike' : ' bikes') + (state.c !== 'all' ? ' in ' + CATS[state.c].toLowerCase() : '') + (state.mine && height ? ' in your size' : '');
    $$('[data-cat]').forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-cat') === state.c); });
    syncURL(null);
  }
  if (cat) {
    var qp = new URLSearchParams(location.search);
    if (qp.get('c') && (CATS[qp.get('c')] || qp.get('c') === 'all')) state.c = qp.get('c');
    if (qp.get('brand')) state.b = qp.get('brand');
    if (qp.get('q')) state.q = qp.get('q');
    if (qp.get('sort')) state.sort = qp.get('sort');
    var hsel = $('#height'), mine = $('#mine'), q = $('#q'), sort = $('#sort'), brand = $('#brand');
    var hs = ['<option value="0">Pick your height</option>'];
    for (var h = 36; h <= 80; h++) hs.push('<option value="' + h + '">' + fmtHeight(h) + (h < 56 ? ' (kids)' : '') + '</option>');
    hsel.innerHTML = hs.join(''); hsel.value = String(height);
    var paintMine = function () { mine.disabled = !height; mine.closest('.toggle').setAttribute('aria-disabled', !height); if (!height) { mine.checked = false; state.mine = false; } $('#fit-note').textContent = height ? 'Green sizes are your starting size from our size guide. A free sizing at the shop confirms it.' : 'We’ll mark the sizes that fit you on every bike.'; };
    paintMine();
    hsel.addEventListener('change', function () { height = +hsel.value; store.set('cc_height', height); if (height && height < 56 && state.c === 'all') state.c = 'kids'; paintMine(); renderCatalog(); });
    mine.addEventListener('change', function () { state.mine = mine.checked; renderCatalog(); });
    q.value = state.q; q.addEventListener('input', function () { state.q = q.value.trim(); renderCatalog(); });
    sort.value = state.sort; sort.addEventListener('change', function () { state.sort = sort.value; renderCatalog(); });
    brand.value = state.b; brand.addEventListener('change', function () { state.b = brand.value; renderCatalog(); });
    $$('[data-cat]').forEach(function (c) { c.addEventListener('click', function () { state.c = c.getAttribute('data-cat'); renderCatalog(); }); });
    document.addEventListener('click', function (e) { if (e.target.closest('[data-clear]')) { state = { c: 'all', b: 'all', q: '', sort: 'feat', mine: false }; q.value = ''; sort.value = 'feat'; brand.value = 'all'; mine.checked = false; renderCatalog(); } });
    renderCatalog();
    var pendingBike = qp.get('bike');
  }

  /* ---------- product sheet ---------- */
  var sheet = $('#sheet'), cur = null;
  function openBike(id) {
    var b = BY[id]; if (!b || !sheet) return;
    cur = { b: b, s: null, k: b.k[0] || null, img: 0 };
    var f = fitsOf(b, height);
    if (f && f.sizes && f.sizes.length) cur.s = f.sizes[0]; else if (b.s.length === 1) cur.s = b.s[0];
    paintSheet(); openL(sheet); syncURL(id);
  }
  function imgURL(b, i) { return b.g[i] ? b.g[i] + '?width=1000' : 'img/b/' + b.id + '.webp'; }
  function paintSheet() {
    var b = cur.b, f = fitsOf(b, height);
    var thumbs = b.g.length > 1 ? '<div class="thumbs">' + b.g.map(function (g, i) { return '<button type="button" data-img="' + i + '" aria-label="Photo ' + (i + 1) + '" aria-current="' + (i === cur.img) + '"><img src="' + g + '?width=160" alt="" onerror="this.src=\'img/b/' + b.id + '.webp\'"></button>'; }).join('') + '</div>' : '';
    var sizes = b.s.length ? '<div><div class="opt-h"><span>Size' + (cur.s ? ': ' + esc(cur.s) : '') + '</span>' + (height ? '<span class="mute small">You: ' + fmtHeight(height) + '</span>' : '<a class="small" href="bikes.html#fit">Find my size</a>') + '</div><div class="opts">' + b.s.map(function (s) { var fit = f && f.sizes && f.sizes.indexOf(s) > -1; return '<button type="button" class="opt' + (fit ? ' fit' : '') + '" data-size="' + esc(s) + '" aria-pressed="' + (cur.s === s) + '"' + (fit ? ' title="Fits your height"' : '') + '>' + esc(s) + '</button>'; }).join('') + '</div>' + (f && !f.unknown ? '<p class="small mute" style="margin-top:8px">' + (f.sizes.length ? 'Underlined sizes fit ' + fmtHeight(height) + ' on our size guide.' : 'None of these sizes is a match for ' + fmtHeight(height) + ' on our size guide. Text a shop about other sizes.') + '</p>' : '') + '</div>' : '';
    var colors = b.k.length > 1 ? '<div><div class="opt-h"><span>Color: ' + esc(cur.k) + '</span></div><div class="opts">' + b.k.map(function (k) { return '<button type="button" class="opt" data-color="' + esc(k) + '" aria-pressed="' + (cur.k === k) + '">' + esc(k) + '</button>'; }).join('') + '</div></div>' : (b.k.length ? '<p class="small"><b>Color:</b> ' + esc(b.k[0]) + '</p>' : '');
    var shops = SHOPS.filter(function (s) { return !s.demo; });
    var pick = store.get('cc_shop', 'homewood');
    $('#sheet-body').innerHTML = '<div class="sheet-in"><div class="gal"><div class="main"><img id="gal-main" src="' + imgURL(b, cur.img) + '" alt="' + esc(b.b + ' ' + b.n) + '" onerror="this.onerror=null;this.src=\'img/b/' + b.id + '.webp\'"></div>' + thumbs + '</div>' +
      '<div class="info"><div><div class="small mute" style="font-weight:700">' + esc(b.c === 'used' ? CATS.used : b.b + ', ' + CATS[b.c]) + '</div><h2 class="d3" id="sheet-title" style="margin-top:4px">' + esc(b.n) + '</h2></div>' +
      '<div><span class="price' + (b.w ? ' sale' : '') + '">' + money(b.p) + '</span>' + (b.w ? ' <span class="was">' + money(b.w) + '</span>' : '') + '</div>' + sizes + colors +
      '<button class="btn" type="button" data-add>Add to cart</button>' +
      '<div><label class="opt-h" for="ask-shop"><span>Ask a shop if it’s on the floor</span></label><div class="ask"><select class="sel" id="ask-shop">' + shops.map(function (s) { return '<option value="' + s.id + '"' + (s.id === pick ? ' selected' : '') + '>' + esc(s.name) + '</option>'; }).join('') + '</select><a class="btn btn-line" id="ask-go" href="#">Text this shop</a></div></div>' +
      '<p class="note">Every new bike from us comes with a free sizing, a free 6-month tune-up and our 5-year parts warranty.</p>' +
      (b.d ? '<div class="desc">' + esc(b.d) + '</div>' : '') + '</div></div>';
    paintAsk();
  }
  function paintAsk() {
    var sel = $('#ask-shop'), a = $('#ask-go'); if (!sel || !a) return;
    var s = SHOP[sel.value], b = cur.b;
    var body = 'Hi! Do you have the ' + b.b + ' ' + b.n + (cur.s ? ' in size ' + cur.s : '') + (cur.k ? ' (' + cur.k + ')' : '') + ' at ' + s.name + '?';
    a.href = 'sms:' + s.tel + '?&body=' + encodeURIComponent(body);
    a.setAttribute('aria-label', 'Text ' + s.name + ' about this bike');
  }
  if (sheet) {
    sheet.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-img]'))) { cur.img = +t.getAttribute('data-img'); $('#gal-main').src = imgURL(cur.b, cur.img); $$('[data-img]', sheet).forEach(function (x) { x.setAttribute('aria-current', x === t); }); }
      if ((t = e.target.closest('[data-size]'))) { cur.s = t.getAttribute('data-size'); var keep = cur.img; paintSheet(); cur.img = keep; }
      if ((t = e.target.closest('[data-color]'))) { cur.k = t.getAttribute('data-color'); paintSheet(); }
      if (e.target.closest('[data-add]')) {
        if (cur.b.s.length > 1 && !cur.s) { toast('Pick a size first.'); return; }
        var ex = cart.filter(function (i) { return i.id === cur.b.id && i.s === cur.s && i.k === cur.k; })[0];
        if (ex) ex.q++; else cart.push({ id: cur.b.id, s: cur.s, k: cur.k, q: 1 });
        saveCart(); closeL(); toast('Added to cart: ' + cur.b.n + (cur.s ? ', size ' + cur.s : '') + '.');
      }
    });
    sheet.addEventListener('change', function (e) { if (e.target.id === 'ask-shop') { store.set('cc_shop', e.target.value); paintAsk(); } });
  }

  if (cat && pendingBike && BY[pendingBike]) openBike(pendingBike);

  /* ---------- crew question switcher ---------- */
  var CQ = { mem: 'their best memory on a bike', snack: 'their go-to gas-station snack', animal: 'the animal they identify with', why: 'why they work at Cahaba' };
  function paintCrew(k) {
    $$('[data-ans]').forEach(function (el) {
      var p = CREW[+el.getAttribute('data-ans')], a = p && p.a[k];
      el.textContent = a || 'Hasn’t answered this one yet. Ask in the shop.';
      el.classList.toggle('none', !a);
    });
    $$('[data-q]').forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-q') === k); });
    $$('[data-qlabel]').forEach(function (el) { el.textContent = CQ[k]; });
  }
  if ($('[data-q]')) { $$('[data-q]').forEach(function (c) { c.addEventListener('click', function () { paintCrew(c.getAttribute('data-q')); }); }); paintCrew('snack'); }

  /* ---------- service picker ---------- */
  var hrs = $('#hrs');
  if (hrs) {
    var out = $('#hrs-out'), rec = $('#hrs-rec');
    var paint = function () {
      var v = +hrs.value, lv = v <= 25 ? 1 : v <= 50 ? 2 : 3;
      out.textContent = v + (v >= 120 ? '+' : '') + ' hrs';
      rec.innerHTML = v < 5 ? 'Nearly new? A <b>Level 1</b> keeps it that way, and new bikes from us get their first tune-up free.' : '<b>Level ' + lv + '</b> is built for about ' + [25, 50, 100][lv - 1] + ' ride hours. ' + ['Adjustments, lube and a safety check.', 'Adds a deep drivetrain clean, a full wash and trued wheels.', 'We take the whole bike apart, clean it and build it back up.'][lv - 1];
      $$('.cmp [data-lv]').forEach(function (c) { c.classList.toggle('hl', +c.getAttribute('data-lv') === lv); });
    };
    hrs.addEventListener('input', paint); paint();
  }
  $$('[data-book]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = $('#book'); if (!f) return;
      var sel = f.querySelector('[name=what]'); if (sel) sel.value = b.getAttribute('data-book');
      f.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function () { var n = f.querySelector('[name=name]'); if (n) n.focus({ preventScroll: true }); }, 450);
    });
  });
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      toast(f.getAttribute('data-demo'));
      f.reset();
    });
  });

  /* ---------- trails tabs ---------- */
  $$('[data-tab]').forEach(function (t) {
    t.addEventListener('click', function () {
      var k = t.getAttribute('data-tab');
      $$('[data-tab]').forEach(function (x) { x.setAttribute('aria-pressed', x === t); });
      $$('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== k; });
    });
  });

  /* ---------- events: auto-archive by date ---------- */
  var evl = $('#events');
  if (evl) {
    var today = nowCT().ymd;
    var items = $$('li[data-date]', evl);
    items.forEach(function (li) {
      var end = li.getAttribute('data-end') || li.getAttribute('data-date');
      var past = end < today, badge = li.querySelector('.badge');
      li.classList.toggle('past', past);
      var days = Math.round((new Date(li.getAttribute('data-date') + 'T12:00:00') - new Date(today + 'T12:00:00')) / 864e5);
      if (!past && days <= 45) li.classList.add('soon');
      if (badge) badge.textContent = past ? 'Done for 2026' : days <= 0 ? 'Happening now' : days === 1 ? 'Tomorrow' : 'In ' + days + ' days';
    });
    items.sort(function (a, b) {
      var pa = a.classList.contains('past'), pb = b.classList.contains('past');
      if (pa !== pb) return pa ? 1 : -1;
      return pa ? b.getAttribute('data-date').localeCompare(a.getAttribute('data-date')) : a.getAttribute('data-date').localeCompare(b.getAttribute('data-date'));
    }).forEach(function (li) { evl.appendChild(li); });
  }
})();
