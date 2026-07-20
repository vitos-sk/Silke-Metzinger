import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createEvent, listEvents } from "@/lib/events";
import type { NewsEventInput } from "@/types/event";

export async function GET() {
  const events = await listEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const body = (await request.json()) as NewsEventInput;

  if (!body.title) {
    return NextResponse.json({ error: "Titel ist erforderlich" }, { status: 400 });
  }

  if (!body.imageUrl) {
    return NextResponse.json({ error: "Ein Foto ist erforderlich" }, { status: 400 });
  }

  const id = await createEvent(body);
  revalidatePath("/");
  return NextResponse.json({ id });
}
