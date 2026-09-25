"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="font-heading text-4xl font-bold">Privacy Policy</h1>
          <div className="mt-8 space-y-6 text-sm text-foreground/70 leading-relaxed">
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground">Information We Collect</h2>
              <p>We collect your name, email, phone number and payment details when you make a booking. We also collect browsing data to improve our website.</p>
            </section>
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground">How We Use It</h2>
              <p>Your data is used to process bookings, send trip confirmations, and occasionally share offers you may find relevant. We never sell your data to third parties.</p>
            </section>
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground">Data Security</h2>
              <p>All payment data is encrypted. We use secure servers and follow industry-standard practices to protect your information.</p>
            </section>
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground">Contact</h2>
              <p>For privacy-related queries, email us at support@bharathtreksandtales.com.</p>
            </section>
          </div>
          <Link href="/" className="mt-8 inline-block text-sm font-medium text-saffron hover:text-saffron-light">← Back to Home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
