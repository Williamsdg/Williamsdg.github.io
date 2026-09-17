/* ============================================================
   Southern Roots — site behaviour
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Header: transparent over hero, solid on scroll ---------- */
  const hdr = document.querySelector('.hdr');
  if (hdr && !hdr.classList.contains('hdr--static')) {
    const onScroll = () => hdr.classList.toggle('is-solid', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealables = document.querySelectorAll('.rv');
  if (revealables.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en, i) => {
          if (!en.isIntersecting) return;
          setTimeout(() => en.target.classList.add('is-in'), (i % 4) * 90);
          io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealables.forEach((el) => io.observe(el));
    } else {
      revealables.forEach((el) => el.classList.add('is-in'));
    }
  }

  /* ---------- Hero montage ---------- */
  const shots = document.querySelectorAll('.hero__media img');
  if (shots.length > 1) {
    let i = 0;
    shots[0].classList.add('is-on');
    setInterval(() => {
      shots[i].classList.remove('is-on');
      i = (i + 1) % shots.length;
      shots[i].classList.add('is-on');
    }, 6000);
  } else if (shots.length === 1) {
    shots[0].classList.add('is-on');
  }

  /* ---------- Roster filtering ---------- */
  const grid = document.querySelector('[data-roster]');
  if (grid) {
    const cards = Array.from(grid.querySelectorAll('[data-athlete]'));
    const chips = Array.from(document.querySelectorAll('.chip'));
    const search = document.querySelector('[data-search]');
    const empty = document.querySelector('[data-empty]');
    const state = { sport: 'all', level: 'all', q: '' };

    function apply() {
      let shown = 0;
      cards.forEach((c) => {
        const okSport = state.sport === 'all' || c.dataset.sport === state.sport;
        const okLevel = state.level === 'all' || c.dataset.level === state.level;
        const okQ = !state.q || c.dataset.search.includes(state.q);
        const show = okSport && okLevel && okQ;
        c.hidden = !show;
        if (show) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const group = chip.dataset.group;
        chips.filter((c) => c.dataset.group === group)
             .forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        state[group] = chip.dataset.value;
        apply();
      });
    });

    if (search) {
      search.addEventListener('input', () => {
        state.q = search.value.trim().toLowerCase();
        apply();
      });
    }
  }

  /* ---------- Tabs (contact page) ---------- */
  const tablist = document.querySelector('[data-tabs]');
  if (tablist) {
    const tabs = Array.from(tablist.querySelectorAll('button'));
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));

    function select(tab) {
      tabs.forEach((t, idx) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (panels[idx]) panels[idx].hidden = !on;
      });
    }
    tabs.forEach((t) => t.addEventListener('click', () => select(t)));
    tablist.addEventListener('keydown', (e) => {
      const idx = tabs.indexOf(document.activeElement);
      if (idx < 0) return;
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); next.focus(); select(next); }
    });

    const hash = location.hash.replace('#', '');
    const preset = hash && tabs.find((t) => t.dataset.tab === hash);
    if (preset) select(preset);
  }

  /* ---------- Submission store ----------
     Demo persistence only. In the production build `save()` posts to
     the Supabase table + the notification/confirmation email function;
     the staff dashboard reads the same records back. Swapping the two
     lines marked below is the entire integration seam.              */
  const STORE_KEY = 'sr_submissions';

  function save(record) {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch (e) { list = []; }
    record.id = 'sub_' + Date.now().toString(36);
    record.received = new Date().toISOString();
    record.status = 'new';
    list.unshift(record);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) {}
    return record;
  }

  /* ---------- Multi-step + validating forms ----------
     Exported as window.SR.bindForm so the Apply popup can bind a fresh
     copy of the athlete form after each successful submission. */
  function bindForm(form) {
    const steps = Array.from(form.querySelectorAll('[data-step]'));
    const markers = Array.from(form.parentElement.querySelectorAll('.fstep'));
    const back = form.querySelector('[data-back]');
    const next = form.querySelector('[data-next]');
    const submit = form.querySelector('[data-submit]');
    const done = document.getElementById(form.dataset.done);
    let at = 0;

    function paint() {
      steps.forEach((s, i) => { s.hidden = i !== at; });
      markers.forEach((m, i) => {
        m.classList.toggle('is-on', i === at);
        m.classList.toggle('is-done', i < at);
      });
      if (back) back.hidden = at === 0;
      if (next) next.hidden = at >= steps.length - 1;
      if (submit) submit.hidden = at < steps.length - 1;
    }

    function validate(scope) {
      let ok = true;
      scope.querySelectorAll('[required]').forEach((el) => {
        const wrap = el.closest('.field') || el.closest('.check');
        const msg = wrap && wrap.querySelector('.err');
        let bad = !el.value.trim();
        if (el.type === 'checkbox') bad = !el.checked;
        if (!bad && el.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value);
        el.setAttribute('aria-invalid', String(bad));
        if (msg) msg.hidden = !bad;
        if (bad && ok) { el.focus(); ok = false; }
      });
      return ok;
    }

    if (steps.length) paint();

    if (next) next.addEventListener('click', () => {
      if (!validate(steps[at])) return;
      at = Math.min(at + 1, steps.length - 1);
      paint();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    if (back) back.addEventListener('click', () => {
      at = Math.max(at - 1, 0);
      paint();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const scope = steps.length ? steps[at] : form;
      if (!validate(scope)) return;

      const data = { type: form.dataset.form, fields: {} };
      new FormData(form).forEach((v, k) => { data.fields[k] = v; });
      data.name = data.fields.athlete_name || data.fields.company || data.fields.name || 'Unnamed';

      /* --- production: await postToSupabase(data) --- */
      save(data);
      /* --- production: await sendNotification(data) + sendConfirmation(data) --- */

      form.hidden = true;
      const rail = form.parentElement.querySelector('.fsteps');
      if (rail) rail.hidden = true;
      if (done) {
        done.hidden = false;
        done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.dispatchEvent(new CustomEvent('sr:submitted', { bubbles: true, detail: data }));
    });
  }

  document.querySelectorAll('form[data-form]').forEach(bindForm);
  window.SR = window.SR || {};
  window.SR.bindForm = bindForm;

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();

/* ============================================================
   v2 — header, menu overlay, scroll reveals, parallax
   ============================================================ */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: transparent at top, solid once scrolled ---------- */
  var top = document.querySelector('.sr-top');
  if (top && !top.classList.contains('sr-top--static')) {
    var paint = function () { top.classList.toggle('is-solid', window.scrollY > 40); };
    paint();
    window.addEventListener('scroll', paint, { passive: true });
  }

  /* ---------- Menu overlay ---------- */
  var btn = document.querySelector('.sr-menu-btn');
  var menu = document.getElementById('sr-menu');
  if (btn && menu) {
    var setOpen = function (open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      root.classList.toggle('menu-open', open);
      if (top) top.classList.toggle('is-menu', open);
      if (open) {
        var first = menu.querySelector('a');
        if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 350);
      } else {
        btn.focus({ preventScroll: true });
      }
    };
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
      /* keep focus inside the open menu */
      if (e.key === 'Tab' && menu.classList.contains('is-open')) {
        var f = [btn].concat(Array.prototype.slice.call(menu.querySelectorAll('a')));
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ---------- Hero intro ---------- */
  var hero = document.querySelector('.h-hero, .h3-hero');
  if (hero) {
    var go = function () { requestAnimationFrame(function () { hero.classList.add('is-loaded'); }); };
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go);
    setTimeout(go, 1800); /* never wait forever on a slow image */
  }

  /* ---------- Word split ---------- */
  document.querySelectorAll('[data-words]').forEach(function (el) {
    var n = 0;
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span'); w.className = 'w';
            var inner = document.createElement('span'); inner.textContent = part;
            inner.style.setProperty('--i', n++);
            w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1) { walk(c); }
      });
    };
    walk(el);
  });

  /* ---------- Stagger groups ---------- */
  document.querySelectorAll('[data-stagger]').forEach(function (g) {
    g.querySelectorAll('[data-reveal]').forEach(function (el, i) { el.style.setProperty('--i', i); });
  });

  /* ---------- Reveal on scroll ---------- */
  var targets = document.querySelectorAll('[data-reveal],[data-words]');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Parallax ---------- */
  var layers = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (layers.length && !reduce) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      layers.forEach(function (el) {
        var box = (el.parentElement || el).getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var offset = (box.top + box.height / 2 - vh / 2) * speed;
        el.style.translate = '0 ' + offset.toFixed(1) + 'px';
      });
      ticking = false;
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
})();

