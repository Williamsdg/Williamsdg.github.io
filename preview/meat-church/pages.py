# -*- coding: utf-8 -*-
"""Page bodies for the Meat Church concept. Run _build.py to emit HTML."""

# ===========================================================================
# shared bits
# ===========================================================================
PAGEHEAD_CSS = '''
.phead{padding:clamp(48px,7vw,104px) 0 clamp(30px,4vw,54px);border-bottom:1px solid var(--line-2)}
.phead h1{font-size:clamp(46px,8vw,120px);margin:14px 0 0}
.phead .lede{max-width:56ch;margin-top:22px}
.crumbs{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.18em;font-size:11.5px;
  color:var(--bone-3)}
.crumbs a{text-decoration:none;color:var(--bone-3)}
.crumbs a:hover{color:var(--ember)}
'''

FILTER_CSS = '''
.filters{display:flex;flex-wrap:wrap;gap:8px;padding:clamp(24px,3vw,38px) 0;
  border-bottom:1px solid var(--line-2);position:sticky;top:70px;z-index:40;
  background:var(--smoke);margin-bottom:clamp(28px,4vw,48px)}
.chip{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.14em;font-size:12px;
  font-weight:600;color:var(--bone-2);border:1px solid var(--line);background:transparent;
  padding:8px 15px;border-radius:99px;cursor:pointer;transition:all .22s var(--ease)}
.chip:hover{border-color:var(--bone-3);color:var(--bone)}
.chip[aria-pressed="true"]{background:var(--ember);border-color:var(--ember);color:#fff}
.count{margin-left:auto;align-self:center;font-family:var(--f-cond);letter-spacing:.16em;
  text-transform:uppercase;font-size:11.5px;color:var(--bone-3)}
'''


# ===========================================================================
# 1. rubs.html — the lineup
# ===========================================================================
RUBS_CSS = PAGEHEAD_CSS + FILTER_CSS + '''
.shelf{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;
  background:var(--line-2);border:1px solid var(--line-2)}
.item{background:var(--char);padding:26px 22px 26px;display:flex;flex-direction:column;
  position:relative;overflow:hidden;transition:background .3s var(--ease)}
.item:hover{background:var(--ash)}
.item-img{aspect-ratio:1;display:grid;place-items:center;margin-bottom:18px;position:relative;z-index:2}
.item-img img{max-height:100%;width:auto;object-fit:contain;
  filter:drop-shadow(0 20px 28px rgba(0,0,0,.55));transition:transform .5s var(--ease)}
.item:hover .item-img img{transform:translateY(-7px) scale(1.04)}
.item .fam{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.16em;font-size:10.5px;
  color:var(--ember);font-weight:600;margin-bottom:8px;position:relative;z-index:2}
.item h3{font-size:22px;margin:0 0 10px;position:relative;z-index:2}
.item h3 a{text-decoration:none}
.item h3 a::after{content:'';position:absolute;inset:0;z-index:4}
.item p{font-size:14.5px;line-height:1.5;color:var(--bone-2);margin:0 0 16px;position:relative;z-index:2}
.item-foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between;
  gap:12px;position:relative;z-index:5}
.price{font-family:var(--f-disp);font-size:22px;font-weight:800}
.price s{font-family:var(--f-body);font-size:13px;color:var(--bone-3);margin-left:8px;font-weight:400}
.add{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.12em;font-size:11.5px;
  font-weight:700;border:1px solid var(--line);background:transparent;color:var(--bone);
  padding:9px 15px;border-radius:var(--r);cursor:pointer;transition:all .22s var(--ease)}
.add:hover{background:var(--ember);border-color:var(--ember);color:#fff}
.add.done{background:var(--sugar);border-color:var(--sugar);color:var(--smoke)}

.packs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(16px,2vw,26px)}
.pack{background:var(--ash);border:1px solid var(--line-2);padding:24px;display:flex;
  flex-direction:column;transition:border-color .3s var(--ease)}
.pack:hover{border-color:var(--line)}
.pack img{width:100%;height:150px;object-fit:contain;margin-bottom:18px;
  filter:drop-shadow(0 16px 24px rgba(0,0,0,.5))}
.pack h3{font-size:20px;margin:0 0 8px}
.pack p{font-size:14px;color:var(--bone-2);margin:0 0 16px;line-height:1.5}
.save{position:absolute;top:14px;right:14px;background:var(--ember);color:#fff;
  font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.12em;font-size:10px;
  font-weight:700;padding:4px 9px;border-radius:99px}
.pack{position:relative}
@media (max-width:1000px){.shelf,.packs{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:620px){.filters{position:static}.item{padding:18px 14px 20px}
  .item h3{font-size:19px}.item p{font-size:13.5px}}
@media (max-width:460px){.shelf,.packs{grid-template-columns:1fr}}
'''

RUBS_BODY = '''
<section class="phead">
  <div class="wrap">
    <p class="crumbs"><a href="index.html">Home</a> &nbsp;/&nbsp; Rubs &amp; Seasonings</p>
    <h1>The Lineup</h1>
    <p class="lede">Sixteen blends. Every one of them started in Matt's kitchen, got argued
      over, cooked again, and only then got a label. Gluten free, no MSG, made in Texas.</p>
  </div>
</section>

<div class="wrap">
  <div class="filters" id="filters"></div>
</div>

<section style="padding-bottom:clamp(60px,8vw,110px)">
  <div class="wrap"><div class="shelf" id="shelf"></div></div>
</section>

<section class="sec sec--char">
  <div class="wrap">
    <div class="rule rv"><p class="eyebrow">Multi-packs</p></div>
    <div class="grid g2 rv" style="align-items:end;margin-bottom:clamp(28px,4vw,46px)">
      <h2>Buy the shelf,<br>not the bottle</h2>
      <p class="lede" style="margin:0">If you are going to end up with all of them anyway — and you are —
        the packs get you there for less.</p>
    </div>
    <div class="packs rv" id="packs"></div>
  </div>
</section>
'''

RUBS_JS = '''
var shelf = document.getElementById('shelf'),
    filters = document.getElementById('filters'),
    active = 'All';

var fams = ['All'].concat(MC.rubs.map(function(r){return r.family;})
  .filter(function(v,i,a){return a.indexOf(v)===i;}).sort());

fams.forEach(function(f){
  var b = document.createElement('button');
  b.className = 'chip'; b.type = 'button'; b.textContent = f;
  b.setAttribute('aria-pressed', f === active);
  b.addEventListener('click', function(){ active = f; render(); });
  filters.appendChild(b);
});
var count = document.createElement('span');
count.className = 'count'; filters.appendChild(count);

function render(){
  var list = MC.rubs.filter(function(r){ return active === 'All' || r.family === active; });
  count.textContent = list.length + (list.length === 1 ? ' blend' : ' blends');
  Array.prototype.forEach.call(filters.querySelectorAll('.chip'), function(c){
    c.setAttribute('aria-pressed', c.textContent === active);
  });
  shelf.innerHTML = '';
  list.forEach(function(r){
    var el = document.createElement('article');
    el.className = 'item';
    el.innerHTML =
      '<div class="item-img"><img src="' + r.img + '" alt="' + r.full + '" loading="lazy"></div>' +
      '<span class="fam">' + r.family + '</span>' +
      '<h3><a href="rub.html#' + r.h + '">' + r.name + '</a></h3>' +
      '<p>' + r.blurb + '</p>' +
      '<div class="item-foot"><span class="price">$' + r.price + '</span>' +
      '<button class="add" type="button">Add</button></div>';
    var btn = el.querySelector('.add');
    btn.addEventListener('click', function(e){
      e.preventDefault();
      btn.textContent = 'Added'; btn.classList.add('done');
      setTimeout(function(){ btn.textContent = 'Add'; btn.classList.remove('done'); }, 1400);
    });
    shelf.appendChild(el);
    MC.seasoning.burst(el);
  });
}
render();

var packs = document.getElementById('packs');
MC.packs.forEach(function(p){
  var save = p.was ? Math.round((1 - parseFloat(p.price)/parseFloat(p.was)) * 100) : 0;
  var el = document.createElement('article');
  el.className = 'pack';
  el.innerHTML = (save ? '<span class="save">Save ' + save + '%</span>' : '') +
    '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
    '<h3>' + p.name + '</h3><p>' + p.blurb + '</p>' +
    '<div class="item-foot"><span class="price">$' + p.price +
    (p.was ? '<s>$' + p.was + '</s>' : '') + '</span>' +
    '<button class="add" type="button">Add</button></div>';
  var b = el.querySelector('.add');
  b.addEventListener('click', function(){
    b.textContent = 'Added'; b.classList.add('done');
    setTimeout(function(){ b.textContent = 'Add'; b.classList.remove('done'); }, 1400);
  });
  packs.appendChild(el);
});
'''


# ===========================================================================
# 2. rub.html — one blend
# ===========================================================================
RUB_CSS = PAGEHEAD_CSS + '''
.pdp{display:grid;grid-template-columns:1fr 1fr;gap:clamp(30px,5vw,80px);
  padding:clamp(34px,5vw,70px) 0 clamp(60px,8vw,110px);align-items:start}
.pdp-art{position:relative;background:var(--char);border:1px solid var(--line-2);
  aspect-ratio:1;display:grid;place-items:center;padding:8%;overflow:hidden;
  position:sticky;top:96px}
.pdp-art img{max-height:100%;width:auto;object-fit:contain;position:relative;z-index:2;
  filter:drop-shadow(0 30px 44px rgba(0,0,0,.6))}
.pdp h1{font-size:clamp(44px,6vw,86px);margin:10px 0 0}
.pdp .fam{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.2em;font-size:11.5px;
  color:var(--ember);font-weight:600}
.pdp .desc{margin-top:22px;font-size:17.5px;line-height:1.62;color:var(--bone-2)}
.sizes{display:grid;gap:8px;margin:30px 0 0}
.size{display:flex;align-items:center;justify-content:space-between;gap:16px;
  border:1px solid var(--line);padding:14px 18px;cursor:pointer;border-radius:var(--r);
  transition:border-color .2s,background .2s;background:transparent}
.size:hover{border-color:var(--bone-3)}
.size[aria-pressed="true"]{border-color:var(--ember);background:rgba(210,69,30,.07)}
.size b{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.1em;font-size:14px;font-weight:600}
.size span{font-family:var(--f-disp);font-size:19px;font-weight:800}
.buy{display:flex;gap:12px;margin-top:24px;flex-wrap:wrap}
.pdp-meta{margin-top:32px;border-top:1px solid var(--line)}
.pdp-meta div{display:grid;grid-template-columns:120px 1fr;gap:16px;padding:13px 0;
  border-bottom:1px solid var(--line-2);font-size:15px}
.pdp-meta dt{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.16em;
  font-size:11px;color:var(--bone-3);padding-top:3px}
.pdp-meta dd{margin:0;color:var(--bone-2)}
.pairs{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
.pair{display:flex;align-items:center;gap:10px;border:1px solid var(--line);padding:8px 14px 8px 8px;
  border-radius:99px;text-decoration:none;transition:border-color .2s}
.pair:hover{border-color:var(--ember)}
.pair img{width:26px;height:34px;object-fit:contain}
.pair span{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.1em;font-size:12px;font-weight:600}
@media (max-width:900px){.pdp{grid-template-columns:1fr}.pdp-art{position:static;aspect-ratio:4/3}}
'''

