"use client";

import { motion } from "motion/react";
import { CalendarDays, ImageIcon, Leaf } from "lucide-react";
import type { NewsEvent } from "@/types/event";

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
    <svg aria-hidden viewBox="0 0 200 12" className={className} fill="none">
      <path
        d="M2 8c14-10 24 8 38 0s24-8 38 0 24 8 38 0 24-8 38 0 24 8 38 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function EventCard({ event, index }: { event: NewsEvent; index: number }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`h-full overflow-hidden rounded-[20px] shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-sage/10 ${CARD_TINTS[index % CARD_TINTS.length]}`}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-linear-to-br from-gold/20 to-sage/20">
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <>
            <HandDrawnFrame mirrored={index % 2 === 1} />
            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-text-secondary">
              <ImageIcon className="h-6 w-6 opacity-60" strokeWidth={1.5} />
              <span className="text-xs">Foto folgt</span>
            </div>
          </>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-sage px-3 py-1 text-xs text-ivory">
          <CalendarDays className="h-3 w-3" />
          {event.date}
        </span>
        <Leaf
          className="absolute right-3 top-3 h-4 w-4 rotate-12 text-gold/60"
          strokeWidth={1.5}
        />
      </div>

      <div className="p-4 md:p-5">
        <h3 className="font-serif text-base text-text-primary md:text-lg">{event.title}</h3>
        <WavyUnderline className="mt-1.5 h-2.5 w-14 text-sage/40" />
        <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{event.description}</p>
        <a
          href={event.link || "#kontakt"}
          className="mt-3 inline-block text-sm text-sage transition-opacity hover:opacity-80"
        >
          Mehr erfahren →
        </a>
      </div>
    </motion.article>
  );
}
