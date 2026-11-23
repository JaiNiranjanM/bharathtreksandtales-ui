import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ExploreClient } from "@/components/explore/ExploreClient";
import { PackagesProvider } from "@/components/packages/PackagesProvider";
import { getAllPackages } from "@/lib/trips";

export default async function ExplorePage() {
  const packages = await getAllPackages();
  return (
    <PackagesProvider packages={packages}>
      <Header />
      <main className="flex-1 pt-24">
        <ExploreClient />
      </main>
      <Footer />
    </PackagesProvider>
  );
}
