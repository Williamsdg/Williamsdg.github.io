#!/usr/bin/env bash
# =============================================================================
# JARVIS worker — one-shot setup. Sets secrets and deploys the Cloudflare Worker.
# Run from this folder:  cd jarvis && ./setup.sh
# Everything is optional — skip a section by pressing Enter.
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")"

bold() { printf '\033[1m%s\033[0m\n' "$1"; }
need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing '$1'. Install it first."; exit 1; }; }
need wrangler
need python3

bold "JARVIS worker setup — secrets are sent straight to Cloudflare, never written to disk."
echo

# --- 1. Google Analytics 4 + Search Console (real traffic numbers) -----------
bold "1) Traffic numbers (GA4 + Search Console)"
read -rp "   Path to your Google service-account JSON (Enter to skip): " GJSON
if [[ -n "${GJSON:-}" ]]; then
  [[ -f "$GJSON" ]] || { echo "   File not found: $GJSON"; exit 1; }
  EMAIL=$(python3 -c "import json;print(json.load(open('$GJSON'))['client_email'])")
  KEY=$(python3   -c "import json;print(json.load(open('$GJSON'))['private_key'])")
  printf '%s' "$EMAIL" | wrangler secret put GOOGLE_CLIENT_EMAIL
  printf '%s' "$KEY"   | wrangler secret put GOOGLE_PRIVATE_KEY
  echo
  echo "   Now put your real GA4 Property IDs into sites.example.json"
  echo "   (each site's Admin → Property Settings → Property ID)."
  read -rp "   Press Enter once sites.example.json is filled in... " _
  python3 -c "import json;json.load(open('sites.example.json'))" \
    || { echo "   sites.example.json isn't valid JSON — fix and re-run."; exit 1; }
  wrangler secret put SITES < sites.example.json
  echo "   ✓ GA4/GSC configured."
fi
echo

# --- 2. ElevenLabs (the exact JARVIS voice) ----------------------------------
bold "2) Exact JARVIS voice (ElevenLabs)"
read -rsp "   ElevenLabs API key (Enter to skip): " ELKEY; echo
if [[ -n "${ELKEY:-}" ]]; then
  printf '%s' "$ELKEY" | wrangler secret put ELEVENLABS_API_KEY
  read -rp "   Voice ID (calm British male; Enter for default 'George'): " ELVOICE
  [[ -n "${ELVOICE:-}" ]] && printf '%s' "$ELVOICE" | wrangler secret put ELEVENLABS_VOICE_ID
  echo "   ✓ Voice configured."
fi
echo

# --- 3. Optional shared token ------------------------------------------------
bold "3) Optional shared token (locks the API beyond CORS)"
read -rp "   AUTH_TOKEN (Enter to skip): " TOK
[[ -n "${TOK:-}" ]] && { printf '%s' "$TOK" | wrangler secret put AUTH_TOKEN; echo "   ✓ Token set — paste the same value into JARVIS → Settings."; }
echo

# --- 4. Deploy ---------------------------------------------------------------
bold "4) Deploying..."
wrangler deploy
echo
bold "Done. Copy the printed *.workers.dev URL into JARVIS → gear ⚙️ → Analytics worker URL → Save."
echo "Then set Voice engine = ElevenLabs (if you configured it) and ask: \"how is Mousetrap doing this week?\""
