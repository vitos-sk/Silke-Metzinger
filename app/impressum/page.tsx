import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CopyableNumber } from "@/components/ui/CopyableNumber";

export const metadata: Metadata = {
  title: "Impressum – Silke Metzinger",
};

export default function ImpressumPage() {
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
        Impressum
      </h1>

      <div className="mt-10 space-y-8 text-text-secondary">
        <section>
          <h2 className="font-serif text-lg text-text-primary">
            Silke Metzinger
          </h2>
          <p className="mt-2">
            Coach, Mentorin, Ernährungsberatung, Seelsorge, Kurse
            (Freiberuflerin)
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">Schweiz</h2>
          <p className="mt-2">Luzernerstr. 17b</p>
          <p>6204 Hildisrieden</p>
          <p className="mt-2">
            E-Mail:{" "}
            <a
              href="mailto:info.silke-metzinger@gmx.ch"
              className="hover:text-sage"
            >
              info.silke-metzinger@gmx.ch
            </a>
          </p>
          <p>
            Telefon:{" "}
            <CopyableNumber
              value="076 630 36 82"
              href="tel:+41766303682"
              label="Telefonnummer Schweiz"
            />
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">
            Deutschland
          </h2>
          <p className="mt-2">Falkensteinerstrasse 1</p>
          <p>79369 Wyhl</p>
          <p className="mt-2">
            Telefon:{" "}
            <CopyableNumber
              value="0173 4301477"
              href="tel:+491734301477"
              label="Telefonnummer Deutschland"
            />
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">
            Haftung für Inhalte
          </h2>
          <p className="mt-2">
            Als Diensteanbieterin bin ich gemäss den allgemeinen Gesetzen für
            eigene Inhalte auf diesen Seiten verantwortlich. Eine
            Verpflichtung zur Überwachung übermittelter oder gespeicherter
            fremder Informationen besteht nicht. Verpflichtungen zur
            Entfernung oder Sperrung der Nutzung von Informationen nach den
            allgemeinen Gesetzen bleiben hiervon unberührt. Eine
            diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
            Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
            entsprechender Rechtsverletzungen werde ich diese Inhalte umgehend
            entfernen.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">
            Haftung für Links
          </h2>
          <p className="mt-2">
            Dieses Angebot enthält Links zu externen Webseiten Dritter, auf
            deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für
            diese fremden Inhalte auch keine Gewähr übernehmen. Für die
            Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
            oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
            wurden zum Zeitpunkt der Verlinkung auf mögliche
            Rechtsverstösse überprüft. Rechtswidrige Inhalte waren zum
            Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente
            inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete
            Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
            Bekanntwerden von Rechtsverletzungen werde ich derartige Links
            umgehend entfernen.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-text-primary">
            Urheberrecht
          </h2>
          <p className="mt-2">
            Die durch mich erstellten Inhalte und Werke auf diesen Seiten
            unterliegen dem Urheberrecht. Vervielfältigung, Bearbeitung,
            Verbreitung und jede Art der Verwertung ausserhalb der Grenzen
            des Urheberrechtes bedürfen der schriftlichen Zustimmung. Downloads
            und Kopien dieser Seite sind nur für den privaten, nicht
            kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser
            Seite nicht von mir erstellt wurden, werden die Urheberrechte
            Dritter beachtet. Sollten Sie trotzdem auf eine
            Urheberrechtsverletzung aufmerksam werden, bitte ich um einen
            entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
            werde ich derartige Inhalte umgehend entfernen.
          </p>
        </section>
      </div>
    </main>
  );
}
