"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAppStore } from "@/lib/store";
import { getMyBookings, type BookingRow } from "@/services/bookingService";
import { formatINR } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadState {
  status: "idle" | "done";
  bookings: BookingRow[];
  error: string;
}

export default function MyBookingsPage() {
  const user = useAppStore((s) => s.user);
  const token = useAppStore((s) => s.token);
  const [state, setState] = useState<LoadState>({ status: "idle", bookings: [], error: "" });

  useEffect(() => {
    if (!token) return;
    getMyBookings(token).then(
      (d) => setState({ status: "done", bookings: Array.isArray(d) ? d : [], error: "" }),
      (e: unknown) => setState({ status: "done", bookings: [], error: e instanceof Error ? e.message : "Failed to load bookings" })
    );
  }, [token]);

  const loading = !!token && state.status === "idle";
  const { bookings, error } = state;

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 pt-28">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-heading text-3xl font-bold">My Bookings</h1>
          <p className="mt-2 text-sm opacity-60">
            {user ? `Trips booked as ${user.name}` : "Sign in to see your bookings."}
          </p>

          {loading ? (
            <p className="mt-8 flex items-center gap-2 text-sm opacity-60"><Loader2 size={16} className="animate-spin" /> Loading…</p>
          ) : error ? (
            <p className="mt-8 text-sm text-red-500">{error}</p>
          ) : bookings.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-foreground/15 p-10 text-center">
              <p className="text-sm opacity-60">No bookings yet.</p>
              <Link href="/packages" className="mt-4 inline-block rounded-full bg-saffron px-6 py-2.5 text-sm font-medium text-white">Explore Trips</Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {bookings.map((b) => (
                <Link key={b.booking_ref} href={`/dashboard/bookings/${b.booking_ref}`}
                  className="block rounded-2xl border border-foreground/10 bg-surface p-5 transition-shadow hover:shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold text-saffron">{b.booking_ref}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${b.payment_status === "PAID" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {b.payment_status ?? b.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium">{b.package_slug} • {b.date} • {b.seats} seat(s)</p>
                  <p className="mt-1 text-sm font-bold">{formatINR(b.total_amount)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