/* ============================================================
   Apply popup + sticky "Apply Today" button
   Every "Apply" link on the site opens the athlete application in a
   popup instead of navigating away. Links keep their contact.html#apply
   href, so the page still works without JavaScript, and cmd/ctrl-click
   still opens the contact page in a new tab.
   ============================================================ */
(function () {
  'use strict';
  if (!window.SR || typeof window.SR.bindForm !== 'function') {
    throw new Error('Apply popup: window.SR.bindForm is missing — site.js form module did not load');
  }

  function field(id, label, opts) {
    opts = opts || {};
    var req = opts.required ? ' required' : '';
    var star = opts.required ? ' <span class="req">*</span>' : '';
    var control;
    if (opts.textarea) {
      control = '<textarea id="ap-' + id + '" name="' + id + '" placeholder="' + (opts.ph || '') + '"' + req + '></textarea>';
    } else {
      control = '<input type="' + (opts.type || 'text') + '" id="ap-' + id + '" name="' + id + '" placeholder="' + (opts.ph || '') + '"' +
        (opts.auto ? ' autocomplete="' + opts.auto + '"' : '') + req + '>';
    }
    return '<div class="field"><label for="ap-' + id + '">' + label + star + '</label>' + control +
      '<span class="err" hidden>' + (opts.type === 'email' ? 'Enter a valid email address.' : 'This field is required.') + '</span></div>';
  }

  function formMarkup() {
    return '' +
      '<div class="fsteps" aria-hidden="true"><div class="fstep is-on">1. Athlete</div><div class="fstep">2. Sport</div><div class="fstep">3. Goals</div></div>' +
      '<form class="form" data-form="athlete" data-done="ap-done" novalidate>' +
        '<div data-step>' +
          '<div class="fgroup">' + field('athlete_name', 'Athlete full name', { required: true, auto: 'name' }) +
                                   field('athlete_email', 'Athlete email', { required: true, type: 'email', auto: 'email' }) + '</div>' +
          '<div class="fgroup">' + field('athlete_phone', 'Athlete phone', { type: 'tel', auto: 'tel' }) +
                                   field('guardian', 'Parent or guardian name', { ph: 'Required if under 18' }) + '</div>' +
          '<div class="fgroup">' + field('guardian_email', 'Parent or guardian email', { type: 'email' }) +
                                   field('guardian_phone', 'Parent or guardian phone', { type: 'tel' }) + '</div>' +
        '</div>' +
        '<div data-step hidden>' +
          '<div class="fgroup">' + field('school', 'School, club or program', { required: true }) +
                                   field('sport', 'Sport', { required: true }) + '</div>' +
          '<div class="fgroup">' + field('position', 'Position or event') +
                                   field('grad_year', 'Graduation year', { ph: 'e.g. 2028' }) + '</div>' +
          '<div class="fgroup">' + field('instagram', 'Instagram handle', { ph: '@username' }) +
                                   field('tiktok', 'TikTok handle', { ph: '@username' }) + '</div>' +
          '<div class="fgroup fgroup--1">' + field('highlights', 'Highlight film or profile link', { type: 'url', ph: 'https://' }) + '</div>' +
        '</div>' +
        '<div data-step hidden>' +
          '<div class="fgroup fgroup--1">' + field('achievements', 'Current achievements and honors', { textarea: true, ph: 'Awards, records, all-conference selections, academic honors…' }) + '</div>' +
          '<div class="fgroup fgroup--1">' + field('goals', 'What do you want representation to do for you?', { textarea: true, required: true, ph: 'Tell us about your goals for the next season and beyond.' }) + '</div>' +
          '<div class="check"><input type="checkbox" id="ap-consent" name="consent" required>' +
            '<label for="ap-consent">I confirm the information above is accurate and I consent to Southern Roots contacting me about representation. If the athlete is under 18, a parent or guardian has reviewed and approved this submission. <span class="req">*</span>' +
            '<span class="err" hidden>Please confirm to continue.</span></label></div>' +
        '</div>' +
        '<div class="formnav">' +
          '<button type="button" class="btn btn--outline" data-back hidden>Back</button>' +
          '<button type="button" class="btn btn--dark" data-next>Continue</button>' +
          '<button type="submit" class="btn btn--primary" data-submit hidden>Submit application</button>' +
        '</div>' +
      '</form>' +
      '<div class="done" id="ap-done" hidden tabindex="-1">' +
        '<h3>Application received</h3>' +
        '<p>Thank you &mdash; your application is with the Southern Roots team. A confirmation is on its way to your inbox, and someone from the team will follow up with you personally.</p>' +
        '<button type="button" class="btn btn--primary" data-apply-close>Done</button>' +
      '</div>';
  }

  /* ---------- build the dialog once ---------- */
  var logo = document.querySelector('.sr-top__logo img, .hdr__logo img');
  var logoSrc = logo ? logo.getAttribute('src') : 'assets/logo-mark.jpg';

  var dlg = document.createElement('dialog');
  dlg.className = 'ap';
  dlg.setAttribute('aria-labelledby', 'ap-title');
  dlg.innerHTML =
    '<div class="ap__panel">' +
      '<header class="ap__head">' +
        '<img src="' + logoSrc + '" alt="">' +
        '<div><p class="ap__kicker">Southern Roots Sports Management Group</p><h2 id="ap-title" tabindex="-1">Apply for Representation</h2></div>' +
        '<button type="button" class="ap__close" data-apply-close aria-label="Close application">&times;</button>' +
      '</header>' +
      '<div class="ap__body">' +
        '<p class="ap__intro">Three short steps. Only the starred fields are required &mdash; send what you have and we\'ll follow up for the rest.</p>' +
        '<div class="ap__form"></div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(dlg);

  var host = dlg.querySelector('.ap__form');
  var submitted = false;

  function fresh() {
    host.innerHTML = formMarkup();
    window.SR.bindForm(host.querySelector('form'));
    submitted = false;
  }
  fresh();

  host.addEventListener('sr:submitted', function () { submitted = true; });

  var opener = null;
  function openApply(from) {
    opener = from || document.activeElement;
    if (submitted) fresh();
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    document.documentElement.classList.add('ap-open');
    dlg.querySelector('.ap__body').scrollTop = 0;
    var t = dlg.querySelector('#ap-title'); if (t) t.focus({ preventScroll: true });
  }
  function closeApply() {
    if (dlg.open) { if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open'); }
  }
  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('ap-open');
    if (submitted) fresh();              /* next open starts clean */
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  });

  /* close on backdrop click — typed answers are kept until submission */
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) closeApply();
    if (e.target.closest('[data-apply-close]')) closeApply();
  });

  /* ---------- every Apply link opens the popup ---------- */
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('[data-apply], a[href$="contact.html#apply"]');
    if (!a || dlg.contains(a)) return;
    e.preventDefault();
    /* if the menu overlay is open, let it close first */
    var menu = document.getElementById('sr-menu');
    var menuBtn = document.querySelector('.sr-menu-btn');
    if (menu && menu.classList.contains('is-open') && menuBtn) menuBtn.click();
    /* a link inside the (now closed) menu is hidden — return focus to the menu button instead */
    openApply(menu && menu.contains(a) ? menuBtn : a);
  });

  window.SR.openApply = openApply;
})();

