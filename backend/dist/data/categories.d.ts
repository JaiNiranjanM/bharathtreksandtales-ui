export type CategoryId = "trekking" | "spiritual" | "solo" | "group" | "couples" | "family" | "oneday" | "weekend";
export interface Category {
    id: CategoryId;
    label: string;
    icon: string;
    tagline: string;
    description: string;
    image: string;
    accent: string;
    glow: string;
}
export declare const categories: Category[];
//# sourceMappingURL=categories.d.ts.map