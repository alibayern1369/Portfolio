import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://klandweb.com";
  try {
    const site = await getSiteConfig();
    if (site.url) siteUrl = site.url;
  } catch {
    // fallback
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
    host: siteUrl.replace(/\/$/, ""),
  };
}
