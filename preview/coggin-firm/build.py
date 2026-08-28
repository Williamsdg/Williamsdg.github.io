#!/usr/bin/env python3
"""
Builds the inner pages of the Coggin Firm concept redesign from the homepage's
header/footer, so the chrome can never drift between pages.

    python3 build.py
"""
import re

src = open('index.html').read()
CHROME = src[src.index('<!-- ================= icon sprite'):src.index('<main id="main">')]
FOOTER = src[src.index('<!-- ================= 13. footer'):]

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400'
         '&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">')


def page(title, desc, current, body):
    chrome = CHROME.replace('<li><a href="index.html" aria-current="page">Home</a></li>',
                            '<li><a href="index.html">Home</a></li>')
    if current == 'attorneys':
        chrome = chrome.replace('<li><a href="gina-coggin.html">Attorneys</a></li>',
                                '<li><a href="gina-coggin.html" aria-current="page">Attorneys</a></li>', 1)
    elif current == 'contact':
        chrome = chrome.replace('<li><a href="contact.html">Contact</a></li>',
                                '<li><a href="contact.html" aria-current="page">Contact</a></li>', 1)
    return (
        '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
        '<meta charset="UTF-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<meta name="robots" content="noindex, nofollow">\n'
        f'<title>{title}</title>\n'
        f'<meta name="description" content="{desc}">\n'
        f'{FONTS}\n'
        '<link rel="stylesheet" href="assets/site.css">\n'
        '</head>\n<body>\n\n'
        + chrome +
        '<main id="main">\n' + body + '\n</main>\n\n'
        + FOOTER.replace('<script src="assets/site.js"></script>', '<script src="assets/site.js"></script>')
    )


def crumbs(items):
    parts = []
    for i, (label, href) in enumerate(items):
        if i:
            parts.append('<li class="sep" aria-hidden="true">&rsaquo;</li>')
        parts.append(f'<li><a href="{href}">{label}</a></li>' if href
                     else f'<li aria-current="page">{label}</li>')
    return ('<nav class="crumbs" aria-label="Breadcrumb"><div class="wrap"><ol>'
            + ''.join(parts) + '</ol></div></nav>')


def icon(name, size=18, cls=''):
    c = f' class="{cls}"' if cls else ''
    return f'<svg{c} width="{size}" height="{size}" aria-hidden="true"><use href="#i-{name}"/></svg>'


ARW = icon('arw', 16, 'arw')
TICK = icon('check', 15)

