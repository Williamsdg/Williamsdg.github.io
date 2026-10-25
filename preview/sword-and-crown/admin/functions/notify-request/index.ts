// Sword and Crown — notify the salon when a styling request arrives.
//
// Supabase Edge Function. Fired by a database trigger on INSERT into
// public.requests (see ../notify-request.sql). Sends one email to the salon
// inbox and, optionally, a short acknowledgment to the client.
//
// Deploy (once the Supabase project exists):
//   supabase functions deploy notify-request --no-verify-jwt
//   supabase secrets set RESEND_API_KEY=re_xxx SALON_INBOX=appointments@swordandcrownsalon.com \
//                        NOTIFY_SECRET=<long random string> ACK_CLIENT=true
//
// The sending domain (swordandcrownsalon.com) must be verified in Resend
// first, or Resend refuses the From address. Nothing here is secret.

const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

Deno.serve(async (req) => {
  const secret = Deno.env.get('NOTIFY_SECRET');
  if (secret && req.headers.get('x-notify-secret') !== secret) {
    return new Response('forbidden', { status: 403 });
  }

  let body: { type?: string; record?: Record<string, unknown> };
  try { body = await req.json(); } catch { return new Response('bad json', { status: 400 }); }
  if (body.type !== 'INSERT' || !body.record) return new Response('ignored');

  const r = body.record;
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) return new Response('RESEND_API_KEY not set', { status: 500 });

  const inbox = Deno.env.get('SALON_INBOX') ?? 'appointments@swordandcrownsalon.com';
  const from = Deno.env.get('FROM_ADDRESS') ?? 'Sword & Crown Website <website@swordandcrownsalon.com>';
  const when = new Date(String(r.created_at ?? Date.now()))
    .toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' });

  const send = (payload: Record<string, unknown>) =>
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

  // 1. The salon. Reply goes straight to the client.
  const salon = await send({
    from, to: [inbox], reply_to: String(r.email ?? ''),
    subject: `New appointment request — ${r.service} — ${r.name}`,
    text: [
      `A new request came in from the website at ${when} (Central).`, '',
      `Name:     ${r.name}`, `Phone:    ${r.phone}`, `Email:    ${r.email}`,
      `Service:  ${r.service}`, '', `Details:`, String(r.details ?? '(none)'), '',
      `Reply to this email to answer them directly, or mark it in the admin page.`,
    ].join('\n'),
    html: `<p>A new request came in from the website at <b>${esc(when)}</b> (Central).</p>
<table cellpadding="4"><tr><td><b>Name</b></td><td>${esc(r.name)}</td></tr>
<tr><td><b>Phone</b></td><td><a href="tel:${esc(r.phone)}">${esc(r.phone)}</a></td></tr>
<tr><td><b>Email</b></td><td><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></td></tr>
<tr><td><b>Service</b></td><td>${esc(r.service)}</td></tr></table>
<p><b>Details</b><br>${esc(r.details ?? '(none)').replace(/\n/g, '<br>')}</p>
<p>Reply to this email to answer them directly, or mark it in the admin page.</p>`,
  });

  // 2. The client — a receipt, not a booking confirmation. Never promise a time.
  let ack: Response | null = null;
  if ((Deno.env.get('ACK_CLIENT') ?? 'true') === 'true' && r.email) {
    ack = await send({
      from, to: [String(r.email)], reply_to: inbox,
      subject: 'We have your request — Sword & Crown',
      text: `Hi ${r.name},\n\nThank you — we have your request for ${r.service}. This isn't a confirmed appointment yet: one of our team will be in touch to talk through what you need and find a time.\n\nIf it's quicker, call or text us on 205-259-6911.\n\nSword & Crown Salon & Studio\n2142 Tyler Road · Bluff Park · Hoover`,
    });
  }

  const ok = salon.ok && (ack === null || ack.ok);
  return new Response(JSON.stringify({ salon: salon.status, client: ack?.status ?? 'skipped' }),
    { status: ok ? 200 : 502, headers: { 'Content-Type': 'application/json' } });
});
