import { NextResponse } from "next/server";
import { computeAccess, type BatchDoc, type ExpenseDoc } from "@/lib/captain/core";
import { getBatchForCaptain, getCaptainSession } from "@/lib/captain/auth";
import { BillError, deleteBillFiles, prepareBills, saveBills } from "@/lib/captain/bills";
import { fail, zodMessage } from "@/lib/captain/http";
import { expenseInputSchema } from "@/lib/captain/schemas";
import { batchRef, getExpense } from "@/lib/captain/store";

type Ctx = { params: Promise<{ id: string; eid: string }> };

const todayIST = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);

/** Loads the expense and checks the captain may change it: their own, not approved, access still open. */
async function loadEditable(ctx: Ctx): Promise<
  | { error: Response }
  | { batch: BatchDoc; expense: ExpenseDoc; uid: string }
> {
  const session = await getCaptainSession();
  if (!session) return { error: fail("Not signed in", 401) };
  const { id, eid } = await ctx.params;
  const batch = await getBatchForCaptain(id, session.uid);
  if (!batch) return { error: fail("Trip not found", 404) };
  if (!computeAccess(batch).expenses) return { error: fail("Expense upload is not open for this trip.", 403) };
  const expense = await getExpense(id, eid);
  if (!expense) return { error: fail("Expense not found", 404) };
  if (expense.submittedBy !== session.uid) return { error: fail("You can only change your own expenses.", 403) };
  if (expense.status === "approved") return { error: fail("Approved expenses can't be changed.", 409) };
  return { batch, expense, uid: session.uid };
}

/** Edit an expense. Sending it again puts it back to "pending" for BTT to review. */
export async function PUT(request: Request, ctx: Ctx) {
  const loaded = await loadEditable(ctx);
  if ("error" in loaded) return loaded.error;
  const { batch, expense } = loaded;

  const form = await request.formData().catch(() => null);
  if (!form) return fail("Invalid form");
  let input;
  let keep: string[];
  try {
    input = expenseInputSchema.safeParse(JSON.parse(String(form.get("data") ?? "")));
    keep = JSON.parse(String(form.get("keep") ?? "[]"));
    if (!Array.isArray(keep) || keep.some((p) => typeof p !== "string")) throw new Error("bad keep");
  } catch {
    return fail("Invalid expense details");
  }
  if (!input.success) return fail(zodMessage(input.error));
  if (input.data.date > todayIST()) return fail("The expense date can't be in the future.");

  // Only bills that already belong to this expense can be kept.
  const kept = expense.bills.filter((b) => keep.includes(b.path));
  const removed = expense.bills.filter((b) => !keep.includes(b.path));
  const files = form.getAll("bills").filter((f): f is File => f instanceof File && f.size > 0);
  let prepared;
  try {
    prepared = await prepareBills(files, kept.length);
  } catch (err) {
    if (err instanceof BillError) return fail(err.message);
    throw err;
  }

  const added = await saveBills(batch.id, expense.id, prepared);
  await batchRef(batch.id)
    .collection("expenses")
    .doc(expense.id)
    .update({
      ...input.data,
      bills: [...kept, ...added],
      status: "pending",
      approvedAmount: null,
      adminNote: "",
      decidedAt: null,
      updatedAt: Date.now(),
    });
  await deleteBillFiles(removed.map((b) => b.path));
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const loaded = await loadEditable(ctx);
  if ("error" in loaded) return loaded.error;
  const { batch, expense } = loaded;
  await batchRef(batch.id).collection("expenses").doc(expense.id).delete();
  await deleteBillFiles(expense.bills.map((b) => b.path));
  return NextResponse.json({ ok: true });
}
