#!/usr/bin/env python3
"""Inject a 'See Public Site' sticky link into each dashboard.
Idempotent: re-running won't duplicate the snippet."""

from pathlib import Path

HERE = Path(__file__).resolve().parent

# dashboard slug → public site slug + brand label
LINKS = {
    'hvac-dashboard':         ('climate-air-pros-site', 'Climate Air Pros'),
    'plumbing-dashboard':     ('flowright-plumbing-site', 'FlowRight Plumbing'),
    'home-services-dashboard':('homecare-services-site', 'HomeCare Services'),
    'water-dashboard':        ('aqualine-water-site', 'AquaLine Water'),
    'power-dashboard':        ('voltworks-electrical-site', 'VoltWorks Electrical'),
    'flooring-dashboard':     ('grainline-flooring-site', 'Grainline Flooring'),
    'windows-dashboard':      ('clearview-windows-site', 'ClearView Windows'),
    'roofing-dashboard':      ('summit-ridge-roofing-site', 'Summit Ridge Roofing'),
    'sheetrock-dashboard':    ('plumline-drywall-site', 'PlumLine Drywall'),
    'framing-dashboard':      ('ironwood-framing-site', 'Ironwood Framing'),
    'brick-dashboard':        ('cornerstone-masonry-site', 'Cornerstone Masonry'),
    'landscaping-dashboard':  ('greenline-landscape-site', 'Greenline Landscape'),
    'aurora-coffee':          ('aurora-coffee-site', 'Aurora Coffee'),
    'maisonverre':            ('maisonverre-site', 'Maison Verre'),
    'verbatim':               ('verbatim-site', 'Verbatim & Co.'),
    # Tourism — sticky link is dynamic in JS (changes with brand switcher), skip injection
}

MARKER = 'wd-sticky-public'  # idempotency marker


def snippet(target_slug, brand_label):
    return f'''
<!-- {MARKER} sticky public-site link -->
<style>
.{MARKER}{{position:fixed;bottom:24px;right:24px;z-index:90;background:rgba(15,21,40,0.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.18);border-radius:50px;padding:11px 22px;font-family:'Inter',system-ui,sans-serif;font-size:.72rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#f1f3f9;box-shadow:0 12px 32px -8px rgba(0,0,0,0.5);text-decoration:none;display:inline-flex;align-items:center;gap:10px;transition:all .25s}}
.{MARKER}:hover{{border-color:#d4af37;color:#d4af37;transform:translateY(-2px);text-decoration:none}}
.{MARKER}::after{{content:'\\2192';font-size:.92rem}}
.{MARKER} .lbl-full{{display:inline}}
.{MARKER} .lbl-short{{display:none}}
@media(max-width:768px){{.{MARKER}{{bottom:calc(82px + env(safe-area-inset-bottom));right:14px;padding:9px 16px;font-size:.62rem;letter-spacing:1.2px}} .{MARKER} .lbl-full{{display:none}} .{MARKER} .lbl-short{{display:inline}}}}
</style>
<a class="{MARKER}" href="../{target_slug}/" title="View {brand_label} public site"><span class="lbl-full">See Public Site</span><span class="lbl-short">Public Site</span></a>
'''


def inject(dashboard_slug, target_slug, brand_label):
    path = HERE / dashboard_slug / 'index.html'
    if not path.exists():
        print(f"  ⚠ skip (not found): {dashboard_slug}")
        return False
    html = path.read_text(encoding='utf-8')
    if MARKER in html:
        # already injected — refresh in place to keep target current
        # find the existing block and replace
        import re
        pattern = re.compile(r'\n?<!-- ' + re.escape(MARKER) + r' .*?</a>\n?', re.DOTALL)
        html = pattern.sub('\n', html)
    if '</body>' not in html:
        print(f"  ⚠ skip (no </body>): {dashboard_slug}")
        return False
    new_html = html.replace('</body>', snippet(target_slug, brand_label) + '\n</body>', 1)
    path.write_text(new_html, encoding='utf-8')
    return True


def main():
    n = 0
    for dash, (target, label) in LINKS.items():
        ok = inject(dash, target, label)
        if ok:
            print(f"  ✓ {dash} → {target}")
            n += 1
    print(f"\nInjected sticky link into {n}/{len(LINKS)} dashboards.")


if __name__ == '__main__':
    main()
