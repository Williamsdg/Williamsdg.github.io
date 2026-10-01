#!/usr/bin/env python3
"""Pitch email to Simply Infused Olive Oil Shop, in the Williams Digital house template.

Writes three files from one source:
  index.html  paste-ready: real screenshots + a "Copy email" button (Gmail keeps images when pasted)
  draft.html  draft-safe: same email minus <img> (the Gmail connector strips images), for create_draft
  plain.txt   plain-text alternative
Table + bgcolor markup throughout, because Gmail drafts drop `background:` shorthand.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = 'https://williamsdigital.io/preview/simply-infused/'
IMG = SITE + 'email/img/'
NOW = 'https://www.simply-infused.com/'

INDIGO, INK, BODY, MUTE = '#6366f1', '#070710', '#333d47', '#6b7280'

def para(html, m='0 0 16px'):
    return f'<p style="margin:{m}">{html}</p>'

def label(text):
    return f'<div style="font-size:11px;font-weight:bold;letter-spacing:1.5px;color:{INDIGO};margin:0 0 8px">{text}</div>'

def h2(text):
    return f'<div style="font-size:20px;font-weight:bold;color:{INK};margin:30px 0 12px;line-height:1.3">{text}</div>'

def link(url, text):
    return f'<a href="{url}" style="color:{INDIGO};font-weight:bold;text-decoration:none">{text}</a>'

DRAFT_LINKS = {'wall', 'finder', 'delivery'}  # shots that are worth a deep link when the image is gone

def shot(img, caption, url, with_images):
    """A screenshot with its caption. In the draft version it becomes a deep link, or is dropped."""
    if not with_images and img not in DRAFT_LINKS:
        return ''
    if with_images:
        return f'''<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 22px">
<tr><td><a href="{url}" style="text-decoration:none"><img src="{IMG}{img}.jpg" width="576" alt="{caption}" style="display:block;width:100%;max-width:576px;height:auto;border:1px solid #e5e7eb;border-radius:8px"></a></td></tr>
<tr><td style="font-size:12.5px;color:{MUTE};padding-top:8px;line-height:1.5">{caption}</td></tr></table>'''
    return f'''<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 20px">
<tr><td bgcolor="#f7f7fb" style="background-color:#f7f7fb;border:1px solid #e5e7eb;border-left:4px solid {INDIGO};border-radius:8px;padding:14px 18px;font-size:13.5px;color:{BODY};line-height:1.5">{caption}<br>{link(url, 'See it live →')}</td></tr></table>'''

def button(url, text):
    return f'''<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 24px"><tr>
<td bgcolor="{INDIGO}" style="background-color:{INDIGO};border-radius:6px"><a href="{url}" style="display:inline-block;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;padding:13px 28px;border-radius:6px">{text}</a></td></tr></table>'''

# (topic, the site today, the concept) — every "today" line was checked against the live site on 2026-09-30
ROWS = [
    ('First impression',
     'The logo, the menu and four category thumbnails. The welcome, the address and the hours are a paragraph further down.',
     'Your own bottles and “Infusing Life with Health &amp; Happiness” up top, with two clear next steps: shop, or find a pairing.'),
    ('Hours',
     '“Open Mon-Sat 10a-5p” appears once, in the middle of the welcome text.',
     'A live “Open now · until 5p” at the top of every screen, and today highlighted in the hours list.'),
    ('Shopping',
     'Four collection pages to click through. Each bottle opens a long page with the size in a dropdown.',
     'All 58 bottles on one “tasting wall”. Filter by shelf or by flavor (spicy, citrus, herb, fruit, sweet), and see all four sizes and prices in one tap.'),
    ('Pairings',
     'Your pairing suggestions are written as a paragraph on each product page.',
     'A Pairing Finder. Pick an oil, see the balsamics you recommend with it, and add both as $8.99 samples. It is built from your own notes on 53 bottles.'),
    ('Free delivery',
     'The weekly schedule is a list on the Locations page.',
     'Choose your neighborhood and see your delivery day and the next date. Today’s route shows on the homepage.'),
    ('4-pack Sampler',
     'Customers type the flavors they want into the order notes.',
     'They choose the four flavors from menus, and the choices arrive in your Shopify order notes automatically.'),
    ('Tasting socials',
     'Mentioned in one sentence at the bottom of the page.',
     'A proper invitation and a short request form in the Visit section.'),
    ('On a phone',
     'It fits the screen, but the logo and menu fill the first view and shopping starts a scroll later.',
     'A Call · Directions · Cart bar under the thumb, swipeable sections, and a two-column wall. Tested on iPhone and Android.'),
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
        para('Hi Cheryl,'),
        para('I’m Dylan Williams, a web designer here in Birmingham. Simply Infused has things most online shops would love to have: a real tasting room, pairing advice written for nearly every bottle, and a free delivery route that has been running since 2015.'),
        para('Your current website keeps most of that tucked away. So rather than pitch you an idea, <b>I built one</b>, using your own products, prices, photos and words.'),
        button(SITE, 'View the live concept →'),
        s('hero', 'The homepage, with your bottles and your tagline. The header shows whether the tasting room is open right now.', SITE),

        h2('A quick tour'),
        para('<b>The tasting wall.</b> Every oil and balsamic in your store on one page, sorted by shelf and by flavor. Tap a bottle for its sizes, prices, pairings and what to cook with it.', '0 0 12px'),
        s('wall', 'The tasting wall: all 58 bottles, with your bottle-label colors for each shelf.', SITE + '#shop'),
        para('<b>The Pairing Finder.</b> This is the advice you give at the tasting bar, turned into something people can play with. Pick Tuscan Herb and it shows the nine balsamics you pair it with, then adds the pair to the cart as samples.', '0 0 12px'),
        s('finder', 'The Pairing Finder, built from the suggestions already on your product pages.', SITE + '#pairing'),
        para('<b>Free delivery, by neighborhood.</b> A customer in Homewood picks Homewood and sees “Tuesdays”, with the next date. Your whole week is laid out beside it.', '0 0 12px'),
        s('delivery', 'The delivery route, with today marked and a neighborhood lookup.', SITE + '#delivery'),
        para('<b>Phones first.</b> Most people will find you on a phone, often from the car on 280. The concept was built for that and tested on iPhone and Android.', '0 0 12px'),
        s('phones', 'On a phone: the homepage, the tasting wall and a bottle’s detail sheet.', SITE),

        h2('How this improves on your current site'),
        s('phone-compare', 'The first screen on a phone. Your current site is on the left and the concept is on the right.', NOW),
        compare_table(),

        f'''<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px"><tr>
<td bgcolor="#f7f7fb" style="background-color:#f7f7fb;border:1px solid #e5e7eb;border-left:4px solid {INDIGO};border-radius:8px;padding:20px 22px">
{label('NOTHING CHANGES BEHIND THE COUNTER')}
<div style="font-size:14.5px;color:{BODY};line-height:1.6">Your Shopify store stays exactly as it is: the same products, inventory, orders and checkout. The concept already hands its cart to your real Shopify checkout, so you can add a bottle and see it arrive there. Your Mailchimp list stays too.</div>
</td></tr></table>''',

        para('Would you be open to a 15-minute call this week? I’m also happy to stop by the tasting room and walk you through it on a phone.'),
        button(SITE, 'View the live concept →'),
        para('Thank you,', '0 0 4px'),
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
<tr><td style="text-align:center;color:#9ca3af;font-size:11.5px;padding:16px 8px 0">A website concept for Simply Infused Olive Oil Shop · built by Williams Digital, Birmingham AL</td></tr>
</table></td></tr></table>
</div>'''

def plain_text(t):
    for a, b in (('&amp;', '&'), ('’', "'"), ('“', '"'), ('”', '"')):
        t = t.replace(a, b)
    return t

PLAIN = f'''Hi Cheryl,

I'm Dylan Williams, a web designer here in Birmingham. Simply Infused has things most online shops would love to have: a real tasting room, pairing advice written for nearly every bottle, and a free delivery route that has been running since 2015.

Your current website keeps most of that tucked away. So rather than pitch you an idea, I built one, using your own products, prices, photos and words.

View the live concept: {SITE}

A QUICK TOUR
- The tasting wall: all 58 bottles on one page, sorted by shelf and by flavor.
- The Pairing Finder: pick an oil, see the balsamics you pair it with, add both as samples.
- Free delivery, by neighborhood: pick your area, see your delivery day and the next date.
- Phones first: built and tested on iPhone and Android, with a Call / Directions / Cart bar.

HOW THIS IMPROVES ON YOUR CURRENT SITE
''' + '\n'.join(plain_text(f'- {n}. Today: {a} The concept: {b}') for n, a, b in ROWS) + '''

NOTHING CHANGES BEHIND THE COUNTER
Your Shopify store stays exactly as it is: the same products, inventory, orders and checkout. The concept already hands its cart to your real Shopify checkout. Your Mailchimp list stays too.

Would you be open to a 15-minute call this week? I'm also happy to stop by the tasting room and walk you through it on a phone.

Thank you,

Dylan Williams
Williams Digital · (205) 789-1211
'''

PASTE_PAGE = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Email — Simply Infused pitch</title>
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
print('ok', len(email(False)), 'chars in draft')
