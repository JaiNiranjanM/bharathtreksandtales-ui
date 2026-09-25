"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getBookingByRef, type BookingRow } from "@/services/bookingService";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function BookingDetailPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = use(params);
  const [booking, setBooking] = useState<BookingRow | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookingByRef(ref)
      .then(setBooking)
      .catch((e) => setError(e instanceof Error ? e.message : "Booking not found"))
      .finally(() => setLoading(false));
  }, [ref]);

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 pt-28">
        <div className="mx-auto max-w-2xl px-6">
          <Link href="/dashboard/bookings" className="text-sm font-medium text-saffron hover:underline">← My bookings</Link>
          <h1 className="mt-3 font-heading text-3xl font-bold">Booking {ref}</h1>

          {loading ? (
            <p className="mt-8 flex items-center gap-2 text-sm opacity-60"><Loader2 size={16} className="animate-spin" /> Loading…</p>
          ) : error || !booking ? (
            <p className="mt-8 text-sm text-red-500">{error || "Booking not found"}</p>
          ) : (
            <div className="mt-6 rounded-2xl border border-foreground/10 bg-surface p-6">
              <div className="space-y-2.5 text-sm">
                <Row k="Status" v={`${booking.status} • Payment: ${booking.payment_status ?? "—"}`} />
                <Row k="Package" v={booking.package_slug} />
                <Row k="Date" v={booking.date} />
                <Row k="Pickup" v={booking.pickup_location} />
                <Row k="Seats" v={String(booking.seats)} />
                <Row k="Name" v={booking.name} />
                <Row k="Email" v={booking.email} />
                <Row k="Phone" v={booking.phone} />
                {booking.coupon_code && <Row k="Coupon" v={booking.coupon_code} />}
                {booking.special_requests && <Row k="Requests" v={booking.special_requests} />}
                <div className="flex justify-between border-t border-foreground/10 pt-3 text-base font-bold">
                  <span>Total</span><span>{formatINR(booking.total_amount)}</span>
                </div>
              </div>
              {booking.payment_status === "PENDING" && booking.order_id && (
                <Button variant="saffron" className="mt-5 w-full" asChild>
                  <Link href={`/checkout/payment?orderId=${booking.order_id}&bookingRef=${booking.booking_ref}`}>Pay Now (Mock)</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="opacity-60">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}
