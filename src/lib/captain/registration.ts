import "server-only";
import { randomBytes } from "crypto";
import type { TripDoc } from "../trip-doc";
import { addDays, type BatchDoc, type TravellerSource } from "./core";
import { MAX_TRAVELLERS_PER_BATCH, type TravellerInput } from "./schemas";
import { batchRef, findBatchForTripDate, getBatch, refreshPendingCount } from "./store";

/** A problem with a registration that is safe to show to the person registering. */
export class RegistrationError extends Error {}

/** The unguessable code in a registration link. */
export const newJoinToken = () => randomBytes(18).toString("base64url");

const personKey = (name: string, phone: string) =>
  `${name.trim().toLowerCase().replace(/\s+/g, " ")}|${phone.replace(/\D/g, "").slice(-10)}`;

/**
 * Saves self-registered travellers as "pending" on a batch. People already on the batch with the same
 * name and phone are skipped, so pressing Send twice does not create duplicates.
 */
export async function registerTravellers(
  batchId: string,
  input: {
    source: Extract<TravellerSource, "website" | "link">;
    contact: { name: string; phone: string; email: string };
    travellers: TravellerInput[];
  }
) {
  const col = batchRef(batchId).collection("travellers");
  const existing = await col.get();
  if (existing.size + input.travellers.length > MAX_TRAVELLERS_PER_BATCH) {
    throw new RegistrationError("Registration for this trip is full. Please contact BTT.");
  }

  const seen = new Set(existing.docs.map((d) => personKey(String(d.get("name") ?? ""), String(d.get("phone") ?? ""))));
  const fresh: TravellerInput[] = [];
  let duplicates = 0;
  for (const t of input.travellers) {
    const k = personKey(t.name, t.phone);
    if (seen.has(k)) {
      duplicates++;
      continue;
    }
    seen.add(k);
    fresh.push(t);
  }

  const submissionId = randomBytes(9).toString("hex");
  const now = Date.now();
  if (fresh.length > 0) {
    const writes = col.firestore.batch();
    for (const t of fresh) {
      writes.set(col.doc(), {
        ...t,
        source: input.source,
        status: "pending",
        contactName: input.contact.name,
        contactPhone: input.contact.phone,
        contactEmail: input.contact.email,
        submissionId,
        createdAt: now,
      });
    }
    await writes.commit();
    await refreshPendingCount(batchId);
  }
  return { ref: submissionId.slice(0, 6).toUpperCase(), added: fresh.length, duplicates };
}

/** The batch for a trip date: BTT's own if one exists, otherwise a new one (no captain yet) made on the first booking. */
export async function batchForBooking(trip: TripDoc, date: string): Promise<BatchDoc> {
  const found = await findBatchForTripDate(trip.id, date);
  if (found) return found;

  const id = `auto-${trip.id}-${date}`;
  const now = Date.now();
  try {
    await batchRef(id).create({
      tripId: trip.id,
      tripTitle: trip.title ?? "Trip",
      location: trip.location ?? "",
      startDate: date,
      endDate: addDays(date, Math.max(0, (trip.durationDays ?? 1) - 1)),
      captainUids: [],
      notes: "",
      joinToken: null,
      joinOpen: false,
      pendingCount: 0,
      accessGrantedAt: null,
      settledAt: null,
      settleNote: "",
      createdAt: now,
      updatedAt: now,
    });
  } catch (err) {
    // Two first bookings at the same moment: the other one created it, which is fine.
    if ((err as { code?: number }).code !== 6) throw err;
  }
  const batch = await getBatch(id);
  if (!batch) throw new RegistrationError("Could not record your booking. Please try again.");
  return batch;
}