/* ============================================================
   v3 hero spotlight — rotates the featured athletes
   ============================================================ */
(function () {
  'use strict';
  var spot = document.querySelector('.h3-spot');
  if (!spot) return;
  var slides = Array.prototype.slice.call(spot.querySelectorAll('.h3-slide'));
  var dots = Array.prototype.slice.call(spot.querySelectorAll('.h3-nav button'));
  var cap = spot.querySelector('.h3-cap');
  var capSport = cap.querySelector('[data-cap="sport"]');
  var capName = cap.querySelector('[data-cap="name"]');
  var capInfo = cap.querySelector('[data-cap="info"]');
  var capLink = cap.querySelector('a');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DUR = 5500, at = 0, timer = null, paused = false;
  spot.style.setProperty('--dur', DUR + 'ms');

  function show(i, user) {
    if (i === at && slides[i].classList.contains('is-on')) return;
    var prev = slides[at];
    slides.forEach(function (s) { s.classList.remove('is-out'); });
    prev.classList.remove('is-on'); prev.classList.add('is-out');
    at = (i + slides.length) % slides.length;
    var s = slides[at];
    s.classList.add('is-on');
    slides.forEach(function (x, k) { x.setAttribute('aria-hidden', String(k !== at)); });
    dots.forEach(function (d, k) {
      d.setAttribute('aria-current', String(k === at));
      /* restart the progress bar animation */
      var bar = d.querySelector('i'); bar.style.display = 'none'; void bar.offsetWidth; bar.style.display = '';
    });
    cap.classList.add('is-swapping');
    setTimeout(function () {
      capSport.textContent = s.dataset.sport;
      capName.textContent = s.dataset.name;
      capInfo.textContent = s.dataset.info;
      capLink.setAttribute('href', s.dataset.href);
      capLink.setAttribute('aria-label', 'View ' + s.dataset.name + "'s profile");
      cap.classList.remove('is-swapping');
    }, 320);
    if (user) restart();
  }
  function tick() { if (!paused) show(at + 1); }
  function restart() { clearInterval(timer); if (!reduce) timer = setInterval(tick, DUR); }

  dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k, true); }); });
  var pause = function () { paused = true; spot.classList.add('is-paused'); };
  var resume = function () { paused = false; spot.classList.remove('is-paused'); };
  spot.addEventListener('mouseenter', pause);
  spot.addEventListener('mouseleave', resume);
  spot.addEventListener('focusin', pause);
  spot.addEventListener('focusout', resume);
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else resume(); });
  restart();
})();

