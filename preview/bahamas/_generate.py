#!/usr/bin/env python3
"""Generate sub-pages for the Bahamas tourism preview.
All copy and imagery is from bahamas.com. Run once: python3 _generate.py
"""
from pathlib import Path

HERE = Path(__file__).resolve().parent

# ---------------------------------------------------------------------------
# Shared partials
# ---------------------------------------------------------------------------

def head(title, desc, depth=1):
    css = '../style.css' if depth == 1 else '../../style.css'
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title} — The Islands of The Bahamas</title>
<meta name="description" content="{desc}" />
<meta name="robots" content="noindex,nofollow" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{css}">
"""

def nav(page, depth=1):
    prefix = '../' if depth == 1 else '../../'
    home = f'{prefix}index.html'
    return f"""<div class="private-bar"><span>Private preview</span> Concept redesign · Williams Digital</div>
<div class="junkanoo-ribbon"></div>
<header class="nav">
  <a href="{home}" class="brand"><span class="brand-mark"></span><span>The Islands of <em>The Bahamas</em></span></a>
  <nav>
    <ul>
      <li><a href="{prefix}islands/" data-link="islands">Islands</a></li>
      <li><a href="{prefix}experiences/" data-link="experiences">Experiences</a></li>
      <li><a href="{prefix}culture/" data-link="culture">Culture</a></li>
      <li><a href="{prefix}getting-here/" data-link="getting-here">Getting Here</a></li>
      <li><a href="{prefix}plan/" data-link="plan">Plan</a></li>
      <li><a href="{prefix}events/" data-link="events">Events</a></li>
    </ul>
  </nav>
  <a href="{prefix}plan/" class="nav-cta">Book Your Trip</a>
  <button class="menu-btn" aria-label="Menu">☰</button>
</header>
"""

def footer(depth=1):
    prefix = '../' if depth == 1 else '../../'
    return f"""<footer>
  <div class="junkanoo-ribbon" style="margin-bottom:60px"></div>
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a href="{prefix}index.html" class="brand"><span class="brand-mark"></span><span>The Islands of <em>The Bahamas</em></span></a>
        <p>16 uniquely captivating islands. 100,000 square miles of the world's clearest ocean. One vacation you'll never forget.</p>
        <div class="foot-soc">
          <a href="https://instagram.com/visitthebahamas" target="_blank" rel="noopener">IG</a>
          <a href="https://facebook.com/travelbahamas" target="_blank" rel="noopener">FB</a>
          <a href="https://youtube.com/visitthebahamas" target="_blank" rel="noopener">YT</a>
          <a href="https://tiktok.com/@travelbahamas" target="_blank" rel="noopener">TT</a>
          <a href="https://pinterest.com/thebahamas" target="_blank" rel="noopener">PT</a>
        </div>
      </div>
      <div><h5>Explore</h5><ul>
        <li><a href="{prefix}islands/">Islands</a></li>
        <li><a href="{prefix}experiences/">Experiences</a></li>
        <li><a href="{prefix}culture/">Culture</a></li>
        <li><a href="{prefix}events/">Events</a></li>
        <li><a href="{prefix}photos.html">Photos</a></li>
        <li><a href="{prefix}blog.html">Blog</a></li>
      </ul></div>
      <div><h5>Plan</h5><ul>
        <li><a href="{prefix}getting-here/">Getting Here</a></li>
        <li><a href="{prefix}plan/#hotels">Hotels &amp; Offers</a></li>
        <li><a href="{prefix}plan/#itineraries">Itineraries</a></li>
        <li><a href="{prefix}plan/#faqs">FAQs</a></li>
        <li><a href="{prefix}plan/#visa">Visa &amp; Immigration</a></li>
        <li><a href="{prefix}culture/#people">People-to-People</a></li>
      </ul></div>
      <div><h5>Partner Sites</h5><ul>
        <li><a href="https://nassauparadiseisland.com" target="_blank" rel="noopener">Nassau Paradise Island</a></li>
        <li><a href="https://grandbahamavacations.com" target="_blank" rel="noopener">Grand Bahama Island</a></li>
        <li><a href="https://myoutislands.com" target="_blank" rel="noopener">The Out Islands</a></li>
      </ul>
      <h5 style="margin-top:30px">Bahamas Tourism Center</h5>
      <ul><li><a href="tel:8002242627">(800) 224-2627</a></li></ul></div>
    </div>
    <div class="foot-bottom">
      <div>© 2026 Bahamas Ministry of Tourism · All Rights Reserved</div>
      <div><a href="#">Privacy</a> · <a href="#">Accessibility</a> · <a href="#">Sitemap</a></div>
    </div>
  </div>
