/* Aldridge & Vance v2 — front page + practice guide behaviour. Vanilla JS, no network calls. */
(function () {
  'use strict';
  var D = window.AV;
  var P = D.storagePrefix;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function store(k, v) { try { if (v === undefined) { return JSON.parse(localStorage.getItem(P + k)); } localStorage.setItem(P + k, JSON.stringify(v)); } catch (e) { return null; } }
  function clearStore() { try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf(P) === 0) localStorage.removeItem(k); }); } catch (e) {} }
  function area(id) { return D.areas.filter(function (a) { return a.id === id; })[0]; }
  function scenario(id) { return D.scenarios.filter(function (s) { return s.id === id; })[0]; }
  function person(id) { return D.people.filter(function (p) { return p.id === id; })[0]; }
  function announce(t) { var l = $('#live'); if (l) { l.textContent = ''; setTimeout(function () { l.textContent = t; }, 30); } }
  function params() { return new URLSearchParams(location.search); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isNarrow() { return window.matchMedia('(max-width: 980px)').matches; }

  function timelineHTML(tag, branches) {
    return D.stages.map(function (s, i) {
      var last = i === D.stages.length - 1;
      return '<li><span class="node" aria-hidden="true"></span><div><' + tag + '>' + esc(s[0]) + '</' + tag + '><p>' + esc(s[1]) + '</p>' +
        (last && branches ? '<ul class="branches" aria-label="Possible paths">' + branches.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' : '') +
        '</div></li>';
    }).join('');
  }

  function personHTML(p, headTag) {
    var h = headTag || 'h3';
    return '<' + h + '>' + esc(p.name) + '</' + h + '>' +
      '<p class="role">' + esc(p.role) + '</p>' +
      '<p>' + esc(p.note) + '</p>' +
      '<ul aria-label="Guides for ' + esc(p.name) + '">' + p.areas.map(function (id) {
        var a = area(id); return '<li><a href="practice.html?area=' + a.id + '">' + esc(a.title) + '</a></li>';
      }).join('') + '</ul>';
  }

  $$('[data-reset]').forEach(function (b) {
    b.addEventListener('click', function () {
      clearStore();
      history.replaceState(null, '', location.pathname + (document.body.dataset.page === 'practice' ? location.search : ''));
      if (window.AVHome) window.AVHome.reset();
      announce('Demo reset. Saved sample requests were cleared from this browser.');
    });
  });

  /* ================= PRACTICE GUIDE PAGE ================= */
  if (document.body.dataset.page === 'practice') {
    var q = params().get('area');
    var a = area(q);
    var fallback = !a;
    if (!a) a = D.areas[0];
    var scen = scenario(a.scenario);
    document.title = a.title + ' — Aldridge & Vance practice guide (concept)';

    $('#crumb-current').textContent = a.title;
    $('#g-label').textContent = 'Practice guide ' + a.n + ' of ' + D.areas.length;
    $('#g-title').textContent = a.title;
    $('#g-sf').textContent = a.standfirst;
    if (fallback) { $('#g-fallback').hidden = false; }

    $('#s-covers-p').textContent = a.summary;
    $('#s-covers-list').innerHTML = a.covers.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');
    $('#s-questions-list').innerHTML = a.questions.map(function (qa) { return '<dt>' + esc(qa[0]) + '</dt><dd>' + esc(qa[1]) + '</dd>'; }).join('');
    $('#s-prepare-list').innerHTML = a.prepare.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');
    $('#g-timeline').innerHTML = timelineHTML('h3', a.resolution);
    $('#g-brief').textContent = a.short;
    $('#g-first').innerHTML = 'Usually first contact: <strong>' + esc(person(a.people[0]).name) + '</strong> (fictional)';

    var leads = a.people;
    $('#g-people').innerHTML = D.people.map(function (p) {
      var lead = leads.indexOf(p.id) > -1;
      return '<div class="person' + (lead ? ' lead-p' : '') + '">' + personHTML(p, 'h3').replace('</p>', lead ? ' · usually first contact for this guide</p>' : '</p>') + '</div>';
    }).join('');

    var back = 'index.html?area=' + a.id + '#dealing';
    $$('[data-back]').forEach(function (el) { el.href = back; });
    $('#g-cta-text').textContent = scen && scen.id !== 'other'
      ? 'Start from “' + scen.label.replace(/’/g, '’') + '” — the introductory request will be tailored to this guide.'
      : 'Start from “Something else” with this topic preselected.';

    $('#g-other').innerHTML = D.areas.filter(function (x) { return x.id !== a.id; }).map(function (x) {
      return '<li><a href="practice.html?area=' + x.id + '">' + esc(x.title) + '</a></li>';
    }).join('');

    /* scroll-spy for the sticky contents */
    var links = $$('.toc-side ol a');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (l) {
              var on = l.getAttribute('href') === '#' + e.target.id;
              l.classList.toggle('on', on);
              if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
            });
          }
        });
      }, { rootMargin: '-10% 0px -70% 0px' });
      $$('.body-col section[id]').forEach(function (s) { io.observe(s); });
    }
    return;
  }

  /* ================= FRONT PAGE ================= */
  $('#toc').innerHTML = D.areas.map(function (x) {
    return '<li><a href="practice.html?area=' + x.id + '"><span class="num">' + pad(x.n) + '</span>' +
      '<span><span class="t">' + esc(x.title) + '</span><span class="d">' + esc(x.short) + '</span></span>' +
      '<span class="go" aria-hidden="true">Guide →</span></a></li>';
  }).join('');

  $('#acc').innerHTML = D.areas.map(function (x) {
    return '<li><details><summary><span class="num">' + pad(x.n) + '</span><span class="t">' + esc(x.title) + '</span><span class="pm" aria-hidden="true"></span></summary>' +
      '<div class="body"><p>' + esc(x.summary) + '</p><div class="links">' +
      '<a href="practice.html?area=' + x.id + '">Read the full guide →</a>' +
      '<a href="index.html?area=' + x.id + '#dealing">This is close to my situation ↓</a></div></div></details></li>';
  }).join('');

  $('#home-timeline').innerHTML = timelineHTML('h3', ['Negotiated or informal', 'Mediation', 'Court or agency process, if needed']);
  $('#p-aldridge').innerHTML = personHTML(person('aldridge'));
  $('#p-vance').innerHTML = personHTML(person('vance'));

  var choiceList = $('#choices');
  choiceList.innerHTML = D.scenarios.map(function (s) {
    return '<li><button type="button" class="choice" aria-pressed="false" data-s="' + s.id + '" aria-controls="result">' +
      '<span class="c-l">' + esc(s.label) + '</span><span class="c-h">' + esc(s.hint) + '</span></button></li>';
  }).join('');
  var buttons = $$('.choice', choiceList);

  choiceList.addEventListener('keydown', function (e) {
    var i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    var n = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % buttons.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + buttons.length) % buttons.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = buttons.length - 1;
    if (n !== null) { e.preventDefault(); buttons[n].focus(); }
  });
  choiceList.addEventListener('click', function (e) {
    var b = e.target.closest('.choice');
    if (b) select(b.dataset.s, { fromUser: true });
  });

  var current = null;

  function fieldHTML(f, sid) {
    var id = 'f-' + sid + '-' + f.id;
    var opt = f.required ? '' : ' <span class="opt">(optional)</span>';
    if (f.type === 'radio') {
      return '<fieldset class="field full" data-field="' + f.id + '" data-label="' + esc(f.label) + '"' + (f.required ? ' data-required' : '') + '>' +
        '<legend>' + esc(f.label) + opt + '</legend><div class="radios">' +
        f.options.map(function (o, i) {
          return '<label><input type="radio" name="' + f.id + '" value="' + esc(o) + '" id="' + id + '-' + i + '">' + esc(o) + '</label>';
        }).join('') + '</div><p class="err" id="' + id + '-err" hidden></p></fieldset>';
    }
    if (f.type === 'select') {
      return '<div class="field" data-field="' + f.id + '" data-label="' + esc(f.label) + '"' + (f.required ? ' data-required' : '') + '>' +
        '<label for="' + id + '">' + esc(f.label) + opt + '</label><select id="' + id + '" name="' + f.id + '" aria-describedby="' + id + '-err">' +
        '<option value="">Choose one</option>' + f.options.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') +
        '</select><p class="err" id="' + id + '-err" hidden></p></div>';
    }
    if (f.type === 'textarea') {
      return '<div class="field full" data-field="' + f.id + '" data-label="' + esc(f.label) + '"' + (f.required ? ' data-required' : '') + '>' +
        '<label for="' + id + '">' + esc(f.label) + opt + '</label><textarea id="' + id + '" name="' + f.id + '" maxlength="' + f.max + '" aria-describedby="' + id + '-help ' + id + '-err"></textarea>' +
        '<p class="help" id="' + id + '-help">' + esc(f.help) + ' Up to ' + f.max + ' characters.</p><p class="err" id="' + id + '-err" hidden></p></div>';
    }
    return '';
  }

  function commonFields(sid) {
    var p = 'f-' + sid + '-';
    return '' +
      '<div class="field" data-field="name" data-label="Your name" data-required><label for="' + p + 'name">Your name</label>' +
      '<input type="text" id="' + p + 'name" name="name" autocomplete="off" aria-describedby="' + p + 'name-err"><p class="err" id="' + p + 'name-err" hidden></p></div>' +
      '<div class="field" data-field="email" data-label="Email" data-required data-kind="email"><label for="' + p + 'email">Email</label>' +
      '<input type="email" id="' + p + 'email" name="email" autocomplete="off" aria-describedby="' + p + 'email-help ' + p + 'email-err">' +
      '<p class="help" id="' + p + 'email-help">For this demo, an @example.com address is fine.</p><p class="err" id="' + p + 'email-err" hidden></p></div>' +
      '<fieldset class="field" data-field="contact" data-label="Preferred way to reply" data-required><legend>Preferred way to reply</legend><div class="radios">' +
      '<label><input type="radio" name="contact" value="Email">Email</label><label><input type="radio" name="contact" value="Phone">Phone</label></div>' +
      '<p class="err" id="' + p + 'contact-err" hidden></p></fieldset>' +
      '<div class="field" data-field="phone" data-label="Phone" data-kind="phone"><label for="' + p + 'phone">Phone <span class="opt">(optional)</span></label>' +
      '<input type="tel" id="' + p + 'phone" name="phone" autocomplete="off" aria-describedby="' + p + 'phone-err"><p class="err" id="' + p + 'phone-err" hidden></p></div>';
  }

  function render(s, opts) {
    var body = $('#result-body');
    var a = s.area ? area(s.area) : null;
    var guide;
    if (a) {
      guide = '<p class="gt">' + esc(a.title) + '</p><p>' + esc(a.summary) + '</p>' +
        '<a class="more" href="practice.html?area=' + a.id + '">Read the full practice guide →</a>';
    } else {
      guide = '<p class="gt">No single guide</p><p>If your matter isn’t listed, the closest guide is still a useful place to start. All six are here:</p>' +
        '<ul class="other" style="font-family:var(--sans)">' + D.areas.map(function (x) {
          return '<li><a href="practice.html?area=' + x.id + '">' + esc(x.title) + '</a></li>';
        }).join('') + '</ul>';
    }
    var saved = (store('requests') || []).filter(function (r) { return r.scenario === s.id; }).pop();

    body.innerHTML =
      '<div class="r-head"><h3 id="result-title" tabindex="-1">' + esc(s.label) + '</h3><span class="label">Your situation</span></div>' +
      '<div class="r-cols">' +
        '<div class="r-guide"><h4>(a) From the practice guide</h4>' + guide + '</div>' +
        '<div><h4>(b) What usually happens next</h4><ol class="steps">' + s.next.map(function (n) { return '<li><span>' + esc(n) + '</span></li>'; }).join('') + '</ol></div>' +
      '</div>' +
      '<div class="form-wrap" id="form-wrap">' +
        '<div class="form-head"><div><h4>(c) Sample introductory request</h4>' +
        '<p>Short, general questions for this situation. Their only purpose would be to arrange a first conversation and a conflict check.</p></div>' +
        '<p class="notice" role="note"><strong>General information, not legal advice.</strong> This fictional demo sends nothing — do not enter confidential details.</p></div>' +
        '<div id="form-slot"></div>' +
      '</div>';

    if (saved && !opts.fresh) showSlip(s, saved); else showForm(s, opts.topic);

    $('#result-empty').hidden = true;
    body.hidden = false;
    $('#result').setAttribute('aria-labelledby', 'result-title');
    if (!reduce) { body.classList.remove('fade'); void body.offsetWidth; body.classList.add('fade'); }
  }

  function showForm(s, topic) {
    var slot = $('#form-slot');
    slot.innerHTML = '<form class="req" novalidate id="req-form" aria-label="Sample introductory request: ' + esc(s.label) + '">' +
      '<div class="err-summary" id="err-summary" tabindex="-1" hidden><h5>Please check the following:</h5><ul></ul></div>' +
      '<div class="grid2">' + commonFields(s.id) + s.fields.map(function (f) { return fieldHTML(f, s.id); }).join('') +
      '<div class="field full" data-field="ack" data-label="Acknowledgement" data-required data-kind="check">' +
      '<label class="check"><input type="checkbox" name="ack" id="f-' + s.id + '-ack" aria-describedby="f-' + s.id + '-ack-err">' +
      '<span>I understand this is a fictional demo, nothing will be sent, and I have not included confidential details.</span></label>' +
      '<p class="err" id="f-' + s.id + '-ack-err" hidden></p></div>' +
      '</div>' +
      '<div class="actions"><button class="btn" type="submit">Save sample request</button>' +
      '<button class="btn ghost" type="reset">Clear answers</button>' +
      '<span class="help">Saved in this browser only.</span></div></form>';
    var form = $('#req-form');
    if (topic) { var sel = form.querySelector('select[name="topic"]'); if (sel) sel.value = topic; }
    form.addEventListener('submit', function (e) { e.preventDefault(); submit(s, form); });
    form.addEventListener('reset', function () { setTimeout(function () { $$('.field', form).forEach(clearErr); $('#err-summary').hidden = true; }, 0); });
    form.addEventListener('change', function (e) { var f = e.target.closest('.field'); if (f && f.classList.contains('invalid')) validateField(f); });
  }

  function clearErr(f) { f.classList.remove('invalid'); var e = f.querySelector('.err'); if (e) { e.hidden = true; e.textContent = ''; } $$('input,select,textarea', f).forEach(function (i) { i.removeAttribute('aria-invalid'); }); }

  function valueOf(f) {
    var name = f.dataset.field;
    var el = f.querySelectorAll('[name="' + name + '"]');
    if (!el.length) return '';
    if (el[0].type === 'radio') { var c = f.querySelector('input:checked'); return c ? c.value : ''; }
    if (el[0].type === 'checkbox') return el[0].checked ? 'yes' : '';
    return el[0].value.trim();
  }

  function validateField(f) {
    clearErr(f);
    var v = valueOf(f), msg = '';
    if (f.hasAttribute('data-required') && !v) {
      msg = f.dataset.kind === 'check' ? 'Please confirm you understand this is a demo.' : (f.tagName === 'FIELDSET' || f.querySelector('select') ? 'Choose an option.' : 'This field is required.');
    } else if (v && f.dataset.kind === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      msg = 'Enter an email address like name@example.com.';
    } else if (v && f.dataset.kind === 'phone' && !/^[0-9()+\-.\s]{7,20}$/.test(v)) {
      msg = 'Use digits only, e.g. (555) 010-0100.';
    }
    if (f.dataset.field === 'phone' && !msg) {
      var form = f.closest('form'); var c = form.querySelector('input[name="contact"]:checked');
      if (c && c.value === 'Phone' && !v) msg = 'Add a phone number, or choose email as your preferred reply.';
    }
    if (msg) {
      f.classList.add('invalid');
      var e = f.querySelector('.err'); e.textContent = msg; e.hidden = false;
      $$('input,select,textarea', f).forEach(function (i) { i.setAttribute('aria-invalid', 'true'); });
    }
    return msg;
  }

  function submit(s, form) {
    var errors = [];
    $$('.field', form).forEach(function (f) {
      var m = validateField(f);
      if (m) errors.push({ f: f, m: m });
    });
    var sum = $('#err-summary');
    if (errors.length) {
      sum.querySelector('ul').innerHTML = errors.map(function (x) {
        var target = x.f.querySelector('input,select,textarea');
        return '<li><a href="#' + target.id + '">' + esc(x.f.dataset.label) + (/[?]$/.test(x.f.dataset.label) ? ' ' : ': ') + esc(x.m) + '</a></li>';
      }).join('');
      sum.hidden = false;
      sum.focus();
      $$('a', sum).forEach(function (a) { a.addEventListener('click', function (ev) { ev.preventDefault(); var t = document.getElementById(a.getAttribute('href').slice(1)); if (t) t.focus(); }); });
      announce(errors.length + (errors.length === 1 ? ' answer needs' : ' answers need') + ' attention.');
      return;
    }
    var answers = [];
    $$('.field', form).forEach(function (f) {
      if (f.dataset.field === 'ack') return;
      var v = valueOf(f); if (v) answers.push([f.dataset.label, v]);
    });
    var now = new Date();
    var rec = { scenario: s.id, answers: answers, saved: now.toISOString(), ref: 'SAMPLE-' + s.id.toUpperCase().slice(0, 3) + '-' + pad(now.getHours()) + pad(now.getMinutes()) };
    var list = store('requests') || [];
    list.push(rec); store('requests', list);
    showSlip(s, rec);
    var h = $('#slip-h'); if (h) h.focus();
    announce('Sample request saved in this browser only. Nothing was sent.');
  }

  function showSlip(s, rec) {
    var d = new Date(rec.saved);
    $('#form-slot').innerHTML = '<div class="slip" role="status">' +
      '<h4 id="slip-h" tabindex="-1">Sample request saved in this browser only</h4>' +
      '<p class="honest">Nothing was sent. No one — real or fictional — will contact you. This is what the request would have contained:</p>' +
      '<dl><dt>Situation</dt><dd>' + esc(s.label) + '</dd>' + rec.answers.map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd>'; }).join('') + '</dl>' +
      '<p class="stamp">Demo reference ' + esc(rec.ref) + ' · saved ' + esc(d.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })) + ' at ' + esc(d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })) + '</p>' +
      '<div class="actions"><button type="button" class="btn ghost" id="slip-new">Start a new sample request</button>' +
      '<button type="button" class="linkbtn" data-reset-local>Reset demo</button></div></div>';
    $('#slip-new').addEventListener('click', function () { showForm(s); var first = $('#req-form input'); if (first) first.focus(); });
    $('[data-reset-local]').addEventListener('click', function () { clearStore(); reset(); announce('Demo reset. Saved sample requests were cleared from this browser.'); var b = buttons[0]; if (b) b.focus(); });
  }

  function select(id, opts) {
    opts = opts || {};
    var s = scenario(id);
    if (!s) return;
    current = s.id;
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.s === s.id)); });
    render(s, opts);
    store('scenario', s.id);
    if (opts.fromUser) {
      var u = new URL(location.href); u.searchParams.delete('area'); u.searchParams.set('situation', s.id); u.hash = 'dealing';
      history.replaceState(null, '', u.pathname + u.search + u.hash);
      announce('Showing guide summary, next steps, and request form for: ' + s.label + '.');
      if (isNarrow()) {
        var r = $('#result');
        r.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }
    }
  }

  function reset() {
    current = null;
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    $('#result-body').hidden = true; $('#result-body').innerHTML = '';
    $('#result-empty').hidden = false;
    $('#result').setAttribute('aria-labelledby', 'result-h');
    history.replaceState(null, '', location.pathname + '#dealing');
  }
  window.AVHome = { reset: reset };

  /* initial state: ?situation=… or ?area=… (from a practice guide), else last choice in this browser */
  var ps = params();
  var fromArea = ps.get('area') && area(ps.get('area'));
  if (ps.get('situation') && scenario(ps.get('situation'))) {
    select(ps.get('situation'));
  } else if (fromArea) {
    var sc = fromArea.scenario;
    select(sc, sc === 'other' ? { topic: fromArea.title, fresh: true } : {});
  } else {
    var last = store('scenario');
    if (last && scenario(last)) select(last);
  }
  if (location.hash === '#dealing' && (ps.get('situation') || fromArea)) {
    setTimeout(function () { var el = document.getElementById('dealing'); if (el) el.scrollIntoView(); }, 50);
  }

  /* Mobile accordions: close others when one opens (keeps the list short) */
  $$('#acc details').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) $$('#acc details').forEach(function (o) { if (o !== d) o.open = false; }); });
  });
})();
