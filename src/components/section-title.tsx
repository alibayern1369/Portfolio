"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionTitle({
  label,
  title,
  description,
  align = "center",
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
          className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-right"}`}
    >
      {label && (
        <span className="mb-3 inline-block rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
      <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl px-1 text-base text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
