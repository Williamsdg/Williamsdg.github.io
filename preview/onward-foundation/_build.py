#!/usr/bin/env python3
"""Builds the Onward! concept pages from shared header/footer parts.
Run from this folder: python3 _build.py   (proposal/ is hand-written and not built here)"""
import os, time

V = time.strftime('%Y%m%d%H%M')
HERE = os.path.dirname(os.path.abspath(__file__))
DONATE = 'https://onwardfdn.fcsuite.com/erp/donate'
ADVISOR = 'https://onwardfdn.fcsuite.com/erp/fundmanager'
UP = 'https://onwardfoundation.org/Site/wp-content/uploads'

ICON = {
 'give': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
 'start': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21v-9"/><path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z"/><path d="M12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"/></svg>',
 'student': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 9.5 12 5l9.5 4.5L12 14z"/><path d="M6.5 11.7V16c1.5 1.5 3.3 2.2 5.5 2.2s4-.7 5.5-2.2v-4.3"/><path d="M21.5 9.5V15"/></svg>',
 'grant': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 12h5M10 16h5"/></svg>',
 'fiscal': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11a9 9 0 0 1 18 0z"/><path d="M12 11v7a2.5 2.5 0 0 0 5 0"/><path d="M12 2v1"/></svg>',
 'lock': '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
}

HERO_ART = '''<svg viewBox="0 0 600 660" role="img" aria-labelledby="art-t" xmlns="http://www.w3.org/2000/svg">
<title id="art-t">Illustration of the Four Corners landscape: a mesa and mountain range at sunrise, with a path leading onward and a compass star in the sky.</title>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3c99a"/><stop offset=".55" stop-color="#fbe6c8"/><stop offset="1" stop-color="#fdf3e2"/></linearGradient>
<linearGradient id="mesa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cf7d55"/><stop offset="1" stop-color="#b5553a"/></linearGradient>
</defs>
<rect width="600" height="660" fill="url(#sky)"/>
<circle cx="398" cy="196" r="118" fill="#fff6e6" opacity=".55"/>
<circle cx="398" cy="196" r="92" fill="none" stroke="#1f1a17" stroke-width="1.5" opacity=".55"/>
<path d="M398 92v208M294 196h208" stroke="#1f1a17" stroke-width="1" opacity=".35"/>
<path d="M398 104l15 77 77 15-77 15-15 77-15-77-77-15 77-15z" fill="#d4111e"/>
<path d="M398 104l15 77 77 15H398z" fill="#a80d18" opacity=".55"/>
<path d="M0 404l58-30 60 8 52-42 46-22 34 12 50-30 36 12 44 28 60 10 62 22 98-14v302H0z" fill="#b99aa1"/>
<path d="M0 446h40l16-26h154l18 26h72l18-36h152l20 30h110v220H0z" fill="url(#mesa)"/>
<path d="M56 420h154l18 26H40zM318 410h152l20 30H300z" fill="#e39a6e"/>
<path d="M0 470h600M0 494h600" stroke="#9c4630" stroke-width="2" opacity=".35"/>
<path d="M0 512q150-44 300-6t300-14v168H0z" fill="#8f9f78"/>
<g fill="#5d7355"><ellipse cx="70" cy="508" rx="16" ry="11"/><ellipse cx="96" cy="514" rx="12" ry="9"/><ellipse cx="452" cy="506" rx="17" ry="11"/><ellipse cx="480" cy="512" rx="12" ry="9"/><ellipse cx="546" cy="500" rx="14" ry="10"/><ellipse cx="210" cy="500" rx="13" ry="9"/></g>
<path d="M0 572q200-44 380 6t220-24v106H0z" fill="#33473b"/>
<path d="M318 512c-26 20 44 30 14 56" fill="none" stroke="#f6e7cf" stroke-width="9" stroke-linecap="round"/>
<path d="M332 568c-40 34-110 44-104 92" fill="none" stroke="#f6e7cf" stroke-width="24" stroke-linecap="round"/>
<g fill="#22302a"><ellipse cx="60" cy="590" rx="30" ry="18"/><ellipse cx="104" cy="600" rx="22" ry="14"/><ellipse cx="520" cy="586" rx="34" ry="19"/><ellipse cx="470" cy="600" rx="20" ry="13"/></g>
</svg>'''


def head(title, desc, R):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Public+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{R}css/site.css?v={V}">
<link rel="icon" href="{R}img/onward-logo.png">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="ribbon"><div class="wrap"><span><b>Redesign concept</b> by Williams Digital for Onward! A Legacy Foundation. This is not the live site.</span><a href="{R}proposal/">Read the proposal &rarr;</a></div></div>
'''


def header(R, cur=''):
    def a(href, label, key):
        c = ' aria-current="page"' if key == cur else ''
        return f'<a href="{href}"{c}>{label}</a>'
    return f'''<header class="site-header"><div class="wrap">
