import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { queryOne, execute } from "@/lib/db-helpers";

export async function GET() {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await queryOne("SELECT * FROM site_settings WHERE id = 1");
  return NextResponse.json({
    settings: {
      ...settings,
      default_theme: settings?.default_theme || "system",
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
      home_skills_title: settings?.home_skills_title || "",
      home_skills_description: settings?.home_skills_description || "",
      home_testimonials_title: settings?.home_testimonials_title || "",
      home_testimonials_description: settings?.home_testimonials_description || "",
      home_cta_title: settings?.home_cta_title || "",
      home_cta_description: settings?.home_cta_description || "",
      footer_tagline: settings?.footer_tagline || "",
      footer_copyright: settings?.footer_copyright || "",
      content_font_size: settings?.content_font_size || "base",
      content_text_align: settings?.content_text_align || "right",
    },
  });
}

export async function PUT(request: Request) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const d = await request.json();
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

    try {
      const currentSettings = await queryOne("SELECT site_url FROM site_settings WHERE id = 1");
      siteUrl = currentSettings?.site_url ? String(currentSettings.site_url) : siteUrl;
    } catch {
      // Older versions may not have site_url column yet.
    }

    await execute(
      `INSERT OR REPLACE INTO site_settings (
        id, site_name, site_title, site_description, site_url, locale, keywords,
        default_theme, logo, logo_text, favicon, favicon_light, favicon_dark,
        home_hero_description, home_about_title, home_about_description,
        home_services_title, home_services_description,
        home_projects_title, home_projects_description,
        home_skills_title, home_skills_description,
        home_testimonials_title, home_testimonials_description,
        home_cta_title, home_cta_description,
        footer_tagline, footer_copyright,
        content_font_size, content_text_align, updated_at
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        d.site_name,
        d.site_title,
        d.site_description,
        siteUrl,
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
        d.home_skills_title || "",
        d.home_skills_description || "",
        d.home_testimonials_title || "",
        d.home_testimonials_description || "",
        d.home_cta_title || "",
        d.home_cta_description || "",
        d.footer_tagline || "",
        d.footer_copyright || "",
        d.content_font_size || "base",
        d.content_text_align || "right",
      ]
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
