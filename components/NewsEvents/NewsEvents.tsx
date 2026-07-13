"use client";

import { motion } from "motion/react";
import { CalendarDays, ImageIcon, Leaf } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const PLACEHOLDER_EVENTS = [1, 2, 3];

const CARD_TINTS = ["bg-gold/6", "bg-sage/6", "bg-gold/6"];

function HandDrawnFrame({ mirrored }: { mirrored?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 160 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full text-gold/45 ${
        mirrored ? "-scale-x-100" : ""
      }`}
      fill="none"
    >
      <path
        d="M14,5 C40,2 90,7 146,4 C152,10 150,40 154,70 C156,85 150,93 146,95 C100,98 50,93 12,96 C6,90 8,60 5,35 C3,20 8,10 14,5 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WavyUnderline({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 12"
      className={className}
      fill="none"
    >
      <path
        d="M2 8c14-10 24 8 38 0s24-8 38 0 24 8 38 0 24-8 38 0 24 8 38 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SectionDivider({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${
        position === "top" ? "top-0" : "bottom-0"
      } flex items-center justify-center`}
    >
      <div className="h-px w-full bg-linear-to-r from-transparent via-gold/35 to-transparent" />
      <span className="absolute h-1.5 w-1.5 rotate-45 bg-gold/50" />
    </div>
  );
}

export default function NewsEvents() {
  return (
    <section id="news-events" className="relative scroll-mt-32 bg-sage/5 px-6 py-16 md:py-20">
      <SectionDivider position="top" />
      <SectionDivider position="bottom" />

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center font-serif text-3xl text-text-primary md:text-4xl">
            News &amp; Events
          </h2>
        </Reveal>

        <RevealGroup
          className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 md:grid-cols-3 md:gap-6"
          stagger={0.12}
        >
          {PLACEHOLDER_EVENTS.map((item, index) => (
            <RevealItem key={item}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`h-full overflow-hidden rounded-[20px] shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-sage/10 ${CARD_TINTS[index % CARD_TINTS.length]}`}
              >
                {/* Platzhalter: Event-Foto, sobald verfügbar */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-linear-to-br from-gold/20 to-sage/20">
                  <HandDrawnFrame mirrored={index % 2 === 1} />
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-text-secondary">
                    <ImageIcon className="h-6 w-6 opacity-60" strokeWidth={1.5} />
                    <span className="text-xs">Foto folgt</span>
                  </div>
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-sage px-3 py-1 text-xs text-ivory">
                    <CalendarDays className="h-3 w-3" />
                    Datum folgt
                  </span>
                  <Leaf
                    className="absolute right-3 top-3 h-4 w-4 rotate-12 text-gold/60"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="p-4 md:p-5">
                  <h3 className="font-serif text-base text-text-primary md:text-lg">
                    Titel folgt
                  </h3>
                  <WavyUnderline className="mt-1.5 h-2.5 w-14 text-sage/40" />
                  <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
                    Kurzbeschreibung folgt.
                  </p>
                  <a
                    href="#kontakt"
                    className="mt-3 inline-block text-sm text-sage transition-opacity hover:opacity-80"
                  >
                    Mehr erfahren →
                  </a>
                </div>
              </motion.article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
