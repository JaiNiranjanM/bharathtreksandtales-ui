import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { Button } from "@/components/ui/button";
import { prettyDate, registrationOpen } from "@/lib/captain/core";
import { getBatchByJoinToken } from "@/lib/captain/store";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { getTrip } from "@/lib/trips";

export const metadata: Metadata = {
  title: "Trip registration | Bharath Treks & Tales",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** The page behind a batch's registration link. The code in the address ties it to one trip and date. */
export default async function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const batch = isFirebaseConfigured() ? await getBatchByJoinToken(token) : null;
  const open = batch ? registrationOpen(batch) : false;

  // Offer the trip's pickup points when this batch is tied to a trip on the site.
  const trip = open && batch?.tripId ? await getTrip(batch.tripId).catch(() => null) : null;

  return (
    <>
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          {!batch || !open ? (
            <div className="rounded-2xl border border-foreground/10 bg-surface p-8">
              <h1 className="font-heading text-2xl font-bold">This registration link is closed</h1>
              <p className="mt-2 text-sm opacity-70">
                It may have expired, or registration for this trip is full. Please contact BTT and we will help you.
              </p>
              <Button asChild variant="saffron" className="mt-5">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                  Message BTT on WhatsApp
                </a>
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-foreground/10 bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron">Trip registration</p>
                <h1 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">{batch.tripTitle}</h1>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm opacity-70">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} /> {prettyDate(batch.startDate)}
                    {batch.endDate !== batch.startDate && ` to ${prettyDate(batch.endDate)}`}
                  </span>
                  {batch.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {batch.location}
                    </span>
                  )}
                </p>
                <p className="mt-3 text-sm opacity-70">
                  Please fill in your details so the trip team can plan pickups and look after everyone safely.
                </p>
              </div>

              <div className="mt-6">
                <RegistrationForm
                  endpoint={`/api/public/join/${token}`}
                  extra={{}}
                  pickupOptions={trip?.pickupLocations ?? []}
                  initialPeople={1}
                  withContact={false}
                  successText="Thank you! Your details have reached BTT. We will be in touch if we need anything else."
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
