"use client";

import Link from "next/link";
import { packages, type CategoryId } from "@/lib/data";
import { PackageCard } from "@/components/packages/PackageCard";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";

export function TrendingPackages({
  selectedCategory,
  title = "Trending Packages",
  eyebrow = "Handpicked for you",
  description = "The trips our travellers are booking the most, right now.",
  limit = 8,
}: {
  selectedCategory?: CategoryId | null;
  title?: string;
  eyebrow?: string;
  description?: string;
  limit?: number;
}) {
  const filtered = selectedCategory
    ? packages.filter((p) => p.category.includes(selectedCategory))
    : packages;
  const list = filtered.slice(0, limit);

  if (list.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <Button variant="outline" asChild className="shrink-0">
          <Link href="/packages">View All Trips</Link>
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((pkg, i) => (
          <PackageCard key={pkg.id} pkg={pkg} index={i} />
        ))}
      </div>
    </section>
  );
}
