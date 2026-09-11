# -*- coding: utf-8 -*-
"""Cornerstone site generator — built to the September 2026 redesign brief."""
import os, io

OUT = os.path.expanduser("~/Williamsdg.github.io/preview/cornerstone")
U = "https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=%d&q=%d"
def u(p, w=1400, q=72): return U % (p, w, q)

IMG = {
  "hero":     "assets/fleet-hero.jpg",                    # their own fleet photo
  "damage":   u("1597328290883-50c5787b7c7e", 1200),      # crushed hood detail
  "fleetlot": u("1492168732976-2676c584c675", 1200),      # aerial trailer yard
  "cat":      u("1621922688758-359fc864071e", 1200),      # CAT dozer
  "engine":   u("1625047509248-ec889cbff17f", 1200),      # mechanic inspecting engine
  "lift":     u("1727893304219-063d142ce6f3", 1200),      # car on a shop lift
  "shop":     u("1727893119356-1702fe921cf9", 1200),      # bright body shop
  "semi":     u("1592805144716-feeccccef5ac", 1800, 70),  # tractor unit, dusk
  "quarry":   u("1523848309072-c199db53f137", 1800),      # machines at excavation
  "collision":u("1556086744-7502d61b1af5",    1800),      # collision scene
  "rock":     u("1580901369227-308f6f40bdeb", 1800),      # excavator, mountains
  "scania":   u("1601584115197-04ecc0da31d7", 1600),      # tractor unit on road
}

PHONE      = "334-568-9450"
PHONE_HREF = "tel:+13345689450"
EMAIL      = "clay@cornerstoneadj.com"
AR = '<span class="ar" aria-hidden="true">&#8594;</span>'

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
           "%3Crect width='32' height='32' fill='%23ffffff'/%3E"
           "%3Ccircle cx='13' cy='16' r='8' fill='none' stroke='%23D91A3B' stroke-width='4'/%3E"
           "%3Crect x='19' y='11' width='9' height='9' transform='rotate(45 23.5 15.5)' fill='%23D91A3B'/%3E%3C/svg%3E")

# Nav per the brief: Home, Services, Fleet & Commercial, Claims Consulting, About, Contact
NAV = [
    ("index.html",              "Home",              None),
    ("appraisal-services.html", "Services",            None),
    ("fleet-commercial.html",   "Fleet &amp; Commercial", "Fleet"),
    ("claims-consulting.html",  "Claims Consulting", "Consulting"),
    ("about.html",              "About",             None),
    ("contact.html",            "Contact",           None),
]

def head(title, desc):
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
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/cornerstone.css" />
</head>
<body>
'''

LOGO = ('<a class="logo" href="index.html" aria-label="Cornerstone Claims Adjusters — home">'
        '<img class="logo__full" src="assets/cornerstone-logo.png" alt="Cornerstone Claims Adjusters, LLC" />'
        '<img class="logo__mark" src="assets/cornerstone-mark.png" alt="Cornerstone Claims Adjusters, LLC" />'
        '</a>')

def header(current):
    items = []
    for href, label, short in NAV:
        cur = ' aria-current="page"' if href == current else ''
        txt = label if not short else f'<span class="nv-l">{label}</span><span class="nv-s">{short}</span>'
        items.append(f'<a href="{href}"{cur}>{txt}</a>')
    drawer = "".join(f'<a href="{h}">{l}</a>' for h, l, _ in NAV)
    drawer += '<a href="assign.html">Submit an Assignment</a>'
    return f'''<header class="hdr">
  <div class="wrap hdr__in">
    {LOGO}
    <nav class="nav" aria-label="Primary">{"".join(items)}</nav>
    <a class="btn hdr__cta" href="assign.html">Submit an Assignment</a>
    <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="drawer">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
<nav class="drawer" id="drawer" aria-label="Mobile">{drawer}</nav>
'''

MOBAR = f'''<div class="mobar">
  <a class="btn btn--ghost" href="{PHONE_HREF}">Call</a>
  <a class="btn" href="assign.html">Submit an Assignment</a>
</div>
'''

def footer():
    return f'''<footer class="ftr">
  <div class="wrap">
    <div class="ftr__top">
      <div>
        <span class="ftr__logo"><img src="assets/cornerstone-logo.png" alt="Cornerstone Claims Adjusters, LLC" /></span>
        <p style="font-size:14.5px;color:#C9C7C7;margin:0 0 6px;max-width:34ch">
          Independent Vehicle &amp; Equipment Appraisal<br>Damage Consulting &middot; Claims Expertise</p>
        <p style="font-family:'Archivo',sans-serif;font-weight:700;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:#FF8497;margin:16px 0 0">
          Alabama &middot; Florida &middot; Georgia &middot; Mississippi</p>
      </div>
      <div>
        <h4>Services</h4>
        <ul>
          <li><a href="appraisal-services.html">Vehicle Appraisals</a></li>
          <li><a href="fleet-commercial.html">Commercial &amp; Fleet</a></li>
          <li><a href="appraisal-services.html#heavy">Heavy Equipment</a></li>
          <li><a href="appraisal-services.html#mechanical">Mechanical Claims</a></li>
          <li><a href="claims-consulting.html">Claims Consulting</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="about.html#testimonials">Testimonials</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="roster.html">Adjuster Roster</a></li>
        </ul>
      </div>
      <div>
        <h4>Get Started</h4>
        <ul>
          <li><a href="assign.html">Submit an Assignment</a></li>
          <li><a href="{PHONE_HREF}">{PHONE}</a></li>
          <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
          <li><a href="https://www.linkedin.com/" rel="noopener">LinkedIn</a></li>
          <li><a href="https://www.facebook.com/" rel="noopener">Facebook</a></li>
        </ul>
      </div>
    </div>
    <div class="ftr__bot">
      <p>&copy; <span data-year>2026</span> Cornerstone Claims Adjusters, LLC. All rights reserved.</p>
      <p>Independent Vehicle &amp; Equipment Appraisal &middot; Damage Consulting</p>
    </div>
  </div>
