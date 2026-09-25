"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="font-heading text-4xl font-bold">Terms &amp; Conditions</h1>
          <div className="mt-8 space-y-6 text-sm text-foreground/70 leading-relaxed">
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground">1. Booking &amp; Payment</h2>
              <p>A booking is confirmed only after full payment is received. Prices are per person and inclusive of all taxes unless stated otherwise.</p>
            </section>
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground">2. Traveller Responsibility</h2>
              <p>Travellers must follow the guide&apos;s instructions, carry the recommended gear and inform us of any medical conditions before the trip.</p>
            </section>
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground">3. Liability</h2>
              <p>Bharath Treks & Tales is not liable for injuries, loss or damage arising from personal negligence, force majeure events, or circumstances beyond our control.</p>
            </section>
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground">4. Photography</h2>
              <p>We may photograph trips for marketing. Travellers who do not wish to be featured should inform us before the trip begins.</p>
            </section>
          </div>
          <Link href="/" className="mt-8 inline-block text-sm font-medium text-saffron hover:text-saffron-light">← Back to Home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
