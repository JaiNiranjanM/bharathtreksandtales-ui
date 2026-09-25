import { NextResponse, type NextRequest } from "next/server";

// Lightweight auth guard for client-persisted sessions.
// The JWT lives in the Zustand persist store (localStorage), which the
// middleware cannot read — so we check for a `btt_token` cookie (set on
// login/signup when available) and otherwise let the page's client-side
// guard render the "Please log in" state. Direct navigation to protected
// routes without any session cookie redirects to /login.
const PROTECTED_PREFIXES = ["/profile", "/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("btt_token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*"],
};
