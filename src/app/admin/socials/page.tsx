"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Plus, Save, Trash2, X } from "lucide-react";

interface Social { id: number; name: string; url: string; icon: string; sort_order: number; }

export default function AdminSocialsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Social[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Social>>({});

  const fetchData = () => {
    fetch("/api/admin/socials")
      .then(res => res.status === 401 ? (router.push("/admin/login"), null) : res.json())
      .then(res => { if (res?.socials) setItems(res.socials); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, [router]);

  const startNew = () => { setEditing(-1); setForm({ name: "", url: "", icon: "github", sort_order: 0 }); };

  const handleSave = async () => {
    const url = editing === -1 ? "/api/admin/socials" : `/api/admin/socials/${editing}`;
    await fetch(url, { method: editing === -1 ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setEditing(null);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await fetch(`/api/admin/socials/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <AdminShell title="شبکه‌های اجتماعی"><div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" /></div></AdminShell>;

  return (
    <AdminShell title="شبکه‌های اجتماعی" description="لینک‌های شبکه‌های اجتماعی">
      <button onClick={startNew} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium rounded-xl hover:opacity-90 mb-6">
        <Plus className="w-5 h-5" /> لینک جدید
      </button>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{editing === -1 ? "لینک جدید" : "ویرایش"}</h3>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="نام (مثلا گیت‌هاب)" value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
              <input placeholder="آدرس" dir="ltr" value={form.url || ""} onChange={e => setForm({...form, url: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-left" />
              <select value={form.icon || ""} onChange={e => setForm({...form, icon: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl">
                <option value="github">گیت‌هاب</option>
                <option value="linkedin">لینکدین</option>
                <option value="twitter">توییتر</option>
                <option value="dribbble">دریبل</option>
              </select>
            </div>
            <button onClick={handleSave} className="mt-6 flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90">
              <Save className="w-5 h-5" /> ذخیره
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-4">
            <span className="shrink-0 text-xl">
              {item.icon === "github" && "🐙"}
              {item.icon === "linkedin" && "💼"}
              {item.icon === "twitter" && "🐦"}
              {item.icon === "dribbble" && "🏀"}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="break-safe text-xs text-muted-foreground" dir="ltr">{item.url}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => { setEditing(item.id); setForm(item); }} className="text-sm hover:underline">ویرایش</button>
              <button onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
