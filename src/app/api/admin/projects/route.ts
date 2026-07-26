import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import db from "@/db";

export async function GET() {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = db.prepare("SELECT * FROM projects ORDER BY sort_order, created_at DESC").all();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const result = db.prepare(`
      INSERT INTO projects (slug, title, description, content, image, tags, category, featured, live_url, github_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.slug,
      data.title,
      data.description,
      data.content,
      data.image,
      JSON.stringify(data.tags || []),
      data.category,
      data.featured ? 1 : 0,
      data.live_url,
      data.github_url,
      data.sort_order || 0
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "خطا در ایجاد پروژه" }, { status: 500 });
  }
}
