import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { ReadingProgress } from "@/components/reading-progress";
import { HideOnAdmin } from "@/components/hide-on-admin";
import { JsonLd } from "@/components/json-ld";
import { getSiteConfig, getProfile, getSocials } from "@/lib/content";
import "./globals.css";

const vazirmatn = localFont({
  src: "../fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  const profile = await getProfile();

  const iconList = [
    { url: site.favicon || "/favicon.svg", type: getFaviconType(site.favicon || "/favicon.svg") },
  ];

  const titleDefault = "کیش لند وب | طراحی سایت، نرم‌افزار و اپلیکیشن";
  const description =
    site.description ||
    "کیش لند وب؛ طراحی سایت، تجربه کاربری، نرم‌افزار اختصاصی و اپلیکیشن موبایل برای کسب‌وکارها.";

  const keywords = Array.from(
    new Set([
      ...site.keywords,
      "klandweb",
      "کیش لند وب",
      profile.name,
      "طراحی سایت",
      "توسعه وب",
    ].filter(Boolean))
  );

  const ogImage = site.ogImage || "/images/og.jpg";

  return {
    title: { default: titleDefault, template: `%s — کیش لند وب` },
    description,
    keywords,
    authors: [{ name: "تیم کیش لند وب", url: site.url }],
    creator: "تیم کیش لند وب",
    publisher: "کیش لند وب",
    metadataBase: new URL(site.url),
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: site.locale,
      url: site.url,
      title: titleDefault,
      description,
      siteName: "کیش لند وب",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "کیش لند وب — klandweb" }],
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description,
      images: [ogImage],
    },
    icons: {
      icon: iconList,
      shortcut: site.favicon || "/favicon.svg",
      apple: site.favicon || "/favicon.svg",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: site.googleSiteVerification
      ? { google: site.googleSiteVerification }
      : undefined,
    category: "technology",
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
    <html lang="fa" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <head>
        {renderFaviconLink(defaultFavicon)}
        <meta name="color-scheme" content="light" />
        <link rel="manifest" href="/manifest.json" />
        <JsonLd site={site} profile={profile} socials={socials} />
      </head>
      <body className={`${vazirmatn.className} min-h-screen bg-background text-foreground antialiased`}>
        <Providers>
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
              config={site.footerConfig}
            />
            <BackToTop />
          </HideOnAdmin>
        </Providers>
      </body>
    </html>
  );
}
