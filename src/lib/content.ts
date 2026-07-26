import db from "@/db";
import type {
  SiteConfig,
  Profile,
  Social,
  SkillsData,
  SkillCategory,
  Experience,
  Testimonial,
  Project,
  AboutData,
} from "@/types";

// Profile
export function getProfile(): Profile {
  const row = db.prepare("SELECT * FROM profile WHERE id = 1").get() as Record<string, unknown> | undefined;
  
  if (!row) {
    return {
      name: "علی دلاور",
      role: "توسعه‌دهنده",
      tagline: "",
      bio: "",
      shortBio: "",
      avatar: "/images/profile.jpg",
      location: "تهران",
      email: "email@example.com",
      availability: "آماده همکاری",
      resumeUrl: "/resume.pdf",
      heroHeadline: ["سلام", "من علی هستم"],
      heroDescription: ""
    };
  }

  return {
    name: row.name as string,
    role: row.role as string,
    tagline: row.tagline as string || "",
    bio: row.bio as string || "",
    shortBio: row.short_bio as string || "",
    avatar: row.avatar as string || "/images/profile.jpg",
    location: row.location as string || "",
    email: row.email as string || "",
    availability: row.availability as string || "",
    resumeUrl: row.resume_url as string || "",
    heroHeadline: JSON.parse(row.hero_headline as string || "[]"),
    heroDescription: row.hero_description as string || ""
  };
}

// Site config
export function getSiteConfig(): SiteConfig {
  const row = db.prepare("SELECT * FROM site_settings WHERE id = 1").get() as Record<string, unknown> | undefined;
  
  if (!row) {
    return {
      name: "علی دلاور",
      title: "پورتفولیو",
      description: "",
      url: "https://example.com",
      locale: "fa-IR",
      ogImage: "/images/og.jpg",
      keywords: []
    };
  }

  return {
    name: row.site_name as string || "",
    title: row.site_title as string || "",
    description: row.site_description as string || "",
    url: row.site_url as string || "",
    locale: row.locale as string || "fa-IR",
    ogImage: "/images/og.jpg",
    keywords: JSON.parse(row.keywords as string || "[]")
  };
}

// Socials
export function getSocials(): Social[] {
  const rows = db.prepare("SELECT * FROM socials ORDER BY sort_order").all() as Record<string, unknown>[];
  return rows.map(row => ({
    name: row.name as string,
    url: row.url as string || "",
    icon: row.icon as string || ""
  }));
}

// Skills
export function getSkills(): SkillsData {
  const rows = db.prepare("SELECT * FROM skill_categories ORDER BY sort_order").all() as Record<string, unknown>[];
  const categories: SkillCategory[] = rows.map(row => ({
    name: row.name as string,
    icon: row.icon as string || "",
    skills: JSON.parse(row.skills as string || "[]")
  }));
  return { categories };
}

// Experiences
export function getExperiences(): Experience[] {
  const rows = db.prepare("SELECT * FROM experiences ORDER BY sort_order").all() as Record<string, unknown>[];
  return rows.map(row => ({
    company: row.company as string,
    role: row.role as string,
    period: row.period as string || "",
    location: row.location as string || "",
    description: row.description as string || "",
    achievements: JSON.parse(row.achievements as string || "[]"),
    technologies: JSON.parse(row.technologies as string || "[]")
  }));
}

// Testimonials
export function getTestimonials(): Testimonial[] {
  const rows = db.prepare("SELECT * FROM testimonials ORDER BY sort_order").all() as Record<string, unknown>[];
  return rows.map(row => ({
    name: row.name as string,
    role: row.role as string || "",
    company: row.company as string || "",
    avatar: row.avatar as string || "",
    text: row.text as string || ""
  }));
}

// About
export function getAbout(): AboutData {
  const row = db.prepare("SELECT * FROM about_page WHERE id = 1").get() as Record<string, unknown> | undefined;
  
  if (!row) {
    return { title: "درباره من", subtitle: "", content: "" };
  }

  return {
    title: row.title as string || "درباره من",
    subtitle: row.subtitle as string || "",
    content: row.content as string || ""
  };
}

// Projects
export function getAllProjects(): Project[] {
  const rows = db.prepare("SELECT * FROM projects ORDER BY sort_order, created_at DESC").all() as Record<string, unknown>[];
  return rows.map(row => ({
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string || "",
    image: row.image as string || "",
    tags: JSON.parse(row.tags as string || "[]"),
    category: row.category as string || "",
    featured: Boolean(row.featured),
    liveUrl: row.live_url as string || "",
    githubUrl: row.github_url as string || "",
    date: row.created_at as string || "",
    content: row.content as string || ""
  }));
}

export function getProjectBySlug(slug: string): Project | undefined {
  const row = db.prepare("SELECT * FROM projects WHERE slug = ?").get(slug) as Record<string, unknown> | undefined;
  
  if (!row) return undefined;

  return {
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string || "",
    image: row.image as string || "",
    tags: JSON.parse(row.tags as string || "[]"),
    category: row.category as string || "",
    featured: Boolean(row.featured),
    liveUrl: row.live_url as string || "",
    githubUrl: row.github_url as string || "",
    date: row.created_at as string || "",
    content: row.content as string || ""
  };
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter(p => p.featured);
}

export function getProjectCategories(): string[] {
  const projects = getAllProjects();
  const categories = new Set(projects.map(p => p.category));
  return ["همه", ...Array.from(categories)];
}

export function getAllTags(): string[] {
  const projects = getAllProjects();
  const tags = new Set(projects.flatMap(p => p.tags));
  return Array.from(tags);
}
