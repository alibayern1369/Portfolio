"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const isImageAvatar = (value: string) => /^(https?:\/\/|\/).*|.*\.(png|jpe?g|webp|gif|svg)$/i.test(value);

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
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-secondary text-xs font-bold text-muted-foreground">
              {isImageAvatar(testimonial.avatar) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={testimonial.avatar} alt={testimonial.name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                  {testimonial.avatar || testimonial.name.slice(0, 2)}
                </span>
              )}
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
