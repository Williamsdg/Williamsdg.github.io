# JARVIS — site ops assistant

A voice-driven assistant for the Williams Digital live sites. Ask it out loud (or
by typing) to **run health checks**, pull **visits / search impressions / clicks**,
or give you a **morning briefing**.

- **Page:** [`/jarvis.html`](../jarvis.html) — runs 100% in your browser.
- **Voice:** the browser's built-in Web Speech API (free, no keys). Works best in
  desktop **Chrome / Edge** and Chrome on Android. Safari/iOS support is partial.
- **Sites tracked:** Buy Auburn, Vardar Transportation, Shannon Harris Art,
  Mousetrap News, Cartpath Club. Edit the `SITES` list near the top of
  `jarvis.html`'s `<script>` to add/remove.

Health checks work immediately. Traffic numbers need the worker below.

---

## Why a worker?

GitHub Pages is static, so anything in `jarvis.html` is **public**. A Google API key
sitting in a public page would be stolen in minutes. The Cloudflare Worker
(`worker.js`) is a tiny private server that *holds the key* and hands back only the
numbers — visits, impressions, clicks. Free tier is far more than enough.

```
 Browser (jarvis.html)  ──fetch──▶  Cloudflare Worker  ──signed JWT──▶  Google APIs
   public, no secrets               holds the secret              GA4 + Search Console
```

---

## One-time setup (~10–15 min)

### 1. Create a Google service account
1. Go to <https://console.cloud.google.com/> → create or pick a project.
2. **APIs & Services → Enable APIs** → enable both:
   - **Google Analytics Data API**
   - **Google Search Console API**
3. **APIs & Services → Credentials → Create credentials → Service account.**
   Name it `jarvis`. Skip the optional role steps → **Done.**
4. Open the new service account → **Keys → Add key → Create new key → JSON.**
   A `.json` file downloads. Inside it you'll use two fields:
   `client_email` and `private_key`.

### 2. Grant it read access to your data
- **GA4:** for each property, Admin → **Property Access Management** → add the
  service-account email (`...@...iam.gserviceaccount.com`) as **Viewer**.
  Note each property's numeric **Property ID** (Admin → Property Settings).
- **Search Console:** for each site, Settings → **Users and permissions** → add the
  same email as a **Restricted/Full** user.

