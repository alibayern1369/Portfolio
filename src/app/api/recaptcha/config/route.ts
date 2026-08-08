import { NextResponse } from "next/server";
import { getRecaptchaSiteKey } from "@/lib/recaptcha";

/** Public: returns only the site key (never the secret). */
export async function GET() {
  const siteKey = await getRecaptchaSiteKey();
  return NextResponse.json({
    siteKey: siteKey || null,
    enabled: Boolean(siteKey),
  });
}
