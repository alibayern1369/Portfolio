import db from "@/db";
import { initDatabase } from "@/db";
import { seedDatabase } from "@/db/seed";
import type {
  SiteConfig, Profile, Social, SkillsData, SkillCategory,
  Experience, Service, Testimonial, Project, AboutData,
} from "@/types";

let initPromise: Promise<void> | null = null;

function ensureDb(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await initDatabase();
        await seedDatabase();
      } catch (e) {
        console.error("ensureDb error:", e);
        initPromise = null;
      }
    })();
  }
  return initPromise;
}

function r(obj: unknown): Record<string, unknown> {
  return (obj as Record<string, unknown>) ?? {};
}

function str(val: unknown, fallback = ""): string {
  if (val === null || val === undefined) return fallback;
  return String(val);
}

function safeUrl(value: string, fallback: string): string {
  const url = String(value || "").trim();
  if (!url) return fallback;
  try {
    new URL(url);
    return url;
  } catch {
    return fallback;
  }
}

function json<T>(val: unknown, fallback: T): T {
  try {
    return JSON.parse(String(val)) as T;
  } catch {
    return fallback;
  }
}

// Profile
export async function getProfile(): Promise<Profile> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM profile WHERE id = 1");
  const row = r(result.rows[0]);

  return {
    name: str(row.name, "علی دلاور"),
    role: str(row.role, "توسعه‌دهنده"),
    tagline: str(row.tagline),
    bio: str(row.bio),
    shortBio: str(row.short_bio),
    avatar: str(row.avatar, "/images/profile.jpg"),
    location: str(row.location),
    email: str(row.email),
    availability: str(row.availability),
    resumeUrl: str(row.resume_url),
    heroHeadline: json<string[]>(row.hero_headline, ["سلام", "من علی هستم"]),
    heroDescription: str(row.hero_description),
  };
}

// Site config
export async function getSiteConfig(): Promise<SiteConfig> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM site_settings WHERE id = 1");
  const row = r(result.rows[0]);

  const fontSize = str(row.content_font_size, "base");
  const textAlign = str(row.content_text_align, "right");

  return {
    name: str(row.site_name, "علی دلاور"),
    title: str(row.site_title),
    description: str(row.site_description),
    url: safeUrl(str(row.site_url), process.env.NEXT_PUBLIC_SITE_URL || "https://alidelavar.dev"),
    locale: str(row.locale, "fa-IR"),
    defaultTheme: (str(row.default_theme, "system") as "light" | "dark" | "system"),
    ogImage: "/images/og.jpg",
    keywords: json<string[]>(row.keywords, []),
    logo: str(row.logo),
    logoText: str(row.logo_text, "ع.د"),
    favicon: str(row.favicon),
    faviconLight: str(row.favicon_light),
    faviconDark: str(row.favicon_dark),
    homeHeroDescription: str(row.home_hero_description),
    homeAboutTitle: str(row.home_about_title, "من و کسب‌وکارم"),
    homeAboutDescription: str(row.home_about_description),
    homeServicesTitle: str(row.home_services_title, "چی براتون انجام می‌دم"),
    homeServicesDescription: str(row.home_services_description, "از طراحی رابط کاربری تا توسعه وبسایت، نرم‌افزار و اپ موبایل."),
    homeProjectsTitle: str(row.home_projects_title, "پروژه‌های منتخب"),
    homeProjectsDescription: str(row.home_projects_description, "نمونه‌هایی از کارهای انجام‌شده برای مشتریان و پروژه‌های شخصی."),
    homeSkillsTitle: str(row.home_skills_title, "ابزارها و مهارت‌ها"),
    homeSkillsDescription: str(row.home_skills_description, "فناوری‌ها و ابزارهایی که برای ساخت محصول استفاده می‌کنم."),
    homeTestimonialsTitle: str(row.home_testimonials_title, "بازخورد مشتریان"),
    homeTestimonialsDescription: str(row.home_testimonials_description, "تجربه همکاری مشتریان و همکاران."),
    homeCtaTitle: str(row.home_cta_title, "بیایید با هم کار کنیم"),
    homeCtaDescription: str(row.home_cta_description, "اگر برای طراحی، توسعه وبسایت، نرم‌افزار یا اپ موبایل نیاز به همکاری دارید، خوشحال می‌شوم گفتگو کنیم."),
    footerTagline: str(row.footer_tagline, "خلق تجربه‌های دیجیتال"),
    footerCopyright: str(row.footer_copyright),
    contentFontSize: (["sm", "base", "lg", "xl"].includes(fontSize) ? fontSize : "base") as SiteConfig["contentFontSize"],
    contentTextAlign: (["right", "left", "center", "justify"].includes(textAlign) ? textAlign : "right") as SiteConfig["contentTextAlign"],
  };
}