<a class="brand" href="{R or './'}" aria-label="Onward! A Legacy Foundation, home"><img src="{R}img/onward-logo.png" alt="" width="54" height="54"><span><span class="brand-name">Onward<em>!</em></span><span class="brand-sub">A Legacy Foundation</span></span></a>
<nav class="nav" id="nav" aria-label="Main">
{a(R + 'funds/', 'Our Funds', 'funds')}
{a(R + 'scholarships/', 'Scholarships', 'scholarships')}
{a(R + 'grants/', 'Grants', 'grants')}
{a((R or './') + '#give', 'For Donors', 'give')}
{a((R or './') + '#about', 'About', 'about')}
{a((R or './') + '#contact', 'Contact', 'contact')}
<a href="{ADVISOR}" target="_blank" rel="noopener">Fund Advisor Login</a>
</nav>
<div class="header-actions"><a class="btn btn-primary btn-sm" href="{DONATE}" target="_blank" rel="noopener">Donate</a><button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav"><span aria-hidden="true"></span>Menu</button></div>
</div></header>
'''


def footer(R, mbar=True):
    bar = f'''<div class="mbar"><a class="btn btn-primary" href="{DONATE}" target="_blank" rel="noopener">Donate</a><a class="btn btn-ghost" href="{(R or './')}#contact">Contact us</a></div>''' if mbar else ''
    return f'''<footer class="site-footer"><div class="wrap">
<div class="foot-grid">
<div><div class="foot-brand"><img class="chip" src="{R}img/onward-logo.png" alt="" width="64" height="64"><div><b>Onward! A Legacy Foundation</b>Your community foundation for the Four Corners.<br>33 N. Chestnut &middot; P.O. Box 26<br>Cortez, CO 81321<br><a href="tel:+19705659200">(970) 565-9200</a></div></div></div>
<div class="foot-dup"><h4>Explore</h4><ul><li><a href="{R}funds/">Our funds</a></li><li><a href="{R}scholarships/">Scholarships</a></li><li><a href="{R}grants/">Grants</a></li><li><a href="{(R or './')}#about">About Onward!</a></li></ul></div>
<div><h4>Give</h4><ul><li><a href="{DONATE}" target="_blank" rel="noopener">Donate online</a></li><li><a href="{(R or './')}#give">Ways to give</a></li><li><a href="{ADVISOR}" target="_blank" rel="noopener">Fund advisor login</a></li><li><a href="{UP}/2025/11/2025-Report.pdf" target="_blank" rel="noopener">2025 Annual Report (PDF)</a></li></ul></div>
<div><h4>For our partners</h4><ul><li><a href="{R}board/">Board &amp; staff portal</a></li><li><a href="{R}funds/?type=fiscal">Fiscal projects</a></li><li><a href="mailto:grants@onwardfoundation.org">grants@onwardfoundation.org</a></li><li><a href="mailto:info@onwardfoundation.org">info@onwardfoundation.org</a></li></ul></div>
</div>
<div class="foot-base"><span>Content on this concept is taken from onwardfoundation.org. Onward! A Legacy Foundation is a 501(c)(3) community foundation.</span><span>Concept by <a href="https://williamsdigital.io">Williams Digital</a> &middot; <a href="{R}proposal/">Proposal</a></span></div>
</div></footer>
{bar}
<script src="{R}js/data.js?v={V}"></script>
<script src="{R}js/site.js?v={V}"></script>
</body></html>
'''


def page_head(crumb, eyebrow, h1, lede, R):
    return f'''<section class="page-head"><div class="wrap">
