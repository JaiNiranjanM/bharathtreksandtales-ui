export type CategoryId =
  | "trekking"
  | "spiritual"
  | "solo"
  | "group"
  | "couples"
  | "family"
  | "oneday"
  | "weekend";

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  tagline: string;
  description: string;
  image: string;
  accent: string; // tailwind gradient classes
  glow: string; // hex used for glow/shadow
}

export const categories: Category[] = [
  {
    id: "trekking",
    label: "Trekking",
    icon: "🏔",
    tagline: "Chase summits & sunrises",
    description: "Ridge lines, misty peaks and trails that test your spirit.",
    image:
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1600&auto=format&fit=crop",
    accent: "from-emerald-600 via-emerald-500 to-teal-400",
    glow: "#10b981",
  },
  {
    id: "spiritual",
    label: "Spiritual",
    icon: "🛕",
    tagline: "Walk the path of the divine",
    description: "Temple bells, incense trails and timeless devotion.",
    image:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop",
    accent: "from-amber-500 via-orange-500 to-yellow-400",
    glow: "#f59e0b",
  },
  {
    id: "solo",
    label: "Solo Explorer",
    icon: "🧍",
    tagline: "Just you & the horizon",
    description: "Freedom, solitude and stories that are yours alone.",
    image:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1600&auto=format&fit=crop",
    accent: "from-indigo-600 via-blue-500 to-sky-400",
    glow: "#3b82f6",
  },
  {
    id: "group",
    label: "Group Trips",
    icon: "🎒",
    tagline: "Better together",
    description: "New friends, shared campfires, louder laughter.",
    image:
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=1600&auto=format&fit=crop",
    accent: "from-orange-600 via-red-500 to-rose-400",
    glow: "#f97316",
  },
  {
    id: "couples",
    label: "Couples",
    icon: "❤️",
    tagline: "Adventures made for two",
    description: "Sunsets, quiet trails and moments worth keeping.",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop",
    accent: "from-rose-600 via-pink-500 to-red-400",
    glow: "#f43f5e",
  },
  {
    id: "family",
    label: "Family",
    icon: "👨‍👩‍👧",
    tagline: "Memories for every generation",
    description: "Easy trails, safe stays, joy for all ages.",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop",
    accent: "from-blue-600 via-cyan-500 to-teal-400",
    glow: "#0ea5e9",
  },
  {
    id: "oneday",
    label: "One Day Adventures",
    icon: "🌄",
    tagline: "One sunrise, one story",
    description: "Pack light, leave early, be back by dinner.",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1600&auto=format&fit=crop",
    accent: "from-yellow-500 via-amber-500 to-orange-400",
    glow: "#eab308",
  },
  {
    id: "weekend",
    label: "Weekend Escapes",
    icon: "🚍",
    tagline: "Two days, a lifetime of stories",
    description: "Friday evening out, Monday morning renewed.",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
    accent: "from-royal-600 via-blue-500 to-indigo-400",
    glow: "#2563eb",
  },
];

export type Difficulty = "Easy" | "Moderate" | "Challenging" | "Extreme";

export interface TripDay {
  day: number;
  title: string;
  description: string;
  /** Optional timed activities within the day. */
  schedule: { time: string; activity: string }[];
}

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
  itinerary: { time: string; activity: string }[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  // Optional fields filled by admin-created (AI-assisted) trips.
  /** Day-by-day plan. When missing, it is derived from the flat `itinerary`. */
  itineraryDays?: TripDay[];
  overview?: string;
  bestSeason?: string;
  trekDistance?: string;
  safetyNotes?: string[];
  /** ISO dates (YYYY-MM-DD) of fixed departures. Falls back to `upcomingDates` when empty. */
  departures?: string[];
  sources?: { title: string; url: string }[];
}

