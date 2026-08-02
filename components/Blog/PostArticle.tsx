import Image from "next/image";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { PostBlock, PostType } from "@/types/post";
import { readingTimeMinutes } from "@/lib/postContent";
import { formatEventDate, formatTimestamp } from "@/lib/postDate";
import PostBody from "./PostBody";
import { WavyUnderline } from "./decor";

export interface PostArticleData {
  type: PostType;
  title: string;
  coverImageUrl: string | null;
  coverImageAlt: string;
  blocks: PostBlock[];
  eventDate: string | null;
  eventTime: string | null;
  eventLocation: string | null;
  eventCtaLabel: string | null;
  eventCtaHref: string | null;
  publishedAt: number;
}

/**
 * Beitrags-Darstellung ohne Seitenrahmen — wird von der öffentlichen Seite und
 * von der Admin-Vorschau gemeinsam genutzt, damit beide identisch aussehen.
 */
export default function PostArticle({
  post,
  isPast = false,
  priority = false,
}: {
  post: PostArticleData;
  isPast?: boolean;
  priority?: boolean;
}) {
  const minutes = readingTimeMinutes(post.blocks);
  const isExternalCta = Boolean(post.eventCtaHref?.startsWith("http"));

  return (
    <>
      {post.coverImageUrl && (
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-[20px] bg-linear-to-br from-gold/20 to-sage/20">
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt || post.title}
            fill
            priority={priority}
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      <header className={`mx-auto w-full max-w-2xl ${post.coverImageUrl ? "mt-8" : ""}`}>
        <h1 className="font-serif text-3xl leading-tight text-text-primary md:text-4xl">
          {post.title}
        </h1>
        <WavyUnderline className="mt-3 h-3 w-20 text-sage/40" />

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary">
          <time dateTime={new Date(post.publishedAt).toISOString()}>
            {formatTimestamp(post.publishedAt)}
          </time>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            ca. {minutes} Min. Lesezeit
          </span>
          {isPast && (
            <span className="rounded-full bg-black/10 px-3 py-0.5 text-xs">Vergangen</span>
          )}
        </div>

        {post.type === "event" && (post.eventDate || post.eventLocation) && (
          <div className="mt-5 rounded-[20px] bg-sage/8 p-5">
            <ul className="space-y-2 text-sm text-text-primary">
              {post.eventDate && (
                <li className="flex items-center gap-2">
                  <CalendarDays
                    className="h-4 w-4 shrink-0 text-sage"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <time dateTime={post.eventDate}>{formatEventDate(post.eventDate)}</time>
                  {post.eventTime && <span>· {post.eventTime} Uhr</span>}
                </li>
              )}
              {post.eventLocation && (
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-sage" strokeWidth={1.75} aria-hidden />
                  {post.eventLocation}
                </li>
              )}
            </ul>

            {post.eventCtaLabel && post.eventCtaHref && (
              <a
                href={post.eventCtaHref}
                target={isExternalCta ? "_blank" : undefined}
                rel={isExternalCta ? "noopener noreferrer" : undefined}
                className="group relative mt-4 inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-7 text-sm font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                />
                <span className="relative">{post.eventCtaLabel}</span>
              </a>
            )}
          </div>
        )}
      </header>

      <div className="mt-10">
        <PostBody blocks={post.blocks} />
      </div>
    </>
  );
}
