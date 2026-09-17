"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users } from "lucide-react";
import type { CompletedTrip } from "@/lib/completedTrips";
import { Badge } from "@/components/ui/badge";

export function PastTripCard({ trip, index = 0 }: { trip: CompletedTrip; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -8 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/10"
    >
      <Link href={`/past-trips/${trip.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={trip.image}
          alt={trip.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <div className="absolute left-3 top-3">
          <Badge variant="forest" className="bg-forest text-white">
            ✓ Completed
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="flex items-center gap-1.5 text-xs text-white/85">
            <Calendar size={12} /> {trip.datesLabel}
          </p>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1 text-xs opacity-60">
          <MapPin size={12} />
          {trip.location}, {trip.state}
        </div>

        <Link href={`/past-trips/${trip.slug}`}>
          <h3 className="mt-1.5 line-clamp-1 font-heading text-base font-semibold transition-colors group-hover:text-royal-light">
            {trip.title}
          </h3>
        </Link>

        <p className="mt-2 flex items-center gap-1.5 text-xs opacity-70">
          <Users size={12} /> Groups from {trip.groupsFrom.join(" & ")}
        </p>

        <p className="mt-3 line-clamp-2 flex-1 text-xs opacity-70">{trip.highlights[0]}</p>

        <Link
          href={`/past-trips/${trip.slug}`}
          className="mt-4 inline-flex items-center gap-1 self-start text-xs font-semibold text-royal-light"
        >
          Relive the journey →
        </Link>
      </div>
    </motion.div>
  );
}
