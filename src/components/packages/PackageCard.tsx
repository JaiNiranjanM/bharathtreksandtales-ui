"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Share2, Star, MapPin, Clock, Users } from "lucide-react";
import type { TravelPackage } from "@/lib/data";
import { formatINR, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";

const difficultyColor: Record<string, string> = {
  Easy: "forest",
  Moderate: "gold",
  Challenging: "saffron",
  Extreme: "saffron",
};

export function PackageCard({ pkg, index = 0 }: { pkg: TravelPackage; index?: number }) {
  const wishlist = useAppStore((s) => s.wishlist);
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const wishlisted = wishlist.includes(pkg.id);
  const discountPct = Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -8 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/10"
    >
      <Link href={`/packages/${pkg.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {discountPct > 0 && (
            <Badge variant="saffron" className="bg-saffron text-white">
              {discountPct}% OFF
            </Badge>
          )}
          <Badge variant={difficultyColor[pkg.difficulty] as "forest" | "gold" | "saffron"}>
            {pkg.difficulty}
          </Badge>
        </div>

        {pkg.seatsLeft <= 6 && (
          <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            Only {pkg.seatsLeft} seats left
          </div>
        )}

        <div className="absolute right-3 top-3 flex gap-2">
          <button
            aria-label="Wishlist"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(pkg.id);
            }}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-colors cursor-pointer",
              wishlisted ? "bg-saffron text-white" : "bg-white/25 text-white hover:bg-white/40"
            )}
          >
            <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
          </button>
          <button
            aria-label="Share"
            onClick={(e) => e.preventDefault()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-md transition-colors hover:bg-white/40 cursor-pointer"
          >
            <Share2 size={14} />
          </button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1 text-xs opacity-60">
          <MapPin size={12} />
          {pkg.location}, {pkg.state}
        </div>

        <Link href={`/packages/${pkg.slug}`}>
          <h3 className="mt-1.5 line-clamp-1 font-heading text-base font-semibold transition-colors group-hover:text-royal-light">
            {pkg.title}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-3 text-xs opacity-70">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {pkg.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} /> {pkg.guideIncluded ? "Guide included" : "Self guided"}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs">
          <Star size={13} className="fill-gold text-gold" />
          <span className="font-medium">{pkg.rating}</span>
          <span className="opacity-60">({pkg.reviewCount.toLocaleString()})</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {discountPct > 0 && (
              <span className="mr-1.5 text-xs opacity-50 line-through">
                {formatINR(pkg.price)}
              </span>
            )}
            <span className="font-heading text-lg font-bold">{formatINR(pkg.discountPrice)}</span>
            <span className="text-xs opacity-60"> /person</span>
          </div>
          <Link
            href={`/packages/${pkg.slug}`}
            className="rounded-full bg-royal px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-royal-light"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
