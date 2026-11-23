import type { TripStatus } from "@/lib/trip-schema";
import { cn } from "@/lib/utils";

const styles: Record<TripStatus, { label: string; className: string }> = {
  generating: { label: "Generating", className: "bg-royal/10 text-royal-light animate-pulse" },
  draft: { label: "Draft", className: "bg-foreground/10" },
  published: { label: "Published", className: "bg-forest-light/15 text-forest-light" },
  failed: { label: "Failed", className: "bg-saffron/15 text-saffron" },
};

export function StatusBadge({ status }: { status: TripStatus }) {
  const s = styles[status];
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide", s.className)}>
      {s.label}
    </span>
  );
}
