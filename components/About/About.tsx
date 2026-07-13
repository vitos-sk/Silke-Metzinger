"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

type ChapterId = "vorher" | "wendepunkt" | "heute" | "privat";

const CHAPTERS: { id: ChapterId; index: string; tag: string }[] = [
  { id: "vorher", index: "01", tag: "Vorher" },
  { id: "wendepunkt", index: "02", tag: "2019 · Der Wendepunkt" },
  { id: "heute", index: "03", tag: "Heute" },
  { id: "privat", index: "04", tag: "Privat" },
];

// Platzhalter-Fotos pro Kapitel: unterschiedliche Farben, damit der
// Wechsel-Effekt beim Scrollen sichtbar ist. Werden später durch
// echte Fotos vom Kunden ersetzt (ein Bild pro Kapitel).
const CHAPTER_PHOTOS: Record<ChapterId, { from: string; to: string; label: string }> = {
  vorher: { from: "from-sage/50", to: "to-sage/15", label: "Foto folgt — Vorher" },
  wendepunkt: { from: "from-gold/60", to: "to-gold/20", label: "Foto folgt — 2019" },
  heute: { from: "from-rose-300/70", to: "to-rose-100/30", label: "Foto folgt — Heute" },
  privat: { from: "from-sky-300/70", to: "to-sky-100/30", label: "Foto folgt — Privat" },
};

