import { NextResponse } from 'next/server';

interface RouteRequest {
  pickup: string;
  dropoff: string;
  companyId?: string;
  paymentMethod?: 'cash' | 'card' | 'health_insurance_copay' | 'health_insurance_exempt';
}

export async function POST(request: Request) {
  try {
    const body: RouteRequest = await request.json();
    const { pickup, dropoff, paymentMethod } = body;

    if (!pickup || !dropoff) {
      return NextResponse.json(
        { error: 'Pickup and dropoff locations are required.' },
        { status: 400 }
      );
    }

    // 1. Fetch real driving distance from Google Maps API
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    let distanceKm = 0;
    let durationMins = 0;

    if (apiKey) {
      const encodedOrigin = encodeURIComponent(pickup);
      const encodedDest = encodeURIComponent(dropoff);
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${encodedDest}&origins=${encodedOrigin}&key=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
        const element = data.rows[0].elements[0];
        distanceKm = Number((element.distance.value / 1000).toFixed(1));
        durationMins = Math.ceil(element.duration.value / 60);
      } else {
        // Fallback calculation if Google Maps returns zero results for strings
        const hash = (pickup.length + dropoff.length) * 1.42;
        distanceKm = Number((Math.max(5, hash % 45)).toFixed(1));
        durationMins = Math.ceil(distanceKm * 1.8);
      }
    } else {
      // Local fallback calculation if API key is temporarily missing
      const hash = (pickup.length + dropoff.length) * 1.42;
      distanceKm = Number((Math.max(5, hash % 45)).toFixed(1));
      durationMins = Math.ceil(distanceKm * 1.8);
    }

    // 2. Base pricing configuration for QB Mietwagen private clients
    const pricingRules = {
      baseFare: 5.00,
      perKmRate: 2.20,
      perMinRate: 0.35,
    };

    const rawPrice = pricingRules.baseFare + 
                     (distanceKm * pricingRules.perKmRate) + 
                     (durationMins * pricingRules.perMinRate);
                     
    let estimatedPrice = Math.round(rawPrice * 100) / 100;
    let priceLabel = 'Festpreis';
    let hideFullPrice = false;

    // 3. CAREFUL HEALTH INSURANCE OVERRIDES ( Krankenkassen-Abrechnung )
    if (paymentMethod === 'health_insurance_copay') {
      // Patient pays only the fixed framework co-payment directly to the driver
      estimatedPrice = 6.00; 
      priceLabel = 'Gesetzliche Zuzahlung (Bar/Karte beim Fahrer)';
      hideFullPrice = true; // Signals the UI to display co-payment label only
    } else if (paymentMethod === 'health_insurance_exempt') {
      // Patient has a Befreiungsausweis, out of pocket is completely zero
      estimatedPrice = 0.00;
      priceLabel = 'Kostenübernahme (Zuzahlungsbefreit)';
      hideFullPrice = true;
    }

    return NextResponse.json({
      distanceKm,
      durationMins,
      estimatedPrice,
      currency: 'EUR',
      priceLabel,
      hideFullPrice,
      isMocked: !apiKey
    });

  } catch (error) {
    console.error('Route calculation crash:', error);
    return NextResponse.json(
      { error: 'Internal server routing error.' },
      { status: 500 }
    );
  }
}