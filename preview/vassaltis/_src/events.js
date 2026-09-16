<style>
@media (max-width: 900px) {
  #inquire .wrap { grid-template-columns: 1fr !important; }
  main section .wrap[style*="repeat(12"] > .frame { grid-column: 1 / -1 !important; }
  main section .wrap[style*="repeat(12"] > .frame.arch-sm { display: none; }
}
</style>
<script>
(function () {
  const f = document.getElementById('inq'), err = document.getElementById('inq-err'), ok = document.getElementById('inq-ok');
  const tmr = VXS.addDays(VXS.today(), 14); f.date.min = VXS.today(); f.date.placeholder = tmr;
  f.addEventListener('submit', e => {
    e.preventDefault();
    const bad = [];
    f.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid'));
    if (!f.querySelector('input[name=type]:checked')) bad.push(['type', 'Choose a type of event']);
    ['date', 'guests', 'name', 'email'].forEach(n => { if (!f[n].value || !f[n].checkValidity()) { bad.push([n, { date: 'Add a preferred date', guests: 'Add an approximate number of guests', name: 'Add your name', email: 'Add a valid email address' }[n]]); f[n].setAttribute('aria-invalid', 'true'); } });
    if (!f.privacy.checked) bad.push(['privacy', 'Please agree to the privacy notice so the team can reply']);
    if (bad.length) { err.textContent = bad.map(b => b[1]).join(' · '); const first = bad[0][0]; (f[first] && f[first].focus ? f[first] : f.querySelector(`[name=${first}]`)).focus(); return; }
    err.textContent = '';
    const d = Object.fromEntries(new FormData(f));
    let eventId;
    VXS.update(s => {
      let g = s.guests.find(x => x.email.toLowerCase() === d.email.toLowerCase());
      if (!g) { g = { id: VXS.uid('g'), name: d.name, email: d.email, phone: '', lang: 'English', country: '', marketing: false, member: null, dietary: '', internal: '' }; s.guests.push(g); }
      eventId = 'E-' + (300 + s.events.length);
      s.events.unshift({ id: eventId, title: `${d.type} inquiry — ${d.name.split(' ').slice(-1)[0]}`, clientId: g.id, type: d.type, venue: d.venue, date: d.date, guests: +d.guests, stage: 'inquiry', coordinator: '', budget: d.budget || '', createdAt: VXS.today(),
        thread: [{ at: VXS.nowStamp(), from: 'client', name: d.name, text: d.notes || '(No notes added.)' }], internal: [], menus: [], approvals: [], docs: [], decisions: [], runOfShow: [], fromWebsite: true });
      s.tasks.unshift({ id: VXS.uid('t'), text: `Reply to new ${d.type.toLowerCase()} inquiry from ${d.name}`, due: VXS.addDays(VXS.today(), 1), done: false, who: '', link: eventId });
    }, 'Website event inquiry received', d.name);
    document.getElementById('ok-name').textContent = d.name.split(' ')[0];
    document.getElementById('ok-link').href = 'dashboard.html#event/' + eventId;
    f.hidden = true; ok.hidden = false; ok.focus();
  });
  document.getElementById('inq-again').addEventListener('click', () => { f.reset(); ok.hidden = true; f.hidden = false; f.querySelector('input').focus(); });
})();
</script>
