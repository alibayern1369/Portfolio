"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUpload } from "@/components/admin/image-upload";
import { Save, Plus, Trash2 } from "lucide-react";

interface ProfileData {
  name: string; role: string; tagline: string; bio: string;
  short_bio: string; avatar: string; location: string; email: string;
  availability: string; resume_url: string; hero_headline: string; hero_description: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<ProfileData | null>(null);
  const [headlines, setHeadlines] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then(res => res.status === 401 ? (router.push("/admin/login"), null) : res.json())
      .then(res => {
        if (res?.profile) {
          setData(res.profile);
          try { setHeadlines(JSON.parse(res.profile.hero_headline || "[]")); } catch { setHeadlines([]); }
        }
        setLoading(false);
      });
  }, [router]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, hero_headline: headlines })
    });
    setSaving(false);
    alert("ذخیره شد!");
  };

  if (loading) return <AdminShell title="پروفایل"><div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" /></div></AdminShell>;
  if (!data) return null;

  return (
    <AdminShell title="پروفایل" description="اطلاعات شخصی و هیرو صفحه اصلی">
      <div className="max-w-4xl space-y-6">
        {/* Avatar Upload */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">عکس پروفایل</h2>
          <div className="max-w-[200px]">
            <ImageUpload
              value={data.avatar}
              onChange={(path) => setData({ ...data, avatar: path })}
              folder="profile"
              label="آواتار"
              aspect="square"
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">اطلاعات اصلی</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">نام</label>
              <input type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">نقش/سمت</label>
              <input type="text" value={data.role} onChange={e => setData({...data, role: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ایمیل</label>
              <input type="email" dir="ltr" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none text-left" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">موقعیت</label>
              <input type="text" value={data.location} onChange={e => setData({...data, location: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">وضعیت</label>
              <input type="text" value={data.availability} onChange={e => setData({...data, availability: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">بیوگرافی</label>
            <textarea value={data.bio} onChange={e => setData({...data, bio: e.target.value})} rows={4} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none resize-none" />
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">بخش هیرو (Hero)</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">خطوط عنوان</label>
            {headlines.map((line, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" value={line} onChange={e => { const n = [...headlines]; n[i] = e.target.value; setHeadlines(n); }} className="flex-1 px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none" />
                <button onClick={() => setHeadlines(headlines.filter((_, j) => j !== i))} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
            <button onClick={() => setHeadlines([...headlines, ""])} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Plus className="w-4 h-4" /> افزودن خط</button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">توضیحات هیرو</label>
            <textarea value={data.hero_description} onChange={e => setData({...data, hero_description: e.target.value})} rows={3} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none resize-none" />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 disabled:opacity-50">
          <Save className="w-5 h-5" /> {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>
    </AdminShell>
  );
}
