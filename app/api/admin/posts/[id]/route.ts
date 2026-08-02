import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deletePost, getPost, isSlugTaken, updatePost } from "@/lib/posts";
import { parsePostInput } from "@/lib/postContent";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function revalidatePost(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  // Bei geändertem Slug muss auch der alte Pfad neu gebaut werden.
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const existing = await getPost(id);

  if (!existing) {
    return NextResponse.json({ error: "Beitrag nicht gefunden." }, { status: 404 });
  }

  const parsed = parsePostInput(await request.json());

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (await isSlugTaken(parsed.input.slug, id)) {
    return NextResponse.json(
      { error: `Die Link-Adresse „${parsed.input.slug}“ ist bereits vergeben.` },
      { status: 409 },
    );
  }

  await updatePost(id, parsed.input);
  revalidatePost(parsed.input.slug, existing.slug);

  return NextResponse.json({ ok: true, slug: parsed.input.slug });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const existing = await getPost(id);

  await deletePost(id);

  revalidatePath("/");
  revalidatePath("/blog");
  if (existing) revalidatePath(`/blog/${existing.slug}`);

  return NextResponse.json({ ok: true });
}