</footer>
{MOBAR}<script src="assets/cornerstone.js"></script>
</body>
</html>
'''

def page(fn, title, desc, body):
    with io.open(os.path.join(OUT, fn), "w", encoding="utf-8") as f:
        f.write(head(title, desc) + header(fn) + body + footer())
    return fn

def shead(eyebrow, title, right="", hcls="h-lg"):
    return (f'<div class="shead rv"><div><p class="eyebrow">{eyebrow}</p>'
            f'<h2 class="{hcls}">{title}</h2></div><div>{right}</div></div>')

def hero(image, eyebrow, h1, lede, buttons, alt, page_v=False, extra=""):
    pad = 'style="padding-block:clamp(60px,7vw,104px)"' if page_v else ''
    return f'''<section class="hero">
  <div class="hero__media"><img src="{image}" alt="{alt}" fetchpriority="high" /></div>
  <div class="hero__scrim"></div>
  <div class="wrap hero__in" {pad}>
    <p class="eyebrow">{eyebrow}</p>
    <h1 class="h-xl">{h1}</h1>
    <p class="lede">{lede}</p>
    {extra}
    <div class="btn-row">{buttons}</div>
  </div>
</section>
'''

SERVE = ["Insurance Carriers","Fleet Operators","Trucking Companies","Construction Companies",
         "Municipalities","Utilities","Attorneys","Businesses"]

def serve_band():
    lis = "".join(f"<li>{s}</li>" for s in SERVE)
    return (f'<section class="serve"><div class="wrap serve__in">'
            f'<span class="serve__k">Trusted Appraisal Expertise For</span>'
            f'<ul class="serve__list">{lis}</ul></div></section>')

SERVICES6 = [
 ("Vehicle Appraisals", "Auto, light truck, motorcycle, RV and specialty vehicle damage assessment.",
  "appraisal-services.html#vehicle", IMG["damage"], "Close detail of collision damage to a vehicle front end"),
 ("Commercial &amp; Fleet", "Commercial trucks, trailers, fleet vehicles and business-owned equipment.",
  "fleet-commercial.html", IMG["fleetlot"], "Aerial view of a commercial trailer yard"),
 ("Heavy Equipment", "Construction, agricultural and specialized equipment damage appraisal.",
  "appraisal-services.html#heavy", IMG["cat"], "Construction dozer on a work site"),
 ("Mechanical &amp; Fuel Claims", "Mechanical causation, accident-related failures and fuel-contamination investigations.",
  "appraisal-services.html#mechanical", IMG["engine"], "Technician inspecting a vehicle engine bay"),
 ("Estimate &amp; Repair Review", "Estimate audits, supplements, post-repair inspections and repair-quality evaluations.",
  "claims-consulting.html#review", IMG["lift"], "A vehicle raised on a workshop lift"),
 ("Dispute &amp; Claims Consulting", "Independent analysis when repair facilities, owners, insurers or other parties disagree.",
  "claims-consulting.html", IMG["shop"], "A bright automotive repair workshop"),
]

def svc_cards():
    cs = "".join(f'''<a class="svc__c" href="{href}">
      <div class="svc__img"><img src="{im}" alt="{alt}" loading="lazy" /></div>
      <div class="svc__b"><h3 class="svc__t">{t}</h3><p class="svc__d">{d}</p>
      <span class="svc__go">Learn more {AR}</span></div></a>''' for t,d,href,im,alt in SERVICES6)
    return f'<div class="svc rv">{cs}</div>'

TESTIMONIALS = [
 ("For over 20 years Clay has been challenging each and every time he has come to our shop. However, "
  "he has always been fair and handled supplements and issues promptly.", "Scott H.", "Body Shop Owner"),
 ("Clay works with integrity. He is a very effective adjuster, meaning he gets the job done and "
  "motivates others to do the same.", "MC", "Claims Manager"),
 ("Clay is a valuable resource for industry knowledge. He was always willing to help someone with "
  "less experience than him.", "Richard K.", "Former colleague"),
 ("As a bodily injury adjuster, Clayton Grigsby was the very first person in Auto that I would seek "
  "out for assistance and knowledge because, number one, I could ALWAYS count on him.",
  "Sherry M.", "Liability Adjuster, former colleague"),
 ("Clay is one of the fastest turnaround estimators on estimates and supplements. He is detailed on "
  "looking for available parts if used or needed.", "Rick M.", "Body Shop Owner"),
]

def tq(i, cls="tq"):
    q, who, role = TESTIMONIALS[i]
    return (f'<div class="{cls} rv"><blockquote>{q}</blockquote>'
            f'<cite>{who} <span>&mdash; {role}</span></cite></div>')

def region_map():
    with io.open(os.path.join(OUT, "assets", "region-map.svg"), encoding="utf-8") as f:
        return f.read()

def final_cta():
    return f'''<section class="sect final">
  <div class="wrap finalgrid">
    <div>
      <h2 class="h-lg" style="max-width:15ch">Have a Damage Question?</h2>
      <p class="lede" style="font-size:clamp(18px,1.4vw,22px);margin-bottom:.6em">Tell us what happened.
      We&rsquo;ll help determine the next step.</p>
      <p style="color:rgba(255,255,255,.86);max-width:52ch;margin:0">Whether you need a vehicle appraisal,
      heavy-equipment inspection, estimate review or an experienced opinion on a complicated damage claim,
      start with a conversation.</p>
    </div>
    <div class="finalcta">
      <a class="btn btn--lg" href="assign.html">Submit an Assignment</a>
      <a class="phone" href="{PHONE_HREF}">Call {PHONE}</a>
      <a class="phone" href="mailto:{EMAIL}" style="font-size:15px;font-weight:600">{EMAIL}</a>
    </div>
  </div>
