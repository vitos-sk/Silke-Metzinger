import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createPost, isSlugTaken, listPosts } from "@/lib/posts";
import { parsePostInput } from "@/lib/postContent";

export async function GET() {
  const posts = await listPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const parsed = parsePostInput(await request.json());

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (await isSlugTaken(parsed.input.slug)) {
    return NextResponse.json(
      { error: `Die Link-Adresse „${parsed.input.slug}“ ist bereits vergeben.` },
      { status: 409 },
    );
  }

  const id = await createPost(parsed.input);

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.input.slug}`);

  return NextResponse.json({ id, slug: parsed.input.slug });
}
