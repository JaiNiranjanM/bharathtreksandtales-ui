import { flattenItineraryDays, type TravelPackage } from "./data";
import type { TripInput, TripStatus, UploadedFileRef } from "./trip-schema";

/** A trip document as stored in Firestore. Content fields may be partial while generating. */
export interface TripDoc extends Partial<TripInput> {
  id: string;
  status: TripStatus;
  error?: string;
  rating: number;
  reviewCount: number;
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
  source?: { pastedText: string; files: UploadedFileRef[]; notes: string };
}

export function tripDocToPackage(doc: TripDoc): TravelPackage {
  return {
    id: doc.id,
    slug: doc.slug ?? doc.id,
    title: doc.title ?? "Untitled trip",
    category: doc.category ?? [],
    state: doc.state ?? "",
    location: doc.location ?? "",
    image: doc.image || "/night_mountain_2.png",
    gallery: doc.gallery ?? [],
    difficulty: doc.difficulty ?? "Moderate",
    duration: doc.duration ?? "",
    durationDays: doc.durationDays ?? 1,
    price: doc.price ?? 0,
    discountPrice: doc.discountPrice || doc.price || 0,
    rating: doc.rating ?? 0,
    reviewCount: doc.reviewCount ?? 0,
    seatsLeft: doc.seatsLeft ?? 0,
    guideIncluded: doc.guideIncluded ?? true,
    meals: doc.meals ?? "",
    transportation: doc.transportation ?? "",
    departure: doc.departure ?? "",
    returnTime: doc.returnTime ?? "",
    highlights: doc.highlights ?? [],
    temples: doc.temples ?? [],
    altitude: doc.altitude ?? "",
    weather: doc.weather ?? "",
    weekend: doc.weekend ?? false,
    pickupLocations: doc.pickupLocations ?? [],
    tags: doc.tags ?? [],
    itinerary: doc.itinerary?.length ? doc.itinerary : flattenItineraryDays(doc.itineraryDays ?? []),
    itineraryDays: doc.itineraryDays,
    inclusions: doc.inclusions ?? [],
    exclusions: doc.exclusions ?? [],
    thingsToCarry: doc.thingsToCarry ?? [],
    overview: doc.overview,
    bestSeason: doc.bestSeason,
    trekDistance: doc.trekDistance,
    safetyNotes: doc.safetyNotes,
    departures: doc.departures,
    sources: doc.sources,
  };
}
