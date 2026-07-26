import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import db from "@/db";

export async function GET() {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const testimonials = db.prepare("SELECT * FROM testimonials ORDER BY sort_order").all();
  return NextResponse.json({ testimonials });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const result = db.prepare(`
      INSERT INTO testimonials (name, role, company, avatar, text, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(data.name, data.role, data.company, data.avatar, data.text, data.sort_order || 0);
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
