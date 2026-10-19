/* Local Wave concept — menu, coffee finder, product options, concept forms. Nothing here sends anything anywhere. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* mobile nav */
  var tog = $('.hd__tog'), mnav = $('#mnav');
  if (tog && mnav) {
    tog.addEventListener('click', function () {
      var open = tog.getAttribute('aria-expanded') === 'true';
      tog.setAttribute('aria-expanded', String(!open));
      if (open) { mnav.removeAttribute('data-open'); mnav.hidden = true; }
      else { mnav.hidden = false; mnav.setAttribute('data-open', ''); }
    });
  }

  /* coffee finder: picks one of the four real coffees from their published tasting notes */
  var finder = $('#finder');
  if (finder && window.LW && LW.coffees) {
    var out = $('#finder-out');
    function pick() {
      var brew = (finder.querySelector('input[name=brew]:checked') || {}).value;
      var taste = (finder.querySelector('input[name=taste]:checked') || {}).value;
      var caf = (finder.querySelector('input[name=caf]:checked') || {}).value;
      if (!taste && !caf && !brew) return;
      var slug;
      if (caf === 'decaf') slug = 'decaf';
      else if (taste === 'bright') slug = 'dogo-sodu';
      else if (taste === 'chocolate') slug = brew === 'espresso' ? 'espresso-blend' : 'el-paraiso';
      else if (taste === 'balanced') slug = 'espresso-blend';
      else slug = brew === 'espresso' ? 'espresso-blend' : 'el-paraiso';
      var c = LW.coffees.filter(function (x) { return x.slug === slug; })[0];
      if (!c) return;
      var why = c.why[taste] || c.why.any;
      out.innerHTML =
        '<img src="' + LW.base + 'img/' + c.img + '" alt="">' +
        '<p class="mute">Your match</p>' +
        '<h3>' + c.name + '</h3>' +
        '<p>' + why + ' Tastes like ' + c.notes.join(', ') + '.</p>' +
        '<a class="btn btn--cream" href="' + LW.base + 'coffee/' + c.slug + '.html">See ' + c.name + ' <span class="sr">, from $' + c.from + '</span></a>';
    }
    finder.addEventListener('change', pick);
  }

  /* product page: options → price, gallery thumbs */
  var prod = $('[data-product]');
  if (prod) {
    var price = $('#price'), sizes = $$('input[name=size]', prod);
    function upd() {
      var s = sizes.filter(function (i) { return i.checked; })[0];
      if (s && price) price.firstChild.nodeValue = '$' + s.getAttribute('data-price');
    }
    sizes.forEach(function (i) { i.addEventListener('change', upd); });
    upd();
    var main = $('#gal-main');
    $$('.prod__thumbs button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.prod__thumbs button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        main.src = b.getAttribute('data-src');
      });
    });
    var buy = $('#buy');
    if (buy) buy.addEventListener('click', function (e) {
      // Concept: hand off to whichever store system Local Wave chooses. For now the live product page.
      var grind = ($('input[name=grind]:checked', prod) || {}).value || '';
      var size = ($('input[name=size]:checked', prod) || {}).value || '';
      var note = $('#buy-note');
      if (note) { note.textContent = 'Opening the current store with ' + (grind ? grind + ', ' : '') + size + ' selected. In the finished site this adds to your bag here.'; }
    });
  }

  /* concept forms: show a confirmation, send nothing */
  $$('form[data-concept]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var s = f.nextElementSibling;
      if (s && s.classList.contains('sent')) { s.setAttribute('data-show', ''); s.focus && s.setAttribute('tabindex', '-1'); s.focus(); }
    });
  });
})();
