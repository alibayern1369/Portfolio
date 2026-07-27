"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Plus, Save, Trash2, X } from "lucide-react";

interface Testimonial { id: number; name: string; role: string; company: string; avatar: string; text: string; sort_order: number; }

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Testimonial>>({});

  const fetchData = () => {
    fetch("/api/admin/testimonials")
      .then(res => res.status === 401 ? (router.push("/admin/login"), null) : res.json())
      .then(res => { if (res?.testimonials) setItems(res.testimonials); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, [router]);

  const startNew = () => { setEditing(-1); setForm({ name: "", role: "", company: "", avatar: "", text: "", sort_order: 0 }); };

  const handleSave = async () => {
    const url = editing === -1 ? "/api/admin/testimonials" : `/api/admin/testimonials/${editing}`;
    await fetch(url, { method: editing === -1 ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setEditing(null);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <AdminShell title="نظرات"><div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" /></div></AdminShell>;

  return (
    <AdminShell title="نظرات" description="نظرات مشتریان و همکاران">
      <button onClick={startNew} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium rounded-xl hover:opacity-90 mb-6">
        <Plus className="w-5 h-5" /> نظر جدید
      </button>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{editing === -1 ? "نظر جدید" : "ویرایش"}</h3>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="نام" value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
              <input placeholder="سمت" value={form.role || ""} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
              <input placeholder="شرکت" value={form.company || ""} onChange={e => setForm({...form, company: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
              <input placeholder="آواتار (حروف اول)" value={form.avatar || ""} onChange={e => setForm({...form, avatar: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl" />
              <textarea placeholder="متن نظر" value={form.text || ""} onChange={e => setForm({...form, text: e.target.value})} rows={4} className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none" />
            </div>
            <button onClick={handleSave} className="mt-6 flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90">
              <Save className="w-5 h-5" /> ذخیره
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(item => (
          <div key={item.id} className="min-w-0 rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">{item.avatar}</div>
              <div className="min-w-0">
                <h3 className="truncate font-semibold">{item.name}</h3>
                <p className="truncate text-xs text-muted-foreground">{item.role}، {item.company}</p>
              </div>
            </div>
            <p className="mb-3 line-clamp-2 break-safe text-sm text-muted-foreground">«{item.text}»</p>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(item.id); setForm(item); }} className="text-sm hover:underline">ویرایش</button>
              <button onClick={() => handleDelete(item.id)} className="text-sm text-red-500 hover:underline">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
