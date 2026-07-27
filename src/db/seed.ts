import db from "./index";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  // Check if already seeded
  const existing = await db.execute({ sql: "SELECT id FROM users WHERE username = ?", args: ["admin"] });
  if (existing.rows.length > 0) {
    return;
  }

  console.log("Seeding database...");

  // Create admin user (ignore if exists - race condition safe)
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.execute({ sql: "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)", args: ["admin", hashedPassword, "admin"] });

  // Seed profile
  await db.execute({
    sql: `INSERT OR IGNORE INTO profile (id, name, role, tagline, bio, short_bio, avatar, location, email, availability, resume_url, hero_headline, hero_description)
          VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      "علی دلاور",
      "توسعه‌دهنده فول‌استک و طراح رابط کاربری",
      "ساختن آینده وب، پیکسل به پیکسل.",
      "من یک توسعه‌دهنده فول‌استک با بیش از ۶ سال تجربه در ساخت اپلیکیشن‌های وب زیبا و با عملکرد بالا هستم. تخصص من در React، Next.js و TypeScript است و نگاه تیزبینی به طراحی و تجربه کاربری دارم.",
      "خلق تجربه‌های دیجیتال در تلاقی طراحی و مهندسی.",
      "/images/profile.jpg",
      "تهران، ایران",
      "hello@alidelavar.dev",
      "آماده همکاری",
      "/resume.pdf",
      JSON.stringify(["من طراحی و توسعه", "تجربه‌های دیجیتال", "الهام‌بخش می‌دهم."]),
      "توسعه‌دهنده فول‌استک متخصص در ساخت اپلیکیشن‌های وب زیبا و با عملکرد بالا با فناوری‌های مدرن. در حال حاضر روی ساخت محصولاتی تمرکز دارم که تفاوت ایجاد می‌کنند."
    ]
  });

  // Seed site settings
  await db.execute({
    sql: `INSERT OR IGNORE INTO site_settings (id, site_name, site_title, site_description, site_url, locale, keywords, default_theme) VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      "علی دلاور",
      "توسعه‌دهنده فول‌استک و طراح رابط کاربری",
      "من تجربه‌های دیجیتال زیبا و با عملکرد بالا خلق می‌کنم؛ در نقطه تلاقی طراحی و مهندسی.",
      "https://alidelavar.dev",
      "fa-IR",
      JSON.stringify(["توسعه‌دهنده فول‌استک", "توسعه‌دهنده وب", "طراح رابط کاربری"]),
      "system"
    ]
  });

  // Seed about page
  await db.execute({
    sql: `INSERT OR IGNORE INTO about_page (id, title, subtitle, content) VALUES (1, ?, ?, ?)`,
    args: [
      "درباره من",
      "داستان پشت کدها",
      `## مسیر من

من علی دلاور هستم، توسعه‌دهنده فول‌استک و طراح رابط کاربری مستقر در تهران.

## کار من

من در ساخت اپلیکیشن‌های وب مدرن با React، Next.js و TypeScript تخصص دارم.

## تحصیلات

**کارشناسی مهندسی کامپیوتر** — دانشگاه تهران — ۱۳۹۶

## گواهینامه‌ها

- AWS Certified Solutions Architect
- Google Cloud Professional Developer`
    ]
  });

  // Seed projects
  const projects = [
    ["aurora-dashboard", "داشبورد آرورا", "یک داشبورد تحلیلی جامع با نمایش داده بلادرنگ برای کسب‌وکارهای SaaS.", "## نمای کلی\n\nداشبورد آرورا یک پلتفرم تحلیلی جامع است.", "/images/projects/project-1.jpg", JSON.stringify(["React", "TypeScript", "D3.js", "Node.js"]), "اپلیکیشن وب", 1, "https://aurora-dashboard.demo.com", "https://github.com/alidelavar/aurora-dashboard", 1],
    ["shopwave", "شاپ‌ویو", "یک پلتفرم فروشگاهی مدرن با پیشنهادات محصول مبتنی بر هوش مصنوعی.", "## نمای کلی\n\nشاپ‌ویو یک پلتفرم فروشگاهی نسل بعدی است.", "/images/projects/project-2.jpg", JSON.stringify(["Next.js", "Stripe", "Tailwind CSS"]), "فروشگاهی", 1, "https://shopwave.demo.com", "https://github.com/alidelavar/shopwave", 2],
    ["synthia-ai", "سینتیا هوش مصنوعی", "یک دستیار هوش مصنوعی مکالمه‌ای هوشمند.", "## نمای کلی\n\nسینتیا یک دستیار هوش مصنوعی پیشرفته است.", "/images/projects/project-3.jpg", JSON.stringify(["Python", "OpenAI", "React"]), "هوش مصنوعی", 1, "https://synthia-ai.demo.com", "https://github.com/alidelavar/synthia-ai", 3],
  ];

  for (const p of projects) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO projects (slug, title, description, content, image, tags, category, featured, live_url, github_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: p,
    });
  }

  // Seed experiences
  const experiences = [
    ["اسنپ", "مهندس ارشد فرانت‌اند", "۱۴۰۲ - اکنون", "تهران، ایران", "رهبری معماری فرانت‌اند تیم داشبورد", JSON.stringify(["بازطراحی داشبورد استقرار", "معماری سیستم طراحی جدید"]), JSON.stringify(["Next.js", "React", "TypeScript"]), 1],
    ["دیجی‌کالا", "توسعه‌دهنده فول‌استک", "۱۴۰۰ - ۱۴۰۲", "تهران، ایران", "ساخت و نگهداری زیرساخت‌های پرداخت", JSON.stringify(["توسعه کامپوننت‌های پرداخت", "ابزار داخلی آنبوردینگ"]), JSON.stringify(["React", "Node.js", "PostgreSQL"]), 2],
  ];

  for (const e of experiences) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO experiences (company, role, period, location, description, achievements, technologies, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: e,
    });
  }

  // Seed skills
  const skills = [
    ["فرانت‌اند", "monitor", JSON.stringify(["React", "Next.js", "TypeScript", "Tailwind CSS"]), 1],
    ["بک‌اند", "server", JSON.stringify(["Node.js", "Python", "PostgreSQL", "MongoDB"]), 2],
    ["طراحی", "palette", JSON.stringify(["Figma", "Adobe XD", "UI/UX"]), 3],
    ["دوآپس", "cloud", JSON.stringify(["Docker", "AWS", "Vercel"]), 4],
  ];

  for (const s of skills) {
    await db.execute({ sql: `INSERT OR IGNORE INTO skill_categories (name, icon, skills, sort_order) VALUES (?, ?, ?, ?)`, args: s });
  }

  // Seed testimonials
  const testimonials = [
    ["سارا احمدی", "مدیر فنی", "فناوران آینده", "سا", "علی یکی از با استعدادترین توسعه‌دهندگانی است که تا به حال با او کار کرده‌ام.", 1],
    ["محمد رضایی", "مدیر محصول", "استارتاپ نوآوری", "مر", "همکاری با علی یک تجربه فوق‌العاده بود.", 2],
  ];

  for (const t of testimonials) {
    await db.execute({ sql: `INSERT OR IGNORE INTO testimonials (name, role, company, avatar, text, sort_order) VALUES (?, ?, ?, ?, ?, ?)`, args: t });
  }

  // Seed socials
  const socials = [
    ["گیت‌هاب", "https://github.com/alidelavar", "github", 1],
    ["لینکدین", "https://linkedin.com/in/alidelavar", "linkedin", 2],
    ["توییتر", "https://twitter.com/alidelavar", "twitter", 3],
  ];

  for (const s of socials) {
    await db.execute({ sql: `INSERT OR IGNORE INTO socials (name, url, icon, sort_order) VALUES (?, ?, ?, ?)`, args: s });
  }

  console.log("Database seeded successfully!");
}
