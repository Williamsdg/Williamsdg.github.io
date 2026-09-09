# -*- coding: utf-8 -*-
# =============================================================================
# Cornerstone site generator.
#
# Regenerates every .html file in this folder from one shared header/footer.
# Run:  python3 _generator.py
#
# WARNING: running this OVERWRITES all 12 HTML files. If you have hand-edited
# the HTML, port the change back into this script first — otherwise it is lost.
# assets/cornerstone.css and assets/cornerstone.js are NOT touched by this
# script; edit those directly.
# =============================================================================
"""Cornerstone concept site generator -> preview/cornerstone/"""
import os, io

OUT = os.path.expanduser("~/Williamsdg.github.io/preview/cornerstone")

U = "https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=%d&q=%d"
def img(pid, w=1800, q=72): return U % (pid, w, q)

IMG = {
    "hero_home":  img("1652303713917-2666b8bee507", 2200, 72),   # excavator + crew, jobsite
    "quarry":     img("1523848309072-c199db53f137", 1800, 72),   # machines at mining area
    "collision":  img("1556086744-7502d61b1af5",    1800, 72),   # collision w/ apparatus
    "cat":        img("1621922688758-359fc864071e", 1200, 72),   # CAT dozer, graphic
    "hood":       img("1597328290883-50c5787b7c7e", 1200, 72),   # crushed hood detail
    "fleetlot":   img("1492168732976-2676c584c675", 1800, 72),   # aerial freight lot
    "headframe":  img("1758750518277-1a8a182033e7", 1200, 72),   # industrial structure
    "semi":       img("1592805144716-feeccccef5ac", 1800, 70),   # semi, warm sky
    "dozerwide":  img("1603814744174-115311ad645e", 2000, 70),   # dozer, dust, wide
    "rockexc":    img("1580901369227-308f6f40bdeb", 2000, 72),   # excavator, mountains
    "lineup":     img("1642927778267-4e8b787b325a", 1800, 72),   # row of machines
    "quarrywall": img("1606811883055-0d24f05c8bcd", 1400, 72),   # excavator on quarry wall
    "flatbed":    img("1673187139211-1e7ec3dd60ec", 1200, 72),   # car on flatbed
    "scania":     img("1601584115197-04ecc0da31d7", 1400, 72),   # tractor unit on road
}

MARK = ('<svg class="logo__mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">'
        '<rect x="1" y="1" width="30" height="30" stroke="currentColor" stroke-width="1.6"/>'
        '<rect x="1" y="19" width="12" height="12" fill="#D0761C"/>'
        '<path d="M13 31V19H31" stroke="currentColor" stroke-width="1.6"/></svg>')

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
           "%3Crect width='32' height='32' fill='%230D0F11'/%3E"
           "%3Crect x='4' y='4' width='24' height='24' fill='none' stroke='%23fff' stroke-width='2'/%3E"
           "%3Crect x='4' y='18' width='10' height='10' fill='%23D0761C'/%3E%3C/svg%3E")

AR = '<span class="ar" aria-hidden="true">&#8594;</span>'

NAV = [
    ("index.html",   "Home",     None),
    ("expertise.html","Expertise", [
        ("expertise-heavy-equipment.html", "Heavy Equipment", "Construction, agricultural &amp; specialized machinery"),
        ("expertise-complex-auto.html",    "Complex Auto Claims", "Losses that need investigation, not a photo app"),
        ("expertise-commercial-fleet.html","Commercial &amp; Fleet", "Trucks, trailers and transportation exposure"),
        ("expertise-specialty-claims.html","Specialty &amp; Disputed Claims", "Unusual, contested and high-exposure losses"),
    ]),
    ("services.html","Services",  None),
    ("about.html",   "About",     None),
    ("coverage.html","Coverage",  None),
    ("roster.html",  "Join Our Roster", None),
    ("contact.html", "Contact",   None),
]

# --------------------------------------------------------------------------- shell

def head(title, desc, extra=""):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>{title}</title>
<meta name="description" content="{desc}" />
<link rel="icon" href="{FAVICON}" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@85..125,400..900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/cornerstone.css" />
{extra}</head>
<body>
'''

def header(current):
    items = []
    for href, label, sub in NAV:
        cur = ' aria-current="page"' if href == current else ''
        if sub:
            links = "".join(
                f'<a href="{h}">{l}<span>{d}</span></a>' for h, l, d in sub)
            items.append(
                f'<div class="drop"><a href="{href}"{cur}>{label}</a>'
                f'<div class="drop__panel">{links}</div></div>')
        else:
            items.append(f'<a href="{href}"{cur}>{label}</a>')
    nav = "".join(items)

    dr = []
    for href, label, sub in NAV:
        dr.append(f'<a href="{href}">{label}</a>')
        if sub:
            dr.append('<div class="sub">' + "".join(
                f'<a href="{h}">{l}</a>' for h, l, d in sub) + '</div>')
    drawer = "".join(dr)

    return f'''<header class="hdr">
  <div class="wrap hdr__in">
    <a class="logo" href="index.html" aria-label="Cornerstone — home">
      {MARK}
      <span class="logo__txt">
        <span class="logo__name">Cornerstone</span>
        <span class="logo__sub">Appraisal &middot; Adjusting &middot; Claims Consulting</span>
      </span>
    </a>
    <nav class="nav" aria-label="Primary">{nav}</nav>
    <a class="btn hdr__cta" href="assign.html">Submit an Assignment</a>
    <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="drawer">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
<nav class="drawer" id="drawer" aria-label="Mobile">{drawer}</nav>
'''

MOBAR = '''<div class="mobar">
  <a class="btn btn--ghost" href="contact.html">Contact</a>
  <a class="btn" href="assign.html">Submit Assignment</a>
</div>
'''

def footer():
    exp = "".join(f'<li><a href="{h}">{l}</a></li>' for h, l, d in NAV[1][2])
    return f'''<footer class="ftr">
  <div class="wrap">
    <div class="ftr__top">
      <div>
        <a class="logo" href="index.html" style="margin-bottom:20px">
          {MARK}
          <span class="logo__txt">
            <span class="logo__name">Cornerstone</span>
            <span class="logo__sub">Appraisal &middot; Adjusting &middot; Claims Consulting</span>
          </span>
        </a>
        <p style="max-width:36ch;font-size:14px;color:#9AA3A9;margin-top:20px">
          Independent auto, heavy equipment and complex claims appraisal. Assignments accepted from
          carriers, TPAs, attorneys, fleet operators and self-insured entities.
        </p>
        <p style="font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.06em;color:#DAD6CE;margin-top:22px;line-height:2">
          <span class="ph">(XXX) XXX-XXXX</span><br>
          <span class="ph">assignments@[domain]</span>
        </p>
      </div>
      <div>
        <h4>Expertise</h4>
        <ul>{exp}</ul>
      </div>
      <div>
        <h4>Firm</h4>
        <ul>
          <li><a href="about.html">About Cornerstone</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="coverage.html">Coverage</a></li>
          <li><a href="roster.html">Join Our Roster</a></li>
        </ul>
      </div>
      <div>
        <h4>Engage</h4>
        <ul>
          <li><a href="assign.html">Submit an Assignment</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="roster.html">Adjuster Application</a></li>
        </ul>
      </div>
    </div>
    <div class="ftr__bot">
      <p>&copy; <span data-year>2026</span> Cornerstone. All rights reserved.</p>
      <p>Independent Appraisal &amp; Claims Consulting</p>
    </div>
  </div>
</footer>
{MOBAR}<script src="assets/cornerstone.js"></script>
</body>
</html>
'''

def page(filename, title, desc, body, extra_head=""):
    html = head(title, desc, extra_head) + header(filename) + body + footer()
    with io.open(os.path.join(OUT, filename), "w", encoding="utf-8") as f:
        f.write(html)
    return filename

# --------------------------------------------------------------------------- parts

def hero(image, eyebrow, h1, lede, buttons, alt, page_variant=False, credbar=None):
    cls = "hero hero--page" if page_variant else "hero"
    cb = ""
    if credbar:
        cells = "".join(
            f'<div class="credbar__i"><div class="credbar__n">{n}</div>'
            f'<div class="credbar__l">{l}</div></div>' for n, l in credbar)
        cb = f'<div class="credbar"><div class="wrap credbar__in">{cells}</div></div>'
    return f'''<section class="{cls}">
  <div class="hero__media"><img src="{image}" alt="{alt}" fetchpriority="high" /></div>
  <div class="hero__scrim"></div>
  <div class="hero__grid"></div>
  <div class="wrap hero__in">
    <p class="eyebrow">{eyebrow}</p>
    <h1 class="h-xl">{h1}</h1>
    <p class="lede">{lede}</p>
    <div class="btn-row">{buttons}</div>
  </div>
  {cb}
