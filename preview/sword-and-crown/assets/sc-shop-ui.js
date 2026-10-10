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
    var img = p.image
      ? '<img class="ph-img" src="' + esc(p.image.url) + '" alt="' +
        esc(p.image.altText || p.title) + '" loading="lazy" decoding="async">'
      : '';
    var sub = [p.specs.cap_construction, p.specs.length, p.specs.colour]
      .filter(Boolean).join(' · ') || p.specs.size_range || p.type || '';
    var price = p.available
      ? (p.price != null ? money(p.price) : 'price on request')
      : 'Sold out';
    return '<a class="pcard rv" href="product.html?p=' + encodeURIComponent(p.handle) + '">' +
      '<div class="ph col' + (img ? ' has-img' : '') + '">' + img + '</div>' +
      '<b>' + esc(p.title) + '</b>' +
      '<small>' + esc(sub) + '</small>' +
      '<span class="price">' + esc(price) + '</span></a>';
  }

  function emptyState(what) {
    return '<div class="empty"><h3>Nothing here yet</h3><p>' + esc(what) + '</p></div>';
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
    S.products(opts.query, 60).then(function (rows) {
      if (!rows || !rows.length) { grid.innerHTML = emptyState(opts.emptyText); return; }
      all = rows; buildFilters(); render();
    });
  }

  /* ── boutique: five category tiles, filtered in place ──────────── */
  function boutique() {
    var grid = document.getElementById('boutiqueGrid');
    if (!grid) return;
    var tabs = document.getElementById('boutiqueTabs');
    var all = [], cat = new URLSearchParams(location.search).get('c') || 'all';

    function render() {
      var rows = cat === 'all' ? all : all.filter(function (p) {
        var hay = ((p.type || '') + ' ' + (p.tags || []).join(' ')).toLowerCase();
        return hay.indexOf(cat.toLowerCase()) > -1;
      });
      grid.innerHTML = rows.length ? rows.map(card).join('')
        : emptyState('Nothing in this category yet.');
      if (tabs) Array.prototype.forEach.call(tabs.querySelectorAll('button'), function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.c === cat));
      });
    }
    if (tabs) tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      cat = b.dataset.c; history.replaceState(null, '', '?c=' + encodeURIComponent(cat)); render();
    });

    if (!S.live) {
      grid.innerHTML = emptyState('The boutique opens as soon as the first pieces are listed.');
      render(); return;
    }
    S.products(null, 60).then(function (rows) {
      all = rows || []; render();
    });
  }

  /* ── single product ────────────────────────────────────────────── */
  var SPEC_LABELS = {
    cap_construction: 'Cap construction', cap_size: 'Cap size', length: 'Length',
    texture: 'Texture', density: 'Density', colour: 'Colour', bangs: 'Bangs',
    size_range: 'Size range', fabric: 'Fabric', model_height: 'Model',
    care: 'Care'
  };

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
      if (!p) { notFound('We couldn’t find that piece.'); return; }
      document.title = p.title + ' — Sword & Crown Salon and Studio';
      if (title) title.textContent = p.title;

      var specRows = Object.keys(SPEC_LABELS)
        .filter(function (k) { return p.specs[k]; })
        .map(function (k) {
          return '<div><dt>' + SPEC_LABELS[k] + '</dt><dd>' + esc(p.specs[k]) + '</dd></div>';
        }).join('');

      var gallery = (p.images.length ? p.images : (p.image ? [p.image] : []))
        .map(function (im, i) {
          return '<div class="ph col has-img' + (i ? '' : ' lead') + '">' +
            '<img class="ph-img" src="' + esc(im.url) + '" alt="' +
            esc(im.altText || p.title) + '" ' + (i ? 'loading="lazy"' : '') + '></div>';
        }).join('') || '<div class="ph col"></div>';

      host.innerHTML =
        '<div class="wrap prod">' +
          '<div class="prod-media">' + gallery + '</div>' +
          '<div class="prod-info">' +
            '<h1 class="d2">' + esc(p.title) + '</h1>' +
            '<p class="prod-price">' + (p.price != null ? money(p.price) : 'Price on request') + '</p>' +
            (p.available ? '' : '<p class="pill out" style="display:inline-block">Sold out</p>') +
            (p.description ? '<div class="prod-desc">' + esc(p.description).replace(/\n/g, '<br>') + '</div>' : '') +
            fitScale(p.fitIndex) +
            (specRows ? '<h2 class="d3" style="margin-top:28px">Specification</h2><dl class="cfacts">' + specRows + '</dl>' : '') +
            '<div class="prod-cta">' +
              (p.available && p.variantId
                ? '<a class="btn pink" href="' + esc(S.checkoutUrl([{ variantId: p.variantId, qty: 1 }])) + '">Add to bag</a>'
                : '') +
              '<a class="btn ghost" href="consultation.html">Book a consultation</a>' +
            '</div>' +
            '<p class="hint" style="margin-top:18px">Not sure if it’s right for you? ' +
            'A consultation includes a fitting and a face-framing cut for the wig you choose.</p>' +
          '</div>' +
        '</div>';
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    collection({
      gridId: 'wigGrid', barId: 'wigFilters', countId: 'wigCount',
      query: 'product_type:Wigs OR product_type:Toppers OR tag:wig',
      emptyText: 'The collection goes live as the first wigs are washed, set and photographed.'
    });
    boutique();
    product();
  });
})();
