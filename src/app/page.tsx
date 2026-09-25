"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";

const Hero3DIntro = dynamic(
  () => import("@/components/landing/Hero3DIntro").then((mod) => mod.Hero3DIntro),
  { ssr: false }
);

const LandingExperience = dynamic(
  () => import("@/components/landing/LandingExperience").then((mod) => mod.LandingExperience),
  { ssr: false }
);

const HomeContent = dynamic(
  () => import("@/components/home/HomeContent").then((mod) => mod.HomeContent),
  { ssr: false }
);

const Footer = dynamic(
  () => import("@/components/layout/Footer").then((mod) => mod.Footer),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <Hero3DIntro />
      </Suspense>
      <Suspense fallback={null}>
        <LandingExperience />
      </Suspense>
      <main className="flex-1">
        <Suspense fallback={null}>
          <HomeContent />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
