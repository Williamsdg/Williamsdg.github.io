#!/usr/bin/env python3
"""Builds /journal/ and its article pages from POSTS below.
Header, drawer, footer and dock are lifted from index.html so every page stays in sync.
Run from this folder: python3 _build_journal.py"""
import os, re, html
from datetime import date

ROOT = os.path.dirname(os.path.abspath(__file__))
HOME = open(os.path.join(ROOT, 'index.html')).read()
V = '4'  # cache-buster for site.css / site.js

def chunk(pattern):
    return re.search(pattern, HOME, re.S).group(0)

HEADER = chunk(r'<header class="nav".*?</header>')
DRAWER = chunk(r'<nav class="drawer".*?</nav>')
FOOTER = chunk(r'<footer>.*?</footer>')
DOCK = chunk(r'<nav class="dock".*?</nav>')

def rebase(fragment, p):
    """Point same-page anchors and relative assets at the homepage from a sub-folder."""
    fragment = re.sub(r'href="#(\w*)"', lambda m: f'href="{p}#{m.group(1)}"' if m.group(1) else f'href="{p}"', fragment)
    fragment = re.sub(r'src="img/', f'src="{p}img/', fragment)
    fragment = fragment.replace(f'href="{p}#top"', f'href="{p}"')
    return fragment

def chrome(p):
    h = rebase(HEADER, p)
    # mark Journal as current
    h = h.replace(f'href="{p}#journal">Journal', f'href="{p}journal/" aria-current="page" style="color:var(--gold);opacity:1">Journal')
    return h, rebase(DRAWER, p).replace(f'href="{p}#journal"', f'href="{p}journal/"'), rebase(FOOTER, p).replace(f'href="{p}#journal"', f'href="{p}journal/"'), rebase(DOCK, p)

def page(p, title, desc, body, extra_js=''):
    header, drawer, footer, dock = chrome(p)
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#121413">
<link rel="icon" href="{p}img/logo-ink.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{p}site.css?v={V}">
</head>
<body>

{header}

{drawer}

<main id="top">
{body}
</main>

{footer}

{dock}

<script src="{p}site.js?v={V}"></script>
{extra_js}
</body>
</html>
'''

# ---------------------------------------------------------------------------
# Content. Shop posts are written only from facts the shop (or the press about
# it) has already published — no invented quotes, prices or events.
# ---------------------------------------------------------------------------
SHOP, NEWS, GUIDE = 'From the Shop', 'In the News', 'Kitchen Guide'

POSTS = [
  dict(kind='shop', slug='best-butcher-shop-in-alabama', cat=SHOP, date=date(2026,7,30),
       title='Named the best butcher shop in Alabama',
       dek='Tasting Table went state by state looking for the country’s best butcher counters. Alabama’s pick was ours.',
       img='storefront', alt='The Son of a Butcher storefront on 3rd Avenue South',
       body='''
<p>This summer, Tasting Table published <em>The Best Butcher Shop in Every State</em> — fifty counters chosen for national and local awards, competition wins and what their own customers say about them. For Alabama, they picked The Son of a Butcher.</p>
<blockquote>“This butcher shop puts a premium on knowing the cattle ranchers, fishermen, and cheesemongers who provide the goods, and is praised for its freshly sourced, high-quality food.”<cite>— Tasting Table</cite></blockquote>
<p>That line means a lot to us, because it’s the whole reason the shop exists. We buy from small, family-run operations where we know the cattle buyer and the people who own the boats. Tasting Table also noted our 2026 Quality Business Award.</p>
<p>AL.com and Bham Now picked up the story that same week. AL.com reminded readers that three brothers, Addam, Chase and Hunter Evans, founded the shop in 2020.</p>
<h2>Thank you, Birmingham</h2>
<p>Lists are nice, but the counter is where it counts. Thank you to everyone who has come in to ask what’s good, trusted us with a holiday roast or grabbed a sammie before they ran out. Come by Pepper Place and say hey.</p>
<p class="note">Read the coverage: <a href="https://www.tastingtable.com/2216323/best-butcher-every-state/" target="_blank" rel="noopener">Tasting Table</a> · <a href="https://www.al.com/life/2026/07/homegrown-alabama-butcher-shop-named-as-best-in-state-for-high-quality-family-values.html" target="_blank" rel="noopener">AL.com</a> · <a href="https://bhamnow.com/2026/07/30/birmingham-butcher-shop-best-in-alabama/" target="_blank" rel="noopener">Bham Now</a></p>
'''),
  dict(kind='shop', slug='the-delmonico', cat='From the Counter', date=date(2025,10,20),
       title='The Delmonico: the steakhouse legend hiding in the chuck',
       dek='Once the gold standard of American steakhouses, now one of the best values in our case. Here’s what we cut, and why.',
       img='three-cuts', alt='Three steaks on butcher paper',
       body='''
