import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/motion/ScrollToTop";
import { Reveal } from "@/components/motion/Reveal";
import BlogIndex from "@/components/Blog/BlogIndex";
import { SectionDivider, WavyUnderline } from "@/components/Blog/decor";
import { isPastEvent, listPublishedPosts } from "@/lib/posts";
import { parsePostFilter } from "@/lib/postFilter";

export const metadata: Metadata = {
  title: "Blog — Silke Metzinger",
  description:
    "Impulse, Events und Gedanken rund um Ernährung, Vitalstoffe und einen Alltag mit mehr Energie und Klarheit.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Silke Metzinger",
    description:
      "Impulse, Events und Gedanken rund um Ernährung, Vitalstoffe und einen Alltag mit mehr Energie und Klarheit.",
    url: "/blog",
    type: "website",
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Der Filter kommt aus der Adresse, damit ein geteilter Link die gleiche
  // Auswahl zeigt — und die Karten bereits serverseitig gerendert werden.
  const filter = parsePostFilter((await searchParams).filter);
  const posts = await listPublishedPosts();
  const withArchiveFlag = posts.map((post) => ({ ...post, isPast: isPastEvent(post) }));

  return (
    <>
      <Navbar />
      <main className="pt-(--navbar-h)">
        <section className="relative bg-sage/5 px-6 py-16 md:py-20">
          <SectionDivider position="top" />
          <SectionDivider position="bottom" />

          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="flex flex-col items-center text-center">
                <h1 className="font-serif text-3xl text-text-primary md:text-4xl">Blog</h1>
                <WavyUnderline className="mt-3 h-3 w-24 text-sage/40" />
                <p className="mt-4 max-w-xl text-text-secondary">
                  Impulse, Gedanken und Termine — alles, was mich rund um Gesundheit, Vitalstoffe
                  und deinen persönlichen Weg gerade bewegt.
                </p>
              </div>
            </Reveal>

            {posts.length === 0 ? (
              <p className="mt-12 text-center text-text-secondary">
                Aktuell sind hier noch keine Beiträge &mdash; schau bald wieder vorbei.
              </p>
            ) : (
              <BlogIndex posts={withArchiveFlag} initialFilter={filter} />
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
