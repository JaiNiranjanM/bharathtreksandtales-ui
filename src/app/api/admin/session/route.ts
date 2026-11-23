import { NextResponse } from "next/server";
import { adminAuth, isFirebaseConfigured } from "@/lib/firebase/admin";
import { isAdminEmail, SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/auth";

/** Exchanges a Firebase ID token for an httpOnly admin session cookie. */
export async function POST(request: Request) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase is not configured on the server." }, { status: 500 });
  }
  const { idToken } = (await request.json().catch(() => ({}))) as { idToken?: string };
  if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  try {
    const decoded = await adminAuth().verifyIdToken(idToken);
    if (!isAdminEmail(decoded.email)) {
      return NextResponse.json({ error: "This account is not an admin." }, { status: 403 });
    }
    // Require a recent sign-in before minting a long-lived session.
    if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
      return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
    }
    const sessionCookie = await adminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid sign-in. Please try again." }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
