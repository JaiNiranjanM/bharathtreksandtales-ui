import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { requireAdminPage } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "Admin | Bharath Treks & Tales",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminPage();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-surface-muted">
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/btt_logo_icon.png" alt="" width={40} height={57} className="h-8 w-auto" />
            <span className="font-heading text-lg font-bold">Trip Manager</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm sm:gap-2">
            <Link href="/admin" className="rounded-full px-3 py-1.5 hover:bg-foreground/5">
              Trips
            </Link>
            <Link href="/admin/batches" className="rounded-full px-3 py-1.5 hover:bg-foreground/5">
              Batches
            </Link>
            <Link href="/admin/captains" className="rounded-full px-3 py-1.5 hover:bg-foreground/5">
              Captains
            </Link>
            <Link
              href="/admin/trips/new"
              className="flex items-center gap-1 rounded-full bg-royal px-3 py-1.5 text-white hover:bg-royal-light"
            >
              <Plus size={14} /> New trip
            </Link>
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1 rounded-full px-3 py-1.5 hover:bg-foreground/5 sm:flex"
            >
              View site <ExternalLink size={13} />
            </Link>
            <LogoutButton email={session.email} />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
