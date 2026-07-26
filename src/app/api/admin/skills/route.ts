import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import db from "@/db";

export async function GET() {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skills = db.prepare("SELECT * FROM skill_categories ORDER BY sort_order").all();
  return NextResponse.json({ skills });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const result = db.prepare(`
      INSERT INTO skill_categories (name, icon, skills, sort_order)
      VALUES (?, ?, ?, ?)
    `).run(
      data.name,
      data.icon,
      JSON.stringify(data.skills || []),
      data.sort_order || 0
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
