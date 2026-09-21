/* The Quarry Bend Record — story page. Concept project by Williams Digital. */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function byId(id) { return document.getElementById(id); }

  function injectSprite() {
    var d = document.createElement("div");
    d.setAttribute("aria-hidden", "true");
    d.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    d.innerHTML = CUTS_SPRITE;
    document.body.insertBefore(d, document.body.firstChild);
  }

  function boot() {
    injectSprite();

    var id = new URLSearchParams(location.search).get("s") || "ash-street-bridge";
    var story = null;
    for (var i = 0; i < STORIES.length; i++) if (STORIES[i].id === id) story = STORIES[i];
    if (!story) story = STORIES[0];

    document.title = story.head + " — The Quarry Bend Record (concept)";

    var host = byId("storyRoot");
    var full = Array.isArray(story.body) && story.body.length > 0;

    var cut = story.cut
      ? '<figure><svg class="cut" viewBox="0 0 400 150" role="img" aria-label="' + esc(story.cutAlt) + '">' +
        '<use href="#' + esc(story.cut) + '"></use></svg>' +
        '<figcaption class="cutcap">' + esc(story.cutCap) + '</figcaption></figure>'
      : "";

    var body;
    if (full) {
      var paras = story.body.map(function (p) { return "<p>" + esc(p) + "</p>"; });
      if (story.pull) {
        var q = '<blockquote class="pull"><p>' + esc(story.pull) + '</p>' +
          (story.pullBy ? "<cite>" + esc(story.pullBy) + "</cite>" : "") + "</blockquote>";
        paras.splice(Math.min(3, paras.length), 0, q);
      }
      body = '<div class="story-body">' + paras.join("") + "</div>" +
        '<p class="story-end"><b>About this story</b>' +
        'Invented sample copy written to fill a real newspaper measure — roughly 450 words, the length a ' +
        'local council report actually runs. It describes a town, a council and a bridge that do not exist.</p>';
    } else {
      body = '<div class="story-body"><p>' + esc(story.brief) + '</p>' +
        "<p>" + esc(story.matters) + "</p></div>" +
        '<p class="story-end"><b>Why this page stops here</b>' +
        'This sample edition carries the full text of one story only — the Ash Street bridge report. Every ' +
        'other item has a real headline, deck and summary so the front page can be judged at true ' +
        'proportions, without inventing a newspaper’s worth of fictional reporting. ' +
        '<a href="story.html?s=ash-street-bridge">Read the one full story →</a></p>';
    }

    host.innerHTML =
      '<article class="story">' +
        '<a class="back" href="./">← The front page</a>' +
        '<div class="story-head">' +
          '<span class="flag">' + esc(SECTIONS[story.section]) + '</span>' +
          (story.kicker ? '<span class="kicker">' + esc(story.kicker) + "</span>" : "") +
          "<h1>" + esc(story.head) + "</h1>" +
          (story.deck ? '<p class="deck">' + esc(story.deck) + "</p>" : "") +
          '<p class="story-meta"><span>By <b>' + esc(story.byline) + "</b></span>" +
          (story.role ? "<span>" + esc(story.role) + "</span>" : "") +
          "<span>Filed " + esc(story.filed) + "</span><span>" + esc(story.read) + " min read</span></p>" +
        "</div>" +
        cut + body +
      "</article>" +

      '<aside class="story-aside">' +
        '<h2 class="rail-head">More in ' + esc(SECTIONS[story.section]) + "</h2><ul class=\"rail-list\">" +
          STORIES.filter(function (s) { return s.section === story.section && s.id !== story.id; })
            .slice(0, 4)
            .map(function (s) {
              return '<li><h3 class="headline"><a href="story.html?s=' + encodeURIComponent(s.id) + '">' +
                esc(s.head) + '</a></h3><p class="meta"><span class="sec">' + esc(SECTIONS[s.section]) +
                "</span> · " + esc(s.filed) + "</p></li>";
            }).join("") +
        "</ul>" +
        '<div class="numbers" style="margin-top:22px"><h3>Corrections</h3>' +
        '<p class="note">A real newsroom needs this box on every story. Nothing here has been corrected, ' +
        'because nothing here happened.</p></div>' +
        '<h2 class="rail-head" style="margin-top:26px">Elsewhere in this edition</h2><ul class="rail-list">' +
          STORIES.filter(function (s) { return s.section !== story.section; })
            .slice(0, 5)
            .map(function (s) {
              return '<li><h3 class="headline"><a href="story.html?s=' + encodeURIComponent(s.id) + '">' +
                esc(s.head) + '</a></h3><p class="meta"><span class="sec">' + esc(SECTIONS[s.section]) +
                "</span> \u00B7 " + esc(s.filed) + "</p></li>";
            }).join("") +
        "</ul>" +
      "</aside>";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
