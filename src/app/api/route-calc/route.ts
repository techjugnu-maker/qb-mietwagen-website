import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pickup, dropoff, serviceType, paymentMethod } = body;

    if (!pickup || !dropoff) {
      return NextResponse.json({ error: 'Start und Ziel erforderlich.' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    let distanceKm = 9.6; // Sicherer Standard-Ausweichwert (Usingen -> Schmitten)

    // Falls der Key auf Serverebene da ist, echte Distanz holen
    if (apiKey) {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${encodeURIComponent(dropoff)}&origins=${encodeURIComponent(pickup)}&key=${apiKey}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
          distanceKm = Number((data.rows[0].elements[0].distance.value / 1000).toFixed(1));
        }
      } catch (err) {
        console.error('Server DistanceMatrix Fetch Error:', err);
      }
    }

    // Deine exakte Staffelpreis-Mathematik
    const basePrice = 4.50;
    const isKomfort = serviceType === 'komfort';
    const kmRateFirst15 = isKomfort ? 2.60 : 2.40;
    const kmRateAfter15 = isKomfort ? 2.20 : 2.00;

    let calculatedPrice = basePrice;
    if (distanceKm <= 15) {
      calculatedPrice += distanceKm * kmRateFirst15;
    } else {
      calculatedPrice += (15 * kmRateFirst15) + ((distanceKm - 15) * kmRateAfter15);
    }

    const estimatedPrice = Math.round(calculatedPrice * 100) / 100;

    // Gesetzliche Zuzahlung berechnen
    let copayAmount = 0;
    if (paymentMethod === 'health_insurance_copay') {
      copayAmount = Math.min(10.00, Math.max(5.00, Math.round(estimatedPrice * 0.10 * 100) / 100));
    }

    return NextResponse.json({
      estimatedPrice,
      copayAmount,
      distanceKm,
      priceLabel: 'Berechneter Fahrpreis',
      hideFullPrice: paymentMethod === 'health_insurance_copay' || paymentMethod === 'health_insurance_exempt'
    });

  } catch (error: any) {
    console.error('Route Calc API Error:', error);
    return NextResponse.json({ error: 'Interner Server-Fehler bei der Preisberechnung.' }, { status: 500 });
  }
}