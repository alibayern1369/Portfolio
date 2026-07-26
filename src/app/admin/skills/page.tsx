"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Plus, Save, Trash2, X } from "lucide-react";

interface Skill { id: number; name: string; icon: string; skills: string; sort_order: number; }

export default function AdminSkillsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Skill>>({});
  const [skillsList, setSkillsList] = useState<string[]>([]);

  const fetchData = () => {
    fetch("/api/admin/skills")
      .then(res => res.status === 401 ? (router.push("/admin/login"), null) : res.json())
      .then(res => { if (res?.skills) setItems(res.skills); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, [router]);

  const startEdit = (item: Skill) => {
    setEditing(item.id);
    setForm(item);
    try { setSkillsList(JSON.parse(item.skills || "[]")); } catch { setSkillsList([]); }
  };

  const startNew = () => {
    setEditing(-1);
    setForm({ name: "", icon: "monitor", sort_order: 0 });
    setSkillsList([]);
  };

  const handleSave = async () => {
    const url = editing === -1 ? "/api/admin/skills" : `/api/admin/skills/${editing}`;
    const method = editing === -1 ? "POST" : "PUT";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, skills: skillsList }) });
    setEditing(null);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <AdminShell title="مهارت‌ها"><div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" /></div></AdminShell>;

  return (
    <AdminShell title="مهارت‌ها" description="دسته‌بندی مهارت‌ها">
      <button onClick={startNew} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium rounded-xl hover:opacity-90 mb-6">
        <Plus className="w-5 h-5" /> دسته جدید
      </button>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{editing === -1 ? "دسته جدید" : "ویرایش"}</h3>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <input placeholder="نام دسته" value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl mb-4" />
            <select value={form.icon || ""} onChange={e => setForm({...form, icon: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl mb-4">
              <option value="monitor">مانیتور (فرانت‌اند)</option>
              <option value="server">سرور (بک‌اند)</option>
              <option value="palette">پالت (طراحی)</option>
              <option value="cloud">ابر (دوآپس)</option>
              <option value="wrench">آچار (ابزارها)</option>
              <option value="users">کاربران (مهارت‌های نرم)</option>
            </select>
            <div>
              <label className="text-sm font-medium">مهارت‌ها (با کاما جدا کنید)</label>
              <input value={skillsList.join(", ")} onChange={e => setSkillsList(e.target.value.split(",").map(t => t.trim()).filter(Boolean))} className="w-full mt-2 px-4 py-3 bg-background border border-border rounded-xl" />
            </div>
            <button onClick={handleSave} className="mt-6 flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90">
              <Save className="w-5 h-5" /> ذخیره
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <div key={item.id} className="p-4 bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <div className="flex gap-1">
                <button onClick={() => startEdit(item)} className="p-1 hover:bg-secondary rounded text-sm">ویرایش</button>
                <button onClick={() => handleDelete(item.id)} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {JSON.parse(item.skills || "[]").map((s: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-secondary rounded text-xs">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
