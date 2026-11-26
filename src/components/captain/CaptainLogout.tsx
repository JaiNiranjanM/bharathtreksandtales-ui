"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { clientAuth } from "@/lib/firebase/client";

export function CaptainLogout({ name }: { name: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/captain/session", { method: "DELETE" });
    await signOut(clientAuth()).catch(() => {});
    router.replace("/captain/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      title={`Signed in as ${name}`}
      className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm hover:bg-foreground/5"
    >
      <LogOut size={14} /> <span className="hidden sm:inline">Log out</span>
    </button>
  );
}
