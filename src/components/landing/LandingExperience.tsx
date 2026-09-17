"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { categories, type CategoryId } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { CinematicBackground } from "./CinematicBackground";
import { CategoryCard } from "./CategoryCard";

export function LandingExperience() {
  const hasEnteredSite = useAppStore((s) => s.hasEnteredSite);
  const setCategory = useAppStore((s) => s.setCategory);
  const enterSite = useAppStore((s) => s.enterSite);

  function handleSelect(id: CategoryId) {
    setCategory(id);
    enterSite();
  }

  return (
    <AnimatePresence>
      {!hasEnteredSite && (
        <motion.section
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="relative z-10 flex min-h-screen w-full flex-col items-center"
        >
          <CinematicBackground />

          <div className="relative z-10 flex w-full flex-1 flex-col items-center px-6 pb-16 pt-28 sm:pt-36">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            ></motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9 }}
              className="mt-4 max-w-3xl text-balance text-center font-heading text-3xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
            >
              What kind of journey are you looking for?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8 }}
              className="mt-4 max-w-xl text-center text-sm text-white/70 sm:text-base"
            >
              Choose your path — every card leads to a completely different
              world of trips, colours and stories, curated just for you.
            </motion.p>

            <div className="mt-12 grid w-full max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                  onSelect={handleSelect}
                />
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 1 }}
              onClick={enterSite}
              className="mt-14 flex flex-col items-center gap-1 text-xs text-white/60 transition-colors hover:text-white cursor-pointer"
            >
              Skip &amp; explore everything
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                <ChevronDown size={16} />
              </motion.span>
            </motion.button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