function Chapter({
  id,
  active,
  onActive,
  children,
}: {
  id: ChapterId;
  active: boolean;
  onActive: (id: ChapterId) => void;
  children: ReactNode;
}) {
  const chapter = CHAPTERS.find((c) => c.id === id)!;

  return (
    <motion.div
      className="relative"
      onViewportEnter={() => onActive(id)}
      viewport={{ margin: "-45% 0px -45% 0px" }}
    >
      <span
        aria-hidden
        className={`absolute -left-7 top-1.5 h-3 w-3 rounded-full ring-4 ring-ivory transition-colors duration-300 md:-left-9.75 md:h-3.5 md:w-3.5 ${
          active ? "bg-gold" : "bg-sage/40"
        }`}
      />
      <p
        className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
          active ? "text-gold" : "text-text-secondary/70"
        }`}
      >
        {chapter.index} — {chapter.tag}
      </p>
      <RevealGroup className="mt-4" stagger={0.1}>
        {children}
      </RevealGroup>
    </motion.div>
  );
}

export default function About() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>("vorher");
  const activeTag = CHAPTERS.find((c) => c.id === activeChapter)!.tag;

  return (
    <section id="ueber-mich" className="mx-auto max-w-6xl scroll-mt-32 px-6 py-20">
      <Reveal>
        <h2 className="font-serif text-3xl text-text-primary md:text-4xl">
          „Ich glaube an die Kraft der Veränderung.“
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-10 md:mt-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-12">
        <div className="md:sticky md:top-32 md:self-start">
          <Reveal direction="right">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl md:aspect-4/5">
              {/* Platzhalter: pro Kapitel ein Foto vom Kunden (z. B. /public/about-<kapitel>.jpg).
                  Die Farbflächen hier zeigen nur, dass das Bild synchron zum Scroll-Fortschritt wechselt. */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeChapter}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute inset-0 flex items-center justify-center bg-linear-to-br text-sm text-text-secondary ${CHAPTER_PHOTOS[activeChapter].from} ${CHAPTER_PHOTOS[activeChapter].to}`}
                >
                  {CHAPTER_PHOTOS[activeChapter].label}
                </motion.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/0 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 hidden md:block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeChapter}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ring-1 ring-white/25 backdrop-blur-sm ${
                      activeChapter === "wendepunkt"
                        ? "bg-gold text-ivory"
                        : "bg-black/50 text-ivory"
                    }`}
                  >
                    {activeTag}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>

        <div>
          {/* Mobiler Fortschritts-Tracker: ersetzt den Foto-Badge-Effekt,
              der auf einer einspaltigen Ansicht ohne Sticky-Foto verlorenginge. */}
          <div className="sticky top-20 z-10 -mx-6 mb-6 flex items-center justify-between gap-3 bg-ivory/95 px-6 py-3 shadow-[0_1px_0_0_rgba(143,175,138,0.25)] backdrop-blur-sm md:hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeChapter}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className={`text-xs font-medium uppercase tracking-[0.2em] ${
                  activeChapter === "wendepunkt" ? "text-gold" : "text-text-secondary"
                }`}
              >
                {activeTag}
              </motion.span>
            </AnimatePresence>
            <div className="flex shrink-0 gap-1.5">
              {CHAPTERS.map((c) => (
                <span
                  key={c.id}
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                    c.id === activeChapter ? "bg-gold" : "bg-sage/30"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-12 border-l border-sage/20 pl-6 md:gap-16 md:pl-8">
          <Chapter id="vorher" active={activeChapter === "vorher"} onActive={setActiveChapter}>
            <RevealItem>
              <p className="text-text-secondary">
                Nicht, weil das Leben immer einfach ist. Sondern weil ich
                erlebt habe, dass selbst herausfordernde Zeiten neue
                Möglichkeiten eröffnen können.
              </p>
            </RevealItem>
            <RevealItem>
              <p className="mt-4 text-text-secondary">
                Ich bin{" "}
                <strong className="text-text-primary">Silke Metzinger</strong>{" "}
                und begleite Menschen, die tief in sich spüren, dass ihr Leben
                leichter, gesünder und freier sein darf.
              </p>
            </RevealItem>
            <RevealItem>
              <p className="mt-4 text-text-secondary">
                Ich höre zu. Ich stelle Fragen. Ich eröffne neue Perspektiven.
              </p>
            </RevealItem>
          </Chapter>

          <Chapter
            id="wendepunkt"
            active={activeChapter === "wendepunkt"}
            onActive={setActiveChapter}
          >
            <RevealItem>
              <div className="rounded-3xl bg-ivory p-6 ring-1 ring-gold/20 md:p-8">
                <p className="text-text-secondary">
                  Warum mir Gesundheit, Zeit und Freiheit am Herzen liegen:
                </p>
                <p className="mt-6 text-text-secondary">
                  Manchmal verändert ein einziger Moment ein ganzes Leben.
                  Dieser kam 2019, als ich mit 47 Jahren die Diagnose
                  Bauchspeicheldrüsenkrebs erhielt. Plötzlich war nichts mehr
                  selbstverständlich. Angst, Zweifel und Ungewissheit wurden
                  meine Begleiter – aber tief in mir war diese eine Stimme:
                </p>
                <p className="mt-6 font-serif text-xl text-gold md:text-3xl">
                  „Ich gebe nicht auf.“
                </p>
                <p className="mt-6 text-text-secondary">
                  Mein Weg war geprägt von Operationen, Therapien, Hoffnung,
                  aber auch von Angst, Tränen und vielen Momenten des
                  Zweifelns. Mut bedeutet nicht, keine Angst zu haben. Mut
                  bedeutet, trotz der Angst weiterzugehen.
                </p>
                <p className="mt-6 text-text-secondary">
                  Mein Glaube an Gott und die Worte aus Psalm 91 waren eine
                  wichtige Kraftquelle.
                </p>
              </div>
            </RevealItem>
          </Chapter>

          <Chapter id="heute" active={activeChapter === "heute"} onActive={setActiveChapter}>
            <RevealItem>
              <p className="text-text-secondary">
                Diese Erfahrung hat meine Sicht auf Gesundheit für immer
                verändert. Heute ist es meine Herzensaufgabe, Menschen auf
                ihrem Weg zu mehr Gesundheit, Lebensfreude, innerer Balance und
                neuen Möglichkeiten zu begleiten. Nicht aus Theorie, sondern
                aus eigener Erfahrung.
              </p>
            </RevealItem>
          </Chapter>

          <Chapter id="privat" active={activeChapter === "privat"} onActive={setActiveChapter}>
            <RevealItem>
              <p className="text-text-secondary">
                Ich lebe mit meinem Lebenspartner am wunderschönen
                Sempachersee. Wir sind eine Patchwork-Familie mit vier
                erwachsenen Kindern. Die Natur ist mein Kraftort – beim
                Schwimmen im See, auf dem Stand-up-Paddle, beim Joggen oder
                beim Tennis.
              </p>
            </RevealItem>
          </Chapter>
          </div>
        </div>
      </div>
    </section>
  );
}
