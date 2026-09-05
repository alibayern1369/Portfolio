"use client";

import { DEMO_EMPLOYEE_USER, DEMO_WORKPLACE, faDigits, formatMinutes } from "@/data/gahan/demo-data";
import { useGahanDemo } from "@/data/gahan/demo-store";
import { AttendanceFlowDemo } from "./attendance-flow";
import { DemoShell, GlassCard, StatusPill } from "./shell";

export function EmployeeDemoApp() {
  const { checkedIn, checkInTime, checkOutTime, workedBonusMinutes, sessions } = useGahanDemo();
  const todaySessions = sessions.filter((s) => s.employeeId === DEMO_EMPLOYEE_USER.id).slice(0, 4);
  const worked = DEMO_EMPLOYEE_USER.workedMinutes + workedBonusMinutes;

  return (
    <DemoShell role="employee">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">سلام، {DEMO_EMPLOYEE_USER.name}</h1>
        <p className="mt-1 text-sm text-[#4b5570] dark:text-[#a7b0c8]">
          دموی کارمند · {DEMO_WORKPLACE.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="md:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={checkedIn ? "working" : checkOutTime ? "checked_out" : "absent"} />
            <span className="text-sm text-[#4b5570] dark:text-[#a7b0c8]">کد پرسنلی {faDigits(DEMO_EMPLOYEE_USER.code)}</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
            <div>
              <div className="text-[#8791ad]">ورود</div>
              <div className="mt-1 text-lg font-semibold">{checkInTime ?? "—"}</div>
            </div>
            <div>
              <div className="text-[#8791ad]">خروج</div>
              <div className="mt-1 text-lg font-semibold">{checkOutTime ?? "—"}</div>
            </div>
            <div>
              <div className="text-[#8791ad]">مدت حضور تقریبی</div>
              <div className="mt-1 text-lg font-semibold">{formatMinutes(worked)}</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-sm text-[#8791ad]">تأخیر ماه (نمونه)</div>
          <div className="mt-2 text-3xl font-bold">{formatMinutes(DEMO_EMPLOYEE_USER.lateMinutes || 24)}</div>
          <p className="mt-2 text-xs text-[#4b5570] dark:text-[#a7b0c8]">اعداد دمو ساختگی هستند</p>
        </GlassCard>
      </div>

      <div className="mt-4">
        <AttendanceFlowDemo mode={checkedIn ? "out" : "in"} />
      </div>

      <GlassCard className="mt-4">
        <h2 className="font-semibold">سوابق اخیر</h2>
        <div className="mt-3 space-y-2">
          {todaySessions.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/60 px-3 py-3 text-sm dark:bg-white/5"
            >
              <div>
                <div className="font-medium">{s.dateLabel}</div>
                <div className="text-[#8791ad]">
                  {s.checkIn}
                  {s.checkOut ? ` تا ${s.checkOut}` : " · هنوز باز"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={s.status} />
                <span className="text-[#4b5570] dark:text-[#a7b0c8]">{formatMinutes(s.workedMinutes)}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </DemoShell>
  );
}
