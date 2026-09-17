"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { Search, MapPin, Calendar, Users as UsersIcon } from "lucide-react";
import { categories, packages, getCategory, type CategoryId } from "@/lib/data";
import { Button } from "@/components/ui/button";

const slides = packages.slice(0, 5);

export function HeroSection({ selectedCategory }: { selectedCategory: CategoryId | null }) {
  const category = selectedCategory ? getCategory(selectedCategory) : null;

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-24">
      <div className="absolute inset-0">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop
          className="h-full w-full"
        >
          {slides.map((s) => (
            <SwiperSlide key={s.id}>
              <div className="relative h-full w-full">
                <Image src={s.image} alt={s.title} fill priority className="object-cover" sizes="100vw" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {category ? `${category.icon} ${category.label} Journeys` : "Incredible India Awaits"}
          </p>
          <h1 className="max-w-2xl text-balance font-heading text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl">
            {category
              ? category.description
              : "Treks, Temples & Tales — crafted across the length of India."}
          </h1>
          <p className="mt-5 max-w-lg text-sm text-white/75 sm:text-base">
            Curated one day trips, spiritual pilgrimages, treks and weekend escapes —
            with real guides, real seats, and real stories.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" variant="saffron" asChild>
              <Link href="/packages">Explore Trips</Link>
            </Button>
            <Button size="lg" variant="glass" asChild>
              <Link href="/explore">Explore India Map</Link>
            </Button>
          </div>
        </motion.div>

        {/* search bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="glass mt-12 flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
            <MapPin size={16} className="text-white/70" />
            <input
              placeholder="Where to? Try 'Coorg' or 'Tirupati'"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
            />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
            <Calendar size={16} className="text-white/70" />
            <input
              type="date"
              className="w-full bg-transparent text-sm text-white focus:outline-none [color-scheme:dark]"
            />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
            <UsersIcon size={16} className="text-white/70" />
            <input
              placeholder="Travellers"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
            />
          </div>
          <Button size="lg" variant="saffron" className="shrink-0">
            <Search size={16} /> Search
          </Button>
        </motion.div>

        {/* category quick chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/packages?category=${c.id}`}
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white/85 backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <span>{c.icon}</span> {c.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
