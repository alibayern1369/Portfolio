import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { queryAll, execute } from "@/lib/db-helpers";
import { initDatabase } from "@/db";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await initDatabase();
  await seedDatabase();
  return NextResponse.json({ services: await queryAll("SELECT * FROM services ORDER BY sort_order, id") });
}

export async function POST(request: Request) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await initDatabase();
    const d = await request.json();
    const r = await execute(
      `INSERT INTO services (title, description, icon, sort_order) VALUES (?, ?, ?, ?)`,
      [d.title, d.description || "", d.icon || "sparkles", d.sort_order || 0]
    );
    return NextResponse.json({ success: true, id: Number(r.lastInsertRowid) });
  } catch {
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
