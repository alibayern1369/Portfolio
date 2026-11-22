import Link from "next/link";
import { GitHubIcon, LinkedInIcon, TwitterIcon, DribbbleIcon } from "./icons";
import { SiteLogo } from "./site-logo";
import type { Social } from "@/types";
import type { ComponentType, SVGProps } from "react";
import styles from "./footer.module.css";

// تصویر دلخواه را در public قرار دهید و مسیر آن را اینجا وارد کنید.
const FOOTER_IMAGE = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261014_121838_c97d0940-f430-4304-8573-4f47ee44f447.png";
const navigation = [
  { href: "/", label: "خانه" }, { href: "/services", label: "خدمات" },
  { href: "/projects", label: "پروژه‌ها" }, { href: "/about", label: "درباره من" },
  { href: "/contact", label: "تماس" },
];
const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GitHubIcon, linkedin: LinkedInIcon, twitter: TwitterIcon, dribbble: DribbbleIcon,
};
interface FooterProps {
  name: string; socials: Social[]; logo?: string; logoText?: string; tagline?: string; copyright?: string;
}
export function Footer({ name, socials, logo, logoText, tagline, copyright }: FooterProps) {
  const year = new Date().getFullYear().toLocaleString("fa-IR", { useGrouping: false });
  const brand = logoText || "کیش لند وب";
  return (
    <footer className={styles.footer} dir="rtl">
      <div className={styles.stage} aria-hidden="true" style={{ backgroundImage: `url("${FOOTER_IMAGE}")` }} />
      <div className={styles.wordmark} aria-hidden="true">{brand}</div>
      <div className={styles.fog} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.brand}>
          <SiteLogo logo={logo} logoText={logoText} className={styles.logo} />
          <h2 className={styles.title}>طراحی و توسعه محصول دیجیتال</h2>
          <p className={styles.description}>{tagline || "کیش لند وب؛ طراحی و توسعه محصول دیجیتال"}</p>
          <Link href="/contact" className={styles.cta}>شروع همکاری <span aria-hidden="true">←</span></Link>
          <p className={styles.copyright}>{copyright || `© ${year} ${brand}؛ تمامی حقوق محفوظ است.`}</p>
          {name && <p className={styles.credit}>با همراهی {name}</p>}
        </div>
        <nav className={styles.column} aria-label="دسترسی سریع">
          <h3>دسترسی سریع</h3>
          <ul>{navigation.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
        </nav>
        <nav className={styles.column} aria-label="بیشتر بدانید">
          <h3>بیشتر بدانید</h3>
          <ul>
            <li><Link href="/services">خدمات کیش لند وب</Link></li>
            <li><Link href="/projects">نمونه‌کارها</Link></li>
            <li><Link href="/about">مسیر و مهارت‌ها</Link></li>
            <li><Link href="/contact">درخواست همکاری</Link></li>
          </ul>
        </nav>
        {socials.length > 0 && <nav className={styles.column} aria-label="شبکه‌های اجتماعی">
          <h3>همراه ما باشید</h3>
          <ul>{socials.map((social) => {
            const Icon = iconMap[social.icon];
            return <li key={social.name}><a href={social.url} target="_blank" rel="noopener noreferrer">{Icon && <Icon className={styles.socialIcon} />}<span>{social.name}</span></a></li>;
          })}</ul>
        </nav>}
      </div>
    </footer>
  );
}
