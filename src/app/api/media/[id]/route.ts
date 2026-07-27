import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const media = await queryOne("SELECT * FROM media WHERE id = ?", [id]);

    if (!media || !media.path) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const buffer = Buffer.from(media.path as string, "base64");
    const mimeType = (media.mime_type as string) || "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
