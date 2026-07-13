import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { firstName, lastName, email, message, consent } = body;

  if (!firstName || !lastName || !email || !message || !consent) {
    return NextResponse.json(
      { error: "Bitte fülle alle Pflichtfelder aus." },
      { status: 400 },
    );
  }

  // TODO: E-Mail-Versand über Resend an info@silke-metzinger.ch implementieren.
  // Benötigt RESEND_API_KEY in .env.local

  return NextResponse.json({ success: true });
}
