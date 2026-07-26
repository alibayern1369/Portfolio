import { NextResponse } from "next/server";
import { initDatabase } from "@/db";
import { seedDatabase } from "@/db/seed";

export async function POST() {
  try {
    await initDatabase();
    await seedDatabase();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
