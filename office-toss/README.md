# Office Toss 🗑️📄

Quick, low-poly **3D** office-themed tossing mini-games, built in
[**Godot 4**](https://godotengine.org). Flick crumpled paper into the bin,
smash desk props for bonus points, beat your best, and climb the leaderboard.

This is the **MVP**: one fully playable 3D mini-game (Trash Can Toss) plus the
menu / level-select / scoring / save framework that the rest of the game slots
into. All geometry is generated in code with simple low-poly primitives, so the
project **runs immediately with zero external assets** — swap in real models
later (see [Assets](#assets)).

> Engine choice: Godot is open-source (MIT), supports 2D **and** 3D, exports to
> iOS / Android / Web, and keeps costs at zero — exactly the brief.

---

## Run it

1. Install **Godot 4.3+** (standard build, no C# needed) from
   <https://godotengine.org/download>.
2. Open the Godot project manager → **Import** → select
   `office-toss/project.godot`.
3. Press **▶ Play** (F5). It opens to the main menu in portrait.

You can play on desktop with the mouse — mouse input is emulated as touch.

## How to play

- **Drag up to aim** — a dotted trajectory preview shows exactly where the
  throw will go (wind included). **Release to throw.** Longer drag = more
  power; drag sideways to aim left/right.
- **Sink it in the bin** for 100 points. Consecutive makes build a **combo
  multiplier** (up to x5); banking the ball off a wall or the desk first earns
  a **bank-shot bonus**.
- **Smash the props** on the desk for bonus points — each office location has
  its own set (trophy, printer, folder stacks, even a breakable skyline window
  on the rooftop).
- The **bin slides to a new spot** between shots and the **wind** changes —
  watch the indicator.
- You get **10 shots** per round. Earn coins from your score and spend them in
  **Locations** to unlock new offices.

---

## Project structure

```
office-toss/
├─ project.godot              # engine config: mobile renderer, portrait, autoload
├─ icon.svg
├─ scenes/
│  ├─ Main.tscn               # main menu (thin node + script)
│  ├─ LevelSelect.tscn        # office picker / unlocks
│  └─ games/
│     └─ TrashToss.tscn       # the 3D mini-game
└─ scripts/
   ├─ GameState.gd            # autoload singleton: coins, best scores, unlocks, save/load
   ├─ Main.gd                 # builds the menu UI in code
   ├─ LevelSelect.gd          # builds the location list in code
   └─ games/
      ├─ TrashToss.gd         # builds the 3D scene, flick input, wind, scoring, game over
      ├─ PaperBall.gd         # RigidBody3D paper ball (low-poly sphere)
      └─ Breakable.gd         # RigidBody3D bonus prop that smashes into shards
```

**Design note:** scenes are intentionally thin (just a root node with a script).
Each script builds its geometry, physics, camera, lighting and UI procedurally.
This keeps everything in readable text/code, easy to diff and extend, with no
binary scene wiring to hand-author.

---

## Extending the game

The framework is built so the other mini-games and locations from the concept
board drop in cleanly:

- **New office locations** — add an entry to `GameState.LEVELS` (id, name, tint,
  coin cost, scene). It appears in Level Select automatically with unlock logic.
- **New mini-games** — create `scripts/games/<Game>.gd` (root `Node3D`) and a
  matching thin `.tscn`, then point a level's `"scene"` at it. Reuse
  `PaperBall.gd` and `Breakable.gd`.
- **More throwables** — stapler, sticky-note ball, rubber-band ball, paper
  airplane: copy `PaperBall.gd` and tweak mass / mesh / drag.
- **More breakables** — coffee mug, monitor, plant pot, picture frame, window,
  printer, desk lamp, folder stack: each is one `Breakable` instance with a
  size, color and point value.

### Roadmap (from the concept boards)
- [x] Trash Can paper toss (3D, flick physics, wind, breakables, scoring, coins, save)
- [x] 5 office locations with coin-gated unlocks
- [x] Live trajectory aim preview (gravity + wind accurate)
- [x] Bank shots (bounce off walls/desk) with bonus points
- [x] Combo multiplier for consecutive makes (up to x5)
- [x] Moving bin + fresh wind between shots
- [x] Per-location breakable prop sets (incl. rooftop window, printer, folders)
- [x] Ball flight trail
- [x] Multiple targets per room (moving bin + skill bins + basketball hoops)
- [x] 8 selectable throwables, each with its own physics + score multiplier
      (paper ball, sticky note, tape roll, crumpled cup, paper airplane,
      stapler, pencil, rubber-band ball)
- [ ] Desk basketball / bounce shot
- [ ] Finger-flick paper football field goal
- [ ] Power-ups (slow-mo, multi-ball, magnet, point boost, wind boost)
- [ ] Daily rewards, friends & online leaderboards

---

## Exporting

**📱 Full step-by-step iPhone / App Store / web-publish walkthrough:
[`docs/ios-deploy.md`](docs/ios-deploy.md).** The repo already ships the
pre-configured export presets (`export_presets.cfg`), the required 1024×1024
App Store icon (`icon_1024.png`), a privacy-policy page, and a live home for
the web build at `/office-toss-play/` on the site.

Quick version — install the matching **export templates** in Godot
(`Editor → Manage Export Templates`), then `Project → Export…`:

- **iOS** — requires a Mac with Xcode. The iOS preset is pre-filled (bundle id
  `com.dylanwilliams.officetoss`, icon wired up); add your Team ID, export the
  Xcode project, then build/sign in Xcode. Mobile renderer + portrait are
  already configured.
- **Web** — the Web preset outputs straight to `../office-toss-play/index.html`
  with thread support disabled (required for GitHub Pages hosting and iPhone
  Safari). Export, commit, push — it goes live at
  `https://williamsdg.github.io/office-toss-play/`.
- **Android** — add an Android preset, install the Android build template +
  SDK, then export an `.apk`/`.aab`.

---

## Assets

The MVP ships with procedural primitives so it runs out of the box. For real
low-poly art, all free / open-source routes from the design board work well:

- **[Kenney](https://kenney.nl/assets)** — huge CC0 library, ideal for low-poly,
  mobile-friendly office props.
- **[OpenGameArt](https://opengameart.org)** — CC0 low-poly packs for props and
  scenery.
- **[itch.io](https://itch.io/game-assets/free/tag-low-poly)** — extra free
  low-poly props for variety.
- **[Blender](https://www.blender.org)** — model / edit custom low-poly objects,
  export `.glb` and drag into Godot.
- **[TripoSR](https://github.com/VAST-AI-Research/TripoSR)** — experiment with
  single-image-to-3D for object generation.
- **Meshroom / photogrammetry** — better when you have multiple photos.

Drop `.glb`/`.gltf` files into the project and replace the `MeshInstance3D`
meshes built in code — the physics/collision and game logic stay the same.

---

## License

Game code: do as you like. Bundled engine is Godot (MIT). Any third-party art
you add keeps its own license — prefer CC0 (Kenney / OpenGameArt) to stay clear.
