"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
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
      <div className="mx-auto max-w-4xl min-w-0 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">عنوان</label>
              <input value={data.title} onChange={e => setData({...data, title: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-3" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">زیرعنوان</label>
              <input value={data.subtitle} onChange={e => setData({...data, subtitle: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-3" />
            </div>
          </div>
          <div className="mt-4">
            <MarkdownEditor
              value={data.content}
              onChange={(content) => setData({ ...data, content })}
              rows={15}
              folder="about"
              label="محتوا (مارک‌داون)"
              hint="می‌توانید وسط متن، عکس آپلود کنید تا بین پاراگراف‌ها نمایش داده شود."
            />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 disabled:opacity-50">
          <Save className="w-5 h-5" /> {saving ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>
    </AdminShell>
  );
}
