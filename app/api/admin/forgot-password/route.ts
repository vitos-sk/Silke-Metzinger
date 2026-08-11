import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminAccount, normalizeEmail } from "@/lib/adminAccount";
import { RESET_LINK_VALID_MINUTES, createResetToken } from "@/lib/passwordReset";
import { GATE_QUERY_PARAM } from "@/lib/gate";
import { consumeQuota, getClientIp } from "@/lib/rateLimit";
import { MAIL_FROM, SITE_URL } from "@/lib/site";

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 15 * 60 * 1000;

// Hier zaehlt jeder Aufruf, nicht nur Fehlversuche: Ein Reset-Link kostet
// eine Mail aus dem Resend-Kontingent, egal ob die Adresse stimmt.
// Der Zaehler liegt in Firestore und gilt fuer alle Funktionsinstanzen.

function buildResetLink(request: Request, token: string): string {
  // Der Admin-Bereich ist hinter dem Gate versteckt, deshalb muss der
  // Gate-Key mit in den Link — sonst landet Silke auf einer 404-Seite.
  const origin = new URL(request.url).origin || SITE_URL;
  const url = new URL("/admin/reset-password", origin);
  url.searchParams.set("token", token);
  const gateKey = process.env.ADMIN_GATE_KEY;
  if (gateKey) {
    url.searchParams.set(GATE_QUERY_PARAM, gateKey);
  }
  return url.toString();
}

function renderEmail(link: string) {
  const text =
    "Hallo Silke,\n\n" +
    "du hast ein neues Passwort für den Admin-Bereich angefordert.\n\n" +
    `Hier kannst du es setzen (Link ${RESET_LINK_VALID_MINUTES} Minuten gültig):\n${link}\n\n` +
    "Falls du das nicht warst, kannst du diese E-Mail einfach ignorieren — " +
    "dein aktuelles Passwort bleibt dann unverändert.";

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Helvetica, Arial, sans-serif; color: #3d3a36; line-height: 1.6;">
      <p>Hallo Silke,</p>
      <p>du hast ein neues Passwort für den Admin-Bereich angefordert.</p>
      <p style="margin: 24px 0;">
        <a href="${link}" style="background: #8faf8a; color: #fdfbf7; padding: 12px 22px; border-radius: 999px; text-decoration: none; display: inline-block;">
          Neues Passwort setzen
        </a>
      </p>
      <p style="font-size: 14px; color: #6b6660;">
        Der Link ist ${RESET_LINK_VALID_MINUTES} Minuten gültig und kann nur einmal verwendet werden.
      </p>
      <p style="font-size: 14px; color: #6b6660;">
        Falls du das nicht warst, ignoriere diese E-Mail einfach — dein aktuelles Passwort bleibt unverändert.
      </p>
    </div>
  `;

  return { text, html };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const allowed = await consumeQuota(`admin-forgot:${ip}`, MAX_ATTEMPTS, WINDOW_MS);

  if (!allowed) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte in 15 Minuten erneut versuchen." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const email = normalizeEmail((body as { email?: unknown } | null)?.email);

  // Immer dieselbe Antwort, damit über diese Route nicht herausgefunden werden
  // kann, welche E-Mail-Adresse hinterlegt ist.
  const genericResponse = NextResponse.json({ ok: true });

  if (!email) return genericResponse;

  try {
    const account = await getAdminAccount();
    if (!account || account.email !== email) return genericResponse;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Passwort-Reset: RESEND_API_KEY fehlt");
      return NextResponse.json(
        { error: "E-Mail-Versand ist nicht konfiguriert." },
        { status: 500 },
      );
    }

    const token = await createResetToken(account);
    const { text, html } = renderEmail(buildResetLink(request, token));

    // Testbetrieb wie beim Fragen-Versand: siehe TEST_EMAIL_REDIRECT.
    const testRecipient = process.env.TEST_EMAIL_REDIRECT;
    const subject = "Neues Passwort für den Admin-Bereich";

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM ?? MAIL_FROM,
      to: testRecipient || account.email,
      subject: testRecipient ? `[TEST → ${account.email}] ${subject}` : subject,
      text,
      html,
    });

    if (error) {
      console.error("Passwort-Reset: Resend-Fehler", error);
      return NextResponse.json(
        { error: "Die E-Mail konnte nicht versendet werden." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Passwort-Reset fehlgeschlagen:", error);
    return NextResponse.json({ error: "Anfrage fehlgeschlagen." }, { status: 500 });
  }

  return genericResponse;
}
