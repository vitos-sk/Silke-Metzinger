import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, Sparkles } from "lucide-react";
import { POST_TYPE_LABELS, type Post } from "@/types/post";
import { readingTimeMinutes } from "@/lib/postContent";
import { formatEventDate, formatTimestamp } from "@/lib/postDate";
import { HandDrawnFrame, WavyUnderline } from "./decor";

/**
 * Vorschaukarte eines Beitrags.
 *
 * Bewusst eine reine Server-Komponente ohne JS-Gesten: die ganze Karte ist ein
 * einziger Link. Frühere Hover-Animationen liefen über Motion und liessen auf
 * Touch-Geräten den ersten Tipper als "Hover" verpuffen, statt zu öffnen.
 * Hover/Fokus laufen jetzt über CSS — Tailwind wendet `hover:` nur auf Geräten
 * mit echtem Zeiger an, Touch bleibt davon unberührt.
 */

const CARD_TINTS = ["from-gold/12", "from-sage/12", "from-gold/12"];

function MetaChip({
  icon: Icon,
  children,
  tone = "muted",
}: {
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
  tone?: "muted" | "sage" | "past";
}) {
  const tones = {
    muted: "bg-ivory/90 text-text-secondary ring-1 ring-black/5",
    sage: "bg-sage text-ivory",
    past: "bg-black/10 text-text-secondary",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />}
      {children}
    </span>
  );
}

export default function PostCard({
  post,
  index,
  isPast = false,
}: {
  post: Post;
  index: number;
  isPast?: boolean;
}) {
  const minutes = readingTimeMinutes(post.blocks);
  const isEvent = post.type === "event";
  const readMoreLabel = isEvent ? "Zum Event" : "Weiterlesen";
  const tint = CARD_TINTS[index % CARD_TINTS.length];

  return (
    <article className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`${post.title} — Beitrag öffnen`}
        className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-ivory shadow-[0_2px_10px_-4px_rgba(44,44,44,0.12)] ring-1 ring-black/5 transition-[transform,box-shadow] duration-300 outline-none hover:-translate-y-1 hover:shadow-[0_18px_36px_-16px_rgba(143,175,138,0.55)] focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        {/* Bildbereich — auch ohne Foto vorhanden, damit alle Karten im Raster
            gleich hoch beginnen und die Reihe ruhig wirkt. */}
        <div
          className={`relative aspect-3/2 w-full overflow-hidden bg-linear-to-br ${tint} to-sage/12`}
        >
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={post.coverImageAlt || post.title}
              fill
              quality={90}
              sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <>
              <HandDrawnFrame mirrored={index % 2 === 1} />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Sparkles className="h-6 w-6" strokeWidth={1.5} />
                </span>
              </span>
            </>
          )}

          {(isEvent || isPast) && (
            <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
              {isEvent && post.eventDate && (
                <MetaChip icon={CalendarDays} tone="sage">
                  {formatEventDate(post.eventDate)}
                  {post.eventTime ? ` · ${post.eventTime}` : ""}
                </MetaChip>
              )}
              {isPast && <MetaChip tone="past">Vergangen</MetaChip>}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          {/* Kopfzeile mit Einordnung: Art des Beitrags, Datum, Lesezeit. */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-text-secondary">
            <span className="font-medium tracking-wide text-sage uppercase">
              {POST_TYPE_LABELS[post.type]}
            </span>
            <span aria-hidden className="text-text-secondary/40">
              ·
            </span>
            <time dateTime={new Date(post.publishedAt).toISOString()}>
              {formatTimestamp(post.publishedAt)}
            </time>
            <span aria-hidden className="text-text-secondary/40">
              ·
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
              ca. {minutes} Min.
            </span>
          </div>

          <h3 className="mt-3 font-serif text-xl leading-snug text-text-primary md:text-2xl">
            {post.title}
          </h3>
          <WavyUnderline className="mt-2 h-2.5 w-16 text-sage/40" />

          <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-text-secondary">
            {post.excerpt}
          </p>

          {isEvent && post.eventLocation && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-text-primary">
              <MapPin className="h-4 w-4 shrink-0 text-sage" strokeWidth={1.75} aria-hidden />
              {post.eventLocation}
            </p>
          )}

          {/* mt-auto hält den Abschluss immer am unteren Kartenrand. */}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-sage">
            {readMoreLabel}
            <ArrowRight
              aria-hidden
              className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
