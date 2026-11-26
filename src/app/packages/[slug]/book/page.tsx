import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/contact";
import { prettyDate, seatsLeft } from "@/lib/captain/core";
import { findBatchForTripDate } from "@/lib/captain/store";
import { getPackageBySlug } from "@/lib/trips";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book your trip | Bharath Treks & Tales",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string; seats?: string }>;
}) {
  const { slug } = await params;
  const { date = "", seats: seatsParam } = await searchParams;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const today = new Date().toISOString().slice(0, 10);
  const open = Boolean(pkg.departures?.includes(date)) && date >= today;
  // Seats left on this date: the batch's own count if it exists, otherwise the trip's full seat count.
  const batch = open ? await findBatchForTripDate(pkg.id, date) : null;
  const left = !open ? null : batch ? seatsLeft(batch) : pkg.seatsLeft;
  const soldOut = open && left === 0;
  const seats = Math.min(8, Math.max(1, Number(seatsParam) || 1), left ?? 8);

  return (
    <>
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <Link href={`/packages/${slug}`} className="mb-5 inline-flex items-center gap-1.5 text-sm opacity-70 hover:opacity-100">
            <ArrowLeft size={15} /> Back to the trip
          </Link>

          {soldOut ? (
            <div className="rounded-2xl border border-foreground/10 bg-surface p-8">
              <h1 className="font-heading text-2xl font-bold">This date is sold out</h1>
              <p className="mt-2 text-sm opacity-70">
                All seats on {prettyDate(date)} are taken. You can pick another date, or message us to join the waiting list.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href={`/packages/${slug}`}>Choose another date</Link>
                </Button>
                <Button asChild variant="saffron">
                  <a
                    href={whatsappLink(`Hi Bharath Treks & Tales, "${pkg.title}" on ${prettyDate(date)} is sold out. Please add me to the waiting list.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join the waiting list
                  </a>
                </Button>
              </div>
            </div>
          ) : !open ? (
            <div className="rounded-2xl border border-foreground/10 bg-surface p-8">
              <h1 className="font-heading text-2xl font-bold">Online booking is not open for this date yet</h1>
              <p className="mt-2 text-sm opacity-70">
                You can still book this trip by messaging us. We will confirm your seats and share the details.
              </p>
              <Button asChild variant="saffron" className="mt-5">
                <a
                  href={whatsappLink(`Hi Bharath Treks & Tales, I'd like to book "${pkg.title}"${date ? ` for ${date}` : ""}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book on WhatsApp
                </a>
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-foreground/10 bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron">Booking</p>
                <h1 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">{pkg.title}</h1>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm opacity-70">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} /> {prettyDate(date)}
                  </span>
                  {pkg.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {pkg.location}
                    </span>
                  )}
                </p>
                <p className="mt-3 text-sm">
                  {seats} {seats === 1 ? "seat" : "seats"} × {formatINR(pkg.discountPrice)} ={" "}
                  <strong>{formatINR(pkg.discountPrice * seats)}</strong>
                </p>
                {left !== null && left <= 6 && (
                  <p className="mt-2 text-xs font-medium text-saffron">
                    Only {left} {left === 1 ? "seat" : "seats"} left on this date.
                  </p>
                )}
                <p className="mt-1 text-xs opacity-60">
                  Nothing is charged on this page. Send your details and BTT will contact you to confirm your seats and share how to pay.
                </p>
              </div>

              <div className="mt-6">
                <RegistrationForm
                  endpoint="/api/public/book"
                  extra={{ tripId: pkg.id, date }}
                  pickupOptions={pkg.pickupLocations}
                  initialPeople={seats}
                  maxPeople={left ?? 8}
                  withContact
                  successText="Thank you! BTT will contact you shortly to confirm your seats and share payment details. No payment has been taken yet."
                />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
