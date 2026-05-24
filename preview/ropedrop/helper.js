/* RopeDrop Helper — bookmarklet payload.
 * Runs on disneyworld.disney.go.com or disneyland.disney.go.com, uses the
 * user's existing Disney session cookies to call the public VQ endpoints
 * and render a streamlined overlay of boarding-group + LL info.
 *
 * No credentials of any kind are sent to RopeDrop / Williams Digital — all
 * requests go directly from the user's browser to Disney's own servers.
 */
(function () {
  if (window.__ropeDropHelperOpen) return;
  window.__ropeDropHelperOpen = true;

  var host = location.hostname;
  var isWDW = /disneyworld\.disney\.go\.com$/.test(host);
  var isDLR = /disneyland\.disney\.go\.com$/.test(host);

  if (!isWDW && !isDLR) {
    alert(
      'RopeDrop Helper needs to run on disneyworld.disney.go.com or disneyland.disney.go.com.\n\n' +
      'Open one of those pages first, then tap the bookmarklet again.'
    );
    window.__ropeDropHelperOpen = false;
    return;
  }

  var resortLabel = isWDW ? 'Walt Disney World' : 'Disneyland Resort';
  var vqHost = isWDW
    ? 'https://vqguest-svc-wdw.wdprapps.disney.com'
    : 'https://vqguest-svc.wdprapps.disney.com';
  var llUrl = isWDW
    ? 'https://disneyworld.disney.go.com/vas/'
    : 'https://disneyland.disney.go.com/vas/';

  /* ---------------- styles ---------------- */
  var css = [
    '#rd-helper{position:fixed;inset:0;z-index:2147483647;background:rgba(8,12,28,.78);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:flex-start;justify-content:center;padding:24px;overflow-y:auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#0c1228;}',
    '#rd-helper *{box-sizing:border-box;}',
    '#rd-panel{background:#fff;border-radius:22px;max-width:560px;width:100%;box-shadow:0 30px 80px rgba(0,0,0,.45);overflow:hidden;animation:rd-pop .18s ease-out;}',
    '@keyframes rd-pop{from{transform:scale(.96);opacity:0}to{transform:scale(1);opacity:1}}',
    '#rd-head{background:linear-gradient(135deg,#5271ff,#3a52cc);color:#fff;padding:18px 22px;display:flex;align-items:center;justify-content:space-between;}',
    '#rd-brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:17px;letter-spacing:.2px;}',
    '#rd-brand svg{flex:0 0 26px;}',
    '#rd-close{background:rgba(255,255,255,.18);border:0;color:#fff;width:32px;height:32px;border-radius:50%;font-size:18px;cursor:pointer;line-height:1;}',
    '#rd-close:hover{background:rgba(255,255,255,.3);}',
    '#rd-resort{padding:10px 22px 0;font-size:13px;color:#5a607a;text-transform:uppercase;letter-spacing:.8px;font-weight:600;}',
    '#rd-body{padding:14px 22px 22px;}',
    '.rd-section-title{font-size:14px;font-weight:700;color:#0c1228;margin:18px 0 10px;display:flex;align-items:center;gap:8px;}',
    '.rd-section-title .rd-pill{background:#eef1ff;color:#3a52cc;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;letter-spacing:.3px;}',
    '.rd-card{border:1px solid #e5e8f2;border-radius:14px;padding:14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:12px;}',
    '.rd-card-name{font-weight:600;font-size:15px;color:#0c1228;}',
    '.rd-card-sub{font-size:12.5px;color:#5a607a;margin-top:2px;}',
    '.rd-status{font-weight:700;font-size:13px;padding:6px 10px;border-radius:8px;white-space:nowrap;}',
    '.rd-status.open{background:#e1f8e9;color:#0d7a3c;}',
    '.rd-status.paused{background:#fff4d6;color:#8a5a00;}',
    '.rd-status.closed{background:#f3f4f8;color:#5a607a;}',
    '#rd-ll-btn{display:block;background:linear-gradient(135deg,#5271ff,#3a52cc);color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:14px;font-weight:700;font-size:15px;margin-top:6px;}',
    '#rd-ll-btn:hover{filter:brightness(1.08);}',
    '#rd-loading{text-align:center;padding:28px 0;color:#5a607a;font-size:14px;}',
    '#rd-error{background:#fff4ee;border:1px solid #ffd6c2;color:#8c3300;padding:12px 14px;border-radius:12px;font-size:13.5px;line-height:1.4;}',
    '#rd-footer{font-size:11.5px;color:#7a809a;text-align:center;padding:0 22px 18px;line-height:1.45;}',
    '@media (max-width:480px){#rd-helper{padding:0;}#rd-panel{border-radius:0;min-height:100%;}}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'rd-helper-style';
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------- shell ---------------- */
  var root = document.createElement('div');
  root.id = 'rd-helper';
  root.innerHTML =
    '<div id="rd-panel" role="dialog" aria-label="RopeDrop Helper">' +
      '<div id="rd-head">' +
        '<div id="rd-brand">' +
          '<svg viewBox="0 0 32 32" aria-hidden="true">' +
            '<circle cx="16" cy="16" r="15" fill="#fff"/>' +
            '<path d="M16 6 C 10 13, 10 19, 16 25 C 22 19, 22 13, 16 6 Z" fill="#5271ff"/>' +
            '<circle cx="16" cy="18.2" r="2.4" fill="#fff"/>' +
          '</svg>' +
          '<span>RopeDrop Helper</span>' +
        '</div>' +
        '<button id="rd-close" aria-label="Close">×</button>' +
      '</div>' +
      '<div id="rd-resort">' + resortLabel + '</div>' +
      '<div id="rd-body">' +
        '<div id="rd-loading">Loading virtual queues from Disney…</div>' +
      '</div>' +
      '<div id="rd-footer">RopeDrop reads Disney\'s public queue data using your existing My Disney Experience session. Your credentials are never sent to Williams Digital.</div>' +
    '</div>';
  document.body.appendChild(root);

  function close() {
    root.remove();
    style.remove();
    window.__ropeDropHelperOpen = false;
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(); }
  root.querySelector('#rd-close').addEventListener('click', close);
  root.addEventListener('click', function (e) { if (e.target === root) close(); });
  document.addEventListener('keydown', onKey);

  /* ---------------- fetch + render ---------------- */
  var body = root.querySelector('#rd-body');

  function escape(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  function render(queues) {
    var html = '<div class="rd-section-title">Virtual Queues <span class="rd-pill">Live</span></div>';

    if (!queues || !queues.length) {
      html += '<div class="rd-card"><div><div class="rd-card-name">No virtual queues right now</div>' +
              '<div class="rd-card-sub">Disney is not running any boarding groups at this resort today.</div></div></div>';
    } else {
      queues.forEach(function (q) {
        var name = q.name || q.queueName || 'Queue';
        var state = (q.state || q.queueState || '').toUpperCase();
        var cls = 'closed', label = 'Closed';
        if (state === 'OPEN' || state === 'JOIN' || q.isAcceptingJoins) { cls = 'open'; label = 'Open — join now'; }
        else if (state === 'PAUSED' || q.isAcceptingPartyCreation === false) { cls = 'paused'; label = 'Paused'; }
        else if (state) { label = state.charAt(0) + state.slice(1).toLowerCase(); }

        var nextStart = q.nextScheduledOpenTime || q.nextOpenTime;
        var sub = nextStart ? 'Next window: ' + escape(nextStart) : '';

        html += '<div class="rd-card">' +
                  '<div>' +
                    '<div class="rd-card-name">' + escape(name) + '</div>' +
                    (sub ? '<div class="rd-card-sub">' + sub + '</div>' : '') +
                  '</div>' +
                  '<div class="rd-status ' + cls + '">' + escape(label) + '</div>' +
                '</div>';
      });
    }

    html += '<div class="rd-section-title">Lightning Lane</div>';
    html += '<a id="rd-ll-btn" href="' + llUrl + '">⚡ Open Lightning Lane booking</a>';
    body.innerHTML = html;
  }

  function renderError(msg, hint) {
    body.innerHTML =
      '<div id="rd-error"><strong>Could not load queues.</strong><br>' + escape(msg) +
      (hint ? '<br><br>' + escape(hint) : '') + '</div>' +
      '<div class="rd-section-title">Lightning Lane</div>' +
      '<a id="rd-ll-btn" href="' + llUrl + '">⚡ Open Lightning Lane booking</a>';
  }

  fetch(vqHost + '/application/v1/guest/getQueues', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Accept': 'application/json' }
  })
    .then(function (r) {
      if (r.status === 401 || r.status === 403) {
        throw new Error('Not signed in to My Disney Experience.');
      }
      if (!r.ok) throw new Error('Disney responded ' + r.status + '.');
      return r.json();
    })
    .then(function (data) {
      var list = (data && (data.queues || data.data || data)) || [];
      if (!Array.isArray(list)) list = [];
      render(list);
    })
    .catch(function (err) {
      var msg = err && err.message ? err.message : 'Unknown error.';
      var hint = /signed in/i.test(msg)
        ? 'Sign in to disneyworld.com or disneyland.com, then tap the bookmarklet again.'
        : 'Disney may have temporarily changed their queue API. You can still book through the button below.';
      renderError(msg, hint);
    });
})();
