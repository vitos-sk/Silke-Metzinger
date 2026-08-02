import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/motion/ScrollToTop";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import PostArticle from "@/components/Blog/PostArticle";
import PostCard from "@/components/Blog/PostCard";
import ShareButtons from "@/components/Blog/ShareButtons";
import { InlineDivider, SectionDivider } from "@/components/Blog/decor";
import { getPostBySlug, isPastEvent, listPublishedPosts } from "@/lib/posts";
import { OG_FALLBACK_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import type { Post } from "@/types/post";

interface PostPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Die Liste bleibt für Sitemap und Link-Vorschau nützlich; gerendert wird die
// Seite pro Anfrage, weil die Entwurfs-Vorschau den Session-Cookie lesen muss.
export async function generateStaticParams() {
  const posts = await listPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

function isPreviewRequest(searchParams: Record<string, string | string[] | undefined>): boolean {
  return searchParams.preview === "1";
}

// Entwürfe sind nur mit gültiger Admin-Session sichtbar — sonst verhält sich
// die Seite exakt wie eine unbekannte Adresse (404).
async function hasAdminSession(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return token ? verifySessionToken(token) : false;
}

async function loadVisiblePost(slug: string, preview: boolean): Promise<Post | null> {
  const post = await getPostBySlug(slug);
  if (!post) return null;
  if (post.status === "published") return post;
  if (!preview) return null;
  return (await hasAdminSession()) ? post : null;
}

export async function generateMetadata({
  params,
  searchParams,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadVisiblePost(slug, isPreviewRequest(await searchParams));

  if (!post) return { title: "Beitrag nicht gefunden — Silke Metzinger" };

  const image = post.coverImageUrl ?? OG_FALLBACK_IMAGE;

  return {
    title: `${post.title} — ${SITE_NAME}`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.status === "draft" ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: new Date(post.publishedAt).toISOString(),
      images: [image],
      locale: "de_DE",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}

function buildJsonLd(post: Post) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.coverImageUrl ?? `${SITE_URL}${OG_FALLBACK_IMAGE}`;

  if (post.type === "event" && post.eventDate) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: post.title,
      description: post.excerpt,
      startDate: post.eventTime ? `${post.eventDate}T${post.eventTime}` : post.eventDate,
      image: [image],
      url,
      ...(post.eventLocation
        ? { location: { "@type": "Place", name: post.eventLocation } }
        : {}),
      organizer: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [image],
    url,
    mainEntityOfPage: url,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt || post.publishedAt).toISOString(),
    author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
  };
}

export default async function PostPage({ params, searchParams }: PostPageProps) {
  const { slug } = await params;
  const post = await loadVisiblePost(slug, isPreviewRequest(await searchParams));

  if (!post) notFound();

  const allPosts = await listPublishedPosts();
  const related = allPosts
    .filter((entry) => entry.id !== post.id && !isPastEvent(entry))
    .slice(0, 3);

  const shareUrl = `${SITE_URL}/blog/${post.slug}`;
  const past = isPastEvent(post);

  return (
    <>
      <Navbar />
      <main className="pt-(--navbar-h)">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(post)) }}
        />

        <article className="px-6 py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-sage"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Zurück zum Blog
            </Link>

            {post.status === "draft" && (
              <p className="mt-4 rounded-xl bg-gold/15 px-4 py-2.5 text-sm text-text-primary">
                Vorschau eines Entwurfs — dieser Beitrag ist öffentlich nicht sichtbar.
              </p>
            )}

            <div className="mt-6">
              <PostArticle post={post} isPast={past} priority />
            </div>

            <div className="mx-auto mt-12 w-full max-w-2xl">
              <InlineDivider />
              <div className="mt-6">
                <ShareButtons url={shareUrl} title={post.title} />
              </div>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="relative bg-sage/5 px-6 py-14 md:py-16">
            <SectionDivider position="top" />
            <SectionDivider position="bottom" />

            <div className="mx-auto max-w-6xl">
              <Reveal>
                <h2 className="text-center font-serif text-2xl text-text-primary md:text-3xl">
                  Das könnte dich auch interessieren
                </h2>
              </Reveal>

              <RevealGroup
                className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10 md:grid-cols-3 md:gap-6"
                stagger={0.1}
              >
                {related.map((entry, index) => (
                  <RevealItem key={entry.id}>
                    <PostCard post={entry} index={index} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </section>
        )}

        <section className="px-6 py-14 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <p className="font-serif text-2xl leading-snug text-text-primary sm:text-3xl">
                Klingt das nach deinem Weg?
              </p>
              <p className="mt-4 text-text-secondary">
                In einem kostenlosen Kennenlerngespräch schauen wir gemeinsam, wo du stehst und
                welcher nächste Schritt zu dir passt.
              </p>
              <Link
                href="/#kontakt"
                className="group relative mt-7 inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-8 text-sm font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)] sm:text-base"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                />
                <span className="relative">Kostenloses Kennenlerngespräch</span>
              </Link>
            </Reveal>

            <div className="mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-sage"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Zurück zum Blog
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
