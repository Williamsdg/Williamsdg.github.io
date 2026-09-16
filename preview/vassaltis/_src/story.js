<script>
(function () {
  const esc = VX.esc;
  document.getElementById('years').innerHTML = VX.vintageReports.map(v => `<a href="${v.url}" target="_blank" rel="noopener" aria-label="Vintage report ${v.year} (PDF)">${v.year}</a>`).join('');
  document.getElementById('people').innerHTML = VX.team.map(p => `
    <article class="person">
      <div class="frame"><img src="${p.img}" alt="${esc(p.name)} against a basalt wall" loading="lazy" width="666" height="1000"></div>
      <h3>${esc(p.name)}</h3>
      <p class="role">${esc(p.role)}</p>
      <p>${esc(p.bio)}</p>
    </article>`).join('');
})();
</script>
