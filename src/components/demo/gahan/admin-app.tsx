"use client";

import { useMemo, useState } from "react";
import {
  ActivitySquare,
  CalendarCheck2,
  Clock3,
  LogIn,
  LogOut,
  UserRoundX,
  Users,
} from "lucide-react";
import {
  DEMO_EMPLOYEES,
  DEMO_SESSIONS,
  DEMO_WEEK_BARS,
  DEMO_WORKPLACE,
  faDigits,
  formatMinutes,
  type AttendanceStatus,
} from "@/data/gahan/demo-data";
import { useGahanDemo } from "@/data/gahan/demo-store";
import { AdminShell, GlassCard, StatusBadge, type AdminNavId } from "./shell";

function StatCard({
  label,
  value,
  toneIcon,
}: {
  label: string;
  value: string;
  toneIcon: React.ReactNode;
}) {
  return (
    <GlassCard className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium g-text-secondary">{label}</span>
        <span className="text-[#6c63f1] opacity-80">{toneIcon}</span>
      </div>
      <div className="mt-2 text-2xl font-extrabold tabular-nums">{value}</div>
    </GlassCard>
  );
}

const FILTERS: { id: "all" | AttendanceStatus; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "present", label: "حاضر" },
  { id: "absent", label: "غایب" },
  { id: "late", label: "تأخیردار" },
  { id: "checked_out", label: "خروج زده" },
  { id: "working", label: "در محل کار" },
];

