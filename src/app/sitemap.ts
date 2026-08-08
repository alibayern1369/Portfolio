import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://klandweb.com";

  try {
    const { getSiteConfig, getAllProjects } = await import("@/lib/content");
    const site = await getSiteConfig();
    if (site.url) siteUrl = site.url.replace(/\/$/, "");

    const staticPages: MetadataRoute.Sitemap = [
      { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
      { url: `${siteUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
      { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
      { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
      { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ];

    const projects = await getAllProjects();
    const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
    return [...staticPages, ...projectUrls];
  } catch {
    return [
      { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ];
  }
}
