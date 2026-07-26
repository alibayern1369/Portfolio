"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { Plus, Edit, Trash2, ExternalLink, Star } from "lucide-react";

interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  featured: number;
  image: string;
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = () => {
    fetch("/api/admin/projects")
      .then(res => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then(res => {
        if (res?.projects) setProjects(res.projects);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  return (
    <AdminShell title="پروژه‌ها" description="مدیریت نمونه‌کارها">
      <div className="mb-6">
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium rounded-xl hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          پروژه جدید
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          هنوز پروژه‌ای اضافه نشده
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-foreground/10 transition-all"
            >
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-20 h-14 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{project.title}</h3>
                  {project.featured === 1 && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                <span className="text-xs text-muted-foreground">{project.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
                >
                  <ExternalLink className="w-5 h-5" />
                </Link>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
