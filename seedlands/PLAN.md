# Seedlands — App Store Game Plan

A focused plan to take a **procedurally-generated map roguelike** from prototype to the App Store.

> **The one-line pitch:** *Every seed grows a unique world. Explore the fog, grab the gems, escape through the portal — then share your seed and challenge anyone to beat your score.*

---

## 1. Why this concept

You wanted something **unique + trending around map/open-source generation**. Of the three real options:

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| Real-world maps (OpenStreetMap) | Genuinely novel, "your city" hook | GPS, servers, location permissions, heavy Apple privacy review | Phase 2+ |
| **Procedural generation** | Infinite content, replayable, solo-shippable, shareable | Needs a tight core loop | ✅ **Start here** |
| Player-created & shared | Huge ceiling (Roblox-style) | Needs a community before it's fun (cold-start problem) | Layer in later |

Procedural generation is the **most shippable** version of "map generation" for a solo/small dev, and it has a built-in viral mechanic: a **seed** is a tiny string that reproduces an entire world, so players can challenge each other with one link. That's the growth engine.

---

## 2. The core loop (what makes it sticky)

1. **Generate** a map from a seed (deterministic — same seed = same world).
2. **Explore** through fog of war (discovery = the dopamine).
3. **Collect** gems, **avoid** hazards, manage a tight **energy** budget (tension).
4. **Escape** through the portal → score.
5. **Share** the seed → friend plays the *exact same map* → leaderboard rivalry.

Steps 1 + 5 are the differentiators. Everything else is proven roguelike grammar.

---

## 3. What's already built (this prototype)

The playable web prototype in `seedlands/index.html` already has:

- ✅ Seedable PRNG (mulberry32) + string-hash → same seed always rebuilds the same map
- ✅ Value-noise biome generation (water / land / forest / mountain)
- ✅ Fog of war with radius reveal
- ✅ Gems, hazards, energy economy, win/lose states, scoring
- ✅ Daily seed (retention hook)
- ✅ Share via `navigator.share` + `?seed=` deep links
- ✅ Mobile-first: swipe, on-screen D-pad, keyboard — touch-safe, notch-safe

**Try it:** open `seedlands/` on the live site, or add `?seed=amber-1234` to load a specific world.

This validates the fun + the viral loop **before** spending a dollar on native dev.

---

## 4. Roadmap to the App Store

### Phase 0 — Validate (now → 2 weeks)
- [x] Ship web prototype (done)
- [ ] Get 10–20 people playing; watch where they quit
- [ ] Confirm the "share a seed" loop actually gets used
- [ ] Tune energy/gem balance until "one more run" kicks in

### Phase 1 — Make it a real game (2–5 weeks)
- [ ] **Progression**: unlockable characters/skins, biome themes, difficulty tiers
- [ ] **Meta loop**: daily challenge + streaks + global leaderboard (drives retention)
- [ ] **Juice**: sound, particles, screen shake, smooth movement tween, haptics
- [ ] **Variety**: new tile types (teleporters, keys/doors, moving hazards, fog lanterns)
- [ ] Local high-score + per-seed best

### Phase 2 — Native wrapper & submission (1–2 weeks)
Two viable paths (pick based on your skill answer):

- **Fastest / lowest-code:** wrap this HTML in **Capacitor** (`@capacitor/ios`). Reuses 100% of the web code, gives native haptics, Game Center, IAP, and an Xcode build. Best if you want to ship *this* codebase.
- **More native feel:** rebuild in a lightweight engine — **Unity** (huge asset store, easy Game Center/ads) or **Godot** (free, exports to iOS). Better long-term if the game grows.

> Recommendation: **Capacitor first** — fewest steps from what exists today to a TestFlight build.

Submission checklist:
- [ ] Apple Developer Program enrollment ($99/yr)
- [ ] App icon (1024px) + screenshots (6.7" + 6.5" + 5.5" sets) + preview video
- [ ] Privacy policy URL (host on williamsdg.github.io) + App Privacy "nutrition label"
- [ ] App Store Connect listing: name, subtitle, keywords, description
- [ ] TestFlight beta → fix crashes → submit for review

### Phase 3 — Launch & grow
- [ ] **TikTok/Reels**: "I got the hardest seed in Seedlands" clips (the seed = perfect hook)
- [ ] Seed-of-the-day posts; community shares scores
- [ ] Submit to indie roundups, r/iosgaming, Product Hunt

---

## 5. Monetization (keep it gentle)

- **Free to play.** Cosmetic-only IAP (character/biome skins) — never pay-to-win.
- One **"Remove Ads + Supporter Pack"** ($2.99) bundle.
- Optional rewarded ad: "+10 energy to continue this run."
- Daily-challenge streak is free (retention > short-term revenue early on).

The seed-sharing loop is the marketing budget. Lean into it.

---

## 6. Risks & how we de-risk

| Risk | Mitigation |
|---|---|
| "Just another roguelike" | The **seed share + daily challenge** is the wedge — market *that*, not the genre |
| Apple rejection | No data collection in v1 → trivial privacy review; cosmetic IAP only |
| Solo dev burnout | Web prototype already done; Capacitor reuses it; ship small, iterate |
| Cold-start (no players) | Daily seed gives a reason to return solo; sharing brings friends in pairs |

---

## 7. Immediate next steps

1. **Play the prototype** and tell me what feels good / bad.
2. Decide the **build path** (Capacitor wrap vs. Unity/Godot rebuild).
3. I'll start **Phase 1** features — pick the first one: *daily leaderboard*, *progression/skins*, or *game juice (sound + haptics + animation)*.

---

*Prototype + plan committed to branch `claude/app-store-game-maps-ru4y7m`.*
