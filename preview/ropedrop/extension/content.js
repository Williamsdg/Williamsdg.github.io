/* RopeDrop content script.
 * Auto-injects a floating ⚡ launcher button onto disneyworld.disney.go.com
 * and disneyland.disney.go.com. Tapping the launcher (or the toolbar icon)
 * opens an overlay that calls Disney's public Virtual Queue endpoint using
 * the page's existing session cookies and renders a clean summary.
 *
 * No credentials are sent anywhere except Disney's own servers.
 */
(function () {
  if (window.__ropeDropExtInit) return;
  window.__ropeDropExtInit = true;

  var host = location.hostname;
  var isWDW = /disneyworld\.disney\.go\.com$/.test(host);
  var isDLR = /disneyland\.disney\.go\.com$/.test(host);
  if (!isWDW && !isDLR) return;

  var resortLabel = isWDW ? "Walt Disney World" : "Disneyland Resort";
  var vqHost = isWDW
    ? "https://vqguest-svc-wdw.wdprapps.disney.com"
    : "https://vqguest-svc.wdprapps.disney.com";
  var llUrl = isWDW
    ? "https://disneyworld.disney.go.com/vas/"
    : "https://disneyland.disney.go.com/vas/";

  /* ---------------- floating launcher ---------------- */
  var launcher = document.createElement("button");
  launcher.id = "rd-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Open RopeDrop overlay");
  launcher.innerHTML = '<span class="rd-launch-spark">⚡</span><span class="rd-launch-label">RopeDrop</span>';
  document.documentElement.appendChild(launcher);
  launcher.addEventListener("click", openOverlay);

  /* Listen for the toolbar-icon trigger from background.js */
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
        '<div id="rd-body"><div id="rd-loading">Loading virtual queues from Disney…</div></div>' +
        '<div id="rd-footer">RopeDrop reads Disney\'s public queue data using your existing Disney session. Your credentials are never sent to Williams Digital.</div>' +
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

    loadQueues(root.querySelector("#rd-body"));
  }

  /* ---------------- fetch + render ---------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }

  function render(body, queues) {
    var html = '<div class="rd-section-title">Virtual Queues <span class="rd-pill">Live</span></div>';
    if (!queues || !queues.length) {
      html += '<div class="rd-card"><div><div class="rd-card-name">No virtual queues right now</div>' +
              '<div class="rd-card-sub">Disney isn\'t running any boarding groups at this resort today.</div></div></div>';
    } else {
      queues.forEach(function (q) {
        var name = q.name || q.queueName || "Queue";
        var state = (q.state || q.queueState || "").toUpperCase();
        var cls = "closed", label = "Closed";
        if (state === "OPEN" || state === "JOIN" || q.isAcceptingJoins) { cls = "open"; label = "Open — join now"; }
        else if (state === "PAUSED" || q.isAcceptingPartyCreation === false) { cls = "paused"; label = "Paused"; }
        else if (state) { label = state.charAt(0) + state.slice(1).toLowerCase(); }

        var nextStart = q.nextScheduledOpenTime || q.nextOpenTime;
        var sub = nextStart ? "Next window: " + esc(nextStart) : "";

        html += '<div class="rd-card">' +
                  '<div>' +
                    '<div class="rd-card-name">' + esc(name) + '</div>' +
                    (sub ? '<div class="rd-card-sub">' + sub + '</div>' : '') +
                  '</div>' +
                  '<div class="rd-status ' + cls + '">' + esc(label) + '</div>' +
                '</div>';
      });
    }
    html += '<div class="rd-section-title">Lightning Lane</div>';
    html += '<a id="rd-ll-btn" href="' + llUrl + '">⚡ Open Lightning Lane booking</a>';
    body.innerHTML = html;
  }

  function renderError(body, msg, hint) {
    body.innerHTML =
      '<div id="rd-error"><strong>Could not load queues.</strong><br>' + esc(msg) +
      (hint ? '<br><br>' + esc(hint) : "") + '</div>' +
      '<div class="rd-section-title">Lightning Lane</div>' +
      '<a id="rd-ll-btn" href="' + llUrl + '">⚡ Open Lightning Lane booking</a>';
  }

  function loadQueues(body) {
    fetch(vqHost + "/application/v1/guest/getQueues", {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" }
    })
      .then(function (r) {
        if (r.status === 401 || r.status === 403) throw new Error("Not signed in to My Disney Experience.");
        if (!r.ok) throw new Error("Disney responded " + r.status + ".");
        return r.json();
      })
      .then(function (data) {
        var list = (data && (data.queues || data.data || data)) || [];
        if (!Array.isArray(list)) list = [];
        render(body, list);
      })
      .catch(function (err) {
        var msg = (err && err.message) || "Unknown error.";
        var hint = /signed in/i.test(msg)
          ? "Sign in to disneyworld.com or disneyland.com, then try again."
          : "Disney may have changed their queue API. You can still book through the button below.";
        renderError(body, msg, hint);
      });
  }
})();
