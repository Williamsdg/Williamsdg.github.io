/* Heights Title concept. Copy below is Heights Title's own wording from their site, guides and blog. */
document.documentElement.classList.add('js');
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  var ORDER = 'https://heightstitle.titlecapture.com/login';
  var QUOTE = 'https://heightstitle.titlecapture.com/account/form/quick-quote';
  var PDF = {
    buyer: 'https://heightstitle.us/wp-content/uploads/2022/02/Buyers-Guide-Heights.pdf',
    seller: 'https://heightstitle.us/wp-content/uploads/2022/02/Sellers-Guide-Heights.pdf',
    checklist: 'https://heightstitle.us/wp-content/uploads/2022/10/Pre-Closing-Checklist.pdf',
    refi: 'https://heightstitle.us/wp-content/uploads/2022/02/Title-Insurance-on-a-Refinance-Guide-Heights.pdf'
  };
  var BLOG = 'https://heightstitle.us/';
  var ICONS = {
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    order: '<path d="M9 3h6l1 3H8z"/><rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 12h6M9 16h6"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h3.5"/>',
    read: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
    chat: '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>'
  };
  var svg = function (body) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>'; };
  var ARROW = svg('<path d="M5 12h14M13 6l6 6-6 6"/>');

  /* ---------- "What brings you in?" ---------- */
  var ROLES = {
    buying: {
      lede: 'The largest financial investment people make during their lifetime is often the purchase of a home. We protect your purchase and provide the insurance you need to secure the title.',
      acts: [
        ['doc', 'Buyer’s Guide', 'Tips to help you feel prepared for your closing (PDF)', PDF.buyer],
        ['list', 'Pre-closing checklist', 'What to send us before closing day', '#checklist', 'buyer'],
        ['calc', 'Get a quote', 'Our quick and easy online quote', QUOTE],
        ['read', 'What to expect on closing day', 'From our blog', BLOG + 'what-to-expect-on-closing-day/']
      ]
    },
    selling: {
      lede: 'As the seller, you’ll have fewer responsibilities in the transaction than the buyer, but there are expenses you need to be aware of.',
      acts: [
        ['doc', 'Seller’s Guide', 'A checklist for putting your house on the market (PDF)', PDF.seller],
        ['list', 'Pre-closing checklist', 'Payoff letters, tax information and more', '#checklist', 'seller'],
        ['read', 'Closing costs to plan for', 'Real estate fees, tax transfers, HOA dues and others', 'services.html#selling'],
        ['calc', 'Get a quote', 'Our quick and easy online quote', QUOTE]
      ]
    },
    refinancing: {
      lede: 'Need cash or a lower interest rate? Refinancing may be your best option. Your owner’s policy stays with you, but your lender will need a new lender’s policy.',
      acts: [
        ['doc', 'Title Insurance on a Refinance', 'Why your lender requires a new policy (PDF)', PDF.refi],
        ['list', 'Refinance checklist', 'What to have ready before closing', '#checklist', 'refinance'],
        ['read', 'Refinancing, explained', 'Benefits, options and how to prepare', 'services.html#refinance'],
        ['calc', 'Get a quote', 'Our quick and easy online quote', QUOTE]
      ]
    },
    commercial: {
      lede: 'Commercial transactions tend to be unique and require expertise, attention to detail, and a careful approach to insure and close. From concept to closing, Heights covers all of your commercial needs.',
      acts: [
        ['order', 'Start an order', 'Order your title online', ORDER],
        ['list', 'Corporation checklist', 'Articles of incorporation, good standing and more', '#checklist', 'corporation'],
        ['read', 'Commercial title', 'How we close complex deals', 'services.html#commercial'],
        ['chat', 'Talk to our team', 'Tell us about the deal', 'contact.html?topic=commercial']
      ]
    },
    agent: {
      lede: 'Our preliminary search gives an overview of current ownership, tax status, liens, and judgments recorded. It is complimentary to agents and helpful for listing appointments.',
      acts: [
        ['order', 'Start an order', 'Order a title online', ORDER],
        ['chat', 'Request a preliminary search', 'Complimentary for agents', 'contact.html?topic=preliminary'],
        ['list', 'Realtor checklist', 'Sales contract, commission sheet and more', '#checklist', 'realtor'],
        ['calc', 'Get a quote for a client', 'Our quick and easy online quote', QUOTE]
      ]
    },
    lender: {
      lede: 'A 30-year search and examination is a requirement for both purchase and refinance transactions. A title commitment will be provided specifying the requirements necessary to insure the property.',
      acts: [
        ['order', 'Order a title', 'Order online', ORDER],
        ['doc', 'Title Insurance on a Refinance', 'A guide to share with borrowers (PDF)', PDF.refi],
        ['list', 'Pre-closing checklists', 'Buyer, seller and refinance', '#checklist', 'buyer'],
        ['calc', 'Get a quote', 'Our quick and easy online quote', QUOTE]
      ]
    },
    builder: {
      lede: 'Heights Title makes the process of buying a new construction home easy on everyone involved. The buyer and builder can focus on the details of creating the home, while we handle the paperwork.',
      acts: [
        ['order', 'Order a title', 'Order online', ORDER],
        ['read', 'New construction and title', 'What buyers should check before closing on a new build', BLOG + 'new-construction-and-title-what-to-know/'],
        ['calc', 'Get a quote', 'Our quick and easy online quote', QUOTE],
        ['chat', 'Talk to our team', 'Call or send a note', 'contact.html?topic=purchase']
      ]
    }
  };
  var desk = $('[data-desk]');
  if (desk) {
    var body = $('[data-desk-body]', desk);
    var renderRole = function (key) {
      var r = ROLES[key];
      $$('.chip', desk).forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.role === key)); });
      body.innerHTML = '<p class="desk-lede">' + r.lede + '</p><ul class="acts">' + r.acts.map(function (a) {
        return '<li><a class="act" href="' + a[3] + '"' + (a[4] ? ' data-for="' + a[4] + '"' : '') + '><span class="act-ic">' + svg(ICONS[a[0]]) + '</span><span class="act-t"><b>' + a[1] + '</b><small>' + a[2] + '</small></span>' + ARROW + '</a></li>';
      }).join('') + '</ul>';
      body.classList.remove('swap'); void body.offsetWidth; body.classList.add('swap');
    };
    desk.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (chip) { renderRole(chip.dataset.role); chip.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    });
  }

  /* ---------- pre-closing checklist (their PDF, item for item) ---------- */
  var LISTS = {
    buyer: ['Buyer pre-closing items', ['Contact Information Sheet', 'Lender Information', 'Homeowners Insurance', 'Property Survey', ['Designate Power of Attorney', 'if applicable'], 'Wire Instructions for Cash to Close']],
    seller: ['Seller pre-closing items', ['Contact Information Sheet', 'Mortgage Payoff Authorization Letter', 'Second Mortgage Payoff Letters', 'Property Tax Information', ['Original Death Certificate', 'if applicable'], 'Estate Sale (Probate Records)', ['Designate Power of Attorney', 'if applicable'], 'Wire Instructions for Proceeds']],
    refinance: ['Refinance pre-closing checklist', ['Contact Information Sheet', 'Mortgage Payoff Authorization Letter', 'New Lender Information', 'Loan Officer Information', 'Property Tax Information', 'Homeowners Insurance', 'Homeowners Association Letter', 'Wire Instructions for Cash to Close']],
    realtor: ['Realtor pre-closing items', ['Personal Information Sheet', 'Sales Contract', 'Copy of Buyer Earnest Money Deposit', 'Sellers Contribution Information', 'Commission Sheet', 'Termite Paperwork', 'Property Survey', 'Home Warranty Information', 'Broker Disbursement Instructions']],
    corporation: ['Corporation purchase or sale checklist', ['Contact Information Sheet', 'Articles of Incorporation', 'Operating Agreement', 'Certificate of Good Standing', 'Corporate Resolution Authorizing Signer']]
  };
  var ck = $('[data-checklist]');
  var showList;
  if (ck) {
    var KEY = 'ht_checklist_v1';
    var ticks = store.get(KEY) || {};
    var cur = 'buyer';
    var listEl = $('[data-ck-list]', ck);
    var update = function () {
      var items = LISTS[cur][1], done = (ticks[cur] || []).filter(function (i) { return i < items.length; }).length;
      $('[data-ck-count]', ck).textContent = done + ' of ' + items.length + ' ready';
      $('[data-ck-bar]', ck).style.width = (done / items.length * 100) + '%';
      var names = items.filter(function (_, i) { return (ticks[cur] || []).indexOf(i) > -1; }).map(function (it) { return typeof it === 'string' ? it : it[0]; });
      var subj = 'Pre-closing documents (' + LISTS[cur][0].replace(/ (pre-closing items|pre-closing checklist|checklist)$/i, '') + ')';
      var bodyTxt = names.length ? 'Attached:\n- ' + names.join('\n- ') + '\n\nProperty address:\n' : 'Property address:\n';
      $('[data-ck-mail]', ck).href = 'mailto:closings@heightstitle.us?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(bodyTxt);
    };
    showList = function (key) {
      if (!LISTS[key]) return;
      cur = key;
      $$('[data-ck]', ck).forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.ck === key)); b.tabIndex = b.dataset.ck === key ? 0 : -1; });
      $('[data-ck-title]', ck).textContent = LISTS[key][0];
      listEl.innerHTML = LISTS[key][1].map(function (it, i) {
        var name = typeof it === 'string' ? it : it[0], note = typeof it === 'string' ? '' : '<span class="note">(' + it[1] + ')</span>';
        var on = (ticks[key] || []).indexOf(i) > -1;
        return '<li><label><input type="checkbox" data-i="' + i + '"' + (on ? ' checked' : '') + '><span class="it">' + name + note + '</span></label></li>';
      }).join('');
      update();
    };
    ck.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ck]');
      if (b) showList(b.dataset.ck);
      if (e.target.closest('[data-ck-reset]')) { ticks[cur] = []; store.set(KEY, ticks); showList(cur); }
    });
    $('.seg', ck).addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var tabs = $$('[data-ck]', ck), i = tabs.findIndex(function (t) { return t.dataset.ck === cur; });
      var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      showList(n.dataset.ck); n.focus();
    });
    listEl.addEventListener('change', function (e) {
      var i = +e.target.dataset.i, arr = ticks[cur] || [];
      ticks[cur] = e.target.checked ? arr.concat(i) : arr.filter(function (x) { return x !== i; });
      store.set(KEY, ticks); update();
    });
    var q = new URLSearchParams(location.search).get('for');
    showList(LISTS[q] ? q : 'buyer');
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-for]');
    if (a && showList && a.getAttribute('href') === '#checklist') showList(a.dataset.for);
  });

  /* ---------- team strip ---------- */
  var strip = $('[data-strip]');
  $$('[data-scroll]').forEach(function (b) {
    b.addEventListener('click', function () { strip.scrollBy({ left: +b.dataset.scroll * strip.clientWidth * 0.8, behavior: 'smooth' }); });
  });

  /* ---------- area map highlight ---------- */
  var map = $('.amap');
  if (map) {
    var hl = function (key, on) {
      $$('[data-area="' + key + '"]').forEach(function (el) { el.classList.toggle('on', on); });
    };
    $$('[data-area]').forEach(function (el) {
      var key = el.dataset.area;
      ['mouseenter', 'focusin'].forEach(function (ev) { el.addEventListener(ev, function () { hl(key, true); }); });
      ['mouseleave', 'focusout'].forEach(function (ev) { el.addEventListener(ev, function () { hl(key, false); }); });
    });
  }

  /* ---------- menu ---------- */
  var mb = $('.menu-btn'), menu = $('#menu');
  if (mb) {
    var setMenu = function (open) {
      mb.setAttribute('aria-expanded', String(open)); menu.hidden = !open;
      mb.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mb.innerHTML = svg(open ? '<path d="M6 6l12 12M18 6 6 18"/>' : '<path d="M4 7h16M4 12h16M4 17h16"/>');
    };
    mb.addEventListener('click', function () { setMenu(menu.hidden); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); mb.focus(); } });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  }

  /* ---------- in-page sub navigation ---------- */
  var sublinks = $$('.subnav a');
  if (sublinks.length) {
    var targets = sublinks.map(function (a) { return $(a.hash); });
    var mark = function () {
      var line = window.innerHeight * 0.4, cur = -1;
      targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top < line) cur = i; });
      sublinks.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
    };
    window.addEventListener('scroll', mark, { passive: true });
    mark();
  }

  /* ---------- toast + demo form ---------- */
  var toast = $('.toast'), tt;
  var say = function (msg) { toast.textContent = msg; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 4200); };
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = $$('[required]', f).filter(function (i) { return !i.value.trim(); });
      if (bad.length) { bad[0].focus(); say('Add your ' + bad[0].dataset.name + ' so we can reach you.'); return; }
      say(f.dataset.demo); f.reset();
    });
  });
  var topic = new URLSearchParams(location.search).get('topic'), sel = $('#topic');
  if (sel && topic && $('option[value="' + topic + '"]', sel)) sel.value = topic;

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
