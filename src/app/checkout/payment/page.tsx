"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { verifyPayment, getOrderStatus } from "@/services/paymentService";
import { formatINR } from "@/lib/utils";

function PaymentContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? "";
  const bookingRef = params.get("bookingRef") ?? "";

  const [status, setStatus] = useState<string>("PENDING");
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(orderId !== "");
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    getOrderStatus(orderId)
      .then((o) => {
        setStatus(o.status ?? "PENDING");
        setAmount(o.amount ?? null);
        if (o.status === "PAID") setPaid(true);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Order not found"))
      .finally(() => setFetching(false));
  }, [orderId]);

  async function handlePay() {
    setLoading(true);
    setError("");
    try {
      const res = await verifyPayment(orderId);
      setStatus(res.status);
      setPaid(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6">
      <h1 className="font-heading text-3xl font-bold">Checkout</h1>
      <p className="mt-2 text-sm opacity-60">
        Mock payment template — no real gateway is charged. Replace with Razorpay/Stripe Checkout in production.
      </p>

      <div className="mt-8 rounded-2xl border border-foreground/10 bg-surface p-6">
        {fetching ? (
          <p className="flex items-center gap-2 text-sm opacity-60"><Loader2 size={16} className="animate-spin" /> Loading order…</p>
        ) : !orderId ? (
          <div className="text-sm">
            <p className="opacity-70">No order specified. Book a trip first, then return here to pay.</p>
            <Button className="mt-4" variant="saffron" asChild><Link href="/packages">Browse Trips</Link></Button>
          </div>
        ) : paid ? (
          <div className="text-center">
            <CheckCircle2 size={40} className="mx-auto text-green-600" />
            <h2 className="mt-3 font-heading text-xl font-bold">Payment Successful (Mock)</h2>
            <p className="mt-1 text-sm opacity-70">Order <span className="font-mono">{orderId}</span> is PAID.</p>
            {bookingRef && <p className="mt-1 text-sm opacity-70">Booking <span className="font-mono font-semibold text-saffron">{bookingRef}</span> is CONFIRMED.</p>}
            <div className="mt-5 flex gap-3">
              <Button variant="outline" className="flex-1" asChild><Link href="/dashboard/bookings">My Bookings</Link></Button>
              <Button variant="saffron" className="flex-1" asChild>
                <Link href={bookingRef ? `/dashboard/bookings/${bookingRef}` : "/dashboard/orders"}>View Details</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="opacity-60">Order ID</span><span className="font-mono text-xs">{orderId}</span></div>
              {bookingRef && <div className="flex justify-between"><span className="opacity-60">Booking Ref</span><span className="font-mono font-semibold text-saffron">{bookingRef}</span></div>}
              {amount !== null && <div className="flex justify-between border-t border-foreground/10 pt-2 text-base font-bold"><span>Amount</span><span>{formatINR(amount)}</span></div>}
              <div className="flex justify-between"><span className="opacity-60">Status</span><span className="font-semibold text-amber-600">{status}</span></div>
            </div>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            <Button onClick={handlePay} disabled={loading} variant="saffron" size="lg" className="mt-5 w-full">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : `Pay${amount !== null ? ` ${formatINR(amount)}` : ""} (Mock)`}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs opacity-60">
              <ShieldCheck size={13} /> Template only — wire Razorpay/Stripe + webhook before launch.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPaymentPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 pt-28">
        <Suspense fallback={<div className="mx-auto max-w-xl px-6 text-sm opacity-60">Loading…</div>}>
          <PaymentContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