</section>
'''

# ================================================================== HOMEPAGE

home = hero(
  IMG["hero"],
  "Independent Appraisal &middot; Damage Consulting &middot; Claims Expertise",
  "When the Damage<br>Is Complicated,<br>Experience Matters.",
  "Independent vehicle and equipment appraisal and damage consulting backed by more than 25 years of "
  "collision, claims, estimating, and repair-industry experience.",
  '<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
  '<a class="btn btn--ghost btn--lg" href="appraisal-services.html">Explore Our Services</a>',
  "Cornerstone fleet: bucket truck, dump trucks, pickups and an excavator",
  extra='<p class="hero__area"><span>Alabama</span><span>Florida</span><span>Georgia</span><span>Mississippi</span></p>'
        '<p class="hero__creds"><b>I-CAR Platinum Pro-Level 3</b><b>Licensed &amp; Insured</b>'
        '<b>Commercial &amp; Personal Vehicles</b><b>Heavy Equipment</b></p>',
) + serve_band() + f'''

<!-- ===================================================== More than an estimate -->
<section class="sect">
  <div class="wrap">
    <div class="est">
      <div class="rv">
        <p class="eyebrow">The Difference</p>
        <h2 class="h-lg">More Than<br>an Estimate.</h2>
        <p class="lede" style="font-weight:500;color:var(--ink)">The value is knowing whether the estimate is right.</p>
        <p>Technology can generate numbers. Experienced appraisal requires much more.</p>
        <p>Cornerstone combines decades of claims experience, collision-repair knowledge, advanced
        technical training, and independent judgment to determine:</p>
        <div class="btn-row"><a class="btn btn--ghost" href="about.html">Why Experience Matters {AR}</a></div>
      </div>
      <div class="rv" data-rv-delay="80">
        <ul class="est__list">
          <li>What is damaged.</li>
          <li>What caused it.</li>
          <li>What it takes to repair it properly.</li>
          <li>What the repair should reasonably cost.</li>
          <li>How to document those findings when someone disagrees.</li>
        </ul>
        <p style="margin-top:26px;color:var(--grey)">Whether the assignment involves a routine vehicle
        appraisal, heavy equipment loss, questionable mechanical damage, repair dispute, or complicated
        property-damage claim, Cornerstone provides clear, thoroughly documented findings you can act on.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================ Six services -->
<section class="sect paper2">
  <div class="wrap">
    {shead("Appraisal &amp; Damage Expertise", "What Cornerstone handles.",
      '<p class="lede">Assignments accepted from carriers, businesses, fleets and attorneys &mdash; '
      'whether or not an insurance claim is involved.</p>')}
    {svc_cards()}
  </div>
</section>

<!-- ========================================================= Fleet &amp; commercial -->
<section class="sect">
  <div class="wrap">
    <div class="fleet">
      <div class="rv">
        <p class="eyebrow">Fleet &amp; Commercial</p>
        <h2 class="h-lg">Your Vehicles Work<br>for Your Business.</h2>
        <p class="lede" style="font-weight:500;color:var(--ink)">When they&rsquo;re damaged, you need answers &mdash; not just an estimate.</p>
        <p>Cornerstone provides independent vehicle and equipment damage assessments directly to businesses
        and fleet operators &mdash; not only insurance companies.</p>
        <p>We can help determine the extent of damage, appropriate repair procedures, reasonable repair
        costs, repair quality, and whether damage is consistent with a reported incident.</p>
        <ul class="chips">
          <li>Trucking &amp; Transportation</li><li>Construction &amp; Contractors</li>
          <li>Municipal Fleets</li><li>Utility Companies</li>
          <li>Equipment Owners</li><li>Commercial Vehicle Fleets</li>
        </ul>
        <div class="callout">
          <b>No insurance claim required.</b>
          <p>Businesses and fleet operators can engage Cornerstone directly.</p>
        </div>
        <div class="btn-row"><a class="btn" href="fleet-commercial.html">Explore Fleet Services {AR}</a></div>
      </div>
      <div class="rv" data-rv-delay="80">
        <div class="fleet__media"><img src="{IMG['semi']}" alt="A commercial tractor unit on the highway" loading="lazy" /></div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================ Complex claims -->
<section class="sect dark">
  <div class="wrap">
    {shead("When the Claim Isn&rsquo;t Routine", "Some Damage<br>Requires Experience.",
      '<p class="lede">Four situations where an estimate alone will not settle the question.</p>')}
    <div class="scen rv">
      <div class="scen__i"><span class="scen__n">01</span><p>The shop says one thing. The owner says another.</p></div>
      <div class="scen__i"><span class="scen__n">02</span><p>The mechanical failure may &mdash; or may not &mdash; be accident related.</p></div>
      <div class="scen__i"><span class="scen__n">03</span><p>The repair is complete, but something doesn&rsquo;t look right.</p></div>
      <div class="scen__i"><span class="scen__n">04</span><p>The estimate is substantial and someone needs an independent second opinion.</p></div>
    </div>
    <p class="closer rv">That&rsquo;s when <em>Cornerstone</em> gets the call.</p>
    <div class="btn-row rv"><a class="btn" href="claims-consulting.html">Claims Consulting {AR}</a></div>
  </div>
</section>

<!-- =============================================================== Credentials -->
<section class="sect">
  <div class="wrap">
    {shead("Experience &amp; Credentials", "Experience You<br>Can&rsquo;t Automate.", "")}
    <div class="creds rv">
      <div class="cred"><div class="cred__n">25+</div><div class="cred__l">Years of Appraisal Experience</div></div>
      <div class="cred"><div class="cred__n">150+</div><div class="cred__l">I-CAR Courses Completed</div></div>
      <div class="cred"><div class="cred__n">Level 3</div><div class="cred__l">I-CAR Platinum</div></div>
      <div class="cred"><div class="cred__n">4 States</div><div class="cred__l">AL &middot; FL &middot; GA &middot; MS</div></div>
    </div>
    <div class="cols2">
      <div class="rv">
        <h3 class="h-md">Experience from Every Side of the Claim</h3>
        <p class="lede">Collision repair management. High-volume field adjusting. Advanced estimate writing.
        Repair-facility auditing. Arbitration. Claims training. Repair-quality disputes. Commercial vehicle damage.</p>
        <div class="btn-row"><a class="btn btn--ghost" href="about.html">Meet Cornerstone {AR}</a></div>
      </div>
      <div class="rv" data-rv-delay="80">
        <ul class="tags">
          <li>Collision repair management</li><li>High-volume field adjusting</li>
          <li>Advanced estimate writing</li><li>Repair-facility auditing</li>
          <li>Arbitration</li><li>Claims training</li>
          <li>Repair-quality disputes</li><li>Commercial vehicle damage</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================== Testimonial -->
