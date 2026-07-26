import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { execute } from "@/lib/db-helpers";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const d = await request.json();
  await execute(`UPDATE testimonials SET name=?, role=?, company=?, avatar=?, text=?, sort_order=? WHERE id=?`, [d.name, d.role, d.company, d.avatar, d.text, d.sort_order || 0, id]);
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await execute("DELETE FROM testimonials WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
