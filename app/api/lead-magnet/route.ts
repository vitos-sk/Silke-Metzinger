import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createSubmission } from "@/lib/submissions";

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

  try {
    await createSubmission({ type: "lead-magnet", fullName, email });
  } catch (err) {
    console.error("Lead-Magnet: Speichern in Firestore fehlgeschlagen", err);
    return NextResponse.json(
      { error: "Etwas ist schiefgelaufen. Bitte versuche es erneut." },
      { status: 500 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_MAGNET_EMAIL_TO ?? "info.silke-metzinger@gmx.ch";

  if (!apiKey) {
    console.error("Lead-Magnet: RESEND_API_KEY fehlt in .env.local");
    return NextResponse.json({ success: true });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: process.env.CONTACT_EMAIL_FROM ?? "Website <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Neue Anfrage: Reflexionsfragen – ${fullName}`,
    text: `Name: ${fullName}\nE-Mail: ${email}\n\nAnfrage für: Die Reflexionsfragen`,
  });

  if (error) {
    console.error("Lead-Magnet: Resend-Fehler", error);
  }

  return NextResponse.json({ success: true });
}
