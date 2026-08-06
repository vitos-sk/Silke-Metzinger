import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import {
  GATE_COOKIE_NAME,
  GATE_MAX_AGE,
  GATE_QUERY_PARAM,
  createGateToken,
  safeCompareKey,
  verifyGateToken,
} from "@/lib/gate";

// Diese Pfade brauchen keine Session (aber weiterhin einen gültigen Gate-Key),
// sonst käme man an ein vergessenes Passwort nie heran.
const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/login",
  "/admin/reset-password",
  "/api/admin/login",
  "/api/admin/forgot-password",
  "/api/admin/reset-password",
]);

function setGateCookie(response: NextResponse, token: string) {
  response.cookies.set(GATE_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Lax statt Strict: Der Gate-Link wird oft aus anderen Apps (Messenger, Mail)
    // geöffnet, die Strict-Cookies beim Redirect auf Mobilgeräten nicht zuverlässig speichern.
    sameSite: "lax",
    path: "/",
    maxAge: GATE_MAX_AGE,
  });
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Das gesamte Admin-Areal ist ohne gültigen Gate-Key/-Cookie unsichtbar (404),
  // damit /admin und /admin/login nicht einfach erraten/gescannt werden können.
  const gateCookieToken = request.cookies.get(GATE_COOKIE_NAME)?.value;
  let gateOk = gateCookieToken ? await verifyGateToken(gateCookieToken) : false;

  const providedKey = searchParams.get(GATE_QUERY_PARAM);
  let justGated = false;
  if (!gateOk && providedKey) {
    const expectedKey = process.env.ADMIN_GATE_KEY;
    gateOk = expectedKey ? await safeCompareKey(providedKey, expectedKey) : false;
    justGated = gateOk;
  }

  if (!gateOk) {
    return new NextResponse(null, { status: 404 });
  }

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    let response: NextResponse;
    if (justGated && !pathname.startsWith("/api/")) {
      // Den Gate-Key aus der Adresszeile entfernen, alle anderen Parameter
      // (z. B. das Reset-Token) bleiben erhalten.
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete(GATE_QUERY_PARAM);
      response = NextResponse.redirect(cleanUrl);
    } else {
      response = NextResponse.next();
    }
    if (justGated) {
      setGateCookie(response, await createGateToken());
    }
    return response;
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isValid = token ? await verifySessionToken(token) : false;

  if (!isValid) {
    let response: NextResponse;
    if (pathname.startsWith("/api/")) {
      response = NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    } else {
      const loginUrl = new URL("/admin/login", request.url);
      if (pathname !== "/admin") {
        loginUrl.searchParams.set("next", pathname);
      }
      response = NextResponse.redirect(loginUrl);
    }
    if (justGated) {
      setGateCookie(response, await createGateToken());
    }
    return response;
  }

  const response = NextResponse.next();
  if (justGated) {
    setGateCookie(response, await createGateToken());
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
