import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PackagesExplorer } from "@/components/packages/PackagesExplorer";

export default function PackagesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24">
        <Suspense fallback={null}>
          <PackagesExplorer />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
