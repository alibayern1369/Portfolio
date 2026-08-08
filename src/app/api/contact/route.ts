import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { checkLoginRateLimit, getClientIp, recordLoginFailure, clearLoginFailures } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateKey = `contact:${ip}`;
    const rate = checkLoginRateLimit(rateKey);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const honeypot = typeof body.website === "string" ? body.website.trim() : "";
    const recaptchaToken = typeof body.recaptchaToken === "string" ? body.recaptchaToken : "";

    // Silent success for bots filling honeypot
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "تمام فیلدها الزامی است" }, { status: 400 });
    }

    if (name.length > 100 || email.length > 200 || message.length > 5000) {
      recordLoginFailure(rateKey);
      return NextResponse.json({ error: "ورودی نامعتبر است" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "ایمیل معتبر نیست" }, { status: 400 });
    }

    const captcha = await verifyRecaptcha(recaptchaToken, "contact");
    if (!captcha.ok) {
      recordLoginFailure(rateKey);
      return NextResponse.json({ error: captcha.error || "تأیید امنیتی ناموفق بود" }, { status: 403 });
    }

    clearLoginFailures(rateKey);

    // Hook point for email/CRM integration
    console.info("[contact]", { name, email, messageLength: message.length, ip });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "خطا در ارسال پیام" }, { status: 500 });
  }
}
