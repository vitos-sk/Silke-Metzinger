"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ImageIcon, Leaf, X } from "lucide-react";
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

function EventModal({ event, onClose }: { event: NewsEvent; onClose: () => void }) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      >
        <motion.div
          key="dialog"
          role="dialog"
          aria-modal="true"
          aria-label={event.title}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[20px] bg-ivory shadow-xl"
        >
          <div className="relative aspect-16/10 w-full overflow-hidden bg-linear-to-br from-gold/20 to-sage/20">
            {event.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-text-secondary">
                <ImageIcon className="h-6 w-6 opacity-60" strokeWidth={1.5} />
                <span className="text-xs">Foto folgt</span>
              </div>
            )}
            {event.date && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-sage px-3 py-1 text-xs text-ivory">
                <CalendarDays className="h-3 w-3" />
                {event.date}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Schliessen"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-ivory transition-colors hover:bg-black/70"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          <div className="p-5 md:p-6">
            <h3 className="font-serif text-xl text-text-primary md:text-2xl">{event.title}</h3>
            <WavyUnderline className="mt-2 h-2.5 w-14 text-sage/40" />
            <p className="mt-3 whitespace-pre-line text-sm text-text-secondary md:text-base">
              {event.description}
            </p>
            <a
              href={event.link || "#kontakt"}
              className="mt-5 inline-block text-sm text-sage transition-opacity hover:opacity-80"
            >
              Mehr erfahren →
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

export default function EventCard({ event, index }: { event: NewsEvent; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className={`h-full cursor-pointer overflow-hidden rounded-[20px] shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-sage/10 ${CARD_TINTS[index % CARD_TINTS.length]}`}
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
          {event.date && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-sage px-3 py-1 text-xs text-ivory">
              <CalendarDays className="h-3 w-3" />
              {event.date}
            </span>
          )}
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
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-block text-sm text-sage transition-opacity hover:opacity-80"
          >
            Mehr erfahren →
          </a>
        </div>
      </motion.article>

      {isOpen && <EventModal event={event} onClose={() => setIsOpen(false)} />}
    </>
  );
}
