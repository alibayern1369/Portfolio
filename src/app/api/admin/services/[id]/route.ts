import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { execute } from "@/lib/db-helpers";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const d = await request.json();
    await execute(
      `UPDATE services SET title=?, description=?, icon=?, sort_order=? WHERE id=?`,
      [d.title, d.description || "", d.icon || "sparkles", d.sort_order || 0, id]
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await execute("DELETE FROM services WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
