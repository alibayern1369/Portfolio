import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { queryAll, execute } from "@/lib/db-helpers";

export async function GET() {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ experiences: await queryAll("SELECT * FROM experiences ORDER BY sort_order") });
}

export async function POST(request: Request) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const d = await request.json();
    const r = await execute(
      `INSERT INTO experiences (company, role, period, location, description, achievements, technologies, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.company, d.role, d.period, d.location, d.description, JSON.stringify(d.achievements || []), JSON.stringify(d.technologies || []), d.sort_order || 0]
    );
    return NextResponse.json({ success: true, id: Number(r.lastInsertRowid) });
  } catch { return NextResponse.json({ error: "خطا" }, { status: 500 }); }
}
