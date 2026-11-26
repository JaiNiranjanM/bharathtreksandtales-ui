import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBatchForCaptain, requireCaptainPage } from "@/lib/captain/auth";
import { computeAccess } from "@/lib/captain/core";
import { listAdvances, listExpenses, listSettlements, listTravellers } from "@/lib/captain/store";
import { CaptainBatchView } from "@/components/captain/CaptainBatchView";

export const dynamic = "force-dynamic";

export default async function CaptainBatchPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireCaptainPage();
  const { id } = await params;
  const batch = await getBatchForCaptain(id, session.uid);
  if (!batch) notFound();

  const access = computeAccess(batch);
  // Traveller details are only read from the database while the access window is open.
  const [travellers, expenses, advances, settlements] = await Promise.all([
    access.travellers ? listTravellers(id, { onlyConfirmed: true }) : Promise.resolve([]),
    listExpenses(id),
    listAdvances(id),
    listSettlements(id),
  ]);

  return (
    <div>
      <Link href="/captain" className="mb-4 inline-flex items-center gap-1.5 text-sm opacity-70 hover:opacity-100">
        <ArrowLeft size={15} /> All trips
      </Link>
      <CaptainBatchView
        batch={batch}
        state={access.state}
        canTravellers={access.travellers}
        canExpenses={access.expenses}
        travellers={travellers}
        expenses={expenses}
        advances={advances}
        settlements={settlements}
        uid={session.uid}
      />
    </div>
  );
}
