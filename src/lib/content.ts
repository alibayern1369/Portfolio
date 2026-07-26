import db from "@/db";
import { initDatabase } from "@/db";
import { seedDatabase } from "@/db/seed";
import type {
  SiteConfig, Profile, Social, SkillsData, SkillCategory,
  Experience, Testimonial, Project, AboutData,
} from "@/types";

// Initialize DB on first call - use a promise to prevent race conditions
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

function row(obj: Record<string, unknown> | undefined): Record<string, unknown> {
  return obj ?? {};
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null || value === "") return fallback;
  if (typeof value !== "string") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// Profile
export async function getProfile(): Promise<Profile> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM profile WHERE id = 1");
  const r = row(result.rows[0] as Record<string, unknown> | undefined);

  return {
    name: String(r.name ?? "علی دلاور"),
    role: String(r.role ?? ""),
    tagline: String(r.tagline ?? ""),
    bio: String(r.bio ?? ""),
    shortBio: String(r.short_bio ?? ""),
    avatar: String(r.avatar ?? "/images/profile.jpg"),
    location: String(r.location ?? ""),
    email: String(r.email ?? ""),
    availability: String(r.availability ?? ""),
    resumeUrl: String(r.resume_url ?? ""),
    heroHeadline: parseJson<string[]>(r.hero_headline, []),
    heroDescription: String(r.hero_description ?? ""),
  };
}

// Site config
export async function getSiteConfig(): Promise<SiteConfig> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM site_settings WHERE id = 1");
  const r = row(result.rows[0] as Record<string, unknown> | undefined);

  return {
    name: String(r.site_name ?? ""),
    title: String(r.site_title ?? ""),
    description: String(r.site_description ?? ""),
    url: String(r.site_url ?? "https://example.com"),
    locale: String(r.locale ?? "fa-IR"),
    ogImage: "/images/og.jpg",
    keywords: parseJson<string[]>(r.keywords, []),
  };
}

// Socials
export async function getSocials(): Promise<Social[]> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM socials ORDER BY sort_order");
  return result.rows.map((row) => {
    const r = row as unknown as Record<string, unknown>;
    return { name: String(r.name ?? ""), url: String(r.url ?? ""), icon: String(r.icon ?? "") };
  });
}

// Skills
export async function getSkills(): Promise<SkillsData> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM skill_categories ORDER BY sort_order");
  const categories: SkillCategory[] = result.rows.map((row) => {
    const r = row as unknown as Record<string, unknown>;
    return {
      name: String(r.name ?? ""),
      icon: String(r.icon ?? ""),
      skills: parseJson<string[]>(r.skills, []),
    };
  });
  return { categories };
}

// Experiences
export async function getExperiences(): Promise<Experience[]> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM experiences ORDER BY sort_order");
  return result.rows.map((row) => {
    const r = row as unknown as Record<string, unknown>;
    return {
      company: String(r.company ?? ""),
      role: String(r.role ?? ""),
      period: String(r.period ?? ""),
      location: String(r.location ?? ""),
      description: String(r.description ?? ""),
      achievements: parseJson<string[]>(r.achievements, []),
      technologies: parseJson<string[]>(r.technologies, []),
    };
  });
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM testimonials ORDER BY sort_order");
  return result.rows.map((row) => {
    const r = row as unknown as Record<string, unknown>;
    return {
      name: String(r.name ?? ""),
      role: String(r.role ?? ""),
      company: String(r.company ?? ""),
      avatar: String(r.avatar ?? ""),
      text: String(r.text ?? ""),
    };
  });
}

// About
export async function getAbout(): Promise<AboutData> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM about_page WHERE id = 1");
  const r = row(result.rows[0] as Record<string, unknown> | undefined);

  return {
    title: String(r.title ?? "درباره من"),
    subtitle: String(r.subtitle ?? ""),
    content: String(r.content ?? ""),
  };
}

// Projects
export async function getAllProjects(): Promise<Project[]> {
  await ensureDb();
  const result = await db.execute("SELECT * FROM projects ORDER BY sort_order, created_at DESC");
  return result.rows.map((row) => {
    const r = row as unknown as Record<string, unknown>;
    return {
      slug: String(r.slug ?? ""),
      title: String(r.title ?? ""),
      description: String(r.description ?? ""),
      image: String(r.image ?? ""),
      tags: parseJson<string[]>(r.tags, []),
      category: String(r.category ?? ""),
      featured: Boolean(r.featured),
      liveUrl: String(r.live_url ?? ""),
      githubUrl: String(r.github_url ?? ""),
      date: String(r.created_at ?? ""),
      content: String(r.content ?? ""),
    };
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  await ensureDb();
  const result = await db.execute({ sql: "SELECT * FROM projects WHERE slug = ?", args: [slug] });
  const r = result.rows[0] as unknown as Record<string, unknown> | undefined;
  if (!r) return undefined;

  return {
    slug: String(r.slug ?? ""),
    title: String(r.title ?? ""),
    description: String(r.description ?? ""),
    image: String(r.image ?? ""),
    tags: parseJson<string[]>(r.tags, []),
    category: String(r.category ?? ""),
    featured: Boolean(r.featured),
    liveUrl: String(r.live_url ?? ""),
    githubUrl: String(r.github_url ?? ""),
    date: String(r.created_at ?? ""),
    content: String(r.content ?? ""),
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