CONSULT_SECTION = '''
  <section class="section cta" id="consultation">
    <div class="wrap">
      <div class="cta-grid">
        <div class="rv">
          <p class="eyebrow">Request a Consultation</p>
          <h2 style="margin-top:18px">You do not have to figure out the next step alone.</h2>
          <p>Tell us a little about your situation and we will get back to you. If it is urgent, calling is always faster.</p>
          <div class="cta-contact">
            <a href="tel:+12564850909">%(phone)s<span><b>(256) 485-0909</b><small>Gadsden office</small></span></a>
            <a href="tel:+12569279090">%(phone)s<span><b>(256) 927-9090</b><small>Centre office</small></span></a>
            <a href="mailto:secretary@thecogginfirm.com">%(mail)s<span><b>secretary@thecogginfirm.com</b><small>General inquiries</small></span></a>
          </div>
        </div>
        <div class="rv d2">
          <div class="form-card">
            <h3>Send a confidential inquiry</h3>
            <p>Four short questions. Please keep details general &mdash; this form is not a secure channel.</p>
            <form data-consult novalidate>
              <div class="field">
                <label for="name">Your name</label>
                <input type="text" id="name" name="name" autocomplete="name" required>
                <p class="field-err">Please enter your name.</p>
              </div>
              <div class="field-row">
                <div class="field">
                  <label for="contact">Phone or email</label>
                  <input type="text" id="contact" name="contact" inputmode="tel" autocomplete="tel" required>
                  <p class="field-err">Please add a phone number or email address.</p>
                </div>
                <div class="field">
                  <label for="method">Preferred contact</label>
                  <select id="method" name="method"><option>Phone call</option><option>Text message</option><option>Email</option></select>
                </div>
              </div>
              <div class="field">
                <label for="matter">What is this about?</label>
                <select id="matter" name="matter" required>
                  <option value="">Please choose one</option>
                  <option value="workers-compensation">Workers' Compensation</option>
                  <option value="personal-injury">Personal Injury</option>
                  <option value="automobile-accidents">Automobile Accident</option>
                  <option value="truck-accidents">Truck Accident</option>
                  <option value="wrongful-death">Wrongful Death</option>
                  <option value="social-security-disability">Social Security Disability</option>
                  <option value="workplace-discrimination">Workplace Discrimination</option>
                  <option value="workplace-harassment">Workplace Harassment</option>
                  <option value="criminal-defense">Criminal Defense</option>
                  <option value="family-law">Family Law</option>
                  <option value="juvenile-law">Juvenile Law</option>
                  <option value="estate">Estate Planning or Probate</option>
                  <option value="other">Something else / not sure</option>
                </select>
                <p class="field-err">Please choose the closest description.</p>
              </div>
              <div class="field">
                <label for="message">Briefly, what happened?
                  <span class="hint">Please do not include confidential medical, employment, criminal or family details.</span>
                </label>
                <textarea id="message" name="message" rows="3"></textarea>
              </div>
              <div class="consent">
                <input type="checkbox" id="consent" name="consent" required>
                <label for="consent">I understand that submitting this form does not create an attorney-client relationship and that this website does not provide legal advice.</label>
              </div>
              <button class="btn btn-primary btn-block" type="submit">Send My Request</button>
              <p class="form-disclaimer">Contacting The Coggin Firm through this website does not create an attorney-client relationship. Please do not send confidential information until a relationship has been established.</p>
            </form>
            <div class="form-success" role="status">
              <h3>Thank you &mdash; your request has been received.</h3>
              <p>Someone from the firm will follow up during regular office hours. If your matter is time-sensitive, please call (256) 485-0909.</p>
              <p style="margin-top:14px;font-size:14px;color:var(--muted)">Preview note: no message was actually sent. In the live build this routes to the firm's approved inbox or CRM.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
''' % {'phone': icon('phone', 20), 'mail': icon('mail', 20)}


ASIDE_CONSULT = f'''
      <div class="aside-card aside-mobile-first">
        <h3>Talk with us about your case</h3>
        <p>A short conversation is usually enough to tell you whether we can help.</p>
        <a class="btn btn-primary" href="#consultation">Request a Consultation</a>
        <a class="btn btn-outline" href="tel:+12564850909">{icon('phone',16)} (256) 485-0909</a>
      </div>'''


def aside_related(links, heading='Related Practice Areas'):
    items = ''.join(
        f'<li><a href="{h}">{t} {icon("arw",15,"arw")}</a></li>' for t, h in links)
    return f'''
      <div class="aside-card">
        <h3 style="margin-bottom:16px">{heading}</h3>
        <ul class="aside-list">{items}</ul>
      </div>'''


def faq(items, idprefix='faq'):
    out = ['<div class="faq">']
    for i, (q, a) in enumerate(items, 1):
        aid = f'{idprefix}-{i}'
        paras = ''.join(f'<p>{p}</p>' for p in a)
        out.append(
            f'<div class="faq-item">'
            f'<button class="faq-q" type="button" data-acc aria-expanded="false" aria-controls="{aid}">'
            f'<span>{q}</span>{icon("chev",20,"chev")}</button>'
            f'<div class="faq-a" id="{aid}">{paras}</div></div>')
    out.append('</div>')
    return ''.join(out)


