"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CTAProps {
  name: string;
  title?: string;
  description?: string;
}

export function CTA({ name, title, description }: CTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      className="relative overflow-hidden rounded-3xl border border-border bg-card"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent" />

      <div className="relative px-8 py-16 text-center md:px-16 md:py-20">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {title || "بیایید با هم کار کنیم"}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground leading-relaxed">
          {description || "اگر برای طراحی، توسعه وبسایت، نرم‌افزار یا اپ موبایل نیاز به همکاری دارید، خوشحال می‌شوم گفتگو کنیم."}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background transition-all hover:opacity-90 hover:scale-105 active:scale-95"
          >
            تماس با {name.split(" ")[0]}
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
