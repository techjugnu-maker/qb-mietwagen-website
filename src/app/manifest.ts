import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QB Mietwagen – Personen- & Patiententransport',
    short_name: 'QB Mietwagen',
    description:
      'Fahrtdienst & Krankentransport im Main-Taunus-Kreis, Hochtaunuskreis und Frankfurt am Main.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#14b8a6',
    lang: 'de',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
