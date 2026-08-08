"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRecaptchaV3 } from "@/hooks/use-recaptcha-v3";

export default function AdminLoginPage() {
  const router = useRouter();
  const { enabled: recaptchaEnabled, getToken } = useRecaptchaV3();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const recaptchaToken = recaptchaEnabled ? await getToken("login") : null;

      if (recaptchaEnabled && !recaptchaToken) {
        setError("بارگذاری تأیید امنیتی ناموفق بود. صفحه را تازه کنید.");
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, recaptchaToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ورود");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-foreground text-background mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">پنل مدیریت</h1>
          <p className="text-muted-foreground mt-2">برای ورود اطلاعات خود را وارد کنید</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-card border border-border rounded-2xl p-6"
          autoComplete="off"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm" role="alert">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="admin-username">نام کاربری</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="admin-username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-11 pl-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none"
                required
                autoComplete="username"
                maxLength={64}
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="admin-password">رمز عبور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-11 pl-11 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none"
                required
                autoComplete="current-password"
                maxLength={128}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>

          {recaptchaEnabled && (
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/50 pt-2">
              <ShieldCheck className="w-3 h-3" />
              محافظت شده با reCAPTCHA v3
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
