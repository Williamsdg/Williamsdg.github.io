#!/usr/bin/env python3
"""Mastermind19 concept: stamps the shared header/footer onto each page body. Run: python3 _src/build.py"""
import os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CREST = ('<svg class="crest" viewBox="0 0 34 40" aria-hidden="true"><path d="M17 1.5 32 6v13c0 9.5-6.5 15.5-15 19.5C8.5 34.5 2 28.5 2 19V6z" fill="#0E4330" stroke="#C8A95E" stroke-width="1.4"/>'
         '<path d="M9.5 27c-2.6-3.4-2.6-9.6 0-13M24.5 27c2.6-3.4 2.6-9.6 0-13" fill="none" stroke="#C8A95E" stroke-width="1.1"/>'
         '<path d="M8.2 16.6l2.2.6M8 20l2.4.2M8.4 23.4l2.2-.4M25.8 16.6l-2.2.6M26 20l-2.4.2M25.6 23.4l-2.2-.4" stroke="#C8A95E" stroke-width="1" stroke-linecap="round"/>'
         '<text x="17" y="24.6" text-anchor="middle" font-family="Bodoni Moda, Didot, serif" font-size="12.5" font-weight="600" fill="#E2CB8E">19</text></svg>')

NAV = [('membership.html','Membership'),('experiences.html','Experiences'),('founder.html','Founder')]

def header(cur):
    links = ''.join(f'<a href="{h}"{" aria-current=page" if h==cur else ""}>{t}</a>' for h,t in NAV)
    return f'''<a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap">
<a class="brand" href="index.html" aria-label="Mastermind19 home">{CREST}<b>Mastermind19<small>A private mastermind for leaders who golf</small></b></a>
<nav class="nav" aria-label="Primary">{links}<a class="login" href="member.html">Member sign in</a><a class="apply" href="apply.html">Apply</a></nav>
<button class="menu-btn" type="button" aria-expanded="false" aria-controls="drawer">Menu</button>
</div>
<div class="drawer" id="drawer"><nav aria-label="Mobile">{links}<a href="apply.html">Apply for membership</a><a class="login" href="member.html">Member sign in</a></nav></div>
</header>
<main id="main">
'''

FOOTER = f'''</main>
<footer><div class="wrap">
 <div><a class="brand" href="index.html" aria-label="Mastermind19 home">{CREST}<b>Mastermind19</b></a><p class="tag">Where Business &amp; Birdies Collide</p></div>
 <div class="cols">
  <div><b>Explore</b><a href="membership.html">Membership</a><a href="experiences.html">Experiences</a><a href="founder.html">Our Founder</a><a href="membership.html#faq">Questions</a></div>
  <div><b>Join</b><a href="apply.html">Apply now</a><a href="member.html">Member sign in</a></div>
  <div class="hide-m"><b>Mastermind19</b><a href="https://mastermind19.com/tos">Terms of Service</a><a href="https://mastermind19.com/privacy">Privacy Policy</a></div>
 </div>
 <div class="legal"><span>Copyright &copy; 2026 Mastermind19</span><span><a href="https://mastermind19.com/tos">Terms of Service</a> &nbsp;&nbsp; <a href="https://mastermind19.com/privacy">Privacy Policy</a></span></div>
</div></footer>
<div class="concept">Website concept by <a href="https://williamsdigital.io">Williams Digital</a>. Not affiliated with Mastermind19. Copy and photographs are from mastermind19.com. The form sends nothing. <a href="pitch.html">See the proposal</a></div>
<div class="mcta"><a class="btn gold" href="apply.html">Apply for membership</a></div>
<script src="site.js?v=3"></script>
</body>
</html>
'''

def page(file, title, desc, body, cls=''):
    cur = file
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0A3324">
<link rel="icon" href="img/crest.png">
<!--
  MASTERMIND19 — website concept
  Williams Digital · built 2026-10-25 · Dylan@williamsdigital.io
  Unsolicited concept. Not commissioned by, affiliated with, or endorsed by
  Mastermind19 or Ryan Pineda. Copy and photographs are from mastermind19.com as
  published on 2026-10-25. The application form is a demonstration and sends nothing.
