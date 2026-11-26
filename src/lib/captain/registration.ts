import "server-only";
import { randomBytes } from "crypto";
import { adminDb } from "../firebase/admin";
import type { TripDoc } from "../trip-doc";
import { addDays, type BatchDoc, type TravellerSource } from "./core";
import { MAX_TRAVELLERS_PER_BATCH, type TravellerInput } from "./schemas";
import { asBatch, batchRef, findBatchForTripDate, getBatch } from "./store";

/** A problem with a registration that is safe to show to the person registering. */
export class RegistrationError extends Error {}

/** The unguessable code in a registration link. */
export const newJoinToken = () => randomBytes(18).toString("base64url");

const personKey = (name: string, phone: string) =>
  `${name.trim().toLowerCase().replace(/\s+/g, " ")}|${phone.replace(/\D/g, "").slice(-10)}`;

export interface RegistrationResult {
  ref: string;
  added: number;
  duplicates: number;
  /** Seats still free on this departure afterwards; null when there is no limit. */
  seatsLeft: number | null;
}

/**
 * Saves self-registered travellers as "pending" on a batch and holds a seat for each one.
 * The seat check and the save happen in one transaction, so two people booking the last seat at the same moment
 * cannot both get it. People already on the batch with the same name and phone are skipped, so pressing Send twice
 * does not create duplicates or use up extra seats.
 */
export async function registerTravellers(
  batchId: string,
  input: {
    source: Extract<TravellerSource, "website" | "link">;
    contact: { name: string; phone: string; email: string };
    travellers: TravellerInput[];
  }
): Promise<RegistrationResult> {
  const ref = batchRef(batchId);
  const col = ref.collection("travellers");
  const submissionId = randomBytes(9).toString("hex");

  return adminDb().runTransaction(async (tx) => {
    const batchSnap = await tx.get(ref);
    if (!batchSnap.exists) throw new RegistrationError("This trip could not be found. Please contact BTT.");
    const batch = asBatch(batchSnap);
    const existing = await tx.get(col);

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

    const taken = existing.size;
    if (taken + fresh.length > MAX_TRAVELLERS_PER_BATCH) {
      throw new RegistrationError("Registration for this trip is full. Please contact BTT.");
    }
    if (batch.capacity !== null && fresh.length > 0) {
      const free = Math.max(0, batch.capacity - taken);
      if (fresh.length > free) {
        throw new RegistrationError(
          free === 0
            ? "Sorry, this date is full. Please choose another date or contact BTT."
            : `Only ${free} ${free === 1 ? "seat is" : "seats are"} left on this date. Please reduce the number of travellers or contact BTT.`
        );
      }
    }

    if (fresh.length > 0) {
      const now = Date.now();
      for (const t of fresh) {
        tx.set(col.doc(), {
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
      const pendingBefore = existing.docs.filter((d) => d.get("status") === "pending").length;
      tx.update(ref, { travellerCount: taken + fresh.length, pendingCount: pendingBefore + fresh.length });
    }

    return {
      ref: submissionId.slice(0, 6).toUpperCase(),
      added: fresh.length,
      duplicates,
      seatsLeft: batch.capacity === null ? null : Math.max(0, batch.capacity - taken - fresh.length),
    };
  });
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
      // The trip's own seat count is the capacity of each of its departures.
      capacity: typeof trip.seatsLeft === "number" ? trip.seatsLeft : null,
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
  } catch (err) {
    // Two first bookings at the same moment: the other one created it, which is fine.
    if ((err as { code?: number }).code !== 6) throw err;
  }
  const batch = await getBatch(id);
  if (!batch) throw new RegistrationError("Could not record your booking. Please try again.");
  return batch;
}
