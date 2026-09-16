/* VASSALTIS public site — shared chrome & behaviours */
(function () {
  document.documentElement.classList.remove('no-js');
  const page = document.body.dataset.page || '';
  const C = VX.contact;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const NAV = [
    ['wines', 'wines.html', 'Wines'],
    ['visit', 'visit.html', 'Visit'],
    ['story', 'story.html', 'Our Story'],
    ['events', 'events.html', 'Events'],
    ['athens', 'athens.html', 'Athens'],
    ['journal', 'journal.html', 'Journal']
  ];
  const cur = k => (k === page ? ' aria-current="page"' : '');

  /* concept ribbon + header */
  const head = document.querySelector('[data-vx-header]');
  if (head) {
    head.outerHTML = `
<a class="skip" href="#main">Skip to content</a>
<div class="concept-bar">Concept by Williams Digital<span class="long"> · not the live Vassaltis site · bookings link to the real i-host pages</span> · <a href="dashboard.html">Staff dashboard</a> · <a href="client.html">Guest portal</a></div>
<header class="site-head" id="top">
  <div class="wrap head-in">
    <a class="logo" href="index.html" aria-label="Vassaltis Vineyards — home"><img src="img/logo.png" alt="Vassaltis Vineyards" width="947" height="396"></a>
    <nav class="nav" aria-label="Primary">${NAV.map(([k, h, l]) => `<a href="${h}"${cur(k)}>${l}</a>`).join('')}</nav>
    <div class="head-tools">
      <div class="lang" role="group" aria-label="Language"><button type="button" aria-pressed="true" data-lang="en">EN</button><button type="button" aria-pressed="false" data-lang="el">EL</button></div>
      <a class="member-link" href="client.html">My Vassaltis</a>
      <a class="btn sm" href="visit.html#book">Book a visit</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Menu"><span></span><span></span></button>
    </div>
  </div>
  <div class="mnav" id="mnav">
    ${NAV.map(([k, h, l]) => `<a class="big" href="${h}"${cur(k)}>${l}</a>`).join('')}
    <div class="sub">
      <a href="client.html">My Vassaltis</a>
      <a href="${C.club}" rel="noopener">Wine Club ↗</a>
      <a href="${C.hotel.url}" rel="noopener">Stay at The Vasilicos ↗</a>
      <a href="tel:${C.winery.tel}">${C.winery.phone}</a>
    </div>
    <div class="lang" role="group" aria-label="Language"><button type="button" aria-pressed="true" data-lang="en">EN</button><button type="button" aria-pressed="false" data-lang="el">EL</button></div>
  </div>
</header>
<div class="lang-note" role="status" aria-live="polite"></div>`;
  }

  /* footer */
  const foot = document.querySelector('[data-vx-footer]');
  if (foot) {
    foot.outerHTML = `
<footer class="site-foot">
  <div class="wrap">
    <div class="foot-top">
      <div>
        <img class="foot-logo" src="img/logo.png" alt="Vassaltis Vineyards" width="947" height="396">
        <p style="max-width:22em;margin:0">Vassaltis means basalt: <span lang="el">βασάλτης</span>, the volcanic rock beneath the vines.</p>
      </div>
      <div>
        <h4>Santorini</h4>
        <ul><li>${esc(C.winery.address)}</li><li><a href="tel:${C.winery.tel}">${C.winery.phone}</a></li><li><a href="mailto:${C.winery.email}">${C.winery.email}</a></li><li>Open ${C.winery.hours}</li></ul>
      </div>
      <div>
        <h4>Athens</h4>
        <ul><li>${esc(C.athens.address)}</li><li><a href="athens.html">Vassaltis Downtown</a></li></ul>
      </div>
      <div>
        <h4>Explore</h4>
        <ul><li><a href="wines.html">Our wines</a></li><li><a href="visit.html">Tastings &amp; dining</a></li><li><a href="events.html">Weddings &amp; events</a></li><li><a href="${C.club}" rel="noopener">Wine Club ↗</a></li><li><a href="${C.hotel.url}" rel="noopener">The Vasilicos hotel ↗</a></li></ul>
      </div>
      <form class="news" novalidate>
        <h4>Vassaltis Post</h4>
        <label for="nl-email">Harvest notes, new releases and the newsletter, a few times a year.</label>
        <div class="row"><input id="nl-email" type="email" placeholder="Email address" autocomplete="email" required><button type="submit" aria-label="Subscribe">→</button></div>
        <label class="consent"><input type="checkbox" required> <span>I agree to receive the Vassaltis newsletter and can unsubscribe at any time.</span></label>
        <div class="msg" role="status" aria-live="polite"></div>
      </form>
    </div>
    <div class="foot-bot">
      <span>© Vassaltis Vineyards · Photography and wordmark are Vassaltis’s own, used for this concept.</span>
      <nav aria-label="Legal"><a href="https://vassaltis.com/gdpr/" rel="noopener">Privacy</a><a href="https://vassaltis.com/cookie-policy-eu/" rel="noopener">Cookies</a><a href="https://vassaltis.com/terms-of-use/" rel="noopener">Terms</a><span>Concept · Williams Digital</span></nav>
    </div>
  </div>
</footer>`;
  }

  /* sticky header border */
  const sh = document.querySelector('.site-head');
  const onScroll = () => sh && sh.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  const mb = document.querySelector('.menu-btn');
  if (mb) {
    const set = open => { document.body.classList.toggle('menu-open', open); mb.setAttribute('aria-expanded', open); };
    mb.addEventListener('click', () => set(mb.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { set(false); mb.focus(); } });
  }

  /* language: English is complete; Greek is honestly flagged */
  const note = document.querySelector('.lang-note');
  let t;
  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => {
    const el = b.dataset.lang === 'el';
    document.querySelectorAll('[data-lang]').forEach(x => x.setAttribute('aria-pressed', String((x.dataset.lang === 'el') === el)));
    if (el && note) {
      note.textContent = 'Ελληνικά — η ελληνική έκδοση θα προστεθεί μετά από έλεγχο. Greek pages are reviewed by the Vassaltis team before launch; this concept shows English.';
      note.classList.add('show'); clearTimeout(t);
      t = setTimeout(() => { note.classList.remove('show'); document.querySelectorAll('[data-lang]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.lang === 'en'))); }, 5200);
    }
  }));

  /* newsletter (demo) */
  const nf = document.querySelector('.news');
  if (nf) nf.addEventListener('submit', e => {
    e.preventDefault();
    const em = nf.querySelector('input[type=email]'), ck = nf.querySelector('input[type=checkbox]'), msg = nf.querySelector('.msg');
    if (!em.value || !em.checkValidity()) { msg.textContent = 'Please enter a valid email address.'; em.focus(); return; }
    if (!ck.checked) { msg.textContent = 'Please tick the consent box to subscribe.'; ck.focus(); return; }
    msg.textContent = 'Thank you. (Concept only — nothing was sent.)'; nf.reset();
  });

  /* reveal on scroll */
  const rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add('in'));

  /* published content from the staff dashboard (demo store) */
  VX.published = () => { try { return window.VXS ? VXS.get().content.published : null; } catch (e) { return null; } };
  VX.esc = esc;
  VX.euro = n => '€' + n;
})();