# =====================================================================
# 1. PRACTICE AREA TEMPLATE — Workers' Compensation
# =====================================================================
wc_body = f'''
  {crumbs([('Home', 'index.html'), ("Practice Areas", 'index.html#practice-areas'), ("Workers' Compensation", None)])}

  <section class="page-hero">
    <div class="wrap">
      <div class="page-hero-grid">
        <div>
          <p class="eyebrow rv">Injuries &amp; Benefits</p>
          <h1 class="rv d1">Workers' Compensation</h1>
          <p class="lede rv d2">If you were hurt on the job in Alabama, the benefits you are owed are set by law &mdash; not by your employer's insurance carrier. We help injured workers claim what the system provides and push back when a claim is delayed, reduced or denied.</p>
          <p style="margin-top:28px"><a class="btn btn-primary" href="#consultation">Talk with an attorney</a></p>
        </div>
        <div class="hero-visual rv d2">
          <div class="frame">
            <div class="photo-ph">
              <svg class="mono" viewBox="0 0 64 64" style="color:var(--bronze)" aria-hidden="true"><use href="#i-mark"/></svg>
              <p>Photography placeholder &mdash; contextual image for this practice area</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="wrap">
    <div class="verify">
      <b>Template preview</b>
      This page is the working template for all twelve practice areas &mdash; the structure, sidebar behaviour and mobile ordering repeat exactly. Body copy here is illustrative and written to be legally conservative; every claim, deadline and procedural statement will be replaced with content The Coggin Firm writes or approves before launch.
    </div>
  </div>

  <div class="wrap">
    <div class="doc-grid">
      <div class="doc">
        <h2>How we can help</h2>
        <p>A workers' compensation claim looks simple on paper and rarely is. Reports get filed late or filed wrong. Treatment gets routed to a physician you did not choose. Checks arrive short, or stop. And the person on the other end of the phone works for the carrier, not for you.</p>
        <p>Gina Coggin has spent her career on the injured worker's side of that process. She chairs the Alabama Association for Justice's workers' compensation section and has been recognised with the ALAJ Al Sansone Award for that work.</p>
        <ul class="ticks">
          <li>{TICK}<span>Getting the injury reported and documented properly from the start</span></li>
          <li>{TICK}<span>Dealing with the insurance adjuster so you do not have to</span></li>
          <li>{TICK}<span>Addressing disputes over medical treatment and authorised physicians</span></li>
          <li>{TICK}<span>Handling denied, delayed or underpaid claims</span></li>
          <li>{TICK}<span>Evaluating whether a third party outside your employer also bears responsibility</span></li>
          <li>{TICK}<span>Explaining how a workers' compensation claim interacts with Social Security Disability</span></li>
        </ul>

        <h2>Common situations we hear about</h2>
        <ul class="ticks">
          <li>{TICK}<span>&ldquo;My employer told me not to file &mdash; they said they would just take care of it.&rdquo;</span></li>
          <li>{TICK}<span>&ldquo;The doctor released me to full duty, but I still cannot do my job.&rdquo;</span></li>
          <li>{TICK}<span>&ldquo;My checks stopped and nobody will tell me why.&rdquo;</span></li>
          <li>{TICK}<span>&ldquo;They are saying my back problem is pre-existing.&rdquo;</span></li>
          <li>{TICK}<span>&ldquo;I got hurt on the road driving for work.&rdquo;</span></li>
          <li>{TICK}<span>&ldquo;I was let go not long after I reported my injury.&rdquo;</span></li>
        </ul>

        <h2>What to do next</h2>
        <ol class="numbered">
          <li>Report the injury to your employer and make sure it is written down. Alabama law sets deadlines for reporting a workplace injury and for bringing a claim, and they are shorter than most people expect.</li>
          <li>Get medical attention and tell the provider the injury happened at work.</li>
          <li>Keep your own copies &mdash; accident reports, work restrictions, correspondence from the carrier, and a note of who you spoke with and when.</li>
          <li>Call before you sign anything. Settlements, releases and recorded statements are much harder to undo than to review.</li>
        </ol>

        <h2>Frequently asked questions</h2>
        {faq([
            ("Will filing a claim cost me my job?",
             ["Alabama law prohibits retaliating against an employee for filing a workers' compensation claim. If you believe something has changed at work because you reported an injury, that is worth telling us about &mdash; it may be a separate matter in its own right."]),
            ("Do I have to use the company doctor?",
             ["Workers' compensation in Alabama has specific rules about which physician treats you and when you may change. Those rules are one of the most common sources of dispute in a claim, and one of the first things we look at."]),
            ("How long do I have to bring a claim?",
             ["There are deadlines both for notifying your employer and for filing a claim, and missing either can end a case that would otherwise have been valid. Because those deadlines depend on the facts, the safest step is to call and ask early rather than wait."]),
            ("What does it cost to talk to you?",
             ["An initial consultation about a workers' compensation matter is free. Attorney fees in Alabama workers' compensation cases are set and approved under state law, and we will explain in plain terms what that means for your case before you decide anything."]),
            ("Can I receive workers' compensation and Social Security Disability?",
             ["Sometimes, though the two interact in ways that can affect what you receive. Because we handle both, we can look at them together rather than one at a time."]),
        ], 'faq-wc')}

        <h2 style="margin-top:52px">The attorney who handles these matters</h2>
        <article class="atty-card" style="max-width:620px">
          <div class="atty-body">
            <h3>Gina D. Coggin</h3>
            <p class="atty-role">Managing Partner</p>
            <p>Former Etowah County Assistant District Attorney; now represents injured workers and employees across Alabama. Chair of the ALAJ workers' compensation section.</p>
            <a class="link-gold" href="gina-coggin.html">View full profile {ARW}</a>
          </div>
        </article>

        <h2>Related practice areas</h2>
        <div class="rel-grid">
          <a class="rel-card" href="workers-compensation.html"><b>Social Security Disability</b><small>When an injury keeps you out of work long-term.</small></a>
          <a class="rel-card" href="workers-compensation.html"><b>Personal Injury</b><small>When someone outside your employer is responsible.</small></a>
          <a class="rel-card" href="workers-compensation.html"><b>Workplace Discrimination</b><small>When how you were treated is its own issue.</small></a>
        </div>
      </div>

      <aside class="aside">
        {ASIDE_CONSULT}
        {aside_related([
            ("Personal Injury", "workers-compensation.html"),
            ("Automobile Accidents", "workers-compensation.html"),
            ("Truck Accidents", "workers-compensation.html"),
            ("Wrongful Death", "workers-compensation.html"),
            ("Social Security Disability", "workers-compensation.html"),
        ], 'More in Injuries &amp; Benefits')}
        <div class="aside-card">
          <h3 style="margin-bottom:14px">Our offices</h3>
          <div class="office-meta">
            <div>{icon('pin')}<span><b>Gadsden</b><br>222 S. 8th Street<br><a href="tel:+12564850909">(256) 485-0909</a></span></div>
            <div>{icon('pin')}<span><b>Centre</b><br>104 Northwood Drive<br><a href="tel:+12569279090">(256) 927-9090</a></span></div>
          </div>
        </div>
      </aside>
    </div>
  </div>
{CONSULT_SECTION}'''

