# Gallery Studio 103 — concept sources

Built 2026-09-18 for Anthe Capitan-Valais (GalleryStudio103@gmail.com), following her
email of 18 Sep 2026. Pages: `index.html`, `work.html`, `piece.html?p=<slug>`,
`classes.html`, and the private view at `studio.html`.

Pages are assembled by `_build.py` from the fragments in `src/`. Edit a fragment, run
`python3 _build.py`, commit the generated HTML.

## Real — Anthe's own

- **Biography.** Quoted and condensed from her artist statement on
  naplesartdistrict.com/art/artist/anthe/. The two pull-quotes on the homepage
  ("As a little girl…" and "Watching a student discover…") are verbatim.
- **Mission.** "Distinctive art that spreads joy and honors God Almighty" and the
  "prophetic flow" description are hers, from the same page.
- **Scripture.** Psalm 103:1 appears on the homepage because she keeps it beside her
  name on her Naples Art District profile. The site does not claim the studio was named
  after the psalm — the suite number is 103.
- **Address & contact.** 6230 Shirley Street #103, Naples FL 34109; Fairways Trade
  Village, "the teal building on the right facing Shirley St."; (215) 233-3916;
  GalleryStudio103@gmail.com; facebook.com/ArtworksByAnthe.
- **Mediums.** Drawing, glass, metal, mixed media/collage, painting, printmaking,
  sculpture, watercolours — her list, in her order.
- **Teaching since 1995** and **PAFA graduate** — both from her own published profiles.
- **Classes.** Drawing from Music, Drawing for All Ages, and Collage & Mixed Media are
  from her Naples Art District profile. Painting on Glass and Painting on Clothing are
  from her listings on gulfshorelife.com, as are the class lengths (2–3½ hours) and the
  1:00pm / 5:30pm start times.
- **Logo.** Her own feather logo, downloaded from her Naples Art District profile. The
  wordmark was masked out of `feather.png` so the feather could be used as a mark; the
  untouched original is `logo.webp`.
- **Photography.** All ten images are hers, from her Naples Art District profile:
  - `white-line.webp` — *White Line* (her title)
  - `performance.webp` — *Performance* (her title)
  - `cello-full.webp`, `cello-front.webp`, `cello-studio.webp` — the painted cello
  - `collage-turtle.jpg` — used by her to illustrate the collage class
  - `drawing-from-music.jpg` — used by her to illustrate the Drawing from Music class
  - `drawing-all-ages.jpg` — student work, labelled as such on the classes page
  - `anthe-portrait.webp` — Anthe in the studio
  - `logo.webp` → `logo-mark.png`, `feather.png`

## From her 18 Sep 2026 email — the reason the Studio Ledger exists

> "I keep most of my photos and descriptions in hap hazard in photos and certificates.
> I am in the process of working on a system for inventory and pricing in excel… I
> currently manage about over 500 pieces with approx 100 pieces in studio and I offer
> both originals and prints but original prints."

- **500 pieces / ~100 in the studio** — her figures, used as stated.
- **Originals vs original prints** — the collection and every piece page keep the two
  apart, and the explainer on `work.html` says an original print is hand-pulled, not a
  reproduction. This is her distinction, not an invention.
- **"Certificates"** — why `piece.html` generates a certificate of authenticity from the
  same row rather than treating it as separate work.
- **Excel** — why `studio.html` opens with an `Inventory.xlsx` import and a column map
  instead of a CMS.

## Illustrative — clearly labelled in the page, and hers to replace

- **Ledger rows 6–500.** Generated stand-ins so the scale is honest. Their titles are
  deliberately blank ("— untitled —"); medium, status, location and the missing-field
  flags are synthetic. `studio.html` says so on the page. Only rows 1–5 are real.
- **Derived counts** (117 in the studio, 191 available, 157 sold, 290 waiting on a
  photo) are counted from those stand-in rows, not from her records.
- **Class schedule** on `classes.html` — dates are generated relative to today and
  marked illustrative on the page. Seat counts are invented.
- **Series names** (Drawing from Movement, God's Creatures, Scripture Series) are
  plausible groupings, not titles she has published.

## Deliberately absent

- **No prices anywhere.** She has not published any, and a concept is not the place to
  guess at an artist's pricing. Every route ends in "ask".
- **No exhibition history.** She mentions having show records in her spreadsheet, but
  none are public, so `piece.html` shows the provenance panel in its empty state rather
  than inventing a show.
- **No dimensions or years** on the real pieces — not published, so the pages say
  "not yet entered in the ledger".
- **No dates or titles invented for her work.** *The Painted Cello* and the sea-turtle
  collage are both marked "title to confirm"; the others use her published titles.

## Behaviour

Nothing sends, charges, books or publishes. Forms show a confirmation and reset. The
Studio Ledger runs entirely in the browser — no storage, no network. All pages are
`noindex, nofollow`.