-->
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Jost:wght@300..700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="site.css?v=3">
</head>
<body class="has-mcta {cls}">
''' + header(cur) + body + FOOTER
    with open(os.path.join(ROOT, file), 'w') as f: f.write(html)
    print('wrote', file, len(html))

FAQ = [
 ("What actually happens at an M19 event?", "Imagine your dream golf trip… but with elite business minds. We tee it up at bucket-list courses, then head into strategy sessions where real deals and breakthroughs happen. It’s part luxury golf retreat, part high-level mastermind."),
 ("Do I have to be good at golf?", "No, but if you’re not… you better be good at business and love the game. This group is about connection. That said, most of our members are solid players."),
 ("Is this just another golf club or digital country club?", "Not even close. We’re not selling you on access to golf courses — we’re building a network of high-performing business owners who just happen to close deals over birdies and bourbon."),
 ("How often do you host events?", "All throughout the year — think bucket list courses, elite networking, and real business breakthroughs wrapped in once-in-a-lifetime golf trips."),
 ("What are the costs of the events?", "Each event will have a different price point depending on the course, length of stay, and activities we’ll be doing."),
 ("Can I bring a guest to events?", "Founding Members will have opportunities to bring qualified guests. But this club is application-only for a reason — we’re curating the right mix of business + vibes."),
 ("Is this only for men?", "No. We’re open to any elite entrepreneur who meets the criteria and loves the game."),
 ("What if I don’t belong to a private golf club?", "That’s okay. It’s a plus, not a requirement. We’re more focused on who you are off the course than where you play on weekends."),
 ("Can I apply if I’m not a business owner but still have a high net worth?", "Yes! If you’re an investor or operator at a high level, we’d love to have you!"),
]
def qa(items):
    return '<div class="qa">' + ''.join(f'<details><summary>{q}<i aria-hidden="true"></i></summary><div class="a">{a}</div></details>' for q,a in items) + '</div>'

SCORECARD = '''<div class="scorecard" role="table" aria-label="How applications are evaluated">
 <div class="row hd" role="row"><span role="columnheader">We evaluate based on</span><span role="columnheader">The standard</span></div>
 <div class="row" role="row"><span class="what" role="cell">Business size</span><span class="how" role="cell"><i class="tick" aria-hidden="true"></i><b>$1M+ in annual revenue.</b></span></div>
 <div class="row" role="row"><span class="what" role="cell">Connections &amp; expertise</span><span class="how" role="cell"><i class="tick" aria-hidden="true"></i>What value can you bring?</span></div>
 <div class="row" role="row"><span class="what" role="cell">Personality &amp; culture fit</span><span class="how" role="cell"><i class="tick" aria-hidden="true"></i>Do you mesh well with the group?</span></div>
</div>'''

APPLY_CTA = '''<section class="apply-cta ivory"><div class="wrap">
 <div class="box">
  <div><p class="kicker">We’re now accepting members.</p><h2>Ready to Apply for Mastermind19?</h2><p>If you’re a fit, this will be the most valuable &amp; fun group that you could be part of.</p></div>
  <div class="actions"><a class="btn gold" href="apply.html">Apply Now</a><small>Enter your information to book a call with our team to learn more.</small></div>
  <img class="crest-bg" src="img/crest.png" alt="" aria-hidden="true">
 </div>
</div></section>
'''

# ---------------- HOME ----------------
HOME = f'''
<section class="hero dark"><div class="wrap">
 <div class="copy">
  <p class="kicker">A private mastermind for high-level business leaders who golf</p>
  <h1>The room where your next 7&#8209;figure deal is waiting.</h1>
  <p class="lede">Membership to M19 is application only. If you’re a fit, this will be the most valuable &amp; fun group that you could be part of.</p>
  <div class="cta"><a class="btn gold" href="apply.html">Apply for membership</a><a class="textlink" href="membership.html">How membership works</a></div>
 </div>
 <div class="hole"><div data-hole="19"></div></div>
