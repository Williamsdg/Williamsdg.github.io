/* GiGi's concept — shared: catalog helpers, "her size" memory, bag drawer, menus, hours. */
(function () {
  document.documentElement.classList.add('js');
  const D = window.GG || { items: [], cdn: '' };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };

  const TINTS = ['var(--t-pink)', 'var(--t-sun)', 'var(--t-mint)', 'var(--t-sky)', 'var(--t-lilac)'];
  const tint = h => { let n = 0; for (const c of h) n = (n * 31 + c.charCodeAt(0)) >>> 0; return TINTS[n % TINTS.length]; };
  const img = (src, w) => (/^https?:/.test(src) ? src : D.cdn + src) + '?width=' + w;
  const money = n => '$' + (Math.round(n * 100) % 100 ? n.toFixed(2) : n.toFixed(0));
  const byHandle = Object.fromEntries(D.items.map(i => [i.h, i]));

  const CATS = { tops: 'Tops', bottoms: 'Skirts, shorts & pants', dresses: 'Dresses & rompers', sets: 'Sets', denim: 'Denim', pajamas: 'Pajamas', outerwear: 'Coats & vests', accessories: 'Socks & bows', more: 'More' };
  const DEPTS = { tween: 'Tween', junior: 'Ladies & juniors' };
  const SIZES = {
    tween: [
      { lbl: 'Numbered', chips: ['7', '8', '10', '12', '14', '16'].map(v => ({ v, t: v })) },
      { lbl: 'Lettered', chips: ['XS', 'S', 'M', 'L', 'XL'].map(v => ({ v, t: v })) }
    ],
    junior: [
      { lbl: 'Juniors', chips: [['J-XS', 'XS', '00'], ['J-S', 'S', '0–2'], ['J-M', 'M', '4–6'], ['J-L', 'L', '8–10'], ['J-XL', 'XL', '']].map(([v, t, s]) => ({ v, t, s })) },
      { lbl: 'Jeans waist', chips: ['24', '25', '26', '27', '28', '29', '30'].map(n => ({ v: 'W' + n, t: n })) }
    ]
  };
  const sizeText = v => v.startsWith('J-') ? 'Juniors ' + v.slice(2) : v.startsWith('W') ? 'Waist ' + v.slice(1) : v;

  // ---- her size --------------------------------------------------------
  const SIZE_KEY = 'gg_size_v1';
  const getSize = () => store.get(SIZE_KEY, { d: 'tween', s: [] });
  const setSize = v => { store.set(SIZE_KEY, v); document.dispatchEvent(new CustomEvent('gg:size', { detail: v })); paintPills(); };
  const fits = (item, sizes) => !sizes.length || item.z.some(z => z.a && z.n.some(n => sizes.includes(n)));
  const fitLabels = (item, sizes) => item.z.filter(z => z.a && z.n.some(n => sizes.includes(n))).map(z => z.l);
  const countFor = sizes => D.items.filter(i => fits(i, sizes)).length;

  function paintPills() {
    const { s } = getSize();
    $$('[data-size-pill]').forEach(el => {
      const b = el.querySelector('b');
      if (b) b.textContent = s.length ? s.map(v => v.replace(/^J-/, 'Jr ')).join(', ') : 'Pick';
      el.classList.toggle('is-empty', !s.length);
    });
  }

  // Picker renders the same control in the hero and in the size sheet.
  function picker(root, opts = {}) {
    let st = getSize();
    const go = $('[data-go]', root), segBtns = $$('.seg button', root), groups = $('[data-groups]', root);
    function draw() {
      segBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.d === st.d)));
      groups.innerHTML = SIZES[st.d].map(g => `<div class="chip-group"><p class="lbl">${g.lbl}</p><div class="chips">${g.chips.map(c =>
        `<button type="button" class="chip" data-v="${c.v}" aria-pressed="${st.s.includes(c.v)}">${c.t}${c.s ? ` <small>${c.s}</small>` : ''}</button>`).join('')}</div></div>`).join('');
      const n = countFor(st.s);
      if (go) go.textContent = st.s.length ? `See ${n} ${n === 1 ? 'piece' : 'pieces'} in her size` : `Browse all ${D.items.length} pieces`;
    }
    root.addEventListener('click', e => {
      const seg = e.target.closest('.seg button');
      if (seg) { if (seg.dataset.d !== st.d) { st = { d: seg.dataset.d, s: [] }; setSize(st); draw(); } return; }
      const chip = e.target.closest('.chip[data-v]');
      if (chip) {
        const v = chip.dataset.v;
        st = { d: st.d, s: st.s.includes(v) ? st.s.filter(x => x !== v) : [...st.s, v] };
        setSize(st); draw();
      }
    });
    if (go) go.addEventListener('click', e => {
      if (opts.onGo) { e.preventDefault(); opts.onGo(st); return; }
      go.href = 'shop.html' + (st.s.length ? '?d=' + st.d + '&s=' + encodeURIComponent(st.s.join(',')) : '');
    });
    document.addEventListener('gg:size', e => { if (e.detail !== st) { st = e.detail; draw(); } });
    draw();
  }
  const PICKER_HTML = `<div class="seg" role="group" aria-label="Department">
      <button type="button" data-d="tween">Tween <small>sizes 7–16</small></button>
      <button type="button" data-d="junior">Juniors <small>00 to XL</small></button>
    </div>
    <div data-groups></div>
    <p class="hint">Some brands size by number and some by letter. Pick both if you're not sure.</p>
    <div class="go"><a class="btn btn-sun" data-go href="shop.html">Browse</a></div>`;

  // ---- tiles -----------------------------------------------------------
  function tile(i, o = {}) {
    const f = o.sizes && o.sizes.length ? fitLabels(i, o.sizes) : [];
    return `<a class="tile" href="product.html?h=${encodeURIComponent(i.h)}">
      <div class="ph" style="--t:${tint(i.h)}">${i.cp ? '<span class="flag">Sale</span>' : ''}<img loading="lazy" decoding="async" src="${img(i.i[0][0], 520)}" alt="${esc(i.t)}" width="${i.i[0][1]}" height="${i.i[0][2]}"></div>
      <p class="nm">${esc(i.t)}</p><p class="br">${esc(i.v)}</p>
      <p class="pr">${money(i.p)}${i.cp ? `<s>${money(i.cp)}</s>` : ''}</p>
      ${f.length ? `<p class="fits">In stock in ${esc(f.join(', '))}</p>` : ''}
    </a>`;
  }

  // ---- bag -------------------------------------------------------------
  const BAG_KEY = 'gg_bag_v1';
  const getBag = () => store.get(BAG_KEY, []);
  function setBag(b) { store.set(BAG_KEY, b); paintBag(); }
  function addToBag(h, l) {
    const b = getBag(); const x = b.find(r => r.h === h && r.l === l);
    if (x) x.q++; else b.push({ h, l, q: 1 });
    setBag(b);
  }
  function paintBag() {
    const b = getBag(), n = b.reduce((a, r) => a + r.q, 0);
    $$('[data-bag-count]').forEach(el => { el.textContent = n; el.hidden = !n; });
    const list = $('#bag-list'); if (!list) return;
    let total = 0;
    list.innerHTML = b.map((r, k) => {
      const it = byHandle[r.h] || (r.h === 'gift' ? { t: "GiGi's gift card", v: 'Gift card', p: +r.l, i: [['', 0, 0]] } : null);
      if (!it) return '';
      total += it.p * r.q;
      const th = it.i[0][0] ? `<img src="${img(it.i[0][0], 160)}" alt="">` : '<span class="hand" style="display:grid;place-items:center;height:100%;font-size:20px">gift</span>';
      return `<li><div class="th" style="background:${tint(r.h)}">${th}</div>
        <div><p class="nm" style="margin:0">${esc(it.t)}</p><p class="meta" style="margin:2px 0 0">${r.h === 'gift' ? money(+r.l) + ' card' : 'Size ' + esc(r.l)} · Qty ${r.q}</p>
        <button class="rm" data-rm="${k}">Remove</button></div><b>${money(it.p * r.q)}</b></li>`;
    }).join('');
    $('#bag-empty').hidden = !!b.length;
    $('#bag-foot').hidden = !b.length;
    $('#bag-total').textContent = money(total);
  }

  // ---- drawers / sheet / toast -----------------------------------------
  let lastFocus = null;
  function openLayer(el) { lastFocus = document.activeElement; el.classList.add('open'); el.removeAttribute('inert'); document.body.style.overflow = 'hidden'; const f = el.querySelector('[data-focus]') || el.querySelector('button,a,input'); f && f.focus({ preventScroll: true }); }
  function closeLayer(el) { el.classList.remove('open'); el.setAttribute('inert', ''); document.body.style.overflow = ''; lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); }
  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200); }

  // ---- hours (America/Chicago) ------------------------------------------
  const HOURS = [null, [9.5, 17], [9.5, 17], [9.5, 17], [9.5, 17], [9.5, 17], [10, 17]]; // Sun..Sat
  function nowCentral() {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date()).map(x => [x.type, x.value]));
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
    return { day, t: (+p.hour % 24) + (+p.minute) / 60 };
  }
  function paintHours() {
    const { day, t } = nowCentral();
    $$('[data-hours] tr').forEach(tr => { const [a, b = a] = tr.dataset.day.split('-').map(Number); tr.classList.toggle('today', day >= a && day <= b); });
    $$('[data-open-now]').forEach(el => {
      const h = HOURS[day]; const fmt = x => { const hh = Math.floor(x), mm = Math.round((x - hh) * 60); return (hh % 12 || 12) + (mm ? ':' + String(mm).padStart(2, '0') : '') + (hh < 12 ? ' am' : ' pm'); };
      let txt, open = false;
      if (h && t >= h[0] && t < h[1]) { open = true; txt = 'Open now until ' + fmt(h[1]); }
      else {
        let d = day, k = 0;
        if (h && t < h[0]) txt = 'Closed now. Opens today at ' + fmt(h[0]);
        else { do { d = (d + 1) % 7; k++; } while (!HOURS[d] && k < 7); txt = 'Closed now. Opens ' + (k === 1 ? 'tomorrow' : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d]) + ' at ' + fmt(HOURS[d][0]); }
      }
      el.classList.toggle('closed', !open); el.querySelector('span').textContent = txt;
    });
  }

  // ---- boot ------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const menu = $('#menu'), bag = $('#bag'), sheet = $('#size-sheet');
    [menu, bag, sheet].forEach(l => l && l.setAttribute('inert', ''));
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-open],[data-close],[data-rm],[data-checkout],[data-search-toggle]');
      if (!t) return;
      if (t.dataset.open) { e.preventDefault(); const l = $('#' + t.dataset.open); if (t.dataset.open === 'bag') paintBag(); openLayer(l); }
      else if (t.hasAttribute('data-close')) closeLayer(t.closest('.drawer-wrap,.sheet-wrap'));
      else if (t.dataset.rm) { const b = getBag(); b.splice(+t.dataset.rm, 1); setBag(b); }
      else if (t.hasAttribute('data-checkout')) toast("Checkout isn't connected in this concept. On the live site this opens Shopify checkout.");
      else if (t.hasAttribute('data-search-toggle')) { const s = $('#search-bar'); s.hidden = !s.hidden; if (!s.hidden) $('input', s).focus(); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('.drawer-wrap.open,.sheet-wrap.open').forEach(closeLayer); });
    const sp = $('#size-sheet .picker');
    if (sp) picker(sp, { onGo: st => { location.href = 'shop.html' + (st.s.length ? '?d=' + st.d + '&s=' + encodeURIComponent(st.s.join(',')) : ''); } });
    $$('form[data-demo]').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); toast(f.dataset.demo); f.reset(); }));
    paintPills(); paintBag(); paintHours();
  });

  window.GGX = { D, $, $$, esc, img, money, tint, tile, byHandle, CATS, DEPTS, SIZES, sizeText, getSize, setSize, fits, fitLabels, countFor, picker, PICKER_HTML, addToBag, toast, openLayer, closeLayer, paintHours };
})();
