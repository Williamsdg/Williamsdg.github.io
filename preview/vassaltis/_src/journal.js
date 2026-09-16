<script>
document.getElementById('issues').innerHTML = VX.post.map(p => `<li><span class="no">№${p.n}</span><span class="t">${VX.esc(p.season)}</span><span class="l"><a href="${p.en}" target="_blank" rel="noopener">English ↗</a>${p.el ? `<a href="${p.el}" target="_blank" rel="noopener" lang="el">Ελληνικά ↗</a>` : '<span class="muted">English only</span>'}</span></li>`).join('');
</script>
