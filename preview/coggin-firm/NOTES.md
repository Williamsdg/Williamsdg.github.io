# The Coggin Firm — concept redesign build notes

Preview: `/preview/coggin-firm/` (noindex, nofollow on every page)
Built from the redesign plan dated 28 August 2026.

## Files

| File | Role |
|---|---|
| `index.html` | Homepage — plan §5 (desktop) and §6 (mobile) in full |
| `workers-compensation.html` | Practice-area template — plan §7. The other 11 areas reuse it verbatim |
| `john-coggin.html` / `gina-coggin.html` | Attorney profile template — plan §7 |
| `contact.html` | Locations, firm story, FAQ/resources, consultation form, legal pages |
| `assets/site.css` | Design system — palette, type, components, motion, mobile rules |
| `assets/site.js` | Mega menu, mobile panel, accordions, reveals, sticky bar, form validation |
| `build.py` | Regenerates the four inner pages from `index.html`'s header/footer |

Run `python3 build.py` after editing the header or footer in `index.html` — it
re-stamps the shared chrome into every inner page so they cannot drift.

## Facts verified against thecogginfirm.com (28 Aug 2026)

- Tagline: *We Listen. We Understand. We Make a Difference.*
- "With over 50 years of experience, we are prepared to go the distance for you."
- Gadsden: 222 S. 8th Street, Gadsden, AL 35901 · (256) 485-0909 · fax (256) 485-0901
- Centre: 104 Northwood Drive, Centre, AL 35960 · (256) 927-9090 · fax (256) 927-9089
- Email: secretary@thecogginfirm.com
- John D. Coggin — Senior Partner. Jacksonville State University; Cumberland School
  of Law, 1975. Municipal Judge for Cedar Bluff and Centre. Appointed **District
  Court Judge** December 1982, served until 1997. Past President, Juvenile Family
  Court Association. Lives in Centre; three granddaughters. *"I love helping people."*
- Gina D. Coggin — Managing Partner. University of Alabama; Cumberland School of Law
  (Moot Court, National Trial Team, co-founded the Negotiation Team). Former Etowah
  County Assistant District Attorney — directed a pilot program prosecuting child sex
  crimes. Now plaintiff-side: employment discrimination and workers' compensation.
  ALAJ Al Sansone Award; chairs the ALAJ workers' compensation division.
- 12 practice areas, exactly as the live site lists them.

**Judge title inconsistency (plan §2) — resolved.** The firm's own bio says *District
Court Judge*, appointed December 1982, held until 1997. That is what the redesign uses
throughout. The "Circuit Court" reference elsewhere on the current site appears to be
the error. Still worth one confirmation from John before launch.

## Deliberately NOT included

- No testimonials, star ratings, peer-review badges or award logos. Martindale shows a
  firm rating and a 2026 peer distinction, and Gina has directory reviews — but none of
  it goes on the page until the firm confirms it is current and cleared for advertising
  use. The module is built and waiting.
- No "no fee unless we win" anywhere as a firm-wide promise (plan §2).
- No invented statistics, case results, settlement figures, or staff.
- No specific statutory deadlines. Copy says deadlines exist and are shorter than people
  expect, without naming a number the firm has not approved.
- No stock photography. Every image slot is a labelled placeholder.

## 301 redirect map

Old URLs confirmed on the live site. All `http://` → `https://` as well.

| Old | New |
|---|---|
| `/our-team/` | `/attorneys/` |
| `/contact-2/` | `/contact/` |
| `/practice-areas/241-2/` | `/practice-areas/workers-compensation/` |
| `/?p=273` | `/practice-areas/social-security-disability/` |
| `/practice-areas/trucking-accident/` | `/practice-areas/truck-accidents/` |
| `/practice-areas/estate-law/` | `/practice-areas/estate-planning-probate/` |
| `/practice-areas/personal-injury/` | unchanged |
| `/practice-areas/automobile-accidents/` | unchanged |
| `/practice-areas/wrongful-death/` | unchanged |
| `/practice-areas/workplace-discrimination/` | unchanged |
| `/practice-areas/workplace-harassment/` | unchanged |
| `/practice-areas/criminal-defense/` | unchanged |
| `/practice-areas/family-law/` | unchanged |
| `/practice-areas/juvenile-law/` | unchanged |

New pages with no old equivalent: `/attorneys/john-d-coggin/`,
`/attorneys/gina-d-coggin/`, `/locations/gadsden/`, `/locations/centre/`,
`/resources/faq/`, `/about/`.

## Must confirm with the firm before launch

1. Office hours — the Mon–Fri 8–5 shown here comes from business directories, not the
   firm's own site.
2. Free-consultation policy per matter type, and which matters are contingency-fee.
3. Bar and court admissions for both attorneys; current professional roles.
4. Whether the ALAJ award and any peer ratings may be used in advertising.
5. Whether estate work includes conservatorships and estate litigation — the plan lists
   them, the live site says only "Estate Law", so the preview says wills/estates/probate.
6. Counties where the firm currently accepts work.
7. Who receives consultation-form submissions, and whether it routes to a CRM.
8. A logo file — the "C" monogram here is an interpretation, not their mark. Needs SVG.
9. Photography: attorney portraits, both office exteriors/interiors.
10. Attorney-advertising language required by the Alabama State Bar.

## Accessibility built in (plan §10)

- Contrast: gold `#B28A4A` is used only for rules, icons and button fills — it fails AA
  as text on ivory (2.8:1). Accent *text* uses bronze `#7E5E2F` (5.3:1). Charcoal on
  ivory is 16:1; charcoal on gold buttons is 5.6:1.
- Keyboard: full operation, visible 3px focus ring, skip link, Esc closes menus, focus
  containment and restoration on the mobile panel.
- Forms: real labels, 16px inputs (no iOS zoom), per-field errors, values preserved,
  `role="status"` success.
- Motion: everything 150–250ms; `prefers-reduced-motion` disables it all.
- No sliders, no carousels, no autoplay anywhere.
- Sticky mobile bar stands down over the form and footer, and while the menu is open.
