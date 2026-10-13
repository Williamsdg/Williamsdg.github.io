/* Williams Digital — Outreach page. Talks to wd-outreach-api; nothing secret lives here. */
(() => {
  const API_BASES = ['https://outreach-api.williamsdigital.io', 'https://wd-outreach-api.vercel.app'];
  const LS = { token: 'wd-outreach-token', base: 'wd-outreach-base', view: 'wd-outreach-view' };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmtDate = iso => iso ? new Date(iso).toLocaleString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';
  const money = c => `$${((c || 0) / 100).toFixed(2)}`;
  let base = localStorage.getItem(LS.base) || API_BASES[0];
  let token = localStorage.getItem(LS.token) || '';
  let tickTimer = null;
  let state = { campaigns: [], status: null };

  // ---------- api ----------
  async function raw(path, opts = {}) {
    const res = await fetch(base + path, {
      ...opts,
      headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...(opts.headers || {}) },
      body: opts.body && typeof opts.body !== 'string' ? JSON.stringify(opts.body) : opts.body,
    });
    const ct = res.headers.get('content-type') || '';
    const data = ct.includes('json') ? await res.json() : await res.text();
    if (res.status === 401 && path !== '/api/login') { signOut(); throw new Error('Session expired'); }
    if (!res.ok) { const err = new Error((data && data.error) || `HTTP ${res.status}`); err.status = res.status; err.data = data; throw err; }
    return data;
  }
  const api = {
    get: p => raw(p),
    post: (p, body = {}) => raw(p, { method: 'POST', body }),
    patch: (p, body) => raw(p, { method: 'PATCH', body }),
    del: p => raw(p, { method: 'DELETE' }),
  };

  async function pickBase() {
    // Dev only: a ?api= override is honoured when it points at this machine. Never a remote host —
    // the page posts the password and session token to whatever base it picks.
    const override = new URLSearchParams(location.search).get('api');
    const local = u => { try { return /^(localhost|127\.0\.0\.1)$/.test(new URL(u).hostname); } catch { return false; } };
    if (override && local(override)) { base = override; localStorage.setItem(LS.base, base); return; }
    const saved = localStorage.getItem(LS.base);
    const allowed = b => API_BASES.includes(b) || local(b);
    for (const b of [...new Set([saved, ...API_BASES].filter(b => b && allowed(b)))]) {
      try { const r = await fetch(b + '/api/login', { method: 'OPTIONS' }); if (r.ok || r.status === 204) { base = b; localStorage.setItem(LS.base, b); return; } } catch { /* next */ }
    }
  }

  // ---------- auth ----------
  function signOut() { token = ''; localStorage.removeItem(LS.token); clearInterval(tickTimer); $('#app').classList.add('hidden'); $('#login').classList.remove('hidden'); }
  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    $('#loginErr').textContent = '';
    try {
      await pickBase();
      const r = await api.post('/api/login', { password: $('#pw').value });
      token = r.token; localStorage.setItem(LS.token, token);
      $('#pw').value = '';
      boot();
    } catch (err) { $('#loginErr').textContent = err.message === 'wrong password' ? 'Wrong password.' : `Could not sign in: ${err.message}`; }
  });
  $('#logout').addEventListener('click', signOut);

  // ---------- ui helpers ----------
  function toast(msg, bad = false) {
    const t = $('#toast'); t.textContent = msg; t.className = `toast${bad ? ' bad' : ''}`;
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.add('hidden'), 2600);
  }
  const gradeEl = g => `<span class="grade ${g || 'none'}">${g || '—'}</span>`;
  const fitEl = f => `<span class="fit ${f >= 60 ? 'hi' : f >= 40 ? 'mid' : ''}">${f ?? 0}</span>`;
  const ring = (label, v) => { const c = v == null ? '' : v >= 90 ? 'g' : v >= 50 ? 'y' : 'r'; return `<div class="ring ${c}"><b>${v == null ? '–' : Math.round(v)}</b>${label}</div>`; };
  const chan = c => ({ email: '✉ email', sms: '💬 text', call: '☎ call' }[c] || '—');
  const stageLabel = s => ({ found: 'Found', graded: 'Graded', graded_partial: 'Graded (gaps)', contact_found: 'Contact found', no_contact: 'No contact', drafted: 'Draft ready', sent: 'Sent', replied: 'Replied', skipped: 'Skipped', suppressed: 'Suppressed' }[s] || s);

  // ---------- router ----------
  const views = {};
  function go(view) {
    location.hash = view;
  }
  async function render() {
    const view = (location.hash || '#campaigns').slice(1).split('?')[0];
    $$('#nav a').forEach(a => a.classList.toggle('active', a.dataset.view === view));
    const fn = views[view] || views.campaigns;
    $('#view').innerHTML = '<p class="muted">Loading…</p>';
    try { await fn(); } catch (err) { $('#view').innerHTML = `<div class="panel"><strong>Error:</strong> ${esc(err.message)}</div>`; }
  }
  window.addEventListener('hashchange', render);

  // ---------- status strip + tick ----------
  async function refreshStatus() {
    try {
      state.status = await api.get('/api/status');
      $('#strip').innerHTML = state.status.providers.map(p => `<i class="${p.ok ? 'ok' : 'bad'}" title="${esc(p.name)}: ${p.ok ? 'connected' : 'not connected'}"></i>`).join('');
      $('#strip').title = state.status.providers.map(p => `${p.ok ? '●' : '○'} ${p.name}`).join('\n');
    } catch { /* ignore */ }
    try { const q = await api.get('/api/queue'); $('#queueCount').textContent = q.cards.length || ''; } catch { /* ignore */ }
  }
  async function tick() {
    try {
      const r = await api.post('/api/tick');
      const TICKERS = ['schedule_sends', 'check_replies', 'schedule_followups'];
      const real = Object.entries(r.types || {}).filter(([t]) => !TICKERS.includes(t)).reduce((n, [, c]) => n + c, 0);
      const onCampaigns = (location.hash || '#campaigns').startsWith('#campaigns');
      if ((real || r.failed) && onCampaigns && !document.activeElement?.closest?.('#newCampaign')) render();
      return r;
    } catch { return null; }
  }
  function startTicking() {
    clearInterval(tickTimer);
    tickTimer = setInterval(async () => {
      const running = state.campaigns.some(c => c.status === 'running');
      const busy = state.status && (state.status.jobs.queued + state.status.jobs.running) > 0;
      if (running || busy) await tick();
      if (Date.now() % 60000 < 10000) refreshStatus();
    }, 10000);
  }

  // ---------- views ----------
  views.campaigns = async () => {
    const { campaigns } = await api.get('/api/campaigns');
    state.campaigns = campaigns;
    const s = state.status;
    const today = s ? `<div class="grid c3">
      <div class="kpi"><b>${s.today.email}/${s.today.email_cap}</b><span>Emails today</span></div>
      <div class="kpi"><b>${s.today.sms}/${s.today.sms_cap}</b><span>Texts today</span></div>
      <div class="kpi"><b>${s.jobs.queued + s.jobs.running}</b><span>Jobs in flight${s.jobs.failed ? ` · <em style="color:#fca5a5">${s.jobs.failed} failed</em>` : ''}</span></div>
      <div class="kpi"><b>${s.apollo_credits ?? '—'}</b><span>Apollo credits</span></div>
    </div>` : '';
    const rows = campaigns.map(c => {
      const k = c.counts || {}; const max = c.max_businesses || 1;
      const pct = Math.min(100, Math.round(((k.drafted || 0) + (k.sent || 0)) / max * 100));
      return `<div class="panel" data-id="${c.id}">
        <div class="row"><h3 style="margin:0">${esc(c.name)}</h3><span class="stage">${esc(c.category)} · ${esc(c.city)} · up to ${c.max_businesses}</span><span class="spacer"></span>
          <span class="pill" style="background:${c.status === 'running' ? 'var(--ok);color:#06240f' : c.status === 'paused' ? 'var(--warn);color:#2a1a00' : 'var(--line)'}">${c.status}${c.pause_reason ? ` — ${esc(c.pause_reason)}` : ''}</span></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="steps"><span>Found <b>${k.found || 0}</b></span><span>Graded <b>${k.graded || 0}</b></span><span>Contacts <b>${k.contacted || 0}</b></span><span>Drafted <b>${k.drafted || 0}</b></span><span>Sent <b>${k.sent || 0}</b></span><span>Replied <b>${k.replied || 0}</b></span><span class="spacer"></span><span>Est ${money(c.est_cost_cents)} · spent <b>${money(c.spent_cents)}</b></span></div>
        <div class="row" style="margin-top:12px">
          ${c.status === 'running' ? `<button class="btn small" data-act="pause">Pause</button>` : `<button class="btn small primary" data-act="run">${c.status === 'draft' ? 'Run' : 'Resume'}</button>`}
          <a class="btn small" href="#businesses?campaign=${c.id}">Businesses</a>
          <a class="btn small" href="#queue?campaign=${c.id}">Queue</a>
          <button class="btn small ghost" data-act="apify" title="Run the Apify Maps scraper now on businesses still missing an email">Run Apify now</button>
        </div></div>`;
    }).join('') || '<p class="muted">No campaigns yet.</p>';

    $('#view').innerHTML = `<h1>Campaigns</h1>${today}
      <div class="panel"><h2 style="margin-top:0">New campaign</h2>
      <form id="newCampaign" class="grid c3">
        <div><label>Name</label><input name="name" placeholder="Roofers — Birmingham" required></div>
        <div><label>Category (as you'd type it into Google Maps)</label><input name="category" placeholder="roofing contractor" required></div>
        <div><label>City</label><input name="city" placeholder="Birmingham, AL" required></div>
        <div><label>Max businesses</label><input name="max_businesses" type="number" value="40" min="1" max="120"></div>
        <div><label>Offer line</label><input name="offer_line" value="websites from $2,500"></div>
        <div><label>Apollo credit cap</label><input name="apollo_credit_cap" type="number" value="40" min="0"></div>
        <div><label>Apify result cap</label><input name="apify_result_cap" type="number" value="100" min="0"></div>
        <div><label>Follow-ups</label><select name="auto_approve_followups"><option value="">Review each follow-up</option><option value="1">Auto-approve follow-ups</option></select></div>
        <div style="align-self:end"><div class="small muted" id="estimate">Estimated cost: $1.68 + Apollo credits</div><button class="btn primary" type="submit" style="margin-top:6px">Create campaign</button></div>
      </form></div>
      <h2>Your campaigns</h2>${rows}`;

    const form = $('#newCampaign');
    const est = () => {
      const m = +form.max_businesses.value || 0, a = +form.apify_result_cap.value || 0;
      $('#estimate').textContent = `Estimated cost: ${money(Math.round(m * 3.2 + a * 0.4))} (Places + Apify) + up to ${form.apollo_credit_cap.value || 0} Apollo credits`;
    };
    form.addEventListener('input', est); est();
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(form).entries());
      fd.auto_approve_followups = !!fd.auto_approve_followups;
      try { await api.post('/api/campaigns', fd); toast('Campaign created'); render(); } catch (err) { toast(err.message, true); }
    });
    $$('[data-act]').forEach(b => b.addEventListener('click', async () => {
      const id = b.closest('[data-id]').dataset.id;
      try { await api.post(`/api/campaigns/${id}/${b.dataset.act}`); toast(b.dataset.act === 'run' ? 'Running — discovery starts now' : 'Done'); await render(); if (b.dataset.act === 'run') tick(); } catch (err) { toast(err.message, true); }
    }));
  };

  views.businesses = async () => {
    const q = new URLSearchParams((location.hash.split('?')[1] || ''));
    const f = { campaign: q.get('campaign') || '', stage: q.get('stage') || '', min_fit: q.get('min_fit') || '', grade: q.get('grade') || '', q: q.get('q') || '' };
    const { campaigns } = state.campaigns.length ? { campaigns: state.campaigns } : await api.get('/api/campaigns');
    state.campaigns = campaigns;
    const { businesses } = await api.get('/api/businesses?' + new URLSearchParams(Object.fromEntries(Object.entries(f).filter(([, v]) => v))));
    $('#view').innerHTML = `<h1>Businesses <span class="muted small">${businesses.length}</span></h1>
      <form id="filters" class="panel row">
        <select name="campaign"><option value="">All campaigns</option>${campaigns.map(c => `<option value="${c.id}" ${f.campaign === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>
        <select name="stage"><option value="">Any stage</option>${['found', 'graded', 'graded_partial', 'contact_found', 'no_contact', 'drafted', 'sent', 'replied', 'skipped', 'suppressed'].map(s => `<option ${f.stage === s ? 'selected' : ''} value="${s}">${stageLabel(s)}</option>`).join('')}</select>
        <select name="grade"><option value="">Any grade</option>${['A', 'B', 'C', 'D', 'F'].map(g => `<option ${f.grade === g ? 'selected' : ''}>${g}</option>`).join('')}</select>
        <input name="min_fit" type="number" placeholder="Min fit" value="${esc(f.min_fit)}" style="width:110px">
        <input name="q" placeholder="Search name" value="${esc(f.q)}" style="width:200px">
        <button class="btn small primary">Filter</button>
      </form>
      <div class="panel" style="padding:0 8px"><table class="resp"><thead><tr><th>Business</th><th>Fit</th><th>Grade</th><th>Channel</th><th>Contact</th><th>Stage</th></tr></thead><tbody>
      ${businesses.map(b => `<tr class="click" data-id="${b.id}">
        <td data-l="Business"><strong>${esc(b.name)}</strong><div class="small muted">${esc([b.city, b.state].filter(Boolean).join(', '))}${b.website ? ` · <a href="${esc(b.website)}" target="_blank" rel="noopener">site</a>` : ' · no site'}${b.review_count ? ` · ${b.review_count} reviews` : ''}</div></td>
        <td data-l="Fit">${fitEl(b.fit_score)}</td><td data-l="Grade">${gradeEl(b.grade)}</td><td data-l="Channel">${chan(b.channel)}</td>
        <td data-l="Contact" class="small">${esc(b.contact_email || b.contact_phone || '—')}</td><td data-l="Stage" class="stage">${stageLabel(b.stage)}</td></tr>`).join('') || '<tr><td colspan="6" class="muted">Nothing matches.</td></tr>'}
      </tbody></table></div>`;
    $('#filters').addEventListener('submit', e => { e.preventDefault(); const fd = new FormData(e.target); const p = new URLSearchParams(); for (const [k, v] of fd) if (v) p.set(k, v); location.hash = `businesses?${p}`; });
    $$('tr.click').forEach(tr => tr.addEventListener('click', () => openDrawer(tr.dataset.id)));
  };

  async function openDrawer(id) {
    const d = $('#drawer'); d.classList.remove('hidden');
    $('#drawerBody').innerHTML = '<p class="muted">Loading…</p>';
    const r = await api.get(`/api/businesses/${id}`);
    const b = r.business, a = r.audit;
    $('#drawerTitle').textContent = b.name;
    const findings = (a?.findings || []).map(f => `<div>• ${esc(f.text)}</div>`).join('');
    $('#drawerBody').innerHTML = `
      <div class="row"><span>${fitEl(b.fit_score)} fit</span><span>${gradeEl(a?.grade)} ${a?.site_score != null ? a.site_score + '/100' : ''}</span><span class="stage">${stageLabel(b.stage)} · ${chan(b.channel)}</span></div>
      <p class="small muted">${esc(b.address || '')}${b.phone ? ` · ${esc(b.phone)}` : ''}${b.website ? ` · <a href="${esc(b.website)}" target="_blank" rel="noopener">${esc(b.domain || b.website)}</a>` : ''}${b.maps_url ? ` · <a href="${esc(b.maps_url)}" target="_blank" rel="noopener">Maps</a>` : ''}</p>
      <p class="small muted">Why this fit: ${esc((b.fit_reasons || []).join(' · ') || '—')}</p>
      ${r.screenshot_url ? `<img class="shot" src="${esc(r.screenshot_url)}" alt="Homepage screenshot">` : ''}
      ${a ? `<div class="rings">${ring('Perf', a.psi_mobile?.perf)}${ring('SEO', a.psi_mobile?.seo)}${ring('A11y', a.psi_mobile?.a11y)}${ring('Best', a.psi_mobile?.bestPractices)}</div>
        <p class="small muted">${a.builder ? `Built on ${esc(a.builder)} · ` : ''}${a.ssl ? 'HTTPS' : 'No HTTPS'} · ${a.has_form ? 'has form' : 'no form'} · ${a.copyright_year ? `© ${a.copyright_year}` : 'no © year'}${a.error ? ` · <span style="color:#fca5a5">${esc(a.error)}</span>` : ''}</p>
        <div class="findings">${findings}</div>` : '<p class="muted small">Not graded (no website or not run yet).</p>'}
      <h2>Contacts</h2>
      ${r.contacts.map(c => `<div class="small">${c.is_primary ? '★ ' : ''}${esc(c.name || c.first_name || '')}${c.title ? ` (${esc(c.title)})` : ''} ${esc(c.email || '')} ${esc(c.phone || '')}${c.phone_type ? ` [${c.phone_type}]` : ''} <span class="dim">via ${c.source}${c.email_verified ? ' · verified' : ''}</span></div>`).join('') || '<p class="muted small">None yet.</p>'}
      <form id="addContact" class="row" style="margin-top:8px"><input name="name" placeholder="Name" style="width:140px"><input name="email" placeholder="Email" style="width:200px"><input name="phone" placeholder="Phone" style="width:140px"><button class="btn small">Add + draft</button></form>
      <h2>Messages</h2>
      ${r.messages.map(m => `<div class="msg"><div class="small muted">Step ${m.step} · ${m.channel} · ${m.status}${m.send_after ? ` · ${fmtDate(m.send_after)}` : ''}${m.sent_at ? ` · sent ${fmtDate(m.sent_at)}` : ''}</div>${m.subject ? `<strong>${esc(m.subject)}</strong>\n` : ''}${esc(m.body_text)}</div>`).join('') || '<p class="muted small">None yet.</p>'}
      ${r.replies.length ? `<h2>Replies</h2>${r.replies.map(x => `<div class="msg"><div class="small muted">${fmtDate(x.received_at)} · ${esc(x.from_addr || '')}${x.is_bounce ? ' · BOUNCE' : ''}${x.is_stop ? ' · STOP' : ''}</div>${esc(x.body || '')}</div>`).join('')}` : ''}
      <h2>Actions</h2>
      <div class="row">
        <button class="btn small" data-act="regrade">Re-grade</button>
        <button class="btn small" data-act="refind">Re-find contact</button>
        <button class="btn small" data-act="skip">Skip</button>
        <button class="btn small danger" data-act="suppress">Suppress (never contact)</button>
      </div>
      <h2>Timeline</h2>
      <ul class="timeline">${r.events.map(e => `<li><time>${fmtDate(e.created_at)}</time>${esc(e.kind)} <span class="dim">${esc(JSON.stringify(e.detail || {})).slice(0, 140)}</span></li>`).join('')}</ul>`;
    $$('#drawerBody [data-act]').forEach(btn => btn.addEventListener('click', async () => {
      if (btn.dataset.act === 'suppress' && !confirm('Never contact this business again?')) return;
      try { await api.post(`/api/businesses/${id}/${btn.dataset.act}`); toast('Done'); openDrawer(id); tick(); } catch (err) { toast(err.message, true); }
    }));
    $('#addContact').addEventListener('submit', async e => {
      e.preventDefault();
      try { await api.post(`/api/businesses/${id}/contact`, Object.fromEntries(new FormData(e.target).entries())); toast('Contact added — drafting'); openDrawer(id); tick(); } catch (err) { toast(err.message, true); }
    });
  }
  $('#drawerClose').addEventListener('click', () => $('#drawer').classList.add('hidden'));

  views.queue = async () => {
    const q = new URLSearchParams((location.hash.split('?')[1] || ''));
    const p = new URLSearchParams(); if (q.get('campaign')) p.set('campaign', q.get('campaign')); if (q.get('status')) p.set('status', q.get('status'));
    const { cards, calls } = await api.get('/api/queue?' + p);
    const tenDlc = state.status?.twilio_10dlc_status;
    $('#view').innerHTML = `<div class="row"><h1 style="margin:0">Review queue <span class="muted small">${cards.length}</span></h1><span class="spacer"></span>
        <a class="btn small ${!q.get('status') ? 'primary' : ''}" href="#queue">Drafts</a><a class="btn small ${q.get('status') === 'snoozed' ? 'primary' : ''}" href="#queue?status=snoozed">Snoozed</a><a class="btn small ${q.get('status') === 'scheduled' ? 'primary' : ''}" href="#queue?status=scheduled">Scheduled</a>
        <button class="btn small ok" id="bulk" ${cards.length ? '' : 'disabled'}>Approve all ${cards.length ? `(${cards.filter(c => c.message.channel === 'email').length} emails${tenDlc === 'approved' ? `, ${cards.filter(c => c.message.channel === 'sms').length} texts` : ''})` : ''}</button></div>
      ${tenDlc !== 'approved' && cards.some(c => c.message.channel === 'sms') ? '<p class="small" style="color:#fcd34d">Texts are blocked until Twilio 10DLC is approved — flip it in Settings when Twilio emails you.</p>' : ''}
      <div id="cards" style="margin-top:14px"></div>
      ${calls.length ? `<div class="calls"><h2 style="margin-top:0">Call tasks (landlines, no email)</h2><ul>${calls.map(c => `<li><strong>${esc(c.name)}</strong> · <a href="tel:${esc(c.phone || '')}">${esc(c.phone || '')}</a> · ${esc([c.city, c.state].filter(Boolean).join(', '))} · fit ${c.fit_score} <button class="btn small ghost" data-open="${c.id}">Open</button></li>`).join('')}</ul></div>` : ''}`;
    $('#cards').innerHTML = cards.map(card => {
      const m = card.message, b = card.business || {}, a = card.audit, c = card.contact || {};
      const blocked = m.channel === 'sms' && tenDlc !== 'approved';
      return `<div class="card" data-id="${m.id}">
        <div>${card.screenshot_url ? `<img class="shot" src="${esc(card.screenshot_url)}" alt="">` : `<div class="noshot">${b.website ? 'no screenshot' : 'no website'}</div>`}
          <div class="row" style="margin-top:8px">${fitEl(b.fit_score)} ${gradeEl(a?.grade)} <span class="small muted">${chan(m.channel)} · step ${m.step}</span></div></div>
        <div>
          <h3>${esc(b.name)} <span class="small muted">${esc([b.city, b.state].filter(Boolean).join(', '))}</span></h3>
          <div class="small muted">To: ${esc(c.first_name || c.name || '')} ${esc(c.email || c.phone || '')} <span class="dim">via ${esc(c.source || '')}${c.email_verified ? ' · verified' : ''}</span> · <a href="#" data-open="${b.id}">details</a></div>
          <div class="findings">${(a?.findings || []).map(f => `<div>• ${esc(f.text)}</div>`).join('') || '<div class="muted">No measured findings</div>'}</div>
          ${m.channel === 'email' ? `<label>Subject</label><input class="subject" value="${esc(m.subject || '')}">` : ''}
          <label>${m.channel === 'email' ? 'Body (blank line = new paragraph; last paragraph is the closing line)' : 'Text (STOP line is added automatically)'}</label>
          <textarea class="body">${esc(m.body_text)}</textarea>
          ${m.status === 'snoozed' ? `<div class="small muted">Snoozed until ${fmtDate(m.send_after)}</div>` : ''}${m.status === 'scheduled' ? `<div class="small muted">Scheduled ${fmtDate(m.send_after)}</div>` : ''}
          <div class="actions">
            <button class="btn small ok" data-act="approve" ${blocked ? 'disabled title="10DLC pending"' : ''}>${m.status === 'scheduled' ? 'Re-schedule' : 'Approve'}</button>
            <button class="btn small" data-act="save">Save edits</button>
            ${m.channel === 'email' ? '<button class="btn small" data-act="preview">Preview</button>' : ''}
            <button class="btn small" data-act="snooze">Snooze 3d</button>
            <button class="btn small ghost danger" data-act="skip">Skip</button>
          </div>
          <div class="previewWrap hidden"></div>
        </div></div>`;
    }).join('') || '<p class="muted">Queue is empty. Run a campaign or wait for drafts.</p>';

    const save = async (card) => {
      const id = card.dataset.id; const body = { body_text: $('.body', card).value };
      const s = $('.subject', card); if (s) body.subject = s.value;
      return api.patch(`/api/messages/${id}`, body);
    };
    $$('.card [data-act]').forEach(btn => btn.addEventListener('click', async () => {
      const card = btn.closest('.card'); const id = card.dataset.id;
      try {
        if (btn.dataset.act === 'save') { await save(card); toast('Saved'); }
        if (btn.dataset.act === 'preview') { await save(card); const r = await api.post(`/api/messages/${id}/preview`); const w = $('.previewWrap', card); w.classList.toggle('hidden'); if (!w.classList.contains('hidden')) w.innerHTML = `<iframe class="preview" sandbox="" srcdoc="${esc(r.html || '')}"></iframe>`; }
        if (btn.dataset.act === 'approve') { await save(card); const r = await api.post(`/api/messages/${id}/approve`); toast(`Scheduled ${fmtDate(r.send_after)}`); card.remove(); refreshStatus(); }
        if (btn.dataset.act === 'snooze') { await api.post(`/api/messages/${id}/snooze`, { days: 3 }); toast('Snoozed 3 days'); card.remove(); }
        if (btn.dataset.act === 'skip') { await api.post(`/api/messages/${id}/skip`); toast('Skipped'); card.remove(); }
      } catch (err) { toast(err.message, true); }
    }));
    $$('[data-open]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openDrawer(el.dataset.open); }));
    $('#bulk')?.addEventListener('click', async () => {
      const ids = $$('.card').filter(c => !$('[data-act=approve]', c).disabled).map(c => c.dataset.id);
      if (!ids.length || !confirm(`Approve ${ids.length} messages? They'll be spread across business hours.`)) return;
      try {
        for (const c of $$('.card')) if (ids.includes(c.dataset.id)) await save(c);
        const r = await api.post('/api/messages/bulk-approve', { ids });
        const ok = r.results.filter(x => x.ok).length;
        toast(`${ok} approved${ok < ids.length ? `, ${ids.length - ok} failed` : ''}`, ok < ids.length);
        render(); refreshStatus();
      } catch (err) { toast(err.message, true); }
    });
  };

  views.sent = async () => {
    const { messages, businesses, replies, contacts } = await api.get('/api/sent');
    const bMap = new Map(businesses.map(b => [b.id, b])); const cMap = new Map(contacts.map(c => [c.business_id, c]));
    const badge = s => `<span class="pill" style="background:${{ sent: 'var(--accent)', delivered: 'var(--ok);color:#06240f', bounced: 'var(--bad)', failed: 'var(--bad)', scheduled: 'var(--line)', sending: 'var(--warn);color:#2a1a00' }[s] || 'var(--line)'}">${s}</span>`;
    $('#view').innerHTML = `<h1>Sent &amp; replies</h1>
      ${replies.length ? `<h2>Replies</h2><div class="panel">${replies.map(r => { const b = bMap.get(r.business_id) || {}; return `<div class="msg"><div class="small muted">${fmtDate(r.received_at)} · <strong>${esc(b.name || '')}</strong> · ${esc(r.from_addr || '')}${r.is_bounce ? ' · BOUNCE' : ''}${r.is_stop ? ' · STOP' : ''} · <a href="#" data-open="${r.business_id}">details</a>${r.channel === 'email' ? ` · <a href="https://mail.google.com/mail/u/0/#search/${encodeURIComponent((cMap.get(r.business_id) || {}).email || '')}" target="_blank" rel="noopener">open in Gmail</a>` : ''}</div>${esc(r.body || '')}</div>`; }).join('')}</div>` : ''}
      <h2>Outgoing</h2>
      <div class="panel" style="padding:0 8px"><table class="resp"><thead><tr><th>When</th><th>Business</th><th>To</th><th>Step</th><th>Subject / text</th><th>Status</th></tr></thead><tbody>
      ${messages.map(m => { const b = bMap.get(m.business_id) || {}; const c = cMap.get(m.business_id) || {}; return `<tr>
        <td data-l="When" class="small">${fmtDate(m.sent_at || m.send_after)}</td><td data-l="Business"><a href="#" data-open="${m.business_id}">${esc(b.name || '')}</a></td>
        <td data-l="To" class="small">${esc(c.email || c.phone || '')}</td><td data-l="Step">${m.step} · ${m.channel}</td>
        <td data-l="Subject" class="small">${esc(m.subject || m.body_text.slice(0, 90))}${m.error ? `<div style="color:#fca5a5">${esc(m.error)}</div>` : ''}</td><td data-l="Status">${badge(m.status)}</td></tr>`; }).join('') || '<tr><td colspan="6" class="muted">Nothing sent yet.</td></tr>'}
      </tbody></table></div>`;
    $$('[data-open]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openDrawer(el.dataset.open); }));
  };

  views.settings = async () => {
    const s = await api.get('/api/settings');
    const st = state.status || await api.get('/api/status');
    const { suppressions } = await api.get('/api/suppressions');
    $('#view').innerHTML = `<h1>Settings</h1>
      <div class="grid c2">
      <div class="panel"><h2 style="margin-top:0">Providers</h2>
        ${st.providers.map(p => `<div class="prov"><span><i class="${p.ok ? 'ok' : 'bad'}"></i>${esc(p.name)}</span><span class="small muted">${p.ok ? 'connected' : (p.detail ? esc(p.detail) : 'key missing')}</span></div>`).join('')}
        <div class="prov"><span>Apollo credits</span><span>${st.apollo_credits ?? '—'}</span></div>
        <div class="prov"><span>Today</span><span class="small muted">${st.today.email}/${st.today.email_cap} emails · ${st.today.sms}/${st.today.sms_cap} texts</span></div>
        <div class="prov"><span>Jobs</span><span class="small muted">${st.jobs.queued} queued · ${st.jobs.running} running · ${st.jobs.failed} failed</span></div>
        <div class="row" style="margin-top:12px"><button class="btn small" id="runTick">Run worker now</button></div>
      </div>
      <form class="panel" id="settingsForm"><h2 style="margin-top:0">Sending</h2>
        <div class="grid c2">
          <div><label>Daily email cap</label><input name="daily_email_cap" type="number" value="${s.daily_email_cap}"></div>
          <div><label>Daily text cap</label><input name="daily_sms_cap" type="number" value="${s.daily_sms_cap}"></div>
          <div><label>Window start (CT)</label><input name="start" value="${esc(s.send_window.start)}"></div>
          <div><label>Window end (CT)</label><input name="end" value="${esc(s.send_window.end)}"></div>
        </div>
        <label>Days</label><div class="row">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => `<label style="margin:0;text-transform:none;letter-spacing:0;font-size:14px;color:var(--ink)"><input type="checkbox" name="day" value="${i}" ${s.send_window.days.includes(i) ? 'checked' : ''} style="width:auto;margin-right:4px">${d}</label>`).join('')}</div>
        <label>Default offer line</label><input name="offer_line" value="${esc(s.offer_line)}">
        <label>Portfolio link (email button)</label><input name="portfolio_url" value="${esc(s.portfolio_url)}">
        <label>Signature line</label><input name="sig_line" value="${esc(s.signature.line)}">
        <label>Test recipient (while set, EVERY send goes here instead of the prospect)</label><input name="test_recipient" value="${esc(s.test_recipient || '')}" placeholder="leave blank for real sends">
        <div class="grid c2" style="margin-top:12px">
          <label style="text-transform:none;letter-spacing:0;font-size:14px;color:var(--ink)"><input type="checkbox" name="email_paused" ${s.email_paused ? 'checked' : ''} style="width:auto;margin-right:6px">Pause all email</label>
          <label style="text-transform:none;letter-spacing:0;font-size:14px;color:var(--ink)"><input type="checkbox" name="sms_paused" ${s.sms_paused ? 'checked' : ''} style="width:auto;margin-right:6px">Pause all texts</label>
          <label style="text-transform:none;letter-spacing:0;font-size:14px;color:var(--ink)"><input type="checkbox" name="tendlc" ${s.twilio_10dlc_status === 'approved' ? 'checked' : ''} style="width:auto;margin-right:6px">Twilio 10DLC approved</label>
          <label style="text-transform:none;letter-spacing:0;font-size:14px;color:var(--ink)"><input type="checkbox" name="apollo_direct_dial" ${s.apollo_direct_dial ? 'checked' : ''} style="width:auto;margin-right:6px">Apollo direct-dial reveals (extra credits)</label>
        </div>
        <button class="btn primary" style="margin-top:16px">Save settings</button>
      </form></div>
      <div class="panel"><h2 style="margin-top:0">Suppression list <span class="muted small">${suppressions.length}</span></h2>
        <form id="supForm" class="row"><select name="kind" style="width:130px"><option value="domain">domain</option><option value="email">email</option><option value="phone">phone</option></select><input name="value" placeholder="acme.com / joe@acme.com / +12055550100" style="width:300px"><input name="note" placeholder="note (e.g. existing client)" style="width:220px"><button class="btn small">Add</button></form>
        <table class="resp" style="margin-top:10px"><tbody>${suppressions.map(x => `<tr><td data-l="Kind">${x.kind}</td><td data-l="Value">${esc(x.value)}</td><td data-l="Reason" class="small muted">${x.reason}${x.note ? ` · ${esc(x.note)}` : ''}</td><td><button class="btn small ghost" data-del="${x.id}">remove</button></td></tr>`).join('') || '<tr><td class="muted">Empty — add your existing clients so they are never contacted.</td></tr>'}</tbody></table>
      </div>`;
    $('#settingsForm').addEventListener('submit', async e => {
      e.preventDefault(); const f = e.target;
      const patch = {
        daily_email_cap: +f.daily_email_cap.value, daily_sms_cap: +f.daily_sms_cap.value,
        send_window: { tz: 'America/Chicago', days: $$('input[name=day]:checked', f).map(x => +x.value), start: f.start.value, end: f.end.value },
        offer_line: f.offer_line.value, portfolio_url: f.portfolio_url.value, signature: { name: s.signature.name, line: f.sig_line.value },
        test_recipient: f.test_recipient.value || null, email_paused: f.email_paused.checked, sms_paused: f.sms_paused.checked,
        twilio_10dlc_status: f.tendlc.checked ? 'approved' : 'pending', apollo_direct_dial: f.apollo_direct_dial.checked,
      };
      try { await api.patch('/api/settings', patch); toast('Saved'); refreshStatus(); } catch (err) { toast(err.message, true); }
    });
    $('#supForm').addEventListener('submit', async e => { e.preventDefault(); try { await api.post('/api/suppressions', Object.fromEntries(new FormData(e.target).entries())); toast('Added'); render(); } catch (err) { toast(err.message, true); } });
    $$('[data-del]').forEach(b => b.addEventListener('click', async () => { try { await api.del(`/api/suppressions?id=${b.dataset.del}`); render(); } catch (err) { toast(err.message, true); } }));
    $('#runTick').addEventListener('click', async () => { const r = await tick(); toast(r ? `Worker ran ${r.ran} job(s)${r.failed ? `, ${r.failed} failed` : ''}` : 'Worker call failed', !r); refreshStatus(); });
  };

  // ---------- boot ----------
  async function boot() {
    $('#login').classList.add('hidden'); $('#app').classList.remove('hidden');
    await refreshStatus();
    await render();
    startTicking();
  }
  (async () => {
    if (!token) { $('#login').classList.remove('hidden'); return; }
    try { await api.get('/api/settings'); boot(); } catch (e) { if (e.status === 401 || /expired/.test(e.message)) signOut(); else { await pickBase(); try { await api.get('/api/settings'); boot(); } catch { signOut(); } } }
  })();
})();
