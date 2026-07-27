import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { execute } from "@/lib/db-helpers";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!requireAdmin(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Prevent deleting yourself
  if (user && Number(id) === user.id) {
    return NextResponse.json({ error: "نمی‌توانید خودتان را حذف کنید" }, { status: 400 });
  }

  await execute("DELETE FROM users WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
