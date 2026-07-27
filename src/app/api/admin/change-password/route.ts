import { NextResponse } from "next/server";
import { getSession, requireAdmin, verifyPassword, hashPassword } from "@/lib/auth";
import { queryOne, execute } from "@/lib/db-helpers";

export async function POST(request: Request) {
  const user = await getSession();
  if (!requireAdmin(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "تمام فیلدها الزامی است" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "رمز عبور جدید باید حداقل ۶ کاراکتر باشد" }, { status: 400 });
    }

    // Verify current password
    const dbUser = await queryOne("SELECT password FROM users WHERE id = ?", [user!.id]);
    if (!dbUser) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const valid = await verifyPassword(currentPassword, dbUser.password as string);
    if (!valid) {
      return NextResponse.json({ error: "رمز عبور فعلی اشتباه است" }, { status: 400 });
    }

    const hashed = await hashPassword(newPassword);
    await execute("UPDATE users SET password = ? WHERE id = ?", [hashed, user!.id]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطا در تغییر رمز عبور" }, { status: 500 });
  }
}
