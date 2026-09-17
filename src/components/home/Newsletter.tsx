"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal via-royal to-forest px-8 py-14 text-center text-white sm:px-16"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-saffron/20 blur-3xl" />
        <h2 className="relative font-heading text-2xl font-bold sm:text-3xl">
          Get the next trip in your inbox
        </h2>
        <p className="relative mx-auto mt-2 max-w-md text-sm text-white/75">
          Early access to new treks, temple yatras and weekend deals — no spam, just journeys.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-full bg-white/10 px-5 py-3 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <Button type="submit" variant="saffron" className="shrink-0">
            Subscribe <Send size={14} />
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
