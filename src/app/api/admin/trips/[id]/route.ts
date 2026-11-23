import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { adminBucket } from "@/lib/firebase/admin";
import { flattenItineraryDays } from "@/lib/data";
import { tripInputSchema } from "@/lib/trip-schema";
import { getTrip, isSlugTaken, tripsCollection, TRIPS_TAG } from "@/lib/trips";

type Ctx = { params: Promise<{ id: string }> };

async function unauthorized() {
  return (await getAdminSession()) ? null : NextResponse.json({ error: "Not signed in" }, { status: 401 });
}

export async function GET(_req: Request, { params }: Ctx) {
  const denied = await unauthorized();
  if (denied) return denied;
  const trip = await getTrip((await params).id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(trip);
}

const saveSchema = z.object({
  trip: tripInputSchema,
  status: z.enum(["draft", "published"]),
});

/** Saves the edited trip, optionally publishing or unpublishing it. */
export async function PUT(request: Request, { params }: Ctx) {
  const denied = await unauthorized();
  if (denied) return denied;
  const { id } = await params;

  const existing = await getTrip(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.status === "generating") {
    return NextResponse.json({ error: "The trip is still being generated." }, { status: 409 });
  }

  const parsed = saveSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue ? `${issue.path.join(".")}: ${issue.message}` : "Invalid trip" },
      { status: 400 }
    );
  }
  const { trip, status } = parsed.data;
  if (await isSlugTaken(trip.slug, id)) {
    return NextResponse.json({ error: `The URL "${trip.slug}" is already used by another trip.` }, { status: 409 });
  }

  const now = Date.now();
  await tripsCollection()
    .doc(id)
    .update({
      ...trip,
      itinerary: trip.itineraryDays.length ? flattenItineraryDays(trip.itineraryDays) : trip.itinerary,
      discountPrice: trip.discountPrice || trip.price,
      status,
      error: null,
      updatedAt: now,
      ...(status === "published" && !existing.publishedAt ? { publishedAt: now } : {}),
    });

  if (status === "published" || existing.status === "published") revalidateTag(TRIPS_TAG);
  return NextResponse.json({ ok: true, slug: trip.slug });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await unauthorized();
  if (denied) return denied;
  const { id } = await params;
  const existing = await getTrip(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await tripsCollection().doc(id).delete();
  await adminBucket()
    .deleteFiles({ prefix: `trips/${id}/` })
    .catch((err) => console.error("Failed to delete trip files", err));
  if (existing.status === "published") revalidateTag(TRIPS_TAG);
  return NextResponse.json({ ok: true });
}
