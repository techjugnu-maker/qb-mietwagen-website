import { NextResponse } from 'next/server';

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

  // Delegate email sending to the Supabase edge function — reuses the
  // RESEND_API_KEY that is already stored as a Supabase secret, so we
  // don't need to add a separate env var to Vercel.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('[contact] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
    return NextResponse.json(
      { error: 'E-Mail-Dienst nicht konfiguriert. Bitte rufen Sie uns direkt an.' },
      { status: 500 },
    );
  }

  const edgeRes = await fetch(`${supabaseUrl}/functions/v1/resend-email`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'contact', name, email, phone, message }),
  });

  if (!edgeRes.ok) {
    const errText = await edgeRes.text().catch(() => '');
    console.error('[contact] Edge function error:', edgeRes.status, errText);
    return NextResponse.json(
      { error: 'E-Mail konnte nicht gesendet werden. Bitte rufen Sie uns direkt an: +49 176 93172917' },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