RUB_BODY = '''
<div class="wrap">
  <div class="pdp">
    <div class="pdp-art"><canvas class="dust" id="pdp-dust"></canvas><img id="pdp-img" src="" alt=""></div>
    <div>
      <p class="crumbs"><a href="index.html">Home</a> &nbsp;/&nbsp; <a href="rubs.html">Rubs</a>
        &nbsp;/&nbsp; <span id="crumb-name"></span></p>
      <span class="fam" id="pdp-fam"></span>
      <h1 id="pdp-name"></h1>
      <p class="desc" id="pdp-desc"></p>
      <div class="sizes" id="pdp-sizes"></div>
      <div class="buy">
        <button class="btn btn--fire" id="pdp-add" type="button">Add to cart</button>
        <a class="btn btn--ghost" href="rubs.html">Back to the lineup</a>
      </div>
      <dl class="pdp-meta">
        <div><dt>Made in</dt><dd>Waxahachie, Texas</dd></div>
        <div><dt>Gluten</dt><dd>All Meat Church BBQ seasonings are gluten free</dd></div>
        <div><dt>Also at</dt><dd>Meat Church BBQ Supply and retailers nationwide</dd></div>
      </dl>
      <div style="margin-top:34px">
        <p class="eyebrow eyebrow--bone" style="margin-bottom:6px">Goes well with</p>
        <div class="pairs" id="pdp-pairs"></div>
      </div>
    </div>
  </div>
</div>

<section class="sec sec--char">
  <div class="wrap">
    <div class="rule"><p class="eyebrow">Cook with it</p></div>
    <h2 style="margin-bottom:clamp(26px,4vw,44px)">Recipes using this blend</h2>
    <div class="grid g3" id="pdp-recipes"></div>
  </div>
</section>
'''

RUB_JS = '''
function pick(){
  var h = (location.hash || '').replace('#','');
  return MC.rubs.filter(function(r){ return r.h === h; })[0] || MC.rubs[0];
}
var chosen = 0;
function paint(){
  var r = pick();
  document.title = r.full + ' — Meat Church BBQ';
  document.getElementById('pdp-img').src = r.img;
  document.getElementById('pdp-img').alt = r.full;
  document.getElementById('pdp-name').textContent = r.name;
  document.getElementById('crumb-name').textContent = r.name;
  document.getElementById('pdp-fam').textContent = r.family;
  document.getElementById('pdp-desc').textContent = r.blurb;

  chosen = 0;
  var sizes = document.getElementById('pdp-sizes');
  sizes.innerHTML = '';
  (r.variants || [{t:'Shaker', p:r.price}]).forEach(function(v, i){
    var b = document.createElement('button');
    b.className = 'size'; b.type = 'button';
    b.setAttribute('aria-pressed', i === 0);
    b.innerHTML = '<b>' + v.t + '</b><span>$' + v.p + '</span>';
    b.addEventListener('click', function(){
      chosen = i;
      Array.prototype.forEach.call(sizes.children, function(c, j){
        c.setAttribute('aria-pressed', j === i);
      });
    });
    sizes.appendChild(b);
  });

  var pairs = document.getElementById('pdp-pairs');
  pairs.innerHTML = '';
  MC.rubs.filter(function(x){ return x.h !== r.h && x.family === r.family; })
    .slice(0,3).concat(MC.rubs.filter(function(x){ return x.h !== r.h; }).slice(0,3))
    .filter(function(v,i,a){ return a.indexOf(v) === i; }).slice(0,3)
    .forEach(function(p){
      var a = document.createElement('a');
      a.className = 'pair'; a.href = 'rub.html#' + p.h;
      a.innerHTML = '<img src="' + p.img + '" alt=""><span>' + p.name + '</span>';
      pairs.appendChild(a);
    });

  var tag = r.family === 'Beef' ? 'Beef' : r.family === 'Pork' ? 'Pork'
          : r.family === 'Poultry' ? 'Chicken' : r.family === 'Tex-Mex' ? 'Tex-Mex' : null;
  var recs = MC.recipes.filter(function(x){ return !tag || x.tags.indexOf(tag) > -1; });
  if (recs.length < 3) recs = MC.recipes;
  var box = document.getElementById('pdp-recipes');
  box.innerHTML = '';
  recs.slice(0,3).forEach(function(x){
    var a = document.createElement('a');
    a.className = 'card'; a.href = 'recipe.html#' + x.slug;
    a.innerHTML = '<div class="card-media" style="aspect-ratio:16/10">' +
      '<img src="' + x.img + '" alt="" loading="lazy"></div>' +
      '<div class="card-body"><div class="tagrow">' +
      x.tags.map(function(t){ return '<span class="tag">' + t + '</span>'; }).join('') +
      '</div><h3>' + x.title + '</h3></div>';
    box.appendChild(a);
  });
}
paint();
window.addEventListener('hashchange', paint);
MC.seasoning.ambient(document.getElementById('pdp-dust'), .7);

document.getElementById('pdp-add').addEventListener('click', function(){
  var b = this, t = b.textContent;
  b.textContent = 'Added to cart';
  setTimeout(function(){ b.textContent = t; }, 1500);
});
'''


# ===========================================================================
# 3. journal.html — recipes + stories
# ===========================================================================
JOURNAL_CSS = PAGEHEAD_CSS + FILTER_CSS + '''
.jgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(20px,2.4vw,32px)}
.jgrid .card-media{aspect-ratio:4/3}
.kind{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.16em;font-size:10px;
  font-weight:700;padding:4px 9px;border-radius:99px}
.kind--recipe{background:rgba(210,69,30,.16);color:var(--ember)}
.kind--story{background:rgba(232,163,61,.14);color:var(--sugar)}
.kind--sample{border:1px dashed var(--line);color:var(--bone-3)}
.jfeature{display:grid;grid-template-columns:1.25fr 1fr;gap:0;background:var(--ash);
  border:1px solid var(--line-2);margin-bottom:clamp(28px,4vw,46px);text-decoration:none;
  overflow:hidden;transition:border-color .3s var(--ease)}
.jfeature:hover{border-color:var(--line)}
.jfeature img{width:100%;height:100%;min-height:320px;object-fit:cover;
  transition:transform .8s var(--ease)}
.jfeature:hover img{transform:scale(1.04)}
.jfeature-body{padding:clamp(28px,3.4vw,52px);display:flex;flex-direction:column;justify-content:center}
.jfeature h2{font-size:clamp(30px,3.6vw,52px);margin:14px 0 14px}
.more{display:flex;justify-content:center;margin-top:clamp(32px,4vw,52px)}
@media (max-width:980px){.jgrid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .jfeature{grid-template-columns:1fr}.jfeature img{min-height:220px}}
@media (max-width:620px){.jgrid{grid-template-columns:1fr}.filters{position:static}}
'''

JOURNAL_BODY = '''
<section class="phead">
  <div class="wrap">
    <p class="crumbs"><a href="index.html">Home</a> &nbsp;/&nbsp; The Journal</p>
    <h1>The Journal</h1>
    <p class="lede">Every cook, written down. Recipes you can follow at the pit without pausing a
      video, plus the notes, arguments and mistakes behind them.</p>
  </div>
</section>

<div class="wrap">
  <div class="filters" id="filters"></div>
</div>

<section style="padding-bottom:clamp(60px,8vw,110px)">
  <div class="wrap">
    <a class="jfeature" id="feature" href="recipe.html"></a>
    <div class="jgrid" id="jgrid"></div>
    <div class="more"><button class="btn btn--ghost" id="more" type="button">Load more</button></div>
  </div>
</section>
'''

JOURNAL_JS = r'''
/* The Journal lists whatever the editorial store says is published, so edits
   made in the Studio or the admin show up here immediately. */
var S = MC.store;
function esc(s){ return (s==null?'':String(s))
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

var ALL = S.load()
  .filter(function(p){ return p.status === 'Published' && p.title; })
  .map(function(p){
    return { kind:p.kind, slug:p.slug, title:p.title, img:p.hero,
             tags:p.tags.split(',').map(function(t){ return t.trim(); }).filter(Boolean),
             dek:p.dek, sample:!!p.sample, date:p.date,
             href:(p.kind === 'Recipe' ? 'recipe.html#' : 'story.html#') + p.slug };
  })
  .sort(function(a,b){ return a.date < b.date ? 1 : -1; });

var active = 'All', shown = 10;
var tagset = [];
ALL.forEach(function(x){ x.tags.forEach(function(t){
  if (tagset.indexOf(t) < 0) tagset.push(t); }); });
var tags = ['All','Recipes','Stories'].concat(tagset.sort());

var filters = document.getElementById('filters');
filters.innerHTML = tags.map(function(t){
  return '<button class="chip" type="button" aria-pressed="' + (t === active) +
    '">' + esc(t) + '</button>'; }).join('') + '<span class="count" id="jcount"></span>';
filters.addEventListener('click', function(e){
  var b = e.target.closest('.chip'); if (!b) return;
  active = b.textContent; shown = 10; render();
});

function match(x){
  if (active === 'All') return true;
  if (active === 'Recipes') return x.kind === 'Recipe';
  if (active === 'Stories') return x.kind === 'Story';
  return x.tags.indexOf(active) > -1;
}
function chips(x){
  return '<span class="kind kind--' + x.kind.toLowerCase() + '">' + x.kind + '</span>' +
    (x.sample ? '<span class="kind kind--sample">Sample</span>' : '');
}
function card(x){
  return '<a class="card" href="' + x.href + '">' +
    '<div class="card-media"><img src="' + x.img + '" alt="" loading="lazy"></div>' +
    '<div class="card-body"><div class="tagrow">' + chips(x) +
    x.tags.slice(0,2).map(function(t){ return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
    '</div><h3>' + esc(x.title) + '</h3>' +
    (x.dek ? '<p class="muted" style="margin:0;font-size:15px">' +
      esc(x.dek.slice(0,150)) + (x.dek.length > 150 ? '…' : '') + '</p>' : '') +
    '</div></a>';
}
function render(){
  Array.prototype.forEach.call(filters.querySelectorAll('.chip'), function(c){
    c.setAttribute('aria-pressed', c.textContent === active);
  });
  var list = ALL.filter(match);
  document.getElementById('jcount').textContent =
    list.length + ' post' + (list.length === 1 ? '' : 's');

  var f = document.getElementById('feature'), lead = list[0];
  if (lead) {
    f.style.display = '';
    f.href = lead.href;
    f.innerHTML = '<img src="' + lead.img + '" alt="">' +
      '<div class="jfeature-body"><div class="tagrow">' + chips(lead) + '</div>' +
      '<h2>' + esc(lead.title) + '</h2>' +
      '<p class="lede" style="margin:0">' + esc(lead.dek ||
        'Open the full write-up — ingredients, temps and every step.') + '</p></div>';
  } else { f.style.display = 'none'; }

  document.getElementById('jgrid').innerHTML =
    list.slice(1, shown).map(card).join('');
  document.getElementById('more').style.display = list.length > shown ? '' : 'none';
}
document.getElementById('more').addEventListener('click', function(){ shown += 9; render(); });
render();
'''


