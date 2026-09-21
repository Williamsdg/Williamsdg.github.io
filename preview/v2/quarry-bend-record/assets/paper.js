/* The Quarry Bend Record — front page behaviour.
   Concept project by Williams Digital. All content is invented sample data. */
(function () {
  "use strict";

  var KEY = "v2-quarry-bend-";
  var EDITIONS = ["broadsheet", "digest", "wire"];

  /* ── storage helpers (never throw in private mode) ───────────── */
  function get(k) { try { return localStorage.getItem(KEY + k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(KEY + k, v); } catch (e) {} }
  function drop(k) { try { localStorage.removeItem(KEY + k); } catch (e) {} }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function byId(id) { return document.getElementById(id); }
  function storyHref(s) { return "story.html?s=" + encodeURIComponent(s.id); }
  function cutMarkup(s, cls) {
    if (!s.cut) return "";
    return '<figure' + (cls ? ' class="' + cls + '"' : "") + '>' +
      '<svg class="cut" viewBox="0 0 400 150" role="img" aria-label="' + esc(s.cutAlt) + '">' +
      '<use href="#' + esc(s.cut) + '"></use></svg>' +
      '<figcaption class="cutcap">' + esc(s.cutCap) + '</figcaption></figure>';
  }
  function find(id) {
    for (var i = 0; i < STORIES.length; i++) if (STORIES[i].id === id) return STORIES[i];
    return null;
  }
  function bySize(sz) { return STORIES.filter(function (s) { return s.size === sz; }); }

  /* ── sprite ──────────────────────────────────────────────────── */
  function injectSprite() {
    if (byId("qbCuts")) return;
    var d = document.createElement("div");
    d.id = "qbCuts";
    d.setAttribute("aria-hidden", "true");
    d.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    d.innerHTML = CUTS_SPRITE;
    document.body.insertBefore(d, document.body.firstChild);
  }

  /* ── masthead ears ───────────────────────────────────────────── */
  function renderEars() {
    var fc = byId("earForecast");
    if (fc) {
      fc.innerHTML =
        '<h2>' + esc(FORECAST.label) + '</h2>' +
        '<div class="ear-fc"><span class="t">' + FORECAST.today.high + '<sup>°</sup></span>' +
        '<span class="d">Low ' + FORECAST.today.low + '°<br>' + esc(FORECAST.today.sky) + '</span></div>' +
        '<div class="ear-days">' + FORECAST.days.map(function (d) {
          return '<div><b>' + esc(d.d) + '</b>' + d.hi + '° / ' + d.lo + '°</div>';
        }).join("") + '</div>';
    }
    var ix = byId("earIndex");
    if (ix) {
      var picks = [
        { s: "civic", t: "Council & town hall" },
        { s: "land", t: "Land & Water" },
        { s: "schools", t: "Pell Valley schools" },
        { s: "sports", t: "Fall sports" },
        { s: "opinion", t: "Letters" },
      ];
      ix.innerHTML = '<h2>Inside the Record</h2><ul class="ear-idx">' + picks.map(function (p, i) {
        return '<li><a href="#sec-' + p.s + '">' + esc(p.t) + '</a><span class="pg">' + (i * 2 + 3) + '</span></li>';
      }).join("") + '</ul>';
    }
  }

  /* ── edition renderers ───────────────────────────────────────── */
  function renderBroadsheet() {
    var lead = bySize("lead")[0];
    var majors = bySize("major");
    var briefs = bySize("brief");
    var minors = bySize("minor");

    var railItems = briefs.concat(minors).slice(0, 6);

    var html =
      '<div class="bs-top">' +
        '<article class="bs-lead">' +
          '<span class="flag">' + esc(SECTIONS[lead.section]) + '</span>' +
          '<span class="kicker">' + esc(lead.kicker) + '</span>' +
          '<h2 class="headline"><a href="' + storyHref(lead) + '">' + esc(lead.head) + '</a></h2>' +
          '<p class="deck">' + esc(lead.deck) + '</p>' +
          '<p class="byline">By <b>' + esc(lead.byline) + '</b> · ' + esc(lead.role) + ' · Filed ' + esc(lead.filed) + '</p>' +
          cutMarkup(lead) +
          '<div class="bs-body">' +
            lead.body.slice(0, 4).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
            '<p><a class="jump" href="' + storyHref(lead) + '">' + esc(lead.jump) + ' →</a></p>' +
          '</div>' +
        '</article>' +
        '<aside class="rail">' +
          '<div><h2 class="rail-head">Top of the Record</h2><ul class="rail-list">' +
            railItems.map(function (s) {
              return '<li><h3 class="headline"><a href="' + storyHref(s) + '">' + esc(s.head) + '</a></h3>' +
                '<p class="meta"><span class="sec">' + esc(SECTIONS[s.section]) + '</span> · ' + esc(s.filed) + '</p></li>';
            }).join("") +
          '</ul></div>' +
          '<div class="numbers"><h3>' + esc(NUMBERS.title) + '</h3><p class="note">' + esc(NUMBERS.note) + '</p><ul>' +
            NUMBERS.rows.map(function (r) {
              return '<li><b>' + esc(r.n) + '</b><span>' + esc(r.t) + '</span></li>';
            }).join("") +
          '</ul></div>' +
        '</aside>' +
      '</div>' +

      '<p class="fold">Below the fold</p>' +

      '<div class="bs-row">' +
        majors.map(function (s) {
          return '<article>' + cutMarkup(s) +
            '<span class="flag">' + esc(SECTIONS[s.section]) + '</span>' +
            '<h2 class="headline"><a href="' + storyHref(s) + '">' + esc(s.head) + '</a></h2>' +
            '<p class="deck">' + esc(s.deck) + '</p>' +
            '<p class="byline">By <b>' + esc(s.byline) + '</b></p>' +
          '</article>';
        }).join("") +
      '</div>' +

      '<div class="bs-sections">' +
        ["civic", "land", "schools", "sports", "life", "opinion"].map(function (key) {
          var items = STORIES.filter(function (s) { return s.section === key; }).slice(0, 3);
          return '<section id="sec-' + key + '"><h3>' + esc(SECTIONS[key]) + '</h3><ul>' +
            items.map(function (s) {
              return '<li><h4 class="headline"><a href="' + storyHref(s) + '">' + esc(s.head) + '</a></h4>' +
                '<p class="meta">' + esc(s.filed) + ' · ' + s.read + ' min</p></li>';
            }).join("") + '</ul></section>';
        }).join("") +
      '</div>';

    return html;
  }

  function renderDigest() {
    var order = ["ash-street-bridge", "flood-maps", "school-calendar", "quarry-park", "cross-country", "market-indoors", "letters-bridge"];
    var picks = order.map(find).filter(Boolean);
    var full = picks.reduce(function (a, s) { return a + s.read; }, 0);
    var quick = Math.max(2, Math.round(picks.length * 0.45));

    return '<div class="dg">' +
      '<div class="dg-head"><h2>The Morning Digest</h2>' +
      '<p>' + esc(PAPER.dateline) + ' · ' + picks.length + ' stories · a ' + quick + '-minute catch-up</p></div>' +
      '<ol class="dg-list">' +
        picks.map(function (s, i) {
          return '<li class="dg-item"><span class="dg-n" aria-hidden="true">' + (i + 1 < 10 ? "0" : "") + (i + 1) + '</span>' +
            '<div class="dg-body">' +
              '<h3 class="headline"><a href="' + storyHref(s) + '">' + esc(s.head) + '</a></h3>' +
              '<p class="brief">' + esc(s.brief) + '</p>' +
              '<div class="dg-matters"><b>Why it matters</b><span>' + esc(s.matters) + '</span></div>' +
              '<p class="dg-meta"><span class="sec">' + esc(SECTIONS[s.section]) + '</span>' +
              '<span>' + esc(s.read) + ' min full story</span><span>Filed ' + esc(s.filed) + '</span></p>' +
            '</div></li>';
        }).join("") +
      '</ol>' +
      '<p class="dg-foot">That is the whole sample edition \u2014 about ' + full + ' minutes if you read every story in full. ' +
      'The Broadsheet holds the same stories laid out as a page.</p>' +
    '</div>';
  }

  function renderWire() {
    var rows = STORIES.slice().sort(function (a, b) {
      if (!a.day !== !b.day) return a.day ? 1 : -1;      /* today first */
      return b.time24.localeCompare(a.time24);
    });
    var today = rows.filter(function (s) { return !s.day; }).length;
    return '<div class="wire-head"><h2>The Wire</h2>' +
      '<p>' + today + ' filed today, newest first · ' + (rows.length - today) + ' carried over · sample data</p></div>' +
      '<div class="wire-list">' +
        rows.map(function (s) {
          return '<article class="wire-row">' +
            '<span class="wire-t">' + (s.day ? '<span class="wire-day">' + esc(s.day) + '</span> ' : '') + esc(s.time24) + '</span>' +
            '<span class="wire-s">' + esc(s.slug) + '</span>' +
            '<span class="wire-c"><h3 class="headline"><a href="' + storyHref(s) + '">' + esc(s.head) + '</a></h3>' +
            '<span class="sum">' + esc(s.wire) + '</span></span>' +
            '<span class="wire-sec">' + esc(SECTIONS[s.section]) + '</span>' +
          '</article>';
        }).join("") +
      '</div>' +
      '<p class="wire-foot">The Wire is the same newsroom output with the page design taken away — useful when you already know the story and only want what changed.</p>';
  }

  var RENDER = { broadsheet: renderBroadsheet, digest: renderDigest, wire: renderWire };

  /* ── edition state ───────────────────────────────────────────── */
  var root, tabs;

  function apply(ed, opts) {
    opts = opts || {};
    if (EDITIONS.indexOf(ed) === -1) ed = "broadsheet";

    root.innerHTML = RENDER[ed]();
    root.setAttribute("aria-labelledby", "tab-" + ed);
    document.documentElement.setAttribute("data-edition", ed);

    tabs.forEach(function (t) {
      var on = t.dataset.edition === ed;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });

    set("edition", ed);

    if (!opts.silent) {
      var url = ed === "broadsheet" ? location.pathname : location.pathname + "?edition=" + ed;
      /* keep the Back button meaningful: each edition is its own history entry */
      if (opts.replace) history.replaceState({ edition: ed }, "", url);
      else history.pushState({ edition: ed }, "", url);
    }
    if (opts.focusPanel) root.focus();
  }

  function currentEdition() {
    var q = new URLSearchParams(location.search).get("edition");
    if (q && EDITIONS.indexOf(q) !== -1) return q;
    var saved = get("edition");
    if (saved && EDITIONS.indexOf(saved) !== -1) return saved;
    return "broadsheet";
  }

  function wireTabs() {
    tabs.forEach(function (t) {
      t.addEventListener("click", function () { apply(t.dataset.edition); });
      t.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(t), n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") n = 0;
        else if (e.key === "End") n = tabs.length - 1;
        if (n === null) return;
        e.preventDefault();
        tabs[n].focus();
        apply(tabs[n].dataset.edition);
      });
    });
  }

  /* ── reader text size ────────────────────────────────────────── */
  var SIZES = { s: "0.94", m: "1", l: "1.12" };
  function applySize(k, save) {
    if (!SIZES[k]) k = "m";
    document.documentElement.style.setProperty("--s", SIZES[k]);
    Array.prototype.forEach.call(document.querySelectorAll("[data-size]"), function (b) {
      b.setAttribute("aria-pressed", b.dataset.size === k ? "true" : "false");
    });
    if (save) set("size", k);
  }

  /* ── keyboard shortcuts + hold-to-reveal hint ────────────────── */
  function wireKeys() {
    var hint = byId("keyHint");
    function lit(on) { if (hint) hint.classList.toggle("lit", !!on); }

    document.addEventListener("keydown", function (e) {
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "?") { lit(true); return; }
      if (e.key === "1" || e.key === "2" || e.key === "3") {
        e.preventDefault();
        var ed = EDITIONS[Number(e.key) - 1];
        apply(ed);
        var tab = byId("tab-" + ed);
        if (tab) tab.focus();
      } else if (e.key === "-" || e.key === "+" || e.key === "=") {
        e.preventDefault();
        var order = ["s", "m", "l"];
        var cur = order.indexOf(get("size") || "m");
        var next = e.key === "-" ? Math.max(0, cur - 1) : Math.min(2, cur + 1);
        applySize(order[next], true);
      }
    });
    document.addEventListener("keyup", function (e) { if (e.key === "?" || e.key === "Shift") lit(false); });
    window.addEventListener("blur", function () { lit(false); });

    /* the hint also surfaces whenever focus is inside the controls */
    var tools = byId("folioTools");
    if (tools) {
      tools.addEventListener("focusin", function () { lit(true); });
      tools.addEventListener("focusout", function () { lit(false); });
    }
  }

  /* ── signup: label-focus is native; placeholder follows the name ── */
  function wireSignup() {
    var form = byId("signupForm");
    if (!form) return;
    var name = byId("suName"), mail = byId("suMail"), said = byId("suSaid");

    name.addEventListener("input", function () {
      var first = name.value.trim().split(/\s+/)[0] || "";
      first = first.toLowerCase().replace(/[^a-z0-9.-]/g, "");
      mail.placeholder = first ? first + "@example.com" : "you@example.com";
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!mail.checkValidity()) { mail.reportValidity(); return; }
      said.textContent = "Saved in this browser only — nothing was sent and no address left this page.";
      set("signup", "1");
      form.reset();
      mail.placeholder = "you@example.com";
    });

    if (get("signup")) said.textContent = "A sample sign-up is stored in this browser. Nothing was ever sent.";
  }

  function wireReset() {
    var b = byId("resetDemo");
    if (!b) return;
    b.addEventListener("click", function () {
      ["edition", "size", "signup"].forEach(drop);
      applySize("m", false);
      apply("broadsheet", { replace: true });
      var said = byId("suSaid");
      if (said) said.textContent = "Demo reset. Nothing was stored.";
      var tab = byId("tab-broadsheet");
      if (tab) tab.focus();
    });
  }

  /* ── boot ────────────────────────────────────────────────────── */
  function boot() {
    injectSprite();
    renderEars();

    root = byId("editionRoot");
    tabs = Array.prototype.slice.call(document.querySelectorAll("[data-edition]"));
    if (!root || !tabs.length) return;

    wireTabs();
    wireKeys();
    wireSignup();
    wireReset();

    applySize(get("size") || "m", false);
    apply(currentEdition(), { replace: true });

    window.addEventListener("popstate", function (e) {
      var ed = (e.state && e.state.edition) || currentEdition();
      apply(ed, { silent: true });
    });

    var ns = byId("noJs");
    if (ns) ns.remove();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