</div>
<div class="motto"><div class="wrap"><div>We golf.</div><div>We grow.</div><div>We win.</div></div></div>
</section>

<section class="manifesto ivory"><div class="wrap">
 <figure><img src="img/course.webp" srcset="img/course-m.webp 900w, img/course.webp 1200w" sizes="(max-width:900px) 92vw, 40vw" alt="A golf hole at sunrise, bunkers guarding the green beside the water" loading="lazy" width="1200" height="800"></figure>
 <div>
  <p class="kicker">Where Business &amp; Birdies Collide</p>
  <p class="pull">Let’s be real, you’re not joining just to swing a club. You’re here to <strong>grow your net worth</strong>, build deep connections, and unlock business breakthroughs with people who play the same game you do in business and on the course.</p>
  <p class="sub">M19 isn’t another “digital country club” selling you on tee times. This is about deals, partnerships, play, and profit.</p>
 </div>
</div></section>

<section class="book dark2"><div class="wrap">
 <div class="head"><div><p class="kicker">What you get as a member</p><h2>This Isn’t Just a Round of Golf...</h2></div><p>It’s the room where your next 7-figure deal is waiting. We keep the community curated, high-level, and valuable.</p></div>
 <div class="spreads">
  <article class="spread"><div data-hole="1"></div><h3>M19 Online Community</h3><p>Connect with other members, access private clubs, &amp; monthly business trainings.</p><p class="where">Online</p></article>
  <article class="spread"><div data-hole="2"></div><h3>Member-Only Tournaments</h3><p>Competitive &amp; casual formats to network &amp; claim bragging rights.</p><p class="where">Members only</p></article>
  <article class="spread"><div data-hole="3"></div><h3>Bucket List Golf Trips</h3><p>Epic golf trips across the world with masterminds built in to grow your business.</p><p class="where">Across the world</p></article>
  <article class="spread"><div data-hole="4"></div><h3>Vegas Golf &amp; Mastermind Day</h3><p>Play a round and mastermind with our founder Ryan &amp; other M19 members in Las Vegas, NV.</p><p class="where">Las Vegas, NV</p></article>
 </div>
 <div class="dots" aria-hidden="true"></div>
 <div class="foot"><a class="btn line" href="experiences.html">See the experiences</a><p>Each event will have a different price point depending on the course, length of stay, and activities we’ll be doing.</p></div>
</div></section>

<section class="card-sec ivory"><div class="wrap">
 <div class="intro"><p class="kicker">Application or member referral only</p><h2>Who Gets In?</h2><p>We vet every member carefully to maintain the standard.</p><a class="btn green" href="apply.html">Apply now</a></div>
 {SCORECARD}
</div></section>

<section class="band"><img src="img/members.webp" srcset="img/members-m.webp 900w, img/members.webp 1600w" sizes="100vw" alt="Five members on a tee box with the mountains behind" loading="lazy" width="1600" height="1121"><div class="wrap"><blockquote>We’re building a network of high-performing business owners who just happen to close deals over birdies and bourbon.<cite>Where Business &amp; Birdies Collide</cite></blockquote></div></section>

<section class="founder dark"><div class="wrap">
 <div><p class="kicker">Our Founder</p><p class="name">Ryan Pineda<small>Founder of Mastermind19, Las Vegas, NV</small></p></div>
 <div class="bio">
  <p>Ryan Pineda has been in the real estate industry since 2010 and has invested in over $100,000,000 of real estate. He has built multiple 8 figure businesses and generated over 1 billion views on social media.</p>
  <div class="facts"><div><b>$100M+</b><span>of real estate invested</span></div><div><b>8 figures</b><span>multiple businesses built</span></div><div><b>1 billion+</b><span>views on social media</span></div></div>
  <p>Before his business success he was a professional baseball player with the Oakland A’s.</p>
  <p style="margin-top:26px"><a class="textlink" href="founder.html">More about Ryan</a></p>
 </div>
