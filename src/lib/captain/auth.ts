import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, isFirebaseConfigured } from "../firebase/admin";
import { getBatch, getCaptain } from "./store";
import type { BatchDoc, CaptainDoc } from "./core";

export const CAPTAIN_COOKIE = "btt_captain_session";
export const CAPTAIN_SESSION_MS = 2 * 24 * 60 * 60 * 1000; // 2 days

export interface CaptainSession {
  uid: string;
  email: string;
  name: string;
}

/** The signed-in captain, or null. Checks the login, the captain role and that the account is still active. */
export async function getCaptainSession(): Promise<CaptainSession | null> {
  if (!isFirebaseConfigured()) return null;
  const cookie = (await cookies()).get(CAPTAIN_COOKIE)?.value;
  if (!cookie) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(cookie, true);
    if (decoded.role !== "captain") return null;
    const captain = await getCaptain(decoded.uid);
    if (!captain || !captain.active) return null;
    return { uid: captain.uid, email: captain.email, name: captain.name };
  } catch {
    return null;
  }
}

/** For captain pages: sends visitors who are not signed in to the login page. */
export async function requireCaptainPage() {
  const session = await getCaptainSession();
  if (!session) redirect("/captain/login");
  return session;
}

/** A batch the captain is assigned to, or null when it doesn't exist or isn't theirs. */
export async function getBatchForCaptain(batchId: string, uid: string): Promise<BatchDoc | null> {
  const batch = await getBatch(batchId);
  return batch && batch.captainUids.includes(uid) ? batch : null;
}

export type { CaptainDoc };
