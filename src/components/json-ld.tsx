import type { Profile, SiteConfig, Social } from "@/types";

interface JsonLdProps {
  site: SiteConfig;
  profile: Profile;
  socials: Social[];
}

function absoluteUrl(base: string, path: string): string {
  if (!path) return base;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function JsonLd({ site, profile, socials }: JsonLdProps) {
  const sameAs = socials.map((s) => s.url).filter(Boolean);
  const ogImage = absoluteUrl(site.url, site.ogImage || "/images/og.jpg");
  const keywords = Array.from(
    new Set([
      ...site.keywords,
      "klandweb",
      "کیش لند وب",
      profile.name,
      site.name,
    ].filter(Boolean))
  );

  const organization = {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: "کیش لند وب",
    alternateName: ["klandweb", "Kland Web", site.name].filter(Boolean),
    url: site.url,
    logo: site.logo ? absoluteUrl(site.url, site.logo) : ogImage,
    description: site.description,
    knowsAbout: keywords,
    sameAs: sameAs.length ? sameAs : undefined,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: "کیش لند وب",
    alternateName: ["klandweb", site.name, profile.name].filter(Boolean),
    description: site.description,
    inLanguage: site.locale || "fa-IR",
    publisher: { "@id": `${site.url}/#organization` },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${site.url}/#webpage`,
    url: site.url,
    name: "کیش لند وب | طراحی سایت، نرم‌افزار و اپلیکیشن",
    description: site.description,
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/#organization` },
    inLanguage: site.locale || "fa-IR",
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [website, organization, webPage],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
