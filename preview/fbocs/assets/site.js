(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const F = window.FBOCS, now = new Date(), yr = F.year(now);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Menu
  const mb = $('.menu-btn'), menu = $('.menu');
  if (mb) mb.addEventListener('click', () => { const o = menu.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });

  if (innerWidth < 1000) $$('details.toc').forEach(d => { d.open = false; });
  $$('[data-year]').forEach(n => n.textContent = yr.label);

  // Home: next few dates
  const up = $('[data-upcoming]');
  if (up) {
    const next = yr.events.filter(e => F.daysUntil(e.date, now) >= 0).slice(0, 4);
    up.innerHTML = next.map(e => `<li><time datetime="${e.date.toISOString().slice(0, 10)}">${F.short(e.date)}<small>${e.date.getFullYear()}</small></time><div><b>${esc(e.title)}</b><span>${F.rel(e.date, now)}</span></div></li>`).join('')
      || '<li><time></time><div><b>This school year is complete.</b><span>The new year begins July 1.</span></div></li>';
  }
  $$('[data-reg]').forEach(n => { const r = F.registration(now); n.innerHTML = `<b><span class="dot${r.open ? ' on' : ''}"></span>${r.open ? 'Registration is open' : 'Registration is closed'}</b>${esc(r.text)}`; });

  // Calendar: the whole year
  const ag = $('[data-agenda]');
  if (ag) {
    let marked = false;
    ag.innerHTML = yr.events.map(e => {
      const n = F.daysUntil(e.date, now), past = n < 0, isNext = !past && !marked; if (isNext) marked = true;
      const kind = e.kind === 'meeting' ? 'Mandatory meeting' : e.kind === 'registration' ? 'Registration' : 'Deadline';
      return `<li class="${past ? 'past' : ''}${isNext ? ' next' : ''}"><time datetime="${e.date.toISOString().slice(0, 10)}">${F.short(e.date)}<small>${e.date.getFullYear()}</small></time><div><b>${esc(e.title)}</b><span>${esc(e.detail)}</span><br><span class="tag">${kind}${isNext ? ', ' + F.rel(e.date, now) : ''}</span></div></li>`;
    }).join('');
  }

  // Fee calculator
  $$('[data-calc]').forEach(c => {
    const draw = () => {
      const type = $('input[name=type]:checked', c).value, hs = +$('input[name=hs]:checked', c).value, firstYear = $('input[name=first]', c).checked;
      $('[data-hs]', c).hidden = type === 'associate';
      const f = F.fees({ type, firstYear, hs });
      $('[data-sum]', c).innerHTML = f.lines.map(l => `<div><span>${l[0]}</span><span>$${l[1]}</span></div>`).join('') + `<div class="tot"><span>Total</span><span>$${f.total}</span></div><p>Checks are payable to First Baptist Church Opelika. Forms and fees are due by June 30.</p>`;
    };
    c.addEventListener('change', draw); draw();
  });

  // Handbook search
  const find = $('.find');
  if (find) {
    const secs = $$('.prose section'), note = $('.find-note');
    const clear = () => $$('.prose mark').forEach(m => m.replaceWith(document.createTextNode(m.textContent)));
    find.addEventListener('input', () => {
      clear(); $('.prose').normalize();
      const q = find.value.trim().toLowerCase(); let hits = 0;
      secs.forEach(s => {
        const has = !q || s.textContent.toLowerCase().includes(q); s.hidden = !has;
        if (q.length > 1 && has) {
          const w = document.createTreeWalker(s, NodeFilter.SHOW_TEXT), nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
          nodes.forEach(t => {
            const i = t.nodeValue.toLowerCase().indexOf(q); if (i < 0) return;
            const m = t.splitText(i); m.splitText(q.length); const k = document.createElement('mark'); k.textContent = m.nodeValue; m.replaceWith(k); hits++;
          });
        }
      });
      note.textContent = !q ? '' : hits ? `Found in ${secs.filter(s => !s.hidden).length} section${secs.filter(s => !s.hidden).length === 1 ? '' : 's'}.` : (q.length > 1 ? 'Nothing in the handbook matches that. Try a shorter word.' : '');
    });
  }

  // GPA calculator. Starts with the worked example from the page: 3.25 unweighted, 3.42 weighted.
  const g = $('[data-gpa]');
  if (g) {
    const example = [['A', 1, ''], ['A', 1, 'college'], ['A', .5, ''], ['A', .5, ''], ['B', 1, ''], ['B', .5, ''], ['C', 1, ''], ['C', .5, '']];
    const rows = $('[data-rows]', g);
    const opt = (v, t, s) => `<option value="${v}"${v === s ? ' selected' : ''}>${t}</option>`;
    const row = (gr = 'A', cr = 1, ty = '', name = '') => `<div class="gpa-row"><input class="wide" type="text" aria-label="Course name" placeholder="Course" value="${esc(name)}"><select aria-label="Credit">${opt('1', '1', String(cr))}${opt('0.5', '½', String(cr))}</select><select aria-label="Grade">${['A', 'B', 'C', 'D', 'F'].map(x => opt(x, x, gr)).join('')}</select><select class="wide" aria-label="Course type">${opt('', 'Standard', ty)}${opt('honors', 'Honors or advanced', ty)}${opt('college', 'Dual enrollment, AP or IB', ty)}</select></div>`;
    const draw = () => {
      const cs = $$('.gpa-row', rows).map(r => { const s = $$('select', r); return { credit: s[0].value, grade: s[1].value, type: s[2].value }; });
      const r = F.gpa(cs);
      $('[data-out]', g).innerHTML = `<div><b>${r.credits}</b>credits</div><div><b>${r.unweighted === null ? '–' : r.unweighted.toFixed(2)}</b>unweighted GPA</div><div><b>${r.weighted === null ? '–' : r.weighted.toFixed(2)}</b>weighted GPA${r.weighted === null ? ' (no weighted courses)' : ''}</div>`;
    };
    const load = list => { rows.innerHTML = list.map(e => row(...e)).join(''); draw(); };
    g.addEventListener('change', draw);
    g.addEventListener('click', e => {
      const a = e.target.closest('[data-g]'); if (!a) return;
      if (a.dataset.g === 'add') { rows.insertAdjacentHTML('beforeend', row()); draw(); }
      if (a.dataset.g === 'clear') load([['A', 1, '']]);
      if (a.dataset.g === 'example') load(example);
    });
    load(example);
  }
})();
