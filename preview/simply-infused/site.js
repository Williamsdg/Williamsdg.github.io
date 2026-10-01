/* Simply Infused concept — Williams Digital.
   Catalog comes from data.js (generated from the shop's Shopify feed). The cart hands off to the
   shop's existing Shopify checkout through a cart permalink, so nothing here touches payments. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var STORE = 'https://www.simply-infused.com';
  var TZ = 'America/Chicago';
  var CAT = window.SI_CATALOG || [];
  var BY = {};
  CAT.forEach(function (p) { BY[p.h] = p; });

  var KIND = { evoo: 'Ultra Premium EVOO', infused: 'Infused Olive Oil', dark: 'Dark Balsamic', white: 'White Balsamic', gift: 'Gift Set' };
  var SHELVES = [['all', 'Everything'], ['evoo', 'Extra Virgin'], ['infused', 'Fused & Infused'], ['dark', 'Dark Balsamic'], ['white', 'White Balsamic'], ['gift', 'Gifts']];
  var MOODS = [['best', 'Best sellers'], ['spicy', 'Spicy'], ['citrus', 'Citrus'], ['herb', 'Herb'], ['fruit', 'Fruit'], ['sweet', 'Sweet & dessert'], ['savory', 'Savory']];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return '$' + n.toFixed(2); }
  function img(p) { return 'img/p/' + p.h + '.jpg'; }
  function isOil(p) { return p.k === 'evoo' || p.k === 'infused'; }
  function fullName(p) { return p.k === 'evoo' ? p.s + ' EVOO' : p.s; }

  /* ── time in Birmingham ── */
  function nowCT() {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'long', hour: 'numeric', minute: 'numeric', month: 'numeric', hour12: false }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (x) { o[x.type] = x.value; });
    return { day: DAYS.indexOf(o.weekday), mins: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10), month: parseInt(o.month, 10) };
  }
  var NOW = nowCT();
  var OPEN = 600, CLOSE = 1020; // Mon–Sat 10a–5p

  function openState() {
    var d = NOW.day, m = NOW.mins;
    if (d !== 0 && m >= OPEN && m < CLOSE) return { open: true, bar: 'Open now · until 5p', k: 'Open now', v: 'Until 5p today' };
    if (d !== 0 && m < OPEN) return { open: false, bar: 'Opens today at 10a', k: 'Tasting room', v: 'Opens today at 10a' };
    var next = d === 6 ? 'Monday' : DAYS[(d + 1) % 7];
    var when = d === 6 ? 'Monday' : 'tomorrow';
    return { open: false, bar: 'Closed · opens ' + when + ' at 10a', k: 'Tasting room', v: 'Opens ' + next + ' at 10a' };
  }

  (function initStatus() {
    var s = openState(), el = $('#openStatus');
    el.classList.add(s.open ? 'open' : 'closed');
    $('#openText').textContent = s.bar;
    $('#heroOpenK').textContent = s.k;
    $('#heroOpenV').textContent = s.v;
    $('#hours').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(function (d) {
      return '<li' + (d === NOW.day ? ' class="today"' : '') + '><span>' + DAYS[d] + '</span><span>' + (d === 0 ? 'Closed' : '10a – 5p') + '</span></li>';
    }).join('');
  })();

  /* ── toast ── */
  var toastT;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('on'); }, 2600);
  }

  /* ── cart ── */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem('si-cart-v1') || '[]') || []; } catch (e) { cart = []; }
  cart = cart.filter(function (l) { return BY[l.h]; });
  function saveCart() { try { localStorage.setItem('si-cart-v1', JSON.stringify(cart)); } catch (e) { /* private mode */ } }

  function addToCart(p, size, note) {
    note = note || '';
    var line = cart.filter(function (l) { return l.id === size.id && (l.note || '') === note; })[0];
    if (line) line.qty += 1;
    else cart.push({ id: size.id, h: p.h, label: size.label, price: size.price, qty: 1, note: note });
    saveCart(); renderCart();
    toast('Added: ' + fullName(p) + ' · ' + size.label);
  }
  function cartCount() { return cart.reduce(function (n, l) { return n + l.qty; }, 0); }
  function checkoutUrl() {
    var merged = {};
    cart.forEach(function (l) { merged[l.id] = (merged[l.id] || 0) + l.qty; });
    var items = Object.keys(merged).map(function (id) { return id + ':' + merged[id]; }).join(',');
    var notes = cart.filter(function (l) { return l.note; }).map(function (l) { return l.note + (l.qty > 1 ? ' (x' + l.qty + ')' : ''); });
    return STORE + '/cart/' + items + (notes.length ? '?note=' + encodeURIComponent(notes.join(' | ')) : '');
  }
  function renderCart() {
    var n = cartCount();
    $$('[data-cart-count]').forEach(function (b) { b.textContent = n; });
    var lines = $('#cartLines'), foot = $('#cartFoot');
    if (!cart.length) {
      lines.innerHTML = '<p class="cart-empty">Your cart is empty. Start with a 60ml sample: every oil and balsamic comes in one for $8.99.</p>';
      foot.innerHTML = '<button class="btn btn-line" type="button" data-close>Keep browsing</button>';
      return;
    }
    var total = 0, large = false;
    lines.innerHTML = cart.map(function (l, i) {
      var p = BY[l.h];
      total += l.price * l.qty;
      if (l.label === '750ml') large = true;
      return '<div class="line"><img src="' + (p.k === 'gift' ? 'img/sampler.jpg' : img(p)) + '" alt="" width="54" height="54">' +
        '<div class="line-n"><b>' + esc(p.k === 'evoo' ? p.s + ' Extra Virgin Olive Oil' : p.n) + '</b><span>' + esc(l.label) + ' · ' + money(l.price) + '</span>' +
        (l.note ? '<span>' + esc(l.note) + '</span>' : '') + '</div>' +
        '<div><div class="qty"><button type="button" data-qty="-1" data-i="' + i + '" aria-label="Remove one">−</button><span>' + l.qty + '</span>' +
        '<button type="button" data-qty="1" data-i="' + i + '" aria-label="Add one">+</button></div><div class="line-p">' + money(l.price * l.qty) + '</div></div></div>';
    }).join('');
    foot.innerHTML = '<div class="sub"><span>Subtotal</span><b>' + money(total) + '</b></div>' +
      '<a class="btn btn-solid" href="' + esc(checkoutUrl()) + '" target="_blank" rel="noopener">Check out securely</a>' +
      '<small>' + (large ? 'Large 750ml bottles may have extra shipping. ' : '') +
      'Local delivery and shipping options are shown at checkout, which runs on Simply Infused’s existing Shopify store.</small>';
  }

  /* ── sheets ── */
  var lastFocus = null;
  function openSheet(el) {
    $$('.sheet.on').forEach(function (s) { s.classList.remove('on'); s.setAttribute('aria-hidden', 'true'); });
    if (!lastFocus) lastFocus = document.activeElement;
    el.classList.add('on'); el.setAttribute('aria-hidden', 'false');
    $('#scrim').classList.add('on');
    document.documentElement.style.overflow = 'hidden';
    var x = $('.x', el);
    if (x) x.focus({ preventScroll: true });
  }
  function closeSheets() {
    $$('.sheet.on').forEach(function (s) { s.classList.remove('on'); s.setAttribute('aria-hidden', 'true'); });
    $('#scrim').classList.remove('on');
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }

  /* ── product sheet ── */
  var psSize = null, psProd = null;
  function pairChip(h) {
    var p = BY[h];
    return '<button type="button" class="pick" data-product="' + p.h + '"><img src="' + img(p) + '" alt="" width="34" height="34" loading="lazy">' + esc(p.s) + '</button>';
  }
  function openProduct(h) {
    var p = BY[h];
    if (!p) return;
    if (p.k === 'gift') { closeSheets(); $('#gifts').scrollIntoView(); return; }
    psProd = p;
    psSize = p.z[1] || p.z[0];
    var pairsTitle = isOil(p) ? 'The shop pairs it with these balsamics' : 'The shop pairs it with these oils';
    var all = p.pall ? '<p class="out-also">' + (isOil(p) ? 'Pairs with every barrel-aged balsamic on the wall.' : 'Pairs with every Ultra Premium Extra Virgin Olive Oil on tap.') + '</p>' : '';
    var html = '<div class="ps-top"><span class="ph"><img src="' + img(p) + '" alt="" width="104" height="104"></span><div>' +
      '<span class="lab lab-' + p.k + '">' + KIND[p.k] + '</span>' + (p.b ? '<span class="ps-badge">' + esc(p.b) + '</span>' : '') +
      '<h2 id="psName">' + esc(p.k === 'evoo' ? p.s + ' Extra Virgin Olive Oil' : p.n) + '</h2></div></div>';
    if (p.d) html += '<p class="ps-desc' + (p.d.length > 260 ? ' clamp' : '') + '" id="psDesc">' + esc(p.d) + '</p>' + (p.d.length > 260 ? '<button type="button" class="linkbtn" data-more>Read more</button>' : '');
    html += '<div class="sizes" role="radiogroup" aria-label="Size">' + p.z.map(function (z, i) {
      return '<button type="button" class="size' + (z === psSize ? ' on' : '') + '" role="radio" aria-checked="' + (z === psSize) + '" data-size="' + i + '"><b>' + z.label + '</b><span>' + money(z.price) + '</span></button>';
    }).join('') + '</div><button type="button" class="btn btn-solid ps-add" data-ps-add>Add to cart · ' + money(psSize.price) + '</button><p class="ps-note" id="psNote"></p>';
    if (p.p.length || p.pall) {
      html += '<div class="ps-sec"><h3>' + pairsTitle + '</h3>' + (p.p.length ? '<div class="ps-pairs">' + p.p.map(pairChip).join('') + '</div>' : '') + all +
        (p.pa.length ? '<p class="out-also">Also suggested at the tasting bar: ' + esc(p.pa.join(', ')) + '.</p>' : '') + '</div>';
    }
    var dl = '';
    if (p.pr.length) dl += '<dt>Proteins</dt><dd>' + esc(p.pr.join(', ')) + '</dd>';
    if (p.vg.length) dl += '<dt>Vegetables</dt><dd>' + esc(p.vg.join(', ')) + '</dd>';
    if (p.ot.length) dl += '<dt>Also great on</dt><dd>' + esc(p.ot.join(', ')) + '</dd>';
    if (p.us.length) dl += '<dt>Uses</dt><dd>' + esc(p.us.join(', ')) + '</dd>';
    if (dl) html += '<div class="ps-sec"><h3>How to use it</h3><dl class="ps-dl">' + dl + '</dl></div>';
    html += '<a class="ps-link" href="' + STORE + '/products/' + p.h + '" target="_blank" rel="noopener">See the full notes on simply-infused.com →</a>';
    var body = $('#psBody');
    body.innerHTML = html;
    body.scrollTop = 0;
    openSheet($('#productSheet'));
  }

  /* ── shop grid ── */
  var state = { shelf: 'all', mood: '', q: '', all: false };
  var ORDER = CAT.slice().sort(function (a, b) { return (b.b ? 1 : 0) - (a.b ? 1 : 0); });

  function card(p) {
    var gift = p.k === 'gift';
    return '<article class="card">' + (p.b ? '<span class="badge">' + (p.b === 'Best seller' ? 'Best seller' : 'Top seller') + '</span>' : '') +
      '<button type="button" class="card-open" data-product="' + p.h + '" aria-label="' + esc(p.n) + ', details">' +
      '<span class="ph"><img src="' + (gift ? 'img/sampler.jpg' : img(p)) + '" alt="" width="118" height="118" loading="lazy"></span>' +
      '<span class="lab lab-' + p.k + '">' + KIND[p.k] + '</span><h3>' + esc(p.s) + '</h3></button>' +
      '<div class="card-foot"><span class="from">' + (gift ? '' : 'from ') + '<b>' + money(p.z[0].price) + '</b></span>' +
      '<button type="button" class="quick" data-quick="' + p.h + '" aria-label="Add ' + esc(p.n) + (gift ? '' : ', 60ml sample,') + ' to cart">+ ' + (gift ? 'Add' : '60ml') + '</button></div></article>';
  }
  function filtered() {
    var q = state.q.trim().toLowerCase();
    return ORDER.filter(function (p) {
      if (state.shelf !== 'all' && p.k !== state.shelf) return false;
      if (state.mood === 'best' && !p.b) return false;
      if (state.mood && state.mood !== 'best' && p.f.indexOf(state.mood) < 0) return false;
      if (q && (p.n + ' ' + KIND[p.k] + ' ' + p.f.join(' ') + ' ' + p.d).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
  }
  function renderGrid() {
    var list = filtered();
    var browsing = state.shelf === 'all' && !state.mood && !state.q.trim();
    var limit = window.matchMedia('(max-width:640px)').matches ? 8 : 12;
    var capped = browsing && !state.all && list.length > limit;
    var show = capped ? list.slice(0, limit) : list;
    $('#grid').innerHTML = show.length ? show.map(card).join('') :
      '<p class="empty">Nothing on the wall matches that yet. Try another flavor, or call the shop at 205.408.4231.</p>';
    $('#countLine').textContent = list.length + (list.length === 1 ? ' bottle' : ' bottles') + (capped ? ' · showing ' + show.length : '');
    var btn = $('#showAll');
    btn.hidden = !capped;
    btn.textContent = 'Show all ' + list.length;
  }
  function renderChips() {
    $('#shelfTabs').innerHTML = SHELVES.map(function (s) {
      var n = s[0] === 'all' ? CAT.length : CAT.filter(function (p) { return p.k === s[0]; }).length;
      return '<button type="button" role="tab" class="chip' + (state.shelf === s[0] ? ' on' : '') + '" aria-selected="' + (state.shelf === s[0]) + '" data-shelf="' + s[0] + '">' + esc(s[1]) + ' <small>' + n + '</small></button>';
    }).join('');
    $('#moodChips').innerHTML = MOODS.map(function (m) {
      return '<button type="button" class="chip' + (state.mood === m[0] ? ' on' : '') + '" aria-pressed="' + (state.mood === m[0]) + '" data-mood="' + m[0] + '">' + esc(m[1]) + '</button>';
    }).join('');
  }

  /* ── pairing finder ── */
  var side = 'oil', picked = 'tuscan-herb-extra-virgin-olive-oil', showAllMatches = false;
  function sideList() {
    return CAT.filter(function (p) { return side === 'oil' ? isOil(p) : (p.k === 'dark' || p.k === 'white'); })
      .sort(function (a, b) { return (b.b ? 1 : 0) - (a.b ? 1 : 0) || a.s.localeCompare(b.s); });
  }
  function renderPicks() {
    $('#pickList').innerHTML = sideList().map(function (p) {
      return '<button type="button" class="pick' + (p.h === picked ? ' on' : '') + '" data-pick="' + p.h + '" aria-pressed="' + (p.h === picked) + '"><img src="' + img(p) + '" alt="" width="34" height="34" loading="lazy">' + esc(fullName(p)) + '</button>';
    }).join('');
  }
  function renderPair() {
    var p = BY[picked], out = $('#pairOut');
    if (!p) { out.innerHTML = ''; return; }
    var other = isOil(p) ? 'balsamic' : 'oil';
    var max = 6, list = showAllMatches ? p.p : p.p.slice(0, max);
    var html = '<div class="out-top"><span class="ph"><img src="' + img(p) + '" alt="" width="84" height="84"></span><div><span class="lab lab-' + p.k + '">' + KIND[p.k] + '</span><h3>' + esc(fullName(p)) + '</h3></div></div>';
    if (p.p.length) {
      html += '<p class="out-lede">' + (p.pall ? (isOil(p) ? 'Pairs with every barrel-aged balsamic. The shop’s favorites:' : 'Pairs with every Ultra Premium EVOO on tap. The shop also loves it with:') : 'The shop pours it with ' + (p.p.length === 1 ? 'this ' + other : 'these ' + p.p.length + ' ' + other + 's') + ':') + '</p>';
      html += '<div class="matches">' + list.map(function (h) {
        var m = BY[h];
        return '<div class="match"><img src="' + img(m) + '" alt="" width="46" height="46" loading="lazy"><div class="match-n"><button type="button" data-product="' + m.h + '">' + esc(m.s) + '</button><span>' + KIND[m.k] + '</span></div>' +
          '<button type="button" class="plus" data-quick="' + m.h + '" aria-label="Add ' + esc(m.n) + ', 60ml sample, to cart">+</button></div>';
      }).join('') + '</div>';
      if (p.p.length > max && !showAllMatches) html += '<p class="out-also"><button type="button" class="linkbtn" data-more-matches>Show all ' + p.p.length + ' pairings</button></p>';
      if (p.pa.length) html += '<p class="out-also">Also suggested at the tasting bar: ' + esc(p.pa.join(', ')) + '.</p>';
      var first = BY[p.p[0]];
      html += '<div class="out-buy"><p>Taste them side by side: <b>' + esc(p.s) + ' + ' + esc(first.s) + '</b>, two 60ml samples.</p>' +
        '<button type="button" class="btn btn-solid" data-pair="' + first.h + '">Add the pair · ' + money(p.z[0].price + first.z[0].price) + '</button></div>';
    } else {
      html += '<p class="out-lede">' + (p.pall ? (isOil(p) ? 'This one pairs with every barrel-aged Italian balsamic on the wall, so start with your favorite flavor.' : 'This one pairs with every Ultra Premium EVOO on tap.') : esc(p.d)) + '</p>' +
        '<div class="out-buy"><p>Every bottle comes in a <b>60ml sample for ' + money(p.z[0].price) + '</b>.</p>' +
        '<button type="button" class="btn btn-solid" data-browse="' + (isOil(p) ? 'dark' : 'infused') + '">Browse the ' + (isOil(p) ? 'balsamics' : 'oils') + '</button></div>';
    }
    out.innerHTML = html;
  }

  /* ── harvest ── */
  (function initHarvest() {
    var north = NOW.month <= 6;
    $$('.hemi-card').forEach(function (c) { c.classList.toggle('now', (c.getAttribute('data-hemi') === 'north') === north); });
    var INT = [
      ['Mild', 1, '150 – 225', 'Smooth and delicious. A great choice for everyday use: baking, marinades, vinaigrettes, bread dipping and roasted vegetables.'],
      ['Medium', 2, '250 – 420', 'A more pronounced olive flavor, well balanced, with savory notes that give way to a touch of bitterness and a peppery finish.'],
      ['Robust', 3, '420 – 700+', 'Complex, moderately bitter and very pungent, with a nice warm finish.']
    ];
    $('#intensity').innerHTML = INT.map(function (r) {
      var p = CAT.filter(function (x) { return x.k === 'evoo' && x.s === r[0]; })[0];
      if (!p) return '';
      return '<article class="int"><span class="lab lab-evoo" style="align-self:flex-start">Ultra Premium EVOO</span><h3 style="margin-top:12px">' + r[0] + '</h3>' +
        '<div class="meter" aria-hidden="true">' + [1, 2, 3].map(function (i) { return '<i' + (i <= r[1] ? ' class="f"' : '') + '></i>'; }).join('') + '</div>' +
        '<span class="poly">Polyphenols ' + r[2] + '</span><p class="t">' + r[3] + '</p>' +
        '<div class="card-foot"><span class="from">from <b>' + money(p.z[0].price) + '</b></span><button type="button" class="quick" data-product="' + p.h + '">Choose a size</button></div></article>';
    }).join('');
  })();

  /* ── sampler builder ── */
  (function initBuilder() {
    $$('#builder select').forEach(function (sel) {
      var shelf = sel.getAttribute('data-shelf');
      var list = CAT.filter(function (p) { return shelf === 'oil' ? isOil(p) : p.k === shelf; }).sort(function (a, b) { return a.s.localeCompare(b.s); });
      sel.innerHTML = '<option value="">Shop’s choice</option>' + list.map(function (p) { return '<option>' + esc(fullName(p)) + '</option>'; }).join('');
    });
    var gift = CAT.filter(function (p) { return p.k === 'gift'; })[0];
    if (gift) $('#samplerPrice').textContent = money(gift.z[0].price);
    $('#builder').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!gift) return;
      var picks = $$('#builder select').map(function (s) { return s.value; });
      var chosen = picks.filter(Boolean);
      var note = chosen.length ? '4-pack flavors: ' + picks.map(function (v) { return v || "shop's choice"; }).join(', ') : '';
      addToCart(gift, gift.z[0], note);
    });
  })();

  /* ── delivery ── */
  var ROUTE = [
    { k: 'daily', day: 'Daily', areas: '35242 area · I-459 to Chelsea' },
    { k: 1, day: 'Monday', areas: 'Irondale · Leeds' },
    { k: 2, day: 'Tuesday', areas: 'Homewood · Vestavia Hills' },
    { k: 3, day: 'Wednesday', areas: 'Mountain Brook · Downtown Birmingham' },
    { k: 4, day: 'Thursday', areas: 'Bluff Park · Riverchase · Pelham' },
    { k: 5, day: 'Friday', areas: 'Orders that need a special delivery' }
  ];
  var AREAS = [['35242 area (Hwy 280)', 'daily'], ['I-459 to Chelsea', 'daily'], ['Irondale', 1], ['Leeds', 1], ['Homewood', 2], ['Vestavia Hills', 2], ['Mountain Brook', 3],
    ['Downtown Birmingham', 3], ['Bluff Park', 4], ['Riverchase', 4], ['Pelham', 4], ['Somewhere else nearby', 5]];
  function nextDate(dow) {
    var ahead = (dow - NOW.day + 7) % 7;
    if (ahead === 0 && NOW.mins >= CLOSE) ahead = 7;
    if (ahead === 0) return 'That’s today.';
    var d = new Date(Date.now() + ahead * 864e5);
    return 'Next run: ' + new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'long', month: 'long', day: 'numeric' }).format(d) + '.';
  }
  function renderWeek(pick) {
    $('#week').innerHTML = ROUTE.map(function (r) {
      var cls = (r.k === NOW.day ? 'today ' : '') + (pick !== null && r.k === pick ? 'pick-day' : '');
      return '<li class="' + cls.trim() + '"><b>' + r.day + '</b><span>' + r.areas + '</span><em>Today</em></li>';
    }).join('');
  }
  (function initDelivery() {
    var sel = $('#area');
    sel.innerHTML = '<option value="">Choose your area</option>' + AREAS.map(function (a, i) { return '<option value="' + i + '">' + a[0] + '</option>'; }).join('');
    function answer() {
      var ans = $('#routeAns');
      if (sel.value === '') {
        ans.innerHTML = '<p>Choose an area and we’ll show the day the shop is headed your way.</p>';
        renderWeek(null); return;
      }
      var a = AREAS[+sel.value];
      if (a[1] === 'daily') ans.innerHTML = '<div class="day">Every delivery day</div><p>' + esc(a[0]) + ' is on the daily route. Delivery is free.</p>';
      else if (a[1] === 5) ans.innerHTML = '<div class="day">Fridays, by request</div><p>Fridays are for orders that need a special delivery, free up to 15 miles. Call and the shop will set it up.</p>';
      else ans.innerHTML = '<div class="day">' + DAYS[a[1]] + 's</div><p>' + esc(a[0]) + ' is on the ' + DAYS[a[1]] + ' route. Delivery is free. ' + nextDate(a[1]) + '</p>';
      renderWeek(a[1]);
    }
    sel.addEventListener('change', answer);
    answer();
    // hero card: today's route, or the next one once the shop has closed for the day
    var k = $('.float-route .float-k'), v = $('#heroRoute');
    var ahead = NOW.mins >= CLOSE ? 1 : 0, run = null;
    for (; ahead < 8 && !run; ahead++) run = ROUTE.filter(function (r) { return r.k === (NOW.day + ahead) % 7; })[0];
    ahead -= 1;
    k.textContent = 'Free delivery ' + (ahead === 0 ? 'today' : ahead === 1 ? 'tomorrow' : run.day);
    v.textContent = run.k === 5 ? 'Special deliveries' : run.areas;
  })();

  /* ── partners ── */
  (function initPartners() {
    var SHOPS = [['The Mercantile', 'Hwy 280, Birmingham · home of the tasting room'], ['N&N Meat Co.', 'Jasper, AL'], ['Just-a-Tish Wine', 'Columbiana, AL'], ['Andy’s Produce', 'Vestavia Hills, AL'],
      ['The Maker & Merchant', 'Auburn, AL'], ['Prattville Pickers', 'Prattville, AL'], ['Grain & Leaf', 'Alex City, AL'], ['Liza Tye', 'Starkville, MS'], ['Mathis Peaches', 'Meridian, MS'], ['The Southern Exchange', 'Columbus, MS']];
    $('#shopsList').innerHTML = SHOPS.map(function (s) {
      var q = encodeURIComponent(s[0].replace('’', "'") + ' ' + s[1].split(' · ')[0]);
      return '<a class="shop-tile" href="https://www.google.com/maps/search/?api=1&query=' + q + '" target="_blank" rel="noopener"><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></a>';
    }).join('');
  })();

  /* ── forms (concept: nothing is sent) ── */
  $('#socialForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, msg = $('#socialMsg');
    if (!f.name.value.trim() || !f.contact.value.trim()) { msg.textContent = 'Add your name and a phone or email so the shop can reach you.'; return; }
    msg.textContent = 'Thanks, ' + f.name.value.trim().split(' ')[0] + '. This is a concept preview, so nothing was sent. On the live site this goes straight to the shop.';
    f.reset();
  });
  $('#newsForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('#newsEmail').value.trim(), msg = $('#newsMsg');
    if (!/^\S+@\S+\.\S+$/.test(v)) { msg.textContent = 'Enter a valid email address.'; return; }
    msg.textContent = 'You’re on the list. (Concept preview: on the live site this feeds the shop’s Mailchimp.)';
    e.target.reset();
  });

  /* ── one delegated click handler ── */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-product],[data-quick],[data-shelf],[data-mood],[data-pick],[data-side],[data-open-cart],[data-close],[data-size],[data-ps-add],[data-more],[data-more-matches],[data-pair],[data-browse],[data-qty]');
    if (!t) return;
    if (t.tagName === 'SELECT') return;
    var a;
    if ((a = t.getAttribute('data-quick'))) { addToCart(BY[a], BY[a].z[0]); return; }
    if ((a = t.getAttribute('data-product'))) { openProduct(a); return; }
    if (t.hasAttribute('data-shelf') && t.classList.contains('chip')) { state.shelf = t.getAttribute('data-shelf'); state.all = false; renderChips(); renderGrid(); return; }
    if ((a = t.getAttribute('data-mood'))) { state.mood = state.mood === a ? '' : a; renderChips(); renderGrid(); return; }
    if ((a = t.getAttribute('data-pick'))) { picked = a; showAllMatches = false; renderPicks(); renderPair(); return; }
    if ((a = t.getAttribute('data-side'))) {
      side = a;
      $$('.seg button').forEach(function (b) { var on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      picked = side === 'oil' ? 'tuscan-herb-extra-virgin-olive-oil' : 'traditional-18-year-aged-balsamic-vingegar';
      showAllMatches = false; renderPicks(); renderPair(); $('#pickList').scrollLeft = 0; return;
    }
    if (t.hasAttribute('data-open-cart')) { openSheet($('#cartSheet')); return; }
    if (t.hasAttribute('data-close')) { closeSheets(); return; }
    if ((a = t.getAttribute('data-size')) !== null && psProd) {
      psSize = psProd.z[+a];
      $$('.size').forEach(function (b, i) { var on = i === +a; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
      $('[data-ps-add]').textContent = 'Add to cart · ' + money(psSize.price);
      $('#psNote').textContent = psSize.ml === 750 ? 'Large bottles may have extra shipping.' : '';
      return;
    }
    if (t.hasAttribute('data-ps-add') && psProd) { addToCart(psProd, psSize); return; }
    if (t.hasAttribute('data-more')) { $('#psDesc').classList.remove('clamp'); t.remove(); return; }
    if (t.hasAttribute('data-more-matches')) { showAllMatches = true; renderPair(); return; }
    if ((a = t.getAttribute('data-pair'))) {
      var p = BY[picked], m = BY[a];
      addToCart(p, p.z[0]); addToCart(m, m.z[0]);
      toast('Added the pair: ' + p.s + ' + ' + m.s);
      return;
    }
    if ((a = t.getAttribute('data-browse'))) { state.shelf = a; state.mood = ''; state.q = ''; $('#q').value = ''; renderChips(); renderGrid(); $('#shop').scrollIntoView(); return; }
    if ((a = t.getAttribute('data-qty'))) {
      var l = cart[+t.getAttribute('data-i')];
      if (!l) return;
      l.qty += +a;
      if (l.qty <= 0) cart.splice(cart.indexOf(l), 1);
      saveCart(); renderCart();
    }
  });
  $('#scrim').addEventListener('click', closeSheets);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheets(); });
  $('#q').addEventListener('input', function (e) { state.q = e.target.value; renderGrid(); });
  $('#showAll').addEventListener('click', function () { state.all = true; renderGrid(); });

  /* menu (phones) */
  var menuBtn = $('#menuBtn'), menu = $('#menuSheet');
  menuBtn.addEventListener('click', function () {
    var on = !menu.classList.contains('on');
    menu.classList.toggle('on', on); menuBtn.setAttribute('aria-expanded', on);
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') { menu.classList.remove('on'); menuBtn.setAttribute('aria-expanded', 'false'); } });

  /* reveal */
  (function () {
    var els = $$('.rv');
    if (!('IntersectionObserver' in window)) { els.forEach(function (n) { n.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (n) { io.observe(n); });
    setTimeout(function () { els.forEach(function (n) { if (n.getBoundingClientRect().top < window.innerHeight) n.classList.add('in'); }); }, 1500);
  })();

  renderChips(); renderGrid(); renderPicks(); renderPair(); renderCart();
})();
