import { NextResponse } from "next/server";
import { computeAccess } from "@/lib/captain/core";
import { getBatchForCaptain, getCaptainSession } from "@/lib/captain/auth";
import { BillError, prepareBills, saveBills } from "@/lib/captain/bills";
import { fail, zodMessage } from "@/lib/captain/http";
import { expenseInputSchema } from "@/lib/captain/schemas";
import { batchRef } from "@/lib/captain/store";

/** The date today in India (YYYY-MM-DD), used to stop expenses dated in the future. */
const todayIST = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);

/** A captain adds an expense, with up to four bill photos or PDFs (multipart form). */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCaptainSession();
  if (!session) return fail("Not signed in", 401);
  const { id } = await params;
  const batch = await getBatchForCaptain(id, session.uid);
  if (!batch) return fail("Trip not found", 404);
  if (!computeAccess(batch).expenses) return fail("Expense upload is not open for this trip.", 403);

  const form = await request.formData().catch(() => null);
  if (!form) return fail("Invalid form");
  let input;
  try {
    input = expenseInputSchema.safeParse(JSON.parse(String(form.get("data") ?? "")));
  } catch {
    return fail("Invalid expense details");
  }
  if (!input.success) return fail(zodMessage(input.error));
  if (input.data.date > todayIST()) return fail("The expense date can't be in the future.");

  const files = form.getAll("bills").filter((f): f is File => f instanceof File && f.size > 0);
  let prepared;
  try {
    prepared = await prepareBills(files);
  } catch (err) {
    if (err instanceof BillError) return fail(err.message);
    throw err;
  }

  const ref = batchRef(id).collection("expenses").doc();
  const bills = await saveBills(id, ref.id, prepared);
  const now = Date.now();
  await ref.set({
    ...input.data,
    bills,
    status: "pending",
    approvedAmount: null,
    adminNote: "",
    submittedBy: session.uid,
    submittedByName: session.name,
    submittedAt: now,
    updatedAt: now,
    decidedAt: null,
  });
  return NextResponse.json({ id: ref.id });
}
