import { NextResponse } from "next/server";
import { z } from "zod";
import { batchInputSchema } from "@/lib/captain/schemas";
import {
  batchRef,
  deleteBatchCompletely,
  getBatch,
  refreshTravellerCounts,
  listAdvances,
  listCaptains,
  listExpenseDocs,
  listSettlements,
} from "@/lib/captain/store";
import { summarizeMoney } from "@/lib/captain/core";
import { newJoinToken } from "@/lib/captain/registration";
import { adminOnly, fail, zodMessage } from "@/lib/captain/http";

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("update"), batch: batchInputSchema }),
  z.object({ action: z.literal("createJoinLink") }),
  z.object({ action: z.literal("rotateJoinLink") }),
  z.object({ action: z.literal("setJoinOpen"), open: z.boolean() }),
  z.object({ action: z.literal("grantAccess") }),
  z.object({ action: z.literal("revokeAccess") }),
  z.object({
    action: z.literal("markSettled"),
    note: z.string().trim().max(500).default(""),
    /** Set when the admin confirmed the money does not balance to zero. */
    acceptUnbalanced: z.boolean().default(false),
  }),
  z.object({ action: z.literal("reopen") }),
  z.object({ action: z.literal("delete") }),
]);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminOnly();
  if (denied) return denied;
  const { id } = await params;
  const batch = await getBatch(id);
  if (!batch) return fail("Batch not found", 404);
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(zodMessage(parsed.error));
  const body = parsed.data;
  const now = Date.now();

  switch (body.action) {
    case "update": {
      const known = new Set((await listCaptains()).map((c) => c.uid));
      if (body.batch.captainUids.some((u) => !known.has(u))) return fail("Pick captains from the list.");
      await batchRef(id).update({ ...body.batch, updatedAt: now });
      // Batches made before seat counting existed get their counts filled in here.
      await refreshTravellerCounts(id);
      return NextResponse.json({ ok: true });
    }
    case "createJoinLink":
      // Keep the existing link if there is one, so sharing it twice never breaks the first one.
      if (!batch.joinToken) await batchRef(id).update({ joinToken: newJoinToken(), joinOpen: true, updatedAt: now });
      return NextResponse.json({ ok: true });
    case "rotateJoinLink":
      // A new code: the old link stops working at once.
      await batchRef(id).update({ joinToken: newJoinToken(), joinOpen: true, updatedAt: now });
      return NextResponse.json({ ok: true });
    case "setJoinOpen":
      if (!batch.joinToken) return fail("Create the registration link first.");
      await batchRef(id).update({ joinOpen: body.open, updatedAt: now });
      return NextResponse.json({ ok: true });
    case "grantAccess":
      if (batch.captainUids.length === 0) return fail("Assign at least one captain first.");
      await batchRef(id).update({ accessGrantedAt: now, updatedAt: now });
      return NextResponse.json({ ok: true });
    case "revokeAccess":
      await batchRef(id).update({ accessGrantedAt: null, updatedAt: now });
      return NextResponse.json({ ok: true });
    case "markSettled": {
      const [advances, expenses, settlements] = await Promise.all([
        listAdvances(id),
        listExpenseDocs(id),
        listSettlements(id),
      ]);
      if (expenses.some((e) => e.status === "pending")) {
        return fail("Approve or reject the pending expense claims first.", 409);
      }
      const money = summarizeMoney(advances, expenses, settlements);
      if (Math.abs(money.outstanding) >= 0.005 && !body.acceptUnbalanced) {
        return fail(
          "The money does not balance to zero yet. Record the settlement payment, or confirm to close anyway.",
          409
        );
      }
      await batchRef(id).update({ settledAt: now, settleNote: body.note, updatedAt: now });
      return NextResponse.json({ ok: true });
    }
    case "reopen":
      await batchRef(id).update({ settledAt: null, settleNote: "", updatedAt: now });
      return NextResponse.json({ ok: true });
    case "delete":
      await deleteBatchCompletely(id);
      return NextResponse.json({ ok: true });
  }
}
