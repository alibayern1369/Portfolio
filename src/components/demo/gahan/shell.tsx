"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Building2,
  CalendarClock,
  CalendarHeart,
  ClipboardList,
  FileBarChart,
  History,
  Home,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  UserRound,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  strong = false,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
}) {
  return (
    <div className={cn(strong ? "g-glass-strong" : "g-glass", "rounded-3xl", className)}>
      {children}
    </div>
  );
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
}) {
  const tones = {
    neutral: "bg-slate-500/10 text-slate-600 ring-slate-500/20 dark:text-slate-300",
    success: "bg-teal-500/12 text-teal-700 ring-teal-500/25 dark:text-teal-300",
    warning: "bg-amber-500/12 text-amber-700 ring-amber-500/25 dark:text-amber-300",
    danger: "bg-rose-500/12 text-rose-700 ring-rose-500/25 dark:text-rose-300",
    info: "bg-sky-500/12 text-sky-700 ring-sky-500/25 dark:text-sky-300",
    brand: "bg-[#6c63f1]/12 text-[#5d47e4] ring-[#6c63f1]/25 dark:text-[#a3aaff]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function BrandMark({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "rounded-xl bg-gradient-to-bl from-[#5d47e4] via-[#6c63f1] to-[#8182fb] text-white font-black",
          size === "lg" ? "px-3 py-2 text-lg" : "px-2.5 py-1.5 text-sm"
        )}
      >
        گاهان
      </span>
      <span className="size-2 rounded-full bg-teal-400" />
    </div>
  );
}

export function DemoTopBar() {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
      <Link href="/demo/gahan" className="g-text-secondary hover:underline">
        ← انتخاب نقش
      </Link>
      <Link href="/projects/gahan" className="g-text-secondary hover:underline">
        صفحه پروژه
      </Link>
    </div>
  );
}

const EMP_TABS = [
  { href: "/demo/gahan/employee", label: "خانه", Icon: Home, exact: true },
  { href: "/demo/gahan/employee/leave", label: "مرخصی", Icon: CalendarHeart },
  { href: "/demo/gahan/employee/history", label: "سوابق", Icon: History },
  { href: "/demo/gahan/employee/profile", label: "حساب", Icon: UserRound },
] as const;

export function EmployeePhoneShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="gahan-demo">
      <DemoTopBar />
      <div className="flex justify-center px-4 pb-10 pt-2">
        <div className="g-phone">
          <div className="g-phone-notch" aria-hidden />
          <header className="g-glass sticky top-0 z-20 rounded-none border-x-0 border-t-0 px-4 pb-3 pt-2">
            <div className="flex items-center justify-between">
              <BrandMark />
              <span className="rounded-full bg-[#6c63f1]/12 px-2.5 py-1 text-[10px] font-bold text-[#5d47e4]">
                دمو
              </span>
            </div>
          </header>
          <div className="g-phone-body px-4 py-4">{children}</div>
          <nav
            aria-label="ناوبری کارمند"
            className="g-glass sticky bottom-0 z-20 mt-auto rounded-none border-x-0 border-b-0 px-2 pb-3 pt-2"
          >
            <div className="flex items-stretch justify-around gap-1">
              {EMP_TABS.map(({ href, label, Icon, ...rest }) => {
                const active =
                  "exact" in rest && rest.exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex min-w-[4.5rem] flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-semibold",
                      active ? "text-[#6c63f1]" : "g-text-secondary"
                    )}
                  >
                    <Icon className="size-5" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export const ADMIN_NAV = [
  { id: "dashboard", label: "داشبورد", Icon: LayoutDashboard },
  { id: "today", label: "حضور امروز", Icon: ClipboardList },
  { id: "leave", label: "مرخصی", Icon: CalendarHeart, badge: 1 },
  { id: "employees", label: "کارمندان", Icon: Users },
  { id: "reports", label: "گزارش‌ها", Icon: FileBarChart },
  { id: "workplaces", label: "موقعیت‌های کاری", Icon: Building2 },
  { id: "schedules", label: "برنامه کاری", Icon: CalendarClock },
  { id: "suspicious", label: "رویدادهای مشکوک", Icon: ShieldAlert },
  { id: "settings", label: "تنظیمات", Icon: Settings },
] as const;

export type AdminNavId = (typeof ADMIN_NAV)[number]["id"];

export function AdminShell({
  active,
  onNavigate,
  children,
}: {
  active: AdminNavId;
  onNavigate: (id: AdminNavId) => void;
  children: ReactNode;
}) {
  return (
    <div className="gahan-demo">
      <DemoTopBar />
      <div className="mx-auto flex min-h-[calc(100dvh-52px)] max-w-6xl lg:gap-0">
        <aside className="g-glass sticky top-0 hidden h-[calc(100dvh-52px)] w-64 shrink-0 flex-col rounded-none border-y-0 border-l-0 p-5 lg:flex">
          <div className="mb-8 px-1">
            <BrandMark />
            <p className="mt-2 text-[10px] g-text-faint">سازمان نمونه دمو</p>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
            {ADMIN_NAV.map(({ id, label, Icon, ...rest }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-right transition-colors",
                  active === id
                    ? "bg-[#6c63f1]/15 text-[#5d47e4] dark:text-[#a3aaff]"
                    : "g-text-secondary hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                <Icon className="size-4.5 shrink-0" />
                <span className="flex-1">{label}</span>
                {"badge" in rest && rest.badge ? (
                  <span className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-extrabold text-white">
                    {rest.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex gap-2 overflow-x-auto px-4 py-3 lg:hidden">
            {ADMIN_NAV.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold",
                  active === id ? "bg-[#6c63f1] text-white" : "g-glass"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <main className="flex-1 px-4 pb-10 pt-2 lg:px-8 lg:pt-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
