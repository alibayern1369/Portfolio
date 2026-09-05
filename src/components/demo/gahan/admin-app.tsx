"use client";

import { useMemo, useState } from "react";
import {
  DEMO_EMPLOYEES,
  DEMO_SESSIONS,
  DEMO_WEEK_BARS,
  faDigits,
  formatMinutes,
  type AttendanceStatus,
} from "@/data/gahan/demo-data";
import { useGahanDemo } from "@/data/gahan/demo-store";
import { DemoShell, GlassCard, StatusPill } from "./shell";

const FILTERS: { id: "all" | AttendanceStatus; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "working", label: "در محل" },
  { id: "late", label: "تأخیر" },
  { id: "checked_out", label: "خروج" },
  { id: "absent", label: "غایب" },
];

export function AdminDemoApp() {
  const { sessions } = useGahanDemo();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(sessions[0]?.id ?? null);

  const employees = DEMO_EMPLOYEES.filter((e) => e.role === "employee");
  const stats = useMemo(() => {
    const present = employees.filter((e) => ["present", "working", "late", "checked_out"].includes(e.status)).length;
    const absent = employees.filter((e) => e.status === "absent").length;
    const late = employees.filter((e) => e.status === "late").length;
    const checkedOut = employees.filter((e) => e.status === "checked_out").length;
    return { present, absent, late, checkedOut, active: employees.length };
  }, [employees]);

  const filteredEmployees = employees.filter((e) => {
    const matchesFilter = filter === "all" || e.status === filter || (filter === "working" && e.status === "present");
    const matchesQuery = !query || e.name.includes(query) || e.code.includes(query);
    return matchesFilter && matchesQuery;
  });

  const allSessions = [...sessions, ...DEMO_SESSIONS.filter((s) => !sessions.some((x) => x.id === s.id))];
  const selected = allSessions.find((s) => s.id === selectedId) ?? allSessions[0];

  return (
    <DemoShell role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">داشبورد مدیریت</h1>
        <p className="mt-1 text-sm text-[#4b5570] dark:text-[#a7b0c8]">نمای کلی وضعیت حضور — داده ساختگی</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["پرسنل فعال", stats.active],
          ["حاضر", stats.present],
          ["غایب", stats.absent],
          ["تأخیر", stats.late],
          ["خروج‌کرده", stats.checkedOut],
        ].map(([label, value]) => (
          <GlassCard key={String(label)} className="!p-4">
            <div className="text-xs text-[#8791ad]">{label}</div>
            <div className="mt-2 text-2xl font-bold">{faDigits(value as number)}</div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h2 className="font-semibold">روند ۷ روز اخیر</h2>
          <div className="mt-6 flex h-40 items-end gap-3">
            {DEMO_WEEK_BARS.map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#5d47e4] to-[#8182fb]"
                  style={{ height: `${bar.value}%` }}
                />
                <span className="text-xs text-[#8791ad]">{bar.label}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="font-semibold">ترکیب حضور امروز</h2>
          <div className="mt-6 flex items-center justify-center">
            <div
              className="relative h-36 w-36 rounded-full"
              style={{
                background: `conic-gradient(#6c63f1 0 ${(stats.present / stats.active) * 100}%, #14b8a6 0 ${((stats.present + stats.late) / stats.active) * 100}%, #f43f5e 0 100%)`,
              }}
            >
              <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white text-sm font-semibold dark:bg-[#101426]">
                {faDigits(stats.active)} نفر
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-xs text-[#4b5570] dark:text-[#a7b0c8]">
            <div>بنفش: حاضر / در محل</div>
            <div>فیروزه‌ای: تأخیر</div>
            <div>قرمز: غایب</div>
          </div>
        </GlassCard>
      </div>

      <div id="today" className="mt-8 scroll-mt-24">
        <GlassCard>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold">وضعیت امروز</h2>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی نام یا کد…"
              className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6c63f1]/40 dark:border-white/10 dark:bg-white/5"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs ${
                  filter === f.id ? "bg-[#6c63f1] text-white" : "bg-white/70 dark:bg-white/5"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {filteredEmployees.map((e) => (
              <div
                key={e.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-3 dark:bg-white/5"
              >
                <div>
                  <div className="font-medium">{e.name}</div>
                  <div className="text-xs text-[#8791ad]">
                    کد {faDigits(e.code)} · {e.checkIn ? `ورود ${e.checkIn}` : "بدون ورود"}
                    {e.checkOut ? ` · خروج ${e.checkOut}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={e.status} />
                  <span className="text-xs text-[#4b5570] dark:text-[#a7b0c8]">{formatMinutes(e.workedMinutes)}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div id="sessions" className="mt-4 grid gap-4 scroll-mt-24 lg:grid-cols-5">
        <GlassCard className="lg:col-span-3">
          <h2 className="font-semibold">سوابق حضور</h2>
          <div className="mt-3 space-y-2">
            {allSessions.slice(0, 8).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedId(s.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-right text-sm transition ${
                  selected?.id === s.id ? "bg-[#6c63f1]/15 ring-1 ring-[#6c63f1]/40" : "bg-white/70 dark:bg-white/5"
                }`}
              >
                <div>
                  <div className="font-medium">{s.employeeName}</div>
                  <div className="text-xs text-[#8791ad]">
                    {s.dateLabel} · {s.checkIn}
                    {s.checkOut ? `–${s.checkOut}` : ""}
                  </div>
                </div>
                <StatusPill status={s.status} />
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <h2 className="font-semibold">جزئیات جلسه</h2>
          {selected ? (
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <div className="text-[#8791ad]">کارمند</div>
                <div className="font-medium">{selected.employeeName}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[#8791ad]">ورود</div>
                  <div>{selected.checkIn}</div>
                </div>
                <div>
                  <div className="text-[#8791ad]">خروج</div>
                  <div>{selected.checkOut ?? "—"}</div>
                </div>
              </div>
              <div>
                <div className="text-[#8791ad]">محل کار</div>
                <div>{selected.workplace}</div>
              </div>
              <div>
                <div className="text-[#8791ad]">فاصله GPS (شبیه‌سازی)</div>
                <div>{faDigits(selected.distanceM)} متر</div>
              </div>
              <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[#6c63f1]/40 bg-[#6c63f1]/5 text-xs text-[#4b5570] dark:text-[#a7b0c8]">
                نقشه ثابت شبیه‌سازی‌شده نقطه ثبت
              </div>
              <div className="flex h-28 items-center justify-center rounded-xl bg-[#c7d2fe] text-xs text-[#4338ca]">
                پیش‌نمایش سلفی ساختگی
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#8791ad]">جلسه‌ای انتخاب نشده</p>
          )}
        </GlassCard>
      </div>

      <div id="reports" className="mt-4 scroll-mt-24">
        <GlassCard>
          <h2 className="font-semibold">خلاصه گزارش ماه (نمونه)</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["روزهای حاضر", "۱۸"],
              ["روزهای غایب", "۲"],
              ["مجموع تأخیر", "۱س ۱۲د"],
              ["اضافه‌کار", "۴س ۲۰د"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/70 p-4 dark:bg-white/5">
                <div className="text-xs text-[#8791ad]">{k}</div>
                <div className="mt-1 text-xl font-bold">{faDigits(v)}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#8791ad]">
            در نسخه واقعی گاهان، خروجی CSV/Excel از همین فیلترها ساخته می‌شود. در دمو فقط خلاصه نمایشی است.
          </p>
        </GlassCard>
      </div>
    </DemoShell>
  );
}
