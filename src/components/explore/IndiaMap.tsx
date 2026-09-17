"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import indiaMap from "@svg-maps/india";
import { stateSvgIdToName, getStateSummary } from "@/lib/data";
import { cn } from "@/lib/utils";

interface TooltipState {
  id: string;
  name: string;
  x: number;
  y: number;
}

export function IndiaMap({
  selectedState,
  onSelectState,
}: {
  selectedState: string | null;
  onSelectState: (state: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<TooltipState | null>(null);

  const handleMove = useCallback(
    (e: React.MouseEvent<SVGPathElement>, id: string, name: string) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setHovered({ id, name, x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    []
  );

  const summary = hovered ? getStateSummary(stateSvgIdToName[hovered.id] ?? "") : null;

  return (
    <div ref={containerRef} className="relative w-full select-none">
      <svg
        viewBox={indiaMap.viewBox}
        className="mx-auto h-auto w-full max-w-xl drop-shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
        role="img"
        aria-label="Map of India"
      >
        {indiaMap.locations.map((loc) => {
          const stateName = stateSvgIdToName[loc.id];
          const hasTrips = Boolean(stateName);
          const isSelected = stateName === selectedState;
          const isHovered = hovered?.id === loc.id;

          return (
            <path
              key={loc.id}
              d={loc.path}
              onMouseMove={(e) => handleMove(e, loc.id, loc.name)}
              onMouseLeave={() => setHovered((h) => (h?.id === loc.id ? null : h))}
              onClick={() => hasTrips && stateName && onSelectState(stateName)}
              className={cn(
                "transition-[fill,transform] duration-300 ease-out [transform-box:fill-box] [transform-origin:center]",
                hasTrips ? "cursor-pointer" : "cursor-default",
                isSelected
                  ? "fill-saffron"
                  : hasTrips
                  ? isHovered
                    ? "fill-royal-light"
                    : "fill-royal"
                  : "fill-[var(--map-inactive)]"
              )}
              style={{
                stroke: "var(--map-stroke)",
                strokeWidth: 0.6,
                transform: isSelected ? "scale(1.015)" : "scale(1)",
              }}
            />
          );
        })}
      </svg>

      <AnimatePresence>
        {hovered && summary && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            style={{ left: hovered.x + 16, top: hovered.y }}
            className="glass-surface pointer-events-none absolute z-20 w-56 rounded-xl p-3.5 text-xs shadow-2xl"
          >
            <p className="font-heading text-sm font-semibold">{hovered.name}</p>
            {summary.tripCount > 0 ? (
              <>
                <p className="mt-1 text-saffron">
                  {summary.tripCount} trip{summary.tripCount !== 1 ? "s" : ""} available
                </p>
                {summary.upcomingDates.length > 0 && (
                  <p className="mt-1.5 opacity-70">
                    Next dates: {summary.upcomingDates.join(", ")}
                  </p>
                )}
                {summary.temples.length > 0 && (
                  <p className="mt-1.5 opacity-70">
                    🛕 {summary.temples.slice(0, 2).join(", ")}
                  </p>
                )}
                {summary.treks.length > 0 && (
                  <p className="mt-1 opacity-70">🏔 {summary.treks.slice(0, 2).join(", ")}</p>
                )}
                <p className="mt-2 text-[11px] font-medium text-royal-light">Click to explore →</p>
              </>
            ) : (
              <p className="mt-1 opacity-60">Trips coming soon to this state</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
