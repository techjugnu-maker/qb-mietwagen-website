import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QB Mietwagen – Personen- & Patiententransport | qbmw.de',
  description:
    'Zuverlässiger Mietwagenservice für Privatpersonen, Geschäftskunden und Patienten. Direkte Krankenkas­sen­ab­rechnung. 24/7 buchbar online oder telefonisch.',
  metadataBase: new URL('https://qbmw.de'),
  openGraph: {
    title: 'QB Mietwagen',
    description: 'Personen- & Patiententransport – jetzt online buchen.',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
