import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, isFirebaseConfigured } from "./firebase/admin";

export const SESSION_COOKIE = "btt_admin_session";
export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export function isAdminEmail(email: string | undefined | null) {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(admin && email && email.toLowerCase() === admin);
}

/** Returns the admin's email if the request carries a valid admin session, else null. */
export async function getAdminSession(): Promise<{ email: string } | null> {
  if (!isFirebaseConfigured()) return null;
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(cookie, true);
    if (!isAdminEmail(decoded.email)) return null;
    return { email: decoded.email! };
  } catch {
    return null;
  }
}

/** For admin pages: redirects to the login page when not signed in. */
export async function requireAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
