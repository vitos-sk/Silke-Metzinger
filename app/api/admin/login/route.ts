import { NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/adminAccount";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/session";
import { clearFailures, getClientIp, isRateLimited, recordFailure } from "@/lib/rateLimit";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Der Zaehler liegt in Firestore (lib/rateLimit.ts) und damit fuer alle
// Funktionsinstanzen gemeinsam. Gezaehlt werden nur Fehlversuche; nach einer
// erfolgreichen Anmeldung wird der Zaehler geloescht.
function attemptKey(ip: string): string {
  return `admin-login:${ip}`;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const key = attemptKey(ip);

  if (await isRateLimited(key, MAX_ATTEMPTS, WINDOW_MS)) {
    return NextResponse.json(
      { error: "Zu viele Versuche. Bitte in 15 Minuten erneut versuchen." },
      { status: 429 },
    );
  }

  const { email, password } = await request.json();

  let ok = false;
  if (typeof email === "string" && typeof password === "string" && email && password) {
    try {
      ok = await verifyCredentials(email, password);
    } catch (error) {
      console.error("Admin-Login fehlgeschlagen:", error);
      return NextResponse.json(
        { error: "Anmeldung derzeit nicht möglich. Bitte später erneut versuchen." },
        { status: 500 },
      );
    }
  }

  if (!ok) {
    await recordFailure(key, WINDOW_MS);
    // Bewusst keine Unterscheidung zwischen falscher E-Mail und falschem Passwort.
    return NextResponse.json({ error: "E-Mail oder Passwort ist falsch" }, { status: 401 });
  }

  await clearFailures(key);

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Lax statt Strict: siehe middleware.ts (Gate-Cookie) - mobile Browser
    // (v. a. iOS Safari nach App-Wechsel/Neustart) senden Strict-Cookies bei
    // Top-Level-Navigationen nicht zuverlässig, was ungewollte Logouts verursacht.
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