export const packages: TravelPackage[] = [
  {
    id: "p1",
    slug: "nandi-hills-sunrise-trek",
    title: "Nandi Hills Sunrise Trek",
    category: ["trekking", "oneday", "group", "solo"],
    state: "Karnataka",
    location: "Nandi Hills, Chikkaballapur",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1600&auto=format&fit=crop",
    ],
    difficulty: "Easy",
    duration: "1 Day",
    durationDays: 1,
    price: 999,
    discountPrice: 749,
    rating: 4.7,
    reviewCount: 1284,
    seatsLeft: 6,
    guideIncluded: true,
    meals: "Breakfast included",
    transportation: "AC Bus from Bangalore",
    departure: "3:30 AM, Bangalore",
    returnTime: "12:00 PM, Bangalore",
    highlights: [
      "Sunrise above the clouds",
      "Tipu's Drop viewpoint",
      "Fresh filter coffee on the hilltop",
    ],
    temples: ["Bhoga Nandeeshwara Temple"],
    altitude: "4,851 ft",
    weather: "Cool mornings, 16-24°C",
    weekend: true,
    pickupLocations: ["Marathahalli", "Silk Board", "Hebbal"],
    tags: ["Easy", "Sunrise", "Weekend", "Solo Friendly"],
    itinerary: [
      { time: "3:30 AM", activity: "Departure from Bangalore" },
      { time: "5:15 AM", activity: "Arrive at Nandi Hills base" },
      { time: "5:45 AM", activity: "Sunrise viewpoint" },
      { time: "7:30 AM", activity: "Breakfast & Bhoga Nandeeshwara Temple visit" },
      { time: "9:00 AM", activity: "Return journey begins" },
      { time: "12:00 PM", activity: "Drop at Bangalore" },
    ],
    inclusions: ["Transportation", "Breakfast", "Guide", "First aid"],
    exclusions: ["Lunch", "Personal expenses"],
    thingsToCarry: ["Water bottle", "Light jacket", "Comfortable shoes", "Camera"],
  },
  {
    id: "p2",
    slug: "tirupati-balaji-darshan-yatra",
    title: "Tirupati Balaji Darshan Yatra",
    category: ["spiritual", "weekend", "family", "group"],
    state: "Andhra Pradesh",
    location: "Tirumala, Tirupati",
    image:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop",
    ],
    difficulty: "Easy",
    duration: "2 Days / 1 Night",
    durationDays: 2,
    price: 3499,
    discountPrice: 2999,
    rating: 4.9,
    reviewCount: 3021,
    seatsLeft: 11,
    guideIncluded: true,
    meals: "All meals included",
    transportation: "AC Sleeper Coach",
    departure: "9:00 PM, Chennai",
    returnTime: "6:00 AM (Day 3), Chennai",
    highlights: [
      "Special entry Darshan",
      "Sri Padmavathi Temple visit",
      "Akasa Ganga & Silathoranam",
    ],
    temples: ["Tirumala Venkateswara Temple", "Sri Padmavathi Ammavari Temple"],
    altitude: "2,818 ft",
    weather: "Pleasant, 20-28°C",
    weekend: true,
    pickupLocations: ["Chennai Central", "Tambaram"],
    tags: ["Temple", "Weekend", "Family Friendly"],
    itinerary: [
      { time: "9:00 PM", activity: "Departure from Chennai" },
      { time: "4:00 AM", activity: "Arrive Tirumala, freshen up" },
      { time: "6:00 AM", activity: "Special entry Darshan" },
      { time: "12:00 PM", activity: "Lunch & rest" },
      { time: "4:00 PM", activity: "Sri Padmavathi Temple, Tiruchanur" },
      { time: "9:00 PM", activity: "Return journey" },
    ],
    inclusions: ["Transportation", "All meals", "Darshan tickets", "Accommodation"],
    exclusions: ["Laddu prasadam charges", "Personal expenses"],
    thingsToCarry: ["ID proof", "Comfortable footwear", "Extra clothes"],
  },
  {
    id: "p3",
    slug: "kudremukh-monsoon-trek",
    title: "Kudremukh Monsoon Trek",
    category: ["trekking", "weekend", "group"],
    state: "Karnataka",
    location: "Kudremukh National Park",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop",
    ],
    difficulty: "Challenging",
    duration: "2 Days / 1 Night",
    durationDays: 2,
    price: 4499,
    discountPrice: 3999,
    rating: 4.6,
    reviewCount: 642,
    seatsLeft: 4,
    guideIncluded: true,
    meals: "Breakfast, Lunch, Dinner",
    transportation: "Tempo Traveller",
    departure: "10:00 PM, Bangalore",
    returnTime: "8:00 AM (Day 3), Bangalore",
    highlights: [
      "Rolling grassland summit",
      "Waterfall stream crossings",
      "Camping under the stars",
    ],
    temples: [],
    altitude: "6,207 ft",
    weather: "Misty & wet, 14-20°C",
    weekend: true,
    pickupLocations: ["Majestic", "Yeshwanthpur"],
    tags: ["Challenging", "Camping", "Monsoon Special"],
    itinerary: [
      { time: "10:00 PM", activity: "Departure from Bangalore" },
      { time: "6:00 AM", activity: "Arrive base village, breakfast" },
      { time: "8:00 AM", activity: "Trek begins" },
      { time: "2:00 PM", activity: "Summit & lunch" },
      { time: "6:00 PM", activity: "Camp setup, bonfire dinner" },
      { time: "8:00 AM", activity: "Descend & return to Bangalore" },
    ],
    inclusions: ["Transportation", "All meals", "Camping gear", "Trek guide", "Forest permits"],
    exclusions: ["Personal trekking gear", "Insurance"],
    thingsToCarry: ["Trekking shoes", "Raincoat", "Extra socks", "Torch", "Dry bag"],
  },
  {
    id: "p4",
    slug: "coorg-waterfalls-couple-retreat",
    title: "Coorg Waterfalls Couple Retreat",
    category: ["couples", "weekend"],
    state: "Karnataka",
    location: "Coorg (Kodagu)",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1600&auto=format&fit=crop",
    ],
    difficulty: "Easy",
    duration: "3 Days / 2 Nights",
    durationDays: 3,
    price: 8999,
    discountPrice: 7499,
    rating: 4.8,
    reviewCount: 512,
    seatsLeft: 8,
    guideIncluded: false,
    meals: "Breakfast & Dinner",
    transportation: "Self-drive assistance / Pickup available",
    departure: "6:00 AM, Bangalore",
    returnTime: "9:00 PM (Day 3), Bangalore",
    highlights: [
      "Abbey Falls & Mallalli Falls",
      "Candlelight dinner",
      "Private homestay with valley view",
    ],
    temples: [],
    altitude: "3,500 ft",
    weather: "Cool & green, 18-26°C",
    weekend: true,
    pickupLocations: ["Bangalore Central"],
    tags: ["Romantic", "Nature", "Weekend"],
    itinerary: [
      { time: "6:00 AM", activity: "Departure from Bangalore" },
      { time: "11:00 AM", activity: "Check-in homestay" },
      { time: "2:00 PM", activity: "Abbey Falls visit" },
      { time: "7:00 PM", activity: "Candlelight dinner" },
      { time: "10:00 AM (Day 2)", activity: "Mallalli Falls trek" },
      { time: "9:00 PM (Day 3)", activity: "Return to Bangalore" },
    ],
    inclusions: ["Homestay", "Breakfast & Dinner", "Sightseeing"],
    exclusions: ["Transportation", "Lunch", "Activities entry fees"],
    thingsToCarry: ["Comfortable footwear", "Light jacket", "Camera"],
  },
  {
    id: "p5",
    slug: "sabarimala-ayyappa-pilgrimage",
    title: "Sabarimala Ayyappa Pilgrimage",
    category: ["spiritual", "group"],
    state: "Kerala",
    location: "Sabarimala",
    image:
      "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?q=80&w=1600&auto=format&fit=crop",
    ],
    difficulty: "Moderate",
    duration: "2 Days / 1 Night",
    durationDays: 2,
    price: 4999,
    discountPrice: 4499,
    rating: 4.9,
    reviewCount: 987,
    seatsLeft: 14,
    guideIncluded: true,
    meals: "All meals included",
    transportation: "AC Bus",
    departure: "8:00 PM, Coimbatore",
    returnTime: "6:00 AM (Day 3), Coimbatore",
    highlights: ["Trek through the forest path", "Pamba river holy dip", "Darshan at Sannidhanam"],
    temples: ["Sabarimala Ayyappa Temple"],
    altitude: "3,000 ft",
    weather: "Humid forest climate, 18-27°C",
    weekend: false,
    pickupLocations: ["Coimbatore Gandhipuram"],
    tags: ["Temple", "Trekking", "Pilgrimage"],
    itinerary: [
      { time: "8:00 PM", activity: "Departure from Coimbatore" },
      { time: "4:00 AM", activity: "Arrive Pamba, holy dip" },
      { time: "6:00 AM", activity: "Trek to Sannidhanam" },
      { time: "9:00 AM", activity: "Darshan" },
      { time: "8:00 PM", activity: "Return journey begins" },
    ],
    inclusions: ["Transportation", "All meals", "Guide", "Irumudi kettu assistance"],
    exclusions: ["Personal offerings", "Porter charges"],
    thingsToCarry: ["Black/blue dhoti", "Irumudi kettu", "Torch", "Blanket"],
  },
  {
    id: "p6",
    slug: "kodaikanal-family-getaway",
    title: "Kodaikanal Family Getaway",
    category: ["family", "weekend"],
    state: "Tamil Nadu",
    location: "Kodaikanal",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop",
    ],
    difficulty: "Easy",
    duration: "3 Days / 2 Nights",
    durationDays: 3,
    price: 7999,
    discountPrice: 6999,
    rating: 4.7,
    reviewCount: 764,
    seatsLeft: 20,
    guideIncluded: true,
    meals: "All meals included",
    transportation: "AC Bus from Chennai",
    departure: "8:00 PM, Chennai",
    returnTime: "6:00 AM (Day 4), Chennai",
    highlights: ["Kodai Lake boating", "Pillar Rocks", "Bryant Park", "Bonfire evening"],
    temples: [],
    altitude: "7,200 ft",
    weather: "Cold, 8-18°C",
    weekend: true,
    pickupLocations: ["Chennai T Nagar", "Chennai Koyambedu"],
    tags: ["Family Friendly", "Hill Station", "Kids Friendly"],
    itinerary: [
      { time: "8:00 PM", activity: "Departure from Chennai" },
      { time: "8:00 AM", activity: "Check-in & breakfast" },
      { time: "10:00 AM", activity: "Kodai Lake & Bryant Park" },
      { time: "3:00 PM", activity: "Pillar Rocks & Coaker's Walk" },
      { time: "7:00 PM", activity: "Bonfire & dinner" },
      { time: "6:00 AM (Day 4)", activity: "Return to Chennai" },
    ],
    inclusions: ["Transportation", "Stay", "All meals", "Sightseeing", "Guide"],
    exclusions: ["Boating charges", "Personal expenses"],
    thingsToCarry: ["Woollens", "Comfortable shoes", "ID proof"],
  },
  {
    id: "p7",
    slug: "skandagiri-night-trek",
    title: "Skandagiri Night Trek & Sunrise",
    category: ["trekking", "oneday", "solo", "group"],
    state: "Karnataka",
    location: "Skandagiri, Chikkaballapur",
    image:
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1600&auto=format&fit=crop",
    ],
    difficulty: "Moderate",
    duration: "1 Day (Night Trek)",
    durationDays: 1,
    price: 1299,
    discountPrice: 999,
    rating: 4.6,
    reviewCount: 1890,
    seatsLeft: 3,
    guideIncluded: true,
    meals: "Breakfast included",
    transportation: "AC Bus from Bangalore",
    departure: "11:00 PM, Bangalore",
    returnTime: "10:00 AM, Bangalore",
    highlights: ["Cloud sea at sunrise", "Ruins of Skandagiri fort", "Night sky stargazing"],
    temples: [],
    altitude: "4,363 ft",
    weather: "Cold night, 12-22°C",
    weekend: true,
    pickupLocations: ["Marathahalli", "Silk Board"],
    tags: ["Night Trek", "Solo Friendly", "Moderate"],
    itinerary: [
      { time: "11:00 PM", activity: "Departure from Bangalore" },
      { time: "1:30 AM", activity: "Trek begins from base" },
      { time: "5:00 AM", activity: "Summit, cloud sea sunrise" },
      { time: "7:00 AM", activity: "Breakfast & descend" },
      { time: "10:00 AM", activity: "Return to Bangalore" },
    ],
    inclusions: ["Transportation", "Breakfast", "Guide", "Torches"],
    exclusions: ["Lunch", "Personal expenses"],
    thingsToCarry: ["Torch", "Warm jacket", "Trekking shoes", "Water"],
  },
  {
    id: "p8",
    slug: "meenakshi-temple-heritage-tour",
    title: "Meenakshi Temple Heritage Tour",
    category: ["spiritual", "oneday", "family"],
    state: "Tamil Nadu",
    location: "Madurai",
    image:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop",
    ],
    difficulty: "Easy",
    duration: "1 Day",
    durationDays: 1,
    price: 1799,
    discountPrice: 1499,
    rating: 4.8,
    reviewCount: 1120,
    seatsLeft: 16,
    guideIncluded: true,
    meals: "Lunch included",
    transportation: "AC Bus from Coimbatore",
    departure: "5:00 AM, Coimbatore",
    returnTime: "10:00 PM, Coimbatore",
    highlights: ["Meenakshi Amman Temple Darshan", "Thirumalai Nayakkar Palace", "Local silk market"],
    temples: ["Meenakshi Amman Temple"],
    altitude: "440 ft",
    weather: "Warm, 26-35°C",
    weekend: true,
    pickupLocations: ["Coimbatore Gandhipuram", "Coimbatore Railway Station"],
    tags: ["Temple", "Heritage", "Family Friendly"],
    itinerary: [
      { time: "5:00 AM", activity: "Departure from Coimbatore" },
      { time: "9:00 AM", activity: "Meenakshi Amman Temple Darshan" },
      { time: "1:00 PM", activity: "Lunch" },
      { time: "2:30 PM", activity: "Thirumalai Nayakkar Palace" },
      { time: "5:00 PM", activity: "Return journey begins" },
    ],
    inclusions: ["Transportation", "Lunch", "Guide", "Entry tickets"],
    exclusions: ["Personal offerings", "Shopping"],
    thingsToCarry: ["Traditional attire", "ID proof"],
  },
];

