"use client";

import { useState } from "react";
import { Check, Link2, Mail } from "lucide-react";
import { FacebookIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";

const buttonClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full bg-white/70 px-4 text-sm text-text-secondary ring-1 ring-black/5 transition-colors hover:bg-sage/10 hover:text-sage";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-text-secondary">Teilen:</span>

      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bei WhatsApp teilen"
        className={buttonClass}
      >
        <WhatsAppIcon className="h-4 w-4" aria-hidden />
        WhatsApp
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bei Facebook teilen"
        className={buttonClass}
      >
        <FacebookIcon className="h-4 w-4" aria-hidden />
        Facebook
      </a>

      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
        aria-label="Per E-Mail teilen"
        className={buttonClass}
      >
        <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        E-Mail
      </a>

      <button type="button" onClick={copyLink} aria-label="Link kopieren" className={buttonClass}>
        {copied ? (
          <Check className="h-4 w-4 text-sage" strokeWidth={2} aria-hidden />
        ) : (
          <Link2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        )}
        {copied ? "Kopiert!" : "Link kopieren"}
      </button>
    </div>
  );
}
