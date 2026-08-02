"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { CalendarDays, Leaf, MapPin, Sparkles } from "lucide-react";
import type { Post } from "@/types/post";
import { formatEventDate } from "@/lib/postDate";
import { HandDrawnFrame, WavyUnderline } from "./decor";

const CARD_TINTS = ["bg-gold/6", "bg-sage/6", "bg-gold/6"];

function EventMeta({ post }: { post: Post }) {
  if (post.type !== "event") return null;

  return (
    <>
      {post.eventDate && (
        <span className="inline-flex items-center gap-1 rounded-full bg-sage px-3 py-1 text-xs text-ivory">
          <CalendarDays className="h-3 w-3" strokeWidth={1.75} />
          {formatEventDate(post.eventDate)}
        </span>
      )}
      {post.eventLocation && (
        <span className="inline-flex items-center gap-1 rounded-full bg-ivory/90 px-3 py-1 text-xs text-text-secondary ring-1 ring-black/5">
          <MapPin className="h-3 w-3" strokeWidth={1.75} />
          {post.eventLocation}
        </span>
      )}
    </>
  );
}

function PastBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-black/10 px-3 py-1 text-xs text-text-secondary">
      Vergangen
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
  const hasPhoto = Boolean(post.coverImageUrl);
  const readMoreLabel = post.type === "event" ? "Zum Event →" : "Weiterlesen →";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`h-full overflow-hidden rounded-[20px] shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-sage/10 ${
        CARD_TINTS[index % CARD_TINTS.length]
      }`}
    >
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`${post.title} — Beitrag öffnen`}
        className="flex h-full flex-col rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        {hasPhoto ? (
          <>
            <div className="relative aspect-16/10 w-full overflow-hidden bg-linear-to-br from-gold/20 to-sage/20">
              <Image
                src={post.coverImageUrl!}
                alt={post.coverImageAlt || post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                <EventMeta post={post} />
                {isPast && <PastBadge />}
              </div>
              <Leaf
                aria-hidden
                className="absolute right-3 top-3 h-4 w-4 rotate-12 text-gold/60"
                strokeWidth={1.5}
              />
            </div>

            <div className="flex flex-1 flex-col p-4 md:p-5">
              <h3 className="font-serif text-base text-text-primary md:text-lg">{post.title}</h3>
              <WavyUnderline className="mt-1.5 h-2.5 w-14 text-sage/40" />
              <p className="mt-2 line-clamp-3 text-sm text-text-secondary">{post.excerpt}</p>
              <span className="mt-3 inline-block text-sm text-sage">{readMoreLabel}</span>
            </div>
          </>
        ) : (
          <div className="relative flex h-full min-h-70 flex-col items-center justify-center px-6 py-9 text-center md:px-8">
            <HandDrawnFrame mirrored={index % 2 === 1} />
            <Leaf
              aria-hidden
              className="absolute right-4 top-4 h-4 w-4 rotate-12 text-gold/60"
              strokeWidth={1.5}
            />

            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Sparkles className="h-4 w-4" strokeWidth={1.75} />
            </div>

            <div className="relative mt-3 flex flex-wrap justify-center gap-1.5">
              <EventMeta post={post} />
              {isPast && <PastBadge />}
            </div>

            <h3 className="relative mt-3 font-serif text-lg text-text-primary md:text-xl">
              {post.title}
            </h3>
            <WavyUnderline className="relative mt-2 h-2.5 w-14 text-sage/40" />
            <p className="relative mt-3 line-clamp-3 text-sm text-text-secondary">
              {post.excerpt}
            </p>
            <span className="relative mt-4 inline-block text-sm text-sage">{readMoreLabel}</span>
          </div>
        )}
      </Link>
    </motion.article>
  );
}
