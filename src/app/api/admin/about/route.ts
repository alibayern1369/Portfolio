import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { queryOne, execute } from "@/lib/db-helpers";

export async function GET() {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const about = await queryOne("SELECT * FROM about_page WHERE id = 1");
  return NextResponse.json({ about });
}

export async function PUT(request: Request) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const d = await request.json();
    await execute(`INSERT OR REPLACE INTO about_page (id, title, subtitle, content, updated_at) VALUES (1, ?, ?, ?, CURRENT_TIMESTAMP)`, [d.title, d.subtitle, d.content]);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "خطا" }, { status: 500 }); }
}
