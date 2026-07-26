import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { queryOne, execute } from "@/lib/db-helpers";

export async function GET() {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await queryOne("SELECT * FROM profile WHERE id = 1");
  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const d = await request.json();
    await execute(
      `INSERT OR REPLACE INTO profile (id, name, role, tagline, bio, short_bio, avatar, location, email, availability, resume_url, hero_headline, hero_description, updated_at)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [d.name, d.role, d.tagline, d.bio, d.short_bio, d.avatar, d.location, d.email, d.availability, d.resume_url, JSON.stringify(d.hero_headline || []), d.hero_description]
    );
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "خطا" }, { status: 500 }); }
}
