// Emails TRF Tech when a website enquiry arrives.
//
// Called by the `enquiries_notify` database trigger with { id }. It only ever emails an
// enquiry that exists in the database and hasn't been emailed yet, so the public URL
// can't be used to send arbitrary mail or repeat alerts.
//
// Secrets (Supabase Dashboard → Edge Functions → Secrets):
//   RESEND_API_KEY  – from resend.com
//   NOTIFY_TO       – where alerts go, e.g. sales@trftech.co.za
//   NOTIFY_FROM     – optional sender, e.g. "TRF Tech Website <enquiries@trftech.co.za>"
//                     (needs the domain verified in Resend; defaults to Resend's test sender)

// Plain REST calls with the service-role key (provided to every Edge Function); no client library needed
const REST = `${Deno.env.get('SUPABASE_URL')}/rest/v1/enquiries`
const KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const patch = (query: string, body: unknown) =>
  fetch(`${REST}?${query}`, {
    method: 'PATCH',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(body),
  })

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const SOURCE: Record<string, string> = { home: 'Homepage form', security: 'Security Services form' }

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

  let id: unknown
  try { ({ id } = await req.json()) } catch { return json({ error: 'Bad body' }, 400) }
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'Bad id' }, 400)

  const apiKey = Deno.env.get('RESEND_API_KEY')
  const to = Deno.env.get('NOTIFY_TO')
  if (!apiKey || !to) {
    console.warn('notify-enquiry: RESEND_API_KEY or NOTIFY_TO not set — skipping email')
    return json({ skipped: 'not configured' })
  }
  const from = Deno.env.get('NOTIFY_FROM') || 'TRF Tech Website <onboarding@resend.dev>'

  // Claim the enquiry first so two calls can never both send it
  const claim = await patch(`id=eq.${id}&notified_at=is.null`, { notified_at: new Date().toISOString() })
  if (!claim.ok) return json({ error: await claim.text() }, 500)
  const [e] = await claim.json()
  if (!e) return json({ skipped: 'unknown or already notified' })

  const rows: [string, string | null][] = [
    ['Name', e.name],
    ['Phone', e.phone],
    ['Email', e.email],
    ['Service', e.service],
    ['Property', e.property_type],
    ['Message', e.message],
    ['Form', SOURCE[e.source] ?? e.source],
  ]
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
      <h2 style="margin:0 0 12px;color:#f39436">New website enquiry</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows.filter(([, v]) => v).map(([k, v]) => `
          <tr><td style="color:#666;vertical-align:top">${k}</td>
          <td style="white-space:pre-wrap">${esc(String(v))}</td></tr>`).join('')}
      </table>
      <p style="color:#666;font-size:13px">Reply to this email to answer the customer${e.email ? '' : ' (no email given — call them)'}.
      Manage enquiries in the website admin under Enquiries.</p>
    </div>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: to.split(',').map((s) => s.trim()),
      subject: `New enquiry: ${e.name}${e.service ? ` — ${e.service}` : ''}`,
      html,
      ...(e.email ? { reply_to: e.email } : {}),
    }),
  })

  if (!res.ok) {
    // Release the claim so a later call can retry
    await patch(`id=eq.${id}`, { notified_at: null })
    const detail = await res.text()
    console.error('notify-enquiry: Resend failed', res.status, detail)
    return json({ error: 'email failed', status: res.status }, 502)
  }
  return json({ sent: true })
})
