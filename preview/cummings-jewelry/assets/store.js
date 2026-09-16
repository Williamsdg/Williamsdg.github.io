/* Cummings Jewelry Design — concept store.
   One catalogue shared by the public preview and the staff dashboard.
   Persists to localStorage in THIS browser only (demo). In production the
   same calls map onto their Shopify catalogue (Admin API), so staff never
   maintain products in two places. */
(function () {
  var KEY = 'cjd.demo.v1';
  var listeners = [];

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.version === window.CJD_SEED.version) return s;
      }
    } catch (e) {}
    return clone(window.CJD_SEED);
  }

  var state = load();

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      // Uploaded photos are stored as data URLs; a browser quota can be hit.
      return false;
    }
  }

  function emit() { listeners.forEach(function (fn) { try { fn(state); } catch (e) {} }); }

  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { state = load(); emit(); }
  });

  function money(n) {
    return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  var CJD = {
    get state() { return state; },
    onChange: function (fn) { listeners.push(fn); },
    save: function () { var ok = persist(); emit(); return ok; },
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      state = clone(window.CJD_SEED); emit();
    },

    all: function () { return state.products; },
    /* Public = published, not archived. Sold pieces stay addressable
       (their page still resolves) but never list as available. */
    publicPieces: function (opts) {
      opts = opts || {};
      return state.products.filter(function (p) {
        if (p.status !== 'published') return false;
        if (!opts.includeSold && p.availability === 'sold') return false;
        return true;
      });
    },
    get: function (handle) {
      for (var i = 0; i < state.products.length; i++) if (state.products[i].handle === handle) return state.products[i];
      return null;
    },
    upsert: function (p) {
      p.updated = new Date().toISOString().slice(0, 10);
      var i = state.products.findIndex(function (x) { return x.handle === p.handle; });
      if (i === -1) state.products.unshift(p); else state.products[i] = p;
      return CJD.save();
    },
    slug: function (title) {
      var base = String(title || 'new-piece').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'new-piece';
      var h = base, n = 2;
      while (CJD.get(h)) h = base + '-' + n++;
      return h;
    },
    featured: function () {
      return state.settings.featured.map(CJD.get).filter(function (p) {
        return p && p.status === 'published' && p.availability !== 'sold';
      });
    },
    addInquiry: function (q) {
      q.id = 'q' + Date.now();
      q.status = 'new';
      q.date = new Date().toISOString();
      state.inquiries.unshift(q);
      return CJD.save();
    },

    money: money,
    /* Never render a missing price as $0. */
    priceLabel: function (p) {
      if (p.priceMode === 'inquire' || !(Number(p.price) > 0)) return 'Price on request';
      if (p.priceMode === 'from') return 'From ' + money(p.price);
      return money(p.price);
    },
    availLabel: function (a) {
      return { available: 'Available', reserved: 'Reserved', sold: 'Sold', made: 'Made to order' }[a] || a;
    },
    cover: function (p) {
      var im = p.images && p.images[0];
      if (!im) return '';
      return /^img\/p\/.*-0\.webp$/.test(im) ? im.replace(/\.webp$/, '-s.webp') : im;
    }
  };

  window.CJD = CJD;
})();
