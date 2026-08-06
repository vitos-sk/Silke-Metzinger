import { listPublishedPosts } from "@/lib/posts";
import { excerptFromBlocks } from "@/lib/postContent";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const FEED_URL = `${SITE_URL}/blog/feed.xml`;
const FEED_TITLE = `Blog — ${SITE_NAME}`;
const FEED_DESCRIPTION =
  "Impulse, Events und Gedanken rund um Ernährung, Vitalstoffe und einen Alltag mit mehr Energie und Klarheit.";

// Höchstens einmal pro Stunde neu bauen — Beiträge erscheinen nicht im Minutentakt.
export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await listPublishedPosts();
  const latest = posts[0];
  const buildDate = new Date(
    latest ? latest.updatedAt || latest.publishedAt : Date.now(),
  ).toUTCString();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const description = post.excerpt || excerptFromBlocks(post.blocks);

      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(description)}</description>`,
        ...(post.coverImageUrl
          ? [`      <enclosure url="${escapeXml(post.coverImageUrl)}" type="image/jpeg" />`]
          : []),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>de-ch</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
