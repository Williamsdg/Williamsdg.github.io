/* RopeDrop demo overlay.
 * Renders a polished Lightning Lane + Virtual Queue UI populated with
 * realistic SAMPLE data per park. Used on the launchpad so visitors can
 * see what the experience looks like without installing the extension.
 *
 * Real (live) data only comes from the browser extension or the helper
 * bookmarklet, both of which run inside Disney's authenticated page.
 */
(function () {
  /* ---------------- sample data ---------------- */
  /* Numbers are illustrative, refreshed each time the overlay opens
   * so the "live" pill feels alive. Attraction names are real, statuses
   * are plausible for a typical operating day. */
  const SAMPLE = {
    wdw: {
      resortLabel: "Walt Disney World",
      llUrl: "https://disneyworld.disney.go.com/vas/",
      vqUrl: "https://disneyworld.disney.go.com/virtual-queue/",
      vq: [
        { name: "TRON Lightcycle / Run", park: "Magic Kingdom", base: { state: "OPEN", group: 42, eta: "10:35 AM" } },
        { name: "Guardians of the Galaxy: Cosmic Rewind", park: "EPCOT", base: { state: "OPEN", group: 18, eta: "9:20 AM" } }
      ],
      ll: [
        { name: "Seven Dwarfs Mine Train", park: "Magic Kingdom", price: 15, next: "11:50 AM – 12:50 PM" },
        { name: "Remy's Ratatouille Adventure", park: "EPCOT", price: 12, next: "1:15 PM – 2:15 PM" },
        { name: "Slinky Dog Dash", park: "Hollywood Studios", price: 14, next: "10:40 AM – 11:40 AM" },
        { name: "Avatar Flight of Passage", park: "Animal Kingdom", price: 18, next: "3:25 PM – 4:25 PM" }
      ]
    },
    dlr: {
      resortLabel: "Disneyland Resort",
      llUrl: "https://disneyland.disney.go.com/vas/",
      vqUrl: "https://disneyland.disney.go.com/virtual-queue/",
      vq: [
        { name: "WEB SLINGERS: A Spider-Man Adventure", park: "Disney California Adventure", base: { state: "OPEN", group: 24, eta: "10:05 AM" } }
      ],
      ll: [
        { name: "Radiator Springs Racers", park: "Disney California Adventure", price: 20, next: "12:20 PM – 1:20 PM" },
        { name: "Rise of the Resistance", park: "Disneyland Park", price: 25, next: "2:40 PM – 3:40 PM" },
        { name: "Space Mountain", park: "Disneyland Park", price: 14, next: "11:00 AM – 12:00 PM" },
        { name: "Indiana Jones Adventure", park: "Disneyland Park", price: 14, next: "1:30 PM – 2:30 PM" }
      ]
    }
  };

  /* Lightly randomise the boarding group + ETA each open so the
   * "Live · sample data" pill feels current. */
  function freshenVQ(items) {
    return items.map((it) => {
      const group = it.base.group + Math.floor(Math.random() * 6);
      const baseMinutes = parseEta(it.base.eta);
      const drift = Math.floor(Math.random() * 30) - 10;
      return {
        name: it.name,
        park: it.park,
        state: it.base.state,
        group: group,
        eta: formatEta(baseMinutes + drift)
      };
    });
  }
  function parseEta(s) {
    const m = s.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!m) return 600;
    let h = parseInt(m[1], 10) % 12;
    if (/PM/i.test(m[3])) h += 12;
    return h * 60 + parseInt(m[2], 10);
  }
  function formatEta(total) {
    if (total < 0) total += 24 * 60;
    total = total % (24 * 60);
    let h = Math.floor(total / 60);
    const m = total % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + String(m).padStart(2, "0") + " " + ampm;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- public API ---------------- */
  window.RopeDropDemo = {
    open(park, action) {
      const data = SAMPLE[park] || SAMPLE.wdw;
      const focusVQ = action === "vq";

      const existing = document.getElementById("rd-demo");
      if (existing) existing.remove();

      const vq = freshenVQ(data.vq);

      const root = document.createElement("div");
      root.id = "rd-demo";
      root.innerHTML = `
        <div class="rd-demo-panel" role="dialog" aria-label="${esc(data.resortLabel)} — sample queue data">
          <div class="rd-demo-head">
            <div class="rd-demo-brand">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="15" fill="#fff"/>
                <path d="M16 6 C 10 13, 10 19, 16 25 C 22 19, 22 13, 16 6 Z" fill="#5271ff"/>
                <circle cx="16" cy="18.2" r="2.4" fill="#fff"/>
              </svg>
              <div class="rd-demo-brand-text">
                <div class="rd-demo-title">RopeDrop</div>
                <div class="rd-demo-sub">${esc(data.resortLabel)}</div>
              </div>
            </div>
            <button class="rd-demo-close" type="button" aria-label="Close">×</button>
          </div>

          <div class="rd-demo-tabs" role="tablist">
            <button class="rd-demo-tab ${focusVQ ? "active" : ""}" data-tab="vq" role="tab">🌐 Virtual Queue</button>
            <button class="rd-demo-tab ${focusVQ ? "" : "active"}" data-tab="ll" role="tab">⚡ Lightning Lane</button>
          </div>

          <div class="rd-demo-body">
            <section class="rd-demo-pane ${focusVQ ? "active" : ""}" data-pane="vq">
              <div class="rd-demo-section-title">
                <span>Today's Boarding Groups</span>
                <span class="rd-demo-pill">Live · sample data</span>
              </div>
              ${
                vq.length
                  ? vq
                      .map(
                        (q) => `
                <div class="rd-demo-card">
                  <div class="rd-demo-card-main">
                    <div class="rd-demo-card-name">${esc(q.name)}</div>
                    <div class="rd-demo-card-sub">${esc(q.park)} · Now boarding Group <strong>${q.group}</strong> · est. ${esc(q.eta)}</div>
                  </div>
                  <button class="rd-demo-action open" type="button" data-mock="join">Join queue</button>
                </div>`
                      )
                      .join("")
                  : `<div class="rd-demo-empty">No virtual queues running right now.</div>`
              }

              <a class="rd-demo-link" href="${data.vqUrl}" target="_blank" rel="noopener">Open Disney's official Virtual Queue page →</a>
            </section>

            <section class="rd-demo-pane ${focusVQ ? "" : "active"}" data-pane="ll">
              <div class="rd-demo-section-title">
                <span>Lightning Lane Multi Pass · Next Available</span>
                <span class="rd-demo-pill">Sample data</span>
              </div>
              ${data.ll
                .map(
                  (a) => `
                <div class="rd-demo-card">
                  <div class="rd-demo-card-main">
                    <div class="rd-demo-card-name">${esc(a.name)}</div>
                    <div class="rd-demo-card-sub">${esc(a.park)} · Next return <strong>${esc(a.next)}</strong></div>
                  </div>
                  <button class="rd-demo-action" type="button" data-mock="book">Book · $${a.price}</button>
                </div>`
                )
                .join("")}

              <a class="rd-demo-link" href="${data.llUrl}" target="_blank" rel="noopener">Open Disney's official Lightning Lane page →</a>
            </section>
          </div>

          <div class="rd-demo-foot">
            <span>This is a preview of the RopeDrop overlay. Live queue data requires the <a href="getstarted.html#extension">browser extension</a> or <a href="getstarted.html#helper">bookmarklet</a>, which run inside Disney's signed-in page.</span>
          </div>
        </div>
      `;
      document.body.appendChild(root);
      requestAnimationFrame(() => root.classList.add("show"));

      function close() {
        root.classList.remove("show");
        setTimeout(() => root.remove(), 180);
        document.removeEventListener("keydown", onKey);
      }
      function onKey(e) { if (e.key === "Escape") close(); }
      root.querySelector(".rd-demo-close").addEventListener("click", close);
      root.addEventListener("click", (e) => { if (e.target === root) close(); });
      document.addEventListener("keydown", onKey);

      /* tabs */
      const tabs = root.querySelectorAll(".rd-demo-tab");
      const panes = root.querySelectorAll(".rd-demo-pane");
      tabs.forEach((t) =>
        t.addEventListener("click", () => {
          tabs.forEach((x) => x.classList.toggle("active", x === t));
          panes.forEach((p) => p.classList.toggle("active", p.dataset.pane === t.dataset.tab));
        })
      );

      /* mock action buttons — show a friendly toast that this is a demo */
      root.querySelectorAll(".rd-demo-action").forEach((b) => {
        b.addEventListener("click", () => {
          const original = b.textContent;
          b.classList.add("flash");
          b.textContent = b.dataset.mock === "join" ? "Joined ✓" : "Held ✓";
          setTimeout(() => {
            b.textContent = original;
            b.classList.remove("flash");
          }, 1500);
        });
      });
    }
  };
})();
