import { notFound } from "next/navigation";
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
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { PackageCard } from "@/components/packages/PackageCard";
import { BookingSidebar } from "@/components/packages/BookingSidebar";
import { getPackageBySlug, getRelatedPackages, packages } from "@/lib/data";

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) notFound();

  const related = getRelatedPackages(pkg);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
          <Image src={pkg.image} alt={pkg.title} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-8">
            <div className="flex flex-wrap gap-2">
              <Badge variant="saffron" className="bg-saffron text-white">
                {pkg.difficulty}
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {pkg.duration}
              </Badge>
            </div>
            <h1 className="mt-3 max-w-2xl font-heading text-3xl font-bold text-white sm:text-5xl">
              {pkg.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {pkg.location}, {pkg.state}
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-gold text-gold" /> {pkg.rating} ({pkg.reviewCount.toLocaleString()} reviews)
              </span>
            </div>
          </div>
        </section>

        {/* Gallery strip */}
        <section className="mx-auto max-w-7xl px-6 py-6">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {pkg.gallery.map((src, i) => (
              <div key={i} className="relative aspect-video overflow-hidden rounded-xl">
                <Image src={src} alt={`${pkg.title} photo ${i + 1}`} fill sizes="25vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-20 lg:grid-cols-[1fr_360px]">
          <div className="space-y-12">
            {/* Quick facts */}
            <section className="grid grid-cols-2 gap-4 rounded-2xl border border-foreground/10 bg-surface p-5 sm:grid-cols-4">
              <Fact icon={Mountain} label="Altitude" value={pkg.altitude} />
              <Fact icon={Thermometer} label="Weather" value={pkg.weather} />
              <Fact icon={Utensils} label="Meals" value={pkg.meals} />
              <Fact icon={Bus} label="Transport" value={pkg.transportation} />
            </section>

            {/* Highlights */}
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

            {/* Itinerary */}
            <section>
              <h2 className="font-heading text-2xl font-bold">Itinerary Timeline</h2>
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

            {/* Inclusions / Exclusions */}
            <section className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-heading text-lg font-bold">Inclusions</h3>
                <ul className="mt-3 space-y-2">
                  {pkg.inclusions.map((i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={15} className="text-forest-light" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold">Exclusions</h3>
                <ul className="mt-3 space-y-2">
                  {pkg.exclusions.map((i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <XCircle size={15} className="text-saffron" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Things to carry */}
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
      </main>
      <Footer />
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
