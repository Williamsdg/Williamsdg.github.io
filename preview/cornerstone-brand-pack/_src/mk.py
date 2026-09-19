# -*- coding: utf-8 -*-
"""Cornerstone brand pack: outlined-vector logo lockups."""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

_HERE = os.path.dirname(os.path.abspath(__file__))
# fonts ship with the pack itself, so this source is self-contained
FDIR = os.path.join(_HERE, "..", "files", "fonts")
if not os.path.exists(os.path.join(FDIR, "Archivo-Variable.ttf")):
    FDIR = os.path.join(_HERE, "..", "fonts")
INK, RED, WHITE = "#242323", "#D91A3B", "#FFFFFF"

_cache = {}
def archivo(weight):
    if weight in _cache: return _cache[weight]
    f = TTFont(os.path.join(FDIR, "Archivo-Variable.ttf"))
    inst = instancer.instantiateVariableFont(f, {"wght": weight, "wdth": 100})
    _cache[weight] = inst
    return inst

def text_outline(font, text, size, tracking_em=0.0):
    """Return (svg path d, width, (ymin,ymax)) with the baseline at y=0, y down."""
    upem = font["head"].unitsPerEm
    sc = size / upem
    cmap, gs, hmtx = font.getBestCmap(), font.getGlyphSet(), font["hmtx"]
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}")
    bounds = BoundsPen(gs)
    x = 0.0
    for ch in text:
        gn = cmap.get(ord(ch))
        if gn is None:
            x += size * 0.35
            continue
        t = (sc, 0, 0, -sc, x, 0)
        gs[gn].draw(TransformPen(pen, t))
        gs[gn].draw(TransformPen(bounds, t))
        x += hmtx[gn][0] * sc + tracking_em * size
    if text and tracking_em:
        x -= tracking_em * size
    bb = bounds.bounds or (0, 0, x, 0)
    return pen.getCommands(), x, (bb[1], bb[3])

def cap_height(font, size):
    os2 = font["OS/2"]
    ch = getattr(os2, "sCapHeight", None) or font["head"].unitsPerEm * 0.72
    return ch * size / font["head"].unitsPerEm

MARK = '<path d="M8 8H56V56H33V31H8Z" fill="{ink}"/><rect x="8" y="34" width="22" height="22" fill="{red}"/>'

def svg(w, h, body, pad=0):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" '
            f'width="{w:.1f}" height="{h:.1f}" role="img">{body}</svg>')

def mark_svg(ink=INK, red=RED, size=64):
    return svg(size, size, f'<g transform="scale({size/64:.4f})">' + MARK.format(ink=ink, red=red) + '</g>')

def horizontal(ink=INK, red=RED, tagline=True, name_size=42):
    """Mark + CORNERSTONE (+ CLAIMS ADJUSTERS). Text outlined."""
    f8, f6 = archivo(800), archivo(600)
    nd, nw, _ = text_outline(f8, "CORNERSTONE", name_size, 0.005)
    cap = cap_height(f8, name_size)
    ts = name_size * 0.265
    td, tw, _ = text_outline(f6, "CLAIMS ADJUSTERS", ts, 0.2) if tagline else ("", 0, (0, 0))
    gap_v = name_size * 0.30
    text_h = cap + (gap_v + ts * 0.72 if tagline else 0)
    mark_s = text_h * 1.28
    gap_h = mark_s * 0.34
    pad = mark_s * 0.16
    top = pad
    my = top + (text_h - mark_s) / 2
    tx = pad + mark_s + gap_h
    base = top + cap
    body = (f'<g transform="translate({pad:.1f},{my:.1f}) scale({mark_s/64:.4f})">'
            + MARK.format(ink=ink, red=red) + '</g>'
            f'<path d="{nd}" fill="{ink}" transform="translate({tx:.1f},{base:.1f})"/>')
    if tagline:
        tb = base + gap_v + ts * 0.72
        body += f'<path d="{td}" fill="{ink}" opacity=".72" transform="translate({tx:.1f},{tb:.1f})"/>'
    w = tx + max(nw, tw) + pad
    h = top + text_h + pad
    return svg(w, h, body)

def stacked(ink=INK, red=RED, name_size=42):
    f8, f6 = archivo(800), archivo(600)
    nd, nw, _ = text_outline(f8, "CORNERSTONE", name_size, 0.005)
    cap = cap_height(f8, name_size)
    ts = name_size * 0.265
    td, tw, _ = text_outline(f6, "CLAIMS ADJUSTERS", ts, 0.2)
    mark_s = name_size * 1.75
    pad = name_size * 0.28
    w = max(nw, tw, mark_s) + pad * 2
    cx = w / 2
    gap1 = name_size * 0.45
    gap2 = name_size * 0.34
    my = pad
    base = my + mark_s + gap1 + cap
    tb = base + gap2 + ts * 0.72
    h = tb + pad
    body = (f'<g transform="translate({cx - mark_s/2:.1f},{my:.1f}) scale({mark_s/64:.4f})">'
            + MARK.format(ink=ink, red=red) + '</g>'
            f'<path d="{nd}" fill="{ink}" transform="translate({cx - nw/2:.1f},{base:.1f})"/>'
            f'<path d="{td}" fill="{ink}" opacity=".72" transform="translate({cx - tw/2:.1f},{tb:.1f})"/>')
    return svg(w, h, body)