<section class="sect sect--tight paper2">
  <div class="wrap">
    <p class="eyebrow rv">What People Say</p>
    {tq(0)}
    <div class="btn-row rv"><a class="tlink" href="about.html#testimonials">More from clients and colleagues {AR}</a></div>
  </div>
</section>

<!-- ============================================================== Service area -->
<section class="sect">
  <div class="wrap">
    <div class="area">
      <div class="rv">{region_map()}</div>
      <div class="rv" data-rv-delay="80">
        <p class="eyebrow">Service Area</p>
        <h2 class="h-lg">Regional Expertise.<br>Responsive Service.</h2>
        <p class="lede">Licensed independent claims appraisal services throughout Alabama, Florida, Georgia
        and Mississippi, with specialized commercial and consulting assignments available based on the needs
        of the client.</p>
        <ul class="statelist">
          <li><span class="ab">AL</span> Alabama</li>
          <li><span class="ab">FL</span> Florida</li>
          <li><span class="ab">GA</span> Georgia</li>
          <li><span class="ab">MS</span> Mississippi</li>
        </ul>
      </div>
    </div>
  </div>
</section>
''' + final_cta()

page("index.html",
     "Cornerstone Claims Adjusters &mdash; Independent Vehicle &amp; Equipment Appraisal",
     "Independent vehicle and equipment damage appraisal, damage consulting and claims expertise across "
     "Alabama, Florida, Georgia and Mississippi. 25+ years of collision and claims experience.",
     home)

# ======================================================== SERVICE PAGE FACTORY

def caps_block(rows):
    return '<div class="caps rv">' + "".join(
        f'<div class="cap" id="{i}"><div class="cap__n">/ {n:02d}</div>'
        f'<h3 class="cap__t">{t}</h3><p class="cap__d">{d}</p></div>'
        for n,(i,t,d) in enumerate(rows,1)) + '</div>'

def service_page(fn, title, desc, eyebrow, h1, lede, heroimg, heroalt,
                 intro_h, intro_p, rows, gallery, galt, closing, tqi):
    gal = "".join(
        f'<div style="position:relative;aspect-ratio:4/3;overflow:hidden;background:#ECECEA;border-radius:2px">'
        f'<img src="{g}" alt="{a}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" /></div>'
        for g,a in zip(gallery,galt))
    body = hero(heroimg, eyebrow, h1, lede,
        '<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
        f'<a class="btn btn--ghost btn--lg" href="{PHONE_HREF}">Call {PHONE}</a>',
        heroalt, page_v=True) + serve_band() + f'''
<section class="sect">
  <div class="wrap">
    {shead("Overview", intro_h, f'<p class="lede">{intro_p}</p>')}
    <div class="cols2 rv">{gal}</div>
  </div>
</section>
<section class="sect paper2">
  <div class="wrap">
    {shead("What We Handle", "Assignments accepted.",
      '<p class="lede">If what you need is not listed, ask. This is the common work, not the limit of it.</p>')}
    {caps_block(rows)}
  </div>
</section>
<section class="sect sect--tight">
  <div class="wrap">{tq(tqi)}</div>
