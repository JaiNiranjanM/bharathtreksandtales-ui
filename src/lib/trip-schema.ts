import { z } from "zod";
import { allIndianStates } from "./data";

export const categoryIds = [
  "trekking",
  "spiritual",
  "solo",
  "group",
  "couples",
  "family",
  "oneday",
  "weekend",
] as const;

export const difficultyLevels = ["Easy", "Moderate", "Challenging", "Extreme"] as const;

/**
 * The trip content the AI generates from an itinerary. Kept free of numeric/length
 * constraints so it can be used directly as a Claude structured-output schema.
 */
export const aiTripSchema = z.object({
  title: z.string().describe("Short, attractive trip title, e.g. 'Kudremukh Monsoon Trek'"),
  overview: z
    .string()
    .describe("2-4 sentence overview of the trip and what makes the place special"),
  category: z
    .array(z.enum(categoryIds))
    .describe("All categories that apply. 'oneday' for single-day trips, 'weekend' for 2-3 day weekend trips"),
  state: z.enum(allIndianStates).describe("Indian state / UT where the trip takes place"),
  location: z.string().describe("Place and district, e.g. 'Nandi Hills, Chikkaballapur'"),
  difficulty: z.enum(difficultyLevels),
  duration: z.string().describe("Human readable, e.g. '1 Day', '2 Days / 1 Night'"),
  durationDays: z.number().int().describe("Number of days, 1 for a day trip"),
  meals: z.string().describe("e.g. 'Breakfast & Lunch', or 'Not included'"),
  transportation: z.string().describe("e.g. 'AC Tempo Traveller from Bangalore'"),
  departure: z.string().describe("Departure time and place, e.g. '4:00 AM from Majestic'"),
  returnTime: z.string().describe("Expected return, e.g. '2:00 PM' or 'Sunday 9:00 PM'"),
  pickupLocations: z.array(z.string()),
  highlights: z.array(z.string()).describe("5-8 concise, specific trip highlights"),
  temples: z.array(z.string()).describe("Temples visited or on the route; empty if none"),
  altitude: z.string().describe("Summit / max altitude with units, e.g. '1,478 m (4,849 ft)'"),
  trekDistance: z.string().describe("Total trekking distance, e.g. '9 km round trip'; 'N/A' if not a trek"),
  weather: z.string().describe("Typical weather / temperature range for the trip season"),
  bestSeason: z.string().describe("Best months to visit"),
  weekend: z.boolean().describe("True if the trip runs on a weekend"),
  tags: z.array(z.string()).describe("3-6 short tags, e.g. 'Sunrise', 'Monsoon', 'Waterfall'"),
  itinerary: z
    .array(z.object({ time: z.string(), activity: z.string() }))
    .describe(
      "Chronological timeline. For multi-day trips prefix time with the day, e.g. 'Day 1 · 6:00 AM'"
    ),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  thingsToCarry: z.array(z.string()),
  safetyNotes: z.array(z.string()).describe("Important safety, permit and fitness notes"),
  priceFromItinerary: z
    .number()
    .describe("Price per person in INR if stated in the itinerary, otherwise 0"),
  departureDatesFromItinerary: z
    .array(z.string())
    .describe("Departure dates stated in the itinerary as YYYY-MM-DD; empty if none"),
  sources: z
    .array(z.object({ title: z.string(), url: z.string() }))
    .describe("Web pages used for researched facts"),
});

export type AiTrip = z.infer<typeof aiTripSchema>;

const str = z.string().trim();
const strList = z.array(str.min(1)).default([]);

/** The full trip as saved by the admin editor. */
export const tripInputSchema = z.object({
  title: str.min(3),
  slug: str
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens"),
  overview: str.default(""),
  category: z.array(z.enum(categoryIds)).min(1, "Pick at least one category"),
  state: str.min(2),
  location: str.min(2),
  image: str.min(1, "Add a cover photo"),
  gallery: strList,
  difficulty: z.enum(difficultyLevels),
  duration: str.min(1),
  durationDays: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0),
  discountPrice: z.coerce.number().min(0),
  seatsLeft: z.coerce.number().int().min(0),
  guideIncluded: z.boolean().default(true),
  meals: str.default(""),
  transportation: str.default(""),
  departure: str.default(""),
  returnTime: str.default(""),
  highlights: strList,
  temples: strList,
  altitude: str.default(""),
  trekDistance: str.default(""),
  weather: str.default(""),
  bestSeason: str.default(""),
  weekend: z.boolean().default(false),
  pickupLocations: strList,
  tags: strList,
  itinerary: z.array(z.object({ time: str, activity: str.min(1) })).default([]),
  inclusions: strList,
  exclusions: strList,
  thingsToCarry: strList,
  safetyNotes: strList,
  departures: z.array(str.regex(/^\d{4}-\d{2}-\d{2}$/, "Dates must be YYYY-MM-DD")).default([]),
  sources: z.array(z.object({ title: str, url: str })).default([]),
});

export type TripInput = z.infer<typeof tripInputSchema>;

export type TripStatus = "generating" | "draft" | "published" | "failed";

export interface UploadedFileRef {
  path: string;
  name: string;
  contentType: string;
}

/** Details the admin types in before generation. */
export const generateRequestSchema = z.object({
  pastedText: z.string().default(""),
  files: z
    .array(z.object({ path: z.string(), name: z.string(), contentType: z.string() }))
    .default([]),
  photos: z.array(z.string()).default([]),
  price: z.coerce.number().min(0).default(0),
  discountPrice: z.coerce.number().min(0).default(0),
  seatsLeft: z.coerce.number().int().min(0).default(20),
  departures: z.array(z.string()).default([]),
  notes: z.string().default(""),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
