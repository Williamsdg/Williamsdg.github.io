/* ==========================================================================
   Meat Church concept — editorial store
   One source of truth shared by the admin dashboard and the Journal Studio.
   Seeded from the live catalog, then persisted to localStorage.
   ========================================================================== */
(function () {
  'use strict';
  var KEY = 'mc-journal-v2';

  /* three long-form samples so the Story side of the Journal is visible.
     Flagged sample:true and labelled wherever they appear. */
  var STORIES = [
    { slug: 'trim-day', title: 'Why we trim a brisket the way we do',
      hero: 'img/recipe/tri-tip-smoked-like-a-brisket.jpg', tags: 'Technique, Beef',
      dek: 'Fat you leave on, fat you take off, and the one cut that decides how the whole thing cooks.',
      rubs: ['holy-cow-rub'], status: 'Published', ago: 11,
      body: '## Start with the fat cap\nTake the cap down to a quarter inch and stop. Any less and the flat dries out before the point is ready. Any more and you end up with a greasy band under the bark that never renders.\n\n## The deckle is the decision\nThe hard seam of fat between the point and the flat is the one place where trimming actually changes the cook. Leave too much and the two muscles finish hours apart.\n\n## Then season like you mean it\nTrim, then season, then let it sit while the pit comes up to temperature. A coarse Texas-style rub wants surface to hold on to.' },
    { slug: 'fire-management', title: 'Fire management is the part nobody films',
      hero: 'img/recipe/beef-back-party-ribs.jpg', tags: 'Technique, Fire',
      dek: 'A clean fire does more for flavor than any rub. Here is how we keep one for twelve hours.',
      rubs: [], status: 'Scheduled', ago: -6,
      body: '## Thin blue smoke, not white\nWhite smoke is a fire starved of air. If you can smell it from the driveway, your food is going to taste like it.\n\n## Feed it small, feed it often\nOne split at a time, pre-warmed on the firebox. A big log drops the temperature and smoulders before it catches.' },
    { slug: 'first-cook', title: 'What your first bad cook is actually teaching you',
      hero: 'img/recipe/pork-butt-cooked-like-whole-hog.jpg', tags: 'Notes',
      dek: 'Everyone ruins a brisket. The useful question is which part you got wrong.',
      rubs: [], status: 'Draft', ago: 2,
      body: '## Dry usually means early\nA dry brisket is more often pulled at the wrong time than cooked at the wrong temperature.\n\n## Write it down\nPit temp, ambient, when you wrapped, when you pulled. Three cooks of notes will teach you more than thirty videos.' }
  ];

  function iso(d) { return d.toISOString().slice(0, 10); }
  function daysAgo(n) { var d = new Date(); d.setDate(d.getDate() - n); return iso(d); }

  /* flatten a recipe's grouped ingredients into editor rows, keeping the
     sub-recipe labels as their own marker rows */
  function flatIngs(groups) {
    var out = [];
    (groups || []).forEach(function (g) {
      if (g.g) out.push('— ' + g.g);
      (g.items || []).forEach(function (i) { out.push(i); });
    });
    return out.length ? out : [''];
  }

  function seed() {
    var posts = [];
    (window.MC && MC.recipes ? MC.recipes : []).forEach(function (r, i) {
      posts.push({
        id: 'r-' + r.slug, kind: 'Recipe', slug: r.slug,
        status: i < 2 ? 'Scheduled' : (i > 32 ? 'Draft' : 'Published'),
        date: i < 2 ? daysAgo(-(3 + i * 4)) : daysAgo(4 + i * 7),
        title: r.title,
        dek: (r.intro && r.intro[0]) ? r.intro[0].slice(0, 180) : '',
        hero: r.img, tags: r.tags.join(', '),
        temp: r.temp || '', internal: r.internal || '', time: r.time || '',
        serves: '', vessel: '',
        rubs: (r.rubs || []).slice(),
        ings: flatIngs(r.ings),
        steps: (r.steps || []).map(function (s) { return { h: s.h || '', b: s.b || '' }; }),
        body: (r.intro || []).slice(1).join('\n\n'),
        sample: false, views: 0
      });
    });
    STORIES.forEach(function (s) {
      posts.push({
        id: 's-' + s.slug, kind: 'Story', slug: s.slug, status: s.status,
        date: s.ago < 0 ? daysAgo(s.ago) : daysAgo(s.ago),
        title: s.title, dek: s.dek, hero: s.hero, tags: s.tags,
        temp: '', internal: '', time: '', serves: '', vessel: '',
        rubs: s.rubs.slice(), ings: [''], steps: [], body: s.body,
        sample: true, views: 0
      });
    });
    /* a plausible reading count so the dashboard is not all zeroes */
    posts.forEach(function (p, i) {
      p.views = p.status === 'Published' ? (900 + ((i * 2657) % 14000)) : 0;
    });
    posts.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    return posts;
  }

  var posts = null;

  function load() {
    if (posts) return posts;
    try {
      var raw = localStorage.getItem(KEY);
      posts = raw ? JSON.parse(raw) : null;
    } catch (e) { posts = null; }
    if (!posts || !posts.length) posts = seed();
    return posts;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(posts)); } catch (e) {}
  }
  function reset() { posts = seed(); save(); return posts; }

  function byId(id) {
    return load().filter(function (p) { return p.id === id; })[0] || null;
  }
  function remove(id) {
    posts = load().filter(function (p) { return p.id !== id; });
    save();
  }
  function add(p) { load().unshift(p); save(); return p; }

  function words(p) {
    var t = [p.dek, p.body].concat((p.steps || []).map(function (s) { return s.h + ' ' + s.b; }));
    return t.join(' ').trim().split(/\s+/).filter(Boolean).length;
  }

  function stats() {
    var all = load();
    var by = { Published: 0, Scheduled: 0, Draft: 0 };
    var w = 0, recipes = 0, stories = 0, views = 0;
    all.forEach(function (p) {
      by[p.status] = (by[p.status] || 0) + 1;
      w += words(p);
      if (p.kind === 'Recipe') recipes++; else stories++;
      views += p.views || 0;
    });
    return { total: all.length, by: by, words: w, recipes: recipes,
             stories: stories, views: views };
  }

  /* editorial QA — the checks an editor would otherwise run by eye */
  function health() {
    var out = [];
    load().forEach(function (p) {
      var miss = [];
      if (!p.title) miss.push('no title');
      if (!p.hero) miss.push('no hero image');
      if (!p.tags.trim()) miss.push('untagged');
      if (!p.dek.trim()) miss.push('no standfirst');
      if (p.kind === 'Recipe') {
        if (!p.rubs.length) miss.push('no seasoning linked');
        if (!p.steps.length) miss.push('no method');
        if (!p.ings.filter(Boolean).length) miss.push('no ingredients');
      }
      if (miss.length) out.push({ post: p, issues: miss });
    });
    return out;
  }

  function tagCounts() {
    var m = {};
    load().forEach(function (p) {
      p.tags.split(',').map(function (t) { return t.trim(); })
        .filter(Boolean).forEach(function (t) { m[t] = (m[t] || 0) + 1; });
    });
    return Object.keys(m).sort(function (a, b) { return m[b] - m[a]; })
      .map(function (t) { return { tag: t, n: m[t] }; });
  }

  function slugify(s) {
    return (s || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '').slice(0, 60) || 'untitled';
  }

  window.MC = window.MC || {};
  MC.store = { load: load, save: save, reset: reset, byId: byId, remove: remove,
               add: add, stats: stats, health: health, tagCounts: tagCounts,
               words: words, slugify: slugify, daysAgo: daysAgo, KEY: KEY };
})();
