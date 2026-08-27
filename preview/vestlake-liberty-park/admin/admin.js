/* Vestlake Admin — events + newsletters management on Supabase.
   Staff accounts live in vl_staff; RLS enforces access. No hard deletes — archive only. */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://tkkhvbkocumyxpgsrpxv.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRra2h2YmtvY3VteXhwZ3NycHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjYyNDAsImV4cCI6MjA5NzI0MjI0MH0.piSMSUJ427thN_sjCfgOp9lbnUsWGmYqQPRMlglfd6E';
const BUCKET = 'vestlake-newsletters';
const sb = createClient(SUPABASE_URL, ANON_KEY);

const $ = (id) => document.getElementById(id);
const content = $('content');
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CATEGORIES = { board: 'Board', social: 'Social', facility: 'Facility', deadline: 'Deadline', holiday: 'Holiday' };

let profile = null;      // vl_staff row for the signed-in user
let duplicateSeed = null; // event values carried into #/events/new by Duplicate

/* ---------- utils ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const todayISO = () => new Date().toLocaleDateString('en-CA');
function fmtDate(d) { const [y,m,day] = d.split('-').map(Number); return MONTHS[m-1] + ' ' + day + ', ' + y; }
function fmtTime(t) { if (!t) return ''; const [h,m] = t.split(':').map(Number); const ap = h >= 12 ? 'PM' : 'AM'; return ((h % 12) || 12) + ':' + String(m).padStart(2,'0') + ' ' + ap; }
function fmtSize(b) { if (!b) return ''; return b > 950*1024 ? (b/1048576).toFixed(1) + ' MB' : Math.round(b/1024) + ' KB'; }
function eventTimeLabel(e) {
  if (e.all_day) return 'All day';
  let t = fmtTime(e.start_time);
  if (e.end_time) t += ' – ' + fmtTime(e.end_time);
  return t || 'Time TBA';
}
let toastTimer;
function toast(msg, isError) {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast' + (isError ? ' error' : '');
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, isError ? 6000 : 3500);
}
async function logActivity(action, entity, title) {
  await sb.from('vl_activity').insert({ actor: profile.full_name, action, entity, entity_title: title });
}
function timeAgo(iso) {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 90) return 'just now';
  if (s < 3600) return Math.round(s/60) + ' min ago';
  if (s < 86400) return Math.round(s/3600) + ' hr ago';
  return Math.round(s/86400) + ' days ago';
}

/* ---------- auth ---------- */
function show(view) {
  $('loginView').hidden = view !== 'login';
  $('recoveryView').hidden = view !== 'recovery';
  $('appView').hidden = view !== 'app';
}

sb.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') show('recovery');
});

async function boot() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { show('login'); return; }
  const { data: p } = await sb.from('vl_staff').select('*').eq('user_id', session.user.id).maybeSingle();
  if (!p || !p.active) {
    await sb.auth.signOut();
    show('login');
    $('loginError').textContent = 'This account is not an approved staff account.';
    $('loginError').hidden = false;
    return;
  }
  profile = p;
  $('whoami').textContent = p.full_name;
  $('staffNav').hidden = p.role !== 'admin';
  show('app');
  route();
}

$('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = $('loginBtn'); btn.disabled = true; btn.textContent = 'Signing in…';
  $('loginError').hidden = true;
  const { error } = await sb.auth.signInWithPassword({ email: $('loginEmail').value.trim(), password: $('loginPassword').value });
  btn.disabled = false; btn.textContent = 'Sign In';
  if (error) { $('loginError').textContent = 'Sign-in failed: ' + error.message; $('loginError').hidden = false; return; }
  boot();
});

$('forgotBtn').addEventListener('click', async () => {
  const email = $('loginEmail').value.trim();
  if (!email) { $('loginError').textContent = 'Enter your email above first, then tap Forgot password.'; $('loginError').hidden = false; return; }
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
  if (error) { $('loginError').textContent = error.message; $('loginError').hidden = false; }
  else toast('Password reset email sent to ' + email);
});

$('recoveryForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const { error } = await sb.auth.updateUser({ password: $('newPassword').value });
  if (error) { $('recoveryError').textContent = error.message; $('recoveryError').hidden = false; return; }
  toast('Password updated — you are signed in.');
  boot();
});

