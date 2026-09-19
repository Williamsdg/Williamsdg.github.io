# -*- coding: utf-8 -*-
import os, io
OUT = os.path.expanduser("~/Williamsdg.github.io/preview/cornerstone-brand-pack")
F = os.path.join(OUT, "files")
def kb(p):
    n = os.path.getsize(os.path.join(F, p))
    if n >= 1024*1024: return f"{n/1048576:.1f} MB"
    if n >= 10*1024:   return f"{n/1024:.0f} KB"
    return f"{n/1024:.1f} KB"

USE = [
 ("Email signature", "png/email-signature-320.png", "PNG &middot; 320px wide"),
 ("Word, Google Docs, PDFs", "png/cornerstone-logo-horizontal-1200.png", "PNG &middot; 1200px wide"),
 ("Letterhead &amp; printed reports", "pdf/cornerstone-logo-horizontal.pdf", "PDF &middot; vector"),
 ("Sign shop, vehicle wrap, embroidery", "svg/cornerstone-logo-horizontal.svg", "SVG &middot; vector"),
 ("Website favicon", "png/cornerstone-mark-32.png", "PNG &middot; 32px"),
 ("Social profile picture", "png/social-profile-light-1000.png", "PNG &middot; 1000&times;1000"),
 ("LinkedIn banner", "png/linkedin-banner-1584x396.png", "PNG &middot; 1584&times;396"),
 ("Facebook cover", "png/facebook-cover-820x312.png", "PNG &middot; 820&times;312"),
 ("Email newsletter header", "png/email-header-600x200.png", "PNG &middot; 600&times;200"),
 ("Shirts, hats, truck doors, stamps", "svg/cornerstone-badge.svg", "SVG &middot; vector"),
]

GROUPS = [
 ("The logo", "The full lockup. This is the default choice.", "dark", [
   ("Horizontal &mdash; primary", "cornerstone-logo-horizontal", "png/cornerstone-logo-horizontal-1200.png", [600,1200,2400]),
   ("Horizontal &mdash; reversed", "cornerstone-logo-horizontal-white", "png/cornerstone-logo-horizontal-white-1200.png", [600,1200,2400]),
   ("Horizontal &mdash; one colour", "cornerstone-logo-horizontal-black", None, []),
 ]),
 ("Compact &amp; stacked", "For tight spaces, or when the shape needs to be squarer.", "light", [
   ("Compact &mdash; no tagline", "cornerstone-logo-compact", "png/cornerstone-logo-compact-1200.png", [600,1200]),
   ("Compact &mdash; reversed", "cornerstone-logo-compact-white", "png/cornerstone-logo-compact-white-1200.png", [600,1200]),
   ("Stacked", "cornerstone-logo-stacked", "png/cornerstone-logo-stacked-800.png", [800,1600]),
   ("Stacked &mdash; reversed", "cornerstone-logo-stacked-white", "png/cornerstone-logo-stacked-white-800.png", [800,1600]),
 ]),
 ("The mark on its own", "Use where the name is already obvious, or where the space is square.", "light", [
   ("Mark", "cornerstone-mark", "png/cornerstone-mark-256.png", [16,32,48,64,128,180,192,256,512,1024]),
   ("Mark &mdash; reversed", "cornerstone-mark-white", "png/cornerstone-mark-white-256.png", [256,512,1024]),
   ("Mark &mdash; one colour", "cornerstone-mark-black", None, []),
 ]),
 ("The field badge", "Round format for embroidery, vehicle doors and report stamps.", "light", [
   ("Badge", "cornerstone-badge", "png/cornerstone-badge-512.png", [512,1024,2048]),
   ("Badge &mdash; reversed", "cornerstone-badge-white", "png/cornerstone-badge-white-512.png", [512,1024]),
 ]),
 ("Ready-made pieces", "Sized correctly for each platform. Upload as they are.", "light", [
   ("LinkedIn banner", "linkedin-banner-1584x396", "png/linkedin-banner-1584x396.png", []),
   ("Facebook cover", "facebook-cover-820x312", "png/facebook-cover-820x312.png", []),
   ("Email header", "email-header-600x200", "png/email-header-600x200.png", []),
   ("Social profile &mdash; light", "social-profile-light-1000", "png/social-profile-light-1000.png", []),
   ("Social profile &mdash; dark", "social-profile-dark-1000", "png/social-profile-dark-1000.png", []),
 ]),
]

COLORS = [("Cornerstone Red","#D91A3B","Logo, buttons, highlights"),
          ("Deep Red","#A8142E","Hover and pressed states"),
          ("Charcoal","#242323","Text and dark backgrounds"),
          ("Warm Grey","#8C8784","Dividers and quiet detail &mdash; not body text"),
          ("Paper","#F4F2EF","Page backgrounds")]

def card(title, base, preview, sizes, tone=None):
    tone = "dark" if base.endswith("-white") else "light"
    links = []
    for ext, d in (("svg","svg"), ("pdf","pdf")):
        p = f"{d}/{base}.{ext}"
        if os.path.exists(os.path.join(F,p)):
            links.append(f'<a href="files/{p}" download>{ext.upper()} <span>{kb(p)}</span></a>')
    for s in sizes:
        p = f"png/{base}-{s}.png"
        if os.path.exists(os.path.join(F,p)):
            links.append(f'<a href="files/{p}" download>PNG {s} <span>{kb(p)}</span></a>')
    if not sizes and os.path.exists(os.path.join(F, f"png/{base}.png")):
        p=f"png/{base}.png"; links.append(f'<a href="files/{p}" download>PNG <span>{kb(p)}</span></a>')
    prev = (f'<div class="pv pv--{tone}"><img src="files/{preview}" alt="{title}" loading="lazy" /></div>'
            if preview else '<div class="pv pv--none">One-colour version &mdash; vector only</div>')
    return f'<article class="as">{prev}<h4>{title}</h4><div class="dl">{"".join(links)}</div></article>'

groups_html = ""
for name, blurb, tone, items in GROUPS:
    groups_html += (f'<div class="gh"><h3>{name}</h3><p>{blurb}</p></div>'
                    f'<div class="grid">{"".join(card(t,b,p,s) for t,b,p,s in items)}</div>')

use_html = "".join(f'<tr><td>{a}</td><td><a href="files/{b}" download>{b.split("/")[-1]}</a></td><td>{c}</td></tr>' for a,b,c in USE)
col_html = "".join(f'<div class="sw"><span style="background:{h}"></span><b>{n}</b><code>{h}</code><small>{u}</small></div>' for n,h,u in COLORS)

HTML = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"guide.tpl"),encoding="utf-8").read()
HTML = (HTML.replace("%%GROUPS%%", groups_html).replace("%%USE%%", use_html)
            .replace("%%COLORS%%", col_html).replace("%%ZIPSIZE%%", kb("cornerstone-brand-pack.zip")))
io.open(os.path.join(OUT,"index.html"),"w",encoding="utf-8").write(HTML)
print("guide written")
