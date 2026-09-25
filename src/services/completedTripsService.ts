import { apiFetch } from "./api";
import type { CompletedTrip } from "@/lib/completedTrips";

export async function getCompletedTrips(): Promise<CompletedTrip[]> {
  return apiFetch<CompletedTrip[]>("/api/completed-trips");
}

export async function getCompletedTripBySlug(slug: string): Promise<CompletedTrip> {
  return apiFetch<CompletedTrip>(`/api/completed-trips/${slug}`);
}
