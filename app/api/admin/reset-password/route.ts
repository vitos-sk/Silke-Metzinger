import { NextResponse } from "next/server";
import { PASSWORD_MIN_LENGTH, updateAdminAccount } from "@/lib/adminAccount";
import { verifyResetToken } from "@/lib/passwordReset";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = typeof (body as { token?: unknown })?.token === "string"
    ? ((body as { token: string }).token)
    : "";
  const password = typeof (body as { password?: unknown })?.password === "string"
    ? ((body as { password: string }).password)
    : "";

  if (!token) {
    return NextResponse.json({ error: "Link ungültig oder abgelaufen." }, { status: 400 });
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return NextResponse.json(
      { error: `Das neue Passwort braucht mindestens ${PASSWORD_MIN_LENGTH} Zeichen.` },
      { status: 400 },
    );
  }

  try {
    const account = await verifyResetToken(token);
    if (!account) {
      return NextResponse.json(
        { error: "Der Link ist abgelaufen oder wurde bereits verwendet." },
        { status: 401 },
      );
    }

    await updateAdminAccount({ password });
    return NextResponse.json({ ok: true, email: account.email });
  } catch (error) {
    console.error("Passwort-Reset fehlgeschlagen:", error);
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}
