"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const blobY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative mx-auto grid max-w-6xl scroll-mt-32 items-center gap-x-12 gap-y-8 overflow-hidden px-6 pt-6 pb-20 md:grid-cols-2 md:gap-y-0 md:py-28"
    >
      <motion.div
        aria-hidden
        style={{ y: blobY }}
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-float-slow rounded-full bg-sage/20 blur-3xl"
      />
      <motion.div
        aria-hidden
        style={{ y: blobY }}
        className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 animate-float-slower rounded-full bg-gold/20 blur-3xl"
      />

      <RevealItem className="order-1 md:order-1 md:col-start-1 md:row-start-1">
        <h1 className="font-serif text-4xl leading-tight text-text-primary md:text-5xl">
          Vital &amp; Frei – lebe dein bestes Leben
        </h1>
      </RevealItem>

      <motion.div
        style={{ y: photoY }}
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="order-2 -mx-4 md:order-2 md:col-start-2 md:row-start-1 md:row-span-2 md:mx-0"
      >
        <div className="aspect-square w-full overflow-hidden rounded-3xl bg-linear-to-br from-sage/20 to-gold/20">
          {/* Platzhalter: /public/hero-photo.jpg, Kunde liefert Portraitfoto */}
          <div className="flex h-full w-full items-center justify-center text-sm text-text-secondary">
            Foto folgt
          </div>
        </div>
      </motion.div>

      <RevealGroup
        className="order-3 md:order-3 md:col-start-1 md:row-start-2"
        stagger={0.15}
      >
        <RevealItem>
          <p className="text-lg text-text-secondary md:mt-6">
            Du spürst, dass mehr möglich ist. Mehr Energie. Mehr Leichtigkeit.
            Mehr Klarheit darüber, was du wirklich willst – und wie du deinen
            eigenen Weg dorthin findest.
          </p>
        </RevealItem>
        <RevealItem>
          <p className="mt-6 text-text-secondary">
            Ich bin Silke Metzinger – und ich begleite dich ein Stück auf
            diesem Weg. Mit offenem Herzen, einem ganzheitlichen Blick auf den
            Menschen und dem Vertrauen, dass Veränderung möglich ist. Ohne
            Druck. Ohne starre Konzepte. Sondern mit alltagstauglichen
            Impulsen, ehrlichen Gesprächen und einer persönlichen Begleitung –
            in deinem Tempo.
          </p>
        </RevealItem>
        <RevealItem>
          <p className="mt-6 text-text-secondary">
            Gemeinsam entdecken wir, was du wirklich brauchst, bringen
            Klarheit in deine Gedanken und schaffen Raum für neue Kraft,
            innere Ruhe und Leichtigkeit.
          </p>
        </RevealItem>
        <RevealItem>
          <motion.a
            href="#kontakt"
            whileTap={{ scale: 0.97 }}
            className="group relative mt-8 inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-sage px-8 py-3.5 font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)]"
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
            <span className="relative">
              Lass uns gemeinsam den ersten Schritt gehen
            </span>
            <ArrowRight
              aria-hidden
              className="relative h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2.25}
            />
          </motion.a>
          <p className="mt-3 text-sm text-text-secondary">
            ich freue mich darauf, dich kennenzulernen.
          </p>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
