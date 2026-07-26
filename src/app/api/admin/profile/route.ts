import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import db from "@/db";

export async function GET() {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    db.prepare(`
      INSERT OR REPLACE INTO profile (id, name, role, tagline, bio, short_bio, avatar, location, email, availability, resume_url, hero_headline, hero_description, updated_at)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      data.name,
      data.role,
      data.tagline,
      data.bio,
      data.short_bio,
      data.avatar,
      data.location,
      data.email,
      data.availability,
      data.resume_url,
      JSON.stringify(data.hero_headline || []),
      data.hero_description
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "خطا در به‌روزرسانی" }, { status: 500 });
  }
}
