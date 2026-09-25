"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function CancellationPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="font-heading text-4xl font-bold">Cancellation Policy</h1>
          <div className="mt-8 space-y-6 text-sm text-foreground/70 leading-relaxed">
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground">Refund Timeline</h2>
              <ul className="mt-3 space-y-2">
                <li><strong>7+ days before departure:</strong> Full refund (100%)</li>
                <li><strong>3–7 days before departure:</strong> 50% refund</li>
                <li><strong>Within 72 hours:</strong> No refund</li>
              </ul>
            </section>
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground">How to Cancel</h2>
              <p>Email us at support@bharathtreksandtales.com with your booking ID. Refunds are processed within 5–7 business days to the original payment method.</p>
            </section>
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground">Weather Cancellations</h2>
              <p>If a trip is cancelled by Bharath Treks & Tales due to weather or safety concerns, you will receive a full refund or the option to reschedule at no extra cost.</p>
            </section>
          </div>
          <Link href="/" className="mt-8 inline-block text-sm font-medium text-saffron hover:text-saffron-light">← Back to Home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
