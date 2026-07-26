import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  SiteConfig,
  Profile,
  Social,
  SkillsData,
  Experience,
  Testimonial,
  Project,
  AboutData,
} from "@/types";

const contentDir = path.join(process.cwd(), "content");

function readJson<T>(filename: string): T {
  const filePath = path.join(contentDir, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getSiteConfig(): SiteConfig {
  return readJson<SiteConfig>("site.json");
}

export function getProfile(): Profile {
  return readJson<Profile>("profile.json");
}

export function getSocials(): Social[] {
  return readJson<Social[]>("socials.json");
}

export function getSkills(): SkillsData {
  return readJson<SkillsData>("skills.json");
}

export function getExperiences(): Experience[] {
  return readJson<Experience[]>("experience.json");
}

export function getTestimonials(): Testimonial[] {
  return readJson<Testimonial[]>("testimonials.json");
}

export function getAbout(): AboutData {
  const filePath = path.join(contentDir, "about.md");
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    title: data.title as string,
    subtitle: data.subtitle as string,
    content,
  };
}

export function getAllProjects(): Project[] {
  const projectsDir = path.join(contentDir, "projects");
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".md"));

  const projects = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(projectsDir, file), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title as string,
      description: data.description as string,
      image: data.image as string,
      tags: data.tags as string[],
      category: data.category as string,
      featured: data.featured as boolean,
      liveUrl: data.liveUrl as string,
      githubUrl: data.githubUrl as string,
      date: data.date as string,
      content,
    };
  });

  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getProjectBySlug(slug: string): Project | undefined {
  const projects = getAllProjects();
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectCategories(): string[] {
  const projects = getAllProjects();
  const categories = new Set(projects.map((p) => p.category));
  return ["همه", ...Array.from(categories)];
}

export function getAllTags(): string[] {
  const projects = getAllProjects();
  const tags = new Set(projects.flatMap((p) => p.tags));
  return Array.from(tags);
}
