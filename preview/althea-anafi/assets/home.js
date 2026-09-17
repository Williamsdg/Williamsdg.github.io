/* ALTHEA — homepage behaviour. Vanilla JS, no build step. */
(function () {
  const A = window.Althea;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lang = 'en';
  try { lang = localStorage.getItem('althea.lang') || 'en'; } catch (e) {}

  /* ---- Greek. Strings marked NEW are Williams Digital translations for owner review;
         the rest follow Althea's existing Greek pages. ------------------------------ */
  const EL = {
    'skip': 'Μετάβαση στο περιεχόμενο',
    'nav.suites': 'Οι Σουίτες', 'nav.exp': 'Εμπειρίες', 'nav.anafi': 'Ανακαλύψτε την Ανάφη', 'nav.faq': 'Ερωτήσεις', 'nav.guest': 'Είσοδος επισκεπτών', 'nav.menu': 'Μενού',
    'cta.book': 'Διαθεσιμότητα', 'cta.suites': 'Δείτε τις σουίτες',
    'hero.eyebrow': 'Althea Anafi Suites · Χώρα, Ανάφη', 'hero.note': 'Η κράτηση ανοίγει την ασφαλή σελίδα κρατήσεων της Althea σε νέα καρτέλα.', 'hero.cap': 'Η κοινόχρηστη πισίνα, πάνω από το Αιγαίο',
    'intro.eyebrow': 'Η Althea', 'intro.title': 'Γαλήνη γεννημένη στο Αιγαίο',
    'f1.b': '5 σουίτες', 'f1.s': 'Η καθεμία με το δικό της όνομα', 'f2.b': 'Χώρα', 'f2.s': 'Λίγα βήματα από το πεζοδρομημένο κέντρο', 'f3.b': 'Πισίνα', 'f3.s': 'Κοινόχρηστη για όλους τους επισκέπτες', 'f4.b': 'Pet-friendly', 'f4.s': 'Με λίγους απλούς όρους',
    'suites.eyebrow': 'Οι Σουίτες', 'suites.title': 'Πέντε σουίτες, λαξευμένες στο φως και το λευκό', 'suites.lede': 'Κάθε σουίτα έχει το δικό της όνομα, χαρακτήρα και θέα. Επιλέξτε μία για να δείτε φωτογραφίες και λεπτομέρειες — ή συγκρίνετε και τις πέντε.',
    'cmp.open': 'Σύγκριση των πέντε σουιτών', 'cmp.close': 'Κλείσιμο σύγκρισης',
    'day.eyebrow': 'Μια μέρα στην Althea', 'day.title': 'Ένας αργός, ήρεμος ρυθμός', 'day.t0': 'Πρωί', 'day.t1': 'Δίπλα στο νερό', 'day.t2': 'Βράδυ',
    'exp.eyebrow': 'Ξεχωριστές Εμπειρίες', 'exp.title': 'Αφήστε την Ανάφη να σας αποκαλύψει τη γαλήνια μαγεία της', 'exp.lede': 'Από αστροπαρατήρηση και βραδιές barbeque, μέχρι βόλτες με σκάφος στα γαλανά νερά και πεζοπορία στα μονοπάτια του νησιού — εμπειρίες απλές αλλά με νόημα, κατόπιν αιτήματος.',
    'x.hike.meta': 'Με τοπικό ξεναγό · 6–8 άτομα', 'x.hike.h': 'Πεζοπορία στον Καλαμό', 'x.hike.o1': 'Ηλιοβασίλεμα & διανυκτέρευση', 'x.hike.o1p': 'Από το Μοναστήρι αργά το απόγευμα στην κορυφή για το ηλιοβασίλεμα, μια νύχτα κάτω από τα αστέρια και κατάβαση την αυγή.', 'x.hike.o2': 'Πεζοπορία στην ανατολή', 'x.hike.o2p': 'Ξεκινάμε πριν ξημερώσει και φτάνουμε στην κορυφή καθώς ο ήλιος βγαίνει από τη θάλασσα.',
    'x.req': 'Αίτημα για την εμπειρία', 'x.ask': 'Ρωτήστε για ημερομηνίες', 'x.ask2': 'Αίτημα για συνεδρία',
    'x.boat.meta': 'Με την Elmar Anafi · απαιτείται προειδοποίηση', 'x.boat.h': 'Βόλτες με σκάφος στις ακτές', 'x.boat.p': 'Ιδιωτικό φουσκωτό έως τεσσάρων ατόμων για την ανέγγιχτη ακτογραμμή — ή το Κουρσάρος, παραδοσιακό ξύλινο καΐκι, για γύρο του νησιού με γεύμα.',
    'x.yoga.meta': 'Για όλα τα επίπεδα · ανατολή ή δύση', 'x.yoga.h': 'Yoga με θέα το Αιγαίο', 'x.yoga.p': 'Σε μία από τις βεράντες της Althea, σε μικρές ομάδες ή ιδιωτικά, κατόπιν αιτήματος.',
    'x.bbq.meta': 'Κάτω από το φεγγάρι · 10–12 άτομα', 'x.bbq.h': 'Βραδιά barbecue', 'x.bbq.p': 'Καλό φαγητό, τοπικό κρασί και απαλή μουσική στον χώρο barbecue της Althea.',
    'x.mas.meta': 'Κατόπιν αιτήματος', 'x.mas.h': 'Ταϊλανδέζικο μασάζ', 'x.mas.p': 'Παραδοσιακό ταϊλανδέζικο μασάζ σε ήσυχο, ανοιχτό χώρο.',
    'an.eyebrow': 'Ανακαλύψτε την Ανάφη', 'an.title': 'Το νησί που αποκαλύφθηκε', 'an.p': 'Ο μύθος λέει ότι ο Απόλλωνας έκανε την Ανάφη να φανεί στους Αργοναύτες ως καταφύγιο από την καταιγίδα — εξ ου και το όνομα, «αναφαίνω». Σήμερα είναι μια από τις πιο ήσυχες γωνιές των Κυκλάδων, με τον Καλαμό να υψώνεται από τη θάλασσα.', 'an.beaches': 'Κοντινές παραλίες: Ρούκουνας, Κατσούνι, Κλεισίδι και Άγιοι Ανάργυροι — σε κάποιες φτάνετε με σύντομη πεζοπορία.',
    'ar.eyebrow': 'Πώς θα έρθετε', 'ar.title': 'Από το πλοίο στο μπαλκόνι σας',
    'j1.h': 'Ταξίδι στην Ανάφη', 'j1.p': 'Με πλοίο — ενδεικτικοί χρόνοι:', 'j1.a': 'Πειραιάς · 10–11 ώρες', 'j1.b': 'Σαντορίνη · 1,5 ώρα', 'j1.c': 'Κρήτη · 3,5 ώρες',
    'j2.h': 'Άφιξη στον Άγιο Νικόλαο', 'j2.p': 'Το λιμάνι της Ανάφης.', 'j3.h': 'Ανεβαίνοντας στη Χώρα', 'j3.p': 'Δέκα λεπτά με το αυτοκίνητο. Μπορούμε να κανονίσουμε μεταφορά ή να σας καθοδηγήσουμε — ρωτήστε μας κατά την κράτηση.', 'j4.h': 'Καλώς ήρθατε στην Althea', 'j4.p': 'Στην καρδιά της Χώρας, λίγα βήματα από το πεζοδρομημένο κέντρο.',
    'cl.h': 'Φτάνετε μετά τα μεσάνυχτα;', 'cl.p': 'Τα πλοία συχνά φτάνουν τη νύχτα, γι’ αυτό προτείνουμε να κλείσετε τη σουίτα σας από την προηγούμενη μέρα. Πείτε μας ημερομηνία και ώρα άφιξης και θα επιβεβαιώσουμε μαζί σας τη σωστή βραδιά κράτησης.', 'cl.src': 'Οι χρόνοι και η συμβουλή για τα βραδινά πλοία προέρχονται από τις Συχνές Ερωτήσεις της Althea. Τα δρομολόγια αλλάζουν — ελέγξτε με την ακτοπλοΐα.',
    'g.eyebrow': 'Φωτογραφίες', 'g.title': 'Στιγμές γαλήνης στο Αιγαίο', 'g.lede': 'Ασβεστωμένοι τοίχοι, γήινες υφές και η μακριά γαλάζια γραμμή του ορίζοντα.',
    's.h': 'Βιωσιμότητα & σεβασμός στη φύση', 's.p': 'Η Althea σέβεται την ανέγγιχτη ομορφιά του νησιού: αποφεύγει την υπερδόμηση, μειώνει το πλαστικό, στηρίζει τους τοπικούς παραγωγούς και προσφέρει μια διαμονή που αφήνει μόνο αναμνήσεις — όχι αποτύπωμα.',
    'q.eyebrow': 'Χρήσιμα', 'q.title': 'Πριν ταξιδέψετε', 'q.lede': 'Κάτι άλλο; Γράψτε ή τηλεφωνήστε — η ομάδα της Althea θα χαρεί να βοηθήσει.',
    'q1.q': 'Περιλαμβάνεται πρωινό;', 'q1.a': 'Πρωινό à la carte διατίθεται κατόπιν αιτήματος, με επιπλέον χρέωση. Κάθε σουίτα έχει μηχανή καφέ και ορισμένες διαθέτουν εξοπλισμό κουζίνας.',
    'q2.q': 'Υπάρχει πισίνα;', 'q2.a': 'Ναι — κοινόχρηστη πισίνα για όλους τους επισκέπτες, με ξαπλώστρες και θέα στη θάλασσα.',
    'q3.q': 'Μπορώ να φέρω το κατοικίδιό μου;',
    'q4.q': 'Μπορείτε να βοηθήσετε με την άφιξή μου;', 'q4.a': 'Ναι. Το λιμάνι απέχει δέκα λεπτά από τη Χώρα και μπορούμε να κανονίσουμε μεταφορά. Επειδή τα πλοία συχνά φτάνουν τη νύχτα, προτείνουμε κράτηση από την προηγούμενη μέρα.',
    'q5.q': 'Πώς κλείνω μια εμπειρία;', 'q5.a': 'Στείλτε αίτημα με την ημερομηνία και τον αριθμό ατόμων. Ελέγχουμε με τους συνεργάτες μας και επιβεβαιώνουμε μαζί σας — τίποτα δεν κλείνεται πριν από αυτό.',
    'q6.q': 'Πώς μετακινούμαι στο νησί;', 'q6.a': 'Υπάρχουν περιορισμένα δρομολόγια λεωφορείου μεταξύ λιμανιού, Χώρας και ορισμένων παραλιών. Για ενοικίαση αυτοκινήτου ή μηχανής, πείτε μας και θα βοηθήσουμε.',
    'q7.q': 'Τι περιλαμβάνει η σουίτα;', 'q7.a': 'Wi-Fi, κλιματισμό, ανεμιστήρα οροφής, μηχανή καφέ, μίνι μπαρ, χρηματοκιβώτιο, προϊόντα μπάνιου KORRES και ένα κέρασμα καλωσορίσματος με τοπικά προϊόντα.',
    'fin.a': 'Εκδηλώστε', 'fin.b': 'το ενδιαφέρον σας',
    'ft.addr': 'Χώρα, Ανάφη · Κυκλάδες', 'ft.stay': 'Διαμονή', 'ft.contact': 'Επικοινωνία', 'ft.follow': 'Ακολουθήστε μας',
    'rq.title': 'Αίτημα για εμπειρία', 'rq.demo': 'Φόρμα επίδειξης — το αίτημα αποθηκεύεται μόνο σε αυτόν τον browser. Τίποτα δεν αποστέλλεται ή κλείνεται.', 'rq.exp': 'Εμπειρία', 'rq.date': 'Επιθυμητή ημερομηνία', 'rq.party': 'Άτομα', 'rq.name': 'Όνομα', 'rq.note': 'Σύντομο σημείωμα (προαιρετικό)', 'rq.send': 'Αποστολή αιτήματος',
    'rq.ok': 'Το αίτημα καταχωρήθηκε (demo)', 'rq.okp': 'Αναμένεται επιβεβαίωση από την ομάδα. Τίποτα δεν έχει κλειστεί ακόμη.', 'rq.staff': 'Δείτε το στο demo προσωπικού', 'rq.close': 'Κλείσιμο'
  };
  const T = (k, en) => lang === 'el' && EL[k] ? EL[k] : en;
  const EN = {};

  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (!(k in EN)) EN[k] = el.innerHTML;
      el.innerHTML = lang === 'el' && EL[k] ? EL[k] : EN[k];
    });
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $('#el-note').hidden = lang !== 'el';
    const cmp = $('#cmp');
    $('#cmpBtn').textContent = T(cmp.hidden ? 'cmp.open' : 'cmp.close', cmp.hidden ? 'Compare all five suites' : 'Close comparison');
    renderContent(); renderSuite(false); renderDay(); if (!cmp.hidden) renderCompare(); fillExpSelect();
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => { lang = b.dataset.lang; try { localStorage.setItem('althea.lang', lang); } catch (e) {} applyLang(); }));

  /* ---- owner-editable content (published via the staff demo) ------------- */
  function renderContent() {
    const c = A.get().content.published;
    $('#heroTitle').textContent = lang === 'el' ? c.heroTitleEl : c.heroTitle;
    $('#heroSub').textContent = lang === 'el' ? c.heroSubEl : c.heroSub;
    $('#introText').textContent = lang === 'el' ? c.introEl : c.intro;
    $('#faqPets').textContent = lang === 'el' ? 'Ναι, είμαστε pet-friendly. Παρακαλούμε να μην αφήνετε τα κατοικίδια χωρίς επίβλεψη στη σουίτα· ενδέχεται να υπάρχει μικρή χρέωση καθαριότητας.' : c.faqPets;
    const img = $('#heroImg');
    if (!img.src.endsWith(c.heroImage + '.webp')) { img.src = 'img/' + c.heroImage + '.webp'; img.alt = c.heroAlt || HERO_ALT[c.heroImage] || ''; }
    $$('[data-exp]').forEach(b => {
      const open = c.expOpen[b.dataset.exp] !== false;
      b.hidden = !open;
      let n = b.nextElementSibling;
      if (!open && !(n && n.classList.contains('closed'))) { const p = document.createElement('p'); p.className = 'closed'; p.textContent = lang === 'el' ? 'Δεν δεχόμαστε αιτήματα αυτή την περίοδο.' : 'Not taking requests at the moment.'; b.after(p); }
      if (open && n && n.classList.contains('closed')) n.remove();
    });
  }
  const HERO_ALT = { 'hero-pool': 'The shared pool at Althea looking out over the Aegean', loungers: 'Loungers and fringed parasols beside the pool', 'terrace-view': 'Suite terraces with a pergola and a view of the sea', terraces: 'Terraces stepping down toward the Aegean' };

  /* ---- suite explorer ---------------------------------------------------- */
  let cur = 0, photo = 0;
  const order = (s) => {
    const o = A.get().content.published.order[s.id];
    return o && o.length === s.photos ? o : Array.from({ length: s.photos }, (_, i) => i + 1);
  };
  const src = (s, n, sm) => `img/${s.id}-${n}${sm ? '-sm' : ''}.webp`;
  const ICON = { check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>' };

  function buildTabs() {
    const idx = $('#sxTabs'), mob = $('#sxTabsM');
    idx.innerHTML = A.SUITES.map((s, i) => `<li role="presentation"><button type="button" role="tab" id="sxt-${s.id}" aria-controls="sxPanel" aria-selected="${i === cur}" tabindex="${i === cur ? 0 : -1}" data-i="${i}"><span class="n">0${i + 1}</span><span class="nm">${s.name}</span><span class="ct">${s.cat} · ${s.size} m²</span></button></li>`).join('');
    mob.innerHTML = A.SUITES.map((s, i) => `<button type="button" role="tab" aria-selected="${i === cur}" tabindex="${i === cur ? 0 : -1}" data-i="${i}" aria-controls="sxPanel">${s.name}</button>`).join('');
    [idx, mob].forEach(list => {
      list.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) select(+b.dataset.i, true); });
      list.addEventListener('keydown', e => {
        const k = e.key; if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(k)) return;
        e.preventDefault();
        let i = cur + (k === 'ArrowDown' || k === 'ArrowRight' ? 1 : k === 'ArrowUp' || k === 'ArrowLeft' ? -1 : 0);
        if (k === 'Home') i = 0; if (k === 'End') i = A.SUITES.length - 1;
        i = (i + A.SUITES.length) % A.SUITES.length; select(i, true);
        list.querySelector(`[data-i="${i}"]`).focus();
      });
    });
  }
  function select(i, animate) {
    if (i === cur && animate) return;
    cur = i; photo = 0;
    $$('#sxTabs [data-i], #sxTabsM [data-i]').forEach(b => { const on = +b.dataset.i === i; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
    const m = $(`#sxTabsM [data-i="${i}"]`); if (m && m.scrollIntoView && getComputedStyle($('#sxTabsM')).display !== 'none') m.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    renderSuite(animate);
  }
  function setPhoto(n, animate) {
    const s = A.SUITES[cur], ord = order(s);
    photo = (n + ord.length) % ord.length;
    const frame = $('#sxFrame');
    const next = new Image();
    next.src = src(s, ord[photo]); next.width = 1462; next.height = 1157;
    next.alt = `${s.name} ${s.cat}, photo ${photo + 1} of ${ord.length}`;
    const old = frame.querySelector('img');
    if (old && animate && !reduce) { next.classList.add('out'); frame.appendChild(next); requestAnimationFrame(() => requestAnimationFrame(() => { next.classList.remove('out'); old.classList.add('out'); setTimeout(() => old.remove(), 650); })); }
    else { frame.innerHTML = ''; frame.appendChild(next); }
    $$('#sxThumbs button').forEach((b, k) => b.setAttribute('aria-current', String(k === photo)));
    const t = $$('#sxThumbs button')[photo]; if (t) t.parentNode.scrollTo({ left: t.offsetLeft - 40, behavior: reduce ? 'auto' : 'smooth' });
  }
  function renderSuite(animate) {
    const s = A.SUITES[cur], ord = order(s), el = lang === 'el';
    $('#sxPanel').setAttribute('aria-labelledby', 'sxt-' + s.id);
    $('#sxThumbs').innerHTML = ord.map((n, k) => `<button type="button" aria-label="Show photo ${k + 1}" aria-current="${k === photo}"><img src="${src(s, n, true)}" alt="" loading="lazy" width="720" height="570"></button>`).join('');
    $$('#sxThumbs button').forEach((b, k) => b.addEventListener('click', () => setPhoto(k, true)));
    setPhoto(photo, animate);
    const am = el
      ? ['Θέα στη θάλασσα', 'Ιδιωτικό μπαλκόνι', 'Κοινόχρηστη πισίνα', 'Wi-Fi', 'Μηχανή καφέ', 'Μίνι μπαρ', 'Χρηματοκιβώτιο', 'Κλιματισμός', 'KORRES']
      : ['Sea view', 'Private balcony', 'Shared pool', 'Wi-Fi', 'Coffee machine', 'Mini bar', 'Safe box', 'Air-conditioning', 'KORRES amenities'];
    const kitchen = s.kitchen ? `<li>${el ? 'Εξοπλισμός κουζίνας' : 'Kitchen facilities'}</li>` : `<li class="q" title="Not listed on the suite page">${el ? 'Κουζίνα: ρωτήστε μας' : 'Kitchen: ask us'}</li>`;
    $('#sxSpec').innerHTML = `
      <p class="cat">${s.cat}</p>
      <h3>${s.name}<span class="el" lang="el">${s.el}</span></h3>
      <p class="quote">${el ? s.lineEl : s.line}</p>
      <dl>
        <div><dt>${el ? 'Εμβαδόν' : 'Size'}</dt><dd>${s.size} m²</dd></div>
        <div><dt>${el ? 'Επισκέπτες' : 'Guests'}</dt><dd>${el ? 'έως ' : 'Up to '}${s.guests}</dd></div>
        <div style="grid-column:1/-1"><dt>${el ? 'Κρεβάτια' : 'Beds'}</dt><dd>${(el ? s.bedsEl : s.beds).join(' · ')}</dd></div>
      </dl>
      <ul class="amen">${am.map(a => `<li>${a}</li>`).join('')}${kitchen}</ul>
      <div class="sx-actions">
        <a class="btn" href="${A.BOOKING_URL}" target="_blank" rel="noopener">${T('cta.book', 'Check availability')}</a>
        <button type="button" class="link" id="sxAll">${el ? 'Όλες οι φωτογραφίες' : 'View all photos'} (${ord.length})</button>
      </div>`;
    $('#sxAll').addEventListener('click', () => openLB(ord.map((n, k) => ({ src: src(s, n), alt: `${s.name}, photo ${k + 1}`, cap: `${s.name} · ${s.cat}` })), photo, $('#sxAll')));
  }
  $('#sxPrev').addEventListener('click', () => setPhoto(photo - 1, true));
  $('#sxNext').addEventListener('click', () => setPhoto(photo + 1, true));
  // swipe (never required — arrows and thumbnails do the same)
  (function () {
    let x0 = null;
    const f = $('#sxFrame');
    f.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    f.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) setPhoto(photo + (dx < 0 ? 1 : -1), true); x0 = null; });
    f.addEventListener('click', () => { const s = A.SUITES[cur], ord = order(s); openLB(ord.map((n, k) => ({ src: src(s, n), alt: `${s.name}, photo ${k + 1}`, cap: `${s.name} · ${s.cat}` })), photo, f); });
    f.style.cursor = 'zoom-in';
  })();

  function renderCompare() {
    const el = lang === 'el', S = A.SUITES;
    const row = (label, fn) => `<tr><th scope="row">${label}</th>${S.map(s => `<td>${fn(s)}</td>`).join('')}</tr>`;
    $('#cmp').innerHTML = `<table><caption class="sr">${el ? 'Σύγκριση σουιτών' : 'Suite comparison'}</caption>
      <thead><tr><td></td>${S.map(s => `<th scope="col">${s.name}</th>`).join('')}</tr></thead><tbody>
      ${row(el ? 'Κατηγορία' : 'Category', s => s.cat)}
      ${row(el ? 'Εμβαδόν' : 'Size', s => s.size + ' m²')}
      ${row(el ? 'Επισκέπτες' : 'Guests', s => (el ? 'έως ' : 'up to ') + s.guests)}
      ${row(el ? 'Κρεβάτια' : 'Beds', s => (el ? s.bedsEl : s.beds).join('<br>'))}
      ${row(el ? 'Κουζίνα' : 'Kitchen', s => s.kitchen ? (el ? 'Ναι' : 'Listed') : `<span class="muted">${el ? 'Ρωτήστε μας' : 'Ask us'}</span>`)}
      ${row(el ? 'Σε όλες' : 'All suites', () => el ? 'Θέα θάλασσα, μπαλκόνι, πισίνα' : 'Sea view, balcony, shared pool')}
      </tbody></table>
      <p class="compare-foot">${el ? 'Στοιχεία από τις σελίδες των σουιτών.' : 'Details from each suite’s page. Where kitchen facilities aren’t listed, ask the team.'}</p>`;
  }
  $('#cmpBtn').addEventListener('click', () => {
    const c = $('#cmp'); c.hidden = !c.hidden;
    $('#cmpBtn').setAttribute('aria-expanded', String(!c.hidden));
    $('#cmpBtn').textContent = T(c.hidden ? 'cmp.open' : 'cmp.close', c.hidden ? 'Compare all five suites' : 'Close comparison');
    if (!c.hidden) renderCompare();
  });

  /* ---- a day at althea --------------------------------------------------- */
  const DAY = [
    { img: 'balcony-cup', small: 'coffee', alt: 'A cup on the balcony wall with the sea beyond',
      h: ['Coffee on the balcony', 'Καφές στο μπαλκόνι'],
      p: ['Every suite has its own coffee machine and a private balcony looking out to sea. Wake slowly, watch the light move over the water.', 'Κάθε σουίτα έχει μηχανή καφέ και ιδιωτικό μπαλκόνι με θέα στη θάλασσα. Ξυπνήστε αργά και δείτε το φως να κινείται πάνω στο νερό.'],
      fine: ['À la carte breakfast is available on request, for an additional charge.', 'Πρωινό à la carte κατόπιν αιτήματος, με επιπλέον χρέωση.'] },
    { img: 'loungers', small: 'hat-shadow', alt: 'Loungers and fringed parasols beside the pool',
      h: ['An afternoon by the pool', 'Ένα απόγευμα στην πισίνα'],
      p: ['Loungers, fringed parasols and a long view of the Aegean. Or take the path to one of Anafi’s quiet beaches.', 'Ξαπλώστρες, ομπρέλες με κρόσσια και θέα στο Αιγαίο. Ή πάρτε το μονοπάτι για μια από τις ήσυχες παραλίες της Ανάφης.'],
      fine: ['The pool is shared by all guests.', 'Η πισίνα είναι κοινόχρηστη για όλους τους επισκέπτες.'] },
    { img: 'pool-chora', small: 'wine', alt: 'The pool edge with the houses of Chora behind',
      h: ['Evening over Chora', 'Βράδυ πάνω από τη Χώρα'],
      p: ['A glass of local wine as the village lights come on — then dinner at a taverna in Chora, a short walk away, and a sky full of stars.', 'Ένα ποτήρι τοπικό κρασί καθώς ανάβουν τα φώτα του χωριού — μετά δείπνο σε ταβέρνα της Χώρας, λίγα βήματα μακριά, κι ένας ουρανός γεμάτος αστέρια.'],
      fine: ['An idea for your day, not a set itinerary.', 'Μια ιδέα για τη μέρα σας, όχι πρόγραμμα.'] }
  ];
  let ch = 0;
  function renderDay() {
    const d = DAY[ch], i = lang === 'el' ? 1 : 0;
    $('#dayPanel').innerHTML = `<h3>${d.h[i]}</h3><p>${d.p[i]}</p><p class="fine">${d.fine[i]}</p>`;
    const f = $('#dayFrame');
    if (!f.dataset.cur || f.dataset.cur !== d.img) {
      f.dataset.cur = d.img;
      f.innerHTML = `<img src="img/${d.img}.webp" alt="${d.alt}" loading="lazy"><img class="small" src="img/${d.small}-sm.webp" alt="" loading="lazy">`;
    }
  }
  $$('#dayTabs [data-ch]').forEach(b => b.addEventListener('click', () => {
    ch = +b.dataset.ch; $$('#dayTabs [data-ch]').forEach(x => x.setAttribute('aria-selected', String(x === b))); renderDay();
  }));
  $('#dayTabs').addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const bs = $$('#dayTabs [data-ch]'); const n = (ch + (e.key === 'ArrowRight' ? 1 : -1) + 3) % 3; bs[n].click(); bs[n].focus();
  });

  /* ---- gallery + lightbox ------------------------------------------------ */
  const GAL = [
    ['terraces', 'Terraces stepping down toward the Aegean'], ['window-path', 'A view through an open door to the winding hillside road and the sea'], ['arch-balcony', 'Whitewashed architecture and a pergola against a deep blue sky'],
    ['amphora', 'A clay amphora among wild plants above the hillside'], ['welcome', 'A welcome gift of local goods'], ['wildflowers', 'Wildflowers with the sea behind'], ['stairs', 'White stairways and terraces of the suites']
  ];
  $('#gal').innerHTML = GAL.map((g, i) => `<button type="button" class="g${i + 1}" data-g="${i}" aria-label="Open photo: ${g[1]}"><img src="img/${g[0]}-sm.webp" alt="" loading="lazy"></button>`).join('');
  $('#gal').addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (b) openLB(GAL.map(g => ({ src: `img/${g[0]}.webp`, alt: g[1], cap: g[1] })), +b.dataset.g, b); });

  const lb = $('#lb'); let lbItems = [], lbI = 0, lbReturn = null;
  function lbShow() { const it = lbItems[lbI]; $('#lbImg').src = it.src; $('#lbImg').alt = it.alt; $('#lbCap').textContent = it.cap; $('#lbCount').textContent = `${lbI + 1} / ${lbItems.length}`; }
  function openLB(items, i, from) { lbItems = items; lbI = i; lbReturn = from; lbShow(); lb.showModal(); }
  $('#lbPrev').addEventListener('click', () => { lbI = (lbI - 1 + lbItems.length) % lbItems.length; lbShow(); });
  $('#lbNext').addEventListener('click', () => { lbI = (lbI + 1) % lbItems.length; lbShow(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') $('#lbPrev').click(); if (e.key === 'ArrowRight') $('#lbNext').click(); });
  lb.addEventListener('close', () => { if (lbReturn) lbReturn.focus(); });

  /* ---- experience request (demo) ---------------------------------------- */
  const dlg = $('#reqDlg'); let dlgReturn = null;
  function fillExpSelect() {
    const c = A.get().content.published, sel = $('#rqExp'), v = sel.value;
    sel.innerHTML = A.EXPERIENCES.filter(x => c.expOpen[x.id] !== false).map(x => `<option value="${x.id}">${lang === 'el' ? x.el : x.name}</option>`).join('');
    if (v) sel.value = v;
    const x = A.EXPERIENCES.find(e => e.id === sel.value); $('#rqGroup').textContent = x ? x.group : '';
  }
  $('#rqExp').addEventListener('change', fillExpSelect);
  $$('[data-exp]').forEach(b => b.addEventListener('click', () => {
    dlgReturn = b; fillExpSelect(); $('#rqExp').value = b.dataset.exp; fillExpSelect();
    $('#reqForm').hidden = false; $('#reqOk').hidden = true;
    $('#rqDate').min = A.TODAY;
    dlg.showModal();
  }));
  $$('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
  dlg.addEventListener('close', () => { if (dlgReturn) dlgReturn.focus(); });
  function fieldErr(id, msg) { const i = $('#' + id), e = $('#' + id + 'Err'); i.setAttribute('aria-invalid', msg ? 'true' : 'false'); e.hidden = !msg; e.textContent = msg || ''; return !msg; }
  $('#reqForm').addEventListener('submit', e => {
    e.preventDefault();
    const el = lang === 'el', date = $('#rqDate').value, party = +$('#rqParty').value, name = $('#rqName').value.trim();
    let ok = fieldErr('rqDate', !date ? (el ? 'Επιλέξτε ημερομηνία.' : 'Choose a preferred date.') : date < A.TODAY ? (el ? 'Η ημερομηνία έχει περάσει.' : 'That date has already passed (demo date is 23 Sep 2026).') : '');
    ok = fieldErr('rqParty', !(party >= 1 && party <= 12) ? (el ? 'Από 1 έως 12 άτομα.' : 'Enter a party size from 1 to 12.') : '') && ok;
    ok = fieldErr('rqName', !name ? (el ? 'Συμπληρώστε το όνομά σας.' : 'Enter your name so the team knows who is asking.') : '') && ok;
    if (!ok) { const f = $('#reqForm [aria-invalid="true"]'); if (f) f.focus(); return; }
    const x = A.EXPERIENCES.find(v => v.id === $('#rqExp').value);
    A.update(d => {
      d.requests.unshift({ id: A.nextId(d, 'RQ'), res: null, guestName: name, type: 'experience', exp: x.id, title: x.name, status: 'received', owner: 't1', at: A.NOW, source: 'Website',
        detail: { date, party }, thread: [{ by: 'guest', at: A.NOW, text: $('#rqNote').value.trim() || `Request for ${x.name} on ${A.fmtDate(date)} for ${party}.` }], proposal: null, staffNotes: '' });
    }, `Website request: ${x.name} (${name})`);
    $('#reqForm').reset(); $('#reqForm').hidden = true; $('#reqOk').hidden = false; $('#reqOk').focus();
  });

  /* ---- header, menu, reveal --------------------------------------------- */
  const hdr = $('#hdr');
  addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 10), { passive: true });
  const mb = $('.menu-btn'), mn = $('#mnav');
  mb.addEventListener('click', () => { const o = mn.hidden; mn.hidden = !o; mb.setAttribute('aria-expanded', String(o)); });
  mn.addEventListener('click', e => { if (e.target.closest('a')) { mn.hidden = true; mb.setAttribute('aria-expanded', 'false'); } });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !mn.hidden) { mn.hidden = true; mb.setAttribute('aria-expanded', 'false'); mb.focus(); } });

  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(el => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('rv-on'); io.observe(el); } else el.classList.add('in'); });
  } else { $$('.rv').forEach(el => el.classList.add('in')); }

  buildTabs();
  applyLang();
  A.onChange(() => { renderContent(); renderSuite(false); fillExpSelect(); });
})();
