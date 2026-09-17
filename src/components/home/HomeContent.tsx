"use client";

import { useAppStore } from "@/lib/store";
import { HeroSection } from "./HeroSection";
import { PopularDestinations } from "./PopularDestinations";
import { TrendingPackages } from "./TrendingPackages";
import { Stats } from "./Stats";
import { WhyTravelWithUs } from "./WhyTravelWithUs";
import { Testimonials } from "./Testimonials";
import { InstagramGallery } from "./InstagramGallery";
import { Newsletter } from "./Newsletter";
import { FAQSection } from "./FAQSection";

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
