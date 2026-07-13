import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

      <p className="mt-10 text-text-secondary">
        Der vollständige Text der Datenschutzerklärung folgt in Kürze.
      </p>
    </main>
  );
}
