import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PastTripCard } from "@/components/past-trips/PastTripCard";
import { getCompletedTrips } from "@/services/completedTripsService";
import { getSortedCompletedTrips } from "@/lib/completedTrips";
import type { CompletedTrip } from "@/lib/completedTrips";

export const metadata: Metadata = {
  title: "Past Trips | Bharath Treks & Tales",
  description:
    "A look back at completed treks, temple pilgrimages and adventures with Bharath Treks & Tales.",
};

export default async function PastTripsPage() {
  let trips: CompletedTrip[] = [];
  try {
    trips = await getCompletedTrips();
  } catch {
    trips = getSortedCompletedTrips();
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron">
              Trip Reports
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
              Journeys We&apos;ve Already Taken
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm opacity-70">
              Real trips, real trekkers, real temples. A look back at the adventures Bharath
              Treks &amp; Tales has already completed.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip, i) => (
              <PastTripCard key={trip.id} trip={trip} index={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
