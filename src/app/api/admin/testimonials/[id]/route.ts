import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import db from "@/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const data = await request.json();
    db.prepare(`UPDATE testimonials SET name=?, role=?, company=?, avatar=?, text=?, sort_order=? WHERE id=?`)
      .run(data.name, data.role, data.company, data.avatar, data.text, data.sort_order || 0, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    db.prepare("DELETE FROM testimonials WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
