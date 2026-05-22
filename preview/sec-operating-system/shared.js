// SEC OS — Shared tab switching
// Wires .tab clicks to show matching [data-tab-panel] within the same .tabs-host
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.tabs').forEach(function (tablist) {
    var host = tablist.closest('.tabs-host') || document;
    tablist.querySelectorAll('.tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-tab');
        if (!key) return;
        tablist.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        host.querySelectorAll('[data-tab-panel]').forEach(function (p) {
          p.hidden = (p.getAttribute('data-tab-panel') !== key);
        });
      });
    });
  });
});
