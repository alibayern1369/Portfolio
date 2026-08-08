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
      "علی دلاور",
      profile.name,
      site.name,
    ].filter(Boolean))
  );

  const person = {
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: profile.name,
    alternateName: ["علی دلاور", "Ali Delavar", "klandweb", "کیش لند وب"],
    url: site.url,
    image: absoluteUrl(site.url, profile.avatar),
    jobTitle: profile.role,
    description: profile.bio || site.description,
    email: profile.email || undefined,
    address: profile.location
      ? { "@type": "PostalAddress", addressLocality: profile.location }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    knowsAbout: keywords,
  };

  const organization = {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name || "کیش لند وب",
    alternateName: ["klandweb", "کیش لند وب", "Kland Web"],
    url: site.url,
    logo: site.logo ? absoluteUrl(site.url, site.logo) : ogImage,
    founder: { "@id": `${site.url}/#person` },
    sameAs: sameAs.length ? sameAs : undefined,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    alternateName: ["klandweb", "کیش لند وب", profile.name],
    description: site.description,
    inLanguage: site.locale || "fa-IR",
    publisher: { "@id": `${site.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/projects?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [website, organization, person],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
