"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowUpLeft } from "lucide-react";
import { GitHubIcon } from "./icons";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const src = project.image || "/images/og.jpg";
  const unoptimized = src.startsWith("/api/media/") || src.startsWith("data:");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" as const }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-foreground/10 hover:shadow-lg"
      >
        {/* Fixed frame — image always covers (crops overflow) */}
        <div className="relative aspect-video w-full overflow-hidden bg-secondary">
          <Image
            src={src}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={unoptimized}
            className="!h-full !w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute left-4 top-4 z-10 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            {project.liveUrl && (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  window.open(project.liveUrl, "_blank");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black backdrop-blur-sm transition-transform hover:scale-110"
                aria-label="نسخه آنلاین"
              >
                <ExternalLink className="h-4 w-4" />
              </span>
            )}
            {project.githubUrl && (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  window.open(project.githubUrl, "_blank");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black backdrop-blur-sm transition-transform hover:scale-110"
                aria-label="مخزن گیت‌هاب"
              >
                <GitHubIcon className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {project.category}
            </span>
          </div>

          <h3 className="mb-2 text-lg font-semibold tracking-tight transition-colors group-hover:text-foreground/80">
            {project.title}
            <ArrowUpLeft className="mr-1 inline-block h-4 w-4 opacity-0 transition-all group-hover:opacity-100" />
          </h3>

          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