// Socials
export async function getSocials(): Promise<Social[]> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM socials ORDER BY sort_order");
  return result.rows.map((row) => {
    const d = r(row);
    return { name: str(d.name), url: str(d.url), icon: str(d.icon) };
  });
}

// Skills
export async function getSkills(): Promise<SkillsData> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM skill_categories ORDER BY sort_order");
  const categories: SkillCategory[] = result.rows.map((row) => {
    const d = r(row);
    return { name: str(d.name), icon: str(d.icon), skills: json<string[]>(d.skills, []) };
  });
  return { categories };
}

// Experiences (legacy)
export async function getExperiences(): Promise<Experience[]> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM experiences ORDER BY sort_order");
  return result.rows.map((row) => {
    const d = r(row);
    return {
      company: str(d.company), role: str(d.role), period: str(d.period),
      location: str(d.location), description: str(d.description),
      achievements: json<string[]>(d.achievements, []),
      technologies: json<string[]>(d.technologies, []),
    };
  });
}

// Services
export async function getServices(): Promise<Service[]> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM services ORDER BY sort_order, id");
  return result.rows.map((row) => {
    const d = r(row);
    return {
      id: Number(d.id),
      title: str(d.title),
      description: str(d.description),
      icon: str(d.icon, "sparkles"),
      sortOrder: Number(d.sort_order ?? 0),
    };
  });
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM testimonials ORDER BY sort_order");
  return result.rows.map((row) => {
    const d = r(row);
    return {
      name: str(d.name), role: str(d.role), company: str(d.company),
      avatar: str(d.avatar), text: str(d.text),
    };
  });
}

// About
export async function getAbout(): Promise<AboutData> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM about_page WHERE id = 1");
  const row = r(result.rows[0]);
  return { title: str(row.title, "درباره من"), subtitle: str(row.subtitle), content: str(row.content) };
}

// Projects
export async function getAllProjects(): Promise<Project[]> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM projects ORDER BY sort_order, created_at DESC");
  return result.rows.map((row) => {
    const d = r(row);
    return {
      slug: str(d.slug), title: str(d.title), description: str(d.description),
      image: str(d.image), tags: json<string[]>(d.tags, []),
      category: str(d.category), featured: Boolean(d.featured),
      liveUrl: str(d.live_url), githubUrl: str(d.github_url),
      date: str(d.created_at), content: str(d.content),
    };
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  await ensureDb();
  const result = await db.execute({ sql: "SELECT * FROM projects WHERE slug = ?", args: [slug] });
  if (!result.rows[0]) return undefined;
  const d = r(result.rows[0]);
  return {
    slug: str(d.slug), title: str(d.title), description: str(d.description),
    image: str(d.image), tags: json<string[]>(d.tags, []),
    category: str(d.category), featured: Boolean(d.featured),
    liveUrl: str(d.live_url), githubUrl: str(d.github_url),
    date: str(d.created_at), content: str(d.content),
  };
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((p) => p.featured);
}

export async function getProjectCategories(): Promise<string[]> {
  const projects = await getAllProjects();
  const categories = new Set(projects.map((p) => p.category));
  return ["همه", ...Array.from(categories)];
}