</section>
''' + final_cta()
    page(fn, title, desc, body)


service_page(
  "appraisal-services.html",
  "Appraisal Services &mdash; Cornerstone Claims Adjusters",
  "Independent vehicle, heavy equipment, truck and trailer appraisal, mechanical damage and fuel "
  "contamination inspections across Alabama, Florida, Georgia and Mississippi.",
  "Appraisal Services",
  "Independent Appraisal,<br>Written to Hold Up.",
  "Vehicle, commercial and equipment damage appraisal built on physical inspection, repair knowledge "
  "and documentation that stands when someone disagrees with it.",
  IMG["quarry"], "Heavy machinery working an excavation site",
  "What is damaged, what caused it,<br>and what it takes to fix it.",
  "Every appraisal answers the same four questions, whether the unit is a light truck or a tracked "
  "excavator. The difference is knowing what you are looking at &mdash; and being able to show your work.",
  [("vehicle","Auto &amp; Commercial Vehicle Appraisals",
    "Damage assessment and repair estimating on automobiles, light trucks, vans and commercial vehicles, "
    "including motorcycle, RV, boat, boat motor and personal watercraft losses."),
   ("heavy","Heavy Equipment Appraisals",
    "Construction, agricultural and specialized machinery &mdash; excavators, dozers, loaders, lifts, "
    "attachments and implements. Condition, damage, repairability and value."),
   ("truck","Truck &amp; Trailer Appraisals",
    "Tractors, trailers, straight trucks, specialty bodies and upfitting. Frame, suspension, driveline "
    "and roadworthiness considerations documented alongside the damage."),
   ("mechanical","Mechanical Damage &amp; Failure Inspections",
    "Was the failure caused by the accident, or was it already there? Independent inspection and "
    "causation analysis on engines, drivetrains and mechanical systems."),
   ("fuel","Fuel Contamination Claims",
    "Investigation and documentation of misfuelling and fuel-contamination losses, including the extent "
    "of component damage and the reasonable scope of repair."),
   ("total","Total Loss &amp; Value Consulting",
    "Repair-versus-replace analysis, pre-loss condition and value assessment, and review of total loss "
    "determinations and valuation methodology.")],
  [IMG["cat"], IMG["engine"]],
  ["Construction dozer on a work site","Technician inspecting a vehicle engine bay"],
  "", 4)


service_page(
  "fleet-commercial.html",
  "Fleet &amp; Commercial &mdash; Cornerstone Claims Adjusters",
  "Independent vehicle and equipment damage assessment for fleets, trucking, construction, municipalities "
  "and utilities. No insurance claim required.",
  "Fleet &amp; Commercial",
  "Your Vehicles Work<br>for Your Business.",
  "When they&rsquo;re damaged, you need answers &mdash; not just an estimate. Cornerstone works directly "
  "for businesses and fleet operators, not only insurance companies.",
  IMG["semi"], "A commercial tractor unit on the highway at dusk",
  "Independent answers,<br>without a claim file.",
  "Businesses and fleet operators can engage Cornerstone directly. That means an objective assessment of "
  "what is actually damaged, what the repair should reasonably cost, and whether the work you paid for "
  "was done &mdash; on your timeline, for your purposes.",
  [("extent","Extent of Damage",
    "An independent determination of what was damaged in the incident, separated from wear, prior damage "
    "and unrelated conditions."),
   ("procedures","Appropriate Repair Procedures",
    "What the correct repair actually involves, referenced against manufacturer and industry repair "
    "procedures rather than whatever is fastest."),
   ("cost","Reasonable Repair Cost",
    "A documented estimate you can hold a vendor to, or use to evaluate the estimate you have been given."),
   ("quality","Repair Quality Verification",
    "Post-repair inspection confirming the work performed matches the work billed, in scope and in method."),
   ("consistency","Damage Consistency Review",
    "Whether the damage presented is consistent with the incident as reported &mdash; useful for fleets "
    "managing driver-reported losses."),
   ("program","Ongoing Fleet Programs",
    "Recurring inspection support across a fleet, with consistent reporting and a single point of contact.")],
  [IMG["fleetlot"], IMG["scania"]],
  ["Aerial view of a commercial trailer yard","A tractor unit on the road"],
  "", 0)


service_page(
  "claims-consulting.html",
  "Claims Consulting &mdash; Cornerstone Claims Adjusters",
  "Estimate and file review, repair quality and body shop disputes, subrogation review and complex "
  "damage consulting from an independent appraiser with 25+ years of experience.",
  "Claims Consulting",
  "When an Estimate<br>Isn&rsquo;t Enough.",
  "Independent analysis for the files that do not resolve on their own &mdash; disputed repairs, "
  "questionable damage, competing estimates and losses with real exposure attached.",
  IMG["collision"], "Emergency response at a multi-vehicle collision scene",
  "The shop says one thing.<br>The owner says another.",
  "Cornerstone is frequently brought in after the disagreement has already started. The work is to "
  "establish what the evidence actually supports, document it properly, and put it in a form that holds "
  "up when it is examined by someone trying to take it apart.",
  [("review","Estimate &amp; File Review",
    "Line-by-line audit of an existing estimate: scope, method, pricing, betterment, and what is missing "
    "or should not be there."),
   ("repairquality","Repair Quality &amp; Body Shop Disputes",
    "Independent post-repair inspection where quality, completeness or method of repair is contested "
    "between a shop, an owner and an insurer."),
   ("subrogation","Subrogation Review",
    "Damage and cost analysis supporting recovery, including separating recoverable damage from "
    "unrelated or pre-existing conditions."),
   ("postrepair","Post-Repair Inspection",
    "Verification that the completed repair matches the authorised estimate in both scope and method."),
   ("dispute","Dispute Resolution",
    "Objective analysis and documentation when repair facilities, owners, insurers or other parties "
    "cannot agree on damage, method or amount."),
   ("complex","Complex Damage Consulting",
    "Large, unusual or high-exposure losses that call for deeper investigation and a written, "
    "defensible analysis.")],
  [IMG["shop"], IMG["lift"]],
  ["A bright automotive repair workshop","A vehicle raised on a workshop lift"],
  "", 1)

# ===================================================================== ABOUT

tq_all = "".join(f'<div class="tqi">{tq(i,"tq")[len(chr(60)+"div class="+chr(34)+"tq rv"+chr(34)+chr(62)):-6]}</div>' for i in [])  # unused

def tq_item(i):
    q, who, role = TESTIMONIALS[i]
    return (f'<div class="tqi rv"><blockquote>{q}</blockquote>'
            f'<cite>{who} <span>&mdash; {role}</span></cite></div>')

about = hero(
  IMG["rock"], "About Cornerstone",
  "Experience You<br>Can&rsquo;t Automate.",
  "Cornerstone Claims Adjusters, LLC is an independent vehicle and equipment appraisal and damage "
  "consulting firm serving Alabama, Florida, Georgia and Mississippi.",
  '<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
  '<a class="btn btn--ghost btn--lg" href="#testimonials">Read Testimonials</a>',
  "Excavator working below a mountain range", page_v=True) + serve_band() + f'''
