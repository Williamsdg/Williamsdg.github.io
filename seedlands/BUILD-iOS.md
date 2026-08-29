# Seedlands → iOS (App Store) build guide

This turns the web game in `seedlands/` into a native iOS app using **Capacitor** (it wraps the existing HTML/JS — no rewrite). Run all of this **on your Mac**.

## Prerequisites (one-time)
- macOS with **Xcode** installed (from the Mac App Store), then run `xcode-select --install`
- **Node.js 18+** (`brew install node`)
- **CocoaPods** (`sudo gem install cocoapods` or `brew install cocoapods`)
- An **Apple Developer Program** membership ($99/yr) — required to submit. A free Apple ID can run on your own iPhone but cannot publish.

## 1. Create the Capacitor project
Do this in a **separate folder** (not inside the GitHub Pages repo), so the native project stays clean:

```bash
mkdir seedlands-ios && cd seedlands-ios
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/ios
npm install @capacitor/haptics @capacitor/share @capacitor/status-bar
npx cap init Seedlands com.williamsdg.seedlands --web-dir=www
```
> Pick your own bundle ID if you prefer (reverse-domain, e.g. `com.yourname.seedlands`). It must be unique in App Store Connect.

## 2. Drop the game in as the web assets
Copy the contents of this `seedlands/` folder into the new `www/` folder:

```bash
mkdir -p www
cp -R /path/to/Williamsdg.github.io/seedlands/* www/
# www/ should now contain index.html, manifest.webmanifest, sw.js, icon*.png, icon.svg
```

## 3. Add the iOS platform
```bash
npx cap add ios
npx cap sync
```

## 4. Generate all app icons from the source
```bash
npm install -D @capacitor/assets
# put the 1024 square icon where the tool expects it:
mkdir -p assets && cp www/icon-source-1024.png assets/icon.png
npx capacitor-assets generate --ios
```
This creates every required icon/splash size from the single 1024px source.

## 5. Open in Xcode and run on your iPhone
```bash
npx cap open ios
```
In Xcode:
1. Select the **App** target → **Signing & Capabilities** → set your **Team** (your Apple Developer account).
2. Plug in your iPhone, pick it as the run target, press **▶**. The game runs natively.

## 6. Submit to the App Store
1. In Xcode: **Product → Archive**.
2. In the Organizer window: **Distribute App → App Store Connect → Upload**.
3. At [appstoreconnect.apple.com](https://appstoreconnect.apple.com): create the app record (use the same bundle ID), fill in the listing (see `STORE.md`), attach the build, upload screenshots, and **Submit for Review**.
4. Apple review is typically 1–3 days.

## Updating later
Change the web files → `cp` them into `www/` again → `npx cap sync` → re-archive. That's the whole loop.

## Notes / gotchas
- **Orientation**: the manifest locks portrait; mirror that in Xcode (target → General → Deployment Info → only Portrait checked).
- **Service worker**: harmless inside the native wrapper (assets are bundled locally). You can keep it.
- **Haptics**: the web `navigator.vibrate` works in the wrapper, but for best feel optionally swap to `@capacitor/haptics` later.
- **No backend yet**: v1 stores best-scores locally (no accounts, no data collection) → simplest possible App Privacy review.
