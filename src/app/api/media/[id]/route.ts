import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db-helpers";

const SAFE_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!/^\d+$/.test(id)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const media = await queryOne("SELECT * FROM media WHERE id = ?", [id]);

    if (!media || !media.path) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const mimeType = (media.mime_type as string) || "image/jpeg";
    if (!SAFE_MIME.has(mimeType) || mimeType.includes("svg")) {
      return new NextResponse("Unsupported media type", { status: 415 });
    }

    const buffer = Buffer.from(media.path as string, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
