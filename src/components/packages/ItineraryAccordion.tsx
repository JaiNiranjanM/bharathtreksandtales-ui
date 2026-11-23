"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { TripDay } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Day-by-day itinerary as expandable cards. The first day starts open. */
export function ItineraryAccordion({ days }: { days: TripDay[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="mt-4 divide-y divide-foreground/10">
      {days.map((d, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-day-${i}`;
        return (
          <div key={`${d.day}-${i}`} className="py-2.5">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-5 rounded-2xl p-3 text-left transition-colors",
                isOpen ? "bg-foreground/[0.05]" : "hover:bg-foreground/[0.03]"
              )}
            >
              <span
                className={cn(
                  "flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border leading-none transition-colors",
                  isOpen
                    ? "border-transparent bg-saffron text-white"
                    : "border-foreground/10 bg-foreground/5 text-foreground/50"
                )}
              >
                <span className="text-[10px] font-bold tracking-widest">DAY</span>
                <span className="mt-1 font-heading text-2xl font-bold">{d.day}</span>
              </span>
              <span className="flex-1 font-semibold">{d.title}</span>
              <ChevronDown
                size={18}
                className={cn("shrink-0 opacity-50 transition-transform", isOpen && "rotate-180")}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-2 pl-3 pr-3 pt-3 sm:pl-24 sm:pr-4">
                    {d.description && (
                      <p className="text-sm leading-relaxed opacity-75">{d.description}</p>
                    )}
                    {d.schedule.length > 0 && (
                      <ul className={cn("space-y-3 border-l-2 border-foreground/10 pl-4", d.description && "mt-4")}>
                        {d.schedule.map((s, k) => (
                          <li key={k} className="relative text-sm">
                            <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border-2 border-saffron bg-background" />
                            {s.time && (
                              <p className="text-xs font-semibold uppercase tracking-wide text-royal-light">
                                {s.time}
                              </p>
                            )}
                            <p className="opacity-85">{s.activity}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                    {!d.description && d.schedule.length === 0 && (
                      <p className="text-sm opacity-50">Details for this day will be shared soon.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