# ===========================================================================
# 4. recipe.html — a real recipe, laid out for cooking from
# ===========================================================================
ARTICLE_CSS = '''
.ahero{position:relative;min-height:60vh;display:flex;align-items:flex-end;
  padding:clamp(80px,12vh,150px) 0 clamp(34px,5vw,60px);overflow:hidden}
.ahero-bg{position:absolute;inset:0}
.ahero-bg img{width:100%;height:100%;object-fit:cover;opacity:.5}
.ahero-bg::after{content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(12,11,10,.7),rgba(12,11,10,.4) 40%,var(--smoke))}
.ahero-in{position:relative;z-index:2;width:100%}
.ahero h1{font-size:clamp(42px,7.4vw,112px);margin:16px 0 0;max-width:18ch}
.ameta{display:flex;flex-wrap:wrap;gap:26px;margin-top:26px;padding-top:22px;
  border-top:1px solid var(--line)}
.ameta div{display:grid;gap:3px}
.ameta dt{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.18em;
  font-size:10.5px;color:var(--bone-3)}
.ameta dd{margin:0;font-family:var(--f-disp);font-weight:800;font-size:22px;text-transform:uppercase}
.abody{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:clamp(30px,5vw,72px);
  padding:clamp(40px,6vw,88px) 0 clamp(60px,8vw,110px);align-items:start}
.prose{max-width:68ch;font-size:17.5px;line-height:1.72}
.prose p{color:var(--bone-2)}
.prose h2{font-size:clamp(26px,3vw,40px);margin:clamp(34px,4vw,54px) 0 16px}
.prose h3{font-size:clamp(20px,2vw,26px);margin:30px 0 12px}
.prose strong{color:var(--bone)}
.steps{counter-reset:s;list-style:none;padding:0;margin:0;display:grid;gap:4px}
.steps li{counter-increment:s;display:grid;grid-template-columns:52px 1fr;gap:18px;
  padding:20px 0;border-bottom:1px solid var(--line-2)}
.steps li::before{content:counter(s,decimal-leading-zero);font-family:var(--f-disp);
  font-weight:800;font-size:26px;color:var(--ember);line-height:1}
.steps h3{margin:0 0 6px;font-size:19px}
.steps p{margin:0;font-size:16.5px}
.ings{list-style:none;padding:0;margin:0;display:grid;gap:2px}
.ings li{display:flex;gap:12px;align-items:flex-start;padding:11px 0;
  border-bottom:1px solid var(--line-2);font-size:16px;color:var(--bone-2);cursor:pointer}
.ings input{margin:5px 0 0;accent-color:var(--ember);width:16px;height:16px;flex:0 0 auto}
.ings li.got{color:var(--bone-3);text-decoration:line-through}
.rail{position:sticky;top:96px;display:grid;gap:26px}
.railbox{background:var(--ash);border:1px solid var(--line-2);padding:24px}
.railbox h4{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.18em;
  font-size:11.5px;color:var(--bone-3);margin:0 0 16px;font-weight:600}
.usedrub{display:flex;gap:14px;align-items:center;text-decoration:none;padding:10px 0;
  border-bottom:1px solid var(--line-2)}
.usedrub:last-child{border-bottom:0}
.usedrub img{width:38px;height:52px;object-fit:contain}
.usedrub b{font-family:var(--f-disp);text-transform:uppercase;font-size:17px;font-weight:800;display:block}
.usedrub span{font-size:13px;color:var(--bone-3)}
.samplebar{background:rgba(232,163,61,.1);border:1px solid rgba(232,163,61,.3);
  padding:14px 18px;font-size:14.5px;color:var(--sugar);margin-bottom:28px}
.pn{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:clamp(40px,5vw,64px);
  padding-top:26px;border-top:1px solid var(--line)}
.pn a{text-decoration:none;border:1px solid var(--line-2);padding:16px 18px;
  transition:border-color .25s var(--ease),background .25s var(--ease)}
.pn a:hover{border-color:var(--ember);background:var(--char)}
.pn a.nx{text-align:right}
.pn span{display:block;font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.18em;
  font-size:10.5px;color:var(--bone-3);margin-bottom:6px}
.pn b{font-family:var(--f-disp);font-weight:800;text-transform:uppercase;font-size:18px;
  line-height:1.05;display:block}
.prose .ings{margin-bottom:18px}
.prose h3{color:var(--bone)}
@media (max-width:560px){.pn{grid-template-columns:1fr}.pn a.nx{text-align:left}}
@media (max-width:980px){.abody{grid-template-columns:1fr}.rail{position:static}}
'''

RECIPE_BODY = """
<article>
<section class="ahero">
  <div class="ahero-bg"><img id="r-hero" src="" alt=""></div>
  <div class="ahero-in wrap">
    <p class="crumbs"><a href="index.html">Home</a> &nbsp;/&nbsp;
      <a href="journal.html">Journal</a> &nbsp;/&nbsp; Recipe</p>
    <div class="tagrow" id="r-tags" style="margin:0 0 4px"></div>
    <h1 id="r-title"></h1>
    <dl class="ameta" id="r-meta"></dl>
  </div>
</section>

<div class="wrap">
  <div class="abody">
    <div class="prose">
      <div id="r-intro"></div>
      <h2>Ingredients</h2>
      <div id="r-ings"></div>
      <div id="r-gear"></div>
      <h2>Method</h2>
      <ol class="steps" id="r-steps"></ol>
      <nav class="pn" id="r-pn"></nav>
    </div>

    <aside class="rail">
      <div class="railbox" id="r-usedbox">
        <h4>Seasoning used</h4>
        <div id="used"></div>
      </div>
      <div class="railbox">
        <h4>Cook at a glance</h4>
        <dl class="ameta" id="r-glance" style="margin:0;padding:0;border:0;gap:18px"></dl>
      </div>
      <div class="railbox">
        <h4>Keep reading</h4>
        <div id="related"></div>
      </div>
    </aside>
  </div>
</div>
</article>

<section class="sec sec--char">
  <div class="wrap">
    <div class="rule"><p class="eyebrow">More from the Journal</p></div>
    <div class="grid g3" id="more3"></div>
  </div>
</section>
"""

RECIPE_JS = r'''
function esc(s){ return (s==null?'':String(s))
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
var $ = function(id){ return document.getElementById(id); };

function current(){
  var h = (location.hash || '').replace('#','');
  return MC.recipes.filter(function(r){ return r.slug === h; })[0] || MC.recipes[0];
}

function render(){
  var r = current(), i = MC.recipes.indexOf(r);
  document.title = r.title + ' \u2014 Meat Church BBQ';

  $('r-hero').src = r.img;
  $('r-hero').alt = r.title;
  $('r-title').textContent = r.title;
  $('r-tags').innerHTML = r.tags.map(function(t){
    return '<span class="tag tag--fire">' + esc(t) + '</span>'; }).join('');

  var nIngs = r.ings.reduce(function(a,g){ return a + g.items.length; }, 0);
  var meta = [];
  if (r.temp)     meta.push(['Pit temp', r.temp]);
  if (r.internal) meta.push(['Internal', r.internal]);
  if (r.time)     meta.push(['Cook time', r.time]);
  meta.push(['Ingredients', nIngs]);
  meta.push(['Steps', r.steps.length]);
  var cells = meta.map(function(m){
    return '<div><dt>' + m[0] + '</dt><dd>' + esc(m[1]) + '</dd></div>'; }).join('');
  $('r-meta').innerHTML = cells;
  $('r-glance').innerHTML = cells;

  $('r-intro').innerHTML = r.intro.map(function(p, n){
    return '<p' + (n === 0 ? ' class="lede"' : '') + '>' + esc(p) + '</p>'; }).join('')
    || '<p class="lede">' + esc(r.title) + '.</p>';

  $('r-ings').innerHTML = r.ings.map(function(g){
    return (g.g ? '<h3>' + esc(g.g) + '</h3>' : '') +
      '<ul class="ings">' + g.items.map(function(x){
        return '<li><input type="checkbox"><span>' + esc(x) + '</span></li>';
      }).join('') + '</ul>';
  }).join('');

  $('r-gear').innerHTML = r.gear && r.gear.length
    ? '<h3>Tools</h3><ul class="ings">' + r.gear.map(function(x){
        return '<li><input type="checkbox"><span>' + esc(x) + '</span></li>';
      }).join('') + '</ul>'
    : '';

  $('r-steps').innerHTML = r.steps.map(function(s){
    return '<li><div>' + (s.h ? '<h3>' + esc(s.h) + '</h3>' : '') +
      '<p>' + esc(s.b) + '</p></div></li>'; }).join('');

  /* tick an ingredient by clicking anywhere on its row */
  Array.prototype.forEach.call(document.querySelectorAll('.ings li'), function(li){
    var box = li.querySelector('input');
    function sync(){ li.classList.toggle('got', box.checked); }
    li.addEventListener('click', function(e){
      if (e.target !== box) box.checked = !box.checked;
      sync();
    });
    box.addEventListener('change', sync);
  });

  /* seasonings this recipe actually calls for */
  var used = MC.rubs.filter(function(x){ return r.rubs.indexOf(x.h) > -1; });
  $('r-usedbox').hidden = !used.length;
  $('used').innerHTML = used.map(function(x){
    return '<a class="usedrub" href="rub.html#' + x.h + '"><img src="' + x.img +
      '" alt=""><div><b>' + esc(x.name) + '</b><span>From $' + x.price +
      '</span></div></a>'; }).join('');

  /* related by shared tag, then fall back to neighbours in the archive */
  var rel = MC.recipes.filter(function(x){
    return x.slug !== r.slug && x.tags.some(function(t){ return r.tags.indexOf(t) > -1; });
  });
  if (rel.length < 4) {
    rel = rel.concat(MC.recipes.filter(function(x){
      return x.slug !== r.slug && rel.indexOf(x) < 0; }));
  }
  $('related').innerHTML = rel.slice(0,4).map(function(x){
    return '<a class="usedrub" href="recipe.html#' + x.slug + '"><img src="' + x.img +
      '" alt="" style="width:52px;height:40px;object-fit:cover">' +
      '<div><b style="font-size:15px;line-height:1.1">' + esc(x.title) +
      '</b></div></a>'; }).join('');

  /* previous / next through the archive */
  var prev = MC.recipes[(i - 1 + MC.recipes.length) % MC.recipes.length];
  var next = MC.recipes[(i + 1) % MC.recipes.length];
  $('r-pn').innerHTML =
    '<a href="recipe.html#' + prev.slug + '"><span>Previous</span><b>' +
      esc(prev.title) + '</b></a>' +
    '<a href="recipe.html#' + next.slug + '" class="nx"><span>Next</span><b>' +
      esc(next.title) + '</b></a>';

  $('more3').innerHTML = rel.slice(4,7).map(function(x){
    return '<a class="card" href="recipe.html#' + x.slug + '">' +
      '<div class="card-media" style="aspect-ratio:16/10"><img src="' + x.img +
      '" alt="" loading="lazy"></div><div class="card-body"><div class="tagrow">' +
      x.tags.map(function(t){ return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
      '</div><h3>' + esc(x.title) + '</h3></div></a>'; }).join('');

  window.scrollTo(0, 0);
}
render();
window.addEventListener('hashchange', render);
'''


# ===========================================================================
# 5. story.html — the long-form side of the Journal (sample content)
# ===========================================================================
STORY_BODY = """
<article>
<section class="ahero">
  <div class="ahero-bg"><img id="s-hero" src="" alt=""></div>
  <div class="ahero-in wrap">
    <p class="crumbs"><a href="index.html">Home</a> &nbsp;/&nbsp;
      <a href="journal.html">Journal</a> &nbsp;/&nbsp; Story</p>
    <div class="tagrow" id="s-tags" style="margin:0 0 4px"></div>
    <h1 id="s-title"></h1>
    <dl class="ameta" id="s-meta"></dl>
  </div>
</section>

<div class="wrap">
  <div class="abody">
    <div class="prose">
      <div class="samplebar" id="s-sample" hidden><strong>Sample post.</strong>
        Written by Williams Digital to show the Journal&rsquo;s long-form layout &mdash;
        headings, standfirst and the seasoning rail. Not Meat Church editorial.</div>
      <div id="s-body"></div>
      <nav class="pn" id="s-pn"></nav>
    </div>
    <aside class="rail">
      <div class="railbox" id="s-usedbox">
        <h4>Seasoning mentioned</h4>
        <div id="used"></div>
      </div>
      <div class="railbox">
        <h4>Keep reading</h4>
        <div id="related"></div>
      </div>
    </aside>
  </div>
</div>
</article>

<section class="sec sec--char">
  <div class="wrap">
    <div class="rule"><p class="eyebrow">More from the Journal</p></div>
    <div class="grid g3" id="more3"></div>
  </div>
</section>
"""

