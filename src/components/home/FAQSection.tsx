"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const faqs = [
  {
    q: "How do I book a trip?",
    a: "Pick a package, choose your date and pickup point, select seats, and pay online via UPI, card, net banking or wallet. You'll get an instant e-ticket by email and WhatsApp.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Free cancellation up to 72 hours before departure. Cancellations within 72 hours are subject to partial charges — full details are on each package page.",
  },
  {
    q: "Are guides included in every trip?",
    a: "Most treks and temple yatras include a trained guide. This is clearly marked on each package card and detail page.",
  },
  {
    q: "Can I reschedule my booking?",
    a: "Yes, you can reschedule once free of charge up to 48 hours before departure from your dashboard.",
  },
  {
    q: "Do you provide transportation from my city?",
    a: "Most packages include pickup from major points in Bangalore, Chennai, Hyderabad and Coimbatore. Exact pickup points are listed per trip.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeading eyebrow="Need to know" title="Frequently Asked Questions" align="center" className="mb-10" />
      <div className="flex flex-col gap-3">
        {faqs.map((f, i) => (
          <div key={f.q} className="overflow-hidden rounded-xl border border-foreground/10 bg-surface">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium cursor-pointer"
            >
              {f.q}
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.25 }}>
                <Plus size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm opacity-70">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
