import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { ReadingProgress } from "@/components/reading-progress";
import { HideOnAdmin } from "@/components/hide-on-admin";
import { getSiteConfig, getProfile, getSocials } from "@/lib/content";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  const profile = await getProfile();

  const iconList = [
    { url: site.favicon || "/favicon.svg", type: getFaviconType(site.favicon || "/favicon.svg") },
    ...(site.faviconLight ? [{ url: site.faviconLight, type: getFaviconType(site.faviconLight), media: "(prefers-color-scheme: light)" }] : []),
    ...(site.faviconDark ? [{ url: site.faviconDark, type: getFaviconType(site.faviconDark), media: "(prefers-color-scheme: dark)" }] : []),
  ];

  return {
    title: { default: `${profile.name} — ${profile.role}`, template: `%s — ${profile.name}` },
    description: site.description,
    keywords: site.keywords,
    authors: [{ name: profile.name }],
    creator: profile.name,
    metadataBase: new URL(site.url),
    openGraph: { type: "website", locale: site.locale, url: site.url, title: `${profile.name} — ${profile.role}`, description: site.description, siteName: profile.name },
    twitter: { card: "summary_large_image", title: `${profile.name} — ${profile.role}`, description: site.description },
    icons: {
      icon: iconList,
      shortcut: site.favicon || "/favicon.svg",
      apple: site.favicon || "/favicon.svg",
    },
    robots: { index: true, follow: true },
  };
}

function getFaviconType(path: string) {
  const ext = path.split(".").pop()?.split(/[?#]/)[0]?.toLowerCase();
  switch (ext) {
    case "svg":
      return "image/svg+xml";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return undefined;
  }
}

function renderFaviconLink(href: string, media?: string) {
  const type = getFaviconType(href);
  return (
    <>
      <link rel="icon" href={href} sizes="any"{...(type ? { type } : {})} />
      <link rel="shortcut icon" href={href} sizes="any"{...(type ? { type } : {})} />
      {media ? <link rel="icon" href={href} sizes="any" media={media}{...(type ? { type } : {})} /> : null}
    </>
  );
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const profile = await getProfile();
  const socials = await getSocials();
  const site = await getSiteConfig();

  const defaultFavicon = site.favicon || "/favicon.svg";

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {renderFaviconLink(defaultFavicon)}
        {site.faviconLight ? renderFaviconLink(site.faviconLight, "(prefers-color-scheme: light)") : null}
        {site.faviconDark ? renderFaviconLink(site.faviconDark, "(prefers-color-scheme: dark)") : null}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers defaultTheme={site.defaultTheme}>
          <HideOnAdmin>
            <ReadingProgress />
          </HideOnAdmin>
          <Navbar logo={site.logo} logoText={site.logoText} />
          <main
            className="min-h-screen"
            data-content-font-size={site.contentFontSize}
            data-content-text-align={site.contentTextAlign}
          >
            {children}
          </main>
          <HideOnAdmin>
            <Footer
              name={profile.name}
              socials={socials}
              logo={site.logo}
              logoText={site.logoText}
              tagline={site.footerTagline}
              copyright={site.footerCopyright}
            />
            <BackToTop />
          </HideOnAdmin>
        </Providers>
      </body>
    </html>
  );
}