STORY_JS = r'''
var S = MC.store;
var $ = function(id){ return document.getElementById(id); };
function esc(s){ return (s==null?'':String(s))
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

var STORIES = S.load().filter(function(p){ return p.kind === 'Story'; });

function prose(t){
  return (t||'').split(/\n{2,}/).map(function(b){
    b = b.trim(); if (!b) return '';
    if (b.indexOf('## ') === 0) return '<h2>' + esc(b.slice(3)) + '</h2>';
    return '<p>' + esc(b).replace(/\n/g,'<br>') + '</p>';
  }).join('');
}

function render(){
  var h = (location.hash || '').replace('#','');
  var p = STORIES.filter(function(x){ return x.slug === h; })[0] || STORIES[0];
  if (!p) return;
  var i = STORIES.indexOf(p);

  document.title = p.title + ' — Meat Church BBQ';
  $('s-hero').src = p.hero; $('s-hero').alt = p.title;
  $('s-title').textContent = p.title;
  var tags = p.tags.split(',').map(function(t){ return t.trim(); }).filter(Boolean);
  $('s-tags').innerHTML = tags.map(function(t){
    return '<span class="tag tag--fire">' + esc(t) + '</span>'; }).join('');
  $('s-meta').innerHTML =
    '<div><dt>Filed under</dt><dd>' + esc(tags[0] || 'Journal') + '</dd></div>' +
    '<div><dt>Reading</dt><dd>' + Math.max(1, Math.round(S.words(p)/200)) + ' min</dd></div>' +
    '<div><dt>Status</dt><dd>' + esc(p.status) + '</dd></div>';
  $('s-sample').hidden = !p.sample;
  $('s-body').innerHTML = (p.dek ? '<p class="lede">' + esc(p.dek) + '</p>' : '') + prose(p.body);

  var used = MC.rubs.filter(function(r){ return (p.rubs||[]).indexOf(r.h) > -1; });
  $('s-usedbox').hidden = !used.length;
  $('used').innerHTML = used.map(function(r){
    return '<a class="usedrub" href="rub.html#' + r.h + '"><img src="' + r.img +
      '" alt=""><div><b>' + esc(r.name) + '</b><span>From $' + r.price +
      '</span></div></a>'; }).join('');

  var rel = MC.recipes.filter(function(x){
    return x.tags.some(function(t){ return tags.indexOf(t) > -1; }); });
  if (rel.length < 4) rel = rel.concat(MC.recipes.filter(function(x){ return rel.indexOf(x) < 0; }));
  $('related').innerHTML = rel.slice(0,4).map(function(x){
    return '<a class="usedrub" href="recipe.html#' + x.slug + '"><img src="' + x.img +
      '" alt="" style="width:52px;height:40px;object-fit:cover">' +
      '<div><b style="font-size:15px;line-height:1.1">' + esc(x.title) +
      '</b></div></a>'; }).join('');

  if (STORIES.length > 1) {
    var prev = STORIES[(i - 1 + STORIES.length) % STORIES.length];
    var next = STORIES[(i + 1) % STORIES.length];
    $('s-pn').innerHTML =
      '<a href="story.html#' + prev.slug + '"><span>Previous story</span><b>' +
        esc(prev.title) + '</b></a>' +
      '<a href="story.html#' + next.slug + '" class="nx"><span>Next story</span><b>' +
        esc(next.title) + '</b></a>';
  }

  $('more3').innerHTML = rel.slice(4,7).map(function(x){
    return '<a class="card" href="recipe.html#' + x.slug + '">' +
      '<div class="card-media" style="aspect-ratio:16/10"><img src="' + x.img +
      '" alt="" loading="lazy"></div><div class="card-body"><div class="tagrow">' +
      x.tags.map(function(t){ return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
      '</div><h3>' + esc(x.title) + '</h3></div></a>'; }).join('');
  window.scrollTo(0,0);
}
render();
window.addEventListener('hashchange', render);
'''


# ===========================================================================
# 6. write.html — the Journal Studio (authoring surface)
# ===========================================================================
WRITE_CSS = '''
body{overflow-x:hidden}
.studio{display:grid;grid-template-columns:270px minmax(0,1fr) 300px;
  min-height:calc(100vh - 70px);align-items:start}
.col{border-right:1px solid var(--line-2);min-height:calc(100vh - 70px)}
.col:last-child{border-right:0;border-left:1px solid var(--line-2)}
.colhead{padding:20px 22px 16px;border-bottom:1px solid var(--line-2);
  display:flex;align-items:center;gap:10px;position:sticky;top:70px;background:var(--smoke);z-index:5}
.colhead h2{font-size:17px;margin:0;letter-spacing:.04em}
.colhead .btn{margin-left:auto}

/* post list */
.psearch{padding:12px 22px 10px;border-bottom:1px solid var(--line-2);display:grid;gap:8px}
.psearch input{background:var(--char);border:1px solid var(--line);color:var(--bone);
  padding:9px 12px;font:inherit;font-size:14px;border-radius:var(--r);width:100%}
.psearch input:focus{outline:none;border-color:var(--ember)}
.psearch .count{margin:0;font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.16em;
  font-size:10.5px;color:var(--bone-3)}
.plist{padding:10px 0;max-height:calc(100vh - 260px);overflow:auto}
.pitem{display:block;width:100%;text-align:left;background:none;border:0;cursor:pointer;
  padding:14px 22px;border-bottom:1px solid var(--line-2);transition:background .18s}
.pitem:hover{background:var(--char)}
.pitem[aria-current="true"]{background:var(--char);box-shadow:inset 3px 0 0 var(--ember)}
.pitem b{display:block;font-family:var(--f-disp);font-weight:800;text-transform:uppercase;
  font-size:16px;line-height:1.08;margin-bottom:5px}
.pitem span{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.14em;
  font-size:10.5px;color:var(--bone-3)}
.dot{display:inline-block;width:6px;height:6px;border-radius:50%;margin-right:6px;
  vertical-align:middle}
.dot--draft{background:var(--bone-3)}
.dot--scheduled{background:var(--sugar)}
.dot--published{background:#4E9A5B}

/* editor */
.editor{padding:clamp(22px,3vw,40px) clamp(22px,3.4vw,52px) 90px;max-width:820px}
.seg{display:inline-flex;border:1px solid var(--line);border-radius:99px;padding:3px;margin-bottom:26px}
.seg button{background:none;border:0;cursor:pointer;padding:8px 20px;border-radius:99px;
  font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.14em;font-size:12px;
  font-weight:700;color:var(--bone-3);transition:all .2s}
.seg button[aria-pressed="true"]{background:var(--ember);color:#fff}
.f{display:grid;gap:7px;margin-bottom:20px}
.f label{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.18em;
  font-size:10.5px;color:var(--bone-3);font-weight:600}
.f input,.f textarea,.f select{background:var(--char);border:1px solid var(--line);
  color:var(--bone);padding:12px 14px;font:inherit;font-size:16px;border-radius:var(--r);width:100%}
.f textarea{resize:vertical;line-height:1.65;min-height:120px}
.f input:focus,.f textarea:focus,.f select:focus{outline:none;border-color:var(--ember)}
.f input::placeholder,.f textarea::placeholder{color:var(--bone-3)}
#f-title{font-family:var(--f-disp);font-weight:800;text-transform:uppercase;font-size:34px;
  line-height:1.02;padding:14px;letter-spacing:-.01em}
.frow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.fieldset{border:1px solid var(--line-2);padding:22px;margin-bottom:22px;background:var(--char)}
.fieldset > h3{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.18em;
  font-size:11px;color:var(--bone-3);margin:0 0 18px;font-weight:600}

/* repeatable rows */
.rows{display:grid;gap:8px;margin-bottom:12px}
.row{display:grid;grid-template-columns:22px 1fr 34px;gap:10px;align-items:start}
.row .n{font-family:var(--f-disp);font-weight:800;color:var(--ember);font-size:15px;padding-top:12px}
.row input,.row textarea{background:var(--ash);border:1px solid var(--line-2);color:var(--bone);
  padding:10px 12px;font:inherit;font-size:15px;width:100%;border-radius:var(--r)}
.row textarea{min-height:64px;resize:vertical;line-height:1.55}
.x{background:none;border:1px solid var(--line-2);color:var(--bone-3);cursor:pointer;
  border-radius:var(--r);height:38px;transition:all .2s}
.x:hover{border-color:var(--ember);color:var(--ember)}
.row.step{align-items:start}
.row.step > div{display:grid;gap:6px}
.row .sh{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.08em;font-weight:600}
.row .grouprow{border-color:rgba(232,163,61,.45);color:var(--sugar);
  font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.1em;font-weight:600}
.addpair{display:grid;grid-template-columns:1fr 1fr;gap:8px}
@media (max-width:620px){.addpair{grid-template-columns:1fr}}
.addrow{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.14em;font-size:11.5px;
  font-weight:700;background:none;border:1px dashed var(--line);color:var(--bone-2);
  padding:10px 16px;cursor:pointer;border-radius:var(--r);transition:all .2s;width:100%}
.addrow:hover{border-color:var(--ember);color:var(--ember)}

/* rub picker */
.rubpick{display:flex;flex-wrap:wrap;gap:7px}
.rubpick button{display:flex;align-items:center;gap:8px;background:var(--ash);
  border:1px solid var(--line-2);padding:6px 12px 6px 6px;border-radius:99px;cursor:pointer;
  transition:all .2s}
.rubpick button img{width:20px;height:28px;object-fit:contain}
.rubpick button span{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.1em;
  font-size:11px;font-weight:600;color:var(--bone-2)}
.rubpick button[aria-pressed="true"]{border-color:var(--ember);background:rgba(210,69,30,.12)}
.rubpick button[aria-pressed="true"] span{color:var(--bone)}

/* hero picker */
.heropick{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
.heropick button{border:2px solid transparent;padding:0;background:none;cursor:pointer;
  aspect-ratio:4/3;overflow:hidden}
.heropick img{width:100%;height:100%;object-fit:cover}
.heropick button[aria-pressed="true"]{border-color:var(--ember)}

/* publish rail */
.rail2{padding:22px}
.pbox{border:1px solid var(--line-2);background:var(--char);padding:18px;margin-bottom:16px}
.pbox h4{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.18em;font-size:10.5px;
  color:var(--bone-3);margin:0 0 14px;font-weight:600}
.kv{display:flex;justify-content:space-between;gap:10px;padding:7px 0;font-size:14px;
  border-bottom:1px solid var(--line-2)}
.kv:last-child{border-bottom:0}
.kv span{color:var(--bone-3)}
.kv b{font-weight:600}
.seo{border:1px solid var(--line-2);padding:14px;background:var(--ash)}
.seo b{display:block;color:#7CA7E8;font-size:15px;font-weight:500;line-height:1.3;margin-bottom:4px}
.seo i{display:block;color:#5B9E6B;font-style:normal;font-size:12.5px;margin-bottom:5px}
.seo p{margin:0;font-size:13px;color:var(--bone-3);line-height:1.45}
.saved{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.16em;font-size:10.5px;
  color:var(--bone-3);text-align:center;padding:8px 0}
.saved.on{color:var(--sugar)}

/* preview overlay */
.pv{position:fixed;inset:70px 0 0;background:var(--smoke);z-index:80;overflow:auto;display:none}
.pv.open{display:block}
.pvbar{position:sticky;top:0;background:var(--char);border-bottom:1px solid var(--line);
  padding:12px var(--gut);display:flex;align-items:center;gap:14px;z-index:2}
.pvbar p{margin:0;font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.18em;
  font-size:11px;color:var(--bone-3)}
.pvbar .btn{margin-left:auto}

@media (max-width:1180px){
  .studio{grid-template-columns:230px minmax(0,1fr)}
  .col:last-child{grid-column:1/-1;border-left:0;border-top:1px solid var(--line-2);min-height:0}
  .rail2{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .heropick{grid-template-columns:repeat(8,1fr)}
}
@media (max-width:820px){
  .studio{grid-template-columns:1fr}
  .col{border-right:0;border-bottom:1px solid var(--line-2);min-height:0}
  .colhead{position:static}
  .frow{grid-template-columns:1fr 1fr}
  .rail2{grid-template-columns:1fr}
  .heropick{grid-template-columns:repeat(4,1fr)}
}
''' + ARTICLE_CSS

