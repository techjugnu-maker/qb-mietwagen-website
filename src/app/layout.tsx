import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://qbmw.de'),
  title: 'QB Mietwagen Kriftel | Fahrtdienst & Krankentransport Frankfurt, MTK, HG',
  description:
    'Ihr zuverlässiger Partner für Mietwagen, Personenbeförderung & Krankentransporte im Main-Taunus-Kreis, Hochtaunuskreis und Frankfurt. Jetzt online Preis berechnen & 24/7 buchen!',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://qbmw.de',
    siteName: 'QB Mietwagen',
    title: 'QB Mietwagen Kriftel | Fahrtdienst & Krankentransport Frankfurt, MTK, HG',
    description:
      'Zuverlässige Mietwagen, Personenbeförderung & Krankentransporte im Main-Taunus-Kreis, Hochtaunuskreis und Frankfurt.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TaxiService',
  name: 'QB Mietwagen',
  url: 'https://qbmw.de',
  telephone: '+4917693172917',
  email: 'techjugnu@gmail.com',
  founder: { '@type': 'Person', name: 'Qamar Ahmad' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Beethovenstraße 9',
    addressLocality: 'Kriftel',
    postalCode: '65830',
    addressCountry: 'DE',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 50.0847, longitude: 8.4596 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Main-Taunus-Kreis' },
    { '@type': 'AdministrativeArea', name: 'Hochtaunuskreis' },
    { '@type': 'City', name: 'Frankfurt am Main' },
    { '@type': 'City', name: 'Kriftel' },
    { '@type': 'City', name: 'Hofheim am Taunus' },
    { '@type': 'City', name: 'Bad Homburg vor der Höhe' },
    { '@type': 'Airport', name: 'Flughafen Frankfurt (FRA)' },
  ],
  serviceType: ['Mietwagen', 'Patiententransport', 'Flughafentransfer', 'Krankenfahrt'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