<p class="crumbs"><a href="{R}">Home</a> &nbsp;/&nbsp; {crumb}</p>
<p class="eyebrow">{eyebrow}</p><h1>{h1}</h1><p class="lede">{lede}</p>
</div></section>'''


# ---------------------------------------------------------------- HOME
def home():
    R = ''
    paths = [
        ('give', 'Donors', 'Give to a cause you love', 'Give online to any of our funds, or leave a gift in your will, of stock, insurance or land.', '#give', 'Ways to give'),
        ('start', 'Families &amp; businesses', 'Start a fund', 'Create a donor advised, memorial or scholarship fund without the cost of a private foundation.', 'funds/', 'See the fund types'),
        ('student', 'Students', 'Apply for a scholarship', 'Twenty scholarships for local students. Applications are open January 1 to April 1.', 'scholarships/', 'Find scholarships'),
        ('grant', 'Nonprofits', 'Apply for a grant', 'Grants of $500 to $5,000 for nonprofits in five Southwest Colorado counties.', 'grants/', 'How the grant cycle works'),
        ('fiscal', 'Community projects', 'Get a fiscal sponsor', 'Run your project under our 501(c)(3) status while we handle tax filings, insurance and reporting.', 'funds/?type=fiscal', 'About fiscal sponsorship'),
    ]
    path_html = ''.join(f'<a class="path rv" href="{h}"><span class="ico">{ICON[i]}</span><small>{who}</small><h3>{t}</h3><p>{p}</p><span class="go arrow">{go} </span></a>' for i, who, t, p, h, go in paths)
    types = [
        ('Donor advised funds', 'Created by individuals or families for the benefit of other non-profit organizations.', 'Individuals, families and businesses', 'daf'),
        ('Endowment funds', 'Manage assets in perpetuity and distribute the earnings annually to the beneficiary non-profit.', 'Donors and non-profits thinking long term', 'endowment'),
        ('Agency funds', 'Created by other non-profit 501(c)(3)s for managing long-term funds, such as endowments and other strategic projects.', 'Established non-profits', 'agency'),
        ('Fiscal projects', 'Onward! shares its 501(c)(3) status and back-office infrastructure with mission-aligned projects.', 'New and volunteer-led community projects', 'fiscal'),
        ('Scholarship funds', 'Funds created by families, alumni and local organizations to help students continue their education.', 'Anyone who wants to help local students', 'scholarship'),
        ('Specific interest funds', 'Funds that support one named cause, such as a library, the fairgrounds or a local service club.', 'Groups supporting a single cause', 'general'),
    ]
    type_html = ''.join(f'<div class="type rv"><div class="num">0{n + 1}</div><h3>{t}</h3><p>{d}</p><div class="who"><b>Best for:</b> {w}</div><a class="arrow" href="funds/?type={k}">See these funds </a></div>' for n, (t, d, w, k) in enumerate(types))
    voices = [
        ('We feel that placing our $150,000 endowment fund with Onward has increased our credibility among community members, especially among the business community, and enhanced ongoing fundraising.', 'Barbara Stagg', 'Montezuma County Historical Society dba Montezuma Heritage Museum'),
        ('Onward! A Legacy Foundation&rsquo;s financial support played a crucial role in helping our organization navigate the challenges of the past few years and ensured that we could continue providing essential services to people with disabilities in the region. We are deeply grateful for your partnership in these very trying times.', 'Lisa Branner', 'Community Connections, Inc.'),
        ('The Board of Directors of SouthWest Colorado Concerts are very appreciative of Onward! A Legacy Foundation for funding these (Brassfire &amp; master class) opportunities for exciting, professional music for the students in our area.', 'Christine Stramel', 'SouthWest Colorado Concerts'),
    ]
    voice_html = ''.join(f'<figure class="voice rv"><blockquote>&ldquo;{q}&rdquo;</blockquote><cite><b>{n}</b>{o} &middot; Grant awardee</cite></figure>' for q, n, o in voices)
    values = [
        ('We serve with visionary leadership', 'We strive for collaborative and equitable relationships to benefit the future of our community.'),
        ('We steward investments with integrity', 'We tend your generous contributions with active engagement, opportunities for growth, and long-term considerations.'),
        ('We cultivate a culture of giving and caring', 'We make a difference through local philanthropy.'),
        ('We embrace excellence', 'We strive for excellence through reliability, accountability, and professionalism.'),
        ('We forge innovative growth', 'As catalysts in our community, we work to move peoples&rsquo; passions to actions.'),
    ]
    value_html = ''.join(f'<div class="value rv"><h3>{t}</h3><p>{d}</p></div>' for t, d in values)
    staff = [('chuck', 'Chuck R. Forth', 'Executive Director'), ('vanessa', 'Vanessa Malloy', 'Executive Program Director'), ('tharimae', 'Tharimae Jones', 'Operations Manager'), ('rebecca', 'Rebecca Tevault', 'Staff Accountant'), ('misty', 'Misty Hately', 'Executive Assistant')]
    staff_html = ''.join(f'<div class="person"><img src="img/staff-{k}.jpg" alt="{n}" width="132" height="132" loading="lazy"><b>{n}</b><span>{r}</span></div>' for k, n, r in staff)
    return head('Onward! A Legacy Foundation | Your community foundation for the Four Corners', 'Onward! A Legacy Foundation is the community foundation for the Four Corners: scholarships, grants, donor funds and fiscal sponsorship from Cortez, Colorado.', R) + header(R) + f'''
<main id="main">
<section class="hero"><div class="wrap">
<div>
<p class="eyebrow">Your community foundation for the Four Corners</p>
<h1>Local giving that <em>lasts.</em></h1>
<p class="lede">Since 2002, Onward! has helped neighbors, families and non-profits turn generosity into scholarships, grants and funds that keep giving, right here at home.</p>
<div class="cta-row" data-hero-cta><a class="btn btn-primary arrow" href="{DONATE}" target="_blank" rel="noopener">Give to a fund </a><a class="btn btn-ghost" href="#paths">Find where you fit</a></div>
</div>
<div class="hero-art">{HERO_ART}<div class="hero-tag"><b>170+ funds</b>working for the Four Corners, from one office on North Chestnut.</div></div>
</div></section>

