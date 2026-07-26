import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { queryAll, execute } from "@/lib/db-helpers";

export async function GET() {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ testimonials: await queryAll("SELECT * FROM testimonials ORDER BY sort_order") });
}

export async function POST(request: Request) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const d = await request.json();
    const r = await execute(`INSERT INTO testimonials (name, role, company, avatar, text, sort_order) VALUES (?, ?, ?, ?, ?, ?)`, [d.name, d.role, d.company, d.avatar, d.text, d.sort_order || 0]);
    return NextResponse.json({ success: true, id: Number(r.lastInsertRowid) });
  } catch { return NextResponse.json({ error: "خطا" }, { status: 500 }); }
}
