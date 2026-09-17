import type { CategoryId, Difficulty } from "./data";

export interface ItineraryDay {
  day: string; // e.g. "Day 1"
  date: string; // e.g. "11th April 2025, Friday"
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
  startDate: string; // ISO date, used for sorting
  datesLabel: string; // human readable e.g. "11 - 13 April 2025"
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

export const completedTrips: CompletedTrip[] = [
  {
    id: "ct1",
    slug: "saduragiri-trekking-2025",
    title: "Saduragiri Trekking 2025",
    organizer: "DTT | MWC Voyagers",
    category: ["trekking", "spiritual", "weekend", "group"],
    state: "Tamil Nadu",
    location: "Saduragiri Hills, Srivilliputtur",
    startDate: "2025-04-11",
    datesLabel: "11 - 13 April 2025",
    durationLabel: "3 Days / 2 Nights",
    difficulty: "Moderate",
    groupsFrom: ["Chennai", "Bengaluru"],
    costLabel: "₹4,500 - ₹5,500 per head (transport, auto charge & food included)",
    image:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop",
    ],
    temples: ["Saduragiri Andavar Temple", "Srivilliputtur Aandal Temple"],
    highlights: [
      "Sunrise trek to the hilltop Saduragiri Andavar shrine",
      "Annadhanam prasadham breakfast & lunch on the trail",
      "Evening darshan at the historic Srivilliputtur Aandal Temple",
      "Overnight sleeper bus travel from both Chennai & Bengaluru",
    ],
    itinerary: [
      {
        day: "Day 1",
        date: "11th April 2025, Friday",
        activities: [
          "Departure from Chennai & Bengaluru by own arranged transport (mostly sleeper bus) at 6:30 PM",
          "Packed night dinner provided on the way",
        ],
      },
      {
        day: "Day 2",
        date: "12th April 2025, Saturday",
        activities: [
          "Reached Srivilliputtur - Vathrairuppu by early morning around 5 AM",
          "Freshened up at hotel",
          "Reached Adivaram by 7 AM and started trekking (approx 3:30 hrs to the top)",
          "Morning breakfast & afternoon lunch as Annadhanam Prasadham",
          "Everyone regrouped at Adivaram by 5 PM",
          "Bus departed back to Srivilliputhur by 6 PM",
          "Darshan at Srivilliputtur Aandal Temple by 7 PM",
          "Night dinner at Kathiravan mess",
          "Bus departed back to Chennai & Bengaluru by 10:30 PM",
        ],
      },
      {
        day: "Day 3",
        date: "13th April 2025, Sunday",
        activities: ["Reached Chennai & Bengaluru by early morning"],
      },
    ],
  },
  {
    id: "ct2",
    slug: "kathuvumalai-trekking-thandikudi-2025",
    title: "Kathuvumalai Trekking, Thandikudi Murugar Temple & Pullavelli Falls",
    organizer: "Bharath Treks & Tales",
    category: ["trekking", "spiritual", "weekend", "group"],
    state: "Tamil Nadu",
    location: "Thandikudi, Dindigul",
    startDate: "2025-09-19",
    datesLabel: "19 - 21 September 2025",
    durationLabel: "3 Days / 2 Nights",
    difficulty: "Moderate",
    groupsFrom: ["Chennai", "Bengaluru"],
    costLabel: "₹13,000 per head (transport, jeep charge, food & entry included)",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop",
    ],
    temples: ["Thandikudi Murugan Temple"],
    highlights: [
      "Kathuvumalai trek with a jeep backup option for a safer descent",
      "Evening darshan at the historic Thandikudi Murugan Temple",
      "Bonfire night halt at the resort in Thandikudi",
      "Pullavelli Falls stop on the way back to Dindigul",
      "Onward travel by Vande Bharat / Tejas trains and AC sleeper bus",
    ],
    itinerary: [
      {
        day: "Day 1",
        date: "19th September 2025, Friday",
        activities: [
          "Started from Chennai & Bengaluru",
          "Chennai group: Vande Bharat at 14:30 from Chennai Egmore to Dindigul (reached 19:40)",
          "Bengaluru group: Bengaluru Cantonment/KJM - Madurai Vande Bharat at 13:00 to Dindigul (reached 8:30 PM)",
          "Once everyone gathered at Dindigul Railway Station, departed to Thandikudi (3 hrs journey)",
          "Night halt at Thandikudi",
        ],
      },
      {
        day: "Day 2",
        date: "20th September 2025, Saturday",
        activities: [
          "Started Kathavumalai trekking by 6 AM (jeep available on request as backup)",
          "Returned to the resort by afternoon",
          "Evening visit to Thandikudi Murugan Temple",
          "Night halt at the same resort with a campfire",
        ],
      },
      {
        day: "Day 3",
        date: "21st September 2025, Sunday",
        activities: [
          "Departed to Dindigul after breakfast",
          "Covered Pullavelli Falls on the way",
          "Reached Dindigul by around 2:30 PM",
          "Chennai group: Tejas Express from Dindigul at 16:00 to Chennai Egmore (reached 21:45)",
          "Bengaluru group: AC sleeper bus at 15:00 to Bengaluru (reached 23:00)",
        ],
      },
    ],
  },
];

export function getCompletedTripBySlug(slug: string) {
  return completedTrips.find((t) => t.slug === slug);
}

export function getSortedCompletedTrips() {
  return [...completedTrips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}
