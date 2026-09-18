#!/usr/bin/env python3
"""Gallery Studio 103 concept — assembles static pages from src/ fragments.
Run:  python3 _build.py     (from this directory)"""
import pathlib, re, sys

HERE = pathlib.Path(__file__).parent
SRC  = HERE / "src"

FONTS = ("https://fonts.googleapis.com/css2?"
         "family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;"
         "1,9..144,300..600,0..100,0..1&family=Inter:wght@400;500;600&display=swap")

VIEWS = [("index.html","home","Website"), ("work.html","work","Collection"),
         ("piece.html","piece","A piece"), ("classes.html","classes","Classes"),
         ("studio.html","studio","The Studio Ledger")]

def banner(page):
    links = "".join(
        f'<a href="{h}"{" aria-current=\"page\"" if p==page else ""}>{t}</a>'
        for h,p,t in VIEWS)
    return ('<div class="concept" role="note"><div class="wrap">'
      '<span class="label"><b>Concept preview</b> by Williams Digital — not Anthe’s live site. '
      'Nothing here sends, charges or publishes.</span>'
      f'<nav aria-label="Preview views">{links}</nav></div></div>')

NAV = [("work.html","work","Collection"), ("classes.html","classes","Classes"),
       ("index.html#studio",None,"The Studio"), ("index.html#visit",None,"Visit")]

def header(page):
    links = "".join(
        f'<a href="{h}"{" aria-current=\"page\"" if p and p==page else ""}>{t}</a>'
        for h,p,t in NAV)
    return ('<header class="hdr" id="hdr"><div class="wrap">'
      '<a class="logo" href="index.html" aria-label="Gallery Studio 103 — home">'
      '<img src="img/feather.png" alt="" width="927" height="706">'
      '<span class="wm">Gallery Studio 103<small>Art by Anthe</small></span></a>'
      '<button class="navtoggle" type="button" aria-expanded="false" aria-controls="nav" aria-label="Menu">'
      '<span></span></button>'
      f'<nav class="nav" id="nav">{links}'
      '<a class="btn sm" href="index.html#inquire">Inquire</a></nav>'
      '</div></header>')

SPINE = ('<div class="spine" aria-hidden="true"><svg viewBox="0 0 70 1000" preserveAspectRatio="none">'
  '<path vector-effect="non-scaling-stroke" d="M35 0 C 8 90 62 150 35 240 C 10 322 60 382 35 470 '
  'C 12 552 62 612 35 700 C 10 782 60 842 35 1000"/></svg></div>')

FOOTER = ('<footer class="ftr"><div class="wrap"><div class="ftr-grid">'
  '<div><img class="fl" src="img/feather.png" alt="" width="927" height="706">'
  '<p class="fname">Gallery Studio 103</p>'
  '<p class="fabout">A curated boutique gallery and working studio in the Naples Art District. '
  'Distinctive art that spreads joy and honours God Almighty.</p></div>'
  '<div><h4>Look</h4><ul>'
  '<li><a href="work.html">The collection</a></li>'
  '<li><a href="work.html?kind=original-print">Original prints</a></li>'
  '<li><a href="piece.html?p=white-line">White Line</a></li>'
  '<li><a href="index.html#studio">About Anthe</a></li></ul></div>'
  '<div><h4>Learn</h4><ul>'
  '<li><a href="classes.html">All classes</a></li>'
  '<li><a href="classes.html#drawing-from-music">Drawing from Music</a></li>'
  '<li><a href="classes.html#private-lessons">Private lessons</a></li>'
  '<li><a href="classes.html#calendar">Upcoming dates</a></li></ul></div>'
  '<div><h4>Visit</h4><ul>'
  '<li>6230 Shirley Street&nbsp;#103<br>Naples, FL 34109</li>'
  '<li><a href="tel:+12152333916">(215) 233-3916</a></li>'
  '<li><a href="mailto:GalleryStudio103@gmail.com">GalleryStudio103@gmail.com</a></li>'
  '<li><a href="https://www.facebook.com/ArtworksByAnthe/" rel="noopener">Facebook</a></li>'
  '</ul></div></div>'
  '<div class="ftr-bot">'
  '<span>&copy; <span data-year></span> Anthe Capitan-Valais. Artwork reproduced by permission of the artist.</span>'
  '<span>Concept design by <a href="https://williamsdigital.io" rel="noopener">Williams Digital</a></span>'
  '</div></div></footer>')

