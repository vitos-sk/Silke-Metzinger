/**
 * Handgezeichnete SVG-Akzente des Blogs. Bewusst ohne "use client": die
 * Komponenten sind zustandslos und werden sowohl in Server- als auch in
 * Client-Komponenten (Admin-Vorschau) verwendet.
 */

export function HandDrawnFrame({ mirrored }: { mirrored?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 160 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full text-gold/45 ${
        mirrored ? "-scale-x-100" : ""
      }`}
      fill="none"
    >
      <path
        d="M14,5 C40,2 90,7 146,4 C152,10 150,40 154,70 C156,85 150,93 146,95 C100,98 50,93 12,96 C6,90 8,60 5,35 C3,20 8,10 14,5 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WavyUnderline({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 12" className={className} fill="none">
      <path
        d="M2 8c14-10 24 8 38 0s24-8 38 0 24 8 38 0 24-8 38 0 24 8 38 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SectionDivider({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${
        position === "top" ? "top-0" : "bottom-0"
      } flex items-center justify-center`}
    >
      <div className="h-px w-full bg-linear-to-r from-transparent via-gold/35 to-transparent" />
      <span className="absolute h-1.5 w-1.5 rotate-45 bg-gold/50" />
    </div>
  );
}

/** Dekorativer Trenner innerhalb eines Beitrags. */
export function InlineDivider() {
  return (
    <div aria-hidden className="relative flex items-center justify-center py-2">
      <div className="h-px w-full bg-linear-to-r from-transparent via-gold/35 to-transparent" />
      <span className="absolute h-1.5 w-1.5 rotate-45 bg-gold/50" />
    </div>
  );
}