<p>A century ago the Delmonico was <em>the</em> steak to order. Named for New York’s famous Delmonico’s restaurant, it was a symbol of luxury. Over time the name drifted. Today a “Delmonico” is really a butcher’s call, and the cut changes depending on who’s behind the counter.</p>
<h2>What we mean by Delmonico</h2>
<p>For the last couple of years, our Delmonico has come from a loin that sits on top of the chuck roll. It’s well marbled and eats like a much pricier steak. Food &amp; Wine featured it in a piece about the cut’s history and its comeback as a bargain.</p>
<blockquote>Once the gold standard of steakhouses — and now it’s a bargain.<cite>— Food &amp; Wine</cite></blockquote>
<h2>Why it helps your whole grocery bill</h2>
<p>That muscle usually just gets ground along with the rest of the chuck. Cattle prices keep rising for every butcher in the country. Pulling the loin out and selling it as a steak gives you a great value cut, and it helps us keep the price of our ground beef down.</p>
<p>Jake on the cheese counter lists it as one of his three favorite things in the shop. Ask for it by name, and ask us how thick to cut it.</p>
<p class="note">Read the full story at <a href="https://www.foodandwine.com/delmonico-steak-11829523" target="_blank" rel="noopener">Food &amp; Wine</a>.</p>
'''),
  dict(kind='shop', slug='a-warehouse-full-of-steaks', cat='Our Story', date=date(2025,7,2),
       title='How a warehouse full of steaks became a butcher shop',
       dek='In March 2020 our restaurant sales dropped seventy percent in a week. This is what we did next.',
       img='sourcing-team', alt='The team behind the counter with house provisions',
       body='''
<p>Before there was a storefront, there was Evans Meats. It’s our family’s wholesale company, and it has supplied Birmingham’s best kitchens for years, including chefs like Frank Stitt and Chris Hastings. The whole company was built around one thing: top-notch service and unique, high-quality product for restaurants.</p>
<p>Then came March 2020. Restaurants closed or scrambled to go curbside, and our sales fell seventy percent from an average week. We were sitting on a warehouse full of fresh meat and seafood.</p>
<h2>Curbside, then the back of a truck</h2>
<p>After a day of shock, the team pulled together and built a direct-to-consumer business almost overnight. We broke big cuts down into home-sized portions. We sold curbside at the warehouse and then out of the backs of our delivery trucks at pop-up spots around town.</p>
<blockquote>People wanted the same products that the area’s top restaurants were using.</blockquote>
<p>It was a total hit. So we built a brand and a storefront to bring those same meats, seafood, cheeses and specialty products into your home. The Son of a Butcher opened in Pepper Place in the summer of 2021.</p>
<h2>Why “son of a butcher”?</h2>
<p>Because we are sons of a butcher named Butch. Yes, really. Addam has been in the meat business for twenty years and in seafood for fifteen. He always figured a retail shop would come near the end of his career. 2020 moved the timeline up.</p>
<p class="note">More on our story: <a href="https://soul-grown.com/carving-a-legacy-the-son-of-a-butcher/" target="_blank" rel="noopener">Soul Grown</a> · <a href="https://www.bizjournals.com/birmingham/news/2021/07/02/family-owned-butcher-shop-opens-in-pepper-place.html" target="_blank" rel="noopener">Birmingham Business Journal</a></p>
'''),
  dict(kind='shop', slug='trucks-to-the-gulf', cat='From the Counter', date=date(2025,5,14),
       title='Trucks to the Gulf, several times a week',
       dek='Fresh fish is a business built on trust. Here’s how our fish case gets filled.',
       img='shrimp-raw', alt='A bowl of raw Gulf shrimp',
       body='''
