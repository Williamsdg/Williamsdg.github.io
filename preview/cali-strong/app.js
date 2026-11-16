/* CALI Strong concept — app.js (Williams Digital) */
(function(){
'use strict';
const CS = window.CS_DATA || [];
const $ = (s, r) => (r||document).querySelector(s);
const $$ = (s, r) => Array.from((r||document).querySelectorAll(s));
const money = n => '$' + Number(n).toFixed(2);
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img = p => 'img/p/' + p.h + '.webp';
const cdn = (src, w) => src + '?width=' + w;
const byH = h => CS.find(p => p.h === h);
const CATS = {hats:'Hats', apparel:'Apparel', skate:'Skate', shoes:'Shoes', accessories:'Accessories', patches:'Morale patches'};
const FILTERS = {instock:'In stock only', glow:'Glow in the dark', usa:'Made in the USA', teamusa:'Team USA', rasta:'Rasta', kids:'Kids'};

/* ---------- toast ---------- */
let toastT;
function toast(html){
  let t = $('.toast'); if(!t){ t = document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); document.body.appendChild(t); }
  t.innerHTML = html; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ---------- cart ---------- */
const Cart = {
  key:'cs_cart_v1', items:[],
  load(){ try{ this.items = JSON.parse(localStorage.getItem(this.key)||'[]'); }catch(e){ this.items=[]; } this.badge(); },
  save(){ try{ localStorage.setItem(this.key, JSON.stringify(this.items)); }catch(e){} this.badge(); },
  add(it){ const k = it.h + '|' + (it.v||''); const ex = this.items.find(x => x.k===k); if(ex) ex.q += (it.q||1); else this.items.push({k, h:it.h, name:it.name, v:it.v||'', price:it.price, q:it.q||1}); this.save(); this.render(); },
  setQty(k, q){ const it = this.items.find(x=>x.k===k); if(!it) return; it.q = q; if(it.q<=0) this.items = this.items.filter(x=>x.k!==k); this.save(); this.render(); },
  count(){ return this.items.reduce((n,x)=>n+x.q,0); },
  total(){ return this.items.reduce((n,x)=>n+x.q*x.price,0); },
  badge(){ $$('.count').forEach(b => { const n=this.count(); b.textContent=n; b.dataset.n=n; }); },
  open(){ const c=$('.cart'); if(!c) return; this.render(); c.classList.add('open'); document.documentElement.classList.add('noscroll'); const x=$('.cart .x'); x && x.focus(); },
  close(){ const c=$('.cart'); if(!c) return; c.classList.remove('open'); document.documentElement.classList.remove('noscroll'); },
  render(){
    const box = $('.cart .lines'); if(!box) return;
    if(!this.items.length){ box.innerHTML = '<div class="empty-c">Your cart is empty.<br><a href="shop.html">Start shopping</a></div>'; }
    else box.innerHTML = this.items.map(x => `<div class="line"><a class="ph" href="product.html?h=${x.h}"><img src="img/p/${x.h}.webp" alt=""></a><div><div class="nm">${esc(x.name)}</div>${x.v?`<div class="v">${esc(x.v)}</div>`:''}<div class="qty"><button type="button" aria-label="Remove one" data-q="${x.k}" data-d="-1">−</button><span>${x.q}</span><button type="button" aria-label="Add one" data-q="${x.k}" data-d="1">+</button></div></div><div><div class="pr">${money(x.q*x.price)}</div><button type="button" class="rm" data-rm="${x.k}">Remove</button></div></div>`).join('');
    const t = this.total(); $('.cart .sum b').textContent = money(t);
    const left = Math.max(0, 50 - t); const sh = $('.cart .ship');
    sh.querySelector('span').textContent = this.items.length ? (left>0 ? `Add ${money(left)} more for free US shipping.` : 'This order ships free in the US.') : 'Free US shipping on orders over $50.';
    sh.querySelector('i').style.width = Math.min(100, t/50*100) + '%';
    $('.cart .checkout').classList.toggle('off', !this.items.length);
  }
};

/* ---------- header ---------- */
function initHeader(){
  Cart.load();
  const shopBtn = $('#shopBtn'), mega = $('#mega');
  if(shopBtn && mega){
    const set = o => { mega.classList.toggle('open', o); shopBtn.setAttribute('aria-expanded', o); };
    shopBtn.addEventListener('click', () => set(!mega.classList.contains('open')));
    document.addEventListener('click', e => { if(!e.target.closest('.mega-wrap')) set(false); });
    document.addEventListener('keydown', e => { if(e.key==='Escape') set(false); });
  }
  const drawer = $('.drawer');
  const openD = o => { drawer.classList.toggle('open', o); document.documentElement.classList.toggle('noscroll', o); $('.burger').setAttribute('aria-expanded', o); if(o){ $('.drawer .x').focus(); } };
  $('.burger') && $('.burger').addEventListener('click', () => openD(true));
  drawer && $$('.drawer .scrim, .drawer .x').forEach(el => el.addEventListener('click', () => openD(false)));
  $$('.cart-btn').forEach(b => b.addEventListener('click', () => Cart.open()));
  const cart = $('.cart');
  if(cart){
    $$('.cart .scrim, .cart .x').forEach(el => el.addEventListener('click', () => Cart.close()));
    cart.addEventListener('click', e => {
      const q = e.target.closest('[data-q]'); if(q){ const it = Cart.items.find(x=>x.k===q.dataset.q); Cart.setQty(q.dataset.q, (it?it.q:0) + Number(q.dataset.d)); }
      const rm = e.target.closest('[data-rm]'); if(rm) Cart.setQty(rm.dataset.rm, 0);
    });
    $('.cart .checkout').addEventListener('click', e => { e.preventDefault(); if(Cart.items.length) toast('Checkout is not connected in this concept. On the live store this goes to Shopify checkout.'); });
  }
  document.addEventListener('keydown', e => { if(e.key==='Escape'){ Cart.close(); drawer && openD(false); $('.sheet') && closeSheet(); } });
}

/* ---------- cards ---------- */
function card(p){
  const tags = [];
  if(!p.avail) tags.push('<span class="tag out">Sold out</span>');
  if(p.glow) tags.push('<span class="tag glow">Glow</span>');
  if(p.usa) tags.push('<span class="tag usa">Made in USA</span>');
  return `<a class="card${p.avail?'':' sold'}" href="product.html?h=${p.h}"><div class="ph"><img src="${img(p)}" alt="${esc(p.name)}" loading="lazy" width="640" height="640">${tags.length?`<div class="bad">${tags.join('')}</div>`:''}</div><div class="nm">${esc(p.name)}</div><div class="sub"><span>${esc(p.sub)}</span><b>${money(p.price)}</b></div></a>`;
}
function featuredSort(a,b){ return (b.avail-a.avail) || (b.feature-a.feature) || 0; }

/* ---------- shop ---------- */
let S = {c:'', s:'', f:new Set(), q:'', sort:'featured'};
function readURL(){
  const u = new URL(location.href);
  S.c = u.searchParams.get('c')||''; S.s = u.searchParams.get('s')||''; S.q = u.searchParams.get('q')||''; S.sort = u.searchParams.get('sort')||'featured';
  S.f = new Set((u.searchParams.get('f')||'').split(',').filter(Boolean));
  if(!CATS[S.c]) S.c = '';
}
function writeURL(){
  const u = new URL(location.href); const sp = u.searchParams;
  ['c','s','q','sort','f','focus'].forEach(k => sp.delete(k));
  if(S.c) sp.set('c', S.c); if(S.s) sp.set('s', S.s); if(S.q) sp.set('q', S.q); if(S.sort!=='featured') sp.set('sort', S.sort); if(S.f.size) sp.set('f', [...S.f].join(','));
  history.replaceState(null, '', u.pathname + (sp.toString()?'?'+sp.toString():''));
}
function passes(p, ignoreCat){
  if(!ignoreCat){ if(S.c && p.cat!==S.c) return false; if(S.s && p.sub!==S.s) return false; }
  for(const f of S.f){ if(f==='instock'){ if(!p.avail) return false; } else if(!p[f]) return false; }
  if(S.q){ const q = S.q.toLowerCase(); if(!(p.title.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q) || p.type.toLowerCase().includes(q))) return false; }
  return true;
}
function results(){
  let r = CS.filter(p => passes(p));
  if(S.sort==='featured') r.sort(featuredSort);
  else if(S.sort==='low') r.sort((a,b)=>a.price-b.price || featuredSort(a,b));
  else if(S.sort==='high') r.sort((a,b)=>b.price-a.price || featuredSort(a,b));
  else if(S.sort==='new') r.sort((a,b)=> (b.pub>a.pub?1:b.pub<a.pub?-1:0) || featuredSort(a,b));
  return r;
}
function title(){ if(S.q) return `Results for “${S.q}”`; if(S.s) return S.s; if(S.c) return CATS[S.c]; if(S.f.has('glow')&&S.f.size===1) return 'Glow in the dark'; if(S.f.has('usa')&&S.f.size===1) return 'Made in the USA'; if(S.f.has('rasta')&&S.f.size===1) return 'Rasta'; if(S.f.has('teamusa')&&S.f.size===1) return 'Team USA'; if(S.f.has('kids')&&S.f.size===1) return 'Kids'; return 'Everything'; }
function renderShop(){
  const r = results();
  $('#shopTitle').textContent = title();
  document.title = title() + ' – CALI Strong';
  $('#n').textContent = r.length + (r.length===1?' product':' products');
  const g = $('#grid');
  g.innerHTML = r.length ? r.map(card).join('') : `<div class="empty" style="grid-column:1/-1"><b>Nothing matches.</b>Try fewer filters or a different word.<br><br><button type="button" class="btn ghost sm" id="clearAll">Clear filters</button></div>`;
  const ca = $('#clearAll'); ca && ca.addEventListener('click', () => { S = {c:'', s:'', f:new Set(), q:'', sort:'featured'}; $('#q').value=''; $('#qm') && ($('#qm').value=''); writeURL(); renderSide(); renderShop(); });
  // category list
  $$('#cats button').forEach(b => b.setAttribute('aria-current', b.dataset.c===S.c ? 'true' : 'false'));
  renderSubs();
  $$('.chips .chip[data-c]').forEach(b => b.setAttribute('aria-pressed', b.dataset.c===S.c ? 'true':'false'));
  $$('input[data-f]').forEach(i => i.checked = S.f.has(i.dataset.f));
  $$('select[data-sort]').forEach(s => s.value = S.sort);
  const fb = $('.fbtn span'); if(fb){ const n = S.f.size + (S.s?1:0); fb.textContent = n ? `Filters (${n})` : 'Filters'; }
}
function renderSubs(){
  const subs = {}; CS.filter(p => !S.c || p.cat===S.c).forEach(p => { subs[p.sub] = (subs[p.sub]||0)+1; });
  const html = (cls) => `<li><button type="button" data-s="" aria-current="${S.s?'false':'true'}">All ${S.c?CATS[S.c].toLowerCase():'products'}<span>${CS.filter(p=>!S.c||p.cat===S.c).length}</span></button></li>` + Object.keys(subs).sort().map(s => `<li><button type="button" data-s="${esc(s)}" aria-current="${S.s===s?'true':'false'}">${esc(s)}<span>${subs[s]}</span></button></li>`).join('');
  $$('.subs').forEach(u => { u.innerHTML = S.c ? html() : ''; });
  $$('.sheet .subs-chips').forEach(u => { u.innerHTML = S.c ? Object.keys(subs).sort().map(s => `<button type="button" class="chip" data-s="${esc(s)}" aria-pressed="${S.s===s}">${esc(s)}</button>`).join('') : ''; u.closest('.subs-wrap').style.display = S.c ? '' : 'none'; });
}
function renderSide(){
  const counts = {}; CS.forEach(p => counts[p.cat] = (counts[p.cat]||0)+1);
  $('#cats').innerHTML = `<li><button type="button" data-c="">Everything<span>${CS.length}</span></button></li>` + Object.keys(CATS).map(c => `<li><button type="button" data-c="${c}">${CATS[c]}<span>${counts[c]||0}</span></button></li>`).join('');
}
function openSheet(){ $('.sheet').classList.add('open'); document.documentElement.classList.add('noscroll'); $('.sheet .x').focus(); }
function closeSheet(){ const s=$('.sheet'); if(!s) return; s.classList.remove('open'); document.documentElement.classList.remove('noscroll'); }
function initShop(){
  readURL(); renderSide(); renderShop();
  const u = new URL(location.href); if(u.searchParams.get('focus')){ $('#q').focus(); }
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-c]'); if(c && !c.closest('.mega')){ S.c = c.dataset.c; S.s=''; writeURL(); renderShop(); window.scrollTo({top:0,behavior:'smooth'}); }
    const s = e.target.closest('[data-s]'); if(s){ S.s = s.dataset.s; writeURL(); renderShop(); }
  });
  document.addEventListener('change', e => {
    const f = e.target.closest('input[data-f]'); if(f){ f.checked ? S.f.add(f.dataset.f) : S.f.delete(f.dataset.f); writeURL(); renderShop(); }
    const so = e.target.closest('select[data-sort]'); if(so){ S.sort = so.value; writeURL(); renderShop(); }
  });
  let t; const onQ = v => { clearTimeout(t); t = setTimeout(() => { S.q = v.trim(); writeURL(); renderShop(); }, 180); };
  $('#q').addEventListener('input', e => onQ(e.target.value));
  $('#qm') && $('#qm').addEventListener('input', e => onQ(e.target.value));
  $('#q').value = S.q; $('#qm') && ($('#qm').value = S.q);
  $('.fbtn').addEventListener('click', openSheet);
  $$('.sheet .scrim, .sheet .x, .sheet .done').forEach(el => el.addEventListener('click', closeSheet));
  $('.sheet .clear').addEventListener('click', () => { S.f = new Set(); S.s=''; S.sort='featured'; writeURL(); renderShop(); });
}

