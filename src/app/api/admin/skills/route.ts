import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { queryAll, execute } from "@/lib/db-helpers";

export async function GET() {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ skills: await queryAll("SELECT * FROM skill_categories ORDER BY sort_order") });
}

export async function POST(request: Request) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const d = await request.json();
    const r = await execute(`INSERT INTO skill_categories (name, icon, skills, sort_order) VALUES (?, ?, ?, ?)`, [d.name, d.icon, JSON.stringify(d.skills || []), d.sort_order || 0]);
    return NextResponse.json({ success: true, id: Number(r.lastInsertRowid) });
  } catch { return NextResponse.json({ error: "خطا" }, { status: 500 }); }
}