WRITE_BODY = '''
<div class="studio">

  <!-- posts -->
  <div class="col">
    <div class="colhead">
      <h2>Posts</h2>
      <a class="btn btn--sm btn--ghost" href="admin.html">Admin</a>
      <button class="btn btn--sm btn--fire" id="new" type="button">New</button>
    </div>
    <div class="psearch">
      <input type="search" id="plistq" placeholder="Search posts&hellip;" aria-label="Search posts">
      <span class="count" id="plistn"></span>
    </div>
    <div class="plist" id="plist"></div>
  </div>

  <!-- editor -->
  <div class="col">
    <div class="colhead">
      <h2 id="edhead">Editing</h2>
      <button class="btn btn--sm btn--ghost" id="preview" type="button">Preview</button>
    </div>
    <div class="editor">
      <div class="samplebar" id="samplenote" hidden><strong>Sample post.</strong>
        Written by Williams Digital to demonstrate the long-form layout &mdash;
        not Meat Church editorial.</div>
      <div class="seg" id="kind">
        <button type="button" data-k="Recipe" aria-pressed="true">Recipe</button>
        <button type="button" data-k="Story" aria-pressed="false">Story</button>
      </div>

      <div class="f"><label for="f-title">Title</label>
        <input id="f-title" placeholder="Hatch Chile Brisket Dip"></div>
      <div class="f"><label for="f-dek">Standfirst</label>
        <textarea id="f-dek" rows="2" placeholder="One or two lines that sell the cook."></textarea></div>

      <div class="f"><label>Hero image</label><div class="heropick" id="heropick"></div></div>

      <div class="fieldset" id="cookbox">
        <h3>Cook card</h3>
        <div class="frow">
          <div class="f"><label for="f-temp">Pit temp</label><input id="f-temp" placeholder="350&deg;F"></div>
          <div class="f"><label for="f-time">Cook time</label><input id="f-time" placeholder="45 min"></div>
          <div class="f"><label for="f-serves">Serves</label><input id="f-serves" placeholder="8"></div>
          <div class="f"><label for="f-vessel">Vessel</label><input id="f-vessel" placeholder="12&quot; cast iron"></div>
        </div>
        <div class="f" style="margin:6px 0 0"><label>Seasonings used</label>
          <div class="rubpick" id="rubpick"></div></div>
      </div>

      <div class="fieldset" id="ingbox">
        <h3>Ingredients</h3>
        <div class="rows" id="ingrows"></div>
        <div class="addpair">
          <button class="addrow" type="button" data-add="ing">+ Add ingredient</button>
          <button class="addrow" type="button" data-add="group">+ Add sub-recipe heading</button>
        </div>
      </div>

      <div class="fieldset" id="stepbox">
        <h3>Method</h3>
        <div class="rows" id="steprows"></div>
        <button class="addrow" type="button" data-add="step">+ Add step</button>
      </div>

      <div class="f"><label for="f-body">Body</label>
        <textarea id="f-body" rows="12" placeholder="Write the story. Blank line between paragraphs. A line starting with ## becomes a heading."></textarea></div>
    </div>
  </div>

  <!-- publish -->
  <div class="col">
    <div class="rail2">
      <div class="pbox">
        <h4>Publish</h4>
        <div class="f"><label for="f-status">Status</label>
          <select id="f-status">
            <option>Draft</option><option>Scheduled</option><option>Published</option>
          </select></div>
        <div class="f"><label for="f-date">Date</label><input id="f-date" type="date"></div>
        <div class="f" style="margin-bottom:14px"><label for="f-tags">Tags</label>
          <input id="f-tags" placeholder="Beef, Tailgating"></div>
        <button class="btn btn--fire" id="save" type="button" style="width:100%;justify-content:center">Save post</button>
        <p class="saved" id="savedmsg">&nbsp;</p>
      </div>

      <div class="pbox">
        <h4>At a glance</h4>
        <div class="kv"><span>Type</span><b id="g-kind">Recipe</b></div>
        <div class="kv"><span>Words</span><b id="g-words">0</b></div>
        <div class="kv"><span>Read time</span><b id="g-read">0 min</b></div>
        <div class="kv"><span>Ingredients</span><b id="g-ings">0</b></div>
        <div class="kv"><span>Steps</span><b id="g-steps">0</b></div>
        <div class="kv"><span>Slug</span><b id="g-slug">&mdash;</b></div>
      </div>

      <div class="pbox">
        <h4>Search preview</h4>
        <div class="seo">
          <b id="s-title">Untitled post</b>
          <i>meatchurch.com &rsaquo; journal &rsaquo; <span id="s-slug">untitled</span></i>
          <p id="s-desc">Add a standfirst and it will show up here.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- live preview -->
<div class="pv" id="pv">
  <div class="pvbar">
    <p>Preview &mdash; this is exactly how the post publishes</p>
    <button class="btn btn--sm btn--ghost" id="pvclose" type="button">Close</button>
  </div>
  <div id="pvbody"></div>
</div>
'''

