import { NextResponse } from "next/server";
import { fail, zodMessage } from "@/lib/captain/http";
import { clientIp, rateLimited } from "@/lib/captain/rateLimit";
import { RegistrationError, batchForBooking, registerTravellers } from "@/lib/captain/registration";
import { bookSubmitSchema } from "@/lib/captain/schemas";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { getTrip } from "@/lib/trips";

/** The date today in India (YYYY-MM-DD). */
const todayIST = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);

/** A booking made on a trip page. Saved against that trip's batch for the chosen date, as pending until BTT confirms. */
export async function POST(request: Request) {
  if (rateLimited(`book:${clientIp(request)}`, 10, 60 * 60 * 1000)) {
    return fail("Too many attempts. Please try again in a while.", 429);
  }

  const raw = await request.json().catch(() => null);
  if (raw && typeof raw === "object" && "website" in raw && raw.website) return NextResponse.json({ ref: "000000" });

  const parsed = bookSubmitSchema.safeParse(raw);
  if (!parsed.success) return fail(zodMessage(parsed.error));
  const { tripId, date, contact, travellers } = parsed.data;

  // Malformed and bot submissions were turned away above without touching the database.
  if (!isFirebaseConfigured()) return fail("Booking is not available right now. Please contact BTT.", 503);

  // Only a published trip and one of its listed future dates can take bookings.
  const trip = await getTrip(tripId);
  if (!trip || trip.status !== "published" || !(trip.departures ?? []).includes(date) || date < todayIST()) {
    return fail("This date is not open for booking. Please choose another date or contact BTT.", 400);
  }

  try {
    const batch = await batchForBooking(trip, date);
    if (batch.settledAt) return fail("Booking for this date has closed. Please contact BTT.", 409);
    const result = await registerTravellers(batch.id, { source: "website", contact, travellers });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof RegistrationError) return fail(err.message, 409);
    console.error("Booking failed", err);
    return fail("Could not save your booking. Please try again.", 500);
  }
}
