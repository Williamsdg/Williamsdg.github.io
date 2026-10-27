/* Sword and Crown — renders one published article from the database.
 *
 * Used by journal-post.html (kind "journal") and wig-bible-article.html
 * (kind "wig-bible"). The slug comes from ?a=, the kind from data-kind on <main>.
 * Bodies are Markdown run through SC.markdown, which escapes everything first,
 * so nothing an admin types can inject markup here.
 *
 * Three honest states, never a blank page:
 *   loading → the article, or
 *   "nothing published here" (bad or missing slug, or unpublished), or
 *   "couldn't load" (network/database problem — try again, or go back).
 */
(function () {
  'use strict';
  var SC = window.SC;
  if (!SC) return;
  var esc = SC.esc;

  var main = document.querySelector('main[data-kind]');
  if (!main) return;
  var kind = main.getAttribute('data-kind');
  var list = kind === 'journal'
    ? { href: 'journal.html', name: 'The Journal', label: 'Journal' }
    : { href: 'wig-bible.html', name: 'The Wig Bible', label: 'Wig Bible' };

  var head = main.querySelector('.art-head');
  var body = main.querySelector('.art');
  var state = main.querySelector('.art-state');

  function showState(title, text, retry) {
    head.hidden = true; body.hidden = true; state.hidden = false;
    state.innerHTML =
      '<div class="wrap">' +
        '<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span>' +
        '<a href="' + list.href + '">' + list.name + '</a></nav>' +
        '<h1 class="display">' + title + '</h1>' +
        '<p>' + text + '</p>' +
        '<p><a class="btn" href="' + list.href + '">Back to ' + list.label + '</a>' +
        (retry ? ' <button type="button" class="btn ghost" data-retry>Try again</button>' : '') + '</p>' +
      '</div>';
    var b = state.querySelector('[data-retry]');
    if (b) b.addEventListener('click', function () { location.reload(); });
  }

  function when(a) {
    if (!a.published_at) return '';
    return new Date(a.published_at).toLocaleDateString(undefined,
      { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function render(a) {
    document.title = a.title + ' — ' + list.name + ' — Sword & Crown';
    var desc = document.querySelector('meta[name="description"]');
    if (desc && a.excerpt) desc.setAttribute('content', a.excerpt);

    var date = when(a);
    var pills = kind === 'journal'
      ? '<span class="pill">' + list.label + '</span>' + (date ? '<span class="pill">' + esc(date) + '</span>' : '')
      : '<span class="pill">' + list.label + '</span>' + (a.read_minutes ? '<span class="pill">' + esc(a.read_minutes) + ' min read</span>' : '');
    var by = kind === 'journal'
      ? (date ? '<span><b>' + esc(date) + '</b></span>' : '')
      : (a.read_minutes ? '<span><b>' + esc(a.read_minutes) + ' min</b> read</span>' : '');

    head.querySelector('.wrap').innerHTML =
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span>' +
      '<a href="' + list.href + '">' + list.name + '</a><span aria-hidden="true">/</span><span>' + esc(a.title) + '</span></nav>' +
      '<div class="meta-row">' + pills + '</div>' +
      '<h1 class="display">' + esc(a.title) + '</h1>' +
      (a.excerpt ? '<p class="dek">' + esc(a.excerpt) + '</p>' : '') +
      '<div class="byline">' + by + '<span>Sword &amp; Crown Salon and Studio</span></div>';

    var article = body.querySelector('.prose');
    article.innerHTML =
      (a.cover_url ? '<figure class="art-cover"><img src="' + esc(a.cover_url) + '" alt="' + esc(a.cover_alt || '') + '" loading="eager" decoding="async">' +
        (a.cover_alt ? '<figcaption>' + esc(a.cover_alt) + '</figcaption>' : '') + '</figure>' : '') +
      SC.markdown(a.body || '') +
      '<p style="margin-top:34px"><a class="btn ghost" href="' + list.href + '">More from ' + list.name.toLowerCase() + '</a></p>';

    // On-this-page list from the article's top-level headings (ids added here).
    var toc = body.querySelector('.toc');
    var hs = article.querySelectorAll('h3');
    if (hs.length >= 2) {
      var items = '';
      Array.prototype.forEach.call(hs, function (h, i) {
        var id = 's-' + (i + 1) + '-' + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
        h.id = id;
        items += '<li><a href="#' + id + '">' + esc(h.textContent) + '</a></li>';
      });
      toc.querySelector('ol').innerHTML = items;
      toc.hidden = false;
    } else {
      toc.hidden = true;
    }

    state.hidden = true; head.hidden = false; body.hidden = false;
  }

  var slug = new URLSearchParams(location.search).get('a');
  if (!slug) {
    showState('Nothing to show here.', 'This page needs a link from ' + list.name + '. Pick a piece there and it will open here.');
    return;
  }
  if (!SC.live) {
    showState('Articles aren’t connected yet.', 'The database that holds ' + list.name.toLowerCase() + ' isn’t linked on this copy of the site.');
    return;
  }
  SC.article(kind, slug).then(function (a) {
    if (a === null) {
      showState('We couldn’t load this.', 'The connection dropped before the article arrived. It’s nothing you did.', true);
    } else if (!a) {
      showState('Nothing published here.', 'That link points to a piece that isn’t published, or has moved.');
    } else {
      render(a);
    }
  });
})();
