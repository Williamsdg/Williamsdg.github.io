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

JOURNAL_JS = '''
/* Three sample stories sit alongside the real recipe archive so the Journal's
   long-form side is visible. They are flagged as samples everywhere they appear. */
MC.stories = [
  { slug:'trim-day', title:'Why we trim a brisket the way we do',
    img:'img/recipe/tri-tip-smoked-like-a-brisket.jpg', tags:['Technique','Beef'],
    dek:'Fat you leave on, fat you take off, and the one cut that decides how the whole thing cooks.' },
  { slug:'fire-management', title:'Fire management is the part nobody films',
    img:'img/recipe/beef-back-party-ribs.jpg', tags:['Technique','Fire'],
    dek:'A clean fire does more for flavor than any rub. Here is how we keep one for twelve hours.' },
  { slug:'first-cook', title:'What your first bad cook is actually teaching you',
    img:'img/recipe/pork-butt-cooked-like-whole-hog.jpg', tags:['Notes'],
    dek:'Everyone ruins a brisket. The useful question is which part you got wrong.' }
];

var ALL = MC.recipes.map(function(r){
      return { kind:'Recipe', slug:r.slug, title:r.title, img:r.img, tags:r.tags,
               dek:'', href:'recipe.html#' + r.slug, sample:false };
    }).concat(MC.stories.map(function(s){
      return { kind:'Story', slug:s.slug, title:s.title, img:s.img, tags:s.tags,
               dek:s.dek, href:'story.html#' + s.slug, sample:true };
    }));

/* interleave so stories are not all stranded at the end */
var mixed = [];
var recs = ALL.filter(function(x){ return x.kind === 'Recipe'; });
var tales = ALL.filter(function(x){ return x.kind === 'Story'; });
recs.forEach(function(r, i){
  mixed.push(r);
  if (i === 2 || i === 8 || i === 15) { var t = tales.shift(); if (t) mixed.push(t); }
});
tales.forEach(function(t){ mixed.push(t); });

var active = 'All', shown = 9;
var tags = ['All','Recipes','Stories'].concat(
  MC.recipes.reduce(function(a,r){
    r.tags.forEach(function(t){ if (a.indexOf(t) < 0) a.push(t); }); return a;
  }, []).sort());

var filters = document.getElementById('filters');
tags.forEach(function(t){
  var b = document.createElement('button');
  b.className = 'chip'; b.type = 'button'; b.textContent = t;
  b.setAttribute('aria-pressed', t === active);
  b.addEventListener('click', function(){ active = t; shown = 9; render(); });
  filters.appendChild(b);
});
var count = document.createElement('span');
count.className = 'count'; filters.appendChild(count);

function match(x){
  if (active === 'All') return true;
  if (active === 'Recipes') return x.kind === 'Recipe';
  if (active === 'Stories') return x.kind === 'Story';
  return x.tags.indexOf(active) > -1;
}

function card(x){
  var a = document.createElement('a');
  a.className = 'card'; a.href = x.href;
  a.innerHTML = '<div class="card-media"><img src="' + x.img + '" alt="" loading="lazy"></div>' +
    '<div class="card-body"><div class="tagrow">' +
    '<span class="kind kind--' + x.kind.toLowerCase() + '">' + x.kind + '</span>' +
    (x.sample ? '<span class="kind kind--sample">Sample</span>' : '') +
    x.tags.slice(0,2).map(function(t){ return '<span class="tag">' + t + '</span>'; }).join('') +
    '</div><h3>' + x.title + '</h3>' +
    (x.dek ? '<p class="muted" style="margin:0;font-size:15px">' + x.dek + '</p>' : '') +
    '</div>';
  return a;
}

function render(){
  Array.prototype.forEach.call(filters.querySelectorAll('.chip'), function(c){
    c.setAttribute('aria-pressed', c.textContent === active);
  });
  var list = mixed.filter(match);
  count.textContent = list.length + ' post' + (list.length === 1 ? '' : 's');

  var f = document.getElementById('feature');
  var lead = list[0];
  if (lead) {
    f.style.display = '';
    f.href = lead.href;
    f.innerHTML = '<img src="' + lead.img + '" alt="">' +
      '<div class="jfeature-body"><div class="tagrow">' +
      '<span class="kind kind--' + lead.kind.toLowerCase() + '">' + lead.kind + '</span>' +
      (lead.sample ? '<span class="kind kind--sample">Sample</span>' : '') +
      '</div><h2>' + lead.title + '</h2>' +
      '<p class="lede" style="margin:0">' + (lead.dek ||
        'Open the full write-up — ingredients, temps and every step.') + '</p></div>';
  } else { f.style.display = 'none'; }

  var g = document.getElementById('jgrid');
  g.innerHTML = '';
  list.slice(1, shown).forEach(function(x){ g.appendChild(card(x)); });
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
@media (max-width:980px){.abody{grid-template-columns:1fr}.rail{position:static}}
'''

