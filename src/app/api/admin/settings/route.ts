import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { queryOne, execute } from "@/lib/db-helpers";

export async function GET() {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await queryOne("SELECT * FROM site_settings WHERE id = 1");
  return NextResponse.json({ settings: { ...settings, default_theme: settings?.default_theme || "system" } });
}

export async function PUT(request: Request) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const d = await request.json();
    await execute(
      `INSERT OR REPLACE INTO site_settings (id, site_name, site_title, site_description, site_url, locale, keywords, default_theme, updated_at) VALUES (1, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [d.site_name, d.site_title, d.site_description, d.site_url, d.locale, JSON.stringify(d.keywords || []), d.default_theme || "system"]
    );
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "خطا" }, { status: 500 }); }
}
