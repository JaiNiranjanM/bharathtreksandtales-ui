import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, Wallet, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PastTripCard } from "@/components/past-trips/PastTripCard";
import {
  completedTrips,
  getCompletedTripBySlug,
  getSortedCompletedTrips,
} from "@/lib/completedTrips";

export function generateStaticParams() {
  return completedTrips.map((t) => ({ slug: t.slug }));
}

export default async function PastTripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getCompletedTripBySlug(slug);
  if (!trip) notFound();

  const related = getSortedCompletedTrips()
    .filter((t) => t.id !== trip.id)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
          <Image src={trip.image} alt={trip.title} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-6 pb-8">
            <Badge variant="forest" className="bg-forest text-white">
              ✓ Completed Trip
            </Badge>
            <h1 className="mt-3 max-w-2xl font-heading text-3xl font-bold text-white sm:text-5xl">
              {trip.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {trip.location}, {trip.state}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {trip.datesLabel}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-6">
          <div className="grid grid-cols-3 gap-3">
            {trip.gallery.map((src, i) => (
              <div key={i} className="relative aspect-video overflow-hidden rounded-xl">
                <Image src={src} alt={`${trip.title} photo ${i + 1}`} fill sizes="33vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-12 px-6 pb-20">
          <section className="grid grid-cols-2 gap-4 rounded-2xl border border-foreground/10 bg-surface p-5 sm:grid-cols-4">
            <Fact icon={Calendar} label="Duration" value={trip.durationLabel} />
            <Fact icon={Users} label="Groups From" value={trip.groupsFrom.join(" & ")} />
            <Fact icon={Wallet} label="Cost" value={trip.costLabel} />
            <Fact icon={CheckCircle2} label="Organizer" value={trip.organizer} />
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold">Trip Highlights</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {trip.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-forest-light" />
                  {h}
                </li>
              ))}
            </ul>
            {trip.temples.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {trip.temples.map((t) => (
                  <Badge key={t} variant="gold">
                    🛕 {t}
                  </Badge>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold">How the Trip Went</h2>
            <div className="mt-6 space-y-8 border-l-2 border-foreground/10 pl-6">
              {trip.itinerary.map((day) => (
                <div key={day.day} className="relative">
                  <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-royal bg-surface" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-royal-light">
                    {day.day} — {day.date}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {day.activities.map((activity, i) => (
                      <li key={i} className="text-sm opacity-80">
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-royal via-royal to-forest p-8 text-center text-white">
            <h3 className="font-heading text-xl font-bold">Want a trip like this?</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/75">
              Browse our upcoming treks and temple yatras and be part of the next story.
            </p>
            <Button variant="saffron" size="lg" className="mt-5" asChild>
              <Link href="/packages">Explore Upcoming Trips</Link>
            </Button>
          </section>
        </div>

        {related.length > 0 && (
          <section className="mx-auto max-w-5xl px-6 pb-20">
            <h2 className="font-heading text-2xl font-bold">More Trip Reports</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t, i) => (
                <PastTripCard key={t.id} trip={t} index={i} />
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
