"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const reviews = [
  {
    name: "Ananya R.",
    trip: "Kudremukh Monsoon Trek",
    text: "The mist, the guides, the campfire — everything felt effortless. I've never seen a travel company this organized.",
    rating: 5,
  },
  {
    name: "Karthik S.",
    trip: "Tirupati Balaji Darshan Yatra",
    text: "Special entry darshan exactly as promised. My parents were so comfortable throughout the trip.",
    rating: 5,
  },
  {
    name: "Meera & Arjun",
    trip: "Coorg Waterfalls Couple Retreat",
    text: "Our homestay had a view straight out of a postcard. Best weekend we've had in years.",
    rating: 5,
  },
  {
    name: "Divya K.",
    trip: "Skandagiri Night Trek",
    text: "Solo and slightly nervous, but the group and guide made it one of my favourite memories.",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface-muted py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Traveller Stories"
          title="Loved by explorers across India"
          align="center"
          className="mb-12"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl bg-surface p-6 shadow-sm"
            >
              <Quote className="text-gold" size={22} />
              <p className="mt-3 flex-1 text-sm opacity-80">&ldquo;{r.text}&rdquo;</p>
              <div className="mt-4 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={13}
                    className={s < r.rating ? "fill-gold text-gold" : "text-foreground/20"}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm font-semibold">{r.name}</p>
              <p className="text-xs opacity-60">{r.trip}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
