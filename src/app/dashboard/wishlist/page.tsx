"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Heart, Loader2 } from "lucide-react";
import { PackageCard } from "@/components/packages/PackageCard";
import { useAppStore } from "@/lib/store";
import { packages as localPackages, type TravelPackage } from "@/lib/data";
import { getPackages } from "@/services/packagesService";

export default function WishlistPage() {
  const wishlist = useAppStore((s) => s.wishlist);
  const token = useAppStore((s) => s.token);
  const syncWishlist = useAppStore((s) => s.syncWishlist);
  const [catalog, setCatalog] = useState<TravelPackage[]>(localPackages);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    // Prefer server catalog so server-sourced packages resolve
    getPackages().then(
      (pkgs) => setCatalog(pkgs),
      () => {}
    );
  }, []);

  useEffect(() => {
    if (!token) return;
    syncWishlist(token).finally(() => setSynced(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const syncing = !!token && !synced;

  const byId = new Map(catalog.map((p) => [p.id, p]));
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));
  const wishlistedPackages = wishlist
    .map((id) => byId.get(id) ?? bySlug.get(id))
    .filter((p): p is TravelPackage => !!p);

  return (
    <>
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="font-heading text-4xl font-bold">Your Wishlist</h1>
          <p className="mt-3 text-sm text-foreground/60">
            {syncing ? (
              <span className="inline-flex items-center gap-1.5"><Loader2 size={14} className="animate-spin" /> Syncing across devices…</span>
            ) : wishlistedPackages.length > 0 ? (
              `${wishlistedPackages.length} trip${wishlistedPackages.length > 1 ? "s" : ""} saved${token ? " • synced to your account" : " • saved on this device (log in to sync)"}`
            ) : (
              "No trips saved yet. Browse our packages and tap the heart icon to save your favourites."
            )}
          </p>

          {wishlistedPackages.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlistedPackages.map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} index={i} />
              ))}
            </div>
          ) : (
            !syncing && (
              <div className="mt-20 flex flex-col items-center text-center">
                <Heart size={48} className="text-foreground/20" />
                <p className="mt-4 text-sm text-foreground/50">Your wishlist is empty</p>
                <Link
                  href="/packages"
                  className="mt-4 rounded-full bg-saffron px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-saffron/25 transition-all hover:-translate-y-0.5"
                >
                  Explore Trips
                </Link>
              </div>
            )
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
