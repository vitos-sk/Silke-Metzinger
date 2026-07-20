"use client";

import {
  Leaf,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Tag,
  Gift,
  Heart,
  ShieldCheck,
  Lock,
  Award,
} from "lucide-react";
import { motion } from "motion/react";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/Reveal";

const SHOP_FEATURES = [
  { icon: Leaf, label: "Natürliche Vitalstoffe" },
  { icon: ShieldCheck, label: "Sorgfältig ausgewählt" },
  { icon: Heart, label: "Aus eigener Erfahrung" },
];

const TRUST_FEATURES = [
  {
    icon: Leaf,
    title: "Qualität",
    desc: "Nur natürliche Inhaltsstoffe",
    tint: "sage" as const,
  },
  {
    icon: Award,
    title: "Bewährt",
    desc: "Persönliche Erfahrung & sorgfältige Auswahl",
    tint: "gold" as const,
  },
  {
    icon: ShieldCheck,
    title: "Zuverlässig",
    desc: "Direkte Lieferung vom Hersteller",
    tint: "sage" as const,
  },
  {
    icon: Gift,
    title: "Fairer Preis",
    desc: "Faire Preise & Sonderangebote",
    tint: "gold" as const,
  },
];

const BODY_ITEMS = [
  "Mikronährstoffe & Zellgesundheit — deinen Körper optimal unterstützen und Versorgungslücken erkennen",
  "Darmgesundheit & Immunsystem — die Basis für Wohlbefinden und innere Balance stärken",
  "Stoffwechsel & Energie — neue Vitalität und Leistungsfähigkeit entwickeln",
  "Natürliche Ausstrahlung & Wohlbefinden — Gesundheit von innen nach außen sichtbar machen",
  "Prävention & Longevity — heute die Grundlage für ein gesundes, bewusstes Leben von morgen schaffen",
];

const MIND_ITEMS = [
  "Selbstbewusstsein und Vertrauen",
  "Mentale Stärke und Resilienz",
  "Persönliche Entwicklung und Entfaltung deines Potenzials",
  "Mehr Freiheit und Klarheit für deinen eigenen Lebensweg",
];

function BotanicalLeaf({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 200" fill="none" className={className}>
      <path
        d="M60 8C24 32 8 88 20 144c8 36 40 52 40 52s32-16 40-52c12-56-4-112-40-136z"
        fill="currentColor"
      />
      <path d="M60 20V190" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" />
    </svg>
  );
}

