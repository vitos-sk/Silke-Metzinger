"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "up" | "left" | "right" | "none";

// Der horizontale Versatz bleibt <= dem Seitenrand (px-6 = 24px), damit die
// Elemente während der Animation nicht über den Viewport hinausragen und so
// keinen horizontalen Scrollbereich erzeugen.
const OFFSETS: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 32 },
  left: { x: -24 },
  right: { x: 24 },
  none: {},
};

function buildVariants(direction: Direction): Variants {
  const offset = OFFSETS[direction];
  return {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

/**
 * Auslöser für die Einblend-Animation.
 *
 * Der Inhalt startet unsichtbar — deshalb darf das Aufdecken nie ausfallen.
 * `useInView` allein genügt dafür nicht: liegt ein Element beim Laden bereits
 * im sichtbaren Bereich, meldet der IntersectionObserver je nach Situation
 * (Hintergrund-Tab, wiederhergestellte Sitzung, In-App-Browser) nichts — der
 * Block bliebe dann dauerhaft leer. Darum prüfen wir nach dem Mounten
 * zusätzlich selbst, ob das Element im sichtbaren Bereich liegt.
 */
function useRevealed<T extends HTMLElement>(amount: number) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount });
  const [visibleOnScreen, setVisibleOnScreen] = useState(false);

  useEffect(() => {
    let done = false;

    function check() {
      const element = ref.current;
      if (done || !element) return;
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        done = true;
        setVisibleOnScreen(true);
      }
    }

    check();
    // Zweiter Blick, sobald Bilder und Schriften die Höhen final gesetzt haben.
    const timer = window.setTimeout(check, 700);
    return () => window.clearTimeout(timer);
  }, []);

  return { ref, revealed: inView || visibleOnScreen };
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  as?: "div" | "span";
}) {
  const Component = motion[as];
  const { ref, revealed } = useRevealed<HTMLDivElement>(0.3);

  return (
    <Component
      ref={ref}
      className={className}
      initial="hidden"
      animate={revealed ? "visible" : "hidden"}
      variants={buildVariants(direction)}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.12,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const { ref, revealed } = useRevealed<HTMLDivElement>(0.2);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      // Die Variante wird an die RevealItem-Kinder weitergereicht; dadurch
      // blenden sie nacheinander ein.
      animate={revealed ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
}) {
  return (
    <motion.div className={className} variants={buildVariants(direction)}>
      {children}
    </motion.div>
  );
}
