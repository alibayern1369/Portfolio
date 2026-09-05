"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GAHAN_GALLERY } from "@/data/gahan/content";

export function GahanGallery() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {GAHAN_GALLERY.map((item, i) => (
        <motion.figure
          key={item.src}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
          className={`overflow-hidden rounded-2xl border border-border bg-card ${
            i === 0 ? "sm:col-span-2" : ""
          }`}
        >
          <div className={`relative w-full ${i === 4 ? "aspect-[9/16] max-w-xs mx-auto" : "aspect-[16/10]"}`}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              unoptimized
              className="object-cover"
              sizes={i === 0 ? "(max-width: 1200px) 100vw, 1100px" : "(max-width: 768px) 100vw, 560px"}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
          <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
            {item.caption}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
