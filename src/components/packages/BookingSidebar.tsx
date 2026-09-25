"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShieldCheck, Tag, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import type { TravelPackage } from "@/lib/data";
import { formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { validateCoupon } from "@/services/couponService";
import { submitBooking, type BookingResponse } from "@/services/bookingService";
import { countries } from "@/lib/countries";
import { useAppStore } from "@/lib/store";

const fallbackDates = ["2026-08-02", "2026-08-03", "2026-08-09", "2026-08-10", "2026-08-16"];
function formatDateLabel(d: string): string {
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  } catch { return d; }
}

type PkgWithDates = TravelPackage & { availableDates?: string[] };

export function BookingSidebar({ pkg }: { pkg: TravelPackage }) {
  const user = useAppStore((s) => s.user);
  const pkgDates = (pkg as PkgWithDates).availableDates;
  const rawDates: string[] = Array.isArray(pkgDates) && pkgDates.length > 0 ? pkgDates : fallbackDates;
  const dates = rawDates;
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [pickup, setPickup] = useState(pkg.pickupLocations[0]);
  const [seats, setSeats] = useState(1);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Booking modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState(user?.name ?? "");
  const [userEmail, setUserEmail] = useState(user?.email ?? "");
  const [userPhone, setUserPhone] = useState(user?.phone ?? "");
  const [phoneCode, setPhoneCode] = useState(user?.phoneCode ?? "+91");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<BookingResponse | null>(null);

  const basePriceTotal = pkg.discountPrice * seats;
  const packageSavings = (pkg.price - pkg.discountPrice) * seats;
  const couponDiscountAmount = appliedCoupon
    ? Math.round((basePriceTotal * appliedCoupon.discountPercent) / 100)
    : 0;
  const finalTotal = basePriceTotal - couponDiscountAmount;

  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    setCouponLoading(true);
    setCouponMessage(null);

    try {
      const res = await validateCoupon(code, pkg.slug);
      if (res.valid && res.discountPercent) {
        setAppliedCoupon({ code, discountPercent: res.discountPercent });
        setCouponMessage({
          type: "success",
          text: `Coupon applied! ${res.discountPercent}% off`,
        });
      } else {
        setAppliedCoupon(null);
        setCouponMessage({
          type: "error",
          text: res.message || "Invalid coupon code",
        });
      }
    } catch {
      // Offline fallback: allow TREK5 (5%) and BTT10 (10%)
      if (code === "TREK5") {
        setAppliedCoupon({ code: "TREK5", discountPercent: 5 });
        setCouponMessage({ type: "success", text: "Coupon applied! 5% off" });
      } else if (code === "BTT10") {
        setAppliedCoupon({ code: "BTT10", discountPercent: 10 });
        setCouponMessage({ type: "success", text: "Coupon applied! 10% off" });
      } else {
        setAppliedCoupon(null);
        setCouponMessage({ type: "error", text: "Invalid or expired coupon" });
      }
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponMessage(null);
  }

  async function handleSubmitBooking(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitBooking({
        packageSlug: pkg.slug,
        seats,
        date: selectedDate,
        pickupLocation: pickup,
        name: userName.trim(),
        email: userEmail.trim(),
        phone: userPhone.trim(),
        phoneCode,
        couponCode: appliedCoupon?.code,
        specialRequests: specialRequests.trim() || undefined,
      });

      setBookingSuccess(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Booking could not be processed. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetBookingModal() {
    setIsModalOpen(false);
    setBookingSuccess(null);
    setSubmitError(null);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-28 rounded-2xl border border-foreground/10 bg-surface p-5 shadow-lg"
      >
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs opacity-50 line-through mr-1.5">{formatINR(pkg.price)}</span>
            <span className="font-heading text-2xl font-bold">{formatINR(pkg.discountPrice)}</span>
          </div>
          <span className="text-xs opacity-60">/person</span>
        </div>

        {pkg.seatsLeft <= 6 && (
          <p className="mt-1 text-xs font-medium text-saffron">Only {pkg.seatsLeft} seats left!</p>
        )}

        <div className="mt-5">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide opacity-60">
            Select Date
          </label>
          <div className="flex flex-wrap gap-2">
            {dates.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDate(d)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                  selectedDate === d
                    ? "border-royal bg-royal text-white"
                    : "border-foreground/15 hover:bg-foreground/5"
                )}
              >
                {formatDateLabel(d)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide opacity-60">
            Pickup Point
          </label>
          <select
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full rounded-lg border border-foreground/15 bg-transparent px-3 py-2 text-sm focus:outline-none"
          >
            {pkg.pickupLocations.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide opacity-60">
            Seats
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSeats((s) => Math.max(1, s - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 hover:bg-foreground/5 cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-semibold">{seats}</span>
            <button
              type="button"
              onClick={() => setSeats((s) => Math.min(pkg.seatsLeft, s + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 hover:bg-foreground/5 cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide opacity-60">
            Coupon Code
          </label>
          {appliedCoupon ? (
            <div className="flex items-center justify-between rounded-lg border border-forest/30 bg-forest/10 px-3 py-2 text-xs font-medium text-forest-light">
              <span>{appliedCoupon.code} applied ({appliedCoupon.discountPercent}% OFF)</span>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="cursor-pointer text-xs underline opacity-75 hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-foreground/15 px-3 py-2">
                <Tag size={14} className="opacity-50" />
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                  placeholder="TREK5 / BTT10"
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponLoading || !couponInput.trim()}
                className="flex items-center gap-1 rounded-lg bg-forest px-3 text-xs font-semibold text-white disabled:opacity-50 cursor-pointer"
              >
                {couponLoading ? <Loader2 size={13} className="animate-spin" /> : "Apply"}
              </button>
            </div>
          )}
          {couponMessage && (
            <p
              className={cn(
                "mt-1.5 text-xs font-medium",
                couponMessage.type === "success" ? "text-forest-light" : "text-rose-500"
              )}
            >
              {couponMessage.text}
            </p>
          )}
        </div>

        <div className="mt-5 space-y-2 border-t border-foreground/10 pt-4 text-sm">
          <div className="flex justify-between opacity-70">
            <span>
              {formatINR(pkg.discountPrice)} x {seats}
            </span>
            <span>{formatINR(basePriceTotal)}</span>
          </div>
          {packageSavings > 0 && (
            <div className="flex justify-between text-forest-light">
              <span>Package discount</span>
              <span>-{formatINR(packageSavings)}</span>
            </div>
          )}
          {appliedCoupon && couponDiscountAmount > 0 && (
            <div className="flex justify-between text-forest-light font-medium">
              <span>Coupon discount ({appliedCoupon.discountPercent}%)</span>
              <span>-{formatINR(couponDiscountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-foreground/10 pt-2 font-heading text-base font-bold">
            <span>Total</span>
            <span>{formatINR(finalTotal)}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="saffron"
          size="lg"
          className="mt-5 w-full cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          Book Now
        </Button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs opacity-60">
          <ShieldCheck size={13} /> Secure payments via UPI, Cards & Netbanking
        </p>
      </motion.div>

      {/* Booking Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-foreground/10 bg-surface p-6 shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={resetBookingModal}
                className="absolute right-4 top-4 rounded-full p-1.5 opacity-60 hover:opacity-100 hover:bg-foreground/5 cursor-pointer"
              >
                <X size={20} />
              </button>

              {bookingSuccess ? (
                <div className="text-center py-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest/20 text-forest-light">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="mt-4 font-heading text-2xl font-bold">Booking Confirmed!</h3>
                  <p className="mt-2 text-sm opacity-75">{bookingSuccess.message}</p>

                  <div className="mt-6 rounded-2xl border border-foreground/10 bg-foreground/5 p-4 text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="opacity-60">Booking Reference:</span>
                      <span className="font-mono font-bold text-saffron">{bookingSuccess.bookingRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Trip:</span>
                      <span className="font-semibold">{pkg.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Date:</span>
                      <span>{formatDateLabel(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Pickup:</span>
                      <span>{pickup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Seats:</span>
                      <span>{seats}</span>
                    </div>
                    {bookingSuccess.orderId && (
                      <div className="flex justify-between">
                        <span className="opacity-60">Order ID:</span>
                        <span className="font-mono text-xs">{bookingSuccess.orderId}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-foreground/10 pt-2 font-bold text-base">
                      <span>Total:</span>
                      <span>{formatINR(bookingSuccess.totalAmount)} <span className="text-xs font-normal opacity-60">({bookingSuccess.paymentStatus || 'PENDING'})</span></span>
                    </div>
                    {bookingSuccess.paymentStatus === 'PENDING' && (
                      <p className="text-xs text-amber-600">Payment pending — use Checkout template to mark as PAID (mock).</p>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    {bookingSuccess.orderId && bookingSuccess.paymentStatus === 'PENDING' && (
                      <Button type="button" variant="outline" className="flex-1" asChild>
                        <a href={`/checkout/payment?orderId=${bookingSuccess.orderId}&bookingRef=${bookingSuccess.bookingRef}`}>Go to Payment</a>
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="saffron"
                      className="flex-1 cursor-pointer"
                      onClick={resetBookingModal}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-heading text-xl font-bold sm:text-2xl">
                    Confirm Your Booking
                  </h3>
                    <p className="mt-1 text-xs opacity-60">
                    {pkg.title} • {formatDateLabel(selectedDate)} • {seats} seat(s)
                  </p>

                  <div className="mt-4 rounded-xl border border-foreground/10 bg-foreground/5 p-3 text-xs flex justify-between">
                    <div>
                      <p className="opacity-50">Total Amount</p>
                      <p className="font-heading text-lg font-bold text-saffron">{formatINR(finalTotal)}</p>
                    </div>
                    <div className="text-right">
                      <p className="opacity-50">Pickup</p>
                      <p className="font-medium">{pickup}</p>
                    </div>
                  </div>

                  {submitError && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitBooking} className="mt-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Aditi Sharma"
                        className="w-full rounded-xl border border-foreground/15 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-royal"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="aditi@example.com"
                          className="w-full rounded-xl border border-foreground/15 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-royal"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">
                          Phone *
                        </label>
                        <div className="flex gap-2">
                          <select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} className="rounded-xl border border-foreground/15 bg-transparent px-2 py-2 text-sm">
                            {countries.map((c) => (
                              <option key={c.code + c.dial} value={c.dial}>{c.flag} {c.dial}</option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            required
                            maxLength={15}
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value.replace(/\D/g, ""))}
                            placeholder="9876543210"
                            className="flex-1 rounded-xl border border-foreground/15 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-royal"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">
                        Special Requests (optional)
                      </label>
                      <textarea
                        rows={2}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Dietary preferences, medical conditions, etc."
                        className="w-full rounded-xl border border-foreground/15 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-royal"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetBookingModal}
                        className="flex-1 cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="saffron"
                        disabled={isSubmitting}
                        className="flex-1 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin" /> Confirming...
                          </span>
                        ) : (
                          `Confirm (${formatINR(finalTotal)})`
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
