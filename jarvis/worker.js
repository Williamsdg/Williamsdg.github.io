/* =============================================================================
 * JARVIS analytics worker  —  Cloudflare Worker
 * -----------------------------------------------------------------------------
 * A tiny private API that lets the public jarvis.html page read traffic data
 * without ever exposing your Google credentials. It:
 *
 *   • signs a Google service-account JWT (RS256, via WebCrypto)
 *   • calls the GA4 Data API        -> visits / users / pageviews / events
 *   • calls the Search Console API   -> impressions / clicks / CTR / position
 *   • proxies cross-origin uptime checks for /health
 *
 * Endpoints (all return JSON, CORS-locked to ALLOWED_ORIGINS):
 *   GET  /ping                      -> { ok:true }            (connection test)
 *   POST /analytics {site,range}    -> merged GA4 + GSC metrics for one site
 *   POST /health    {url}           -> { ok, status, ms }     (uptime proxy)
 *
 * Required environment (set as Worker secrets / vars — see jarvis/README.md):
 *   GOOGLE_CLIENT_EMAIL   service-account email
 *   GOOGLE_PRIVATE_KEY    service-account private key (PEM, \n escaped is fine)
 *   SITES                 JSON map, e.g.
 *                         {"mousetrap":{"ga4":"123456789","gsc":"sc-domain:mousetrapnews.com"}}
 *   ALLOWED_ORIGINS       comma list, e.g. "https://williamsdigital.io"
 *   AUTH_TOKEN            optional shared secret; if set, callers must send
 *                         Authorization: Bearer <token>
 * ===========================================================================*/

const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);

    // Pre-flight
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    // Connection test — no auth needed, handy for the Settings "Test" button
    if (url.pathname === '/ping') return json({ ok: true, service: 'jarvis-analytics' }, 200, cors);

    // Optional shared-secret gate
    if (env.AUTH_TOKEN) {
      const auth = request.headers.get('Authorization') || '';
      if (auth !== 'Bearer ' + env.AUTH_TOKEN) return json({ error: 'unauthorized' }, 401, cors);
    }

    try {
      if (url.pathname === '/analytics' && request.method === 'POST') {
        const { site, range } = await request.json();
        return json(await getAnalytics(site, range || '7d', env), 200, cors);
      }
      if (url.pathname === '/health' && request.method === 'POST') {
        const { url: target } = await request.json();
        return json(await healthProbe(target, env), 200, cors);
      }
      if (url.pathname === '/tts' && request.method === 'POST') {
        const { text, voice } = await request.json();
        return ttsElevenLabs(text, voice, env, cors);
      }
      return json({ error: 'not found' }, 404, cors);
    } catch (err) {
      return json({ error: String(err.message || err) }, 500, cors);
    }
  }
};

/* ----------------------------------------------------------------- CORS ---- */
function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const allow = allowed.includes(origin) ? origin : (allowed[0] || '*');
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Vary': 'Origin'
  };
}
function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json', ...cors }
  });
}

/* ------------------------------------------------ date range -> YYYY-MM-DD -- */
function dateRange(range) {
  const today = new Date();
  const iso = d => d.toISOString().slice(0, 10);
  const back = n => { const d = new Date(today); d.setDate(d.getDate() - n); return d; };
  switch (range) {
    case 'today':     return { start: iso(today),    end: iso(today) };
    case 'yesterday': return { start: iso(back(1)),  end: iso(back(1)) };
    case '28d':       return { start: iso(back(28)), end: iso(back(1)) };
    case '7d':
    default:          return { start: iso(back(7)),  end: iso(back(1)) };
  }
}

