/* The Pink Tulip concept — vanilla JS. Data in window.PT (data.js). */
(function(){
  const PT = window.PT || {products:[],occasions:[],edits:[],reviews:[]};
  const P = PT.products;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const money = n => '$' + (Math.round(n*100)/100).toFixed(n%1?2:0);
  const img = (src, w) => src + (src.includes('?') ? '&' : '?') + 'width=' + w;
  const byHandle = Object.fromEntries(P.map(p => [p.h, p]));
  const OCC = Object.fromEntries(PT.occasions.map(o => [o.id, o.l]));
  const KIND_LABEL = {dress:'Dresses',top:'Tops',layer:'Layers',bottom:'Bottoms',set:'Sets',jewelry:'Jewelry',accessory:'Accessories',other:'Other'};

  /* ---------- helpers ---------- */
  function fitLine(p){
    if (!p.meas) return '';
    const len = p.meas.rows.find(r => /length/i.test(r[0]));
    const who = p.meas.model ? `model is ${p.meas.model}` : 'size small';
    const parts = [];
    if (len) parts.push(`Length ${len[1]}`);
    parts.push(p.meas.model ? `${who} in a ${(p.meas.size||'small').toLowerCase()}` : 'measured on a small');
    return parts.join(', ');
  }
  function tile(p, opts={}){
    const alt = p.imgs[1] ? `<img class="alt" src="${img(p.imgs[1],600)}" alt="" loading="lazy">` : '';
    const tag = p.sale ? '<span class="tag sale">Sale</span>' : (p.best ? '<span class="tag">Best seller</span>' : '');
    const price = p.cp ? `<span class="price"><s>${money(p.cp)}</s>${money(p.p)}</span>` : `<span class="price">${money(p.p)}</span>`;
    const sw = p.colors.length > 1 ? `<div class="sw">${p.colors.slice(0,6).map(c => `<i style="background:${c.h}" title="${esc(c.n)}"></i>`).join('')}</div>` : '';
    const fl = opts.noFit ? '' : (fitLine(p) ? `<div class="fitline">${esc(fitLine(p))}</div>` : '');
    return `<a class="tile" href="product.html?h=${encodeURIComponent(p.h)}">
      <div class="ph"><img src="${img(p.imgs[0],600)}" alt="${esc(p.t)}" loading="${opts.eager?'eager':'lazy'}" width="600" height="900">${alt}${tag}</div>
      <div class="meta"><div class="row"><b>${esc(p.t)}</b>${price}</div>${fl}${sw}</div></a>`;
  }
  function toast(msg){
    let t = $('.toast'); if (!t){ t = document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove('show'), 2600);
  }
  function seeded(n){ let s = n; return () => { s = (s*9301+49297)%233280; return s/233280; }; }
  function params(){ return new URLSearchParams(location.search); }

  /* ---------- bag ---------- */
  const BAG_KEY = 'pt_bag_v1';
  const bag = { get(){ try { return JSON.parse(localStorage.getItem(BAG_KEY)||'[]'); } catch(e){ return []; } },
    set(items){ try { localStorage.setItem(BAG_KEY, JSON.stringify(items)); } catch(e){} this.render(); },
    add(h, color, size){ const items = this.get(); const k = items.find(i => i.h===h && i.c===color && i.s===size); if (k) k.q++; else items.push({h, c:color, s:size, q:1}); this.set(items); },
    remove(i){ const items = this.get(); items.splice(i,1); this.set(items); },
    render(){
      const items = this.get(); const n = items.reduce((a,i)=>a+i.q,0);
      $$('[data-bag-count]').forEach(el => { el.textContent = n; el.hidden = !n; });
      const body = $('[data-bag-body]'); if (!body) return;
      if (!items.length){ body.innerHTML = '<p class="bag-empty">Your bag is empty. Everything you add shows up here, ready for pickup or shipping.</p>'; $('[data-bag-total]').textContent = money(0); return; }
      let total = 0;
      body.innerHTML = items.map((i, idx) => { const p = byHandle[i.h]; if (!p) return ''; total += p.p*i.q;
        return `<div class="bag-item"><img src="${img(p.imgs[0],200)}" alt=""><div><div class="t">${esc(p.t)}</div><div class="v">${esc([i.c, i.s].filter(Boolean).join(', '))}${i.q>1?` × ${i.q}`:''}</div><button class="rm" type="button" data-rm="${idx}">Remove</button></div><div>${money(p.p*i.q)}</div></div>`; }).join('');
      $('[data-bag-total]').textContent = money(total);
      $$('[data-rm]', body).forEach(b => b.addEventListener('click', () => bag.remove(+b.dataset.rm)));
    } };

  /* ---------- drawers ---------- */
  let lastFocus = null;
  function openLayer(id){ const w = document.getElementById(id); if (!w) return; lastFocus = document.activeElement; w.classList.add('open'); document.body.style.overflow='hidden'; const f = $('[data-focus]', w) || $('button, a, input', w); f && f.focus(); }
  function closeLayers(){ $$('.drawer-wrap.open').forEach(w => w.classList.remove('open')); document.body.style.overflow=''; lastFocus && lastFocus.focus && lastFocus.focus(); }
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]'); if (o){ e.preventDefault(); openLayer(o.dataset.open); if (o.dataset.open==='bag') bag.render(); return; }
    if (e.target.closest('[data-close]')) { closeLayers(); return; }
    const st = e.target.closest('[data-search-toggle]'); if (st){ const sb = $('#search-bar'); sb.hidden = !sb.hidden; if (!sb.hidden) $('input', sb).focus(); }
  });
  document.addEventListener('keydown', e => { if (e.key==='Escape') { closeLayers(); const f = $('.filters.open'); if (f){ f.classList.remove('open'); document.body.style.overflow=''; } } });
  $$('[data-demo-checkout]').forEach(b => b.addEventListener('click', () => toast('Checkout would open here. This is a design concept, not a live store.')));
  const nl = $('[data-newsletter]'); if (nl) nl.addEventListener('submit', e => { e.preventDefault(); toast('Thanks. You would be on the list. (Concept only, nothing was sent.)'); e.target.reset(); });
  $$('[data-demo-form]').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); toast('Message noted. This concept does not send anything yet.'); f.reset(); }));

  /* nav current */
  const page = (location.pathname.split('/').pop() || 'index.html');
  $$('.nav a, .drawer nav a').forEach(a => { const href = a.getAttribute('href').split('?')[0]; if (href === page && !location.search && !a.getAttribute('href').includes('?')) a.setAttribute('aria-current','page'); });

  /* ---------- outfit stylist ---------- */
  const DRESSY = new Set(['wedding','work','holiday','date','thanksgiving','photos']);
  function pickOutfit(occ, n){
    const pool = P.filter(p => p.occ.includes(occ));
    const rnd = seeded(n*7919 + occ.length*31 + 11);
    const pick = (list, exclude=[]) => { const l = list.filter(p => !exclude.includes(p)); return l.length ? l[Math.floor(rnd()*l.length)] : null; };
    const dresses = pool.filter(p => p.k==='dress'), sets = pool.filter(p => p.k==='set');
    const tops = pool.filter(p => p.k==='top'), bottoms = pool.filter(p => p.k==='bottom'), layers = pool.filter(p => p.k==='layer');
    const jewelry = P.filter(p => p.k==='jewelry');
    const pieces = [];
    const useDress = dresses.length && (DRESSY.has(occ) ? rnd() < .7 : rnd() < .3);
    if (useDress){ pieces.push({role:'The dress', p:pick(dresses)}); const l = pick(layers); if (l && rnd() < .6) pieces.push({role:'The layer', p:l}); }
    else if (occ==='wfh' && sets.length && rnd() < .5){ pieces.push({role:'The set', p:pick(sets)}); const l = pick(layers); if (l) pieces.push({role:'The layer', p:l}); }
    else { const t = pick(tops) || pick(layers); if (t) pieces.push({role:'The top', p:t}); const b = pick(bottoms) || pick(P.filter(p=>p.k==='bottom')); if (b) pieces.push({role:'The bottom', p:b}); if (pieces.length < 3){ const l = pick(layers, [t]); if (l) pieces.push({role:'The layer', p:l}); } }
    if (pieces.length < 3){ const j = pick(jewelry); if (j) pieces.push({role:'The finishing touch', p:j}); }
    return { pieces: pieces.filter(x => x.p).slice(0,3), count: pool.length };
  }
  const stylist = $('[data-stylist]');
  if (stylist){
    const chips = $('[data-chips]', stylist), out = $('[data-outfit]', stylist), empty = $('[data-empty]', stylist);
    let current = null, n = 0;
    chips.innerHTML = PT.occasions.map(o => `<button class="chip" type="button" data-occ="${o.id}" aria-pressed="false">${esc(o.l)}</button>`).join('');
    function render(){
      const { pieces, count } = pickOutfit(current, n);
      const total = pieces.reduce((a,x)=>a+x.p.p,0);
      out.hidden = false; empty.hidden = true;
      out.innerHTML = pieces.map(x => `<div><div class="role">${esc(x.role)}</div>${tile(x.p)}</div>`).join('') +
        `<div class="note"><h3>For ${esc(OCC[current].toLowerCase())}</h3>
          <p class="small quiet" style="margin:0">${pieces.length} pieces, picked from the ${count} we tagged for this. Every one is in stock today.</p>
          <div class="tot"><span>The whole outfit</span><b>${money(total)}</b></div>
          <div class="ready"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 4l9 5.5V20H3z"/><path d="M9 20v-6h6v6"/></svg><span>Local to Birmingham? Pick it up free in about two hours at Homewood or Hoover.</span></div>
          <div class="acts"><button class="btn tulip" type="button" data-add-all>Add all ${pieces.length} to bag</button><button class="btn ghost" type="button" data-another>Show me another</button><a class="link small" href="shop.html?occ=${current}">See all ${count} pieces for ${esc(OCC[current].toLowerCase())}</a></div></div>`;
      $('[data-add-all]', out).addEventListener('click', () => { pieces.forEach(x => bag.add(x.p.h, x.p.colors[0] ? x.p.colors[0].n : '', x.p.as[0] || '')); toast(`${pieces.length} pieces added to your bag`); });
      $('[data-another]', out).addEventListener('click', () => { n++; render(); });
    }
    chips.addEventListener('click', e => { const b = e.target.closest('[data-occ]'); if (!b) return; $$('[data-occ]', chips).forEach(x => x.setAttribute('aria-pressed', String(x===b))); current = b.dataset.occ; n = 0; render(); });
    const pre = params().get('occ'); const first = (pre && OCC[pre]) ? pre : PT.occasions[0].id; const fb = $(`[data-occ="${first}"]`, chips); if (fb) fb.click();
  }

  /* ---------- homepage ---------- */
  const heroFig = $('[data-hero-figure]');
  if (heroFig){
    const h = heroFig.dataset.handle; const p = byHandle[h] || P.find(x => x.k==='dress' && x.meas && x.fit) || P[0];
    heroFig.innerHTML = `<a class="ph" href="product.html?h=${encodeURIComponent(p.h)}"><img src="${img(p.imgs[0],900)}" alt="${esc(p.t)}" width="900" height="1350" fetchpriority="high"></a>
      <figcaption><span><b>${esc(p.t)}</b>${p.fit ? `<span class="fit">${esc(p.fit)}${p.meas && p.meas.model ? `, she is ${esc(p.meas.model)}` : ''}</span>` : (fitLine(p) ? `<span class="fit">${esc(fitLine(p))}</span>`:'')}</span><span>${money(p.p)}</span></figcaption>`;
  }
  const drop = $('[data-rail="new"]'); if (drop) drop.innerHTML = P.slice(0,10).map((p,i) => tile(p,{eager:i<3})).join('');
  const edits = $('[data-edits]');
  if (edits) edits.innerHTML = PT.edits.filter(e => !['sale','best-sellers'].includes(e.id)).slice(0,7).map(e => { const ps = e.hs.map(h => byHandle[h]).filter(Boolean);
    return `<li><a href="shop.html?edit=${e.id}"><span class="t">${esc(e.t)}</span><span class="n">${ps.length} pieces</span><span class="thumbs">${ps.slice(0,3).map(p => `<img src="${img(p.imgs[0],160)}" alt="" loading="lazy">`).join('')}</span></a></li>`; }).join('');
  const fitcard = $('[data-fitcard]');
  if (fitcard){ const heroH = heroFig ? heroFig.dataset.handle : ''; const p = byHandle[fitcard.dataset.handle] || P.find(x => x.meas && x.meas.model==="5'6" && x.meas.rows.length >= 2 && x.fit && x.h!==heroH) || P.find(x => x.meas && x.meas.rows.length >= 2 && x.h!==heroH) || P.find(x => x.meas);
    fitcard.innerHTML = `<a class="ph" href="product.html?h=${encodeURIComponent(p.h)}"><img src="${img(p.imgs[0],600)}" alt="${esc(p.t)}" loading="lazy"></a><div><h3>${esc(p.t)}</h3><div class="model">${esc(p.fit || 'Measured on a size small')}${p.meas.model ? `, and she is ${esc(p.meas.model)}.` : '.'}</div>
      <table class="meas"><tbody>${p.meas.rows.map(r => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table>
      ${p.fabric ? `<div class="small quiet">${esc(p.fabric)}</div>` : ''}<p style="margin:14px 0 0"><a class="link small" href="product.html?h=${encodeURIComponent(p.h)}">See this piece</a></p></div>`; }
  const revs = $('[data-reviews]');
  if (revs) revs.innerHTML = PT.reviews.filter(r => r.b.length > 30).slice(0,3).map(r => `<blockquote class="quote">${esc(r.b)}${r.n ? `<cite>${esc(r.n)}, verified review</cite>`:''}</blockquote>`).join('');

  /* ---------- shop ---------- */
  const shop = $('[data-shop]');
  if (shop){
    const q = params();
    const state = { k: q.get('k') || '', sub: q.get('sub') || '', occ: q.get('occ') || '', edit: q.get('edit') || '', sizes: (q.get('s')||'').split(',').filter(Boolean), colors: (q.get('c')||'').split(',').filter(Boolean), price: q.get('p') || '', sale: q.get('sale')==='1', neu: q.get('new')==='1', q: q.get('q') || '', sort: q.get('sort') || 'new', show: 24 };
    const grid = $('[data-grid]'), nEl = $('[data-n]'), title = $('[data-shop-title]'), sub = $('[data-shop-sub]'), chipsEl = $('[data-active]'), moreWrap = $('[data-more-wrap]');
    const colorNames = {}; P.forEach(p => p.colors.forEach(c => { const key = c.n.toLowerCase().split(' ')[0]; colorNames[key] = colorNames[key] || {n:c.n.split(' ')[0], h:c.h, count:0}; colorNames[key].count++; }));
    const topColors = Object.values(colorNames).sort((a,b)=>b.count-a.count).slice(0,14);
    const sizeList = ['XS','S','M','L','XL'];
    const subsFor = k => { const m = {}; P.filter(p => !k || p.k===k).forEach(p => m[p.sub] = (m[p.sub]||0)+1); return Object.entries(m).sort((a,b)=>b[1]-a[1]).filter(x=>x[1]>=3); };
    function renderFilters(){
      const f = $('[data-fbody]');
      f.innerHTML = `
        <div class="fgroup"><h4>Category</h4>${['','dress','top','layer','bottom','set','jewelry','accessory'].map(k => `<label><input type="radio" name="k" value="${k}" ${state.k===k?'checked':''}> ${k ? KIND_LABEL[k] : 'Everything'}</label>`).join('')}</div>
        ${state.k ? `<div class="fgroup"><h4>Type</h4>${subsFor(state.k).map(([s,n]) => `<label><input type="checkbox" name="sub" value="${esc(s)}" ${state.sub===s?'checked':''}> ${esc(s)} <span class="quiet small">${n}</span></label>`).join('')}</div>` : ''}
        <div class="fgroup"><h4>Occasion</h4>${PT.occasions.map(o => `<label><input type="radio" name="occ" value="${o.id}" ${state.occ===o.id?'checked':''}> ${esc(o.l)}</label>`).join('')}${state.occ?`<label><input type="radio" name="occ" value=""> Any occasion</label>`:''}</div>
        <div class="fgroup"><h4>Size</h4><div class="sizes">${sizeList.map(s => `<button type="button" data-size="${s}" aria-pressed="${state.sizes.includes(s)}">${s}</button>`).join('')}</div><p class="small quiet" style="margin:8px 0 0">Shows only pieces in stock in that size.</p></div>
        <div class="fgroup"><h4>Color</h4><div class="colors">${topColors.map(c => `<button type="button" data-color="${esc(c.n.toLowerCase())}" aria-pressed="${state.colors.includes(c.n.toLowerCase())}" aria-label="${esc(c.n)}" title="${esc(c.n)}" style="background:${c.h}"></button>`).join('')}</div></div>
        <div class="fgroup"><h4>Price</h4>${[['','Any price'],['30','Under $30'],['40','Under $40'],['50','Under $50'],['75','Under $75']].map(([v,l]) => `<label><input type="radio" name="p" value="${v}" ${state.price===v?'checked':''}> ${l}</label>`).join('')}</div>
        <div class="fgroup"><label><input type="checkbox" name="sale" ${state.sale?'checked':''}> On sale</label><label><input type="checkbox" name="new" ${state.neu?'checked':''}> Thursday's drop (newest 24)</label></div>`;
      $$('input', f).forEach(i => i.addEventListener('change', () => { if (i.name==='k'){ state.k = i.value; state.sub=''; renderFilters(); } else if (i.name==='sub'){ state.sub = i.checked ? i.value : ''; $$('input[name=sub]', f).forEach(x => { if (x!==i) x.checked=false; }); } else if (i.name==='occ') state.occ = i.value; else if (i.name==='p') state.price = i.value; else if (i.name==='sale') state.sale = i.checked; else if (i.name==='new') state.neu = i.checked; apply(); }));
      $$('[data-size]', f).forEach(b => b.addEventListener('click', () => { const s=b.dataset.size; state.sizes = state.sizes.includes(s) ? state.sizes.filter(x=>x!==s) : [...state.sizes, s]; b.setAttribute('aria-pressed', String(state.sizes.includes(s))); apply(); }));
      $$('[data-color]', f).forEach(b => b.addEventListener('click', () => { const c=b.dataset.color; state.colors = state.colors.includes(c) ? state.colors.filter(x=>x!==c) : [...state.colors, c]; b.setAttribute('aria-pressed', String(state.colors.includes(c))); apply(); }));
    }
    function matches(p){
      if (state.edit){ const e = PT.edits.find(x => x.id===state.edit); if (!e || !e.hs.includes(p.h)) return false; }
      if (state.neu && P.indexOf(p) >= 24) return false;
      if (state.k && p.k !== state.k) return false;
      if (state.sub && p.sub !== state.sub) return false;
      if (state.occ && !p.occ.includes(state.occ)) return false;
      if (state.sizes.length && !state.sizes.some(s => p.as.includes(s))) return false;
      if (state.colors.length && !p.colors.some(c => state.colors.includes(c.n.toLowerCase().split(' ')[0]))) return false;
      if (state.price && p.p >= +state.price) return false;
      if (state.sale && !p.sale) return false;
      if (state.q){ const hay = (p.t+' '+p.sub+' '+p.tags.join(' ')+' '+p.colors.map(c=>c.n).join(' ')).toLowerCase(); if (!state.q.toLowerCase().split(/\s+/).every(w => hay.includes(w))) return false; }
      return true;
    }
    let results = [];
    function apply(push=true){
      results = P.filter(matches);
      if (state.sort==='low') results.sort((a,b)=>a.p-b.p); else if (state.sort==='high') results.sort((a,b)=>b.p-a.p);
      state.show = 24; draw();
      const e = PT.edits.find(x => x.id===state.edit);
      title.textContent = state.q ? `Results for “${state.q}”` : e ? e.t : state.neu ? "Thursday's drop" : state.occ ? `For ${OCC[state.occ].toLowerCase()}` : state.k ? (state.sub || KIND_LABEL[state.k]) : 'Everything in the shop';
      sub.textContent = state.occ && !state.q ? 'Pieces Letty and Hadley tagged for this occasion. Mix them with the stylist on the home page.' : state.neu ? 'The newest pieces in the shop.' : e ? 'One of our edits, pulled straight from the racks.' : 'Hand-picked, personally tried on, and in stock today.';
      const chips = [];
      if (state.k) chips.push(['k', state.sub || KIND_LABEL[state.k]]); if (state.occ) chips.push(['occ', OCC[state.occ]]); if (state.edit) chips.push(['edit', (e||{}).t||'Edit']);
      state.sizes.forEach(s => chips.push(['s:'+s, 'Size '+s])); state.colors.forEach(c => chips.push(['c:'+c, c[0].toUpperCase()+c.slice(1)])); if (state.price) chips.push(['p','Under $'+state.price]); if (state.sale) chips.push(['sale','On sale']); if (state.neu) chips.push(['new',"Thursday's drop"]); if (state.q) chips.push(['q','“'+state.q+'”']);
      chipsEl.innerHTML = chips.map(([k,l]) => `<button class="chip" type="button" data-clear="${esc(k)}">${esc(l)} <span aria-hidden="true">×</span><span class="sr">remove</span></button>`).join('') + (chips.length>1 ? '<button class="chip" type="button" data-clear="all">Clear all</button>' : '');
      $$('[data-clear]', chipsEl).forEach(b => b.addEventListener('click', () => { const k=b.dataset.clear; if (k==='all'){ Object.assign(state,{k:'',sub:'',occ:'',edit:'',sizes:[],colors:[],price:'',sale:false,neu:false,q:''}); } else if (k==='k'){ state.k=''; state.sub=''; } else if (k.startsWith('s:')) state.sizes = state.sizes.filter(x=>x!==k.slice(2)); else if (k.startsWith('c:')) state.colors = state.colors.filter(x=>x!==k.slice(2)); else if (k==='sale') state.sale=false; else if (k==='new') state.neu=false; else state[k]=''; renderFilters(); apply(); }));
      if (push){ const u = new URLSearchParams(); if (state.k) u.set('k',state.k); if (state.sub) u.set('sub',state.sub); if (state.occ) u.set('occ',state.occ); if (state.edit) u.set('edit',state.edit); if (state.sizes.length) u.set('s',state.sizes.join(',')); if (state.colors.length) u.set('c',state.colors.join(',')); if (state.price) u.set('p',state.price); if (state.sale) u.set('sale','1'); if (state.neu) u.set('new','1'); if (state.q) u.set('q',state.q); if (state.sort!=='new') u.set('sort',state.sort); history.replaceState(null,'', 'shop.html' + (u.toString()?'?'+u:'')); }
    }
    function draw(){
      nEl.textContent = `${results.length} piece${results.length===1?'':'s'}`;
      grid.innerHTML = results.length ? results.slice(0,state.show).map((p,i)=>tile(p,{eager:i<4})).join('') : '';
      $('[data-noresults]').hidden = !!results.length;
      moreWrap.hidden = results.length <= state.show;
      $('[data-more]').textContent = `Show ${Math.min(24, results.length-state.show)} more`;
    }
    $('[data-more]').addEventListener('click', () => { state.show += 24; draw(); });
    $('[data-sort]').value = state.sort; $('[data-sort]').addEventListener('change', e => { state.sort = e.target.value; apply(); });
    $$('[data-open-filters]').forEach(b => b.addEventListener('click', () => { $('[data-filters]').classList.add('open'); document.body.style.overflow='hidden'; }));
    $$('[data-close-filters]').forEach(b => b.addEventListener('click', () => { $('[data-filters]').classList.remove('open'); document.body.style.overflow=''; }));
    $('[data-reset]').addEventListener('click', () => { Object.assign(state,{k:'',sub:'',occ:'',edit:'',sizes:[],colors:[],price:'',sale:false,neu:false,q:''}); renderFilters(); apply(); });
    renderFilters(); apply(false);
  }

  /* ---------- product page ---------- */
  const pdp = $('[data-pdp]');
  if (pdp){
    const h = params().get('h'); const p = byHandle[h];
    if (!p){ pdp.innerHTML = '<div style="padding:60px 0"><h1>We couldn’t find that piece.</h1><p class="quiet">It may have sold out. <a class="link" href="shop.html">Browse everything in stock</a>.</p></div>'; }
    else {
      document.title = `${p.t} — The Pink Tulip`;
      let color = p.colors[0] ? p.colors[0].n : '', size = '';
      const availFor = c => { const key = Object.keys(p.av).find(k => k.toLowerCase().replace('combo',' combo') === c.toLowerCase()) || Object.keys(p.av)[0]; return p.av[key] || []; };
      const crumbKind = KIND_LABEL[p.k] || 'Shop';
      pdp.innerHTML = `
        <div class="gallery"><div class="thumbs" data-thumbs></div><div class="main"><img data-main src="${img(p.imgs[0],1000)}" alt="${esc(p.t)}" width="1000" height="1500" fetchpriority="high"></div></div>
        <div class="buy">
          <div class="crumbs"><a href="shop.html">Shop</a> / <a href="shop.html?k=${p.k}">${esc(crumbKind)}</a> / <a href="shop.html?k=${p.k}&sub=${encodeURIComponent(p.sub)}">${esc(p.sub)}</a></div>
          <h1>${esc(p.t)}</h1>
          <div class="price">${p.cp?`<s>${money(p.cp)}</s>`:''}${money(p.p)}</div>
          ${p.occ.length ? `<p class="small quiet" style="margin:6px 0 0">Good for ${p.occ.map(o => `<a class="link" href="shop.html?occ=${o}">${esc(OCC[o].toLowerCase())}</a>`).join(', ')}.</p>` : ''}
          ${p.colors.length ? `<div class="lbl"><b>Color</b><span class="quiet" data-color-name>${esc(color)}</span></div><div class="swatches" data-swatches>${p.colors.map(c => `<button type="button" data-c="${esc(c.n)}" aria-pressed="${c.n===color}"><i style="background:${c.h}"></i>${esc(c.n)}</button>`).join('')}</div>` : ''}
          ${p.sizes.length ? `<div class="lbl"><b>Size</b><span class="quiet" data-size-hint>Pick a size</span></div><div class="sizes-row" data-sizes></div>` : ''}
          <button class="btn tulip add" type="button" data-add>Add to bag</button>
          <div class="ready"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 4l9 5.5V20H3z"/><path d="M9 20v-6h6v6"/></svg><span>Free pickup in about two hours at Homewood or Hoover, or $8 flat UPS shipping (free over $125).</span></div>
          ${p.meas ? `<div class="fitbox"><h3>Fit notes</h3><div class="model">${esc(p.fit || 'Measured on a size small')}${p.meas.model ? `, and she is ${esc(p.meas.model)}.` : '.'}</div><table class="meas"><tbody>${p.meas.rows.map(r => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table></div>` : (p.fit ? `<div class="fitbox"><h3>Fit notes</h3><div class="model">${esc(p.fit)}.</div></div>` : '')}
          <div class="acc">
            ${p.details.length ? `<details open><summary>Details</summary><div class="in"><ul>${p.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div></details>` : ''}
            ${p.fabric ? `<details><summary>Fabric</summary><div class="in">${esc(p.fabric)}</div></details>` : ''}
            <details><summary>Shipping and returns</summary><div class="in">Orders ship UPS within 24 to 48 hours on weekdays, $8 flat and free over $125. Returns are for store credit within 14 days of delivery, and you can drop them at either store if you are local.</div></details>
          </div>
          ${p.desc.length ? `<div class="pdp-desc">${p.desc.map(d => `<p>${esc(d)}</p>`).join('')}</div>` : ''}
        </div>`;
      const thumbs = $('[data-thumbs]', pdp), main = $('[data-main]', pdp);
      thumbs.innerHTML = p.imgs.map((s,i) => `<button type="button" data-i="${i}" ${i===0?'aria-current="true"':''}><img src="${img(s,160)}" alt="View ${i+1}" loading="lazy"></button>`).join('');
      thumbs.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; main.src = img(p.imgs[+b.dataset.i],1000); $$('[data-i]', thumbs).forEach(x => x.removeAttribute('aria-current')); b.setAttribute('aria-current','true'); });
      function drawSizes(){ const el = $('[data-sizes]', pdp); if (!el) return; const av = availFor(color); el.innerHTML = p.sizes.map(s => `<button type="button" data-s="${esc(s)}" class="${av.includes(s)?'':'out'}" aria-pressed="${size===s}" ${av.includes(s)?'':'aria-label="'+esc(s)+' sold out"'}>${esc(s)}</button>`).join('');
        $$('[data-s]', el).forEach(b => b.addEventListener('click', () => { if (b.classList.contains('out')) { toast(`${b.dataset.s} is sold out in ${color || 'this color'}. Text us at (205) 540-8088 and we’ll check the stores.`); return; } size = b.dataset.s; $$('[data-s]', el).forEach(x => x.setAttribute('aria-pressed', String(x===b))); $('[data-size-hint]', pdp).textContent = size; })); }
      const sw = $('[data-swatches]', pdp); if (sw) sw.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; color = b.dataset.c; $$('[data-c]', sw).forEach(x => x.setAttribute('aria-pressed', String(x===b))); $('[data-color-name]', pdp).textContent = color; size=''; const hint=$('[data-size-hint]', pdp); if (hint) hint.textContent='Pick a size'; drawSizes(); });
      drawSizes();
      $('[data-add]', pdp).addEventListener('click', () => { if (p.sizes.length && !size){ toast('Pick a size first'); const el=$('[data-sizes]', pdp); el && el.scrollIntoView({block:'center',behavior:'smooth'}); return; } bag.add(p.h, color, size); toast(`Added ${p.t} to your bag`); openLayer('bag'); bag.render(); });
      const pairs = $('[data-rail="pairs"]');
      if (pairs){ const want = p.k==='dress' ? ['jewelry','layer'] : p.k==='top' ? ['bottom','jewelry','layer'] : p.k==='bottom' ? ['top','layer','jewelry'] : p.k==='jewelry' ? ['dress','top'] : ['top','dress','jewelry'];
        const rnd = seeded(p.h.length*131); const list = []; want.forEach(k => { const pool = P.filter(x => x.k===k && x.h!==p.h && (p.occ.length ? x.occ.some(o=>p.occ.includes(o)) || k==='jewelry' : true)); for (let i=0;i<4 && pool.length;i++){ const j = Math.floor(rnd()*pool.length); list.push(pool.splice(j,1)[0]); } });
        pairs.innerHTML = list.slice(0,10).map(x => tile(x)).join(''); }
    }
  }

  bag.render();
})();
