(function () {
  const W = window.WJR; const $ = (s, r) => (r || document).querySelector(s); const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  /* menu drawer */
  const drawer = $('#drawer'), menuBtn = $('#menuBtn');
  if (drawer && menuBtn) {
    const open = (v) => { drawer.classList.toggle('open', v); drawer.setAttribute('aria-hidden', String(!v)); menuBtn.setAttribute('aria-expanded', String(v)); document.body.style.overflow = v ? 'hidden' : ''; if (v) $('.close', drawer).focus(); else menuBtn.focus(); };
    menuBtn.addEventListener('click', () => open(true));
    $('.close', drawer).addEventListener('click', () => open(false));
    $('.scrim', drawer).addEventListener('click', () => open(false));
    $$('a', drawer).forEach(a => a.addEventListener('click', () => open(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) open(false); });
  }

  /* "Do we take it?" lookup */
  const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const sing = s => s.replace(/(ches|shes|sses|xes)$/, m => m.slice(0, -2)).replace(/ies$/, 'y').replace(/s$/, '');
  function search(q) {
    q = norm(q); if (q.length < 2) return null;
    const qs = sing(q); const hits = [];
    W.take.forEach(c => c.items.forEach(it => {
      const name = it[0], keys = it.slice(1).concat([name]);
      let score = 0;
      keys.forEach(k => { const kn = norm(k), ks = sing(kn);
        if (kn === q || ks === qs) score = Math.max(score, 3);
        else if (kn.includes(q) || q.includes(kn) || ks.includes(qs) || qs.includes(ks)) score = Math.max(score, 2);
        else if (kn.split(' ').some(w => w.startsWith(qs) || qs.startsWith(w) && w.length > 3)) score = Math.max(score, 1);
      });
      if (score) hits.push({ name, cat: c.cat, href: c.href || ('services.html#' + c.slug), score });
    }));
    hits.sort((a, b) => b.score - a.score);
    const seen = new Set(); return hits.filter(h => !seen.has(h.name) && seen.add(h.name)).slice(0, 5);
  }
  $$('.lookup').forEach(box => {
    const input = $('input', box), out = $('.lookup-out', box); if (!input || !out) return;
    const render = () => {
      const q = input.value; if (norm(q).length < 2) { out.classList.remove('show'); out.innerHTML = ''; return; }
      const hits = search(q); out.classList.add('show');
      if (hits && hits.length) {
        out.innerHTML = '<p class="yes">Yes.</p><ul>' + hits.map(h => `<li><b>${h.name}</b><span><a href="${h.href}">${h.cat}</a></span></li>`).join('') + '</ul>';
      } else {
        out.innerHTML = `<p class="maybe">Probably.</p><p>We can take anything you got. <a href="sms:${W.tel}">Text us a picture</a> or call <a href="tel:${W.tel}">${W.phone}</a> and we can answer any questions you have.</p>`;
      }
    };
    input.addEventListener('input', render);
    $$('.try', box).forEach(b => b.addEventListener('click', () => { input.value = b.textContent; render(); input.focus(); }));
  });

  /* service-area map */
  $$('.map-wrap').forEach(el => {
    const cur = el.dataset.current || '', M = W.map;
    const counties = M.counties.map(c => `<path class="county${c.served ? ' served' : ''}" d="${c.d}"/>`).join('');
    const clabels = M.counties.filter(c => c.cx > 40 && c.cx < M.w - 40 && c.cy > 30 && c.cy < M.h - 30).map(c => `<text class="countylabel" x="${c.cx}" y="${c.cy}">${c.n}</text>`).join('');
    const lakes = M.lakes.map(l => `<ellipse class="lake" cx="${l.cx}" cy="${l.cy}" rx="${l.rx}" ry="${l.ry}" transform="rotate(${l.rot} ${l.cx} ${l.cy})"/>`).join('');
    const roads = M.roads.map(r => `<path class="road${r.major ? ' major' : ''}" d="${r.d}"/>`).join('');
    const rlabels = M.roads.filter(r => r.lx != null).map(r => `<text class="roadlabel" x="${r.lx}" y="${r.ly}" text-anchor="${r.anchor}">${r.n}</text>`).join('');
    const towns = W.towns.map(t => {
      const anchor = t.anchor || 'start', dx = t.dx != null ? t.dx : 10, dy = t.dy != null ? t.dy : 5, r = t.home ? 7 : 5;
      const cls = 'town' + (t.home ? ' home' : '') + (t.s === cur && !t.home ? ' current' : '');
      return `<a class="${cls}" href="town.html?t=${t.s}"><circle class="hit" cx="${t.x}" cy="${t.y}" r="30"/><circle class="dot" cx="${t.x}" cy="${t.y}" r="${r}"/><text x="${t.x + dx}" y="${t.y + dy}" text-anchor="${anchor}">${t.n}</text></a>`;
    }).join('');
    const sc = M.scale;
    el.innerHTML = `<svg viewBox="0 0 ${M.w} ${M.h}" role="img" aria-label="Map of the West Michigan lakeshore counties with the twenty towns Workman Junk Removal serves, from Ludington down to Grand Rapids">
      <rect class="water" width="${M.w}" height="${M.h}"/>${counties}${lakes}${roads}${clabels}${rlabels}
      <text class="lakelabel" transform="translate(${M.lakeLabel.x},${M.lakeLabel.y}) rotate(-90)">LAKE MICHIGAN</text>
      <g class="scale"><line x1="${sc.x}" y1="${sc.y}" x2="${sc.x + sc.len}" y2="${sc.y}"/><line x1="${sc.x}" y1="${sc.y - 5}" x2="${sc.x}" y2="${sc.y + 5}"/><line x1="${sc.x + sc.len}" y1="${sc.y - 5}" x2="${sc.x + sc.len}" y2="${sc.y + 5}"/><text x="${sc.x + sc.len / 2}" y="${sc.y - 9}" text-anchor="middle">${sc.label}</text></g>
      ${towns}</svg>`;
  });
  $$('.towns-list').forEach(ul => {
    const cur = ul.dataset.current || '';
    ul.innerHTML = W.towns.slice().sort((a, b) => a.n.localeCompare(b.n)).map(t => `<li><a href="town.html?t=${t.s}" class="${t.home ? 'home' : ''}"${t.s === cur ? ' aria-current="page"' : ''}>${t.n}</a></li>`).join('');
  });

  /* phone call bar: show once the hero buttons scroll away */
  const bar = $('#callbar'), heroBtns = $('.hero .btn-row, .page-hero .btn-row');
  if (bar && heroBtns && 'IntersectionObserver' in window) {
    new IntersectionObserver(es => es.forEach(e => bar.classList.toggle('show', !e.isIntersecting)), { threshold: 0 }).observe(heroBtns);
  } else if (bar) bar.classList.add('show');

  /* forms: concept only */
  $$('form.q').forEach(f => {
    f.addEventListener('submit', e => { e.preventDefault(); const n = $('.form-note', f); if (n) { n.classList.add('show'); n.focus(); } });
    const file = $('input[type=file]', f), thumbs = $('.thumbs', f);
    if (file && thumbs) file.addEventListener('change', () => { thumbs.innerHTML = ''; [...file.files].slice(0, 6).forEach(fl => { if (!fl.type.startsWith('image/')) return; const img = new Image(); img.alt = ''; img.src = URL.createObjectURL(fl); thumbs.appendChild(img); }); });
  });

  /* town page template */
  if (document.body.dataset.townPage !== undefined) {
    const slug = new URLSearchParams(location.search).get('t') || 'muskegon';
    const t = W.towns.find(x => x.s === slug) || W.towns.find(x => x.s === 'muskegon');
    $$('[data-town]').forEach(el => el.textContent = t.n);
    document.title = `${t.n} junk removal | Workman Junk Removal`;
    $$('.map-wrap').forEach(el => { el.dataset.current = t.s; });
    $$('.town-pick a').forEach(a => { if (a.dataset.s === t.s) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    $$('.map-wrap .town').forEach(a => a.classList.toggle('current', a.getAttribute('href').endsWith('=' + t.s) && t.s !== 'muskegon'));
  }
})();
