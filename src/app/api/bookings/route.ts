import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service-role client — only used server-side, never sent to the browser
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PaymentMethod = 'cash' | 'card' | 'invoice' | 'health_insurance_copay' | 'health_insurance_exempt';

async function serverComputePrice(
  pickup: string,
  dropoff: string,
  paymentMethod: PaymentMethod
): Promise<number> {
  if (paymentMethod === 'health_insurance_copay') return 6.00;
  if (paymentMethod === 'health_insurance_exempt') return 0.00;
  if (paymentMethod === 'invoice') return 0.00; // billed later via monthly invoice

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  let distanceKm = 0;
  let durationMins = 0;

  if (apiKey) {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${encodeURIComponent(dropoff)}&origins=${encodeURIComponent(pickup)}&key=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
        const el = data.rows[0].elements[0];
        distanceKm = Number((el.distance.value / 1000).toFixed(1));
        durationMins = Math.ceil(el.duration.value / 60);
      }
    } catch { /* fall through to hash fallback */ }
  }

  if (distanceKm === 0) {
    const hash = (pickup.length + dropoff.length) * 1.42;
    distanceKm = Number((Math.max(5, hash % 45)).toFixed(1));
    durationMins = Math.ceil(distanceKm * 1.8);
  }

  const raw = 5.00 + distanceKm * 2.20 + durationMins * 0.35;
  return Math.round(raw * 100) / 100;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companySlug,
      accountType,
      passengerName,
      passengerPhone,
      pickup,
      dropoff,
      pickupDatetime,
      serviceType,
      paymentMethod,
      companyName,
      notes,
    } = body;

    // Validate required fields
    if (!companySlug || !passengerName || !passengerPhone || !pickup || !dropoff || !pickupDatetime) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 });
    }

    // Resolve company_id server-side — client cannot forge this
    const { data: company, error: companyErr } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', companySlug)
      .single();

    if (companyErr || !company) {
      return NextResponse.json({ error: 'Unbekannter Mandant.' }, { status: 400 });
    }

    // Recompute price server-side — client value is never trusted
    const estimatedPrice = await serverComputePrice(pickup, dropoff, paymentMethod as PaymentMethod);

    const { error: insertErr } = await supabase.from('bookings').insert([{
      company_id:      company.id,
      account_type:    accountType,
      passenger_name:  passengerName,
      passenger_phone: passengerPhone,
      pickup_address:  pickup,
      dropoff_address: dropoff,
      pickup_datetime: new Date(pickupDatetime).toISOString(),
      service_type:    serviceType,
      payment_method:  paymentMethod,
      estimated_price: estimatedPrice,
      company_name:    accountType === 'business' ? (companyName ?? null) : null,
      notes:           notes ?? null,
    }]);

    if (insertErr) throw insertErr;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Booking insert error:', err);
    return NextResponse.json({ error: 'Buchung konnte nicht gespeichert werden.' }, { status: 500 });
  }
}
