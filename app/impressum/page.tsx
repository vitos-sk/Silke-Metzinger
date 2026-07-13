import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
              href="mailto:info@silke-metzinger.ch"
              className="hover:text-sage"
            >
              info@silke-metzinger.ch
            </a>
          </p>
          <p>
            Telefon:{" "}
            <a href="tel:+41766303682" className="hover:text-sage">
              076 630 36 82
            </a>
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
            <a href="tel:+491734301477" className="hover:text-sage">
              0173 4301477
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