<section class="stats" aria-label="Onward! at a glance"><div class="wrap">
<div class="stat"><b>$9.7M+</b><span>in assets managed today, up from $78,000 in one fund</span></div>
<div class="stat"><b>170+</b><span>different funds under one roof</span></div>
<div class="stat"><b>7.5%</b><span>average annual return</span></div>
<div class="stat"><b>2002</b><span>the year Onward! was created</span></div>
</div></section>

<section class="notice" data-cycle><div class="wrap"><p><span class="dot" aria-hidden="true"></span><b data-cycle-title>The grant cycle opens September 1.</b> <span data-cycle-text>Applications are accepted September 1 through October 15.</span></p><a class="btn btn-light btn-sm arrow" href="grants/">Grant details </a></div></section>

<section class="section" id="paths"><div class="wrap">
<div class="center"><p class="eyebrow">Start here</p><h2>What brings you to Onward!?</h2><p class="lede">We do five different things for five different groups of people. Pick the one that sounds like you.</p></div>
<div class="paths">{path_html}</div>
<p class="swipe-hint">Swipe to see all five &rarr;</p>
</div></section>

<section class="section sandbg" id="give"><div class="wrap">
<div class="split wide-l">
<div>
<p class="eyebrow">For donors</p>
<h2>Is a community foundation fund right for you?</h2>
<p class="lede">Onward! offers the opportunity for all individuals and groups to generate income for their important causes. Partner with Onward! to:</p>
<ul class="checks" style="margin-top:22px">
<li>Simplify philanthropic giving</li>
<li>Avoid the expense and complexity of creating a private foundation or separate non-profit organization</li>
<li>Pool assets for higher yields and lower administrative costs</li>
<li>Rely on a dedicated volunteer board of directors and the experienced professionals on our financial advisory committee</li>
<li>Support your favorite cause in a variety of ways: a gift in your will, cash, stock, insurance, land or other property</li>
</ul>
<div class="cta-row" style="margin-top:14px"><a class="btn btn-primary arrow" href="{DONATE}" target="_blank" rel="noopener">Donate online </a><a class="btn btn-ghost" href="#contact">Talk with Chuck about a gift</a></div>
</div>
<figure class="rv"><div class="photo"><img src="img/grants-general-endowment-2024.jpg" alt="A large group of grant awardees holding certificates in front of the Onward! A Legacy Foundation banner" width="1600" height="1127" loading="lazy"></div><figcaption>General Endowment Fund grant awardees with Onward! board members.</figcaption></figure>
</div>
</div></section>

<section class="section" id="fund-types"><div class="wrap">
<p class="eyebrow">Our funds, in plain language</p><h2>Six kinds of funds. One careful steward.</h2>
<p class="lede">As a donor, you can choose the type of fund that works best for your needs. Here is what each one is for.</p>
<div class="types">{type_html}</div>
</div></section>

<section class="section dark"><div class="wrap">
<p class="eyebrow">Onward! in our community</p><h2>What the support makes possible</h2>
<div class="voices">{voice_html}</div>
<p class="swipe-hint">Swipe for more &rarr;</p>
<div class="gallery">
<figure><img src="img/grants-searle-2024.jpg" alt="Searle Community Endowment grant awardees holding certificates" width="1200" height="900" loading="lazy"></figure>
<figure><img src="img/grants-heartwood-2024.jpg" alt="Heartwood Fund grant awardees holding certificates" width="1200" height="900" loading="lazy"></figure>
<figure><img src="img/fairgrounds.jpg" alt="New bucking chutes at the Montezuma County Fairgrounds" width="960" height="720" loading="lazy"></figure>
</div>
<p class="swipe-hint">Swipe for more photos &rarr;</p>
</div></section>

<section class="section" id="about"><div class="wrap">
<p class="eyebrow">About Onward!</p><h2>Local. Lasting. Sharing. Caring.</h2>
<p class="lede">Our mission is to provide opportunities to develop and maintain a sustainable resource base that will enhance the quality of life for residents in the Four Corners&rsquo; communities. Our efforts focus on scholarships, civic beautification, social services, arts &amp; culture, and organization development.</p>
<div class="values">{value_html}</div>
<h3 style="margin-top:64px;font-size:1.6rem">The people behind the funds</h3>
<div class="staff">{staff_html}</div>
<p style="margin-top:34px"><a class="textlink" href="{UP}/2025/11/2025-Report.pdf" target="_blank" rel="noopener">Read the 2025 Annual Report (PDF)</a></p>
</div></section>