</div></section>

<section class="faq ivory"><div class="wrap">
 <div class="intro"><h2>Frequently Asked Questions</h2><p>What happens at an event, who it’s for, and what it costs.</p><a class="btn lineL" href="membership.html#faq">All nine questions</a></div>
 {qa(FAQ[:4])}
</div></section>

{APPLY_CTA}
'''

# ---------------- MEMBERSHIP ----------------
MEMBERSHIP = f'''
<section class="pagehead dark"><div class="wrap">
 <div><p class="kicker">Membership</p><h1>Who Gets In?</h1><p class="lede">Membership to M19 is application or member referral only. We vet every member carefully to maintain the standard.</p></div>
 <p class="side">We keep the community curated, high-level, and valuable.</p>
</div></section>

<section class="card-sec ivory"><div class="wrap">
 <div class="intro"><h2>We evaluate based on</h2><p>Investors and operators at a high level are welcome to apply. If you don’t belong to a private golf club, that’s okay. It’s a plus, not a requirement.</p><a class="btn green" href="apply.html">Apply now</a></div>
 {SCORECARD}
</div></section>

<section class="paper"><div class="wrap">
 <p class="kicker">Membership</p>
 <h2 style="margin-bottom:34px">What You Get as a Member</h2>
 <div class="long-spreads">
  <article><div data-hole="1"></div><div><h3>M19 Online Community</h3><p>Connect with other members, access private clubs, &amp; monthly business trainings.</p></div><p class="aside">Monthly business trainings.</p></article>
  <article><div data-hole="2"></div><div><h3>Member-Only Tournaments</h3><p>Competitive &amp; casual formats to network &amp; claim bragging rights.</p></div><p class="aside">Competitive &amp; casual formats.</p></article>
  <article><div data-hole="3"></div><div><h3>Bucket List Golf Trips</h3><p>Epic golf trips across the world with masterminds built in to grow your business.</p></div><figure><img src="img/course-m.webp" alt="A golf hole at sunrise beside the water" loading="lazy" width="900" height="600"></figure></article>
  <article><div data-hole="4"></div><div><h3>Vegas Golf &amp; Mastermind Day</h3><p>Play a round and mastermind with our founder Ryan &amp; other M19 members in Las Vegas, NV.</p></div><figure><img src="img/members-m.webp" alt="Five members on a tee box with the mountains behind" loading="lazy" width="900" height="631"></figure></article>
 </div>
</div></section>

<section class="dark2"><div class="wrap">
 <p class="kicker">How it works</p>
 <h2 style="margin-bottom:34px">Application only.</h2>
 <div class="steps">
  <div><b>Apply</b><p>Enter your information to book a call with our team to learn more.</p></div>
  <div><b>Book a call</b><p>We vet every member carefully to maintain the standard. Business size, connections &amp; expertise, and culture fit.</p></div>
  <div><b>Join the group</b><p>Founding Members will have opportunities to bring qualified guests. Each event will have a different price point depending on the course, length of stay, and activities.</p></div>
 </div>
</div></section>

<section class="faq ivory" id="faq"><div class="wrap">
 <div class="intro"><h2>Frequently Asked Questions</h2><p>Everything members ask before they apply.</p></div>
 {qa(FAQ)}
</div></section>

{APPLY_CTA}
'''

# ---------------- EXPERIENCES ----------------
EXPERIENCES = f'''
<section class="pagehead dark"><div class="wrap">
 <div><p class="kicker">Experiences</p><h1>This Isn’t Just a Round of Golf...</h1><p class="lede">It’s the room where your next 7-figure deal is waiting. Part luxury golf retreat, part high-level mastermind.</p></div>
 <p class="side">All throughout the year. Bucket list courses, elite networking, and real business breakthroughs.</p>
</div></section>

