/* Hoover Sun — public site chrome + shared templates */
(function () {
  var H = window.HS, e = H.esc;
  var ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.7-.6z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zM16.7 19.2h1.7L7.4 4.7H5.6z"/></svg>',
    li: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.01 5 2.5 2.5 0 01.01-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v13M7 8l5-5 5 5"/><path d="M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>'
  };
  H.ICON = ICON;

  var NAV = [['news', 'News'], ['business', 'Business'], ['schools', 'Schools'], ['sports', 'Sports'], ['people', 'People'], ['opinion', 'Opinion']];
  var page = document.body.getAttribute('data-page') || '';
  var curSec = new URLSearchParams(location.search).get('s') || document.body.getAttribute('data-sec') || '';

  function wordmark() {
    return '<a class="wordmark" href="index.html" aria-label="Hoover Sun home"><span class="wm-sym"><i>Hoover</i>Sun</span><span class="wm-tag">Hoover’s community<br>news source</span></a>';
  }
  H.wordmark = wordmark;

  function chrome() {
    var s = H.read('settings'), today = new Date();
    var issue = H.read('issues').filter(function (i) { return i.status === 'published'; }).sort(function (a, b) { return a.month < b.month ? 1 : -1; })[0];
    var alertSlug = s.alert && s.alert.slug;
    var top = '<div class="demo-ribbon"><b>Concept preview</b> by Williams Digital, built on real Hoover Sun stories. Staff dashboard: <a href="admin/">open the newsroom</a></div>' +
      (s.alert && s.alert.on && s.alert.text ? '<div class="alert"><div class="wrap"><span class="tag">Alert</span><a href="' + (alertSlug ? 'article.html?slug=' + e(alertSlug) : '#') + '">' + e(s.alert.text) + '</a></div></div>' : '') +
      '<div class="util"><div class="wrap"><nav><a class="keep" href="edition.html">Print edition</a><a href="events.html">Events</a><a href="submit.html">Submit a story</a><a href="advertise.html">Advertise</a><a href="about.html">About</a></nav>' +
      '<div class="social"><a href="https://www.facebook.com/HooverSunNews" aria-label="Facebook">' + ICON.fb + '</a><a href="https://www.instagram.com/hoover_sun/" aria-label="Instagram">' + ICON.ig + '</a><a href="https://twitter.com/HooverSun" aria-label="X">' + ICON.x + '</a><a href="https://www.linkedin.com/company/hoover-sun" aria-label="LinkedIn">' + ICON.li + '</a></div></div></div>' +
      '<header class="mast"><div class="wrap"><div class="meta"><b>' + today.toLocaleDateString('en-US', { weekday: 'long' }) + '</b>' + H.fmtDate(today, true) + (issue ? '<br><a href="edition.html" style="color:var(--maroon);font-weight:600">' + e(issue.title) + ' issue →</a>' : '') + '</div>' +
      '<div>' + wordmark() + '</div><div class="cta"><a class="btn sm" href="submit.html">Submit</a><a class="btn sm solid" href="#newsletter" data-nl>Newsletter</a></div></div></header>' +
      '<div class="nav" id="nav"><div class="wrap"><button class="icon-btn" data-open="drawer" aria-label="Menu">' + ICON.menu + '</button><a class="mini" href="index.html"><i>Hoover</i>Sun</a><nav class="links">' +
      '<a href="index.html" class="' + (page === 'home' ? 'on' : '') + '">Home</a>' +
      NAV.map(function (n) { return '<a href="section.html?s=' + n[0] + '" class="' + (curSec === n[0] ? 'on' : '') + '">' + n[1] + '</a>'; }).join('') +
      '<a href="events.html" class="' + (page === 'events' ? 'on' : '') + '">Events</a><a href="edition.html" class="' + (page === 'edition' ? 'on' : '') + '">Print Edition</a></nav>' +
      '<div class="tools"><button class="icon-btn" data-open="search" aria-label="Search">' + ICON.search + '</button></div></div></div>' +
      '<div class="searchbar" id="searchbar"><div class="wrap"><form action="section.html"><label class="sr" for="q">Search the Sun</label><input id="q" name="q" type="search" placeholder="Search stories, people, places…"><button class="btn solid" type="submit">Search</button></form></div></div>' +
      '<div class="drawer" id="drawer"><div class="scrim" data-close></div><div class="panel"><div class="head">' + '<a class="mini" href="index.html" style="border:0;font:900 26px/1 var(--sans);letter-spacing:-.04em"><i style="font-weight:300;font-style:normal;color:var(--maroon)">Hoover</i>Sun</a><button class="icon-btn" data-close aria-label="Close">' + ICON.close + '</button></div>' +
      '<a href="index.html">Home</a>' + H.SECTIONS.filter(function (x) { return x.key !== 'sponsored'; }).map(function (x) {
        return '<a href="section.html?s=' + x.key + '">' + x.name + '</a>' + (x.subs || []).map(function (sb) { return '<a class="sub" href="section.html?s=' + x.key + '&sub=' + encodeURIComponent(sb) + '">' + e(sb) + '</a>'; }).join('');
      }).join('') + '<a href="events.html">Events calendar</a><a href="edition.html">Print edition</a><a href="submit.html">Submit a story or event</a><a href="advertise.html">Advertise</a><a href="about.html">About &amp; staff</a><a href="admin/">Staff login</a></div></div>';
    var el = document.getElementById('chrome'); if (el) el.innerHTML = top;

    var f = document.getElementById('foot');
    if (f) f.innerHTML = '<footer class="foot"><div class="wrap"><div class="grid"><div>' + wordmark() +
      '<address>Hoover Sun LLC, a Starnes Media company<br>1833 27th Avenue South, Homewood, AL 35209<br><a href="tel:+12053131780">205-313-1780</a></address></div>' +
      '<div class="hide-m"><h6>Sections</h6><ul>' + NAV.map(function (n) { return '<li><a href="section.html?s=' + n[0] + '">' + n[1] + '</a></li>'; }).join('') + '<li><a href="events.html">Events</a></li></ul></div>' +
      '<div><h6>The Sun</h6><ul><li><a href="about.html">About &amp; staff</a></li><li><a href="edition.html">Print edition</a></li><li><a href="submit.html">Submit a story</a></li><li><a href="submit.html?type=celebration">Celebrations</a></li><li><a href="advertise.html">Advertise</a></li></ul></div>' +
      '<div><h6>Starnes Media</h6><ul><li>280 Living</li><li>Village Living</li><li>The Homewood Star</li><li>Vestavia Voice</li><li>Cahaba Sun</li></ul></div></div>' +
      '<div class="base"><span>© ' + new Date().getFullYear() + ' Hoover Sun LLC. Concept redesign by Williams Digital.</span><a class="staff-link" href="admin/">' + ICON.lock + ' Staff login</a></div></div></footer>' +
      '<div class="toast" id="toast" role="status" aria-live="polite"></div>';

    bind();
  }

  function bind() {
    document.querySelectorAll('[data-open="drawer"]').forEach(function (b) { b.onclick = function () { document.getElementById('drawer').classList.add('open'); }; });
    document.querySelectorAll('#drawer [data-close]').forEach(function (b) { b.onclick = function () { document.getElementById('drawer').classList.remove('open'); }; });
    var sb = document.querySelector('[data-open="search"]');
    if (sb) sb.onclick = function () { var s = document.getElementById('searchbar'); s.classList.toggle('open'); if (s.classList.contains('open')) document.getElementById('q').focus(); };
    document.querySelectorAll('[data-nl]').forEach(function (a) {
      a.onclick = function (ev) { var n = document.getElementById('newsletter'); if (n) { ev.preventDefault(); n.scrollIntoView({ behavior: 'smooth', block: 'center' }); var i = n.querySelector('input'); if (i) setTimeout(function () { i.focus(); }, 400); } };
    });
    var nav = document.getElementById('nav');
    if (nav) { var io = new IntersectionObserver(function (en) { nav.classList.toggle('stuck', !en[0].isIntersecting); }); var m = document.querySelector('.mast'); if (m) io.observe(m); }
  }

  /* ---------- templates ---------- */
  function href(a) { return 'article.html?slug=' + encodeURIComponent(a.slug); }
  function img(a, cls) { return '<div class="ph ' + (cls || '') + '"><img loading="lazy" src="' + H.src(a.image) + '"' + H.imgAttr(a.image) + ' alt="' + e(a.caption || a.title) + '"></div>'; }
  function kick(a) { return '<span class="kicker">' + e(a.subsection || H.sectionName(a.section)) + '</span>'; }
  function meta(a) { return '<div class="meta-line"><b>' + e(a.author) + '</b> · ' + H.timeAgo(a.date) + '</div>'; }
  H.T = {
    href: href, img: img, kick: kick, meta: meta,
    card: function (a) { return '<a class="card" href="' + href(a) + '">' + (a.image ? img(a) : '') + kick(a) + '<h3 class="hl">' + e(a.title) + '</h3><p class="dek">' + e(a.dek) + '</p>' + meta(a) + '</a>'; },
    row: function (a) { return '<a href="' + href(a) + '"><div class="row"><div>' + kick(a) + '<h3 class="hl" style="margin-top:6px">' + e(a.title) + '</h3>' + meta(a) + '</div>' + (a.image ? img(a) : '<span></span>') + '</div></a>'; }
  };

  /* ---------- ad zones ---------- */
  function renderZones(root) {
    var ads = H.read('ads'), today = HS.today(), counted = false;
    (root || document).querySelectorAll('[data-zone]').forEach(function (z) {
      var zone = z.getAttribute('data-zone');
      var pool = ads.filter(function (a) { return a.zone === zone && a.status === 'live' && a.start <= today && a.end >= today; });
      if (!pool.length) { z.innerHTML = ''; return; }
      var paid = pool.filter(function (a) { return a.kind !== 'house'; });
      var list = paid.length ? paid : pool;
      var ad = list[Math.floor(Math.random() * list.length)];
      ad.impressions = (ad.impressions || 0) + 1; counted = true;
      var inner = ad.kind === 'house'
        ? '<div class="house"><div><h4>' + e(ad.headline) + '</h4><p>' + e(ad.sub) + '</p></div><span class="btn solid sm">' + e(ad.cta) + '</span></div>'
        : '<span class="ad-img"><img src="' + H.src(ad.image) + '"' + H.imgAttr(ad.image) + ' alt="' + e(ad.advertiser) + '"></span>';
      z.innerHTML = '<div class="ad-label">' + (ad.kind === 'house' ? 'From the Sun' : 'Advertisement') + '</div><a href="' + e(ad.link || '#') + '" data-ad="' + ad.id + '"' + (/^https?:/.test(ad.link || '') ? ' target="_blank" rel="noopener sponsored"' : '') + '>' + inner + '</a>';
      z.querySelector('a').addEventListener('click', function (ev) { var l = H.read('ads'); l.forEach(function (x) { if (x.id === ad.id) x.clicks = (x.clicks || 0) + 1; }); H.write('ads', l); if (ad.link === '#newsletter') { var n = document.getElementById('newsletter'); if (n) { ev.preventDefault(); n.scrollIntoView({ behavior: 'smooth', block: 'center' }); } } });
    });
    if (counted) { try { localStorage.setItem('hs-demo-v1:ads', JSON.stringify(ads)); } catch (x) {} }
    H.hydrate(root);
  }
  H.renderZones = renderZones;

  function toast(msg) { var t = document.getElementById('toast'); if (!t) return; t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 3200); }
  H.toast = toast;

  H.newsletterBox = function () {
    return '<div class="nl" id="newsletter"><h4>Hoover, in your inbox.</h4><p>The day’s local stories every morning, plus Friday football. Free.</p><form data-nlform><label class="sr" for="nle">Email</label><input id="nle" type="email" required placeholder="you@email.com" autocomplete="email"><button class="btn" type="submit">Sign me up</button></form></div>';
  };
  document.addEventListener('submit', function (ev) {
    if (!ev.target.matches('[data-nlform]')) return;
    ev.preventDefault();
    var em = ev.target.querySelector('input').value.trim();
    var subs = H.read('submissions');
    subs.unshift({ id: H.uid('s'), type: 'newsletter', name: em, email: em, created: new Date().toISOString(), subject: 'New newsletter signup', message: em + ' joined the daily newsletter list.', status: 'new' });
    H.write('submissions', subs); H.log('Newsletter signup', em);
    ev.target.innerHTML = '<p style="color:#fff;font-weight:600;margin:0">You’re on the list. Watch for tomorrow morning’s edition.</p>';
  });

  /* live updates when the newsroom publishes */
  H.live = function (render) {
    var t; H.onChange(function () { clearTimeout(t); t = setTimeout(function () { chrome(); render(); }, 120); });
  };

  chrome();
})();
