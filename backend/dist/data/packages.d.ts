import type { CategoryId } from "./categories";
export type Difficulty = "Easy" | "Moderate" | "Challenging" | "Extreme";
export interface TravelPackage {
    id: string;
    slug: string;
    title: string;
    category: CategoryId[];
    state: string;
    location: string;
    image: string;
    gallery: string[];
    difficulty: Difficulty;
    duration: string;
    durationDays: number;
    price: number;
    discountPrice: number;
    rating: number;
    reviewCount: number;
    seatsLeft: number;
    guideIncluded: boolean;
    meals: string;
    transportation: string;
    departure: string;
    returnTime: string;
    highlights: string[];
    temples: string[];
    altitude: string;
    weather: string;
    weekend: boolean;
    pickupLocations: string[];
    tags: string[];
    itinerary: {
        time: string;
        activity: string;
    }[];
    inclusions: string[];
    exclusions: string[];
    thingsToCarry: string[];
}
export declare const states: readonly ["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Maharashtra"];
export type State = (typeof states)[number];
export declare const difficulties: Difficulty[];
export declare const upcomingDates: string[];
export declare const packages: TravelPackage[];
export declare function getPackageBySlug(slug: string): TravelPackage | undefined;
export declare function getPackagesByCategory(id: string): TravelPackage[];
export declare function getRelatedPackages(pkg: TravelPackage, limit?: number): TravelPackage[];
export declare function getPackagesByState(state: string): TravelPackage[];
export declare const stateSvgIdToName: Record<string, string>;
export declare function getStateSummary(state: string): {
    tripCount: number;
    temples: string[];
    treks: string[];
    upcomingDates: string[];
};
//# sourceMappingURL=packages.d.ts.map