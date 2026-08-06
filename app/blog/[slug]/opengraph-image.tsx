import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";
import { loadGoogleFont } from "@/lib/ogFont";
import { SITE_NAME } from "@/lib/site";

export const alt = "Beitrag von Silke Metzinger";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const KICKER = "Blog · Silke Metzinger";

/**
 * Vorschaubild eines Beitrags. Mit Titelbild liegt der Titel darüber, ohne
 * Titelbild auf dem Markenhintergrund — so hat jeder geteilte Link eine
 * Vorschau, auch wenn kein Bild hinterlegt wurde.
 */
export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title ?? SITE_NAME;
  const cover = post?.status === "published" ? post.coverImageUrl : null;

  const [serif, sans] = await Promise.all([
    loadGoogleFont("Playfair Display:wght@500", title),
    loadGoogleFont("Inter:wght@400", KICKER),
  ]);

  const fonts = [
    ...(serif ? [{ name: "Playfair", data: serif, style: "normal" as const, weight: 500 as const }] : []),
    ...(sans ? [{ name: "Inter", data: sans, style: "normal" as const, weight: 400 as const }] : []),
  ];

  // Sehr lange Titel würden das Bild sprengen — die Schrift schrumpft mit.
  const titleSize = title.length > 80 ? 52 : title.length > 45 ? 62 : 74;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          backgroundColor: "#faf7f2",
          fontFamily: sans ? "Inter" : undefined,
        }}
      >
        {cover ? (
          <>
            <img
              src={cover}
              alt=""
              width={size.width}
              height={size.height}
              style={{
                position: "absolute",
                inset: 0,
                width: size.width,
                height: size.height,
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(30,30,30,0.88) 0%, rgba(30,30,30,0.45) 45%, rgba(30,30,30,0.1) 100%)",
              }}
            />
          </>
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #faf7f2 0%, #eef2ea 55%, #f6efe1 100%)",
            }}
          />
        )}

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "0 72px 72px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 24,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: cover ? "#e8d9b5" : "#c8a96a",
            }}
          >
            <div
              style={{ width: 44, height: 2, backgroundColor: cover ? "#e8d9b5" : "#c8a96a" }}
            />
            {KICKER}
          </div>

          <div
            style={{
              marginTop: 24,
              fontFamily: serif ? "Playfair" : undefined,
              fontSize: titleSize,
              lineHeight: 1.12,
              color: cover ? "#ffffff" : "#2c2c2c",
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
