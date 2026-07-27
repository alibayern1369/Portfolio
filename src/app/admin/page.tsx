import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import db from "@/db";
import { initDatabase } from "@/db";
import { seedDatabase } from "@/db/seed";
import Link from "next/link";
import { FolderKanban, Briefcase, MessageSquareQuote, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await initDatabase();
  await seedDatabase();

  const user = await getSession();
  if (!user) redirect("/admin/login");

  const projRes = await db.execute("SELECT COUNT(*) as c FROM projects");
  const svcRes = await db.execute("SELECT COUNT(*) as c FROM services");
  const testRes = await db.execute("SELECT COUNT(*) as c FROM testimonials");

  const projectCount = Number(projRes.rows[0]?.c ?? 0);
  const serviceCount = Number(svcRes.rows[0]?.c ?? 0);
  const testimonialCount = Number(testRes.rows[0]?.c ?? 0);

  const stats = [
    { label: "پروژه‌ها", value: projectCount, icon: FolderKanban, href: "/admin/projects", color: "bg-blue-500/10 text-blue-500" },
    { label: "خدمات", value: serviceCount, icon: Briefcase, href: "/admin/services", color: "bg-emerald-500/10 text-emerald-500" },
    { label: "نظرات", value: testimonialCount, icon: MessageSquareQuote, href: "/admin/testimonials", color: "bg-purple-500/10 text-purple-500" },
  ];

  return (
    <AdminShell title="داشبورد" description={`خوش آمدید، ${user.username}`}>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="rounded-2xl border border-border bg-card p-4 transition-all hover:border-foreground/20 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold sm:text-3xl">{stat.value}</p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${stat.color}`}>
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <h2 className="mb-4 font-semibold">دسترسی سریع</h2>
          <div className="grid gap-2">
            <Link href="/admin/profile" className="flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-secondary">✏️ ویرایش پروفایل</Link>
            <Link href="/admin/projects" className="flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-secondary">📁 مدیریت پروژه‌ها</Link>
            <Link href="/admin/services" className="flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-secondary">🛠️ مدیریت خدمات</Link>
            <Link href="/admin/settings" className="flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-secondary">⚙️ تنظیمات سایت</Link>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <h2 className="mb-4 font-semibold">پیش‌نمایش</h2>
          <Link href="/" target="_blank" className="flex w-full items-center justify-center gap-2 rounded-xl border border-border p-4 transition-all hover:bg-secondary">
            <Eye className="h-5 w-5" /> مشاهده سایت
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">تغییرات به صورت آنی در سایت اعمال می‌شوند</p>
        </div>
      </div>
    </AdminShell>
  );
}