</section>
'''

def shead(eyebrow, title, right="", hcls="h-lg"):
    return f'''<div class="shead rv">
  <div><p class="eyebrow">{eyebrow}</p><h2 class="{hcls}">{title}</h2></div>
  <div class="shead__r">{right}</div>
</div>'''

SPECS = [
    ("01", "Heavy Equipment", "Construction, agricultural and specialized machinery — valued and inspected by someone who knows the iron.", "expertise-heavy-equipment.html", IMG["cat"], "Heavy construction dozer"),
    ("02", "Complex Auto Losses", "Claims that need deeper investigation, teardown and appraisal judgment rather than a photo estimate.", "expertise-complex-auto.html", IMG["hood"], "Front-end collision damage detail"),
    ("03", "Commercial &amp; Fleet", "Commercial vehicles, tractors, trailers, fleets and specialized transportation exposure.", "expertise-commercial-fleet.html", IMG["fleetlot"], "Aerial view of a commercial trailer lot"),
    ("04", "Specialty Claims", "Unusual, contested or high-exposure losses that call for experienced, defensible analysis.", "expertise-specialty-claims.html", IMG["headframe"], "Industrial structure against the sky"),
]

def spec_cards(container_class):
    out = []
    for n, t, d, href, im, alt in SPECS:
        out.append(f'''<a class="spec__c" href="{href}">
      <div class="spec__img"><img src="{im}" alt="{alt}" loading="lazy" /></div>
      <div class="spec__b">
        <div class="spec__n">{n}</div>
        <h3 class="spec__t">{t}</h3>
        <p class="spec__d">{d}</p>
        <span class="spec__go">Explore {AR}</span>
      </div>
    </a>''')
    cards = "\n    ".join(out)
    return f'<div class="{container_class}">\n    {cards}\n  </div>'

PROCESS = [
    ("01", "Submit", "Send the assignment, the file documentation and the contact for the unit. Anything you already have helps; we&rsquo;ll ask for the rest."),
    ("02", "Review", "Cornerstone evaluates the loss and assigns the right expertise &mdash; equipment, commercial, auto or consulting."),
    ("03", "Inspect", "An experienced appraiser handles the physical inspection, teardown coordination and documentation."),
    ("04", "Report", "Findings, photographs, estimate or valuation and supporting analysis are delivered back to the file."),
]

def process_block():
    steps = "".join(
        f'<div class="proc__s rv" data-rv-delay="{i*70}">'
        f'<div class="proc__n">{n}</div><h3 class="proc__t">{t}</h3>'
        f'<p class="proc__d">{d}</p></div>' for i, (n, t, d) in enumerate(PROCESS))
    return f'<div class="proc">{steps}</div>'

def cta_band(kicker, h2, lede, btns, image=None):
    image = image or IMG["dozerwide"]
    return f'''<section class="band">
  <div class="band__media"><img src="{image}" alt="" loading="lazy" /></div>
  <div class="band__scrim"></div>
  <div class="wrap band__in">
    <p class="eyebrow">{kicker}</p>
    <h2 class="h-lg" style="max-width:18ch">{h2}</h2>
    <p class="lede" style="color:rgba(255,255,255,.8)">{lede}</p>
    <div class="btn-row">{btns}</div>
    <p style="font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.1em;color:#9AA3A9;margin-top:34px;line-height:2.1">
      <span class="ph">(XXX) XXX-XXXX</span> &nbsp;&middot;&nbsp; <span class="ph">assignments@[domain]</span>
    </p>
  </div>
</section>
'''

# =========================================================================== HOME

home = hero(
    IMG["hero_home"],
    "Independent Appraisal &middot; Adjusting &middot; Claims Consulting",
    'Experience Matters<br>When the Claim<br>Gets Complicated.',
    '<span class="d-only">For more than 25 years, Clay Grigsby has worked inside the claims and collision '
    'industries. Cornerstone brings that experience to complex losses where technology alone '
    'isn&rsquo;t enough.</span>'
    '<span class="m-only">Independent appraisal and claims expertise backed by 25+ years inside the '
    'collision and insurance industries.</span>',
    f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
    f'<a class="btn btn--ghost btn--lg" href="expertise.html">Explore Our Expertise</a>',
    "Tracked excavator and crew working an active jobsite",
    credbar=[("25+", "Years Experience"), ("Independent", "Claims Expertise"),
             ("Specialized", "Complex Losses"), ("Expanding", "Adjuster Network")],
) + f'''
<!-- ========================================== Not every claim is simple -->
<section class="sect paper">
  <div class="wrap">
    {shead(
      "01 / The Landscape",
      "Technology has changed claims.<br>Expertise still matters.",
      '<p class="lede">Routine claims can increasingly be documented and processed digitally. '
      'Complex losses still require judgment, investigation, experience &mdash; and someone who '
      'understands what they are actually looking at.</p>'
      '<a class="tlink" href="expertise.html" style="margin-top:8px">Explore all expertise ' + AR + '</a>'
    )}
    {spec_cards("spec rv")}
  </div>
</section>

<!-- ============================================================ Clay / bio -->
<section class="sect dark gridlines">
  <div class="wrap">
    <div class="bio">
      <div class="bio__ph rv">
        <span class="bio__phtxt">Photograph<br>of Clay Grigsby<br><span class="ph">[ to be supplied ]</span></span>
      </div>
      <div class="rv" data-rv-delay="90">
        <p class="eyebrow">02 / The Experience Behind the Firm</p>
        <h2 class="h-lg">Built on 25+ Years<br>of Claims Experience.</h2>
        <p class="lede">Clay Grigsby did not learn estimating software and open a company. He has worked
        this industry from multiple sides &mdash; repairing the damage, adjusting the file, and appraising
        the loss independently. That progression is what Cornerstone is built on.</p>
        <div class="prog">
          <div class="prog__i"><div class="prog__k">Stage 01</div><div class="prog__t">Collision Repair</div></div>
          <div class="prog__i"><div class="prog__k">Stage 02</div><div class="prog__t">Carrier Adjusting</div></div>
          <div class="prog__i"><div class="prog__k">Stage 03</div><div class="prog__t">Independent Appraisal</div></div>
          <div class="prog__i"><div class="prog__k">Stage 04</div><div class="prog__t">Cornerstone</div></div>
        </div>
        <blockquote class="quote">
          &ldquo;I&rsquo;ve been on every side of a claim file. That&rsquo;s the part you can&rsquo;t automate.&rdquo;
          <cite>Clay Grigsby &mdash; Founder, Cornerstone</cite>
        </blockquote>
        <p style="font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#6B767E;margin-top:16px"><span class="ph">Placeholder wording &mdash; pending Clay&rsquo;s own quote</span></p>
        <div class="btn-row"><a class="btn btn--ghost" href="about.html">About Cornerstone {AR}</a></div>
      </div>
    </div>
  </div>
</section>

<!-- ========================================================= Specialty showcase -->
<section class="steel">
  <div class="show">
    <div class="show__media rv"><img src="{IMG['quarry']}" alt="Heavy machinery working an excavation site" loading="lazy" /></div>
    <div class="show__body rv" data-rv-delay="80">
      <p class="eyebrow">Specialty 01</p>
      <h2 class="h-md">Heavy Equipment<br>&amp; Machinery.</h2>
      <p class="lede">Excavators, dozers, loaders, cranes, agricultural equipment, attachments and
      specialized machinery. Losses where the value, the repair method and the downtime exposure all
      need someone who has stood next to the iron.</p>
      <ul class="show__list">
        <li>Physical damage appraisal and repair estimating</li>
        <li>Actual cash value and condition reporting</li>
        <li>Theft, fire, rollover, transport and jobsite losses</li>
        <li>Dealer, rental fleet and owner-operator assignments</li>
      </ul>
      <div class="btn-row"><a class="btn btn--ghost" href="expertise-heavy-equipment.html">Heavy Equipment Expertise {AR}</a></div>
    </div>
  </div>
  <div class="show show--flip">
    <div class="show__media rv"><img src="{IMG['collision']}" alt="Emergency response at a multi-vehicle collision scene" loading="lazy" /></div>
    <div class="show__body rv" data-rv-delay="80">
      <p class="eyebrow">Specialty 02</p>
      <h2 class="h-md">Complex &amp;<br>Specialty Claims.</h2>
      <p class="lede">The files that do not resolve on a photo estimate: disputed repairs, questionable
      damage, prior-loss overlap, litigation exposure and losses where the first appraisal did not hold up.</p>
      <ul class="show__list">
        <li>Re-inspection and second-opinion appraisal</li>
        <li>Disputed and contested damage analysis</li>
        <li>Appraisal clause and umpire-track assignments</li>
        <li>Consulting and litigation support</li>
      </ul>
      <div class="btn-row"><a class="btn btn--ghost" href="expertise-specialty-claims.html">Complex Claims {AR}</a></div>
    </div>
  </div>
