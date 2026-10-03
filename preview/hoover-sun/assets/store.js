/* Hoover Sun — shared content store.
   Demo build: the newsroom dashboard and the public site share one data layer
   (localStorage for records, IndexedDB for uploaded photos/PDFs), so anything a
   staffer publishes in /admin/ shows up on the site in the same browser instantly.
   In production this file swaps to a hosted database + file storage; the pages don't change. */
(function () {
  var NS = 'hs-demo-v1:';
  var BASE = window.HS_BASE || '';
  var SEED = window.HS_SEED || { articles: [], events: [] };

  var SECTIONS = [
    { key: 'news', name: 'News' },
    { key: 'business', name: 'Business' },
    { key: 'schools', name: 'Schools' },
    { key: 'sports', name: 'Sports', subs: ['Hoover', 'Spain Park'] },
    { key: 'people', name: 'People', subs: ['Celebrations'] },
    { key: 'opinion', name: 'Opinion', subs: ["Editor's Perspective", "Mayor's Minute", 'Kari Kampakis', 'Rick Watson'] },
    { key: 'sponsored', name: 'Sponsored' }
  ];

  var STAFF = [
    { id: 'kparmley', name: 'Kyle Parmley', title: 'Managing Editor', role: 'editor' },
    { id: 'janderson', name: 'Jon Anderson', title: 'News Editor', role: 'editor' },
    { id: 'dstarnes', name: 'Dan Starnes', title: 'Founder and President', role: 'admin' },
    { id: 'agrizzle', name: 'Alison Grizzle', title: 'Director of Organizational Development', role: 'admin' },
    { id: 'wcaldwell', name: 'Warren Caldwell', title: 'Marketing Consultant', role: 'sales' },
    { id: 'dharris', name: 'Don Harris', title: 'Marketing Consultant', role: 'sales' },
    { id: 'ldowdle', name: 'Lauren H. Dowdle', title: 'Contributing Writer', role: 'writer' },
    { id: 'khewett', name: 'Kelli S. Hewett', title: 'Contributing Writer', role: 'writer' },
    { id: 'ereed', name: 'Emily Reed', title: 'Contributing Writer', role: 'writer' },
    { id: 'ksellers', name: 'Kristi Sellers', title: 'Events Writer', role: 'writer' }
  ];

  var ROLES = {
    admin: { label: 'Publisher', can: ['publish', 'stories', 'media', 'events', 'inbox', 'print', 'ads', 'newsletter', 'homepage', 'team'] },
    editor: { label: 'Editor', can: ['publish', 'stories', 'media', 'events', 'inbox', 'print', 'newsletter', 'homepage'] },
    writer: { label: 'Contributor', can: ['stories', 'media', 'events'] },
    sales: { label: 'Sales', can: ['ads', 'inbox', 'media'] }
  };

  var DEFAULTS = {
    articles: SEED.articles,
    events: SEED.events,
    issues: [
      { id: 'i2026-10', month: '2026-10', title: 'October 2026', cover: 'img/cover-2026-10.jpg', pdf: null,
        external: 'https://issuu.com/280living/docs/hoover_sun_october_2026', pages: null, status: 'published' }
    ],
    ads: [
      { id: 'ad1', zone: 'leaderboard', kind: 'house', advertiser: 'Hoover Sun', headline: 'Reach every mailbox in Hoover.',
        sub: 'Print + web packages for local businesses, from Ross Bridge to Bluff Park.', cta: 'Advertise with us', link: 'advertise.html',
        start: '2026-01-01', end: '2026-12-31', status: 'live', impressions: 0, clicks: 0 },
      { id: 'ad2', zone: 'sidebar', kind: 'house', advertiser: 'Hoover Sun', headline: 'Hosting something in Hoover?',
        sub: 'Add it to the community calendar. It’s free.', cta: 'Submit your event', link: 'submit.html?type=event',
        start: '2026-01-01', end: '2026-12-31', status: 'live', impressions: 0, clicks: 0 },
      { id: 'ad3', zone: 'inline', kind: 'house', advertiser: 'Hoover Sun', headline: 'Got a story we should tell?',
        sub: 'Send a tip, an event or a celebration straight to our newsroom.', cta: 'Submit to the Sun', link: 'submit.html',
        start: '2026-01-01', end: '2026-12-31', status: 'live', impressions: 0, clicks: 0 }
    ],
    submissions: [
      { id: 's1', type: 'tip', sample: true, name: 'Sample reader', email: 'reader@example.com', created: '2026-10-02T13:10:00',
        subject: 'New playground going in at Veterans Park?', message: 'Saw fencing and equipment going up near the pavilion this week. Is the city adding something new?', status: 'new' },
      { id: 's2', type: 'event', sample: true, name: 'Sample organizer', email: 'organizer@example.com', created: '2026-10-02T09:42:00',
        subject: 'Fall Story Time on the Lawn', message: 'Free outdoor story time for kids 3-7 with crafts after.',
        event: { title: 'Fall Story Time on the Lawn', date: '2026-10-24', when: 'Saturday, Oct. 24, 10 a.m.', where: 'Sample location, Hoover', cost: 'Free' }, status: 'new' }
    ],
    media: [],
    settings: {
      alert: { on: true, text: 'UPDATE: 63rd Bluff Park Art Show canceled due to weather concerns', slug: '63rd-bluff-park-art-show-to-be-held-oct-3' },
      newsletterIntro: 'Good morning, Hoover. Here’s what’s happening around the city today.'
    },
    activity: [],
    team: STAFF
  };

  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function read(col) {
    try { var r = localStorage.getItem(NS + col); if (r) return JSON.parse(r); } catch (e) {}
    return DEFAULTS[col] === undefined ? [] : clone(DEFAULTS[col]);
  }
  var bc = null; try { bc = new BroadcastChannel('hs-demo'); } catch (e) {}
  function write(col, val) {
    try { localStorage.setItem(NS + col, JSON.stringify(val)); }
    catch (e) { alert('This demo browser is out of storage. Use “Reset demo” in the dashboard.'); throw e; }
    if (bc) bc.postMessage({ col: col });
    listeners.forEach(function (fn) { fn(col); });
  }
  var listeners = [];
  function onChange(fn) {
    window.addEventListener('storage', function (e) { if (e.key && e.key.indexOf(NS) === 0) fn(e.key.slice(NS.length)); });
    if (bc) bc.onmessage = function (m) { fn(m.data.col); };
  }

  /* ---------- IndexedDB blobs (photos, PDFs) ---------- */
  var dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      if (!window.indexedDB) return rej(new Error('no idb'));
      var r = indexedDB.open('hs-demo-media', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('blobs'); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
    return dbp;
  }
  function putBlob(id, blob) {
    return db().then(function (d) { return new Promise(function (res, rej) {
      var tx = d.transaction('blobs', 'readwrite'); tx.objectStore('blobs').put(blob, id);
      tx.oncomplete = function () { res(id); }; tx.onerror = function () { rej(tx.error); };
    }); });
  }
  var urlCache = {};
  function blobURL(id) {
    if (urlCache[id]) return Promise.resolve(urlCache[id]);
    return db().then(function (d) { return new Promise(function (res) {
      var g = d.transaction('blobs').objectStore('blobs').get(id);
      g.onsuccess = function () { if (!g.result) return res(''); urlCache[id] = URL.createObjectURL(g.result); res(urlCache[id]); };
      g.onerror = function () { res(''); };
    }); }).catch(function () { return ''; });
  }
  function getBlob(id) {
    return db().then(function (d) { return new Promise(function (res) {
      var g = d.transaction('blobs').objectStore('blobs').get(id);
      g.onsuccess = function () { res(g.result || null); }; g.onerror = function () { res(null); };
    }); });
  }
  function clearBlobs() { return db().then(function (d) { return new Promise(function (res) {
    var tx = d.transaction('blobs', 'readwrite'); tx.objectStore('blobs').clear(); tx.oncomplete = res; tx.onerror = res;
  }); }).catch(function () {}); }

  var BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  /* image src for templates: seed paths get the page base; uploads hydrate async */
  function src(p) { if (!p) return ''; if (p.indexOf('idb:') === 0) return BLANK; if (/^(https?:|data:|blob:)/.test(p)) return p; return BASE + p; }
  function imgAttr(p) { return p && p.indexOf('idb:') === 0 ? ' data-idb="' + p.slice(4) + '"' : ''; }
  function hydrate(root) {
    (root || document).querySelectorAll('[data-idb]').forEach(function (el) {
      blobURL(el.getAttribute('data-idb')).then(function (u) { if (u) { el.src = u; el.removeAttribute('data-idb'); } });
    });
    /* photos placed inside story bodies keep their reference so the editor can re-save them */
    (root || document).querySelectorAll('img[data-media]').forEach(function (el) {
      blobURL(el.getAttribute('data-media')).then(function (u) { if (u) el.src = u; });
    });
  }

  /* resize an image File into a JPEG blob */
  function processImage(file, max) {
    max = max || 1600;
    return new Promise(function (res, rej) {
      var img = new Image(); var u = URL.createObjectURL(file);
      img.onload = function () {
        var s = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
        c.toBlob(function (b) { b ? res({ blob: b, w: c.width, h: c.height }) : rej(new Error('encode')); }, 'image/jpeg', 0.84);
      };
      img.onerror = function () { rej(new Error('Not an image we can read')); };
      img.src = u;
    });
  }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function slugify(s) { return String(s).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'story'; }
  function uid(p) { return (p || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function sectionName(k) { var s = SECTIONS.filter(function (x) { return x.key === k; })[0]; return s ? s.name : k; }
  var MON = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function fmtDate(iso, long) { var d = new Date(iso); if (isNaN(d)) return ''; return (long ? MONTHS : MON)[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); }
  function timeAgo(iso) {
    var s = (Date.now() - new Date(iso)) / 1000;
    if (s < 0) return 'scheduled ' + fmtDate(iso);
    if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago'; if (s < 86400 * 7) return Math.floor(s / 86400) + 'd ago';
    return fmtDate(iso);
  }
  function today(off) { var d = new Date(Date.now() + (off || 0) * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function isLive(a) { return a.status === 'published' || (a.status === 'scheduled' && new Date(a.date) <= new Date()); }
  function published() { return read('articles').filter(isLive).sort(function (a, b) { return new Date(b.date) - new Date(a.date); }); }
  function bodyHTML(a) {
    if (a.html) return a.html;
    var out = '', inList = false;
    (a.body || []).forEach(function (b) {
      var t = b[0], x = esc(b[1]);
      if (t === 'li') { if (!inList) { out += '<ul>'; inList = true; } out += '<li>' + x + '</li>'; return; }
      if (inList) { out += '</ul>'; inList = false; }
      out += t === 'h' ? '<h2>' + x + '</h2>' : '<p>' + x + '</p>';
    });
    if (inList) out += '</ul>';
    return out;
  }
  function sanitize(html) {
    var t = document.createElement('template'); t.innerHTML = html;
    t.content.querySelectorAll('script,style,iframe,object,embed,form').forEach(function (n) { n.remove(); });
    t.content.querySelectorAll('*').forEach(function (n) {
      [].slice.call(n.attributes).forEach(function (at) {
        if (/^on/i.test(at.name) || (at.name === 'href' && /^\s*javascript:/i.test(at.value))) n.removeAttribute(at.name);
        if (at.name === 'style' || at.name === 'class') n.removeAttribute(at.name);
        if (n.tagName === 'IMG' && at.name === 'src' && /^blob:/.test(at.value)) n.setAttribute('src', BLANK);
      });
    });
    return t.innerHTML;
  }
  function log(action, detail, who) {
    var a = read('activity'); a.unshift({ t: new Date().toISOString(), action: action, detail: detail, who: who || 'Reader' });
    write('activity', a.slice(0, 80));
  }
  function bumpView(id) {
    try { var k = NS + 'views', v = JSON.parse(localStorage.getItem(k) || '{}'); v[id] = (v[id] || 0) + 1; localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function views() { try { return JSON.parse(localStorage.getItem(NS + 'views') || '{}'); } catch (e) { return {}; } }
  function reset() {
    Object.keys(localStorage).forEach(function (k) { if (k.indexOf(NS) === 0) localStorage.removeItem(k); });
    return clearBlobs().then(function () { if (bc) bc.postMessage({ col: '*' }); });
  }

  window.HS = {
    SECTIONS: SECTIONS, STAFF: STAFF, ROLES: ROLES, read: read, write: write, onChange: onChange,
    putBlob: putBlob, blobURL: blobURL, getBlob: getBlob, src: src, imgAttr: imgAttr, hydrate: hydrate, processImage: processImage,
    esc: esc, slugify: slugify, uid: uid, sectionName: sectionName, fmtDate: fmtDate, timeAgo: timeAgo, MONTHS: MONTHS,
    isLive: isLive, today: today, published: published, bodyHTML: bodyHTML, sanitize: sanitize, log: log, bumpView: bumpView, views: views, reset: reset
  };
})();
