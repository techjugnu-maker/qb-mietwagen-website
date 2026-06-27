import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import ObfuscatedLink from '@/components/ui/ObfuscatedLink';

export const metadata: Metadata = {
  title: 'Impressum – QB Mietwagen',
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <SiteHeader />

      <main className="relative flex-1 max-w-3xl mx-auto w-full px-6 py-12 z-10">
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-400 transition-colors mb-8">
          <ChevronLeft className="w-3.5 h-3.5" /> Zurück zur Startseite
        </Link>

        <h1 className="text-2xl font-black text-white mb-8 pb-4 border-b border-slate-800">Impressum</h1>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">Angaben gemäß § 5 TMG</h2>
            <div className="space-y-1 text-slate-300">
              <p className="font-semibold text-white">QB Mietwagen</p>
              <p>Qamar Ahmad &mdash; Einzelunternehmen</p>
              <p>Beethovenstraße 9</p>
              <p>65830 Kriftel</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">Kontakt</h2>
            <div className="space-y-1">
              <p>Telefon: <ObfuscatedLink parts={['+49176', '93172917']} prefix="tel:" display="+49 176 93172917" className="text-teal-400 hover:underline" /></p>
              <p>E-Mail: <ObfuscatedLink parts={['info', '@', 'qbmw', '.', 'de']} prefix="mailto:" className="text-teal-400 hover:underline" /></p>
              <p>Website: <a href="https://qbmw.de" className="text-teal-400 hover:underline">https://qbmw.de</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">Umsatzsteuer</h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27&thinsp;a Umsatzsteuergesetz (UStG):</p>
            <p className="mt-1 font-mono text-white">DE420466966</p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">
              Berufsrechtliche Angaben gemäß § 49 PBefG
            </h2>
            <div className="space-y-1">
              <p>Berufsbezeichnung: <span className="text-white">Konzessionierter Mietwagenunternehmer</span></p>
              <p>Zuständige Genehmigungsbehörde (§ 49 PBefG):</p>
              <div className="mt-1 ml-4 border-l border-slate-700 pl-4 space-y-0.5">
                <p className="text-white">Gemeinde Kriftel</p>
                <p>Am Rathaus 2</p>
                <p>65830 Kriftel</p>
              </div>
              <p className="mt-2">Konzessionsnummer: <span className="font-mono text-white">[IHRE KONZESSIONSNUMMER]</span></p>
              <p>Gültig bis: <span className="text-white">[GÜLTIGKEITSDATUM]</span></p>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">
              Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)
            </h2>
            <p>Qamar Ahmad</p>
            <p>Beethovenstraße 9, 65830 Kriftel</p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">Haftungsausschluss</h2>
            <div className="space-y-3 text-slate-400">
              <div>
                <p className="font-semibold text-slate-300">Haftung für Inhalte</p>
                <p className="mt-1">Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-300">Haftung für Links</p>
                <p className="mt-1">Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-300">Urheberrecht</p>
                <p className="mt-1">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">Online-Streitbeilegung (OS)</h2>
            <p className="text-slate-400">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">
                https://ec.europa.eu/consumers/odr/
              </a>.
            </p>
            <p className="mt-2 text-slate-400">
              Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
