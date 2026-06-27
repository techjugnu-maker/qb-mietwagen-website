import { NextResponse } from 'next/server';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const name    = String(raw.name    ?? '').trim().slice(0, 120);
  const email   = String(raw.email   ?? '').trim().slice(0, 254);
  const phone   = String(raw.phone   ?? '').trim().slice(0, 30);
  const message = String(raw.message ?? '').trim().slice(0, 2000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, E-Mail und Nachricht sind Pflichtfelder.' },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY not set in environment');
    return NextResponse.json(
      { error: 'E-Mail-Dienst nicht konfiguriert. Bitte rufen Sie uns direkt an.' },
      { status: 500 },
    );
  }

  const timestamp = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

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
</div>`;

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'QB Mietwagen Kontakt <buchung@qbmw.de>',
      to: ['techjugnu@gmail.com'],
      reply_to: email,
      subject: `📥 Neue Kontaktanfrage von ${name} – QB Mietwagen`,
      html,
    }),
  });

  if (!resendRes.ok) {
    const errText = await resendRes.text().catch(() => '');
    console.error('[contact] Resend error:', resendRes.status, errText);
    return NextResponse.json(
      { error: 'E-Mail konnte nicht gesendet werden. Bitte rufen Sie uns direkt an: +49 176 93172917' },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
