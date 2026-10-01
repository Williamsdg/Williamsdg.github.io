/* Sword and Crown — page hydration.
 *
 * Every function here is a no-op unless the Supabase keys are set AND the
 * database actually returns rows. A page with no data keeps the sample content
 * it ships with, so the site can never look broken or empty because a backend
 * is missing, asleep or erroring.
 */
(function () {
  'use strict';
  var SC = window.SC;
  if (!SC || !SC.live) return;

  var esc = SC.esc;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ───────────────────────── shop ───────────────────────── */

  function productCard(p) {
    var spec = [p.cap, p.length, p.texture, p.colour].filter(Boolean).join(' · ');
    var price = p.price_cents != null ? SC.money(p.price_cents) : 'price on request';
    var sold = Number(p.stock) === 0;
    var img = p.image_url
      ? '<img class="ph-img" src="' + esc(p.image_url) + '" alt="' +
        esc(p.image_alt || p.name) + '" decoding="async" loading="lazy">'
      : '';
    return '<a class="pcard rv" data-cat="' + esc(p.category) + '" href="#sit">' +
      '<div class="ph col' + (img ? ' has-img' : '') + '">' + img + '</div>' +
      '<b>' + esc(p.name) + '</b>' +
      '<small>' + esc(spec || p.blurb || '') + '</small>' +
      '<span class="price">' + (sold ? 'Sold out' : esc(price)) + '</span>' +
      '</a>';
  }

  function hydrateShop() {
    var row = document.querySelector('.shop-row');
    if (!row) return;
    SC.products().then(function (rows) {
      if (!rows || !rows.length) return;      // keep the sample grid
      row.innerHTML = rows.map(productCard).join('');
      row.setAttribute('data-sc-live', 'true');
      if (window.SCShopFilter) window.SCShopFilter();
    });
  }

  /* ─────────────────── article lists ─────────────────── */

  function when(a) {
    if (!a.published_at) return '';
    return new Date(a.published_at).toLocaleDateString(undefined,
      { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function bibleCard(a) {
    return '<a class="bcard rv" href="wig-bible-article.html?a=' + encodeURIComponent(a.slug) + '">' +
      '<b>' + esc(a.title) + '</b>' +
      '<p>' + esc(a.excerpt || '') + '</p>' +
      (a.read_minutes ? '<span class="mins">' + a.read_minutes + ' min read</span>' : '') +
      '</a>';
  }

  function journalCard(a) {
    var cover = a.cover_url
      ? '<div class="plate light" style="background-image:url(' + esc(a.cover_url) +
        ');background-size:cover;background-position:center"><div class="frame"></div></div>'
      : '<div class="plate light"><div class="frame"></div></div>';
    return '<a class="jr-card rv" href="journal-post.html?a=' + encodeURIComponent(a.slug) + '">' +
      cover +
      '<div class="jr-date"><b>' + esc(when(a) || 'Journal') + '</b><span>News</span></div>' +
      '<h3>' + esc(a.title) + '</h3>' +
      '<p>' + esc(a.excerpt || '') + '</p>' +
      '</a>';
  }

  function hydrateList(sel, kind, card, limit) {
    var grid = document.querySelector(sel);
    if (!grid) return;
    SC.articles(kind, limit).then(function (rows) {
      if (!rows || !rows.length) return;      // keep the samples
      grid.innerHTML = rows.map(card).join('');
      grid.setAttribute('data-sc-live', 'true');
    });
  }

  /* ───────────────────── policies ───────────────────── */

  function hydratePolicies() {
    var blanks = document.querySelectorAll('[data-po]');
    if (!blanks.length) return;
    SC.setting('policies').then(function (v) {
      if (!v) return;
      var filled = 0, total = blanks.length;
      blanks.forEach(function (n) {
        var val = v[n.getAttribute('data-po')];
        if (val && String(val).trim()) { n.textContent = String(val).trim(); filled++; }
      });
      // The draft banner only comes down once every blank is genuinely answered.
      if (filled === total) {
        var b = document.getElementById('draftBanner');
        if (b) b.remove();
      }
    });
  }

  /* ──────────────────── non-profit ──────────────────── */

  function hydrateNonprofit() {
    var host = document.getElementById('npPage');
    if (!host) return;
    SC.setting('nonprofit').then(function (v) {
      if (!v || !v.name) return;              // keep the "coming soon" state
      var set = function (id, text, asMarkdown) {
        var n = document.getElementById(id);
        if (!n || !text) return;
        if (asMarkdown) n.innerHTML = SC.markdown(text);
        else n.textContent = text;
        n.closest('[data-np-block]') && n.closest('[data-np-block]').removeAttribute('hidden');
      };
      set('npTitle', v.name);
      set('npLede', v.mission);
      set('npBodyOut', v.body, true);
      set('npInvolveOut', v.involve, true);
      set('npContactOut', v.contact);
      var pending = document.getElementById('npPending');
      if (pending) pending.remove();
      document.title = v.name + ' — Sword & Crown Salon and Studio';
    });
  }

  ready(function () {
    hydrateShop();
    hydrateList('.bible-grid', 'wig-bible', bibleCard, 6);
    hydrateList('.jr-grid', 'journal', journalCard, 12);
    hydratePolicies();
    hydrateNonprofit();
  });
})();
