# Meat Church — redesign concept

Unsolicited concept by **Williams Digital**. Not affiliated with, commissioned by,
or endorsed by Meat Church BBQ. Published `noindex, nofollow`.

## What is real

Everything commercial and editorial on these pages came from meatchurch.com,
scraped **18–19 Sep 2026**:

| Thing | Source |
|---|---|
| 16 rubs & seasonings — names, prices, sizes, descriptions | `meatchurch.com/products.json` (live Shopify catalog) |
| 4 multi-packs — The Ocho, Whole Shootin Match, Holy Trinity, Holy Gospel Multi Pack — names, prices, compare-at prices | same |
| Product photography | Meat Church CDN. White backgrounds keyed out locally for the dark layout; images otherwise unaltered |
| **36 recipes, in full** — titles, photography, intros, ingredients (including sub-recipe groups), tools, and every method step | Each article on `meatchurch.com/blogs/recipes/…`, parsed individually |
| Seasoning links per recipe | The product links Meat Church put in their own recipe copy |
| Pit and internal temperatures, cook times | Extracted from the recipe text — see *Derived* below |
| Brand story, mission quote, founder details | `meatchurch.com/pages/about` and press coverage (Texas Monthly, Dallas Observer) |
| Logo | Meat Church logo, background keyed to transparent |
| Phone / email | Listed on their site: 214.980.1063, support@meatchurch.com |

### Derived, not quoted

* **Family labels** (Beef, Pork, Poultry, All-Purpose, Tex-Mex, Gourmet) and **recipe
  tags** are ours, but each is derived from Meat Church's own copy. No flavor or heat
  claim is invented.
* **Pit temp vs internal temp.** Recipes state several temperatures. The scraper reads
  the surrounding sentence to tell a cooker temperature ("preheat your smoker to 250°")
  from a doneness target ("pull at 135°") and labels them separately. 20 recipes have a
  pit temp, 17 an internal temp — the rest state neither and show neither.
* **Cook time** is taken only from an explicit "for N minutes/hours" in a step.
* **Read counts** in the admin are demo figures, labelled as such in the UI.
* **"300+ recipes"** on the homepage is inferred from their recipe index running to 26
  pages at ~12 posts per page. Verify before using in a pitch.

## What is not real

* **Three "Story" posts** (`trim-day`, `fire-management`, `first-cook`). Written by
  Williams Digital to show the long-form layout. They are chipped **Sample** in every
  listing, in the admin, in the Studio, and carry a notice at the top of the article.
  They are not Meat Church editorial and must not be presented as such.
* Cart, checkout, newsletter and class booking are inert.
* The admin and Studio persist to `localStorage` only — no server.

## Pages

| File | What it is |
|---|---|
| `index.html` | Homepage. Opens with the seasoning pour |
| `rubs.html` | The lineup — all 16, filterable, plus multi-packs |
| `rub.html` | Product detail, hash-routed (`rub.html#holy-cow-rub`) |
| `journal.html` | The blog — reads the editorial store, so it reflects the admin |
| `recipe.html` | Recipe article, hash-routed — **all 36 recipes have full content** |
| `story.html` | Long-form article, hash-routed across the three samples |
| `write.html` | **Journal Studio** — the authoring surface |
| `admin.html` | **Journal Admin** — the editorial dashboard |

## How the editorial side fits together

`assets/store.js` is the single source of truth, seeded from the live catalog into
`localStorage` (39 posts: 36 recipes + 3 sample stories) and shared by four surfaces:

```
store.js ──┬── admin.html    overview, posts, calendar, health, media, tags
           ├── write.html    the editor
           ├── journal.html  public listing (published only)
           └── story.html    long-form articles
```

Edit a post in the Studio and it changes in the admin and on the Journal. Change its
status in the admin and it appears or disappears from the public Journal. "Reset demo
data" in the admin sidebar restores the seed.

The admin's **Health** view is the part worth demoing: it flags posts with no hero, no
standfirst, no tags, and recipes with no seasoning linked, no method or no ingredients
— the editorial QA an editor would otherwise do by eye.

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

**On a commerce homepage this is an argument you have to win.** It is session-gated,
skippable and reduced-motion aware, but a conversion-minded client will still raise it.
Have the answer ready, or show it on a campaign page instead.

## Build

Shared chrome (head, ribbon, header, footer) is lifted out of `index.html` so the
pages cannot drift apart. Edit `pages.py`, then:

    python3 _build.py

`index.html` is hand-maintained and is the source of truth for the chrome.
`assets/data.js` is generated from the live catalog — rebuild it with the scraper
rather than editing it by hand.

## Known gaps

* **This is not a Shopify theme.** Their entire business runs on Shopify — catalog,
  variants, retail, the blog. Any real engagement needs this rebuilt as a theme, and
  the pitch should say so rather than implying a lift-and-shift.
* No real cart, account or checkout.
* Product and recipe photography is theirs. Any real engagement needs their asset library.
