import { NextResponse } from "next/server";
import { batchInputSchema } from "@/lib/captain/schemas";
import { batchRef, listCaptains } from "@/lib/captain/store";
import { adminOnly, fail, zodMessage } from "@/lib/captain/http";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  const denied = await adminOnly();
  if (denied) return denied;
  const parsed = batchInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(zodMessage(parsed.error));

  const known = new Set((await listCaptains()).filter((c) => c.active).map((c) => c.uid));
  if (parsed.data.captainUids.some((u) => !known.has(u))) return fail("Pick captains from the list.");

  const ref = adminDb().collection("batches").doc();
  const now = Date.now();
  await batchRef(ref.id).set({
    ...parsed.data,
    travellerCount: 0,
    joinToken: null,
    joinOpen: false,
    pendingCount: 0,
    accessGrantedAt: null,
    settledAt: null,
    settleNote: "",
    createdAt: now,
    updatedAt: now,
  });
  return NextResponse.json({ id: ref.id });
}
