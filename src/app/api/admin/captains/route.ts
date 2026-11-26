import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { captainsCol } from "@/lib/captain/store";
import { captainInputSchema } from "@/lib/captain/schemas";
import { adminOnly, fail, zodMessage } from "@/lib/captain/http";

/** Creates a captain login. The captain sets their own password through the returned link. */
export async function POST(request: Request) {
  const denied = await adminOnly();
  if (denied) return denied;
  const parsed = captainInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(zodMessage(parsed.error));
  const { name, email, phone } = parsed.data;

  let uid: string;
  try {
    // A random password nobody knows; the captain chooses a real one from the link below.
    const user = await adminAuth().createUser({
      email,
      displayName: name,
      password: randomBytes(24).toString("base64url"),
    });
    uid = user.uid;
  } catch (err) {
    if ((err as { code?: string }).code === "auth/email-already-exists") {
      return fail("A login with this email already exists.", 409);
    }
    console.error("Could not create captain", err);
    return fail("Could not create the login. Please try again.", 500);
  }

  await adminAuth().setCustomUserClaims(uid, { role: "captain" });
  await captainsCol().doc(uid).set({ name, email, phone, active: true, createdAt: Date.now() });
  const resetLink = await adminAuth().generatePasswordResetLink(email);
  return NextResponse.json({ uid, resetLink });
}
