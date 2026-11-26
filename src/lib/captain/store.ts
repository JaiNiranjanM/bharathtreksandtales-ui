import "server-only";
import { adminBucket, adminDb } from "../firebase/admin";
import type {
  AdvanceDoc,
  BatchDoc,
  CaptainDoc,
  ExpenseDoc,
  ExpenseView,
  SettlementDoc,
  TravellerDoc,
} from "./core";

// All reads and writes go through the server (Admin SDK); Firestore rules block browsers.

const batchesCol = () => adminDb().collection("batches");
export const batchRef = (id: string) => batchesCol().doc(id);
export const captainsCol = () => adminDb().collection("captains");

const withId = <T extends { id: string }>(d: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot) =>
  ({ ...(d.data() as Omit<T, "id">), id: d.id }) as T;

/** Batches saved before registration existed lack these fields; give them safe defaults. */
export const asBatch = (d: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot): BatchDoc => {
  const b = withId<BatchDoc>(d);
  return {
    ...b,
    joinToken: b.joinToken ?? null,
    joinOpen: b.joinOpen ?? false,
    pendingCount: b.pendingCount ?? 0,
    capacity: b.capacity ?? null,
    travellerCount: b.travellerCount ?? 0,
  };
};

/** Travellers saved before registration existed were added by BTT, so they count as confirmed. */
const asTraveller = (d: FirebaseFirestore.QueryDocumentSnapshot): TravellerDoc => {
  const t = withId<TravellerDoc>(d);
  return {
    ...t,
    source: t.source ?? "admin",
    status: t.status ?? "confirmed",
    contactName: t.contactName ?? "",
    contactPhone: t.contactPhone ?? "",
    contactEmail: t.contactEmail ?? "",
    submissionId: t.submissionId ?? "",
  };
};

export async function getBatch(id: string): Promise<BatchDoc | null> {
  const doc = await batchRef(id).get();
  return doc.exists ? asBatch(doc) : null;
}

export async function listBatches(): Promise<BatchDoc[]> {
  const snap = await batchesCol().get();
  return snap.docs.map(asBatch).sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/** Batches a captain is assigned to (sorted here, so no database index is needed). */
export async function listBatchesForCaptain(uid: string): Promise<BatchDoc[]> {
  const snap = await batchesCol().where("captainUids", "array-contains", uid).get();
  return snap.docs.map(asBatch).sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/** The batch a registration link belongs to, or null for an unknown code. */
export async function getBatchByJoinToken(token: string): Promise<BatchDoc | null> {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  const snap = await batchesCol().where("joinToken", "==", token).limit(1).get();
  return snap.empty ? null : asBatch(snap.docs[0]);
}

/** An existing batch for this trip and first day, if BTT has already made one. */
export async function findBatchForTripDate(tripId: string, startDate: string): Promise<BatchDoc | null> {
  const snap = await batchesCol().where("tripId", "==", tripId).where("startDate", "==", startDate).limit(1).get();
  return snap.empty ? null : asBatch(snap.docs[0]);
}

/** Every batch for one trip (a few at most), so a trip page can show seats left per date. */
export async function listBatchesForTrip(tripId: string): Promise<BatchDoc[]> {
  const snap = await batchesCol().where("tripId", "==", tripId).get();
  return snap.docs.map(asBatch);
}

/**
 * Re-counts the people on a batch (each holds a seat) and those still waiting for confirmation, and stores both
 * numbers on the batch. Call after any change to the traveller list.
 */
export async function refreshTravellerCounts(batchId: string) {
  const col = batchRef(batchId).collection("travellers");
  const [all, pending] = await Promise.all([col.count().get(), col.where("status", "==", "pending").count().get()]);
  await batchRef(batchId).update({ travellerCount: all.data().count, pendingCount: pending.data().count });
}

/** `onlyConfirmed`: captains must never see people BTT has not confirmed yet. */
export async function listTravellers(batchId: string, opts: { onlyConfirmed?: boolean } = {}): Promise<TravellerDoc[]> {
  const snap = await batchRef(batchId).collection("travellers").get();
  return snap.docs
    .map(asTraveller)
    .filter((t) => !opts.onlyConfirmed || t.status === "confirmed")
    .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
}

export async function listAdvances(batchId: string): Promise<AdvanceDoc[]> {
  const snap = await batchRef(batchId).collection("advances").get();
  return snap.docs.map((d) => withId<AdvanceDoc>(d)).sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
}

export async function listSettlements(batchId: string): Promise<SettlementDoc[]> {
  const snap = await batchRef(batchId).collection("settlements").get();
  return snap.docs.map((d) => withId<SettlementDoc>(d)).sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
}

export async function listExpenseDocs(batchId: string): Promise<ExpenseDoc[]> {
  const snap = await batchRef(batchId).collection("expenses").get();
  return snap.docs.map((d) => withId<ExpenseDoc>(d)).sort((a, b) => b.date.localeCompare(a.date) || b.submittedAt - a.submittedAt);
}

export async function getExpense(batchId: string, expenseId: string): Promise<ExpenseDoc | null> {
  const doc = await batchRef(batchId).collection("expenses").doc(expenseId).get();
  return doc.exists ? withId<ExpenseDoc>(doc) : null;
}

/** Expenses with 20-minute download links for their bills. The bill files themselves stay private. */
export async function listExpenses(batchId: string): Promise<ExpenseView[]> {
  const docs = await listExpenseDocs(batchId);
  const bucket = adminBucket();
  return Promise.all(
    docs.map(async (e) => ({
      ...e,
      billLinks: await Promise.all(
        e.bills.map(async (b) => {
          try {
            const [url] = await bucket.file(b.path).getSignedUrl({
              version: "v4",
              action: "read",
              expires: Date.now() + 20 * 60 * 1000,
            });
            return { name: b.name, url, contentType: b.contentType };
          } catch (err) {
            console.error("Could not sign bill link", b.path, err);
            return { name: b.name, url: "", contentType: b.contentType };
          }
        })
      ),
    }))
  );
}

export async function listCaptains(): Promise<CaptainDoc[]> {
  const snap = await captainsCol().get();
  return snap.docs
    .map((d) => ({ ...(d.data() as Omit<CaptainDoc, "uid">), uid: d.id }) as CaptainDoc)
    .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
}

export async function getCaptain(uid: string): Promise<CaptainDoc | null> {
  const doc = await captainsCol().doc(uid).get();
  return doc.exists ? ({ ...(doc.data() as Omit<CaptainDoc, "uid">), uid: doc.id } as CaptainDoc) : null;
}

/** Removes a batch and everything under it, including the bill files. */
export async function deleteBatchCompletely(id: string) {
  await adminDb().recursiveDelete(batchRef(id));
  await adminBucket()
    .deleteFiles({ prefix: `batches/${id}/` })
    .catch((err) => console.error("Failed to delete batch files", err));
}
