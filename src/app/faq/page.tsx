"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I book a trip?",
    a: "Click 'Book Now' on any package page, select your preferred date and pickup location, enter your details and confirm. You'll receive a confirmation email instantly.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, credit/debit cards, netbanking and popular wallets. All payments are processed through secure, encrypted gateways.",
  },
  {
    q: "Can I cancel my booking?",
    a: "Yes. Free cancellation up to 7 days before departure. 50% refund for 3-7 days before. No refund within 72 hours. See our Cancellation Policy for details.",
  },
  {
    q: "What should I carry on a trek?",
    a: "Each package page lists specific items under 'Things to Carry'. Generally: water bottle, comfortable shoes, light jacket, sunscreen, and a small backpack.",
  },
  {
    q: "Are the trips safe for solo travellers?",
    a: "Absolutely. Our groups are led by certified trek leaders, and we maintain a low guide-to-traveller ratio. Many of our travellers come solo and leave with lifelong friends.",
  },
  {
    q: "Is food included in the trip?",
    a: "It varies by package. Each listing clearly states what meals are included — typically breakfast for day treks and all meals for overnight trips.",
  },
  {
    q: "Do you offer custom / private group bookings?",
    a: "Yes! We regularly arrange private trips for corporate teams, families and friend groups. Contact us at support@bharathtreksandtales.com for a custom quote.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="font-heading text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="mt-3 max-w-lg text-sm text-foreground/60">
            Everything you need to know before you book.
          </p>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-foreground/10 bg-surface overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-medium cursor-pointer"
                >
                  {faq.q}
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                {open === i && (
                  <div className="px-5 pb-5 text-sm text-foreground/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