$('signOutBtn').addEventListener('click', async () => { await sb.auth.signOut(); location.hash = ''; show('login'); });

/* ---------- shell ---------- */
$('sidebarToggle').addEventListener('click', () => {
  const open = $('sidebar').classList.toggle('open');
  $('sidebarToggle').setAttribute('aria-expanded', open);
});
document.addEventListener('click', (e) => {
  if (!$('sidebar').contains(e.target) && e.target !== $('sidebarToggle') && !$('sidebarToggle').contains(e.target)) {
    $('sidebar').classList.remove('open');
  }
});

window.addEventListener('hashchange', route);
function route() {
  if (!profile) return;
  $('sidebar').classList.remove('open');
  const hash = location.hash || '#/dashboard';
  const [, page, arg] = hash.split('/');
  document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === page));
  if (page === 'events' && arg) renderEventForm(arg === 'new' ? null : arg);
  else if (page === 'events') renderEvents();
  else if (page === 'newsletters' && arg) renderNewsletterForm(arg === 'new' ? null : arg);
  else if (page === 'newsletters') renderNewsletters();
  else if (page === 'staff' && profile.role === 'admin') renderStaff();
  else renderDashboard();
  content.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

/* ---------- dashboard ---------- */
async function renderDashboard() {
  content.innerHTML = '<h1>Dashboard</h1><p class="page-sub">Loading…</p>';
  const [ev, nl, act] = await Promise.all([
    sb.from('vl_events').select('*').eq('status', 'published').gte('event_date', todayISO()).order('event_date').limit(3),
    sb.from('vl_newsletters').select('*').eq('status', 'published').order('issue_year', { ascending: false }).order('issue_month', { ascending: false }).limit(1),
    sb.from('vl_activity').select('*').order('at', { ascending: false }).limit(8),
  ]);
  const events = ev.data || [], latest = (nl.data || [])[0], activity = act.data || [];
  content.innerHTML = `
    <h1>Dashboard</h1>
    <p class="page-sub">Welcome back, ${esc(profile.full_name.split(' ')[0])}. Post an event or newsletter — it goes live on the public site the moment you publish.</p>
    <div class="dash-actions">
      <a class="btn btn-gold" href="#/events/new">+ Add Calendar Event</a>
      <a class="btn btn-forest" href="#/newsletters/new">+ Post Newsletter</a>
      <a class="btn btn-outline" href="../" target="_blank" rel="noopener">View Public Website ↗</a>
    </div>
    <div class="dash-grid">
      <div class="card"><h3>Next Upcoming Events</h3>
        ${events.length ? '<div class="row-list">' + events.map((e) => `
          <div class="row">
            <div class="row-date"><div class="mo">${MONTHS[+e.event_date.split('-')[1]-1].slice(0,3)}</div><div class="day">${+e.event_date.split('-')[2]}</div></div>
            <div class="row-main"><div class="title">${esc(e.name)}</div><div class="meta">${eventTimeLabel(e)}${e.location ? ' · ' + esc(e.location) : ''}</div></div>
          </div>`).join('') + '</div>'
        : '<p class="empty-note">No upcoming published events. <a href="#/events/new">Add one →</a></p>'}
      </div>
      <div class="card"><h3>Latest Newsletter</h3>
        ${latest ? `
          <div class="row-list"><div class="row">
            <div class="row-date"><div class="mo">${MONTHS[latest.issue_month-1].slice(0,3)}</div><div class="day">${latest.issue_year}</div></div>
            <div class="row-main"><div class="title">${esc(latest.title)}</div><div class="meta">${fmtSize(latest.pdf_size)}${latest.page_count ? ' · ' + latest.page_count + ' pages' : ''}</div></div>
            <div class="row-actions"><a href="${esc(latest.pdf_path)}" target="_blank" rel="noopener">Open PDF</a></div>
          </div></div>`
        : '<p class="empty-note">No newsletters published yet.</p>'}
      </div>
    </div>
    <div class="card"><h3>Recent Staff Activity</h3>
      ${activity.length ? '<div class="row-list">' + activity.map((a) => `
        <div class="row"><div class="row-main"><div class="title" style="font-weight:500;font-size:14px;">${esc(a.actor)} ${esc(a.action)}${a.entity_title ? ': <b>' + esc(a.entity_title) + '</b>' : ''}</div><div class="meta">${timeAgo(a.at)}</div></div></div>`).join('') + '</div>'
      : '<p class="empty-note">No activity yet.</p>'}
    </div>`;
}

