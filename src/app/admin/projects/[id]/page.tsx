"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Save, ArrowRight, Plus, X } from "lucide-react";
import Link from "next/link";

interface ProjectData {
  slug: string;
  title: string;
  description: string;
  content: string;
  image: string;
  tags: string;
  category: string;
  featured: number;
  live_url: string;
  github_url: string;
  sort_order: number;
}

export default function AdminProjectEditPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [data, setData] = useState<ProjectData>({
    slug: "",
    title: "",
    description: "",
    content: "",
    image: "/images/projects/project-1.jpg",
    tags: "[]",
    category: "",
    featured: 0,
    live_url: "",
    github_url: "",
    sort_order: 0
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/projects/${params.id}`)
        .then(res => {
          if (res.status === 401) {
            router.push("/admin/login");
            return null;
          }
          return res.json();
        })
        .then(res => {
          if (res?.project) {
            setData(res.project);
            try {
              setTags(JSON.parse(res.project.tags || "[]"));
            } catch {
              setTags([]);
            }
          }
          setLoading(false);
        });
    }
  }, [params.id, isNew, router]);

  const handleSave = async () => {
    setSaving(true);
    
    const url = isNew ? "/api/admin/projects" : `/api/admin/projects/${params.id}`;
    const method = isNew ? "POST" : "PUT";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, tags })
    });

    setSaving(false);
    router.push("/admin/projects");
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  if (loading) {
    return (
      <AdminShell title="پروژه">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={isNew ? "پروژه جدید" : "ویرایش پروژه"}>
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        بازگشت به لیست
      </Link>

      <div className="max-w-4xl space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">عنوان</label>
              <input
                type="text"
                value={data.title}
                onChange={e => setData({...data, title: e.target.value})}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">اسلاگ (URL)</label>
              <input
                type="text"
                dir="ltr"
                value={data.slug}
                onChange={e => setData({...data, slug: e.target.value})}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none text-left"
                placeholder="my-project"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">دسته‌بندی</label>
              <input
                type="text"
                value={data.category}
                onChange={e => setData({...data, category: e.target.value})}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none"
                placeholder="اپلیکیشن وب"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">تصویر (مسیر)</label>
              <input
                type="text"
                dir="ltr"
                value={data.image}
                onChange={e => setData({...data, image: e.target.value})}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none text-left"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">لینک دمو</label>
              <input
                type="url"
                dir="ltr"
                value={data.live_url}
                onChange={e => setData({...data, live_url: e.target.value})}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none text-left"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">لینک گیت‌هاب</label>
              <input
                type="url"
                dir="ltr"
                value={data.github_url}
                onChange={e => setData({...data, github_url: e.target.value})}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none text-left"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">توضیح کوتاه</label>
            <textarea
              value={data.description}
              onChange={e => setData({...data, description: e.target.value})}
              rows={2}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none resize-none"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">محتوا (مارک‌داون)</label>
            <textarea
              value={data.content}
              onChange={e => setData({...data, content: e.target.value})}
              rows={8}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none resize-none font-mono text-sm"
              dir="rtl"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">تگ‌ها</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-lg text-sm">
                  {tag}
                  <button onClick={() => setTags(tags.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-xl focus:border-foreground/20 focus:outline-none text-sm"
                placeholder="تگ جدید"
              />
              <button onClick={addTag} className="px-4 py-2 bg-secondary rounded-xl hover:bg-accent">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={data.featured === 1}
              onChange={e => setData({...data, featured: e.target.checked ? 1 : 0})}
              className="w-5 h-5 rounded"
            />
            <label htmlFor="featured" className="text-sm font-medium">نمایش در صفحه اصلی (ویژه)</label>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>
    </AdminShell>
  );
}
