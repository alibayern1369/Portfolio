export interface FooterLink { label: string; href: string }
export interface FooterConfig {
  image: string; title: string; buttonText: string; buttonHref: string; credit: string;
  navigationTitle: string; navigation: FooterLink[]; moreTitle: string; more: FooterLink[]; socialsTitle: string;
}
export const defaultFooterConfig: FooterConfig = {
  image: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261014_121838_c97d0940-f430-4304-8573-4f47ee44f447.png",
  title: "طراحی و توسعه محصول دیجیتال", buttonText: "شروع همکاری", buttonHref: "/contact", credit: "",
  navigationTitle: "دسترسی سریع", navigation: [
    { href: "/", label: "خانه" }, { href: "/services", label: "خدمات" }, { href: "/projects", label: "پروژه‌ها" },
    { href: "/about", label: "درباره ما" }, { href: "/contact", label: "تماس" },
  ],
  moreTitle: "بیشتر بدانید", more: [
    { href: "/services", label: "خدمات کیش لند وب" }, { href: "/projects", label: "نمونه‌کارها" },
    { href: "/about", label: "مسیر و مهارت‌ها" }, { href: "/contact", label: "درخواست همکاری" },
  ], socialsTitle: "همراه ما باشید",
};
export function parseFooterConfig(value: unknown): FooterConfig {
  let data: Partial<FooterConfig> = {};
  try { data = typeof value === "string" ? JSON.parse(value) : (value as Partial<FooterConfig>) || {}; } catch { /* use defaults */ }
  if (!data || typeof data !== "object" || Array.isArray(data)) data = {};
  const result = { ...defaultFooterConfig };
  for (const key of ["image", "title", "buttonText", "buttonHref", "credit", "navigationTitle", "moreTitle", "socialsTitle"] as const) {
    if (typeof data[key] === "string") result[key] = data[key];
  }
  for (const key of ["navigation", "more"] as const) {
    if (Array.isArray(data[key])) result[key] = data[key].filter((item): item is FooterLink => !!item && typeof item.label === "string" && typeof item.href === "string");
  }
  return result;
}
export function safeFooterLink(href: string): string {
  const url = href.trim();
  return /^(?:\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i.test(url) ? url : "#";
}
