import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero3DIntro } from "@/components/landing/Hero3DIntro";
import { LandingExperience } from "@/components/landing/LandingExperience";
import { HomeContent } from "@/components/home/HomeContent";

export default function Home() {
  return (
    <>
      <Header />
      <Hero3DIntro />
      <LandingExperience />
      <main className="flex-1">
        <HomeContent />
      </main>
      <Footer />
    </>
  );
}
