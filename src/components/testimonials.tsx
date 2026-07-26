"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map((testimonial, i) => (
        <motion.div
          key={testimonial.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" as const }}
          className="relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/10 hover:shadow-md"
        >
          <Quote className="mb-4 h-6 w-6 text-muted-foreground/30 scale-x-[-1]" />

          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            «{testimonial.text}»
          </p>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
              {testimonial.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">
                {testimonial.role}، {testimonial.company}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
