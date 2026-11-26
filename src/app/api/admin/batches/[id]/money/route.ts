import { NextResponse } from "next/server";
import { z } from "zod";
import { advanceSchema, decisionSchema, settlementSchema } from "@/lib/captain/schemas";
import { batchRef, getBatch, getExpense } from "@/lib/captain/store";
import { adminOnly, fail, zodMessage } from "@/lib/captain/http";

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("addAdvance"), advance: advanceSchema }),
  z.object({ action: z.literal("deleteAdvance"), id: z.string().min(1) }),
  z.object({ action: z.literal("addSettlement"), settlement: settlementSchema }),
  z.object({ action: z.literal("deleteSettlement"), id: z.string().min(1) }),
  z.object({ action: z.literal("decide"), expenseId: z.string().min(1), decision: decisionSchema }),
]);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminOnly();
  if (denied) return denied;
  const { id } = await params;
  if (!(await getBatch(id))) return fail("Batch not found", 404);
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(zodMessage(parsed.error));
  const body = parsed.data;
  const ref = batchRef(id);
  const now = Date.now();

  switch (body.action) {
    case "addAdvance":
      await ref.collection("advances").add({ ...body.advance, createdAt: now });
      return NextResponse.json({ ok: true });
    case "deleteAdvance":
      await ref.collection("advances").doc(body.id).delete();
      return NextResponse.json({ ok: true });
    case "addSettlement":
      await ref.collection("settlements").add({ ...body.settlement, createdAt: now });
      return NextResponse.json({ ok: true });
    case "deleteSettlement":
      await ref.collection("settlements").doc(body.id).delete();
      return NextResponse.json({ ok: true });
    case "decide": {
      const expense = await getExpense(id, body.expenseId);
      if (!expense) return fail("Expense not found", 404);
      const { decision, approvedAmount, adminNote } = body.decision;
      if (decision === "rejected" && !adminNote) {
        return fail("Add a short note so the captain knows why it was rejected.");
      }
      if (decision === "approved" && approvedAmount !== undefined && approvedAmount > expense.amount) {
        return fail("The approved amount can't be more than the claim.");
      }
      await ref.collection("expenses").doc(body.expenseId).update({
        status: decision,
        approvedAmount: decision === "approved" ? approvedAmount ?? expense.amount : null,
        adminNote,
        decidedAt: now,
        updatedAt: now,
      });
      return NextResponse.json({ ok: true });
    }
  }
}
