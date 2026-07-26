import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import db from "@/db";

export async function GET() {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const about = db.prepare("SELECT * FROM about_page WHERE id = 1").get();
  return NextResponse.json({ about });
}

export async function PUT(request: Request) {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    db.prepare(`
      INSERT OR REPLACE INTO about_page (id, title, subtitle, content, updated_at)
      VALUES (1, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(data.title, data.subtitle, data.content);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
