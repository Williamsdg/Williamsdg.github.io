/* RopeDrop live data overlay.
 * Fetches real, live attraction wait times from queue-times.com — a free
 * public API that doesn't require a key or any user authentication. No
 * Disney credentials are involved at any layer.
 *
 * Each park button on the launchpad opens this overlay scoped to the
 * right resort and shows every operating ride with its current wait,
 * status, and "last updated" timestamp from the source.
 *
 * Real Lightning Lane / Virtual Queue data still requires the browser
 * extension or bookmarklet — those run inside Disney's signed-in page.
 * Booking links at the bottom of the overlay hand off to Disney.
 */
(function () {
  const PARKS = {
    wdw: {
      resortLabel: "Walt Disney World",
      llUrl: "https://disneyworld.disney.go.com/vas/",
      vqUrl: "https://disneyworld.disney.go.com/virtual-queue/",
      sections: [
        { id: 6, name: "Magic Kingdom" },
        { id: 5, name: "EPCOT" },
        { id: 7, name: "Hollywood Studios" },
        { id: 8, name: "Animal Kingdom" }
      ]
    },
    dlr: {
      resortLabel: "Disneyland Resort",
      llUrl: "https://disneyland.disney.go.com/vas/",
      vqUrl: "https://disneyland.disney.go.com/virtual-queue/",
      sections: [
        { id: 16, name: "Disneyland Park" },
        { id: 17, name: "Disney California Adventure" }
      ]
    }
  };

  const SOURCE = "https://queue-times.com";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function timeAgo(iso) {
    if (!iso) return "—";
    const then = new Date(iso).getTime();
    const now = Date.now();
    const sec = Math.max(0, Math.floor((now - then) / 1000));
    if (sec < 60) return sec + "s ago";
    const min = Math.floor(sec / 60);
    if (min < 60) return min + "m ago";
    const hr = Math.floor(min / 60);
    return hr + "h ago";
  }

  function waitClass(wait, isOpen) {
    if (!isOpen) return "closed";
    if (wait <= 15) return "short";
    if (wait <= 40) return "medium";
    if (wait <= 70) return "long";
    return "huge";
  }

  function flattenRides(payload) {
    const rides = [];
    (payload.lands || []).forEach((land) => {
      (land.rides || []).forEach((r) => rides.push(Object.assign({ land: land.name }, r)));
    });
    (payload.rides || []).forEach((r) => rides.push(Object.assign({ land: "" }, r)));
    return rides;
  }

  async function fetchPark(id) {
    const res = await fetch(SOURCE + "/parks/" + id + "/queue_times.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Source responded " + res.status);
    const data = await res.json();
    return flattenRides(data);
  }

  function renderRides(rides) {
    /* Sort: open rides first, then by wait time descending so headliners
     * surface at the top of each park section. */
    rides.sort((a, b) => {
      if (a.is_open !== b.is_open) return a.is_open ? -1 : 1;
      return (b.wait_time || 0) - (a.wait_time || 0);
    });

    return rides
      .map((r) => {
        const cls = waitClass(r.wait_time, r.is_open);
        const right = r.is_open
          ? '<span class="rd-live-wait ' + cls + '"><strong>' + (r.wait_time || 0) + '</strong> min</span>'
          : '<span class="rd-live-wait closed">Closed</span>';
        return (
          '<div class="rd-live-row">' +
            '<div class="rd-live-row-main">' +
              '<div class="rd-live-name">' + esc(r.name) + '</div>' +
              (r.land ? '<div class="rd-live-land">' + esc(r.land) + '</div>' : "") +
            '</div>' +
            right +
          '</div>'
        );
      })
      .join("");
  }

  window.RopeDropLive = {
    async open(park) {
      const data = PARKS[park] || PARKS.wdw;

      const existing = document.getElementById("rd-live");
      if (existing) existing.remove();

      const root = document.createElement("div");
      root.id = "rd-live";

      const sectionTabs = data.sections
        .map((s, i) => '<button class="rd-live-tab' + (i === 0 ? " active" : "") + '" data-section="' + s.id + '" type="button">' + esc(s.name) + '</button>')
        .join("");

      const sectionPanes = data.sections
        .map((s, i) => '<section class="rd-live-pane' + (i === 0 ? " active" : "") + '" data-pane="' + s.id + '"><div class="rd-live-loading">Loading live wait times…</div></section>')
        .join("");

      root.innerHTML =
        '<div class="rd-live-panel" role="dialog" aria-label="' + esc(data.resortLabel) + ' live wait times">' +
          '<div class="rd-live-head">' +
            '<div class="rd-live-brand">' +
              '<svg viewBox="0 0 32 32" aria-hidden="true">' +
                '<circle cx="16" cy="16" r="15" fill="#fff"/>' +
                '<path d="M16 6 C 10 13, 10 19, 16 25 C 22 19, 22 13, 16 6 Z" fill="#5271ff"/>' +
                '<circle cx="16" cy="18.2" r="2.4" fill="#fff"/>' +
              '</svg>' +
              '<div class="rd-live-brand-text">' +
                '<div class="rd-live-title">RopeDrop</div>' +
                '<div class="rd-live-sub">' + esc(data.resortLabel) + '</div>' +
              '</div>' +
            '</div>' +
            '<button class="rd-live-close" type="button" aria-label="Close">×</button>' +
          '</div>' +

          '<div class="rd-live-status">' +
            '<span class="rd-live-pill live">● LIVE</span>' +
            '<span class="rd-live-source">Live attraction wait times from queue-times.com</span>' +
            '<span class="rd-live-updated" id="rd-live-updated">Updated just now</span>' +
          '</div>' +

          '<div class="rd-live-tabs" role="tablist">' + sectionTabs + '</div>' +
          '<div class="rd-live-body">' + sectionPanes + '</div>' +

          '<div class="rd-live-actions">' +
            '<a class="rd-live-cta primary" href="' + data.llUrl + '" target="_blank" rel="noopener">⚡ Book Lightning Lane on Disney →</a>' +
            '<a class="rd-live-cta" href="' + data.vqUrl + '" target="_blank" rel="noopener">🌐 Join Virtual Queue on Disney →</a>' +
          '</div>' +

          '<div class="rd-live-foot">' +
            'Live wait times are sourced from queue-times.com. Lightning Lane and Virtual Queue actions require signing into My Disney Experience — install the <a href="getstarted.html#extension">browser extension</a> or <a href="getstarted.html#helper">bookmarklet</a> for a clean LL/VQ overlay on Disney\'s site.' +
          '</div>' +
        '</div>';
      document.body.appendChild(root);
      requestAnimationFrame(() => root.classList.add("show"));

      function close() {
        root.classList.remove("show");
        setTimeout(() => root.remove(), 180);
        document.removeEventListener("keydown", onKey);
      }
      function onKey(e) { if (e.key === "Escape") close(); }
      root.querySelector(".rd-live-close").addEventListener("click", close);
      root.addEventListener("click", (e) => { if (e.target === root) close(); });
      document.addEventListener("keydown", onKey);

      /* tabs */
      const tabs = root.querySelectorAll(".rd-live-tab");
      const panes = root.querySelectorAll(".rd-live-pane");
      tabs.forEach((t) =>
        t.addEventListener("click", () => {
          tabs.forEach((x) => x.classList.toggle("active", x === t));
          panes.forEach((p) => p.classList.toggle("active", p.dataset.pane === t.dataset.section));
        })
      );

      /* fetch each park concurrently and fill in its pane */
      let latestUpdate = 0;
      await Promise.all(
        data.sections.map(async (s) => {
          const pane = root.querySelector('.rd-live-pane[data-pane="' + s.id + '"]');
          try {
            const rides = await fetchPark(s.id);
            if (!rides.length) {
              pane.innerHTML = '<div class="rd-live-empty">No wait times reported for ' + esc(s.name) + ' right now.</div>';
              return;
            }
            rides.forEach((r) => {
              const t = r.last_updated ? new Date(r.last_updated).getTime() : 0;
              if (t > latestUpdate) latestUpdate = t;
            });
            pane.innerHTML = renderRides(rides);
          } catch (err) {
            pane.innerHTML =
              '<div class="rd-live-error"><strong>Couldn\'t reach the live data source.</strong><br>' +
              esc((err && err.message) || "Unknown error.") +
              '<br><br>You can still tap the buttons below to book through Disney directly.</div>';
          }
        })
      );

      const updatedEl = root.querySelector("#rd-live-updated");
      if (updatedEl && latestUpdate) {
        updatedEl.textContent = "Updated " + timeAgo(new Date(latestUpdate).toISOString());
      }
    }
  };
})();