<p>The fresh seafood business is all about trust, so we meet fishermen face to face. A solid relationship with the people on the boats shows us how they work: where they fish, how long the boats stay out and how they store the catch on board.</p>
<p>We keep our fish case stocked mostly from the Gulf of Mexico and the South Atlantic. The Gulf is close, and it has so much to offer: fish, oysters, clams, shrimp and crab. Our trucks run down and back several times a week. The goal is simple: keep it really fresh and keep the variety interesting.</p>
<h2>What’s usually in the case</h2>
<ul>
<li>Fresh Gulf &amp; South Atlantic fish</li>
<li>Gulf shrimp and Gulf blue crab</li>
<li>Gulf Coast, West Coast and Northeast oysters</li>
<li>Florida clams and Maine mussels</li>
<li>North Atlantic sea scallops</li>
<li>Smoked salmon, smoked trout and a selection of caviar</li>
</ul>
<h2>Ask the fishmongers</h2>
<p>Sean will point you to his house-made crab cakes. Rachel will steer you to the tinned fish shelf. And if you catch Emily, ask about the U10 scallops.</p>
'''),

  # press — link out, typographic cards (no borrowed photography)
  dict(kind='news', cat=NEWS, date=date(2026,7,30), src='Bham Now', tone='ox',
       title='Birmingham butcher shop named best in Alabama',
       dek='Bham Now on Tasting Table’s pick, and how the shop grew out of Evans Meats.',
       url='https://bhamnow.com/2026/07/30/birmingham-butcher-shop-best-in-alabama/'),
  dict(kind='news', cat=NEWS, date=date(2026,7,27), src='AL.com', tone='',
       title='Homegrown Alabama butcher shop named as best in state for high quality, family values',
       dek='Founded by brothers Addam, Chase and Hunter Evans, the shop is one of 50 named by Tasting Table.',
       url='https://www.al.com/life/2026/07/homegrown-alabama-butcher-shop-named-as-best-in-state-for-high-quality-family-values.html'),
  dict(kind='news', cat=NEWS, date=date(2026,7,19), src='Tasting Table', tone='gold',
       title='The Best Butcher Shop in Every State',
       dek='Alabama: The Son of a Butcher, praised for knowing the ranchers, fishermen and cheesemakers behind every product.',
       url='https://www.tastingtable.com/2216323/best-butcher-every-state/'),
  dict(kind='news', cat=NEWS, date=date(2025,11,10), src='The Localist', tone='slate', medium='Podcast',
       title='Relationships Come First at Son of a Butcher',
       dek='Carrie Rollwagen talks with Brian McMillan and head cheesemonger John Litzinger.',
       url='https://carrierollwagen.com/podcast-episodes/relationships-come-first-at-son-of-a-butcher/'),
  dict(kind='news', cat=NEWS, date=date(2025,10,15), src='Food & Wine', tone='',
       title='This Historic Steak Was Once the Gold Standard of Steakhouses — and Now It’s a Bargain',
       dek='Why our Delmonico, cut from the top of the chuck roll, is one of the best values in the case.',
       url='https://www.foodandwine.com/delmonico-steak-11829523'),
  dict(kind='news', cat=NEWS, date=date(2025,10,5), src='Soul Grown', tone='ox',
       title='Carving a legacy: the story of The Son of a Butcher',
       dek='From Evans Meats to a Saturday-morning fixture around the corner from The Market at Pepper Place.',
       url='https://soul-grown.com/carving-a-legacy-the-son-of-a-butcher/'),
  dict(kind='news', cat=NEWS, date=date(2021,7,16), src='WBRC Good Day', tone='slate', medium='TV',
       title='The Son of a Butcher now open in Pepper Place',
       dek='Evans Meats opens its first retail location, an old-world butcher shop built around the customer.',
       url='https://www.gooddaylivingal.com/2021/07/16/the-son-of-a-butcher/'),
  dict(kind='news', cat=NEWS, date=date(2021,7,2), src='Birmingham Business Journal', tone='gold',
       title='The Son of a Butcher shop opens in Pepper Place',
       dek='A supplier to chefs like Frank Stitt and Chris Hastings opens a retail shop downtown.',
       url='https://www.bizjournals.com/birmingham/news/2021/07/02/family-owned-butcher-shop-opens-in-pepper-place.html'),

  # guides — undated, link out
  dict(kind='guide', cat=GUIDE, title='Standing rib roasts', dek='Serving sizes, seasoning and cooking technique for prime rib.', img='g-rib-roast', src='Guide',
       url='https://www.foodnetwork.com/how-to/packages/food-network-essentials/everything-to-know-about-prime-rib'),
  dict(kind='guide', cat=GUIDE, title='The perfect holiday turkey', dek='Joyce Farms’ perfected recipe for their heritage bird.', img='g-turkey', src='Recipe',
       url='https://joyce-farms.com/blogs/recipes/perfect-heritage-black-turkey'),
  dict(kind='guide', cat=GUIDE, title='How to brine a turkey', dek='Our butchers walk through the brine kit, start to finish.', img='g-brine', src='Video',
       url='https://www.instagram.com/reel/DCcCvWWRFPt/'),
  dict(kind='guide', cat=GUIDE, title='Polanco caviar', dek='Flavor, size, color and consistency: what we look for in a tin.', img='g-caviar', src='Read',
       url='https://polancocaviar.com/'),
  dict(kind='guide', cat=GUIDE, title='Carving a spiral ham', dek='Tips from Nueske’s on preparing and carving your ham.', img='g-ham', src='Video',
       url='https://www.youtube.com/watch?v=oCtMFPR-IbI'),
  dict(kind='guide', cat=GUIDE, title='Serving Ebenezer', dek='Turn a cold wheel into the most prized hors d’oeuvre in the room.', img='g-ebenezer', src='Tutorial',
       url='https://www.sequatchiecovecheese.com/ebenezer'),
]

def fdate(d): return d.strftime('%b %-d, %Y')
def iso(d): return d.isoformat()
def words(s): return len(re.sub('<[^>]+>', ' ', s).split())
FILTER = {'shop': 'shop', 'news': 'news', 'guide': 'guide'}

def card(post, p, lazy=True):
    """Card for the index/related grids. p = prefix to the journal folder."""
    k = post['kind']
    ld = ' loading="lazy"' if lazy else ''
    if k == 'shop':
        return f'''<a class="card rv" data-kind="shop" href="{p}{post['slug']}/">
  <figure><img src="{p}../img/{post['img']}.webp" alt="{html.escape(post['alt'])}"{ld}></figure>
  <div class="kicker"><span class="cat">{post['cat']}</span><time datetime="{iso(post['date'])}">{fdate(post['date'])}</time></div>
  <h3>{post['title']}</h3><p>{post['dek']}</p></a>'''
    if k == 'news':
        return f'''<a class="card rv" data-kind="news" href="{post['url']}" target="_blank" rel="noopener">
  <div class="clipping {post['tone']}"><span class="outlet">{html.escape(post['src'])}</span><span class="mark">As seen in<small>{post.get('medium','Press')} ↗</small></span></div>
  <div class="kicker"><span class="cat">In the News</span><time datetime="{iso(post['date'])}">{fdate(post['date'])}</time></div>
  <h3>{post['title']}</h3><p>{post['dek']}</p></a>'''
    return f'''<a class="card rv" data-kind="guide" href="{post['url']}" target="_blank" rel="noopener">
  <figure><img src="{p}../img/{post['img']}.webp" alt=""{ld}><span class="kind guide-kind">{post['src']}</span></figure>
  <div class="kicker"><span class="cat">Kitchen Guide</span><span class="src">Off-site ↗</span></div>
  <h3>{post['title']}</h3><p>{post['dek']}</p></a>'''

dated = sorted([x for x in POSTS if 'date' in x], key=lambda x: x['date'], reverse=True)
guides = [x for x in POSTS if x['kind'] == 'guide']
ordered = dated + guides
shop = [x for x in dated if x['kind'] == 'shop']

# ------------------------------- index -------------------------------------
feat = shop[0]
counts = {k: sum(1 for x in POSTS if x['kind'] == k) for k in FILTER}
index_body = f'''
<section class="page-head">
  <div class="wrap">
    <p class="crumbs"><a href="../">Home</a> &nbsp;/&nbsp; Journal</p>
    <h1 class="display">The <em>Journal.</em></h1>
    <p class="lede">News from the shop, notes from the counter, and the press that’s been kind enough to stop by.</p>
  </div>