RECIPE_BODY = '''
<article>
<section class="ahero">
  <div class="ahero-bg"><img src="img/recipe/hatch-chile-brisket-dip.jpg" alt=""></div>
  <div class="ahero-in wrap">
    <p class="crumbs"><a href="index.html">Home</a> &nbsp;/&nbsp;
      <a href="journal.html">Journal</a> &nbsp;/&nbsp; Recipe</p>
    <h1>Hatch Chile Brisket Dip</h1>
    <dl class="ameta">
      <div><dt>Pit temp</dt><dd>350&deg;F</dd></div>
      <div><dt>Cook time</dt><dd>45 min</dd></div>
      <div><dt>Vessel</dt><dd>12" cast iron</dd></div>
      <div><dt>Category</dt><dd>Appetizer</dd></div>
    </dl>
  </div>
</section>

<div class="wrap">
  <div class="abody">
    <div class="prose">
      <p class="lede">Smoked brisket, roasted Hatch chiles and loads of melted cheese come together to
        make this the ultimate game-day favorite. Football season calls for a killer smoked dip,
        and this one checks every box.</p>
      <p>We start with softened cream cheese and mix in roasted Hatch green chiles, chopped brisket,
        and cream of poblano soup to make this dip ridiculously rich and creamy. Then we load the top
        with a generous pile of freshly shredded cheese and bake the whole thing until it is hot,
        bubbly and perfectly melted.</p>
      <p>This is an easy way to put leftover brisket to work, and the perfect dip for college football
        Saturdays, NFL Sundays, tailgates, or any game-day party.</p>

      <h2>Ingredients</h2>
      <ul class="ings" id="ings">
        <li><input type="checkbox"><span>1 lb smoked chopped brisket</span></li>
        <li><input type="checkbox"><span>16 oz softened cream cheese</span></li>
        <li><input type="checkbox"><span>8 oz chopped Hatch chiles</span></li>
        <li><input type="checkbox"><span>&frac12; of a diced sweet onion</span></li>
        <li><input type="checkbox"><span>1 can cream of poblano soup</span></li>
        <li><input type="checkbox"><span>2 C shredded Monterey Jack cheese</span></li>
        <li><input type="checkbox"><span>1 C shredded cheddar cheese</span></li>
        <li><input type="checkbox"><span>1 sliced jalape&ntilde;o</span></li>
        <li><input type="checkbox"><span>2 T minced cilantro</span></li>
        <li><input type="checkbox"><span>5 oz queso fresco</span></li>
        <li><input type="checkbox"><span>Meat Church Garlic &amp; Jalape&ntilde;o BLANCO, to taste</span></li>
        <li><input type="checkbox"><span>Tortilla chips, for serving</span></li>
      </ul>

      <h2>Method</h2>
      <ol class="steps">
        <li><div><h3>Prepare your pellet grill</h3>
          <p>Set your pellet grill to 350&deg;F. We used pecan and cherry pellets.</p></div></li>
        <li><div><h3>Compile the dip</h3>
          <p>This fits a 12 inch cast iron skillet or a half foil pan. Press the cream cheese into the
            bottom of the skillet. Follow with the Hatch chiles, onion, brisket and cream of poblano
            soup in that order. Season evenly with Garlic &amp; Jalape&ntilde;o BLANCO. Add the shredded
            cheese and top with the sliced jalape&ntilde;o.</p></div></li>
        <li><div><h3>Smoke</h3>
          <p>Place in the center of the grill for 45 minutes, or until the cheese is completely melted.</p></div></li>
        <li><div><h3>Garnish</h3>
          <p>Garnish with minced cilantro and queso fresco.</p></div></li>
        <li><div><h3>Serve</h3>
          <p>Let it cool for ten minutes. Dip with tortilla chips and enjoy alongside a cold beer.</p></div></li>
      </ol>
    </div>

    <aside class="rail">
      <div class="railbox">
        <h4>Seasoning used</h4>
        <div id="used"></div>
      </div>
      <div class="railbox">
        <h4>Cook at a glance</h4>
        <dl class="ameta" style="margin:0;padding:0;border:0;gap:18px">
          <div><dt>Pit temp</dt><dd>350&deg;F</dd></div>
          <div><dt>Time</dt><dd>45 min</dd></div>
          <div><dt>Rest</dt><dd>10 min</dd></div>
        </dl>
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
'''