/* ---------- events list ---------- */
let eventTab = 'upcoming';
async function renderEvents() {
  content.innerHTML = '<h1>Calendar Events</h1><p class="page-sub">Loading…</p>';
  const { data: all, error } = await sb.from('vl_events').select('*').order('event_date');
  if (error) { content.innerHTML = '<h1>Calendar Events</h1><p class="form-error">' + esc(error.message) + '</p>'; return; }
  const today = todayISO();
  const groups = {
    upcoming: all.filter((e) => e.status !== 'archived' && (e.event_date >= today || (e.recurrence !== 'none' && (e.recurrence_end || '9999') >= today))),
    past: all.filter((e) => e.status === 'published' && e.event_date < today && (e.recurrence === 'none' || (e.recurrence_end || '') < today)).reverse(),
    drafts: all.filter((e) => e.status === 'draft'),
    archived: all.filter((e) => e.status === 'archived'),
  };
  const rows = groups[eventTab] || [];
  content.innerHTML = `
    <div class="page-head"><div><h1>Calendar Events</h1><p class="page-sub" style="margin:0;">Published events appear on the public calendar immediately.</p></div>
    <a class="btn btn-gold" href="#/events/new">+ Add Event</a></div>
    <div class="tabs">
      ${['upcoming','past','drafts','archived'].map((t) => `<button type="button" data-tab="${t}" class="${t === eventTab ? 'active' : ''}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}
    </div>
    <div class="card">${rows.length ? '<div class="row-list">' + rows.map((e) => `
      <div class="row">
        <div class="row-date"><div class="mo">${MONTHS[+e.event_date.split('-')[1]-1].slice(0,3)}</div><div class="day">${+e.event_date.split('-')[2]}</div></div>
        <div class="row-main">
          <div class="title">${esc(e.name)} <span class="pill ${e.status}">${e.status}</span>${e.featured ? ' <span class="pill admin">Homepage</span>' : ''}</div>
          <div class="meta">${eventTimeLabel(e)}${e.location ? ' · ' + esc(e.location) : ''} · ${CATEGORIES[e.category]}${e.recurrence !== 'none' ? ' · repeats ' + e.recurrence : ''}</div>
        </div>
        <div class="row-actions">
          <a href="#/events/${e.id}">Edit</a>
          <button type="button" data-dup="${e.id}">Duplicate</button>
          ${e.status !== 'archived'
            ? `<button type="button" class="danger" data-archive="${e.id}" data-name="${esc(e.name)}">Archive</button>`
            : `<button type="button" data-restore="${e.id}">Restore</button>`}
        </div>
      </div>`).join('') + '</div>' : '<p class="empty-note">Nothing here yet.</p>'}
    </div>`;
  content.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => { eventTab = b.dataset.tab; renderEvents(); }));
  content.querySelectorAll('[data-dup]').forEach((b) => b.addEventListener('click', () => {
    duplicateSeed = all.find((e) => e.id === b.dataset.dup);
    location.hash = '#/events/new';
  }));
  content.querySelectorAll('[data-archive]').forEach((b) => b.addEventListener('click', async () => {
    if (!confirm('Archive "' + b.dataset.name + '"? It will be removed from the public site but kept here in the Archived tab.')) return;
    await sb.from('vl_events').update({ status: 'archived', updated_by: profile.full_name }).eq('id', b.dataset.archive);
    await logActivity('archived event', 'event', b.dataset.name);
    toast('Event archived');
    renderEvents();
  }));
  content.querySelectorAll('[data-restore]').forEach((b) => b.addEventListener('click', async () => {
    await sb.from('vl_events').update({ status: 'draft', updated_by: profile.full_name }).eq('id', b.dataset.restore);
    toast('Restored as a draft');
    renderEvents();
  }));
}

/* ---------- event form ---------- */
async function renderEventForm(id) {
  let ev = { name: '', event_date: '', all_day: false, start_time: '', end_time: '', location: '', category: 'social',
    description: '', contact_name: '', contact_email: '', contact_phone: '', recurrence: 'none', recurrence_end: '',
    featured: false, status: 'draft' };
  if (id) {
    const { data } = await sb.from('vl_events').select('*').eq('id', id).single();
    if (data) ev = data;
  } else if (duplicateSeed) {
    ev = { ...duplicateSeed, id: undefined, name: duplicateSeed.name + ' (copy)', status: 'draft' };
    duplicateSeed = null;
  }
  content.innerHTML = `
    <h1>${id ? 'Edit Event' : 'Add Event'}</h1>
    <p class="page-sub">${id && ev.updated_by ? 'Last updated by ' + esc(ev.updated_by) + ' · ' + timeAgo(ev.updated_at) : 'Fill in the details, then save as a draft or publish straight to the site.'}</p>
    <form id="evForm"><div class="card"><div class="form-grid">
      <div class="full"><label for="f_name">Event name *</label><input id="f_name" required value="${esc(ev.name)}"></div>
      <div><label for="f_date">Date *</label><input id="f_date" type="date" required value="${esc(ev.event_date)}"></div>
      <div><label for="f_cat">Category</label><select id="f_cat">${Object.entries(CATEGORIES).map(([k,v]) => `<option value="${k}" ${ev.category===k?'selected':''}>${v}</option>`).join('')}</select></div>
      <div class="full check-row"><input type="checkbox" id="f_allday" ${ev.all_day?'checked':''}><label for="f_allday">All-day event</label></div>
      <div><label for="f_start">Start time</label><input id="f_start" type="time" value="${esc(ev.start_time||'')}"></div>
      <div><label for="f_end">End time</label><input id="f_end" type="time" value="${esc(ev.end_time||'')}"></div>
      <div class="full"><label for="f_loc">Location</label><input id="f_loc" value="${esc(ev.location||'')}" placeholder="e.g. Pool Pavilion"></div>
      <div class="full"><label for="f_desc">Description</label><textarea id="f_desc">${esc(ev.description||'')}</textarea></div>
      <div><label for="f_cname">Contact name</label><input id="f_cname" value="${esc(ev.contact_name||'')}"></div>
      <div><label for="f_cinfo">Contact email or phone</label><input id="f_cinfo" value="${esc(ev.contact_email||ev.contact_phone||'')}"></div>
      <div><label for="f_rec">Recurring</label><select id="f_rec">${['none','weekly','monthly','yearly'].map((r) => `<option value="${r}" ${ev.recurrence===r?'selected':''}>${r==='none'?'Does not repeat':r[0].toUpperCase()+r.slice(1)}</option>`).join('')}</select></div>
      <div><label for="f_recend">Repeats until</label><input id="f_recend" type="date" value="${esc(ev.recurrence_end||'')}"><div class="field-hint">Required for recurring events</div></div>
      <div class="full check-row"><input type="checkbox" id="f_feat" ${ev.featured?'checked':''}><label for="f_feat">Feature on homepage (next three upcoming featured events are shown)</label></div>
      <p class="form-error" id="evError" hidden></p>
    </div></div></form>
    <div class="save-bar">
      <button type="button" class="btn btn-outline" id="previewBtn">Preview</button>
      <button type="button" class="btn btn-outline" id="draftBtn">Save Draft</button>
      <button type="button" class="btn btn-gold" id="publishBtn">${ev.status === 'published' ? 'Save & Keep Published' : 'Publish'}</button>
    </div>`;

  const syncAllDay = () => { const off = $('f_allday').checked; $('f_start').disabled = off; $('f_end').disabled = off; };
  $('f_allday').addEventListener('change', syncAllDay); syncAllDay();

  function collect() {
    const cinfo = $('f_cinfo').value.trim();
    return {
      name: $('f_name').value.trim(),
      event_date: $('f_date').value,
      all_day: $('f_allday').checked,
      start_time: $('f_allday').checked ? null : ($('f_start').value || null),
      end_time: $('f_allday').checked ? null : ($('f_end').value || null),
      location: $('f_loc').value.trim() || null,
      category: $('f_cat').value,
      description: $('f_desc').value.trim() || null,
      contact_name: $('f_cname').value.trim() || null,
      contact_email: cinfo.includes('@') ? cinfo : null,
      contact_phone: cinfo && !cinfo.includes('@') ? cinfo : null,
      recurrence: $('f_rec').value,
      recurrence_end: $('f_rec').value === 'none' ? null : ($('f_recend').value || null),
      featured: $('f_feat').checked,
      updated_by: profile.full_name,
    };
  }
  function validate(v) {
    if (!v.name) return 'Event name is required.';
    if (!v.event_date) return 'Date is required.';
    if (v.recurrence !== 'none' && !v.recurrence_end) return 'A "repeats until" date is required for recurring events.';
    return null;
  }
  async function save(status) {
    const v = collect();
    const err = validate(v);
    if (err) { $('evError').textContent = err; $('evError').hidden = false; return; }
    v.status = status;
    let res;
    if (id) res = await sb.from('vl_events').update(v).eq('id', id);
    else res = await sb.from('vl_events').insert({ ...v, created_by: profile.full_name });
    if (res.error) { $('evError').textContent = res.error.message; $('evError').hidden = false; return; }
    await logActivity(status === 'published' ? 'published event' : 'saved event draft', 'event', v.name);
    toast(status === 'published' ? '✓ Published — the event is live on the public calendar.' : 'Draft saved.');
    location.hash = '#/events';
  }
  $('draftBtn').addEventListener('click', () => save('draft'));
  $('publishBtn').addEventListener('click', () => save('published'));
  $('previewBtn').addEventListener('click', () => {
    const v = collect();
    const scrim = document.createElement('div');
    scrim.className = 'modal-scrim';
    scrim.innerHTML = `<div class="modal"><h3>How this will appear</h3>
      <div class="ev-preview">
        <div class="row-date"><div class="mo">${v.event_date ? MONTHS[+v.event_date.split('-')[1]-1].slice(0,3) : '—'}</div><div class="day">${v.event_date ? +v.event_date.split('-')[2] : '—'}</div></div>
        <div><span class="ev-tag">${CATEGORIES[v.category]}</span>
          <div style="font-weight:600;color:var(--text);">${esc(v.name) || '(untitled)'}</div>
          <div style="font-size:12.5px;color:var(--text-muted);">${eventTimeLabel(v)}${v.location ? ' · ' + esc(v.location) : ''}</div>
          ${v.description ? '<div style="font-size:13.5px;margin-top:6px;">' + esc(v.description) + '</div>' : ''}
        </div></div>
      <div class="modal-actions"><button type="button" class="btn btn-outline" id="closePrev">Close</button></div></div>`;
    document.body.appendChild(scrim);
    scrim.querySelector('#closePrev').addEventListener('click', () => scrim.remove());
    scrim.addEventListener('click', (e) => { if (e.target === scrim) scrim.remove(); });
  });
}

/* ---------- newsletters list ---------- */
async function renderNewsletters() {
  content.innerHTML = '<h1>Newsletters</h1><p class="page-sub">Loading…</p>';
  const { data: all, error } = await sb.from('vl_newsletters').select('*')
    .order('issue_year', { ascending: false }).order('issue_month', { ascending: false });
  if (error) { content.innerHTML = '<h1>Newsletters</h1><p class="form-error">' + esc(error.message) + '</p>'; return; }
  const live = all.filter((n) => n.status !== 'archived');
  const archived = all.filter((n) => n.status === 'archived');
  const row = (n) => `
    <div class="row">
      <div class="row-date"><div class="mo">${MONTHS[n.issue_month-1].slice(0,3)}</div><div class="day">${n.issue_year}</div></div>
      <div class="row-main">
        <div class="title">${esc(n.title)} <span class="pill ${n.status}">${n.status}</span>${n.is_latest ? ' <span class="pill admin">Latest issue</span>' : ''}</div>
        <div class="meta">${fmtSize(n.pdf_size)}${n.page_count ? ' · ' + n.page_count + ' pages' : ''} · published ${fmtDate(n.publication_date)}</div>
      </div>
      <div class="row-actions">
        <a href="${esc(n.pdf_path)}" target="_blank" rel="noopener">Open PDF</a>
        <a href="#/newsletters/${n.id}">Edit</a>
        ${n.status !== 'archived'
          ? `<button type="button" class="danger" data-archive="${n.id}" data-name="${esc(n.title)}">Archive</button>`
          : `<button type="button" data-restore="${n.id}">Restore</button>`}
      </div>
    </div>`;
  content.innerHTML = `
    <div class="page-head"><div><h1>Newsletters</h1><p class="page-sub" style="margin:0;">Publishing adds the issue to the public archive automatically — no HTML editing needed.</p></div>
    <a class="btn btn-gold" href="#/newsletters/new">+ Post Newsletter</a></div>
    <div class="card"><div class="row-list">${live.map(row).join('') || '<p class="empty-note">No newsletters yet.</p>'}</div></div>
    ${archived.length ? '<div class="card"><h3>Archived</h3><div class="row-list">' + archived.map(row).join('') + '</div></div>' : ''}`;
  content.querySelectorAll('[data-archive]').forEach((b) => b.addEventListener('click', async () => {
    if (!confirm('Archive "' + b.dataset.name + '"? It will be removed from the public archive but kept here.')) return;
    await sb.from('vl_newsletters').update({ status: 'archived', is_latest: false, updated_by: profile.full_name }).eq('id', b.dataset.archive);
    await logActivity('archived newsletter', 'newsletter', b.dataset.name);
    toast('Newsletter archived');
    renderNewsletters();
  }));
  content.querySelectorAll('[data-restore]').forEach((b) => b.addEventListener('click', async () => {
    await sb.from('vl_newsletters').update({ status: 'draft', updated_by: profile.full_name }).eq('id', b.dataset.restore);
    toast('Restored as a draft');
    renderNewsletters();
  }));
}

/* ---------- newsletter form ---------- */
async function renderNewsletterForm(id) {
  let nl = { issue_month: new Date().getMonth() + 1, issue_year: new Date().getFullYear(), title: '', description: '',
    publication_date: todayISO(), pdf_path: '', pdf_size: null, page_count: null, is_latest: true, status: 'draft' };
  if (id) {
    const { data } = await sb.from('vl_newsletters').select('*').eq('id', id).single();
    if (data) nl = data;
  }
  let pendingFile = null; // File chosen but not yet uploaded

  content.innerHTML = `
    <h1>${id ? 'Edit Newsletter' : 'Post Newsletter'}</h1>
    <p class="page-sub">${id && nl.updated_by ? 'Last updated by ' + esc(nl.updated_by) + ' · ' + timeAgo(nl.updated_at) : 'Upload the PDF and publish — the archive and "Latest Issue" section update themselves.'}</p>
    <form id="nlForm"><div class="card">
      <label>Newsletter PDF ${id ? '(choose a file only to replace the current one)' : '*'}</label>
      <div class="upload-box ${nl.pdf_path ? 'has-file' : ''}" id="uploadBox">
        <input type="file" id="f_pdf" accept="application/pdf,.pdf" hidden>
        <div id="uploadLabel">${nl.pdf_path ? '✓ Current file: ' + esc(decodeURIComponent(nl.pdf_path.split('/').pop())) + '<br><b>Tap to replace PDF</b>' : '<b>Tap to choose a PDF</b><br>PDF files only'}</div>
        <div class="progress" id="uploadProgress" hidden><div id="uploadBar"></div></div>
      </div>
      <div class="form-grid" style="margin-top:6px;">
        <div><label for="f_month">Issue month *</label><select id="f_month">${MONTHS.map((m,i) => `<option value="${i+1}" ${nl.issue_month===i+1?'selected':''}>${m}</option>`).join('')}</select></div>
        <div><label for="f_year">Issue year *</label><input id="f_year" type="number" min="2000" max="2100" required value="${nl.issue_year}"></div>
        <div class="full"><label for="f_title">Title</label><input id="f_title" value="${esc(nl.title)}" placeholder="Auto-generated from month and year"><div class="field-hint">Leave blank to use "Month Year Newsletter"</div></div>
        <div class="full"><label for="f_ndesc">Short description (optional)</label><input id="f_ndesc" value="${esc(nl.description||'')}"></div>
        <div><label for="f_pub">Publication date *</label><input id="f_pub" type="date" required value="${esc(nl.publication_date)}"></div>
        <div class="check-row" style="margin-top:34px;"><input type="checkbox" id="f_latest" ${nl.is_latest?'checked':''}><label for="f_latest">Mark as latest issue</label></div>
      </div>
      <p class="form-error" id="nlError" hidden></p>
    </div></form>
    <div class="save-bar">
      <button type="button" class="btn btn-outline" id="draftBtn">Save Draft</button>
      <button type="button" class="btn btn-gold" id="publishBtn">${nl.status === 'published' ? 'Save & Keep Published' : 'Publish'}</button>
    </div>`;

  const box = $('uploadBox');
  box.addEventListener('click', () => $('f_pdf').click());
  $('f_pdf').addEventListener('change', () => {
    const f = $('f_pdf').files[0];
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      $('nlError').textContent = 'Only PDF files can be uploaded.'; $('nlError').hidden = false; $('f_pdf').value = ''; return;
    }
    $('nlError').hidden = true;
    pendingFile = f;
    box.classList.add('has-file');
    $('uploadLabel').innerHTML = '✓ ' + esc(f.name) + ' (' + fmtSize(f.size) + ')<br><b>Ready to upload on save</b>';
    if (!$('f_title').value) $('f_title').value = MONTHS[$('f_month').value-1] + ' ' + $('f_year').value + ' Newsletter';
  });
  const autoTitle = () => { if (!id) $('f_title').placeholder = MONTHS[$('f_month').value-1] + ' ' + $('f_year').value + ' Newsletter'; };
  $('f_month').addEventListener('change', autoTitle); $('f_year').addEventListener('input', autoTitle);

  async function countPages(file) {
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      let str = '';
      for (let i = 0; i < buf.length; i += 65536) str += String.fromCharCode.apply(null, buf.subarray(i, i + 65536));
      const m = str.match(/\/Type\s*\/Page[^s]/g);
      return m ? m.length : null;
    } catch { return null; }
  }

  function uploadPDF(file, path) {
    return new Promise(async (resolve, reject) => {
      const { data: { session } } = await sb.auth.getSession();
      const xhr = new XMLHttpRequest();
      xhr.open('POST', SUPABASE_URL + '/storage/v1/object/' + BUCKET + '/' + path);
      xhr.setRequestHeader('Authorization', 'Bearer ' + session.access_token);
      xhr.setRequestHeader('apikey', ANON_KEY);
      xhr.setRequestHeader('Content-Type', 'application/pdf');
      $('uploadProgress').hidden = false;
      xhr.upload.onprogress = (e) => { if (e.lengthComputable) $('uploadBar').style.width = Math.round(e.loaded / e.total * 100) + '%'; };
      xhr.onload = () => xhr.status < 300 ? resolve() : reject(new Error('Upload failed (' + xhr.status + '): ' + xhr.responseText));
      xhr.onerror = () => reject(new Error('Upload failed — check your connection.'));
      xhr.send(file);
    });
  }

  async function save(status) {
    $('nlError').hidden = true;
    const month = +$('f_month').value, year = +$('f_year').value;
    if (!year || year < 2000) { $('nlError').textContent = 'Issue year is required.'; $('nlError').hidden = false; return; }
    if (!$('f_pub').value) { $('nlError').textContent = 'Publication date is required.'; $('nlError').hidden = false; return; }
    if (!id && !pendingFile) { $('nlError').textContent = 'A PDF upload is required.'; $('nlError').hidden = false; return; }
    $('draftBtn').disabled = true; $('publishBtn').disabled = true;

    const v = {
      issue_month: month,
      issue_year: year,
      title: $('f_title').value.trim() || MONTHS[month-1] + ' ' + year + ' Newsletter',
      description: $('f_ndesc').value.trim() || null,
      publication_date: $('f_pub').value,
      is_latest: $('f_latest').checked,
      status,
      updated_by: profile.full_name,
    };
    try {
      if (pendingFile) {
        const stamp = Date.now().toString(36);
        const path = year + '-' + String(month).padStart(2,'0') + '-' + stamp + '.pdf';
        await uploadPDF(pendingFile, path);
        v.pdf_path = SUPABASE_URL + '/storage/v1/object/public/' + BUCKET + '/' + path;
        v.pdf_size = pendingFile.size;
        v.page_count = await countPages(pendingFile);
      }
      if (v.is_latest && status === 'published') {
        await sb.from('vl_newsletters').update({ is_latest: false }).eq('is_latest', true);
      }
      let res;
      if (id) res = await sb.from('vl_newsletters').update(v).eq('id', id);
      else res = await sb.from('vl_newsletters').insert({ ...v, created_by: profile.full_name });
      if (res.error) throw new Error(res.error.message);
      await logActivity(status === 'published' ? 'published newsletter' : 'saved newsletter draft', 'newsletter', v.title);
      toast(status === 'published' ? '✓ Published — the newsletter is live in the public archive.' : 'Draft saved.');
      location.hash = '#/newsletters';
    } catch (e) {
      $('nlError').textContent = e.message; $('nlError').hidden = false;
      $('draftBtn').disabled = false; $('publishBtn').disabled = false;
    }
  }
  $('draftBtn').addEventListener('click', () => save('draft'));
  $('publishBtn').addEventListener('click', () => save('published'));
}

/* ---------- staff (admin only) ---------- */
async function callStaffFn(body) {
  const { data: { session } } = await sb.auth.getSession();
  const res = await fetch(SUPABASE_URL + '/functions/v1/vl-staff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token, apikey: ANON_KEY },
    body: JSON.stringify(body),
  });
  const out = await res.json();
  if (!res.ok) throw new Error(out.error || 'Request failed');
  return out;
}

async function renderStaff() {
  content.innerHTML = '<h1>Staff Accounts</h1><p class="page-sub">Loading…</p>';
  const { data: staff } = await sb.from('vl_staff').select('*').order('created_at');
  content.innerHTML = `
    <h1>Staff Accounts</h1>
    <p class="page-sub">Staff can manage events and newsletters. Administrators can also manage these accounts.</p>
    <div class="card"><div class="row-list">
      ${(staff||[]).map((s) => `
        <div class="row">
          <div class="row-main">
            <div class="title">${esc(s.full_name)} <span class="pill ${s.role === 'admin' ? 'admin' : 'published'}">${s.role}</span>${s.active ? '' : ' <span class="pill archived">deactivated</span>'}</div>
            <div class="meta">${esc(s.email)}</div>
          </div>
          <div class="row-actions">
            ${s.user_id !== profile.user_id ? `<button type="button" data-toggle="${s.user_id}" data-active="${s.active}" ${s.active ? 'class="danger"' : ''}>${s.active ? 'Deactivate' : 'Reactivate'}</button>` : '<span class="pill admin">You</span>'}
          </div>
        </div>`).join('')}
    </div></div>
    <div class="card"><h3>Add Staff Account</h3>
      <form id="staffForm"><div class="form-grid">
        <div><label for="s_name">Full name</label><input id="s_name" required></div>
        <div><label for="s_email">Email</label><input id="s_email" type="email" required></div>
        <div><label for="s_pw">Temporary password (10+ chars)</label><input id="s_pw" minlength="10" required></div>
        <div><label for="s_role">Role</label><select id="s_role"><option value="staff">Staff</option><option value="admin">Administrator</option></select></div>
      </div>
      <p class="form-error" id="staffError" hidden></p>
      <button type="submit" class="btn btn-gold" style="margin-top:16px;">Create Account</button>
      <div class="field-hint" style="margin-top:10px;">Share the temporary password with them directly — they can change it any time with "Forgot password" on the sign-in screen.</div>
      </form>
    </div>`;
  content.querySelectorAll('[data-toggle]').forEach((b) => b.addEventListener('click', async () => {
    const activating = b.dataset.active !== 'true';
    if (!activating && !confirm('Deactivate this account? They will no longer be able to sign in.')) return;
    try {
      await callStaffFn({ action: 'set_active', user_id: b.dataset.toggle, active: activating });
      toast(activating ? 'Account reactivated' : 'Account deactivated');
      renderStaff();
    } catch (e) { toast(e.message, true); }
  }));
  $('staffForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    $('staffError').hidden = true;
    try {
      await callStaffFn({ action: 'create', email: $('s_email').value.trim(), full_name: $('s_name').value.trim(), role: $('s_role').value, password: $('s_pw').value });
      toast('✓ Account created for ' + $('s_email').value.trim());
      renderStaff();
    } catch (err) { $('staffError').textContent = err.message; $('staffError').hidden = false; }
  });
}

boot();