export function AdminDemoApp() {
  const { sessions } = useGahanDemo();
  const [active, setActive] = useState<AdminNavId>("dashboard");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(sessions[0]?.id ?? "s1");

  const employees = DEMO_EMPLOYEES.filter((e) => e.role === "employee");
  const stats = useMemo(() => {
    const present = employees.filter((e) =>
      ["present", "working", "late", "checked_out"].includes(e.status)
    ).length;
    return {
      active: employees.length,
      present,
      absent: employees.filter((e) => e.status === "absent").length,
      late: employees.filter((e) => e.status === "late").length,
      checkedOut: employees.filter((e) => e.status === "checked_out").length,
      working: employees.filter((e) => e.status === "working" || e.status === "present").length,
      weekAvg: "۰۷:۳۶",
    };
  }, [employees]);

  const filtered = employees.filter((e) => {
    const okFilter =
      filter === "all" ||
      e.status === filter ||
      (filter === "present" && ["working", "late", "checked_out", "present"].includes(e.status));
    const okQuery = !query || e.name.includes(query) || e.code.includes(query);
    return okFilter && okQuery;
  });

  const allSessions = [...sessions, ...DEMO_SESSIONS.filter((s) => !sessions.some((x) => x.id === s.id))];
  const selected = allSessions.find((s) => s.id === selectedId) ?? allSessions[0];

  return (
    <AdminShell active={active} onNavigate={setActive}>
      {active === "dashboard" && (
        <div className="space-y-5">
          <header>
            <h1 className="text-2xl font-extrabold">داشبورد مدیریت</h1>
            <p className="mt-1 text-sm g-text-secondary">نمای کلی امروز — سازمان نمونه دمو</p>
          </header>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="کارمندان فعال" value={faDigits(stats.active)} toneIcon={<Users className="size-4" />} />
            <StatCard label="حاضر امروز" value={faDigits(stats.present)} toneIcon={<CalendarCheck2 className="size-4" />} />
            <StatCard label="غایب امروز" value={faDigits(stats.absent)} toneIcon={<UserRoundX className="size-4" />} />
            <StatCard label="تأخیر امروز" value={faDigits(stats.late)} toneIcon={<Clock3 className="size-4" />} />
            <StatCard label="ورودهای امروز" value={faDigits(stats.present)} toneIcon={<LogIn className="size-4" />} />
            <StatCard label="خروج‌های امروز" value={faDigits(stats.checkedOut)} toneIcon={<LogOut className="size-4" />} />
            <StatCard label="هم‌اکنون در محل کار" value={faDigits(stats.working)} toneIcon={<ActivitySquare className="size-4" />} />
            <StatCard label="میانگین کارکرد هفته" value={stats.weekAvg} toneIcon={<Clock3 className="size-4" />} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <GlassCard className="p-5 lg:col-span-2">
              <h2 className="text-lg font-bold">ورودهای ۷ روز گذشته</h2>
              <p className="mt-0.5 text-xs g-text-secondary">تعداد رکورد ثبت‌شده در هر روز</p>
              <div className="mt-6 flex h-40 items-end gap-2">
                {DEMO_WEEK_BARS.map((bar) => (
                  <div key={bar.label} className="flex flex-1 flex-col items-center gap-1.5">
                    <div
                      className="w-full max-w-9 rounded-t-lg bg-gradient-to-t from-[#5d47e4]/70 to-[#8182fb]/90"
                      style={{ height: `${Math.max(12, bar.value)}%` }}
                    />
                    <span className="text-[9px] g-text-faint">{bar.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard className="p-5">
              <h2 className="text-lg font-bold">وضعیت امروز</h2>
              <p className="mt-0.5 text-xs g-text-secondary">ترکیب حضور کارمندان</p>
              <div className="mt-6 flex items-center gap-4">
                <div
                  className="relative size-32 shrink-0 rounded-full"
                  style={{
                    background: `conic-gradient(#6c63f1 0 ${
                      (stats.present / stats.active) * 100
                    }%, #14b8a6 0 ${((stats.present + stats.late) / stats.active) * 100}%, #f43f5e 0 100%)`,
                  }}
                >
                  <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-[var(--g-bg)] text-xs font-bold">
                    <span>{faDigits(stats.active)}</span>
                    <span className="g-text-faint">نفر</span>
                  </div>
                </div>
                <div className="space-y-1 text-[11px] g-text-secondary">
                  <div>حاضر / در محل</div>
                  <div>تأخیر</div>
                  <div>غایب</div>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">آخرین رکوردهای امروز</h2>
              <button type="button" onClick={() => setActive("today")} className="text-sm font-semibold text-[#6c63f1]">
                مشاهده همه →
              </button>
            </div>
            <div className="space-y-2">
              {allSessions.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-2xl bg-black/[0.03] px-3 py-3 text-sm dark:bg-white/[0.04]">
                  <div>
                    <div className="font-semibold">{s.employeeName}</div>
                    <div className="text-xs g-text-faint">
                      {s.checkIn}
                      {s.checkOut ? ` – ${s.checkOut}` : ""}
                    </div>
                  </div>
                  <StatusBadge
                    tone={
                      s.status === "late" ? "warning" : s.status === "absent" ? "danger" : "success"
                    }
                  >
                    {s.status === "working"
                      ? "در محل کار"
                      : s.status === "late"
                        ? "تأخیر"
                        : s.status === "checked_out"
                          ? "خروج"
                          : s.status}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {active === "today" && (
        <div className="space-y-4">
          <header>
            <h1 className="text-2xl font-extrabold">حضور امروز</h1>
            <p className="mt-1 text-sm g-text-secondary">شنبه ۱۴ شهریور ۱۴۰۴</p>
          </header>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی نام یا کد…"
              className="rounded-full border border-[color:var(--g-border-line)] bg-white/70 px-4 py-2 text-sm outline-none dark:bg-white/5"
            />
            <StatusBadge tone="brand">{faDigits(filtered.length)} رکورد</StatusBadge>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-3.5 py-2 text-[11px] font-bold ${
                  filter === f.id
                    ? "bg-[#6c63f1]/15 text-[#5d47e4] ring-1 ring-[#6c63f1]/30"
                    : "g-glass"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <GlassCard className="overflow-hidden p-0">
            <div className="divide-y divide-black/5 dark:divide-white/10">
              {filtered.map((e) => (
                <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-xs g-text-faint">
                      کد {faDigits(e.code)} · {e.checkIn ? `ورود ${e.checkIn}` : "بدون ورود"}
                      {e.checkOut ? ` · خروج ${e.checkOut}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      tone={
                        e.status === "absent"
                          ? "danger"
                          : e.status === "late"
                            ? "warning"
                            : e.status === "checked_out"
                              ? "info"
                              : "success"
                      }
                    >
                      {e.status === "working"
                        ? "در محل کار"
                        : e.status === "late"
                          ? "تأخیردار"
                          : e.status === "checked_out"
                            ? "خروج زده"
                            : e.status === "absent"
                              ? "غایب"
                              : "حاضر"}
                    </StatusBadge>
                    <span className="text-xs g-text-secondary">{formatMinutes(e.workedMinutes)}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {selected && (
            <GlassCard className="p-5">
              <h2 className="font-bold">جزئیات نمونه جلسه</h2>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <div className="g-text-faint text-xs">کارمند</div>
                  <div className="font-semibold">{selected.employeeName}</div>
                </div>
                <div>
                  <div className="g-text-faint text-xs">فاصله GPS</div>
                  <div className="font-semibold">{faDigits(selected.distanceM)} متر</div>
                </div>
              </div>
              <div className="mt-4 flex h-28 items-center justify-center rounded-2xl border border-dashed border-[#6c63f1]/40 bg-[#6c63f1]/5 text-xs g-text-secondary">
                نقشه شبیه‌سازی‌شده نقطه ثبت
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {active === "employees" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-extrabold">کارمندان</h1>
          <GlassCard className="overflow-hidden p-0">
            <div className="divide-y divide-black/5 dark:divide-white/10">
              {employees.map((e) => (
                <div key={e.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-xs g-text-faint">
                      {faDigits(e.code)} · {e.workplace} · {e.phone}
                    </div>
                  </div>
                  <StatusBadge tone="success">فعال</StatusBadge>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {active === "reports" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-extrabold">گزارش‌ها</h1>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["روزهای حاضر", "۱۸"],
              ["روزهای غایب", "۲"],
              ["مجموع تأخیر", "۱س ۱۲د"],
              ["اضافه‌کار", "۴س ۲۰د"],
            ].map(([k, v]) => (
              <GlassCard key={k} className="p-4">
                <div className="text-xs g-text-secondary">{k}</div>
                <div className="mt-2 text-xl font-extrabold">{faDigits(v)}</div>
              </GlassCard>
            ))}
          </div>
          <GlassCard className="p-5">
            <h2 className="font-bold">جدول جلسات (نمونه)</h2>
            <div className="mt-3 space-y-2">
              {allSessions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className="flex w-full items-center justify-between rounded-2xl bg-black/[0.03] px-3 py-3 text-right text-sm dark:bg-white/[0.04]"
                >
                  <span>
                    {s.employeeName} · {s.dateLabel}
                  </span>
                  <span className="g-text-faint">{formatMinutes(s.workedMinutes)}</span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs g-text-faint">در نسخه واقعی گاهان خروجی CSV/Excel از همین فیلترها ساخته می‌شود.</p>
          </GlassCard>
        </div>
      )}

      {active === "workplaces" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-extrabold">موقعیت‌های کاری</h1>
          <GlassCard className="p-5">
            <div className="font-bold">{DEMO_WORKPLACE.name}</div>
            <p className="mt-1 text-sm g-text-secondary">{DEMO_WORKPLACE.address}</p>
            <p className="mt-2 text-xs g-text-faint">شعاع مجاز: {faDigits(DEMO_WORKPLACE.radiusM)} متر</p>
            <div className="mt-4 flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#6c63f1]/40 bg-[#6c63f1]/5 text-sm g-text-secondary">
              پیش‌نمایش نقشه ژئوفنس (شبیه‌سازی)
            </div>
          </GlassCard>
        </div>
      )}

      {active === "leave" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-extrabold">مرخصی</h1>
          <GlassCard className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">سارا محمدی</div>
                <div className="text-xs g-text-faint">روزانه · استحقاقی · ۱۵–۱۶ شهریور</div>
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-full bg-teal-500 px-3 py-1.5 text-xs font-bold text-white">
                  تأیید
                </button>
                <button type="button" className="rounded-full bg-rose-500 px-3 py-1.5 text-xs font-bold text-white">
                  رد
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {active === "schedules" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-extrabold">برنامه کاری</h1>
          <GlassCard className="p-5">
            <div className="font-bold">شیفت ثابت اداری</div>
            <p className="mt-2 text-sm g-text-secondary">شنبه تا چهارشنبه · ۰۸:۰۰ تا ۱۷:۰۰ · جمعه تعطیل</p>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="font-bold">شیفت چرخشی ۳روزه</div>
            <p className="mt-2 text-sm g-text-secondary">صبح / عصر / استراحت — نمونه دمو</p>
          </GlassCard>
        </div>
      )}

      {active === "suspicious" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-extrabold">رویدادهای مشکوک</h1>
          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">دقت پایین GPS</div>
                <div className="text-xs g-text-faint">رضا کریمی · امروز ۰۹:۰۵</div>
              </div>
              <StatusBadge tone="warning">باز</StatusBadge>
            </div>
          </GlassCard>
        </div>
      )}

      {active === "settings" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-extrabold">تنظیمات</h1>
          <div className="grid gap-3 sm:grid-cols-2">
            {["عمومی", "برندینگ", "ممیزی", "پشتیبان‌گیری"].map((tab) => (
              <GlassCard key={tab} className="p-5">
                <div className="font-bold">{tab}</div>
                <p className="mt-2 text-sm g-text-secondary">نمای نمایشی تنظیمات — بدون اتصال به سرور واقعی</p>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
