import { NextResponse } from 'next/server';

interface RouteRequest {
  pickup: string;
  dropoff: string;
  serviceType?: string;
  paymentMethod?: 'cash' | 'card' | 'invoice' | 'health_insurance_copay' | 'health_insurance_exempt';
}

const BASE_FARE = 4.50;

function perKmRate(serviceType: string): number {
  return serviceType === 'komfort' || serviceType === 'premier' ? 1.85 : 1.70;
}

export async function POST(request: Request) {
  try {
    const body: RouteRequest = await request.json();
    const { pickup, dropoff, serviceType = 'standard', paymentMethod } = body;

    if (!pickup || !dropoff) {
      return NextResponse.json({ error: 'Pickup and dropoff locations are required.' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    let distanceKm = 0;
    let durationMins = 0;

    if (apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${encodeURIComponent(dropoff)}&origins=${encodeURIComponent(pickup)}&key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
          const el = data.rows[0].elements[0];
          distanceKm   = Number((el.distance.value / 1000).toFixed(1));
          durationMins = Math.ceil(el.duration.value / 60);
        }
      } catch { /* fall through to estimate */ }
    }

    if (distanceKm === 0) {
      const hash = (pickup.length + dropoff.length) * 1.42;
      distanceKm   = Number((Math.max(5, hash % 45)).toFixed(1));
      durationMins = Math.ceil(distanceKm * 1.8);
    }

    // QB Mietwagen tariff: 4,50 € base + per-km rate by vehicle class
    const rawPrice     = BASE_FARE + distanceKm * perKmRate(serviceType);
    const estimatedPrice = Math.round(rawPrice * 100) / 100;

    // Statutory copay: 10 % of fare, min 5 €, max 10 €
    let copayAmount  = 0;
    let priceLabel   = 'Festpreis';
    let hideFullPrice = false;

    if (paymentMethod === 'health_insurance_copay') {
      copayAmount = Math.min(10.00, Math.max(5.00, Math.round(estimatedPrice * 0.10 * 100) / 100));
      priceLabel  = 'Abrechnung über Krankenkasse';
    } else if (paymentMethod === 'health_insurance_exempt') {
      priceLabel    = 'Kostenübernahme (Zuzahlungsbefreit)';
      hideFullPrice = true;
    } else if (paymentMethod === 'invoice') {
      priceLabel = 'Firmenrechnung';
    }

    return NextResponse.json({
      distanceKm,
      durationMins,
      estimatedPrice,
      copayAmount,
      currency: 'EUR',
      priceLabel,
      hideFullPrice,
      isMocked: !apiKey,
    });

  } catch (err) {
    console.error('[route-calc] crash:', err);
    return NextResponse.json({ error: 'Internal server routing error.' }, { status: 500 });
  }
}