export const states = [
  "Tamil Nadu",
  "Karnataka",
  "Kerala",
  "Andhra Pradesh",
  "Maharashtra",
] as const;

/** All Indian states / UTs supported by the map, in the same spelling the AI is asked to use. */
export const allIndianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;

export const difficulties: Difficulty[] = ["Easy", "Moderate", "Challenging", "Extreme"];

export function getCategory(id: CategoryId) {
  return categories.find((c) => c.id === id);
}

/** States that have at least one trip, with the original featured states first. */
export function getStatesWithTrips(list: TravelPackage[]): string[] {
  const used = new Set(list.map((p) => p.state));
  const featured = states.filter((s) => used.has(s));
  const rest = Array.from(used)
    .filter((s) => !(states as readonly string[]).includes(s))
    .sort();
  return [...featured, ...rest];
}

export function getRelatedPackages(pkg: TravelPackage, list: TravelPackage[], limit = 3) {
  return list
    .filter((p) => p.id !== pkg.id && p.category.some((c) => pkg.category.includes(c)))
    .slice(0, limit);
}

export const upcomingDates = ["Sat, 2 Aug", "Sun, 3 Aug", "Sat, 9 Aug", "Sun, 10 Aug", "Sat, 16 Aug"];

/** Formats an ISO date (YYYY-MM-DD) as e.g. "Sat, 2 Aug". */
export function formatDepartureDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

