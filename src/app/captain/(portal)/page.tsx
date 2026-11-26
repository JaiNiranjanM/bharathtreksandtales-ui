import Link from "next/link";
import { CalendarDays, ChevronRight, MapPin } from "lucide-react";
import { requireCaptainPage } from "@/lib/captain/auth";
import { ACCESS_LABEL, computeAccess, prettyDate } from "@/lib/captain/core";
import { listBatchesForCaptain } from "@/lib/captain/store";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CaptainHomePage() {
  const session = await requireCaptainPage();
  const batches = await listBatchesForCaptain(session.uid);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold">Your trips</h1>
      <p className="mt-1 text-sm opacity-60">Trips BTT has assigned to you as captain.</p>

      {batches.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-foreground/15 bg-surface p-10 text-center text-sm opacity-70">
          No trips are assigned to you yet. BTT will add you to a trip before it departs.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {batches.map((b) => {
            const access = computeAccess(b);
            return (
              <li key={b.id}>
                <Link
                  href={`/captain/batches/${b.id}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-surface p-5 transition-colors hover:border-royal/40"
                >
                  <div className="min-w-0">
                    <p className="truncate font-heading text-lg font-bold">{b.tripTitle}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs opacity-70">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} /> {prettyDate(b.startDate)}
                        {b.endDate !== b.startDate && ` to ${prettyDate(b.endDate)}`}
                      </span>
                      {b.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} /> {b.location}
                        </span>
                      )}
                    </p>
                    <span
                      className={cn(
                        "mt-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        access.state === "open" ? "bg-forest-light/15 text-forest-light" : "bg-foreground/10"
                      )}
                    >
                      {ACCESS_LABEL[access.state]}
                    </span>
                  </div>
                  <ChevronRight size={20} className="shrink-0 opacity-40" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