</section>

<!-- ================================================================ Why us -->
<section class="sect">
  <div class="wrap">
    {shead("03 / Why Cornerstone", "When experience matters,<br>Cornerstone is there.",
      '<p class="lede">A firm built around technical credibility &mdash; not volume, and not a call centre '
      'between you and the person handling your file.</p>')}
    <div class="vals rv">
      <div class="val"><div class="val__n">/ 01</div><h3 class="val__t">Industry Experience</h3>
        <p class="val__d">25+ years working directly inside collision repair and insurance claims &mdash; not adjacent to them.</p></div>
      <div class="val"><div class="val__n">/ 02</div><h3 class="val__t">Independent Perspective</h3>
        <p class="val__d">Objective inspection, documentation and professional analysis that holds up under scrutiny.</p></div>
      <div class="val"><div class="val__n">/ 03</div><h3 class="val__t">Specialized Knowledge</h3>
        <p class="val__d">Comfortable with losses that do not fit neatly into an automated workflow.</p></div>
      <div class="val"><div class="val__n">/ 04</div><h3 class="val__t">Responsive Service</h3>
        <p class="val__d">Direct communication with the people doing the work, without layers in between.</p></div>
    </div>
  </div>
</section>

<!-- =============================================================== Process -->
<section class="sect dark gridlines">
  <div class="wrap">
    {shead("04 / How an Assignment Works", "A simpler way to handle<br>complicated claims.",
      '<p class="lede">Four steps, one point of contact, and a report your file can actually use.</p>')}
    {process_block()}
    <div class="btn-row rv"><a class="btn btn--lg" href="assign.html">Submit an Assignment</a>
      <a class="btn btn--ghost btn--lg" href="services.html">See All Services {AR}</a></div>
  </div>
</section>

<!-- ============================================================== Coverage -->
<section class="sect steel">
  <div class="wrap">
    {shead("05 / Coverage", "Local expertise.<br>Growing reach.",
      '<p class="lede">Cornerstone handles assignments directly across its core footprint and is actively '
      'building a vetted network of independent appraisers to extend that reach.</p>'
      '<a class="tlink" href="coverage.html" style="margin-top:8px">View coverage map ' + AR + '</a>')}
    <div class="cols2 rv">
      <div class="facts">
        <dl>
          <dt>Core Coverage</dt>
          <dd><span class="ph">Confirm states with Cornerstone</span> &mdash; direct inspection by Cornerstone appraisers.</dd>
          <dt>Cornerstone Network</dt>
          <dd>Expanding coverage through vetted independent adjusters and appraisers added to the roster.</dd>
          <dt>Assignment Types</dt>
          <dd>Single assignments, ongoing programs, catastrophe overflow and fleet support.</dd>
        </dl>
      </div>
      <div class="facts">
        <dl>
          <dt>Who We Work For</dt>
          <dd>Insurance carriers, third-party administrators, attorneys, fleet operators, equipment dealers,
          rental companies and self-insured entities.</dd>
          <dt>Growing the Roster</dt>
          <dd>As experienced adjusters join the network, coverage expands with them.</dd>
        </dl>
        <div class="btn-row" style="margin-top:26px"><a class="btn btn--ghost" href="roster.html">Join the Roster {AR}</a></div>
      </div>
    </div>
  </div>
</section>

<!-- ================================================================ Roster -->
<section class="sect paper">
  <div class="wrap">
    <div class="cols2">
      <div class="rv">
        <p class="eyebrow">06 / Join Our Roster</p>
        <h2 class="h-lg">Experienced adjusters.<br>Let&rsquo;s work together.</h2>
        <p class="lede">Cornerstone is building a network of experienced independent adjusters and
        appraisers who share our commitment to quality, accuracy and professionalism &mdash; particularly
        those with heavy equipment, commercial and complex loss backgrounds.</p>
        <div class="btn-row"><a class="btn btn--lg" href="roster.html">Join the Cornerstone Roster</a></div>
      </div>
      <div class="rv" data-rv-delay="90" style="align-self:stretch">
        <div style="position:relative;height:100%;min-height:300px;overflow:hidden;background:#1C2226">
          <img src="{IMG['lineup']}" alt="A line of heavy equipment machines" loading="lazy"
               style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />
        </div>
      </div>
    </div>
  </div>
</section>
''' + cta_band(
    "Put experience on the assignment",
    "Have a claim that requires more than an algorithm?",
    "Send it to a firm that has worked the file from every side.",
    f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
    f'<a class="btn btn--ghost btn--lg" href="contact.html">Contact Cornerstone</a>')

page("index.html",
     "Cornerstone &mdash; Independent Auto, Heavy Equipment &amp; Complex Claims Appraisal",
     "Independent appraisal, adjusting and claims consulting for heavy equipment, complex auto, "
     "commercial and specialty losses. 25+ years of collision and claims experience.",
     home)

# ====================================================================== EXPERTISE HUB

exp_hub = hero(
    IMG["rockexc"], "Expertise",
    "The claims that don&rsquo;t<br>fit the workflow.",
    "Cornerstone is organised around four areas of concentration. Each one exists because the losses "
    "inside it need judgment, physical inspection and someone who has handled the equipment before.",
    f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
    f'<a class="btn btn--ghost btn--lg" href="services.html">See Services {AR}</a>',
    "Excavator working rock at the base of a mountain range", page_variant=True,
) + f'''
<section class="sect paper">
  <div class="wrap">
    {shead("Areas of Concentration", "Four areas.<br>One standard of work.",
      '<p class="lede">Assignments are routed to the expertise the loss actually calls for &mdash; not to '
      'whoever is closest to the vehicle.</p>')}
    {spec_cards("spec rv")}
  </div>
</section>

<section class="sect dark gridlines">
  <div class="wrap">
    {shead("What Sits Underneath", "Every assignment is<br>handled the same way.",
      '<p class="lede">Regardless of the specialty, the deliverable is documentation your file can stand on.</p>')}
    <div class="caps rv">
      <div class="cap"><div class="cap__n">/ 01</div><h3 class="cap__t">Physical Inspection</h3>
        <p class="cap__d">Eyes on the unit. Photographs, measurements, teardown coordination and verification of what is actually damaged versus what is being claimed.</p></div>
      <div class="cap"><div class="cap__n">/ 02</div><h3 class="cap__t">Documented Findings</h3>
        <p class="cap__d">A written report with supporting photographs, the basis for each conclusion, and the reasoning behind repair-versus-replace decisions.</p></div>
      <div class="cap"><div class="cap__n">/ 03</div><h3 class="cap__t">Defensible Valuation</h3>
        <p class="cap__d">Estimates and valuations built to hold up in negotiation, in the appraisal clause process, and where necessary in litigation.</p></div>
      <div class="cap"><div class="cap__n">/ 04</div><h3 class="cap__t">Direct Communication</h3>
        <p class="cap__d">You talk to the person who inspected the unit. Questions get answered by someone who was standing there.</p></div>
    </div>
  </div>
</section>
''' + cta_band("Assignments", "Not sure which category the loss falls into?",
               "Send it anyway. Cornerstone will route it to the right expertise.",
               f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
               f'<a class="btn btn--ghost btn--lg" href="contact.html">Ask a Question</a>', IMG["quarry"])

page("expertise.html", "Expertise &mdash; Cornerstone Appraisal &amp; Claims Consulting",
     "Heavy equipment, complex auto, commercial and fleet, and specialty claims expertise from an "
     "independent appraisal and claims consulting firm.", exp_hub)


# ============================================================ SPECIALTY PAGE FACTORY

def specialty_page(fname, title_tag, meta, eyebrow, h1, lede, heroimg, heroalt,
                   intro_h, intro_p, caps, band_img, gallery, gal_alts, closing_h, closing_p):
    caps_html = "".join(
        f'<div class="cap"><div class="cap__n">/ {i+1:02d}</div><h3 class="cap__t">{t}</h3>'
        f'<p class="cap__d">{d}</p></div>' for i, (t, d) in enumerate(caps))
    gal = "".join(
        f'<div style="position:relative;aspect-ratio:4/3;overflow:hidden;background:#1C2226">'
        f'<img src="{g}" alt="{a}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" /></div>'
        for g, a in zip(gallery, gal_alts))

    body = hero(heroimg, eyebrow, h1, lede,
        f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
        f'<a class="btn btn--ghost btn--lg" href="expertise.html">All Expertise {AR}</a>',
        heroalt, page_variant=True) + f'''
<section class="sect paper">
  <div class="wrap">
    {shead("Overview", intro_h, f'<p class="lede">{intro_p}</p>')}
    <div class="cols2 rv">{gal}</div>
  </div>
</section>

<section class="sect dark gridlines">
  <div class="wrap">
    {shead("Assignment Types", "What Cornerstone handles.",
      '<p class="lede">If the loss is not listed, ask. The list reflects the common assignments, not the limits.</p>')}
    <div class="caps rv">{caps_html}</div>
  </div>
