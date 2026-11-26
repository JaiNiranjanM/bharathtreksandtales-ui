import "server-only";
import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { getAdminSession } from "../auth";

export const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

/** The first validation problem, in plain words. */
export function zodMessage(err: ZodError) {
  const issue = err.issues[0];
  if (!issue) return "Invalid request";
  const where = issue.path.filter((p) => typeof p === "string").join(" ");
  return where && !issue.message.toLowerCase().includes(where.toLowerCase())
    ? `${where}: ${issue.message}`
    : issue.message;
}

/** The site's own address (for links in alerts). Set SITE_URL to be exact; otherwise it is read from the request. */
export function siteOrigin(request: Request) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "localhost:3000";
  return `${request.headers.get("x-forwarded-proto") ?? "https"}://${host}`;
}

/** Returns an error response when the caller is not the signed-in admin, otherwise null. */
export async function adminOnly() {
  return (await getAdminSession()) ? null : fail("Not signed in", 401);
}