open('workers-compensation.html', 'w').write(page(
    "Workers' Compensation Attorney | The Coggin Firm — Gadsden & Centre, AL | Concept Redesign",
    "Concept redesign preview. Workers' compensation representation for injured workers in Gadsden, Centre and Northeast Alabama.",
    'practice', wc_body))


# =====================================================================
# 2. ATTORNEY PROFILE TEMPLATE
# =====================================================================
def attorney_page(slug, name, role, title, desc, intro, focus, timeline,
                  education, admissions, awards, community, quote, related, other):
    focus_html = ''.join(f'<span>{f}</span>' for f in focus)
    tl = ''.join(
        f'<li><span>{when}</span><b>{what}</b><p>{detail}</p></li>' for when, what, detail in timeline)
    ed = ''.join(f'<li>{TICK}<span>{e}</span></li>' for e in education)
    ad = ''.join(f'<li>{TICK}<span>{a}</span></li>' for a in admissions)
    aw = ''.join(f'<li>{TICK}<span>{a}</span></li>' for a in awards)
    rel = ''.join(f'<li><a href="{h}">{t} {icon("arw",15,"arw")}</a></li>' for t, h in related)
    body = f'''
  {crumbs([('Home', 'index.html'), ('Attorneys', 'gina-coggin.html'), (name, None)])}

  <div class="wrap" style="padding-top:8px;padding-bottom:clamp(48px,5.5vw,80px)">
    <div class="profile-grid">
      <div class="profile-photo rv">
        <div class="frame">
          <div class="photo-ph">
            <svg class="mono" viewBox="0 0 64 64" style="color:var(--bronze)" aria-hidden="true"><use href="#i-mark"/></svg>
            <p>Portrait placeholder &mdash; {name}</p>
          </div>
        </div>
        <div class="profile-side" style="margin-top:20px">
          {ASIDE_CONSULT}
          {aside_related(related, 'Practice Areas')}
        </div>
      </div>

      <div class="doc rv d1">
        <p class="eyebrow">{role}</p>
        <h1 style="margin:18px 0 14px">{name}</h1>
        <p class="lede" style="margin-bottom:28px">{intro}</p>
        <div class="atty-focus" style="margin-bottom:30px">{focus_html}</div>

        <blockquote class="pull">&ldquo;{quote}&rdquo;<cite>{name}</cite></blockquote>

        <h2>Experience</h2>
        <ul class="timeline">{tl}</ul>

        <h2>Education</h2>
        <ul class="ticks">{ed}</ul>

        <h2>Admissions &amp; professional service</h2>
        <ul class="ticks">{ad}</ul>

        <h2>Recognition</h2>
        <ul class="ticks">{aw}</ul>

        <h2>Outside the office</h2>
        <p>{community}</p>

        <div class="verify">
          <b>To confirm before launch</b>
          Every credential, date, title and award on this page is drawn from the firm's current website and must be re-confirmed by {name.split()[0]} before publication &mdash; including bar admissions, court admissions, current professional roles, and whether each award may be used in attorney advertising.
        </div>

        <h2>Also at the firm</h2>
        <div class="rel-grid" style="grid-template-columns:1fr">
          <a class="rel-card" href="{other[1]}"><b>{other[0]}</b><small>{other[2]}</small></a>
        </div>
      </div>
    </div>
  </div>
{CONSULT_SECTION}'''
    open(f'{slug}.html', 'w').write(page(title, desc, 'attorneys', body))


