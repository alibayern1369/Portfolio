import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { queryOne, execute } from "@/lib/db-helpers";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const project = await queryOne("SELECT * FROM projects WHERE id = ?", [id]);
  if (!project) return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const d = await request.json();
    await execute(
      `UPDATE projects SET slug=?, title=?, description=?, content=?, image=?, tags=?, category=?, featured=?, live_url=?, github_url=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [d.slug, d.title, d.description, d.content, d.image, JSON.stringify(d.tags || []), d.category, d.featured ? 1 : 0, d.live_url, d.github_url, d.sort_order || 0, id]
    );
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "خطا" }, { status: 500 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await execute("DELETE FROM projects WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
