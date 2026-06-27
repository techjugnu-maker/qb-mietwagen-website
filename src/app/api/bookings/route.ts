import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key);
}

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

// ── Server-side price computation ─────────────────────────────────────────────
// QB Mietwagen Tarif: 4,50 € Basis + gestaffelter Kilometerpreis nach Fahrzeugklasse.
// Die ersten 15 km haben einen höheren Tarif, jeder Kilometer ab dem 16. km wird günstiger.
async function serverComputePrice(
  pickup: string,
  dropoff: string,
  serviceType: string,
  paymentMethod: PaymentMethod,
): Promise<{ estimatedPrice: number; estimatedDistance: number; copayAmount: number }> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  let distanceKm = 0;

  if (apiKey) {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${encodeURIComponent(dropoff)}&origins=${encodeURIComponent(pickup)}&key=${apiKey}`;
    try {
      const res  = await fetch(url);
      const data = await res.json();
      if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
        distanceKm = Number((data.rows[0].elements[0].distance.value / 1000).toFixed(1));
      }
    } catch { /* fall through */ }
  }

  if (distanceKm === 0) {
    const hash = (pickup.length + dropoff.length) * 1.42;
    distanceKm = Number((Math.max(5, hash % 45)).toFixed(1));
  }

  // Tarife festlegen basierend auf der Klasse (standard/economy vs komfort/premier)
  const isKomfort = serviceType === 'komfort';
  const basePrice = 4.50;
  const rateFirst15Km = isKomfort ? 2.60 : 2.40;
  const rateAfter15Km = isKomfort ? 2.20 : 2.00;

  let calculatedPrice = basePrice;

  // Mathematische Logik für die Kilometer-Staffelung
  if (distanceKm <= 15) {
    calculatedPrice += distanceKm * rateFirst15Km;
  } else {
    calculatedPrice += (15 * rateFirst15Km) + ((distanceKm - 15) * rateAfter15Km);
  }

  // Auf 2 Nachkommastellen runden
  const estimatedPrice = Math.round(calculatedPrice * 100) / 100;

  // Gesetzliche Zuzahlung berechnen: 10 % des Fahrpreises, min 5 €, max 10 €
  let copayAmount = 0;
  if (paymentMethod === 'health_insurance_copay') {
    copayAmount = Math.min(10.00, Math.max(5.00, Math.round(estimatedPrice * 0.10 * 100) / 100));
  }

  return { estimatedPrice, estimatedDistance: distanceKm, copayAmount };
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

    // ── 4. Cross-field validation ─────────────────────────────────────────────
    const allowed = ALLOWED_PAYMENTS[account_type as AccountType];
    if (!allowed.includes(payment_method as PaymentMethod)) {
      return NextResponse.json(
        { error: `Zahlungsart "${payment_method}" ist für Kontotyp "${account_type}" nicht zulässig.` },
        { status: 400 }
      );
    }

    // ── 5. Patient insurance info ─────────────────────────────────────────────
    if (account_type === 'patient' && !insurance_name && !insurance_number) {
      return NextResponse.json({ error: 'Krankenkasseninformationen sind für Patienten erforderlich.' }, { status: 400 });
    }

    // ── 6. Optional email format check ────────────────────────────────────────
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
      service_type ?? 'standard',
      payment_method as PaymentMethod,
    );

    // ── 9. Insert ─────────────────────────────────────────────────────────────
    const supabase = getSupabase();
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
    console.error('[bookings] insert error:', err);
    return NextResponse.json({ error: 'Buchung konnte nicht gespeichert werden.' }, { status: 500 });
  }
}