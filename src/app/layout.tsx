export const dynamic = "force-dynamic";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { ReadingProgress } from "@/components/reading-progress";
import { getSiteConfig, getProfile, getSocials } from "@/lib/content";
import "./globals.css";

const site = getSiteConfig();
const profile = getProfile();
const socials = getSocials();

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: profile.name }],
  creator: profile.name,
  metadataBase: new URL(site.url),
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    title: `${profile.name} — ${profile.role}`,
    description: site.description,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: site.description,
    creator: "@alidelavar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <ReadingProgress />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer name={profile.name} socials={socials} />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
