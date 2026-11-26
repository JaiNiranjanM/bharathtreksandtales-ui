import { NextResponse } from "next/server";
import { seatsLeft } from "@/lib/captain/core";
import { listBatchesForTrip } from "@/lib/captain/store";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { getTrip } from "@/lib/trips";

/**
 * Seats left on each upcoming date of a published trip, keyed by date (YYYY-MM-DD).
 * A date with no batch yet has the trip's full seat count; null means no limit. Only counts are returned.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const empty = NextResponse.json({ seats: {} });
  if (!isFirebaseConfigured()) return empty;

  try {
    const trip = await getTrip(id);
    if (!trip || trip.status !== "published") return empty;

    const batches = await listBatchesForTrip(id);
    const byDate = new Map(batches.map((b) => [b.startDate, b]));
    const seats: Record<string, number | null> = {};
    for (const date of trip.departures ?? []) {
      const batch = byDate.get(date);
      seats[date] = batch ? seatsLeft(batch) : typeof trip.seatsLeft === "number" ? trip.seatsLeft : null;
    }
    return NextResponse.json(
      { seats },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=20, stale-while-revalidate=60" } }
    );
  } catch (err) {
    console.error("Could not read seat counts", err);
    return empty;
  }
}
