"use client";

import { motion } from "framer-motion";
import { GAHAN_FEATURES } from "@/data/gahan/content";

export function GahanFeatureGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {GAHAN_FEATURES.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.04 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <h3 className="text-base font-semibold tracking-tight">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