</section>

<section class="sect steel">
  <div class="wrap">
    {shead("How It Works", "A simpler way to handle<br>complicated claims.", "")}
    {process_block()}
  </div>
</section>
''' + cta_band("Put experience on the assignment", closing_h, closing_p,
               f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
               f'<a class="btn btn--ghost btn--lg" href="contact.html">Contact Cornerstone</a>', band_img)
    page(fname, title_tag, meta, body)


specialty_page(
    "expertise-heavy-equipment.html",
    "Heavy Equipment Appraisal &mdash; Cornerstone",
    "Independent heavy equipment appraisal for construction, agricultural and specialized machinery. "
    "Damage estimating, valuation and condition reporting.",
    "Expertise 01 / Heavy Equipment",
    "Heavy Equipment<br>&amp; Machinery Appraisal.",
    "Construction, agricultural and specialized machinery &mdash; appraised by someone who has worked "
    "around the iron, not someone reading a spec sheet for the first time.",
    IMG["quarry"], "Heavy machinery working an excavation site",
    "Equipment losses aren&rsquo;t<br>large auto losses.",
    "Repair methods, component pricing, undercarriage wear, hour meters, attachments and downtime "
    "exposure all move the number. So does knowing when a machine is economically repairable and when "
    "it is not. Cornerstone handles equipment assignments for carriers, dealers, rental fleets and "
    "self-insured owners.",
    [("Physical Damage Appraisal", "Damage assessment and repair estimating on excavators, dozers, loaders, skid steers, cranes, lifts, agricultural equipment and attachments."),
     ("Actual Cash Value &amp; Condition Reports", "Pre-loss condition and value analysis supported by hours, maintenance history, market comparables and physical inspection."),
     ("Theft, Fire &amp; Vandalism", "Loss verification, recovery condition assessment and documentation of what was actually taken or destroyed."),
     ("Rollover, Transport &amp; Jobsite Losses", "Incidents involving machine operation, loading, hauling and jobsite conditions, including structural and frame assessment."),
     ("Rental Fleet &amp; Dealer Assignments", "Fleet damage inspections, return-condition disputes and loss-of-use documentation for rental and dealer operations."),
     ("Total Loss &amp; Salvage Analysis", "Repair-versus-replace analysis, salvage value assessment and support for total loss determinations.")],
    IMG["dozerwide"],
    [IMG["cat"], IMG["quarrywall"]],
    ["Close view of a construction dozer", "Excavator working a steep quarry wall"],
    "Equipment on the claim? Put someone on it who knows the machine.",
    "Cornerstone accepts heavy equipment assignments from carriers, TPAs, dealers, rental fleets and self-insured owners.")


specialty_page(
    "expertise-complex-auto.html",
    "Complex Auto Claims Appraisal &mdash; Cornerstone",
    "Independent appraisal for complex auto losses: disputed damage, re-inspections, teardown "
    "coordination, total loss review and second-opinion appraisal.",
    "Expertise 02 / Complex Auto Claims",
    "Complex Auto<br>Loss Appraisal.",
    "The auto files that a photo estimate cannot close &mdash; disputed damage, suspect repairs, "
    "prior loss overlap and losses where the first appraisal did not hold up.",
    IMG["collision"], "Emergency apparatus at a multi-vehicle collision scene",
    "Some auto claims still<br>need a person on site.",
    "Most auto claims should be handled fast and digitally, and Cornerstone has no argument with that. "
    "The exceptions are the files where the damage is disputed, the repair is questionable, the history "
    "is complicated or the exposure is large enough that being wrong is expensive. Those still need "
    "hands on the vehicle.",
    [("Re-inspection &amp; Second Opinion", "Independent review where an existing estimate is disputed, appears inflated, or does not match the documented damage."),
     ("Teardown &amp; Supplement Verification", "Coordination and verification of teardown findings and supplement requests, with documentation of what the disassembly actually revealed."),
     ("Prior &amp; Unrelated Damage", "Separating the loss in question from pre-existing damage, prior repairs and unrelated conditions."),
     ("Repair Quality &amp; Workmanship", "Post-repair inspection where quality, method or completeness of the repair is in dispute."),
     ("Total Loss &amp; Valuation Review", "Review of total loss determinations, valuation methodology, condition adjustments and comparable selection."),
     ("Diminished Value", "Documented analysis of value loss following repair, prepared to support or respond to a claim.")],
    IMG["collision"],
    [IMG["hood"], IMG["flatbed"]],
    ["Detail of front-end collision damage", "Damaged vehicle loaded on a flatbed"],
    "The file that keeps coming back? Send it out once, properly.",
    "Re-inspections, disputed damage and second-opinion appraisals handled by an appraiser with collision-side experience.")


specialty_page(
    "expertise-commercial-fleet.html",
    "Commercial &amp; Fleet Appraisal &mdash; Cornerstone",
    "Independent appraisal for commercial vehicles, tractors, trailers and fleet operations. "
    "Damage estimating, downtime documentation and fleet program support.",
    "Expertise 03 / Commercial &amp; Fleet",
    "Commercial Vehicle<br>&amp; Fleet Appraisal.",
    "Tractors, trailers, box trucks, service vehicles, specialty bodies and the fleets that run them &mdash; "
    "where downtime is part of the exposure and the unit has to get back to work.",
    IMG["semi"], "A tractor-trailer on the highway at dusk",
    "A commercial unit out of<br>service costs more<br>than the repair.",
    "Commercial losses carry exposure that a passenger vehicle does not: specialty bodies and upfits, "
    "cargo considerations, DOT and roadworthiness questions, and revenue tied directly to how long the "
    "unit sits. Cornerstone documents the damage and the operational picture around it.",
    [("Tractor, Trailer &amp; Straight Truck", "Damage appraisal on power units, trailers, box trucks and straight trucks, including frame, suspension and driveline assessment."),
     ("Specialty Bodies &amp; Upfits", "Service bodies, utility beds, refrigeration units, tanks, lift gates, cranes and aftermarket upfitting valued as part of the loss."),
     ("Fleet Program Support", "Ongoing inspection support for fleet operators and their carriers, with consistent reporting across units and locations."),
     ("Downtime &amp; Loss of Use", "Documentation supporting loss-of-use and downtime exposure, including repair duration and parts availability."),
     ("Cargo &amp; Contents Considerations", "Documentation of cargo-related damage and contents affected by the loss, coordinated with the vehicle appraisal."),
     ("Rollover &amp; Major Collision", "Large-loss inspections where structural integrity, repairability and roadworthiness are all in question.")],
    IMG["fleetlot"],
    [IMG["fleetlot"], IMG["scania"]],
    ["Aerial view of a commercial trailer yard", "A tractor unit on the road"],
    "Fleet down? Get an appraiser who understands the clock.",
    "Single-unit assignments and ongoing fleet programs, handled with consistent documentation.")


specialty_page(
    "expertise-specialty-claims.html",
    "Specialty &amp; Disputed Claims Consulting &mdash; Cornerstone",
    "Consulting and independent appraisal for unusual, contested and high-exposure losses, including "
    "appraisal clause assignments and litigation support.",
    "Expertise 04 / Specialty &amp; Disputed Claims",
    "Specialty &amp;<br>Disputed Claims.",
    "The unusual files. Contested damage, competing appraisals, high exposure and losses that do not "
    "resemble anything in the workflow.",
    IMG["headframe"], "Industrial structure against an open sky",
    "When the file has<br>already gone sideways.",
    "Some claims arrive at Cornerstone after two appraisers have already disagreed, after coverage "
    "questions surfaced, or after counsel became involved. These assignments call for analysis that is "
    "documented well enough to be examined by someone who is trying to take it apart.",
    [("Appraisal Clause &amp; Umpire Assignments", "Service as an appraiser under the appraisal provision, with documented methodology and a clear basis for each position taken."),
     ("Competing Appraisal Analysis", "Line-by-line review of an opposing estimate, identifying methodology differences, omissions and pricing variances."),
     ("Litigation Support &amp; Consulting", "Technical analysis, documentation review and consulting support for counsel handling disputed or contested claims."),
     ("Cause &amp; Origin Coordination", "Coordination with cause-and-origin, mechanical and forensic specialists where the loss requires more than an appraisal."),
     ("Unusual &amp; Specialty Units", "Losses involving equipment, vehicles or assets that fall outside standard estimating systems and comparable databases."),
     ("Large &amp; High-Exposure Losses", "Assignments where the exposure justifies deeper investigation, extended documentation and a defensible written analysis.")],
    IMG["quarrywall"],
    [IMG["quarrywall"], IMG["hood"]],
    ["Excavator working a quarry face", "Close detail of collision damage"],
    "A file this complicated deserves more than an algorithm.",
    "Consulting, appraisal clause work and disputed loss analysis from an appraiser who has worked every side of the claim.")

# ======================================================================== SERVICES

SERVICE_GROUPS = [
    ("Appraisal", [
        ("Independent Damage Appraisal", "Physical inspection, damage documentation and a written repair estimate on auto, commercial and heavy equipment losses."),
        ("Re-inspection &amp; Second Opinion", "Independent review of an existing estimate where the scope, method or amount is in question."),
        ("Total Loss Evaluation", "Repair-versus-replace analysis, pre-loss condition assessment and salvage considerations."),
        ("Actual Cash Value &amp; Valuation Review", "Valuation analysis and review of methodology, condition adjustments and comparable selection."),
        ("Diminished Value Analysis", "Documented post-repair value loss analysis prepared to support or respond to a claim."),
    ]),
    ("Inspection &amp; Documentation", [
        ("Equipment Condition Reports", "Pre-loss, pre-rental, return and periodic condition documentation for equipment and fleets."),
        ("Teardown Coordination &amp; Verification", "Attendance and verification of teardown, with documentation of what disassembly revealed."),
        ("Post-Repair Inspection", "Verification that the repair matches the estimate in scope, method and quality."),
        ("Photo &amp; Scene Documentation", "Structured photographic documentation built for the file, not for the phone."),
    ]),
    ("Consulting", [
        ("Appraisal Clause Representation", "Service as a named appraiser under the policy&rsquo;s appraisal provision."),
        ("Litigation &amp; Counsel Support", "Technical review, estimate analysis and consulting support on contested claims."),
        ("Claims Process Consulting", "Review of estimating practice, vendor output quality and file documentation standards."),
        ("Expert Analysis on Disputed Losses", "Independent written analysis where two parties disagree on damage, method or value."),
    ]),
    ("Program Support", [
        ("Fleet Inspection Programs", "Recurring inspection support with consistent reporting across units and locations."),
        ("Catastrophe &amp; Overflow Support", "Additional appraisal capacity during volume surges and catastrophe deployment."),
        ("Carrier &amp; TPA Assignment Handling", "Standing assignment relationships with defined turnaround and reporting expectations."),
        ("Vendor Quality Review", "Independent review of the work product coming back from other appraisal vendors."),
    ]),
]

def service_group(name, rows, i):
    caps = "".join(
        f'<div class="cap"><div class="cap__n">/ {j+1:02d}</div><h3 class="cap__t">{t}</h3>'
        f'<p class="cap__d">{d}</p></div>' for j, (t, d) in enumerate(rows))
    return f'''<div class="rv" style="margin-bottom:clamp(46px,5vw,78px)">
      <p class="eyebrow">Group {i:02d}</p>
      <h2 class="h-md" style="margin-bottom:26px">{name}</h2>
      <div class="caps">{caps}</div>
    </div>'''

services = hero(
    IMG["dozerwide"], "Services",
    "What Cornerstone<br>actually does.",
    "Appraisal, inspection, consulting and program support &mdash; delivered as documentation your claim "
    "file can rely on.",
    f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
    f'<a class="btn btn--ghost btn--lg" href="expertise.html">Areas of Expertise {AR}</a>',
    "Dozer working an open site", page_variant=True,
) + f'''
<section class="sect paper">
  <div class="wrap">
    {shead("Service Index", "Four service lines.<br>One point of contact.",
      '<p class="lede">Assignments range from a single inspection to a standing program. Cornerstone will '
      'tell you plainly if a loss falls outside what it should be handling.</p>')}
    {"".join(service_group(n, r, i+1) for i, (n, r) in enumerate(SERVICE_GROUPS))}
  </div>