SHELL = """<!DOCTYPE html>
<html lang="en">
<head>
<script>document.documentElement.className="js"</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#F6F2EA">
<link rel="icon" href="img/feather.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="{fonts}" rel="stylesheet">
{preload}<link rel="stylesheet" href="assets/site.css?v={v}">
{head}<!--
  GALLERY STUDIO 103 — concept · Williams Digital · 2026-09-18
  Not the live site. Anthe's biography, mission, class list, address and photography are her
  own (naplesartdistrict.com / anthe.net) — see SOURCES.md. Catalogue rows beyond the five
  photographed works are stand-ins for her own spreadsheet, and are labelled as such.
-->
</head>
<body data-page="{page}">
<a class="skip" href="#main">Skip to content</a>
{banner}
{spine}
{header}
<main id="main">
{body}
</main>
{footer}
<script src="assets/catalog.js?v={v}"></script>
<script src="assets/site.js?v={v}"></script>
{scripts}</body>
</html>
"""

V = "4"

PAGES = {
 "index.html": dict(page="home",
   title="Gallery Studio 103 — Art by Anthe Capitan-Valais, Naples Art District",
   desc="Movement-inspired original paintings, collage and hand-pulled prints by Anthe Capitan-Valais. Gallery, working studio and classes in the Naples Art District.",
   preload='<link rel="preload" as="image" href="img/white-line.webp" fetchpriority="high">\n'),
 "index-alt.html": dict(page="home",
   title="Gallery Studio 103 — alternate hero",
   desc="Alternate hero treatment for comparison.",
   preload='<link rel="preload" as="image" href="img/white-line.webp" fetchpriority="high">\n'),
 "work.html": dict(page="work",
   title="The Collection — Gallery Studio 103",
   desc="Originals and hand-pulled original prints by Anthe Capitan-Valais, drawn live from the Studio Ledger."),
 "piece.html": dict(page="piece",
   title="White Line — Gallery Studio 103",
   desc="A single work from the collection, with its provenance and certificate of authenticity."),
 "classes.html": dict(page="classes",
   title="Classes — Gallery Studio 103",
   desc="Drawing from Music, Drawing for All Ages, Collage & Mixed Media and more, taught by Anthe Capitan-Valais in the Naples Art District."),
 "studio.html": dict(page="studio",
   title="The Studio Ledger — Gallery Studio 103",
   desc="The private side: one row per piece. Anthe's own inventory, driving the public site."),
}

def build():
    written = []
    for out, meta in PAGES.items():
        frag = SRC / (out.replace(".html", ".part.html"))
        if not frag.exists():
            print(f"  skip {out} (no {frag.name})"); continue
        raw = frag.read_text(encoding="utf-8")
        head, scripts, body = "", "", raw
        m = re.search(r"(?s)<!--HEAD-->(.*?)<!--/HEAD-->", raw)
        if m: head = m.group(1).strip() + "\n"; body = body.replace(m.group(0), "")
        m = re.search(r"(?s)<!--SCRIPTS-->(.*?)<!--/SCRIPTS-->", raw)
        if m: scripts = m.group(1).strip() + "\n"; body = body.replace(m.group(0), "")
        html = SHELL.format(
            title=meta["title"], desc=meta["desc"], fonts=FONTS, v=V,
            preload=meta.get("preload",""), head=head, page=meta["page"],
            banner=banner(meta["page"]), spine=SPINE, header=header(meta["page"]),
            body=body.strip(), footer=FOOTER, scripts=scripts)
        (HERE / out).write_text(html, encoding="utf-8")
        written.append(f"{out} ({len(html)//1024}kb)")
    print("built: " + ", ".join(written) if written else "nothing built")

if __name__ == "__main__":
    build()
