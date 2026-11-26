import { NextResponse } from "next/server";
import { z } from "zod";
import { travellerSchema } from "@/lib/captain/schemas";
import { batchRef, getBatch, refreshTravellerCounts } from "@/lib/captain/store";
import { adminOnly, fail, zodMessage } from "@/lib/captain/http";
import { adminDb } from "@/lib/firebase/admin";

const MAX_IMPORT = 300;

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("add"), traveller: travellerSchema }),
  z.object({ action: z.literal("import"), rows: z.array(travellerSchema).min(1).max(MAX_IMPORT) }),
  z.object({ action: z.literal("update"), id: z.string().min(1), traveller: travellerSchema }),
  z.object({ action: z.literal("delete"), id: z.string().min(1) }),
  z.object({ action: z.literal("confirm"), id: z.string().min(1) }),
  z.object({ action: z.literal("confirmAll") }),
]);

/** Fields every traveller needs that the form does not collect: how they were added and that BTT vouches for them. */
const addedByBtt = (source: "admin" | "csv") => ({
  source,
  status: "confirmed" as const,
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  submissionId: "",
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminOnly();
  if (denied) return denied;
  const { id } = await params;
  if (!(await getBatch(id))) return fail("Batch not found", 404);
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(zodMessage(parsed.error));
  const body = parsed.data;
  const col = batchRef(id).collection("travellers");
  const now = Date.now();

  switch (body.action) {
    case "add":
      await col.add({ ...body.traveller, ...addedByBtt("admin"), createdAt: now });
      await refreshTravellerCounts(id);
      return NextResponse.json({ ok: true });
    case "import": {
      const batch = adminDb().batch();
      body.rows.forEach((row) => batch.set(col.doc(), { ...row, ...addedByBtt("csv"), createdAt: now }));
      await batch.commit();
      await refreshTravellerCounts(id);
      return NextResponse.json({ ok: true, imported: body.rows.length });
    }
    case "update":
      await col.doc(body.id).set({ ...body.traveller }, { merge: true });
      return NextResponse.json({ ok: true });
    case "delete":
      await col.doc(body.id).delete();
      await refreshTravellerCounts(id);
      return NextResponse.json({ ok: true });
    case "confirm":
      await col.doc(body.id).update({ status: "confirmed" });
      await refreshTravellerCounts(id);
      return NextResponse.json({ ok: true });
    case "confirmAll": {
      const pending = await col.where("status", "==", "pending").get();
      const writes = adminDb().batch();
      pending.docs.forEach((d) => writes.update(d.ref, { status: "confirmed" }));
      await writes.commit();
      await refreshTravellerCounts(id);
      return NextResponse.json({ ok: true, confirmed: pending.size });
    }
  }
}
