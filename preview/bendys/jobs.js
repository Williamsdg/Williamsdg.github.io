/* Job application: show only the roles and shifts that exist at the chosen shop. */
(function () {
  'use strict';
  var form = document.querySelector('[data-jobs]');
  if (!form) return;
  var warn = form.querySelector('[data-jobs-warn]');

  function update() {
    var loc = (form.querySelector('[name=location]:checked') || {}).value;
    form.querySelectorAll('[data-loc]').forEach(function (el) {
      var show = !!loc && el.getAttribute('data-loc').split(' ').indexOf(loc) > -1;
      el.hidden = !show;
      if (!show) el.querySelector('input').checked = false;
    });
    form.querySelector('[data-roles-hint]').hidden = !!loc;
    var kitchen = form.querySelector('#r-kitchen').checked;
    form.querySelectorAll('[data-kitchen]').forEach(function (el) {
      el.hidden = !kitchen;
      if (!kitchen) el.querySelector('input').checked = false;
    });
  }

  form.addEventListener('change', function () { update(); warn.textContent = ''; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!form.querySelector('[name=role]:checked')) { warn.textContent = 'Choose at least one role.'; return; }
    if (!form.querySelector('[name=avail]:checked')) { warn.textContent = 'Choose at least one time you can work.'; return; }
    window.bendysToast('This preview isn\'t connected yet. On the live site your application goes straight to Bendy\'s.');
  });
  update();
})();
