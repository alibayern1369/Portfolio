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
    alternateName: ["علی دلاور", "Ali Delavar"],
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
    name: "کیش لند وب",
    alternateName: ["klandweb", "Kland Web", site.name].filter(Boolean),
    url: site.url,
    logo: site.logo ? absoluteUrl(site.url, site.logo) : ogImage,
    founder: { "@id": `${site.url}/#person` },
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
    name: "کیش لند وب | طراحی و توسعه وبسایت — klandweb",
    description: site.description,
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/#organization` },
    inLanguage: site.locale || "fa-IR",
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [website, organization, person, webPage],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
