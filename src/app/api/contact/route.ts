import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body as Record<string, string>;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Bitte füllen Sie alle Pflichtfelder aus.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[contact] RESEND_API_KEY fehlt in Vercel!');
      return NextResponse.json({ error: 'E-Mail-Dienst nicht konfiguriert.' }, { status: 500 });
    }

    // Initialise lazily (inside handler) so the module loads cleanly at
    // build time even when the env var is not set locally.
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: 'QB Mietwagen <buchung@qbmw.de>',
      to: ['techjugnu@gmail.com'],
      replyTo: email,
      subject: `📥 Neue Kontaktanfrage von ${name} – QB Mietwagen`,
      html: `
        <div style="font-family:sans-serif;padding:20px;background-color:#0f172a;color:#f8fafc;">
          <h2 style="color:#14b8a6;border-bottom:1px solid #334155;padding-bottom:10px;">Neue Kontaktanfrage</h2>
          <p><strong>Name:</strong> ${esc(name)}</p>
          <p><strong>E-Mail:</strong> ${esc(email)}</p>
          <p><strong>Telefon:</strong> ${phone ? esc(phone) : 'Nicht angegeben'}</p>
          <div style="margin-top:20px;padding:15px;background-color:#1e293b;border-radius:8px;">
            <p style="white-space:pre-wrap;margin:0;">${esc(message)}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[contact] Resend API Fehler:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error('[contact] Server-Fehler:', err);
    return NextResponse.json({ error: 'Interner Server-Fehler' }, { status: 500 });
  }
}
