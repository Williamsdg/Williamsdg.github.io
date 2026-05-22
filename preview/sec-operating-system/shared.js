// SEC OS — Shared tab + sport-filter handlers
// Tabs: .tab[data-tab] toggles matching [data-tab-panel] within the same .tabs-host
// Detail tabs: .detail-tab[data-detail-tab] toggles [data-detail-panel] in same .detail-host
// Sport: .sport-pill[data-sport] inside a .sport-host filters [data-sport-row] descendants
//   - data-sport="all" shows everything
//   - rows tagged data-sport-row="fb mbb" match both Football and Men's Basketball
document.addEventListener('DOMContentLoaded', function () {

  // --- Main tab switching ---
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

  // --- Detail tabs (ops-center game detail) ---
  document.querySelectorAll('.detail-tabs').forEach(function (tablist) {
    var host = tablist.closest('.detail-host') || tablist.parentElement || document;
    tablist.querySelectorAll('.detail-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-detail-tab');
        if (!key) return;
        tablist.querySelectorAll('.detail-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        host.querySelectorAll('[data-detail-panel]').forEach(function (p) {
          p.hidden = (p.getAttribute('data-detail-panel') !== key);
        });
      });
    });
  });

  // --- Sport filter ---
  function applySport(host, sport) {
    host.querySelectorAll('[data-sport-row]').forEach(function (row) {
      var sports = (row.getAttribute('data-sport-row') || '').split(/\s+/);
      var show = sport === 'all' || sports.indexOf(sport) !== -1;
      row.hidden = !show;
    });
    host.querySelectorAll('[data-sport-scope]').forEach(function (scope) {
      var visible = scope.querySelectorAll('[data-sport-row]:not([hidden])').length;
      var empty = scope.querySelector('[data-sport-empty]');
      if (empty) empty.hidden = visible > 0;
    });
  }

  document.querySelectorAll('.sport-bar').forEach(function (bar) {
    var host = bar.closest('.sport-host') || bar.closest('.tabs-host') || document;
    bar.querySelectorAll('.sport-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        var sport = pill.getAttribute('data-sport');
        if (!sport) return;
        bar.querySelectorAll('.sport-pill').forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        applySport(host, sport);
      });
    });
  });
});
