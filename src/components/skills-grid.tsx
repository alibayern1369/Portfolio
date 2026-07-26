"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  Server,
  Palette,
  Cloud,
  Wrench,
  Users,
} from "lucide-react";
import type { SkillCategory } from "@/types";
import type { ComponentType } from "react";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  monitor: Monitor,
  server: Server,
  palette: Palette,
  cloud: Cloud,
  wrench: Wrench,
  users: Users,
};

interface SkillsGridProps {
  categories: SkillCategory[];
}

export function SkillsGrid({ categories }: SkillsGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, i) => {
        const Icon = iconMap[category.icon];
        return (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" as const }}
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/10 hover:shadow-md"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
              </div>
              <h3 className="font-semibold">{category.name}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
