import { NextResponse } from "next/server";
import { z } from "zod";
import { adminAuth } from "@/lib/firebase/admin";
import { captainsCol, getCaptain } from "@/lib/captain/store";
import { adminOnly, fail } from "@/lib/captain/http";

const bodySchema = z.object({ action: z.enum(["resetLink", "deactivate", "activate"]) });

export async function POST(request: Request, { params }: { params: Promise<{ uid: string }> }) {
  const denied = await adminOnly();
  if (denied) return denied;
  const { uid } = await params;
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Unknown action");
  const captain = await getCaptain(uid);
  if (!captain) return fail("Captain not found", 404);

  switch (parsed.data.action) {
    case "resetLink": {
      const resetLink = await adminAuth().generatePasswordResetLink(captain.email);
      return NextResponse.json({ resetLink });
    }
    case "deactivate":
      // Disabling the login and revoking sessions locks the captain out straight away.
      await adminAuth().updateUser(uid, { disabled: true });
      await adminAuth().revokeRefreshTokens(uid);
      await captainsCol().doc(uid).update({ active: false });
      return NextResponse.json({ ok: true });
    case "activate":
      await adminAuth().updateUser(uid, { disabled: false });
      await captainsCol().doc(uid).update({ active: true });
      return NextResponse.json({ ok: true });
  }
}
