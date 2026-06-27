import Link from 'next/link';
import { Phone, Clock } from 'lucide-react';

export default function SiteHeader() {
  return (
    <header className="relative border-b border-slate-900/80 z-10 bg-slate-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">

        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center font-black text-slate-950 tracking-tighter text-lg shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow">
            QB
          </div>
          <div>
            <p className="text-lg font-black tracking-tight uppercase text-white leading-none">QB Mietwagen</p>
            <p className="text-[10px] tracking-wider text-teal-400 font-bold uppercase">Personen- &amp; Patiententransport</p>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center" aria-label="Hauptnavigation">
          <Link
            href="/kontakt"
            className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-teal-400 rounded-lg transition-colors"
          >
            Kontakt
          </Link>
        </nav>

        <a
          href="tel:+4917693172917"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 hover:border-teal-500/40 transition-all group"
          aria-label="Jetzt anrufen: +49 176 93172917"
        >
          <div className="flex flex-col items-start">
            <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-slate-400 font-bold">
              <Clock className="w-2.5 h-2.5" /> 24/7 Direktbuchung
            </span>
            <span className="text-sm font-black font-mono text-teal-400 group-hover:text-teal-300 transition-colors">
              +49 176 93172917
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
            <Phone className="w-4 h-4 text-teal-400" />
          </div>
        </a>

      </div>
    </header>
  );
}
