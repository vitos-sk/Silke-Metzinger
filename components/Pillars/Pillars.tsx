import { Reveal } from "@/components/motion/Reveal";

const PILLARS: {
  index: string;
  title: string;
  text: string;
  quote: string;
  accent: "sage" | "gold";
}[] = [
  {
    index: "01",
    title: "VITAL",
    text: "Dein Körper ist dein Zuhause. Wenn er in seiner Kraft ist, spürst du es überall – in deiner Energie, deiner Ausstrahlung, deinem Alltag.\n\nGemeinsam finden wir heraus, was deinen Körper wirklich nährt und stärkt. Kein Verzicht. Keine Diät. Kein Stress. Sondern ein Weg, der zu dir und deinem Leben passt.",
    quote: "„Wenn du dich von innen stark fühlst, strahlt das nach außen.“",
    accent: "sage",
  },
  {
    index: "02",
    title: "FREI",
    text: "Frei sein bedeutet nicht, alles perfekt zu machen. Es bedeutet, aufzuhören, dich ständig zu fragen: Mache ich es richtig? Was soll ich wählen? Wo fange ich an?\n\nGemeinsam bringen wir Klarheit in das Gedankenchaos – mit einfachen Schritten, die sich gut anfühlen und wirklich in deinen Alltag passen.",
    quote: "„Freiheit beginnt im Kopf – und zeigt sich im Leben.“",
    accent: "gold",
  },
  {
    index: "03",
    title: "LEBE DEIN BESTES LEBEN",
    text: "Dein bestes Leben wartet nicht bis irgendwann. Es beginnt mit dem nächsten Schritt – genau dort, wo du heute stehst.\n\nIch begleite dich persönlich und in deinem eigenen Tempo. Als der Mensch, der du wirklich bist.",
    quote: "„Dein Leben. Dein Tempo. Dein Weg.“",
    accent: "sage",
  },
];

export default function Pillars() {
  return (
    <section id="pillars" className="mx-auto max-w-6xl scroll-mt-32 px-6 py-20">
      <div className="divide-y divide-sage/15">
        {PILLARS.map(({ index, title, text, quote, accent }, i) => {
          const reversed = i % 2 === 1;
          return (
            <div
              key={title}
              className="grid gap-6 py-14 first:pt-0 last:pb-0 md:grid-cols-[1fr_1.3fr] md:gap-16 md:items-baseline"
            >
              <Reveal
                direction={reversed ? "right" : "left"}
                className={reversed ? "md:order-2" : ""}
              >
                <p className="font-serif text-sm tracking-[0.3em] text-text-secondary/60">
                  {index}
                </p>
                <h3
                  className={`mt-3 font-serif text-4xl uppercase leading-[1.05] tracking-wide md:text-5xl ${
                    accent === "sage" ? "text-sage" : "text-gold"
                  }`}
                >
                  {title}
                </h3>
              </Reveal>

              <Reveal
                direction={reversed ? "left" : "right"}
                className={reversed ? "md:order-1" : ""}
                delay={0.1}
              >
                <p className="whitespace-pre-line text-lg text-text-secondary">
                  {text}
                </p>
                <p className="mt-6 font-serif text-xl italic text-gold">
                  {quote}
                </p>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
