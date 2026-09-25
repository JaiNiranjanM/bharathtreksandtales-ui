"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Mountain, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-heading text-4xl font-bold">About Bharath Treks & Tales</h1>
          <p className="mt-4 max-w-2xl text-base text-foreground/70">
            We are a Chennai-based travel company crafting cinematic treks, spiritual pilgrimages
            and one-day adventures across South India. Every journey we design is backed by real
            guides, real seats and real stories.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-foreground/10 bg-surface p-6">
              <Mountain size={24} className="text-saffron" />
              <h3 className="mt-3 font-heading text-lg font-bold">Our Mission</h3>
              <p className="mt-2 text-sm text-foreground/60">
                To make India&apos;s incredible landscapes and sacred shrines accessible to every
                traveller — with safety, comfort and a story worth telling.
              </p>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-surface p-6">
              <Heart size={24} className="text-saffron" />
              <h3 className="mt-3 font-heading text-lg font-bold">Our Values</h3>
              <p className="mt-2 text-sm text-foreground/60">
                Small groups, expert local guides, sustainable practices and honest pricing.
                No hidden charges, no overcrowded buses.
              </p>
            </div>
          </div>

          <section className="mt-12 rounded-2xl border border-foreground/10 bg-surface p-6">
            <h2 className="font-heading text-2xl font-bold">Get in Touch</h2>
            <div className="mt-4 space-y-3 text-sm text-foreground/70">
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-royal-light" />
                The Executive Zone, Shakti Tower-1, No.766, Anna Salai, Chennai - 600002
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-royal-light" />
                +91 99440 48889 / +91 88077 50608
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-royal-light" />
                support@bharathtreksandtales.com
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