<section class="section sandbg" id="contact"><div class="wrap">
<div class="split">
<div>
<p class="eyebrow">Contact</p><h2>We would love to hear from you.</h2>
<div class="contact-card">
<dl>
<dt>Visit</dt><dd>33 N. Chestnut, Cortez, CO 81321</dd>
<dt>Mail</dt><dd>P.O. Box 26, Cortez, CO 81321</dd>
<dt>Call</dt><dd><a href="tel:+19705659200">(970) 565-9200</a></dd>
<dt>Grants</dt><dd><a href="mailto:grants@onwardfoundation.org">grants@onwardfoundation.org</a></dd>
<dt>General</dt><dd><a href="mailto:info@onwardfoundation.org">info@onwardfoundation.org</a></dd>
</dl>
</div>
<h3 style="margin-top:34px">Get news from Onward!</h3>
<p style="color:var(--ink-soft)">Grant deadlines, scholarship season and stories from our funds, a few times a year.</p>
<form class="inline-form" data-demo><label class="sr" for="nl-email">Email address</label><input id="nl-email" type="email" placeholder="you@example.com" required autocomplete="email"><button class="btn btn-primary" type="submit">Sign up</button></form>
<div class="demo-msg" role="status">Concept demo: nothing was sent. On the real site this form adds the address straight to Onward!&rsquo;s existing Mailchimp audience.</div>
</div>
<div>
<form class="contact-card" data-demo>
<h3>Send us a message</h3>
<label class="field"><span>Your name</span><input type="text" required autocomplete="name"></label>
<label class="field"><span>Email</span><input type="email" required autocomplete="email"></label>
<label class="field"><span>I am interested in</span><select><option>General Onward! inquiry</option><option>Fiscal funds</option><option>Agency funds</option><option>Donor advised funds</option><option>Scholarship funds</option><option>Endowment funds</option><option>Submit an event for the Onward! calendar</option><option>Other</option></select></label>
<label class="field"><span>Message</span><textarea rows="4" required></textarea></label>
<button class="btn btn-primary" type="submit">Send message</button>
<p class="formnote">Your &ldquo;interested in&rdquo; choice routes the message to the right person on staff.</p>
</form>
<div class="demo-msg" role="status">Concept demo: nothing was sent. The real form delivers to Onward! staff by email, exactly as the current one does.</div>
</div>
</div>
</div></section>
</main>
''' + footer(R)


# ---------------------------------------------------------------- FUNDS
def funds():
    R = '../'
    return head('Our Funds | Onward! A Legacy Foundation', 'Search every fund Onward! A Legacy Foundation manages: fiscal projects, scholarships, endowments, agency, donor advised and specific interest funds.', R) + header(R, 'funds') + f'''
<main id="main">
{page_head('Our Funds', 'Our funds', 'Every fund, in one searchable place.', 'Onward! manages a variety of funds. Search by name or cause, or filter by the kind of fund, then give directly to the one you care about.', R)}
<section class="section tight" style="padding-bottom:28px"><div class="wrap">
<div class="explain">
<div><b>Fiscal projects</b><p>Mission-driven community projects that operate under Onward!&rsquo;s 501(c)(3) status.</p></div>
<div><b>Endowment &amp; agency funds</b><p>Long-term funds that earn market rates of return for a non-profit, year after year.</p></div>
<div><b>Donor advised &amp; scholarship funds</b><p>Created by families, alumni and local groups to support causes and students.</p></div>
</div>
</div></section>
<div class="toolbar"><div class="wrap">
<div class="search"><label class="sr" for="fund-search">Search funds</label><input id="fund-search" type="search" placeholder="Search funds, for example library, youth, music" autocomplete="off"></div>
<div class="chips" id="fund-chips" role="group" aria-label="Filter by fund type"></div>
</div></div>
<section class="section tight" id="fund-directory" style="padding-top:0"><div class="wrap">
<p class="count" id="fund-count" aria-live="polite"></p>
<div class="cards" id="fund-list"></div>
<div class="more-wrap"><button class="btn btn-ghost" id="fund-more" type="button">Show more</button></div>
</div></section>
<section class="section sandbg"><div class="wrap"><div class="split">
<div><p class="eyebrow">Fiscal sponsorship</p><h2>Have a project that needs a home?</h2>
<p class="lede">Fiscal sponsorship is a collaborative relationship where Onward! shares its 501(c)(3) status and back-office infrastructure with mission-aligned projects.</p>
<p style="color:var(--ink-soft)">Each project operates as a program of Onward! but retains its own identity and makes its own strategic and day-to-day decisions. Projects can accept grants and donations, enter into contracts, hire staff, and provide employee benefits. Onward! handles all tax filings, insurance, donor and regulatory compliance, and provides timely financial reports.</p>
<div class="cta-row"><a class="btn btn-primary" href="{UP}/2026/06/2026-Fiscal-Projects-Benefits-Flier-3.pdf" target="_blank" rel="noopener">Fiscal project benefits (PDF)</a><a class="btn btn-ghost" href="../#contact">Ask about your project</a></div></div>
<div><p class="eyebrow">Start a fund</p><h2>Open a fund of your own.</h2>
<ul class="checks">
<li><b>Individuals, families or businesses:</b> establish a donor advised fund for your charitable cause.</li>
<li><b>Non-profits:</b> create an agency fund to set aside money for future use, or an agency endowment fund to set it aside in perpetuity.</li>
<li><b>In memory or in honor:</b> set up a memorial fund for someone you love.</li>
</ul>
<a class="btn btn-ghost" href="../#contact">Talk with us about a new fund</a></div>
</div></div></section>
</main>
''' + footer(R)


# ---------------------------------------------------------------- SCHOLARSHIPS
def scholarships():
    R = '../'
    return head('Scholarships | Onward! A Legacy Foundation', 'Find and apply for scholarships from Onward! A Legacy Foundation. Applications are open January 1 to April 1 for students in the Four Corners.', R) + header(R, 'scholarships') + f'''