</section>

<section class="paper j-feature">
  <div class="wrap">
    <a class="feature rv" href="{feat['slug']}/">
      <figure><img src="../img/{feat['img']}.webp" alt="{html.escape(feat['alt'])}" fetchpriority="high"></figure>
      <div>
        <div class="kicker"><span class="cat">Latest · {feat['cat']}</span><time datetime="{iso(feat['date'])}">{fdate(feat['date'])}</time></div>
        <h3>{feat['title']}</h3>
        <p>{feat['dek']}</p>
        <span class="btn btn-line" style="margin-top:24px">Read the story</span>
      </div>
    </a>
  </div>
</section>

<section class="paper" id="stories">
  <div class="wrap">
    <div class="filters" role="group" aria-label="Filter stories">
      <button class="chip" type="button" data-f="all" aria-pressed="true">All <b>{len(POSTS)-1}</b></button>
      <button class="chip" type="button" data-f="shop" aria-pressed="false">From the Shop <b>{counts['shop']-1}</b></button>
      <button class="chip" type="button" data-f="news" aria-pressed="false">In the News <b>{counts['news']}</b></button>
      <button class="chip" type="button" data-f="guide" aria-pressed="false">Kitchen Guides <b>{counts['guide']}</b></button>
    </div>
    <div class="j-grid" id="jgrid">
      {"".join(card(x, '') for x in ordered if x is not feat)}
    </div>
  </div>
