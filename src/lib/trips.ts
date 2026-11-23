import "server-only";
import { unstable_cache } from "next/cache";
import { packages as samplePackages, type TravelPackage } from "./data";
import { tripDocToPackage, type TripDoc } from "./trip-doc";
import { adminDb, isFirebaseConfigured } from "./firebase/admin";

export const TRIPS_TAG = "trips";
const COLLECTION = "trips";

export type { TripDoc };

export const tripsCollection = () => adminDb().collection(COLLECTION);

/** Sample (hard-coded) trips are shown unless SHOW_SAMPLE_TRIPS=false. */
function includeSampleTrips() {
  return process.env.SHOW_SAMPLE_TRIPS !== "false";
}

async function fetchPublishedTrips(): Promise<TravelPackage[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    const snap = await tripsCollection().where("status", "==", "published").get();
    return snap.docs
      .map((d) => ({ ...(d.data() as TripDoc), id: d.id }))
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
      .map(tripDocToPackage);
  } catch (err) {
    console.error("Failed to load trips from Firestore", err);
    return [];
  }
}

const getPublishedTripsCached = unstable_cache(fetchPublishedTrips, ["published-trips"], {
  tags: [TRIPS_TAG],
  revalidate: 300,
});

/** Every trip shown on the public site: published admin trips first, then sample trips. */
export async function getAllPackages(): Promise<TravelPackage[]> {
  const published = await getPublishedTripsCached();
  if (!includeSampleTrips()) return published;
  const taken = new Set(published.map((p) => p.slug));
  return [...published, ...samplePackages.filter((p) => !taken.has(p.slug))];
}

export async function getPackageBySlug(slug: string) {
  return (await getAllPackages()).find((p) => p.slug === slug);
}

// ---------- Admin helpers (uncached) ----------

export async function listTripsForAdmin(): Promise<TripDoc[]> {
  const snap = await tripsCollection().orderBy("updatedAt", "desc").get();
  return snap.docs.map((d) => ({ ...(d.data() as TripDoc), id: d.id }));
}

export async function getTrip(id: string): Promise<TripDoc | null> {
  const doc = await tripsCollection().doc(id).get();
  return doc.exists ? { ...(doc.data() as TripDoc), id: doc.id } : null;
}

export async function isSlugTaken(slug: string, exceptId?: string) {
  if (includeSampleTrips() && samplePackages.some((p) => p.slug === slug)) return true;
  const snap = await tripsCollection().where("slug", "==", slug).limit(2).get();
  return snap.docs.some((d) => d.id !== exceptId);
}

export async function uniqueSlug(base: string, exceptId?: string) {
  const root = base || "trip";
  let candidate = root;
  for (let i = 2; await isSlugTaken(candidate, exceptId); i++) candidate = `${root}-${i}`;
  return candidate;
}
