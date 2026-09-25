import { apiFetch, BASE_URL } from "./api";

export interface StateSummary {
  tripCount: number;
  temples: string[];
  treks: string[];
  upcomingDates: string[];
}

export interface StatesResponse {
  data: string[];
  svgIdMap: Record<string, string>;
}

export async function getStates(): Promise<StatesResponse> {
  const res = await fetch(`${BASE_URL}/api/explore/states`, { cache: "no-store" });
  const json = await res.json();
  return { data: json.data, svgIdMap: json.svgIdMap };
}

export async function getStateSummary(state: string): Promise<StateSummary> {
  const encoded = encodeURIComponent(state);
  return apiFetch<StateSummary>(`/api/explore/states/${encoded}/summary`);
}
