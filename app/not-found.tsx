import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { WavyUnderline } from "@/components/Blog/decor";

/**
 * Eigene 404-Seite: Ohne sie landen Besucher auf der nackten Next-Seite ohne
 * Navigation — eine Sackgasse für Menschen wie für Suchmaschinen.
 */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-(--navbar-h)">
        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <Reveal>
              <p className="font-serif text-6xl text-sage/50 md:text-7xl">404</p>

              <h1 className="mt-6 font-serif text-3xl text-text-primary md:text-4xl">
                Diese Seite gibt es nicht
              </h1>

              <div className="mt-3 flex justify-center">
                <WavyUnderline className="h-3 w-24 text-sage/40" />
              </div>

              <p className="mt-6 text-text-secondary">
                Vielleicht wurde der Link geändert oder hat sich ein Tippfehler
                eingeschlichen. Schau dich gerne auf der Startseite oder im Blog um.
              </p>

              <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/"
                  className="group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-8 text-sm font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)] sm:text-base"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  />
                  <span className="relative">Zur Startseite</span>
                </Link>

                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-sage"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  Zum Blog
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
