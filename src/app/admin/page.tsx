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
  const expRes = await db.execute("SELECT COUNT(*) as c FROM experiences");
  const testRes = await db.execute("SELECT COUNT(*) as c FROM testimonials");

  const projectCount = Number(projRes.rows[0]?.c ?? 0);
  const expCount = Number(expRes.rows[0]?.c ?? 0);
  const testimonialCount = Number(testRes.rows[0]?.c ?? 0);

  const stats = [
    { label: "پروژه‌ها", value: projectCount, icon: FolderKanban, href: "/admin/projects", color: "bg-blue-500/10 text-blue-500" },
    { label: "تجربیات", value: expCount, icon: Briefcase, href: "/admin/experiences", color: "bg-emerald-500/10 text-emerald-500" },
    { label: "نظرات", value: testimonialCount, icon: MessageSquareQuote, href: "/admin/testimonials", color: "bg-purple-500/10 text-purple-500" },
  ];

  return (
    <AdminShell title="داشبورد" description={`خوش آمدید، ${user.username}`}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-card border border-border rounded-2xl p-6 hover:border-foreground/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">دسترسی سریع</h2>
          <div className="grid gap-2">
            <Link href="/admin/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all">✏️ ویرایش پروفایل</Link>
            <Link href="/admin/projects" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all">📁 مدیریت پروژه‌ها</Link>
            <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all">⚙️ تنظیمات سایت</Link>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">پیش‌نمایش</h2>
          <Link href="/" target="_blank" className="flex items-center justify-center gap-2 w-full p-4 border border-border rounded-xl hover:bg-secondary transition-all">
            <Eye className="w-5 h-5" /> مشاهده سایت
          </Link>
          <p className="text-xs text-muted-foreground text-center mt-3">تغییرات به صورت آنی در سایت اعمال می‌شوند</p>
        </div>
      </div>
    </AdminShell>
  );
}
