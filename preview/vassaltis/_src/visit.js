<script>
(function () {
  const esc = VX.esc;
  const card = x => `
    <article class="xp" id="${x.id}" style="scroll-margin-top:90px">
      <div class="frame"><img src="${x.img}" alt="" loading="lazy" width="2000" height="1333"></div>
      <div>
        <p class="eyebrow">${esc(x.kind)}</p>
        <h2>${esc(x.name)}</h2>
        <p class="incl">${esc(x.short)}</p>
        <p style="margin:0 0 22px">${esc(x.body)}</p>
        <ul class="facts">
          <li><span>Price</span><span>€${x.price} ${esc(x.unit)}${x.extra ? ' · ' + esc(x.extra) : ''}</span></li>
          <li><span>When</span><span>${x.schedule ? esc(x.schedule) : 'During opening hours, 11:00–20:00'}</span></li>
          ${x.duration ? `<li><span>Duration</span><span>${esc(x.duration)}</span></li>` : ''}
          <li><span>Group</span><span>${x.group ? esc(x.group) : 'Ask the team about larger groups'}</span></li>
        </ul>
        <div class="book-row">
          <a class="btn" href="${x.book}" target="_blank" rel="noopener">Check availability ↗</a>
          <a class="arrow" href="client.html?request=${x.id}">Or send a request</a>
        </div>
        <p class="handoff">Booking opens Vassaltis’s i-host reservation page. Your booking is confirmed there, not on this site.</p>
      </div>
    </article>`;
  document.getElementById('xp-wine').innerHTML = ['tasting', 'cellar'].map(VX.exp).map(card).join('');
  document.getElementById('xp-dine').innerHTML = ['lunch', 'whole', 'dinner'].map(VX.exp).map(card).join('');
})();
</script>
