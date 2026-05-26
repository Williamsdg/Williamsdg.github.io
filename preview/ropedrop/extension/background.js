/* Service worker:
 *  - Click toolbar icon → tell content script to open the overlay.
 *  - On request from content script: gather user's Disney cookies and
 *    return them so the content script can POST to RopeDrop's /api/connect.
 */
const ROPEDROP_API = "https://ropedrop.williamsdigital.io"; // also accepts ropedrop-app.vercel.app via CORS

chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;
  chrome.tabs.sendMessage(tab.id, { type: "ropedrop:open" }).catch(() => {
    chrome.tabs.create({ url: "https://williamsdigital.io/preview/ropedrop/" });
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "ropedrop:gather-disney-cookies") {
    gatherCookies(msg.resort || "wdw").then(sendResponse);
    return true; // keep channel open for async sendResponse
  }
});

async function gatherCookies(resort) {
  /* Pull cookies from the Disney domains we know carry the session. */
  const domains = [
    "disneyworld.disney.go.com",
    "disneyland.disney.go.com",
    ".disney.go.com",
    ".go.com"
  ];

  const seen = new Map();
  for (const domain of domains) {
    try {
      const cookies = await chrome.cookies.getAll({ domain });
      for (const c of cookies) {
        const key = c.name;
        // last-write-wins on cookie name; more specific domain comes later in array
        seen.set(key, c);
      }
    } catch (err) {
      // ignore — some domains may have nothing
    }
  }

  if (!seen.size) {
    return { ok: false, error: "Could not read Disney cookies. Make sure you're signed into disneyworld.com or disneyland.com first." };
  }

  /* Build a single Cookie header string. */
  const cookieString = Array.from(seen.values())
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  /* Try to find the SWID (guest ID) for backend convenience. */
  const swidCookie = seen.get("SWID") || seen.get("swid");
  const swid = swidCookie ? swidCookie.value.replace(/[{}]/g, "") : null;

  return { ok: true, cookie: cookieString, swid, resort };
}