attorney_page(
    'john-coggin', 'John D. Coggin', 'Senior Partner',
    'John D. Coggin, Senior Partner | The Coggin Firm — Gadsden & Centre, AL | Concept Redesign',
    'Concept redesign preview. John D. Coggin, Senior Partner at The Coggin Firm and former District Court Judge.',
    'John Coggin has spent fifty years in Northeast Alabama courtrooms &mdash; first as a lawyer in Centre, then as a municipal judge, then for fifteen years as a District Court Judge, and now in private practice alongside his daughter.',
    ['Family Law', 'Juvenile Law', 'Criminal Defense', 'Estate Matters'],
    [('1975', 'Began practising law in Centre, Alabama',
      'Opened a private practice in Cherokee County after graduating from Cumberland School of Law.'),
     ('1970s&ndash;1982', 'Municipal Judge, Centre and Cedar Bluff',
      'Served as municipal judge for both cities while continuing in private practice.'),
     ('December 1982&ndash;1997', 'District Court Judge',
      'Appointed to the district court bench, where he presided over thousands of family, criminal and juvenile matters across fifteen years.'),
     ('Since 1997', 'Private practice, The Coggin Firm',
      'Returned to representing clients directly, now practising with Gina Coggin from the firm’s Gadsden and Centre offices.')],
    ['Cumberland School of Law, Birmingham &mdash; J.D., 1975',
     'Jacksonville State University'],
    ['Admitted to practise in Alabama',
     'Past President, Juvenile and Family Court Judges Association'],
    ['Fifteen years of judicial service on the district court bench'],
    'John lives in Centre with his family. He has three granddaughters. Asked why he came back to practice after fifteen years as a judge, his answer is short: he likes the work.',
    'I love helping people.',
    [('Family Law', 'workers-compensation.html'),
     ('Juvenile Law', 'workers-compensation.html'),
     ('Criminal Defense', 'workers-compensation.html'),
     ('Estate Planning &amp; Probate', 'workers-compensation.html')],
    ('Gina D. Coggin, Managing Partner', 'gina-coggin.html',
     'Workers’ compensation, workplace rights and personal injury.'))

