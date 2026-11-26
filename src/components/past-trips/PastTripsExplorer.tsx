"use client";

import { useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import type { CompletedTrip } from "@/lib/completedTrips";
import { PastTripCard } from "./PastTripCard";

const ALL = "all";

const triggerClass =
  "shrink-0 cursor-pointer rounded-full border border-foreground/15 px-5 py-2 text-sm font-medium transition-colors hover:bg-foreground/5 " +
  "data-[state=active]:border-transparent data-[state=active]:bg-saffron data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-saffron/25";

/** Past trips grouped into one tab per year (newest first), plus an "All" tab. */
export function PastTripsExplorer({ trips }: { trips: CompletedTrip[] }) {
  const groups = useMemo(() => {
    const byYear = new Map<string, CompletedTrip[]>();
    for (const trip of trips) {
      const year = trip.startDate.slice(0, 4);
      byYear.set(year, [...(byYear.get(year) ?? []), trip]);
    }
    return Array.from(byYear.entries()).sort(([a], [b]) => Number(b) - Number(a));
  }, [trips]);

  const [tab, setTab] = useState(groups[0]?.[0] ?? ALL);

  if (trips.length === 0) {
    return <p className="mt-12 text-center text-sm opacity-60">Completed trips will appear here soon.</p>;
  }

  return (
    <Tabs.Root value={tab} onValueChange={setTab} className="mt-10">
      <Tabs.List
        aria-label="Filter past trips by year"
        className="flex gap-2 overflow-x-auto pb-2 sm:justify-center"
      >
        {groups.map(([year, list]) => (
          <Tabs.Trigger key={year} value={year} className={triggerClass}>
            {year} <span className="ml-1 opacity-70">({list.length})</span>
          </Tabs.Trigger>
        ))}
        {groups.length > 1 && (
          <Tabs.Trigger value={ALL} className={triggerClass}>
            All trips <span className="ml-1 opacity-70">({trips.length})</span>
          </Tabs.Trigger>
        )}
      </Tabs.List>

      {groups.map(([year, list]) => (
        <Tabs.Content key={year} value={year} className="mt-8 outline-none">
          <TripGrid trips={list} />
        </Tabs.Content>
      ))}
      {groups.length > 1 && (
        <Tabs.Content value={ALL} className="mt-8 outline-none">
          <TripGrid trips={trips} />
        </Tabs.Content>
      )}
    </Tabs.Root>
  );
}

function TripGrid({ trips }: { trips: CompletedTrip[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip, i) => (
        <PastTripCard key={trip.id} trip={trip} index={i} />
      ))}
    </div>
  );
}
