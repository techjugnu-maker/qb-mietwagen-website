import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Phone, Mail, MapPin, Clock } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import KontaktForm from '@/components/public/KontaktForm';

export const metadata: Metadata = {
  title: 'Kontakt – QB Mietwagen Kriftel',
  description:
    'Kontaktieren Sie QB Mietwagen per Telefon, WhatsApp oder Kontaktformular. 24/7 erreichbar im Main-Taunus-Kreis und Frankfurt.',
};

const WA_URL =
  'https://wa.me/4917693172917?text=Hallo%20QB%20Mietwagen%2C%20ich%20habe%20eine%20Frage%20zu%20einer%20Fahrt...';

export default function KontaktPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <SiteHeader />

      <main className="relative flex-1 max-w-5xl mx-auto w-full px-6 py-12 pb-28 sm:pb-12 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-400 transition-colors mb-8"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Zurück zur Startseite
        </Link>

        <h1 className="text-2xl font-black text-white mb-2">Kontakt aufnehmen</h1>
        <p className="text-sm text-slate-400 mb-10 max-w-xl leading-relaxed">
          Haben Sie Fragen zu einer Buchung, zu Preisen oder zu unserem Patiententransport?
          Wir sind 24 Stunden am Tag für Sie da – telefonisch, per WhatsApp oder über das Formular.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* Left: Direktkontakt + Adresse */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-4">
                Direktkontakt
              </h2>

              <a
                href="tel:+4917693172917"
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/30 group transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Telefon – 24/7</p>
                  <p className="text-sm font-black font-mono text-teal-400 group-hover:text-teal-300 transition-colors mt-0.5">
                    +49 176 93172917
                  </p>
                </div>
              </a>

              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-[#25D366]/30 group transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">WhatsApp</p>
                  <p className="text-sm font-black text-[#25D366] group-hover:brightness-125 transition-all mt-0.5">
                    Jetzt schreiben →
                  </p>
                </div>
              </a>

              <a
                href="mailto:techjugnu@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/30 group transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">E-Mail</p>
                  <p className="text-sm font-medium text-teal-400 group-hover:text-teal-300 transition-colors mt-0.5 break-all">
                    techjugnu@gmail.com
                  </p>
                </div>
              </a>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Anschrift &amp; Erreichbarkeit
              </h2>
              <div className="flex items-start gap-3 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <span>
                  Beethovenstraße 9<br />
                  65830 Kriftel, Deutschland
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Täglich 24 / 7 erreichbar</span>
              </div>
            </div>
          </div>

          {/* Right: Kontaktformular */}
          <div className="bg-navy-900/90 border border-border-subtle/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-navy-950/60 border-b border-border-subtle/40 px-6 py-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Kontaktformular
              </span>
            </div>
            <div className="p-6">
              <KontaktForm />
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