import math
def arc_text(font, text, size, tracking_em, radius, cx, cy, top=True, fill=INK):
    """Glyphs outlined and set along a circle. top=True arcs over the top."""
    upem = font["head"].unitsPerEm; sc = size/upem
    cmap, gs, hmtx = font.getBestCmap(), font.getGlyphSet(), font["hmtx"]
    advs = []
    for ch in text:
        gn = cmap.get(ord(ch))
        advs.append((gn, (hmtx[gn][0]*sc if gn else size*0.35) + tracking_em*size))
    total = sum(a for _, a in advs)
    out = []
    run = -total/2
    for gn, adv in advs:
        mid = run + adv/2
        a = mid/radius                      # radians from the arc's centre point
        if top:
            px, py = cx + radius*math.sin(a), cy - radius*math.cos(a)
            rot = math.degrees(a)
        else:
            px, py = cx + radius*math.sin(a), cy + radius*math.cos(a)
            rot = -math.degrees(a)
        if gn:
            pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}")
            gs[gn].draw(TransformPen(pen, (sc, 0, 0, -sc, -adv/2 + tracking_em*size/2, 0)))
            d = pen.getCommands()
            if d:
                out.append(f'<g transform="translate({px:.2f},{py:.2f}) rotate({rot:.2f})">'
                           f'<path d="{d}" fill="{fill}"/></g>')
        run += adv
    return "".join(out)

def _arc_len(font, text, size, tracking_em):
    upem = font["head"].unitsPerEm; sc = size/upem
    cmap, hmtx = font.getBestCmap(), font["hmtx"]
    t = 0.0
    for ch in text:
        gn = cmap.get(ord(ch))
        t += (hmtx[gn][0]*sc if gn else size*0.35) + tracking_em*size
    return t - tracking_em*size

def fit_arc(font, text, radius, max_span_deg, size0, tracking_em):
    """Shrink until the text occupies no more than max_span_deg of the circle."""
    size = size0
    while size > 5:
        half = math.degrees((_arc_len(font, text, size, tracking_em)/2)/radius)
        if half*2 <= max_span_deg:
            return size, half*2
        size -= 0.25
    return size, math.degrees((_arc_len(font, text, size, tracking_em)/2)/radius)*2

def badge(ink=INK, red=RED, fg=WHITE, size=220, report=False):
    """Round field badge. Arc text is fitted so it never reaches the side diamonds."""
    f7, f6 = archivo(700), archivo(600)
    cx = cy = 110.0
    TOP_SPAN, BOT_SPAN = 162.0, 118.0     # degrees; diamonds sit at +/-90
    r_top, r_bot = 86.0, 92.0             # baselines: top grows outward, bottom inward
    s_top, span_top = fit_arc(f7, "CORNERSTONE CLAIMS ADJUSTERS", r_top, TOP_SPAN, 17.0, 0.06)
    s_bot, span_bot = fit_arc(f6, "EST. 2021 · PRATTVILLE, AL",   r_bot, BOT_SPAN, 15.0, 0.09)
    body  = f'<circle cx="{cx}" cy="{cy}" r="106" fill="{ink}"/>'
    body += f'<circle cx="{cx}" cy="{cy}" r="99" fill="none" stroke="{red}" stroke-width="2.5"/>'
    body += f'<circle cx="{cx}" cy="{cy}" r="72" fill="none" stroke="{fg}" stroke-width="1" opacity=".28"/>'
    body += arc_text(f7, "CORNERSTONE CLAIMS ADJUSTERS", s_top, 0.06, r_top, cx, cy, True,  fg)
    body += arc_text(f6, "EST. 2021 · PRATTVILLE, AL",   s_bot, 0.09, r_bot, cx, cy, False, fg)
    for sx in (-1, 1):                     # separator diamonds at 9 and 3 o'clock
        dx = cx + sx*87.5
        body += f'<path d="M{dx-4.5:.1f} {cy}L{dx} {cy-4.5}L{dx+4.5:.1f} {cy}L{dx} {cy+4.5}Z" fill="{red}"/>'
    m = 78.0
    body += (f'<g transform="translate({cx-m/2:.1f},{cy-m/2:.1f}) scale({m/64:.4f})">'
             + MARK.format(ink=fg, red=red) + '</g>')
    s = svg(220, 220, body)
    s = s.replace('width="220.0" height="220.0"', f'width="{size}" height="{size}"')
    if report:
        return s, dict(top_size=s_top, top_span=span_top, bot_size=s_bot, bot_span=span_bot,
                       top_gap=(180-span_top)/2, bot_gap=(180-span_bot)/2)
    return s

def badge_shell(ink=INK, red=RED, fg=WHITE):
    """The seal minus the centre mark, so a page can drop any mark inside."""
    full, _ = badge(ink, red, fg, report=True)
    i = full.index('<g transform="translate(71.0,71.0)')
    return full[:i], full[full.index("</svg>"):]
