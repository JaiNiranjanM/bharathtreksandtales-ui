import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdminPage } from "@/lib/auth";
import { listCaptains } from "@/lib/captain/store";
import { listTripsForAdmin } from "@/lib/trips";
import { BatchForm, type TripOption } from "@/components/admin/BatchForm";

export const dynamic = "force-dynamic";

export default async function NewBatchPage() {
  await requireAdminPage();
  const [captains, trips] = await Promise.all([listCaptains(), listTripsForAdmin()]);
  const today = new Date().toISOString().slice(0, 10);

  const options: TripOption[] = trips
    .filter((t) => t.title)
    .map((t) => ({
      id: t.id,
      title: t.title ?? "",
      location: t.location ?? "",
      durationDays: t.durationDays ?? 1,
      departures: (t.departures ?? []).filter((d) => d >= today).sort(),
    }));

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/batches" className="mb-4 inline-flex items-center gap-1.5 text-sm opacity-70 hover:opacity-100">
        <ArrowLeft size={15} /> All batches
      </Link>
      <h1 className="mb-6 font-heading text-3xl font-bold">New batch</h1>
      <BatchForm trips={options} captains={captains.filter((c) => c.active)} />
    </div>
  );
}
