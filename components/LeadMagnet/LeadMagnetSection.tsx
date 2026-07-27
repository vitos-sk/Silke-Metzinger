"use client";

import { useState } from "react";
import { ArrowRight, Gift } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import LeadMagnetModal from "./LeadMagnetModal";

export default function LeadMagnetSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="scroll-mt-32 px-6 py-16">
      <Reveal className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl bg-sage/8 px-6 py-10 text-center ring-1 ring-sage/20 sm:px-10 sm:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sage/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-gold/15 blur-3xl"
          />

          <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/30">
            <Gift className="h-6 w-6 text-gold" />
          </span>

          <h2 className="relative mt-5 font-serif text-2xl leading-snug text-text-primary sm:text-3xl">
            15 Reflexionsfragen für mehr Klarheit
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-text-secondary">
            Kostenlose Impulse, um innezuhalten und herauszufinden, was dir
            wirklich guttut.
          </p>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative mt-8 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-6 py-3.5 text-sm font-medium whitespace-nowrap text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)] sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
            <span className="relative">Hol dir die 15 Reflexionsfragen</span>
            <ArrowRight
              aria-hidden
              className="relative h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5"
              strokeWidth={2.25}
            />
          </button>
        </div>
      </Reveal>

      <LeadMagnetModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
