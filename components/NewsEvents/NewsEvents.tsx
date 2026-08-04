import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import PostCard from "@/components/Blog/PostCard";
import { SectionDivider } from "@/components/Blog/decor";
import { listLatestPosts } from "@/lib/posts";

export default async function NewsEvents() {
  const posts = await listLatestPosts(3);

  return (
    <section id="news-events" className="relative scroll-mt-32 bg-sage/5 px-6 py-16 md:py-20">
      <SectionDivider position="top" />
      <SectionDivider position="bottom" />

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center font-serif text-3xl text-text-primary md:text-4xl">
            News &amp; Events
          </h2>
        </Reveal>

        {posts.length === 0 ? (
          <p className="mt-10 text-center text-text-secondary">
            Aktuell sind keine Events geplant &mdash; schau bald wieder vorbei.
          </p>
        ) : (
          <RevealGroup
            className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-14 md:gap-7 xl:grid-cols-3"
            stagger={0.12}
          >
            {posts.map((post, index) => (
              <RevealItem key={post.id}>
                <PostCard post={post} index={index} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center md:mt-12">
            <Link
              href="/blog"
              className="group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-8 text-sm font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)] sm:text-base"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <span className="relative">Zum Blog</span>
              <ArrowRight
                aria-hidden
                className="relative h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.25}
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
