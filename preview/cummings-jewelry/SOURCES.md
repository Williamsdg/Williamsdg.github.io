# Cummings Jewelry Design — concept sources

Built 2026-09-16. Pages: `index.html`, `jewelry.html`, `piece.html?p=<handle>`, `custom.html`,
`services.html`, `visit.html`, and the staff dashboard at `admin.html`.

## Real (taken from their own sites)
- **Catalog: 76 products.** Names, prices, descriptions, T-reference numbers, photos, and
  available/unavailable status come from their public Shopify catalog
  (`cummings-jewelry-design.myshopify.com/products.json`), exported 2026-09-16.
  "Purchase online" links go to the real Shopify product pages.
- **Newest product published: 2024-12-17.** Nothing has been added online since then. The
  dashboard's Overview calculates this live.
- **Business details:** address 3166 Heights Village, Birmingham AL 35243; phone (205) 298-9144;
  hours Mon–Fri 10–5:30 plus Saturdays in December 10–2; "since 1978"; family-owned.
  Financing through Synchrony (the link their site uses). Facebook: /cummingsjewelry.
- **Services copy** is condensed from their Repair & Restoration, Appraisals (two copies,
  included with purchases), Gold Buyers (ID required, paid by check), Diamonds, Custom Jewelry
  and Repurposed Jewelry pages.
- **Reviews** are quoted verbatim from /reviews/, with the first names as published there
  (names appear *after* each quote in their HTML). Trimmed quotes are marked with "…".
- **Design-process images** (`draw1`, `step2`–`step9`, `finished`) come from /design-process/ and
  show one ring. The custom pendant sketch and finished piece come from /gallery/. The before/after
  photos are cropped from `2023/07/IMG_0942.png` (their collage) to remove the baked-in
  "Before/After!" text and the PhotoGrid watermark.
- **Past commissions gallery:** their /gallery/ photos. Alt text describes only what is visible.

## Derived by me (parsed from their own text; verify)
- Type (Ring/Earrings/Necklace/Pendant/Bracelet) comes from product titles; their Shopify
  `product_type` is blank.
- Metal, stones, size and period (Art Deco / Edwardian / Estate) come from their titles and
  descriptions. Two products have no metal stated, so the field is left blank.
- "Cummings original" tag = description says "designed by Jim Cummings" (2 products).
- Shopify `available: false` (2 products) is shown as **Sold**. That's unconfirmed: it could
  mean out of stock or on hold.

## Mine (not from them)
- All headlines and editorial copy: "It begins as a pencil line…", "One ring, ten photographs",
  "Made for someone else", and similar.
- Stage captions for the process. "Wax model" and "brought into metal" describe what the
  photos show and standard practice. **Confirm with Jim.**
- Visual identity: palette (the oxblood comes from the display bases in their product photos),
  Cormorant Garamond + Manrope. Their logo PNG is unchanged, with a light version
  for dark backgrounds.
- Homepage featured selection (6 pieces).
- **Demo inquiries** (Sample Customer A/B/C, example.com) are fictional and labeled DEMO.

## Found on their live site (possible talking points; raise them tactfully)
- /repurposed-jewelry/ has a leftover AI prompt visible in the page copy:
  "…holds both aesthetic and sentimental value.**: give a title for this passage**"
- Online catalog hasn't changed in ~21 months.
- Their "Custom Studio" page is an iframe to customstudiousa.com (compid 73211). Not carried over.
- Site credit: WebNet International, Inc. (WordPress/Avada).

## How the demo works
- `assets/data.js` = seed. `assets/store.js` = shared localStorage store (`cjd.demo.v1`). Any edit
  in `admin.html` shows up on the public pages in the same browser. "Reset demo" restores the seed.
- Uploaded photos are resized to 1200px JPEG data URLs, which can hit the browser's storage
  quota; the app shows a message if they do.
- Production intent: the dashboard edits their **Shopify catalog** via the Admin API (one catalog,
  never two), behind staff sign-in and server-side authorization.
- E2E test (28 checks) lives in the session scratchpad: `e2e.mjs`.
