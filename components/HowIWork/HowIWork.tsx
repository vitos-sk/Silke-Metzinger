import { Ear, HeartHandshake, TrendingUp } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const STEPS = [
  {
    icon: Ear,
    title: "Zuhören",
    text: "Ich höre zu, bevor ich Empfehlungen gebe.",
  },
  {
    icon: HeartHandshake,
    title: "Begleiten",
    text: "Meine Begleitung endet nicht mit einer ersten Analyse. Ich bin an deiner Seite, beantworte deine Fragen und unterstütze dich dabei, deinen Körper besser zu verstehen.",
  },
  {
    icon: TrendingUp,
    title: "Stärken",
    text: "Mein Ziel ist es, deine Eigenverantwortung zu stärken – nicht sie zu ersetzen.",
  },
];

export default function HowIWork() {
  return (
    <section
      id="wie-ich-arbeite"
      className="relative scroll-mt-32 overflow-hidden bg-ivory px-6 py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 animate-float-slow rounded-full bg-sage/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 animate-float-slower rounded-full bg-gold/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center font-serif text-3xl text-text-primary md:text-4xl">
            Wie ich arbeite
          </h2>
        </Reveal>

        <div className="mx-auto mt-8 max-w-3xl space-y-4 text-center text-text-secondary">
          <Reveal delay={0.05}>
            <p>
              Gesundheit ist so individuell wie der Mensch selbst. Deshalb
              glaube ich nicht an Standardlösungen, sondern an eine
              persönliche Begleitung, die dich dort abholt, wo du gerade
              stehst.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              Ich verbinde fundiertes Wissen über Mikronährstoffe mit meiner
              eigenen Erfahrung und einem ganzheitlichen Blick auf deine
              Bedürfnisse. Dabei steht nicht ein Produkt im Mittelpunkt –
              sondern du.
            </p>
          </Reveal>
        </div>

        <RevealGroup
          className="mx-auto mt-16 max-w-2xl"
          stagger={0.15}
        >
          {STEPS.map(({ icon: Icon, title, text }, index) => {
            const isLast = index === STEPS.length - 1;
            return (
              <RevealItem key={title} direction="left">
                <div className={`flex gap-6 ${isLast ? "" : "min-h-40"}`}>
                  <div className="flex flex-col items-center self-stretch">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sage shadow-sm ring-4 ring-ivory">
                      <Icon className="h-7 w-7 text-ivory" />
                    </div>
                    {!isLast && (
                      <span
                        aria-hidden
                        className="mt-2 w-px flex-1 bg-linear-to-b from-sage/40 to-gold/40"
                      />
                    )}
                  </div>

                  <div className="pt-1">
                    <p className="font-serif text-sm uppercase tracking-[0.25em] text-gold">
                      {index + 1}. {title}
                    </p>
                    <p className="mt-3 max-w-lg text-lg text-text-secondary">
                      {text}
                    </p>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
