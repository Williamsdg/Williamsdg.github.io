/* Shared chrome + components for the public preview. */
(function () {
  var S = CJD.state.settings;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var tel = function (p) { return 'tel:+1' + String(p).replace(/\D/g, ''); };
  var MAPS = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Cummings Jewelry Design, 3166 Heights Village, Birmingham, AL 35243');
  var page = document.body.getAttribute('data-page');

  function header() {
    var nav = [['jewelry.html', 'Jewelry', 'jewelry'], ['custom.html', 'Custom Design', 'custom'], ['services.html', 'Services', 'services'], ['visit.html', 'Our Story & Visit', 'visit']];
    var links = nav.map(function (n) { return '<a href="' + n[0] + '"' + (page === n[2] ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join('');
    return '<a class="skip" href="#main">Skip to content</a>' +
      (S.announceOn && S.announce ? '<div class="announce">' + esc(S.announce) + '</div>' : '') +
      '<header class="site-header" id="hdr"><div class="wrap hdr">' +
      '<a class="brand" href="index.html" aria-label="Cummings Jewelry Design — home"><img src="img/s/logo-dark.png" alt="Cummings Jewelry Design" width="240" height="68"></a>' +
      '<nav class="nav" aria-label="Primary">' + links + '</nav>' +
      '<div class="hdr-cta"><a class="hdr-phone" href="' + tel(S.phone) + '">' + esc(S.phone) + '</a><a class="btn" href="custom.html#consult">Request a Consultation</a></div>' +
      '<button class="menu-btn" aria-expanded="false" aria-controls="drawer" aria-label="Menu"><span></span></button>' +
      '</div></header>' +
      '<div class="drawer" id="drawer" hidden>' + nav.map(function (n) { return '<a class="dl" href="' + n[0] + '">' + n[1] + '</a>'; }).join('') +
      '<a class="btn" href="custom.html#consult">Request a Consultation</a><a class="hdr-phone" href="' + tel(S.phone) + '">Call ' + esc(S.phone) + '</a></div>';
  }

  function footer() {
    return '<footer class="site-footer dark"><div class="wrap"><div class="ft">' +
      '<div><a class="brand" href="index.html"><img src="img/s/logo-light.png" alt="Cummings Jewelry Design" width="240" height="68"></a>' +
      '<p style="max-width:34ch;margin:0">A family-owned Birmingham jeweler since 1978 — custom design, estate jewelry, repair and restoration.</p></div>' +
      '<div><h4>Visit</h4><ul><li>' + esc(S.address1) + '<br>' + esc(S.address2) + '</li><li><a href="' + MAPS + '" target="_blank" rel="noopener">Get directions</a></li><li><a href="' + tel(S.phone) + '">' + esc(S.phone) + '</a></li></ul></div>' +
      '<div><h4>Hours</h4><ul><li>' + esc(S.hoursWeek) + '</li><li>' + esc(S.hoursDec) + '</li></ul></div>' +
      '<div><h4>Explore</h4><ul><li><a href="jewelry.html">Jewelry</a></li><li><a href="custom.html">Custom Design</a></li><li><a href="services.html#repair">Repair &amp; Restoration</a></li><li><a href="services.html#appraisals">Appraisals</a></li><li><a href="services.html#gold">Sell Your Gold</a></li><li><a href="https://www.mysynchrony.com/mmc/LX207956300" target="_blank" rel="noopener">Financing</a></li><li><a href="https://www.facebook.com/cummingsjewelry/" target="_blank" rel="noopener">Facebook</a></li></ul></div>' +
      '</div><div class="ft-base"><span>© Cummings Jewelry Design</span><span>Design concept prepared by Williams Digital — not the live website.</span></div></div></footer>' +
      '<a class="concept-chip" href="admin.html"><span class="dot"></span><span>Concept preview · <b>Open staff dashboard</b></span></a>';
  }

  var top = document.getElementById('chrome-top');
  if (top) top.outerHTML = header();
  var foot = document.getElementById('chrome-foot');
  if (foot) foot.outerHTML = footer();

  var hdr = document.getElementById('hdr');
  var menuBtn = document.querySelector('.menu-btn');
  var drawer = document.getElementById('drawer');
  if (menuBtn) menuBtn.addEventListener('click', function () {
    var open = menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.style.setProperty('--hdr-bottom', hdr.getBoundingClientRect().bottom + 'px');
    drawer.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  });
  addEventListener('scroll', function () { if (hdr) hdr.classList.toggle('scrolled', scrollY > 8); }, { passive: true });

  /* ---------- components ---------- */
  function detailLine(p) {
    return [p.metal, p.stones && p.stones.length ? p.stones.slice(0, 2).join(' & ') : ''].filter(Boolean).join(' · ');
  }
  function card(p, opts) {
    opts = opts || {};
    var alt = p.images && p.images[1] ? (/^img\/p\//.test(p.images[1]) ? p.images[1].replace(/\.webp$/, '-s.webp') : p.images[1]) : '';
    var tag = p.availability === 'sold' ? '<span class="tag sold">Sold</span>' :
      p.status !== 'published' ? '<span class="tag draft">Draft preview</span>' :
      p.designer ? '<span class="tag orig">Cummings original</span>' :
      p.availability === 'reserved' ? '<span class="tag">Reserved</span>' :
      p.availability === 'made' ? '<span class="tag">Made to order</span>' :
      p.era ? '<span class="tag">' + esc(p.era) + '</span>' : '';
    var cover = CJD.cover(p);
    return '<a class="card rv" href="piece.html?p=' + encodeURIComponent(p.handle) + '">' +
      '<div class="ph"' + (opts.ratio ? ' style="aspect-ratio:' + opts.ratio + '"' : '') + '>' + tag +
      (cover ? '<img src="' + esc(cover) + '" alt="' + esc((p.alt && p.alt[0]) || p.title) + '" loading="lazy">' : '') +
      (alt ? '<img class="alt" src="' + esc(alt) + '" alt="" loading="lazy">' : '') + '</div>' +
      '<div class="meta"><div class="row"><span class="ref">' + esc(p.type) + (p.ref ? ' · ' + esc(p.ref) : '') + '</span></div>' +
      '<h3 class="t">' + esc(p.title) + '</h3><div class="m">' + esc(detailLine(p)) + '</div>' +
      '<div class="pr">' + esc(CJD.priceLabel(p)) + '</div></div></a>';
  }

  /* Real 10-frame sequence from their Design Process page. */
  var FRAMES = ['draw1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8', 'step9', 'finished'];
  var STAGES = [
    { n: '01', l: 'The sketch', from: 0, to: 0, c: 'Drawn by hand, with the stones laid right on the page — the center stone and its tapered side stones before a setting exists.' },
    { n: '02', l: 'The model', from: 1, to: 8, c: 'A wax model is shaped beside the drawing and refined, frame by frame, until every stone sits where the sketch put it.' },
    { n: '03', l: 'The finished ring', from: 9, to: 9, c: 'Brought into metal, set and finished — with the scrollwork from the drawing carried all the way around the band.' }
  ];
  function processMarkup() {
    return '<div class="proc">' +
      '<div class="proc-copy"><p class="eyebrow">From sketch to heirloom</p><h2 class="h2">One ring, <em>ten photographs.</em></h2>' +
      '<p class="lede" style="margin-top:20px">These are the real stages of one of our commissions — the same ring, start to finish. Drag through them.</p>' +
      '<ul class="proc-stages">' + STAGES.map(function (s, i) {
        return '<li><button type="button" data-stage="' + i + '" aria-pressed="' + (i === 0) + '"><span class="n">' + s.n + '</span><span class="l">' + s.l + '</span><span class="c">' + s.c + '</span></button></li>';
      }).join('') + '</ul>' +
      '<p style="margin-top:32px"><a class="btn" href="custom.html#consult">Tell us what you have in mind</a></p></div>' +
      '<div class="proc-view"><div class="proc-frame">' + FRAMES.map(function (f, i) {
        return '<img src="img/s/' + f + '.webp" alt="' + (i === 0 ? 'Pencil sketch of a three-stone ring with loose stones placed on the drawing' : i === 9 ? 'The finished three-stone ring with engraved scroll detail' : 'Wax model of the ring beside the sketch, stage ' + (i + 1)) + '"' + (i === 0 ? ' class="on"' : '') + ' loading="' + (i < 2 ? 'eager' : 'lazy') + '">';
      }).join('') + '</div>' +
      '<div class="proc-scrub"><label for="scrub">Step <span data-stepn>01</span> of 10</label><input id="scrub" type="range" min="0" max="9" step="1" value="0" aria-valuetext="Step 1 of 10"></div>' +
      '<div class="proc-ticks" role="group" aria-label="Jump to a step">' + FRAMES.map(function (f, i) {
        return '<button type="button" data-frame="' + i + '" style="background-image:url(img/s/' + f + '.webp)" aria-label="Step ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : '') + '></button>';
      }).join('') + '</div></div></div>';
  }
  function mountProcess(el) {
    el.innerHTML = processMarkup();
    var imgs = el.querySelectorAll('.proc-frame img');
    var range = el.querySelector('#scrub');
    var ticks = el.querySelectorAll('.proc-ticks button');
    var stages = el.querySelectorAll('[data-stage]');
    function go(i) {
      imgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
      ticks.forEach(function (t, k) { t.setAttribute('aria-current', String(k === i)); });
      range.value = i;
      range.setAttribute('aria-valuetext', 'Step ' + (i + 1) + ' of 10');
      el.querySelector('[data-stepn]').textContent = String(i + 1).padStart(2, '0');
      STAGES.forEach(function (s, k) { stages[k].setAttribute('aria-pressed', String(i >= s.from && i <= s.to)); });
    }
    range.addEventListener('input', function () { go(+range.value); });
    ticks.forEach(function (t) { t.addEventListener('click', function () { go(+t.dataset.frame); }); });
    stages.forEach(function (b) { b.addEventListener('click', function () { go(STAGES[+b.dataset.stage].from); }); });
  }

  /* Inquiry modal — prefilled with the piece name + reference. */
  function inquiry(opts) {
    opts = opts || {};
    var p = opts.piece;
    var wrap = document.createElement('div');
    wrap.className = 'modal';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'inq-t');
    wrap.innerHTML = '<div class="modal-box"><button class="modal-x" aria-label="Close">×</button>' +
      '<p class="eyebrow">' + (opts.eyebrow || 'Ask about this piece') + '</p><h2 class="display" id="inq-t" style="font-size:40px;margin-top:10px">' + (opts.title || 'We’d love to help.') + '</h2>' +
      (p ? '<div class="piece-chip">' + (CJD.cover(p) ? '<img src="' + esc(CJD.cover(p)) + '" alt="">' : '') + '<div><div class="ref">' + esc(p.ref || 'No reference yet') + '</div><div style="font:500 19px/1.2 var(--serif)">' + esc(p.title) + '</div><div style="font-size:13px;color:var(--ink-2)">' + esc(CJD.priceLabel(p)) + '</div></div></div>' : '<div style="height:18px"></div>') +
      '<form novalidate class="form-grid">' +
      '<div class="field"><label for="q-name">Name</label><input id="q-name" name="name" autocomplete="name" required><span class="err" hidden>Please add your name.</span></div>' +
      '<div class="field"><label for="q-phone">Phone <span style="font-weight:400">(optional)</span></label><input id="q-phone" name="phone" type="tel" autocomplete="tel"></div>' +
      '<div class="field full"><label for="q-email">Email</label><input id="q-email" name="email" type="email" autocomplete="email" required><span class="err" hidden>Please add an email we can reply to.</span></div>' +
      '<div class="field full"><label for="q-msg">Message</label><textarea id="q-msg" name="message">' + esc(opts.message || '') + '</textarea></div>' +
      '<div class="full" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><button class="btn" type="submit">Send</button><span class="demo-note">Concept demo — this saves to the staff dashboard in this browser. No email is sent.</span></div>' +
      '</form></div>';
    document.body.appendChild(wrap);
    var last = document.activeElement;
    var close = function () { wrap.remove(); document.removeEventListener('keydown', key); if (last) last.focus(); };
    var key = function (e) { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', key);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    wrap.querySelector('.modal-x').addEventListener('click', close);
    wrap.querySelector('#q-name').focus();
    wrap.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target, ok = true;
      var name = f.elements.name.value.trim(), email = f.email.value.trim();
      f.elements.name.nextElementSibling.hidden = !!name; if (!name) ok = false;
      var em = /.+@.+\..+/.test(email);
      f.email.nextElementSibling.hidden = em; if (!em) ok = false;
      if (!ok) { (name ? f.email : f.elements.name).focus(); return; }
      CJD.addInquiry({ kind: opts.kind || 'piece', piece: p ? p.handle : '', name: name, email: email, phone: f.phone.value.trim(), message: f.message.value.trim() });
      wrap.querySelector('.modal-box').innerHTML = '<button class="modal-x" aria-label="Close">×</button><div class="ok-box"><p class="eyebrow">Received</p><h2 class="display">Thank you, ' + esc(name.split(' ')[0]) + '.</h2><p class="lede">Your note is with our team' + (p ? ' — including the reference ' + esc(p.ref || '') : '') + '. We’ll reply by email or phone. Nothing is reserved or scheduled until we’ve spoken with you.</p><p class="demo-note" style="margin-top:18px">Demo: open the <a href="admin.html#inquiries">staff dashboard</a> to see it arrive.</p></div>';
      wrap.querySelector('.modal-x').addEventListener('click', close);
    });
  }

  /* reveal on scroll */
  function reveal(root) {
    var els = (root || document).querySelectorAll('.rv:not(.in)');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  window.SITE = { esc: esc, tel: tel, MAPS: MAPS, card: card, mountProcess: mountProcess, inquiry: inquiry, reveal: reveal, detailLine: detailLine };
})();
