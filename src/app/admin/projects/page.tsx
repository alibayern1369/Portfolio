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
              className="flex w-full min-w-0 flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-foreground/10 sm:flex-row sm:items-center sm:gap-4"
            >
              {project.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-28 w-full shrink-0 rounded-lg object-cover sm:h-14 sm:w-20"
                />
              )}
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex min-w-0 items-center gap-2">
                  <h3 className="min-w-0 truncate font-semibold">{project.title}</h3>
                  {project.featured === 1 && (
                    <Star className="h-4 w-4 shrink-0 fill-yellow-500 text-yellow-500" />
                  )}
                </div>
                <p className="mt-0.5 line-clamp-2 break-words text-sm text-muted-foreground">
                  {project.description}
                </p>
                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {project.category}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                <Link
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <ExternalLink className="h-5 w-5" />
                </Link>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Edit className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
