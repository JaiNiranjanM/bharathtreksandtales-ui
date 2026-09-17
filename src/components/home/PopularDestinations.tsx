"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { states, packages } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

const stateImages: Record<string, string> = {
  "Tamil Nadu": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200&auto=format&fit=crop",
  Karnataka: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
  Kerala: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?q=80&w=1200&auto=format&fit=crop",
  "Andhra Pradesh": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200&auto=format&fit=crop",
  Maharashtra: "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200&auto=format&fit=crop",
};

export function PopularDestinations() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeading
        eyebrow="Where to next"
        title="Popular Destinations"
        description="From temple towns to misty summits — explore trips by state."
      />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {states.map((state, i) => {
          const count = packages.filter((p) => p.state === state).length;
          return (
            <motion.div
              key={state}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/packages?state=${encodeURIComponent(state)}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <Image
                  src={stateImages[state]}
                  alt={state}
                  fill
                  sizes="20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-heading text-base font-semibold text-white">{state}</h3>
                  <p className="text-xs text-white/70">{count} trips</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
