/* WorkLift concept prototype: onboarding flows. Nothing typed here is saved or sent. */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function showFlow(as) {
    $$('.seg button').forEach(function (b) { var on = b.dataset.as === as; b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
    $$('.jflow').forEach(function (f) { f.classList.toggle('on', f.id === 'flow-' + as); });
    document.title = (as === 'employer' ? 'Start hiring' : 'Create a free profile') + ' | WorkLift';
  }
  function stepOf(flow) { return +(flow.querySelector('.jstep.on') || {}).dataset.step || 1; }
  function goStep(flow, n) {
    var steps = $$('.jstep', flow);
    n = Math.max(1, Math.min(steps.length, n));
    steps.forEach(function (s) { s.classList.toggle('on', +s.dataset.step === n); });
    var prog = flow.querySelector('.prog i');
    if (prog) prog.style.setProperty('--w', Math.round(Math.min(n, 3) / 3 * 100) + '%');
    flow.scrollIntoView({ block: 'start' });
    var first = flow.querySelector('.jstep.on input');
    if (first && window.matchMedia('(pointer:fine)').matches) first.focus({ preventScroll: true });
  }
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('.seg [data-as]'))) { showFlow(t.dataset.as); return; }
    if ((t = e.target.closest('.pick button'))) { t.classList.toggle('on'); return; }
    var flow = e.target.closest('.jflow');
    if (!flow) return;
    if (e.target.closest('[data-next]')) { goStep(flow, stepOf(flow) + 1); return; }
    if (e.target.closest('[data-prev]')) { goStep(flow, stepOf(flow) - 1); return; }
  });
  window.addEventListener('hashchange', function () { showFlow(location.hash === '#employer' ? 'employer' : 'seeker'); });
  showFlow(location.hash === '#employer' ? 'employer' : 'seeker');
})();
