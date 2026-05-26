/* RopeDrop content script — v2 (no Disney API calls).
 *
 * Disney's Akamai bot manager + Bearer auth requirement on
 * vqguest-svc-wdw.wdprapps.disney.com makes browser-based fetches to the
 * VQ/LL APIs unreliable. Rather than show a broken "Failed to fetch"
 * overlay, this version repurposes the extension as a one-tap launcher:
 * the floating ⚡ button opens a small overlay that links to RopeDrop's
 * live wait-times view (powered by queue-times.com, which actually works
 * from the browser).
 */
(function () {
  if (window.__ropeDropExtInit) return;
  window.__ropeDropExtInit = true;

  var host = location.hostname;
  var isWDW = /disneyworld\.disney\.go\.com$/.test(host);
  var isDLR = /disneyland\.disney\.go\.com$/.test(host);
  if (!isWDW && !isDLR) return;

  var resortLabel = isWDW ? "Walt Disney World" : "Disneyland Resort";
  var resortParam = isWDW ? "wdw" : "dlr";
  var launchpadUrl = "https://williamsdigital.io/preview/ropedrop/?from=ext&resort=" + resortParam;

  /* ---------------- floating launcher ---------------- */
  var launcher = document.createElement("button");
  launcher.id = "rd-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Open RopeDrop");
  launcher.innerHTML = '<span class="rd-launch-spark">⚡</span><span class="rd-launch-label">RopeDrop</span>';
  document.documentElement.appendChild(launcher);
  launcher.addEventListener("click", openOverlay);

  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(function (msg) {
      if (msg && msg.type === "ropedrop:open") openOverlay();
    });
  }

  /* ---------------- overlay ---------------- */
  function openOverlay() {
    if (document.getElementById("rd-helper")) return;

    var root = document.createElement("div");
    root.id = "rd-helper";
    root.innerHTML =
      '<div id="rd-panel" role="dialog" aria-label="RopeDrop">' +
        '<div id="rd-head">' +
          '<div id="rd-brand">' +
            '<svg viewBox="0 0 32 32" aria-hidden="true">' +
              '<circle cx="16" cy="16" r="15" fill="#fff"/>' +
              '<path d="M16 6 C 10 13, 10 19, 16 25 C 22 19, 22 13, 16 6 Z" fill="#5271ff"/>' +
              '<circle cx="16" cy="18.2" r="2.4" fill="#fff"/>' +
            '</svg>' +
            '<span>RopeDrop</span>' +
          '</div>' +
          '<button id="rd-close" type="button" aria-label="Close">×</button>' +
        '</div>' +
        '<div id="rd-resort">' + resortLabel + '</div>' +
        '<div id="rd-body">' +
          '<div class="rd-launch-copy">' +
            'See live attraction wait times for every ' + resortLabel + ' park, today\'s crowd forecast, and Lightning Lane / Virtual Queue quick-links.' +
          '</div>' +
          '<a href="' + launchpadUrl + '" target="_blank" rel="noopener" class="rd-launch-cta">' +
            '⚡ Open RopeDrop wait times →' +
          '</a>' +
          '<div class="rd-launch-meta">' +
            'Live data from queue-times.com · no install needed on phone' +
          '</div>' +
        '</div>' +
        '<div id="rd-footer">RopeDrop is not affiliated with The Walt Disney Company.</div>' +
      '</div>';
    document.documentElement.appendChild(root);

    function close() {
      root.remove();
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) { if (e.key === "Escape") close(); }
    root.querySelector("#rd-close").addEventListener("click", close);
    root.addEventListener("click", function (e) { if (e.target === root) close(); });
    document.addEventListener("keydown", onKey);
  }
})();