<main id="main">
{page_head('Scholarships', 'For students', 'Find the scholarships you qualify for.', 'Local families, alumni and organizations have created twenty scholarships through Onward!. Tell us your school and what you plan to study, and we will show you the ones that fit.', R)}
<section class="section tight"><div class="wrap">
<div class="keydates">
<div class="keydate"><b>January 1</b><span>Applications open for the year.</span></div>
<div class="keydate"><b>April 1</b><span>Deadline for most scholarships. The Aikin Scholarship closes February 20, and the Heartwood Scholarship can be submitted at any time.</span></div>
<div class="keydate"><b>April to December</b><span>Application forms are in revision. Applications submitted during this time may not be considered.</span></div>
</div>
</div></section>

<section class="section tight" style="padding-top:0"><div class="wrap">
<h2>Scholarship finder</h2>
<div class="grid2" style="max-width:720px">
<label class="field"><span>My high school</span><select id="sch-school"><option value="all">Any school</option><option value="mchs">Montezuma-Cortez High School</option><option value="mancos">Mancos High School</option><option value="dolores">Dolores, Dolores County or Southwest Open School</option><option value="pagosa">Pagosa Springs High School</option></select></label>
</div>
<div class="chips" id="sch-chips" role="group" aria-label="Filter by field of study" style="margin-top:6px;margin-bottom:4px"></div>
<p class="count" id="sch-count" aria-live="polite"></p>
<div class="sch-list" id="sch-list"></div>
<p class="formnote" style="margin-top:16px">Always check each scholarship&rsquo;s own guidelines for full eligibility. Questions? Call <a href="tel:+19705659200">(970) 565-9200</a>.</p>
</div></section>

<section class="section sandbg" id="apply"><div class="wrap">
<div class="split wide-l" style="align-items:start">
<div>
<p class="eyebrow">A better way to apply</p>
<h2>One application. Every scholarship you qualify for.</h2>
<p class="lede">Today a student fills out a general application, then a separate form for each scholarship. In the redesign it is one form: your details once, then tick the scholarships you want.</p>
<ul class="checks" style="margin-top:20px">
<li>Only the scholarships your school qualifies for are shown</li>
<li>Scholarships that consider you automatically are flagged, so nobody applies twice</li>
<li>Save your progress and come back later, as students can today</li>
<li>Staff receive one complete packet per student instead of several</li>
</ul>
<p class="formnote">Try it: this demo is fully clickable. Nothing is sent or stored beyond your own browser.</p>
</div>
<div class="app" id="app-demo">
<div class="app-head"><span class="app-step on"><i>1</i><b>About you</b></span><span class="app-step"><i>2</i><b>Choose scholarships</b></span><span class="app-step"><i>3</i><b>Documents</b></span></div>
<div class="app-body">
<div class="app-pane on">
<div class="grid2">
<label class="field"><span>Full name</span><input id="app-name" type="text" autocomplete="name"></label>
<label class="field"><span>Email</span><input id="app-email" type="email" autocomplete="email"></label>
<label class="field"><span>High school attended</span><select id="app-school"><option value="">Choose your school</option><option value="mchs">Montezuma-Cortez High School</option><option value="mancos">Mancos High School</option><option value="dolores">Dolores High School</option><option value="dolores">Dolores County High School</option><option value="dolores">Southwest Open School</option><option value="pagosa">Pagosa Springs High School</option></select></label>
<label class="field"><span>Graduation year (or year of GED)</span><input id="app-year" type="text" inputmode="numeric" placeholder="2027"></label>
</div>
</div>
<div class="app-pane"><p style="margin-bottom:14px;color:var(--ink-soft)">Based on your school, you can apply for these with this one form:</p><div id="app-picks"></div></div>
<div class="app-pane"><p style="margin-bottom:14px;color:var(--ink-soft)">Upload once. Each committee receives the documents it needs.</p>
<ul class="uploads"><li>Resume covering the last four years<span>PDF or Word</span></li><li>Official transcript with senior fall grades<span>PDF</span></li><li>National test scores (SAT or ACT)<span>PDF</span></li><li>Letters of recommendation from non-family members<span>Up to 3 files</span></li><li>Letter of acceptance<span>PDF</span></li></ul></div>
<div class="app-pane"><h3>That is the whole application.</h3><p style="color:var(--ink-soft)">Concept demo: nothing was sent. On the real site the student gets a confirmation email, and Onward! staff receive one complete packet they can forward to each scholarship committee.</p></div>
</div>
<div class="app-foot"><button class="btn btn-ghost btn-sm" id="app-back" type="button">Back</button><span class="saved" id="app-saved" aria-live="polite"></span><button class="btn btn-primary btn-sm" id="app-next" type="button">Continue</button></div>
</div>
</div>
</div></section>

