/**
 * Shared Google reCAPTCHA v3 helpers for login and public forms.
 * Keys can come from admin settings (DB) or environment variables.
 */

import db from "@/db";
import { initDatabase } from "@/db";

async function getRecaptchaKeysFromDb(): Promise<{ siteKey: string; secretKey: string }> {
  try {
    await initDatabase();
    const result = await db.execute("SELECT recaptcha_site_key, recaptcha_secret_key FROM site_settings WHERE id = 1");
    const row = result.rows[0] as Record<string, unknown> | undefined;
    return {
      siteKey: String(row?.recaptcha_site_key || "").trim(),
      secretKey: String(row?.recaptcha_secret_key || "").trim(),
    };
  } catch {
    return { siteKey: "", secretKey: "" };
  }
}

export async function getRecaptchaSiteKey(): Promise<string> {
  const fromDb = await getRecaptchaKeysFromDb();
  return fromDb.siteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
}

export async function getRecaptchaSecretKey(): Promise<string> {
  const fromDb = await getRecaptchaKeysFromDb();
  return fromDb.secretKey || process.env.RECAPTCHA_SECRET_KEY || "";
}

export async function isRecaptchaConfigured(): Promise<boolean> {
  const [siteKey, secretKey] = await Promise.all([getRecaptchaSiteKey(), getRecaptchaSecretKey()]);
  return Boolean(siteKey && secretKey);
}

export async function verifyRecaptcha(
  token: string | undefined | null,
  expectedAction?: string
): Promise<{ ok: boolean; score?: number; error?: string }> {
  const secretKey = await getRecaptchaSecretKey();
  const siteKey = await getRecaptchaSiteKey();

  if (!secretKey || !siteKey) {
    // In production, skip only when captcha is not configured at all.
    // Prefer setting keys in Admin → Settings so login/contact stay protected.
    if (process.env.NODE_ENV === "production" && process.env.RECAPTCHA_REQUIRED === "true") {
      return { ok: false, error: "reCAPTCHA پیکربندی نشده است" };
    }
    return { ok: true };
  }

  if (!token) {
    return { ok: false, error: "تأیید امنیتی ناموفق بود" };
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    });
    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return { ok: false, error: "تأیید امنیتی ناموفق بود. دوباره تلاش کنید." };
    }

    if (expectedAction && data.action && data.action !== expectedAction) {
      return { ok: false, error: "تأیید امنیتی نامعتبر است." };
    }

    const score = typeof data.score === "number" ? data.score : 0;
    if (score < 0.5) {
      return { ok: false, score, error: "تأیید امنیتی ناموفق بود. دوباره تلاش کنید." };
    }

    return { ok: true, score };
  } catch {
    return { ok: false, error: "خطا در بررسی امنیتی" };
  }
}
