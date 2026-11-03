# Getting Office Toss onto your iPhone (and the App Store)

Everything in the repo is already set up: the iOS and Web export presets are
pre-configured (`export_presets.cfg`), the required 1024×1024 App Store icon
exists (`icon_1024.png`), and the web build has a home on the site
(`/office-toss-play/`). This guide is the part only you can do, because it
needs your Mac and your Apple ID.

**The three hard requirements (no way around them):**

| Requirement | Why | Cost |
|---|---|---|
| A Mac | iOS apps can only be built/signed by Xcode, which is macOS-only | — |
| Xcode | Apple's build tool (Mac App Store) | Free |
| Apple Developer account | Free tier: run on *your own* iPhone (7-day installs). Paid tier: TestFlight + App Store | $0 / $99 per year |

No Mac? Skip to **Option B: the web build** at the bottom — it gets the game
onto your iPhone today, free, no Mac, no App Store.

---

## Option A: native iOS app

### Phase 1 — Run it on your own iPhone (free, ~30–45 min)

1. **One-time Mac setup**
   - Install **Xcode** from the Mac App Store, open it once, accept the license,
     let it install its components.
   - Install **Godot 4.3+** (standard build) from <https://godotengine.org/download>.
   - Clone/pull this repo and open `office-toss/project.godot` in Godot.
   - In Godot: **Editor → Manage Export Templates → Download and Install**
     (must match your Godot version exactly).

2. **Configure the preset** — **Project → Export…** and select the existing
   **iOS** preset. Two fields are yours to fill:
   - **App Store Team ID** — find it at
     <https://developer.apple.com/account> → Membership details (it's a
     10-character code like `A1B2C3D4E5`). With a free Apple ID, Xcode will
     create a "Personal Team" for you the first time you sign in (step 5) —
     you can leave this blank for now and let Xcode handle signing.
   - **Bundle Identifier** — pre-filled as `com.dylanwilliams.officetoss`;
     change it if you prefer. It must be globally unique and match what you
     register in App Store Connect later.

   The 1024×1024 icon is already wired up; Godot generates the smaller sizes
   from it automatically.

3. **Export** — click **Export Project…**, choose a folder *outside* the
   project (e.g. `~/builds/officetoss-ios/`). Godot produces an **Xcode
   project**, not a finished app. (Use "Export Project", not "Export PCK/ZIP".)

4. **Open in Xcode** — double-click the generated `.xcodeproj`.

5. **Sign it** — select the project in Xcode's sidebar → **Signing &
   Capabilities** tab:
   - Check **"Automatically manage signing"**.
   - **Team**: sign in with your Apple ID (Xcode → Settings → Accounts → +)
     and pick your team (a free "Personal Team" works for Phase 1).

6. **Run it** — plug your iPhone in via USB (or set up Wi-Fi debugging),
   pick it in the device dropdown at the top, press **▶**.
   - First run, on the iPhone: **Settings → General → VPN & Device
     Management** → trust your developer certificate.
   - Also enable **Settings → Privacy & Security → Developer Mode** (iOS 16+,
     phone will reboot).

   The game is now on your phone. With a free account the install expires
   after 7 days — just press ▶ again to refresh it.

**Iterating:** after changing the game, re-do step 3 (export over the same
folder) and press ▶ in Xcode. That's the whole loop.

### Phase 2 — TestFlight & the App Store (needs the $99/yr account)

1. **Enroll** in the Apple Developer Program: <https://developer.apple.com/programs/enroll/>
   (use the same Apple ID; approval is usually < 48 h).
2. **Create the app record** at <https://appstoreconnect.apple.com> →
   My Apps → **+** → New App: platform iOS, name "Office Toss" (names are
   unique store-wide — have a backup like "Office Toss 3D"), your bundle ID,
   primary category **Games → Casual**.
3. **Upload a build** — in Xcode: select **Any iOS Device (arm64)** as the
   target, then **Product → Archive** → **Distribute App** → **App Store
   Connect** → Upload. Wait ~15 min for processing.
4. **TestFlight** (recommended first): in App Store Connect → TestFlight tab,
   add yourself/friends as internal testers. They install via the TestFlight
   app. Shake out bugs here.
5. **Submit for review** — fill in the store listing:
   - Screenshots (6.7" and 6.5" iPhone sizes — take them in the iOS Simulator).
   - Description, keywords, support URL (your site works).
   - **Privacy policy URL** — required. This repo ships one at
     `https://williamsdg.github.io/office-toss-privacy.html` (the game collects
     nothing; the policy says so). In the "App Privacy" questionnaire answer
     **"Data Not Collected"** — true for this build (no analytics, no ads, no
     network calls).
   - Age rating questionnaire (this game: 4+).
   - Pricing: Free.
   Then **Add for Review**. Review typically takes 1–3 days. Fix-and-resubmit
   is normal if they bounce it.

### Common signing/build errors

| Error | Fix |
|---|---|
| "Failed to register bundle identifier" | The bundle ID is taken or malformed — change it in the Godot preset and re-export |
| "Signing requires a development team" | Xcode → Settings → Accounts → add your Apple ID, then pick the Team in Signing & Capabilities |
| "Device not eligible / untrusted developer" | On the phone: Settings → General → VPN & Device Management → Trust |
| "Developer Mode required" | Settings → Privacy & Security → Developer Mode → on (iOS 16+) |
| App installs then immediately expires | Free-account 7-day limit — re-run from Xcode, or enroll in the paid program |
| Archive button greyed out | Target must be "Any iOS Device (arm64)", not a simulator |

---

## Option B: the web build — on your iPhone today, no Mac, no $99

The **Web** export preset is already configured to output straight into this
repo's `office-toss-play/` folder, with **thread support disabled** — that
matters, because GitHub Pages can't send the special headers (COOP/COEP)
that threaded Godot web builds require, and single-threaded builds also run
much more reliably in iPhone Safari.

On **any** computer (Windows/Linux/Mac all fine):

1. Open the project in Godot, install export templates (same as above).
2. **Project → Export… → Web → Export Project…** — keep the pre-filled path
   (`office-toss-play/index.html`) and **uncheck "Export With Debug"**.
3. Commit and push the generated files:
   ```bash
   git add office-toss-play
   git commit -m "Add Office Toss web build"
   git push
   ```
4. Once merged to `main`, GitHub Pages deploys it automatically. Play at:
   **https://williamsdg.github.io/office-toss-play/**
5. On your iPhone: open that URL in Safari → Share → **Add to Home Screen**.
   It gets its own icon and launches full-screen like an app.

Trade-offs vs. native: no App Store listing, slightly slower load, needs an
initial network connection. But it's the fastest path from "code" to "playing
on my phone", and it doubles as a live demo link you can send anyone.
