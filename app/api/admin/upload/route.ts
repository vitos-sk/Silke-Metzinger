import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei erhalten" }, { status: 400 });
  }

  const blob = await put(`events/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
