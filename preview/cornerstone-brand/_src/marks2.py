import math
I='style="fill:var(--mk-ink)"'; A='style="fill:var(--mk-acc)"'; M='style="fill:var(--mk-mid)"'

def tread_c():
    out=[f'<path d="M42.61 21.39A15 15 0 1 0 42.61 42.61" fill="none" style="stroke:var(--mk-ink)" stroke-width="8"/>']
    for deg in range(60, 301, 30):              # tread blocks around the C, opening on the right
        a=math.radians(deg); cx=32+23*math.cos(a); cy=32+23*math.sin(a)
        out.append(f'<rect x="{cx-3.5:.2f}" y="{cy-3:.2f}" width="7" height="6" transform="rotate({deg} {cx:.2f} {cy:.2f})" {I}/>')
    out.append(f'<path d="M32 25L39 32L32 39L25 32Z" {A}/>')
    return "".join(out)

MARKS2 = {
 # 07 The Level — a spirit level, bubble dead centre: fair, true, level
 "m7": f'<rect x="2" y="23" width="60" height="18" rx="2" {I}/>'
       f'<rect x="6" y="29" width="6" height="6" {M}/><rect x="52" y="29" width="6" height="6" {M}/>'
       f'<rect x="20" y="27" width="24" height="10" rx="5" {M}/>'
       f'<rect x="26.2" y="27" width="1.6" height="10" {I}/><rect x="36.2" y="27" width="1.6" height="10" {I}/>'
       f'<path d="M32 27.5L36.5 32L32 36.5L27.5 32Z" {A}/>',
 # 08 The Cairn — three balanced stones: Integrity, Experience, Results
 "m8": f'<ellipse cx="32" cy="48.5" rx="25" ry="10.5" {I}/>'
       f'<ellipse cx="30.5" cy="31" rx="17" ry="8.5" {M}/>'
       f'<ellipse cx="33.5" cy="16.5" rx="11" ry="7" transform="rotate(-10 33.5 16.5)" {A}/>',
 # 09 The Fracture — a solid stone with the damage traced in red
 "m9": f'<rect x="8" y="8" width="48" height="48" {I}/>'
       f'<path d="M38 8L32 21L40 30L28 42L33 50L26 56" fill="none" style="stroke:var(--mk-acc)" stroke-width="4.5" stroke-linejoin="miter" stroke-linecap="butt"/>',
 # 10 The Viewfinder — the damage in focus: photographed, documented
 "m10": f'<path d="M5 22V5H22V11H11V22Z" {I}/><path d="M59 22V5H42V11H53V22Z" {I}/>'
         f'<path d="M5 42V59H22V53H11V42Z" {I}/><path d="M59 42V59H42V53H53V42Z" {I}/>'
         f'<path d="M32 18L46 32L32 46L18 32Z" {A}/>',
 # 11 The Gear — a C for mechanical and equipment expertise
 "m11": tread_c(),
 # 12 Verified — a check mark built from two stones, the red one the cornerstone
 "m12": f'<g transform="rotate(-45 30 40)"><rect x="14" y="16" width="11" height="20" {A}/>'
        f'<rect x="14" y="38" width="42" height="11" {I}/></g>',
}
def symbols2():
    return "".join(f'<symbol id="{k}" viewBox="0 0 64 64">{v}</symbol>' for k,v in MARKS2.items())
