"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUpload } from "@/components/admin/image-upload";
import { Save } from "lucide-react";

interface SettingsData {
  site_name: string;
  site_title: string;
  site_description: string;
  locale: string;
  keywords: string;
  default_theme: "light" | "dark" | "system";
  logo: string;
  logo_text: string;
  content_font_size: "sm" | "base" | "lg" | "xl";
  content_text_align: "right" | "left" | "center" | "justify";
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<SettingsData>({
    site_name: "",
    site_title: "",
    site_description: "",
    locale: "fa-IR",
    keywords: "",
    default_theme: "system",
    logo: "",
    logo_text: "ع.د",
    content_font_size: "base",
    content_text_align: "right",
  });
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.status === 401 ? (router.push("/admin/login"), null) : res.json())
      .then(res => {
        if (res?.settings) {
          setData({
            site_name: res.settings.site_name || "",
            site_title: res.settings.site_title || "",
            site_description: res.settings.site_description || "",
            locale: res.settings.locale || "fa-IR",
            keywords: "",
            default_theme: res.settings.default_theme || "system",
            logo: res.settings.logo || "",
            logo_text: res.settings.logo_text || "ع.د",
            content_font_size: res.settings.content_font_size || "base",
            content_text_align: res.settings.content_text_align || "right",
          });
          try { setKeywords(JSON.parse(res.settings.keywords || "[]")); } catch { setKeywords([]); }
        }
        setLoading(false);
      });
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, keywords }),
    });
    setSaving(false);
    alert("ذخیره شد!");
  };

  if (loading) return <AdminShell title="تنظیمات"><div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" /></div></AdminShell>;

  return (
    <AdminShell title="تنظیمات" description="تنظیمات کلی سایت و SEO">
      <div className="mx-auto max-w-4xl min-w-0 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <h2 className="font-semibold mb-4">لوگوی سایت</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUpload
              value={data.logo}
              onChange={(path) => setData({ ...data, logo: path })}
              folder="logo"
              label="تصویر لوگو"
              aspect="square"
            />
            <div>
              <label className="block text-sm font-medium mb-2">متن لوگو (در صورت نبود تصویر)</label>
              <input
                value={data.logo_text}
                onChange={e => setData({ ...data, logo_text: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                placeholder="ع.د"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                اگر تصویر لوگو آپلود نشود، این متن در نوار بالای سایت و فوتر نمایش داده می‌شود.
              </p>
              <div className="mt-4 rounded-xl border border-border bg-background p-4">
                <p className="mb-2 text-xs text-muted-foreground">پیش‌نمایش</p>
                {data.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.logo} alt="لوگو" className="h-10 w-auto object-contain" />
                ) : (
                  <span className="gradient-text text-lg font-bold">{data.logo_text || "ع.د"}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <h2 className="mb-4 font-semibold">اطلاعات سایت</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">نام سایت</label>
              <input value={data.site_name} onChange={e => setData({...data, site_name: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">عنوان</label>
              <input value={data.site_title} onChange={e => setData({...data, site_title: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">توضیحات (SEO)</label>
              <textarea value={data.site_description} onChange={e => setData({...data, site_description: e.target.value})} rows={2} className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">زبان</label>
              <select value={data.locale} onChange={e => setData({...data, locale: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl">
                <option value="fa-IR">فارسی (ایران)</option>
                <option value="en-US">English (US)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">کلمات کلیدی (با کاما جدا کنید)</label>
              <input value={keywords.join(", ")} onChange={e => setKeywords(e.target.value.split(",").map(k => k.trim()).filter(Boolean))} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">تم پیش‌فرض</label>
              <select value={data.default_theme} onChange={e => setData({...data, default_theme: e.target.value as "light" | "dark" | "system"})} className="w-full px-4 py-3 bg-background border border-border rounded-xl">
                <option value="system">استفاده از تنظیمات سیستم</option>
                <option value="light">روشن</option>
                <option value="dark">تاریک</option>
              </select>
              <p className="mt-2 text-xs text-muted-foreground">این گزینه تعیین می‌کند وب‌سایت هنگام بارگذاری اولیه از کدام تم استفاده کند.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <h2 className="mb-4 font-semibold">تایپوگرافی محتوا</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            این تنظیمات روی متن‌های طولانی مثل صفحه پروژه و درباره من اعمال می‌شود.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">سایز متن</label>
              <select
                value={data.content_font_size}
                onChange={e => setData({ ...data, content_font_size: e.target.value as SettingsData["content_font_size"] })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl"
              >
                <option value="sm">کوچک</option>
                <option value="base">متوسط</option>
                <option value="lg">بزرگ</option>
                <option value="xl">خیلی بزرگ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">تراز متن</label>
              <select
                value={data.content_text_align}
                onChange={e => setData({ ...data, content_text_align: e.target.value as SettingsData["content_text_align"] })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl"
              >
                <option value="right">راست‌چین</option>
                <option value="left">چپ‌چین</option>
                <option value="center">وسط‌چین</option>
                <option value="justify">جاستیفای</option>
              </select>
            </div>
          </div>
          <div
            className="prose-content mt-4 rounded-xl border border-border bg-background p-4"
            data-font-size={data.content_font_size}
            data-text-align={data.content_text_align}
          >
            <p>
              این یک پیش‌نمایش از متن محتواست. با تغییر سایز و تراز، ظاهر پاراگراف‌های طولانی در صفحات پروژه و درباره من تغییر می‌کند.
            </p>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 disabled:opacity-50">
          <Save className="w-5 h-5" /> {saving ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>
    </AdminShell>
  );
}
