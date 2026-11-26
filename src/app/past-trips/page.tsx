import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PastTripsExplorer } from "@/components/past-trips/PastTripsExplorer";
import { getSortedCompletedTrips } from "@/lib/completedTrips";

export default function PastTripsPage() {
  const trips = getSortedCompletedTrips();

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

          <PastTripsExplorer trips={trips} />
        </div>
      </main>
      <Footer />
    </>
  );
}
