import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero3DIntro } from "@/components/landing/Hero3DIntro";
import { LandingExperience } from "@/components/landing/LandingExperience";
import { HomeContent } from "@/components/home/HomeContent";
import { PackagesProvider } from "@/components/packages/PackagesProvider";
import { getAllPackages } from "@/lib/trips";

export default async function Home() {
  const packages = await getAllPackages();
  return (
    <PackagesProvider packages={packages}>
      <Header />
      <Hero3DIntro />
      <LandingExperience />
      <main className="flex-1">
        <HomeContent />
      </main>
      <Footer />
    </PackagesProvider>
  );
}