</section>

<section class="sect dark gridlines">
  <div class="wrap">
    {shead("Working With Cornerstone", "Who assigns this work.",
      '<p class="lede">Cornerstone accepts assignments directly and works alongside existing vendor panels '
      'rather than trying to replace them.</p>')}
    <div class="vals rv">
      <div class="val"><div class="val__n">/ 01</div><h3 class="val__t">Carriers &amp; TPAs</h3>
        <p class="val__d">Overflow, specialty and complex-loss assignments where the standard panel is not the right fit.</p></div>
      <div class="val"><div class="val__n">/ 02</div><h3 class="val__t">Attorneys</h3>
        <p class="val__d">Independent technical analysis and consulting on disputed and litigated claims.</p></div>
      <div class="val"><div class="val__n">/ 03</div><h3 class="val__t">Fleets &amp; Self-Insured</h3>
        <p class="val__d">Direct inspection support for organisations carrying their own risk.</p></div>
      <div class="val"><div class="val__n">/ 04</div><h3 class="val__t">Dealers &amp; Rental</h3>
        <p class="val__d">Condition reporting, damage documentation and return-condition disputes.</p></div>
    </div>
  </div>
</section>

<section class="sect steel">
  <div class="wrap">
    {shead("Process", "How an assignment works.", "")}
    {process_block()}
  </div>
</section>
''' + cta_band("Engage Cornerstone", "Ready to put the file in experienced hands?",
               "Send the assignment and Cornerstone will confirm receipt and scope.",
               f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
               f'<a class="btn btn--ghost btn--lg" href="contact.html">Contact</a>', IMG["lineup"])

page("services.html", "Services &mdash; Cornerstone Appraisal, Adjusting &amp; Claims Consulting",
     "Independent appraisal, inspection, consulting and program support for auto, heavy equipment, "
     "commercial and specialty claims.", services)


# =========================================================================== ABOUT

about = hero(
    IMG["rockexc"], "About Cornerstone",
    "The firm you call<br>when the claim<br>requires a real expert.",
    "Cornerstone is an independent appraisal, adjusting and claims consulting firm built on 25+ years "
    "of experience inside the collision and insurance industries.",
    f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
    f'<a class="btn btn--ghost btn--lg" href="roster.html">Join Our Roster {AR}</a>',
    "Excavator at work below a mountain range", page_variant=True,
) + f'''
<section class="sect paper">
  <div class="wrap">
    <div class="cols2">
      <div class="rv">
        <p class="eyebrow">The Firm</p>
        <h2 class="h-lg">Cornerstone exists for<br>the difficult files.</h2>
      </div>
      <div class="rv" data-rv-delay="80">
        <p class="lede">The claims industry is being reshaped by technology, and most of that change is
        good. Straightforward losses should be documented and settled quickly.</p>
        <p>What has not changed is the other end of the spectrum: heavy equipment losses, contested
        damage, commercial exposure and files where the first answer was wrong. Those still require
        someone who can stand in front of the unit and explain what happened to it.</p>
        <p>Cornerstone is built to be that firm &mdash; and to grow into a roster of appraisers who can
        do the same work to the same standard.</p>
      </div>
    </div>
  </div>
</section>

<section class="sect dark gridlines">
  <div class="wrap">
    <div class="bio">
      <div class="bio__ph rv">
        <span class="bio__phtxt">Photograph<br>of Clay Grigsby<br><span class="ph">[ to be supplied ]</span></span>
      </div>
      <div class="rv" data-rv-delay="90">
        <p class="eyebrow">Founder</p>
        <h2 class="h-lg">Clay Grigsby.</h2>
        <p class="lede">More than 25 years inside the claims and collision industries &mdash; and not from
        a single vantage point.</p>
        <p>Clay started in collision repair, where the work is physical and the consequences of a bad
        estimate show up on the shop floor. He moved into carrier adjusting, where the same damage is
        viewed through coverage, exposure and file management. He then moved into independent appraisal,
        working assignments for carriers and clients who needed an objective set of eyes.</p>
        <p>That progression is unusual, and it is the reason Cornerstone can handle files that do not
        resolve cleanly. Clay has been the person writing the estimate, the person questioning it and
        the person asked to settle the difference.</p>
        <div class="prog">
          <div class="prog__i"><div class="prog__k">Stage 01</div><div class="prog__t">Collision Repair</div></div>
          <div class="prog__i"><div class="prog__k">Stage 02</div><div class="prog__t">Carrier Adjusting</div></div>
          <div class="prog__i"><div class="prog__k">Stage 03</div><div class="prog__t">Independent Appraisal</div></div>
          <div class="prog__i"><div class="prog__k">Stage 04</div><div class="prog__t">Cornerstone</div></div>
        </div>
        <p style="font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#6B767E;margin-top:26px">
          <span class="ph">Licences, certifications &amp; dates pending confirmation</span></p>
      </div>
    </div>
  </div>
</section>

