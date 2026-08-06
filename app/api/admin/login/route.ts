import { NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/adminAccount";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/session";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Reines In-Memory-Limit: bremst Brute-Force auf einer laufenden Instanz.
// Bietet keinen Schutz mehr, sobald mehrere Serverless-Instanzen parallel laufen.
const attempts = new Map<string, { count: number; windowStart: number }>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const entry = attempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.windowStart > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string) {
  const entry = attempts.get(ip);
  if (!entry || Date.now() - entry.windowStart > WINDOW_MS) {
    attempts.set(ip, { count: 1, windowStart: Date.now() });
  } else {
    entry.count += 1;
  }
}

function clearAttempts(ip: string) {
  attempts.delete(ip);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
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
    recordFailedAttempt(ip);
    // Bewusst keine Unterscheidung zwischen falscher E-Mail und falschem Passwort.
    return NextResponse.json({ error: "E-Mail oder Passwort ist falsch" }, { status: 401 });
  }

  clearAttempts(ip);

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
