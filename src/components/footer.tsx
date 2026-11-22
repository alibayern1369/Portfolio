import Link from "next/link";
import { GitHubIcon, LinkedInIcon, TwitterIcon, DribbbleIcon } from "./icons";
import { SiteLogo } from "./site-logo";
import type { Social } from "@/types";
import type { ComponentType, SVGProps } from "react";
import styles from "./footer.module.css";
import { safeFooterLink, type FooterConfig } from "@/lib/footer-config";

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GitHubIcon, linkedin: LinkedInIcon, twitter: TwitterIcon, dribbble: DribbbleIcon,
};
interface FooterProps {
  name: string; socials: Social[]; logo?: string; logoText?: string; tagline?: string; copyright?: string; config: FooterConfig;
}
export function Footer({ name, socials, logo, logoText, tagline, copyright, config }: FooterProps) {
  const year = new Date().getFullYear().toLocaleString("fa-IR", { useGrouping: false });
  const brand = logoText || "کیش لند وب";
  return (
    <footer className={styles.footer} dir="rtl">
      <div className={styles.stage} aria-hidden="true" style={{ backgroundImage: `url(${JSON.stringify(config.image)})` }} />
      <div className={styles.wordmark} aria-hidden="true">{brand}</div>
      <div className={styles.fog} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.brand}>
          <SiteLogo logo={logo} logoText={logoText} className={styles.logo} />
          <h2 className={styles.title}>{config.title}</h2>
          <p className={styles.description}>{tagline || "کیش لند وب؛ طراحی و توسعه محصول دیجیتال"}</p>
          <Link href={safeFooterLink(config.buttonHref)} className={styles.cta}>{config.buttonText} <span aria-hidden="true">←</span></Link>
          <p className={styles.copyright}>{copyright || `© ${year} ${brand}؛ تمامی حقوق محفوظ است.`}</p>
          {config.credit && <p className={styles.credit}>{config.credit}</p>}
        </div>
        <nav className={styles.column} aria-label={config.navigationTitle}>
          <h3>{config.navigationTitle}</h3>
          <ul>{config.navigation.map((link, index) => <li key={index}><Link href={safeFooterLink(link.href)}>{link.label}</Link></li>)}</ul>
        </nav>
        <nav className={styles.column} aria-label={config.moreTitle}>
          <h3>{config.moreTitle}</h3>
          <ul>{config.more.map((link, index) => <li key={index}><Link href={safeFooterLink(link.href)}>{link.label}</Link></li>)}</ul>
        </nav>
        {socials.length > 0 && <nav className={styles.column} aria-label="شبکه‌های اجتماعی">
          <h3>{config.socialsTitle}</h3>
          <ul>{socials.map((social) => {
            const Icon = iconMap[social.icon];
            return <li key={social.name}><a href={social.url} target="_blank" rel="noopener noreferrer">{Icon && <Icon className={styles.socialIcon} />}<span>{social.name}</span></a></li>;
          })}</ul>
        </nav>}
      </div>
    </footer>
  );
}