> Don't have GA4 / Search Console on these sites yet? See
> [**Adding tracking to the sites**](#adding-tracking-to-the-sites) below first.

### 3. Deploy the worker
Install the Cloudflare CLI and deploy:

```bash
npm install -g wrangler
cd jarvis
wrangler login
wrangler deploy            # uses wrangler.toml in this folder
```

Then set the secrets/vars (run from `jarvis/`):

```bash
# the service-account email
wrangler secret put GOOGLE_CLIENT_EMAIL
# the FULL private key from the JSON, including BEGIN/END lines.
# Paste it exactly; literal \n inside the string is fine.
wrangler secret put GOOGLE_PRIVATE_KEY

# which sites map to which GA4 property + Search Console URL.
# Fill in your real Property IDs. gsc is "sc-domain:<domain>" for a
# domain property, or the full "https://..." for a URL-prefix property.
wrangler secret put SITES
```

Paste this for `SITES` (replace the `ga4` numbers with your real Property IDs):

```json
{
  "buyauburn":     { "ga4": "PROPERTY_ID", "gsc": "sc-domain:buyauburn.com" },
  "vardar":        { "ga4": "PROPERTY_ID", "gsc": "sc-domain:vardartransportation.com" },
  "shannonharris": { "ga4": "PROPERTY_ID", "gsc": "sc-domain:shannonharrisart.com" },
  "mousetrap":     { "ga4": "PROPERTY_ID", "gsc": "sc-domain:mousetrapnews.com" },
  "cartpath":      { "ga4": "PROPERTY_ID", "gsc": "sc-domain:cartpathclub.com" }
}
```

The `ALLOWED_ORIGINS` var (locking the API to your site) and optional
`AUTH_TOKEN` are configured in `wrangler.toml`. If you set an `AUTH_TOKEN`,
put the same value in Jarvis → Settings.

### 4. Connect Jarvis
1. Open `https://williamsdigital.io/jarvis.html`.
2. Click the gear (top right) → paste your worker URL
   (`https://jarvis-analytics.<you>.workers.dev`) → **Test connection** → **Save.**
3. Say *"give me the morning briefing."*

---

## Adding tracking to the sites

`impressions`/`clicks` come from **Search Console** (no code needed — just verify
the domain once). `visits`/`users` come from **GA4**, which needs its snippet on
each site. Add this to each site's `<head>` (one GA4 Measurement ID per property):

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Search clicks/impressions backfill automatically once verified; GA4 starts
collecting from the moment the snippet is live.

---

## Worker API reference

| Endpoint | Method | Body | Returns |
|---|---|---|---|
| `/ping` | GET | — | `{ ok: true }` (used by the Settings "Test" button) |
| `/analytics` | POST | `{ site, range }` | visits, users, pageviews, events, impressions, clicks, ctr, position |
| `/health` | POST | `{ url }` | `{ ok, status, ms }` cross-origin uptime probe |
| `/tts` | POST | `{ text, voice? }` | `audio/mpeg` — ElevenLabs speech (the exact JARVIS voice) |

`range` is one of `today`, `yesterday`, `7d`, `28d`.

---

## Voice commands

- "Hey Jarvis, how's it going today?" → time-aware greeting + live status
- "Morning briefing" / "rundown" → health checks **+** traffic
- "Check all sites for issues" · "Is Mousetrap up?"
- "How is Buy Auburn doing this week?" · "Traffic for Vardar this month"
- "Which site is leading?" · "Compare my sites"
- "Open Shannon Harris Art"
- "Play my theme" / "suit up" · "Stop the music"
- Hands-free mode: toggle it, then start any command with **"Hey Jarvis, …"**

## The JARVIS voice — three tiers

Pick the engine in **Settings → Voice engine**. Each falls back to the next if unavailable.

1. **ElevenLabs (exact match, paid)** — the closest to the films. The API key lives
   in your worker; the page only calls `/tts`. Add these to the worker:
   ```bash
   wrangler secret put ELEVENLABS_API_KEY        # your ElevenLabs key
   wrangler secret put ELEVENLABS_VOICE_ID       # the voice ID for your JARVIS voice
   # optional: ELEVENLABS_MODEL (default eleven_turbo_v2_5, low latency)
   ```
   Find/clone a calm **British male** voice in the ElevenLabs dashboard and copy its
   **Voice ID**. You can also override per-device in Settings → *ElevenLabs voice ID*.
   Then set **Voice engine = ElevenLabs** and make sure the worker URL is filled in.

2. **Kokoro (open-source, free, no key)** — an 82M-param neural voice that runs
   entirely in your browser via WebAssembly ([kokoro-js](https://www.npmjs.com/package/kokoro-js)).
   First use downloads ~80MB (cached after that). British male voices:
   `bm_george`, `bm_lewis`, `bm_daniel`, `bm_fable`. Set **Voice engine = Neural**
   and pick one — no setup required. Needs a modern browser (Chrome/Edge best).

3. **Browser voice (free, instant)** — the Web Speech API. For the best result use
   **Microsoft Edge** and choose a "Ryan / Thomas (Natural)" voice.

## Theme song / boot sound

On the first click, Jarvis plays a synthesized **arc-reactor power-up chime**,
then a **theme**. By default the theme is a built-in synthesized JARVIS riff
(no copyright, always plays). To use a real track — e.g. AC/DC **"Shoot to
Thrill"** — paste a YouTube link or a direct `.mp3` URL in **Settings → Theme
song**. Heads-up: some official music videos disable embedding, in which case
they won't autoplay; a direct audio URL or a different upload always will.
Browsers block autoplay until you interact, so the music starts on your first
click, not on page load.

## Privacy & cost
- No analytics data is stored anywhere — Jarvis fetches it live and shows it.
- Cloudflare Workers free tier: 100k requests/day. You'll use a handful.
- The worker only answers your origin (`ALLOWED_ORIGINS`) and, if you set one,
  requires a bearer token.
