import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Plus, Sparkles } from "lucide-react";
import { listTripsForAdmin } from "@/lib/trips";
import { requireAdminPage } from "@/lib/auth";
import { getDepartureLabels } from "@/lib/data";
import { tripDocToPackage } from "@/lib/trip-doc";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminTripsPage() {
  // Layouts and pages render in parallel, so each page checks auth before loading data.
  await requireAdminPage();
  const trips = await listTripsForAdmin();
  const missingAi = !process.env.ANTHROPIC_API_KEY;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Trips</h1>
          <p className="mt-1 text-sm opacity-60">
            Upload an itinerary and AI builds the trip page. Review, edit and publish.
          </p>
        </div>
        <Link
          href="/admin/trips/new"
          className="flex items-center gap-1.5 rounded-full bg-royal px-5 py-2.5 text-sm font-medium text-white hover:bg-royal-light"
        >
          <Plus size={16} /> New trip
        </Link>
      </div>

      {missingAi && (
        <p className="mt-6 rounded-xl bg-saffron/10 p-4 text-sm text-saffron">
          ANTHROPIC_API_KEY is not set, so AI generation will fail. Add it to .env.local and restart the server.
        </p>
      )}

      {trips.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-foreground/15 bg-surface p-12 text-center">
          <Sparkles size={28} className="text-saffron" />
          <h2 className="mt-3 font-heading text-xl font-bold">No trips yet</h2>
          <p className="mt-1 max-w-sm text-sm opacity-60">
            Create your first trip by uploading an itinerary as a PDF, Word file, screenshot or pasted text.
          </p>
          <Link
            href="/admin/trips/new"
            className="mt-5 rounded-full bg-royal px-5 py-2.5 text-sm font-medium text-white hover:bg-royal-light"
          >
            Create a trip
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-foreground/10 bg-surface">
          <ul className="divide-y divide-foreground/10">
            {trips.map((trip) => {
              const pkg = tripDocToPackage(trip);
              const next = trip.departures?.length ? getDepartureLabels(pkg)[0] : undefined;
              return (
                <li key={trip.id} className="flex items-center gap-4 p-4">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-foreground/5">
                    {trip.image && (
                      <Image src={trip.image} alt="" fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">
                        {trip.title ?? (trip.status === "generating" ? "Generating…" : "Untitled trip")}
                      </p>
                      <StatusBadge status={trip.status} />
                    </div>
                    <p className="mt-0.5 truncate text-xs opacity-60">
                      {[trip.location, trip.duration, next && `Next: ${next}`].filter(Boolean).join(" · ") ||
                        "—"}
                      {" · "}Updated {new Date(trip.updatedAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {trip.status === "published" && trip.slug && (
                      <Link
                        href={`/packages/${trip.slug}`}
                        target="_blank"
                        className="rounded-full p-2 hover:bg-foreground/5"
                        title="View live page"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    )}
                    <Link
                      href={`/admin/trips/${trip.id}`}
                      className="flex items-center gap-1 rounded-full border border-foreground/15 px-3 py-1.5 text-xs font-medium hover:bg-foreground/5"
                    >
                      <Pencil size={13} /> {trip.status === "generating" ? "Open" : "Edit"}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