RECIPE_JS = '''
/* ingredient ticking — click anywhere on the row */
Array.prototype.forEach.call(document.querySelectorAll('#ings li'), function(li){
  var box = li.querySelector('input');
  function sync(){ li.classList.toggle('got', box.checked); }
  li.addEventListener('click', function(e){
    if (e.target !== box) box.checked = !box.checked;
    sync();
  });
  box.addEventListener('change', sync);
});

/* the rub this recipe actually calls for */
var used = MC.rubs.filter(function(r){ return r.h === 'garlic-jalapeno-blanco'; });
var ubox = document.getElementById('used');
used.forEach(function(r){
  var a = document.createElement('a');
  a.className = 'usedrub'; a.href = 'rub.html#' + r.h;
  a.innerHTML = '<img src="' + r.img + '" alt=""><div><b>' + r.name +
    '</b><span>From $' + r.price + '</span></div>';
  ubox.appendChild(a);
});

function mini(x){
  var a = document.createElement('a');
  a.className = 'usedrub'; a.href = 'recipe.html#' + x.slug;
  a.innerHTML = '<img src="' + x.img + '" alt="" style="width:52px;height:40px;object-fit:cover">' +
    '<div><b style="font-size:15px;line-height:1.1">' + x.title + '</b></div>';
  return a;
}
var rel = MC.recipes.filter(function(x){
  return x.slug !== 'hatch-chile-brisket-dip' && x.tags.indexOf('Beef') > -1;
}).slice(0,4);
var rbox = document.getElementById('related');
rel.forEach(function(x){ rbox.appendChild(mini(x)); });

var m3 = document.getElementById('more3');
MC.recipes.filter(function(x){ return x.slug !== 'hatch-chile-brisket-dip'; })
  .slice(3,6).forEach(function(x){
    var a = document.createElement('a');
    a.className = 'card'; a.href = 'recipe.html#' + x.slug;
    a.innerHTML = '<div class="card-media" style="aspect-ratio:16/10">' +
      '<img src="' + x.img + '" alt="" loading="lazy"></div><div class="card-body">' +
      '<div class="tagrow">' + x.tags.map(function(t){
        return '<span class="tag">' + t + '</span>'; }).join('') +
      '</div><h3>' + x.title + '</h3></div>';
    m3.appendChild(a);
  });
'''


