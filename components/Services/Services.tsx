"use client";

import { Leaf, Sparkles } from "lucide-react";
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
    <section
      id="leistungen"
      className="scroll-mt-32 overflow-x-hidden bg-ivory px-6 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center font-serif text-3xl text-text-primary md:text-4xl">
            Dein Weg zu mehr Gesundheit &amp; Energie
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mx-auto mt-4 max-w-2xl text-center text-text-secondary">
            Gemeinsam schauen wir darauf, was deinem Körper gut tut und wie du
            deine Gesundheit ganzheitlich stärken kannst:
          </p>
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
                Dein Weg in ein selbstbestimmtes Leben
              </h3>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-4 text-text-secondary">
                Entdecke die Chance, Gesundheit, finanzielle Freiheit und
                Gemeinschaft neu zu definieren. Gemeinsam stärken wir:
              </p>
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
        <Reveal delay={0.1}>
          <p className="mx-auto mt-14 max-w-3xl text-center text-text-secondary">
            Denn ich bin überzeugt: Alles, was du für ein erfülltes Leben
            brauchst, trägst du bereits in dir. Manchmal braucht es nur einen
            Menschen, der an deiner Seite ist, Impulse gibt und dich darin
            bestärkt, deiner eigenen Kraft wieder zu vertrauen.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
