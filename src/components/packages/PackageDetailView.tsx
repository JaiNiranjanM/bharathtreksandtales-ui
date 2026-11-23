import Image from "next/image";
import {
  MapPin,
  Mountain,
  Thermometer,
  Star,
  CheckCircle2,
  XCircle,
  Backpack,
  Users,
  Utensils,
  Bus,
  Route,
  CalendarRange,
  ShieldAlert,
  Link2,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PackageCard } from "@/components/packages/PackageCard";
import { BookingSidebar } from "@/components/packages/BookingSidebar";
import type { TravelPackage } from "@/lib/data";

/**
 * The trip page body. Used by the public trip page and the admin live preview,
 * so what the admin previews is exactly what gets published.
 */
export function PackageDetailView({
  pkg,
  related = [],
}: {
  pkg: TravelPackage;
  related?: TravelPackage[];
}) {
  const facts = [
    { icon: Mountain, label: "Altitude", value: pkg.altitude },
    { icon: Route, label: "Trek Distance", value: pkg.trekDistance },
    { icon: Thermometer, label: "Weather", value: pkg.weather },
    { icon: CalendarRange, label: "Best Season", value: pkg.bestSeason },
    { icon: Utensils, label: "Meals", value: pkg.meals },
    { icon: Bus, label: "Transport", value: pkg.transportation },
  ].filter((f) => f.value && f.value !== "N/A");

  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
        {pkg.image && (
          <Image src={pkg.image} alt={pkg.title} fill priority className="object-cover" sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-8">
          <div className="flex flex-wrap gap-2">
            <Badge variant="saffron" className="bg-saffron text-white">
              {pkg.difficulty}
            </Badge>
            {pkg.duration && (
              <Badge variant="outline" className="border-white/30 text-white">
                {pkg.duration}
              </Badge>
            )}
          </div>
          <h1 className="mt-3 max-w-2xl font-heading text-3xl font-bold text-white sm:text-5xl">
            {pkg.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {[pkg.location, pkg.state].filter(Boolean).join(", ")}
            </span>
            {pkg.reviewCount > 0 ? (
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-gold text-gold" /> {pkg.rating} (
                {pkg.reviewCount.toLocaleString()} reviews)
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Star size={14} className="text-gold" /> New trip
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      {pkg.gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-6">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {pkg.gallery.map((src, i) => (
              <div key={i} className="relative aspect-video overflow-hidden rounded-xl">
                <Image src={src} alt={`${pkg.title} photo ${i + 1}`} fill sizes="25vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pt-6 pb-20 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          {/* Quick facts */}
          {facts.length > 0 && (
            <section className="grid grid-cols-2 gap-4 rounded-2xl border border-foreground/10 bg-surface p-5 sm:grid-cols-3">
              {facts.map((f) => (
                <Fact key={f.label} icon={f.icon} label={f.label} value={f.value!} />
              ))}
            </section>
          )}

          {/* Overview */}
          {pkg.overview && (
            <section>
              <h2 className="font-heading text-2xl font-bold">About this Trip</h2>
              <p className="mt-3 text-sm leading-relaxed opacity-80">{pkg.overview}</p>
            </section>
          )}

          {/* Highlights */}
          {(pkg.highlights.length > 0 || pkg.temples.length > 0) && (
            <section>
              <h2 className="font-heading text-2xl font-bold">Trip Highlights</h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pkg.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-forest-light" />
                    {h}
                  </li>
                ))}
              </ul>
              {pkg.temples.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {pkg.temples.map((t) => (
                    <Badge key={t} variant="gold">
                      🛕 {t}
                    </Badge>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Itinerary */}
          {pkg.itinerary.length > 0 && (
            <section>
              <h2 className="font-heading text-2xl font-bold">Itinerary Timeline</h2>
              {(pkg.departure || pkg.returnTime) && (
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm opacity-70">
                  <Clock size={14} />
                  {pkg.departure && <span>Departure: {pkg.departure}</span>}
                  {pkg.returnTime && <span>Return: {pkg.returnTime}</span>}
                </p>
              )}
              <div className="mt-6 space-y-6 border-l-2 border-foreground/10 pl-6">
                {pkg.itinerary.map((step, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-royal bg-surface" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-royal-light">
                      {step.time}
                    </p>
                    <p className="mt-1 text-sm">{step.activity}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pickup points */}
          {pkg.pickupLocations.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold">
                <MapPin size={19} /> Pickup Points
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {pkg.pickupLocations.map((p) => (
                  <Badge key={p} variant="outline">
                    {p}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Inclusions / Exclusions */}
          {(pkg.inclusions.length > 0 || pkg.exclusions.length > 0) && (
            <section className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-heading text-lg font-bold">Inclusions</h3>
                <ul className="mt-3 space-y-2">
                  {pkg.inclusions.map((i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={15} className="shrink-0 text-forest-light" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold">Exclusions</h3>
                <ul className="mt-3 space-y-2">
                  {pkg.exclusions.map((i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <XCircle size={15} className="shrink-0 text-saffron" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Things to carry */}
          {pkg.thingsToCarry.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold">
                <Backpack size={19} /> Things to Carry
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {pkg.thingsToCarry.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Difficulty meter */}
          <section>
            <h3 className="font-heading text-lg font-bold">Difficulty &amp; Fitness Level</h3>
            <div className="mt-3 h-2.5 w-full max-w-md overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-forest-light via-gold to-saffron"
                style={{
                  width:
                    pkg.difficulty === "Easy"
                      ? "25%"
                      : pkg.difficulty === "Moderate"
                      ? "55%"
                      : pkg.difficulty === "Challenging"
                      ? "80%"
                      : "100%",
                }}
              />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm opacity-70">
              <Users size={14} /> Recommended fitness: {pkg.difficulty}
            </p>
          </section>

          {/* Safety */}
          {pkg.safetyNotes && pkg.safetyNotes.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold">
                <ShieldAlert size={19} /> Safety &amp; Good to Know
              </h3>
              <ul className="mt-3 space-y-2">
                {pkg.safetyNotes.map((n) => (
                  <li key={n} className="flex items-start gap-2 text-sm opacity-80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" /> {n}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Sources */}
          {pkg.sources && pkg.sources.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold opacity-60">
                <Link2 size={14} /> Sources
              </h3>
              <ul className="mt-2 space-y-1 text-xs opacity-60">
                {pkg.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {s.title || s.url}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sticky booking sidebar */}
        <div>
          <BookingSidebar pkg={pkg} />
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <h2 className="font-heading text-2xl font-bold">You may also like</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <PackageCard key={p.id} pkg={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={18} className="mt-0.5 shrink-0 text-royal-light" />
      <div>
        <p className="text-xs opacity-50">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
