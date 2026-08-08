import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { cookies } from "next/headers";
import { verifyRecaptcha } from "@/lib/recaptcha";
import {
  checkLoginRateLimit,
  clearLoginFailures,
  getClientIp,
  recordLoginFailure,
} from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateKey = `login:${ip}`;

    const rate = checkLoginRateLimit(rateKey);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: `تعداد تلاش‌ها زیاد است. ${rate.retryAfterSec || 900} ثانیه دیگر دوباره تلاش کنید.`,
        },
        {
          status: 429,
          headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : undefined,
        }
      );
    }

    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const recaptchaToken = typeof body.recaptchaToken === "string" ? body.recaptchaToken : "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "نام کاربری و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    if (username.length > 64 || password.length > 128) {
      recordLoginFailure(rateKey);
      return NextResponse.json({ error: "نام کاربری یا رمز عبور اشتباه است" }, { status: 401 });
    }

    const captcha = await verifyRecaptcha(recaptchaToken, "login");
    if (!captcha.ok) {
      recordLoginFailure(rateKey);
      return NextResponse.json({ error: captcha.error || "تأیید امنیتی ناموفق بود" }, { status: 403 });
    }

    const result = await login(username, password);

    if (!result.success) {
      recordLoginFailure(rateKey);
      // Constant-ish delay to slow credential stuffing
      await new Promise((r) => setTimeout(r, 400 + Math.floor(Math.random() * 400)));
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    clearLoginFailures(rateKey);

    const cookieStore = await cookies();
    cookieStore.set("auth_token", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    const message = error instanceof Error ? error.message : "";
    if (message.includes("JWT_SECRET")) {
      return NextResponse.json(
        { error: "پیکربندی سرور ناقص است (JWT_SECRET). متغیر را در محیط استقرار تنظیم کنید." },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "خطا در ورود" }, { status: 500 });
  }
}
