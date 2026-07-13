"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (value: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          throw new Error("Clipboard API unavailable");
        }
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand("copy");
        } finally {
          document.body.removeChild(textarea);
        }
      }
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), resetDelay);
    },
    [resetDelay]
  );

  return { copied, copy };
}

function CopyTooltip({ copied }: { copied: boolean }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-text-primary px-2 py-1 text-xs text-ivory shadow-sm transition-opacity duration-200 ${
        copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      {copied ? "Kopiert!" : "Kopieren"}
    </span>
  );
}

/**
 * Displays a phone number together with an explicit, always-visible copy
 * affordance. If `href` is provided (e.g. a `tel:` link), the number stays
 * tappable to call, and a separate icon button next to it copies the value.
 * Without `href`, the whole row acts as a single tap/click-to-copy target,
 * which is what we use for numbers that aren't dialable links (e.g. the
 * WhatsApp entries in the contact section).
 */
export function CopyableNumber({
  value,
  href,
  label,
  className = "",
}: {
  value: string;
  href?: string;
  label: string;
  className?: string;
}) {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = useCallback(() => {
    void copy(value);
  }, [copy, value]);

  if (href) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <a href={href} className="underline decoration-sage/30 underline-offset-2 transition-colors hover:text-sage hover:decoration-sage">
          {value}
        </a>
        <span className="group relative inline-flex">
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? `${label} kopiert` : `${label} kopieren`}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-secondary/60 transition-colors hover:bg-sage/10 hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-sage" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <CopyTooltip copied={copied} />
        </span>
      </span>
    );
  }

  return (
    <span className={`group relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? `${label} kopiert` : `${label} kopieren`}
        className="inline-flex items-center gap-2 rounded-full py-0.5 pl-0 pr-2 text-left transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40"
      >
        <span className="underline decoration-dashed decoration-text-secondary/40 underline-offset-4 transition-colors group-hover:decoration-sage">
          {value}
        </span>
        {copied ? (
          <Check className="h-3.5 w-3.5 shrink-0 text-sage" />
        ) : (
          <Copy className="h-3.5 w-3.5 shrink-0 text-text-secondary/50 transition-colors group-hover:text-sage" />
        )}
      </button>
      <CopyTooltip copied={copied} />
    </span>
  );
}
