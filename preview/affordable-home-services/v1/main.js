(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const NAMES = { windows: 'Window cleaning', pressure: 'Pressure washing', housewash: 'House washing', gutters: 'Gutter clean out' };

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

  /* service tiles (hero card + quote form) */
  const preset = (new URLSearchParams(location.search).get('s') || '').split(',').filter(s => NAMES[s]);
  $$('[data-tiles]').forEach(box => {
    const tiles = $$('.tile', box);
    const sum = $('[data-sum]', box), link = $('[data-quote-link]', box), err = $('[data-err]', box);
    const selected = () => tiles.filter(t => t.getAttribute('aria-pressed') === 'true').map(t => t.dataset.s);
    const update = () => {
      const on = selected();
      if (sum) sum.textContent = on.length === 0 ? 'Pick at least one service.' : on.length === 1 ? NAMES[on[0]] + ' selected.' : on.length + ' services selected. Bundled for the best deal.';
      if (link) link.href = 'quote.html' + (on.length ? '?s=' + on.join(',') : '');
      if (err && on.length) err.hidden = true;
    };
    tiles.forEach(t => t.addEventListener('click', () => { t.setAttribute('aria-pressed', String(t.getAttribute('aria-pressed') !== 'true')); update(); }));
    preset.forEach(s => { const t = tiles.find(t => t.dataset.s === s); if (t) t.setAttribute('aria-pressed', 'true'); });
    update();
  });

  /* services index: tabs on desktop, accordion on phones */
  $$('.svc').forEach(svc => {
    const items = $$('.svc-item', svc);
    items.forEach(it => {
      const b = $('.svc-btn', it);
      b.addEventListener('click', () => {
        const phone = matchMedia('(max-width:900px)').matches;
        if (phone && it.classList.contains('active')) { it.classList.remove('active'); b.setAttribute('aria-expanded', 'false'); return; }
        items.forEach(x => { x.classList.remove('active'); $('.svc-btn', x).setAttribute('aria-expanded', 'false'); });
        it.classList.add('active'); b.setAttribute('aria-expanded', 'true');
      });
    });
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
    if (hero && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting), { threshold: 0 }).observe(hero);
    else bar.classList.add('show');
  }

  /* quote form (preview: sends nothing) */
  const form = $('#quoteForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const on = $$('.tile[aria-pressed="true"]', form);
      const err = $('[data-err]', form);
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
