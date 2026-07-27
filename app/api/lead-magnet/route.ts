import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { fullName, email, consent } = body;

  if (!fullName || !email || !consent) {
    return NextResponse.json(
      { error: "Bitte fülle alle Pflichtfelder aus." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_MAGNET_EMAIL_TO ?? "info@silke-metzinger.ch";

  if (!apiKey) {
    console.error("Lead-Magnet: RESEND_API_KEY fehlt in .env.local");
    return NextResponse.json(
      { error: "Der Versand ist derzeit nicht verfügbar. Bitte versuche es später erneut." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: process.env.CONTACT_EMAIL_FROM ?? "Website <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Neue Anfrage: 15 Reflexionsfragen – ${fullName}`,
    text: `Name: ${fullName}\nE-Mail: ${email}\n\nAnfrage für: Die 15 Reflexionsfragen`,
  });

  if (error) {
    console.error("Lead-Magnet: Resend-Fehler", error);
    return NextResponse.json(
      { error: "Etwas ist schiefgelaufen. Bitte versuche es erneut." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
