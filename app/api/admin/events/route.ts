import { NextResponse } from "next/server";
import { createEvent, listEvents } from "@/lib/events";
import type { NewsEventInput } from "@/types/event";

export async function GET() {
  const events = await listEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const body = (await request.json()) as NewsEventInput;

  if (!body.title || !body.date) {
    return NextResponse.json({ error: "Titel und Datum sind erforderlich" }, { status: 400 });
  }

  const id = await createEvent(body);
  return NextResponse.json({ id });
}
