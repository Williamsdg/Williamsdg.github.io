# -*- coding: utf-8 -*-
import os, io, json, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from marks import symbols
from marks2 import symbols2
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(OUT, exist_ok=True)

LOGOS = [
 dict(id="m1", dir="Evolution", name="The Refined C",
      font="'Archivo',sans-serif", w=800, ls="-.01em", upper=True, sub="Claims Adjusters",
      why="Keeps what people already recognize, the red C and the diamond, drawn with cleaner geometry so it holds up at small sizes."),
 dict(id="m2", dir="Evolution", name="Three Diamonds",
      font="'Libre Baskerville',serif", w=700, ls=".02em", upper=True, sub="Integrity · Experience · Results",
      why="Your existing diamonds, given a job: one each for Integrity, Experience and Results, rising left to right. Keeps the serif lettering of the current logo."),
 dict(id="m3", dir="The Cornerstone", name="Block C",
      font="'Barlow Condensed',sans-serif", w=700, ls=".03em", upper=True, sub="Claims Adjusters",
      why="A C built from stone blocks, with the red cornerstone set where the first stone of a building goes. The name made literal."),
 dict(id="m4", dir="The Cornerstone", name="Foundation Stone",
      font="'Archivo',sans-serif", w=800, ls="-.01em", upper=True, sub="Claims Adjusters",
      why="One of the simplest and boldest: one red cornerstone set into a larger block. Still recognizable as a tiny browser-tab icon or on a truck door."),
 dict(id="m5", dir="Precision", name="The Square",
      font="'IBM Plex Sans',sans-serif", w=700, ls="0", upper=True, sub="Claims Adjusters",
      why="A builder's square with measurement marks: the tool for checking whether something is true. Speaks to inspection and getting the number right."),
 dict(id="m6", dir="Precision", name="The Credential",
      font="'Libre Franklin',sans-serif", w=800, ls="0", upper=True, sub="Claims Adjusters",
      why="A shield carrying the red diamond. Reads as certified and trustworthy, much like a credential badge. The most conventional of the twelve, and the easiest for carriers to trust."),
 dict(id="m7", dir="The Story", name="The Level",
      font="'Libre Franklin',sans-serif", w=800, ls="0", upper=True, sub="Claims Adjusters",
      why="A spirit level with the bubble dead center. Fair, true, level. A body shop owner who has dealt with Clay for 20 years says he has always been fair. This is that, as a symbol. Best as a wide logo; it is small as a square icon."),
 dict(id="m8", dir="The Story", name="The Cairn",
      font="'Libre Baskerville',serif", w=700, ls=".02em", upper=True, sub="Integrity · Experience · Results",
      why="Three stones balanced on each other: Integrity, Experience and Results, with the red stone on top. A cairn marks the path for whoever comes next. Calm and memorable."),
 dict(id="m9", dir="The Damage", name="The Fracture",
      font="'Archivo',sans-serif", w=800, ls="-.01em", upper=True, sub="Claims Adjusters",
      why="A solid stone with the damage traced through it in red. Says exactly what you do: find the damage and follow it all the way through. The boldest of the twelve."),
 dict(id="m12", dir="The Damage", name="Verified",
      font="'IBM Plex Sans',sans-serif", w=700, ls="0", upper=True, sub="Claims Adjusters",
      why="A check mark built from two stones, the red one the cornerstone. Says findings you can act on, inspected and confirmed. Pairs naturally with The Fracture: the damage, then the answer."),
 dict(id="m10", dir="The Work", name="The Viewfinder",
      font="'Barlow Condensed',sans-serif", w=700, ls=".03em", upper=True, sub="Claims Adjusters",
      why="Camera focus brackets around the red diamond: the damage in focus, photographed and documented. Clear even at the smallest sizes, and suits a firm whose product is documented findings."),
 dict(id="m11", dir="The Work", name="The Gear",
      font="'Archivo',sans-serif", w=700, ls="0", upper=True, sub="Claims Adjusters",
      why="A C set inside a gear, with the diamond at its center. Speaks to the mechanical, fuel and heavy-equipment work that sets you apart from a standard auto appraiser."),
]