/** Upcoming departure labels for a trip: its own future dates, or the legacy shared list. */
export function getDepartureLabels(pkg: TravelPackage): string[] {
  if (pkg.departures && pkg.departures.length > 0) {
    const today = new Date().toISOString().slice(0, 10);
    return pkg.departures.filter((d) => d >= today).sort().map(formatDepartureDate);
  }
  return upcomingDates;
}

/**
 * The dates shown on a trip page, each with its real date (YYYY-MM-DD) when the trip has its own departures.
 * Older sample trips only have shared example labels, so their `iso` is null and they cannot take online bookings.
 */
export function getDepartureOptions(pkg: TravelPackage): { label: string; iso: string | null }[] {
  if (pkg.departures && pkg.departures.length > 0) {
    const today = new Date().toISOString().slice(0, 10);
    return pkg.departures
      .filter((d) => d >= today)
      .sort()
      .map((iso) => ({ label: formatDepartureDate(iso), iso }));
  }
  return upcomingDates.map((label) => ({ label, iso: null }));
}

// Maps the 2-letter state ids used by the @svg-maps/india dataset to state names.
export const stateSvgIdToName: Record<string, string> = {
  an: "Andaman and Nicobar Islands", ap: "Andhra Pradesh", ar: "Arunachal Pradesh", as: "Assam",
  br: "Bihar", ch: "Chandigarh", ct: "Chhattisgarh", dn: "Dadra and Nagar Haveli",
  dd: "Daman and Diu", dl: "Delhi", ga: "Goa", gj: "Gujarat", hr: "Haryana",
  hp: "Himachal Pradesh", jk: "Jammu and Kashmir", jh: "Jharkhand", ka: "Karnataka",
  kl: "Kerala", ld: "Lakshadweep", mp: "Madhya Pradesh", mh: "Maharashtra", mn: "Manipur",
  ml: "Meghalaya", mz: "Mizoram", nl: "Nagaland", or: "Odisha", py: "Puducherry", pb: "Punjab",
  rj: "Rajasthan", sk: "Sikkim", tn: "Tamil Nadu", tg: "Telangana", tr: "Tripura",
  up: "Uttar Pradesh", ut: "Uttarakhand", wb: "West Bengal",
};

