"use client";

import { CalendarDays, Clock3, MapPin, Timer } from "lucide-react";
import {
  DEMO_EMPLOYEE_USER,
  DEMO_WORKPLACE,
  faDigits,
  formatMinutes,
} from "@/data/gahan/demo-data";
import { useGahanDemo } from "@/data/gahan/demo-store";
import { AttendanceFlowDemo } from "./attendance-flow";
import { EmployeePhoneShell, GlassCard, StatusBadge } from "./shell";

export function EmployeeDemoApp() {
  const { checkedIn, checkInTime, checkOutTime, workedBonusMinutes } = useGahanDemo();
  const worked = DEMO_EMPLOYEE_USER.workedMinutes + workedBonusMinutes;

  return (
    <EmployeePhoneShell>
      <div className="space-y-5 pb-4">
        <section>
          <p className="text-xs g-text-secondary">شنبه ۱۴ شهریور ۱۴۰۴</p>
          <h1 className="mt-1 text-xl font-extrabold">سلام، {DEMO_EMPLOYEE_USER.name} 👋</h1>
        </section>

        <GlassCard strong className="p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium g-text-secondary">وضعیت فعلی شما</span>
            {checkedIn ? (
              <StatusBadge tone="success">در محل کار</StatusBadge>
            ) : checkOutTime ? (
              <StatusBadge tone="info">خروج ثبت شد</StatusBadge>
            ) : (
              <StatusBadge>ثبت نشده</StatusBadge>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-black/[0.03] p-3 dark:bg-white/[0.04]">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-teal-700 dark:text-teal-300">
                <Clock3 className="size-3.5" /> آخرین ورود
              </div>
              <p className="mt-1.5 font-bold tabular-nums" dir="ltr">
                {checkInTime ?? "—"}
              </p>
            </div>
            <div className="rounded-2xl bg-black/[0.03] p-3 dark:bg-white/[0.04]">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-500">
                <Clock3 className="size-3.5 rotate-180" /> آخرین خروج
              </div>
              <p className="mt-1.5 font-bold tabular-nums" dir="ltr">
                {checkOutTime ?? "—"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#6c63f1]/10 px-4 py-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5d47e4] dark:text-[#a3aaff]">
              <Timer className="size-4" />
              {checkedIn ? "مدت حضور امروز (زنده)" : "مجموع کار امروز"}
            </span>
            <span className="text-sm font-extrabold tabular-nums">{formatMinutes(worked)}</span>
          </div>
        </GlassCard>

        <AttendanceFlowDemo mode={checkedIn ? "out" : "in"} />

        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium g-text-secondary">محل کاری من</span>
              <MapPin className="size-4 text-[#6c63f1]" />
            </div>
            <div className="mt-2 text-base font-extrabold">{DEMO_WORKPLACE.name}</div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium g-text-secondary">تأخیر امروز</span>
              <CalendarDays className="size-4 text-teal-500" />
            </div>
            <div className="mt-2 text-base font-extrabold">ندارم</div>
          </GlassCard>
        </div>

        <p className="text-center text-[10px] g-text-faint">کد پرسنلی {faDigits(DEMO_EMPLOYEE_USER.code)} · داده ساختگی</p>
      </div>
    </EmployeePhoneShell>
  );
}
