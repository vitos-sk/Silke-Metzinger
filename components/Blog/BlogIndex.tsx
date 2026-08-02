"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { postSearchText } from "@/lib/postContent";
import { POST_FILTERS, type PostFilter } from "@/lib/postFilter";
import type { Post } from "@/types/post";
import PostCard from "./PostCard";

export default function BlogIndex({
  posts,
  initialFilter,
}: {
  posts: Array<Post & { isPast: boolean }>;
  initialFilter: PostFilter;
}) {
  const [activeFilter, setActiveFilter] = useState<PostFilter>(initialFilter);
  const [query, setQuery] = useState("");

  function changeFilter(next: PostFilter) {
    setActiveFilter(next);
    // Adresse mitschreiben, damit der Link teilbar bleibt — aber ohne
    // Navigation, sonst springt die Seite und lädt die Liste neu.
    window.history.replaceState(null, "", next === "alle" ? "/blog" : `/blog?filter=${next}`);
  }

  const visiblePosts = useMemo(() => {
    const byFilter = posts.filter((post) => {
      switch (activeFilter) {
        case "events":
          return post.type === "event" && !post.isPast;
        case "beitraege":
          return post.type !== "event";
        case "archiv":
          return post.isPast;
        default:
          return !post.isPast;
      }
    });

    const needle = query.trim().toLowerCase();
    if (!needle) return byFilter;

    return byFilter.filter((post) => postSearchText(post).includes(needle));
  }, [posts, activeFilter, query]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 md:mt-10 md:flex-row md:items-center md:justify-between">
        <div
          role="group"
          aria-label="Beiträge filtern"
          className="flex flex-wrap gap-2"
        >
          {POST_FILTERS.map((filter) => {
            const isActive = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => changeFilter(filter.id)}
                aria-pressed={isActive}
                className={`min-h-11 rounded-full px-5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sage text-ivory shadow-[0_8px_20px_-8px_rgba(143,175,138,0.6)]"
                    : "bg-white/70 text-text-secondary ring-1 ring-black/5 hover:text-text-primary"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="relative md:w-72">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Suchen…"
            aria-label="Beiträge durchsuchen"
            className="min-h-11 w-full rounded-full border border-black/10 bg-white/70 pl-10 pr-4 text-sm text-text-primary outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20"
          />
        </div>
      </div>

      {visiblePosts.length === 0 ? (
        <p className="mt-12 text-center text-text-secondary">
          {query.trim()
            ? "Dazu habe ich nichts gefunden — probiere es mit einem anderen Wort."
            : "Hier ist gerade nichts zu sehen — schau bald wieder vorbei."}
        </p>
      ) : (
        <RevealGroup
          className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10 md:grid-cols-3 md:gap-6"
          stagger={0.1}
        >
          {visiblePosts.map((post, index) => (
            <RevealItem key={post.id}>
              <PostCard post={post} index={index} isPast={post.isPast} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </>
  );
}
