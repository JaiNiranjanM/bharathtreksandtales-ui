import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireCaptainPage } from "@/lib/captain/auth";
import { CaptainLogout } from "@/components/captain/CaptainLogout";

export const metadata: Metadata = {
  title: "Captain | Bharath Treks & Tales",
  robots: { index: false, follow: false },
};

export default async function CaptainPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await requireCaptainPage();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-surface-muted">
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/captain" className="flex items-center gap-2.5">
            <Image src="/btt_logo_icon.png" alt="" width={40} height={57} className="h-8 w-auto" />
            <span className="font-heading text-lg font-bold">Captain</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden opacity-60 sm:inline">{session.name}</span>
            <CaptainLogout name={session.name} />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
