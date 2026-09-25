"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAppStore } from "@/lib/store";
import { getMyBookings, type BookingRow } from "@/services/bookingService";
import { formatINR } from "@/lib/utils";
import { Loader2, Receipt } from "lucide-react";

// Order history derived from bookings (each booking carries order_id +
// payment_status). Cancellation follows the policy tiers 100/50/0% <72h.
function refundTier(dateStr: string): { pct: number; label: string } {
  const trip = new Date(dateStr).getTime();
  if (isNaN(trip)) return { pct: 0, label: "Check policy" };
  const hoursLeft = (trip - Date.now()) / 3_600_000;
  if (hoursLeft > 168) return { pct: 100, label: "100% refund (>7 days)" };
  if (hoursLeft > 72) return { pct: 50, label: "50% refund (3–7 days)" };
  return { pct: 0, label: "Non-refundable (<72h)" };
}

export default function OrdersPage() {
  const token = useAppStore((s) => s.token);
  const [orders, setOrders] = useState<BookingRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getMyBookings(token).then(
      (d) => { setOrders(Array.isArray(d) ? d : []); setLoaded(true); },
      (e: unknown) => { setError(e instanceof Error ? e.message : "Failed to load orders"); setLoaded(true); }
    );
  }, [token]);

  const loading = !!token && !loaded;

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 pt-28">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-heading text-3xl font-bold">Orders & Invoices</h1>
          <p className="mt-2 text-sm opacity-60">
            Payment history and cancellation tiers per the{" "}
            <Link href="/policy/cancellation" className="text-saffron hover:underline">cancellation policy</Link>.
          </p>

          {loading ? (
            <p className="mt-8 flex items-center gap-2 text-sm opacity-60"><Loader2 size={16} className="animate-spin" /> Loading…</p>
          ) : error ? (
            <p className="mt-8 text-sm text-red-500">{error}</p>
          ) : orders.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-foreground/15 p-10 text-center">
              <Receipt size={32} className="mx-auto opacity-30" />
              <p className="mt-3 text-sm opacity-60">No orders yet.</p>
              <Link href="/packages" className="mt-4 inline-block rounded-full bg-saffron px-6 py-2.5 text-sm font-medium text-white">Explore Trips</Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((o) => {
                const tier = refundTier(o.date);
                return (
                  <div key={o.booking_ref} className="rounded-2xl border border-foreground/10 bg-surface p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-sm font-bold">{o.order_id || o.booking_ref}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${o.payment_status === "PAID" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {o.payment_status ?? o.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm opacity-70">Booking <Link href={`/dashboard/bookings/${o.booking_ref}`} className="font-mono text-saffron hover:underline">{o.booking_ref}</Link> • {o.date}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold">{formatINR(o.total_amount)}</span>
                      <span className="text-xs opacity-60">Cancellation: {tier.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
