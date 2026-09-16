<script>
(function () {
  const esc = VX.esc;
  const id = new URLSearchParams(location.search).get('w') || 'santorini';
  const w = VX.wine(id) || VX.wine('santorini');
  const i = VX.wines.indexOf(w), prev = VX.wines[(i - 1 + VX.wines.length) % VX.wines.length], next = VX.wines[(i + 1) % VX.wines.length];
  document.title = w.name + ' — Vassaltis Vineyards';
  document.getElementById('crumb').textContent = w.name;

  const visual = VX.bottle(w)
    ? `<img class="b" src="${VX.bottle(w)}" alt="${esc(w.name)} bottle">`
    : `<img class="l" src="img/l-${w.id}.jpg" alt="${esc(w.name)} bottle with a glass on a wooden bench">`;

  document.getElementById('wd').innerHTML = `
    <div class="wd-visual" style="--wc:${w.color}">${visual}</div>
    <div>
      <p class="style">${esc(w.style)} · ${esc(w.type)}</p>
      <h1>${esc(w.name)}</h1>
      <p class="lede">${esc(w.lede)}</p>
      <ul class="spec">
        <li><span class="k">Grape</span><span class="v">${esc(w.grape)}</span></li>
        <li><span class="k">Origin</span><span class="v">Santorini, Greece</span></li>
        <li><span class="k">Fact sheet</span><span class="v">${w.sheet.year ? 'Vintage ' + esc(w.sheet.year) : '<span class="confirm">Vintage to confirm</span>'}</span></li>
      </ul>
      ${w.tastingRoomOnly ? '<p class="note-box" style="margin:0 0 28px">Made only in especially good vintages, and offered only in the tasting room.</p>' : ''}
      <div class="acc">
        <details open><summary>Tasting notes</summary><div class="body">${esc(w.notes)}</div></details>
        <details><summary>In the winery</summary><div class="body">${esc(w.making)}</div></details>
        <details><summary>Technical details</summary><div class="body">
          <p style="margin-top:0">Alcohol, acidity, residual sugar and yields change with every vintage, so they live on the fact sheet for that vintage, not here.</p>
          <a class="arrow" href="${w.sheet.url}" target="_blank" rel="noopener">Download the ${w.sheet.year ? esc(w.sheet.year) + ' ' : ''}fact sheet (PDF) ↗</a>
        </div></details>
        <details><summary>At the table</summary><div class="body">
          <p style="margin-top:0">Ask the team in the tasting room: food pairing is Artemis’s favourite subject.</p>
          <span class="confirm">Pairing suggestions to confirm with Vassaltis</span>
        </div></details>
      </div>
      <div class="wd-actions">
        <a class="btn" href="visit.html">Taste it at the winery</a>
        <a class="btn ghost" href="client.html?save=${w.id}">Save to My Wines</a>
      </div>
      <p class="small muted" style="margin-top:14px">Online ordering isn’t available here. The club shop at club.vassaltis.com is currently closed.</p>
    </div>`;

  document.getElementById('pager').innerHTML = `
    <a href="wine.html?w=${prev.id}"><span class="k">← Previous</span><span class="n">${esc(prev.name)}</span></a>
    <a href="wine.html?w=${next.id}"><span class="k">Next →</span><span class="n">${esc(next.name)}</span></a>`;
})();
</script>
