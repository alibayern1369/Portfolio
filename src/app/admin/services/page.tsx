"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Plus, Save, Trash2, X } from "lucide-react";

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
}

const ICON_OPTIONS = [
  { value: "palette", label: "UI/UX" },
  { value: "sparkles", label: "لوگو / برند" },
  { value: "puzzle", label: "افزونه" },
  { value: "code", label: "نرم‌افزار" },
  { value: "building", label: "اداری" },
  { value: "globe", label: "وبسایت" },
  { value: "layout", label: "رسپانسیو" },
  { value: "smartphone", label: "اپ موبایل" },
];

export default function AdminServicesPage() {
  const router = useRouter();
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<ServiceItem>>({});

  const fetchData = () => {
    fetch("/api/admin/services")
      .then((res) => (res.status === 401 ? (router.push("/admin/login"), null) : res.json()))
      .then((res) => {
        if (res?.services) setItems(res.services);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const startEdit = (item: ServiceItem) => {
    setEditing(item.id);
    setForm(item);
  };

  const startNew = () => {
    setEditing(-1);
    setForm({ title: "", description: "", icon: "sparkles", sort_order: items.length + 1 });
  };

  const handleSave = async () => {
    const url = editing === -1 ? "/api/admin/services" : `/api/admin/services/${editing}`;
    const method = editing === -1 ? "POST" : "PUT";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditing(null);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) {
    return (
      <AdminShell title="خدمات">
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="خدمات" description="خدمات کسب‌وکار و معرفی تخصص‌ها">
      <button
        onClick={startNew}
        className="mb-6 inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 font-medium text-background hover:opacity-90"
      >
        <Plus className="h-5 w-5" /> خدمت جدید
      </button>

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-semibold">{editing === -1 ? "خدمت جدید" : "ویرایش خدمت"}</h3>
              <button onClick={() => setEditing(null)} className="rounded-lg p-2 hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">عنوان</label>
                <input
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3"
                  placeholder="مثلا طراحی وبسایت وردپرس"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">توضیح کوتاه</label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3"
                  placeholder="توضیح مختصر درباره این خدمت"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">آیکون</label>
                  <select
                    value={form.icon || "sparkles"}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">ترتیب</label>
                  <input
                    type="number"
                    value={form.sort_order ?? 0}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="mt-6 flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 font-medium text-background hover:opacity-90"
            >
              <Save className="h-5 w-5" /> ذخیره
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-4"
          >
            <div className="min-w-0 flex-1">
              <h3 className="break-safe font-semibold">{item.title}</h3>
              <p className="break-safe mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => startEdit(item)} className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">
                ویرایش
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
            هنوز خدمتی ثبت نشده است
          </div>
        )}
      </div>
    </AdminShell>
  );
}
