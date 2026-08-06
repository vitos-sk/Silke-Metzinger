import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { getQuestionnaire, renderQuestionnaireEmail } from "@/lib/questionnaire";
import { getSubmission, markQuestionsSent } from "@/lib/submissions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const submission = await getSubmission(id);
  if (!submission || submission.type !== "lead-magnet") {
    return NextResponse.json({ error: "Anfrage nicht gefunden." }, { status: 404 });
  }

  const questionnaire = await getQuestionnaire();
  if (questionnaire.questions.every((question) => !question.trim())) {
    return NextResponse.json(
      { error: "Die Vorlage ist noch leer — bitte zuerst die Fragen anlegen." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Reflexionsfragen: RESEND_API_KEY fehlt in .env.local");
    return NextResponse.json(
      { error: "E-Mail-Versand ist nicht konfiguriert (RESEND_API_KEY fehlt)." },
      { status: 500 },
    );
  }

  const { subject, text, html } = renderQuestionnaireEmail(questionnaire, submission.fullName);
  const resend = new Resend(apiKey);

  // Testbetrieb: Solange keine eigene Domain bei Resend verifiziert ist, dürfen
  // nur E-Mails an die eigene Adresse rausgehen. TEST_EMAIL_REDIRECT lenkt den
  // Versand dorthin um — in Produktion die Variable einfach weglassen.
  const testRecipient = process.env.TEST_EMAIL_REDIRECT;
  const recipient = testRecipient || submission.email;
  const finalSubject = testRecipient ? `[TEST → ${submission.email}] ${subject}` : subject;

  const { error } = await resend.emails.send({
    from: process.env.CONTACT_EMAIL_FROM ?? "Website <onboarding@resend.dev>",
    to: recipient,
    replyTo: process.env.LEAD_MAGNET_EMAIL_TO ?? "info.silke-metzinger@gmx.ch",
    subject: finalSubject,
    text,
    html,
  });

  if (error) {
    console.error("Reflexionsfragen: Resend-Fehler", error);
    return NextResponse.json(
      { error: "Die E-Mail konnte nicht versendet werden." },
      { status: 502 },
    );
  }

  const sentAt = Date.now();
  await markQuestionsSent(id, sentAt);
  revalidatePath("/admin");

  return NextResponse.json({ ok: true, sentAt });
}
