# Six original marks on a 64-unit grid. Colours come from CSS custom properties
# (--mk-ink / --mk-mid / --mk-acc) so every mark re-colours per tile and per palette.
I='style="fill:var(--mk-ink)"'; A='style="fill:var(--mk-acc)"'; M='style="fill:var(--mk-mid)"'
MARKS = {
 "m1": f'<path d="M38.73 19.27A18 18 0 1 0 38.73 44.73" fill="none" style="stroke:var(--mk-acc)" stroke-width="9"/>'
       f'<path d="M50 23L59 32L50 41L41 32Z" {I}/>',
 "m2": f'<path d="M13 29L24 40L13 51L2 40Z" {I}/><path d="M32 21L43 32L32 43L21 32Z" {M}/>'
       f'<path d="M51 13L62 24L51 35L40 24Z" {A}/>',
 "m3": f'<rect x="8" y="8" width="14" height="14" {I}/><rect x="24" y="8" width="32" height="14" {I}/>'
       f'<rect x="8" y="24" width="14" height="16" {I}/><rect x="8" y="42" width="14" height="14" {A}/>'
       f'<rect x="24" y="42" width="32" height="14" {I}/>',
 "m4": f'<path d="M8 8H56V56H33V31H8Z" {I}/><rect x="8" y="34" width="22" height="22" {A}/>',
 "m5": f'<rect x="10" y="8" width="11" height="48" {I}/><rect x="10" y="45" width="46" height="11" {I}/>'
       f'<rect x="28" y="37" width="3.5" height="6" {I}/><rect x="37" y="33" width="3.5" height="10" {I}/>'
       f'<rect x="46" y="37" width="3.5" height="6" {I}/><path d="M42 10L52 20L42 30L32 20Z" {A}/>',
 "m6": f'<path d="M32 5L55 13V31C55 45.5 45.5 54.5 32 59C18.5 54.5 9 45.5 9 31V13Z" {I}/>'
       f'<path d="M32 20L43 31L32 42L21 31Z" {A}/>',
}
def symbols():
    return "".join(f'<symbol id="{k}" viewBox="0 0 64 64">{v}</symbol>' for k,v in MARKS.items())
