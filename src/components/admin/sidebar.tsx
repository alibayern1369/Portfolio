"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Briefcase,
  Wrench,
  MessageSquareQuote,
  Share2,
  Settings,
  FileText,
  LogOut,
  Menu,
  X,
  Users
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/profile", label: "پروفایل", icon: User },
  { href: "/admin/projects", label: "پروژه‌ها", icon: FolderKanban },
  { href: "/admin/experiences", label: "تجربیات", icon: Briefcase },
  { href: "/admin/skills", label: "مهارت‌ها", icon: Wrench },
  { href: "/admin/testimonials", label: "نظرات", icon: MessageSquareQuote },
  { href: "/admin/socials", label: "شبکه‌های اجتماعی", icon: Share2 },
  { href: "/admin/about", label: "درباره من", icon: FileText },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-border">
        <Link href="/" className="text-xl font-bold">
          <span className="gradient-text">پنل مدیریت</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          خروج
        </button>
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground border border-border hover:bg-secondary transition-all"
        >
          مشاهده سایت ←
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-card border border-border rounded-xl md:hidden"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-72 bg-card border-l border-border transform transition-transform md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-72 md:fixed md:inset-y-0 md:right-0 bg-card border-l border-border">
        <SidebarContent />
      </aside>
    </>
  );
}