PALETTES = [
 dict(id="p1", name="Signal Red", tag="Evolution of today's colors",
      acc="#D91A3B", accDk="#A8142E", ink="#242323", mid="#8C8784", paper="#F4F2EF",
      note="Your current red and charcoal, with a warmer grey. The least disruptive change: existing signage, cards and trucks still match."),
 dict(id="p2", name="Crimson & Steel", tag="More premium, more serious",
      acc="#A51C36", accDk="#7E1428", ink="#1E252B", mid="#6E7A85", paper="#EEF1F3",
      note="A deeper crimson with cool steel greys. Reads more like a consulting or engineering firm than a field service."),
 dict(id="p3", name="Navy & Safety Red", tag="Insurance trust, industrial urgency",
      acc="#C8102E", accDk="#9C0C24", ink="#14213D", mid="#5B6B82", paper="#F2F4F7",
      note="Navy is the language carriers and attorneys already trust; red keeps the urgency. The combination most carriers will feel at home with."),
 dict(id="p4", name="Graphite & Hi-Vis", tag="Equipment-forward, a bigger change",
      acc="#E8601C", accDk="#B84A12", ink="#1F2124", mid="#6B6F73", paper="#F5F4F1",
      note="Construction-site orange on graphite. Strongest match for the heavy-equipment and fleet work. The biggest departure from the current red."),
]

FONTS = [
 dict(id="f1", name="Industrial Modern", tag="Archivo + Inter",
      head="'Archivo',sans-serif", hw=800, hls="-.02em", body="'Inter',sans-serif",
      label="'Archivo',sans-serif", lw=700, nums="'Archivo',sans-serif",
      note="What the preview site uses today. Strong, compact headings with an easy-reading body text. Confident without being flashy."),
 dict(id="f2", name="Field Engineering", tag="Barlow Condensed + Barlow",
      head="'Barlow Condensed',sans-serif", hw=700, hls="0", fs=1.18, body="'Barlow',sans-serif",
      label="'Barlow Condensed',sans-serif", lw=600, nums="'Barlow Condensed',sans-serif",
      note="Inspired by highway signs and equipment plates. Tall, narrow headings that fit a lot on a phone screen."),
 dict(id="f3", name="Established Professional", tag="Libre Baskerville + Libre Franklin",
      head="'Libre Baskerville',serif", hw=700, hls="-.01em", body="'Libre Franklin',sans-serif",
      label="'Libre Franklin',sans-serif", lw=600, nums="'Libre Franklin',sans-serif",
      note="A traditional serif for headings, closest to your current logo lettering. Feels established, like a law firm or a long-standing agency."),
 dict(id="f4", name="Technical Report", tag="IBM Plex Sans + Plex Mono",
      head="'IBM Plex Sans',sans-serif", hw=700, hls="-.01em", body="'IBM Plex Sans',sans-serif",
      label="'IBM Plex Mono',monospace", lw=500, nums="'IBM Plex Mono',monospace",
      note="Designed by IBM for technical documentation. Labels and figures are set like an inspection report, which suits a firm that sells documented findings."),
]

def lockup(L, cls="lk", ink=None):
    sub = L["sub"]
    return (f'<div class="{cls}"><svg class="lk__m" aria-hidden="true"><use href="#{L["id"]}"/></svg>'
            f'<div class="lk__t"><span class="lk__n" style="font-family:{L["font"]};font-weight:{L["w"]};'
            f'letter-spacing:{L["ls"]}">CORNERSTONE</span><span class="lk__s">{sub}</span></div></div>')

