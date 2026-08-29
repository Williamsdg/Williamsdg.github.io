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

  /* ---------- Multi-step + validating forms ---------- */
  document.querySelectorAll('form[data-form]').forEach((form) => {
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
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
