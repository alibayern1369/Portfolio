import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import db from "@/db";

export async function GET() {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = db.prepare("SELECT * FROM site_settings WHERE id = 1").get();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    db.prepare(`
      INSERT OR REPLACE INTO site_settings (id, site_name, site_title, site_description, site_url, locale, keywords, updated_at)
      VALUES (1, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(data.site_name, data.site_title, data.site_description, data.site_url, data.locale, JSON.stringify(data.keywords || []));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