def logo_cards():
    out=[]; cur=None
    for i,L in enumerate(LOGOS,1):
        if L["dir"]!=cur:
            cur=L["dir"]
            blurb={"The Story":"More creative. Symbols with a meaning you can explain to a customer in one sentence.",
                   "The Damage":"More creative. The problem you're hired for, and the answer you deliver.",
                   "The Work":"More creative. Drawn from the documentation, machinery and mechanics of the job itself.",
                   "Evolution":"Builds on the logo you have today, so nothing already out in the world looks wrong.",
                   "The Cornerstone":"Turns the company name into the symbol.",
                   "Precision":"Built around what you actually do: inspect, measure and document."}[cur]
            letter={'Evolution':'A','The Cornerstone':'B','Precision':'C','The Story':'D','The Damage':'E','The Work':'F'}[cur]
            out.append(f'<div class="dirh"><span>Direction {letter}</span>'
                       f'<h3>{cur}</h3><p>{blurb}</p></div>')
        out.append(f'''<article class="lc" data-pick="logo:{L["id"]}">
  <div class="lc__head"><span class="lc__n">{i:02d}</span><h4>{L["name"]}</h4>
    <button class="fav" type="button" data-fav="logo:{L["id"]}" aria-pressed="false">&#9825; Favorite</button></div>
  <div class="lc__tiles">
    <div class="tile tile--light">{lockup(L)}</div>
    <div class="tile tile--dark">{lockup(L)}</div>
  </div>
  <div class="lc__sizes">
    <div class="sz"><svg width="64" height="64"><use href="#{L["id"]}"/></svg><span>App icon</span></div>
    <div class="sz"><svg width="32" height="32"><use href="#{L["id"]}"/></svg><span>Browser tab</span></div>
    <div class="sz"><svg width="16" height="16"><use href="#{L["id"]}"/></svg><span>Smallest</span></div>
    <div class="sz sz--dark"><svg width="32" height="32"><use href="#{L["id"]}"/></svg><span>On dark</span></div>
  </div>
  <p class="lc__why">{L["why"]}</p>
  <button class="try" type="button" data-try-logo="{L["id"]}">Try it in the preview &darr;</button>
</article>''')
    return "\n".join(out)

def palette_cards():
    out=[]
    for i,P in enumerate(PALETTES,1):
        sw="".join(f'<div class="sw"><span class="sw__c" style="background:{c}"></span><b>{r}</b><code>{c}</code></div>'
                   for r,c in [("Accent",P["acc"]),("Accent dark",P["accDk"]),("Ink",P["ink"]),("Mid",P["mid"]),("Paper",P["paper"])])
        out.append(f'''<article class="pc" data-pal="{P["id"]}" style="--p-acc:{P["acc"]};--p-accdk:{P["accDk"]};--p-ink:{P["ink"]};--p-mid:{P["mid"]};--p-paper:{P["paper"]}">
  <div class="pc__head"><span class="lc__n">{i:02d}</span><div><h4>{P["name"]}</h4><p class="pc__tag">{P["tag"]}</p></div>
    <button class="fav" type="button" data-fav="palette:{P["id"]}" aria-pressed="false">&#9825; Favorite</button></div>
  <div class="pc__band"><span style="flex:3;background:{P["ink"]}"></span><span style="flex:2;background:{P["acc"]}"></span><span style="flex:1;background:{P["mid"]}"></span><span style="flex:2;background:{P["paper"]}"></span></div>
  <div class="pc__sw">{sw}</div>
  <div class="pc__demo" style="background:{P["paper"]}">
    <div class="pc__demoh" style="color:{P["ink"]}">Experience matters.</div>
    <p style="color:{P["mid"]}">Independent vehicle and equipment appraisal.</p>
    <span class="pc__btn" data-btn></span>
  </div>
  <ul class="pc__ck" data-ck></ul>
  <p class="pc__note">{P["note"]}</p>
  <button class="try" type="button" data-try-pal="{P["id"]}">Try it in the preview &darr;</button>
</article>''')
    return "\n".join(out)

