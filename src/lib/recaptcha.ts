/**
 * Shared Google reCAPTCHA v3 helpers for login and public forms.
 */

export async function verifyRecaptcha(
  token: string | undefined | null,
  expectedAction?: string
): Promise<{ ok: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    // Not configured — allow in development; block in production if keys expected
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

export function isRecaptchaConfigured(): boolean {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
}