<section class="sect steel">
  <div class="wrap">
    {shead("How We Work", "Four things Cornerstone<br>will not compromise on.",
      '<p class="lede">These are the standards the roster is being built against.</p>')}
    <div class="vals rv">
      <div class="val"><div class="val__n">/ 01</div><h3 class="val__t">Industry Experience</h3>
        <p class="val__d">Every assignment is handled by someone who has genuinely done this work, not someone trained on the software last quarter.</p></div>
      <div class="val"><div class="val__n">/ 02</div><h3 class="val__t">Independent Perspective</h3>
        <p class="val__d">The finding is the finding. Cornerstone documents what the inspection supports, whichever side that helps.</p></div>
      <div class="val"><div class="val__n">/ 03</div><h3 class="val__t">Specialized Knowledge</h3>
        <p class="val__d">Comfort with equipment, commercial units and losses that fall outside standard estimating systems.</p></div>
      <div class="val"><div class="val__n">/ 04</div><h3 class="val__t">Responsive Service</h3>
        <p class="val__d">Direct communication, realistic turnaround commitments and no corporate layer between you and the appraiser.</p></div>
    </div>
  </div>
</section>

<section class="sect paper">
  <div class="wrap">
    <div class="cols2">
      <div class="rv">
        <p class="eyebrow">Where This Is Going</p>
        <h2 class="h-lg">Clay&rsquo;s experience is the<br>credibility. Cornerstone<br>is the firm.</h2>
      </div>
      <div class="rv" data-rv-delay="80">
        <p class="lede">Cornerstone is deliberately being built as a firm rather than as one person&rsquo;s
        book of business.</p>
        <p>That means adding experienced independent adjusters and appraisers to a vetted roster,
        extending coverage into new markets, and holding every assignment to the same standard of
        inspection and documentation regardless of who handles it.</p>
        <div class="btn-row">
          <a class="btn" href="roster.html">Join the Cornerstone Roster</a>
          <a class="btn btn--ghost" href="coverage.html">View Coverage {AR}</a>
        </div>
      </div>
    </div>
  </div>
</section>
''' + cta_band("Work With Cornerstone", "Experience you can put on the assignment.",
               "Send a file, ask a question, or apply to join the roster.",
               f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
               f'<a class="btn btn--ghost btn--lg" href="contact.html">Contact Cornerstone</a>', IMG["quarry"])

page("about.html", "About &mdash; Cornerstone Appraisal, Adjusting &amp; Claims Consulting",
     "Cornerstone is an independent appraisal and claims consulting firm founded on 25+ years of "
     "collision repair, carrier adjusting and independent appraisal experience.", about)

# ======================================================================== COVERAGE

STATE_NAMES = {
 "AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado",
 "CT":"Connecticut","DE":"Delaware","DC":"District of Columbia","FL":"Florida","GA":"Georgia",
 "HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky",
 "LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota",
 "MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire",
 "NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota",
 "OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina",
 "SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia",
 "WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming",
}

# Standard 12-column US tile-grid layout.
TILE_ROWS = [
 ["AK","","","","","","","","","","","ME"],
 ["","","","","","","","","","","VT","NH"],
 ["","WA","ID","MT","ND","MN","IL","WI","MI","NY","RI","MA"],
 ["","OR","NV","WY","SD","IA","IN","OH","PA","NJ","CT",""],
 ["","CA","UT","CO","NE","MO","KY","WV","VA","MD","DE",""],
 ["","","AZ","NM","KS","AR","TN","NC","SC","DC","",""],
 ["","","","","OK","LA","MS","AL","GA","","",""],
 ["HI","","","","TX","","","","FL","","",""],
]

# ---------------------------------------------------------------------------
# PLACEHOLDER COVERAGE DATA.
# Replace CORE with the states Cornerstone actually covers directly, and NET
# with the states targeted through the growing adjuster roster.
# ---------------------------------------------------------------------------
CORE = {"AL", "GA", "MS", "TN", "FL"}
NET  = {"LA", "AR", "SC", "NC", "KY", "MO", "TX", "VA", "OK", "IN", "OH", "KS"}

def tilemap():
    cells = []
    for row in TILE_ROWS:
        for st in row:
            if not st:
                cells.append('<div class="tile tile--empty" aria-hidden="true"></div>')
                continue
            core = "1" if st in CORE else "0"
            net = "1" if st in NET else "0"
            on = "core" if st in CORE else ("net" if st in NET else "")
            label = STATE_NAMES.get(st, st)
            status = ("Core coverage" if st in CORE else
                      "Cornerstone network &mdash; expanding" if st in NET else "Not currently covered")
            cells.append(
                f'<div class="tile" data-state="{st}" data-core="{core}" data-net="{net}" '
                f'data-on="{on}" title="{label} — {status.replace("&mdash;","—")}">{st}</div>')
    return '<div class="tilemap rv" role="img" aria-label="United States coverage map by state">' + "".join(cells) + '</div>'

coverage = hero(
    IMG["lineup"], "Coverage",
    "Local expertise.<br>Growing reach.",
    "Cornerstone handles assignments directly across its core footprint, and is extending coverage "
    "through a vetted roster of independent adjusters and appraisers.",
    f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
    f'<a class="btn btn--ghost btn--lg" href="roster.html">Join the Roster {AR}</a>',
    "A line of heavy equipment machines", page_variant=True,
) + f'''
<section class="sect dark gridlines">
  <div class="wrap">
    {shead("Coverage Map", "Where Cornerstone works.",
      '<p class="lede">Toggle between the coverage Cornerstone handles directly today and the footprint '
      'the roster is being built to reach.</p>')}
    <div class="mapwrap">
      <div>
        <div class="seg rv" data-map-toggle role="group" aria-label="Coverage view">
          <button type="button" data-mode="core" aria-pressed="false"
                  data-caption="States Cornerstone covers directly today.">Current Coverage</button>
          <button type="button" data-mode="net" aria-pressed="true"
                  data-caption="Current coverage plus the markets the Cornerstone roster is expanding into.">Cornerstone Network</button>
        </div>
        {tilemap()}
        <p class="hint rv" data-map-caption style="margin-top:22px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9AA3A9">
          Current coverage plus the markets the Cornerstone roster is expanding into.</p>
        <p class="hint rv" style="margin-top:14px;max-width:60ch">
          <span class="ph">Coverage shown is illustrative pending confirmation of Cornerstone&rsquo;s
          licensed and serviced states.</span></p>
      </div>
      <div class="rv" data-rv-delay="80">
        <ul class="legend">
          <li><span class="sw sw--core"></span> Core coverage &mdash; direct</li>
          <li><span class="sw sw--net"></span> Network &mdash; expanding</li>
          <li><span class="sw sw--off"></span> Not currently covered</li>
        </ul>
        <div class="facts">
          <dl>
            <dt>Direct Coverage</dt>
            <dd>Assignments inspected by Cornerstone appraisers, typically within a day&rsquo;s drive.</dd>
            <dt>Network Coverage</dt>
            <dd>Assignments handled by vetted independent adjusters on the Cornerstone roster, to the
            same inspection and reporting standard.</dd>
            <dt>Outside the Map</dt>
            <dd>Ask. Cornerstone will either place the assignment or tell you plainly that it cannot.</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sect paper">
  <div class="wrap">
    {shead("Expanding", "The map grows with<br>the roster.",
      '<p class="lede">Every experienced adjuster who joins Cornerstone extends what the firm can accept '
      '&mdash; which is why the roster is treated as core infrastructure rather than overflow.</p>')}
    <div class="vals rv">
      <div class="val"><div class="val__n">/ 01</div><h3 class="val__t">Vetted, Not Recruited</h3>
        <p class="val__d">Roster applicants are reviewed on experience, specialty and work product before they receive assignments.</p></div>
      <div class="val"><div class="val__n">/ 02</div><h3 class="val__t">Consistent Standard</h3>
        <p class="val__d">The same inspection expectations and reporting format regardless of who handles the file.</p></div>
      <div class="val"><div class="val__n">/ 03</div><h3 class="val__t">Specialty Matched</h3>
        <p class="val__d">Equipment assignments go to equipment people. Commercial goes to commercial.</p></div>
      <div class="val"><div class="val__n">/ 04</div><h3 class="val__t">One Point of Contact</h3>
        <p class="val__d">You assign to Cornerstone. Cornerstone manages who handles it.</p></div>
    </div>
  </div>
