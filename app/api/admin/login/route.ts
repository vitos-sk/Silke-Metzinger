import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/session";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (typeof password !== "string" || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
