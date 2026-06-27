'use client';

import React from 'react';
import PassengerBookingForm from '@/components/public/PassengerBookingForm';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { ShieldCheck, Star } from 'lucide-react';

export default function QBStartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased relative">

      {/* Hintergrund-Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <SiteHeader />

      <main className="relative flex-1 max-w-7xl mx-auto w-full px-6 py-12 pb-28 sm:pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start z-10">

        {/* Linke Spalte: Infotexte */}
        <div className="lg:col-span-7 space-y-8 lg:pt-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Offizieller Partner aller gesetzlichen Krankenkassen
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
              Zuverlässige Beförderung.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
                Für jeden Anlass.
              </span>
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Ob zum Flughafen, ein Geschäftstermin oder die sichere Fahrt zur medizinischen Behandlung
              (Dialyse, Strahlentherapie, Arztbesuch) – wir bringen Sie sicher, pünktlich und komfortabel
              ans Ziel. Direkte Abrechnung mit Ihrer Krankenkasse über Transportschein Muster&nbsp;4.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-900 pt-8">
            {[
              {
                color: 'teal',
                label: 'Abrechnung',
                text: 'Direkte Krankenkassenabrechnung über Transportschein Muster 4 – kein Papierkram für Sie.',
              },
              {
                color: 'emerald',
                label: 'Flotte',
                text: 'Moderne Kombi-Fahrzeuge für Rollatoren, Rollstühle und barrierefreie Sitzendtransporte.',
              },
              {
                color: 'cyan',
                label: 'Firmen',
                text: 'B2B-Monatsabrechnung, feste Tarife und persönlicher Ansprechpartner für Geschäftskunden.',
              },
            ].map(({ color, label, text }) => (
              <div key={label} className="p-4 rounded-xl bg-slate-900/40 border border-slate-900">
                <div className={`flex items-center gap-1 text-${color}-400 mb-1`}>
                  <Star className={`w-3.5 h-3.5 fill-${color}-400`} />
                  <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Buchungsformular — zuerst auf Mobile (order-first), rechts auf Desktop */}
        <div className="lg:col-span-5 w-full order-first lg:order-last">
          <PassengerBookingForm companyId="qb-mietwagen-id" companySlug="qb-mietwagen" />
        </div>

      </main>

      <SiteFooter />
    </div>
  );
}
