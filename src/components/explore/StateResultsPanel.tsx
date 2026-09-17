"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Calendar, Sparkles } from "lucide-react";
import { getPackagesByState, getStateSummary } from "@/lib/data";
import { PackageCard } from "@/components/packages/PackageCard";

export function StateResultsPanel({ state }: { state: string | null }) {
  if (!state) {
    return (
      <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-foreground/15 p-10 text-center"
      >
        <MapPin size={28} className="opacity-40" />
        <p className="mt-3 text-sm opacity-60">
          Click a highlighted state on the map to see trips, upcoming dates, and popular temples
          &amp; treks there.
        </p>
      </motion.div>
    );
  }

  const trips = getPackagesByState(state);
  const summary = getStateSummary(state);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-saffron">
              <MapPin size={13} /> {state}
            </p>
            <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">
              {trips.length} trip{trips.length !== 1 ? "s" : ""} waiting for you
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.upcomingDates.slice(0, 3).map((d) => (
              <span
                key={d}
                className="flex items-center gap-1 rounded-full border border-foreground/15 px-3 py-1.5 text-xs"
              >
                <Calendar size={12} /> {d}
              </span>
            ))}
          </div>
        </div>

        {(summary.temples.length > 0 || summary.treks.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-4 text-xs opacity-75">
            {summary.temples.length > 0 && (
              <span className="flex items-center gap-1.5">
                🛕 Popular temples: {summary.temples.join(", ")}
              </span>
            )}
            {summary.treks.length > 0 && (
              <span className="flex items-center gap-1.5">
                🏔 Popular treks: {summary.treks.join(", ")}
              </span>
            )}
          </div>
        )}

        {trips.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-foreground/15 p-10 text-center">
            <Sparkles size={24} className="opacity-40" />
            <p className="mt-3 text-sm opacity-60">
              We&apos;re curating trips for {state}. Check back soon!
            </p>
          </div>
        ) : (
          <motion.div
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {trips.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.96 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.5 }}
              >
                <PackageCard pkg={pkg} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
