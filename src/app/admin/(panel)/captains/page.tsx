import { requireAdminPage } from "@/lib/auth";
import { listCaptains } from "@/lib/captain/store";
import { CaptainsManager } from "@/components/admin/CaptainsManager";

export const dynamic = "force-dynamic";

export default async function CaptainsPage() {
  await requireAdminPage();
  const captains = await listCaptains();
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold">Captains</h1>
      <p className="mt-1 mb-6 text-sm opacity-60">
        People who look after a trip on the road. Create their login here, then assign them to a batch.
      </p>
      <CaptainsManager captains={captains} />
    </div>
  );
}