<section class="section tight"><div class="wrap">
<div class="split" style="align-items:start">
<div><h2>Already have a renewable scholarship?</h2><p style="color:var(--ink-soft)">You do not need to reapply. Send us your updated information and transcripts each year and we forward them to the scholarship committee for approval to renew.</p><a class="btn btn-ghost" href="../#contact">Update my renewal information</a></div>
<div><h2>Other assistance</h2><div class="explain" id="sch-other" style="grid-template-columns:minmax(0,1fr)"></div></div>
</div>
</div></section>
</main>
''' + footer(R)


# ---------------------------------------------------------------- GRANTS
def grants():
    R = '../'
    return head('Grants | Onward! A Legacy Foundation', 'Onward! A Legacy Foundation enhancement grants: $500 to $5,000 for nonprofits in Montezuma, Dolores, La Plata, Archuleta and San Juan counties. Open September 1 to October 15.', R) + header(R, 'grants') + f'''
<main id="main">
{page_head('Grants', 'For non-profits', 'Grants that strengthen Southwest Colorado.', 'Each fall Onward! and four partner funds award short-term enhancement grants to non-profits doing good work across five counties.', R)}
<section class="notice" data-cycle><div class="wrap"><p><span class="dot" aria-hidden="true"></span><b data-cycle-title>The grant cycle opens September 1.</b> <span data-cycle-text>Applications are accepted September 1 through October 15.</span></p><a class="btn btn-light btn-sm" href="#documents">Guidelines &amp; application</a></div></section>

<section class="section tight"><div class="wrap">
<div class="keydates">
<div class="keydate"><b>$500 to $5,000</b><span>Short-term grants, for a maximum of one year.</span></div>
<div class="keydate"><b>Sept 1 to Oct 15</b><span>The grant cycle opens and closes on the same dates every year.</span></div>
<div class="keydate"><b>34 organizations</b><span>fully or partially funded in the 2024 grant cycle.</span></div>
</div>
</div></section>

<section class="section tight" style="padding-top:0"><div class="wrap"><div class="split" style="align-items:start">
<div>
<p class="eyebrow">Who can apply</p><h2>Criteria to apply</h2>
<ul class="checks">
<li>Be a not-for-profit project or organization located in and providing services to Montezuma, Dolores, La Plata, Archuleta or San Juan County, Colorado</li>
<li>Have 501(c)(3) status</li>
<li>Have an organizational structure that demonstrates professionalism and accountability, such as a board of directors or similar governance</li>
<li>Have well defined goals and a method for evaluating success for the grant activity proposed</li>
</ul>
<p style="color:var(--ink-soft)">Grants support general operations or a specific program in arts &amp; culture, basic needs, education, social services, sports &amp; athletics, and youth.</p>
</div>
<figure><div class="photo"><img src="../img/grants-golden-dreams-2024.jpg" alt="Grant awardees holding certificates in front of the Onward! banner" width="1200" height="900" loading="lazy"></div><figcaption>Golden Dreams Foundation Fund grant awardees.</figcaption></figure>
</div></div></section>

<section class="section sandbg"><div class="wrap">
<p class="eyebrow">How it works</p><h2>From application to celebration</h2>
<div class="steps">
<div class="step"><b>Read the guidelines</b><p>Check the criteria and the FAQs before you start.</p></div>
<div class="step"><b>Apply online</b><p>One online form about your organization, your request and how you will measure success.</p></div>
<div class="step"><b>Review</b><p>Applications are reviewed after the October 15 deadline. Four additional grant fund partners take part to raise the level of giving.</p></div>
<div class="step"><b>Report back</b><p>Awardees complete a final grant report and take part in a media event.</p></div>
</div>
<div id="documents" style="margin-top:44px"><h3 style="font-size:1.5rem">Application paperwork and information</h3>
<div class="docs">
<a class="doc" href="{UP}/2025/08/Onward-Grant-Guidelines.pdf" target="_blank" rel="noopener"><i>PDF</i><span><b>Grant guidelines</b><small>What we fund and how to apply</small></span></a>
<a class="doc" href="{UP}/2022/09/Onward-Grant-FAQs.pdf" target="_blank" rel="noopener"><i>PDF</i><span><b>Grant FAQs</b><small>Answers to common questions</small></span></a>
<a class="doc" href="https://onwardfoundation.org/Site/?page_id=1519" target="_blank" rel="noopener"><i>FORM</i><span><b>Grant application</b><small>Online form, opens on the current site</small></span></a>
<a class="doc" href="https://onwardfoundation.org/Site/?page_id=5086" target="_blank" rel="noopener"><i>FORM</i><span><b>Grant final report</b><small>For current awardees</small></span></a>
</div>
<p class="formnote">Questions may be directed to <a href="mailto:grants@onwardfoundation.org">grants@onwardfoundation.org</a>.</p></div>
</div></section>