export default function Services() {
  return (
    <section id="leistungen" className="scroll-mt-32 bg-ivory px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center font-serif text-3xl text-text-primary md:text-4xl">
            Dein Weg zu mehr Gesundheit &amp; Energie
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <div>
            <Reveal>
              <h3 className="font-serif text-xl text-text-primary">
                Körper &amp; Gesundheit
              </h3>
            </Reveal>
            <RevealGroup className="mt-6 space-y-4" stagger={0.08}>
              {BODY_ITEMS.map((item) => (
                <RevealItem key={item} direction="left">
                  <div className="flex gap-3 text-text-secondary">
                    <Leaf className="mt-1 h-5 w-5 shrink-0 text-sage" />
                    <span>{item}</span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <div>
            <Reveal>
              <h3 className="font-serif text-xl text-text-primary">
                Persönliche Entwicklung
              </h3>
            </Reveal>
            <RevealGroup className="mt-6 space-y-4" stagger={0.08}>
              {MIND_ITEMS.map((item) => (
                <RevealItem key={item} direction="left">
                  <div className="flex gap-3 text-text-secondary">
                    <Sparkles className="mt-1 h-5 w-5 shrink-0 text-gold" />
                    <span>{item}</span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>

        <Reveal>
          <div className="relative mt-16 overflow-hidden rounded-3xl p-2 sm:p-10">
            <BotanicalLeaf className="pointer-events-none absolute top-0 left-0 h-28 w-16 -rotate-[25deg] text-[#a8b87c] opacity-30 sm:h-40 sm:w-24" />
            <BotanicalLeaf className="pointer-events-none absolute top-2 right-2 h-24 w-14 rotate-[35deg] text-[#c8b89a] opacity-25 sm:h-32 sm:w-[4.6rem]" />
            <BotanicalLeaf className="pointer-events-none absolute right-0 bottom-0 h-32 w-[4.6rem] rotate-[15deg] text-[#a8b87c] opacity-30 sm:h-44 sm:w-[6.4rem]" />
            <BotanicalLeaf className="pointer-events-none absolute bottom-2 left-2 h-28 w-16 -rotate-[10deg] text-[#c8b89a] opacity-25 sm:h-36 sm:w-20" />
            <BotanicalLeaf className="pointer-events-none absolute top-1/2 left-0 hidden h-24 w-14 -translate-y-1/2 rotate-[60deg] text-[#a8b87c] opacity-20 md:block" />
            <BotanicalLeaf className="pointer-events-none absolute top-1/3 right-0 hidden h-24 w-14 rotate-[-50deg] text-[#c8b89a] opacity-20 md:block" />

            <div className="relative rounded-3xl border border-white/40 bg-white/25 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-lg sm:p-8 md:p-12">
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -top-4 left-6 hidden text-gold/30 sm:block"
                animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Tag className="h-8 w-8" strokeWidth={1.5} />
              </motion.div>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute top-2 right-16 hidden text-gold/25 sm:block"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
              >
                <Sparkles className="h-6 w-6" strokeWidth={1.5} />
              </motion.div>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-3 right-8 hidden text-sage/30 sm:block"
                animate={{ y: [0, -12, 0], rotate: [0, -6, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                }}
              >
                <Gift className="h-9 w-9" strokeWidth={1.5} />
              </motion.div>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-2 left-10 hidden text-sage/25 sm:block"
                animate={{ y: [0, -9, 0], rotate: [0, 8, 0] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              >
                <Heart className="h-6 w-6" strokeWidth={1.5} />
              </motion.div>

              {/* Brand row */}
              <div className="relative mb-8 flex flex-wrap items-center justify-between gap-3 text-left sm:mb-10">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/30">
                    <ShoppingBag
                      className="h-4.5 w-4.5 text-gold"
                      strokeWidth={2}
                    />
                  </span>
                  <div className="leading-tight">
                    <p className="font-serif text-sm font-semibold text-text-primary sm:text-base">
                      LifePlus
                    </p>
                    <p className="text-[11px] text-text-secondary sm:text-xs">
                      Online-Shop
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium tracking-wide text-gold uppercase ring-1 ring-gold/25 sm:text-xs">
                  <Heart className="h-3 w-3" strokeWidth={2.25} />
                  Meine Empfehlung
                </span>
              </div>

              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-gold/30"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/40 sm:h-24 sm:w-24">
                  <ShoppingBag
                    className="h-8 w-8 text-gold sm:h-10 sm:w-10"
                    strokeWidth={2}
                  />
                </span>
                <span className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-sage text-ivory ring-2 ring-white">
                  <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </div>

              <h3 className="mx-auto max-w-2xl font-serif text-2xl leading-snug text-text-primary sm:text-3xl md:text-[2.15rem]">
                Ich empfehle nur Produkte, die ich selbst{" "}
                <span className="text-sage">kenne und schätze</span> — aus
                eigener Erfahrung
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary sm:text-base">
                Hier geht&apos;s zu meinem Online-Shop:
              </p>

              <div className="mx-auto mt-5 flex max-w-xl flex-wrap justify-center gap-2.5">
                {SHOP_FEATURES.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-medium text-text-secondary ring-1 ring-sage/20"
                  >
                    <Icon
                      className="h-3.5 w-3.5 text-sage"
                      strokeWidth={2.25}
                    />
                    {label}
                  </span>
                ))}
              </div>

              <a
                href="https://www.lifeplus.com/SHGL5B/S/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mt-7 inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gold px-8 py-3.5 text-base font-medium whitespace-nowrap text-ivory shadow-[0_8px_24px_-6px_rgba(200,169,106,0.55)] ring-1 ring-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(200,169,106,0.65)] sm:w-auto"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                />
                <ShoppingBag
                  aria-hidden
                  className="relative h-5 w-5 shrink-0"
                  strokeWidth={2.25}
                />
                <span className="relative">LifePlus Online-Shop</span>
                <ArrowRight
                  aria-hidden
                  className="relative h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2.25}
                />
              </a>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-secondary/70">
                <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                Direkt vom Hersteller – sicher &amp; einfach bestellt
              </p>

              {/* Trust strip */}
              <div className="relative mt-10 border-t border-black/5 pt-8 sm:mt-12">
                <dl className="mx-auto grid max-w-2xl grid-cols-2 gap-x-4 gap-y-7 text-left sm:grid-cols-4 sm:gap-x-6">
                  {TRUST_FEATURES.map(({ icon: Icon, title, desc, tint }) => (
                    <div key={title} className="flex items-start gap-3">
                      <span
                        className={
                          tint === "sage"
                            ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage/15 ring-1 ring-sage/30"
                            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/30"
                        }
                      >
                        <Icon
                          className={
                            tint === "sage"
                              ? "h-4.5 w-4.5 text-sage"
                              : "h-4.5 w-4.5 text-gold"
                          }
                          strokeWidth={2}
                        />
                      </span>
                      <div>
                        <dt className="text-sm font-semibold text-text-primary">
                          {title}
                        </dt>
                        <dd className="mt-0.5 text-xs text-text-secondary">
                          {desc}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
