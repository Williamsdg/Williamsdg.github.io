# The Dubis Group — redesign concept

Unsolicited concept by **Williams Digital**. Not affiliated with, commissioned by,
or endorsed by The Dubis Group. Published `noindex, nofollow`.

## What is real

Content came from dubisgroup.com (home, `/about-us/`, `/services/`), read 19 Sep 2026.

| Thing | Source |
|---|---|
| Phone `(216) 712-6712`, text `(216) 978-0281` | Listed on their site |
| Mark Dubis as founder | Their About page |
| VP roles in the marketing divisions of **KeyBank** and **National City Bank**, indirect automotive lending | Their About page |
| Editor of **Digital Dealer** magazine (technology / eCommerce strategy) | Their About page |
| **Arrow Motorcar** — his own vehicle-leasing company, eight years, named to the South Florida Business Journal's top 25 leasing companies | Their About page |
| "a network of creative professionals" positioning | Their About page |
| Service lines — brand & identity, advertising, direct mail, brochures, sell sheets, web design/audits, e-commerce strategy, press releases & media coaching, articles/ghost writing, eNewsletters & email programs, marketing plans, general business/management/training consulting | Their Services pages |

The four service groupings, the four process steps, and all headline/body copy are
**rewritten** for clarity and conversion. The underlying offer is theirs; the wording is ours.

## ⚠ Check before this is sent

* **The experience figure now reads "26 years" / "26+"**, matching Mark's own About page
  ("over the last 26 years"). The brief originally specified 29+/"Nearly 30"; that was changed
  on 2026-09-19 because Mark reads his own site and an inflated number would read as careless.
* **No client names, testimonials, logos, or project work** appear anywhere in this concept.
  Their "Clients" and "Web Gallery" pages were not reproduced.
* **No prices.** Their services page lists $75/hour for standard design and maintenance;
  deliberately left out of the concept.
* **No email address** is shown — they do not publish one. Phone only.
* The **"D" logo mark is ours**, not their existing branding.

## Imagery

One photograph: a top-down creative workspace (laptop, printed colour sample fans, marker
pens, campaign sketches), from Unsplash under the Unsplash licence. Cropped locally into a
desktop frame (`img/hero.jpg`) and a separate portrait mobile frame (`img/hero-mobile.jpg`)
so the mobile hero is composed rather than squeezed. Colour grading is done in CSS.

## Build notes

Single static page, no dependencies beyond Google Fonts (Manrope / DM Sans).

Verified at 320, 360, 390, 768, 1024, 1280 and 1440px: no horizontal overflow, no clipped
headings, body copy 16px+, all touch targets ≥44px. Mobile menu verified for open/close,
close-on-navigate, Escape-to-close with focus return, and scroll lock. Text contrast meets
WCAG AA throughout (the muted grey is darkened to `#626D80` on the cream section, where the
specified `#657084` measured 4.43:1). Motion is disabled under `prefers-reduced-motion`, and
a `<noscript>` fallback keeps every section visible if JavaScript never runs.
