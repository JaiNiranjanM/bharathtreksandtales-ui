"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShieldCheck, Tag } from "lucide-react";
import type { TravelPackage } from "@/lib/data";
import { formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const dates = ["Sat, 2 Aug", "Sun, 3 Aug", "Sat, 9 Aug", "Sun, 10 Aug", "Sat, 16 Aug"];

export function BookingSidebar({ pkg }: { pkg: TravelPackage }) {
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [pickup, setPickup] = useState(pkg.pickupLocations[0]);
  const [seats, setSeats] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);

  const total = pkg.discountPrice * seats;
  const discount = (pkg.price - pkg.discountPrice) * seats;
  const couponDiscount = applied ? Math.round(total * 0.05) : 0;
  const finalTotal = total - couponDiscount;

  return (
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
              onClick={() => setSelectedDate(d)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                selectedDate === d
                  ? "border-royal bg-royal text-white"
                  : "border-foreground/15 hover:bg-foreground/5"
              )}
            >
              {d}
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
            onClick={() => setSeats((s) => Math.max(1, s - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 hover:bg-foreground/5 cursor-pointer"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-sm font-semibold">{seats}</span>
          <button
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
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-foreground/15 px-3 py-2">
            <Tag size={14} className="opacity-50" />
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              placeholder="TREK5"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
          <button
            onClick={() => setApplied(coupon.length > 0)}
            className="rounded-lg bg-forest px-3 text-xs font-semibold text-white cursor-pointer"
          >
            Apply
          </button>
        </div>
        {applied && <p className="mt-1.5 text-xs text-forest-light">Coupon applied! 5% off</p>}
      </div>

      <div className="mt-5 space-y-2 border-t border-foreground/10 pt-4 text-sm">
        <div className="flex justify-between opacity-70">
          <span>
            {formatINR(pkg.discountPrice)} x {seats}
          </span>
          <span>{formatINR(total)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-forest-light">
            <span>Package discount</span>
            <span>-{formatINR(discount)}</span>
          </div>
        )}
        {applied && (
          <div className="flex justify-between text-forest-light">
            <span>Coupon discount</span>
            <span>-{formatINR(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-foreground/10 pt-2 font-heading text-base font-bold">
          <span>Total</span>
          <span>{formatINR(finalTotal)}</span>
        </div>
      </div>

      <Button variant="saffron" size="lg" className="mt-5 w-full">
        Book Now
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs opacity-60">
        <ShieldCheck size={13} /> Secure payments via UPI, Cards & Netbanking
      </p>
    </motion.div>
  );
}