</footer>
<script src="{prefix}shared.js"></script>
</body>
</html>"""

# ---------------------------------------------------------------------------
# Island detail page template
# ---------------------------------------------------------------------------

ISLAND_CSS = """<style>
  .subhero{min-height:78vh;background-size:cover;background-position:center}
  .quick-facts{background:#fff;border-bottom:1px solid var(--line-soft);padding:36px 0;position:relative;z-index:5}
  .qf-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:30px;text-align:center}
  .qf strong{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:2.4rem;font-weight:300;color:var(--coral-deep);display:block;line-height:1}
  .qf span{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);font-weight:600;margin-top:8px;display:block}
  .island-intro{padding:120px 0;background:var(--paper)}
  .intro-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:80px;align-items:start}
  .intro-grid p{font-size:1.1rem;color:var(--ink-soft);line-height:1.8;margin-bottom:20px}
  .intro-grid .script-accent{font-family:'Caveat',cursive;color:var(--coral-deep);font-size:2rem;display:block;margin-bottom:8px;transform:rotate(-2deg)}
  .intro-side{background:var(--paper-warm);padding:36px;border-radius:18px;border-left:4px solid var(--coral)}
  .intro-side h4{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:500;margin-bottom:18px;color:var(--sea-deep)}
  .intro-side ul{list-style:none;display:flex;flex-direction:column;gap:14px}
  .intro-side li{display:flex;gap:14px;align-items:flex-start;font-size:.95rem;color:var(--ink-soft)}
  .intro-side li::before{content:"✦";color:var(--gold);font-size:1.1rem;line-height:1.3}

  .highlights{padding:120px 0;background:var(--paper-warm);position:relative}
  .hl-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
  .hl-card{background:#fff;border-radius:20px;overflow:hidden;display:grid;grid-template-columns:200px 1fr;transition:.25s;border:1px solid var(--line-soft)}
  .hl-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);border-color:var(--coral)}
  .hl-card-img{background-size:cover;background-position:center;min-height:220px}
  .hl-card-body{padding:28px}
  .hl-card-body .num{font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--coral-deep);font-size:1.2rem;margin-bottom:6px}
  .hl-card-body h4{font-family:'Cormorant Garamond',serif;font-size:1.55rem;font-weight:500;margin-bottom:8px;line-height:1.2}
  .hl-card-body p{font-size:.92rem;color:var(--muted);line-height:1.6}

  .gallery{padding:120px 0;background:var(--paper)}
  .gal-grid{display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:180px;gap:14px}
  .gal-img{background-size:cover;background-position:center;border-radius:14px;transition:.4s;cursor:pointer}
  .gal-img:hover{transform:scale(1.02)}
  .gal-img.g1{grid-column:span 5;grid-row:span 2}
  .gal-img.g2{grid-column:span 4}
  .gal-img.g3{grid-column:span 3}
  .gal-img.g4{grid-column:span 3}
  .gal-img.g5{grid-column:span 4}

  .next-island{padding:100px 0;background:var(--sea-deep);color:#fff;text-align:center}
  .next-island h3{color:#fff;font-size:clamp(1.6rem,3vw,2.4rem)}
  .next-island a.btn{margin-top:24px}

  @media (max-width: 980px){
    .qf-grid{grid-template-columns:repeat(2,1fr);gap:24px}
    .intro-grid{grid-template-columns:1fr;gap:40px}
    .hl-grid{grid-template-columns:1fr}
    .hl-card{grid-template-columns:1fr}
    .hl-card-img{min-height:200px}
    .gal-grid{grid-template-columns:repeat(6,1fr);grid-auto-rows:160px}
    .gal-img.g1{grid-column:span 6;grid-row:span 2}
    .gal-img.g2,.gal-img.g3,.gal-img.g4,.gal-img.g5{grid-column:span 3}
  }
</style>"""

def island_page(slug, name, tagline, hero_img, intro_paras, quick_facts, must_dos, gallery_imgs, next_slug, next_name):
    quick_html = ''.join(f'<div class="qf"><strong>{v}</strong><span>{k}</span></div>' for k, v in quick_facts.items())
    intro_html = '\n'.join(f'<p>{p}</p>' for p in intro_paras)
    md_html = '\n'.join(f'<li>{m}</li>' for m in must_dos)
    hl_html = ''
    for i, h in enumerate(must_dos[:4]):
        img = gallery_imgs[i % len(gallery_imgs)]
        hl_html += f'''<a href="#" class="hl-card">
  <div class="hl-card-img" style="background-image:url('{img}')"></div>
  <div class="hl-card-body">
    <div class="num">No. {i+1:02d}</div>
    <h4>{h.split(' — ')[0] if ' — ' in h else h}</h4>
    <p>{h.split(' — ')[1] if ' — ' in h else "A must-see on this island."}</p>
  </div>
</a>
'''
    gal_html = ''
    classes = ['g1','g2','g3','g4','g5']
    for i, img in enumerate(gallery_imgs[:5]):
        gal_html += f'<div class="gal-img {classes[i]}" style="background-image:url(\'{img}\')"></div>\n'

    return f"""{head(name, tagline)}{ISLAND_CSS}
</head>
<body data-page="islands">

{nav('islands')}

<section class="subhero" style="background-image:linear-gradient(180deg,rgba(10,35,53,.3) 0%,rgba(10,35,53,.05) 35%,rgba(10,35,53,.78) 100%),url('{hero_img}')">
  <div class="subhero-inner">
    <div class="crumbs"><a href="../index.html">Home</a><span>›</span><a href="../islands/">Islands</a><span>›</span>{name}</div>
    <span class="eyebrow">Island Profile</span>
    <h1>{name.replace('&', '&amp;')}</h1>
    <p class="lead">{tagline}</p>
    <div style="margin-top:30px;display:flex;gap:12px;flex-wrap:wrap">
      <a href="../plan/" class="btn btn-primary">Plan Your Visit</a>
      <a href="../getting-here/" class="btn btn-ghost">How to Get There</a>
    </div>
  </div>
</section>

<div class="quick-facts">
  <div class="wrap">
    <div class="qf-grid">{quick_html}</div>
  </div>
</div>

<section class="island-intro">
  <div class="wrap">
    <div class="intro-grid">
      <div>
        <span class="eyebrow">About</span>
        <h2 style="margin:10px 0 24px">Why visit <em>{name.split(' &')[0]}.</em></h2>
        {intro_html}
      </div>
      <aside class="intro-side">
        <h4>Must-Do List</h4>
        <ul>{md_html}</ul>
      </aside>
    </div>
  </div>
</section>

<section class="highlights">
  <div class="wrap">
    <div class="section-head">
      <div><span class="eyebrow">Highlights</span><h2>Things you'll <em>tell stories about.</em></h2></div>
      <div><p class="lead">Every corner of {name.split(' &')[0]} holds something worth photographing — and a few things worth keeping just for yourself.</p></div>
    </div>
    <div class="hl-grid">{hl_html}</div>
  </div>
</section>

<section class="gallery">
  <div class="wrap">
    <div class="section-head">
      <div><span class="eyebrow">Gallery</span><h2>Through <em>the lens.</em></h2></div>
      <div><a href="../photos.html" class="more">View full gallery →</a></div>
    </div>
    <div class="gal-grid">{gal_html}</div>
  </div>
</section>

<section class="next-island">
  <div class="wrap-tight">
    <span class="eyebrow" style="color:var(--gold)">Up Next</span>
    <h3 style="margin-top:16px">Keep going. <em>{next_name}</em> is waiting.</h3>
    <a href="{next_slug}.html" class="btn btn-gold">Visit {next_name} →</a>
  </div>
</section>

{footer()}"""

# ---------------------------------------------------------------------------
# Island data
# ---------------------------------------------------------------------------

ISLANDS = [
    {
        'slug': 'nassau-paradise-island',
        'name': 'Nassau & Paradise Island',
        'tagline': "No other capital city boasts paradise as its neighbor.",
        'hero': 'https://tempo.cdn.tambourine.com/windsong/media/70-bmot-nassau-horizontal-resized-679bac7029586.jpg',
        'intro': [
            "Nassau is the capital of The Bahamas and the country's beating heart. Just across the bridge sits Paradise Island — a stretch of white sand and turquoise water where everything slows down.",
            "Walk Bay Street under pastel awnings. Climb the 66 steps of the Queen's Staircase, hand-cut from solid limestone. Wander the National Art Gallery, then look out from Fort Fincastle and see why this harbour has been a crossroads for three centuries.",
            "No other capital city boasts paradise as its neighbor — and that's what makes Nassau unforgettable.",
        ],
        'facts': {'Airport': 'NAS', 'From Florida': '55 min', 'Vibe': 'City + Beach', 'Best for': 'First-timers'},
        'mustdo': [
            "Queen's Staircase — 66 steps hand-cut from limestone, a hidden history lesson in the heart of Nassau.",
            "Fort Fincastle — sweeping harbour views from one of the oldest forts in the Bahamas.",
            "National Art Gallery of the Bahamas — the country's cultural heartbeat in a colonial mansion.",
            "Government House — the official residence, pink-stuccoed and unmissable on Mount Fitzwilliam.",
        ],
        'gallery': [
            'https://tempo.cdn.tambourine.com/windsong/media/70-bmot-nassau-horizontal-resized-679bac7029586.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/84-bmot-nassau-resized-679bac92cb51e.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/bmot-lifetimecampaign-embracebahamianculture-truebahamianspirit-big-67a4e9463c967.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/bmot-lifetimecampaign-embracebahamianculture-freshflavours-big-67a4e966b0d5d.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/home-slider-culture3-679b9a26519ec.jpg',
        ],
        'next_slug': 'exumas',
        'next_name': 'The Exumas',
    },
    {
        'slug': 'exumas',
        'name': 'The Exumas',
        'tagline': "From untouched beaches and breathtaking resorts to the famous swimming pigs.",
        'hero': 'https://tempo.cdn.tambourine.com/windsong/media/111-bmot-exumas-resized-679ba922a2132.jpg',
        'intro': [
            "365 cays. One for every day of the year. The Exumas are a string of impossibly perfect islands threaded across the world's clearest water.",
            "This is where the swimming pigs live — on Big Major Cay, paddling out to greet the boats. Where Thunderball Grotto was filmed for James Bond. Where Compass Cay Marina lets you swim with friendly nurse sharks before lunch.",
            "Untouched beaches. Breathtaking resorts. And the kind of sandbar photos that don't need filters.",
        ],
        'facts': {'Airports': 'GGT, TYM', 'From Florida': '1h 20m', 'Vibe': 'Tropical bliss', 'Best for': 'Bucket-listers'},
        'mustdo': [
            "Pig Beach (Big Major Cay) — swim with the world-famous Bahamian pigs.",
            "Thunderball Grotto — snorkel inside the cave that starred in a James Bond film.",
            "Compass Cay Marina — meet the friendly nurse sharks in the shallows.",
            "Exuma Cays Land &amp; Sea Park — the first marine park of its kind in the world.",
        ],
        'gallery': [
            'https://tempo.cdn.tambourine.com/windsong/media/111-bmot-exumas-resized-679ba922a2132.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/10-bmot-exumas-2-resized-679ba948b8418.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/115-bmot-exumas-resized-679bad0c6d7d8.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/104-bmot-exumas-resized-679babcd8f737.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/bmot-bimini-dolphin-swim-8-679ba6085c52b.jpg',
        ],
        'next_slug': 'eleuthera-harbour-island',
        'next_name': 'Eleuthera & Harbour Island',
    },
    {
        'slug': 'eleuthera-harbour-island',
        'name': 'Eleuthera & Harbour Island',
        'tagline': "Colourful New England-style architecture, astounding natural beauty, pristine clusters of sandbars and cays.",
        'hero': 'https://tempo.cdn.tambourine.com/windsong/media/bmot-eleuthera-harbour-island-24-679ba8549346d.jpg',
        'intro': [
            "Eleuthera is the long, slender island — 110 miles of pink-sand beaches, hidden caves, and pineapple fields. Harbour Island, just off its northern tip, is its more glamorous cousin.",
            "Pink Sands Beach gets its colour from microscopic red coral. The Glass Window Bridge is the narrowest spot on the island — the deep blue Atlantic on one side, the calm turquoise Caribbean on the other. You can stand and see both.",
            "Colourful clapboard cottages line the streets of Spanish Wells. New England by way of the tropics — the kind of place you keep extending the trip for.",
        ],
        'facts': {'Airports': 'GHB, ELH', 'From Florida': '1h 10m', 'Vibe': 'Pink sand & pastels', 'Best for': 'Romantics'},
        'mustdo': [
            "Pink Sands Beach — three miles of soft pink shoreline on Harbour Island.",
            "Glass Window Bridge — the Atlantic and Caribbean meeting in a single dramatic frame.",
            "Spanish Wells — a working fishing village of pastel cottages and clear harbours.",
            "Pineapple Fields — the sweetest pineapples in the Caribbean, grown right on the island.",
        ],
        'gallery': [
            'https://tempo.cdn.tambourine.com/windsong/media/bmot-eleuthera-harbour-island-24-679ba8549346d.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/bmot-island-hopping-eleuthera-harbourisland-23-resized-679ba873dcc48.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/bmot-lifetimecampaign-embracebahamianculture-freshflavours-big-67a4e966b0d5d.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/115-bmot-exumas-resized-679bad0c6d7d8.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/home-slider-culture1-679b956045f56.jpg',
        ],
        'next_slug': 'grand-bahama',
        'next_name': 'Grand Bahama Island',
    },
    {
        'slug': 'grand-bahama',
        'name': 'Grand Bahama Island',
        'tagline': "A bustling paradise of island activities and fun in the sun.",
        'hero': 'https://tempo.cdn.tambourine.com/windsong/media/39-bmot-freeport-edit-water-resized-679ba9c3207f1.jpg',
        'intro': [
            "Freeport is the gateway. Grand Bahama Island is everything that comes after — a wide-open island where you can kayak through underwater caves in the morning and shop a marketplace by night.",
            "Lucayan National Park holds one of the longest underwater cave systems in the world. Gold Rock Beach reveals miles of ribbed sand at low tide. Port Lucaya Marketplace serves up conch fritters under string lights.",
            "Just an hour from Florida by air. Closer than you think — and bigger than it looks.",
        ],
        'facts': {'Airport': 'FPO', 'From Florida': '40 min', 'Vibe': 'Active island', 'Best for': 'Families'},
        'mustdo': [
            "Lucayan National Park — one of the longest underwater cave systems on earth.",
            "Gold Rock Beach — at low tide, miles of rippled white sand emerge from nowhere.",
            "Port Lucaya Marketplace — open-air shopping, music, and conch fritters.",
            "Peterson Cay National Park — the smallest national park in the country, big on snorkeling.",
        ],
        'gallery': [
            'https://tempo.cdn.tambourine.com/windsong/media/39-bmot-freeport-edit-water-resized-679ba9c3207f1.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/51-bmot-freeport-resized-679ba9e321d27.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/bmot-lifetimecampaign-embracebahamianculture-truebahamianspirit-big-67a4e9463c967.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/home-slider-culture3-679b9a26519ec.jpg',
            'https://tempo.cdn.tambourine.com/windsong/media/bmot-bimini-dolphin-swim-8-679ba6085c52b.jpg',
        ],
        'next_slug': 'nassau-paradise-island',
        'next_name': 'Nassau & Paradise Island',
    },
]

for i in ISLANDS:
    p = HERE / 'islands' / f"{i['slug']}.html"
    p.write_text(island_page(
        i['slug'], i['name'], i['tagline'], i['hero'],
        i['intro'], i['facts'], i['mustdo'], i['gallery'],
        i['next_slug'], i['next_name'],
    ))
    print(f"wrote {p.relative_to(HERE)}")

print("done.")
