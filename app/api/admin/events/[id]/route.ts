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

  if (!body.title || !body.date) {
    return NextResponse.json({ error: "Titel und Datum sind erforderlich" }, { status: 400 });
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
