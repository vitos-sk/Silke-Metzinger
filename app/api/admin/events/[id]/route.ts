import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteEvent, updateEvent } from "@/lib/events";
import type { NewsEventInput } from "@/types/event";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = (await request.json()) as NewsEventInput;

  if (!body.title) {
    return NextResponse.json({ error: "Titel ist erforderlich" }, { status: 400 });
  }

  if (!body.imageUrl) {
    return NextResponse.json({ error: "Ein Foto ist erforderlich" }, { status: 400 });
  }

  await updateEvent(id, body);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  await deleteEvent(id);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
