import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-slate-900 mt-auto z-10">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-teal-700" />
            <span>&copy; {new Date().getFullYear()} QB Mietwagen &mdash; Alle Rechte vorbehalten.</span>
          </div>
          <nav className="flex items-center gap-1" aria-label="Rechtliche Links">
            <Link href="/impressum" className="px-2 py-1 hover:text-slate-300 transition-colors rounded">
              Impressum
            </Link>
            <span className="text-slate-700" aria-hidden>·</span>
            <Link href="/datenschutz" className="px-2 py-1 hover:text-slate-300 transition-colors rounded">
              Datenschutz
            </Link>
            <span className="text-slate-700" aria-hidden>·</span>
            <Link href="/agb" className="px-2 py-1 hover:text-slate-300 transition-colors rounded">
              AGB
            </Link>
          </nav>
        </div>

        <p className="text-center text-[10px] text-slate-700 border-t border-slate-900/60 pt-4">
          Konzessionierter Mietwagenunternehmer gemäß § 49 PBefG &middot; Genehmigungsbehörde: Gemeinde Kriftel
        </p>

      </div>
    </footer>
  );
}
