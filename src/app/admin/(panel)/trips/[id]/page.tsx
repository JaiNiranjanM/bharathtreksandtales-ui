import { notFound } from "next/navigation";
import { getTrip } from "@/lib/trips";
import { requireAdminPage } from "@/lib/auth";
import { TripEditor } from "@/components/admin/TripEditor";

export const dynamic = "force-dynamic";

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const trip = await getTrip((await params).id);
  if (!trip) notFound();
  return <TripEditor initial={trip} />;
}
