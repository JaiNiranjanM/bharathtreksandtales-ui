"use client";

import { createContext, useContext } from "react";
import { packages as samplePackages, type TravelPackage } from "@/lib/data";

const PackagesContext = createContext<TravelPackage[]>(samplePackages);

/** Provides the live trip list (Firestore + sample trips) to client components. */
export function PackagesProvider({
  packages,
  children,
}: {
  packages: TravelPackage[];
  children: React.ReactNode;
}) {
  return <PackagesContext.Provider value={packages}>{children}</PackagesContext.Provider>;
}

export function usePackages() {
  return useContext(PackagesContext);
}
