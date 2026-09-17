"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={cn(align === "center" && "mx-auto text-center", className)}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-saffron">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-3xl font-bold sm:text-4xl">{title}</h2>
      {description && (
        <p className={cn("mt-3 max-w-2xl text-sm opacity-70 sm:text-base", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
