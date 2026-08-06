import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/ogFont";

export const alt =
  "Silke Metzinger — Ernährungsberatung & Resilienz-Coaching in Hildisrieden";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAME = "Silke Metzinger";
const CLAIM = "Ernährungsberatung & Resilienz-Coaching";
const PLACE = "Hildisrieden · Luzern · Schweiz";
const TAGLINE = "Vital & Frei";

export default async function OpengraphImage() {
  // Das Kontaktfoto ist mit ~110 KB das kleinste Portrait im Projekt und
  // dadurch die günstigste Wahl fürs Einbetten als Data-URL.
  const photo = await readFile(join(process.cwd(), "public/silke-photo-contact.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const [serif, sans] = await Promise.all([
    loadGoogleFont("Playfair Display:wght@500", `${NAME}${TAGLINE}`),
    loadGoogleFont("Inter:wght@400;500", `${CLAIM}${PLACE}`),
  ]);

  const fonts = [
    ...(serif ? [{ name: "Playfair", data: serif, style: "normal" as const, weight: 500 as const }] : []),
    ...(sans ? [{ name: "Inter", data: sans, style: "normal" as const, weight: 400 as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#faf7f2",
          fontFamily: sans ? "Inter" : undefined,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "#c8a96a",
              fontSize: 26,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            <div style={{ width: 48, height: 2, backgroundColor: "#c8a96a" }} />
            {TAGLINE}
          </div>

          <div
            style={{
              marginTop: 28,
              fontFamily: serif ? "Playfair" : undefined,
              fontSize: 78,
              lineHeight: 1.05,
              color: "#2c2c2c",
            }}
          >
            {NAME}
          </div>

          <div style={{ marginTop: 26, fontSize: 34, lineHeight: 1.3, color: "#6b6b6b" }}>
            {CLAIM}
          </div>

          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 10, height: 10, backgroundColor: "#8faf8a", borderRadius: 5 }} />
            <div style={{ fontSize: 25, color: "#8faf8a" }}>{PLACE}</div>
          </div>
        </div>

        <div style={{ display: "flex", width: 470, height: "100%", position: "relative" }}>
          <img
            src={photoSrc}
            alt=""
            width={470}
            height={630}
            style={{ width: 470, height: 630, objectFit: "cover" }}
          />
          {/* Weicher Übergang vom Text zum Foto, damit die Kante nicht hart wirkt. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, #faf7f2 0%, rgba(250,247,242,0) 22%)",
            }}
          />
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
