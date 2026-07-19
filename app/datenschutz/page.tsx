import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CopyableNumber } from "@/components/ui/CopyableNumber";

export const metadata: Metadata = {
  title: "Datenschutz – Silke Metzinger",
};

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-sage"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Startseite
      </Link>

      <h1 className="mt-8 font-serif text-3xl text-text-primary md:text-4xl">
        Datenschutzerklärung
      </h1>

      <div className="mt-10 space-y-10 text-text-secondary">
        <section>
          <h2 className="font-serif text-lg text-text-primary">
            1. Verantwortlicher
          </h2>
          <p className="mt-2">
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
          </p>
          <p className="mt-3">
            Silke Metzinger
            <br />
            Coach, Mentorin, Ernährungsberatung, Seelsorge, Kurse (Freiberuflerin)
          </p>
          <p className="mt-3">
            Schweiz: Luzernerstr. 17b, 6204 Hildisrieden
            <br />
            Deutschland: Falkensteinerstrasse 1, 79369 Wyhl
          </p>
          <p className="mt-3">
            E-Mail:{" "}
            <a
              href="mailto:info.silke-metzinger@gmx.ch"
              className="hover:text-sage"
            >
              info.silke-metzinger@gmx.ch
            </a>
            <br />
            Telefon (Schweiz):{" "}
            <CopyableNumber
              value="076 630 36 82"
              href="tel:+41766303682"
              label="Telefonnummer Schweiz"
            />
            <br />
            Telefon (Deutschland):{" "}
            <CopyableNumber
              value="0173 4301477"
              href="tel:+491734301477"
              label="Telefonnummer Deutschland"
            />
          </p>
          <p className="mt-3 text-sm">
            Weitere Angaben finden Sie im{" "}
            <Link href="/impressum" className="underline hover:text-sage">
              Impressum
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">
            2. Allgemeines zur Datenverarbeitung
          </h2>
          <p className="mt-2">
            Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich
            nur, soweit dies zur Bereitstellung einer funktionsfähigen Website
            sowie unserer Inhalte und Leistungen erforderlich ist. Die
            Verarbeitung personenbezogener Daten erfolgt regelmässig nur nach
            Einwilligung der Nutzer oder auf Grundlage eines berechtigten
            Interesses (Art. 6 Abs. 1 lit. a bzw. f DSGVO). Für Nutzerinnen und
            Nutzer aus der Schweiz gelten zusätzlich die Bestimmungen des
            Schweizer Datenschutzgesetzes (DSG).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">
            3. Ihre Rechte
          </h2>
          <p className="mt-2">Ihnen stehen grundsätzlich die Rechte auf:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Auskunft über Ihre bei uns gespeicherten Daten,</li>
            <li>Berichtigung unrichtiger Daten,</li>
            <li>Löschung Ihrer bei uns gespeicherten Daten,</li>
            <li>Einschränkung der Datenverarbeitung,</li>
            <li>Widerspruch gegen die Verarbeitung sowie</li>
            <li>Datenübertragbarkeit</li>
          </ul>
          <p className="mt-3">
            zu. Zudem haben Sie das Recht, sich bei einer
            Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
            personenbezogenen Daten durch uns zu beschweren.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">
            4. Hosting und Server-Logfiles
          </h2>
          <p className="mt-2">
            Diese Website wird bei Vercel Inc. (340 S Lemon Ave #4133, Walnut,
            CA 91789, USA) gehostet. Beim Aufruf der Website erfasst Vercel
            automatisch technische Zugriffsdaten (sogenannte Server-Logfiles),
            zum Beispiel IP-Adresse, Datum und Uhrzeit des Zugriffs,
            aufgerufene Seite, Browsertyp und Betriebssystem. Diese Daten
            werden zur Sicherstellung eines störungsfreien Betriebs sowie zur
            Verbesserung unseres Angebots verarbeitet (Art. 6 Abs. 1 lit. f
            DSGVO). Eine Übermittlung in die USA kann dabei nicht
            ausgeschlossen werden; Vercel verweist hierzu auf entsprechende
            Standardvertragsklauseln als Garantie eines angemessenen
            Datenschutzniveaus.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">
            5. SSL-/TLS-Verschlüsselung
          </h2>
          <p className="mt-2">
            Diese Seite nutzt aus Sicherheitsgründen eine SSL-/TLS-
            Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie
            daran, dass die Adresszeile des Browsers von „http://“ auf
            „https://“ wechselt.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">
            6. Kontaktformular
          </h2>
          <p className="mt-2">
            Wenn Sie uns über das Kontaktformular eine Anfrage senden, werden
            Ihre Angaben aus dem Formular (Vorname, Nachname, E-Mail-Adresse,
            Nachricht) zum Zweck der Bearbeitung Ihrer Anfrage sowie für den
            Fall von Anschlussfragen bei uns gespeichert. Die Verarbeitung
            erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a
            DSGVO), die Sie durch Absenden des Formulars erteilen, sowie zur
            Bearbeitung vorvertraglicher Anfragen (Art. 6 Abs. 1 lit. b
            DSGVO). Der Versand der Formulardaten per E-Mail erfolgt über den
            Dienst Resend (Resend, Inc., USA), der als Auftragsverarbeiter für
            uns tätig wird. Ihre Daten werden gelöscht, sobald sie für die
            Erreichung des Zwecks ihrer Erhebung nicht mehr erforderlich sind,
            spätestens nach Abschluss der Kommunikation, sofern keine
            gesetzlichen Aufbewahrungspflichten entgegenstehen. Sie können
            Ihre Einwilligung jederzeit mit Wirkung für die Zukunft per E-Mail
            an uns widerrufen.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">7. Cookies</h2>
          <p className="mt-2">
            Auf den öffentlichen Seiten dieser Website werden keine Cookies
            zu Analyse- oder Marketingzwecken eingesetzt. Technisch notwendige
            Cookies kommen ausschliesslich im passwortgeschützten
            Administrationsbereich der Website zum Einsatz und betreffen
            keine Besucherinnen und Besucher der öffentlichen Seiten.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">
            8. Schriftarten (Google Fonts)
          </h2>
          <p className="mt-2">
            Diese Website nutzt zur einheitlichen Darstellung von Schriften
            sogenannte Google Fonts. Die Schriftarten werden bereits beim
            Erstellen der Website lokal auf unseren eigenen Server
            eingebunden. Es findet beim Besuch dieser Website keine
            Verbindung zu Servern von Google statt, es werden keine Daten an
            Google übermittelt.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">
            9. Social-Media-Links
          </h2>
          <p className="mt-2">
            Auf dieser Website finden Sie Links zu unseren Profilen bei
            Facebook und Instagram. Es handelt sich hierbei um einfache
            Verweise (Links) auf die jeweiligen Plattformen, nicht um
            eingebundene Social-Plugins. Beim blossen Besuch dieser Website
            werden dadurch keine Daten an die jeweiligen Anbieter übertragen.
            Erst wenn Sie aktiv auf einen der Links klicken, werden Sie auf
            die entsprechende Plattform weitergeleitet, für die dann die
            Datenschutzbestimmungen des jeweiligen Anbieters gelten.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">
            10. Änderung dieser Datenschutzerklärung
          </h2>
          <p className="mt-2">
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen,
            damit sie stets den aktuellen rechtlichen Anforderungen entspricht
            oder um Änderungen unserer Leistungen umzusetzen. Für Ihren
            erneuten Besuch gilt dann die neue Datenschutzerklärung.
          </p>
        </section>
      </div>
    </main>
  );
}