<section class="band" style="min-height:clamp(260px,40vw,520px)"><img src="img/course.webp" srcset="img/course-m.webp 900w, img/course.webp 1200w" sizes="100vw" alt="A golf hole at sunrise, bunkers guarding the green beside the water" width="1200" height="800"><div class="wrap"><blockquote>Imagine your dream golf trip… but with elite business minds.<cite>What actually happens at an M19 event</cite></blockquote></div></section>

<section class="paper"><div class="wrap">
 <div class="long-spreads" style="border-top:0">
  <article><div data-hole="3"></div><div><h3>Bucket List Golf Trips</h3><p>Epic golf trips across the world with masterminds built in to grow your business. We tee it up at bucket-list courses, then head into strategy sessions where real deals and breakthroughs happen.</p></div><p class="aside">Bucket list courses, elite networking, and real business breakthroughs wrapped in once-in-a-lifetime golf trips.</p></article>
  <article><div data-hole="2"></div><div><h3>Member-Only Tournaments</h3><p>Competitive &amp; casual formats to network &amp; claim bragging rights.</p></div><p class="aside">Do I have to be good at golf? No. Most of our members are solid players, but this group is about connection.</p></article>
  <article><div data-hole="4"></div><div><h3>Vegas Golf &amp; Mastermind Day</h3><p>Play a round and mastermind with our founder Ryan &amp; other M19 members in Las Vegas, NV.</p></div><figure><img src="img/members-m.webp" alt="Five members on a tee box with the mountains behind" loading="lazy" width="900" height="631"></figure></article>
  <article><div data-hole="1"></div><div><h3>M19 Online Community</h3><p>Connect with other members, access private clubs, &amp; monthly business trainings.</p></div><p class="aside">Monthly business trainings.</p></article>
 </div>
</div></section>

<section class="faq ivory"><div class="wrap">
 <div class="intro"><h2>About the events</h2><p>How often, what they cost, and who can come.</p><a class="btn lineL" href="membership.html#faq">All nine questions</a></div>
 {qa([FAQ[0],FAQ[3],FAQ[4],FAQ[5]])}
</div></section>

{APPLY_CTA}
'''

# ---------------- FOUNDER ----------------
FOUNDER = f'''
<section class="pagehead dark"><div class="wrap">
 <div><p class="kicker">Our Founder</p><h1>Ryan Pineda</h1><p class="lede">Founder of Mastermind19. Las Vegas, NV.</p></div>
 <p class="side">His desire is to share his story, inspire others, and lead people to Jesus.</p>
</div></section>

<section class="founder-page ivory"><div class="wrap">
 <div class="portrait"><p class="mono">R<em>P</em></p>
  <dl>
   <div><dt>Based in</dt><dd>Las Vegas, NV</dd></div>
   <div><dt>Real estate</dt><dd>Since 2010</dd></div>
   <div><dt>Invested</dt><dd>Over $100,000,000</dd></div>
   <div><dt>Businesses</dt><dd>Multiple 8 figure</dd></div>
   <div><dt>Social media</dt><dd>Over 1 billion views</dd></div>
   <div><dt>Before business</dt><dd>Professional baseball, Oakland A’s</dd></div>
  </dl>
 </div>
 <div class="bio">
  <p>Ryan Pineda has been in the real estate industry since 2010 and has invested in over $100,000,000 of real estate. He has built multiple 8 figure businesses and generated over 1 billion views on social media.</p>
  <p>Ryan lives in Las Vegas, NV with his wife Mindy and four children James, Olivia, Judah, &amp; Psalm. Before his business success he was a professional baseball player with the Oakland A’s. His desire is to share his story, inspire others, and lead people to Jesus.</p>
  <p style="margin-top:30px"><a class="textlink" href="experiences.html">Play a round with Ryan in Las Vegas</a></p>
 </div>
</div></section>

