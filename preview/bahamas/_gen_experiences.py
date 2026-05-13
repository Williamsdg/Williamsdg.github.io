#!/usr/bin/env python3
"""Generate the remaining 3 experience detail pages."""
from pathlib import Path

HERE = Path(__file__).resolve().parent

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title} — The Islands of The Bahamas</title>
<meta name="description" content="{meta_desc}" />
<meta name="robots" content="noindex,nofollow" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../style.css">
<style>
  .subhero{{min-height:78vh;background-image:linear-gradient(180deg,rgba(10,35,53,.3) 0%,rgba(10,35,53,.05) 35%,rgba(10,35,53,.78) 100%),url("{hero_img}");background-size:cover;background-position:center}}
  .story{{padding:140px 0;background:var(--paper)}}
  .story-grid{{display:grid;grid-template-columns:1fr 1.2fr;gap:80px;align-items:start}}
  .story-grid .script-accent{{font-family:'Caveat',cursive;color:var(--coral-deep);font-size:2.2rem;display:block;margin-bottom:8px;transform:rotate(-2deg)}}
  .story-grid p{{font-size:1.1rem;color:var(--ink-soft);line-height:1.8;margin-bottom:20px}}
  .story-grid .pull{{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.6rem;color:var(--coral-deep);border-left:4px solid var(--coral);padding:6px 0 6px 24px;margin:28px 0}}
  .story-side{{position:sticky;top:100px;background:var(--paper-warm);padding:36px;border-radius:18px;border-top:4px solid var(--coral)}}
  .story-side h4{{font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin-bottom:18px;color:var(--sea-deep)}}
  .story-side dl{{display:grid;grid-template-columns:1fr 1fr;gap:18px}}
  .story-side dt{{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);font-weight:700}}
  .story-side dd{{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-style:italic;color:var(--ink);margin-top:4px}}
  .how{{padding:120px 0;background:var(--paper-warm)}}
  .how-grid{{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:50px}}
  .how-card{{background:#fff;border-radius:16px;padding:30px 26px;border:1px solid var(--line-soft);position:relative}}
  .how-num{{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:3rem;color:var(--coral);line-height:1;margin-bottom:10px}}
  .how-card h4{{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:500;margin-bottom:6px}}
  .how-card p{{font-size:.9rem;color:var(--muted);line-height:1.55}}
  .photos{{padding:120px 0;background:var(--paper)}}
  .ph-grid{{display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:180px;gap:14px}}
  .ph{{background-size:cover;background-position:center;border-radius:14px;transition:.4s}}
  .ph:hover{{transform:scale(1.02)}}
  .ph.p1{{grid-column:span 7;grid-row:span 2}}
  .ph.p2{{grid-column:span 5}}
  .ph.p3{{grid-column:span 5}}
  .book-cta{{padding:120px 0;background:var(--sea-deep);color:#fff;text-align:center}}
  .book-cta h2{{color:#fff;max-width:18ch;margin:0 auto}}
  .book-cta h2 em{{color:var(--aqua)}}
  .book-cta p{{color:rgba(255,255,255,.82);font-size:1.1rem;max-width:50ch;margin:20px auto 30px}}
  .book-cta .ctas{{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}}
  @media (max-width: 980px){{
    .story-grid{{grid-template-columns:1fr;gap:40px}}
    .story-side{{position:static}}
    .how-grid{{grid-template-columns:1fr 1fr}}
    .ph-grid{{grid-template-columns:repeat(6,1fr)}}
    .ph.p1{{grid-column:span 6;grid-row:span 2}}
    .ph.p2,.ph.p3{{grid-column:span 3}}
  }}
</style>
</head>
<body data-page="experiences">

<div class="private-bar"><span>Private preview</span> Concept redesign · Williams Digital</div>
<div class="junkanoo-ribbon"></div>

<header class="nav">
  <a href="../index.html" class="brand"><span class="brand-mark"></span><span>The Islands of <em>The Bahamas</em></span></a>
  <nav><ul>
    <li><a href="../islands/" data-link="islands">Islands</a></li>
    <li><a href="../experiences/" data-link="experiences">Experiences</a></li>
    <li><a href="../culture/" data-link="culture">Culture</a></li>
    <li><a href="../getting-here/" data-link="getting-here">Getting Here</a></li>
    <li><a href="../plan/" data-link="plan">Plan</a></li>
    <li><a href="../events/" data-link="events">Events</a></li>
  </ul></nav>
  <a href="../plan/" class="nav-cta">Book Your Trip</a>
  <button class="menu-btn">☰</button>
</header>

<section class="subhero">
  <div class="subhero-inner">
    <div class="crumbs"><a href="../index.html">Home</a><span>›</span><a href="../experiences/">Experiences</a><span>›</span>{title}</div>
    <span class="eyebrow">{eyebrow}</span>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>
  </div>
</section>

<section class="story">
  <div class="wrap">
    <div class="story-grid">
      <aside class="story-side">
        <h4>Quick Facts</h4>
        <dl>{facts_html}</dl>
        <a href="../plan/" class="btn btn-primary" style="margin-top:24px;width:100%;justify-content:center">Plan This Trip</a>
      </aside>
      <div>
        <span class="script-accent">{script}</span>
        <h2 style="margin-bottom:24px">{story_h2}</h2>
        {story_paras}
      </div>
    </div>
  </div>
</section>

<section class="how">
  <div class="wrap">
    <div class="section-head">
      <div><span class="eyebrow">How to Do It</span><h2>Four steps. <em>One unforgettable trip.</em></h2></div>
      <div><p class="lead">{how_lead}</p></div>
    </div>
    <div class="how-grid">{how_cards}</div>
  </div>
</section>

<section class="photos">
  <div class="wrap">
    <div class="section-head">
      <div><span class="eyebrow">In the Wild</span><h2>{photos_h2}</h2></div>
      <div><a href="../photos.html" class="more">View full gallery →</a></div>
    </div>
    <div class="ph-grid">
      <div class="ph p1" style="background-image:url('{photo1}')"></div>
      <div class="ph p2" style="background-image:url('{photo2}')"></div>
      <div class="ph p3" style="background-image:url('{photo3}')"></div>
    </div>
  </div>
</section>

<section class="book-cta">
  <div class="wrap-tight">
    <span class="eyebrow" style="color:var(--gold)">Ready?</span>
    <h2 style="margin-top:16px">{cta_h2}</h2>
    <p>{cta_p}</p>
    <div class="ctas">
      <a href="../plan/" class="btn btn-primary">Plan Your Trip</a>
      <a href="{cta_island_link}" class="btn btn-ghost">{cta_island_text}</a>
    </div>
  </div>
</section>

<footer>
  <div class="junkanoo-ribbon" style="margin-bottom:60px"></div>
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a href="../index.html" class="brand"><span class="brand-mark"></span><span>The Islands of <em>The Bahamas</em></span></a>
        <p>16 uniquely captivating islands. 100,000 square miles of the world's clearest ocean.</p>
        <div class="foot-soc"><a href="https://instagram.com/visitthebahamas" target="_blank" rel="noopener">IG</a><a href="https://facebook.com/travelbahamas" target="_blank" rel="noopener">FB</a><a href="https://youtube.com/visitthebahamas" target="_blank" rel="noopener">YT</a></div>
      </div>
      <div><h5>Explore</h5><ul><li><a href="../islands/">Islands</a></li><li><a href="../experiences/">Experiences</a></li><li><a href="../culture/">Culture</a></li><li><a href="../events/">Events</a></li></ul></div>
      <div><h5>Plan</h5><ul><li><a href="../getting-here/">Getting Here</a></li><li><a href="../plan/">Plan Your Trip</a></li><li><a href="../photos.html">Photos</a></li><li><a href="../blog.html">Blog</a></li></ul></div>
      <div><h5>Call</h5><ul><li><a href="tel:8002242627">(800) 224-2627</a></li></ul></div>
    </div>
    <div class="foot-bottom"><div>© 2026 Bahamas Ministry of Tourism</div><div><a href="#">Privacy</a> · <a href="#">Accessibility</a></div></div>
  </div>
</footer>

<script src="../shared.js"></script>
</body>
</html>"""

PAGES = [
    {
        'slug': 'flamingos',
        'title': 'Meet a Flamingo',
        'meta_desc': "Inagua is home to three national parks and over 80,000 West Indian flamingos. The largest breeding colony in the world.",
        'hero_img': 'https://tempo.cdn.tambourine.com/windsong/media/flamingo-679baa5f91cbb.jpg',
        'eyebrow': 'Signature Experience · Inagua',
        'h1': 'Meet a <em>Flamingo.</em>',
        'lead': "Inagua is the most pink place you'll ever stand. Home to over 80,000 West Indian flamingos — the largest breeding colony of its kind in the world.",
        'facts': [('Where','Inagua National Park'),('Island','Great Inagua'),('Best Time','Year-round'),('Duration','Full day'),('Skill','Easy'),('Pair With','Birdwatching')],
        'script': 'a sea of pink',
        'story_h2': 'The largest breeding colony <em>on earth.</em>',
        'story': [
            "Inagua is the southernmost island in The Bahamas — and one of the least visited. That's the secret. Because while everyone else is shoulder-to-shoulder on Paradise Island, you're walking through three national parks home to 80,000 flamingos and 140 other species of birds.",
            "The flamingos turn the salt flats pink. They wade in long elegant lines, dipping their heads into the shallows. From a respectful distance, you can stand and watch one of the great wildlife spectacles in the Caribbean.",
            "Bring binoculars. Bring patience. Bring a wide-angle lens — you're going to need it.",
        ],
        'pull': "80,000 flamingos. 140 species of birds. One unforgettable island.",
        'how_lead': "Inagua is remote — which is the point. Plan ahead, fly in, and slow down.",
        'how': [
            ('Fly to Inagua','Daily flights into IGA (Inagua International) from Nassau.'),
            ('Hire a Local Guide','Park guides know exactly where the flocks are wading on any given day.'),
            ('Walk &amp; Watch','Quiet movement, respectful distance. The flamingos do the rest.'),
            ('Stay a Few Days','Combine with the Great Inagua Lighthouse and Union Creek Reserve.'),
        ],
        'photos_h2': 'A study in <em>pink.</em>',
        'photo1': 'https://tempo.cdn.tambourine.com/windsong/media/flamingo-679baa5f91cbb.jpg',
        'photo2': 'https://tempo.cdn.tambourine.com/windsong/media/bmot-inagua-12-679baa7a9db8b.jpg',
        'photo3': 'https://tempo.cdn.tambourine.com/windsong/media/bmot-catisland-content-miscaerials-4-2-resized-679babab18390.jpg',
        'cta_h2': "Let's get you <em>to Inagua.</em>",
        'cta_p': "Daily flights from Nassau. Three national parks. One pink island waiting.",
        'cta_island_link': '../islands/',
        'cta_island_text': 'See All Islands',
    },
    {
        'slug': 'diving',
        'title': 'Diving & Snorkeling',
        'meta_desc': "Dean's Blue Hole — the world's second-deepest. The Andros Barrier Reef. Wrecks, dolphins, coral gardens. The Bahamas was made for divers.",
        'hero_img': 'https://tempo.cdn.tambourine.com/windsong/media/bmot-bimini-dolphin-swim-8-679ba6085c52b.jpg',
        'eyebrow': 'Signature Experience · Bimini, Andros, Long Island',
        'h1': 'Diving &amp; <em>Snorkeling.</em>',
        'lead': "Dean's Blue Hole. The Andros Barrier Reef. The SS Sapona shipwreck. The Bahamas holds some of the most legendary dive sites on earth — and you can be in the water by lunchtime.",
        'facts': [('Top Site',"Dean's Blue Hole"),('Island','Long Island'),('Best Time','Year-round'),('Duration','Half-day+'),('Skill','All levels'),('Pair With','Fishing')],
        'script': 'a diver\'s dream',
        'story_h2': 'The world\'s clearest <em>water.</em>',
        'story': [
            "100,000 square miles of crystalline ocean. Visibility that runs 100 feet on a slow day. Water temperatures that rarely dip below 75 degrees. There's a reason divers have been coming to The Bahamas for a hundred years.",
            "Dean's Blue Hole on Long Island plunges 663 feet — the second-deepest blue hole in the world. The Andros Barrier Reef is the third-longest reef on earth. The SS Sapona, half-sunk off Bimini since 1926, is now a vertical playground for fish and free-divers.",
            "Wrecks, walls, caves, and dolphin encounters. Whatever level you dive at, the Bahamas has something to remember.",
        ],
        'pull': "100-foot visibility. 75-degree water. A hundred years of legend.",
        'how_lead': "Most travelers do this through resort dive shops or charter ops — it's easy to set up day-of.",
        'how': [
            ('Pick Your Island','Bimini for wrecks &amp; dolphins. Andros for the reef. Long Island for the blue hole.'),
            ('Book the Shop','Resort dive shops and PADI ops are everywhere — book on arrival.'),
            ('Pack Light','You can rent everything but a swimsuit and a sense of wonder.'),
            ('Plan Two Dives','Most charters run a two-tank morning — boat back by lunch.'),
        ],
        'photos_h2': 'Below <em>the surface.</em>',
        'photo1': 'https://tempo.cdn.tambourine.com/windsong/media/bmot-bimini-dolphin-swim-8-679ba6085c52b.jpg',
        'photo2': 'https://tempo.cdn.tambourine.com/windsong/media/11-bmot-bimini-dolphinhouse-2021-resized-679ba5e1d46d4.jpg',
        'photo3': 'https://tempo.cdn.tambourine.com/windsong/media/bmot-lifetimecampaign-islandbyisland-andros-01-67a4f4d720af8.jpg',
        'cta_h2': "Let's get you <em>in the water.</em>",
        'cta_p': "Direct flights from Florida. Dive shops on every major island. The reef isn't going anywhere — but you should.",
        'cta_island_link': '../islands/',
        'cta_island_text': 'Browse Islands',
    },
    {
        'slug': 'fishing',
        'title': 'World-Class Fishing',
        'meta_desc': "Bonefishing on shallow flats. Deep-sea charters chasing marlin. Tournament fishing in Bimini's Gulf Stream.",
        'hero_img': 'https://tempo.cdn.tambourine.com/windsong/media/bmot-long-island-9-679baaffc890f.jpg',
        'eyebrow': 'Signature Experience · Long Island, Bimini, Ragged Island',
        'h1': 'World-Class <em>Fishing.</em>',
        'lead': "Bonefishing on glass-still flats. Tournament-grade deep-sea action in the Gulf Stream. Whatever you fish for, it's bigger here.",
        'facts': [('Top Catch','Bonefish · Marlin'),('Islands','Long Is · Bimini'),('Best Time','Sept – May'),('Duration','Half/Full Day'),('Skill','All levels'),('Pair With','Diving')],
        'script': 'cast, reel, repeat',
        'story_h2': 'Where the <em>big ones live.</em>',
        'story': [
            "The Bahamas is what serious anglers talk about when nobody else is listening. Bonefishing pioneer water on the Long Island flats. Hemingway-era marlin off Bimini in the Gulf Stream. Deep-water tuna and wahoo off the drop-offs of Ragged Island.",
            "Half-day flats trips with local guides who've fished these waters for forty years. Full-day offshore charters chasing blue marlin in tournament waters. Or just a kid with a rod off the dock catching dinner.",
            "Bring the gear. Bring the patience. Bring an extra cooler.",
        ],
        'pull': "Hemingway fished here. So did your favorite guide's grandfather.",
        'how_lead': "Charter ops on every major island. Local guides will outfit you and put you on fish.",
        'how': [
            ('Pick Your Fish','Bonefish &amp; permit (flats). Marlin &amp; tuna (offshore). Snapper &amp; grouper (reef).'),
            ('Pick Your Island','Long Island for bonefish. Bimini for marlin. Ragged Island for deep-water.'),
            ('Book Your Captain',"Local guides know exactly where they're biting on any given tide."),
            ('Show Up Ready',"Sunscreen, polarized glasses, light rain shell — that's most of it."),
        ],
        'photos_h2': 'The <em>angler\'s Bahamas.</em>',
        'photo1': 'https://tempo.cdn.tambourine.com/windsong/media/bmot-long-island-9-679baaffc890f.jpg',
        'photo2': 'https://tempo.cdn.tambourine.com/windsong/media/bmot-long-island-16-edit-resized-679bab2d3e3ec.jpg',
        'photo3': 'https://tempo.cdn.tambourine.com/windsong/media/bmot-ragged-island-5-resized-679bad2db973d.jpg',
        'cta_h2': "Let's get you <em>on the water.</em>",
        'cta_p': "Charter captains on every major island. Bonefish flats in the shallows. Marlin in the deep blue.",
        'cta_island_link': '../islands/',
        'cta_island_text': 'Browse Islands',
    },
]

for p in PAGES:
    facts_html = ''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in p['facts'])
    story_paras = '\n'.join(f'<p>{s}</p>' for s in p['story'])
    # Insert pull-quote after first paragraph
    paras = p['story']
    story_with_pull = (
        f'<p>{paras[0]}</p>\n'
        f'<div class="pull">"{p["pull"]}"</div>\n'
        + '\n'.join(f'<p>{s}</p>' for s in paras[1:])
    )
    how_html = ''
    for i, (h, body) in enumerate(p['how']):
        how_html += f'<div class="how-card"><div class="how-num">{i+1:02d}</div><h4>{h}</h4><p>{body}</p></div>\n'

    content = TEMPLATE.format(
        title=p['title'],
        meta_desc=p['meta_desc'],
        hero_img=p['hero_img'],
        eyebrow=p['eyebrow'],
        h1=p['h1'],
        lead=p['lead'],
        facts_html=facts_html,
        script=p['script'],
        story_h2=p['story_h2'],
        story_paras=story_with_pull,
        how_lead=p['how_lead'],
        how_cards=how_html,
        photos_h2=p['photos_h2'],
        photo1=p['photo1'], photo2=p['photo2'], photo3=p['photo3'],
        cta_h2=p['cta_h2'], cta_p=p['cta_p'],
        cta_island_link=p['cta_island_link'], cta_island_text=p['cta_island_text'],
    )
    out = HERE / 'experiences' / f"{p['slug']}.html"
    out.write_text(content)
    print(f"wrote {out.relative_to(HERE)}")

print("done.")
