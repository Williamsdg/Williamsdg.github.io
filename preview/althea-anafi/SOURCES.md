# Althea Anafi Suites — concept sources & limits

Williams Digital · built 2026-09-16 · noindex preview, not the live site.

| Route | What it is |
|---|---|
| `/preview/althea-anafi/` | Homepage concept (EN / EL) |
| `/preview/althea-anafi/dashboard.html` | Host Desk: staff demo (Today, Reservations, Suite Care, Guest Requests, Website) |
| `/preview/althea-anafi/client.html` | Your Althea Stay: guest demo (My Stay, Arrival, Experiences, Help) |

Static HTML/CSS/vanilla JS, no build step. Shared demo state lives in `assets/store.js`, stored in localStorage under `althea.demo.v1`, with a fixed demo date of 2026-09-23 (Europe/Athens). If you change the seed, click **Reset demo** in the browser to see it. State is shared only between tabs of the same browser, not across staff devices.

## Real — from altheaanafisuites.com (checked 2026-09-16)
- Five suites, names, categories, sizes, capacities and beds come from each suite page. Kitchen facilities are listed for Helios, Meltemi and Tholos and not listed for Thalassa or Selene, so the concept says "ask us" for those two.
- Suite taglines are their own words.
- Every suite page lists: sea view, shared pool, Wi-Fi, à la carte breakfast (extra charge), safe box, coffee machine and mini bar. The FAQ adds air-conditioning, ceiling fan, KORRES products and a welcome treat.
- Experiences come from the Curated Experiences page:
  - Mt Kalamos hikes (sunset & overnight, or sunrise), 6–8 people
  - Boat rides with Elmar Anafi: RIB up to 4 guests, or the Koursaros kaiki with lunch; pre-notice required
  - Barbecue night, 10–12 people
  - Yoga on the terraces
  - Thai massage, on request
- From the contact page and FAQ:
  - Ferry times: Piraeus 10–11 h, Santorini 1.5 h, Crete 3.5 h
  - The port is Agios Nikolaos, a 10-minute drive from Chora
  - Ferries often arrive at night, so they recommend booking from the previous day
  - Pets are welcome but must not be left unattended; a small cleaning fee may apply
  - Buses are limited; they help with car or scooter rental
  - Nearby beaches: Roukounas, Katsouni, Klisidi, Agioi Anargyroi
- Contact: +30 2286 062 341 · altheaanafisuites@gmail.com · IG @althea.anafi.suites · FB altheasuitesanafi
- Booking link: https://altheaanafisuites.reserve-online.net/ (link only; no date parameters verified)
- Name meaning ("healing"), the Apollo/Argonauts legend, and the sustainability text are paraphrased from the About, Discover Anafi and Gallery pages.
- ESPA co-funding banners are kept in the footer, as on the live site.

## Conflicts on their live site (not resolved silently)
1. The FAQ says "most of our suites offer views of the sea or the Chora", but every suite page lists "Sea view". The concept follows the suite pages. **Confirm.**
2. The Greek homepage shows all five suites as 32 m². The EN suite pages say 32/36/34/32/42. The concept uses the EN figures.
3. The boat card is headed "10–12 PEOPLE" but the text says the RIB takes up to 4. The concept shows the RIB limit only.
4. Their homepage hero video (`Boy_Swimming_In_An_Infinity_Pool_uhd_1636948.mp4`) is a stock clip, not their pool. It is not used here.

## Fictional / demo only
- All guests, reservations (AL-xxxx), requests (RQ-xxx), team members (Eleni, Maria, Giorgos), payment statuses, messages and the maintenance issue.
- Transfer and experience **prices are never stated**. Proposals carry a free-text "cost to guest" field.
- No integration with reserve-online, email, WhatsApp, channels or payments. A production version would need authenticated access, server-enforced permissions and reservation-ownership checks.
- Greek copy: headings reuse their existing Greek where it exists (Οι Σουίτες, Γαλήνη γεννημένη στο Αιγαίο, Εκδηλώστε το ενδιαφέρον σας…). Everything else is a new translation for **owner review**, flagged on the page.

## Photography (owner approval needed before any production use)
All images are Althea's own, downloaded from `https://altheaanafisuites.com/wp-content/uploads/2025/06|07/…` and `/2026/04/` and converted to WebP (1600 px plus 720 px `-sm`). Public availability is not a licence; ask for the originals.

| Local file | Source filename |
|---|---|
| hero-pool | Althea-GalleryPage-02.png |
| terrace-view | Althea-About-Hero-Image.jpg |
| church-sunset | Althea-Homepage-church-sunset.jpg |
| sign | About-thestory-ofalthea.jpg |
| arch-balcony / amphora / window-path / terraces / wordmark / welcome / pool-chora / loungers | Althea-GalleryPage-01/03/04/05/06/07/08/10 |
| terrace-table / wildflowers | Althea-GalleryPage-11.jpg / Althea-GalleryPage-image.jpg |
| stairs | Althea-TheSuites-HeroImage.jpg |
| stars / bbq / yoga | Althea-activities-image1/3/4.jpg (text-free versions) |
| boat | Althea-Boat-Ride-mobile-notext.jpg |
| beach-kalamos | Althea-discover-anafi-image02.png |
| chora-hill / wine / hat-shadow | Althea-gallery-experiences-01/02/03.png |
| coffee / balcony-cup / korres | Althea-Meltemi-Gallery-12 / Helios-Gallery-05-1 / Selene-Gallery-10 |
| helios-1…9 | Helios First-Image2, Gallery-06, 02, Featured-Image-2, 07, 03, 09, 04-1, 12 |
| meltemi-1…8 | Meltemi First-Image, Gallery-01, 02, 11, 03, 13, 05, 09 |
| thalassa-1…8 | Thalassa First-Image, Gallery-06, 01, 05, 02, 04, 09, 07 |
| selene-1…8 | Selene First-Image, Gallery-06, 05, 01, 04, 02, 08, 07 |
| tholos-1…9 | Tholos First-Image-1, Gallery-02-1, 04-1, 03, 10, 14, 01, 18, 07 |
| logos, favicon, ESPA banners | copied unchanged |

Omitted: `Althea-Homepage-1stImage-c-2.jpg` (919 px and heavily compressed, so it blurs at full width).

## Libraries & fonts
None bundled. The lightbox, carousel, tabs and reveal effects are written in vanilla JS and honour `prefers-reduced-motion`. Fonts are Inter and Noto Serif Display from Google Fonts (SIL OFL 1.1). Icons are hand-drawn inline SVG.

## Verified in headless Chrome (CDP), 2026-09-16
- No JS exceptions on any of the three pages. No horizontal overflow at 390 px on the homepage, dashboard or guest portal.
- Homepage: suite tabs, comparison table, EN→EL switch, and experience-request validation all work; a request saves and shows up in the staff inbox.
- Arrival flow:
  - Staff proposal → Confirm stays disabled until the guest accepts.
  - Guest accepts → status Confirmed on both sides, and the transfer appears in the itinerary.
  - Guest changes the arrival time → acceptance is cleared.
- Reservations: a capacity breach is blocked (Tholos 5/4, Selene 4/2).
- Suite Care: completing the checklist moves the suite to Inspection.
- Website: a headline published from the dashboard appears on the homepage.
- Not tested: real iOS Safari, 200% zoom, screen readers, or performance numbers.
