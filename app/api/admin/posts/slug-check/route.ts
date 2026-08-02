import { NextResponse } from "next/server";
import { findFreeSlug, isSlugTaken } from "@/lib/posts";
import { slugify } from "@/lib/slug";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = slugify(searchParams.get("slug") ?? "");
  const id = searchParams.get("id") ?? undefined;

  if (!slug) {
    return NextResponse.json({ available: false, suggestion: "" });
  }

  const taken = await isSlugTaken(slug, id);

  return NextResponse.json({
    available: !taken,
    suggestion: taken ? await findFreeSlug(slug, id) : slug,
  });
}
