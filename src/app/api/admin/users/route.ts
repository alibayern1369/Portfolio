import { NextResponse } from "next/server";
import { getSession, requireAdmin, hashPassword } from "@/lib/auth";
import { queryAll, execute } from "@/lib/db-helpers";

export async function GET() {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const users = await queryAll("SELECT id, username, role, created_at FROM users ORDER BY id");
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  if (!requireAdmin(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { username, password, role } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: "نام کاربری و رمز عبور الزامی است" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "رمز عبور باید حداقل ۶ کاراکتر باشد" }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    await execute(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashed, role || "admin"]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = String(error);
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "این نام کاربری قبلاً استفاده شده" }, { status: 400 });
    }
    return NextResponse.json({ error: "خطا در ایجاد کاربر" }, { status: 500 });
  }
}
