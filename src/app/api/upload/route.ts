import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { execute } from "@/lib/db-helpers";
import { initDatabase } from "@/db";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

function sniffImageMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return "image/gif";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

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
    const folderRaw = typeof folderValue === "string" && folderValue.trim() ? folderValue.trim() : "uploads";
    const folder = folderRaw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "فایلی انتخاب نشده یا فرمت نامعتبر است" }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXT.has(ext) || !ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "فرمت فایل مجاز نیست (فقط JPG, PNG, WebP, GIF — SVG مجاز نیست)" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "حداکثر حجم فایل ۵ مگابایت است" }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const sniffed = sniffImageMime(bytes);
    if (!sniffed || sniffed !== file.type) {
      return NextResponse.json(
        { error: "محتوای فایل با نوع تصویر اعلام‌شده مطابقت ندارد" },
        { status: 400 }
      );
    }

    const base64 = Buffer.from(bytes).toString("base64");
    const timestamp = Date.now();
    const safeName = `${folder}-${timestamp}.${ext === "jpeg" ? "jpg" : ext}`;

    await initDatabase();

    const result = await execute(
      `INSERT INTO media (filename, original_name, mime_type, size, path) VALUES (?, ?, ?, ?, ?)`,
      [safeName, file.name.slice(0, 200), sniffed, file.size, base64]
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
