"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import type { Experience } from "@/types";

interface TimelineProps {
  experiences: Experience[];
}

export function Timeline({ experiences }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line - right side for RTL */}
      <div className="absolute right-8 top-0 hidden h-full w-px bg-border md:block" />

      <div className="space-y-12">
        {experiences.map((exp, i) => (
          <motion.div
            key={`${exp.company}-${exp.period}`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" as const }}
            className="relative md:pr-20"
          >
            {/* Dot - right side for RTL */}
            <div className="absolute right-[26px] top-1 hidden h-5 w-5 items-center justify-center rounded-full border-2 border-border bg-background md:flex">
              <div className="h-2 w-2 rounded-full bg-foreground" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/10 hover:shadow-md">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">{exp.company}</h3>
                  </div>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {exp.role}
                  </p>
                </div>
                <div className="text-left">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                    {exp.period}
                  </span>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {exp.location}
                  </div>
                </div>
              </div>

              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                {exp.description}
              </p>

              <ul className="mb-4 space-y-2">
                {exp.achievements.map((achievement, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground/30" />
                    {achievement}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
