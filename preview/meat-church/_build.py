#!/usr/bin/env python3
"""
Meat Church concept — page builder.

index.html is the source of truth for the shared chrome (head, concept ribbon,
header, footer). This pulls those blocks straight out of it and wraps each page
body, so the navigation and footer can never drift between pages.

    python3 _build.py
"""
import re, os, pathlib

HERE = pathlib.Path(__file__).parent
SRC = (HERE / 'index.html').read_text()

def block(start, end, text=SRC):
    i = text.index(start); j = text.index(end, i)
    return text[i:j]

RIBBON = block('<div class="concept">', '</div>\n\n<header') + '</div>'
HEADER = block('<header class="hdr">', '</header>') + '</header>'
FOOTER = block('<footer class="ftr">', '</footer>') + '</footer>'
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800;900'
         '&family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">')

PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="{desc}">
<link rel="icon" href="img/logo-ink.png">
{fonts}
<script>document.documentElement.className+=" js";</script>
<link rel="stylesheet" href="assets/site.css?v=1">
<style>
{css}
</style>
</head>
<body class="mc-revealed">

{ribbon}

{header}

{body}

{footer}

<script src="assets/data.js?v=1"></script>
<script src="assets/seasoning.js?v=1"></script>
<script>
{js}
</script>
</body>
</html>
"""

def emit(name, title, desc, css='', body='', js=''):
    nav_marked = HEADER
    out = PAGE.format(title=title, desc=desc, fonts=FONTS, css=css.strip(),
                      ribbon=RIBBON, header=nav_marked, body=body.strip(),
                      footer=FOOTER, js=js.strip())
    (HERE / name).write_text(out)
    print(f'  {name:16s} {len(out):>7,} bytes')

if __name__ == '__main__':
    import pages
    print('building Meat Church concept…')
    pages.build(emit)
    print('done.')
