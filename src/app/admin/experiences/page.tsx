"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Plus, Save, Trash2, X } from "lucide-react";

interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string;
  technologies: string;
  sort_order: number;
}

export default function AdminExperiencesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Experience>>({});
  const [achievements, setAchievements] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);

  const fetchData = () => {
    fetch("/api/admin/experiences")
      .then(res => res.status === 401 ? (router.push("/admin/login"), null) : res.json())
      .then(res => { if (res?.experiences) setItems(res.experiences); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, [router]);

  const startEdit = (item: Experience) => {
    setEditing(item.id);
    setForm(item);
    try { setAchievements(JSON.parse(item.achievements || "[]")); } catch { setAchievements([]); }
    try { setTechnologies(JSON.parse(item.technologies || "[]")); } catch { setTechnologies([]); }
  };

  const startNew = () => {
    setEditing(-1);
    setForm({ company: "", role: "", period: "", location: "", description: "", sort_order: 0 });
    setAchievements([]);
    setTechnologies([]);
  };

  const handleSave = async () => {
    const url = editing === -1 ? "/api/admin/experiences" : `/api/admin/experiences/${editing}`;
    const method = editing === -1 ? "POST" : "PUT";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, achievements, technologies })
    });
    setEditing(null);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await fetch(`/api/admin/experiences/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <AdminShell title="تجربیات"><div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" /></div></AdminShell>;

  return (
    <AdminShell title="تجربیات" description="سوابق کاری">
      <button onClick={startNew} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium rounded-xl hover:opacity-90 mb-6">
        <Plus className="w-5 h-5" /> تجربه جدید
      </button>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{editing === -1 ? "تجربه جدید" : "ویرایش"}</h3>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input placeholder="شرکت" value={form.company || ""} onChange={e => setForm({...form, company: e.target.value})} className="px-4 py-3 bg-background border border-border rounded-xl" />
              <input placeholder="نقش/سمت" value={form.role || ""} onChange={e => setForm({...form, role: e.target.value})} className="px-4 py-3 bg-background border border-border rounded-xl" />
              <input placeholder="دوره (مثلا ۱۴۰۰ - ۱۴۰۲)" value={form.period || ""} onChange={e => setForm({...form, period: e.target.value})} className="px-4 py-3 bg-background border border-border rounded-xl" />
              <input placeholder="موقعیت" value={form.location || ""} onChange={e => setForm({...form, location: e.target.value})} className="px-4 py-3 bg-background border border-border rounded-xl" />
            </div>
            <textarea placeholder="توضیحات" value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full mt-4 px-4 py-3 bg-background border border-border rounded-xl resize-none" />
            
            <div className="mt-4">
              <label className="text-sm font-medium">دستاوردها</label>
              {achievements.map((a, i) => (
                <div key={i} className="flex gap-2 mt-2">
                  <input value={a} onChange={e => { const n = [...achievements]; n[i] = e.target.value; setAchievements(n); }} className="flex-1 px-4 py-2 bg-background border border-border rounded-xl text-sm" />
                  <button onClick={() => setAchievements(achievements.filter((_, j) => j !== i))} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => setAchievements([...achievements, ""])} className="mt-2 text-sm text-muted-foreground hover:text-foreground">+ افزودن</button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">فناوری‌ها (با کاما جدا کنید)</label>
              <input value={technologies.join(", ")} onChange={e => setTechnologies(e.target.value.split(",").map(t => t.trim()).filter(Boolean))} className="w-full mt-2 px-4 py-3 bg-background border border-border rounded-xl" />
            </div>

            <button onClick={handleSave} className="mt-6 flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90">
              <Save className="w-5 h-5" /> ذخیره
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
            <div className="flex-1">
              <h3 className="font-semibold">{item.company}</h3>
              <p className="text-sm text-muted-foreground">{item.role} • {item.period}</p>
            </div>
            <button onClick={() => startEdit(item)} className="p-2 hover:bg-secondary rounded-lg">ویرایش</button>
            <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-5 h-5" /></button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