<section class="sect">
  <div class="wrap">
    <div class="creds rv">
      <div class="cred"><div class="cred__n">25+</div><div class="cred__l">Years of Appraisal Experience</div></div>
      <div class="cred"><div class="cred__n">150+</div><div class="cred__l">I-CAR Courses Completed</div></div>
      <div class="cred"><div class="cred__n">Level 3</div><div class="cred__l">I-CAR Platinum</div></div>
      <div class="cred"><div class="cred__n">4 States</div><div class="cred__l">AL &middot; FL &middot; GA &middot; MS</div></div>
    </div>
    <div class="cols2">
      <div class="rv">
        <p class="eyebrow">Founder</p>
        <h2 class="h-lg">Clay Grigsby.</h2>
        <p class="lede">Owner &middot; Alabama and Florida Panhandle Manager</p>
      </div>
      <div class="rv" data-rv-delay="80">
        <p>Clay founded Cornerstone Claims Adjusters in the autumn of 2021, bringing more than 25 years
        in the claims and collision industries.</p>
        <p>He began in auto body shop management with one of the nation&rsquo;s largest collision repair
        chains, moved into adjusting in 1999 handling multi-line claims in a very high-volume territory,
        and spent 15 years as an auto appraiser for one of the largest insurers in the country.</p>
        <p>Along the way he mentored APD veterans, served as an arbitrator for Arbitration Forums, and
        developed training curriculum on the best methods for handling problem claims &mdash; the files
        where a customer disputes the quality of a repair.</p>
        <p>That progression is the reason Cornerstone gets called on the complicated work. Clay has
        written the estimate, questioned the estimate, and been asked to settle the difference.</p>
      </div>
    </div>
    <div class="caps rv" style="margin-top:clamp(34px,4vw,56px)">
      <div class="cap"><div class="cap__n">/ 01</div><h3 class="cap__t">Certification</h3>
        <p class="cap__d">I-CAR Platinum Pro-Level 3 with more than 150 I-CAR courses completed. Farmers
        University Gold Star Certification, including a perfect score in Advanced School.</p></div>
      <div class="cap"><div class="cap__n">/ 02</div><h3 class="cap__t">Licensing</h3>
        <p class="cap__d">Licensed in Alabama, Mississippi, Florida, Georgia and Oklahoma, with reciprocal
        licensing across approximately 25 additional states.</p></div>
      <div class="cap"><div class="cap__n">/ 03</div><h3 class="cap__t">Arbitration &amp; Training</h3>
        <p class="cap__d">Arbitrator for Arbitration Forums. Developed claims training curriculum and
        mentored auto physical damage adjusters.</p></div>
    </div>
  </div>
</section>

<section class="sect paper2">
  <div class="wrap">
    <div class="cols2">
      <div class="rv">
        <p class="eyebrow">Central Florida</p>
        <h2 class="h-lg">Alex Franklin.</h2>
        <p class="lede">Central Florida Manager</p>
        <p style="font-family:'Archivo',sans-serif;font-weight:700;font-size:15px">
          <a href="tel:+18139563709" style="text-decoration:none;color:var(--red)">813-956-3709</a></p>
      </div>
      <div class="rv" data-rv-delay="80">
        <p>Alex brings more than 20 years of claims handling experience and has worked as an independent
        adjuster since January 2022.</p>
        <p>He is a licensed claims adjuster in Florida, New York and Pennsylvania, I-CAR Level 3 Platinum
        certified, ASE Pro Level 3 and ASE B-6 certified, a Smith System defensive driving instructor, and
        NATMI-trained in accident investigation.</p>
        <ul class="tags">
          <li>Licensed FL &middot; NY &middot; PA</li><li>I-CAR Level 3 Platinum</li>
          <li>ASE Pro Level 3</li><li>ASE B-6</li>
          <li>Smith System Instructor</li><li>NATMI Accident Investigation</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="sect" id="testimonials">
  <div class="wrap">
    {shead("Testimonials", "What people who have worked<br>with Clay say.",
      '<p class="lede">From carriers, colleagues and the body shops on the other side of the estimate.</p>')}
    <div style="margin-bottom:clamp(30px,4vw,48px)">{tq(0)}</div>
    <div class="tqrow">{tq_item(1)}{tq_item(2)}{tq_item(4)}</div>
    <div style="margin-top:clamp(30px,4vw,48px)">{tq(3)}</div>
  </div>
