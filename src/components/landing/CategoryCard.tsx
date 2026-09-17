"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Category } from "@/lib/data";
import { cn } from "@/lib/utils";

export function CategoryCard({
  category,
  index,
  onSelect,
}: {
  category: Category;
  index: number;
  onSelect: (id: Category["id"]) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-40, 40], [10, -10]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-40, 40], [-10, 10]), { stiffness: 200, damping: 18 });
  const translateX = useSpring(useTransform(x, [-60, 60], [-8, 8]), { stiffness: 150, damping: 15 });
  const translateY = useSpring(useTransform(y, [-60, 60], [-8, 8]), { stiffness: 150, damping: 15 });

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setHovered(false);
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(category.id)}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5 + index * 0.07, duration: 0.6, ease: "easeOut" }}
      whileTap={{ scale: 0.96 }}
      style={{ rotateX, rotateY, x: translateX, y: translateY, transformPerspective: 800 }}
      className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-2xl text-left"
    >
      {/* floating idle animation */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5 + (index % 3), repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
      >
        <Image
          src={category.image}
          alt={category.label}
          fill
          sizes="(max-width: 768px) 45vw, 22vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </motion.div>

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-500",
        )}
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-70",
          category.accent
        )}
      />

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1.5px ${category.glow}66, 0 0 40px ${category.glow}55` }}
      />

      {/* particles on hover */}
      {hovered && (
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full"
              style={{
                left: `${10 + ((i * 23) % 80)}%`,
                bottom: 10,
                backgroundColor: category.glow,
              }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -120 - (i % 4) * 20 }}
              transition={{ duration: 1.6 + (i % 3) * 0.3, repeat: Infinity, delay: i * 0.12, ease: "easeOut" }}
            />
          ))}
        </div>
      )}

      <div className="relative flex h-full flex-col justify-end p-4 sm:p-5">
        <motion.span
          className="mb-2 text-3xl sm:text-4xl"
          animate={hovered ? { scale: 1.15, rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          {category.icon}
        </motion.span>
        <h3 className="font-heading text-lg font-semibold text-white sm:text-xl">
          {category.label}
        </h3>
        <p className="mt-1 text-xs text-white/70 sm:text-sm">{category.tagline}</p>
      </div>
    </motion.button>
  );
}