<section class="section"><div class="wrap">
<p class="eyebrow">Recent awardees</p><h2>2024 grant winners</h2>
<p class="lede">In 2024, Onward! was able to fully or partially fund grant applications from 34 non-profit organizations.</p>
<ul class="cols" id="awardees"></ul>
</div></section>
</main>
''' + footer(R)


# ---------------------------------------------------------------- BOARD
def board():
    R = '../'
    return head('Board & Staff Portal | Onward! A Legacy Foundation', 'Private board and staff area for Onward! A Legacy Foundation.', R) + header(R) + f'''
<main id="main">
<section class="section sandbg gate-wrap" id="gate-wrap"><div class="wrap">
<div class="gate">
<div class="lock">{ICON['lock']}</div>
<h1 style="font-size:1.9rem">Board &amp; staff portal</h1>
<p style="color:var(--ink-soft)">This area is for Onward! board members and staff. It is hidden from the public menu and from search engines.</p>
<form id="gate-form"><label class="field"><span>Password</span><input id="gate-pass" type="password" autocomplete="current-password" required></label><p class="err" id="gate-err" role="alert"></p><button class="btn btn-primary" type="submit" style="width:100%">Sign in</button></form>
<div class="hint"><b>Concept demo.</b> The password is <b>onward2026</b>. On the real site each board member signs in with their own WordPress account, so access can be added or removed one person at a time.</div>
</div>
</div></section>

<div class="portal" id="portal">
<section class="page-head"><div class="wrap"><p class="eyebrow">Private &middot; board &amp; staff only</p><h1>Board &amp; staff portal</h1><p class="lede">One place for meeting packets, announcements and the documents the board needs. Everything below is sample content to show the layout.</p><button class="btn btn-ghost btn-sm" id="portal-out" type="button">Sign out</button></div></section>
<section class="section tight"><div class="wrap"><div class="pgrid">
<div class="panel"><h3>Announcements <span class="sample">Sample</span></h3><ul class="rows"><li>A note from the Executive Director appears here<span>Posted by staff</span></li><li>Grant cycle review schedule<span>Posted by staff</span></li><li>Reminder: update your committee contact details<span>Posted by staff</span></li></ul><p class="formnote">Staff post an announcement the same way they write a page: a title, a few sentences, publish.</p></div>
<div class="panel"><h3>Next meeting <span class="sample">Sample</span></h3><p style="font-family:var(--display);font-size:1.5rem;line-height:1.2;margin-bottom:6px">Board meeting</p><p style="color:var(--ink-soft)">Date, time and location set by staff. Agenda and packet attached below.</p><a class="btn btn-ghost btn-sm" href="#packets">Open the packet</a></div>
<div class="panel" id="packets"><h3>Meeting packets <span class="sample">Sample</span></h3><ul class="rows"><li>Agenda<span>PDF</span></li><li>Minutes of the previous meeting<span>PDF</span></li><li>Financial statements<span>PDF</span></li><li>Investment Advisory Committee report<span>PDF</span></li></ul></div>
<div class="panel"><h3>Reference documents <span class="sample">Sample</span></h3><ul class="rows"><li>Bylaws<span>PDF</span></li><li>Investment policy<span>PDF</span></li><li>Board directory<span>Members only</span></li><li>Conflict of interest form<span>Form</span></li></ul></div>
</div>
<div class="hint" style="margin-top:22px"><b>How this works on the real site.</b> These pages are WordPress pages restricted to signed-in users with a Board or Staff role. They are left out of the menu, the site search and the sitemap, and uploaded files are served only to people who are signed in.</div>
</div></section>
</div>
</main>
''' + footer(R, mbar=False)


PAGES = {'index.html': home, 'funds/index.html': funds, 'scholarships/index.html': scholarships, 'grants/index.html': grants, 'board/index.html': board}
for path, fn in PAGES.items():
    out = os.path.join(HERE, path)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    html = fn()
    with open(out, 'w') as f:
        f.write(html)
    print(path, len(html) // 1024, 'KB')