</section>
''' + final_cta()

page("about.html", "About &mdash; Cornerstone Claims Adjusters, LLC",
     "Cornerstone Claims Adjusters, LLC — founded by Clay Grigsby in 2021. I-CAR Platinum Pro-Level 3, "
     "25+ years in collision repair, adjusting and independent appraisal.", about)


# ============================================================ FORM HELPERS

def f_text(name,label,req=True,full=False,typ="text",ph="",hint=""):
    r=' <span class="req">*</span>' if req else ''; rq=' required' if req else ''
    cls="field field--full" if full else "field"
    h=f'<div class="hint">{hint}</div>' if hint else ''
    return (f'<div class="{cls}"><label for="{name}">{label}{r}</label>'
            f'<input type="{typ}" id="{name}" name="{name}"{rq} placeholder="{ph}" />{h}<div class="err"></div></div>')

def f_sel(name,label,opts,req=True,full=False,hint=""):
    r=' <span class="req">*</span>' if req else ''; rq=' required' if req else ''
    cls="field field--full" if full else "field"
    o='<option value="">Select&hellip;</option>'+"".join(f'<option>{x}</option>' for x in opts)
    h=f'<div class="hint">{hint}</div>' if hint else ''
    return (f'<div class="{cls}"><label for="{name}">{label}{r}</label>'
            f'<select id="{name}" name="{name}"{rq}>{o}</select>{h}<div class="err"></div></div>')

def f_area(name,label,req=False,hint=""):
    r=' <span class="req">*</span>' if req else ''; rq=' required' if req else ''
    h=f'<div class="hint">{hint}</div>' if hint else ''
    return (f'<div class="field field--full"><label for="{name}">{label}{r}</label>'
            f'<textarea id="{name}" name="{name}"{rq}></textarea>{h}<div class="err"></div></div>')

def f_checks(name,label,items):
    b="".join(f'<label class="check"><input type="checkbox" name="{name}" value="{i}" /> <span>{i}</span></label>' for i in items)
    return f'<div class="field field--full"><label>{label}</label><div class="checks">{b}</div></div>'

def f_file(name,label,note):
    return (f'<div class="field field--full"><label for="{name}">{label}</label>'
            f'<label class="filedrop" for="{name}"><span class="filedrop__t">Choose files</span>'
            f'<span class="filedrop__s" data-default="{note}">{note}</span>'
            f'<input type="file" id="{name}" name="{name}" multiple /></label></div>')

CHECK_SVG=('<svg class="formdone__ic" viewBox="0 0 54 54" fill="none" aria-hidden="true">'
           '<circle cx="27" cy="27" r="25" stroke="#D91A3B" stroke-width="2"/>'
           '<path d="M16 27.5 L24 35 L39 19" stroke="#D91A3B" stroke-width="3"/></svg>')

def done_panel(pid,title,msg):
    return (f'<div class="formdone" id="{pid}" role="status" aria-live="polite">{CHECK_SVG}'
            f'<h3 class="h-md">{title}</h3><p class="lede" style="margin-inline:auto">{msg}</p>'
            f'<div class="btn-row" style="justify-content:center"><a class="btn btn--ghost" href="index.html">Back to Home</a></div></div>')

WIRING = """<!--
  ==========================================================================
  FORM WIRING — NOT CONNECTED YET
  Validates in the browser and shows a confirmation panel, but transmits
  nowhere. Point at a real handler (Formspree / Netlify Forms / Supabase)
  before launch. File uploads need a real endpoint; the input is inert.
  ==========================================================================
-->"""

# =========================================================== SUBMIT AN ASSIGNMENT

assign_form = f'''{WIRING}
<form class="form" data-validate data-done="assign-done" id="assign-form">
  {f_sel("clienttype","I am a", ["Insurance carrier or TPA","Business or fleet owner","Attorney",
      "Repair facility","Municipality or utility","Equipment owner","Other"], full=True,
      hint="This tells us how to handle the file and who to report to.")}
  {f_sel("atype","Assignment Type", ["Vehicle appraisal","Commercial truck, trailer or fleet",
      "Heavy equipment","Mechanical damage or failure inspection","Fuel contamination",
      "Estimate or file review","Post-repair inspection","Repair quality or dispute",
      "Subrogation review","Total loss or value consulting","Not sure — please advise"])}
  {f_sel("urgency","Urgency", ["Standard","Expedited — within 48 hours","Rush — same or next day",
      "Scheduled for a future date"])}
  {f_text("org","Company / Firm", False, ph="If applicable")}
  {f_text("contact","Your Name", True)}
  {f_text("email","Email", True, typ="email")}
  {f_text("phone","Phone", True, typ="tel")}
  {f_text("claimno","Claim / File Number", False)}
  {f_text("dol","Date of Loss", False, typ="date")}
  {f_text("unit","Vehicle / Equipment Details", True, full=True,
      ph="Year, make, model, VIN or serial number, mileage or hours")}
  {f_text("location","Where Is the Unit?", True, full=True, ph="City, state and site, shop or facility name")}
  {f_text("owner","Contact for Access", False, full=True, ph="Who we should call to arrange the inspection")}
  {f_area("issue","Explain the Issue", True,
      hint="What happened, what is in dispute, and what you need back from us.")}
  {f_file("docs","Photos, Estimates &amp; Documents",
      "Photographs, existing estimates, police report, prior appraisals")}
  <div class="field field--full">
    <button class="btn btn--lg" type="submit" style="width:100%">Submit Assignment</button>
    <div class="hint" style="text-align:center;margin-top:14px">
      We confirm receipt and scope before any inspection is scheduled.</div>
  </div>
</form>
{done_panel("assign-done","Assignment received.",
  "We&rsquo;ll confirm receipt, review the loss and come back to you with next steps and an inspection window.")}'''

assign = hero(
  IMG["damage"], "Submit an Assignment",
  "Tell Us What<br>Happened.",
  "Send what you have and we&rsquo;ll help determine the next step. No insurance claim is required &mdash; "
  "businesses and fleet operators can engage Cornerstone directly.",
  f'<a class="btn btn--lg" href="#assign-form">Start the Form</a>'
  f'<a class="btn btn--ghost btn--lg" href="{PHONE_HREF}">Call {PHONE}</a>',
  "Close detail of collision damage", page_v=True) + f'''
<section class="sect">
  <div class="wrap">
    <div class="cols2" style="align-items:start">
      <div class="rv" style="position:sticky;top:112px">
        <p class="eyebrow">What to Send</p>
        <h2 class="h-md">Nothing here is a hard requirement.</h2>
        <p class="lede">Send what you have and we&rsquo;ll ask for the rest.</p>
        <div class="panel" style="margin-top:26px">
          <dl>
            <dt>The Unit</dt><dd>Year, make, model, VIN or serial, and where it is sitting.</dd>
            <dt>The Access</dt><dd>Who to call to get in front of the vehicle or equipment.</dd>
            <dt>The File</dt><dd>Photographs, any existing estimate, and anything already in dispute.</dd>
            <dt>The Ask</dt><dd>What you need back &mdash; an appraisal, a review, or an opinion.</dd>
          </dl>
        </div>
        <p style="margin-top:24px;font-family:'Archivo',sans-serif;font-weight:700;font-size:15px">
          Prefer to talk it through?<br>
          <a href="{PHONE_HREF}" style="color:var(--red);text-decoration:none">{PHONE}</a><br>
          <a href="mailto:{EMAIL}" style="color:var(--red);text-decoration:none">{EMAIL}</a></p>
      </div>
      <div class="rv" data-rv-delay="80">{assign_form}</div>
    </div>
  </div>
</section>
''' + final_cta()

page("assign.html","Submit an Assignment &mdash; Cornerstone Claims Adjusters",
     "Submit a vehicle, equipment, fleet or consulting assignment to Cornerstone Claims Adjusters. "
     "No insurance claim required.", assign)


# =================================================================== CONTACT

contact_form = f'''{WIRING}
<form class="form" data-validate data-done="contact-done" id="contact-form">
  {f_text("cname","Name", True)}
  {f_text("corg","Company / Firm", False)}
  {f_text("cemail","Email", True, typ="email")}
  {f_text("cphone","Phone", False, typ="tel")}
  {f_sel("creason","Reason for Contact", ["New assignment","Question about an existing assignment",
      "Fleet or business enquiry","Service area question","Adjuster roster","General enquiry"], full=True)}
  {f_area("cmsg","Message", True)}
  <div class="field field--full">
    <button class="btn btn--lg" type="submit" style="width:100%">Send Message</button>
  </div>
