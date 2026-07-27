export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  locale: string;
  ogImage: string;
  keywords: string[];
  defaultTheme: "light" | "dark" | "system";
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  shortBio: string;
  avatar: string;
  location: string;
  email: string;
  availability: string;
  resumeUrl: string;
  heroHeadline: string[];
  heroDescription: string;
}

export interface Social {
  name: string;
  url: string;
  icon: string;
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: string[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  featured: boolean;
  liveUrl: string;
  githubUrl: string;
  date: string;
  content: string;
}

export interface AboutData {
  title: string;
  subtitle: string;
  content: string;
}