# ===========================================================================
# 5. story.html — the long-form side of the Journal (sample content)
# ===========================================================================
STORY_BODY = '''
<article>
<section class="ahero">
  <div class="ahero-bg"><img src="img/hero/tri-tip-smoked-like-a-brisket.jpg" alt=""></div>
  <div class="ahero-in wrap">
    <p class="crumbs"><a href="index.html">Home</a> &nbsp;/&nbsp;
      <a href="journal.html">Journal</a> &nbsp;/&nbsp; Story</p>
    <h1>Why we trim a brisket the way we do</h1>
    <dl class="ameta">
      <div><dt>Written by</dt><dd>Sample author</dd></div>
      <div><dt>Reading</dt><dd>6 min</dd></div>
      <div><dt>Filed under</dt><dd>Technique</dd></div>
    </dl>
  </div>
</section>

<div class="wrap">
  <div class="abody">
    <div class="prose">
      <div class="samplebar"><strong>Sample post.</strong> Written by Williams Digital to show the
        Journal&rsquo;s long-form layout — headings, pull quotes, inline images and the seasoning rail.
        Nothing here is Meat Church editorial.</div>

      <p class="lede">A brisket tells you how it wants to be cooked before you ever light the fire.
        The trim is where you listen.</p>
      <p>Most people trim a brisket to make it look tidy. Tidy is not the goal. The goal is a piece of
        meat that cooks evenly from the thin end to the thick end, holds enough fat to stay honest
        through a long cook, and gives the smoke somewhere to sit.</p>

      <h2>Start with the fat cap</h2>
      <p>Take the cap down to a quarter inch and stop. Any less and the flat dries out before the point
        is ready. Any more and you end up with a greasy band under the bark that never renders. A
        quarter inch is not a tradition, it is a compromise — enough insulation to protect the flat,
        thin enough to render clean.</p>

      <blockquote class="pull">Trim for how it will cook, not for how it looks on the board.</blockquote>

      <h2>The deckle is the decision</h2>
      <p>The hard seam of fat between the point and the flat is the one place where trimming actually
        changes the cook. Leave too much and the two muscles finish hours apart. Take too much and the
        point loses the thing that makes it worth eating.</p>
      <p>Square the edges last. Round every corner that would otherwise burn, and keep the thin end of
        the flat thick enough to survive. If the tip is thinner than your finger, it is going to be
        jerky by the time the point is probe tender — take it off now and put it in the chili.</p>

      <h2>Then season like you mean it</h2>
      <p>Trim, then season, then let it sit while the pit comes up to temperature. A coarse Texas-style
        rub wants surface to hold on to. That surface is exactly what you just spent twenty minutes
        building.</p>
      <p>None of this is complicated. It is just the part of the cook that happens before anyone is
        watching, which is why it is the part most people skip.</p>
    </div>

    <aside class="rail">
      <div class="railbox">
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
'''

