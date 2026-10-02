#!/usr/bin/env python3
"""Pitch email to The Son of a Butcher, in the Williams Digital house template.

Writes two versions from one source:
  index.html  paste-ready: real screenshots + a "Copy email" button (Gmail keeps images when pasted)
  draft.html  draft-safe: same email minus <img> (the Gmail connector strips images), for create_draft
Table + bgcolor markup throughout, because Gmail drafts drop `background:` shorthand.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = 'https://williamsdigital.io/preview/son-of-a-butcher/email/img/'
SITE = 'https://williamsdigital.io/preview/son-of-a-butcher/'
JOURNAL = SITE + 'journal/'

INDIGO, INK, BODY, MUTE = '#6366f1', '#070710', '#333d47', '#6b7280'
P = f'margin:0 0 16px'

def para(html, m='0 0 16px'):
    return f'<p style="margin:{m}">{html}</p>'

def label(text):
    return f'<div style="font-size:11px;font-weight:bold;letter-spacing:1.5px;color:{INDIGO};margin:0 0 8px">{text}</div>'

def h2(text):
    return f'<div style="font-size:20px;font-weight:bold;color:{INK};margin:30px 0 12px;line-height:1.3">{text}</div>'

def link(url, text):
    return f'<a href="{url}" style="color:{INDIGO};font-weight:bold;text-decoration:none">{text}</a>'

NUM = {'hero':'TOP LEFT','team':'TOP RIGHT','journal':'BOTTOM LEFT','phones':'BOTTOM RIGHT'}

def shot(img, caption, url, with_images):
    """A screenshot with its caption. In the draft version the image is replaced by a live link."""
    if with_images:
        return f'''<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 22px">
<tr><td><a href="{url}" style="text-decoration:none"><img src="{IMG}{img}.jpg" width="576" alt="{caption}" style="display:block;width:100%;max-width:576px;height:auto;border:1px solid #e5e7eb;border-radius:8px"></a></td></tr>
<tr><td style="font-size:12.5px;color:{MUTE};padding-top:8px;line-height:1.5">{caption}</td></tr></table>'''
    n = NUM.get(img)
    tag = f'<span style="font-size:11px;font-weight:bold;letter-spacing:1.5px;color:{INDIGO}">SCREENSHOT BELOW · {n}</span><br>' if n else ''
    return f'''<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 20px">
<tr><td bgcolor="#f7f7fb" style="background-color:#f7f7fb;border:1px solid #e5e7eb;border-left:4px solid {INDIGO};border-radius:8px;padding:14px 18px;font-size:13.5px;color:{BODY};line-height:1.5">{tag}{caption}<br>{link(url, 'See it live →')}</td></tr></table>'''

def button(url, text):
    return f'''<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 24px"><tr>
<td bgcolor="{INDIGO}" style="background-color:{INDIGO};border-radius:6px"><a href="{url}" style="display:inline-block;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;padding:13px 28px;border-radius:6px">{text}</a></td></tr></table>'''

ROWS = [
    ('First impression', 'A standard restaurant template: a tagline over a photo, then gift-card and newsletter banners and three “Learn more” boxes.',
     'An editorial storefront built on your own brand — Butch’s portrait, your photography, and “Quality provisions for the common cook” front and center.'),
    ('Hours', 'Open status sits in the footer; the full hours are a click away on the Contact page.',
     'A live “Open now · till 6:30pm” in the header on every page, with today highlighted in the hours list.'),
    ('The counters', 'One long Products page of paragraphs and lists.',
     'Meat, Seafood and Cheese &amp; Specialty as tabbed menus that name the producers you buy from.'),
    ('Your people', 'Staff picks sit at the bottom of the About page.',
     '“Ask the Counter”: tap Addam, Will, Rachel or anyone else and see their three favorite things in the shop.'),
    ('Sammies', 'A short paragraph on the Products page.',
     'Their own menu board, with a status that flips to “On the counter now” at 11 (9 on Saturdays).'),
    ('Press &amp; news', 'A row of small outlet logos.',
     'A Journal for shop news, stories from the counter and every article written about you — somewhere for Emily’s content to live and for Google to find.'),
    ('Shipping', 'A “Buy Online” link that leaves the site.',
     'The Direct boxes, photographed and priced, right on the homepage.'),
    ('On a phone', 'A single “Order Now” button; hours, directions and products are behind the menu.',
     'A Call · Directions · Order bar under your thumb, open status up top, and swipeable counters, team and boxes.'),
]

def compare_table():
    out = [f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:4px 0 22px;font-size:13.5px;line-height:1.5">',
           f'<tr><td style="padding:0 10px 8px 0;width:22%"></td>'
           f'<td style="padding:0 10px 8px 0;width:34%;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:{MUTE}">TODAY</td>'
           f'<td style="padding:0 0 8px 0;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:{INDIGO}">THE CONCEPT</td></tr>']
    for name, now, new in ROWS:
        out.append(f'<tr><td valign="top" style="border-top:1px solid #e5e7eb;padding:12px 10px 12px 0;font-weight:bold;color:{INK}">{name}</td>'
                   f'<td valign="top" style="border-top:1px solid #e5e7eb;padding:12px 10px 12px 0;color:{MUTE}">{now}</td>'
                   f'<td valign="top" style="border-top:1px solid #e5e7eb;padding:12px 0;color:{BODY}">{new}</td></tr>')
    out.append('</table>')
    return ''.join(out)

def email(with_images):
    s = lambda *a: shot(*a, with_images)
    body = ''.join([
        para('Hi Addam,'),
        para('Congratulations on Tasting Table naming The Son of a Butcher <b>the best butcher shop in Alabama</b> this summer. That’s a well-earned one.'),
        para('I’m Dylan Williams, a web designer here in Birmingham. The shop has something most places don’t: a real story, a brand people remember, and a team with opinions worth hearing. The website is still a standard Toast template, and it doesn’t do much of that justice. So rather than pitch you an idea, <b>I built one</b>, using your own photography, words and product lists.'),
        button(SITE, 'View the live concept →'),
        ('' if with_images else para('<i>A screenshot of the concept is at the bottom of this email.</i>', '0 0 16px')),
        s('hero', 'The homepage. Your logo turns in the gold seal, and the header shows whether you’re open right now.', SITE),

        h2('A quick tour'),
        para('<b>The counters.</b> Meat, Seafood and Cheese &amp; Specialty each get a tab, laid out like a menu with the farms and producers named. That is the “know the farmer, know the boat” story your customers already love.', '0 0 12px'),
        s('counters', 'The Counters: every producer you work with, one tap away.', SITE + '#counters'),
        para('<b>Ask the Counter.</b> Tap a face and see that person’s three favorite things in the shop. It’s the staff-picks content from your About page, turned into the part of the site people will actually play with.', '0 0 12px'),
        s('team', 'Ask the Counter, using the line portraits your team already has.', SITE + '#team'),
        para('<b>The Journal.</b> A home for shop news and stories from the counter, plus everything written about you: Tasting Table, Food &amp; Wine, The Birmingham News, Bham Now, Soul Grown and The Localist. I drafted four articles from facts you’ve already published, so it launches full.', '0 0 12px'),
        s('journal', 'The Journal, with news, counter stories, press and kitchen guides in one place.', JOURNAL),
        para('<b>Phones first.</b> Most people looking up a butcher are standing in their kitchen or sitting in the car. The concept was built for that, and tested on iPhone and Android.', '0 0 12px'),
        s('phones', 'On a phone: the hero, the sammies board with its live status, and Ask the Counter.', SITE),

        h2('How this improves on your current site'),
        s('before', 'Your current homepage, for reference.', 'https://thesonofabutcher.com/'),
        compare_table(),

        f'''<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px"><tr>
<td bgcolor="#f7f7fb" style="background-color:#f7f7fb;border:1px solid #e5e7eb;border-left:4px solid {INDIGO};border-radius:8px;padding:20px 22px">
{label('NOTHING CHANGES BEHIND THE COUNTER')}
<div style="font-size:14.5px;color:{BODY};line-height:1.6">Toast online ordering, gift cards, special-order requests, your Shopify Direct store, Eventbrite and the Mailchimp newsletter all stay exactly as they are. The new site links into each of them, so there’s nothing to migrate and nothing new for your team to learn.</div>
</td></tr></table>''',

        para('Would you be open to a 15-minute call this week? I’m also happy to come by the shop and walk you and Emily through it on a phone.'),
        button(SITE, 'View the live concept →'),
        para('Thanks, and congrats again!', '0 0 4px'),
        f'<p style="margin:0"><b>Dylan Williams</b><br><span style="color:{MUTE};font-size:13.5px">Williams Digital · {link("https://williamsdigital.io", "williamsdigital.io")} · (205) 789-1211</span></p>',
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
<tr><td style="text-align:center;color:#9ca3af;font-size:11.5px;padding:16px 8px 0">A website concept for The Son of a Butcher · built by Williams Digital, Birmingham AL</td></tr>
</table></td></tr></table>
</div>'''

PLAIN = f'''Hi Addam,

Congratulations on Tasting Table naming The Son of a Butcher the best butcher shop in Alabama this summer. That's a well-earned one.

I'm Dylan Williams, a web designer here in Birmingham. The shop has something most places don't: a real story, a brand people remember, and a team with opinions worth hearing. The website is still a standard Toast template, and it doesn't do much of that justice. So rather than pitch you an idea, I built one, using your own photography, words and product lists.

View the live concept: {SITE}
(A screenshot of the concept is at the bottom of this email.)

A QUICK TOUR
- The counters: Meat, Seafood and Cheese & Specialty as tabbed menus that name your producers.
- Ask the Counter: tap a team member and see their three favorite things in the shop.
- The Journal: shop news, counter stories and all your press in one place ({JOURNAL}).
- Phones first: built and tested for iPhone and Android, with a Call / Directions / Order bar.

HOW THIS IMPROVES ON YOUR CURRENT SITE
''' + '\n'.join(f'- {n.replace("&amp;", "&")}: today, {a[0].lower() + a[1:]} In the concept: {b.replace("&amp;", "&")}' for n, a, b in [(r[0], r[1], r[2]) for r in ROWS]).replace('’', "'").replace('“', '"').replace('”', '"') + f'''

NOTHING CHANGES BEHIND THE COUNTER
Toast online ordering, gift cards, special orders, your Shopify Direct store, Eventbrite and Mailchimp all stay exactly as they are. The new site links into each of them.

Would you be open to a 15-minute call this week? I'm also happy to come by the shop and walk you and Emily through it on a phone.

Thanks, and congrats again!

Dylan Williams
Williams Digital · (205) 789-1211
'''

PASTE_PAGE = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Email — The Son of a Butcher pitch</title>
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
