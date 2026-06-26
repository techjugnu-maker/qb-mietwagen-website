import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { record } = await req.json()

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; color: #333;">
      <h2 style="color: #0d9488;">🚗 Neue Buchung auf qbmw.de eingegangen!</h2>
      <p><strong>Kunde:</strong> ${record.passenger_name}</p>
      <p><strong>Telefon:</strong> ${record.passenger_phone}</p>
      <p><strong>E-Mail:</strong> ${record.passenger_email || 'Nicht angegeben'}</p>
      <hr style="border: none; border-top: 1px solid #eee;" />
      <p><strong>Abholung:</strong> ${record.pickup_address}</p>
      <p><strong>Ziel:</strong> ${record.dropoff_address}</p>
      <p><strong>Datum & Uhrzeit:</strong> ${new Date(record.pickup_datetime).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })} Uhr</p>
      <p><strong>Beförderungsart:</strong> ${record.service_type}</p>
      <p><strong>Zahlungsart:</strong> ${record.payment_method}</p>
      <hr style="border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 16px; font-weight: bold;">Geschätzter Fahrpreis: ${record.estimated_price ? record.estimated_price + ' €' : 'Wird berechnet'}</p>
      ${record.account_type === 'patient' ? `
        <div style="background: #f0fdfa; padding: 10px; border-left: 4px solid #0d9488; margin-top: 10px;">
          <strong>🏥 Krankenkassen-Infos:</strong><br />
          Kasse: ${record.insurance_name || 'N/A'}<br />
          Vers.-Nr: ${record.insurance_number || 'N/A'}
        </div>
      ` : ''}
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'QB Mietwagen System <onboarding@resend.dev>',
      to: ['mohsinnaeem1995@gmail.com'],
      subject: `🚨 Neue Fahrt-Buchung: ${record.passenger_name}`,
      html: emailHtml,
    }),
  })

  return new Response(JSON.stringify({ response: "Email trigger processed!" }), {
    headers: { "Content-Type": "application/json" },
  })
})
