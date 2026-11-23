import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PackageDetailView } from "@/components/packages/PackageDetailView";
import { getRelatedPackages } from "@/lib/data";
import { getAllPackages, getPackageBySlug } from "@/lib/trips";

// New trips published from the admin panel render on first visit and are then cached.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getAllPackages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const pkg = await getPackageBySlug((await params).slug);
  if (!pkg) return {};
  return {
    title: `${pkg.title} | Bharath Treks & Tales`,
    description: pkg.overview || pkg.highlights.slice(0, 3).join(" · "),
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const all = await getAllPackages();
  const pkg = all.find((p) => p.slug === slug);
  if (!pkg) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <PackageDetailView pkg={pkg} related={getRelatedPackages(pkg, all)} />
      </main>
      <Footer />
    </>
  );
}
