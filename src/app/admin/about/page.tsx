"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Save } from "lucide-react";

interface AboutData { title: string; subtitle: string; content: string; }

export default function AdminAboutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<AboutData>({ title: "", subtitle: "", content: "" });

  useEffect(() => {
    fetch("/api/admin/about")
      .then(res => res.status === 401 ? (router.push("/admin/login"), null) : res.json())
      .then(res => { if (res?.about) setData(res.about); setLoading(false); });
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/about", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    alert("ذخیره شد!");
  };

  if (loading) return <AdminShell title="درباره من"><div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" /></div></AdminShell>;

  return (
    <AdminShell title="درباره من" description="صفحه درباره من">
      <div className="max-w-4xl space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">عنوان</label>
              <input value={data.title} onChange={e => setData({...data, title: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">زیرعنوان</label>
              <input value={data.subtitle} onChange={e => setData({...data, subtitle: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">محتوا (مارک‌داون)</label>
            <textarea value={data.content} onChange={e => setData({...data, content: e.target.value})} rows={15} className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none font-mono text-sm" />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 disabled:opacity-50">
          <Save className="w-5 h-5" /> {saving ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>
    </AdminShell>
  );
}
