"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ASSET_V } from "@/lib/assetVersion";
import LeadMagnetModal from "./LeadMagnetModal";

const QUESTIONS = [
  "Was ist dir wirklich wichtig?",
  "Welche Werte tragen dich durchs Leben?",
  "Wo möchtest du bewusst handeln – und wo darfst du loslassen?",
];

export default function LeadMagnetSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="scroll-mt-32 px-6 py-16 sm:py-24">
      <Reveal className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-ivory ring-1 ring-sage/20">
          <Reveal>
            <div className="relative aspect-1384/420 w-full overflow-hidden">
              <Image
                src={`/foto-klarheit.png?v=${ASSET_V}`}
                alt=""
                fill
                sizes="(min-width: 896px) 896px, 100vw"
                className="object-cover"
                priority
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-ivory to-transparent sm:h-20"
              />
            </div>
          </Reveal>

          <div className="relative px-6 pb-10 sm:px-12 sm:pb-12">
            {/* Zwei Spalten: links Text + CTA, rechts die Fragen.
                Auf Mobile bleibt die Reihenfolge Titel -> Fragen -> CTA. */}
            <div className="mt-7 grid gap-8 sm:mt-8 md:grid-cols-2 md:gap-12">
              <Reveal className="md:col-start-1 md:row-start-1">
                <h2 className="font-serif text-3xl leading-snug text-text-primary sm:text-4xl">
                  15 Reflexionsfragen für{" "}
                  <span className="text-gold whitespace-nowrap">
                    mehr Klarheit
                  </span>
                </h2>
                <p className="mt-3 text-text-secondary">
                  Mehr Klarheit beginnt mit den richtigen Fragen.
                </p>
              </Reveal>

              <RevealGroup
                className="space-y-3 md:col-start-2 md:row-span-2 md:row-start-1 md:self-center"
                stagger={0.08}
              >
                {QUESTIONS.map((question) => (
                  <RevealItem key={question}>
                    <div className="flex items-start gap-3 rounded-2xl bg-ivory/80 px-4 py-3.5 shadow-sm ring-1 ring-sage/15">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span className="text-text-primary">{question}</span>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal
                delay={0.1}
                className="md:col-start-1 md:row-start-2 md:self-start"
              >
                <p className="text-text-secondary">
                  Keine To-do-Liste. Kein Leistungsdruck. Nur 15 ehrliche
                  Fragen, die dich dabei unterstützen, dich selbst besser
                  kennenzulernen.
                </p>

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="group relative mt-7 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-6 py-3.5 text-sm font-medium whitespace-nowrap text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)] sm:w-auto sm:px-10 sm:py-3.5 sm:text-base"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  />
                  <span className="relative">
                    Hol dir die 15 Reflexionsfragen
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="relative h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5"
                    strokeWidth={2.25}
                  />
                </button>

                <p className="mt-4 text-sm italic text-text-secondary">
                  Mein Tipp: Nimm dir vier Wochen Zeit und beantworte sie in
                  deinem eigenen Rhythmus.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </Reveal>

      <LeadMagnetModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
