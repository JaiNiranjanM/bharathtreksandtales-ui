import type { CategoryId } from "./categories";
export type Difficulty = "Easy" | "Moderate" | "Challenging" | "Extreme";
export interface ItineraryDay {
    day: string;
    date: string;
    activities: string[];
}
export interface CompletedTrip {
    id: string;
    slug: string;
    title: string;
    organizer: string;
    category: CategoryId[];
    state: string;
    location: string;
    startDate: string;
    datesLabel: string;
    durationLabel: string;
    difficulty: Difficulty;
    groupsFrom: string[];
    costLabel: string;
    image: string;
    gallery: string[];
    temples: string[];
    highlights: string[];
    itinerary: ItineraryDay[];
}
export declare const completedTrips: CompletedTrip[];
export declare function getCompletedTripBySlug(slug: string): CompletedTrip | undefined;
export declare function getSortedCompletedTrips(): CompletedTrip[];
//# sourceMappingURL=completedTrips.d.ts.map