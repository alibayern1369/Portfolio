import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import db from "@/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    
    db.prepare(`
      UPDATE experiences SET
        company = ?, role = ?, period = ?, location = ?, description = ?,
        achievements = ?, technologies = ?, sort_order = ?
      WHERE id = ?
    `).run(
      data.company,
      data.role,
      data.period,
      data.location,
      data.description,
      JSON.stringify(data.achievements || []),
      JSON.stringify(data.technologies || []),
      data.sort_order || 0,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json({ error: "خطا در به‌روزرسانی" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    db.prepare("DELETE FROM experiences WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}
