/* Sword and Crown — Vagaro booking slots.
 *
 * Elana chose Vagaro for booking (2026-10-20). Each department page carries a
 * <div class="vg-slot" data-vagaro="…"> holding an honest call-or-text fallback.
 * When the matching embed snippet is pasted into SC_CONFIG.VAGARO_EMBEDS the
 * snippet is injected and the fallback hidden. With nothing configured the
 * page never pretends to take a booking.
 *
 * Also owns the Restorative Artistry eligibility gate, which used to live in
 * sc-booking.js: the consultation calendar stays locked until the client
 * confirms the medical screening on the page.
 */
(function () {
  'use strict';
  var CFG = window.SC_CONFIG || {};
  var EMB = CFG.VAGARO_EMBEDS || {};

  var ack = document.getElementById('eligAck');
  var gate = document.getElementById('bkGate');
  if (ack && gate) {
    var sync = function () { gate.classList.toggle('locked', !ack.checked); };
    ack.addEventListener('change', sync);
    sync();
  }

  var slots = document.querySelectorAll('[data-vagaro]');
  Array.prototype.forEach.call(slots, function (slot) {
    var html = EMB[slot.getAttribute('data-vagaro')];
    if (!html || !String(html).trim()) return;        // keep the fallback
    /* createContextualFragment, unlike innerHTML, lets Vagaro's <script>
       run — that is the whole point of the snippet. */
    var range = document.createRange();
    range.selectNode(slot);
    slot.appendChild(range.createContextualFragment(String(html)));
    slot.classList.add('is-live');
  });
})();
