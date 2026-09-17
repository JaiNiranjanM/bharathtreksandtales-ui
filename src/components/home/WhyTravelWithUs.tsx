"use client";

import { motion } from "framer-motion";
import { ShieldCheck, MapPinned, Users, Sparkles, Wallet, HeartHandshake } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const reasons = [
  { icon: ShieldCheck, title: "Verified & Safe", desc: "Trained guides, first-aid kits and vetted stays on every trip." },
  { icon: MapPinned, title: "120+ Destinations", desc: "From coastal temples to Western Ghats summits, across South India." },
  { icon: Users, title: "Small Group Sizes", desc: "Personal, unhurried experiences instead of crowded buses." },
  { icon: Wallet, title: "Transparent Pricing", desc: "No hidden costs — what you see is what you pay." },
  { icon: Sparkles, title: "Handpicked Experiences", desc: "Every itinerary is tested by our own team before it goes live." },
  { icon: HeartHandshake, title: "24x7 Support", desc: "A real human on WhatsApp, before, during and after your trip." },
];

export function WhyTravelWithUs() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeading
        eyebrow="Why Bharath Treks & Tales"
        title="Travel with people who care about the journey"
        align="center"
        className="mb-12"
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-2xl border border-foreground/10 bg-surface p-6 transition-shadow hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-royal/10 text-royal-light">
              <r.icon size={20} />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold">{r.title}</h3>
            <p className="mt-1.5 text-sm opacity-70">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