{APPLY_CTA}
'''

# ---------------- APPLY ----------------
REV_OPTS = ['Under $1M','$1M – $3M','$3M – $10M','$10M – $25M','$25M+']
APPLY = f'''
<section class="pagehead dark"><div class="wrap">
 <div><p class="kicker">Apply</p><h1>Ready to Apply for Mastermind19?</h1><p class="lede">Membership to M19 is application only. Enter your information below to book a call with our team to learn more.</p></div>
 <p class="side">We’re now accepting members.</p>
</div></section>

<section class="form-sec ivory"><div class="wrap">
 <div class="intro"><h2>Please enter your information below</h2><p>We evaluate based on business size, connections &amp; expertise, and personality &amp; culture fit.</p>
  <p class="note">This is a design concept. The form sends nothing. On the live site it would book the call and land in the team dashboard.</p></div>
 <form class="app" novalidate>
  <div class="field"><label for="fn">First Name <b>*</b></label><input id="fn" name="first" autocomplete="given-name" required></div>
  <div class="field"><label for="ln">Last Name <b>*</b></label><input id="ln" name="last" autocomplete="family-name" required></div>
  <div class="field"><label for="em">Email <b>*</b></label><input id="em" name="email" type="email" autocomplete="email" required></div>
  <div class="field"><label for="ph">Phone <b>*</b></label><input id="ph" name="phone" type="tel" autocomplete="tel" required></div>
  <div class="field full"><label for="web">Business Website <b>*</b></label><input id="web" name="website" type="url" inputmode="url" placeholder="https://" required></div>
  <div class="field"><label for="rev">Yearly Revenue <b>*</b></label><select id="rev" name="revenue" required><option value="">Choose one</option>{''.join(f'<option>{o}</option>' for o in REV_OPTS)}</select></div>
  <div class="field"><label for="club">Private Club Membership Y/N <b>*</b></label><select id="club" name="club" required><option value="">Choose one</option><option>Yes</option><option>No</option></select></div>
  <div class="field full"><label for="hc">Handicap (optional)</label><input id="hc" name="handicap" inputmode="decimal" placeholder="e.g. 12"></div>
  <label class="consent full"><input type="checkbox" name="sms"><span>I agree to receive recurring text (SMS) and RCS messages from Mastermind19 at the mobile number provided, including membership inquiry follow-ups, event invitations and reminders, and member updates. Message frequency varies. Message and data rates may apply. Reply HELP for help or STOP to cancel at any time. Consent is not a condition of purchase. View our <a href="https://mastermind19.com/tos">Terms of Service</a> and <a href="https://mastermind19.com/privacy">Privacy Policy</a>.</span></label>
  <label class="consent full"><input type="checkbox" name="marketing"><span>By checking this box, I consent to receive marketing and promotional messages including special offers, discounts, new product updates among others, from Mastermind19 at the phone number or email provided. Frequency may vary. Message &amp; data rates may apply. Text HELP for assistance, reply STOP to opt out.</span></label>
  <button class="btn green full" type="submit">Submit application</button>
  <div class="ok" role="status"><b>Application received.</b>Our team will reach out to book your call. (Concept: nothing was sent.)</div>
 </form>
</div></section>
'''

page('index.html', 'Mastermind19 · A private mastermind for high-level business leaders who golf (website concept)', 'Website concept for Mastermind19, the application-only private mastermind for business leaders who golf. Built by Williams Digital.', HOME)
page('membership.html', 'Membership · Mastermind19 (website concept)', 'Who gets in, what you get as a member, and how the application works.', MEMBERSHIP)
page('experiences.html', 'Experiences · Mastermind19 (website concept)', 'Bucket list golf trips, member-only tournaments, the Vegas Golf & Mastermind Day and the M19 online community.', EXPERIENCES)
page('founder.html', 'Our Founder, Ryan Pineda · Mastermind19 (website concept)', 'Ryan Pineda, founder of Mastermind19.', FOUNDER)
page('apply.html', 'Apply · Mastermind19 (website concept)', 'Apply for membership to Mastermind19. Application only.', APPLY, 'page-apply')
