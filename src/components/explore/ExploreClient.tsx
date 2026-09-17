"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IndiaMap } from "./IndiaMap";
import { StateResultsPanel } from "./StateResultsPanel";
import { states } from "@/lib/data";

export function ExploreClient() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  function handleSelect(state: string) {
    setSelectedState(state);
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron">
          Explore by state
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
          Find your next journey on the map
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm opacity-70">
          Hover a state for a quick preview, click to see every trip, upcoming date and
          highlight we offer there.
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-foreground/10 bg-surface-muted p-6 sm:p-10">
          <IndiaMap selectedState={selectedState} onSelectState={handleSelect} />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs opacity-70">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-royal" /> Trips available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-saffron" /> Selected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--map-inactive)]" /> Coming soon
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-2">
          <p className="mb-1 w-full text-xs font-semibold uppercase tracking-wide opacity-50">
            Quick jump
          </p>
          {states.map((s) => (
            <button
              key={s}
              onClick={() => handleSelect(s)}
              className="rounded-full border border-foreground/15 px-4 py-2 text-left text-sm font-medium transition-colors hover:border-royal hover:bg-royal/5 lg:w-fit cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div ref={resultsRef} className="mt-16 scroll-mt-28">
        <StateResultsPanel state={selectedState} />
      </div>
    </div>
  );
}
