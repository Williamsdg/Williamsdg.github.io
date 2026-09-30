/* Hoopsology — shared chrome, player, renderers and page controllers. */
(function () {
  const HS = window.HS;
  const L = (window.HS_CONFIG || {}).links || {};
  const root = document.currentScript.src.replace(/assets\/site\.js.*$/, '');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ───────── icons ───────── */
  const I = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15.1V8.9l5.8 3.1-5.8 3.1z"/></svg>',
    sp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22zm5.04 15.87a.69.69 0 0 1-.94.23c-2.58-1.58-5.83-1.93-9.66-1.06a.69.69 0 1 1-.3-1.34c4.19-.96 7.78-.55 10.67 1.22.32.2.43.62.23.95zm1.35-3a.86.86 0 0 1-1.18.28c-2.95-1.81-7.45-2.34-10.94-1.28a.86.86 0 1 1-.5-1.65c3.99-1.21 8.95-.62 12.34 1.46.4.25.53.78.28 1.19zm.12-3.12C14.97 8.65 9.14 8.46 5.77 9.48a1.03 1.03 0 1 1-.6-1.97c3.87-1.17 10.3-.95 14.37 1.47a1.03 1.03 0 0 1-1.03 1.77z"/></svg>',
    ap: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9 9 0 0 0-3.5 17.3c.3.1.5-.1.5-.4l-.2-1.3a.5.5 0 0 0-.3-.4A7 7 0 1 1 18.8 12a7 7 0 0 1-4.3 5.2.5.5 0 0 0-.3.4l-.2 1.3c0 .3.2.5.5.4A9 9 0 0 0 12 2zm0 3.5a5.5 5.5 0 0 0-2.9 10.2c.3.2.7 0 .7-.4l.1-.9a.6.6 0 0 0-.2-.5 3.7 3.7 0 1 1 4.6 0 .6.6 0 0 0-.2.5l.1.9c0 .4.4.6.7.4A5.5 5.5 0 0 0 12 5.5zm0 3.6a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zm0 4.7c-1.1 0-1.6.6-1.5 1.5l.6 4.9c.1.7.4 1 .9 1s.8-.3.9-1l.6-4.9c.1-.9-.4-1.5-1.5-1.5z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/></svg>',
  };
  const ICON_PLAY_BALL = `<span class="ball-play">${I.play}</span>`;

  /* full-court diagram used as a background motif */
  const COURT = `<svg class="court-lines" viewBox="0 0 1400 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" stroke-width="2">
    <g stroke="rgba(255,255,255,.14)">
      <rect x="60" y="60" width="1280" height="640" rx="4"/>
      <path d="M700 60v640"/><circle cx="700" cy="380" r="90"/><circle cx="700" cy="380" r="30"/>
      <rect x="60" y="290" width="238" height="180"/><circle cx="298" cy="380" r="90"/>
      <path d="M60 110h110a270 270 0 0 1 0 540H60"/>
      <rect x="1102" y="290" width="238" height="180"/><circle cx="1102" cy="380" r="90"/>
      <path d="M1340 110h-110a270 270 0 0 0 0 540h110"/>
    </g>
    <g stroke="rgba(255,122,26,.35)"><circle cx="112" cy="380" r="12"/><circle cx="1288" cy="380" r="12"/></g>
  </svg>`;

  /* ───────── formatting ───────── */
  const fmtDur = (s) => {
    if (!s) return '';
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = String(s % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${m}:${x}`;
  };
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const ago = (iso) => {
    if (!iso) return '';
    const d = (Date.now() - new Date(iso)) / 1000;
    if (d < 3600) return Math.max(1, Math.round(d / 60)) + 'm ago';
    if (d < 86400) return Math.round(d / 3600) + 'h ago';
    if (d < 86400 * 14) return Math.round(d / 86400) + 'd ago';
    return fmtDate(iso);
  };
  const fmtViews = (n) => n == null ? '' : n >= 1e6 ? (n / 1e6).toFixed(1) + 'M views' : n >= 1e3 ? (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K views' : n + (n === 1 ? ' view' : ' views');
  const cleanTitle = (t) => (t || '').replace(/\s*#\w+/g, '').replace(/\s{2,}/g, ' ').trim();
  const thumb = (id, q = 'maxresdefault') => `https://i.ytimg.com/vi/${id}/${q}.jpg`;
  const firstLine = (d) => (d || '').split(/\n|(?<=[.!?])\s/)[0] + '';

  const WNBA = /\b(wnba|lynx|aces|fever|liberty|sparks|tempo|valkyries|mystics|dream|wings|storm|mercury|sky|sun|caitlin clark|a'ja|bueckers|olivia miles)\b/i;
  function tagOf(v) {
    const t = v.title || '', d = (v.description || '').slice(0, 600);
    if (/\bITL\b|in the lab/i.test(t)) return { k: 'itl', label: 'In The Lab' };
    if (/joins hoopsology|sit down with|interview|we talk with/i.test(d) || /:\s*Life as|announcer|reporter/i.test(t)) return { k: 'interview', label: 'Interview' };
    if (WNBA.test(t) || WNBA.test(d.slice(0, 200))) return { k: 'wnba', label: 'WNBA' };
    return { k: 'nba', label: 'NBA' };
  }
  const img = (src, alt = '', cls = '', fallback = '') =>
    `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" ${cls ? `class="${cls}"` : ''} ${fallback ? `onerror="this.onerror=null;this.src='${esc(fallback)}'"` : ''}>`;

  /* ───────── sanitizer for story HTML ───────── */
  const ALLOW = { P: [], H2: [], H3: [], STRONG: [], B: [], EM: [], I: [], U: [], A: ['href'], UL: [], OL: [], LI: [], BLOCKQUOTE: [], BR: [], IMG: ['src', 'alt'], FIGURE: [], FIGCAPTION: [], HR: [] };
  function sanitize(html) {
    const doc = new DOMParser().parseFromString(`<div>${html || ''}</div>`, 'text/html');
    const walk = (node) => {
      [...node.children].forEach((el) => {
        if (/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|TEMPLATE|NOSCRIPT|META|LINK|TITLE)$/.test(el.tagName)) { el.remove(); return; }
        walk(el);
        if (!ALLOW[el.tagName]) { el.replaceWith(...el.childNodes); return; }
        [...el.attributes].forEach((a) => { if (!ALLOW[el.tagName].includes(a.name)) el.removeAttribute(a.name); });
        const u = el.getAttribute('href') || el.getAttribute('src');
        if (u && !/^(https?:|mailto:|data:image\/|\/|#)/i.test(u.trim())) { el.removeAttribute('href'); el.removeAttribute('src'); }
        if (el.tagName === 'A') { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
      });
    };
    const box = doc.body.firstChild; walk(box); return box.innerHTML;
  }

  /* ───────── chrome ───────── */
  const NAV = [
    ['index.html', 'Home', 'home', 'Tip-off'],
    ['episodes.html', 'Episodes', 'episodes', 'Q1'],
    ['shorts.html', 'Shorts', 'shorts', 'Q2'],
    ['news.html', 'News', 'news', 'Q3'],
    ['locker-room.html', 'Locker Room', 'locker', 'Q4'],
  ];
  function chrome(page) {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `<div class="wrap">
      <a class="brand" href="${root}index.html" aria-label="Hoopsology home"><img src="${root}assets/wordmark.png" alt="Hoopsology" width="190" height="51"></a>
      <nav class="nav" aria-label="Main">${NAV.map(([h, t, k]) => `<a href="${root}${h}" ${k === page ? 'aria-current="page"' : ''}>${t}${k === 'locker' ? '<span class="soon">SOON</span>' : ''}</a>`).join('')}</nav>
      <div class="header-cta">
        <a class="btn btn-ball btn-sm" href="${L.subscribe}" target="_blank" rel="noopener">${I.yt} Subscribe</a>
        <button class="icon-btn menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">${I.menu}</button>
      </div></div>`;
    const drawer = document.createElement('div');
    drawer.className = 'drawer'; drawer.id = 'drawer';
    drawer.innerHTML = NAV.map(([h, t, k, q]) => `<a class="dl" href="${root}${h}" ${k === page ? 'aria-current="page"' : ''}>${t}<span>${q}</span></a>`).join('') +
      `<div class="listen"><a class="btn btn-ball" href="${L.subscribe}" target="_blank" rel="noopener">${I.yt} Subscribe</a><a class="btn" href="${L.spotify}" target="_blank" rel="noopener">${I.sp} Spotify</a></div>`;
    document.body.prepend(drawer);
    document.body.prepend(header);
    const btn = $('.menu-btn', header);
    btn.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      btn.setAttribute('aria-expanded', open); btn.innerHTML = open ? I.close : I.menu;
      document.body.style.overflow = open ? 'hidden' : '';
    });

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `<div class="wrap"><div class="foot-grid">
      <div><img src="${root}assets/wordmark.png" alt="Hoopsology" width="171" height="46" loading="lazy">
        <p>Where basketball meets insight. Smart, in-depth conversations about the NBA, WNBA and global hoops culture, with the athletes, analysts and insiders who live it.</p>
        <div class="socials">
          <a class="icon-btn" href="${L.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${I.yt}</a>
          <a class="icon-btn" href="${L.spotify}" target="_blank" rel="noopener" aria-label="Spotify">${I.sp}</a>
          <a class="icon-btn" href="${L.apple}" target="_blank" rel="noopener" aria-label="Apple Podcasts">${I.ap}</a>
          <a class="icon-btn" href="${L.x}" target="_blank" rel="noopener" aria-label="X / Twitter">${I.x}</a>
          <a class="icon-btn" href="${L.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
        </div></div>
      <div class="nav-col"><h4>The site</h4><ul>${NAV.map(([h, t]) => `<li><a href="${root}${h}">${t}</a></li>`).join('')}</ul></div>
      <div><h4>Listen</h4><ul>
        <li><a href="${L.youtube}" target="_blank" rel="noopener">YouTube</a></li>
        <li><a href="${L.spotify}" target="_blank" rel="noopener">Spotify</a></li>
        <li><a href="${L.apple}" target="_blank" rel="noopener">Apple Podcasts</a></li>
        <li><a href="${root}admin/">Staff login</a></li></ul></div>
    </div>
    <div class="foot-base"><span>© ${new Date().getFullYear()} Hoopsology Podcast</span><span class="sync" id="syncStamp"><i></i>Episodes auto-sync from YouTube</span></div></div>`;
    document.body.append(footer);
  }

  /* ───────── modal player ───────── */
  let modal, modalList = [], modalIdx = 0, vertical = false;
  function ensureModal() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'modal'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-label', 'Video player');
    modal.innerHTML = `<button class="icon-btn modal-close" aria-label="Close player">${I.close}</button>
      <div class="modal-inner"><div class="screen" id="mScreen"></div>
        <div class="vnav"><button class="icon-btn" data-step="-1" aria-label="Previous short">${I.up}</button><button class="icon-btn" data-step="1" aria-label="Next short">${I.down}</button></div>
        <div class="modal-bar"><h3 id="mTitle"></h3><a class="btn btn-sm" id="mYT" target="_blank" rel="noopener">${I.yt} Watch on YouTube</a></div></div>`;
    document.body.append(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.modal-close')) closePlayer(); const s = e.target.closest('[data-step]'); if (s) step(+s.dataset.step); });
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closePlayer();
      if (vertical && (e.key === 'ArrowDown' || e.key === 'ArrowRight')) { e.preventDefault(); step(1); }
      if (vertical && (e.key === 'ArrowUp' || e.key === 'ArrowLeft')) { e.preventDefault(); step(-1); }
    });
  }
  function load() {
    const v = modalList[modalIdx];
    $('#mScreen').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    $('#mTitle').textContent = cleanTitle(v.title);
    $('#mYT').href = (vertical ? 'https://www.youtube.com/shorts/' : 'https://www.youtube.com/watch?v=') + v.id;
    $$('[data-step]', modal).forEach((b) => { b.disabled = (+b.dataset.step < 0 ? modalIdx === 0 : modalIdx === modalList.length - 1); b.style.opacity = b.disabled ? .35 : 1; });
  }
  function step(d) { const n = modalIdx + d; if (n >= 0 && n < modalList.length) { modalIdx = n; load(); } }
  function openPlayer(list, idx, isVertical) {
    ensureModal();
    $$('.short.playing, .short.previewing').forEach(stopShort);
    modalList = list; modalIdx = idx; vertical = !!isVertical;
    modal.classList.toggle('vertical', vertical);
    $('.vnav', modal).hidden = !vertical;
    load();
    modal.classList.add('open'); document.body.style.overflow = 'hidden';
    $('.modal-close', modal).focus();
  }
  function closePlayer() { modal.classList.remove('open'); $('#mScreen').innerHTML = ''; document.body.style.overflow = ''; }

  /* ───────── renderers ───────── */
  const epCard = (v, i) => {
    const t = tagOf(v);
    return `<button class="ep rv" data-i="${i}" aria-label="Play: ${esc(v.title)}">
      <div class="thumb">${img(thumb(v.id), '', '', thumb(v.id, 'hqdefault'))}<span class="tag t-${t.k}">${t.label}</span>
        ${v.seconds ? `<span class="dur">${fmtDur(v.seconds)}</span>` : ''}<span class="hover-play">${ICON_PLAY_BALL}</span></div>
      <div class="ep-text"><div class="ep-meta">${ago(v.published)}${v.views != null ? ' · ' + fmtViews(v.views) : ''}</div><h3>${esc(v.title)}</h3></div></button>`;
  };
  const shortCard = (v, i) => `<div class="short" data-i="${i}" data-id="${v.id}">
      <div class="short-media">${img(thumb(v.id, 'oar2'), '', 'poster', thumb(v.id, 'hqdefault'))}</div>
      <button class="short-hit" aria-label="Play short: ${esc(cleanTitle(v.title))}"></button>
      <span class="sbadge">${I.bolt.replace('<svg', '<svg width="12" height="12"')} ${fmtDur(v.seconds) || 'SHORT'}</span>
      <span class="sound-hint">🔇 Click for sound</span>
      <button class="short-expand" aria-label="Open full screen">${I.expand}</button>
      <span class="cap">${esc(cleanTitle(v.title))}<span class="v">${[fmtViews(v.views), ago(v.published)].filter(Boolean).join(' · ')}</span></span></div>`;

  /* Shorts play in the card: hover = muted looping preview, click/tap = sound + controls,
     expand button = full-screen swipe viewer. Only one Short plays with sound at a time. */
  const CAN_HOVER = matchMedia('(hover: hover) and (pointer: fine)').matches;
  let soundCard = null;
  function stopShort(card) {
    clearTimeout(card._t);
    const f = $('iframe', card); if (f) f.remove();
    card.classList.remove('previewing', 'playing', 'ready');
    if (soundCard === card) soundCard = null;
  }
  function startShort(card, withSound) {
    const id = card.dataset.id;
    stopShort(card);
    if (withSound && soundCard) stopShort(soundCard);
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&${withSound ? 'controls=1' : 'mute=1&controls=0'}&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3`;
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.title = 'Hoopsology short';
    f.addEventListener('load', () => { card._t = setTimeout(() => card.classList.add('ready'), withSound ? 300 : 900); });
    $('.short-media', card).append(f);
    card.classList.add(withSound ? 'playing' : 'previewing');
    if (withSound) soundCard = card;
  }
  const shortObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting && e.target.classList.contains('playing')) stopShort(e.target); }), { threshold: 0.2 })
    : null;
  function inlineShorts(container, list) {
    $$('.short', container).forEach((card) => {
      if (shortObserver) shortObserver.observe(card);
      if (CAN_HOVER) {
        card.addEventListener('mouseenter', () => { if (card.classList.contains('playing')) return; clearTimeout(card._t); card._t = setTimeout(() => startShort(card, false), 280); });
        card.addEventListener('mouseleave', () => { if (!card.classList.contains('playing')) stopShort(card); });
      }
    });
    container.addEventListener('click', (e) => {
      const card = e.target.closest('.short'); if (!card) return;
      if (e.target.closest('.short-expand')) { stopShort(card); return openPlayer(list, +card.dataset.i, true); }
      if (e.target.closest('.short-hit')) startShort(card, true);
    });
  }
  const storyUrl = (s) => `${root}story.html?s=${encodeURIComponent(s.slug)}`;
  const storyCover = (s) => s.cover || (s.video ? thumb(s.video) : `${root}assets/banner.jpg`);
  const storyFeature = (s) => `<a class="story-feature rv" href="${storyUrl(s)}"><div class="cover">${img(storyCover(s), '', '', s.video ? thumb(s.video, 'hqdefault') : '')}</div>
      <div class="body"><div class="byline"><span class="cat">${esc(s.category)}</span> · ${fmtDate(s.published)}</div><h3>${esc(s.title)}</h3>${s.dek ? `<p>${esc(s.dek)}</p>` : ''}</div></a>`;
  const storyRow = (s) => `<a class="story-row rv" href="${storyUrl(s)}"><div class="cover">${img(storyCover(s), '', '', s.video ? thumb(s.video, 'hqdefault') : '')}</div>
      <div><div class="byline"><span class="cat">${esc(s.category)}</span> · ${ago(s.published)}</div><h4>${esc(s.title)}</h4></div></a>`;

  function bindPlay(container, list, vertical) {
    container.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) openPlayer(list, +b.dataset.i, vertical); });
  }
  function reveal() {
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' }) : null;
    $$('.rv:not(.in)').forEach((el) => io ? io.observe(el) : el.classList.add('in'));
    setTimeout(() => $$('.rv:not(.in)').forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }), 1200);
  }
  function stamp(data) { const s = $('#syncStamp'); if (s && data.updated) s.innerHTML = `<i></i>Synced from YouTube ${ago(data.updated)}`; }
  async function videoData() {
    const [data, settings] = await Promise.all([HS.store.videos(), HS.store.settings().catch(() => ({ hidden: [] }))]);
    const hidden = new Set(settings.hidden || []);
    data.episodes = data.episodes.filter((v) => !hidden.has(v.id));
    data.shorts = data.shorts.filter((v) => !hidden.has(v.id));
    data.settings = settings;
    stamp(data);
    return data;
  }
  function chipFilter(el, items, onChange) {
    const counts = { all: items.length };
    items.forEach((v) => { const k = tagOf(v).k; counts[k] = (counts[k] || 0) + 1; });
    const opts = [['all', 'All'], ['nba', 'NBA'], ['wnba', 'WNBA'], ['interview', 'Interviews'], ['itl', 'In The Lab']].filter(([k]) => counts[k]);
    el.innerHTML = opts.map(([k, t], i) => `<button class="chip" data-k="${k}" aria-pressed="${i === 0}">${t}<span class="n">${counts[k]}</span></button>`).join('');
    el.addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (!c) return; $$('.chip', el).forEach((x) => x.setAttribute('aria-pressed', x === c)); onChange(c.dataset.k); });
  }
  const byTag = (list, k) => k === 'all' ? list : list.filter((v) => tagOf(v).k === k);

  function waitlistForm(form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const note = form.parentElement.querySelector('.form-note'), email = form.email.value.trim();
      try { await HS.store.joinWaitlist(email); note.className = 'form-note ok'; note.textContent = "You're on the list. We'll let you know when the doors open."; form.reset(); }
      catch (err) { note.className = 'form-note'; note.textContent = /duplicate|unique/i.test(err.message) ? "You're already on the list." : 'Something went wrong. Try again.'; }
    });
  }

  /* ───────── pages ───────── */
  const pages = {
    async home() {
      const data = await videoData();
      const eps = data.episodes, shorts = data.shorts;
      const pin = data.settings.heroVideo && eps.find((v) => v.id === data.settings.heroVideo);
      const hero = pin || eps[0];
      if (hero) {
        const t = tagOf(hero);
        $('#heroKicker').innerHTML = pin ? `<span class="live-dot"></span>Featured episode` : `<span class="live-dot"></span>New episode · ${ago(hero.published)}`;
        const ht = $('#heroTitle'); ht.textContent = hero.title;
        ht.classList.toggle('long', hero.title.length > 48); ht.classList.toggle('xlong', hero.title.length > 72);
        $('#heroDek').textContent = firstLine(hero.description) || '';
        $('#heroMeta').innerHTML = `<span><b>${t.label}</b></span>${hero.seconds ? `<span>Runtime <b>${fmtDur(hero.seconds)}</b></span>` : ''}<span>${fmtDate(hero.published)}</span>`;
        const scr = $('#heroScreen');
        scr.innerHTML = `${img(thumb(hero.id), hero.title, '', thumb(hero.id, 'hqdefault'))}<span class="badge-live"><span class="live-dot"></span>ON AIR</span><button class="play" aria-label="Play episode">${ICON_PLAY_BALL}</button>`;
        const playHere = () => { scr.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${hero.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="${esc(hero.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`; };
        scr.addEventListener('click', playHere, { once: true });
        $('#heroWatch').addEventListener('click', () => { playHere(); $('#heroScreen').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
      }
      $('#sbEpisodes').textContent = eps.length;
      $('#sbShorts').textContent = shorts.length;
      $('#sbSubs').textContent = (data.channel && data.channel.subscribers) || '—';
      const latest = [...eps, ...shorts].sort((a, b) => (b.published || '').localeCompare(a.published || ''))[0];
      if (latest) { const d = Math.max(0, Math.floor((Date.now() - new Date(latest.published)) / 86400000)); $('#sbLatest').innerHTML = d === 0 ? 'TODAY' : `${d}<small>${d === 1 ? 'DAY' : 'DAYS'}</small>`; }

      const rest = eps.filter((v) => v !== hero);
      const grid = $('#epGrid');
      const draw = (k) => { const list = byTag(rest, k).slice(0, 6); grid.innerHTML = list.map(epCard).join('') || '<p class="empty">No episodes in this category yet.</p>'; grid._list = list; reveal(); };
      grid.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) openPlayer(grid._list, +b.dataset.i); });
      chipFilter($('#epChips'), rest, draw); draw('all');

      const reel = $('#reel'), sl = shorts.slice(0, 14);
      reel.innerHTML = sl.map(shortCard).join('');
      inlineShorts(reel, sl);
      $$('[data-reel]').forEach((b) => b.addEventListener('click', () => reel.scrollBy({ left: +b.dataset.reel * reel.clientWidth * .8, behavior: 'smooth' })));

      const stories = await HS.store.stories().catch(() => []);
      const feat = stories.find((s) => s.featured) || stories[0];
      $('#newsFeature').innerHTML = feat ? storyFeature(feat) : '<p class="empty">Stories are on the way.</p>';
      $('#newsList').innerHTML = stories.filter((s) => s !== feat).slice(0, 3).map(storyRow).join('');
      waitlistForm($('#waitlist'));
      reveal();
    },

    async episodes() {
      const data = await videoData();
      const eps = data.episodes, grid = $('#epGrid'), q = $('#q');
      let k = 'all', list = [];
      const draw = () => {
        const term = q.value.trim().toLowerCase();
        list = byTag(eps, k).filter((v) => !term || (v.title + ' ' + (v.description || '')).toLowerCase().includes(term));
        grid.innerHTML = list.map(epCard).join('') || `<p class="empty">No episodes match “${esc(q.value)}”.</p>`;
        $('#count').textContent = `${list.length} episode${list.length === 1 ? '' : 's'}`;
        reveal();
      };
      grid.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) openPlayer(list, +b.dataset.i); });
      chipFilter($('#epChips'), eps, (x) => { k = x; draw(); });
      q.addEventListener('input', draw);
      draw();
      const deep = new URLSearchParams(location.search).get('v');
      if (deep) { const i = list.findIndex((v) => v.id === deep); if (i >= 0) openPlayer(list, i); }
    },

    async shorts() {
      const data = await videoData();
      const grid = $('#shortGrid');
      grid.innerHTML = data.shorts.map(shortCard).join('');
      inlineShorts(grid, data.shorts);
      $('#count').textContent = `${data.shorts.length} shorts`;
    },

    async news() {
      videoData().catch(() => {});
      const stories = await HS.store.stories();
      const cats = ['All', ...new Set(stories.map((s) => s.category).filter(Boolean))];
      const chips = $('#newsChips'), grid = $('#newsGrid');
      const draw = (c) => { const l = c === 'All' ? stories : stories.filter((s) => s.category === c); grid.innerHTML = l.map(storyFeature).join('') || '<p class="empty">No stories yet. Check back soon.</p>'; reveal(); };
      chips.innerHTML = cats.map((c, i) => `<button class="chip" aria-pressed="${i === 0}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
      chips.addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (!b) return; $$('.chip', chips).forEach((x) => x.setAttribute('aria-pressed', x === b)); draw(b.dataset.c); });
      draw('All');
    },

    async story() {
      videoData().catch(() => {});
      const slug = new URLSearchParams(location.search).get('s');
      const s = slug && await HS.store.story(slug);
      const main = $('#story');
      if (!s || (s.status !== 'published' && !(await HS.store.signedIn()))) {
        main.innerHTML = `<div class="article article-head"><span class="kicker">Airball</span><h1 class="display">Story not found</h1><p class="dek">It may have been moved or unpublished.</p><a class="btn btn-ball" href="${root}news.html">Back to News</a></div>`;
        return;
      }
      document.title = `${s.title} · Hoopsology`;
      const media = s.video
        ? `<div class="screen" id="storyScreen">${img(thumb(s.video), '', '', thumb(s.video, 'hqdefault'))}<button class="play" aria-label="Play episode">${ICON_PLAY_BALL}</button></div>`
        : s.cover ? img(s.cover, s.title) : '';
      main.innerHTML = `
        ${s.status !== 'published' ? '<div class="wrap"><p class="kicker" style="margin-top:20px">Draft preview · not public</p></div>' : ''}
        <div class="wrap"><header class="article article-head">
          <span class="kicker">${esc(s.category)}</span>
          <h1 class="display">${esc(s.title)}</h1>
          ${s.dek ? `<p class="dek">${esc(s.dek)}</p>` : ''}
          <div class="byline">By ${esc(s.author || 'Hoopsology Staff')} · ${fmtDate(s.published)}</div>
        </header>
        ${media ? `<div class="article-media">${media}</div>` : ''}
        <article class="article prose">${sanitize(s.body)}</article>
        <div class="article share-row"><button class="btn btn-sm" id="copyLink">${I.link} Copy link</button>
          <a class="btn btn-sm" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(s.title)}&url=${encodeURIComponent(location.href)}&via=hoopsologypod">${I.x} Share</a>
          <a class="link-arrow" style="margin-left:auto" href="${root}news.html">More stories ${I.arrow}</a></div></div>`;
      const scr = $('#storyScreen');
      if (scr) scr.addEventListener('click', () => { scr.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${s.video}?autoplay=1&rel=0&playsinline=1" title="${esc(s.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`; }, { once: true });
      $('#copyLink').addEventListener('click', async (e) => { try { await navigator.clipboard.writeText(location.href); e.currentTarget.lastChild.textContent = ' Copied!'; } catch (_) {} });
      const more = (await HS.store.stories()).filter((x) => x.id !== s.id).slice(0, 3);
      if (more.length) $('#more').innerHTML = `<div class="sec-head"><h2 class="display" style="font-size:clamp(34px,4vw,52px)">Keep reading</h2></div><div class="news-grid">${more.map(storyFeature).join('')}</div>`;
      reveal();
    },

    async locker() { videoData().catch(() => {}); waitlistForm($('#waitlist')); },
  };

  HS.ui = { I, esc, fmtDur, fmtDate, ago, fmtViews, thumb, tagOf, sanitize, cleanTitle, COURT, root, openPlayer };

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'admin') return;
    chrome(page === 'community' ? 'locker' : page);
    $$('[data-court]').forEach((el) => el.insertAdjacentHTML('afterbegin', COURT));
    $$('[data-icon]').forEach((el) => el.insertAdjacentHTML('afterbegin', I[el.dataset.icon] || ''));
    $$('[data-link]').forEach((el) => { el.href = L[el.dataset.link]; el.target = '_blank'; el.rel = 'noopener'; });
    reveal();
    if (pages[page]) pages[page]().then(reveal).catch((e) => { console.error(e); const m = $('main'); if (m) m.insertAdjacentHTML('afterbegin', `<div class="wrap"><p class="empty" style="margin-top:24px">Couldn't load the latest content. Refresh to try again.</p></div>`); });
  });
})();
