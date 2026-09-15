/* ==========================================================================
   Apollo Jewelry — concept storefront
   Williams Digital
   ========================================================================== */
(function () {
  'use strict';

  var P = window.APOLLO || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------- data */

  var COLLECTIONS = [
    { n: 'Greek Goddess',   d: 'The meander, the Athena coin, the Macedonian sun — the Greek motifs of this house, cut in 14k and 18k gold.' },
    { n: 'Modern',          d: 'Diamond hoops, tennis bracelets and cuban links. Contemporary shapes, traditionally set.' },
    { n: 'The Essentials',  d: 'The pieces worn every day: hammered bangles, braided cuffs, solid gold chains.' },
    { n: 'For Men',         d: 'Coin pendants, Byzantine links, paperclip chains and signet-weight rings.' },
    { n: 'Evil Eye',        d: 'The mati — the oldest protective charm in Greece — in sapphire, emerald and black diamond.' },
    { n: 'Caldera Bloom',   d: 'Sapphire, aquamarine and tourmaline set with diamonds. Named for the crater the island sits in.' },
    { n: 'Byzantine',       d: 'Handmade crosses and the Byzantine link chain, struck the way they have been for centuries.' },
    { n: 'Aegean Luxe',     d: 'Aquamarine and blue topaz with diamonds — the colour of the sea below Fira.' },
    { n: 'Silver',          d: 'Oxidised and sterling silver 925, including gold-plated pieces.' },
    { n: 'Santorini Blues', d: 'Opal and Greek key, in the blues the island is known for.' }
  ];

  var COLL_IMG = {
    'Greek Goddess':   'panther-with-diamonds',
    'Modern':          'heart-necklace-18kt-gold',
    'The Essentials':  'hammered-ring-in-18k-solid-gold',
    'For Men':         'disk-of-phaistos-pendant-in-14k-solid-gold-2',
    'Evil Eye':        'enamel-evil-eye-bracelet-in-14k-solid-gold',
    'Caldera Bloom':   'sapphire-ring-with-baguette-cut-diamonds-in-18k-solid-gold',
    'Byzantine':       'byzantine-knot-style-ring-in-18k-solid-gold',
    'Aegean Luxe':     'blue-topaz-earrings-with-diamonds-in-18k-solid-gold',
    'Silver':          'designer-oxidized-silver-earrings',
    'Santorini Blues': 'eternity-pendant-with-white-opal-stone-in-14k-solid-gold'
  };

  var CATEGORIES = ['Rings', 'Bracelets', 'Earrings', 'Necklaces', 'Pendants', 'Chains'];

  /* pieces surfaced first in the catalogue — all verified from the live shop */
  var FEATURED = [
    'byzantine-knot-style-ring-in-18k-solid-gold',
    'panther-with-diamonds',
    'grande-sapphire-evil-eye-necklace-18k-gold',
    'byzantine-chain-in-14k-solid-gold',
    'sapphire-ring-with-baguette-cut-diamonds-in-18k-solid-gold',
    'heart-necklace-18kt-gold',
    'athena-coin-pendant-14k-gold',
    'meander-bracelet-in-18k-solid-gold'
  ];

  var money = function (n) { return '$' + n.toLocaleString('en-US'); };

  var count = function (key, field) {
    var c = 0;
    for (var i = 0; i < P.length; i++) if (P[i][field].indexOf(key) > -1) c++;
    return c;
  };

  /* ------------------------------------------------------------- storage */

  var store = {
    get: function (k) {
      try { return JSON.parse(localStorage.getItem('apollo_' + k)) || []; }
      catch (e) { return []; }
    },
    set: function (k, v) {
      try { localStorage.setItem('apollo_' + k, JSON.stringify(v)); } catch (e) {}
    }
  };

  var wish = store.get('wish');
  var bag = store.get('bag');

  function syncPips() {
    [['pipWish', wish.length], ['pipWish2', wish.length], ['pipBag', bag.length], ['pipBag2', bag.length]]
      .forEach(function (p) {
        var el = document.getElementById(p[0]);
        if (!el) return;
        el.textContent = p[1];
        el.classList.toggle('on', p[1] > 0);
      });
  }

  function byId(id) {
    for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i];
    return null;
  }

  /* ---------------------------------------------------------- nav + menus */

  function buildMenus() {
    var mc = $('#megaColl'), mk = $('#megaCat'), fc = $('#ftColl'), fk = $('#ftCat');

    COLLECTIONS.forEach(function (c) {
      var n = count(c.n, 'coll');
      if (mc) mc.insertAdjacentHTML('beforeend',
        '<a href="#shop" data-jump="' + c.n + '">' + c.n + ' <i>' + n + '</i></a>');
      if (fc) fc.insertAdjacentHTML('beforeend',
        '<li><a href="#shop" data-jump="' + c.n + '">' + c.n + '</a></li>');
    });

    CATEGORIES.forEach(function (c) {
      var n = count(c, 'cat');
      if (mk) mk.insertAdjacentHTML('beforeend',
        '<a href="#shop" data-jump="' + c + '">' + c + ' <i>' + n + '</i></a>');
      if (fk) fk.insertAdjacentHTML('beforeend',
        '<li><a href="#shop" data-jump="' + c + '">' + c + '</a></li>');
    });
  }

  /* -------------------------------------------------------- collections */

  function buildCollections() {
    var g = $('#collGrid');
    if (!g) return;
    COLLECTIONS.forEach(function (c, i) {
      var n = count(c.n, 'coll');
      var slug = COLL_IMG[c.n];
      var img = slug ? 'img/d/' + slug + '.webp' : '';
      g.insertAdjacentHTML('beforeend',
        '<a class="coll' + (i === 0 ? ' coll-lg' : '') + '" href="#shop" data-jump="' + c.n + '">' +
          (img ? '<img src="' + img + '" alt="" loading="lazy" decoding="async">' : '') +
          '<div class="coll-c">' +
            '<h3>' + c.n + '</h3>' +
            '<p>' + c.d + '</p>' +
            '<span class="coll-n"><i></i>' + n + ' pieces</span>' +
          '</div>' +
        '</a>');
    });

    /* fills the final cell of the grid rather than leaving it empty */
    g.insertAdjacentHTML('beforeend',
      '<a class="coll coll-all" href="#shop" data-jump="All">' +
        '<div class="coll-c">' +
          '<p class="eyebrow" style="margin-bottom:14px">Everything</p>' +
          '<h3>The whole<br>catalogue</h3>' +
          '<p>Rings, bracelets, earrings, necklaces, pendants and chains — filter by collection, metal or price.</p>' +
          '<span class="coll-n"><i></i>' + P.length + ' pieces</span>' +
        '</div>' +
      '</a>');
  }

  /* ------------------------------------------------------------ catalogue */

  var state = { filter: 'All', sort: 'feat', shown: 12 };
  var PAGE = 12;

  function buildChips() {
    var c = $('#chips');
    if (!c) return;
    var list = ['All'].concat(CATEGORIES).concat(COLLECTIONS.map(function (x) { return x.n; }));
    list.forEach(function (n) {
      c.insertAdjacentHTML('beforeend',
        '<button class="fchip' + (n === 'All' ? ' on' : '') + '" data-f="' + n + '">' + n + '</button>');
    });
  }

  function filtered() {
    var out = P.slice();
    if (state.filter !== 'All') {
      out = out.filter(function (p) {
        return p.cat.indexOf(state.filter) > -1 || p.coll.indexOf(state.filter) > -1;
      });
    }
    if (state.sort === 'lo') out.sort(function (a, b) { return a.p - b.p; });
    else if (state.sort === 'hi') out.sort(function (a, b) { return b.p - a.p; });
    else if (state.sort === 'az') out.sort(function (a, b) { return a.n.localeCompare(b.n); });
    else {
      out.sort(function (a, b) {
        var ia = FEATURED.indexOf(a.id), ib = FEATURED.indexOf(b.id);
        if (ia < 0) ia = 999; if (ib < 0) ib = 999;
        return ia - ib || b.p - a.p;
      });
    }
    return out;
  }

  function cardHTML(p) {
    var saved = wish.indexOf(p.id) > -1;
    var flag = FEATURED.indexOf(p.id) > -1 ? '<span class="card-flag">Featured</span>' : '';
    return '<article class="card" data-id="' + p.id + '">' +
      '<div class="card-im">' + flag +
        '<img src="' + p.t + '" alt="' + p.n + '" loading="lazy" decoding="async" width="560" height="560">' +
        '<button class="card-wish' + (saved ? ' on' : '') + '" data-wish="' + p.id + '" aria-label="Save ' + p.n + '">' +
          '<svg fill="none" stroke="currentColor"><use href="#i-heart"/></svg></button>' +
        '<div class="card-quick">View piece</div>' +
      '</div>' +
      '<div class="card-b">' +
        '<h3>' + p.n + '</h3>' +
        '<p class="card-mat">' + (p.m || '') + (p.st ? ' · ' + p.st : '') + '</p>' +
        '<p class="card-pr">' + money(p.p) + '</p>' +
      '</div>' +
    '</article>';
  }

  function render() {
    var g = $('#grid'); if (!g) return;
    var list = filtered();
    var slice = list.slice(0, state.shown);

    g.innerHTML = slice.map(cardHTML).join('');
    $('#empty').hidden = list.length > 0;
    $('#moreWrap').style.display = state.shown >= list.length ? 'none' : 'flex';

    var label = state.filter === 'All' ? 'the full catalogue' : state.filter;
    var c = $('#shopCount');
    if (c) c.textContent = list.length + ' piece' + (list.length === 1 ? '' : 's') + ' in ' + label +
      ' — each listed with the metal, the stones and the price shown on Apollo Jewelry\'s own catalogue.';

    // fade images in once decoded
    $$('.card-im img', g).forEach(function (im) {
      if (im.complete) im.classList.add('rdy');
      else im.addEventListener('load', function () { im.classList.add('rdy'); }, { once: true });
    });
  }

  function setFilter(f) {
    state.filter = f;
    state.shown = PAGE;
    $$('.fchip').forEach(function (b) { b.classList.toggle('on', b.dataset.f === f); });
    var on = $('.fchip.on');
    if (on && on.parentNode) on.parentNode.scrollTo({ left: on.offsetLeft - 60, behavior: 'smooth' });
    render();
  }

  /* -------------------------------------------------------------- overlays */

  var openPanel = null;

  function lock(on) { document.body.classList.toggle('is-locked', on); }

  function closeAll() {
    ['pdp', 'drawer'].forEach(function (id) { $('#' + id).classList.remove('on'); });
    $('#scrim').classList.remove('on');
    $('#srch').classList.remove('on');
    lock(false);
    openPanel = null;
  }

  function open(id) {
    $('#scrim').classList.add('on');
    $('#' + id).classList.add('on');
    lock(true);
    openPanel = id;
  }

  /* ------------------------------------------------------------------ PDP */

  function openPDP(id) {
    var p = byId(id); if (!p) return;

    $('#pdpMedia').innerHTML = p.g.map(function (src, i) {
      return '<img src="' + src + '" alt="' + p.n + (i ? ' — view ' + (i + 1) : '') + '" loading="' + (i ? 'lazy' : 'eager') + '" width="1000" height="1000">';
    }).join('');

    var rows = [['Material', p.m], ['Stones', p.st], ['Colour', p.c], ['Dimensions', p.dim]]
      .filter(function (r) { return r[1]; })
      .map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('');

    var saved = wish.indexOf(p.id) > -1;
    var inBag = bag.indexOf(p.id) > -1;

    $('#pdpBody').innerHTML =
      '<p class="pdp-coll">' + (p.coll[0] || p.cat[0] || 'Apollo Jewelry') + '</p>' +
      '<h2>' + p.n + '</h2>' +
      '<p class="pdp-price">' + money(p.p) + '</p>' +
      '<p class="pdp-vat">Shown in US dollars · Duties and import taxes are the buyer\'s responsibility</p>' +
      '<dl class="spec">' + rows + '</dl>' +
      '<div class="pdp-acts">' +
        '<button class="btn btn-solid" data-bag="' + p.id + '">' + (inBag ? 'In your bag' : 'Add to bag') + '</button>' +
        '<button class="btn" data-wish="' + p.id + '">' + (saved ? 'Saved to wish list' : 'Save to wish list') + '</button>' +
        '<a class="btn btn-gold" href="#sizing" data-close>Sizing assistance <svg><use href="#i-arw"/></svg></a>' +
      '</div>' +
      '<div class="pdp-note"><svg><use href="#i-ship"/></svg><div><b>Shipped worldwide</b>Free within Greece and free worldwide with Hellenic Post. DHL express from €30 in Europe, €70 worldwide. Dispatched within 1–5 business days of payment.</div></div>' +
      '<div class="pdp-note"><svg><use href="#i-shield"/></svg><div><b>Made in Greece</b>Handmade with small artisan workshops throughout Greece. The metal, stones and dimensions above are those listed by the house.</div></div>' +
      '<div class="pdp-note"><svg><use href="#i-lock"/></svg><div><b>Secure payment</b>Card payments through Nexi XPay over 128-bit SSL. Card details are never stored. PayPal, bank transfer, and cash on delivery in Greece and Cyprus.</div></div>' +
      '<div class="pdp-note"><svg><use href="#i-spark"/></svg><div><b>Before you order</b>All sales are final. Exchanges are in person at the Fira store only, with prior approval, within 15 days of purchase — so do check the size.</div></div>';

    $('#pdpBody').scrollTop = 0;
    $('#pdpMedia').scrollTop = 0;
    $('#pdpMedia').scrollLeft = 0;
    open('pdp');
  }

  /* --------------------------------------------------------------- drawer */

  function drawerMenu() {
    $('#drawerTitle').textContent = 'Menu';
    var h = '<div class="dgroup"><h6>Collections</h6>';
    COLLECTIONS.forEach(function (c) {
      h += '<a href="#shop" data-jump="' + c.n + '">' + c.n + ' <i>' + count(c.n, 'coll') + '</i></a>';
    });
    h += '</div><div class="dgroup"><h6>Jewellery</h6>';
    CATEGORIES.forEach(function (c) {
      h += '<a href="#shop" data-jump="' + c + '">' + c + ' <i>' + count(c, 'cat') + '</i></a>';
    });
    h += '</div><div class="dgroup sub">' +
      '<a href="mobile.html">The Mobile Experience</a>' +
      '<a href="#house" data-close>The House</a>' +
      '<a href="#symbols" data-close>Greek Symbols</a>' +
      '<a href="#sizing" data-close>Sizing</a>' +
      '<a href="#shipping" data-close>Shipping &amp; Payment</a>' +
      '<a href="#visit" data-close>Visit the Store</a>' +
      '<a href="#contact" data-close>Contact</a>' +
      '</div>';
    $('#drawerBody').innerHTML = h;
    open('drawer');
  }

  function drawerList(kind) {
    var ids = kind === 'wish' ? wish : bag;
    $('#drawerTitle').textContent = kind === 'wish' ? 'Wish list' : 'Shopping bag';

    if (!ids.length) {
      $('#drawerBody').innerHTML = '<p class="bag-empty">' +
        (kind === 'wish' ? 'Nothing saved yet.' : 'Your bag is empty.') + '</p>';
      open('drawer');
      return;
    }

    var total = 0;
    var h = ids.map(function (id) {
      var p = byId(id); if (!p) return '';
      total += p.p;
      return '<div class="bag-item">' +
        '<img src="' + p.t + '" alt="" loading="lazy">' +
        '<div style="flex:1;display:flex;flex-direction:column">' +
          '<h4>' + p.n + '</h4>' +
          '<p>' + (p.m || '') + '</p>' +
          '<span class="bag-pr">' + money(p.p) + '</span>' +
        '</div>' +
        '<button class="bag-x" data-rm="' + id + '" data-kind="' + kind + '">Remove</button>' +
      '</div>';
    }).join('');

    if (kind === 'bag') {
      h += '<div class="bag-foot">' +
        '<div class="bag-tot"><span>Subtotal</span><b>' + money(total) + '</b></div>' +
        '<p class="bag-ship">Free shipping worldwide with Hellenic Post · DHL express available at checkout</p>' +
        '<button class="btn btn-solid" style="width:100%;justify-content:center" data-demo>Proceed to checkout</button>' +
        '<p class="bag-ship" style="margin:14px 0 0;text-align:center">Concept preview — no payment is taken.</p>' +
      '</div>';
    } else {
      h += '<div class="bag-foot"><a class="btn" style="width:100%;justify-content:center" href="#shop" data-close>Continue browsing</a></div>';
    }

    $('#drawerBody').innerHTML = h;
    open('drawer');
  }

  /* --------------------------------------------------------------- search */

  function search(q) {
    q = q.trim().toLowerCase();
    var r = $('#srchResults');
    if (!q) {
      r.innerHTML = '<p class="srch-hint">Try “evil eye”, “sapphire”, “byzantine”, “18k” or “chain”</p>' +
        P.slice(0, 6).map(srchItem).join('');
      return;
    }
    var hits = P.filter(function (p) {
      return (p.n + ' ' + p.m + ' ' + p.st + ' ' + p.coll.join(' ') + ' ' + p.cat.join(' ')).toLowerCase().indexOf(q) > -1;
    });
    r.innerHTML = hits.length
      ? '<p class="srch-hint">' + hits.length + ' result' + (hits.length === 1 ? '' : 's') + '</p>' + hits.slice(0, 40).map(srchItem).join('')
      : '<p class="srch-hint">Nothing found for “' + q.replace(/</g, '&lt;') + '”</p>';
  }

  function srchItem(p) {
    return '<button class="srch-item" data-open="' + p.id + '">' +
      '<img src="' + p.t + '" alt="" loading="lazy">' +
      '<span><b>' + p.n + '</b><span>' + (p.m || '') + (p.coll[0] ? ' · ' + p.coll[0] : '') + '</span></span>' +
      '<em>' + money(p.p) + '</em></button>';
  }

  /* ---------------------------------------------------------------- sizing */

  var RING = [
    [3, 44.2, 14.1, 'F'], [3.5, 45.5, 14.5, 'G'], [4, 46.8, 14.9, 'H½'], [4.5, 48.0, 15.3, 'I½'],
    [5, 49.3, 15.7, 'J½'], [5.5, 50.6, 16.1, 'K½'], [6, 51.9, 16.5, 'L½'], [6.5, 53.1, 16.9, 'M½'],
    [7, 54.4, 17.3, 'N½'], [7.5, 55.7, 17.7, 'O½'], [8, 57.0, 18.1, 'P½'], [8.5, 58.3, 18.5, 'Q½'],
    [9, 59.5, 18.9, 'R½'], [9.5, 60.8, 19.4, 'S½'], [10, 62.1, 19.8, 'T½'], [10.5, 63.4, 20.2, 'U½'],
    [11, 64.6, 20.6, 'V½'], [11.5, 65.9, 21.0, 'W½'], [12, 67.2, 21.4, 'X½'], [12.5, 68.5, 21.8, 'Y'],
    [13, 69.7, 22.2, 'Z']
  ];

  function buildConv() {
    var b = $('#convBody'); if (!b) return;
    b.innerHTML = RING.filter(function (r, i) { return i % 2 === 0; }).map(function (r) {
      return '<tr><td>' + r[0] + '</td><td>' + Math.round(r[1]) + '</td><td>' + r[3] + '</td><td>' + r[1].toFixed(1) + ' mm</td><td>' + r[2].toFixed(1) + ' mm</td></tr>';
    }).join('');
  }

  function convert() {
    var v = parseFloat($('#mm').value);
    var us = $('#oUS'), eu = $('#oEU'), uk = $('#oUK'), hint = $('#sizeHint');

    if (!v || v < 40 || v > 76) {
      us.textContent = eu.textContent = uk.textContent = '—';
      hint.textContent = 'Enter a measurement between 40 and 76 mm.';
      return;
    }

    var best = RING[0], bd = Infinity;
    RING.forEach(function (r) {
      var d = Math.abs(r[1] - v);
      if (d < bd) { bd = d; best = r; }
    });

    us.textContent = best[0];
    eu.textContent = Math.round(v);
    uk.textContent = best[3];

    hint.textContent = bd <= 0.7
      ? 'Closest standard size: US ' + best[0] + ' · inside diameter ' + best[2].toFixed(1) + ' mm.'
      : 'You fall between standard sizes — US ' + best[0] + ' is nearest. Message us before ordering and we will help you decide.';
  }

  /* ----------------------------------------------------------- interaction */

  function jumpTo(filter) {
    setFilter(filter);
    var s = document.getElementById('shop');
    if (s) {
      var y = s.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: y, behavior: 'matchMedia' in window && window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
    }
  }

  function toggleWish(id) {
    var i = wish.indexOf(id);
    if (i > -1) wish.splice(i, 1); else wish.push(id);
    store.set('wish', wish);
    syncPips();
    $$('[data-wish="' + id + '"]').forEach(function (b) {
      var on = wish.indexOf(id) > -1;
      b.classList.toggle('on', on);
      if (b.classList.contains('btn')) b.textContent = on ? 'Saved to wish list' : 'Save to wish list';
    });
  }

  function addBag(id) {
    if (bag.indexOf(id) < 0) bag.push(id);
    store.set('bag', bag);
    syncPips();
    $$('[data-bag="' + id + '"]').forEach(function (b) { b.textContent = 'In your bag'; });
  }

  document.addEventListener('click', function (e) {
    var t = e.target;

    var jump = t.closest('[data-jump]');
    if (jump) { e.preventDefault(); closeAll(); jumpTo(jump.dataset.jump); return; }

    var w = t.closest('[data-wish]');
    if (w) { e.preventDefault(); e.stopPropagation(); toggleWish(w.dataset.wish); return; }

    var b = t.closest('[data-bag]');
    if (b) { e.preventDefault(); addBag(b.dataset.bag); return; }

    var rm = t.closest('[data-rm]');
    if (rm) {
      e.preventDefault();
      var kind = rm.dataset.kind, arr = kind === 'wish' ? wish : bag, i = arr.indexOf(rm.dataset.rm);
      if (i > -1) arr.splice(i, 1);
      store.set(kind, arr);
      syncPips();
      drawerList(kind);
      render();
      return;
    }

    var op = t.closest('[data-open]');
    if (op) { e.preventDefault(); closeAll(); openPDP(op.dataset.open); return; }

    var card = t.closest('.card');
    if (card) { openPDP(card.dataset.id); return; }

    var chip = t.closest('.fchip');
    if (chip) { setFilter(chip.dataset.f); return; }

    var tab = t.closest('.size-tab');
    if (tab) {
      $$('.size-tab').forEach(function (x) { x.classList.toggle('on', x === tab); });
      $$('.size-pane').forEach(function (x) { x.classList.toggle('on', x.id === tab.dataset.pane); });
      return;
    }

    if (t.closest('[data-demo]')) {
      e.preventDefault();
      var f = t.closest('[data-demo]');
      f.textContent = 'Concept preview — no payment taken';
      setTimeout(function () { f.textContent = 'Proceed to checkout'; }, 2400);
      return;
    }

    if (t.closest('[data-close]')) { closeAll(); return; }
    if (t.closest('#scrim') || t.closest('#pdpClose') || t.closest('#drawerClose')) { closeAll(); return; }
    if (t.closest('#srchClose')) { closeAll(); return; }
  });

  $('#btnMenu').addEventListener('click', drawerMenu);
  $('#btnWish').addEventListener('click', function () { drawerList('wish'); });
  $('#btnBag').addEventListener('click', function () { drawerList('bag'); });
  $('#tabWish').addEventListener('click', function () { drawerList('wish'); });
  $('#tabBag').addEventListener('click', function () { drawerList('bag'); });

  function openSearch() {
    closeAll();
    $('#srch').classList.add('on');
    lock(true);
    search('');
    setTimeout(function () { $('#srchInput').focus(); }, 260);
  }
  $('#btnSearch').addEventListener('click', openSearch);
  $('#tabSearch').addEventListener('click', openSearch);
  $('#srchInput').addEventListener('input', function () { search(this.value); });

  $('#btnMore').addEventListener('click', function () { state.shown += PAGE; render(); });
  $('#sortBy').addEventListener('change', function () { state.sort = this.value; state.shown = PAGE; render(); });
  $('#mm').addEventListener('input', convert);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      e.preventDefault(); openSearch();
    }
  });

  /* contact form — concept only */
  $('#cForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#fName').value.trim(), mail = $('#fEmail').value.trim(), msg = $('#cMsg');
    if (!name || !mail) { msg.textContent = 'Please add your name and email.'; return; }
    msg.textContent = 'Thank you — this is a concept preview, so nothing was sent. Please call (+30) 22860 23633 or email the store.';
    this.reset();
  });

  /* header state */
  var hdr = $('#hdr');
  window.addEventListener('scroll', function () {
    hdr.classList.toggle('solid', window.pageYOffset > 40);
  }, { passive: true });

  /* reveal on scroll */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ------------------------------------------------------------------ init */

  buildMenus();
  buildCollections();
  buildChips();
  buildConv();
  render();
  syncPips();
})();
