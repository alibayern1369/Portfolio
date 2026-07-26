import type { MetadataRoute } from "next";
import { getAllProjects, getSiteConfig } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  const projects = getAllProjects();

  const projectUrls = projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    lastModified: new Date(project.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/experience`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...projectUrls,
  ];
}
