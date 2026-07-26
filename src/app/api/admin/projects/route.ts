import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { queryAll, execute } from "@/lib/db-helpers";

export async function GET() {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await queryAll("SELECT * FROM projects ORDER BY sort_order, created_at DESC");
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const d = await request.json();
    const result = await execute(
      `INSERT INTO projects (slug, title, description, content, image, tags, category, featured, live_url, github_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.slug, d.title, d.description, d.content, d.image, JSON.stringify(d.tags || []), d.category, d.featured ? 1 : 0, d.live_url, d.github_url, d.sort_order || 0]
    );
    return NextResponse.json({ success: true, id: Number(result.lastInsertRowid) });
  } catch { return NextResponse.json({ error: "خطا" }, { status: 500 }); }
}
