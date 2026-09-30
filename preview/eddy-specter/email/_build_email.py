#!/usr/bin/env python3
"""Reply to Eddy Specter, in the Williams Digital house template.

Writes two versions from one source:
  index.html  paste-ready: real screenshots + a "Copy email" button (Gmail keeps images when pasted)
  draft.html  draft-safe: same email minus <img> (the Gmail connector strips images), for create_draft
Table + bgcolor markup throughout, because Gmail drafts drop `background:` shorthand.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = 'https://williamsdigital.io/preview/eddy-specter/email/img/'
SITE = 'https://williamsdigital.io/preview/eddy-specter/'
ADMIN = SITE + 'admin/'

INDIGO, INK, BODY, MUTE = '#6366f1', '#070710', '#333d47', '#6b7280'

def para(html, m='0 0 16px'):
    return f'<p style="margin:{m}">{html}</p>'

def label(text):
    return f'<div style="font-size:11px;font-weight:bold;letter-spacing:1.5px;color:{INDIGO};margin:0 0 8px">{text}</div>'

def section(tag, title):
    return (f'<div style="font-size:11px;font-weight:bold;letter-spacing:1.5px;color:{INDIGO};margin:34px 0 6px">{tag}</div>'
            f'<div style="font-size:21px;font-weight:bold;color:{INK};margin:0 0 12px;line-height:1.3">{title}</div>')

def link(url, text):
    return f'<a href="{url}" style="color:{INDIGO};font-weight:bold;text-decoration:none">{text}</a>'

def bullets(items):
    rows = ''.join(f'<tr><td valign="top" style="width:18px;color:{INDIGO};font-weight:bold;padding:0 0 10px">•</td>'
                   f'<td style="padding:0 0 10px;color:{BODY};line-height:1.55">{t}</td></tr>' for t in items)
    return f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:2px 0 14px;font-size:14.5px">{rows}</table>'

def shot(img, caption, url, with_images):
    """A screenshot with its caption. In the draft version the image becomes a live link."""
    if with_images:
        return f'''<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 22px">
<tr><td><a href="{url}" style="text-decoration:none"><img src="{IMG}{img}.jpg" width="576" alt="{caption}" style="display:block;width:100%;max-width:576px;height:auto;border:1px solid #e5e7eb;border-radius:8px"></a></td></tr>
<tr><td style="font-size:12.5px;color:{MUTE};padding-top:8px;line-height:1.5">{caption}</td></tr></table>'''
    return f'''<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 20px">
<tr><td bgcolor="#f7f7fb" style="background-color:#f7f7fb;border:1px solid #e5e7eb;border-left:4px solid {INDIGO};border-radius:8px;padding:14px 18px;font-size:13.5px;color:{BODY};line-height:1.5">{caption}<br>{link(url, 'See it live →')}</td></tr></table>'''

def button(url, text):
    return f'''<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 24px"><tr>
<td bgcolor="{INDIGO}" style="background-color:{INDIGO};border-radius:6px"><a href="{url}" style="display:inline-block;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;padding:13px 28px;border-radius:6px">{text}</a></td></tr></table>'''

def callout(lab, html):
    return f'''<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 22px"><tr>
<td bgcolor="#f7f7fb" style="background-color:#f7f7fb;border:1px solid #e5e7eb;border-left:4px solid {INDIGO};border-radius:8px;padding:20px 22px">
{label(lab)}<div style="font-size:14.5px;color:{BODY};line-height:1.6">{html}</div></td></tr></table>'''

SITE_POINTS = [
    '<b>A first impression built around you.</b> “Follow the Brown Coat,” with a lantern effect over your own storytelling photo and a live countdown to tonight’s 8 PM tour.',
    '<b>Everything a visitor needs at a glance.</b> Nightly at 8, 90 minutes, meet at Herb &amp; Smudge, adult and youth tickets, and what to bring.',
    '<b>Booking stays with FareHarbor.</b> Every “Book” button goes straight to your existing booking page, so nothing changes for you or your guests.',
    '<b>Four clear ways in.</b> The walking tour, paranormal investigations, psychic readings, and private and group tours each get their own spot instead of sharing one long page.',
    '<b>Your story and your evidence.</b> Island history (the 1894 Opera House and the 1900 Storm), a photo gallery, your YouTube videos, and a private-tour request form.',
    '<b>Made for phones.</b> Most people look up a ghost tour on the Strand from their phone, so there’s a Book and Call bar right under their thumb.',
]

DASH_POINTS = [
    '<b>Tonight at a glance.</b> The guest list with one-tap check-in, walk-ups, who’s guiding, and a pre-tour checklist.',
    '<b>One calendar.</b> Nightly tours, investigations and private bookings together, so you can see the whole month at once.',
    '<b>No more lost inquiries.</b> Every private or group request, from the website, a phone call or Facebook, lands in one place and moves from New to Booked.',
    '<b>Guides and hiring.</b> A weekly schedule that flags any night nobody is covering, plus job applicants in the same place.',
    '<b>More reviews.</b> A morning-after list of last night’s guests so every one of them gets asked for a review.',
    '<b>You control your website.</b> Post “Sold out tonight” or a special ghost hunt yourself, from your phone, in seconds.',
]

def email(with_images):
    s = lambda *a: shot(*a, with_images)
    body = ''.join([
        para('Hi Eddy,'),
        para('Evenings after 5 can be difficult on my end, since that’s generally when I’m on kid duty. Let me see if I can get something scheduled, and I’ll let you know.'),
        para('In the meantime, I went ahead and put together that free concept, using your own photos, videos and tour details. Here’s what I would recommend for your website. It comes in two parts: the <b>public site</b> that everyone sees, and an <b>admin dashboard</b> just for you and your team.'),

        section('PART 1 · THE PUBLIC WEBSITE', 'What your guests see'),
        s('site-hero', 'The homepage: “Follow the Brown Coat,” with a live countdown to tonight’s tour.', SITE),
        bullets(SITE_POINTS),
        s('site-cards', 'Four ways in, from a family-friendly stroll to a full paranormal investigation.', SITE + '#experiences'),
        s('phones-site', 'On a phone: the homepage, the tour details and the experiences.', SITE),
        button(SITE, 'View the website →'),

        section('PART 2 · THE ADMIN DASHBOARD', 'What you see behind the scenes'),
        para('This is where the website really starts working for you. It puts the whole business on one screen, and it works just as well on your phone on the Strand as it does on a computer.', '0 0 12px'),
        s('dash-tonight', 'Tonight: guest list and check-in, countdown, who’s on duty, and the pre-tour checklist.', ADMIN),
        bullets(DASH_POINTS),
        s('dash-requests', 'Private and group requests, from first contact to booked.', ADMIN + '#requests'),
        s('phones-dash', 'On a phone: tonight’s tour, the calendar, and posting a “sold out” banner to your website.', ADMIN),
        button(ADMIN, 'Try the dashboard →'),
        para(f'<span style="font-size:13.5px;color:{MUTE}">To look around, the passcode is <b style="color:{INK}">boo</b>. The guest names and numbers inside are samples; the tour times, meeting place and ticket types are yours.</span>', '0 0 20px'),

        callout('WORKS WITH HOW YOU GET PAID TODAY',
                'You already take bookings and payments through FareHarbor, and the dashboard can most likely be integrated with it, so bookings and guest lists flow in on their own and nothing changes for your customers. '
                'If you ever need a payment system, or would like to move to a different one (for example, deposits for private tours and investigations), I would recommend <b>Stripe</b>. It takes cards, Apple Pay and Google Pay, has simple pricing, and deposits straight to your bank account.'),

        para('Take a look when you have a minute, and let me know what you think. I’ll follow up with a time for our call.'),
        para('Talk soon,', '0 0 4px'),
        f'<p style="margin:0"><b>Dylan Williams</b><br><span style="color:{MUTE};font-size:13.5px">Williams Digital · Dylan@williamsdigital.io · (205) 789-1211</span></p>',
    ])
    return f'''<div style="margin:0;padding:0;background-color:#f4f4f7">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f7" style="background-color:#f4f4f7"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;font-family:Helvetica,Arial,sans-serif">
<tr><td bgcolor="{INK}" style="background-color:{INK};border-radius:10px 10px 0 0;padding:26px 32px">
<span style="display:inline-block;width:4px;height:26px;background-color:{INDIGO};vertical-align:middle;border-radius:2px"></span>
<span style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:2px;vertical-align:middle;padding-left:12px">WILLIAMS DIGITAL</span>
<div style="color:#9ca3af;font-size:11px;letter-spacing:1.5px;padding-left:16px;margin-top:4px">WEB DESIGN &amp; DEVELOPMENT · BIRMINGHAM, AL</div>
</td></tr>
<tr><td bgcolor="#ffffff" style="background-color:#ffffff;border-radius:0 0 10px 10px;padding:32px;color:{BODY};font-size:15px;line-height:1.65">
{body}
</td></tr>
<tr><td style="text-align:center;color:#9ca3af;font-size:11.5px;padding:16px 8px 0">A website concept for Eddy Specter’s Ghost Tours · built by Williams Digital, Birmingham AL</td></tr>
</table></td></tr></table>
</div>'''

def strip(h):
    import re, html
    return html.unescape(re.sub(r'<[^>]+>', '', h)).replace('’', "'").replace('“', '"').replace('”', '"')

PLAIN = ('Hi Eddy,\n\n'
 "Evenings after 5 can be difficult on my end, since that's generally when I'm on kid duty. Let me see if I can get something scheduled, and I'll let you know.\n\n"
 "In the meantime, I went ahead and put together that free concept, using your own photos, videos and tour details. Here's what I would recommend for your website. It comes in two parts: the public site that everyone sees, and an admin dashboard just for you and your team.\n\n"
 'PART 1 - THE PUBLIC WEBSITE\n' + '\n'.join('- ' + strip(p) for p in SITE_POINTS) + f'\nView the website: {SITE}\n\n'
 'PART 2 - THE ADMIN DASHBOARD\n' + '\n'.join('- ' + strip(p) for p in DASH_POINTS) + f'\nTry the dashboard: {ADMIN} (passcode: boo). The guest names and numbers inside are samples; the tour times, meeting place and ticket types are yours.\n\n'
 'WORKS WITH HOW YOU GET PAID TODAY\n'
 'You already take bookings and payments through FareHarbor, and the dashboard can most likely be integrated with it, so bookings and guest lists flow in on their own and nothing changes for your customers. '
 'If you ever need a payment system, or would like to move to a different one (for example, deposits for private tours and investigations), I would recommend Stripe. It takes cards, Apple Pay and Google Pay, has simple pricing, and deposits straight to your bank account.\n\n'
 "Take a look when you have a minute, and let me know what you think. I'll follow up with a time for our call.\n\n"
 'Talk soon,\n\nDylan Williams\nWilliams Digital · Dylan@williamsdigital.io · (205) 789-1211\n')

PASTE_PAGE = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Email — Eddy Specter reply</title>
<style>body{margin:0;background:#e9e9ef;font-family:Helvetica,Arial,sans-serif}
.bar{position:sticky;top:0;z-index:2;background:#070710;color:#fff;padding:12px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;font-size:14px}
.bar button{background:#6366f1;color:#fff;border:0;border-radius:6px;padding:10px 18px;font-weight:bold;font-size:14px;cursor:pointer}
.bar span{color:#9ca3af}</style></head><body>
<div class="bar"><button id="copy">Copy email</button><span id="msg">Copies the email below with its screenshots. Paste into the Gmail draft body (Cmd+V).</span></div>
<div id="email">''' + '{EMAIL}' + '''</div>
<script>
document.getElementById('copy').onclick=async()=>{const el=document.getElementById('email'),m=document.getElementById('msg');
try{await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([el.innerHTML],{type:'text/html'}),'text/plain':new Blob([el.innerText],{type:'text/plain'})})]);m.textContent='Copied ✓ — paste into the Gmail draft body.'}
catch(e){const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);document.execCommand('copy');s.removeAllRanges();m.textContent='Copied ✓ — paste into the Gmail draft body.'}};
</script></body></html>'''

open(os.path.join(HERE, 'index.html'), 'w').write(PASTE_PAGE.replace('{EMAIL}', email(True)))
open(os.path.join(HERE, 'draft.html'), 'w').write(email(False))
open(os.path.join(HERE, 'plain.txt'), 'w').write(PLAIN)
print('ok')
