import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

// Rechtstexte ändern sich praktisch nie. Ein Datum, das bei jedem Build neu
// gesetzt wird, wäre ein falsches Signal — Suchmaschinen ignorieren dann alle
// Datumsangaben der Sitemap.
const LEGAL_PAGES_UPDATED = new Date("2026-02-01");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPublishedPosts();

  // Startseite und Blog-Übersicht zeigen die Beiträge — sie sind genau dann
  // aktuell, wenn der jüngste Beitrag es ist.
  const latestPostChange = posts.reduce((latest, post) => {
    const changed = post.updatedAt || post.publishedAt;
    return changed > latest ? changed : latest;
  }, 0);

  const contentUpdated = latestPostChange
    ? new Date(latestPostChange)
    : LEGAL_PAGES_UPDATED;

  return [
    {
      url: SITE_URL,
      lastModified: contentUpdated,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: contentUpdated,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/impressum`,
      lastModified: LEGAL_PAGES_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/datenschutz`,
      lastModified: LEGAL_PAGES_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
