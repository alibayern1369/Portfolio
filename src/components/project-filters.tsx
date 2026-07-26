"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ProjectCard } from "./project-card";
import type { Project } from "@/types";

interface ProjectFiltersProps {
  projects: Project[];
  categories: string[];
}

export function ProjectFilters({
  projects,
  categories,
}: ProjectFiltersProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("همه");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        activeCategory === "همه" || p.category === activeCategory;
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, search]);

  return (
    <div>
      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="جستجوی پروژه‌ها..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-card pr-11 pl-4 py-3 text-sm transition-colors placeholder:text-muted-foreground focus:border-foreground/20 focus:outline-none"
          aria-label="جستجوی پروژه‌ها"
        />
      </div>

      {/* Category Filters */}
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === category
                ? "bg-foreground text-background"
                : "border border-border bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center"
        >
          <p className="text-muted-foreground">پروژه‌ای یافت نشد.</p>
        </motion.div>
      )}
    </div>
  );
}
