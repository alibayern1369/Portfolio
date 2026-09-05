"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, ClipboardList, BarChart3, ArrowRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function DemoBanner() {
  return (
    <div className="sticky top-0 z-50 border-b border-amber-500/30 bg-amber-500/15 px-4 py-2 text-center text-sm text-amber-950 backdrop-blur dark:text-amber-100">
      <span className="inline-flex items-center gap-2 font-medium">
        <Info className="h-4 w-4 shrink-0" />
        حالت دمو — تمام اطلاعات ساختگی است و به سامانه واقعی گاهان متصل نیست
      </span>
    </div>
  );
}

export function DemoShell({
  role,
  children,
}: {
  role: "employee" | "admin";
  children: ReactNode;
}) {
  const pathname = usePathname();
  const adminLinks = [
    { href: "/demo/gahan/admin", label: "داشبورد", icon: Home },
    { href: "/demo/gahan/admin#today", label: "امروز", icon: Users },
    { href: "/demo/gahan/admin#sessions", label: "سوابق", icon: ClipboardList },
    { href: "/demo/gahan/admin#reports", label: "گزارش", icon: BarChart3 },
  ];

  return (
    <div className="gahan-demo min-h-screen bg-[#f2f4fa] text-[#101426] dark:bg-[#07090f] dark:text-[#eef1f9]">
      <DemoBanner />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/demo/gahan"
            className="inline-flex items-center gap-1 text-sm text-[#4b5570] hover:text-[#101426] dark:text-[#a7b0c8] dark:hover:text-white"
          >
            <ArrowRight className="h-4 w-4" /> خروج از دمو
          </Link>
          <span className="rounded-full bg-[#6c63f1]/15 px-3 py-1 text-xs font-medium text-[#4f38c9] dark:text-[#a3aaff]">
            {role === "admin" ? "دموی مدیر" : "دموی کارمند"}
          </span>
        </div>
        <Link href="/projects/gahan" className="text-sm text-[#4b5570] hover:underline dark:text-[#a7b0c8]">
          صفحه پروژه
        </Link>
      </div>
      {role === "admin" && (
        <nav className="mx-auto mb-4 flex max-w-6xl gap-2 overflow-x-auto px-4 pb-2">
          {adminLinks.map((link) => {
            const active = pathname === link.href || (link.href.includes("#") && pathname.startsWith("/demo/gahan/admin"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
                  active && !link.href.includes("#")
                    ? "bg-[#6c63f1] text-white"
                    : "bg-white/70 text-[#4b5570] hover:bg-white dark:bg-white/5 dark:text-[#a7b0c8]"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
      <div className="mx-auto max-w-6xl px-4 pb-24 md:pb-10">{children}</div>
    </div>
  );
}

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/70 bg-white/70 p-5 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    present: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
    working: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
    late: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
    absent: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200",
    checked_out: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200",
  };
  const labels: Record<string, string> = {
    present: "حاضر",
    working: "در محل کار",
    late: "تأخیر",
    absent: "غایب",
    checked_out: "خروج‌کرده",
  };
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", map[status] ?? "bg-secondary")}>
      {labels[status] ?? status}
    </span>
  );
}
