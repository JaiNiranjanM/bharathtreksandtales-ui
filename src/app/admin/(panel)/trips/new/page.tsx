import { NewTripForm } from "@/components/admin/NewTripForm";
import { requireAdminPage } from "@/lib/auth";

export default async function NewTripPage() {
  await requireAdminPage();
  return <NewTripForm />;
}
