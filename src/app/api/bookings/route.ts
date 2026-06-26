import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Enums ────────────────────────────────────────────────────────────────────
const ACCOUNT_TYPES   = ['private', 'business', 'patient'] as const;
const PAYMENT_METHODS = ['cash', 'card', 'invoice', 'health_insurance_copay', 'health_insurance_exempt'] as const;
const SERVICE_TYPES   = ['standard', 'komfort', 'kombi', 'wheelchair'] as const;

type AccountType   = typeof ACCOUNT_TYPES[number];
type PaymentMethod = typeof PAYMENT_METHODS[number];

// ── Cross-field matrix: which payment methods are valid per account type ──────
const ALLOWED_PAYMENTS: Record<AccountType, PaymentMethod[]> = {
  private:  ['cash', 'card'],
  business: ['cash', 'card', 'invoice'],
  patient:  ['health_insurance_copay', 'health_insurance_exempt'],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function trimStr(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim().slice(0, max);
  return t.length ? t : null;
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// ── Server-side price computation (client value never trusted) ────────────────
async function serverComputePrice(
  pickup: string,
  dropoff: string,
  paymentMethod: PaymentMethod,
): Promise<{ estimatedPrice: number; estimatedDistance: number }> {
  if (paymentMethod === 'health_insurance_copay') return { estimatedPrice: 6.00,  estimatedDistance: 0 };
  if (paymentMethod === 'health_insurance_exempt') return { estimatedPrice: 0.00, estimatedDistance: 0 };
  if (paymentMethod === 'invoice')                 return { estimatedPrice: 0.00, estimatedDistance: 0 };

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  let distanceKm = 0, durationMins = 0;

  if (apiKey) {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${encodeURIComponent(dropoff)}&origins=${encodeURIComponent(pickup)}&key=${apiKey}`;
    try {
      const res  = await fetch(url);
      const data = await res.json();
      if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
        const el = data.rows[0].elements[0];
        distanceKm  = Number((el.distance.value / 1000).toFixed(1));
        durationMins = Math.ceil(el.duration.value / 60);
      }
    } catch { /* fall through */ }
  }

  if (distanceKm === 0) {
    const hash = (pickup.length + dropoff.length) * 1.42;
    distanceKm  = Number((Math.max(5, hash % 45)).toFixed(1));
    durationMins = Math.ceil(distanceKm * 1.8);
  }

  const raw = 5.00 + distanceKm * 2.20 + durationMins * 0.35;
  return { estimatedPrice: Math.round(raw * 100) / 100, estimatedDistance: distanceKm };
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ── 1. Trim & length-bound all string inputs ──────────────────────────────
    const account_type     = trimStr(body.account_type, 20);
    const passenger_name   = trimStr(body.passenger_name, 120);
    const passenger_phone  = trimStr(body.passenger_phone, 30);
    const passenger_email  = trimStr(body.passenger_email, 200);
    const pickup_address   = trimStr(body.pickup_address, 300);
    const dropoff_address  = trimStr(body.dropoff_address, 300);
    const pickup_datetime  = trimStr(body.pickup_datetime, 30);
    const service_type     = trimStr(body.service_type, 30);
    const payment_method   = trimStr(body.payment_method, 40);
    const insurance_name   = trimStr(body.insurance_name, 120);
    const insurance_number = trimStr(body.insurance_number, 40);

    // ── 2. Required fields ────────────────────────────────────────────────────
    if (!passenger_name || !passenger_phone || !pickup_address || !dropoff_address || !pickup_datetime) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 });
    }

    // ── 3. Enum validation ────────────────────────────────────────────────────
    if (!ACCOUNT_TYPES.includes(account_type as AccountType)) {
      return NextResponse.json({ error: 'Ungültiger Kontotyp.' }, { status: 400 });
    }
    if (!PAYMENT_METHODS.includes(payment_method as PaymentMethod)) {
      return NextResponse.json({ error: 'Ungültige Zahlungsart.' }, { status: 400 });
    }
    if (service_type && !SERVICE_TYPES.includes(service_type as typeof SERVICE_TYPES[number])) {
      return NextResponse.json({ error: 'Ungültige Fahrzeugklasse.' }, { status: 400 });
    }

    // ── 4. Cross-field validation: payment_method must match account_type ─────
    const allowed = ALLOWED_PAYMENTS[account_type as AccountType];
    if (!allowed.includes(payment_method as PaymentMethod)) {
      return NextResponse.json(
        { error: `Zahlungsart "${payment_method}" ist für Kontotyp "${account_type}" nicht zulässig.` },
        { status: 400 }
      );
    }

    // ── 5. Patient accounts must provide insurance info ───────────────────────
    if (account_type === 'patient' && !insurance_name && !insurance_number) {
      return NextResponse.json({ error: 'Krankenkasseninformationen sind für Patienten erforderlich.' }, { status: 400 });
    }

    // ── 6. Optional email format check ───────────────────────────────────────
    if (passenger_email && !isValidEmail(passenger_email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
    }

    // ── 7. Datetime sanity check ──────────────────────────────────────────────
    const pickupDate = new Date(pickup_datetime);
    if (isNaN(pickupDate.getTime())) {
      return NextResponse.json({ error: 'Ungültiges Datum/Uhrzeit.' }, { status: 400 });
    }

    // ── 8. Server-side price computation ─────────────────────────────────────
    const { estimatedPrice, estimatedDistance } = await serverComputePrice(
      pickup_address,
      dropoff_address,
      payment_method as PaymentMethod,
    );

    // ── 9. Insert ─────────────────────────────────────────────────────────────
    const { error } = await supabase.from('bookings').insert([{
      account_type,
      passenger_name,
      passenger_phone,
      passenger_email:    passenger_email   ?? null,
      pickup_address,
      dropoff_address,
      pickup_datetime:    pickupDate.toISOString(),
      service_type:       service_type      ?? null,
      payment_method,
      estimated_distance: estimatedDistance,
      estimated_price:    estimatedPrice,
      insurance_name:     account_type === 'patient' ? (insurance_name   ?? null) : null,
      insurance_number:   account_type === 'patient' ? (insurance_number ?? null) : null,
      status:             'pending',
    }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Booking insert error:', err);
    return NextResponse.json({ error: 'Buchung konnte nicht gespeichert werden.' }, { status: 500 });
  }
}
