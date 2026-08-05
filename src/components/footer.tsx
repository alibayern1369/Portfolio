import { GitHubIcon, LinkedInIcon, TwitterIcon, DribbbleIcon } from "./icons";
import { SiteLogo } from "./site-logo";
import type { Social } from "@/types";
import type { ComponentType, SVGProps } from "react";

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  dribbble: DribbbleIcon,
};

interface FooterProps {
  name: string;
  socials: Social[];
  logo?: string;
  logoText?: string;
  tagline?: string;
  copyright?: string;
}

export function Footer({ name, socials, logo, logoText, tagline, copyright }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <SiteLogo logo={logo} logoText={logoText} />
            <p className="mt-1 text-sm text-muted-foreground">
              {tagline || "خلق تجربه‌های دیجیتال"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socials.map((social) => {
              const Icon = iconMap[social.icon];
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground hover:scale-110"
                  aria-label={social.name}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {copyright || `© ${currentYear} ${name}. تمامی حقوق محفوظ است.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
