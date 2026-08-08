import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { queryOne, execute } from "@/lib/db-helpers";
import { initDatabase } from "@/db";

export async function GET() {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await initDatabase();
  const settings = (await queryOne("SELECT * FROM site_settings WHERE id = 1")) ?? {};
  return NextResponse.json({
    settings: {
      ...(settings as Record<string, unknown>),
      default_theme: settings.default_theme || "system",
      logo: settings?.logo || "",
      logo_text: settings?.logo_text || "ع.د",
      favicon: settings?.favicon || "",
      favicon_light: settings?.favicon_light || "",
      favicon_dark: settings?.favicon_dark || "",
      home_hero_description: settings?.home_hero_description || "",
      home_about_title: settings?.home_about_title || "",
      home_about_description: settings?.home_about_description || "",
      home_services_title: settings?.home_services_title || "",
      home_services_description: settings?.home_services_description || "",
      home_projects_title: settings?.home_projects_title || "",
      home_projects_description: settings?.home_projects_description || "",
      home_projects_count: Number(settings?.home_projects_count ?? 6) || 6,
      home_skills_title: settings?.home_skills_title || "",
      home_skills_description: settings?.home_skills_description || "",
      home_testimonials_title: settings?.home_testimonials_title || "",
      home_testimonials_description: settings?.home_testimonials_description || "",
      home_cta_title: settings?.home_cta_title || "",
      home_cta_description: settings?.home_cta_description || "",
      home_cta_button_text: settings?.home_cta_button_text || "تماس بگیرید",
      footer_tagline: settings?.footer_tagline || "",
      footer_copyright: settings?.footer_copyright || "",
      content_font_size: settings?.content_font_size || "base",
      content_text_align: settings?.content_text_align || "right",
      site_url: settings?.site_url || "",
      google_site_verification: settings?.google_site_verification || "",
      og_image: settings?.og_image || "",
      recaptcha_site_key: settings?.recaptcha_site_key || "",
      recaptcha_secret_key: settings?.recaptcha_secret_key || "",
    },
  });
}

export async function PUT(request: Request) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await initDatabase();
    const d = await request.json();
    const projectsCount = Math.max(1, Math.min(24, Number(d.home_projects_count ?? 6) || 6));

    await execute("INSERT OR IGNORE INTO site_settings (id) VALUES (1)");
    await execute(
      `UPDATE site_settings SET
        site_name = ?,
        site_title = ?,
        site_description = ?,
        site_url = ?,
        locale = ?,
        keywords = ?,
        default_theme = ?,
        logo = ?,
        logo_text = ?,
        favicon = ?,
        favicon_light = ?,
        favicon_dark = ?,
        home_hero_description = ?,
        home_about_title = ?,
        home_about_description = ?,
        home_services_title = ?,
        home_services_description = ?,
        home_projects_title = ?,
        home_projects_description = ?,
        home_projects_count = ?,
        home_skills_title = ?,
        home_skills_description = ?,
        home_testimonials_title = ?,
        home_testimonials_description = ?,
        home_cta_title = ?,
        home_cta_description = ?,
        home_cta_button_text = ?,
        footer_tagline = ?,
        footer_copyright = ?,
        content_font_size = ?,
        content_text_align = ?,
        google_site_verification = ?,
        og_image = ?,
        recaptcha_site_key = ?,
        recaptcha_secret_key = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1`,
      [
        d.site_name,
        d.site_title,
        d.site_description,
        d.site_url || "",
        d.locale,
        JSON.stringify(d.keywords || []),
        d.default_theme || "system",
        d.logo || "",
        d.logo_text || "ع.د",
        d.favicon || "",
        d.favicon_light || "",
        d.favicon_dark || "",
        d.home_hero_description || "",
        d.home_about_title || "",
        d.home_about_description || "",
        d.home_services_title || "",
        d.home_services_description || "",
        d.home_projects_title || "",
        d.home_projects_description || "",
        projectsCount,
        d.home_skills_title || "",
        d.home_skills_description || "",
        d.home_testimonials_title || "",
        d.home_testimonials_description || "",
        d.home_cta_title || "",
        d.home_cta_description || "",
        d.home_cta_button_text || "تماس بگیرید",
        d.footer_tagline || "",
        d.footer_copyright || "",
        d.content_font_size || "base",
        d.content_text_align || "right",
        d.google_site_verification || "",
        d.og_image || "",
        typeof d.recaptcha_site_key === "string" ? d.recaptcha_site_key.trim() : "",
        typeof d.recaptcha_secret_key === "string" ? d.recaptcha_secret_key.trim() : "",
      ]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin settings save error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطا در ذخیره‌سازی تنظیمات" },
      { status: 500 }
    );
  }
}
