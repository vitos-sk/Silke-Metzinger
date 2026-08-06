import { NextResponse } from "next/server";
import {
  PASSWORD_MIN_LENGTH,
  getAdminAccount,
  isValidEmail,
  normalizeEmail,
  updateAdminAccount,
  verifyPassword,
} from "@/lib/adminAccount";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/session";

// Zugriff ist bereits durch die Middleware (Gate + Session) abgesichert.
export async function GET() {
  try {
    const account = await getAdminAccount();
    return NextResponse.json({ email: account?.email ?? "" });
  } catch (error) {
    console.error("Admin-Konto konnte nicht gelesen werden:", error);
    return NextResponse.json({ error: "Konto konnte nicht geladen werden" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const { currentPassword, email, newPassword } = body as Record<string, unknown>;

  if (typeof currentPassword !== "string" || !currentPassword) {
    return NextResponse.json({ error: "Aktuelles Passwort fehlt" }, { status: 400 });
  }

  const nextEmail = typeof email === "string" && email.trim() ? normalizeEmail(email) : null;
  const nextPassword = typeof newPassword === "string" && newPassword ? newPassword : null;

  if (!nextEmail && !nextPassword) {
    return NextResponse.json({ error: "Keine Änderungen angegeben" }, { status: 400 });
  }

  if (nextEmail && !isValidEmail(nextEmail)) {
    return NextResponse.json({ error: "Bitte eine gültige E-Mail angeben" }, { status: 400 });
  }

  if (nextPassword && nextPassword.length < PASSWORD_MIN_LENGTH) {
    return NextResponse.json(
      { error: `Das neue Passwort braucht mindestens ${PASSWORD_MIN_LENGTH} Zeichen` },
      { status: 400 },
    );
  }

  try {
    const account = await getAdminAccount();
    if (!account) {
      return NextResponse.json({ error: "Kein Admin-Konto vorhanden" }, { status: 500 });
    }

    const passwordOk = await verifyPassword(currentPassword, account.passwordHash);
    if (!passwordOk) {
      return NextResponse.json({ error: "Aktuelles Passwort ist falsch" }, { status: 401 });
    }

    const updated = await updateAdminAccount({
      email: nextEmail ?? undefined,
      password: nextPassword ?? undefined,
    });

    const response = NextResponse.json({ ok: true, email: updated.email });

    // Frische Session setzen, damit die laufende Sitzung nach der Änderung
    // nicht mittendrin ablaeuft.
    const token = await createSessionToken();
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error("Admin-Konto konnte nicht gespeichert werden:", error);
    return NextResponse.json({ error: "Speichern fehlgeschlagen" }, { status: 500 });
  }
}