WRITE_JS = r'''
var $ = function(id){ return document.getElementById(id); };
var S = MC.store;
var F = { title:$('f-title'), dek:$('f-dek'), temp:$('f-temp'), time:$('f-time'),
          serves:$('f-serves'), vessel:$('f-vessel'), tags:$('f-tags'),
          status:$('f-status'), date:$('f-date'), body:$('f-body') };
var cur = null;

function esc(s){ return (s==null?'':String(s))
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function qs(k){
  var m = new RegExp('[?&]' + k + '=([^&]*)').exec(location.search);
  return m ? decodeURIComponent(m[1]) : null;
}

/* ------------------------------------------------------------------ list */
function drawList(){
  var q = ($('plistq') && $('plistq').value || '').trim().toLowerCase();
  var all = S.load().filter(function(p){
    return !q || (p.title + ' ' + p.tags).toLowerCase().indexOf(q) > -1;
  });
  $('plist').innerHTML = all.slice(0, 60).map(function(p){
    return '<button class="pitem" type="button" data-id="' + esc(p.id) + '" aria-current="' +
      (cur && p.id === cur.id) + '"><b>' + esc(p.title || 'Untitled post') + '</b>' +
      '<span><i class="dot dot--' + p.status.toLowerCase() + '"></i>' + p.status +
      ' &middot; ' + p.kind + ' &middot; ' + p.date + '</span></button>';
  }).join('');
  $('plistn').textContent = all.length + ' post' + (all.length === 1 ? '' : 's');
}
$('plist').addEventListener('click', function(e){
  var b = e.target.closest('.pitem'); if (!b) return;
  pull(); S.save();
  load(S.byId(b.getAttribute('data-id')));
});

/* ------------------------------------------------------------------ pickers */
var HEROES = MC.recipes.slice(0, 24);
function drawHero(){
  $('heropick').innerHTML = HEROES.map(function(r){
    return '<button type="button" data-src="' + r.img + '" title="' + esc(r.title) +
      '" aria-pressed="' + (cur.hero === r.img) + '">' +
      '<img src="' + r.img + '" alt="' + esc(r.title) + '" loading="lazy"></button>';
  }).join('');
}
$('heropick').addEventListener('click', function(e){
  var b = e.target.closest('button'); if (!b) return;
  cur.hero = b.getAttribute('data-src'); drawHero(); glance();
});

function drawRubs(){
  $('rubpick').innerHTML = MC.rubs.map(function(r){
    return '<button type="button" data-h="' + r.h + '" aria-pressed="' +
      (cur.rubs.indexOf(r.h) > -1) + '"><img src="' + r.img + '" alt="">' +
      '<span>' + esc(r.name) + '</span></button>';
  }).join('');
}
$('rubpick').addEventListener('click', function(e){
  var b = e.target.closest('button'); if (!b) return;
  var h = b.getAttribute('data-h'), i = cur.rubs.indexOf(h);
  if (i > -1) cur.rubs.splice(i,1); else cur.rubs.push(h);
  drawRubs();
});

/* ------------------------------------------------------------------ rows */
function drawIngs(){
  $('ingrows').innerHTML = cur.ings.map(function(v, i){
    var group = /^—\s/.test(v);
    return '<div class="row" data-i="' + i + '"><span class="n">' +
      (group ? '&para;' : (i+1)) + '</span>' +
      '<input value="' + esc(v) + '" placeholder="1 lb smoked chopped brisket"' +
      (group ? ' class="grouprow"' : '') + '>' +
      '<button class="x" type="button" aria-label="Remove">&times;</button></div>';
  }).join('');
}
function drawSteps(){
  $('steprows').innerHTML = cur.steps.map(function(s, i){
    return '<div class="row step" data-i="' + i + '"><span class="n">' + (i+1) + '</span>' +
      '<div><input class="sh" value="' + esc(s.h) + '" placeholder="Step heading — e.g. Prepare your smoker">' +
      '<textarea class="sb" placeholder="What to do.">' + esc(s.b) + '</textarea></div>' +
      '<button class="x" type="button" aria-label="Remove">&times;</button></div>';
  }).join('');
}
$('ingrows').addEventListener('input', function(e){
  var row = e.target.closest('.row'); if (!row) return;
  cur.ings[+row.getAttribute('data-i')] = e.target.value; glance();
});
$('steprows').addEventListener('input', function(e){
  var row = e.target.closest('.row'); if (!row) return;
  var s = cur.steps[+row.getAttribute('data-i')];
  if (e.target.classList.contains('sh')) s.h = e.target.value; else s.b = e.target.value;
  glance();
});
$('ingrows').addEventListener('click', function(e){
  if (!e.target.classList.contains('x')) return;
  cur.ings.splice(+e.target.closest('.row').getAttribute('data-i'), 1);
  if (!cur.ings.length) cur.ings.push('');
  drawIngs(); glance();
});
$('steprows').addEventListener('click', function(e){
  if (!e.target.classList.contains('x')) return;
  cur.steps.splice(+e.target.closest('.row').getAttribute('data-i'), 1);
  drawSteps(); glance();
});
Array.prototype.forEach.call(document.querySelectorAll('[data-add]'), function(b){
  b.addEventListener('click', function(){
    var w = b.getAttribute('data-add');
    if (w === 'ing') { cur.ings.push(''); drawIngs(); }
    else if (w === 'group') { cur.ings.push('— '); drawIngs(); }
    else { cur.steps.push({h:'',b:''}); drawSteps(); }
    glance();
  });
});

/* ------------------------------------------------------------------ kind */
$('kind').addEventListener('click', function(e){
  var b = e.target.closest('button'); if (!b) return;
  cur.kind = b.getAttribute('data-k'); syncKind(); glance();
});
function syncKind(){
  Array.prototype.forEach.call($('kind').querySelectorAll('button'), function(b){
    b.setAttribute('aria-pressed', b.getAttribute('data-k') === cur.kind);
  });
  var recipe = cur.kind === 'Recipe';
  ['cookbox','ingbox','stepbox'].forEach(function(id){ $(id).hidden = !recipe; });
  $('edhead').textContent = 'Editing ' + cur.kind.toLowerCase();
}

/* ------------------------------------------------------------------ load/pull */
function load(p){
  if (!p) p = S.load()[0];
  cur = p;
  F.title.value = p.title; F.dek.value = p.dek; F.temp.value = p.temp;
  F.time.value = p.time; F.serves.value = p.serves || ''; F.vessel.value = p.vessel || '';
  F.tags.value = p.tags; F.status.value = p.status; F.date.value = p.date;
  F.body.value = p.body;
  if (!cur.ings || !cur.ings.length) cur.ings = [''];
  if (!cur.steps) cur.steps = [];
  if (!cur.rubs) cur.rubs = [];
  $('samplenote').hidden = !p.sample;
  syncKind(); drawHero(); drawRubs(); drawIngs(); drawSteps(); drawList(); glance();
}
function pull(){
  if (!cur) return;
  cur.title = F.title.value; cur.dek = F.dek.value; cur.temp = F.temp.value;
  cur.time = F.time.value; cur.serves = F.serves.value; cur.vessel = F.vessel.value;
  cur.tags = F.tags.value; cur.status = F.status.value; cur.date = F.date.value;
  cur.body = F.body.value;
  if (!cur.slug || !cur.slug.length) cur.slug = S.slugify(cur.title);
}

/* ------------------------------------------------------------------ glance */
function glance(){
  pull();
  var w = S.words(cur);
  $('g-kind').textContent = cur.kind;
  $('g-words').textContent = w.toLocaleString('en-US');
  $('g-read').textContent = Math.max(1, Math.round(w / 200)) + ' min';
  $('g-ings').textContent = cur.ings.filter(function(x){
    return x && !/^—\s/.test(x); }).length;
  $('g-steps').textContent = cur.steps.filter(function(s){ return s.h || s.b; }).length;
  $('g-slug').textContent = S.slugify(cur.title);
  $('s-title').textContent = cur.title || 'Untitled post';
  $('s-slug').textContent = S.slugify(cur.title);
  $('s-desc').textContent = cur.dek || 'Add a standfirst and it will show up here.';
  drawList();
}
Object.keys(F).forEach(function(k){
  F[k].addEventListener('input', glance);
  F[k].addEventListener('change', glance);
});
$('plistq').addEventListener('input', drawList);

/* ------------------------------------------------------------------ actions */
$('new').addEventListener('click', function(){
  pull(); S.save();
  load(S.add({ id:'p'+Date.now(), kind:'Recipe', status:'Draft', slug:'',
    date:new Date().toISOString().slice(0,10), title:'', dek:'',
    hero:MC.recipes[0].img, tags:'', temp:'', internal:'', time:'', serves:'', vessel:'',
    rubs:[], ings:[''], steps:[{h:'',b:''}], body:'', sample:false, views:0 }));
  F.title.focus();
});
$('save').addEventListener('click', function(){
  pull(); S.save();
  var m = $('savedmsg');
  m.textContent = 'Saved · ' + new Date().toLocaleTimeString();
  m.classList.add('on');
  setTimeout(function(){ m.classList.remove('on'); }, 2200);
  drawList();
});
window.addEventListener('beforeunload', function(){ pull(); S.save(); });

/* ------------------------------------------------------------------ preview */
function prose(t){
  return (t||'').split(/\n{2,}/).map(function(b){
    b = b.trim(); if (!b) return '';
    if (b.indexOf('## ') === 0) return '<h2>' + esc(b.slice(3)) + '</h2>';
    return '<p>' + esc(b).replace(/\n/g,'<br>') + '</p>';
  }).join('');
}
$('preview').addEventListener('click', function(){
  pull();
  var meta = [];
  if (cur.kind === 'Recipe') {
    if (cur.temp)   meta.push(['Pit temp', cur.temp]);
    if (cur.time)   meta.push(['Cook time', cur.time]);
    if (cur.serves) meta.push(['Serves', cur.serves]);
    if (cur.vessel) meta.push(['Vessel', cur.vessel]);
  } else {
    meta.push(['Filed under', cur.tags || 'Journal']);
    meta.push(['Reading', Math.max(1, Math.round(S.words(cur)/200)) + ' min']);
  }
  var steps = cur.steps.filter(function(s){ return s.h || s.b; });
  var rubs = MC.rubs.filter(function(r){ return cur.rubs.indexOf(r.h) > -1; });

  /* ingredients, honouring "— Group" marker rows */
  var groups = [], g = null;
  cur.ings.filter(Boolean).forEach(function(v){
    var m = /^—\s*(.*)$/.exec(v);
    if (m) { g = { g:m[1], items:[] }; groups.push(g); }
    else { if (!g) { g = { g:'', items:[] }; groups.push(g); } g.items.push(v); }
  });

  $('pvbody').innerHTML =
    '<article><section class="ahero"><div class="ahero-bg">' +
      '<img src="' + cur.hero + '" alt=""></div><div class="ahero-in wrap">' +
      '<p class="crumbs">Home / Journal / ' + cur.kind + '</p>' +
      '<h1>' + esc(cur.title || 'Untitled post') + '</h1>' +
      '<dl class="ameta">' + meta.map(function(m){
        return '<div><dt>' + m[0] + '</dt><dd>' + esc(m[1]) + '</dd></div>'; }).join('') +
      '</dl></div></section>' +
    '<div class="wrap"><div class="abody"><div class="prose">' +
      (cur.dek ? '<p class="lede">' + esc(cur.dek) + '</p>' : '') +
      prose(cur.body) +
      (groups.length ? '<h2>Ingredients</h2>' + groups.map(function(gr){
        return (gr.g ? '<h3>' + esc(gr.g) + '</h3>' : '') + '<ul class="ings">' +
          gr.items.map(function(i){
            return '<li><input type="checkbox"><span>' + esc(i) + '</span></li>';
          }).join('') + '</ul>'; }).join('') : '') +
      (steps.length ? '<h2>Method</h2><ol class="steps">' + steps.map(function(s){
        return '<li><div>' + (s.h ? '<h3>' + esc(s.h) + '</h3>' : '') +
          '<p>' + esc(s.b) + '</p></div></li>'; }).join('') + '</ol>' : '') +
    '</div><aside class="rail">' +
      (rubs.length ? '<div class="railbox"><h4>Seasoning used</h4>' + rubs.map(function(r){
        return '<a class="usedrub" href="rub.html#' + r.h + '"><img src="' + r.img +
          '" alt=""><div><b>' + esc(r.name) + '</b><span>From $' + r.price +
          '</span></div></a>'; }).join('') + '</div>' : '') +
      '<div class="railbox"><h4>Status</h4><div class="kv"><span>' + cur.status +
      '</span><b>' + cur.date + '</b></div></div>' +
    '</aside></div></div></article>';
  $('pv').classList.add('open');
  document.documentElement.style.overflow = 'hidden';
});
$('pvclose').addEventListener('click', function(){
  $('pv').classList.remove('open');
  document.documentElement.style.overflow = '';
});
window.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && $('pv').classList.contains('open')) $('pvclose').click();
});

/* ------------------------------------------------------------------ boot */
if (qs('new')) { $('new').click(); }
else { load(qs('id') ? S.byId(qs('id')) : null); }
'''


