import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { execute } from "@/lib/db-helpers";
import { initDatabase } from "@/db";

export async function POST(request: Request) {
  const user = await getSession();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const fileValue = formData.get("file");
    const file = fileValue instanceof File ? fileValue : null;
    const folderValue = formData.get("folder");
    const folder = typeof folderValue === "string" && folderValue.trim() ? folderValue.trim() : "uploads";

    if (!file) {
      return NextResponse.json({ error: "فایلی انتخاب نشده یا فرمت نامعتبر است" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "فرمت فایل مجاز نیست (JPG, PNG, WebP, GIF)" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "حداکثر حجم فایل ۵ مگابایت است" }, { status: 400 });
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const safeName = `${folder}-${timestamp}.${ext}`;

    // Ensure media table exists
    await initDatabase();

    // Store in database
    const result = await execute(
      `INSERT INTO media (filename, original_name, mime_type, size, path) VALUES (?, ?, ?, ?, ?)`,
      [safeName, file.name, file.type, file.size, base64]
    );

    const id = Number(result.lastInsertRowid);
    const publicPath = `/api/media/${id}`;

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename: safeName,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "خطا در آپلود فایل" }, { status: 500 });
  }
}
