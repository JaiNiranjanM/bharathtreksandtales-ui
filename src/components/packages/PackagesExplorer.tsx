"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  categories,
  packages as localPackages,
  states,
  difficulties,
  type CategoryId,
  type Difficulty,
  type TravelPackage,
} from "@/lib/data";
import { PackageCard } from "./PackageCard";
import { cn } from "@/lib/utils";

const durationOptions = [
  { label: "One Day", test: (d: number) => d === 1 },
  { label: "Weekend (2-3 Days)", test: (d: number) => d >= 2 && d <= 3 },
  { label: "4+ Days", test: (d: number) => d >= 4 },
];

type PkgWithDates = TravelPackage & { availableDates?: string[] };

export function PackagesExplorer({ initialPackages }: { initialPackages?: TravelPackage[] } = {}) {
  // Remounted (via key) whenever the URL filter params change, so
  // searchParams can be read once as initial state — no sync effect needed.
  const searchParams = useSearchParams();
  const rawSource = initialPackages && initialPackages.length > 0 ? initialPackages : localPackages;
  const sourcePackages = rawSource as PkgWithDates[];

  const initialQuery = searchParams.get("query") || "";
  const initialDate = searchParams.get("date") || "";
  const initialTravelers = searchParams.get("travelers") || "";
  const [query, setQuery] = useState(initialQuery);
  const [dateFilter, setDateFilter] = useState(initialDate);
  const [travelersFilter, setTravelersFilter] = useState(initialTravelers);
  const [category, setCategory] = useState<CategoryId | "all">(
    (searchParams.get("category") as CategoryId) || "all"
  );
  const [state, setState] = useState<string>(searchParams.get("state") || "all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [duration, setDuration] = useState<string>("all");
  const [maxBudget, setMaxBudget] = useState(10000);
  const [weekendOnly, setWeekendOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return sourcePackages.filter((p) => {
      if (query && !p.title.toLowerCase().includes(query.toLowerCase()) && !p.location.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      if (category !== "all" && !p.category.includes(category)) return false;
      if (state !== "all" && p.state !== state) return false;
      if (difficulty !== "all" && p.difficulty !== difficulty) return false;
      if (duration !== "all") {
        const opt = durationOptions.find((o) => o.label === duration);
        if (opt && !opt.test(p.durationDays)) return false;
      }
      if (p.discountPrice > maxBudget) return false;
      if (weekendOnly && !p.weekend) return false;
      if (travelersFilter && !isNaN(Number(travelersFilter)) && Number(travelersFilter) > 0) {
        if (p.seatsLeft < Number(travelersFilter)) return false;
      }
      // date filter client fallback: if package has availableDates and dateFilter not in it, hide
      if (dateFilter && Array.isArray(p.availableDates) && p.availableDates.length > 0) {
        if (!p.availableDates.includes(dateFilter)) return false;
      }
      return true;
    });
  }, [sourcePackages, query, category, state, difficulty, duration, maxBudget, weekendOnly, travelersFilter, dateFilter]);

  function resetFilters() {
    setQuery("");
    setDateFilter("");
    setTravelersFilter("");
    setCategory("all");
    setState("all");
    setDifficulty("all");
    setDuration("all");
    setMaxBudget(10000);
    setWeekendOnly(false);
    if (typeof window !== 'undefined') window.history.replaceState(null, '', '/packages');
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Explore Trips</h1>
        <p className="mt-2 text-sm opacity-70">
          {filtered.length} trip{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="relative mb-8 flex items-center gap-2 rounded-full border border-foreground/10 bg-surface px-4 py-3 shadow-sm">
        <Search size={18} className="opacity-50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by trip name or location..."
          className="w-full bg-transparent text-sm focus:outline-none"
        />
        <button
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-full bg-royal px-3 py-1.5 text-xs font-medium text-white lg:hidden cursor-pointer"
        >
          <SlidersHorizontal size={13} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside
          className={cn(
            "space-y-7 rounded-2xl border border-foreground/10 bg-surface p-5 lg:sticky lg:top-28 lg:block lg:h-fit",
            mobileFiltersOpen ? "block" : "hidden"
          )}
        >
          <div className="flex items-center justify-between lg:hidden">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={() => setMobileFiltersOpen(false)} className="cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <FilterGroup title="Category">
            <div className="flex flex-wrap gap-2">
              <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
                All
              </FilterChip>
              {categories.map((c) => (
                <FilterChip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                  {c.icon} {c.label}
                </FilterChip>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="State">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-lg border border-foreground/15 bg-transparent px-3 py-2 text-sm focus:outline-none"
            >
              <option value="all">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup title="Difficulty">
            <div className="flex flex-wrap gap-2">
              <FilterChip active={difficulty === "all"} onClick={() => setDifficulty("all")}>
                All
              </FilterChip>
              {difficulties.map((d) => (
                <FilterChip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
                  {d}
                </FilterChip>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Duration">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={duration === "all"}
                  onChange={() => setDuration("all")}
                />
                Any duration
              </label>
              {durationOptions.map((o) => (
                <label key={o.label} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={duration === o.label}
                    onChange={() => setDuration(o.label)}
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title={`Budget: up to ₹${maxBudget.toLocaleString("en-IN")}`}>
            <input
              type="range"
              min={500}
              max={10000}
              step={500}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-royal"
            />
          </FilterGroup>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={weekendOnly}
              onChange={(e) => setWeekendOnly(e.target.checked)}
            />
            Weekend trips only
          </label>

          <button
            onClick={resetFilters}
            className="w-full rounded-lg border border-foreground/15 py-2 text-sm font-medium transition-colors hover:bg-foreground/5 cursor-pointer"
          >
            Reset Filters
          </button>
        </aside>

        <div>
          {(dateFilter || travelersFilter) && (
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
              {dateFilter && <span className="rounded-full bg-royal/10 px-3 py-1 text-royal">Date: {dateFilter} <button onClick={() => setDateFilter("")} className="ml-1 font-bold">×</button></span>}
              {travelersFilter && <span className="rounded-full bg-royal/10 px-3 py-1 text-royal">Travellers: {travelersFilter} <button onClick={() => setTravelersFilter("")} className="ml-1 font-bold">×</button></span>}
            </div>
          )}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-foreground/15 py-20 text-center">
              <p className="text-lg font-medium">No trips match your filters</p>
              <p className="mt-1 text-sm opacity-60">Try adjusting your search or filters</p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-full bg-royal px-5 py-2 text-sm font-medium text-white cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wide opacity-60">{title}</h4>
      {children}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
        active
          ? "border-royal bg-royal text-white"
          : "border-foreground/15 hover:bg-foreground/5"
      )}
    >
      {children}
    </button>
  );
}