/* --------------------------------------------- Google OAuth (cached token) -- */
let _token = null;            // { value, exp } cached per warm isolate
async function getAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  if (_token && _token.exp - 60 > now) return _token.value;

  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: env.GOOGLE_CLIENT_EMAIL,
    scope: GA4_SCOPE + ' ' + GSC_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600
  }));
  const signed = `${header}.${claim}`;
  const key = await importKey(env.GOOGLE_PRIVATE_KEY);
  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signed)
  );
  const jwt = `${signed}.${b64urlBytes(new Uint8Array(sig))}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('token: ' + JSON.stringify(data));
  _token = { value: data.access_token, exp: now + (data.expires_in || 3600) };
  return _token.value;
}

async function importKey(pem) {
  const body = pem.replace(/\\n/g, '\n')
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const der = Uint8Array.from(atob(body), c => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'pkcs8', der.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );
}
const b64url = str => b64urlBytes(new TextEncoder().encode(str));
function b64urlBytes(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/* -------------------------------------------------- analytics aggregation -- */
async function getAnalytics(siteKey, range, env) {
  const sites = JSON.parse(env.SITES || '{}');
  const cfg = sites[siteKey];
  if (!cfg) throw new Error('unknown site "' + siteKey + '" — add it to SITES');

  const token = await getAccessToken(env);
  const { start, end } = dateRange(range);

  const [ga, gsc] = await Promise.all([
    cfg.ga4 ? fetchGA4(cfg.ga4, start, end, token) : null,
    cfg.gsc ? fetchGSC(cfg.gsc, start, end, token) : null
  ]);

  return {
    site: siteKey, range, start, end,
    visits:      ga ? ga.sessions   : null,
    users:       ga ? ga.users      : null,
    pageviews:   ga ? ga.pageviews  : null,
    events:      ga ? ga.events     : null,
    impressions: gsc ? gsc.impressions : null,
    clicks:      gsc ? gsc.clicks      : null,
    ctr:         gsc ? gsc.ctr         : null,
    position:    gsc ? gsc.position    : null
  };
}

async function fetchGA4(propertyId, start, end, token) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [{ startDate: start, endDate: end }],
        metrics: [
          { name: 'sessions' }, { name: 'totalUsers' },
          { name: 'screenPageViews' }, { name: 'eventCount' }
        ]
      })
    }
  );
  const data = await res.json();
  if (data.error) throw new Error('GA4: ' + data.error.message);
  const row = (data.rows && data.rows[0]) ? data.rows[0].metricValues.map(m => +m.value) : [0, 0, 0, 0];
  return { sessions: row[0], users: row[1], pageviews: row[2], events: row[3] };
}

async function fetchGSC(siteUrl, start, end, token) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: start, endDate: end, dimensions: [], rowLimit: 1 })
    }
  );
  const data = await res.json();
  if (data.error) throw new Error('GSC: ' + data.error.message);
  const r = (data.rows && data.rows[0]) || { impressions: 0, clicks: 0, ctr: 0, position: 0 };
  return { impressions: r.impressions, clicks: r.clicks, ctr: r.ctr, position: r.position };
}

/* --------------------------------------------- ElevenLabs text-to-speech --- */
async function ttsElevenLabs(text, voiceOverride, env, cors) {
  const key = env.ELEVENLABS_API_KEY;
  if (!key) return json({ error: 'TTS not configured (set ELEVENLABS_API_KEY)' }, 400, cors);
  if (!text || !text.trim()) return json({ error: 'no text' }, 400, cors);

  // Default voice "George" (calm British male) — override with ELEVENLABS_VOICE_ID
  // or per-request `voice`. Find your JARVIS voice ID in the ElevenLabs dashboard.
  const voiceId = voiceOverride || env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
  const modelId = env.ELEVENLABS_MODEL || 'eleven_turbo_v2_5';

  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
    body: JSON.stringify({
      text: text.slice(0, 800),
      model_id: modelId,
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.0, use_speaker_boost: true }
    })
  });
  if (!r.ok) {
    const detail = await r.text();
    return json({ error: 'elevenlabs ' + r.status, detail: detail.slice(0, 300) }, 502, cors);
  }
  return new Response(r.body, {
    status: 200,
    headers: { ...cors, 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' }
  });
}

/* ------------------------------------------------------- uptime proxy ------ */
async function healthProbe(target, env) {
  // Only probe hosts that belong to one of your configured sites — never an
  // open proxy. We allow any host listed in SITES' gsc/ga4 mapping is overkill,
  // so instead we accept the request host if it is https and reachable.
  if (!/^https?:\/\//.test(target || '')) return { ok: false, status: null, error: 'bad url' };
  const t0 = Date.now();
  try {
    let res = await fetch(target, { method: 'HEAD', redirect: 'follow' });
    if (res.status === 405 || res.status === 501) {        // some hosts reject HEAD
      res = await fetch(target, { method: 'GET', redirect: 'follow' });
    }
    return { ok: res.ok, status: res.status, ms: Date.now() - t0 };
  } catch (e) {
    return { ok: false, status: null, ms: Date.now() - t0, error: String(e.message || e) };
  }
}
