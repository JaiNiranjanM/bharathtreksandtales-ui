"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategoryId } from "./data";

interface AppState {
  selectedCategory: CategoryId | null;
  hasEnteredSite: boolean;
  wishlist: string[];
  setCategory: (id: CategoryId | null) => void;
  enterSite: () => void;
  toggleWishlist: (packageId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedCategory: null,
      hasEnteredSite: false,
      wishlist: [],
      setCategory: (id) => set({ selectedCategory: id }),
      enterSite: () => set({ hasEnteredSite: true }),
      toggleWishlist: (packageId) => {
        const wishlist = get().wishlist;
        set({
          wishlist: wishlist.includes(packageId)
            ? wishlist.filter((id) => id !== packageId)
            : [...wishlist, packageId],
        });
      },
    }),
    { name: "btt-app-store", partialize: (s) => ({ wishlist: s.wishlist }) }
  )
);
