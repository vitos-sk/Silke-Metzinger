"use client";

import { Leaf, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/Reveal";

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
          <div className="mt-16 rounded-3xl bg-white/60 p-8 text-center ring-1 ring-black/5 md:p-12">
            <p className="mx-auto max-w-2xl text-text-secondary">
              Ich empfehle nur Produkte, die ich selbst kenne und aus eigener
              Erfahrung schätze. Hier geht&apos;s zu meinem Online-Shop:
            </p>
            <a
              href="https://www.lifeplus.com/SHGL5B/S/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-6 inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gold px-8 py-3.5 text-base font-medium whitespace-nowrap text-ivory shadow-[0_8px_24px_-6px_rgba(200,169,106,0.55)] ring-1 ring-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(200,169,106,0.65)]"
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
