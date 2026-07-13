"use client";

import { GraduationCap, HeartHandshake, Leaf, Users } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const QUALIFICATIONS = [
  {
    icon: Leaf,
    title: "Lizenzierte Ernährungsberaterin",
    tilt: "rotate-[-2deg] md:-translate-y-2",
  },
  {
    icon: HeartHandshake,
    title: "Lizenzierter Resilienzcoach",
    tilt: "rotate-[2deg] md:translate-y-6",
  },
  {
    icon: GraduationCap,
    title: "Dreijährige Ausbildung an der Lifeschool Bibelschule",
    tilt: "rotate-[-3deg] md:-translate-y-4",
  },
  {
    icon: Users,
    title: "Mehrjährige Tätigkeit im sozialen Bereich",
    tilt: "rotate-[3deg] md:translate-y-2",
  },
];

export default function Qualifications() {
  return (
    <section
      id="qualifikationen"
      className="relative scroll-mt-32 overflow-hidden px-6 py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 animate-float-slower rounded-full bg-gold/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-80 w-80 animate-float-slow rounded-full bg-sage/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center font-serif text-3xl text-text-primary md:text-4xl">
            Ausbildung &amp; Qualifikationen
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mx-auto mt-4 max-w-2xl text-center text-text-secondary">
            Fundiertes Wissen, echte Erfahrung und eine Ausbildung, die trägt.
          </p>
        </Reveal>

        <RevealGroup
          className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.1}
        >
          {QUALIFICATIONS.map(({ icon: Icon, title, tilt }, index) => (
            <RevealItem key={title}>
              <motion.div
                whileHover={{ rotate: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`relative rounded-[28px] border border-gold/25 bg-ivory p-1.5 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-gold/15 ${tilt}`}
              >
                {/* Siegel */}
                <span className="absolute -top-5 -right-5 z-10 flex h-14 w-14 rotate-[12deg] items-center justify-center rounded-full bg-gold/15 shadow-sm ring-2 ring-gold/50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-gold/60">
                    <Icon className="h-5 w-5 text-gold" />
                  </span>
                </span>

                <div className="relative rounded-3xl border border-gold/40 py-8 pl-6 pr-8 shadow-[inset_0_0_40px_rgba(200,169,106,0.10)]">
                  <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-gold/70">
                    Zertifikat Nº {String(index + 1).padStart(2, "0")}
                  </p>

                  <p className="mt-3 hyphens-auto break-words font-script text-xl italic leading-snug text-text-primary md:text-2xl">
                    {title}
                  </p>

                  <svg
                    aria-hidden
                    viewBox="0 0 200 12"
                    className="mt-4 h-3 w-24 text-gold/50"
                    fill="none"
                  >
                    <path
                      d="M2 8c14-10 24 8 38 0s24-8 38 0 24 8 38 0 24-8 38 0 24 8 38 0"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
