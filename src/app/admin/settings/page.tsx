"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Save } from "lucide-react";

interface SettingsData { site_name: string; site_title: string; site_description: string; site_url: string; locale: string; keywords: string; default_theme: "light" | "dark" | "system"; }

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<SettingsData>({ site_name: "", site_title: "", site_description: "", site_url: "", locale: "fa-IR", keywords: "", default_theme: "system" });
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.status === 401 ? (router.push("/admin/login"), null) : res.json())
      .then(res => {
        if (res?.settings) {
          setData({ ...res.settings, default_theme: res.settings.default_theme || "system" });
          try { setKeywords(JSON.parse(res.settings.keywords || "[]")); } catch { setKeywords([]); }
        }
        setLoading(false);
      });
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, keywords }) });
    setSaving(false);
    alert("ذخیره شد!");
  };

  if (loading) return <AdminShell title="تنظیمات"><div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" /></div></AdminShell>;

  return (
    <AdminShell title="تنظیمات" description="تنظیمات کلی سایت و SEO">
      <div className="max-w-4xl space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">اطلاعات سایت</h2>
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
              <label className="block text-sm font-medium mb-2">آدرس سایت</label>
              <input dir="ltr" value={data.site_url} onChange={e => setData({...data, site_url: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-left" />
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
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 disabled:opacity-50">
          <Save className="w-5 h-5" /> {saving ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>
    </AdminShell>
  );
}