</section>
''' + cta_band("Coverage", "Have a loss outside the footprint?",
               "Send it. If Cornerstone cannot place it, you will be told quickly rather than slowly.",
               f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
               f'<a class="btn btn--ghost btn--lg" href="roster.html">Join the Roster</a>', IMG["semi"])

page("coverage.html", "Coverage &mdash; Cornerstone Appraisal &amp; Claims Consulting",
     "Cornerstone coverage map: states served directly and the expanding Cornerstone adjuster network.",
     coverage)

# ==================================================================== FORM HELPERS

def f_text(name, label, req=True, full=False, typ="text", ph="", hint=""):
    r = ' <span class="req">*</span>' if req else ''
    rq = ' required' if req else ''
    cls = "field field--full" if full else "field"
    h = f'<div class="hint">{hint}</div>' if hint else ''
    return (f'<div class="{cls}"><label for="{name}">{label}{r}</label>'
            f'<input type="{typ}" id="{name}" name="{name}"{rq} placeholder="{ph}" />{h}'
            f'<div class="err"></div></div>')

def f_sel(name, label, options, req=True, full=False, hint=""):
    r = ' <span class="req">*</span>' if req else ''
    rq = ' required' if req else ''
    cls = "field field--full" if full else "field"
    opts = '<option value="">Select&hellip;</option>' + "".join(f'<option>{o}</option>' for o in options)
    h = f'<div class="hint">{hint}</div>' if hint else ''
    return (f'<div class="{cls}"><label for="{name}">{label}{r}</label>'
            f'<select id="{name}" name="{name}"{rq}>{opts}</select>{h}<div class="err"></div></div>')

def f_area(name, label, req=False, hint=""):
    r = ' <span class="req">*</span>' if req else ''
    rq = ' required' if req else ''
    h = f'<div class="hint">{hint}</div>' if hint else ''
    return (f'<div class="field field--full"><label for="{name}">{label}{r}</label>'
            f'<textarea id="{name}" name="{name}"{rq}></textarea>{h}<div class="err"></div></div>')

def f_checks(name, label, items):
    boxes = "".join(
        f'<label class="check"><input type="checkbox" name="{name}" value="{i}" /> <span>{i}</span></label>'
        for i in items)
    return (f'<div class="field field--full"><label>{label}</label>'
            f'<div class="checks">{boxes}</div></div>')

def f_file(name, label, note):
    return (f'<div class="field field--full"><label for="{name}">{label}</label>'
            f'<label class="filedrop" for="{name}">'
            f'<span class="filedrop__t">Choose a file</span>'
            f'<span class="filedrop__s" data-default="{note}">{note}</span>'
            f'<input type="file" id="{name}" name="{name}" /></label></div>')

CHECK_SVG = ('<svg class="formdone__ic" viewBox="0 0 52 52" fill="none" aria-hidden="true">'
             '<rect x="1" y="1" width="50" height="50" stroke="#D0761C" stroke-width="1.5"/>'
             '<path d="M15 26.5 L23 34 L38 19" stroke="#D0761C" stroke-width="2.5"/></svg>')

def done_panel(pid, title, msg):
    return f'''<div class="formdone" id="{pid}" role="status" aria-live="polite">
  {CHECK_SVG}
  <h3 class="h-md">{title}</h3>
  <p class="lede" style="margin-inline:auto;text-align:center">{msg}</p>
  <div class="btn-row" style="justify-content:center"><a class="btn btn--ghost" href="index.html">Back to Home</a></div>
</div>'''

WIRING_NOTE = """<!--
  ============================================================================
  FORM WIRING — NOT YET CONNECTED
  This form validates in the browser and shows a confirmation panel, but it
  does not transmit anywhere. Before this page goes live, point it at a real
  handler (Formspree / Netlify Forms / a Supabase function) and replace the
  client-side success panel with the handler's response.
  File uploads in particular need a real endpoint — the input below is inert.
  ============================================================================
-->"""

# =============================================================== SUBMIT ASSIGNMENT

assign_form = f'''{WIRING_NOTE}
<form class="form" data-validate data-done="assign-done" id="assign-form">
  {f_text("org", "Company / Firm", True, ph="Carrier, TPA, firm or fleet")}
  {f_text("contact", "Your Name", True)}
  {f_text("email", "Email", True, typ="email")}
  {f_text("phone", "Phone", True, typ="tel")}
  {f_text("claimno", "Claim / File Number", False)}
  {f_text("dol", "Date of Loss", False, typ="date")}
  {f_sel("losstype", "Assignment Type", [
      "Heavy equipment", "Complex auto", "Commercial / fleet",
      "Specialty or disputed claim", "Re-inspection / second opinion",
      "Consulting / litigation support", "Not sure — please advise"])}
  {f_sel("urgency", "Urgency", [
      "Standard", "Expedited — inspection within 48 hours", "Rush — same or next day",
      "Scheduled for a future date"])}
  {f_text("unit", "Unit / Equipment Description", True, full=True,
          ph="Year, make, model, serial or VIN — as much as you have")}
  {f_text("location", "Location of the Unit", True, full=True,
          ph="City, state and site or facility name")}
  {f_text("owner", "Owner / Contact at the Unit", False, full=True,
          ph="Who Cornerstone should call to arrange access")}
  {f_area("notes", "What Happened / What You Need",
          hint="Damage description, what has already been done on the file, and what you need back.")}
  {f_file("docs", "Supporting Documentation",
          "Existing estimates, photographs, police report, prior appraisals")}
  <div class="field field--full">
    <button class="btn btn--lg" type="submit" style="width:100%">Submit Assignment</button>
    <div class="hint" style="text-align:center;margin-top:16px">
      Cornerstone confirms receipt and scope before any inspection is scheduled.
    </div>
  </div>
</form>
{done_panel("assign-done", "Assignment received.",
  "Cornerstone will confirm receipt, review the loss and come back to you with the assigned expertise "
  "and an inspection window.")}'''

assign = hero(
    IMG["hood"], "Submit an Assignment",
    "Put experience<br>on the assignment.",
    "Send what you have. Cornerstone will confirm receipt, determine the right expertise and come back "
    "with an inspection window.",
    f'<a class="btn btn--lg" href="#assign-form">Start the Form</a>'
    f'<a class="btn btn--ghost btn--lg" href="contact.html">Ask First {AR}</a>',
    "Close detail of collision damage", page_variant=True,
) + f'''
<section class="sect dark gridlines">
  <div class="wrap">
    <div class="cols2" style="align-items:start">
      <div class="rv" style="position:sticky;top:110px">
        <p class="eyebrow">Assignment Intake</p>
        <h2 class="h-md">What to send.</h2>
        <p class="lede">Nothing here is a hard requirement. Send what you have and Cornerstone will
        ask for the rest.</p>
        <div class="caps" style="margin-top:30px">
          <div class="cap" style="grid-template-columns:60px 1fr">
            <div class="cap__n">/ 01</div>
            <div><h3 class="cap__t" style="margin-bottom:8px">The Unit</h3>
            <p class="cap__d">Year, make, model, serial or VIN, and where it is sitting.</p></div>
          </div>
          <div class="cap" style="grid-template-columns:60px 1fr">
            <div class="cap__n">/ 02</div>
            <div><h3 class="cap__t" style="margin-bottom:8px">The Access</h3>
            <p class="cap__d">Who Cornerstone calls to get in front of the equipment or vehicle.</p></div>
          </div>
          <div class="cap" style="grid-template-columns:60px 1fr">
            <div class="cap__n">/ 03</div>
            <div><h3 class="cap__t" style="margin-bottom:8px">The File</h3>
            <p class="cap__d">Existing estimates, photographs and anything already in dispute.</p></div>
          </div>
          <div class="cap" style="grid-template-columns:60px 1fr">
            <div class="cap__n">/ 04</div>
            <div><h3 class="cap__t" style="margin-bottom:8px">The Ask</h3>
            <p class="cap__d">What you actually need back &mdash; an estimate, a valuation, an opinion.</p></div>
          </div>
        </div>
        <p style="font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.08em;color:#DAD6CE;margin-top:34px;line-height:2.2">
          Prefer to call?<br>
          <span class="ph">(XXX) XXX-XXXX</span><br>
          <span class="ph">assignments@[domain]</span>
        </p>
      </div>
      <div class="rv" data-rv-delay="80">{assign_form}</div>
    </div>
  </div>
</section>

<section class="sect steel">
  <div class="wrap">
    {shead("After You Submit", "What happens next.", "")}
    {process_block()}
  </div>
