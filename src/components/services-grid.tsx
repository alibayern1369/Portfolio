"use client";

import { motion } from "framer-motion";
import {
  Palette,
  Sparkles,
  Puzzle,
  Code2,
  Building2,
  Globe,
  LayoutTemplate,
  Smartphone,
} from "lucide-react";
import type { Service } from "@/types";
import type { ComponentType } from "react";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  palette: Palette,
  sparkles: Sparkles,
  puzzle: Puzzle,
  code: Code2,
  building: Building2,
  globe: Globe,
  layout: LayoutTemplate,
  smartphone: Smartphone,
};

interface ServicesGridProps {
  services: Service[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {services.map((service, i) => {
        const Icon = iconMap[service.icon] || Sparkles;
        return (
          <motion.div
            key={service.id ?? `${service.title}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" as const }}
            className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-foreground/10 hover:shadow-md sm:p-6"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold leading-snug sm:text-lg">{service.title}</h3>
            {service.description && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