/* ---------- product ---------- */
function pairsWith(p){
  const inst = CS.filter(x => x.avail && x.h!==p.h);
  const pick = (fn, n) => inst.filter(fn).sort(featuredSort).slice(0, n);
  if(p.cat==='hats') return {t:'Patches that fit this hat', items: pick(x => x.cat==='patches', 6)};
  if(p.cat==='patches') return {t:'Hats this patch fits', items: pick(x => x.cat==='hats', 6)};
  if(p.cat==='skate') return {t:'Finish the setup', items: pick(x => x.cat==='shoes' || x.sub==='Socks' || x.sub==='Grip tape', 6)};
  if(p.cat==='shoes') return {t:'Goes with these', items: pick(x => x.sub==='Socks' || x.cat==='skate', 6)};
  if(p.cat==='apparel') return {t:'Finish the look', items: pick(x => x.cat==='hats' || x.sub==='Socks', 6)};
  return {t:'You might also like', items: pick(x => x.cat===p.cat, 6)};
}
function initProduct(){
  const h = new URL(location.href).searchParams.get('h');
  const p = byH(h); const root = $('#prod');
  if(!p){ root.innerHTML = `<div class="empty"><b>We couldn't find that product.</b><a href="shop.html">Back to the shop</a></div>`; return; }
  document.title = p.title + ' – CALI Strong';
  const bodies = window.CS_BODIES || {}; const body = bodies[p.h] || '';
  const imgs = p.imgs.length ? p.imgs : [''];
  const night = p.glowpair ? (p.avail ? `img/big/${p.h}-glow.webp` : cdn(p.glowpair.glow, 1000)) : '';
  root.innerHTML = `
  <div class="gal">
    <div class="main"><img id="mainImg" src="${cdn(imgs[0],1000)}" alt="${esc(p.title)}" width="1000" height="1000" onerror="this.onerror=null;this.src='${img(p)}'">
      ${night ? `<button type="button" class="glow-sw" role="switch" aria-checked="false" id="glowSw"><span class="tr"></span>Lights off</button>` : ''}
    </div>
    ${imgs.length>1 ? `<div class="thumbs">${imgs.map((s,i)=>`<button type="button" data-i="${i}" aria-current="${i===0}" aria-label="Photo ${i+1}"><img src="${cdn(s,160)}" alt="" loading="lazy" onerror="this.closest('button').style.display='none'"></button>`).join('')}</div>` : ''}
  </div>
  <div class="info">
    <div class="sub"><a href="shop.html?c=${p.cat}">${CATS[p.cat]}</a> / <a href="shop.html?c=${p.cat}&s=${encodeURIComponent(p.sub)}">${esc(p.sub)}</a></div>
    <h1>${esc(p.title)}</h1>
    <div class="price" id="price">${money(p.price)}</div>
    <div class="avail ${p.avail?'ok':'no'}" id="avail">${p.avail?'In stock':'Sold out'}</div>
    <div id="opts"></div>
    <div class="add"><button type="button" class="btn red full" id="addBtn">${p.avail?'Add to cart':'Sold out'}</button></div>
    <div class="ship">Free US shipping on orders over $50. Ships from San Diego.</div>
    <div class="desc">
      ${body ? `<details open><summary>Details</summary><div class="body">${body}</div></details>` : ''}
      <details><summary>Shipping and returns</summary><div class="body"><p>Free shipping on US orders over $50. See the <a href="https://store.cali-strong.com/policies/shipping-policy">shipping policy</a> and <a href="https://store.cali-strong.com/policies/refund-policy">refund policy</a> on the live store.</p></div></details>
      ${p.cat==='hats' ? `<details><summary>About the patch panel</summary><div class="body"><p>This hat has a hook-and-loop panel. The patch it ships with comes off as quickly as it goes on, and any CALI Strong morale patch fits. <a href="patches.html?hat=${p.h}">Pair it with a patch</a>.</p></div></details>` : ''}
    </div>
  </div>`;
  // gallery
  const main = $('#mainImg');
  let dayIdx = 0;
  $$('.gal .thumbs button').forEach(b => b.addEventListener('click', () => { dayIdx = +b.dataset.i; main.src = cdn(imgs[dayIdx],1000); $$('.gal .thumbs button').forEach(x => x.setAttribute('aria-current', x===b)); const sw=$('#glowSw'); if(sw){ sw.setAttribute('aria-checked','false'); sw.lastChild.textContent='Lights off'; $('.gal .main').classList.remove('night'); } }));
  const sw = $('#glowSw');
  if(sw){ sw.addEventListener('click', () => { const on = sw.getAttribute('aria-checked')!=='true'; sw.setAttribute('aria-checked', on); sw.lastChild.textContent = on ? 'Lights on' : 'Lights off'; $('.gal .main').classList.toggle('night', on); main.src = on ? night : cdn(imgs[dayIdx],1000); }); }
  // options
  const sel = {}; const first = p.variants.find(v => v.avail) || p.variants[0];
  p.options.forEach((o,i) => sel[o.name] = i===0 ? first.o1 : first.o2);
  const variant = () => p.variants.find(v => p.options.every((o,i) => (i===0?v.o1:v.o2) === sel[o.name])) || null;
  function renderOpts(){
    $('#opts').innerHTML = p.options.map((o,i) => `<div class="opt"><div class="l"><b>${esc(o.name)}</b><span>${esc(sel[o.name]||'')}</span></div><div class="vals">${o.values.map(v => { const any = p.variants.some(x => (i===0?x.o1:x.o2)===v && x.avail); return `<button type="button" data-o="${esc(o.name)}" data-v="${esc(v)}" aria-pressed="${sel[o.name]===v}" class="${any?'':'out'}">${esc(v)}</button>`; }).join('')}</div></div>`).join('');
    const v = variant(); const ok = v && v.avail;
    $('#price').textContent = money(v ? v.price : p.price);
    $('#avail').textContent = ok ? 'In stock' : 'Sold out'; $('#avail').className = 'avail ' + (ok?'ok':'no');
    $('#addBtn').textContent = ok ? 'Add to cart' : 'Sold out'; $('#addBtn').disabled = !ok;
  }
  renderOpts();
  $('#opts').addEventListener('click', e => { const b = e.target.closest('button[data-o]'); if(!b) return; sel[b.dataset.o] = b.dataset.v; renderOpts(); });
  $('#addBtn').addEventListener('click', () => { const v = variant(); if(!v || !v.avail) return; Cart.add({h:p.h, name:p.name, v: v.title==='Default Title' ? '' : v.title, price: v.price}); toast(`Added to cart. <a href="#" class="open-cart">View cart</a>`); });
  document.addEventListener('click', e => { if(e.target.closest('.open-cart')){ e.preventDefault(); Cart.open(); } });
  // rails
  const pw = pairsWith(p); const rel = CS.filter(x => x.sub===p.sub && x.h!==p.h && x.avail).slice(0,4);
  const rails = $('#rails'); rails.innerHTML = (pw.items.length ? `<section class="rail sec tight"><div class="wrap"><h3>${pw.t}</h3><div class="grid">${pw.items.slice(0,4).map(card).join('')}</div></div></section>` : '') + (rel.length ? `<section class="rail sec tight"><div class="wrap"><h3>More ${esc(p.sub.toLowerCase())}</h3><div class="grid">${rel.map(card).join('')}</div></div></section>` : '');
}

