/* Hoover Sun Newsroom — staff dashboard (demo build) */
(function () {
  var H = window.HS, e = H.esc, $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var app = document.getElementById('app');
  var BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  function svg(p) { return '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var I = {
    home: svg('<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>'),
    doc: svg('<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'),
    img: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>'),
    cal: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    inbox: svg('<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6z"/>'),
    paper: svg('<path d="M4 4h13v16H6a2 2 0 01-2-2z"/><path d="M17 8h3v10a2 2 0 01-2 2h-1M8 8h5M8 12h5M8 16h3"/>'),
    ad: svg('<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M7 15l2-6 2 6M7.6 13h2.8M14 9v6h1.5a3 3 0 000-6z"/>'),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    layout: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'),
    users: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7M21.5 20a6.5 6.5 0 00-4-6"/>'),
    stack: svg('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    ext: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>'),
    out: svg('<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
    menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    x: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    up: svg('<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>'),
    bolt: svg('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'),
    check: svg('<path d="M5 12l5 5 9-10"/>'),
    eye: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    chev: svg('<path d="M6 9l6 6 6-6"/>'),
    back: svg('<path d="M15 6l-6 6 6 6"/>'),
    link: svg('<path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>')
  };

  /* ---------- session ---------- */
  function team() { return H.read('team'); }
  function me() { try { var id = localStorage.getItem('hs-session'); return team().filter(function (s) { return s.id === id; })[0] || null; } catch (x) { return null; } }
  function can(p) { var u = me(); return !!u && H.ROLES[u.role].can.indexOf(p) >= 0; }
  function initials(n) { var r = String(n).split(/\s+/).filter(function (w) { return /^[A-Za-z]/.test(w) && !/\.$/.test(w); }).map(function (w) { return w[0].toUpperCase(); }).join(''); return (r.length > 2 ? r[0] + r[r.length - 1] : r) || '•'; }
  var AVC = ['#8e2a24', '#1f5fa8', '#22783a', '#9a6200', '#5b3aa8', '#a52c69', '#1c1a19'];
  function av(n, sm) { var h = 0; for (var i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0; return '<span class="av' + (sm ? ' sm' : '') + '" style="background:' + AVC[h % AVC.length] + '">' + initials(n) + '</span>'; }

  function login() {
    var sel = 'kparmley';
    function draw() {
      var t = team();
      app.className = '';
      app.innerHTML = '<div class="login"><div class="login-card"><span class="wm"><i>Hoover</i>Sun</span><h1>Newsroom sign in</h1><p>Demo: pick a staff member to see what their role can do.</p><div class="who">' +
        t.map(function (s) { return '<button data-u="' + s.id + '" class="' + (s.id === sel ? 'on' : '') + '">' + av(s.name) + '<span><b>' + e(s.name) + '</b><small>' + e(s.title) + '</small></span><span class="role-tag">' + H.ROLES[s.role].label + '</span></button>'; }).join('') +
        '</div><button class="btn primary" id="go" style="width:100%;height:46px;font-size:15px">Sign in</button><p class="note">In production: email + password with two-step sign-in. No shared logins.</p></div></div>';
      $$('[data-u]').forEach(function (b) { b.onclick = function () { sel = b.dataset.u; draw(); }; b.ondblclick = go; });
      $('#go').onclick = go;
    }
    function go() { localStorage.setItem('hs-session', sel); H.log('Signed in', '', team().filter(function (s) { return s.id === sel; })[0].name); boot(); }
    draw();
  }

  /* ---------- shell ---------- */
  var NAV = [
    ['overview', 'Overview', I.home, null],
    ['stories', 'Stories', I.doc, 'stories'],
    ['media', 'Photo library', I.img, 'media'],
    ['events', 'Events calendar', I.cal, 'events'],
    ['inbox', 'Reader inbox', I.inbox, 'inbox'],
    ['print', 'Print editions', I.paper, 'print'],
    ['ads', 'Ad campaigns', I.ad, 'ads'],
    ['newsletter', 'Newsletter', I.mail, 'newsletter'],
    ['homepage', 'Homepage & alerts', I.layout, 'homepage'],
    ['team', 'Team & roles', I.users, null],
    ['platform', 'What this replaces', I.stack, null]
  ];
  var PUBS = [['Hoover Sun', 'HS', 1], ['280 Living', '28'], ['Village Living', 'VL'], ['The Homewood Star', 'HW'], ['Vestavia Voice', 'VV'], ['Cahaba Sun', 'CS']];
  var dirty = false;

  function shell() {
    var u = me();
    app.className = 'app';
    app.innerHTML = '<aside class="side"><div class="brand"><span class="wm"><i>Hoover</i>Sun</span><span class="tag">Newsroom</span></div>' +
      '<div class="pub-switch" id="pub"><button>' + '<span class="dot">HS</span>Hoover Sun<span style="margin-left:auto;opacity:.6">' + I.chev + '</span></button><div class="pub-menu">' +
      PUBS.map(function (p) { return '<button data-pub="' + e(p[0]) + '"><span class="dot" style="background:' + (p[2] ? 'var(--maroon)' : '#4a413d') + '">' + p[1] + '</span>' + e(p[0]) + (p[2] ? '<small>Current</small>' : '<small>Same login</small>') + '</button>'; }).join('') +
      '<div class="foot">Every Starnes Media title can run from this one dashboard: one login, one bill.</div></div></div><nav id="nav"></nav>' +
      '<button class="reset" id="reset">↺ Reset demo content</button>' +
      '<div class="me">' + av(u.name, 1) + '<div><b>' + e(u.name) + '</b><small>' + H.ROLES[u.role].label + '</small></div><button id="logout" title="Sign out" aria-label="Sign out">' + I.out + '</button></div></aside>' +
      '<div class="scrim" id="scrim"></div>' +
      '<div class="main"><header class="top"><button class="icon menu-btn" id="menu" aria-label="Menu">' + I.menu + '</button><h1 id="ttl"></h1><div class="sp"></div>' +
      '<a class="btn hide-m" href="../index.html" target="_blank">' + I.ext + ' View site</a>' + (can('stories') ? '<a class="btn primary hide-m" href="#story/new">' + I.plus + ' New story</a>' : '') + '</header><div class="content" id="view"></div></div>' +
      (can('stories') ? '<a class="fab" href="#story/new" aria-label="New story">' + I.plus + '</a>' : '') +
      '<div class="modal" id="modal"><div class="box" id="mbox"></div></div><div class="toast" id="toast"></div>';
    $('#pub>button').onclick = function () { $('#pub').classList.toggle('open'); };
    $$('[data-pub]').forEach(function (b) { b.onclick = function () { $('#pub').classList.remove('open'); if (b.dataset.pub !== 'Hoover Sun') toast('In the full build, ' + b.dataset.pub + ' runs from this same login. This demo is set up for Hoover Sun.'); }; });
    $('#logout').onclick = function () { localStorage.removeItem('hs-session'); location.hash = ''; login(); };
    $('#reset').onclick = function () { if (confirm('Reset the demo? This clears everything added in this browser and restores the original stories.')) H.reset().then(function () { toast('Demo reset'); route(); }); };
    $('#menu').onclick = function () { app.classList.add('nav-open'); };
    $('#scrim').onclick = function () { app.classList.remove('nav-open'); };
    $('#modal').addEventListener('mousedown', function (x) { if (x.target.id === 'modal') closeModal(); });
  }
  function navDraw(cur) {
    var subs = H.read('submissions').filter(function (s) { return s.status === 'new'; }).length;
    var rev = H.read('articles').filter(function (a) { return a.status === 'review'; }).length;
    var badges = { inbox: subs, stories: can('publish') ? rev : 0 };
    $('#nav').innerHTML = NAV.filter(function (n) { return !n[3] || can(n[3]); }).map(function (n, i) {
      return (i === 1 ? '<div class="grp">Publish</div>' : n[0] === 'inbox' ? '<div class="grp">Community</div>' : n[0] === 'print' ? '<div class="grp">Revenue &amp; print</div>' : n[0] === 'team' ? '<div class="grp">Admin</div>' : '') +
        '<a href="#' + n[0] + '" class="' + (cur === n[0] ? 'on' : '') + '">' + n[2] + n[1] + (badges[n[0]] ? '<span class="badge">' + badges[n[0]] + '</span>' : '') + '</a>';
    }).join('');
    $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { app.classList.remove('nav-open'); }); });
  }
  function title(t) { $('#ttl').textContent = t; document.title = t + ' · Hoover Sun Newsroom'; }
  function toast(msg, link) { var t = $('#toast'); t.innerHTML = '<span>' + msg + '</span>' + (link ? '<a href="' + link[1] + '" target="_blank">' + link[0] + '</a>' : ''); t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, link ? 5200 : 3200); }
  function modal(t, body, foot, wide) {
    var b = $('#mbox'); b.className = 'box' + (wide ? ' wide' : '');
    b.innerHTML = '<div class="mh"><h3>' + t + '</h3><button class="icon" data-x aria-label="Close">' + I.x + '</button></div><div class="mb">' + body + '</div>' + (foot ? '<div class="mf">' + foot + '</div>' : '');
    $('#modal').classList.add('open'); $('[data-x]', b).onclick = closeModal; return b;
  }
  function closeModal() { $('#modal').classList.remove('open'); }
  function log(a, d) { H.log(a, d, me().name); }

  /* ---------- uploads ---------- */
  function dropzone(el, opts, cb) {
    var inp = document.createElement('input'); inp.type = 'file'; inp.accept = opts.accept || 'image/*'; if (opts.multiple) inp.multiple = true; inp.hidden = true; el.appendChild(inp);
    el.addEventListener('click', function (x) { if (x.target !== inp) inp.click(); });
    el.tabIndex = 0; el.addEventListener('keydown', function (k) { if (k.key === 'Enter' || k.key === ' ') { k.preventDefault(); inp.click(); } });
    inp.onchange = function () { if (inp.files.length) cb([].slice.call(inp.files)); inp.value = ''; };
    ['dragenter', 'dragover'].forEach(function (t) { el.addEventListener(t, function (x) { x.preventDefault(); el.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (t) { el.addEventListener(t, function (x) { x.preventDefault(); el.classList.remove('over'); }); });
    el.addEventListener('drop', function (x) { var f = [].slice.call(x.dataTransfer.files); if (f.length) cb(opts.multiple ? f : [f[0]]); });
  }
  function uploadImages(files, onEach) {
    var out = [];
    return files.reduce(function (p, f, i) {
      return p.then(function () {
        if (!/^image\//.test(f.type)) { toast(f.name + ' isn’t an image'); return; }
        return H.processImage(f, 2000).then(function (r) {
          var id = H.uid('m');
          return H.putBlob(id, r.blob).then(function () {
            var m = { id: id, ref: 'idb:' + id, name: f.name, w: r.w, h: r.h, size: r.blob.size, created: new Date().toISOString(), by: me().name };
            var all = H.read('media'); all.unshift(m); H.write('media', all); out.push(m); if (onEach) onEach(i + 1, files.length);
          });
        }).catch(function (err) { toast(f.name + ': ' + err.message); });
      });
    }, Promise.resolve()).then(function () { if (out.length) log('Uploaded ' + out.length + ' photo' + (out.length > 1 ? 's' : ''), out.map(function (m) { return m.name; }).join(', ')); return out; });
  }
  function library() {
    var up = H.read('media').map(function (m) { return { ref: m.ref, name: m.name, meta: m.w + '×' + m.h + ' · ' + Math.round(m.size / 1024) + ' KB', created: m.created, by: m.by, isNew: true, id: m.id }; });
    var seen = {}, seed = [];
    H.read('articles').forEach(function (a) { if (a.image && a.image.indexOf('idb:') !== 0 && !seen[a.image]) { seen[a.image] = 1; seed.push({ ref: a.image, name: a.title, meta: a.image.split('/').pop() + ' · from the story archive', created: a.date, by: a.author }); } });
    return up.concat(seed);
  }
  function srcOf(ref) { return ref.indexOf('idb:') === 0 ? BLANK : '../' + ref; }
  function idbAttr(ref) { return ref && ref.indexOf('idb:') === 0 ? ' data-idb="' + ref.slice(4) + '"' : ''; }
  function thumb(ref, cls) { return ref ? '<img class="' + (cls || 'thumb') + '" loading="lazy" src="' + srcOf(ref) + '"' + idbAttr(ref) + ' alt="">' : '<span class="' + (cls || 'thumb') + '"></span>'; }
  function picker(cb) {
    var b = modal('Choose a photo', '<div class="drop" id="pkdrop" style="margin-bottom:14px">' + I.up + '<div style="margin-top:6px"><b>Upload new</b> or drag photos here</div></div><div class="mgrid" id="pkgrid"></div>', '', true);
    function draw() { $('#pkgrid', b).innerHTML = library().map(function (m, i) { return '<button data-i="' + i + '" class="' + (m.isNew ? 'new' : '') + '">' + thumb(m.ref, '') + '<span>' + e(m.name) + '</span></button>'; }).join(''); H.hydrate(b); $$('#pkgrid [data-i]', b).forEach(function (x) { x.onclick = function () { closeModal(); cb(library()[+x.dataset.i]); }; }); }
    dropzone($('#pkdrop', b), { multiple: false }, function (f) { $('#pkdrop', b).innerHTML = 'Uploading…'; uploadImages(f).then(function (r) { if (r[0]) { closeModal(); cb({ ref: r[0].ref, name: r[0].name }); } }); });
    draw();
  }

  /* ---------- views ---------- */
  var V = {};

  V.overview = function (v) {
    title('Overview');
    var u = me(), arts = H.read('articles'), now = Date.now();
    var pub7 = arts.filter(function (a) { return H.isLive(a) && now - new Date(a.date) < 7 * 864e5; }).length;
    var rev = arts.filter(function (a) { return a.status === 'review'; });
    var drafts = arts.filter(function (a) { return a.status === 'draft'; });
    var subs = H.read('submissions').filter(function (s) { return s.status === 'new'; });
    var today = HS.today(), in30 = HS.today(30);
    var evs = H.read('events').filter(function (x) { return x.status === 'approved' && x.date >= today && x.date <= in30; });
    var hr = new Date().getHours(), greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    var recent = H.published().slice(0, 7), views = H.views();
    var att = [];
    if (can('publish')) rev.forEach(function (a) { att.push('<a class="list-row" href="#story/' + a.id + '"><span class="pill review">Review</span><span class="grow"><span class="t">' + e(a.title) + '</span><small>Submitted by ' + e(a.author) + '</small></span></a>'); });
    subs.filter(function (s) { return s.type !== 'newsletter'; }).slice(0, 5).forEach(function (s) { att.push('<a class="list-row" href="#inbox/' + s.id + '"><span class="tagt ' + s.type + '">' + typeName(s.type) + '</span><span class="grow"><span class="t">' + e(s.subject) + '</span><small>' + e(s.name) + ' · ' + H.timeAgo(s.created) + '</small></span></a>'); });
    H.read('ads').filter(function (a) { var d = (new Date(a.end) - now) / 864e5; return a.status === 'live' && a.kind !== 'house' && d >= 0 && d < 14; }).forEach(function (a) { att.push('<a class="list-row" href="#ads"><span class="pill pending">Ending</span><span class="grow"><span class="t">' + e(a.advertiser) + ' campaign ends ' + H.fmtDate(a.end + 'T12:00') + '</span><small>Time for a renewal call</small></span></a>'); });
    var act = H.read('activity').slice(0, 8);
    v.innerHTML = '<div class="hello"><div><h2>' + greet + ', ' + e(u.name.split(' ')[0]) + '.</h2><p>' + new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + ' · hooversun.com</p></div><div class="quick">' +
      (can('stories') ? '<a class="btn primary" href="#story/new">' + I.plus + ' Write a story</a>' : '') + (can('media') ? '<a class="btn" href="#media">' + I.up + ' Upload photos</a>' : '') + (can('events') ? '<a class="btn" href="#events/new">' + I.cal + ' Add event</a>' : '') + (can('homepage') ? '<a class="btn" href="#homepage">' + I.bolt + ' Breaking alert</a>' : '') + (can('ads') && !can('stories') ? '<a class="btn primary" href="#ads/new">' + I.plus + ' New ad campaign</a>' : '') + '</div></div>' +
      '<div class="grid g4" style="margin-bottom:18px">' +
      kpi('#stories', I.doc, 'Published, last 7 days', pub7, 'stories live on the site') +
      kpi('#stories/review', I.check, 'Waiting for review', rev.length, drafts.length + ' draft' + (drafts.length === 1 ? '' : 's') + ' in progress') +
      kpi('#inbox', I.inbox, 'New in reader inbox', subs.length, 'tips, events, celebrations, leads') +
      kpi('#events', I.cal, 'Events, next 30 days', evs.length, 'on the public calendar') + '</div>' +
      '<div class="grid g-main"><div class="grid" style="align-content:start">' +
      '<div class="card"><div class="card-h"><h2>Needs attention</h2><a href="#inbox">Open inbox</a></div>' + (att.length ? att.join('') : '<div class="empty">All caught up. Nothing waiting on you.</div>') + '</div>' +
      '<div class="card"><div class="card-h"><h2>Recently published</h2><a href="#stories">All stories</a></div>' + recent.map(function (a) { return '<a class="list-row" href="#story/' + a.id + '">' + thumb(a.image) + '<span class="grow"><span class="t">' + e(a.title) + '</span><small>' + e(H.sectionName(a.section)) + ' · ' + e(a.author) + ' · ' + H.timeAgo(a.date) + '</small></span><small title="Reads in this demo browser">' + (views[a.id] || 0) + ' reads</small></a>'; }).join('') + '</div></div>' +
      '<div class="grid" style="align-content:start"><div class="card"><div class="card-h"><h2>Try the workflow</h2></div><div class="card-b" style="font-size:13.5px;color:var(--ink-2);line-height:1.6">' +
      '<ol style="padding-left:18px;display:grid;gap:8px"><li><a href="#story/new" style="color:var(--maroon);font-weight:600">Write a story</a>, drop in a photo and hit Publish.</li><li>Open the <a href="../index.html" target="_blank" style="color:var(--maroon);font-weight:600">public site</a> in another tab. It updates on its own.</li><li>Send a tip from the site’s <a href="../submit.html" target="_blank" style="color:var(--maroon);font-weight:600">reader desk</a> and watch it land in the inbox.</li><li>Upload a print PDF under <a href="#print" style="color:var(--maroon);font-weight:600">Print editions</a>. It becomes the online e-edition.</li></ol></div></div>' +
      '<div class="card"><div class="card-h"><h2>Activity</h2></div><ul class="feed">' + (act.length ? act.map(function (x) { return '<li>' + av(x.who, 1) + '<span><b>' + e(x.who) + '</b> ' + e(x.action.toLowerCase()) + (x.detail ? ': <span style="color:var(--mute)">' + e(x.detail.slice(0, 60)) + '</span>' : '') + '</span><time>' + H.timeAgo(x.t) + '</time></li>'; }).join('') : '<li style="color:var(--mute)">Activity from your team shows up here.</li>') + '</ul></div></div></div>';
    H.hydrate(v);
  };
  function kpi(href, ic, label, n, sub) { return '<a class="card kpi" href="' + href + '"><small>' + ic + label + '</small><b>' + n + '</b><span>' + sub + '</span></a>'; }
  function typeName(t) { return { tip: 'Tip', event: 'Event', celebration: 'Celebration', correction: 'Correction', letter: 'Letter', 'ad-lead': 'Ad lead', newsletter: 'Signup' }[t] || t; }

  /* stories */
  var sf = { st: 'all', sec: '', q: '' };
  V.stories = function (v, arg) {
    title('Stories');
    if (arg) sf.st = arg;
    var arts = H.read('articles'), views = H.views();
    var cnt = function (s) { return arts.filter(function (a) { return s === 'all' || a.status === s; }).length; };
    v.innerHTML = '<div class="toolbar"><div class="seg" id="st">' + [['all', 'All'], ['published', 'Published'], ['scheduled', 'Scheduled'], ['review', 'In review'], ['draft', 'Drafts']].map(function (s) { return '<button data-s="' + s[0] + '" class="' + (sf.st === s[0] ? 'on' : '') + '">' + s[1] + ' <span class="n">' + cnt(s[0]) + '</span></button>'; }).join('') + '</div>' +
      '<select class="in" id="sec" style="width:auto"><option value="">All sections</option>' + H.SECTIONS.map(function (s) { return '<option value="' + s.key + '"' + (sf.sec === s.key ? ' selected' : '') + '>' + s.name + '</option>'; }).join('') + '</select>' +
      '<div class="search">' + I.search + '<input id="q" placeholder="Search headlines and authors" value="' + e(sf.q) + '"></div><div style="flex:1"></div>' + (can('stories') ? '<a class="btn primary" href="#story/new">' + I.plus + ' New story</a>' : '') + '</div>' +
      '<div class="card" id="tbl"></div><p style="font-size:12px;color:var(--mute);margin-top:10px">Reads are counted in this demo browser. The live build reports real traffic for every story.</p>';
    function draw() {
      var list = arts.filter(function (a) { return (sf.st === 'all' || a.status === sf.st) && (!sf.sec || a.section === sf.sec) && (!sf.q || (a.title + ' ' + a.author).toLowerCase().indexOf(sf.q.toLowerCase()) >= 0); }).sort(function (a, b) { return new Date(b.updated || b.date) - new Date(a.updated || a.date); });
      $('#tbl').innerHTML = list.length ? '<table class="t resp"><thead><tr><th style="width:68px"></th><th>Story</th><th>Section</th><th>Status</th><th>Date</th><th class="num">Reads</th></tr></thead><tbody>' + list.map(function (a) {
        return '<tr class="click" data-id="' + a.id + '"><td class="c-img">' + thumb(a.image) + '</td><td class="c-main"><span class="ttl">' + e(a.title || 'Untitled story') + '</span><small>' + e(a.author) + (a.placement === 'lead' ? ' · <b style="color:var(--maroon)">Lead story</b>' : a.placement === 'top' ? ' · Top story' : '') + '</small></td><td class="c-hide">' + e(H.sectionName(a.section)) + '</td><td><span class="pill ' + a.status + '">' + statusName(a.status) + '</span></td><td><small>' + (a.status === 'scheduled' ? H.fmtDate(a.date) : H.timeAgo(a.updated && a.status !== 'published' ? a.updated : a.date)) + '</small></td><td class="num c-hide">' + (views[a.id] || 0) + '</td></tr>';
      }).join('') + '</tbody></table>' : '<div class="empty">No stories match.</div>';
      $$('#tbl [data-id]').forEach(function (r) { r.onclick = function () { location.hash = 'story/' + r.dataset.id; }; });
      H.hydrate($('#tbl'));
    }
    $$('#st button').forEach(function (b) { b.onclick = function () { sf.st = b.dataset.s; $$('#st button').forEach(function (x) { x.classList.toggle('on', x === b); }); draw(); }; });
    $('#sec').onchange = function () { sf.sec = this.value; draw(); };
    $('#q').oninput = function () { sf.q = this.value; draw(); };
    draw();
  };
  function statusName(s) { return { published: 'Published', draft: 'Draft', review: 'In review', scheduled: 'Scheduled' }[s] || s; }

  /* editor */
  V.story = function (v, id) {
    var arts = H.read('articles'), u = me();
    var a = id === 'new' ? null : arts.filter(function (x) { return x.id === id; })[0];
    if (id !== 'new' && !a) { v.innerHTML = '<div class="empty">Story not found. <a href="#stories">Back to stories</a></div>'; return; }
    var isNew = !a;
    a = a ? JSON.parse(JSON.stringify(a)) : { id: H.uid('a'), slug: '', title: '', dek: '', section: 'news', subsection: '', author: u.role === 'sales' ? 'Staff' : u.name, date: new Date().toISOString(), image: '', caption: '', credit: '', status: 'draft', html: '', placement: '' };
    if (isNew && pendingImage) { a.image = pendingImage; pendingImage = null; }
    var mine = a.author === u.name;
    var locked = !can('publish') && (a.status === 'published' || a.status === 'scheduled' || (!mine && !isNew));
    title(isNew ? 'New story' : (locked ? 'View story' : 'Edit story'));
    var sec = function () { return H.SECTIONS.filter(function (s) { return s.key === a.section; })[0]; };
    var authors = team().filter(function (s) { return s.role !== 'sales'; }).map(function (s) { return s.name; });
    if (authors.indexOf(a.author) < 0) authors.push(a.author);
    v.innerHTML = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap"><a class="btn ghost sm" href="#stories">' + I.back + ' Stories</a><span class="pill ' + a.status + '" id="stp">' + statusName(a.status) + '</span><span class="saved" id="saved">' + (isNew ? 'Not saved yet' : 'Saved') + '</span><div style="flex:1"></div><button class="btn primary sm mob-only" id="qpub"></button><button class="btn sm" id="pv">' + I.eye + ' Preview</button>' + (H.isLive(a) && !isNew ? '<a class="btn sm" target="_blank" href="../article.html?slug=' + encodeURIComponent(a.slug) + '">' + I.ext + ' Live</a>' : '') + '</div>' +
      (locked ? '<div class="callout" style="margin-bottom:14px">' + (a.status === 'published' ? 'This story is live. Contributors can’t change published stories. Ask an editor, or send a correction.' : 'Only the author or an editor can edit this story.') + '</div>' : '') +
      '<div class="ed"><div class="card ed-main"><textarea class="ed-title" id="t" rows="1" placeholder="Headline"' + (locked ? ' readonly' : '') + '>' + e(a.title) + '</textarea><textarea class="ed-dek" id="d" rows="1" placeholder="Summary: one or two sentences readers see under the headline"' + (locked ? ' readonly' : '') + '>' + e(a.dek) + '</textarea>' +
      (locked ? '' : '<div class="tb" id="tb"><button data-c="bold" title="Bold"><b>B</b></button><button data-c="italic" title="Italic"><i>I</i></button><span class="sep"></span><button data-c="h2" title="Subhead">H2</button><button data-c="quote" title="Quote">“ ”</button><button data-c="ul" title="Bulleted list">• List</button><button data-c="ol" title="Numbered list">1. List</button><span class="sep"></span><button data-c="link" title="Link">' + I.link + '</button><button data-c="photo" title="Insert photo">' + I.img + ' Photo</button><span class="sep"></span><button data-c="clear" title="Clear formatting">Tx</button><span style="flex:1"></span><span class="saved" id="wc" style="padding:0 6px"></span></div>') +
      '<div class="rte" id="b" contenteditable="' + (!locked) + '" data-ph="Start writing… Paste straight from Word or Google Docs; the formatting gets cleaned up automatically."></div></div>' +
      '<div class="ed-side"><div class="card"><div class="card-h"><h2>Publish</h2></div><div class="card-b" id="pubbox"></div></div>' +
      '<div class="card"><div class="card-h"><h2>Story details</h2></div><div class="card-b">' +
      '<div class="fld"><label for="sec">Section</label><select class="in" id="sec"' + (locked ? ' disabled' : '') + '>' + H.SECTIONS.map(function (s) { return '<option value="' + s.key + '"' + (s.key === a.section ? ' selected' : '') + '>' + s.name + '</option>'; }).join('') + '</select></div>' +
      '<div class="fld" id="subw"></div>' +
      '<div class="fld"><label for="au">Byline</label><select class="in" id="au"' + (locked ? ' disabled' : '') + '>' + authors.map(function (n) { return '<option' + (n === a.author ? ' selected' : '') + '>' + e(n) + '</option>'; }).join('') + '<option value="Staff"' + (a.author === 'Staff' ? ' selected' : '') + '>Staff</option></select></div></div></div>' +
      '<div class="card"><div class="card-h"><h2>Featured photo</h2></div><div class="card-b"><div id="feat"></div><div class="fld" style="margin-top:12px"><label for="cap">Caption</label><textarea class="in" id="cap" style="min-height:64px"' + (locked ? ' readonly' : '') + '>' + e(a.caption) + '</textarea></div><div class="fld"><label for="cr">Photo credit</label><input class="in" id="cr" value="' + e(a.credit) + '" placeholder="e.g. Staff photo"' + (locked ? ' readonly' : '') + '></div></div></div>' +
      (can('publish') ? '<div class="card"><div class="card-h"><h2>Front page</h2></div><div class="card-b"><div class="radio" id="pl">' + [['', 'Regular story'], ['top', 'Top story (front page, right column)'], ['lead', 'Lead story (biggest spot on the front page)']].map(function (p) { return '<label><input type="radio" name="pl" value="' + p[0] + '"' + ((a.placement || '') === p[0] ? ' checked' : '') + '>' + p[1] + '</label>'; }).join('') + '</div>' +
        '<label class="switch" style="margin-top:14px">Show as breaking alert<input type="checkbox" id="alert"' + (H.read('settings').alert.on && H.read('settings').alert.slug === a.slug && a.slug ? ' checked' : '') + '></label></div></div>' : '') +
      '<div class="card"><div class="card-h"><h2>Google preview</h2></div><div class="card-b"><div class="serp" id="serp"></div><p class="hint" style="font-size:12px;color:var(--mute);margin-top:8px">Built automatically from the headline and summary. Every story ships with proper news markup for Google.</p></div></div></div></div>';

    var b = $('#b');
    b.innerHTML = H.bodyHTML(a);
    $$('img[data-path]', b).forEach(function (im) { im.src = '../' + im.getAttribute('data-path'); });
    H.hydrate(b);
    function auto(t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }
    [$('#t'), $('#d')].forEach(function (t) { auto(t); t.addEventListener('input', function () { auto(t); touch(); }); });
    function wc() { var n = (b.innerText.trim().match(/\S+/g) || []).length; var w = $('#wc'); if (w) w.textContent = n + ' words · ' + Math.max(1, Math.round(n / 230)) + ' min read'; }
    wc();
    function touch() { dirty = true; var s = $('#saved'); s.textContent = 'Unsaved changes'; s.classList.add('dirty'); serp(); wc(); }
    function serp() { var t = $('#t').value || 'Headline'; $('#serp').innerHTML = '<div class="u">hooversun.com › ' + e(a.section) + ' › ' + e(H.slugify(t)) + '</div><div class="h">' + e(t.length > 60 ? t.slice(0, 58) + '…' : t) + ' - Hoover Sun</div><div class="d">' + H.fmtDate(a.date) + ' — ' + e(($('#d').value || 'Add a summary so readers know what the story is about.').slice(0, 155)) + '</div>'; }
    serp();
    b.addEventListener('input', touch);
    b.addEventListener('paste', function (x) {
      var html = x.clipboardData && x.clipboardData.getData('text/html');
      if (!html) return; x.preventDefault();
      var t = document.createElement('div'); t.innerHTML = H.sanitize(html);
      $$('span,font,meta,o\\:p', t).forEach(function (n) { n.replaceWith.apply(n, [].slice.call(n.childNodes)); });
      $$('h1,h3,h4,h5,h6', t).forEach(function (n) { var h = document.createElement('h2'); h.innerHTML = n.innerHTML; n.replaceWith(h); });
      $$('img', t).forEach(function (n) { if (!n.getAttribute('data-media')) n.remove(); });
      document.execCommand('insertHTML', false, t.innerHTML);
    });
    function sub() { var s = sec(); $('#subw').innerHTML = s && s.subs ? '<label for="ss">Subsection</label><select class="in" id="ss"' + (locked ? ' disabled' : '') + '><option value="">None</option>' + s.subs.map(function (x) { return '<option' + (a.subsection === x ? ' selected' : '') + '>' + e(x) + '</option>'; }).join('') + '</select>' : ''; var ss = $('#ss'); if (ss) ss.onchange = function () { a.subsection = this.value; touch(); }; }
    sub();
    $('#sec').onchange = function () { a.section = this.value; a.subsection = ''; sub(); touch(); };
    $('#au').onchange = function () { a.author = this.value; touch(); };
    $('#cap').oninput = function () { touch(); }; $('#cr').oninput = function () { touch(); };
    $$('#pl input').forEach(function (r) { r.onchange = function () { a.placement = r.value; touch(); }; });
    var al = $('#alert'); if (al) al.onchange = touch;

    function feat() {
      var f = $('#feat');
      if (a.image) {
        f.innerHTML = '<div class="feat">' + thumb(a.image, '') + (locked ? '' : '<div class="acts"><button id="fch">Change</button><button id="frm">Remove</button></div>') + '</div>';
        H.hydrate(f);
        if (!locked) { $('#fch').onclick = function () { picker(function (m) { a.image = m.ref; feat(); touch(); }); }; $('#frm').onclick = function () { a.image = ''; feat(); touch(); }; }
      } else if (!locked) {
        f.innerHTML = '<div class="drop" id="fdrop">' + I.up + '<div style="margin-top:6px"><b>Upload a photo</b> or drag it here</div><div style="font-size:12px;margin-top:4px">Resized and compressed automatically</div></div><button class="btn sm" id="flib" style="margin-top:8px;width:100%">Choose from photo library</button>';
        dropzone($('#fdrop'), {}, function (fs) { $('#fdrop').innerHTML = 'Uploading…'; uploadImages(fs).then(function (r) { if (r[0]) { a.image = r[0].ref; touch(); } feat(); }); });
        $('#flib').onclick = function () { picker(function (m) { a.image = m.ref; feat(); touch(); }); };
      } else f.innerHTML = '<div class="empty">No photo</div>';
    }
    feat();

    var tb = $('#tb');
    if (tb) tb.addEventListener('mousedown', function (x) { if (x.target.closest('button')) x.preventDefault(); });
    if (tb) tb.onclick = function (x) {
      var btn = x.target.closest('[data-c]'); if (!btn) return; var c = btn.dataset.c; b.focus();
      if (c === 'bold' || c === 'italic') document.execCommand(c);
      if (c === 'h2') document.execCommand('formatBlock', false, document.queryCommandValue('formatBlock') === 'h2' ? 'p' : 'h2');
      if (c === 'quote') document.execCommand('formatBlock', false, document.queryCommandValue('formatBlock') === 'blockquote' ? 'p' : 'blockquote');
      if (c === 'ul') document.execCommand('insertUnorderedList');
      if (c === 'ol') document.execCommand('insertOrderedList');
      if (c === 'clear') { document.execCommand('removeFormat'); document.execCommand('formatBlock', false, 'p'); }
      if (c === 'link') { var sel = window.getSelection(); if (!sel || sel.isCollapsed) { toast('Highlight the words you want to link first'); return; } var r = sel.getRangeAt(0); var url = prompt('Link to (URL):', 'https://'); if (url && url !== 'https://') { sel.removeAllRanges(); sel.addRange(r); document.execCommand('createLink', false, url); } }
      if (c === 'photo') { var sel2 = window.getSelection(), range = sel2.rangeCount ? sel2.getRangeAt(0) : null; picker(function (m) { b.focus(); if (range) { sel2.removeAllRanges(); sel2.addRange(range); } var html = m.ref.indexOf('idb:') === 0 ? '<img data-media="' + m.ref.slice(4) + '" src="' + BLANK + '" alt="">' : '<img data-path="' + e(m.ref) + '" src="../' + e(m.ref) + '" alt="">'; document.execCommand('insertHTML', false, html + '<p><br></p>'); H.hydrate(b); }); }
      touch();
    };

    function collect() {
      var c = b.cloneNode(true);
      $$('img[data-media]', c).forEach(function (im) { im.setAttribute('src', BLANK); });
      $$('img[data-path]', c).forEach(function (im) { im.setAttribute('src', im.getAttribute('data-path')); });
      a.title = $('#t').value.trim(); a.dek = $('#d').value.trim(); a.caption = $('#cap').value.trim(); a.credit = $('#cr').value.trim();
      a.html = H.sanitize(c.innerHTML); delete a.body;
      a.updated = new Date().toISOString();
    }
    function save(status, msg, when) {
      if (locked) return false;
      collect();
      if ((status === 'published' || status === 'scheduled' || status === 'review') && !a.title) { toast('Add a headline first'); $('#t').focus(); return false; }
      if (status) a.status = status;
      if (status === 'published' && a._wasStatus !== 'published') a.date = new Date().toISOString();
      if (when) a.date = when;
      var list = H.read('articles');
      if (!a.slug || (a.status !== 'published' && !list.some(function (x) { return x.id === a.id && x.status === 'published'; }))) {
        var base = H.slugify(a.title || 'untitled'), s = base, n = 2; while (list.some(function (x) { return x.slug === s && x.id !== a.id; })) s = base + '-' + n++; a.slug = s;
      }
      if (a.placement === 'lead') list.forEach(function (x) { if (x.id !== a.id && x.placement === 'lead') x.placement = 'top'; });
      var i = -1; list.forEach(function (x, k) { if (x.id === a.id) i = k; });
      var clean = JSON.parse(JSON.stringify(a)); delete clean._wasStatus;
      if (i >= 0) list[i] = clean; else list.unshift(clean);
      H.write('articles', list);
      var alx = $('#alert');
      if (alx) { var st = H.read('settings'); if (alx.checked) st.alert = { on: true, text: a.title, slug: a.slug }; else if (st.alert.slug === a.slug) st.alert.on = false; H.write('settings', st); }
      a._wasStatus = a.status;
      dirty = false; var sv = $('#saved'); sv.textContent = 'Saved ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); sv.classList.remove('dirty');
      $('#stp').className = 'pill ' + a.status; $('#stp').textContent = statusName(a.status);
      log(msg || 'Saved', a.title || 'Untitled');
      if (isNew) { isNew = false; history.replaceState(null, '', '#story/' + a.id); lastHash = location.hash; }
      pubbox(); return true;
    }
    a._wasStatus = a.status;
    function pubbox() {
      var p = $('#pubbox'), live = a.status === 'published';
      var when = new Date(a.date), local = new Date(when.getTime() - when.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
      var h = '<div style="font-size:13px;color:var(--mute);margin-bottom:12px">' + (live ? 'Live since ' + H.fmtDate(a.date) + ', ' + when.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : a.status === 'scheduled' ? 'Goes live ' + H.fmtDate(a.date) + ', ' + when.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : a.status === 'review' ? 'Waiting for an editor to approve.' : 'Only staff can see drafts.') + '</div>';
      if (locked) h += '<p style="font-size:13px">Read-only for your role.</p>';
      else if (can('publish')) {
        h += '<div style="display:grid;gap:8px">' + (live ? '<button class="btn primary" data-a="update">' + I.check + ' Update live story</button>' : '<button class="btn primary" data-a="publish">' + I.bolt + (a.status === 'review' ? ' Approve &amp; publish' : ' Publish now') + '</button>') +
          (live ? '' : '<div style="display:flex;gap:6px"><input type="datetime-local" class="in" id="when" value="' + local + '" style="flex:1;min-width:0;font-size:13px"><button class="btn" data-a="schedule">Schedule</button></div>') +
          '<div style="display:flex;gap:6px"><button class="btn" style="flex:1" data-a="draft">' + (live ? 'Unpublish' : 'Save draft') + '</button>' + (a.status === 'review' ? '<button class="btn" style="flex:1" data-a="sendback">Send back</button>' : '') + '</div>' +
          (!isNew ? '<button class="btn danger sm" data-a="delete" style="justify-self:start;margin-top:4px">Delete story</button>' : '') + '</div>';
      } else {
        h += '<div style="display:grid;gap:8px"><button class="btn primary" data-a="review">' + I.check + (a.status === 'review' ? ' Update submission' : ' Submit for review') + '</button><button class="btn" data-a="draft">Save draft</button></div><p style="font-size:12px;color:var(--mute);margin-top:10px">An editor approves stories before they go live.</p>';
      }
      p.innerHTML = h;
      $$('[data-a]', p).forEach(function (x) { x.onclick = function () { act(x.dataset.a); }; });
      var first = $('[data-a]', p), q = $('#qpub'); if (q) { if (first && !first.classList.contains('danger')) { q.innerHTML = first.innerHTML; q.style.removeProperty('visibility'); q.onclick = function () { first.click(); }; } else q.style.visibility = 'hidden'; }
    }
    function act(k) {
      if (k === 'publish' && save('published', 'Published')) toast('Published. It’s live on the site now.', ['View story →', '../article.html?slug=' + encodeURIComponent(a.slug)]);
      if (k === 'update' && save('published', 'Updated live story')) toast('Live story updated', ['View →', '../article.html?slug=' + encodeURIComponent(a.slug)]);
      if (k === 'schedule') { var w = $('#when').value; if (!w) return; var d = new Date(w); if (d <= new Date()) { toast('Pick a time in the future'); return; } if (save('scheduled', 'Scheduled', d.toISOString())) toast('Scheduled for ' + H.fmtDate(d.toISOString()) + ' at ' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })); }
      if (k === 'draft') { var wasLive = a.status === 'published'; if (save('draft', wasLive ? 'Unpublished' : 'Saved draft')) toast(wasLive ? 'Unpublished. Readers can no longer see it.' : 'Draft saved'); }
      if (k === 'review' && save('review', 'Submitted for review')) toast('Sent to the editors for review');
      if (k === 'sendback' && save('draft', 'Sent back to writer')) toast('Sent back to ' + a.author);
      if (k === 'delete' && confirm('Delete “' + (a.title || 'this story') + '”? This can’t be undone.')) { H.write('articles', H.read('articles').filter(function (x) { return x.id !== a.id; })); log('Deleted story', a.title); dirty = false; location.hash = 'stories'; toast('Story deleted'); }
    }
    pubbox();
    $('#pv').onclick = function () {
      if (!locked && (dirty || isNew)) save(null, 'Saved draft');
      window.open('../article.html?preview=' + a.id + '&slug=' + encodeURIComponent(a.slug), '_blank');
    };
    keySave = function () { if (!locked) { if (a.status === 'published') act('update'); else { save(null, 'Saved'); toast('Saved'); } } };
  };
  var keySave = null;
  document.addEventListener('keydown', function (k) { if ((k.metaKey || k.ctrlKey) && k.key === 's' && keySave) { k.preventDefault(); keySave(); } });

  /* media */
  V.media = function (v) {
    title('Photo library');
    v.innerHTML = '<div class="drop" id="mdrop" style="padding:30px;margin-bottom:12px">' + I.up + '<div style="margin-top:8px;font-size:15px"><b>Upload photos</b> or drag a whole folder of game photos here</div><div style="font-size:12.5px;margin-top:4px">Every photo is resized for the web and compressed automatically. No Photoshop step.</div></div><div id="prog"></div>' +
      '<div class="toolbar" style="margin-top:12px"><div class="search">' + I.search + '<input id="mq" placeholder="Search by file name or story"></div><span style="color:var(--mute);font-size:13px" id="mc"></span></div><div class="mgrid" id="mg"></div>';
    function draw(q) {
      var lib = library().filter(function (m) { return !q || (m.name + ' ' + m.meta).toLowerCase().indexOf(q.toLowerCase()) >= 0; });
      $('#mc').textContent = lib.length + ' photos';
      $('#mg').innerHTML = lib.map(function (m, i) { return '<button data-i="' + i + '" class="' + (m.isNew ? 'new' : '') + '">' + thumb(m.ref, '') + '<span>' + e(m.name) + '</span></button>'; }).join('');
      H.hydrate($('#mg'));
      $$('#mg [data-i]').forEach(function (x) { x.onclick = function () { detail(lib[+x.dataset.i]); }; });
    }
    function detail(m) {
      var used = H.read('articles').filter(function (a) { return a.image === m.ref || (a.html || '').indexOf(m.ref.replace('idb:', '')) >= 0; });
      var b = modal(e(m.name), '<div style="background:var(--gray-bg);border-radius:10px;overflow:hidden;margin-bottom:14px">' + thumb(m.ref, '').replace('<img ', '<img style="width:100%;max-height:420px;object-fit:contain" ') + '</div><p style="color:var(--mute);font-size:13px">' + e(m.meta) + ' · added by ' + e(m.by || 'Staff') + '</p><div style="margin-top:12px"><span class="lbl">Used in</span>' + (used.length ? used.map(function (a) { return '<a class="list-row" style="padding:8px 0" href="#story/' + a.id + '"><span class="t">' + e(a.title) + '</span></a>'; }).join('') : '<p style="font-size:13px;color:var(--mute)">Not used in any story yet.</p>') + '</div>',
        (m.isNew && can('stories') ? '<button class="btn danger" id="mdel">Delete</button><div style="flex:1"></div>' : '') + (can('stories') ? '<a class="btn primary" id="muse" href="#story/new">Use in a new story</a>' : ''));
      H.hydrate(b);
      var d = $('#mdel', b); if (d) d.onclick = function () { if (used.length && !confirm('This photo is used in ' + used.length + ' stor' + (used.length > 1 ? 'ies' : 'y') + '. Delete anyway?')) return; H.write('media', H.read('media').filter(function (x) { return x.id !== m.id; })); log('Deleted photo', m.name); closeModal(); draw(); };
      var us = $('#muse', b); if (us) us.onclick = function () { pendingImage = m.ref; closeModal(); };
    }
    dropzone($('#mdrop'), { multiple: true }, function (fs) {
      $('#prog').innerHTML = '<div class="upl"><span id="pt">Uploading 0 of ' + fs.length + '…</span><div class="bar"><i id="pb"></i></div></div>';
      uploadImages(fs, function (n, t) { $('#pt').textContent = 'Uploading ' + n + ' of ' + t + '…'; $('#pb').style.width = (n / t * 100) + '%'; }).then(function (r) { $('#prog').innerHTML = '<div class="upl" style="color:var(--green);font-weight:600">' + I.check + ' ' + r.length + ' photo' + (r.length === 1 ? '' : 's') + ' added to the library</div>'; draw(); });
    });
    $('#mq').oninput = function () { draw(this.value); };
    draw();
  };
  var pendingImage = null;

  /* events */
  V.events = function (v, arg) {
    title('Events calendar');
    var ev = H.read('events'), today = HS.today(), tab = arg === 'past' ? 'past' : 'up';
    var pend = H.read('submissions').filter(function (s) { return s.type === 'event' && s.status === 'new'; });
    v.innerHTML = (pend.length ? '<div class="callout" style="margin-bottom:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap"><b>' + pend.length + ' reader-submitted event' + (pend.length > 1 ? 's' : '') + ' waiting for approval.</b><a class="btn sm" href="#inbox/' + pend[0].id + '">Review</a></div>' : '') +
      '<div class="toolbar"><div class="seg"><button data-t="up" class="' + (tab === 'up' ? 'on' : '') + '">Upcoming</button><button data-t="past" class="' + (tab === 'past' ? 'on' : '') + '">Past</button></div><div style="flex:1"></div><a class="btn" href="../events.html" target="_blank">' + I.ext + ' Public calendar</a><button class="btn primary" id="add">' + I.plus + ' Add event</button></div><div class="card" id="et"></div>';
    var list = ev.filter(function (x) { return tab === 'up' ? x.date >= today : x.date < today; }).sort(function (a, b) { return tab === 'up' ? (a.date < b.date ? -1 : 1) : (a.date < b.date ? 1 : -1); });
    $('#et').innerHTML = list.length ? '<table class="t resp"><thead><tr><th>Date</th><th>Event</th><th>Where</th><th>Status</th><th></th></tr></thead><tbody>' + list.map(function (x) {
      var d = new Date(x.date + 'T12:00');
      return '<tr class="click" data-id="' + x.id + '"><td class="c-img"><b style="font-size:20px;letter-spacing:-.02em">' + d.getDate() + '</b> <small>' + d.toLocaleDateString('en-US', { month: 'short', weekday: 'short' }) + '</small></td><td class="c-main"><span class="ttl">' + e(x.title) + '</span><small>' + e(x.when) + '</small></td><td class="c-hide"><small>' + e((x.where || '').split(',')[0]) + '</small></td><td><span class="pill ' + x.status + '">' + (x.status === 'approved' ? 'On calendar' : x.status) + '</span></td><td class="c-hide"><small>' + e(x.source || '') + '</small></td></tr>';
    }).join('') + '</tbody></table>' : '<div class="empty">No ' + (tab === 'up' ? 'upcoming' : 'past') + ' events.</div>';
    $$('[data-t]', v).forEach(function (b) { b.onclick = function () { location.hash = 'events' + (b.dataset.t === 'past' ? '/past' : ''); }; });
    $$('#et [data-id]').forEach(function (r) { r.onclick = function () { evForm(ev.filter(function (x) { return x.id === r.dataset.id; })[0]); }; });
    $('#add').onclick = function () { evForm(null); };
    if (arg === 'new') evForm(null);
  };
  function evForm(x) {
    var isNew = !x; x = x || { id: H.uid('e'), title: '', date: HS.today(), when: '', where: '', cost: '', details: '', link: '', status: 'approved', source: 'Newsroom' };
    var b = modal(isNew ? 'Add event' : 'Edit event', '<div class="fld"><label>Event name</label><input class="in" id="et1" value="' + e(x.title) + '"></div><div class="r2"><div class="fld"><label>Date</label><input class="in" type="date" id="et2" value="' + e(x.date) + '"></div><div class="fld"><label>Day &amp; time (as printed)</label><input class="in" id="et3" value="' + e(x.when) + '" placeholder="Saturday, Oct. 3, 9 a.m. to 3 p.m."></div></div><div class="fld"><label>Where</label><input class="in" id="et4" value="' + e(x.where) + '"></div><div class="r2"><div class="fld"><label>Cost</label><input class="in" id="et5" value="' + e(x.cost) + '"></div><div class="fld"><label>Website</label><input class="in" id="et6" value="' + e(x.link) + '"></div></div><div class="fld"><label>Details</label><textarea class="in" id="et7">' + e(x.details) + '</textarea></div>',
      (isNew ? '' : '<button class="btn danger" id="edel">Delete</button><div style="flex:1"></div>') + '<button class="btn" data-x2>Cancel</button><button class="btn primary" id="esave">' + (isNew ? 'Add to calendar' : 'Save') + '</button>');
    $('[data-x2]', b).onclick = closeModal;
    $('#esave', b).onclick = function () {
      x.title = $('#et1', b).value.trim(); x.date = $('#et2', b).value; x.when = $('#et3', b).value.trim(); x.where = $('#et4', b).value.trim(); x.cost = $('#et5', b).value.trim(); x.link = $('#et6', b).value.trim(); x.details = $('#et7', b).value.trim();
      if (!x.title || !x.date) { toast('Name and date are required'); return; }
      if (!x.when) x.when = new Date(x.date + 'T12:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      var all = H.read('events').filter(function (y) { return y.id !== x.id; }); all.push(x); H.write('events', all);
      log(isNew ? 'Added event' : 'Edited event', x.title); closeModal(); toast(isNew ? 'Added to the public calendar' : 'Event saved', ['View calendar →', '../events.html#' + x.id]); route();
    };
    var d = $('#edel', b); if (d) d.onclick = function () { if (!confirm('Delete this event?')) return; H.write('events', H.read('events').filter(function (y) { return y.id !== x.id; })); log('Deleted event', x.title); closeModal(); route(); };
  }

  /* inbox */
  var ibf = 'all';
  V.inbox = function (v, id) {
    title('Reader inbox');
    var subs = H.read('submissions').sort(function (a, b) { return new Date(b.created) - new Date(a.created); });
    var types = [['all', 'All'], ['tip', 'Tips'], ['event', 'Events'], ['celebration', 'Celebrations'], ['correction', 'Corrections'], ['letter', 'Letters'], ['ad-lead', 'Ad leads'], ['newsletter', 'Signups']];
    if (me().role === 'sales') { types = [['ad-lead', 'Ad leads'], ['newsletter', 'Signups']]; if (ibf === 'all') ibf = 'ad-lead'; }
    var list = subs.filter(function (s) { return (ibf === 'all' ? true : s.type === ibf) && types.some(function (t) { return t[0] === s.type || (t[0] === 'all'); }); });
    var cur = list.filter(function (s) { return s.id === id; })[0] || (innerWidth > 860 ? list[0] : null);
    if (cur && cur.status === 'new' && cur.id === id) { cur.status = 'read'; H.write('submissions', subs.map(function (s) { return s.id === cur.id ? cur : s; })); }
    v.innerHTML = '<div class="toolbar"><div class="seg" id="ibt">' + types.map(function (t) { var n = subs.filter(function (s) { return (t[0] === 'all' || s.type === t[0]) && s.status === 'new'; }).length; return '<button data-f="' + t[0] + '" class="' + (ibf === t[0] ? 'on' : '') + '">' + t[1] + (n ? ' <span class="n">' + n + '</span>' : '') + '</button>'; }).join('') + '</div><div style="flex:1"></div><a class="btn" href="../submit.html" target="_blank">' + I.ext + ' Reader desk form</a></div>' +
      '<div class="card inbox' + (id && cur ? ' detail' : '') + '"><div class="lst">' + (list.length ? list.map(function (s) { return '<a class="it' + (s.status === 'new' ? ' unread' : '') + (cur && cur.id === s.id ? ' on' : '') + '" href="#inbox/' + s.id + '"><div class="top-l"><span class="tagt ' + s.type + '">' + typeName(s.type) + '</span>' + (s.sample ? '<span class="sample">SAMPLE</span>' : '') + '<span style="margin-left:auto">' + H.timeAgo(s.created) + '</span></div><b>' + e(s.subject) + '</b><p>' + e(s.name) + ' · ' + e(s.message) + '</p></a>'; }).join('') : '<div class="empty">Nothing here. Submissions from the site’s reader desk land here instantly.</div>') + '</div><div class="det" id="det"></div></div>';
    $$('#ibt [data-f]').forEach(function (b) { b.onclick = function () { ibf = b.dataset.f; location.hash = 'inbox'; route(); }; });
    if (cur) detail(cur);
    function detail(s) {
      var d = $('#det');
      var acts = '';
      if (s.type === 'tip' && can('stories')) acts += '<button class="btn primary" data-k="story">' + I.doc + ' Start a story from this tip</button>';
      if (s.type === 'event' && can('events')) acts += s.status === 'approved' ? '<span class="pill approved">On the calendar</span>' : '<button class="btn primary" data-k="approve">' + I.check + ' Approve to calendar</button><button class="btn" data-k="decline">Decline</button>';
      if (s.type === 'celebration' && can('publish')) acts += s.status === 'done' ? '<span class="pill done">Published</span>' : '<button class="btn primary" data-k="celebrate">' + I.bolt + ' Publish to Celebrations</button>';
      if (s.type === 'letter' && can('stories')) acts += '<button class="btn primary" data-k="letter">' + I.doc + ' Draft as a letter to the editor</button>';
      if (s.type === 'correction') { var art = H.read('articles').filter(function (a) { return a.title === s.subject; })[0]; if (art) acts += '<a class="btn primary" href="#story/' + art.id + '">Open the story</a>'; acts += '<button class="btn" data-k="fixed">Mark fixed</button>'; }
      if (s.type === 'ad-lead') acts += '<select class="in" id="asg" style="width:auto"><option value="">Assign to…</option>' + team().filter(function (t) { return t.role === 'sales' || t.role === 'admin'; }).map(function (t) { return '<option' + (s.assigned === t.name ? ' selected' : '') + '>' + e(t.name) + '</option>'; }).join('') + '</select><button class="btn" data-k="contacted">Mark contacted</button><a class="btn" href="mailto:' + e(s.email) + '?subject=Advertising%20with%20the%20Hoover%20Sun">' + I.mail + ' Email</a>';
      if (s.type !== 'ad-lead' && s.type !== 'newsletter') acts += '<a class="btn" href="mailto:' + e(s.email) + '?subject=' + encodeURIComponent('Re: ' + s.subject) + '">' + I.mail + ' Reply</a>';
      acts += '<div style="flex:1"></div><button class="btn ghost" data-k="archive">Archive</button>';
      d.innerHTML = '<a class="btn ghost sm back" href="#inbox">' + I.back + ' Inbox</a><div style="display:flex;gap:8px;align-items:center;margin-top:6px"><span class="tagt ' + s.type + '">' + typeName(s.type) + (s.kind ? ' · ' + e(s.kind) : '') + '</span>' + (s.sample ? '<span class="sample">SAMPLE</span>' : '') + (s.assigned ? '<span class="pill progress">' + e(s.assigned) + '</span>' : '') + (s.status === 'contacted' ? '<span class="pill done">Contacted</span>' : '') + '</div><h3>' + e(s.subject) + '</h3><div class="from">From <b>' + e(s.name) + '</b> · ' + e(s.email) + (s.phone ? ' · ' + e(s.phone) : '') + (s.biz ? ' · ' + e(s.biz) : '') + ' · ' + new Date(s.created).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + '</div>' +
        (s.event ? '<dl><dt>Date</dt><dd>' + e(s.event.when) + '</dd><dt>Where</dt><dd>' + e(s.event.where) + '</dd>' + (s.event.cost ? '<dt>Cost</dt><dd>' + e(s.event.cost) + '</dd>' : '') + '</dl>' : '') +
        '<div class="msg">' + e(s.message) + '</div>' + (s.photo ? '<img src="' + BLANK + '" data-idb="' + s.photo.slice(4) + '" style="max-height:320px;border-radius:9px" alt="">' : '') + '<div class="acts">' + acts + '</div>';
      H.hydrate(d);
      function upd(f) { var all = H.read('submissions').map(function (x) { if (x.id === s.id) { f(x); s = x; } return x; }); H.write('submissions', all); }
      $$('[data-k]', d).forEach(function (b) {
        b.onclick = function () {
          var k = b.dataset.k;
          if (k === 'story' || k === 'letter') {
            var art = { id: H.uid('a'), slug: '', title: k === 'letter' ? 'Letter: ' + s.subject : s.subject, dek: '', section: k === 'letter' ? 'opinion' : 'news', subsection: '', author: k === 'letter' ? 'Staff' : me().name, date: new Date().toISOString(), image: s.photo || '', caption: '', credit: '', status: 'draft', placement: '',
              html: k === 'letter' ? '<p>' + e(s.message).replace(/\n+/g, '</p><p>') + '</p><p><em>' + e(s.name) + '</em></p>' : '<blockquote>Reader tip from ' + e(s.name) + ' (' + e(s.email) + '): ' + e(s.message) + '</blockquote><p></p>' };
            var l = H.read('articles'); l.unshift(art); H.write('articles', l); upd(function (x) { x.status = 'done'; }); log('Started a story from a ' + s.type, s.subject); location.hash = 'story/' + art.id; return;
          }
          if (k === 'approve') { var ev = s.event; var all = H.read('events'); all.push({ id: H.uid('e'), title: ev.title, date: ev.date, when: ev.when, where: ev.where, cost: ev.cost || '', details: ev.details || s.message, link: ev.link || '', status: 'approved', source: 'Reader: ' + s.name }); H.write('events', all); upd(function (x) { x.status = 'approved'; }); log('Approved event', ev.title); toast('Approved. It’s on the public calendar.', ['View →', '../events.html']); }
          if (k === 'decline') { upd(function (x) { x.status = 'declined'; }); log('Declined event', s.subject); }
          if (k === 'celebrate') { var c = { id: H.uid('a'), slug: '', title: s.subject, dek: (s.kind || 'Celebration') + ' announcement', section: 'people', subsection: 'Celebrations', author: 'Staff', date: new Date().toISOString(), image: s.photo || '', caption: '', credit: 'Submitted photo', status: 'published', placement: '', html: '<p>' + e(s.message).replace(/\n+/g, '</p><p>') + '</p>' }; c.slug = H.slugify(c.title) + '-' + Date.now().toString(36).slice(-4); var l2 = H.read('articles'); l2.unshift(c); H.write('articles', l2); upd(function (x) { x.status = 'done'; }); log('Published celebration', s.subject); toast('Published to People › Celebrations', ['View →', '../article.html?slug=' + c.slug]); }
          if (k === 'fixed') { upd(function (x) { x.status = 'done'; }); log('Marked correction fixed', s.subject); }
          if (k === 'contacted') { upd(function (x) { x.status = 'contacted'; }); log('Contacted ad lead', s.subject); }
          if (k === 'archive') { upd(function (x) { x.status = 'archived'; }); toast('Archived'); location.hash = 'inbox'; return; }
          route();
        };
      });
      var asg = $('#asg', d); if (asg) asg.onchange = function () { var n = this.value; upd(function (x) { x.assigned = n; }); log('Assigned ad lead to ' + n, s.subject); toast('Assigned to ' + n); route(); };
    }
  };

  /* print */
  V.print = function (v) {
    title('Print editions');
    var iss = H.read('issues').sort(function (a, b) { return a.month < b.month ? 1 : -1; });
    var nm = new Date(); nm.setMonth(nm.getMonth() + 1); var nextMonth = nm.toISOString().slice(0, 7);
    v.innerHTML = '<div class="grid g-main"><div class="card"><div class="card-h"><h2>Upload this month’s paper</h2></div><div class="card-b"><div class="r2"><div class="fld"><label for="pm">Issue month</label><input class="in" type="month" id="pm" value="' + nextMonth + '"></div><div class="fld"><label for="pt">Title</label><input class="in" id="pt" placeholder="Auto: November 2026"></div></div>' +
      '<div class="drop" id="pdrop" style="padding:28px">' + I.up + '<div style="margin-top:8px;font-size:15px"><b>Drop the print-ready PDF</b> from InDesign</div><div style="font-size:12.5px;margin-top:4px">The cover is pulled automatically and every page becomes readable on hooversun.com</div></div>' +
      '<div style="margin-top:10px;font-size:13px;color:var(--mute)">No PDF handy? <button class="btn sm" id="sample">Try a sample PDF</button></div><div id="pst" style="margin-top:12px"></div></div></div>' +
      '<div class="card"><div class="card-h"><h2>How it works</h2></div><div class="card-b" style="font-size:13.5px;color:var(--ink-2);line-height:1.65"><p>Today each issue is uploaded to a separate flipbook service, then linked from the site.</p><p style="margin-top:8px">Here, the same PDF you send to the printer becomes the e-edition on your own site. Readers stay on hooversun.com (and see your ads), and Google can find the issue.</p></div></div></div>' +
      '<h3 style="font-size:14.5px;margin:24px 0 12px">Published issues</h3><div class="issues">' + iss.map(function (i) { return '<div class="issue"><div class="cv">' + (i.cover ? thumb(i.cover, '') : 'No cover') + '</div><b>' + e(i.title) + '</b><small>' + (i.pdf ? (i.pages || '?') + ' pages · on-site reader' : 'Hosted on Issuu (legacy)') + '</small><div style="display:flex;gap:6px;margin-top:8px"><a class="btn sm" target="_blank" href="../edition.html?i=' + i.id + '">View</a>' + (i.pdf ? '<button class="btn sm danger" data-del="' + i.id + '">Remove</button>' : '') + '</div></div>'; }).join('') + '</div>';
    H.hydrate(v);
    function monthTitle() { var m = $('#pm').value; if (!m) return ''; var p = m.split('-'); return H.MONTHS[+p[1] - 1] + ' ' + p[0]; }
    $('#pm').oninput = function () { $('#pt').placeholder = 'Auto: ' + monthTitle(); };
    $('#pt').placeholder = 'Auto: ' + monthTitle();
    function handle(file) {
      if (!window.pdfjsLib) { toast('PDF reader didn’t load. Check your connection.'); return; }
      if (file.type && file.type !== 'application/pdf') { toast('That’s not a PDF'); return; }
      var st = $('#pst'); st.innerHTML = '<div class="upl"><span>Reading PDF…</span><div class="bar"><i style="width:30%"></i></div></div>';
      var pid = H.uid('p'), cid = H.uid('c'), pages = 0;
      H.putBlob(pid, file).then(function () { return file.arrayBuffer(); }).then(function (buf) { return pdfjsLib.getDocument({ data: buf }).promise; }).then(function (doc) {
        pages = doc.numPages; st.querySelector('i').style.width = '65%'; st.querySelector('span').textContent = 'Making the cover…';
        return doc.getPage(1).then(function (p) { var vp = p.getViewport({ scale: 1 }), s = 900 / vp.width, vp2 = p.getViewport({ scale: s }), c = document.createElement('canvas'); c.width = vp2.width; c.height = vp2.height; return p.render({ canvasContext: c.getContext('2d'), viewport: vp2 }).promise.then(function () { return new Promise(function (r) { c.toBlob(r, 'image/jpeg', .85); }); }); });
      }).then(function (blob) { return H.putBlob(cid, blob); }).then(function () {
        var t = $('#pt').value.trim() || monthTitle() || file.name.replace(/\.pdf$/i, '');
        var m = $('#pm').value || new Date().toISOString().slice(0, 7);
        var list = H.read('issues').filter(function (i) { return i.month !== m || !i.pdf; });
        list.push({ id: 'i' + m + '-' + pid.slice(-4), month: m, title: t, cover: 'idb:' + cid, pdf: 'idb:' + pid, pages: pages, status: 'published', uploaded: new Date().toISOString() });
        H.write('issues', list); log('Published print edition', t + ' (' + pages + ' pages)');
        toast(t + ' is live as the e-edition', ['Open reader →', '../edition.html']); route();
      }).catch(function (err) { st.innerHTML = '<div class="callout">Couldn’t read that PDF: ' + e(err.message) + '</div>'; });
    }
    dropzone($('#pdrop'), { accept: 'application/pdf' }, function (f) { handle(f[0]); });
    $('#sample').onclick = function () { fetch('../sample/sample-issue.pdf').then(function (r) { return r.blob(); }).then(function (b) { if (!$('#pt').value) $('#pt').value = monthTitle() + ' (sample)'; handle(new File([b], 'sample-issue.pdf', { type: 'application/pdf' })); }); };
    $$('[data-del]').forEach(function (b) { b.onclick = function () { if (!confirm('Remove this issue from the site?')) return; H.write('issues', H.read('issues').filter(function (i) { return i.id !== b.dataset.del; })); log('Removed print edition', ''); route(); }; });
  };

  /* ads */
  V.ads = function (v, arg) {
    title('Ad campaigns');
    var ads = H.read('ads'), today = HS.today();
    function st(a) { return a.status === 'paused' ? 'paused' : a.end < today ? 'ended' : a.start > today ? 'scheduled' : 'live'; }
    var paid = ads.filter(function (a) { return a.kind !== 'house'; });
    var imp = ads.reduce(function (s, a) { return s + (a.impressions || 0); }, 0), clk = ads.reduce(function (s, a) { return s + (a.clicks || 0); }, 0);
    v.innerHTML = '<div class="grid g4" style="margin-bottom:18px">' + kpi('#ads', I.ad, 'Live campaigns', ads.filter(function (a) { return st(a) === 'live'; }).length, paid.length + ' paid · ' + (ads.length - paid.length) + ' house') + kpi('#ads', I.eye, 'Impressions', imp.toLocaleString(), 'counted in this demo browser') + kpi('#ads', I.check, 'Clicks', clk, imp ? (clk / imp * 100).toFixed(1) + '% click rate' : 'no impressions yet') + kpi('#inbox', I.inbox, 'Open ad leads', H.read('submissions').filter(function (s) { return s.type === 'ad-lead' && s.status !== 'contacted' && s.status !== 'archived'; }).length, 'from the Advertise page') + '</div>' +
      '<div class="toolbar"><span style="font-size:13px;color:var(--mute)">Ads are served from your own site. No ad-server subscription, and reports are ready to send to advertisers.</span><div style="flex:1"></div><button class="btn primary" id="nad">' + I.plus + ' New campaign</button></div>' +
      '<div class="card"><table class="t resp"><thead><tr><th style="width:96px">Creative</th><th>Advertiser</th><th>Placement</th><th>Runs</th><th>Status</th><th class="num">Impr.</th><th class="num">Clicks</th><th></th></tr></thead><tbody>' + ads.map(function (a) {
        return '<tr><td class="c-img">' + (a.kind === 'house' ? '<span class="ad-thumb">House</span>' : thumb(a.image, 'ad-thumb')) + '</td><td class="c-main"><span class="ttl">' + e(a.advertiser) + '</span><small>' + e(a.kind === 'house' ? a.headline : (a.link || '')) + '</small></td><td class="c-hide">' + e({ leaderboard: 'Front page banner', sidebar: 'Sidebar', inline: 'In-story' }[a.zone]) + '</td><td class="c-hide"><small>' + H.fmtDate(a.start + 'T12:00') + ' – ' + H.fmtDate(a.end + 'T12:00') + '</small></td><td><span class="pill ' + st(a) + '">' + st(a) + '</span></td><td class="num c-hide">' + (a.impressions || 0) + '</td><td class="num c-hide">' + (a.clicks || 0) + '</td><td><div style="display:flex;gap:4px;justify-content:flex-end"><button class="btn sm" data-tog="' + a.id + '">' + (a.status === 'paused' ? 'Resume' : 'Pause') + '</button>' + (a.kind !== 'house' ? '<button class="btn sm" data-rep="' + a.id + '">Report</button><button class="btn sm danger" data-del="' + a.id + '" aria-label="Delete">' + I.x + '</button>' : '') + '</div></td></tr>';
      }).join('') + '</tbody></table></div>';
    H.hydrate(v);
    $('#nad').onclick = adForm;
    if (arg === 'new') adForm();
    $$('[data-tog]').forEach(function (b) { b.onclick = function () { var l = H.read('ads'); l.forEach(function (a) { if (a.id === b.dataset.tog) { a.status = a.status === 'paused' ? 'live' : 'paused'; log((a.status === 'paused' ? 'Paused' : 'Resumed') + ' ad', a.advertiser); } }); H.write('ads', l); route(); }; });
    $$('[data-del]').forEach(function (b) { b.onclick = function () { if (!confirm('Delete this campaign?')) return; H.write('ads', H.read('ads').filter(function (a) { return a.id !== b.dataset.del; })); route(); }; });
    $$('[data-rep]').forEach(function (b) { b.onclick = function () {
      var a = H.read('ads').filter(function (x) { return x.id === b.dataset.rep; })[0];
      var txt = 'Hoover Sun campaign report: ' + a.advertiser + '\nPlacement: ' + { leaderboard: 'Front page banner', sidebar: 'Sidebar', inline: 'In-story' }[a.zone] + '\nFlight: ' + H.fmtDate(a.start + 'T12:00') + ' – ' + H.fmtDate(a.end + 'T12:00') + '\nImpressions: ' + (a.impressions || 0) + '\nClicks: ' + (a.clicks || 0) + '\nClick rate: ' + (a.impressions ? ((a.clicks || 0) / a.impressions * 100).toFixed(2) : '0.00') + '%\n\nThank you for supporting local news in Hoover.';
      var m = modal('Advertiser report', '<textarea class="in" style="min-height:220px;font-family:ui-monospace,Menlo,monospace;font-size:13px" readonly>' + e(txt) + '</textarea><p style="font-size:12.5px;color:var(--mute);margin-top:8px">In the live build this goes out as a branded PDF on the 1st of every month, automatically.</p>', '<button class="btn primary" id="cp">Copy report</button>');
      $('#cp', m).onclick = function () { navigator.clipboard.writeText(txt).then(function () { toast('Report copied'); }); };
    }; });
  };
  function adForm() {
    var img = null, today = HS.today(), end = HS.today(30);
    var b = modal('New ad campaign', '<div class="fld"><label>Advertiser</label><input class="in" id="a1" placeholder="Business name"></div><div class="fld"><label>Placement</label><div class="radio" id="a2"><label><input type="radio" name="z" value="leaderboard" checked>Front page banner <small style="margin-left:auto;color:var(--mute)">970×250</small></label><label><input type="radio" name="z" value="sidebar">Sidebar, on every story <small style="margin-left:auto;color:var(--mute)">300×250</small></label><label><input type="radio" name="z" value="inline">In-story <small style="margin-left:auto;color:var(--mute)">728×300</small></label></div></div>' +
      '<div class="fld"><label>Creative</label><div class="drop" id="adrop">' + I.up + '<div style="margin-top:6px"><b>Upload the ad</b> (JPG or PNG)</div></div></div><div class="fld"><label>Click-through link</label><input class="in" id="a3" placeholder="https://"></div><div class="r2"><div class="fld"><label>Starts</label><input class="in" type="date" id="a4" value="' + today + '"></div><div class="fld"><label>Ends</label><input class="in" type="date" id="a5" value="' + end + '"></div></div>',
      '<button class="btn" data-x2>Cancel</button><button class="btn primary" id="asave">Launch campaign</button>');
    $('[data-x2]', b).onclick = closeModal;
    dropzone($('#adrop', b), {}, function (f) { $('#adrop', b).innerHTML = 'Uploading…'; uploadImages(f).then(function (r) { if (!r[0]) return; img = r[0].ref; H.blobURL(r[0].id).then(function (u) { $('#adrop', b).innerHTML = '<img src="' + u + '" style="max-height:140px;margin:0 auto;border-radius:6px" alt=""><div style="margin-top:6px">' + e(r[0].name) + ' · ' + r[0].w + '×' + r[0].h + '</div>'; }); }); });
    $('#asave', b).onclick = function () {
      var adv = $('#a1', b).value.trim(); if (!adv) { toast('Add the advertiser name'); return; } if (!img) { toast('Upload the ad creative'); return; }
      var a = { id: H.uid('ad'), zone: $('input[name=z]:checked', b).value, kind: 'image', advertiser: adv, image: img, link: $('#a3', b).value.trim(), start: $('#a4', b).value, end: $('#a5', b).value, status: 'live', impressions: 0, clicks: 0 };
      var l = H.read('ads'); l.unshift(a); H.write('ads', l); log('Launched ad campaign', adv); closeModal(); toast('Campaign is live', ['See it on the site →', a.zone === 'leaderboard' ? '../index.html' : '../article.html?slug=' + encodeURIComponent(H.published()[0].slug)]); route();
    };
  }

  /* newsletter */
  V.newsletter = function (v) {
    title('Newsletter');
    var pub = H.published(), s = H.read('settings');
    var picked = pub.slice(0, 6).map(function (a) { return a.id; });
    var withEvents = true;
    v.innerHTML = '<div class="grid" style="grid-template-columns:minmax(0,380px) minmax(0,1fr);align-items:start" id="nlg"><div class="card"><div class="card-h"><h2>Tomorrow morning’s edition</h2></div><div class="card-b">' +
      '<div class="fld"><label for="ns">Subject line</label><input class="in" id="ns"></div><div class="fld"><label for="ni">Intro</label><textarea class="in" id="ni" style="min-height:70px">' + e(s.newsletterIntro || '') + '</textarea></div>' +
      '<label class="switch" style="margin-bottom:14px">Include upcoming events<input type="checkbox" id="ne" checked></label><span class="lbl">Stories (first one leads)</span><div id="npick" style="max-height:340px;overflow:auto;margin-top:6px;border:1px solid var(--line);border-radius:9px"></div>' +
      '<div style="display:grid;gap:8px;margin-top:14px"><button class="btn primary" id="nsend">' + I.mail + ' Schedule for 6:00 a.m.</button><div style="display:flex;gap:8px"><button class="btn" style="flex:1" id="ntest">Send me a test</button><button class="btn" style="flex:1" id="ncopy">Copy HTML</button></div></div>' +
      '<p style="font-size:12px;color:var(--mute);margin-top:10px">Built automatically from what’s published. No copy-pasting stories into the email tool every morning.</p></div></div>' +
      '<div class="card" style="overflow:hidden"><div class="card-h"><h2>Preview</h2><span style="font-size:12.5px;color:var(--mute)">As readers see it in their inbox</span></div><iframe id="nf" title="Newsletter preview" style="width:100%;height:760px;border:0;background:#f3f1ee"></iframe></div></div>' +
      '<style>@media(max-width:1000px){#nlg{grid-template-columns:1fr!important}}</style>';
    function pick() { $('#npick').innerHTML = pub.slice(0, 20).map(function (a) { return '<label style="display:flex;gap:10px;align-items:flex-start;padding:9px 12px;border-bottom:1px solid var(--line-2);font-size:13px;cursor:pointer"><input type="checkbox" value="' + a.id + '"' + (picked.indexOf(a.id) >= 0 ? ' checked' : '') + ' style="margin-top:3px;accent-color:var(--maroon)"><span><b style="font-weight:600">' + e(a.title) + '</b><br><small style="color:var(--mute)">' + e(H.sectionName(a.section)) + ' · ' + H.timeAgo(a.date) + '</small></span></label>'; }).join(''); $$('#npick input').forEach(function (c) { c.onchange = function () { picked = $$('#npick input:checked').map(function (x) { return x.value; }); draw(); }; }); }
    function abs(p) { return p && p.indexOf('idb:') !== 0 ? new URL('../' + p, location.href).href : ''; }
    function html() {
      var arts = picked.map(function (id) { return pub.filter(function (a) { return a.id === id; })[0]; }).filter(Boolean);
      var today = HS.today();
      var evs = withEvents ? H.read('events').filter(function (x) { return x.status === 'approved' && x.date >= today; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; }).slice(0, 3) : [];
      var site = new URL('../', location.href).href;
      var L = arts[0], R = arts.slice(1);
      var h = '<!doctype html><html><body style="margin:0;background:#f3f1ee;font-family:Georgia,serif;color:#1c1a19"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f3f1ee"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff">' +
        '<tr><td style="padding:26px 28px 18px;border-bottom:3px solid #1c1a19"><div style="font:900 40px/0.9 Arial,sans-serif;letter-spacing:-2px"><span style="font-weight:300;color:#8e2a24;letter-spacing:-1px">Hoover</span>Sun</div><div style="font:12px Arial,sans-serif;color:#77706b;margin-top:8px;text-transform:uppercase;letter-spacing:1px">' + new Date(Date.now() + 864e5).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + '</div></td></tr>' +
        '<tr><td style="padding:20px 28px 4px;font:17px/1.55 Georgia,serif;color:#45403d">' + e($('#ni').value) + '</td></tr>';
      if (L) h += '<tr><td style="padding:16px 28px">' + (abs(L.image) ? '<a href="' + site + 'article.html?slug=' + L.slug + '"><img src="' + abs(L.image) + '" width="544" style="width:100%;height:auto;display:block;border:0" alt=""></a>' : '') + '<div style="font:bold 11px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#8e2a24;margin-top:14px">' + e(H.sectionName(L.section)) + '</div><a href="' + site + 'article.html?slug=' + L.slug + '" style="color:#1c1a19;text-decoration:none"><div style="font:bold 26px/1.15 Georgia,serif;margin:6px 0">' + e(L.title) + '</div></a><div style="font:16px/1.5 Georgia,serif;color:#45403d">' + e(L.dek) + '</div></td></tr>';
      R.forEach(function (a) { h += '<tr><td style="padding:14px 28px;border-top:1px solid #ece7e1"><table role="presentation" width="100%"><tr>' + (abs(a.image) ? '<td width="120" valign="top" style="padding-right:14px"><img src="' + abs(a.image) + '" width="120" style="width:120px;height:84px;object-fit:cover;display:block" alt=""></td>' : '') + '<td valign="top"><div style="font:bold 10px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#8e2a24">' + e(H.sectionName(a.section)) + '</div><a href="' + site + 'article.html?slug=' + a.slug + '" style="color:#1c1a19;text-decoration:none;font:bold 18px/1.25 Georgia,serif">' + e(a.title) + '</a></td></tr></table></td></tr>'; });
      if (evs.length) h += '<tr><td style="padding:18px 28px;background:#f7f3ec"><div style="font:bold 12px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">Coming up in Hoover</div>' + evs.map(function (x) { return '<div style="padding:8px 0;border-top:1px solid #e5dfd6;font:15px/1.4 Georgia,serif"><b>' + e(x.title) + '</b><br><span style="font:13px Arial,sans-serif;color:#77706b">' + e(x.when) + '</span></div>'; }).join('') + '</td></tr>';
      h += '<tr><td style="padding:22px 28px;font:12px/1.6 Arial,sans-serif;color:#77706b;border-top:1px solid #ece7e1">Hoover Sun · 1833 27th Avenue South, Homewood, AL 35209<br>You’re getting this because you signed up at hooversun.com. <a href="#" style="color:#77706b">Unsubscribe</a></td></tr></table></td></tr></table></body></html>';
      return h;
    }
    function draw() { var lead = pub.filter(function (a) { return a.id === picked[0]; })[0]; if (!$('#ns').dataset.touched) $('#ns').value = lead ? 'Hoover Sun: ' + lead.title : 'Hoover Sun'; $('#nf').srcdoc = html(); }
    $('#ns').oninput = function () { this.dataset.touched = 1; };
    $('#ni').oninput = function () { var st = H.read('settings'); st.newsletterIntro = this.value; localStorage.setItem('hs-demo-v1:settings', JSON.stringify(st)); draw(); };
    $('#ne').onchange = function () { withEvents = this.checked; draw(); };
    $('#nsend').onclick = function () { log('Scheduled newsletter', $('#ns').value); toast('Scheduled for 6:00 a.m. (demo, nothing is sent)'); };
    $('#ntest').onclick = function () { toast('Test sent to your inbox (demo, nothing is sent)'); };
    $('#ncopy').onclick = function () { navigator.clipboard.writeText(html()).then(function () { toast('Email HTML copied. It pastes into Mailchimp as-is.'); }); };
    pick(); draw();
  };

  /* homepage */
  V.homepage = function (v) {
    title('Homepage & alerts');
    var pub = H.published(), s = H.read('settings');
    var lead = pub.filter(function (a) { return a.placement === 'lead'; })[0];
    var tops = pub.filter(function (a) { return a.placement === 'top'; }).slice(0, 3);
    function opts(sel) { return '<option value="">Automatic (newest with a photo)</option>' + pub.slice(0, 40).map(function (a) { return '<option value="' + a.id + '"' + (sel && sel.id === a.id ? ' selected' : '') + '>' + e(a.title) + '</option>'; }).join(''); }
    v.innerHTML = '<div class="grid" style="grid-template-columns:minmax(0,400px) minmax(0,1fr);align-items:start" id="hpg"><div class="grid"><div class="card"><div class="card-h"><h2>' + I.bolt + ' Breaking alert bar</h2></div><div class="card-b"><label class="switch" style="margin-bottom:12px">Show alert on every page<input type="checkbox" id="aon"' + (s.alert.on ? ' checked' : '') + '></label><div class="fld"><label for="atx">Alert text</label><textarea class="in" id="atx" style="min-height:64px">' + e(s.alert.text) + '</textarea></div><div class="fld"><label for="asl">Links to</label><select class="in" id="asl"><option value="">No link</option>' + pub.slice(0, 40).map(function (a) { return '<option value="' + e(a.slug) + '"' + (s.alert.slug === a.slug ? ' selected' : '') + '>' + e(a.title) + '</option>'; }).join('') + '</select></div><button class="btn primary" id="asave" style="width:100%">Update alert</button></div></div>' +
      '<div class="card"><div class="card-h"><h2>Front page lineup</h2></div><div class="card-b"><div class="fld"><label for="hl">Lead story</label><select class="in" id="hl">' + opts(lead) + '</select></div>' + [0, 1, 2].map(function (i) { return '<div class="fld"><label for="ht' + i + '">Top story ' + (i + 1) + '</label><select class="in" id="ht' + i + '">' + opts(tops[i]) + '</select></div>'; }).join('') + '<button class="btn primary" id="hsave" style="width:100%">Update front page</button><p style="font-size:12px;color:var(--mute);margin-top:8px">Changes go live instantly. The preview on the right updates on its own.</p></div></div></div>' +
      '<div class="card" style="overflow:hidden"><div class="card-h"><h2>Live front page</h2><a href="../index.html" target="_blank">Open in new tab</a></div><iframe class="preview-frame" style="border:0;border-radius:0;height:820px" src="../index.html" title="Homepage preview"></iframe></div></div><style>@media(max-width:1000px){#hpg{grid-template-columns:1fr!important}}</style>';
    $('#asave').onclick = function () { var st = H.read('settings'); st.alert = { on: $('#aon').checked, text: $('#atx').value.trim(), slug: $('#asl').value }; H.write('settings', st); log(st.alert.on ? 'Updated breaking alert' : 'Turned off alert', st.alert.text); toast(st.alert.on ? 'Alert is live on every page' : 'Alert turned off'); };
    $('#aon').onchange = function () { $('#asave').click(); };
    $('#hsave').onclick = function () {
      var l = H.read('articles'), leadId = $('#hl').value, topIds = [0, 1, 2].map(function (i) { return $('#ht' + i).value; }).filter(Boolean);
      l.forEach(function (a) { if (a.placement === 'lead' || a.placement === 'top') a.placement = ''; if (topIds.indexOf(a.id) >= 0) a.placement = 'top'; if (a.id === leadId) a.placement = 'lead'; });
      H.write('articles', l); log('Rearranged front page', ''); toast('Front page updated');
    };
  };

  /* team */
  V.team = function (v) {
    title('Team & roles');
    var t = team(), admin = me().role === 'admin';
    v.innerHTML = '<div class="toolbar"><span style="font-size:13px;color:var(--mute)">Everyone gets their own login. Roles decide what they can touch.</span><div style="flex:1"></div>' + (admin ? '<button class="btn primary" id="inv">' + I.plus + ' Invite someone</button>' : '') + '</div>' +
      '<div class="card" style="margin-bottom:18px"><table class="t resp"><thead><tr><th style="width:52px"></th><th>Name</th><th>Role</th><th>Can</th></tr></thead><tbody>' + t.map(function (s) {
        return '<tr><td class="c-img">' + av(s.name) + '</td><td class="c-main"><span class="ttl">' + e(s.name) + '</span><small>' + e(s.title) + '</small></td><td>' + (admin && s.id !== me().id ? '<select class="in" data-r="' + s.id + '" style="width:auto;height:32px">' + Object.keys(H.ROLES).map(function (r) { return '<option value="' + r + '"' + (s.role === r ? ' selected' : '') + '>' + H.ROLES[r].label + '</option>'; }).join('') + '</select>' : '<span class="role-tag">' + H.ROLES[s.role].label + '</span>') + '</td><td class="c-hide"><small>' + H.ROLES[s.role].can.length + ' of 10 areas</small></td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="grid g2">' + Object.keys(H.ROLES).map(function (r) { return '<div class="card"><div class="card-h"><h2>' + H.ROLES[r].label + '</h2></div><div class="card-b"><div class="perm">' + ['publish', 'stories', 'media', 'events', 'inbox', 'print', 'ads', 'newsletter', 'homepage', 'team'].map(function (p) { return '<span class="' + (H.ROLES[r].can.indexOf(p) >= 0 ? 'y' : '') + '">' + { publish: 'Publish live', stories: 'Write stories', media: 'Photos', events: 'Events', inbox: 'Reader inbox', print: 'Print editions', ads: 'Ads', newsletter: 'Newsletter', homepage: 'Front page', team: 'Manage team' }[p] + '</span>'; }).join('') + '</div></div></div>'; }).join('') + '</div>' +
      (!admin ? '<p style="font-size:12.5px;color:var(--mute);margin-top:12px">Sign in as Dan Starnes or Alison Grizzle (Publisher) to change roles or invite people.</p>' : '');
    $$('[data-r]').forEach(function (sel) { sel.onchange = function () { var l = team(); l.forEach(function (x) { if (x.id === sel.dataset.r) x.role = sel.value; }); H.write('team', l); log('Changed a role', sel.value); toast('Role updated'); }; });
    var inv = $('#inv'); if (inv) inv.onclick = function () {
      var b = modal('Invite a team member', '<div class="fld"><label>Name</label><input class="in" id="i1"></div><div class="fld"><label>Email</label><input class="in" id="i2" type="email"></div><div class="fld"><label>Title</label><input class="in" id="i4" placeholder="e.g. Sports Writer"></div><div class="fld"><label>Role</label><select class="in" id="i3">' + Object.keys(H.ROLES).map(function (r) { return '<option value="' + r + '"' + (r === 'writer' ? ' selected' : '') + '>' + H.ROLES[r].label + '</option>'; }).join('') + '</select></div>', '<button class="btn" data-x2>Cancel</button><button class="btn primary" id="isend">Send invite</button>');
      $('[data-x2]', b).onclick = closeModal;
      $('#isend', b).onclick = function () { var n = $('#i1', b).value.trim(); if (!n) { toast('Add a name'); return; } var l = team(); l.push({ id: H.uid('u'), name: n, title: $('#i4', b).value.trim() || H.ROLES[$('#i3', b).value].label, role: $('#i3', b).value }); H.write('team', l); log('Invited', n); closeModal(); toast('Invite sent to ' + ($('#i2', b).value || n) + ' (demo)'); route(); };
    };
  };

  /* platform */
  V.platform = function (v) {
    title('What this replaces');
    var rows = [
      ['Website + CMS', 'Metro Publisher', 'This dashboard + the new site', 'Faster pages, your own design, no per-site license'],
      ['Print e-edition', 'Issuu flipbooks', 'Print editions', 'Upload the printer PDF; readers stay on hooversun.com'],
      ['Daily newsletter', 'Mailchimp, assembled by hand', 'Newsletter', 'Builds itself from what’s published'],
      ['Newsletter growth', 'SparkLoop', 'Signup forms on every page', 'Native signups, no referral add-on required'],
      ['Ad serving', 'Broadstreet', 'Ad campaigns', 'Upload, schedule, report; leads from the Advertise page'],
      ['Traffic stats', 'Google Analytics (old Universal tag, retired by Google in 2023)', 'Reads on every story', 'Working analytics again, privacy-friendly'],
      ['Reader submissions', 'Emails to individual staff', 'Reader inbox', 'Tips, events, celebrations, letters, ad leads in one queue'],
      ['Share buttons', 'ShareThis script', 'Built-in share', 'One less third-party script and tracker'],
      ['Six separate websites', 'One license per title', 'One dashboard, title switcher', 'Same login for 280 Living, Village Living, Homewood Star, Vestavia Voice, Cahaba Sun']
    ];
    v.innerHTML = '<div class="callout" style="margin-bottom:16px">Today the Hoover Sun runs on about ten separate services stitched together. This platform does the same jobs in one place, for all six Starnes Media titles.</div><div class="card"><table class="t resp stack-tbl"><thead><tr><th>Job</th><th>Today</th><th>In this platform</th><th>What changes</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td class="c-main">' + e(r[0]) + '</td><td><span class="old">' + e(r[1]) + '</span></td><td><b>' + e(r[2]) + '</b></td><td class="c-hide"><small>' + e(r[3]) + '</small></td></tr>'; }).join('') + '</tbody></table></div>';
  };

  /* ---------- router ---------- */
  function route() {
    if (!me()) { login(); return; }
    if (!$('#view')) shell();
    keySave = null;
    var h = (location.hash || '#overview').slice(1).split('/'), name = h[0] || 'overview', arg = h.slice(1).join('/');
    var navKey = name === 'story' ? 'stories' : name;
    var item = NAV.filter(function (n) { return n[0] === navKey; })[0];
    if (name === 'story' ? !can('stories') && !can('publish') : item && item[3] && !can(item[3])) { name = 'overview'; navKey = 'overview'; }
    if (!V[name]) name = navKey = 'overview';
    navDraw(navKey);
    var fab = $('.fab'); if (fab) fab.style.display = name === 'story' ? 'none' : '';
    var v = $('#view'); v.innerHTML = '';
    V[name](v, arg);
    window.scrollTo(0, 0);
  }
  var lastHash = location.hash;
  window.addEventListener('hashchange', function () {
    if (dirty && !confirm('You have unsaved changes. Leave without saving?')) { history.replaceState(null, '', lastHash); return; }
    dirty = false; lastHash = location.hash; route();
  });
  window.addEventListener('beforeunload', function (x) { if (dirty) { x.preventDefault(); x.returnValue = ''; } });
  H.onChange(function (col) {
    // refresh when the public site (another tab) adds submissions etc., unless mid-edit
    if (!me() || dirty || $('#modal.open')) return;
    var name = (location.hash || '#overview').slice(1).split('/')[0];
    if (name === 'story' || name === 'homepage' || name === 'newsletter') { navDraw(name === 'story' ? 'stories' : name); return; }
    route();
  });
  function boot() { shell(); route(); }
  if (me()) boot(); else login();
})();
