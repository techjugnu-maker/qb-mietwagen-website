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
  email: 'info@qbmw.de',
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
        {/* Quick-contact bar — mobile only (sm:hidden), global across all pages */}
        <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden flex gap-3">
          <a
            href="https://wa.me/4917693172917?text=Hallo%20QB%20Mietwagen%2C%20ich%20habe%20eine%20Frage%20zu%20einer%20Fahrt..."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#25D366] text-white font-black text-sm shadow-2xl active:scale-[0.97] transition-transform"
            aria-label="Per WhatsApp schreiben"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <a
            href="tel:+4917693172917"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-sm shadow-2xl shadow-teal-500/30 active:scale-[0.97] transition-transform"
            aria-label="Jetzt anrufen: +49 176 93172917"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.83 19.79 19.79 0 01.07.16 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16z"/>
            </svg>
            Anrufen
          </a>
        </div>
      </body>
    </html>
  );
}
