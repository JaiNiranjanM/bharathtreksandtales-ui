import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PackagesExplorer } from "@/components/packages/PackagesExplorer";
import { PackagesProvider } from "@/components/packages/PackagesProvider";
import { getAllPackages } from "@/lib/trips";

export default async function PackagesPage() {
  const packages = await getAllPackages();
  return (
    <PackagesProvider packages={packages}>
      <Header />
      <main className="flex-1 pt-24">
        <Suspense fallback={null}>
          <PackagesExplorer />
        </Suspense>
      </main>
      <Footer />
    </PackagesProvider>
  );
}
