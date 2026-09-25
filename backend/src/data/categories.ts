// ─── Category Types & Data ──────────────────────────────────────────────────

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
  accent: string;
  glow: string;
}

export const categories: Category[] = [
  {
    id: "trekking",
    label: "Trekking",
    icon: "🏔",
    tagline: "Chase summits & sunrises",
    description: "Ridge lines, misty peaks and trails that test your spirit.",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1600&auto=format&fit=crop",
    accent: "from-emerald-600 via-emerald-500 to-teal-400",
    glow: "#10b981",
  },
  {
    id: "spiritual",
    label: "Spiritual",
    icon: "🛕",
    tagline: "Walk the path of the divine",
    description: "Temple bells, incense trails and timeless devotion.",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop",
    accent: "from-amber-500 via-orange-500 to-yellow-400",
    glow: "#f59e0b",
  },
  {
    id: "solo",
    label: "Solo Explorer",
    icon: "🧍",
    tagline: "Just you & the horizon",
    description: "Freedom, solitude and stories that are yours alone.",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1600&auto=format&fit=crop",
    accent: "from-indigo-600 via-blue-500 to-sky-400",
    glow: "#3b82f6",
  },
  {
    id: "group",
    label: "Group Trips",
    icon: "🎒",
    tagline: "Better together",
    description: "New friends, shared campfires, louder laughter.",
    image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=1600&auto=format&fit=crop",
    accent: "from-orange-600 via-red-500 to-rose-400",
    glow: "#f97316",
  },
  {
    id: "couples",
    label: "Couples",
    icon: "❤️",
    tagline: "Adventures made for two",
    description: "Sunsets, quiet trails and moments worth keeping.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop",
    accent: "from-rose-600 via-pink-500 to-red-400",
    glow: "#f43f5e",
  },
  {
    id: "family",
    label: "Family",
    icon: "👨‍👩‍👧",
    tagline: "Memories for every generation",
    description: "Easy trails, safe stays, joy for all ages.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop",
    accent: "from-blue-600 via-cyan-500 to-teal-400",
    glow: "#0ea5e9",
  },
  {
    id: "oneday",
    label: "One Day Adventures",
    icon: "🌄",
    tagline: "One sunrise, one story",
    description: "Pack light, leave early, be back by dinner.",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1600&auto=format&fit=crop",
    accent: "from-yellow-500 via-amber-500 to-orange-400",
    glow: "#eab308",
  },
  {
    id: "weekend",
    label: "Weekend Escapes",
    icon: "🚍",
    tagline: "Two days, a lifetime of stories",
    description: "Friday evening out, Monday morning renewed.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
    accent: "from-royal-600 via-blue-500 to-indigo-400",
    glow: "#2563eb",
  },
];
