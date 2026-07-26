import db from "./index";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  // Check if already seeded
  const existingAdmin = db.prepare("SELECT id FROM users WHERE username = ?").get("admin");
  if (existingAdmin) {
    console.log("Database already seeded");
    return;
  }

  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run(
    "admin",
    hashedPassword,
    "admin"
  );

  // Seed profile
  db.prepare(`
    INSERT INTO profile (id, name, role, tagline, bio, short_bio, avatar, location, email, availability, resume_url, hero_headline, hero_description)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
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
  );

  // Seed site settings
  db.prepare(`
    INSERT INTO site_settings (id, site_name, site_title, site_description, site_url, locale, keywords)
    VALUES (1, ?, ?, ?, ?, ?, ?)
  `).run(
    "علی دلاور",
    "توسعه‌دهنده فول‌استک و طراح رابط کاربری",
    "من تجربه‌های دیجیتال زیبا و با عملکرد بالا خلق می‌کنم؛ در نقطه تلاقی طراحی و مهندسی.",
    "https://alidelavar.dev",
    "fa-IR",
    JSON.stringify(["توسعه‌دهنده فول‌استک", "توسعه‌دهنده وب", "طراح رابط کاربری"])
  );

  // Seed about page
  db.prepare(`
    INSERT INTO about_page (id, title, subtitle, content)
    VALUES (1, ?, ?, ?)
  `).run(
    "درباره من",
    "داستان پشت کدها",
    `## مسیر من

من علی دلاور هستم، توسعه‌دهنده فول‌استک و طراح رابط کاربری مستقر در تهران. با بیش از ۶ سال تجربه در توسعه وب، افتخار همکاری با برخی از نوآورترین شرکت‌های فناوری را داشته‌ام.

## کار من

من در ساخت اپلیکیشن‌های وب مدرن با استفاده از React، Next.js و TypeScript تخصص دارم.

## تحصیلات

**کارشناسی مهندسی کامپیوتر**
دانشگاه تهران — ۱۳۹۶

## گواهینامه‌ها

- AWS Certified Solutions Architect
- Google Cloud Professional Developer`
  );

  // Seed projects
  const projects = [
    {
      slug: "aurora-dashboard",
      title: "داشبورد آرورا",
      description: "یک داشبورد تحلیلی جامع با نمایش داده بلادرنگ، ویجت‌های سفارشی و بینش‌های هوشمند برای کسب‌وکارهای SaaS.",
      content: "## نمای کلی\n\nداشبورد آرورا یک پلتفرم تحلیلی جامع است که برای کسب‌وکارهای SaaS طراحی شده.",
      image: "/images/projects/project-1.jpg",
      tags: JSON.stringify(["React", "TypeScript", "D3.js", "Node.js", "PostgreSQL"]),
      category: "اپلیکیشن وب",
      featured: 1,
      live_url: "https://aurora-dashboard.demo.com",
      github_url: "https://github.com/alidelavar/aurora-dashboard",
      sort_order: 1
    },
    {
      slug: "shopwave",
      title: "شاپ‌ویو",
      description: "یک پلتفرم فروشگاهی مدرن با پیشنهادات محصول مبتنی بر هوش مصنوعی.",
      content: "## نمای کلی\n\nشاپ‌ویو یک پلتفرم فروشگاهی نسل بعدی است.",
      image: "/images/projects/project-2.jpg",
      tags: JSON.stringify(["Next.js", "Stripe", "Tailwind CSS", "Prisma"]),
      category: "فروشگاهی",
      featured: 1,
      live_url: "https://shopwave.demo.com",
      github_url: "https://github.com/alidelavar/shopwave",
      sort_order: 2
    },
    {
      slug: "synthia-ai",
      title: "سینتیا هوش مصنوعی",
      description: "یک دستیار هوش مصنوعی مکالمه‌ای هوشمند با پردازش زبان طبیعی.",
      content: "## نمای کلی\n\nسینتیا یک دستیار هوش مصنوعی مکالمه‌ای پیشرفته است.",
      image: "/images/projects/project-3.jpg",
      tags: JSON.stringify(["Python", "OpenAI", "React", "FastAPI"]),
      category: "هوش مصنوعی",
      featured: 1,
      live_url: "https://synthia-ai.demo.com",
      github_url: "https://github.com/alidelavar/synthia-ai",
      sort_order: 3
    }
  ];

  const insertProject = db.prepare(`
    INSERT INTO projects (slug, title, description, content, image, tags, category, featured, live_url, github_url, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of projects) {
    insertProject.run(p.slug, p.title, p.description, p.content, p.image, p.tags, p.category, p.featured, p.live_url, p.github_url, p.sort_order);
  }

  // Seed experiences
  const experiences = [
    {
      company: "اسنپ",
      role: "مهندس ارشد فرانت‌اند",
      period: "۱۴۰۲ - اکنون",
      location: "تهران، ایران",
      description: "رهبری معماری فرانت‌اند تیم داشبورد",
      achievements: JSON.stringify([
        "رهبری بازطراحی داشبورد استقرار که تعامل کاربران را ۴۰٪ افزایش داد",
        "معماری سیستم طراحی جدید که در ۱۲ محصول داخلی استفاده می‌شود"
      ]),
      technologies: JSON.stringify(["Next.js", "React", "TypeScript", "Tailwind CSS"]),
      sort_order: 1
    },
    {
      company: "دیجی‌کالا",
      role: "توسعه‌دهنده فول‌استک",
      period: "۱۴۰۰ - ۱۴۰۲",
      location: "تهران، ایران",
      description: "ساخت و نگهداری زیرساخت‌های پرداخت",
      achievements: JSON.stringify([
        "توسعه کامپوننت‌های جدید جریان پرداخت",
        "ساخت ابزار داخلی که زمان آنبوردینگ را ۶۰٪ کاهش داد"
      ]),
      technologies: JSON.stringify(["React", "Node.js", "PostgreSQL", "GraphQL"]),
      sort_order: 2
    }
  ];

  const insertExp = db.prepare(`
    INSERT INTO experiences (company, role, period, location, description, achievements, technologies, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const e of experiences) {
    insertExp.run(e.company, e.role, e.period, e.location, e.description, e.achievements, e.technologies, e.sort_order);
  }

  // Seed skills
  const skills = [
    { name: "فرانت‌اند", icon: "monitor", skills: JSON.stringify(["React", "Next.js", "TypeScript", "Tailwind CSS"]), sort_order: 1 },
    { name: "بک‌اند", icon: "server", skills: JSON.stringify(["Node.js", "Python", "PostgreSQL", "MongoDB"]), sort_order: 2 },
    { name: "طراحی", icon: "palette", skills: JSON.stringify(["Figma", "Adobe XD", "UI/UX"]), sort_order: 3 },
    { name: "دوآپس", icon: "cloud", skills: JSON.stringify(["Docker", "AWS", "Vercel", "CI/CD"]), sort_order: 4 }
  ];

  const insertSkill = db.prepare(`
    INSERT INTO skill_categories (name, icon, skills, sort_order) VALUES (?, ?, ?, ?)
  `);

  for (const s of skills) {
    insertSkill.run(s.name, s.icon, s.skills, s.sort_order);
  }

  // Seed testimonials
  const testimonials = [
    {
      name: "سارا احمدی",
      role: "مدیر فنی",
      company: "فناوران آینده",
      avatar: "سا",
      text: "علی یکی از با استعدادترین توسعه‌دهندگانی است که تا به حال با او کار کرده‌ام.",
      sort_order: 1
    },
    {
      name: "محمد رضایی",
      role: "مدیر محصول",
      company: "استارتاپ نوآوری",
      avatar: "مر",
      text: "همکاری با علی یک تجربه فوق‌العاده بود.",
      sort_order: 2
    }
  ];

  const insertTestimonial = db.prepare(`
    INSERT INTO testimonials (name, role, company, avatar, text, sort_order) VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const t of testimonials) {
    insertTestimonial.run(t.name, t.role, t.company, t.avatar, t.text, t.sort_order);
  }

  // Seed socials
  const socials = [
    { name: "گیت‌هاب", url: "https://github.com/alidelavar", icon: "github", sort_order: 1 },
    { name: "لینکدین", url: "https://linkedin.com/in/alidelavar", icon: "linkedin", sort_order: 2 },
    { name: "توییتر", url: "https://twitter.com/alidelavar", icon: "twitter", sort_order: 3 }
  ];

  const insertSocial = db.prepare(`
    INSERT INTO socials (name, url, icon, sort_order) VALUES (?, ?, ?, ?)
  `);

  for (const s of socials) {
    insertSocial.run(s.name, s.url, s.icon, s.sort_order);
  }

  console.log("Database seeded successfully!");
}
