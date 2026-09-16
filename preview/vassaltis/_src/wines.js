<script>
(function () {
  const esc = VX.esc, el = document.getElementById('cellar'), count = document.getElementById('count');
  function render(f) {
    const list = VX.wines.filter(w => f === 'all' || w.type === f);
    el.innerHTML = list.map(w => `
      <a class="wine-cell" href="wine.html?w=${w.id}" style="--wc:${w.color}">
        <div class="bottle">${VX.bottle(w) ? `<img src="${VX.bottle(w)}" alt="${esc(w.name)} bottle" loading="lazy">` : `<img class="lifestyle-bottle" src="img/l-${w.id}.jpg" alt="${esc(w.name)} bottle on a wooden bench" loading="lazy">`}</div>
        <span class="w-style">${esc(w.style)}</span>
        <h3>${esc(w.name)}</h3>
        <div class="grape">${esc(w.grape)}</div>
        <p>${esc(w.lede)}</p>
        <span class="arrow">Discover</span>
      </a>`).join('');
    count.textContent = list.length + ' wines shown';
  }
  document.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-f]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    render(b.dataset.f);
  }));
  render('all');
})();
</script>
