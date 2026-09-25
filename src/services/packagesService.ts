import { apiFetch } from "./api";
import type { TravelPackage } from "@/lib/data";

export interface PackagesFilters {
  category?: string;
  state?: string;
  difficulty?: string;
  query?: string;
  maxBudget?: number;
  weekendOnly?: boolean;
  sort?: "rating" | "price_asc" | "price_desc";
  date?: string;
  travelers?: string | number;
}

/**
 * Fetch all packages, with optional server-side filtering.
 * Used in Server Components or during SSR.
 */
export async function getPackages(filters?: PackagesFilters): Promise<TravelPackage[]> {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== "all") params.set("category", filters.category);
  if (filters?.state && filters.state !== "all") params.set("state", filters.state);
  if (filters?.difficulty && filters.difficulty !== "all") params.set("difficulty", filters.difficulty);
  if (filters?.query) params.set("query", filters.query);
  if (filters?.maxBudget) params.set("maxBudget", String(filters.maxBudget));
  if (filters?.weekendOnly) params.set("weekendOnly", "true");
  if (filters?.sort) params.set("sort", filters.sort);
  if (filters?.date) params.set("date", String(filters.date));
  if (filters?.travelers) params.set("travelers", String(filters.travelers));

  const qs = params.toString();
  return apiFetch<TravelPackage[]>(`/api/packages${qs ? `?${qs}` : ""}`);
}

/**
 * Fetch a single package by slug.
 */
export async function getPackageBySlug(slug: string): Promise<TravelPackage> {
  return apiFetch<TravelPackage>(`/api/packages/${slug}`);
}

/**
 * Fetch related packages for a given package slug.
 */
export async function getRelatedPackages(
  slug: string,
  limit = 3
): Promise<TravelPackage[]> {
  return apiFetch<TravelPackage[]>(`/api/packages/${slug}/related?limit=${limit}`);
}