# ===========================================================================
# 7. admin.html — editorial dashboard
# ===========================================================================
ADMIN_CSS = '''
.shell{display:grid;grid-template-columns:230px minmax(0,1fr);min-height:calc(100vh - 70px)}
.side{border-right:1px solid var(--line-2);padding:22px 0;position:sticky;top:70px;
  height:calc(100vh - 70px);overflow:auto}
.side h4{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.18em;font-size:10.5px;
  color:var(--bone-3);margin:0 0 10px;padding:0 22px;font-weight:600}
.side nav{display:grid;margin-bottom:26px}
.side a{display:flex;align-items:center;gap:10px;padding:11px 22px;text-decoration:none;
  font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.12em;font-size:13px;
  font-weight:600;color:var(--bone-2);border-left:3px solid transparent;transition:all .2s}
.side a:hover{background:var(--char);color:var(--bone)}
.side a[aria-current="true"]{border-left-color:var(--ember);color:var(--bone);background:var(--char)}
.side a i{margin-left:auto;font-style:normal;font-size:11px;color:var(--bone-3)}

.main{padding:clamp(22px,3vw,38px) clamp(20px,3vw,44px) 90px;min-width:0}
.view{display:none}
.view.on{display:block}
.vhead{display:flex;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:clamp(22px,3vw,34px)}
.vhead h1{font-size:clamp(32px,4vw,54px);margin:6px 0 0}
.vhead .btn{margin-left:auto}

.tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:26px}
.tile{background:var(--char);border:1px solid var(--line-2);padding:20px}
.tile b{display:block;font-family:var(--f-disp);font-weight:800;font-size:clamp(30px,3.4vw,46px);
  line-height:1;margin-bottom:6px}
.tile span{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.16em;font-size:10.5px;
  color:var(--bone-3)}
.tile.t--fire b{color:var(--ember)}
.tile.t--gold b{color:var(--sugar)}

.panels{display:grid;grid-template-columns:1.35fr 1fr;gap:18px;align-items:start}
.panel{background:var(--char);border:1px solid var(--line-2);padding:22px}
.panel h3{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.18em;font-size:11px;
  color:var(--bone-3);margin:0 0 16px;font-weight:600;display:flex;align-items:center;gap:10px}
.panel h3 .btn{margin-left:auto}

/* a wide table scrolls inside its own box, never the page */
.tablewrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
table{width:100%;border-collapse:collapse;min-width:520px}
th{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.16em;font-size:10.5px;
  color:var(--bone-3);text-align:left;padding:0 10px 12px;font-weight:600;white-space:nowrap;
  border-bottom:1px solid var(--line);cursor:pointer;user-select:none}
th:hover{color:var(--bone)}
th[data-dir]::after{content:' \u25be';opacity:.7}
th[data-dir="asc"]::after{content:' \u25b4'}
td{padding:13px 10px;border-bottom:1px solid var(--line-2);font-size:14.5px;vertical-align:middle}
tr:hover td{background:rgba(255,255,255,.015)}
td.t b{display:block;font-family:var(--f-disp);font-weight:800;text-transform:uppercase;
  font-size:16px;line-height:1.1}
td.t span{font-size:12px;color:var(--bone-3)}
td.num{text-align:right;font-variant-numeric:tabular-nums;color:var(--bone-2)}
.pill{display:inline-flex;align-items:center;gap:6px;font-family:var(--f-cond);text-transform:uppercase;
  letter-spacing:.14em;font-size:10px;font-weight:700;padding:4px 10px;border-radius:99px;
  border:1px solid var(--line)}
.pill i{width:6px;height:6px;border-radius:50%;display:block}
.pill--published i{background:#4E9A5B}
.pill--scheduled i{background:var(--sugar)}
.pill--draft i{background:var(--bone-3)}
.rowacts{display:flex;gap:6px;justify-content:flex-end}
.mini{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.1em;font-size:10.5px;
  font-weight:700;border:1px solid var(--line-2);background:transparent;color:var(--bone-2);
  padding:6px 11px;border-radius:var(--r);cursor:pointer;text-decoration:none;transition:all .2s}
.mini:hover{border-color:var(--ember);color:var(--ember)}
.mini--danger:hover{border-color:#C0392B;color:#E06C5B}

.toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
.toolbar input[type=search]{background:var(--char);border:1px solid var(--line);color:var(--bone);
  padding:10px 14px;font:inherit;font-size:14.5px;border-radius:var(--r);min-width:220px;flex:1}
.toolbar input:focus,.toolbar select:focus{outline:none;border-color:var(--ember)}
.toolbar select{background:var(--char);border:1px solid var(--line);color:var(--bone);
  padding:10px 12px;font:inherit;font-size:14px;border-radius:var(--r)}

/* calendar */
.cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:1px;background:var(--line-2);
  border:1px solid var(--line-2)}
.cal .dow{background:var(--ash);padding:9px;text-align:center;font-family:var(--f-cond);
  text-transform:uppercase;letter-spacing:.14em;font-size:10px;color:var(--bone-3);font-weight:600}
.cal .day{background:var(--char);min-height:96px;padding:8px;position:relative}
.cal .day.out{background:var(--smoke)}
.cal .day em{font-style:normal;font-family:var(--f-cond);font-size:11px;color:var(--bone-3);
  display:block;margin-bottom:5px}
.cal .day.today em{color:var(--ember);font-weight:700}
.cal .ev{display:block;font-size:11px;line-height:1.25;padding:4px 6px;margin-bottom:3px;
  border-radius:2px;text-decoration:none;border-left:2px solid var(--bone-3);
  background:var(--ash);color:var(--bone-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cal .ev:hover{color:var(--bone)}
.cal .ev.published{border-left-color:#4E9A5B}
.cal .ev.scheduled{border-left-color:var(--sugar)}
.cal .ev.draft{border-left-color:var(--bone-3);opacity:.7}
.calbar{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.calbar b{font-family:var(--f-disp);font-weight:800;text-transform:uppercase;font-size:22px}

/* health */
.issue{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--line-2)}
.issue:last-child{border-bottom:0}
.issue b{font-family:var(--f-disp);font-weight:800;text-transform:uppercase;font-size:15px;
  line-height:1.15;display:block;margin-bottom:5px}
.issue .flags{display:flex;gap:5px;flex-wrap:wrap}
.flag{font-family:var(--f-cond);text-transform:uppercase;letter-spacing:.1em;font-size:9.5px;
  font-weight:700;color:var(--ember);border:1px solid rgba(210,69,30,.4);padding:2px 7px;
  border-radius:99px}
.issue .mini{margin-left:auto;flex:0 0 auto}

/* media + tags */
.mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.mcell{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--char);
  border:1px solid var(--line-2)}
.mcell img{width:100%;height:100%;object-fit:cover}
.mcell figcaption{position:absolute;left:0;right:0;bottom:0;padding:16px 8px 6px;font-size:10.5px;
  color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.85));
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.taglist{display:flex;flex-wrap:wrap;gap:8px}
.tagchip{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);
  padding:7px 8px 7px 14px;border-radius:99px;font-family:var(--f-cond);text-transform:uppercase;
  letter-spacing:.12em;font-size:11.5px;font-weight:600;color:var(--bone-2)}
.tagchip b{background:var(--ash);color:var(--bone);border-radius:99px;padding:2px 8px;
  font-family:var(--f-body);font-size:11px;letter-spacing:0}

.bar{height:6px;background:var(--ash);border-radius:99px;overflow:hidden;margin-top:8px}
.bar i{display:block;height:100%;background:var(--ember);border-radius:99px}
.legend{display:flex;gap:16px;flex-wrap:wrap;margin-top:14px}
.legend span{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--bone-3)}
.legend i{width:8px;height:8px;border-radius:50%;display:block}

.empty{padding:40px 0;text-align:center;color:var(--bone-3);font-size:14.5px}

@media (max-width:1100px){
  .tiles{grid-template-columns:repeat(2,minmax(0,1fr))}
  .panels{grid-template-columns:1fr}
}
@media (max-width:820px){
  .shell{grid-template-columns:1fr}
  .side{position:static;height:auto;border-right:0;border-bottom:1px solid var(--line-2);
    display:flex;gap:0;overflow-x:auto;padding:0}
  .side h4{display:none}
  .side nav{display:flex;margin:0}
  .side a{border-left:0;border-bottom:3px solid transparent;white-space:nowrap}
  .side a[aria-current="true"]{border-left-color:transparent;border-bottom-color:var(--ember)}
  .side a i{display:none}
  .tcol{display:none}
  table{min-width:460px}
  .rowacts{gap:4px}
  .mini{padding:5px 8px;font-size:10px}
}
@media (max-width:520px){
  .dcol{display:none}
  table{min-width:460px}
  /* deleting is a desktop job; keep the row readable on a phone */
  .mini--danger{display:none}
  td.t b{font-size:15px}
}
'''

ADMIN_BODY = """
<div class="shell">
  <aside class="side">
    <h4>Journal</h4>
    <nav id="nav">
      <a href="#overview" data-v="overview">Overview</a>
      <a href="#posts" data-v="posts">Posts <i id="n-posts"></i></a>
      <a href="#calendar" data-v="calendar">Calendar</a>
      <a href="#health" data-v="health">Health <i id="n-health"></i></a>
      <a href="#media" data-v="media">Media <i id="n-media"></i></a>
      <a href="#tags" data-v="tags">Tags <i id="n-tags"></i></a>
    </nav>
    <h4>Shortcuts</h4>
    <nav>
      <a href="write.html">Journal Studio</a>
      <a href="journal.html">View the Journal</a>
      <a href="#" id="reseed">Reset demo data</a>
    </nav>
  </aside>

  <main class="main">

    <!-- overview -->
    <section class="view" id="v-overview">
      <div class="vhead">
        <div><p class="eyebrow">Editorial</p><h1>Overview</h1></div>
        <a class="btn btn--fire btn--sm" href="write.html?new=1">New post</a>
      </div>
      <div class="tiles" id="tiles"></div>
      <div class="panels">
        <div class="panel">
          <h3>Publishing schedule
            <a class="btn btn--sm btn--ghost" href="#calendar" data-go="calendar">Open calendar</a></h3>
          <div id="upcoming"></div>
        </div>
        <div class="panel">
          <h3>Mix</h3>
          <div id="mix"></div>
        </div>
      </div>
      <div class="panels" style="margin-top:18px">
        <div class="panel">
          <h3>Most read <span class="tiny" style="letter-spacing:0;text-transform:none">demo figures</span></h3>
          <div id="topread"></div>
        </div>
        <div class="panel">
          <h3>Needs attention
            <a class="btn btn--sm btn--ghost" href="#health" data-go="health">All issues</a></h3>
          <div id="healthmini"></div>
        </div>
      </div>
    </section>

    <!-- posts -->
    <section class="view" id="v-posts">
      <div class="vhead">
        <div><p class="eyebrow">Editorial</p><h1>Posts</h1></div>
        <a class="btn btn--fire btn--sm" href="write.html?new=1">New post</a>
      </div>
      <div class="toolbar">
        <input type="search" id="q" placeholder="Search titles, tags, seasonings&hellip;" aria-label="Search">
        <select id="f-kind"><option value="">All types</option><option>Recipe</option><option>Story</option></select>
        <select id="f-status"><option value="">Any status</option><option>Published</option><option>Scheduled</option><option>Draft</option></select>
        <span class="count" id="n-result"></span>
      </div>
      <div class="tablewrap">
      <table>
        <thead><tr>
          <th data-sort="title">Title</th>
          <th data-sort="kind" class="tcol">Type</th>
          <th data-sort="status">Status</th>
          <th data-sort="date" class="dcol">Date</th>
          <th data-sort="words" class="num tcol">Words</th>
          <th data-sort="views" class="num tcol">Reads</th>
          <th></th>
        </tr></thead>
        <tbody id="rows"></tbody>
      </table>
      </div>
      <div class="empty" id="norows" hidden>Nothing matches those filters.</div>
    </section>

    <!-- calendar -->
    <section class="view" id="v-calendar">
      <div class="vhead"><div><p class="eyebrow">Editorial</p><h1>Calendar</h1></div></div>
      <div class="calbar">
        <button class="mini" id="prevm" type="button">&larr; Prev</button>
        <b id="mlabel"></b>
        <button class="mini" id="nextm" type="button">Next &rarr;</button>
      </div>
      <div class="cal" id="cal"></div>
      <div class="legend">
        <span><i style="background:#4E9A5B"></i> Published</span>
        <span><i style="background:#E8A33D"></i> Scheduled</span>
        <span><i style="background:#7C7263"></i> Draft</span>
      </div>
    </section>

    <!-- health -->
    <section class="view" id="v-health">
      <div class="vhead"><div><p class="eyebrow">Editorial</p><h1>Health</h1></div></div>
      <p class="lede" style="max-width:60ch;margin-top:-6px">Posts missing something a reader
        or a search engine will notice. Checked on every load.</p>
      <div class="panel" style="margin-top:22px"><div id="healthlist"></div></div>
    </section>

    <!-- media -->
    <section class="view" id="v-media">
      <div class="vhead"><div><p class="eyebrow">Editorial</p><h1>Media</h1></div></div>
      <p class="lede" style="max-width:60ch;margin-top:-6px">Every image in the library, with the
        number of posts using it.</p>
      <div class="mgrid" id="mgrid" style="margin-top:22px"></div>
    </section>

    <!-- tags -->
    <section class="view" id="v-tags">
      <div class="vhead"><div><p class="eyebrow">Editorial</p><h1>Tags</h1></div></div>
      <p class="lede" style="max-width:60ch;margin-top:-6px">How the archive is distributed.
        Thin tags are worth merging; heavy ones are worth a landing page.</p>
      <div class="panel" style="margin-top:22px"><div class="taglist" id="taglist"></div></div>
    </section>

  </main>
</div>
"""

