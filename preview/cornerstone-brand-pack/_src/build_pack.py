# -*- coding: utf-8 -*-
import os, subprocess, shutil, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mk
from mk import INK, RED, WHITE, archivo, text_outline, svg, MARK

OUT  = os.path.expanduser("~/Williamsdg.github.io/preview/cornerstone-brand-pack")
F    = os.path.join(OUT, "files")
SVGD, PNGD, PDFD, FNT = (os.path.join(F, d) for d in ("svg", "png", "pdf", "fonts"))
for d in (SVGD, PNGD, PDFD, FNT): os.makedirs(d, exist_ok=True)
SRCF = mk.FDIR

def w(path, s):
    open(path, "w", encoding="utf-8").write(s); return path

def png(src, dst, width=None, height=None):
    cmd = ["rsvg-convert", "-f", "png", "-o", dst]
    if width:  cmd += ["-w", str(width)]
    if height: cmd += ["-h", str(height)]
    subprocess.run(cmd + [src], check=True)

def pdf(src, dst):
    subprocess.run(["rsvg-convert", "-f", "pdf", "-o", dst, src], check=True)

# ---------------------------------------------------------------- lockups
LOCKUPS = {
 # primary — with the Integrity · Experience · Results tagline
 "cornerstone-logo-horizontal":        mk.horizontal(INK,  RED),
 "cornerstone-logo-horizontal-white":  mk.horizontal(WHITE, RED),
 "cornerstone-logo-horizontal-black":  mk.horizontal(INK,  INK),
 "cornerstone-logo-stacked":           mk.stacked(INK,  RED),
 "cornerstone-logo-stacked-white":     mk.stacked(WHITE, RED),
 # without the tagline, for tight spaces
 "cornerstone-logo-simple":            mk.horizontal(INK,  RED, tagline=False),
 "cornerstone-logo-simple-white":      mk.horizontal(WHITE, RED, tagline=False),
 "cornerstone-logo-compact":           mk.horizontal(INK,  RED, tagline=False, sub=False),
 "cornerstone-logo-compact-white":     mk.horizontal(WHITE, RED, tagline=False, sub=False),
 # mark
 "cornerstone-mark":                   mk.mark_svg(INK,  RED, 512),
 "cornerstone-mark-white":             mk.mark_svg(WHITE, RED, 512),
 "cornerstone-mark-black":             mk.mark_svg(INK,  INK, 512),
 # seals — tagline version is primary, location version is the alternate
 "cornerstone-badge":                  mk.badge(INK, RED, WHITE, 1024),
 "cornerstone-badge-white":            mk.badge(WHITE, RED, INK, 1024),
 "cornerstone-badge-est":              mk.badge(INK, RED, WHITE, 1024, bottom="EST. 2021 · PRATTVILLE, AL"),
 "cornerstone-badge-est-white":        mk.badge(WHITE, RED, INK, 1024, bottom="EST. 2021 · PRATTVILLE, AL"),
}
for name, s in LOCKUPS.items():
    p = w(os.path.join(SVGD, name + ".svg"), s)
    pdf(p, os.path.join(PDFD, name + ".pdf"))

PNG_SIZES = {
 "cornerstone-logo-horizontal":       [600, 1200, 2400],
 "cornerstone-logo-horizontal-white": [600, 1200, 2400],
 "cornerstone-logo-stacked":          [800, 1600],
 "cornerstone-logo-stacked-white":    [800, 1600],
 "cornerstone-logo-simple":           [600, 1200],
 "cornerstone-logo-simple-white":     [600, 1200],
 "cornerstone-logo-compact":          [600, 1200],
 "cornerstone-logo-compact-white":    [600, 1200],
 "cornerstone-mark":                  [16, 32, 48, 64, 128, 180, 192, 256, 512, 1024],
 "cornerstone-mark-white":            [256, 512, 1024],
 "cornerstone-badge":                 [512, 1024, 2048],
 "cornerstone-badge-white":           [512, 1024],
 "cornerstone-badge-est":             [512, 1024, 2048],
 "cornerstone-badge-est-white":       [512, 1024],
}
for name, sizes in PNG_SIZES.items():
    for s in sizes:
        png(os.path.join(SVGD, name + ".svg"), os.path.join(PNGD, f"{name}-{s}.png"), width=s)