</form>
{done_panel("contact-done","Message sent.",
  "We&rsquo;ll respond directly. For a live assignment, the assignment form routes faster.")}'''

contact = hero(
  IMG["scania"], "Contact",
  "Start With<br>a Conversation.",
  "Assignments, fleet enquiries and questions about a complicated damage claim all reach the same place.",
  f'<a class="btn btn--lg" href="assign.html">Submit an Assignment</a>'
  f'<a class="btn btn--ghost btn--lg" href="{PHONE_HREF}">Call {PHONE}</a>',
  "A commercial tractor unit on the road", page_v=True) + f'''
<section class="sect">
  <div class="wrap">
    <div class="cols2" style="align-items:start">
      <div class="rv">
        <p class="eyebrow">Direct</p>
        <h2 class="h-lg">Cornerstone Claims<br>Adjusters, LLC</h2>
        <div class="panel" style="margin-top:26px">
          <dl>
            <dt>Telephone</dt><dd><a href="{PHONE_HREF}" style="color:var(--red);font-weight:600;text-decoration:none">{PHONE}</a></dd>
            <dt>Email</dt><dd><a href="mailto:{EMAIL}" style="color:var(--red);font-weight:600;text-decoration:none">{EMAIL}</a></dd>
            <dt>Service Area</dt><dd>Alabama &middot; Florida &middot; Georgia &middot; Mississippi</dd>
            <dt>Central Florida</dt><dd>Alex Franklin &mdash;
              <a href="tel:+18139563709" style="color:var(--red);font-weight:600;text-decoration:none">813-956-3709</a></dd>
          </dl>
        </div>
        <div class="caps" style="margin-top:30px">
          <div class="cap"><div class="cap__n">/ 01</div><h3 class="cap__t">Submit an Assignment</h3>
            <p class="cap__d">A live loss that needs inspection, appraisal or review.
            <a class="tlink" href="assign.html" style="display:inline-flex;margin-left:8px">Assignment form {AR}</a></p></div>
          <div class="cap"><div class="cap__n">/ 02</div><h3 class="cap__t">Fleet &amp; Business</h3>
            <p class="cap__d">Direct engagement, no insurance claim required.
            <a class="tlink" href="fleet-commercial.html" style="display:inline-flex;margin-left:8px">Fleet services {AR}</a></p></div>
          <div class="cap"><div class="cap__n">/ 03</div><h3 class="cap__t">Everything Else</h3>
            <p class="cap__d">Questions, existing files and general enquiries &mdash; use the form or call directly.</p></div>
        </div>
      </div>
      <div class="rv" data-rv-delay="80">
        <p class="eyebrow">Send a Message</p>
        <h2 class="h-md" style="margin-bottom:26px">How can we help?</h2>
        {contact_form}
      </div>
    </div>
  </div>
</section>
''' + final_cta()

page("contact.html","Contact &mdash; Cornerstone Claims Adjusters, LLC",
     "Contact Cornerstone Claims Adjusters for vehicle, equipment and fleet appraisal across Alabama, "
     "Florida, Georgia and Mississippi. 334-568-9450.", contact)


# ==================================================================== ROSTER
# Not part of the September 2026 brief. Kept, rebuilt in the new brand, and
# linked only from the footer so it does not compete with the primary nav.

roster_form = f'''{WIRING}
<form class="form" data-validate data-done="roster-done" id="roster-form">
  {f_text("rname","Full Name", True)}
  {f_text("remail","Email", True, typ="email")}
  {f_text("rphone","Phone", True, typ="tel")}
  {f_text("rloc","Location", True, ph="City, state")}
  {f_sel("ryears","Years of Experience", ["1–3 years","4–7 years","8–14 years","15–24 years","25+ years"])}
  {f_sel("ravail","Availability", ["Full time","Part time","Overflow / as needed","Catastrophe only"])}
  {f_text("rstates","States Licensed", True, full=True, ph="List every state you are licensed in")}
  {f_checks("rspec","Specialties", ["Auto &amp; light truck","Commercial truck &amp; trailer",
      "Heavy equipment","Mechanical &amp; fuel","Estimate review","Post-repair inspection",
      "Dispute resolution","RV, marine &amp; powersports"])}
  {f_area("rcerts","Licences &amp; Certifications", True,
      hint="Adjuster licences by state, I-CAR level, ASE, equipment or appraisal credentials.")}
  {f_file("rresume","Resume","PDF or Word document")}
  <div class="field field--full">
    <button class="btn btn--lg" type="submit" style="width:100%">Submit Application</button>
  </div>
</form>
{done_panel("roster-done","Application received.",
  "We review every application individually and will follow up either way.")}'''

roster = hero(
  IMG["quarry"], "Adjuster Roster",
  "Experienced Adjusters.<br>Let&rsquo;s Work Together.",
  "Cornerstone works with experienced independent adjusters and appraisers who share our standard for "
  "inspection, documentation and professionalism.",
  '<a class="btn btn--lg" href="#roster-form">Apply to the Roster</a>'
  '<a class="btn btn--ghost btn--lg" href="about.html">About Cornerstone</a>',
  "Heavy machinery at an excavation site", page_v=True) + f'''
<section class="sect">
  <div class="wrap">
    <div class="cols2" style="align-items:start">
      <div class="rv" style="position:sticky;top:112px">
        <p class="eyebrow">Application</p>
        <h2 class="h-md">Tell us what you handle.</h2>
        <p class="lede">Assignments are matched to specialty and coverage area. Applications are reviewed
        individually and you will hear back either way.</p>
      </div>
      <div class="rv" data-rv-delay="80">{roster_form}</div>
    </div>
  </div>
</section>
''' + final_cta()

page("roster.html","Adjuster Roster &mdash; Cornerstone Claims Adjusters",
     "Experienced independent adjusters and appraisers can apply to work with Cornerstone Claims Adjusters.",
     roster)

print("pages written")
