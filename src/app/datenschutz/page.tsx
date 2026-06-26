import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung – QB Mietwagen',
  robots: { index: false },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">{title}</h2>
      <div className="space-y-3 text-slate-400 leading-relaxed">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold text-slate-300 mb-1">{title}</p>
      {children}
    </div>
  );
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <SiteHeader />

      <main className="relative flex-1 max-w-3xl mx-auto w-full px-6 py-12 z-10">
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-400 transition-colors mb-8">
          <ChevronLeft className="w-3.5 h-3.5" /> Zurück zur Startseite
        </Link>

        <h1 className="text-2xl font-black text-white mb-2 pb-4 border-b border-slate-800">Datenschutzerklärung</h1>
        <p className="text-xs text-slate-500 mb-8">Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</p>

        <div className="space-y-8 text-sm">

          <Section title="1. Verantwortlicher (Art. 13 DSGVO)">
            <p>Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
            <div className="mt-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 space-y-0.5">
              <p className="font-semibold text-white">QB Mietwagen – [VORNAME NACHNAME]</p>
              <p>[STRASSE HAUSNUMMER]</p>
              <p>[PLZ] [ORT]</p>
              <p>Telefon: <a href="tel:+49XXXXXXXXXX" className="text-teal-400 hover:underline">+49 (0) XXX XXXXXXX</a></p>
              <p>E-Mail: <a href="mailto:datenschutz@qbmw.de" className="text-teal-400 hover:underline">datenschutz@qbmw.de</a></p>
            </div>
          </Section>

          <Section title="2. Erhobene Daten und Verarbeitungszwecke">
            <SubSection title="2.1 Buchungsformular">
              <p>Wenn Sie über unser Online-Buchungsformular eine Fahrt anfragen, erheben wir die folgenden personenbezogenen Daten:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Name und Vorname</li>
                <li>Telefonnummer</li>
                <li>E-Mail-Adresse (optional)</li>
                <li>Abholadresse und Zieladresse</li>
                <li>Gewünschtes Abfahrtsdatum und -uhrzeit</li>
                <li>Fahrzeugklasse und Zahlungsart</li>
                <li>Bei Geschäftskunden: Firmenname</li>
                <li>Bei Patienten: Angaben zur Krankenversicherung (siehe Abschnitt 3)</li>
              </ul>
              <p className="mt-2"><span className="text-slate-300 font-medium">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung und -erfüllung). Die Angabe ist zur Durchführung der Buchung erforderlich.</p>
            </SubSection>

            <SubSection title="2.2 Routenberechnung – Google Maps Distance Matrix API">
              <p>
                Zur serverseitigen Berechnung des Fahrpreises übermitteln wir Ihre Abholadresse und Zieladresse an die <strong className="text-slate-300">Google Distance Matrix API</strong> (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA). Die Übermittlung erfolgt ausschließlich serverseitig über unseren gesicherten Route-Handler – Ihre IP-Adresse wird dabei nicht an Google weitergegeben.
              </p>
              <p className="mt-1">Google LLC ist unter dem EU-US Data Privacy Framework (DPF) zertifiziert. Darüber hinaus haben wir mit Google Standardvertragsklauseln (SCCs) gemäß Art. 46 Abs. 2 lit. c DSGVO vereinbart. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">policies.google.com/privacy</a>.</p>
              <p className="mt-1"><span className="text-slate-300 font-medium">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung – Preisberechnung).</p>
            </SubSection>

            <SubSection title="2.3 Datenspeicherung – Supabase">
              <p>
                Ihre Buchungsdaten werden in einer Datenbank gespeichert, die von <strong className="text-slate-300">Supabase Inc.</strong> (970 Trestle Glen Rd, Oakland, CA 94610, USA) als Auftragsverarbeiter gemäß Art. 28 DSGVO betrieben wird. Mit Supabase besteht ein gültiger Auftragsverarbeitungsvertrag (AVV). Die Datenübertragung in die USA erfolgt auf Grundlage von Standardvertragsklauseln (SCCs). Supabase speichert Daten bevorzugt in EU-Rechenzentren (AWS Frankfurt). Weitere Informationen: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">supabase.com/privacy</a>.
              </p>
              <p className="mt-1"><span className="text-slate-300 font-medium">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
            </SubSection>

            <SubSection title="2.4 E-Mail-Benachrichtigungen – Resend">
              <p>
                Zur internen Benachrichtigung über neue Buchungsanfragen nutzen wir den E-Mail-Dienst <strong className="text-slate-300">Resend</strong> (Resend, Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA) als Auftragsverarbeiter. Resend erhält hierbei Namen, Telefonnummer und die Buchungsdetails zur Weitergabe an uns als Unternehmer. Mit Resend besteht ein AVV; die Datenübertragung erfolgt über SCCs. Weitere Informationen: <a href="https://resend.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">resend.com/privacy-policy</a>.
              </p>
              <p className="mt-1"><span className="text-slate-300 font-medium">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der zuverlässigen Auftragsbearbeitung).</p>
            </SubSection>
          </Section>

          <Section title="3. Besondere Kategorien personenbezogener Daten – Gesundheitsdaten (Art. 9 DSGVO)">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
              <p className="text-slate-300">
                Im Rahmen von Patiententransporten erheben wir optional Angaben zu Ihrer Krankenversicherung (Kassenname und Versicherungsnummer). Diese Daten stellen <strong>besondere Kategorien personenbezogener Daten gemäß Art. 9 Abs. 1 DSGVO</strong> dar (Gesundheitsdaten), da sie einen Rückschluss auf Ihren Gesundheitszustand zulassen.
              </p>
              <p>
                Die Verarbeitung erfolgt ausschließlich zur direkten Abrechnung der Fahrtkosten mit Ihrer gesetzlichen Krankenversicherung gemäß dem von Ihrem Arzt ausgestellten Transportschein (Muster 4).
              </p>
              <p><span className="text-slate-300 font-medium">Rechtsgrundlage:</span> Art. 9 Abs. 2 lit. h DSGVO (Gesundheitsversorgung und Verwaltung von Systemen und Diensten im Gesundheitsbereich) in Verbindung mit § 22 Abs. 1 Nr. 1 lit. b BDSG sowie Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
              <p>Die Krankenversicherungsdaten werden ausschließlich für die Abrechnungsabwicklung mit Ihrer Krankenkasse genutzt und nicht zu anderen Zwecken verarbeitet. Die Daten werden nach Abschluss der Abrechnung nach den gesetzlichen Aufbewahrungsfristen (10 Jahre gemäß § 147 AO) gelöscht.</p>
            </div>
          </Section>

          <Section title="4. Datenweitergabe an Dritte">
            <p>Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt nur in folgenden Fällen:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong className="text-slate-300">Krankenversicherungen:</strong> Ihre Krankenversicherungsdaten werden an Ihre gesetzliche Krankenkasse zur Fahrtkostenerstattung übermittelt, sofern ein ärztlich ausgestellter Transportschein (Muster 4) vorliegt.</li>
              <li><strong className="text-slate-300">Auftragsverarbeiter:</strong> Supabase (Datenspeicherung), Google LLC (Routenberechnung) und Resend (E-Mail-Versand) – jeweils auf Basis eines AVV (Art. 28 DSGVO).</li>
              <li><strong className="text-slate-300">Gesetzliche Verpflichtung:</strong> Bei behördlichen Anfragen oder gesetzlicher Verpflichtung.</li>
            </ul>
            <p>Eine Weitergabe zu Werbezwecken oder an sonstige Dritte findet nicht statt.</p>
          </Section>

          <Section title="5. Speicherdauer">
            <p>Ihre Buchungsdaten werden für die Dauer der Geschäftsbeziehung und darüber hinaus entsprechend den gesetzlichen Aufbewahrungsfristen gespeichert:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong className="text-slate-300">Steuerrechtliche Unterlagen:</strong> 10 Jahre (§ 147 AO)</li>
              <li><strong className="text-slate-300">Handelsrechtliche Unterlagen:</strong> 6 Jahre (§ 257 HGB)</li>
              <li><strong className="text-slate-300">Krankenversicherungsdaten:</strong> 10 Jahre nach Abschluss der Abrechnung</li>
            </ul>
            <p>Nach Ablauf der jeweiligen Frist werden die Daten routinemäßig gelöscht.</p>
          </Section>

          <Section title="6. Ihre Rechte als betroffene Person (Art. 15–22 DSGVO)">
            <p>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong className="text-slate-300">Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können Auskunft über die zu Ihrer Person gespeicherten Daten verlangen.</li>
              <li><strong className="text-slate-300">Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie können die Berichtigung unrichtiger Daten verlangen.</li>
              <li><strong className="text-slate-300">Löschungsrecht (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
              <li><strong className="text-slate-300">Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO).</strong></li>
              <li><strong className="text-slate-300">Recht auf Datenübertragbarkeit (Art. 20 DSGVO).</strong></li>
              <li><strong className="text-slate-300">Widerspruchsrecht (Art. 21 DSGVO):</strong> Soweit die Verarbeitung auf einem berechtigten Interesse beruht, können Sie Widerspruch einlegen.</li>
              <li><strong className="text-slate-300">Widerrufsrecht bei Einwilligung (Art. 7 Abs. 3 DSGVO):</strong> Erteilte Einwilligungen können Sie jederzeit ohne Nachteile widerrufen.</li>
            </ul>
            <p>Zur Ausübung Ihrer Rechte wenden Sie sich an: <a href="mailto:datenschutz@qbmw.de" className="text-teal-400 hover:underline">datenschutz@qbmw.de</a></p>
          </Section>

          <Section title="7. Beschwerderecht bei der Aufsichtsbehörde (Art. 77 DSGVO)">
            <p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die für uns zuständige Aufsichtsbehörde ist:</p>
            <div className="mt-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 space-y-0.5">
              <p className="font-semibold text-white">[NAME DER ZUSTÄNDIGEN LANDESBEHÖRDE – z. B. LfDI Baden-Württemberg]</p>
              <p>[ADRESSE]</p>
              <p>Website: <a href="#" className="text-teal-400 hover:underline">[URL DER BEHÖRDE]</a></p>
            </div>
          </Section>

          <Section title="8. Keine Pflicht zur Bereitstellung – Folgen der Nichtbereitstellung">
            <p>Die Bereitstellung Ihrer personenbezogenen Daten für die Buchung ist vertraglich erforderlich. Ohne die Angabe der Pflichtfelder (Name, Telefon, Adressen, Datum) ist eine Buchung technisch nicht möglich.</p>
          </Section>

          <Section title="9. Keine automatisierte Entscheidungsfindung">
            <p>Wir nutzen keine automatisierten Entscheidungsverfahren oder Profiling im Sinne von Art. 22 DSGVO.</p>
          </Section>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
