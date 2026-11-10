(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const NAMES = { windows: 'Window cleaning', pressure: 'Pressure washing', housewash: 'House washing', gutters: 'Gutter clean out' };
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const summary = (on) => on.length === 0 ? 'Pick at least one service.' : on.length === 1 ? NAMES[on[0]] + ' selected.' : on.length + ' services selected. Bundled for the best deal.';

  /* menu drawer */
  const drawer = $('#drawer'), menuBtn = $('#menuBtn');
  if (drawer && menuBtn) {
    const open = (v) => {
      drawer.classList.toggle('open', v); drawer.setAttribute('aria-hidden', String(!v)); menuBtn.setAttribute('aria-expanded', String(v));
      document.body.style.overflow = v ? 'hidden' : '';
      if (v) $('.close', drawer).focus(); else menuBtn.focus();
    };
    menuBtn.addEventListener('click', () => open(true));
    $('.close', drawer).addEventListener('click', () => open(false));
    $('.scrim', drawer).addEventListener('click', () => open(false));
    $$('a', drawer).forEach(a => a.addEventListener('click', () => open(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) open(false); });
  }

  /* before / after house: drag the squeegee */
  $$('.sweep').forEach((w, i) => {
    const id = w.id || ('sweep' + i);
    w.insertAdjacentHTML('afterbegin', window.AHS.sweep(id));
    const rect = $('.cp', w), hndl = $('.hndl', w), grip = $('.grip', w);
    let pos = .12, used = false, drag = false;
    const geo = () => { const r = w.getBoundingClientRect(); const sc = Math.max(r.width / 1200, r.height / 640); const vis = r.width / sc; return { r, x0: (1200 - vis) / 2, vis }; };
    const set = (p) => {
      pos = Math.max(.02, Math.min(.98, p));
      const g = geo(); const x = Math.round(g.x0 + pos * g.vis);
      rect.setAttribute('x', String(x)); rect.setAttribute('width', String(Math.max(0, 1200 - x)));
      hndl.style.left = (pos * 100) + '%';
      grip.setAttribute('aria-valuenow', String(Math.round(pos * 100)));
    };
    const use = () => { if (!used) { used = true; w.classList.add('used'); } };
    const frac = (e) => { const g = geo(); return (e.clientX - g.r.left) / g.r.width; };
    /* touch handlers first; pointer events then ignore touch so nothing runs twice */
    w.addEventListener('touchstart', e => { drag = true; use(); set(frac(e.touches[0])); }, { passive: true });
    w.addEventListener('touchmove', e => { if (drag) set(frac(e.touches[0])); }, { passive: true });
    w.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') return; drag = true; use(); try { w.setPointerCapture(e.pointerId); } catch (_) {} set(frac(e)); });
    w.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; if (drag) set(frac(e)); });
    const stop = () => { drag = false; };
    ['pointerup', 'pointercancel', 'lostpointercapture', 'touchend', 'touchcancel'].forEach(ev => w.addEventListener(ev, stop));
    grip.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { use(); set(pos + .05); e.preventDefault(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { use(); set(pos - .05); e.preventDefault(); }
      if (e.key === 'Home') { use(); set(.02); e.preventDefault(); }
      if (e.key === 'End') { use(); set(.98); e.preventDefault(); }
    });
    window.addEventListener('resize', () => set(pos));
    set(.12);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) set(.5);
    else setTimeout(() => {
      const t0 = performance.now();
      const step = (t) => { if (used) return; const k = Math.min(1, (t - t0) / 1600); const e = 1 - Math.pow(1 - k, 3); set(.12 + (.5 - .12) * e); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, 500);
  });

  /* what we clean: diagram + picker */
  const clean = $('.clean');
  if (clean) {
    const dia = $('.diagram', clean), svgWrap = $('.diagram-svg', dia);
    svgWrap.innerHTML = window.AHS.diagram({ focus: 'windows' });
    const rows = $$('.srow', clean), adds = $$('.add', clean), sum = $('[data-sum]', clean), link = $('[data-quote-link]', clean);
    const pins = Object.entries(window.AHS.PINS).map(([s, [x, y]]) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pin'; b.dataset.s = s;
      b.style.left = (x / 1200 * 100) + '%'; b.style.top = (y / 640 * 100) + '%';
      b.innerHTML = PLUS + '<span class="sr">' + NAMES[s] + '</span>'; dia.appendChild(b); return b;
    });
    const select = (s, focusRow) => {
      rows.forEach(r => { const on = r.dataset.s === s; r.classList.toggle('active', on); $('.srow-btn', r).setAttribute('aria-expanded', String(on)); });
      pins.forEach(p => p.classList.toggle('active', p.dataset.s === s));
      const svg = $('svg', svgWrap); svg.setAttribute('data-focus', s); svg.innerHTML = window.AHS.scene({ focus: s });
      if (focusRow) { const r = rows.find(r => r.dataset.s === s); if (r && matchMedia('(max-width:900px)').matches) r.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    };
    const chosen = () => adds.filter(a => a.getAttribute('aria-pressed') === 'true').map(a => a.dataset.s);
    const update = () => {
      const on = chosen();
      sum.textContent = summary(on);
      link.href = 'quote.html' + (on.length ? '?s=' + on.join(',') : '');
      rows.forEach(r => r.classList.toggle('picked', on.includes(r.dataset.s)));
    };
    rows.forEach(r => $('.srow-btn', r).addEventListener('click', () => select(r.dataset.s)));
    pins.forEach(p => p.addEventListener('click', () => select(p.dataset.s, true)));
    adds.forEach(a => a.addEventListener('click', () => {
      const on = a.getAttribute('aria-pressed') !== 'true';
      a.setAttribute('aria-pressed', String(on)); a.innerHTML = (on ? CHECK + 'Added to quote' : PLUS + 'Add to quote'); update();
    }));
    select('windows'); update();
  }

  /* static focused diagrams (services page) */
  $$('[data-diagram]').forEach(el => { el.innerHTML = window.AHS.diagram({ focus: el.dataset.diagram }); });

  /* quote-form tiles */
  const preset = (new URLSearchParams(location.search).get('s') || '').split(',').filter(s => NAMES[s]);
  $$('[data-tiles]').forEach(box => {
    const tiles = $$('.tile', box), sum = $('[data-sum]', box), err = $('[data-err]', box);
    const selected = () => tiles.filter(t => t.getAttribute('aria-pressed') === 'true').map(t => t.dataset.s);
    const update = () => { const on = selected(); if (sum) sum.textContent = summary(on); if (err && on.length) err.hidden = true; };
    tiles.forEach(t => t.addEventListener('click', () => { t.setAttribute('aria-pressed', String(t.getAttribute('aria-pressed') !== 'true')); update(); }));
    preset.forEach(s => { const t = tiles.find(t => t.dataset.s === s); if (t) t.setAttribute('aria-pressed', 'true'); });
    update();
  });

  /* video: load the player only when asked */
  $$('.phone').forEach(ph => {
    const play = $('.play', ph); if (!play) return;
    play.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = ph.dataset.src + '?autoplay=true&preload=auto';
      f.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true; f.title = 'Affordable Home Services at work';
      ph.innerHTML = ''; ph.appendChild(f);
    });
  });

  /* phone bar: appears once the hero has scrolled away */
  const bar = $('.mbar'), hero = $('.hero');
  if (bar) {
    if (hero && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting), { threshold: 0, rootMargin: '-90px 0px 0px 0px' }).observe(hero);
    else bar.classList.add('show');
  }

  /* quote form (preview: sends nothing) */
  const form = $('#quoteForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const on = $$('.tile[aria-pressed="true"]', form), err = $('[data-err]', form);
      if (!on.length) { err.hidden = false; $('.tile', form).focus(); return; }
      if (!form.reportValidity()) return;
      form.hidden = true;
      const sent = $('#sent'); sent.hidden = false;
      $('#sentList').textContent = on.map(t => NAMES[t.dataset.s]).join(', ');
      $('h2', sent).focus();
      window.scrollTo({ top: sent.getBoundingClientRect().top + window.scrollY - 110, behavior: 'smooth' });
    });
  }
})();
