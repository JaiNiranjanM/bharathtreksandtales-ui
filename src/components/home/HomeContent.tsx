"use client";

import dynamic from "next/dynamic";
import { useAppStore } from "@/lib/store";
import { HeroSection } from "./HeroSection";
import { PopularDestinations } from "./PopularDestinations";
import { TrendingPackages } from "./TrendingPackages";

const Stats = dynamic(() => import("./Stats").then((m) => m.Stats), { ssr: false });
const WhyTravelWithUs = dynamic(() => import("./WhyTravelWithUs").then((m) => m.WhyTravelWithUs), { ssr: false });
const Testimonials = dynamic(() => import("./Testimonials").then((m) => m.Testimonials), { ssr: false });
const InstagramGallery = dynamic(() => import("./InstagramGallery").then((m) => m.InstagramGallery), { ssr: false });
const FAQSection = dynamic(() => import("./FAQSection").then((m) => m.FAQSection), { ssr: false });
const Newsletter = dynamic(() => import("./Newsletter").then((m) => m.Newsletter), { ssr: false });


export function HomeContent() {
  const selectedCategory = useAppStore((s) => s.selectedCategory);

  return (
    <>
      <HeroSection selectedCategory={selectedCategory} />
      <PopularDestinations />
      <TrendingPackages
        selectedCategory={selectedCategory}
        title={selectedCategory ? "Trips Picked For You" : "Trending Packages"}
        eyebrow={selectedCategory ? "Because you chose " + selectedCategory : "Handpicked for you"}
      />
      <TrendingPackages
        selectedCategory="weekend"
        title="Weekend Specials"
        eyebrow="Friday evening, Monday memories"
        description="Short getaways that fit right into your weekend."
        limit={4}
      />
      <TrendingPackages
        selectedCategory="spiritual"
        title="Temple Yatras"
        eyebrow="Walk the path of the divine"
        description="Darshan, devotion and journeys of faith."
        limit={4}
      />
      <Stats />
      <TrendingPackages
        selectedCategory="trekking"
        title="Trekking Adventures"
        eyebrow="Chase the summit"
        description="Trails for every fitness level, across the Western Ghats."
        limit={4}
      />
      <WhyTravelWithUs />
      <Testimonials />
      <InstagramGallery />
      <FAQSection />
      <Newsletter />
    </>
  );
}
