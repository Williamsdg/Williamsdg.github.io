# Meat Church — redesign concept

Unsolicited concept by **Williams Digital**. Not affiliated with, commissioned by,
or endorsed by Meat Church BBQ. Published `noindex, nofollow`.

## What is real

Everything commercial on these pages came from meatchurch.com on **18 Sep 2026**:

| Thing | Source |
|---|---|
| 16 rubs & seasonings — names, prices, sizes, descriptions | `meatchurch.com/products.json` (live Shopify catalog) |
| 4 multi-packs — The Ocho, Whole Shootin Match, Holy Trinity, Holy Gospel Multi Pack — names, prices, compare-at prices | same |
| Product photography | Meat Church CDN. White backgrounds keyed out locally for the dark layout; images are otherwise unaltered |
| 36 recipes — titles and photography | `meatchurch.com/blogs/recipes` (pages 1–3) |
| Hatch Chile Brisket Dip — ingredients, method, temps | `meatchurch.com/blogs/recipes/hatch-chile-brisket-dip`, condensed |
| Brand story, mission quote, founder details | `meatchurch.com/pages/about` and press coverage (Texas Monthly, Dallas Observer) |
| Logo | Meat Church logo, background keyed to transparent |
| Phone / email | Listed on their site: 214.980.1063, support@meatchurch.com |

**Editorial groupings.** The family labels used for filtering (Beef, Pork, Poultry,
All-Purpose, Tex-Mex, Gourmet) and the recipe tags are ours, but each one is derived
from Meat Church's own product and recipe copy — no flavor or heat claim has been
invented.

**"300+ recipes"** is inferred from their recipe index running to 26 pages at ~12 posts
per page. Verify before using in a pitch.

## What is not real

* **Three "Story" posts** in the Journal (`trim-day`, `fire-management`, `first-cook`)
  and the whole of `story.html`. These are written by Williams Digital to show the
  long-form layout. They are chipped **Sample** in every list and carry a notice at the
  top of the article. They are not Meat Church editorial and must not be presented as such.
* **Journal Studio** (`write.html`) seed posts. Demo content, stored in `localStorage`.
* Cart, checkout, newsletter and class booking are inert.

## Pages

| File | What it is |
|---|---|
| `index.html` | Homepage. Opens with the seasoning pour |
| `rubs.html` | The lineup — all 16, filterable, plus multi-packs |
| `rub.html` | Product detail, hash-routed (`rub.html#holy-cow-rub`) |
| `journal.html` | The blog — recipes and stories, filterable |
| `recipe.html` | Recipe article (Hatch Chile Brisket Dip) |
| `story.html` | Long-form article (sample content) |
| `write.html` | **Journal Studio** — the authoring surface |

## The opening

`assets/seasoning.js`. A canvas pours ground seasoning from the top of the screen;
the granules settle into the MEAT CHURCH wordmark, hold, then fall away to reveal
the site. The wordmark is sampled from live rendered text, so it reflows at any
viewport and waits for the webfont before sampling.

Notes for anyone editing it:

* Physics runs on a **fixed timestep**, and the phase timeline never lags the wall
  clock by more than 700ms — so it plays at the same speed on a 60Hz and a 120Hz
  panel, and degrades to chunkier motion rather than stalling on a slow device.
* A **5.5s wall-clock stop** force-completes the intro no matter what. `requestAnimationFrame`
  is throttled in background tabs, and the animation must never be what decides
  whether someone gets to the site.
* Plays **once per session** (`sessionStorage`). `?intro=1` forces a replay,
  `?intro=0` skips it. Skipped entirely under `prefers-reduced-motion`.
* Escape, the Skip button, or a scroll after the wordmark forms all exit early.

`MC.seasoning.ambient()` drifts a light dusting behind the hero and the product
shot; `MC.seasoning.burst()` shakes seasoning over a card on hover.

## Build

Shared chrome (head, ribbon, header, footer) is lifted out of `index.html` so the
pages cannot drift apart. Edit `pages.py`, then:

    python3 _build.py

`index.html` is hand-maintained and is the source of truth for the chrome.
`assets/data.js` is generated from the live catalog.

## Known gaps

* No real cart, account or checkout — this is a design concept, not a store.
* Recipe pages other than the Hatch Chile Brisket Dip route to that one article;
  only the one recipe has full body content.
* Product photography is theirs. Any real engagement needs their asset library.