STORY_JS = '''
var used = MC.rubs.filter(function(r){
  return ['holy-cow-rub','blanco-steak-and-everything-else-seasoning'].indexOf(r.h) > -1;
});
var ubox = document.getElementById('used');
used.forEach(function(r){
  var a = document.createElement('a');
  a.className = 'usedrub'; a.href = 'rub.html#' + r.h;
  a.innerHTML = '<img src="' + r.img + '" alt=""><div><b>' + r.name +
    '</b><span>From $' + r.price + '</span></div>';
  ubox.appendChild(a);
});

var rbox = document.getElementById('related');
MC.recipes.filter(function(x){ return x.tags.indexOf('Beef') > -1; }).slice(0,4).forEach(function(x){
  var a = document.createElement('a');
  a.className = 'usedrub'; a.href = 'recipe.html#' + x.slug;
  a.innerHTML = '<img src="' + x.img + '" alt="" style="width:52px;height:40px;object-fit:cover">' +
    '<div><b style="font-size:15px;line-height:1.1">' + x.title + '</b></div>';
  rbox.appendChild(a);
});

var m3 = document.getElementById('more3');
MC.recipes.slice(6,9).forEach(function(x){
  var a = document.createElement('a');
  a.className = 'card'; a.href = 'recipe.html#' + x.slug;
  a.innerHTML = '<div class="card-media" style="aspect-ratio:16/10">' +
    '<img src="' + x.img + '" alt="" loading="lazy"></div><div class="card-body">' +
    '<div class="tagrow">' + x.tags.map(function(t){
      return '<span class="tag">' + t + '</span>'; }).join('') +
    '</div><h3>' + x.title + '</h3></div>';
  m3.appendChild(a);
});
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
.plist{padding:10px 0}
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
      <button class="btn btn--sm btn--fire" id="new" type="button">New</button>
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
        <button class="addrow" type="button" data-add="ing">+ Add ingredient</button>
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
/* ------------------------------------------------------------------ store */
var KEY = 'mc-journal-v1';
function seed(){
  return [
    { id:'p1', kind:'Recipe', status:'Published', date:'2026-09-08',
      title:'Hatch Chile Brisket Dip',
      dek:'Smoked brisket, roasted Hatch chiles and loads of melted cheese. Football season calls for a killer smoked dip.',
      hero:'img/recipe/hatch-chile-brisket-dip.jpg', tags:'Beef, Tailgating, Appetizer',
      temp:'350°F', time:'45 min', serves:'8', vessel:'12" cast iron',
      rubs:['garlic-jalapeno-blanco'],
      ings:['1 lb smoked chopped brisket','16 oz softened cream cheese','8 oz chopped Hatch chiles',
            '1 can cream of poblano soup','2 C shredded Monterey Jack','1 sliced jalapeño'],
      steps:['Set your pellet grill to 350°F.',
             'Press the cream cheese into a 12 inch cast iron skillet, then layer the chiles, onion, brisket and soup. Season with Garlic & Jalapeño BLANCO and top with cheese.',
             'Smoke for 45 minutes until the cheese is completely melted.',
             'Garnish with cilantro and queso fresco, rest ten minutes, serve with chips.'],
      body:'This is an easy way to put leftover brisket to work, and the perfect dip for college football Saturdays, NFL Sundays, tailgates, or any game-day party.' },
    { id:'p2', kind:'Story', status:'Scheduled', date:'2026-09-24',
      title:'Why we trim a brisket the way we do',
      dek:'Fat you leave on, fat you take off, and the one cut that decides how the whole thing cooks.',
      hero:'img/recipe/tri-tip-smoked-like-a-brisket.jpg', tags:'Technique, Beef',
      temp:'', time:'', serves:'', vessel:'', rubs:['holy-cow-rub'], ings:[], steps:[],
      body:'## Start with the fat cap\nTake the cap down to a quarter inch and stop. Any less and the flat dries out before the point is ready.\n\n## The deckle is the decision\nThe hard seam of fat between the point and the flat is the one place where trimming actually changes the cook.' },
    { id:'p3', kind:'Recipe', status:'Draft', date:'2026-09-18',
      title:'', dek:'', hero:'img/recipe/beef-back-party-ribs.jpg', tags:'',
      temp:'', time:'', serves:'', vessel:'', rubs:[], ings:[''], steps:[''], body:'' }
  ];
}
var posts, cur;
try { posts = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch(e){ posts = seed(); }
if (!posts.length) posts = seed();
function persist(){ try { localStorage.setItem(KEY, JSON.stringify(posts)); } catch(e){} }

/* ------------------------------------------------------------------ dom */
var $ = function(id){ return document.getElementById(id); };
var F = { title:$('f-title'), dek:$('f-dek'), temp:$('f-temp'), time:$('f-time'),
          serves:$('f-serves'), vessel:$('f-vessel'), tags:$('f-tags'),
          status:$('f-status'), date:$('f-date'), body:$('f-body') };

function slugify(s){
  return (s || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g,'-')
    .replace(/^-|-$/g,'').slice(0,60) || 'untitled';
}

/* ------------------------------------------------------------------ list */
function drawList(){
  var box = $('plist'); box.innerHTML = '';
  posts.forEach(function(p){
    var b = document.createElement('button');
    b.className = 'pitem'; b.type = 'button';
    b.setAttribute('aria-current', p.id === cur.id);
    b.innerHTML = '<b>' + (p.title || 'Untitled post') + '</b>' +
      '<span><i class="dot dot--' + p.status.toLowerCase() + '"></i>' +
      p.status + ' &middot; ' + p.kind + ' &middot; ' + p.date + '</span>';
    b.addEventListener('click', function(){ pull(); load(p); });
    box.appendChild(b);
  });
}

/* ------------------------------------------------------------------ pickers */
var HEROES = MC.recipes.slice(0, 18);
function drawHero(){
  var box = $('heropick'); box.innerHTML = '';
  HEROES.forEach(function(r){
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-pressed', cur.hero === r.img);
    b.title = r.title;
    b.innerHTML = '<img src="' + r.img + '" alt="' + r.title + '">';
    b.addEventListener('click', function(){ cur.hero = r.img; drawHero(); glance(); });
    box.appendChild(b);
  });
}
function drawRubs(){
  var box = $('rubpick'); box.innerHTML = '';
  MC.rubs.forEach(function(r){
    var on = cur.rubs.indexOf(r.h) > -1;
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-pressed', on);
    b.innerHTML = '<img src="' + r.img + '" alt=""><span>' + r.name + '</span>';
    b.addEventListener('click', function(){
      var i = cur.rubs.indexOf(r.h);
      if (i > -1) cur.rubs.splice(i,1); else cur.rubs.push(r.h);
      drawRubs();
    });
    box.appendChild(b);
  });
}

/* ------------------------------------------------------------------ repeatable rows */
function drawRows(which){
  var box = which === 'ing' ? $('ingrows') : $('steprows');
  var arr = which === 'ing' ? cur.ings : cur.steps;
  box.innerHTML = '';
  arr.forEach(function(v, i){
    var row = document.createElement('div');
    row.className = 'row';
    var field = which === 'ing'
      ? '<input value="" placeholder="1 lb smoked chopped brisket">'
      : '<textarea placeholder="Describe the step."></textarea>';
    row.innerHTML = '<span class="n">' + (i+1) + '</span>' + field +
      '<button class="x" type="button" aria-label="Remove">&times;</button>';
    var input = row.querySelector('input, textarea');
    input.value = v;
    input.addEventListener('input', function(){ arr[i] = input.value; glance(); });
    row.querySelector('.x').addEventListener('click', function(){
      arr.splice(i,1); if (!arr.length) arr.push(''); drawRows(which); glance();
    });
    box.appendChild(row);
  });
}
Array.prototype.forEach.call(document.querySelectorAll('[data-add]'), function(b){
  b.addEventListener('click', function(){
    var w = b.getAttribute('data-add');
    (w === 'ing' ? cur.ings : cur.steps).push('');
    drawRows(w); glance();
  });
});

/* ------------------------------------------------------------------ kind */
Array.prototype.forEach.call(document.querySelectorAll('#kind button'), function(b){
  b.addEventListener('click', function(){
    cur.kind = b.getAttribute('data-k');
    syncKind(); glance();
  });
});
function syncKind(){
  Array.prototype.forEach.call(document.querySelectorAll('#kind button'), function(b){
    b.setAttribute('aria-pressed', b.getAttribute('data-k') === cur.kind);
  });
  var recipe = cur.kind === 'Recipe';
  ['cookbox','ingbox','stepbox'].forEach(function(id){ $(id).hidden = !recipe; });
  $('edhead').textContent = 'Editing ' + cur.kind.toLowerCase();
}

/* ------------------------------------------------------------------ load / pull */
function load(p){
  cur = p;
  F.title.value = p.title; F.dek.value = p.dek; F.temp.value = p.temp;
  F.time.value = p.time; F.serves.value = p.serves; F.vessel.value = p.vessel;
  F.tags.value = p.tags; F.status.value = p.status; F.date.value = p.date;
  F.body.value = p.body;
  if (!cur.ings.length) cur.ings = [''];
  if (!cur.steps.length) cur.steps = [''];
  syncKind(); drawHero(); drawRubs(); drawRows('ing'); drawRows('step');
  drawList(); glance();
}
function pull(){
  if (!cur) return;
  cur.title = F.title.value; cur.dek = F.dek.value; cur.temp = F.temp.value;
  cur.time = F.time.value; cur.serves = F.serves.value; cur.vessel = F.vessel.value;
  cur.tags = F.tags.value; cur.status = F.status.value; cur.date = F.date.value;
  cur.body = F.body.value;
}

/* ------------------------------------------------------------------ glance + seo */
function glance(){
  pull();
  var words = (cur.body + ' ' + cur.dek + ' ' + cur.steps.join(' '))
    .trim().split(/\s+/).filter(Boolean).length;
  $('g-kind').textContent = cur.kind;
  $('g-words').textContent = words;
  $('g-read').textContent = Math.max(1, Math.round(words / 200)) + ' min';
  $('g-ings').textContent = cur.ings.filter(Boolean).length;
  $('g-steps').textContent = cur.steps.filter(Boolean).length;
  $('g-slug').textContent = slugify(cur.title);
  $('s-title').textContent = cur.title || 'Untitled post';
  $('s-slug').textContent = slugify(cur.title);
  $('s-desc').textContent = cur.dek || 'Add a standfirst and it will show up here.';
  drawList();
}
Object.keys(F).forEach(function(k){
  F[k].addEventListener('input', glance);
  F[k].addEventListener('change', glance);
});

/* ------------------------------------------------------------------ new / save */
$('new').addEventListener('click', function(){
  pull();
  var p = { id:'p' + Date.now(), kind:'Recipe', status:'Draft',
            date:new Date().toISOString().slice(0,10), title:'', dek:'',
            hero:MC.recipes[0].img, tags:'', temp:'', time:'', serves:'', vessel:'',
            rubs:[], ings:[''], steps:[''], body:'' };
  posts.unshift(p); persist(); load(p);
  F.title.focus();
});
$('save').addEventListener('click', function(){
  pull(); persist();
  var m = $('savedmsg');
  m.textContent = 'Saved · ' + new Date().toLocaleTimeString();
  m.classList.add('on');
  setTimeout(function(){ m.classList.remove('on'); }, 2200);
  drawList();
});

/* ------------------------------------------------------------------ preview */
function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
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
    var w = (cur.body||'').trim().split(/\s+/).filter(Boolean).length;
    meta.push(['Reading', Math.max(1, Math.round(w/200)) + ' min']);
  }
  var ings = cur.ings.filter(Boolean), steps = cur.steps.filter(Boolean);
  var rubs = MC.rubs.filter(function(r){ return cur.rubs.indexOf(r.h) > -1; });

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
      (ings.length ? '<h2>Ingredients</h2><ul class="ings">' + ings.map(function(i){
        return '<li><input type="checkbox"><span>' + esc(i) + '</span></li>'; }).join('') + '</ul>' : '') +
      (steps.length ? '<h2>Method</h2><ol class="steps">' + steps.map(function(s){
        return '<li><div><p>' + esc(s) + '</p></div></li>'; }).join('') + '</ol>' : '') +
    '</div><aside class="rail">' +
      (rubs.length ? '<div class="railbox"><h4>Seasoning used</h4>' + rubs.map(function(r){
        return '<a class="usedrub" href="rub.html#' + r.h + '"><img src="' + r.img +
          '" alt=""><div><b>' + r.name + '</b><span>From $' + r.price + '</span></div></a>';
      }).join('') + '</div>' : '') +
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

load(posts[0]);
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
         JOURNAL_CSS, JOURNAL_BODY, JOURNAL_JS)

    emit('recipe.html', 'Hatch Chile Brisket Dip — Meat Church BBQ',
         'Smoked brisket, roasted Hatch chiles and loads of melted cheese.',
         ARTICLE_CSS, RECIPE_BODY, RECIPE_JS)

    emit('story.html', 'Why we trim a brisket the way we do — Meat Church BBQ',
         'A sample long-form Journal post showing the article layout.',
         ARTICLE_CSS, STORY_BODY, STORY_JS)

    emit('write.html', 'Journal Studio — Meat Church BBQ',
         'Write, structure and publish recipes and stories.',
         WRITE_CSS, WRITE_BODY, WRITE_JS)
