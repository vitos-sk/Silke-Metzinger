import { createHash } from "node:crypto";
import { getDb } from "@/lib/firebaseAdmin";

// Gemeinsame Zaehler-Mechanik fuer alle Limits. Sie liegt in Firestore und
// nicht im Arbeitsspeicher: Auf Vercel laufen mehrere Funktionsinstanzen
// parallel und werden staendig neu gestartet. Ein Zaehler im Speicher wuerde
// pro Instanz einzeln zaehlen — bei zehn Instanzen waeren aus "5 Versuche"
// faktisch 50, und ein Neustart setzte alles zurueck.

const COLLECTION = "rateLimits";

// Wer gerade gesperrt ist, merken wir uns zusaetzlich im Speicher der Instanz.
// Dann kostet ein laufender Angriff keine Firestore-Zugriffe mehr. Das ist nur
// eine Abkuerzung — die verbindliche Antwort steht weiterhin in Firestore.
const blockedUntil = new Map<string, number>();

// Der Schluessel (meist eine IP) wird nur als Hash gespeichert: fuer die
// Zaehlung reicht das und es landet keine personenbezogene Adresse in der
// Datenbank.
function bucketId(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

function docRef(key: string) {
  return getDb().collection(COLLECTION).doc(bucketId(key));
}

function readWindow(data: FirebaseFirestore.DocumentData | undefined) {
  return {
    windowStart: typeof data?.windowStart === "number" ? data.windowStart : 0,
    count: typeof data?.count === "number" ? data.count : 0,
  };
}

/**
 * Ein Kontingent verbrauchen — fuer Aktionen, bei denen jeder Aufruf zaehlt
 * (Formularversand). Gibt false zurueck, wenn das Limit erreicht ist.
 *
 * Faellt Firestore aus, lassen wir die Anfrage bewusst durch: Ein kaputtes
 * Kontaktformular waere schlimmer als ein paar ungebremste Anfragen.
 */
export async function consumeQuota(
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const now = Date.now();

  const blocked = blockedUntil.get(key);
  if (blocked !== undefined) {
    if (blocked > now) return false;
    blockedUntil.delete(key);
  }

  const db = getDb();
  const ref = docRef(key);

  try {
    return await db.runTransaction(async (tx) => {
      const snapshot = await tx.get(ref);
      const { windowStart, count } = readWindow(snapshot.data());

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

/**
 * Prueft, ob ein Schluessel gerade gesperrt ist — ohne etwas zu verbrauchen.
 *
 * Fuer Anmeldeversuche gibt es zwei getrennte Schritte: Hier wird nur gelesen,
 * gezaehlt wird ausschliesslich bei einem Fehlversuch. Sonst wuerde sich Silke
 * mit fuenf ganz normalen Anmeldungen selbst aussperren.
 */
export async function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const now = Date.now();

  const blocked = blockedUntil.get(key);
  if (blocked !== undefined) {
    if (blocked > now) return true;
    blockedUntil.delete(key);
  }

  try {
    const snapshot = await docRef(key).get();
    const { windowStart, count } = readWindow(snapshot.data());

    if (now - windowStart >= windowMs) return false;
    if (count < limit) return false;

    blockedUntil.set(key, windowStart + windowMs);
    return true;
  } catch (error) {
    // Gleiche Haltung wie oben: Bei einem Datenbankausfall lieber durchlassen
    // als die Anmeldung komplett blockieren.
    console.error("Rate-Limit: Firestore nicht erreichbar, Versuch wird durchgelassen", error);
    return false;
  }
}

/** Einen Fehlversuch zaehlen. */
export async function recordFailure(key: string, windowMs: number): Promise<void> {
  const now = Date.now();
  const db = getDb();
  const ref = docRef(key);

  try {
    await db.runTransaction(async (tx) => {
      const snapshot = await tx.get(ref);
      const { windowStart, count } = readWindow(snapshot.data());

      if (now - windowStart >= windowMs) {
        tx.set(ref, { windowStart: now, count: 1, expiresAt: new Date(now + 2 * windowMs) });
        return;
      }

      tx.set(ref, {
        windowStart,
        count: count + 1,
        expiresAt: new Date(windowStart + 2 * windowMs),
      });
    });
  } catch (error) {
    console.error("Rate-Limit: Fehlversuch konnte nicht gezaehlt werden", error);
  }
}

/** Nach einer erfolgreichen Anmeldung: Zaehler zuruecksetzen. */
export async function clearFailures(key: string): Promise<void> {
  blockedUntil.delete(key);

  try {
    await docRef(key).delete();
  } catch (error) {
    console.error("Rate-Limit: Zaehler konnte nicht zurueckgesetzt werden", error);
  }
}

/** IP der Anfrage — hinter dem Vercel-Proxy steht sie im x-forwarded-for. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
