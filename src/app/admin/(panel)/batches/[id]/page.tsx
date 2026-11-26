import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { requireAdminPage } from "@/lib/auth";
import { computeAccess, prettyDate } from "@/lib/captain/core";
import {
  getBatch,
  listAdvances,
  listCaptains,
  listExpenses,
  listSettlements,
  listTravellers,
} from "@/lib/captain/store";
import { BatchControls } from "@/components/admin/BatchControls";
import { BatchJoinLink } from "@/components/admin/BatchJoinLink";
import { BatchForm } from "@/components/admin/BatchForm";
import { MoneyAdmin } from "@/components/admin/MoneyAdmin";
import { TravellersAdmin } from "@/components/admin/TravellersAdmin";

export const dynamic = "force-dynamic";

export default async function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  const batch = await getBatch(id);
  if (!batch) notFound();

  const [captains, travellers, advances, expenses, settlements] = await Promise.all([
    listCaptains(),
    listTravellers(id),
    listAdvances(id),
    listExpenses(id),
    listSettlements(id),
  ]);
  const access = computeAccess(batch);
  // The site's own address, so the registration link can be copied in full.
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}`;
  // Switched-off captains stay listed only if they are already on this batch.
  const captainOptions = captains.filter((c) => c.active || batch.captainUids.includes(c.uid));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/admin/batches" className="mb-4 inline-flex items-center gap-1.5 text-sm opacity-70 hover:opacity-100">
          <ArrowLeft size={15} /> All batches
        </Link>
        <h1 className="font-heading text-3xl font-bold">{batch.tripTitle}</h1>
        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm opacity-70">
          <span className="flex items-center gap-1">
            <CalendarDays size={14} /> {prettyDate(batch.startDate)}
            {batch.endDate !== batch.startDate && ` to ${prettyDate(batch.endDate)}`}
          </span>
          {batch.location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {batch.location}
            </span>
          )}
        </p>
      </div>

      <BatchControls batch={batch} state={access.state} pendingClaims={expenses.filter((e) => e.status === "pending").length} />
      <BatchJoinLink batch={batch} origin={origin} />
      <TravellersAdmin batchId={id} travellers={travellers} />
      <MoneyAdmin batchId={id} advances={advances} expenses={expenses} settlements={settlements} />

      <div>
        <h2 className="mb-4 font-heading text-xl font-bold">Batch details &amp; captains</h2>
        <BatchForm batch={batch} captains={captainOptions} />
      </div>
    </div>
  );
}
