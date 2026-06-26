'use client';

import React from 'react';
import PassengerBookingForm from '@/components/public/PassengerBookingForm';
import { ShieldCheck, Phone, Clock, Star } from 'lucide-react';

export default function QBStartPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased relative">
      
      {/* Hintergrund-Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <header className="relative max-w-7xl mx-auto px-6 pt-12 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-900 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center font-black text-slate-950 tracking-tighter text-lg shadow-lg shadow-teal-500/20">
            QB
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase text-white">QB Mietwagen</h1>
            <p className="text-[10px] tracking-wider text-teal-400 font-bold uppercase">Personen- & Patiententransport</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>24/7 Erreichbar</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <a href="tel:+49123456789" className="hover:text-white font-mono font-bold transition-colors">+49 (0) 123 456789</a>
          </div>
        </div>
      </header>

      {/* Main Inhalt */}
      <main className="relative max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start z-10">
        
        {/* Linke Spalte: Infotexte */}
        <div className="lg:col-span-7 space-y-8 lg:pt-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Offizieller Partner aller Krankenkassen
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
              Zuverlässige Beförderung. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
                Für jeden Anlass.
              </span>
            </h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Ob zum Flughafen, ein Geschäftstermin oder die sichere Fahrt zur medizinischen Behandlung (Dialyse, Strahlentherapie, Arztbesuch) – wir bringen Sie sicher, pünktlich und komfortabel ans Ziel.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-900 pt-8">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900">
              <div className="flex items-center gap-1 text-teal-400 mb-1">
                <Star className="w-3.5 h-3.5 fill-teal-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Abrechnung</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">Direkt mit allen Krankenkassen über Transportschein Muster 4.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900">
              <div className="flex items-center gap-1 text-emerald-400 mb-1">
                <Star className="w-3.5 h-3.5 fill-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Flotte</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">Moderne Fahrzeuge für Rollstühle, Rollatoren und Sitzendtransporte.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900">
              <div className="flex items-center gap-1 text-cyan-400 mb-1">
                <Star className="w-3.5 h-3.5 fill-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Firmen</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">B2B-Monatsabrechnung und feste Tarife für Geschäftskunden.</p>
            </div>
          </div>
        </div>

        {/* Rechte Spalte: Das Buchungsformular */}
        <div className="lg:col-span-5 w-full">
          <PassengerBookingForm companyId="qb-mietwagen-id" companySlug="qb-mietwagen" />
        </div>

      </main>

      {/* Footer */}
      <footer className="relative max-w-7xl mx-auto px-6 py-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 z-10">
        <p>&copy; {new Date().getFullYear()} QB Mietwagen. Alle Rechte vorbehalten.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-300 transition-colors">Impressum</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Datenschutz</a>
        </div>
      </footer>

    </div>
  );
}