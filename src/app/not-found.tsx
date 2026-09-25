"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mountain } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
            <Mountain size={36} className="text-foreground/30" />
          </div>
          <h1 className="mt-6 font-heading text-6xl font-bold">404</h1>
          <p className="mt-3 max-w-md text-sm text-foreground/60">
            Looks like this trail doesn&apos;t exist. The page you&apos;re looking for has been moved or never was.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-full bg-saffron px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-saffron/25 transition-all hover:-translate-y-0.5"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