</section>

<section class="paper" style="padding:0">
  <div class="bands" style="margin-top:0">
    <div class="band gift">
      <p class="eyebrow">Gift Cards</p>
      <h3>For your favorite <em>home cook.</em></h3>
      <p>Digital gift cards for the cook in your life.</p>
      <a class="btn" href="https://www.toasttab.com/thesonofabutcher/giftcards" target="_blank" rel="noopener">Buy a gift card</a>
    </div>
    <div class="band news" data-hide-dock>
      <p class="eyebrow" style="color:var(--ox)">The Newsletter</p>
      <h3>Get the journal <em>in your inbox.</em></h3>
      <p class="mute">Exclusive recipes, featured products and first word on upcoming events.</p>
      <a class="btn btn-line" href="https://thesonofabutcher.us5.list-manage.com/subscribe?u=df4b993d3270b11555d5abf36&amp;id=ea4ab38e44" target="_blank" rel="noopener">Join the list</a>
    </div>
  </div>
</section>
'''
index_js = '''<script>
const chips=[...document.querySelectorAll('.chip')],cards=[...document.querySelectorAll('#jgrid .card')];
function applyFilter(f){
  chips.forEach(c=>c.setAttribute('aria-pressed',c.dataset.f===f));
  cards.forEach(c=>{c.hidden=!(f==='all'||c.dataset.kind===f);if(!c.hidden)c.classList.add('in')});
  history.replaceState(null,'',f==='all'?location.pathname:'#'+f);
}
chips.forEach(c=>c.addEventListener('click',()=>applyFilter(c.dataset.f)));
const start=location.hash.slice(1);if(['shop','news','guide'].includes(start))applyFilter(start);
</script>'''
os.makedirs(os.path.join(ROOT, 'journal'), exist_ok=True)
open(os.path.join(ROOT, 'journal', 'index.html'), 'w').write(page('../', 'Journal — The Son of a Butcher',
    'News, notes from the counter and press coverage from The Son of a Butcher in Birmingham, AL.', index_body, index_js))

# ------------------------------ articles -----------------------------------
for post in shop:
    others = [x for x in shop if x is not post][:2] + [x for x in dated if x['kind'] == 'news'][:1]
    mins = max(2, round(words(post['body']) / 220))
    body = f'''
