import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const fmt = (n: number) =>
  n.toFixed(2).replace('.', ',') + ' €'

serve(async (req) => {
  const body = await req.json()

  // ── Contact form (called by /api/contact Next.js route) ──────────────────
  if (body.type === 'contact') {
    const { name, email, phone, message } = body as {
      name: string; email: string; phone?: string; message: string
    }

    const timestamp = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })

    const html = `
<div style="font-family:-apple-system,sans-serif;max-width:580px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:16px;border:1px solid #1e293b;">
  <div style="margin-bottom:24px;">
    <span style="display:inline-block;background:linear-gradient(135deg,#14b8a6,#10b981);color:#0f172a;font-weight:900;padding:4px 12px;border-radius:6px;font-size:12px;letter-spacing:0.06em;">QB MIETWAGEN</span>
  </div>
  <h1 style="color:#2dd4bf;font-size:20px;margin:0 0 24px;font-weight:900;">📥 Neue Kontaktanfrage</h1>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr>
      <td style="padding:10px 0;color:#64748b;width:110px;vertical-align:top;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Name</td>
      <td style="padding:10px 0;font-weight:700;color:#f1f5f9;">${esc(name)}</td>
    </tr>
    <tr style="border-top:1px solid #1e293b;">
      <td style="padding:10px 0;color:#64748b;vertical-align:top;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">E-Mail</td>
      <td style="padding:10px 0;"><a href="mailto:${esc(email)}" style="color:#2dd4bf;text-decoration:none;">${esc(email)}</a></td>
    </tr>
    ${phone ? `
    <tr style="border-top:1px solid #1e293b;">
      <td style="padding:10px 0;color:#64748b;vertical-align:top;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Telefon</td>
      <td style="padding:10px 0;"><a href="tel:${esc(phone)}" style="color:#2dd4bf;text-decoration:none;">${esc(phone)}</a></td>
    </tr>` : ''}
  </table>
  <div style="margin-top:24px;padding:20px;background:#1e293b;border-radius:10px;border-left:3px solid #2dd4bf;">
    <p style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;font-weight:600;">Nachricht</p>
    <p style="margin:0;white-space:pre-wrap;line-height:1.7;color:#cbd5e1;">${esc(message)}</p>
  </div>
  <p style="margin:24px 0 0;font-size:11px;color:#334155;border-top:1px solid #1e293b;padding-top:16px;">
    Gesendet über <a href="https://qbmw.de/kontakt" style="color:#2dd4bf;">qbmw.de/kontakt</a> · ${timestamp}
  </p>
</div>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'QB Mietwagen Kontakt <buchung@qbmw.de>',
        to: ['info@qbmw.de'],
        reply_to: String(email),
        subject: `📥 Neue Kontaktanfrage von ${esc(name)} – QB Mietwagen`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text().catch(() => '')
      console.error('[resend-email] contact send failed:', res.status, err)
      return new Response(JSON.stringify({ ok: false }), {
        status: 502, headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // ── Booking webhook (Supabase DB INSERT trigger) ──────────────────────────
  const { record } = body

  // Fare already stored as the real km-based price
  const price = parseFloat(record.estimated_price) || 0
  const priceFormatted = price > 0 ? fmt(price) : 'Wird berechnet'

  // Statutory copay: 10 % of fare, min 5 €, max 10 €
  const copay = record.payment_method === 'health_insurance_copay'
    ? Math.min(10.00, Math.max(5.00, Math.round(price * 0.10 * 100) / 100))
    : 0

  const emailHtml = `
<div style="font-family:sans-serif;max-width:600px;color:#333;">
  <h2 style="color:#0d9488;">🚗 Neue Buchung auf qbmw.de eingegangen!</h2>
  <p><strong>Kunde:</strong> ${record.passenger_name}</p>
  <p><strong>Telefon:</strong> ${record.passenger_phone}</p>
  <p><strong>E-Mail:</strong> ${record.passenger_email || 'Nicht angegeben'}</p>
  <hr style="border:none;border-top:1px solid #eee;" />
  <p><strong>Abholung:</strong> ${record.pickup_address}</p>
  <p><strong>Ziel:</strong> ${record.dropoff_address}</p>
  <p><strong>Datum &amp; Uhrzeit:</strong> ${new Date(record.pickup_datetime).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })} Uhr</p>
  <p><strong>Fahrzeugklasse:</strong> ${record.service_type || '—'}</p>
  <p><strong>Zahlungsart:</strong> ${record.payment_method}</p>
  <hr style="border:none;border-top:1px solid #eee;" />
  <p style="font-size:16px;font-weight:bold;">Geschätzter Fahrpreis: ${priceFormatted}</p>
  ${record.payment_method === 'health_insurance_copay' ? `
  <div style="background:#f0fdfa;padding:10px;border-left:4px solid #0d9488;margin-top:6px;">
    <strong>🏥 Abrechnung über Krankenkasse</strong><br />
    Gesetzliche Zuzahlung (Eigenanteil Patient): <strong>${fmt(copay)}</strong>
  </div>` : ''}
  ${record.payment_method === 'health_insurance_exempt' ? `
  <div style="background:#f0fdfa;padding:10px;border-left:4px solid #0d9488;margin-top:6px;">
    <strong>🏥 Abrechnung über Krankenkasse – Zuzahlungsbefreit</strong><br />
    Der Patient legt einen Befreiungsausweis vor. Keine Zuzahlung.
  </div>` : ''}
  ${record.account_type === 'patient' && (record.insurance_name || record.insurance_number) ? `
  <div style="background:#f0fdfa;padding:10px;border-left:4px solid #0d9488;margin-top:6px;">
    <strong>Krankenkassen-Infos:</strong><br />
    Kasse: ${record.insurance_name || 'N/A'}<br />
    Vers.-Nr: ${record.insurance_number || 'N/A'}
  </div>` : ''}
</div>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from: 'QB Mietwagen System <onboarding@resend.dev>',
      to: ['mohsinnaeem1995@gmail.com'],
      subject: `🚨 Neue Fahrt-Buchung: ${record.passenger_name}`,
      html: emailHtml,
    }),
  })

  return new Response(JSON.stringify({ ok: res.ok }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
