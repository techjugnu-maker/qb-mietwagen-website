import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
  title: 'Allgemeine Geschäftsbedingungen – QB Mietwagen',
  robots: { index: false },
};

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">§ {num} {title}</h2>
      <div className="space-y-3 text-slate-400 leading-relaxed">{children}</div>
    </section>
  );
}

export default function AgbPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <SiteHeader />

      <main className="relative flex-1 max-w-3xl mx-auto w-full px-6 py-12 z-10">
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-400 transition-colors mb-8">
          <ChevronLeft className="w-3.5 h-3.5" /> Zurück zur Startseite
        </Link>

        <h1 className="text-2xl font-black text-white mb-2 pb-4 border-b border-slate-800">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <p className="text-xs text-slate-500 mb-8">
          QB Mietwagen – Qamar Ahmad &middot; Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
        </p>

        <div className="space-y-8 text-sm">

          <Section num="1" title="Geltungsbereich und Vertragspartner">
            <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Beförderungsverträge zwischen</p>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
              <p className="font-semibold text-white">QB Mietwagen – Qamar Ahmad</p>
              <p>Beethovenstraße 9, 65830 Kriftel (im Folgenden: <em>Auftragnehmer</em>)</p>
            </div>
            <p>und dem Auftraggeber (Fahrgast oder dessen gesetzlichem Vertreter, im Folgenden: <em>Auftraggeber</em>).</p>
            <p>Entgegenstehende oder abweichende Bedingungen des Auftraggebers werden nicht anerkannt, es sei denn, der Auftragnehmer stimmt ihrer Geltung ausdrücklich schriftlich zu.</p>
          </Section>

          <Section num="2" title="Buchung und Vertragsschluss">
            <p><strong className="text-slate-300">2.1</strong> Eine Buchungsanfrage kann über das Online-Formular auf qbmw.de, per Telefon oder per E-Mail erfolgen.</p>
            <p><strong className="text-slate-300">2.2</strong> Der Vertrag kommt zustande, wenn der Auftragnehmer die Buchungsanfrage schriftlich oder telefonisch bestätigt. Die automatisierte Eingangsbestätigung per E-Mail gilt nicht als Auftragsbestätigung.</p>
            <p><strong className="text-slate-300">2.3</strong> Der Auftraggeber ist verpflichtet, alle für die Durchführung der Fahrt relevanten Angaben korrekt und vollständig zu machen (insbesondere Abhohadresse, Zieladresse, Uhrzeit, Sonderbedarf wie Rollstuhl oder Rollator).</p>
            <p><strong className="text-slate-300">2.4</strong> Der Auftragnehmer behält sich vor, Buchungsanfragen ohne Angabe von Gründen abzulehnen, sofern keine anderweitige gesetzliche Beförderungspflicht besteht.</p>
          </Section>

          <Section num="3" title="Fahrpreise und Zahlung">
            <p><strong className="text-slate-300">3.1</strong> Die angezeigten Fahrpreise sind Schätzpreise auf Basis der eingegebenen Route (berechnet über Google Maps Distance Matrix API). Der endgültige Fahrpreis richtet sich nach der tatsächlich gefahrenen Strecke, dem aktuellen Tarif und etwaigen Wartezeiten.</p>
            <p><strong className="text-slate-300">3.2</strong> Zahlungsmethoden: Barzahlung beim Fahrer, Kartenzahlung im Fahrzeug (EC/Visa/Mastercard), Krankenkassenabrechnung (mit gültigem Transportschein Muster 4) oder Monatsrechnung (nur für vertraglich vereinbarte Geschäftskunden).</p>
            <p><strong className="text-slate-300">3.3</strong> Bei Patiententransporten mit Krankenkassenabrechnung ist ein gültiger, ärztlich ausgestellter Transportschein (Muster 4) zwingend erforderlich und vor Fahrtantritt dem Fahrer zu übergeben. Zuzahlungspflichtige Patienten entrichten den gesetzlich festgelegten Eigenanteil (derzeit 6,00 €) direkt beim Fahrer. Zuzahlungsbefreite Patienten haben ihren Befreiungsausweis vorzuzeigen.</p>
            <p><strong className="text-slate-300">3.4</strong> Rechnungen für Geschäftskunden sind innerhalb von 14 Tagen nach Rechnungsdatum ohne Abzug fällig.</p>
          </Section>

          <Section num="4" title="Stornierung und Umbuchung">
            <p><strong className="text-slate-300">4.1</strong> Stornierungen sind spätestens <strong className="text-slate-300">2 Stunden vor dem vereinbarten Abholtermin</strong> kostenfrei möglich. Maßgeblich ist der Eingang der Stornierung beim Auftragnehmer (telefonisch oder per E-Mail).</p>
            <p><strong className="text-slate-300">4.2</strong> Bei Stornierungen innerhalb von 2 Stunden vor dem vereinbarten Termin wird eine Ausfallpauschale von <strong className="text-slate-300">25 % des vereinbarten Fahrpreises</strong>, mindestens jedoch 10,00 €, berechnet.</p>
            <p><strong className="text-slate-300">4.3</strong> Bei Nichterscheinen des Auftraggebers am vereinbarten Abholort ohne Stornierung (No-Show) wird der volle vereinbarte Fahrpreis in Rechnung gestellt.</p>
            <p><strong className="text-slate-300">4.4</strong> Umbuchungen sind kostenlos, sofern sie spätestens 2 Stunden vor dem ursprünglichen Abholtermin erfolgen.</p>
            <p><strong className="text-slate-300">4.5</strong> Bei Patiententransporten gilt: Medizinisch notwendige Absagen (z. B. Krankenhauseinweisung) werden auf Nachweis ohne Stornokosten abgewickelt.</p>
          </Section>

          <Section num="5" title="Pünktlichkeit, Wartezeiten und Force Majeure">
            <p><strong className="text-slate-300">5.1</strong> Der Auftragnehmer bemüht sich um pünktliches Erscheinen am vereinbarten Abholort. Bei unvorhersehbaren Umständen (Stau, Unfall, höhere Gewalt) haftet der Auftragnehmer nicht für Verspätungen.</p>
            <p><strong className="text-slate-300">5.2</strong> Wartezeiten bis zu 10 Minuten nach der vereinbarten Abholzeit sind im Fahrpreis inbegriffen. Darüber hinausgehende Wartezeiten werden mit [X,XX €] pro angefangener Minute berechnet.</p>
            <p><strong className="text-slate-300">5.3</strong> Höhere Gewalt (Extremwetter, Katastrophen, behördliche Anordnungen) berechtigt den Auftragnehmer zur kostenfreien Stornierung.</p>
          </Section>

          <Section num="6" title="Pflichten des Fahrgastes">
            <p><strong className="text-slate-300">6.1</strong> Der Fahrgast hat die Anweisungen des Fahrers zum Zwecke der Verkehrssicherheit zu befolgen.</p>
            <p><strong className="text-slate-300">6.2</strong> Beschädigungen am Fahrzeug, die durch den Fahrgast verursacht werden (z. B. Erbrechen, Beschädigung der Innenausstattung), werden zum Selbstkostenpreis in Rechnung gestellt.</p>
            <p><strong className="text-slate-300">6.3</strong> Das Rauchen, der Konsum von Alkohol und illegalen Substanzen im Fahrzeug ist untersagt.</p>
            <p><strong className="text-slate-300">6.4</strong> Tiere dürfen nur in geeigneten Transportboxen und nach vorheriger Absprache mitgenommen werden.</p>
          </Section>

          <Section num="7" title="Haftung">
            <p><strong className="text-slate-300">7.1</strong> Der Auftragnehmer haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper und Gesundheit.</p>
            <p><strong className="text-slate-300">7.2</strong> Bei leichter Fahrlässigkeit haftet der Auftragnehmer nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), und auch dann nur in Höhe des vorhersehbaren, vertragstypischen Schadens.</p>
            <p><strong className="text-slate-300">7.3</strong> Für Personen- und Sachschäden besteht eine Kraftfahrzeughaftpflichtversicherung nach gesetzlichem Mindestumfang. Für Gepäck und mitgeführte Gegenstände des Fahrgastes übernimmt der Auftragnehmer keine Haftung, sofern kein grobes Verschulden vorliegt.</p>
            <p><strong className="text-slate-300">7.4</strong> Verbindliche Zeitzusagen (z. B. für Flugverbindungen) können nicht garantiert werden. Der Auftraggeber ist für ausreichende Zeitpuffer selbst verantwortlich.</p>
          </Section>

          <Section num="8" title="Datenschutz">
            <p>Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer <Link href="/datenschutz" className="text-teal-400 hover:underline">Datenschutzerklärung</Link>, die integraler Bestandteil dieser AGB ist. Gesundheitsdaten (Krankenversicherungsdaten bei Patiententransporten) werden ausschließlich zur Abrechnung mit der gesetzlichen Krankenkasse verarbeitet und nicht zu anderen Zwecken genutzt.</p>
          </Section>

          <Section num="9" title="Anwendbares Recht und Gerichtsstand">
            <p><strong className="text-slate-300">9.1</strong> Es gilt ausschließlich das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).</p>
            <p><strong className="text-slate-300">9.2</strong> Gerichtsstand für sämtliche Streitigkeiten aus diesem Vertrag ist Kriftel (Main-Taunus-Kreis), sofern der Auftraggeber Kaufmann, eine juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen ist.</p>
          </Section>

          <Section num="10" title="Salvatorische Klausel">
            <p>Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. An die Stelle der unwirksamen Bestimmung tritt diejenige wirksame Regelung, die dem wirtschaftlichen Zweck der unwirksamen Regelung am nächsten kommt.</p>
          </Section>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
