"use client";

import { ProjectCard } from "./project-card";
import type { Project } from "@/types";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {projects.map((project, i) => (
        <ProjectCard key={project.slug} project={project} index={i} imageFit="contain" />
      ))}
    </div>
  );
}
