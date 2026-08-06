import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-sage/8 px-6 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-0 h-72 w-72 animate-float-slow rounded-full bg-sage/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 animate-float-slower rounded-full bg-gold/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="font-serif text-2xl leading-snug text-text-primary sm:text-3xl">
            Vielleicht ist jetzt genau der Moment, an dem du spürst, dass mehr
            möglich ist.
          </p>
          <p className="mt-4 font-serif text-xl text-gold sm:text-2xl">
            Mehr Gesundheit. Mehr Energie. Mehr Selbstbestimmung. Mehr
            finanzielle Freiheit.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 text-text-secondary">
            Wenn du bereit bist, alte Muster zu hinterfragen und neue Wege zu
            gehen, begleite ich dich gerne dabei, deine Ziele mit Klarheit und
            Vertrauen anzugehen. Lass uns in einem kostenlosen
            Kennenlerngespräch herausfinden, wo du gerade stehst und welche
            nächsten Schritte dich deinem Wunschleben näherbringen.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <a
            href="#kontakt"
            className="group relative mt-8 inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-sage px-5 py-2.5 text-[13px] font-medium whitespace-nowrap text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)] sm:gap-2 sm:px-10 sm:py-3.5 sm:text-base"
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
            <span className="relative">Kostenloses Kennenlerngespräch</span>
            <ArrowRight
              aria-hidden
              className="relative h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5"
              strokeWidth={2.25}
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