attorney_page(
    'gina-coggin', 'Gina D. Coggin', 'Managing Partner',
    'Gina D. Coggin, Managing Partner | The Coggin Firm — Gadsden & Centre, AL | Concept Redesign',
    'Concept redesign preview. Gina D. Coggin, Managing Partner at The Coggin Firm, representing injured workers and employees in Alabama.',
    'Gina Coggin began her career prosecuting some of the hardest cases Etowah County sees. She now spends it on the other side of the courtroom, representing injured workers and employees against the insurers and employers who would rather they went away.',
    ["Workers' Compensation", 'Workplace Discrimination', 'Workplace Harassment', 'Personal Injury', 'Social Security Disability'],
    [('Law school', 'Cumberland School of Law',
      'Competed on the National Trial Team, took part in Moot Court, and helped found the school&rsquo;s Negotiation Team.'),
     ('Early career', 'Etowah County Assistant District Attorney',
      'Prosecuted criminal matters and directed a pilot program dedicated to the prosecution of child sex crimes.'),
     ('Since', 'Plaintiff-side practice, The Coggin Firm',
      'Moved to representing individuals &mdash; concentrating on workers&rsquo; compensation, employment discrimination and injury matters.'),
     ('Current', 'Chair, ALAJ Workers&rsquo; Compensation Section',
      'Chairs the workers&rsquo; compensation section of the Alabama Association for Justice and takes part in legislative advocacy on behalf of injured workers.')],
    ['Cumberland School of Law &mdash; J.D.',
     'The University of Alabama'],
    ['Admitted to practise in Alabama',
     'Chair, Workers&rsquo; Compensation Section &mdash; Alabama Association for Justice',
     'Legislative advocacy on behalf of injured workers'],
    ['Recipient, ALAJ Al Sansone Award'],
    'Gina practises in the counties where she grew up, in the firm her father built. She describes the work in terms that have nothing to do with law: &ldquo;I know that I am serving the greater good and the Lord in my practice.&rdquo;',
    'I know that I am serving the greater good and the Lord in my practice.',
    [("Workers&rsquo; Compensation", 'workers-compensation.html'),
     ('Workplace Discrimination', 'workers-compensation.html'),
     ('Workplace Harassment', 'workers-compensation.html'),
     ('Personal Injury', 'workers-compensation.html'),
     ('Social Security Disability', 'workers-compensation.html')],
    ('John D. Coggin, Senior Partner', 'john-coggin.html',
     'Family law, juvenile law, criminal defense and estate matters.'))

print('built: workers-compensation.html, john-coggin.html, gina-coggin.html')


# =====================================================================
# 3. CONTACT / LOCATIONS / RESOURCES
# =====================================================================
def office_card(city, county, addr1, addr2, tel_href, tel, fax, maps):
    return f'''
        <article class="office rv">
          <div class="map-ph"><span>Map &mdash; {city}</span></div>
          <div class="office-body">
            <h3>{city}</h3>
            <p class="office-tag">{county}</p>
            <div class="office-meta">
              <div>{icon('pin')}<span>{addr1}<br>{addr2}</span></div>
              <div>{icon('phone')}<span><a href="tel:{tel_href}">{tel}</a><br><span class="muted" style="font-size:15px">Fax {fax}</span></span></div>
              <div>{icon('clock')}<span>Monday&ndash;Friday, 8:00&nbsp;AM &ndash; 5:00&nbsp;PM</span></div>
            </div>
            <div class="office-actions">
              <a class="btn btn-outline" href="{maps}" target="_blank" rel="noopener">Get Directions</a>
              <a class="btn btn-primary" href="tel:{tel_href}">Call This Office</a>
            </div>
          </div>
        </article>'''