ADMIN_JS = r'''
var $ = function(id){ return document.getElementById(id); };
var S = MC.store;
function esc(s){ return (s==null?'':String(s))
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function fmt(n){ return (n||0).toLocaleString('en-US'); }
function nice(d){
  var p = d.split('-');
  return new Date(+p[0], +p[1]-1, +p[2]).toLocaleDateString('en-US',
    { month:'short', day:'numeric', year:'numeric' });
}
function pill(s){
  return '<span class="pill pill--' + s.toLowerCase() + '"><i></i>' + s + '</span>';
}

/* ---------------------------------------------------------------- routing */
var VIEWS = ['overview','posts','calendar','health','media','tags'];
function show(v){
  if (VIEWS.indexOf(v) < 0) v = 'overview';
  VIEWS.forEach(function(x){ $('v-'+x).classList.toggle('on', x === v); });
  Array.prototype.forEach.call($('nav').querySelectorAll('a'), function(a){
    a.setAttribute('aria-current', a.getAttribute('data-v') === v);
  });
  if (v === 'calendar') drawCal();
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', function(){ show(location.hash.replace('#','')); });
Array.prototype.forEach.call(document.querySelectorAll('[data-go]'), function(b){
  b.addEventListener('click', function(e){ e.preventDefault();
    location.hash = b.getAttribute('data-go'); });
});

/* ---------------------------------------------------------------- overview */
function drawOverview(){
  var st = S.stats();
  $('tiles').innerHTML =
    '<div class="tile"><b>' + st.by.Published + '</b><span>Published</span></div>' +
    '<div class="tile t--gold"><b>' + (st.by.Scheduled||0) + '</b><span>Scheduled</span></div>' +
    '<div class="tile"><b>' + (st.by.Draft||0) + '</b><span>Drafts</span></div>' +
    '<div class="tile t--fire"><b>' + fmt(st.words) + '</b><span>Words in the archive</span></div>';

  var soon = S.load().filter(function(p){ return p.status === 'Scheduled'; })
    .sort(function(a,b){ return a.date < b.date ? -1 : 1; }).slice(0,5);
  $('upcoming').innerHTML = soon.length ? soon.map(function(p){
    return '<div class="issue"><div><b>' + esc(p.title || 'Untitled') + '</b>' +
      '<span class="tiny">' + p.kind + ' \u00b7 ' + nice(p.date) + '</span></div>' +
      '<a class="mini" href="write.html?id=' + encodeURIComponent(p.id) + '">Edit</a></div>';
  }).join('') : '<div class="empty">Nothing scheduled.</div>';

  var tot = st.total || 1;
  $('mix').innerHTML =
    '<div style="font-size:14px;color:var(--bone-2)">Recipes <b style="float:right;color:var(--bone)">' +
      st.recipes + '</b></div><div class="bar"><i style="width:' +
      Math.round(st.recipes/tot*100) + '%"></i></div>' +
    '<div style="font-size:14px;color:var(--bone-2);margin-top:16px">Stories ' +
      '<b style="float:right;color:var(--bone)">' + st.stories + '</b></div>' +
      '<div class="bar"><i style="width:' + Math.round(st.stories/tot*100) +
      '%;background:var(--sugar)"></i></div>' +
    '<p class="tiny" style="margin:18px 0 0">The archive is ' +
      Math.round(st.recipes/tot*100) + '% recipes. The Journal is built to carry both.</p>';

  var top = S.load().filter(function(p){ return p.status === 'Published'; })
    .sort(function(a,b){ return b.views - a.views; }).slice(0,5);
  $('topread').innerHTML = top.map(function(p){
    return '<div class="issue"><div><b>' + esc(p.title) + '</b>' +
      '<span class="tiny">' + esc(p.tags) + '</span></div>' +
      '<span class="mini" style="cursor:default">' + fmt(p.views) + '</span></div>';
  }).join('');

  var h = S.health();
  $('healthmini').innerHTML = h.length ? h.slice(0,5).map(function(x){
    return '<div class="issue"><div><b>' + esc(x.post.title || 'Untitled') + '</b>' +
      '<div class="flags">' + x.issues.map(function(i){
        return '<span class="flag">' + i + '</span>'; }).join('') + '</div></div>' +
      '<a class="mini" href="write.html?id=' + encodeURIComponent(x.post.id) + '">Fix</a></div>';
  }).join('') : '<div class="empty">Everything checks out.</div>';

  $('n-posts').textContent = st.total;
  $('n-health').textContent = h.length || '';
}

/* ---------------------------------------------------------------- posts */
var sortKey = 'date', sortDir = 'desc';
function rowsData(){
  var q = $('q').value.trim().toLowerCase();
  var k = $('f-kind').value, st = $('f-status').value;
  var list = S.load().filter(function(p){
    if (k && p.kind !== k) return false;
    if (st && p.status !== st) return false;
    if (!q) return true;
    var hay = (p.title + ' ' + p.tags + ' ' + p.rubs.join(' ')).toLowerCase();
    return hay.indexOf(q) > -1;
  });
  list.sort(function(a,b){
    var A, B;
    if (sortKey === 'words') { A = S.words(a); B = S.words(b); }
    else if (sortKey === 'views') { A = a.views; B = b.views; }
    else { A = (a[sortKey]||'').toString().toLowerCase(); B = (b[sortKey]||'').toString().toLowerCase(); }
    if (A < B) return sortDir === 'asc' ? -1 : 1;
    if (A > B) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  return list;
}
function drawRows(){
  var list = rowsData();
  $('n-result').textContent = list.length + ' of ' + S.load().length;
  $('norows').hidden = list.length > 0;
  $('rows').innerHTML = list.map(function(p){
    var href = p.kind === 'Recipe' ? 'recipe.html#' + p.slug : 'story.html#' + p.slug;
    return '<tr data-id="' + esc(p.id) + '">' +
      '<td class="t"><b>' + esc(p.title || 'Untitled') + '</b><span>' +
        esc(p.tags || 'untagged') + (p.sample ? ' \u00b7 sample' : '') + '</span></td>' +
      '<td class="tcol">' + p.kind + '</td>' +
      '<td>' + pill(p.status) + '</td>' +
      '<td class="dcol" style="white-space:nowrap;color:var(--bone-2)">' + nice(p.date) + '</td>' +
      '<td class="num tcol">' + fmt(S.words(p)) + '</td>' +
      '<td class="num tcol">' + (p.views ? fmt(p.views) : '\u2014') + '</td>' +
      '<td><div class="rowacts">' +
        '<a class="mini" href="' + href + '">View</a>' +
        '<a class="mini" href="write.html?id=' + encodeURIComponent(p.id) + '">Edit</a>' +
        '<button class="mini" data-act="cycle" type="button">Status</button>' +
        '<button class="mini mini--danger" data-act="del" type="button">Delete</button>' +
      '</div></td></tr>';
  }).join('');
}
$('rows').addEventListener('click', function(e){
  var b = e.target.closest('[data-act]'); if (!b) return;
  var id = e.target.closest('tr').getAttribute('data-id');
  var p = S.byId(id); if (!p) return;
  if (b.getAttribute('data-act') === 'cycle') {
    var order = ['Draft','Scheduled','Published'];
    p.status = order[(order.indexOf(p.status) + 1) % order.length];
    S.save();
  } else {
    if (!confirm('Delete \u201c' + (p.title || 'Untitled') + '\u201d? This only affects the demo data.')) return;
    S.remove(id);
  }
  drawRows(); drawOverview();
});
['q','f-kind','f-status'].forEach(function(id){
  $(id).addEventListener('input', drawRows);
  $(id).addEventListener('change', drawRows);
});
Array.prototype.forEach.call(document.querySelectorAll('th[data-sort]'), function(th){
  th.addEventListener('click', function(){
    var k = th.getAttribute('data-sort');
    if (sortKey === k) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortKey = k; sortDir = k === 'date' || k === 'words' || k === 'views' ? 'desc' : 'asc'; }
    Array.prototype.forEach.call(document.querySelectorAll('th[data-sort]'), function(o){
      o.removeAttribute('data-dir'); });
    th.setAttribute('data-dir', sortDir);
    drawRows();
  });
});

/* ---------------------------------------------------------------- calendar */
var calRef = new Date();
function drawCal(){
  var y = calRef.getFullYear(), m = calRef.getMonth();
  $('mlabel').textContent = calRef.toLocaleDateString('en-US',
    { month:'long', year:'numeric' });
  var first = new Date(y, m, 1), start = new Date(first);
  start.setDate(1 - first.getDay());
  var byDate = {};
  S.load().forEach(function(p){ (byDate[p.date] = byDate[p.date] || []).push(p); });

  var today = new Date().toISOString().slice(0,10);
  var html = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    .map(function(d){ return '<div class="dow">' + d + '</div>'; }).join('');
  for (var i = 0; i < 42; i++) {
    var d = new Date(start); d.setDate(start.getDate() + i);
    var key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') +
              '-' + String(d.getDate()).padStart(2,'0');
    var evs = byDate[key] || [];
    html += '<div class="day' + (d.getMonth() !== m ? ' out' : '') +
      (key === today ? ' today' : '') + '"><em>' + d.getDate() + '</em>' +
      evs.map(function(p){
        return '<a class="ev ' + p.status.toLowerCase() + '" title="' + esc(p.title) +
          '" href="write.html?id=' + encodeURIComponent(p.id) + '">' +
          esc(p.title || 'Untitled') + '</a>'; }).join('') + '</div>';
  }
  $('cal').innerHTML = html;
}
$('prevm').addEventListener('click', function(){ calRef.setMonth(calRef.getMonth()-1); drawCal(); });
$('nextm').addEventListener('click', function(){ calRef.setMonth(calRef.getMonth()+1); drawCal(); });

/* ---------------------------------------------------------------- health */
function drawHealth(){
  var h = S.health();
  $('healthlist').innerHTML = h.length ? h.map(function(x){
    return '<div class="issue"><div><b>' + esc(x.post.title || 'Untitled') + '</b>' +
      '<div class="flags">' + x.issues.map(function(i){
        return '<span class="flag">' + i + '</span>'; }).join('') + '</div></div>' +
      '<a class="mini" href="write.html?id=' + encodeURIComponent(x.post.id) + '">Fix</a></div>';
  }).join('') : '<div class="empty">Every post has a title, hero, standfirst and tags.</div>';
}

/* ---------------------------------------------------------------- media */
function drawMedia(){
  var use = {};
  S.load().forEach(function(p){ if (p.hero) use[p.hero] = (use[p.hero]||0) + 1; });
  var imgs = MC.recipes.map(function(r){ return { src:r.img, name:r.title }; });
  Object.keys(use).forEach(function(src){
    if (!imgs.some(function(i){ return i.src === src; })) imgs.push({ src:src, name:src.split('/').pop() });
  });
  $('n-media').textContent = imgs.length;
  $('mgrid').innerHTML = imgs.map(function(i){
    var n = use[i.src] || 0;
    return '<figure class="mcell"><img src="' + i.src + '" alt="" loading="lazy">' +
      '<figcaption>' + esc(i.name) + (n ? ' \u00b7 used ' + n + '\u00d7' : ' \u00b7 unused') +
      '</figcaption></figure>';
  }).join('');
}

/* ---------------------------------------------------------------- tags */
function drawTags(){
  var t = S.tagCounts();
  $('n-tags').textContent = t.length;
  $('taglist').innerHTML = t.map(function(x){
    return '<span class="tagchip">' + esc(x.tag) + '<b>' + x.n + '</b></span>'; }).join('');
}

/* ---------------------------------------------------------------- boot */
$('reseed').addEventListener('click', function(e){
  e.preventDefault();
  if (!confirm('Reset the demo Journal back to its seeded state?')) return;
  S.reset(); drawAll();
});
function drawAll(){ drawOverview(); drawRows(); drawHealth(); drawMedia(); drawTags(); drawCal(); }
drawAll();
show(location.hash.replace('#',''));
'''


# ===========================================================================
def build(emit):
    emit('rubs.html', 'The Lineup — Meat Church BBQ',
         'All sixteen Meat Church rubs and seasonings, plus the multi-packs.',
         RUBS_CSS, RUBS_BODY, RUBS_JS)

    emit('rub.html', 'Holy Cow BBQ Rub — Meat Church BBQ',
         'One blend, every size, and the recipes that use it.',
         RUB_CSS, RUB_BODY, RUB_JS)

    emit('journal.html', 'The Journal — Meat Church BBQ',
         'Recipes, stories and cook notes from Meat Church.',
         JOURNAL_CSS, JOURNAL_BODY, JOURNAL_JS, scripts=('store.js',))

    emit('recipe.html', 'Hatch Chile Brisket Dip — Meat Church BBQ',
         'Smoked brisket, roasted Hatch chiles and loads of melted cheese.',
         ARTICLE_CSS, RECIPE_BODY, RECIPE_JS)

    emit('story.html', 'Why we trim a brisket the way we do — Meat Church BBQ',
         'A sample long-form Journal post showing the article layout.',
         ARTICLE_CSS, STORY_BODY, STORY_JS, scripts=('store.js',))

    emit('write.html', 'Journal Studio — Meat Church BBQ',
         'Write, structure and publish recipes and stories.',
         WRITE_CSS, WRITE_BODY, WRITE_JS, scripts=('store.js',))

    emit('admin.html', 'Journal Admin — Meat Church BBQ',
         'Editorial dashboard for the Meat Church Journal.',
         ADMIN_CSS, ADMIN_BODY, ADMIN_JS, scripts=('store.js',))