def font_cards():
    out=[]
    for i,F in enumerate(FONTS,1):
        out.append(f'''<article class="fc" data-font="{F["id"]}">
  <div class="pc__head"><span class="lc__n">{i:02d}</span><div><h4>{F["name"]}</h4><p class="pc__tag">{F["tag"]}</p></div>
    <button class="fav" type="button" data-fav="fonts:{F["id"]}" aria-pressed="false">&#9825; Favorite</button></div>
  <div class="fc__spec" style="--fs:{F.get('fs',1)}">
    <div class="fc__label" style="font-family:{F["label"]};font-weight:{F["lw"]}">Independent Appraisal &middot; Damage Consulting</div>
    <div class="fc__h" style="font-family:{F["head"]};font-weight:{F["hw"]};letter-spacing:{F["hls"]}">When the Damage Is Complicated, Experience Matters.</div>
    <p class="fc__b" style="font-family:{F["body"]}">Technology can generate numbers. Experienced appraisal requires much more &mdash; knowing what is damaged, what caused it, and what it takes to repair it properly.</p>
    <div class="fc__nums" style="font-family:{F["nums"]}"><span>25+</span><span>150+</span><span>Level&nbsp;3</span></div>
    <div class="fc__az" style="font-family:{F["head"]};font-weight:{F["hw"]}">Aa Bb Cc 0123456789</div>
  </div>
  <p class="pc__note">{F["note"]}</p>
  <button class="try" type="button" data-try-font="{F["id"]}">Try it in the preview &darr;</button>
</article>''')
    return "\n".join(out)

HTML = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"page.html"),encoding="utf-8").read()
HTML = (HTML.replace("%%SYMBOLS%%", symbols()+symbols2())
            .replace("%%LOGOS%%", logo_cards())
            .replace("%%PALETTES%%", palette_cards())
            .replace("%%FONTS%%", font_cards())
            .replace("%%BADGE%%", "BADGEPLACEHOLDER", 1).replace("%%BADGE%%", "BADGEPLACEHOLDER2", 1)
            .replace("%%DATA%%", json.dumps(dict(logos=LOGOS, palettes=PALETTES, fonts=FONTS))))
BADGE = '<svg viewBox="0 0 220 220" role="img" aria-label="Round field badge">\n  <defs>\n    <path id="%(u)sT" d="M26 110A84 84 0 0 1 194 110"/>\n    <path id="%(u)sB" d="M30 110A80 80 0 0 0 190 110"/>\n  </defs>\n  <circle cx="110" cy="110" r="106" style="fill:var(--bd-bg)"/>\n  <circle cx="110" cy="110" r="100" fill="none" style="stroke:var(--bd-acc)" stroke-width="2.5"/>\n  <circle cx="110" cy="110" r="64" fill="none" style="stroke:var(--bd-fg)" stroke-width="1.2" opacity=".35"/>\n  <text style="fill:var(--bd-fg);font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:15px;letter-spacing:1.5px">\n    <textPath href="#%(u)sT" startOffset="50%%" text-anchor="middle">CORNERSTONE CLAIMS ADJUSTERS</textPath></text>\n  <text style="fill:var(--bd-fg);font-family:\'Barlow Condensed\',sans-serif;font-weight:600;font-size:14px;letter-spacing:3px">\n    <textPath href="#%(u)sB" startOffset="50%%" text-anchor="middle" dominant-baseline="hanging">EST. 2021 · PRATTVILLE, AL</textPath></text>\n  <path d="M12 110L17 105L22 110L17 115Z" style="fill:var(--bd-acc)"/>\n  <path d="M198 110L203 105L208 110L203 115Z" style="fill:var(--bd-acc)"/>\n  <svg x="70" y="70" width="80" height="80" viewBox="0 0 64 64"><use class="bdg-mark" href="#m4"/></svg>\n</svg>'
HTML = HTML.replace("BADGEPLACEHOLDER2", BADGE % {"u":"bdL"}).replace("BADGEPLACEHOLDER", BADGE % {"u":"bdD"})
with io.open(os.path.join(OUT,"index.html"),"w",encoding="utf-8") as f: f.write(HTML)
print("wrote", len(HTML), "bytes")
