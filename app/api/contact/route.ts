import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { firstName, lastName, email, message, consent } = body;

  if (!firstName || !lastName || !email || !message || !consent) {
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
  const to = process.env.CONTACT_EMAIL_TO;

  if (!apiKey || !to) {
    console.error(
      "Kontaktformular: RESEND_API_KEY oder CONTACT_EMAIL_TO fehlt in .env.local",
    );
    return NextResponse.json(
      { error: "Der Versand ist derzeit nicht verfügbar. Bitte versuche es später erneut." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: process.env.CONTACT_EMAIL_FROM ?? "Kontaktformular <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Neue Nachricht von ${firstName} ${lastName}`,
    text: `Name: ${firstName} ${lastName}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
  });

  if (error) {
    console.error("Kontaktformular: Resend-Fehler", error);
    return NextResponse.json(
      { error: "Etwas ist schiefgelaufen. Bitte versuche es erneut." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
