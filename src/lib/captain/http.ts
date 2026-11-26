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

/** Returns an error response when the caller is not the signed-in admin, otherwise null. */
export async function adminOnly() {
  return (await getAdminSession()) ? null : fail("Not signed in", 401);
}
