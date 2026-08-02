import Image from "next/image";
import Link from "next/link";
import type { PostBlock } from "@/types/post";
import { InlineDivider, WavyUnderline } from "./decor";

const COLUMN = "mx-auto w-full max-w-2xl";
const WIDE_COLUMN = "mx-auto w-full max-w-4xl";

// Leerzeilen im Absatz-Feld werden zu eigenen <p>-Elementen.
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

// Ein reiner Anker (#kontakt) zeigt vom Blog aus auf die Startseite.
function normalizeHref(href: string): string {
  return href.startsWith("#") ? `/${href}` : href;
}

function BlockButton({ label, href }: { label: string; href: string }) {
  const className =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-7 py-3 text-sm font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)]";
  const shine = (
    <span
      aria-hidden
      className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
    />
  );

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {shine}
        <span className="relative">{label}</span>
      </a>
    );
  }

  return (
    <Link href={normalizeHref(href)} className={className}>
      {shine}
      <span className="relative">{label}</span>
    </Link>
  );
}

function renderBlock(block: PostBlock) {
  switch (block.type) {
    case "paragraph":
      return (
        <div key={block.id} className={`${COLUMN} space-y-4`}>
          {splitParagraphs(block.text).map((paragraph, index) => (
            <p key={index} className="leading-relaxed text-text-secondary">
              {paragraph}
            </p>
          ))}
        </div>
      );

    case "heading":
      if (block.level === 3) {
        return (
          <h3
            key={block.id}
            className={`${COLUMN} pt-2 font-serif text-lg text-text-primary md:text-xl`}
          >
            {block.text}
          </h3>
        );
      }
      return (
        <div key={block.id} className={`${COLUMN} pt-2`}>
          <h2 className="font-serif text-2xl text-text-primary md:text-3xl">{block.text}</h2>
          <WavyUnderline className="mt-2 h-2.5 w-16 text-sage/40" />
        </div>
      );

    case "image":
      return (
        <figure key={block.id} className={block.width === "wide" ? WIDE_COLUMN : COLUMN}>
          <Image
            src={block.url}
            alt={block.alt}
            width={1600}
            height={1000}
            sizes={block.width === "wide" ? "(max-width: 896px) 100vw, 896px" : "(max-width: 672px) 100vw, 672px"}
            className="h-auto w-full rounded-[20px] object-cover shadow-sm"
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-xs text-text-secondary/80">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "quote":
      return (
        <blockquote
          key={block.id}
          className={`${COLUMN} border-l-2 border-gold/40 py-1 pl-5`}
        >
          <p className="font-script text-xl leading-relaxed text-text-primary italic md:text-2xl">
            {block.text}
          </p>
          {block.author && (
            <footer className="mt-2 text-xs text-text-secondary">— {block.author}</footer>
          )}
        </blockquote>
      );

    case "list": {
      const items = block.items.map((item, index) => (
        <li key={index} className="pl-1.5 leading-relaxed text-text-secondary marker:text-sage">
          {item}
        </li>
      ));
      return block.style === "number" ? (
        <ol key={block.id} className={`${COLUMN} list-decimal space-y-2 pl-5`}>
          {items}
        </ol>
      ) : (
        <ul key={block.id} className={`${COLUMN} list-disc space-y-2 pl-5`}>
          {items}
        </ul>
      );
    }

    case "button":
      return (
        <div key={block.id} className={COLUMN}>
          <BlockButton label={block.label} href={block.href} />
        </div>
      );

    case "divider":
      return (
        <div key={block.id} className={COLUMN}>
          <InlineDivider />
        </div>
      );

    default:
      // Unbekannte Blocktypen (z. B. aus einer neueren Version) still ignorieren.
      return null;
  }
}

export default function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return <div className="flex flex-col gap-7">{blocks.map(renderBlock)}</div>;
}
