import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ASSET_V } from "@/lib/assetVersion";

export default function About() {
  return (
    <section id="ueber-mich" className="mx-auto max-w-6xl scroll-mt-32 px-6 py-20">
      <Reveal>
        <h2 className="font-serif text-3xl text-text-primary md:text-4xl">
          Über mich
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-10 md:mt-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-12">
        <div className="md:sticky md:top-32 md:self-start">
          <Reveal direction="right">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl">
              <Image
                src={`/foto2.png?v=${ASSET_V}`}
                alt="Silke Metzinger"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <RevealGroup className="space-y-6" stagger={0.1}>
          <RevealItem>
            <p className="font-serif text-xl leading-snug text-gold md:text-2xl">
              „Meine Geschichte begann mit einer Diagnose. Meine Berufung
              begann mit der Erkenntnis, dass Gesundheit jeden Tag neu
              entsteht.“
            </p>
          </RevealItem>
          <RevealItem>
            <p className="text-text-secondary">
              Ich bin{" "}
              <strong className="text-text-primary">Silke Metzinger</strong>{" "}
              und lebe mit meinem Lebenspartner am wunderschönen Sempachersee.
              Wir sind eine Patchwork-Familie mit vier erwachsenen Kindern.
              Die Natur ist mein Kraftort und schenkt mir Ruhe, Energie und
              den perfekten Ausgleich zu meinem Alltag. Am liebsten bin ich
              draußen unterwegs – beim Schwimmen im See, auf dem
              Stand-up-Paddle, beim Joggen oder beim Tennis.
            </p>
          </RevealItem>
          <RevealItem>
            <p className="text-text-secondary">
              Im Jahr 2019 erhielt ich mit 47 Jahren die Diagnose
              Bauchspeicheldrüsenkrebs. Von einem Tag auf den anderen wurde
              mir bewusst, wie kostbar und zugleich zerbrechlich unsere
              Gesundheit ist. Diese Erfahrung hat mein Leben tief geprägt –
              aber sie definiert mich nicht. Vielmehr hat sie mir einen neuen
              Weg gezeigt.
            </p>
          </RevealItem>
          <RevealItem>
            <p className="text-text-secondary">
              Heute weiß ich: Gesundheit ist weit mehr als die Abwesenheit von
              Krankheit. Sie entsteht durch die Entscheidungen, die wir
              täglich treffen – durch eine bewusste Lebensweise, eine
              ausgewogene Ernährung, Bewegung, mentale Stärke, hochwertige
              Vitalstoffe und den achtsamen Umgang mit unserem Körper.
            </p>
          </RevealItem>
          <RevealItem>
            <p className="text-text-secondary">
              Eine besondere Kraftquelle war und ist mein Glaube an Gott. In
              den herausforderndsten Momenten haben mir das Gebet und die
              Worte aus Psalm 91 Hoffnung, Frieden und Vertrauen geschenkt.
            </p>
          </RevealItem>
          <RevealItem>
            <p className="text-text-secondary">
              Aus meiner persönlichen Erfahrung ist eine Herzensaufgabe
              entstanden: Menschen dafür zu begeistern, ihre Gesundheit
              bewusst zu stärken – nicht erst dann, wenn Beschwerden
              auftreten, sondern lange vorher.
            </p>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
