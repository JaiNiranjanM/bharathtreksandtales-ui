import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PackagesExplorer } from "@/components/packages/PackagesExplorer";
import { getPackages } from "@/services/packagesService";
import type { TravelPackage } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Trips | Bharath Treks & Tales",
  description:
    "Browse treks, temple yatras, one day adventures and weekend escapes across Karnataka, Tamil Nadu, Kerala and Andhra Pradesh.",
};

export default async function PackagesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const filters: Record<string, string | undefined> = {};
  if (params.category) filters.category = params.category;
  if (params.state) filters.state = params.state;
  if (params.query) filters.query = params.query;
  if (params.date) filters.date = params.date;
  if (params.travelers) filters.travelers = params.travelers;
  if (params.difficulty) filters.difficulty = params.difficulty;
  let initialPackages: TravelPackage[] = [];
  try {
    initialPackages = await getPackages(filters);
  } catch {
    // Fall back to empty — PackagesExplorer will show a friendly message
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-24">
        <Suspense fallback={null}>
          <PackagesExplorer key={JSON.stringify(filters)} initialPackages={initialPackages} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
