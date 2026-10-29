/* Sword and Crown — shop rendering: collection grids, filters, sorting,
 * product pages and the fit scale.
 *
 * Reads from Shopify through sc-shopify.js. With no Storefront token the
 * pages show an honest empty state rather than fabricated products.
 *
 * Her filter list for the wig collection (2026-10-02):
 *   colour · length · cap size · cap style · density · price
 * Her sort list:
 *   price low to high · price high to low · newest arrivals
 */
(function () {
  'use strict';

  var S = window.SCShop;
  if (!S) return;
  var esc = (window.SC && window.SC.esc) || function (x) { return String(x == null ? '' : x); };

  function money(n, cur) {
    if (n == null) return '';
    var whole = Math.abs(n % 1) < 0.005;
    return '$' + n.toLocaleString(undefined, {
      minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2
    });
  }

  /* ── product card ──────────────────────────────────────────────── */
  function card(p) {
    var img = p.image ? pic(p.image, p.title, [400, 600, 900], '(max-width:700px) 50vw, (max-width:1100px) 33vw, 320px', true) : '';
    var sub = [p.specs.cap_construction, p.specs.length, p.specs.colour]
      .filter(Boolean).join(' · ') || p.specs.size_range || p.type || '';
    var price = p.available
      ? (p.price != null ? money(p.price) : 'price on request')
      : 'Sold out';
    return '<a class="pcard rv" data-cat="' + catOf(p) + '" href="product.html?p=' + encodeURIComponent(p.handle) + '">' +
      '<div class="ph col' + (img ? ' has-img' : '') + '">' + img + '</div>' +
      '<b>' + esc(niceTitle(p.title)) + '</b>' +
      '<small>' + esc(sub) + '</small>' +
      '<span class="price">' + esc(price) + '</span></a>';
  }

  function niceTitle(t) {
    t = String(t || '');
    if (t.length > 3 && t === t.toUpperCase() && /[A-Z]/.test(t)) {
      return t.toLowerCase().replace(/(^|[\s\-\/(])([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); });
    }
    return t;
  }

  function pic(im, fallbackAlt, widths, sizes, lazy) {
    var srcset = widths.map(function (w) { return esc(S.img(im.url, w)) + ' ' + w + 'w'; }).join(', ');
    return '<img class="ph-img" src="' + esc(S.img(im.url, widths[1] || widths[0])) + '" srcset="' + srcset +
      '" sizes="' + sizes + '" alt="' + esc(im.altText || fallbackAlt) + '"' +
      (lazy ? ' loading="lazy"' : '') + ' decoding="async">';
  }

  /* wigs / toppers / other — the three tabs on the homepage row */
  function catOf(p) {
    var type = (p.type || '').toLowerCase().trim();
    var tags = (p.tags || []).map(function (t) { return String(t).toLowerCase().trim(); });
    var has = function (w) { return type === w || type === w + 's' || tags.indexOf(w) > -1 || tags.indexOf(w + 's') > -1; };
    return has('topper') ? 'toppers' : has('wig') ? 'wigs' : 'other';
  }

  function emptyState(what) {
    return '<div class="empty"><h3>Nothing here yet</h3><p>' + esc(what) + '</p></div>';
  }

  /* An empty collection and a collection that failed to load are different
     things, and "Nothing here yet" is a confident lie about the second. A dead
     feed looked exactly like an intentional coming-soon message, which is how
     this kind of fault survives for days without anybody noticing. */
  function failState() {
    return '<div class="empty"><h3>We can’t load the collection</h3>' +
      '<p>This is our end, not yours — the pieces are still here. ' +
      'Please call us on <a href="tel:+12052596911">(205) 259-6911</a> ' +
      'and we’ll talk you through what’s in.</p></div>';
  }

  /* ── the fit scale she asked for ───────────────────────────────── */
  function fitScale(idx) {
    if (idx == null) return '';
    var labels = ['Runs small', 'True to size', 'Runs large'];
    return '<div class="fitscale"><span class="fs-t">Fit</span><div class="fs-track">' +
      labels.map(function (l, i) {
        return '<div class="fs-step' + (i === idx ? ' on' : '') + '">' +
          '<span class="fs-dot"></span><span class="fs-l">' + l + '</span></div>';
      }).join('') + '</div></div>';
  }

  /* ── collection page with filters + sorting ────────────────────── */
  var FILTERS = [
    ['colour', 'Colour'], ['length', 'Length'], ['cap_size', 'Cap size'],
    ['cap_construction', 'Cap style'], ['density', 'Density']
  ];
  var SORTS = [
    ['new', 'Newest arrivals'],
    ['asc', 'Price: low to high'],
    ['desc', 'Price: high to low']
  ];
  /* the boutique's list (her brief of 2026-10-28): newest ADDED first by
     default inside every department, with A–Z and Z–A */
  var BSORTS = [
    ['new', 'Newest added'],
    ['az', 'A–Z'],
    ['za', 'Z–A'],
    ['asc', 'Price: low to high'],
    ['desc', 'Price: high to low']
  ];

  function collection(opts) {
    var grid = document.getElementById(opts.gridId);
    if (!grid) return;
    var bar = document.getElementById(opts.barId);
    var countEl = document.getElementById(opts.countId);
    var all = [], active = {}, sort = 'new', priceCap = null;

    function matches(p) {
      for (var k in active) {
        if (!active[k]) continue;
        if ((p.specs[k] || '').toLowerCase() !== active[k].toLowerCase()) return false;
      }
      if (priceCap != null && p.price != null && p.price > priceCap) return false;
      return true;
    }

    function render() {
      var rows = all.filter(matches);
      if (sort === 'asc') rows.sort(function (a, b) { return (a.price == null) - (b.price == null) || a.price - b.price; });
      if (sort === 'desc') rows.sort(function (a, b) { return (a.price == null) - (b.price == null) || b.price - a.price; });
      grid.innerHTML = rows.length ? rows.map(card).join('')
        : emptyState('Nothing matches those filters. Try widening them.');
      if (countEl) countEl.textContent = rows.length + (rows.length === 1 ? ' piece' : ' pieces');
    }

    function buildFilters() {
      if (!bar) return;
      var html = '';
      FILTERS.forEach(function (f) {
        var key = f[0];
        var vals = [];
        all.forEach(function (p) {
          var v = p.specs[key];
          if (v && vals.indexOf(v) === -1) vals.push(v);
        });
        if (vals.length < 2) return;            // a filter with one value is noise
        vals.sort();
        html += '<label class="fsel"><span>' + f[1] + '</span><select data-k="' + key + '">' +
          '<option value="">All</option>' +
          vals.map(function (v) { return '<option>' + esc(v) + '</option>'; }).join('') +
          '</select></label>';
      });
      var prices = all.map(function (p) { return p.price; }).filter(function (n) { return n != null; });
      if (prices.length > 1) {
        var max = Math.ceil(Math.max.apply(null, prices));
        html += '<label class="fsel wide"><span>Max price <b id="pcapv">' + money(max) + '</b></span>' +
          '<input type="range" id="pcap" min="0" max="' + max + '" value="' + max + '" step="10"></label>';
      }
      html += '<label class="fsel"><span>Sort</span><select data-sort>' +
        SORTS.map(function (s) { return '<option value="' + s[0] + '">' + s[1] + '</option>'; }).join('') +
        '</select></label>';
      bar.innerHTML = html;

      bar.addEventListener('change', function (e) {
        var sel = e.target;
        if (sel.hasAttribute('data-sort')) { sort = sel.value; render(); return; }
        if (sel.id === 'pcap') { priceCap = Number(sel.value); document.getElementById('pcapv').textContent = money(priceCap); render(); return; }
        if (sel.dataset.k) { active[sel.dataset.k] = sel.value; render(); }
      });
      bar.addEventListener('input', function (e) {
        if (e.target.id === 'pcap') {
          priceCap = Number(e.target.value);
          document.getElementById('pcapv').textContent = money(priceCap);
          render();
        }
      });
    }

    if (!S.live) {
      grid.innerHTML = emptyState(opts.emptyText);
      if (bar) bar.innerHTML = '';
      return;
    }
    /* A product belongs in this collection only if its TYPE is one of the match
       words (singular or plural) or a tag is exactly one of them. "wig supplies"
       (Wig Storage Containers) contains the word but is not a wig. */
    function belongs(p) {
      if (!opts.match) return true;
      var type = (p.type || '').toLowerCase().trim();
      var tags = (p.tags || []).map(function (t) { return String(t).toLowerCase().trim(); });
      return opts.match.some(function (w) {
        return type === w || type === w + 's' || tags.indexOf(w) > -1 || tags.indexOf(w + 's') > -1;
      });
    }
    S.products(opts.query).then(function (rows) {
      if (rows === null) { grid.innerHTML = failState(); return; }   // the call failed
      rows = rows.filter(belongs);   // Shopify's search can over-match on partial words
      if (rows.length) { all = rows; buildFilters(); render(); return; }

      /* Shopify's search matched nothing — which is NOT the same as an empty
         store. If her products are typed "Wig" where this query asks for
         "Wigs", every piece is there and the page still says "Nothing here
         yet". That exact mismatch is what emptied a collection on another
         Shopify build, so check for near matches before believing it. */
      if (!opts.match) { grid.innerHTML = emptyState(opts.emptyText); return; }
      S.products(null).then(function (every) {
        if (every === null) { grid.innerHTML = failState(); return; }
        var near = every.filter(belongs);
        if (!near.length) { grid.innerHTML = emptyState(opts.emptyText); return; }
        if (window.console) {
          console.warn('[sc-shop] "' + opts.query + '" matched nothing, but ' +
            near.length + ' product(s) match on type/tags. Check the ' +
            'product_type spelling in Shopify.');
        }
        all = near; buildFilters(); render();
      });
    });
  }

  /* ── homepage "Meet your new crown" row ─────────────────────────
     The four newest wigs/toppers from Shopify replace the four sample cards;
     the editorial photo tile at the end stays. With nothing typed Wigs or
     Toppers in Shopify yet, the samples stay exactly as shipped. */
  function home() {
    var row = document.getElementById('homeShop');
    if (!row || !S.live) return;
    function belongs(p) { return catOf(p) !== 'other'; }
    S.products('product_type:Wigs OR product_type:Toppers OR tag:wig').then(function (rows) {
      if (!rows) return;
      rows = rows.filter(belongs);
      if (!rows.length) return;
      var keep = row.querySelector('.shop-edit');
      row.innerHTML = rows.slice(0, 4).map(card).join('') + (keep ? keep.outerHTML : '');
      row.classList.remove('shop-row-soon');
      row.setAttribute('data-sc-live', 'true');
      var tabs = document.getElementById('homeTabs'), soon = document.getElementById('homeShopSoon'), cta = document.getElementById('homeShopCta');
      if (tabs) tabs.hidden = false;
      if (soon) soon.hidden = true;
      if (cta) cta.hidden = false;
    });
  }

  /* ── boutique ──────────────────────────────────────────────────────
     Her structure (2026-10-28): four departments with dropdown categories,
     a Holiday edit and Shop All. Placement comes from sc-catalog.js — her
     own Shopify tags and explicit assignments, never a guess from a title.
     Search, sort, count, size / price / stock filters, 48 at a time, and the
     filters + scroll position come back when a shopper returns from a piece. */
  function boutique() {
    var grid = document.getElementById('boutiqueGrid');
    if (!grid) return;
    var C = window.SC_CATALOG;
    var navEl = document.getElementById('boutiqueNav'), crumbs = document.getElementById('bCrumbs');
    var intro = document.getElementById('bIntro');
    var PAGE = 48, all = [];
    /* st.c is the chosen category key, or '' for none. With none chosen the
       page is a department chooser — never the whole assortment mixed
       together (her brief of 2026-10-28). Old "?c=all" links land there too. */
    var st = { c: '', q: '', sort: 'new', size: '', max: null, stock: false, shown: 0 };
    var qs = new URLSearchParams(location.search);
    if (qs.get('c')) st.c = qs.get('c');
    if (st.c === 'all' || (st.c && C && !C.find(st.c))) st.c = '';
    var section = grid.closest('section'), chooser = document.getElementById('bChooser');

    /* coming back from a product page: pick up where they left off */
    var saved = null, restoreY = 0;
    try { saved = JSON.parse(sessionStorage.getItem('sc_boutique') || 'null'); } catch (e) {}
    var navType = (performance.getEntriesByType && (performance.getEntriesByType('navigation')[0] || {}).type) || '';
    var cameBack = navType === 'back_forward' || /product\.html/.test(document.referrer);
    if (saved && cameBack && (!qs.get('c') || saved.c === st.c)) {
      st = saved; restoreY = saved.y || 0; st.shown = Math.max(st.shown || 0, PAGE);
      if (st.c === 'all' || (st.c && C && !C.find(st.c))) st.c = '';
    }
    function save() {
      try { st.y = window.scrollY; sessionStorage.setItem('sc_boutique', JSON.stringify(st)); } catch (e) {}
    }
    addEventListener('pagehide', save);

    var bar = document.createElement('div'); bar.className = 'shop-bar';
    var more = document.createElement('div'); more.className = 'shop-more'; more.hidden = true;
    more.innerHTML = '<button type="button" class="btn ghost">Show more</button>';

    function node(key) { return C && key ? C.find(key) : null; }
    function nameOf(key) { var n = node(key); return n ? n.name : 'The Boutique'; }
    function choosing() { return !st.c; }
    function inCat(p) { return !!st.c && !!C && C.keysOf(p).indexOf(st.c) > -1; }
    function sizesOf(p) {
      var o = (p.options || []).filter(function (x) { return /^size$/i.test(x.name); })[0];
      return o ? o.values : [];
    }

    function rowsNow() {
      var rows = all.filter(inCat);
      if (st.q) rows = rows.filter(function (p) {
        return ((p.title || '') + ' ' + (p.type || '') + ' ' + (p.tags || []).join(' ')).toLowerCase().indexOf(st.q) > -1;
      });
      if (st.size) rows = rows.filter(function (p) { return sizesOf(p).indexOf(st.size) > -1; });
      if (st.max != null) rows = rows.filter(function (p) { return p.price == null || p.price <= st.max; });
      if (st.stock) rows = rows.filter(function (p) { return p.available; });
      /* 'new' is the order Shopify handed us: CREATED_AT descending, i.e. the
         date each piece was ADDED to the store — not when its description
         was last edited, not a collection's manual order. Nothing to do. */
      if (st.sort === 'az') rows.sort(function (a, b) { return (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base', numeric: true }); });
      if (st.sort === 'za') rows.sort(function (a, b) { return (b.title || '').localeCompare(a.title || '', undefined, { sensitivity: 'base', numeric: true }); });
      if (st.sort === 'asc') rows.sort(function (a, b) { return (a.price == null) - (b.price == null) || a.price - b.price; });
      if (st.sort === 'desc') rows.sort(function (a, b) { return (a.price == null) - (b.price == null) || b.price - a.price; });
      return rows;
    }

    /* ── the department chooser: five doors, same photos as the homepage ── */
    function paintChooser() {
      if (!chooser || !C || chooser.childElementCount) return;
      chooser.innerHTML = C.MAIN.map(function (m, i) {
        return '<a class="style-tile" href="?c=' + esc(m.key) + '" data-c="' + esc(m.key) + '" data-cat="' + esc(m.key) + '">' +
          '<span class="st-n">' + (i < 9 ? '0' : '') + (i + 1) + '</span><b>' + esc(m.name) + '</b><small class="st-count"></small></a>';
      }).join('');
    }
    function paintDoors() { if (chooser) fillDoors(chooser.querySelectorAll('.style-tile[data-cat]'), all); }
    /* chooser (no category) vs. shopping (a category): the rust intro with
       the doors, or the tabs + toolbar + grid */
    function paintMode() {
      var ch = choosing();
      if (section) section.classList.toggle('rust', ch);
      if (intro) intro.hidden = !ch;
      if (chooser) chooser.hidden = !ch;
      if (navEl) navEl.hidden = ch;
      bar.hidden = ch;
      if (ch) more.hidden = true;
      grid.hidden = ch;
    }

    /* ── category nav + breadcrumbs ── */
    function pill(key, label, cls, current) {
      return '<a href="?c=' + encodeURIComponent(key) + '" data-c="' + esc(key) + '"' + (cls ? ' class="' + cls + '"' : '') +
        (current ? ' aria-current="true"' : '') + '>' + esc(label) + '</a>';
    }
    function paintNav() {
      if (!navEl || !C) return;
      var cur = node(st.c);
      var mainKey = cur ? cur.main : null;
      var html = '<div class="shop-tabs">' +
        C.MAIN.map(function (m) {
          return '<a href="?c=' + m.key + '" data-c="' + m.key + '"' + (mainKey === m.key ? ' aria-current="true"' : '') + '>' + esc(m.short) + '</a>';
        }).join('') + '</div>';
      if (mainKey && C.children(mainKey).length) {
        var subKey = cur.sub || null;
        html += '<div class="shop-subs">' + pill(mainKey, 'Shop All ' + C.find(mainKey).name.split(' / ')[0], 'all', st.c === mainKey) +
          C.children(mainKey).map(function (s) { return pill(s.key, s.name, '', subKey === s.key); }).join('') + '</div>';
        if (subKey && C.children(subKey).length) {
          html += '<div class="shop-subs lvl3">' + pill(subKey, 'All ' + C.find(subKey).name, 'all', st.c === subKey) +
            C.children(subKey).map(function (t) { return pill(t.key, t.name, '', st.c === t.key); }).join('') + '</div>';
        }
      }
      navEl.innerHTML = html;
      if (crumbs) {
        var trail = [];
        var n = cur;
        while (n) { trail.unshift(n); n = n.parent ? C.find(n.parent) : null; }
        crumbs.innerHTML = '<a href="index.html">Home</a><span aria-hidden="true">/</span>' +
          (trail.length ? '<a href="boutique.html">Boutique</a>' : '<span>Boutique</span>') +
          trail.map(function (t, i) {
            return '<span aria-hidden="true">/</span>' + (i === trail.length - 1 ? '<span>' + esc(t.name) + '</span>' : '<a href="?c=' + t.key + '">' + esc(t.name) + '</a>');
          }).join('');
      }
      paintMode();
      document.title = (cur ? cur.name + ' — The Boutique' : 'The Boutique') + ' — Sword & Crown Salon and Studio';
    }
    function pick(e) {
      var a = e.target.closest('a[data-c]'); if (!a) return;
      e.preventDefault();
      st.c = a.getAttribute('data-c'); st.size = ''; st.shown = 0;
      history.replaceState(null, '', st.c ? '?c=' + encodeURIComponent(st.c) : 'boutique.html');
      paintNav(); paintBar(); render();
    }
    if (navEl) navEl.addEventListener('click', pick);
    if (chooser) chooser.addEventListener('click', pick);

    /* ── toolbar: search · sort · size · price · stock · count ── */
    function paintBar() {
      var rows = all.filter(inCat);
      var sizes = [];
      rows.forEach(function (p) { sizesOf(p).forEach(function (v) { if (sizes.indexOf(v) === -1) sizes.push(v); }); });
      var ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '1X', '2X', '3X'];
      sizes.sort(function (a, b) { var ia = ORDER.indexOf(a.toUpperCase()), ib = ORDER.indexOf(b.toUpperCase()); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b, undefined, { numeric: true }); });
      var prices = rows.map(function (p) { return p.price; }).filter(function (n) { return n != null; });
      var max = prices.length ? Math.ceil(Math.max.apply(null, prices)) : 0;
      if (st.max != null && st.max >= max) st.max = null;
      bar.innerHTML =
        '<label class="fsel grow"><span>Search</span><input type="search" id="bq" placeholder="Search the boutique" autocomplete="off" aria-label="Search the boutique" value="' + esc(st.q) + '"></label>' +
        '<label class="fsel"><span>Sort</span><select id="bsort">' +
          BSORTS.map(function (x) { return '<option value="' + x[0] + '"' + (st.sort === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select></label>' +
        (sizes.length ? '<label class="fsel"><span>Size</span><select id="bsize"><option value="">All sizes</option>' +
          sizes.map(function (v) { return '<option' + (st.size === v ? ' selected' : '') + '>' + esc(v) + '</option>'; }).join('') + '</select></label>' : '') +
        (max > 0 ? '<label class="fsel wide"><span>Max price <b id="pcapv">' + money(st.max != null ? st.max : max) + '</b></span>' +
          '<input type="range" id="pcap" min="0" max="' + max + '" value="' + (st.max != null ? st.max : max) + '" step="5"></label>' : '') +
        '<label class="filter-chk"><input type="checkbox" id="bstock"' + (st.stock ? ' checked' : '') + '> In stock only</label>' +
        '<p class="filter-count" id="bcount" aria-live="polite"></p>';
    }
    var t;
    bar.addEventListener('input', function (e) {
      if (e.target.id === 'bq') { clearTimeout(t); t = setTimeout(function () { st.q = e.target.value.trim().toLowerCase(); render(); }, 160); }
      if (e.target.id === 'pcap') { st.max = Number(e.target.value); var v = document.getElementById('pcapv'); if (v) v.textContent = money(st.max); render(); }
    });
    bar.addEventListener('change', function (e) {
      if (e.target.id === 'bsort') { st.sort = e.target.value; render(); }
      if (e.target.id === 'bsize') { st.size = e.target.value; render(); }
      if (e.target.id === 'bstock') { st.stock = e.target.checked; render(); }
    });

    /* ── the grid ── */
    function render(append) {
      if (choosing()) { grid.innerHTML = ''; more.hidden = true; paintMode(); save(); return; }
      var rows = rowsNow();
      if (!append) { st.shown = Math.max(st.shown && restoreY ? st.shown : 0, 0); grid.innerHTML = ''; }
      if (!rows.length) {
        var why = st.q ? 'Nothing matches “' + st.q + '” here. Try another word, or another department.' :
          (st.size || st.max != null || st.stock) ? 'Nothing matches those filters. Try widening them.' :
          'Nothing in ' + nameOf(st.c) + ' yet.';
        grid.innerHTML = '<div class="empty"><h3>Nothing here yet</h3><p>' + esc(why) + '</p><a class="btn ghost" href="boutique.html">Browse departments</a></div>';
        st.shown = 0;
      } else {
        var from = append ? st.shown : 0, to = append ? st.shown + PAGE : Math.max(PAGE, st.shown || 0);
        if (!append) grid.innerHTML = '';
        grid.insertAdjacentHTML('beforeend', rows.slice(from, to).map(card).join(''));
        st.shown = Math.min(to, rows.length);
      }
      more.hidden = st.shown >= rows.length;
      var c = document.getElementById('bcount');
      if (c) c.textContent = rows.length + (rows.length === 1 ? ' piece' : ' pieces') + (st.shown < rows.length ? ' · showing ' + st.shown : '');
      if (restoreY) { var y = restoreY; restoreY = 0; requestAnimationFrame(function () { window.scrollTo(0, y); }); }
      save();
    }
    more.querySelector('button').addEventListener('click', function () { render(true); });

    function load() {
      grid.innerHTML = '<div class="shop-loading" aria-label="Loading the boutique"><div></div><div></div><div></div><div></div></div>';
      S.products(null).then(function (rows) {
        if (rows === null) {
          grid.hidden = false;   // the chooser hides the grid; the fault must still show
          grid.innerHTML = failState() + '<p style="text-align:center;margin-top:-10px"><button type="button" class="btn ghost" id="bretry">Try again</button></p>';
          var r = document.getElementById('bretry'); r && r.addEventListener('click', load);
          return;
        }
        all = rows;
        paintDoors();
        if (C) {
          var orphans = rows.filter(function (p) { return !C.keyOf(p); });
          window.SC_ORPHANS = orphans;
          if (orphans.length && window.console) console.info('[sc-shop] ' + orphans.length + ' piece(s) have no category yet — see window.SC_ORPHANS');
        }
        if (!bar.parentNode) { grid.parentNode.insertBefore(bar, grid); grid.parentNode.insertBefore(more, grid.nextSibling); }
        paintNav(); paintBar(); render();
      });
    }
    paintChooser();
    if (!S.live) { paintNav(); grid.hidden = false; grid.innerHTML = emptyState('The boutique opens as soon as the first pieces are listed.'); return; }
    paintNav(); load();
  }

  /* ── single product ────────────────────────────────────────────── */
  var SPEC_LABELS = {
    cap_construction: 'Cap construction', cap_size: 'Cap size', length: 'Length',
    texture: 'Texture', density: 'Density', colour: 'Colour', bangs: 'Bangs',
    size_range: 'Size range', fabric: 'Fabric', model_height: 'Model',
    care: 'Care'
  };

  /* wig or topper by TYPE or an exact tag — the complimentary-cut line is a
     wig promise and must not appear on a scarf */
  function isWig(p) {
    var type = (p.type || '').toLowerCase().trim();
    var tags = (p.tags || []).map(function (t) { return String(t).toLowerCase().trim(); });
    return ['wig', 'wigs', 'topper', 'toppers'].some(function (w) { return type === w || tags.indexOf(w) > -1; });
  }

  function product() {
    var host = document.getElementById('productPage');
    if (!host) return;
    var handle = new URLSearchParams(location.search).get('p');
    var title = document.getElementById('pTitle');

    function notFound(m) {
      host.innerHTML = '<div class="wrap" style="padding:60px 0"><h1 class="d2">' +
        esc(m) + '</h1><p class="lede" style="margin-top:14px">' +
        '<a href="wigs.html">Browse the wig collection</a> or ' +
        '<a href="boutique.html">the boutique</a>.</p></div>';
    }

    if (!handle) { notFound('No product chosen.'); return; }
    if (!S.live) { notFound('The shop isn’t connected yet.'); return; }

    S.product(handle).then(function (p) {
      if (p === false) {
        notFound('We can’t load this piece right now — call us on (205) 259-6911.');
        return;
      }
      if (!p) { notFound('We couldn’t find that piece.'); return; }
      document.title = p.title + ' — Sword & Crown Salon and Studio';
      if (title) title.textContent = p.title;

      var specRows = Object.keys(SPEC_LABELS)
        .filter(function (k) { return p.specs[k]; })
        .map(function (k) {
          return '<div><dt>' + SPEC_LABELS[k] + '</dt><dd>' + esc(p.specs[k]) + '</dd></div>';
        }).join('');

      /* Gallery: on a desktop the first photo leads and the rest sit two-up
         beneath it; on a phone it is one swipeable row, so the price and the
         button are one scroll away instead of five photos away. */
      var imgs = p.images.length ? p.images : (p.image ? [p.image] : []);
      var gallery = imgs.map(function (im, i) {
        return '<div class="ph col has-img' + (i ? '' : ' lead') + '" data-src="' + esc(im.url) + '">' +
          pic(im, p.title, [600, 1000, 1600], '(max-width:900px) 86vw, 640px', i > 0) + '</div>';
      }).join('') || '<div class="ph col lead"></div>';

      /* Options → a picker. A product with the single Shopify default option
         ("Title: Default Title") has nothing to choose. */
      var opts = p.options.filter(function (o) {
        return !(o.values.length === 1 && o.values[0] === 'Default Title');
      });
      var picker = opts.length ? '<div class="prod-opts">' + opts.map(function (o) {
        return '<div class="opt" data-opt="' + esc(o.name) + '"><span class="opt-l">' + esc(o.name) + ' <b></b></span><div class="opt-vals">' +
          o.values.map(function (v) {
            return '<button type="button" data-v="' + esc(v) + '" aria-pressed="false">' + esc(v) + '</button>';
          }).join('') + '</div></div>';
      }).join('') + '</div>' : '';

      var C = window.SC_CATALOG;
      var trail = (!isWig(p) && C) ? C.trail(p) : [];
      var deepest = trail.length ? trail[trail.length - 1] : null;
      var crumbHtml = '<nav class="crumbs prod-crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span>' +
        (isWig(p) ? '<a href="wigs.html">Wigs &amp; Toppers</a>' : '<a href="boutique.html">Boutique</a>' +
          trail.map(function (t) { return '<span aria-hidden="true">/</span><a href="boutique.html?c=' + t.key + '">' + esc(t.name) + '</a>'; }).join('')) +
        '<span aria-hidden="true">/</span><span>' + esc(niceTitle(p.title)) + '</span></nav>';
      var backHref = isWig(p) ? 'wigs.html' : 'boutique.html' + (deepest ? '?c=' + deepest.key : '');
      var backLabel = isWig(p) ? 'Back to the collection' : 'Back to ' + (deepest ? deepest.name : 'the boutique');
      var clothing = !isWig(p) && (/clothing/i.test(p.type || '') || (deepest && C && C.main(deepest.key) && C.main(deepest.key).key === 'clothing'));
      var secondary = isWig(p)
        ? '<a class="btn ghost" href="consultation.html">Book a consultation</a>'
        : '<button class="btn ghost" type="button" data-soon data-soon-title="' + (clothing ? 'Questions about fit?' : 'Questions?') + '" data-soon-msg="' +
          (clothing ? 'Ask us anything about fit, sizing or fabric — call or text us at 205•259•6911 and we’ll help.' : 'Ask us anything about this piece — call or text us at 205•259•6911 and we’ll help.') +
          '">' + (clothing ? 'Questions about fit? Ask us.' : 'Questions? Ask us.') + '</button>';
      /* clothing facts come from her Shopify fields only — no empty headings, nothing invented */
      var CLOTH = [['measurements', 'Fit & measurements'], ['size_guide', 'Size guide'], ['fabric', 'Fabric'], ['care', 'Care'], ['model_size', 'Model wears'], ['model_height', 'Model height']];
      var clothRows = clothing ? CLOTH.filter(function (k) { return p.specs[k[0]]; }).map(function (k) {
        var v = p.specs[k[0]];
        var val = /^https?:\/\//.test(v) ? '<a href="' + esc(v) + '" target="_blank" rel="noopener">View size guide</a>' : esc(v).replace(/\n/g, '<br>');
        return '<div><dt>' + k[1] + '</dt><dd>' + val + '</dd></div>';
      }).join('') : '';
      /* key return terms at the purchase step (Elana's policies, 2026-10-29) */
      var returns = isWig(p)
        ? '<p class="prod-return">Wig returns must be initiated within 5 calendar days of delivery or purchase; the wig must be unworn and unaltered, with lace uncut. Approved change-of-mind wig returns incur a $250 restocking fee per wig. <a href="policies.html#wig-returns">Read the return policy</a>.</p>'
        : '<p class="prod-return">Returns must be initiated within 14 calendar days of delivery or in-store purchase, with items in original condition. Items clearly marked Final Sale are nonreturnable for change of mind. <a href="policies.html#retail-returns">Read the return policy</a>.</p>';

      host.innerHTML =
        '<div class="wrap prod">' + crumbHtml +
          '<div class="prod-media-wrap"><div class="prod-media" id="pMedia">' + gallery + '</div>' +
            (imgs.length > 1 ? '<p class="prod-count" id="pCount" aria-live="polite">1 / ' + imgs.length + '</p>' : '') +
          '</div>' +
          '<div class="prod-info">' +
            '<h1 class="d2">' + esc(p.title) + '</h1>' +
            '<p class="prod-price" id="pPrice"></p>' +
            '<p class="prod-sold" id="pSold" hidden>Sold out</p>' +
            (p.description ? '<div class="prod-desc">' + esc(p.description).replace(/\n/g, '<br>') + '</div>' : '') +
            fitScale(p.fitIndex) +
            picker +
            '<div class="prod-cta">' +
              (p.variants.length ? '<button class="btn pink" type="button" data-add="">Add to bag</button>' : '') +
              secondary +
            '</div>' +
            returns +
            (clothRows ? '<h2 class="d3" style="margin-top:28px">Fit &amp; details</h2><dl class="cfacts">' + clothRows + '</dl>' : '') +
            (specRows && !clothing ? '<h2 class="d3" style="margin-top:28px">Specification</h2><dl class="cfacts">' + specRows + '</dl>' : '') +
            '<a class="prod-back" href="' + esc(backHref) + '" data-back>&larr; ' + esc(backLabel) + '</a>' +
            (isWig(p)
              ? '<p class="hint" style="margin-top:18px"><b>Each wig purchase includes one Fringe Benefits service ' +
                'and one Shape-Up light layering cut.</b> This is a one-time offer redeemed at the time of an ' +
                'in-house wig purchase.</p>'
              : '') +
          '</div>' +
        '</div>';

      /* ── variant state ── */
      var sel = {};
      var init = p.variants.filter(function (v) { return v.available; })[0] || p.variants[0];
      if (init) init.selectedOptions.forEach(function (so) { sel[so.name] = so.value; });

      function current() {
        return p.variants.filter(function (v) {
          return v.selectedOptions.every(function (so) { return sel[so.name] === so.value; });
        })[0] || null;
      }
      /* Can this value be bought together with everything else chosen? */
      function possible(name, value) {
        return p.variants.some(function (v) {
          return v.available && v.selectedOptions.every(function (so) {
            return so.name === name ? so.value === value : (sel[so.name] == null || sel[so.name] === so.value);
          });
        });
      }
      function paintVariant(userChose) {
        var v = current();
        Array.prototype.forEach.call(host.querySelectorAll('.opt'), function (el) {
          var name = el.getAttribute('data-opt');
          el.querySelector('.opt-l b').textContent = sel[name] || '';
          Array.prototype.forEach.call(el.querySelectorAll('button'), function (b) {
            var val = b.getAttribute('data-v');
            b.setAttribute('aria-pressed', String(sel[name] === val));
            b.classList.toggle('off', !possible(name, val));
          });
        });
        var price = host.querySelector('#pPrice'), btn = host.querySelector('[data-add]'), sold = host.querySelector('#pSold');
        if (!v) {
          price.textContent = p.price != null ? money(p.price) : 'Price on request';
          if (btn) { btn.disabled = true; btn.textContent = 'Not available in that combination'; }
          if (sold) sold.hidden = true;
          return;
        }
        price.textContent = v.price != null ? money(v.price) : 'Price on request';
        if (btn) { btn.setAttribute('data-add', v.id); btn.disabled = !v.available; btn.textContent = v.available ? 'Add to bag' : 'Sold out'; }
        if (sold) sold.hidden = v.available;
        // A variant with its own photo: bring that photo into view.
        if (userChose && v.image) {
          var tile = host.querySelector('.prod-media .ph[data-src="' + v.image.url.replace(/"/g, '') + '"]');
          if (tile && tile.scrollIntoView) tile.scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'smooth' });
        }
      }
      /* back = the collection they came from, with its filters and scroll */
      var back = host.querySelector('[data-back]');
      if (back) back.addEventListener('click', function (e) {
        if (history.length > 1 && /boutique\.html|wigs\.html/.test(document.referrer)) { e.preventDefault(); history.back(); }
      });
      host.addEventListener('click', function (e) {
        var b = e.target.closest('.opt-vals button'); if (!b) return;
        sel[b.closest('.opt').getAttribute('data-opt')] = b.getAttribute('data-v');
        paintVariant(true);
      });
      paintVariant(false);

      /* ── "2 / 4" under the phone gallery ── */
      var media = host.querySelector('#pMedia'), cnt = host.querySelector('#pCount');
      if (media && cnt) media.addEventListener('scroll', function () {
        var first = media.firstElementChild; if (!first) return;
        var step = first.getBoundingClientRect().width + 10;
        var i = Math.min(imgs.length, Math.round(media.scrollLeft / step) + 1);
        cnt.textContent = i + ' / ' + imgs.length;
      }, { passive: true });
    });
  }

  /* ── homepage "Find your style" tiles ──────────────────────────
     Each department door shows a real photo plus how many pieces are in it.
     Which photo: the piece Elana chose for that door in sc-config.js
     (STYLE_TILES, her brief of 2026-10-28 — a year-round piece, not the
     newest arrival), or, when that handle is gone or has no picture, the
     newest piece in the department that has one. Before the feed answers
     (or with it unreachable) the tile is the plain paper door it ships with. */
  function fillDoors(tiles, rows) {
    var C = window.SC_CATALOG;
    if (!tiles || !tiles.length || !rows || !C) return;
    var chosen = (window.SC_CONFIG && window.SC_CONFIG.STYLE_TILES) || {};
    var used = {};   // no two doors show the same piece (Holiday overlaps Clothing)
    Array.prototype.forEach.call(tiles, function (t) {
      if (t.querySelector('.st-ph')) return;   // already dressed
      var key = t.getAttribute('data-cat');
      var all = rows.filter(function (p) { return C.keysOf(p).indexOf(key) > -1; });
      var n = t.querySelector('.st-count');
      if (n && all.length) n.textContent = all.length + (all.length === 1 ? ' piece' : ' pieces');
      var want = chosen[key], p = null;
      if (want) rows.some(function (r) { if (r.handle === want && r.image) { p = r; return true; } return false; });
      if (!p) p = all.filter(function (r) { return r.image && !used[r.handle]; })[0] || null;
      if (!p) return;
      used[p.handle] = true;
      t.insertAdjacentHTML('afterbegin', '<span class="st-ph">' +
        pic(p.image, p.title, [480, 900], '(max-width:620px) 50vw, (max-width:1100px) 33vw, 20vw', true) + '</span>');
      t.classList.add('has-ph');
    });
  }
  /* the homepage doors fetch for themselves; the boutique page dresses its
     chooser from the catalogue it already loads */
  function styleTiles() {
    var tiles = document.querySelectorAll('.style-tile[data-cat]');
    if (!tiles.length || !S.live || !window.SC_CATALOG || document.getElementById('boutiqueGrid')) return;
    S.products(null).then(function (rows) { fillDoors(tiles, rows); });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    collection({
      gridId: 'wigGrid', barId: 'wigFilters', countId: 'wigCount',
      query: 'product_type:Wigs OR product_type:Toppers OR tag:wig',
      match: ['wig', 'topper'],
      emptyText: 'The collection goes live as the first wigs are washed, set and photographed.'
    });
    boutique();
    product();
    home();
    styleTiles();
  });
})();
