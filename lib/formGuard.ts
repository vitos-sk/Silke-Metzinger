import type { NextRequest } from "next/server";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { consumeQuota, getClientIp } from "@/lib/rateLimit";

// Schutz der oeffentlichen Formulare (Kontakt, Lead-Magnet) gegen Bots und
// Massenversand. Ohne diesen Schutz koennte ein Skript beliebig viele
// Anfragen schicken: Das Firestore-Postfach laeuft voll und das
// Resend-Kontingent ist aufgebraucht, bevor eine echte Anfrage ankommt.
//
// Die Zaehler-Mechanik selbst steht in lib/rateLimit.ts — sie wird auch vom
// Admin-Login genutzt.

const HOUR_MS = 60 * 60 * 1000;

// Pro Absender: 20 Anfragen pro Stunde. Bewusst grosszuegig, denn hinter einer
// IP koennen viele Menschen stehen — Mobilfunk, Buero, Hotel-WLAN teilen sich
// eine Adresse. Bei einem knappen Limit sperrt der erste Neugierige die
// naechste echte Anfrage aus, und eine verlorene Anfrage waegt schwerer als
// ein paar zusaetzliche Mails.
const PER_IP_LIMIT = 20;
// Fuer die ganze Seite: Notbremse gegen verteilte Angriffe von vielen IPs,
// damit das Resend-Kontingent (100 Mails/Tag) nicht in Minuten verbrennt.
const GLOBAL_LIMIT = 80;

// Laengengrenzen, damit niemand riesige Texte in Firestore ablegt.
export const FIELD_LIMITS = {
  name: 80,
  fullName: 120,
  email: 200,
  message: 5000,
} as const;

export { getClientIp };

// Text saeubern: Rand-Leerzeichen weg, harte Laengengrenze.
export function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Body einlesen, ohne dass kaputtes JSON die Route mit einem 500er beendet.
export async function readJsonBody(request: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return null;
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

// Honeypot: Ist das unsichtbare Feld gefuellt, war es kein Mensch.
export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}

export type GuardResult = { ok: true } | { ok: false; status: number; error: string };

// Wer hier landet, ist meistens kein Bot, sondern ein Mensch hinter einer
// geteilten IP. Darum nennt die Meldung einen zweiten Weg — sonst ist die
// Anfrage verloren.
const TOO_MANY = {
  ok: false as const,
  status: 429,
  error:
    "Das Formular wurde von hier aus gerade sehr oft abgeschickt. " +
    "Bitte versuche es in einer Stunde noch einmal — oder schreib direkt an info.silke-metzinger@gmx.ch.",
};

// Vollstaendige Pruefung fuer ein oeffentliches Formular.
export async function guardPublicForm(
  request: NextRequest,
  body: Record<string, unknown>,
): Promise<GuardResult> {
  if (isHoneypotFilled(body)) {
    // Bots bekommen keinen Hinweis darauf, dass sie erkannt wurden.
    return { ok: false, status: 200, error: "" };
  }

  const ip = getClientIp(request);

  if (!(await consumeQuota(`ip:${ip}`, PER_IP_LIMIT, HOUR_MS))) return TOO_MANY;
  if (!(await consumeQuota("global", GLOBAL_LIMIT, HOUR_MS))) return TOO_MANY;

  return { ok: true };
}