</section>
'''

page("assign.html", "Submit an Assignment &mdash; Cornerstone",
     "Submit an appraisal, inspection or consulting assignment to Cornerstone. Heavy equipment, "
     "complex auto, commercial fleet and specialty claims.", assign)


# ================================================================= JOIN OUR ROSTER

roster_form = f'''{WIRING_NOTE}
<form class="form" data-validate data-done="roster-done" id="roster-form">
  {f_text("rname", "Full Name", True)}
  {f_text("remail", "Email", True, typ="email")}
  {f_text("rphone", "Phone", True, typ="tel")}
  {f_text("rloc", "Location", True, ph="City, state")}
  {f_sel("ryears", "Years of Experience", [
      "1–3 years", "4–7 years", "8–14 years", "15–24 years", "25+ years"])}
  {f_sel("ravail", "Availability", [
      "Full time", "Part time", "Overflow / as needed", "Catastrophe deployment only"])}
  {f_text("rstates", "States Covered", True, full=True,
          ph="List every state you are licensed or able to work")}
  {f_checks("rspec", "Specialties", [
      "Heavy equipment", "Complex auto", "Commercial &amp; fleet", "Agricultural equipment",
      "Total loss / valuation", "Appraisal clause / umpire", "Catastrophe", "Litigation support"])}
  {f_sel("rheavy", "Heavy Equipment Experience", [
      "Extensive — primary specialty", "Moderate — regular assignments",
      "Limited — occasional", "None yet"])}
  {f_sel("rauto", "Auto Experience", [
      "Extensive — primary specialty", "Moderate — regular assignments",
      "Limited — occasional", "None yet"])}
  {f_sel("rcomm", "Commercial Experience", [
      "Extensive — primary specialty", "Moderate — regular assignments",
      "Limited — occasional", "None yet"], full=True)}
  {f_area("rcerts", "Licences &amp; Certifications",
          hint="Adjuster licences by state, I-CAR, ASE, equipment certifications, appraisal credentials.")}
  {f_area("rnotes", "Anything Else We Should Know", hint="Optional.")}
  {f_file("rresume", "Resume", "PDF or Word document")}
  <div class="field field--full">
    <button class="btn btn--lg" type="submit" style="width:100%">Submit Application</button>
    <div class="hint" style="text-align:center;margin-top:16px">
      Applications are reviewed individually. Cornerstone responds either way.
    </div>
  </div>
</form>
{done_panel("roster-done", "Application received.",
  "Cornerstone will review your experience and coverage area and follow up directly. Every application "
  "gets a response.")}'''

roster = hero(
    IMG["lineup"], "Join Our Roster",
    "Experienced adjusters.<br>Let&rsquo;s work together.",
    "Cornerstone is building a network of experienced independent adjusters and appraisers who share "
    "our commitment to quality, accuracy and professionalism.",
    f'<a class="btn btn--lg" href="#roster-form">Join the Cornerstone Roster</a>'
    f'<a class="btn btn--ghost btn--lg" href="about.html">About the Firm {AR}</a>',
    "A line of heavy equipment machines", page_variant=True,
) + f'''
<section class="sect paper">
  <div class="wrap">
    {shead("Who We Are Looking For", "Experience first.<br>Everything else follows.",
      '<p class="lede">Cornerstone is not building a volume panel. The roster is being assembled '
      'deliberately, with a bias toward appraisers who can handle the assignments most vendors decline.</p>')}
    <div class="vals rv">
      <div class="val"><div class="val__n">/ 01</div><h3 class="val__t">Real Field Experience</h3>
        <p class="val__d">You have inspected units, written estimates and defended your findings to people who disagreed.</p></div>
      <div class="val"><div class="val__n">/ 02</div><h3 class="val__t">Specialty Depth</h3>
        <p class="val__d">Heavy equipment, commercial, agricultural or complex auto backgrounds are particularly valuable.</p></div>
      <div class="val"><div class="val__n">/ 03</div><h3 class="val__t">Documentation Discipline</h3>
        <p class="val__d">Clean photographs, complete notes and reports that stand up without a follow-up call.</p></div>
      <div class="val"><div class="val__n">/ 04</div><h3 class="val__t">Professionalism</h3>
        <p class="val__d">You represent Cornerstone in front of insureds, shops and jobsite personnel.</p></div>
    </div>
  </div>
</section>

<section class="sect dark gridlines">
  <div class="wrap">
    <div class="cols2" style="align-items:start">
      <div class="rv" style="position:sticky;top:110px">
        <p class="eyebrow">Adjuster Application</p>
        <h2 class="h-md">Apply to the<br>Cornerstone roster.</h2>
        <p class="lede">Tell us where you work, what you handle and what you have handled before.</p>
        <div class="facts" style="margin-top:30px">
          <dl>
            <dt>Assignment Flow</dt>
            <dd>Assignments are matched to specialty and coverage area, not distributed by rotation.</dd>
            <dt>Standards</dt>
            <dd>One inspection and reporting standard across the roster, so the client experience does
            not change with the appraiser.</dd>
            <dt>Review</dt>
            <dd>Applications are reviewed individually. You will hear back either way.</dd>
          </dl>
        </div>
      </div>
      <div class="rv" data-rv-delay="80">{roster_form}</div>
    </div>
  </div>
</section>
''' + cta_band("Questions First?", "Not sure whether you are a fit?",
               "Ask. It is a short conversation and it saves everyone time.",
               f'<a class="btn btn--lg" href="contact.html">Contact Cornerstone</a>'
               f'<a class="btn btn--ghost btn--lg" href="about.html">About the Firm</a>', IMG["dozerwide"])

page("roster.html", "Join Our Roster &mdash; Cornerstone Adjuster &amp; Appraiser Network",
     "Cornerstone is building a network of experienced independent adjusters and appraisers. Apply to "
     "join the Cornerstone roster.", roster)


# ========================================================================= CONTACT

contact_form = f'''{WIRING_NOTE}
<form class="form" data-validate data-done="contact-done" id="contact-form">
  {f_text("cname", "Name", True)}
  {f_text("corg", "Company / Firm", False)}
  {f_text("cemail", "Email", True, typ="email")}
  {f_text("cphone", "Phone", False, typ="tel")}
  {f_sel("creason", "Reason for Contact", [
      "New assignment", "Question about an existing assignment", "Coverage question",
      "Adjuster roster / joining the network", "General enquiry"], full=True)}
  {f_area("cmsg", "Message", True)}
  <div class="field field--full">
    <button class="btn btn--lg" type="submit" style="width:100%">Send Message</button>
  </div>
</form>
{done_panel("contact-done", "Message sent.",
  "Cornerstone will respond directly. For a live assignment, the assignment form routes faster.")}'''

contact = hero(
    IMG["scania"], "Contact",
    "Talk to someone<br>who has worked<br>the file.",
    "Assignments, coverage questions and roster enquiries all reach the same place.",
    f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
    f'<a class="btn btn--ghost btn--lg" href="#contact-form">Send a Message {AR}</a>',
    "A commercial tractor unit on the road", page_variant=True,
) + f'''
<section class="sect dark gridlines">
  <div class="wrap">
    <div class="cols2" style="align-items:start">
      <div class="rv">
        <p class="eyebrow">Direct</p>
        <h2 class="h-md">Cornerstone.</h2>
        <p class="lede">Appraisal, Adjusting &amp; Claims Consulting.</p>
        <div class="facts" style="margin-top:30px">
          <dl>
            <dt>Assignments</dt>
            <dd><span class="ph">assignments@[domain]</span></dd>
            <dt>Telephone</dt>
            <dd><span class="ph">(XXX) XXX-XXXX</span></dd>
            <dt>Office</dt>
            <dd><span class="ph">[ Street address ]</span><br><span class="ph">[ City, State ZIP ]</span></dd>
            <dt>Hours</dt>
            <dd><span class="ph">[ Business hours &mdash; and after-hours availability, if offered ]</span></dd>
          </dl>
        </div>
        <p class="hint" style="margin-top:26px;max-width:52ch">
          <span class="ph">Contact details are placeholders pending confirmation from Cornerstone.</span></p>
        <div class="btn-row">
          <a class="btn btn--ghost" href="assign.html">Submit an Assignment {AR}</a>
        </div>
      </div>
      <div class="rv" data-rv-delay="80">
        <p class="eyebrow">Send a Message</p>
        <h2 class="h-md" style="margin-bottom:28px">How can Cornerstone help?</h2>
        {contact_form}
      </div>
    </div>
  </div>
</section>

<section class="sect paper">
  <div class="wrap">
    {shead("Routing", "Three ways in.",
      '<p class="lede">Use the one that matches what you need &mdash; it gets to the right place faster.</p>')}
    <div class="caps rv">
      <div class="cap"><div class="cap__n">/ 01</div><h3 class="cap__t">Submit an Assignment</h3>
        <p class="cap__d">A live loss that needs inspection, appraisal or consulting.
        <a class="tlink" href="assign.html" style="display:inline-flex;margin-left:10px">Assignment form {AR}</a></p></div>
      <div class="cap"><div class="cap__n">/ 02</div><h3 class="cap__t">Join the Roster</h3>
        <p class="cap__d">Experienced independent adjusters and appraisers applying to the network.
        <a class="tlink" href="roster.html" style="display:inline-flex;margin-left:10px">Application {AR}</a></p></div>
      <div class="cap"><div class="cap__n">/ 03</div><h3 class="cap__t">Everything Else</h3>
        <p class="cap__d">Coverage questions, existing files and general enquiries &mdash; use the form above or call directly.</p></div>
    </div>
  </div>
</section>
'''

page("contact.html", "Contact &mdash; Cornerstone Appraisal, Adjusting &amp; Claims Consulting",
     "Contact Cornerstone for appraisal assignments, coverage questions or to join the adjuster roster.",
     contact)

print("pages written to", OUT)
