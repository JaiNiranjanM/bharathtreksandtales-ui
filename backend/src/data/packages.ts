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
  itinerary: { time: string; activity: string }[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
}

export const states = [
  "Tamil Nadu",
  "Karnataka",
  "Kerala",
  "Andhra Pradesh",
  "Maharashtra",
] as const;

export type State = (typeof states)[number];

export const difficulties: Difficulty[] = ["Easy", "Moderate", "Challenging", "Extreme"];

export const upcomingDates = [
  "Sat, 2 Aug",
  "Sun, 3 Aug",
  "Sat, 9 Aug",
  "Sun, 10 Aug",
  "Sat, 16 Aug",
];

export const packages: TravelPackage[] = [
  {
    id: "p1",
    slug: "nandi-hills-sunrise-trek",
    title: "Nandi Hills Sunrise Trek",
    category: ["trekking", "oneday", "group", "solo"],
    state: "Karnataka",
    location: "Nandi Hills, Chikkaballapur",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop",
    gallery: [
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
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop",
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
    title: "Skandagiri Night Trek",
    category: ["trekking", "oneday", "solo", "group"],
    state: "Karnataka",
    location: "Skandagiri, Chikkaballapur",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1600&auto=format&fit=crop",
    ],
    difficulty: "Moderate",
    duration: "1 Day",
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
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop",
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
    highlights: [
      "Meenakshi Amman Temple Darshan",
      "Thirumalai Nayakkar Palace",
      "Local silk market",
    ],
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

// ─── Helper query functions ──────────────────────────────────────────────────

export function getPackageBySlug(slug: string): TravelPackage | undefined {
  return packages.find((p) => p.slug === slug);
}

export function getPackagesByCategory(id: string): TravelPackage[] {
  return packages.filter((p) => p.category.includes(id as CategoryId));
}

export function getRelatedPackages(pkg: TravelPackage, limit = 3): TravelPackage[] {
  return packages
    .filter((p) => p.id !== pkg.id && p.category.some((c) => pkg.category.includes(c)))
    .slice(0, limit);
}

export function getPackagesByState(state: string): TravelPackage[] {
  return packages.filter((p) => p.state === state);
}

export const stateSvgIdToName: Record<string, string> = {
  ap: "Andhra Pradesh",
  ka: "Karnataka",
  kl: "Kerala",
  mh: "Maharashtra",
  tn: "Tamil Nadu",
};

export function getStateSummary(state: string) {
  const statePackages = getPackagesByState(state);
  const temples = Array.from(new Set(statePackages.flatMap((p) => p.temples)));
  const treks = Array.from(
    new Set(statePackages.filter((p) => p.category.includes("trekking")).map((p) => p.title))
  );
  return {
    tripCount: statePackages.length,
    temples,
    treks,
    upcomingDates: upcomingDates.slice(0, 3),
  };
}
