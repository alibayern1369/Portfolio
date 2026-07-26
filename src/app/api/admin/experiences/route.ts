import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import db from "@/db";

export async function GET() {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const experiences = db.prepare("SELECT * FROM experiences ORDER BY sort_order").all();
  return NextResponse.json({ experiences });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const result = db.prepare(`
      INSERT INTO experiences (company, role, period, location, description, achievements, technologies, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.company,
      data.role,
      data.period,
      data.location,
      data.description,
      JSON.stringify(data.achievements || []),
      JSON.stringify(data.technologies || []),
      data.sort_order || 0
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json({ error: "خطا در ایجاد" }, { status: 500 });
  }
}
