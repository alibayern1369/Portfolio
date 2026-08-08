import { createClient } from "@libsql/client";
import type { Client } from "@libsql/client";
import path from "path";
import fs from "fs";

const globalForDb = globalThis as typeof globalThis & {
  __tursoClient?: Client;
  __dbInitialized?: boolean;
};

function createDbClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url) {
    return createClient({ url, authToken: authToken ?? undefined });
  }

  const dbPath = path.join(process.cwd(), "data", "portfolio.db");
  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  return createClient({ url: `file:${dbPath}` });
}

export const db: Client = globalForDb.__tursoClient ?? createDbClient();
globalForDb.__tursoClient = db;

const TABLES = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY DEFAULT 1,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    tagline TEXT, bio TEXT, short_bio TEXT, avatar TEXT,
    location TEXT, email TEXT, availability TEXT,
    resume_url TEXT, hero_headline TEXT, hero_description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_name TEXT, site_title TEXT, site_description TEXT,
    site_url TEXT, locale TEXT DEFAULT 'fa-IR', keywords TEXT,
    default_theme TEXT DEFAULT 'system',
    logo TEXT, logo_text TEXT DEFAULT 'ع.د',
    favicon TEXT, favicon_light TEXT, favicon_dark TEXT,
    home_hero_description TEXT,
    home_about_title TEXT,
    home_about_description TEXT,
    home_services_title TEXT,
    home_services_description TEXT,
    home_projects_title TEXT,
    home_projects_description TEXT,
    home_skills_title TEXT,
    home_skills_description TEXT,
    home_testimonials_title TEXT,
    home_testimonials_description TEXT,
    home_cta_title TEXT,
    home_cta_description TEXT,
    home_cta_button_text TEXT,
    footer_tagline TEXT,
    footer_copyright TEXT,
    content_font_size TEXT DEFAULT 'base',
    content_text_align TEXT DEFAULT 'right',
    home_projects_count INTEGER DEFAULT 6,
    google_site_verification TEXT,
    og_image TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
    description TEXT, content TEXT, image TEXT, tags TEXT,
    category TEXT, featured INTEGER DEFAULT 0,
    live_url TEXT, github_url TEXT, sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL, role TEXT NOT NULL,
    period TEXT, location TEXT, description TEXT,
    achievements TEXT, technologies TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'sparkles',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS skill_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, icon TEXT, skills TEXT,
    sort_order INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, role TEXT, company TEXT,
    avatar TEXT, text TEXT, sort_order INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS socials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, url TEXT, icon TEXT,
    sort_order INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS about_page (
    id INTEGER PRIMARY KEY DEFAULT 1,
    title TEXT, subtitle TEXT, content TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL, original_name TEXT,
    mime_type TEXT, size INTEGER, path TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
];

const SETTINGS_MIGRATIONS = [
  "ALTER TABLE site_settings ADD COLUMN site_url TEXT",
  "ALTER TABLE site_settings ADD COLUMN default_theme TEXT DEFAULT 'system'",
  "ALTER TABLE site_settings ADD COLUMN logo TEXT",
  "ALTER TABLE site_settings ADD COLUMN logo_text TEXT DEFAULT 'ع.د'",
  "ALTER TABLE site_settings ADD COLUMN favicon TEXT",
  "ALTER TABLE site_settings ADD COLUMN favicon_light TEXT",
  "ALTER TABLE site_settings ADD COLUMN favicon_dark TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_hero_description TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_about_title TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_about_description TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_services_title TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_services_description TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_projects_title TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_projects_description TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_skills_title TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_skills_description TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_testimonials_title TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_testimonials_description TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_cta_title TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_cta_description TEXT",
  "ALTER TABLE site_settings ADD COLUMN home_cta_button_text TEXT",
  "ALTER TABLE site_settings ADD COLUMN footer_tagline TEXT",
  "ALTER TABLE site_settings ADD COLUMN footer_copyright TEXT",
  "ALTER TABLE site_settings ADD COLUMN content_font_size TEXT DEFAULT 'base'",
  "ALTER TABLE site_settings ADD COLUMN content_text_align TEXT DEFAULT 'right'",
  "ALTER TABLE site_settings ADD COLUMN home_projects_count INTEGER DEFAULT 6",
  "ALTER TABLE site_settings ADD COLUMN google_site_verification TEXT",
  "ALTER TABLE site_settings ADD COLUMN og_image TEXT",
];

export async function initDatabase() {
  try {
    if (!globalForDb.__dbInitialized) {
      for (const sql of TABLES) {
        await db.execute(sql);
      }
      globalForDb.__dbInitialized = true;
    }

    // Ensure newer tables/columns exist even after earlier init in the same process
    try {
      await db.execute(`CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        icon TEXT DEFAULT 'sparkles',
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
    } catch {
      // ignore
    }

    for (const sql of SETTINGS_MIGRATIONS) {
      try {
        await db.execute(sql);
      } catch {
        // Column already exists or table does not exist yet.
      }
    }
  } catch (e) {
    console.error("DB init error:", e);
  }
}

export default db;