contact_body = f'''
  {crumbs([('Home', 'index.html'), ('Contact', None)])}

  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow rv">Contact The Coggin Firm</p>
      <h1 class="rv d1">Two offices, and a real person on the other end.</h1>
      <p class="lede rv d2">Call either office during business hours, or send a short inquiry and we will get back to you. If your matter is time-sensitive, calling is always faster.</p>
    </div>
  </section>

  <section class="section" id="locations" style="padding-top:clamp(48px,5.5vw,76px)">
    <div class="wrap">
      <div class="offices">
        {office_card('Gadsden', 'Etowah County', '222 S. 8th Street', 'Gadsden, AL 35901',
                     '+12564850909', '(256) 485-0909', '(256) 485-0901',
                     'https://maps.google.com/?q=222+S+8th+Street+Gadsden+AL+35901')}
        {office_card('Centre', 'Cherokee County', '104 Northwood Drive', 'Centre, AL 35960',
                     '+12569279090', '(256) 927-9090', '(256) 927-9089',
                     'https://maps.google.com/?q=104+Northwood+Drive+Centre+AL+35960')}
      </div>

      <div id="hours" class="verify" style="margin-top:34px">
        <b>To confirm before launch</b>
        Office hours shown here (Monday&ndash;Friday, 8:00&nbsp;AM &ndash; 5:00&nbsp;PM) come from third-party business directories rather than the firm&rsquo;s own site, and should be confirmed &mdash; along with whether either office keeps different hours, closes for lunch, or sees clients by appointment only.
      </div>
    </div>
  </section>

  <!-- ================= firm story ================= -->
  <section class="section" id="story" style="background:var(--surface);border-block:1px solid var(--line)">
    <div class="wrap">
      <div class="story-grid">
        <div class="rv">
          <div class="frame">
            <div class="photo-ph">
              <svg class="mono" viewBox="0 0 64 64" style="color:var(--bronze)" aria-hidden="true"><use href="#i-mark"/></svg>
              <p>Photography placeholder &mdash; John and Gina Coggin</p>
            </div>
          </div>
        </div>
        <div class="rv d2 doc">
          <p class="eyebrow">About the Firm</p>
          <h2 style="margin:18px 0 20px">Fifty years of Northeast Alabama, in one family.</h2>
          <p>The Coggin Firm is a two-attorney practice with offices in Gadsden and Centre. Between them, John and Gina Coggin have spent more than fifty years in the courts of Etowah and Cherokee counties &mdash; as a judge, as a prosecutor, and as advocates for people going through the hardest stretch of their lives.</p>
          <p>John began practising in Centre in 1975, served as municipal judge for Centre and Cedar Bluff, and spent fifteen years as a District Court Judge before returning to private practice. Gina came through Cumberland School of Law and the Etowah County District Attorney&rsquo;s office before turning to represent injured workers and employees.</p>
          <blockquote class="pull">&ldquo;We listen. We understand. We make a difference.&rdquo;<cite>The Coggin Firm, LLC</cite></blockquote>
          <p>That sentence has been on the firm&rsquo;s door for years. It is also, roughly, the intake process: someone calls, someone listens, and then there is a plan.</p>
          <p style="margin-top:24px">
            <a class="link-gold" href="john-coggin.html">John D. Coggin {ARW}</a>
            &nbsp;&nbsp;&nbsp;
            <a class="link-gold" href="gina-coggin.html">Gina D. Coggin {ARW}</a>
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= resources / FAQ ================= -->
  <section class="section" id="faq">
    <div class="wrap-narrow">
      <div class="section-head rv" style="max-width:none">
        <p class="eyebrow">Resources</p>
        <h2>What to expect when you contact us</h2>
        <p class="lede">The questions people ask most often before they call.</p>
      </div>
      <div class="rv">
      {faq([
          ("What happens when I call?",
           ["You will speak with someone at the firm who will take down the basics &mdash; what happened, when, and how to reach you. If it is something we handle, we will arrange a time to talk it through properly.",
            "You do not need paperwork, and you do not need to know what kind of case it is. That is our job."]),
          ("Do I have to pay for the first conversation?",
           ["Initial consultations are free for qualifying matters. When you call, ask &mdash; we will tell you plainly before you come in.",
            "Fee arrangements differ by matter type and are always put in writing before any representation begins."]),
          ("Which office should I go to?",
           ["Either. The Gadsden office is at 222 S. 8th Street, two blocks from the Etowah County courthouse; the Centre office is at 104 Northwood Drive in Cherokee County. Whichever is closer to you is fine."]),
          ("How quickly do I need to act?",
           ["Sooner is better. Nearly every kind of matter we handle &mdash; injury claims, workers&rsquo; compensation, disability appeals, employment complaints &mdash; has a deadline attached, and some of them are much shorter than people expect. A five-minute phone call early is worth more than a long one later."]),
          ("Can I send documents through this website?",
           ["Please do not. The inquiry form is not a secure channel and should only carry a general description of your situation. Once we have spoken and established a relationship, we will tell you how to send records securely."]),
          ("Will I be able to reach my attorney?",
           ["This is a two-attorney firm. The lawyer you meet with is the lawyer handling your matter, and you will be told who to call and how."]),
          ("Do you handle cases outside Etowah and Cherokee counties?",
           ["We regularly appear throughout Northeast Alabama. If your matter falls outside the areas we practise in, we will tell you that on the first call rather than the third."]),
      ], 'faq-general')}
      </div>

      <div class="verify">
        <b>To confirm before launch</b>
        These answers are drafted from the plan and from the firm&rsquo;s public information. Before publication the firm should confirm each one &mdash; in particular the free-consultation policy per matter type, who answers the phone and when, and the counties in which the firm currently accepts work.
      </div>
    </div>
  </section>

{CONSULT_SECTION}

  <!-- ================= legal ================= -->
  <section class="section" style="background:var(--surface);border-top:1px solid var(--line)">
    <div class="wrap-narrow doc">
      <div id="disclaimer">
        <p class="eyebrow">Legal</p>
        <h2 style="margin-top:18px">Website Disclaimer</h2>
        <p>The information on this website is provided for general informational purposes only and does not constitute legal advice. No attorney-client relationship is created by viewing this site, by sending an inquiry through it, or by any communication that precedes a signed engagement.</p>
        <p>No representation is made that the quality of the legal services to be performed is greater than the quality of legal services performed by other lawyers. Prior results do not guarantee a similar outcome. Contingency-fee arrangements are available only in qualifying matters, and any fee arrangement is agreed in writing before representation begins.</p>
      </div>

      <div id="privacy">
        <h2>Privacy Policy</h2>
        <p>Information submitted through this website is used solely to respond to your inquiry and is not sold or shared for marketing purposes. The site records standard analytics about how pages are used; it does not collect case documents or sensitive personal records through the general inquiry form.</p>
      </div>

      <div id="accessibility">
        <h2>Accessibility Statement</h2>
        <p>This site is built to meet WCAG 2.2 Level AA: full keyboard operation with visible focus, correct heading order and landmarks, labelled form fields with in-context error messages, colour contrast that never carries meaning by colour alone, and respect for the operating system&rsquo;s reduced-motion setting. There are no auto-advancing sliders or auto-playing media anywhere on the site.</p>
        <p>If you encounter a barrier using this website, please call (256)&nbsp;485-0909 and we will help you directly and correct the problem.</p>
      </div>

      <div class="verify">
        <b>To confirm before launch</b>
        The disclaimer, privacy and accessibility text above is standard scaffolding and must be reviewed and approved by the firm &mdash; including any attorney-advertising language the Alabama State Bar requires and the firm&rsquo;s actual data-handling practices.
      </div>
    </div>
  </section>
'''

open('contact.html', 'w').write(page(
    'Contact The Coggin Firm | Gadsden & Centre, Alabama | Concept Redesign',
    "Concept redesign preview. Contact The Coggin Firm's Gadsden and Centre, Alabama offices.",
    'contact', contact_body))

print('built: contact.html')