# ------------------------------------------------- ready-made pieces
def banner(wd, ht, label, strap=True, bg=INK):
    f8, f6 = archivo(800), archivo(600)
    ns = ht * 0.155
    nd, nw, _ = text_outline(f8, "CORNERSTONE", ns, 0.005)
    cap = mk.cap_height(f8, ns)
    ss = ns * 0.30
    sd, sw_, _ = text_outline(f6, "INDEPENDENT VEHICLE & EQUIPMENT APPRAISAL", ss, 0.16)
    ad, aw, _  = text_outline(f6, "ALABAMA · FLORIDA · GEORGIA · MISSISSIPPI · TENNESSEE", ss * .92, 0.16)
    ms = ht * 0.30
    total_h = ms
    cx, cy = wd/2, ht/2
    body = f'<rect width="{wd}" height="{ht}" fill="{bg}"/>'
    my = cy - total_h*0.95
    body += (f'<g transform="translate({cx - ms/2:.1f},{my:.1f}) scale({ms/64:.4f})">'
             + MARK.format(ink=WHITE, red=RED) + '</g>')
    base = my + ms + ht*0.115 + cap
    body += f'<path d="{nd}" fill="{WHITE}" transform="translate({cx - nw/2:.1f},{base:.1f})"/>'
    if strap:
        b2 = base + ht*0.085
        body += f'<path d="{sd}" fill="{WHITE}" opacity=".70" transform="translate({cx - sw_/2:.1f},{b2:.1f})"/>'
        rule_y = b2 + ht*0.042
        body += f'<rect x="{cx-18:.1f}" y="{rule_y:.1f}" width="36" height="3" fill="{RED}"/>'
        b3 = b2 + ht*0.115
        body += f'<path d="{ad}" fill="{RED}" transform="translate({cx - aw/2:.1f},{b3:.1f})"/>'
    return svg(wd, ht, body)

PIECES = {
 "linkedin-banner-1584x396":  banner(1584, 396, "LinkedIn"),
 "facebook-cover-820x312":    banner(820, 312, "Facebook"),
 "email-header-600x200":      banner(600, 200, "Email", strap=False),
}
for name, s in PIECES.items():
    p = w(os.path.join(SVGD, name + ".svg"), s)
    wd = int(name.split("-")[-1].split("x")[0])
    png(p, os.path.join(PNGD, name + ".png"), width=wd)

# square social avatars: mark centred on a solid ground
def avatar(bg, ink, red, size=1000):
    m = size * 0.46
    body = (f'<rect width="{size}" height="{size}" fill="{bg}"/>'
            f'<g transform="translate({(size-m)/2:.1f},{(size-m)/2:.1f}) scale({m/64:.4f})">'
            + MARK.format(ink=ink, red=red) + '</g>')
    return svg(size, size, body)
for nm, s in {"social-profile-light-1000": avatar(WHITE, INK, RED),
              "social-profile-dark-1000":  avatar(INK, WHITE, RED)}.items():
    p = w(os.path.join(SVGD, nm + ".svg"), s)
    png(p, os.path.join(PNGD, nm + ".png"), width=1000)

# email signature: small, on white and transparent
png(os.path.join(SVGD, "cornerstone-logo-horizontal.svg"),
    os.path.join(PNGD, "email-signature-320.png"), width=320)

# ---------------------------------------------------------------- fonts
for f in ("Archivo-Variable.ttf", "Archivo-OFL.txt", "Inter-Variable.ttf", "Inter-OFL.txt"):
    src, dst = os.path.join(SRCF, f), os.path.join(FNT, f)
    if os.path.abspath(src) != os.path.abspath(dst):
        shutil.copy(src, dst)
print("files written")