export function getPackagesByState(list: TravelPackage[], state: string) {
  return list.filter((p) => p.state === state);
}

export function getStateSummary(list: TravelPackage[], state: string) {
  const statePackages = getPackagesByState(list, state);
  const temples = Array.from(new Set(statePackages.flatMap((p) => p.temples)));
  const treks = Array.from(
    new Set(statePackages.filter((p) => p.category.includes("trekking")).map((p) => p.title))
  );
  const dates = Array.from(new Set(statePackages.flatMap(getDepartureLabels)));
  return {
    tripCount: statePackages.length,
    temples,
    treks,
    upcomingDates: dates.slice(0, 3),
  };
}

function shorten(text: string, max = 60) {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/** The day-by-day plan for a trip: its own days, or the flat itinerary grouped by "Day N" prefixes. */
export function getItineraryDays(pkg: Pick<TravelPackage, "itinerary" | "itineraryDays">): TripDay[] {
  if (pkg.itineraryDays && pkg.itineraryDays.length > 0) return pkg.itineraryDays;
  if (pkg.itinerary.length === 0) return [];

  const groups = new Map<number, { time: string; activity: string }[]>();
  let current = 1;
  for (const step of pkg.itinerary) {
    const m = /^\s*day\s*(\d+)\s*[·:\-–—]?\s*(.*)$/i.exec(step.time);
    let time = step.time;
    if (m) {
      current = Number(m[1]);
      time = m[2];
    }
    groups.set(current, [...(groups.get(current) ?? []), { time, activity: step.activity }]);
  }
  const single = groups.size === 1;
  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([day, schedule]) => ({
      day,
      title: single ? "Trip schedule" : shorten(schedule[0].activity),
      description: "",
      schedule,
    }));
}

/** Flat timeline form of the days (kept for older code paths and the stored `itinerary` field). */
export function flattenItineraryDays(days: TripDay[]): { time: string; activity: string }[] {
  return days.flatMap((d) => [
    { time: `Day ${d.day}`, activity: [d.title, d.description].filter(Boolean).join(" - ") },
    ...d.schedule.map((s) => ({ time: `Day ${d.day} · ${s.time}`.trim(), activity: s.activity })),
  ]);
}

/** Joins short fragments into one flowing paragraph, making sure each ends with a full stop. */
export function joinSentences(parts: string[]) {
  return parts
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => (/[.!?]$/.test(p) ? p : `${p}.`))
    .join(" ");
}

/** A day's timed schedule written out as prose, e.g. "6:00 AM: Pickup. 2:00 PM: Summit." */
export function scheduleToText(schedule: TripDay["schedule"]) {
  return joinSentences(schedule.map((s) => (s.time ? `${s.time}: ${s.activity}` : s.activity)));
}
