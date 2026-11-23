"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { clientAuth } from "@/lib/firebase/client";

export function LogoutButton({ email }: { email: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    await signOut(clientAuth()).catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      title={`Signed in as ${email}`}
      className="flex items-center gap-1 rounded-full px-3 py-1.5 hover:bg-foreground/5 cursor-pointer"
    >
      <LogOut size={14} /> <span className="hidden sm:inline">Log out</span>
    </button>
  );
}
