import Link from "next/link";
import { CalendarDays, Plus, Users } from "lucide-react";
import { requireAdminPage } from "@/lib/auth";
import { ACCESS_LABEL, computeAccess, prettyDate } from "@/lib/captain/core";
import { listBatches, listCaptains } from "@/lib/captain/store";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BatchesPage() {
  await requireAdminPage();
  const [batches, captains] = await Promise.all([listBatches(), listCaptains()]);
  const names = new Map(captains.map((c) => [c.uid, c.name]));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Trip batches</h1>
          <p className="mt-1 text-sm opacity-60">
            Each run of a trip. Assign captains, add travellers, give access, and check expense claims.
          </p>
        </div>
        <Link href="/admin/batches/new" className="flex items-center gap-1.5 rounded-full bg-royal px-5 py-2.5 text-sm font-medium text-white hover:bg-royal-light">
          <Plus size={16} /> New batch
        </Link>
      </div>

      {batches.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-foreground/15 bg-surface p-12 text-center text-sm opacity-70">
          No batches yet. Create one for a trip that is about to run.
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {batches.map((b) => {
            const access = computeAccess(b);
            const captainNames = b.captainUids.map((u) => names.get(u) ?? "Unknown").join(", ");
            return (
              <li key={b.id}>
                <Link href={`/admin/batches/${b.id}`} className="block rounded-2xl border border-foreground/10 bg-surface p-5 transition-colors hover:border-royal/40">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-heading text-lg font-bold">{b.tripTitle}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs opacity-70">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={13} /> {prettyDate(b.startDate)}
                          {b.endDate !== b.startDate && ` to ${prettyDate(b.endDate)}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={13} /> {captainNames || "No captain assigned"}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {b.pendingCount > 0 && (
                        <span className="rounded-full bg-saffron/15 px-3 py-1 text-xs font-semibold text-saffron">
                          {b.pendingCount} to confirm
                        </span>
                      )}
                      <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", access.state === "open" ? "bg-forest-light/15 text-forest-light" : "bg-foreground/10")}>
                        {ACCESS_LABEL[access.state]}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