<article>
<header class="article-head">
  <div class="wrap">
    <p class="crumbs"><a href="../../">Home</a> &nbsp;/&nbsp; <a href="../">Journal</a> &nbsp;/&nbsp; {post['cat']}</p>
    <h1>{post['title']}</h1>
    <p class="dek">{post['dek']}</p>
    <div class="byline"><img src="../../img/logo-cream.png" alt=""><div><b>The Son of a Butcher</b><time datetime="{iso(post['date'])}">{fdate(post['date'])}</time> · {mins} min read</div></div>
  </div>
  <div class="cover"><figure><img src="../../img/{post['img']}.webp" alt="{html.escape(post['alt'])}" fetchpriority="high"></figure></div>
</header>
<div class="article-body">
  <div class="prose">
{post['body'].strip()}
  </div>
  <div class="share" data-hide-dock>
    <span>Share</span>
    <button type="button" class="js-copy">Copy link</button>
    <a href="https://www.facebook.com/sharer/sharer.php?u=" class="js-fb" target="_blank" rel="noopener">Facebook</a>
    <a href="../" >← All stories</a>
  </div>
</div>
</article>
<section class="related">
  <div class="wrap">
    <p class="eyebrow" style="color:var(--ox)">Keep reading</p>
    <h2>More from the <em>Journal</em></h2>
    <div class="j-grid">
      {"".join(card(x, '../') for x in others)}
    </div>
  </div>
</section>
'''
    js = '''<script>
document.querySelector('.js-fb').href+=encodeURIComponent(location.href);
const cp=document.querySelector('.js-copy');
cp.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);cp.textContent='Copied ✓'}catch(e){cp.textContent='Copy failed'}setTimeout(()=>cp.textContent='Copy link',2000)});
</script>'''
    d = os.path.join(ROOT, 'journal', post['slug'])
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w').write(page('../../', f"{post['title']} — The Son of a Butcher", post['dek'], body, js))

# --------------------------- homepage section -------------------------------
home_feat = shop[0]
home_list = [x for x in dated if x is not home_feat][:4]
def clip(x):
    if x['kind'] == 'shop':
        return f'''<li><a class="clip" href="journal/{x['slug']}/"><div class="kicker"><span class="cat">{x['cat']}</span><time datetime="{iso(x['date'])}">{fdate(x['date'])}</time></div><h4>{x['title']}</h4></a></li>'''
    return f'''<li><a class="clip" href="{x['url']}" target="_blank" rel="noopener"><div class="kicker"><span class="cat">{html.escape(x['src'])}</span><time datetime="{iso(x['date'])}">{fdate(x['date'])}</time></div><h4>{x['title']}<span class="ext">↗</span></h4></a></li>'''
section = f'''<!-- JOURNAL:START -->
<section class="journal-home paper" id="journal">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" style="color:var(--ox)"><span class="no">07</span> The Journal</p>
        <h2 class="display rv">News from <em style="color:var(--ox)">the block.</em></h2>
      </div>
      <p class="mute rv">Shop news, notes from the counter and the press that’s been kind enough to stop by.</p>
    </div>
    <div class="jh-grid">
      <a class="feature rv" href="journal/{home_feat['slug']}/">
        <figure><img src="img/{home_feat['img']}.webp" alt="{html.escape(home_feat['alt'])}" loading="lazy"></figure>
        <div class="kicker"><span class="cat">{home_feat['cat']}</span><time datetime="{iso(home_feat['date'])}">{fdate(home_feat['date'])}</time></div>
        <h3>{home_feat['title']}</h3>
        <p>{home_feat['dek']}</p>
      </a>
      <div class="rv">
        <ul class="clips">{"".join(clip(x) for x in home_list)}</ul>
        <a class="btn btn-line" href="journal/" style="margin-top:28px">Read the Journal</a>
      </div>
    </div>
  </div>
</section>
<!-- JOURNAL:END -->'''
home = open(os.path.join(ROOT, 'index.html')).read()
home = re.sub(r'<!-- JOURNAL:START -->.*?<!-- JOURNAL:END -->', lambda m: section, home, flags=re.S)
open(os.path.join(ROOT, 'index.html'), 'w').write(home)
print('built', len(shop), 'articles;', len(POSTS), 'entries')
