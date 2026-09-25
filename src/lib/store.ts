"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategoryId } from "./data";
import type { AuthUser, UserRole } from "@/services/authService";

interface AppState {
  selectedCategory: CategoryId | null;
  hasEnteredSite: boolean;
  wishlist: string[];
  user: AuthUser | null;
  token: string | null;
  setCategory: (id: CategoryId | null) => void;
  enterSite: () => void;
  toggleWishlist: (packageId: string) => void;
  setWishlist: (ids: string[]) => void;
  syncWishlist: (token: string) => Promise<void>;
  setAuth: (user: AuthUser, token: string) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  logout: () => void;
}

async function pushWishlistToServer(token: string, packageId: string, add: boolean) {
  try {
    const { addToWishlist, removeFromWishlist } = await import("@/services/wishlistService");
    if (add) await addToWishlist(token, packageId);
    else await removeFromWishlist(token, packageId);
  } catch {
    // Offline / guest — local state is source of truth
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedCategory: null,
      hasEnteredSite: false,
      wishlist: [],
      user: null,
      token: null,
      setCategory: (id) => set({ selectedCategory: id }),
      enterSite: () => set({ hasEnteredSite: true }),
      toggleWishlist: (packageId) => {
        const wishlist = get().wishlist;
        const adding = !wishlist.includes(packageId);
        set({
          wishlist: adding
            ? [...wishlist, packageId]
            : wishlist.filter((id) => id !== packageId),
        });
        const token = get().token;
        if (token) void pushWishlistToServer(token, packageId, adding);
      },
      setWishlist: (ids) => set({ wishlist: ids }),
      syncWishlist: async (token) => {
        try {
          const { getWishlist } = await import("@/services/wishlistService");
          const serverIds = await getWishlist(token);
          const local = get().wishlist;
          const merged = Array.from(new Set([...serverIds, ...local]));
          set({ wishlist: merged });
          // Push local-only ids up to the server so devices converge
          const { addToWishlist } = await import("@/services/wishlistService");
          await Promise.all(
            local
              .filter((id) => !serverIds.includes(id))
              .map((id) => addToWishlist(token, id).catch(() => null))
          );
        } catch {
          // Keep local wishlist when server is unreachable
        }
      },
      setAuth: (user, token) => {
        set({ user, token });
        void get().syncWishlist(token);
      },
      updateUser: (updates) => {
        const user = get().user;
        if (user) set({ user: { ...user, ...updates } });
      },
      logout: () => {
        set({ user: null, token: null });
        if (typeof document !== "undefined") {
          document.cookie = "btt_token=; path=/; max-age=0";
        }
      },
    }),
    {
      name: "btt-app-store",
      partialize: (s) => ({
        wishlist: s.wishlist,
        user: s.user,
        token: s.token,
      }),
    }
  )
);

export type { UserRole };
