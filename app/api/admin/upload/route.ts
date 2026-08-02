import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { readImageSize } from "@/lib/imageSize";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

// Dateinamen auf unproblematische Zeichen reduzieren, damit die Blob-URL
// stabil bleibt (Umlaute, Leerzeichen, Pfadtrenner).
function safeFileName(name: string): string {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "bild";
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Nur JPG-, PNG-, WebP- oder AVIF-Bilder sind erlaubt." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Das Bild ist zu gross. Erlaubt sind maximal 8 MB." },
      { status: 413 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const size = readImageSize(bytes);

  const blob = await put(`posts/${Date.now()}-${safeFileName(file.name)}`, Buffer.from(bytes), {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json(size ? { url: blob.url, ...size } : { url: blob.url });
}