/* ---------- builder ---------- */
const B = { hat:null, patch:null };
function hats(){ return CS.filter(p => p.cat==='hats' && p.avail); }
function patches(){ return CS.filter(p => p.cat==='patches' && p.avail); }
function pickBtn(p, cls){ return `<button type="button" class="pick ${cls||''}" data-pick="${p.cat==='hats'?'hat':'patch'}" data-h="${p.h}" aria-pressed="false"><img src="${img(p)}" alt="" loading="lazy" width="640" height="640"><span class="nm">${esc(p.name)}</span>${cls?`<span class="pr">${money(p.price)}</span>`:''}</button>`; }
function syncPicks(){
  $$('[data-pick]').forEach(b => b.setAttribute('aria-pressed', (b.dataset.pick==='hat' ? B.hat && B.hat.h===b.dataset.h : B.patch && B.patch.h===b.dataset.h) ? 'true':'false'));
  const tot = (B.hat?B.hat.price:0) + (B.patch?B.patch.price:0);
  $$('.combo').forEach(c => {
    if(B.hat){ c.querySelector('.hat-img').src = img(B.hat); c.querySelector('.hat-img').alt = B.hat.name; c.querySelector('.hat-nm').textContent = B.hat.name; c.querySelector('.hat-pr').textContent = money(B.hat.price); }
    if(B.patch){ c.querySelector('.patch-img').src = img(B.patch); c.querySelector('.patch-img').alt = B.patch.name; c.querySelector('.patch-nm').textContent = B.patch.name; c.querySelector('.patch-pr').textContent = money(B.patch.price); }
    c.querySelector('.tot b').textContent = money(tot);
  });
  const bar = $('.bbar'); if(bar){ bar.querySelector('.b-hat').src = B.hat?img(B.hat):''; bar.querySelector('.b-patch').src = B.patch?img(B.patch):''; bar.querySelector('.txt b').textContent = money(tot); bar.querySelector('.txt span').textContent = (B.hat?B.hat.name:'Pick a hat') + ' + ' + (B.patch?B.patch.name:'pick a patch'); }
}
function addBoth(){ if(!B.hat||!B.patch) return; const hv = B.hat.variants.find(v=>v.avail); Cart.add({h:B.hat.h, name:B.hat.name, v: hv && hv.title!=='Default Title' ? hv.title : '', price:B.hat.price}); Cart.add({h:B.patch.h, name:B.patch.name, price:B.patch.price}); toast('Hat and patch added. <a href="#" class="open-cart">View cart</a>'); }
function initBuilder(full){
  const u = new URL(location.href);
  B.hat = byH(u.searchParams.get('hat')) || byH(document.body.dataset.hat) || hats()[0];
  B.patch = byH(u.searchParams.get('patch')) || byH(document.body.dataset.patch) || patches()[0];
  if(full){
    const hg = $('#hatGrid'), pg = $('#patchGrid');
    const renderH = f => { hg.innerHTML = hats().filter(p => !f || p.sub===f).map(p => pickBtn(p,'full')).join(''); syncPicks(); };
    const renderP = f => { pg.innerHTML = patches().filter(p => !f || p.sub===f).map(p => pickBtn(p,'full')).join(''); syncPicks(); };
    renderH(''); renderP('');
    $$('#hatChips .chip').forEach(c => c.addEventListener('click', () => { $$('#hatChips .chip').forEach(x => x.setAttribute('aria-pressed', x===c)); renderH(c.dataset.sub); }));
    $$('#patchChips .chip').forEach(c => c.addEventListener('click', () => { $$('#patchChips .chip').forEach(x => x.setAttribute('aria-pressed', x===c)); renderP(c.dataset.sub); }));
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-pick]'); if(b){ const p = byH(b.dataset.h); if(b.dataset.pick==='hat') B.hat = p; else B.patch = p; syncPicks(); if(full){ const sp = new URL(location.href).searchParams; sp.set('hat', B.hat.h); sp.set('patch', B.patch.h); history.replaceState(null,'', location.pathname+'?'+sp.toString()); } }
    if(e.target.closest('.add-both')){ e.preventDefault(); addBoth(); }
    if(e.target.closest('.open-cart')){ e.preventDefault(); Cart.open(); }
  });
  syncPicks();
}

/* ---------- home ---------- */
function initHome(){
  initBuilder(false);
  const g = $('.glow'); const sw = $('#lights');
  if(sw){ sw.addEventListener('click', () => { const on = sw.getAttribute('aria-checked')!=='true'; sw.setAttribute('aria-checked', on); g.classList.toggle('on', on); sw.querySelector('.lbl').textContent = on ? 'Lights on' : 'Lights off'; }); }
}

/* ---------- store ---------- */
function initStore(){
  const f = $('#contactForm'); if(!f) return;
  f.addEventListener('submit', e => { e.preventDefault(); toast('Thanks. In this concept the form is a demo and does not send yet.'); f.reset(); });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  const pg = document.body.dataset.page;
  if(pg==='home') initHome(); else if(pg==='shop') initShop(); else if(pg==='product') initProduct(); else if(pg==='patches') initBuilder(true); else if(pg==='store') initStore();
});
})();
