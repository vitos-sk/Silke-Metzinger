import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createSubmission } from "@/lib/submissions";
import { MAIL_FROM } from "@/lib/site";
import {
  FIELD_LIMITS,
  guardPublicForm,
  isValidEmail,
  readJsonBody,
  sanitizeText,
} from "@/lib/formGuard";

export async function POST(request: NextRequest) {
  const body = await readJsonBody(request);

  if (!body) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Bot-Erkennung und Rate-Limit vor jeder Datenbank- oder Mail-Aktion.
  const guard = await guardPublicForm(request, body);
  if (!guard.ok) {
    // Honeypot-Treffer bekommen eine ganz normale Erfolgsantwort.
    if (guard.status === 200) return NextResponse.json({ success: true });
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const firstName = sanitizeText(body.firstName, FIELD_LIMITS.name);
  const lastName = sanitizeText(body.lastName, FIELD_LIMITS.name);
  const email = sanitizeText(body.email, FIELD_LIMITS.email);
  const message = sanitizeText(body.message, FIELD_LIMITS.message);
  const consent = body.consent === true;

  if (!firstName || !lastName || !email || !message || !consent) {
    return NextResponse.json(
      { error: "Bitte fülle alle Pflichtfelder aus." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
      { status: 400 },
    );
  }

  try {
    await createSubmission({ type: "contact", firstName, lastName, email, message });
  } catch (err) {
    console.error("Kontaktformular: Speichern in Firestore fehlgeschlagen", err);
    return NextResponse.json(
      { error: "Etwas ist schiefgelaufen. Bitte versuche es erneut." },
      { status: 500 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;

  if (!apiKey || !to) {
    console.error(
      "Kontaktformular: RESEND_API_KEY oder CONTACT_EMAIL_TO fehlt in .env.local",
    );
    return NextResponse.json({ success: true });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: process.env.CONTACT_EMAIL_FROM ?? MAIL_FROM,
    to,
    replyTo: email,
    subject: `Neue Nachricht von ${firstName} ${lastName}`,
    text: `Name: ${firstName} ${lastName}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
  });

  if (error) {
    console.error("Kontaktformular: Resend-Fehler", error);
  }

  return NextResponse.json({ success: true });
}
