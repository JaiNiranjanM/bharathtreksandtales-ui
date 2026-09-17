import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ExploreClient } from "@/components/explore/ExploreClient";

export default function ExplorePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24">
        <ExploreClient />
      </main>
      <Footer />
    </>
  );
}
