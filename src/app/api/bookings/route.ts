import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service-role client — server-side only, never sent to the browser
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PaymentMethod = 'cash' | 'card' | 'invoice' | 'health_insurance_copay' | 'health_insurance_exempt';

async function serverComputePrice(
  pickup: string,
  dropoff: string,
  paymentMethod: PaymentMethod
): Promise<{ estimatedPrice: number; estimatedDistance: number }> {
  if (paymentMethod === 'health_insurance_copay') return { estimatedPrice: 6.00, estimatedDistance: 0 };
  if (paymentMethod === 'health_insurance_exempt') return { estimatedPrice: 0.00, estimatedDistance: 0 };
  if (paymentMethod === 'invoice')                 return { estimatedPrice: 0.00, estimatedDistance: 0 };

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
  return {
    estimatedPrice:    Math.round(raw * 100) / 100,
    estimatedDistance: distanceKm,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      account_type,
      passenger_name,
      passenger_phone,
      passenger_email,
      pickup_address,
      dropoff_address,
      pickup_datetime,
      service_type,
      payment_method,
      insurance_name,
      insurance_number,
    } = body;

    if (!passenger_name || !passenger_phone || !pickup_address || !dropoff_address || !pickup_datetime) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 });
    }

    // Price and distance are always computed server-side — client values are never trusted
    const { estimatedPrice, estimatedDistance } = await serverComputePrice(
      pickup_address,
      dropoff_address,
      payment_method as PaymentMethod
    );

    const { error } = await supabase.from('bookings').insert([{
      account_type:       account_type      ?? 'private',
      passenger_name,
      passenger_phone,
      passenger_email:    passenger_email   ?? null,
      pickup_address,
      dropoff_address,
      pickup_datetime:    new Date(pickup_datetime).toISOString(),
      service_type:       service_type      ?? null,
      payment_method:     payment_method    ?? null,
      estimated_distance: estimatedDistance,
      estimated_price:    estimatedPrice,
      insurance_name:     insurance_name    ?? null,
      insurance_number:   insurance_number  ?? null,
      status:             'pending',
    }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Booking insert error:', err);
    return NextResponse.json({ error: 'Buchung konnte nicht gespeichert werden.' }, { status: 500 });
  }
}
