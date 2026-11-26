import { after, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { generateTripFromItinerary } from "@/lib/ai/generateTrip";
import { flattenItineraryDays } from "@/lib/data";
import { generateRequestSchema, slugify } from "@/lib/trip-schema";
import { tripsCollection, uniqueSlug, type TripDoc } from "@/lib/trips";

// Research + generation can take a few minutes; `after()` keeps running up to this limit.
export const maxDuration = 300;

const bodySchema = generateRequestSchema.extend({
  id: z.string().regex(/^[A-Za-z0-9_-]{10,40}$/, "Invalid trip id"),
  research: z.boolean().default(true),
});

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Creates a draft trip and generates its content with AI in the background. */
export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }
  const input = parsed.data;
  if (input.files.length === 0 && !input.pastedText.trim()) {
    return NextResponse.json({ error: "Upload an itinerary file or paste the itinerary text." }, { status: 400 });
  }
  if (input.files.some((f) => !f.path.startsWith(`trips/${input.id}/`))) {
    return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
  }

  const ref = tripsCollection().doc(input.id);
  if ((await ref.get()).exists) {
    return NextResponse.json({ error: "Trip already exists" }, { status: 409 });
  }

  const now = Date.now();
  const departures = input.departures.filter((d) => ISO_DATE.test(d));
  const draft: Omit<TripDoc, "id"> = {
    status: "generating",
    rating: 0,
    reviewCount: 0,
    createdAt: now,
    updatedAt: now,
    image: input.photos[0] ?? "",
    gallery: input.photos.slice(1),
    price: input.price,
    discountPrice: input.discountPrice || input.price,
    seatsLeft: input.seatsLeft,
    departures,
    source: { pastedText: input.pastedText, files: input.files, notes: input.notes },
  };
  await ref.set(draft);

  after(async () => {
    try {
      const ai = await generateTripFromItinerary({
        files: input.files,
        pastedText: input.pastedText,
        notes: input.notes,
        research: input.research,
      });
      const { priceFromItinerary, departureDatesFromItinerary, ...content } = ai;
      const price = input.price || priceFromItinerary || 0;
      const itineraryDays = content.itineraryDays.map((d) => ({ ...d, schedule: [] }));
      await ref.update({
        ...content,
        itineraryDays,
        itinerary: flattenItineraryDays(itineraryDays),
        slug: await uniqueSlug(slugify(ai.title), input.id),
        price,
        discountPrice: input.discountPrice || price,
        departures: departures.length
          ? departures
          : departureDatesFromItinerary.filter((d) => ISO_DATE.test(d)),
        guideIncluded: true,
        status: "draft",
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error("Trip generation failed", err);
      await ref.update({
        status: "failed",
        error: err instanceof Error ? err.message : "Generation failed",
        updatedAt: Date.now(),
      });
    }
  });

  return NextResponse.json({ id: input.id });
}
