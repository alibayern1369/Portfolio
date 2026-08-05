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
  favicon: string;
  favicon_light: string;
  favicon_dark: string;
  home_hero_description: string;
  home_about_title: string;
  home_about_description: string;
  home_services_title: string;
  home_services_description: string;
  home_projects_title: string;
  home_projects_description: string;
  home_skills_title: string;
  home_skills_description: string;
  home_testimonials_title: string;
  home_testimonials_description: string;
  home_cta_title: string;
  home_cta_description: string;
  footer_tagline: string;
  footer_copyright: string;
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
    favicon: "",
    favicon_light: "",
    favicon_dark: "",
    home_hero_description: "",
    home_about_title: "",
    home_about_description: "",
    home_services_title: "",
    home_services_description: "",
    home_projects_title: "",
    home_projects_description: "",
    home_skills_title: "",
    home_skills_description: "",
    home_testimonials_title: "",
    home_testimonials_description: "",
    home_cta_title: "",
    home_cta_description: "",
    footer_tagline: "",
    footer_copyright: "",
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
            favicon: res.settings.favicon || "",
            favicon_light: res.settings.favicon_light || "",
            favicon_dark: res.settings.favicon_dark || "",
            home_hero_description: res.settings.home_hero_description || "",
            home_about_title: res.settings.home_about_title || "",
            home_about_description: res.settings.home_about_description || "",
            home_services_title: res.settings.home_services_title || "",
            home_services_description: res.settings.home_services_description || "",
            home_projects_title: res.settings.home_projects_title || "",
            home_projects_description: res.settings.home_projects_description || "",
            home_skills_title: res.settings.home_skills_title || "",
            home_skills_description: res.settings.home_skills_description || "",
            home_testimonials_title: res.settings.home_testimonials_title || "",
            home_testimonials_description: res.settings.home_testimonials_description || "",
            home_cta_title: res.settings.home_cta_title || "",
            home_cta_description: res.settings.home_cta_description || "",
            footer_tagline: res.settings.footer_tagline || "",
            footer_copyright: res.settings.footer_copyright || "",
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
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, keywords }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.success) {
        console.error("Settings save failed:", payload);
        alert(payload.error || "خطا در ذخیره‌سازی تنظیمات");
      } else {
        alert("ذخیره شد!");
      }
    } catch (error) {
      console.error("Settings save exception:", error);
      alert("خطا در اتصال به سرور");
    } finally {
      setSaving(false);
    }
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

        <div id="homepage-content" className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <h2 className="mb-4 font-semibold">محتوای صفحه اصلی</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">متن توضیح هیرو</label>
              <textarea value={data.home_hero_description} onChange={e => setData({ ...data, home_hero_description: e.target.value })} rows={3} className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان درباره</label>
                <input value={data.home_about_title} onChange={e => setData({ ...data, home_about_title: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">توضیحات درباره</label>
                <textarea value={data.home_about_description} onChange={e => setData({ ...data, home_about_description: e.target.value })} rows={2} className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان خدمات</label>
                <input value={data.home_services_title} onChange={e => setData({ ...data, home_services_title: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">توضیحات خدمات</label>
                <textarea value={data.home_services_description} onChange={e => setData({ ...data, home_services_description: e.target.value })} rows={2} className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان پروژه‌ها</label>
                <input value={data.home_projects_title} onChange={e => setData({ ...data, home_projects_title: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">توضیحات پروژه‌ها</label>
                <textarea value={data.home_projects_description} onChange={e => setData({ ...data, home_projects_description: e.target.value })} rows={2} className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان مهارت‌ها</label>
                <input value={data.home_skills_title} onChange={e => setData({ ...data, home_skills_title: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">توضیحات مهارت‌ها</label>
                <textarea value={data.home_skills_description} onChange={e => setData({ ...data, home_skills_description: e.target.value })} rows={2} className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان نظرات</label>
                <input value={data.home_testimonials_title} onChange={e => setData({ ...data, home_testimonials_title: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">توضیحات نظرات</label>
                <textarea value={data.home_testimonials_description} onChange={e => setData({ ...data, home_testimonials_description: e.target.value })} rows={2} className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">عنوان CTA</label>
              <input value={data.home_cta_title} onChange={e => setData({ ...data, home_cta_title: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">توضیحات CTA</label>
              <textarea value={data.home_cta_description} onChange={e => setData({ ...data, home_cta_description: e.target.value })} rows={2} className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none" />
            </div>
          </div>
        </div>

        <div id="footer-content" className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <h2 className="mb-4 font-semibold">متن فوتر</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">متن ذیل لوگو</label>
              <textarea value={data.footer_tagline} onChange={e => setData({ ...data, footer_tagline: e.target.value })} rows={2} className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">متن حق نشر</label>
              <textarea value={data.footer_copyright} onChange={e => setData({ ...data, footer_copyright: e.target.value })} rows={2} className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <h2 className="mb-4 font-semibold">فاویکن سایت</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <ImageUpload
              value={data.favicon}
              onChange={(path) => setData({ ...data, favicon: path })}
              folder="favicon"
              label="فاویکن عمومی"
              aspect="square"
            />
            <ImageUpload
              value={data.favicon_light}
              onChange={(path) => setData({ ...data, favicon_light: path })}
              folder="favicon"
              label="فاویکن روشن"
              aspect="square"
            />
            <ImageUpload
              value={data.favicon_dark}
              onChange={(path) => setData({ ...data, favicon_dark: path })}
              folder="favicon"
              label="فاویکن تیره"
              aspect="square"
            />
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
