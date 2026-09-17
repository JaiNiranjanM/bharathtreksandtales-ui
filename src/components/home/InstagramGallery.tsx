"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { packages } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

const shots = packages.flatMap((p) => p.gallery).slice(0, 8);

export function InstagramGallery() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="#BharathTreksAndTales"
          title="Follow the journey"
          description="Real moments from real trips, shared by our travellers."
        />
        <a
          href="#"
          className="flex shrink-0 items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5"
        >
          <InstagramIcon size={16} /> @bharathtreksandtales
        </a>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8">
        {shots.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={src}
              alt="Travel moment"
              fill
              sizes="12vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
              <InstagramIcon
                size={18}
                className="text-white opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