/* ============================================================
   About — words light up and "Better." fills as the reader scrolls
   ============================================================ */
(function () {
  'use strict';
  var el = document.querySelector('[data-scrub]');
  if (!el) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fill = document.querySelector('.ab-better');

  var words = [];
  el.childNodes.forEach(function (n) {
    if (n.nodeType !== 3) return;
    var frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
      var w = document.createElement('span'); w.className = 'sw'; w.textContent = part;
      words.push(w); frag.appendChild(w);
    });
    el.replaceChild(frag, n);
  });

  if (reduce) {
    words.forEach(function (w) { w.classList.add('is-lit'); });
    if (fill) fill.style.setProperty('--fill', 1);
    return;
  }

  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    /* statement: lit from when its top reaches 85% of the viewport
       until its bottom reaches 45% */
    var r = el.getBoundingClientRect();
    var start = vh * 0.85, end = vh * 0.45;
    var p = (start - r.top) / ((start - end) + r.height);
    p = Math.max(0, Math.min(1, p));
    var lit = Math.round(p * words.length);
    words.forEach(function (w, i) { w.classList.toggle('is-lit', i < lit); });
    if (fill) {
      var fr = fill.getBoundingClientRect();
      var q = (vh * 0.9 - fr.top) / (vh * 0.9 - vh * 0.35);
      fill.querySelector('.ab-better__fill').style.setProperty('--fill', Math.max(0, Math.min(1, q)).toFixed(3));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
