import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

// Schutz der oeffentlichen Formulare (Kontakt, Lead-Magnet) gegen Bots und
// Massenversand. Ohne diesen Schutz koennte ein Skript beliebig viele
// Anfragen schicken: Das Firestore-Postfach laeuft voll und das
// Resend-Kontingent ist aufgebraucht, bevor eine echte Anfrage ankommt.

const RATE_LIMIT_COLLECTION = "rateLimits";
const HOUR_MS = 60 * 60 * 1000;

// Pro Absender: 5 Anfragen pro Stunde. Wer das Formular ernst meint,
// braucht nicht mehr.
const PER_IP_LIMIT = 5;
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

// Wer gerade gesperrt ist, merken wir uns im Speicher der Funktionsinstanz.
// Dann kostet ein laufender Angriff keine Firestore-Zugriffe mehr.
const blockedUntil = new Map<string, number>();

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

// Die IP wird nur als Hash gespeichert - fuer die Zaehlung reicht das und
// es landet keine personenbezogene Adresse in der Datenbank.
function bucketId(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

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

// Ein Kontingent verbrauchen. Gibt false zurueck, wenn das Limit erreicht ist.
// Faellt Firestore aus, lassen wir die Anfrage bewusst durch: Ein kaputtes
// Kontaktformular waere schlimmer als ein paar ungebremste Anfragen.
async function consumeQuota(key: string, limit: number, windowMs: number): Promise<boolean> {
  const now = Date.now();

  const blocked = blockedUntil.get(key);
  if (blocked !== undefined) {
    if (blocked > now) return false;
    blockedUntil.delete(key);
  }

  const db = getDb();
  const ref = db.collection(RATE_LIMIT_COLLECTION).doc(bucketId(key));

  try {
    return await db.runTransaction(async (tx) => {
      const snapshot = await tx.get(ref);
      const data = snapshot.data();
      const windowStart = typeof data?.windowStart === "number" ? data.windowStart : 0;
      const count = typeof data?.count === "number" ? data.count : 0;

      // Fenster abgelaufen: neu zaehlen.
      if (now - windowStart >= windowMs) {
        tx.set(ref, { windowStart: now, count: 1, expiresAt: new Date(now + 2 * windowMs) });
        return true;
      }

      if (count >= limit) {
        blockedUntil.set(key, windowStart + windowMs);
        return false;
      }

      tx.set(ref, {
        windowStart,
        count: count + 1,
        expiresAt: new Date(windowStart + 2 * windowMs),
      });
      return true;
    });
  } catch (error) {
    console.error("Rate-Limit: Firestore nicht erreichbar, Anfrage wird durchgelassen", error);
    return true;
  }
}

export type GuardResult = { ok: true } | { ok: false; status: number; error: string };

const TOO_MANY = {
  ok: false as const,
  status: 429,
  error: "Zu viele Anfragen. Bitte versuche es später noch einmal.",
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
