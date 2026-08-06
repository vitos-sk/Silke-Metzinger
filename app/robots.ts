import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /api/ komplett: die Routen liefern JSON und gehören nie in den Index.
      // ?preview=1 zeigt Entwürfe (nur mit Admin-Session) — die Seite sendet
      // dort bereits noindex, der Eintrag hier spart Crawl-Versuche.
      disallow: ["/admin", "/api/", "/*?preview="],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
