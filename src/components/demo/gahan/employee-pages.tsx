"use client";

import { DEMO_EMPLOYEE_USER, formatMinutes } from "@/data/gahan/demo-data";
import { useGahanDemo } from "@/data/gahan/demo-store";
import { EmployeePhoneShell, GlassCard, StatusBadge } from "./shell";

export function EmployeeHistoryDemo() {
  const { sessions } = useGahanDemo();
  const mine = sessions.filter((s) => s.employeeId === DEMO_EMPLOYEE_USER.id);

  return (
    <EmployeePhoneShell>
      <div className="space-y-4 pb-4">
        <h1 className="text-xl font-extrabold">سوابق حضور</h1>
        <div className="flex gap-2">
          {["امروز", "این ماه", "ماه قبل"].map((f, i) => (
            <span
              key={f}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                i === 1 ? "bg-[#6c63f1]/15 text-[#5d47e4]" : "g-glass"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          {mine.map((s) => (
            <GlassCard key={s.id} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold">{s.dateLabel}</div>
                  <div className="text-xs g-text-faint">
                    {s.checkIn}
                    {s.checkOut ? ` تا ${s.checkOut}` : " · باز"}
                  </div>
                </div>
                <div className="text-left">
                  <StatusBadge tone={s.status === "working" ? "success" : "info"}>
                    {s.status === "working" ? "باز" : "کامل"}
                  </StatusBadge>
                  <div className="mt-1 text-xs font-bold">{formatMinutes(s.workedMinutes)}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </EmployeePhoneShell>
  );
}

export function EmployeeLeaveDemo() {
  return (
    <EmployeePhoneShell>
      <div className="space-y-4 pb-4">
        <h1 className="text-xl font-extrabold">مرخصی</h1>
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4">
            <div className="text-xs g-text-secondary">مانده استحقاقی</div>
            <div className="mt-2 text-2xl font-extrabold">۱۲ روز</div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="text-xs g-text-secondary">مانده استعلاجی</div>
            <div className="mt-2 text-2xl font-extrabold">۳ روز</div>
          </GlassCard>
        </div>
        <GlassCard strong className="p-5">
          <h2 className="font-bold">درخواست جدید</h2>
          <p className="mt-2 text-sm g-text-secondary">فرم نمایشی — در دمو ارسال واقعی انجام نمی‌شود.</p>
          <button type="button" className="mt-4 w-full rounded-2xl bg-[#6c63f1] py-3 text-sm font-bold text-white">
            ثبت درخواست (دمو)
          </button>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">روزانه · استحقاقی</div>
              <div className="text-xs g-text-faint">۱۵ شهریور</div>
            </div>
            <StatusBadge tone="warning">در انتظار</StatusBadge>
          </div>
        </GlassCard>
      </div>
    </EmployeePhoneShell>
  );
}

export function EmployeeProfileDemo() {
  return (
    <EmployeePhoneShell>
      <div className="space-y-4 pb-4">
        <h1 className="text-xl font-extrabold">حساب کاربری</h1>
        <GlassCard strong className="space-y-3 p-5 text-sm">
          <div className="flex justify-between"><span className="g-text-secondary">نام</span><span className="font-bold">{DEMO_EMPLOYEE_USER.name}</span></div>
          <div className="flex justify-between"><span className="g-text-secondary">کد</span><span className="font-bold">{DEMO_EMPLOYEE_USER.code}</span></div>
          <div className="flex justify-between"><span className="g-text-secondary">تلفن</span><span className="font-bold" dir="ltr">{DEMO_EMPLOYEE_USER.phone}</span></div>
          <div className="flex justify-between"><span className="g-text-secondary">محل کار</span><span className="font-bold">{DEMO_EMPLOYEE_USER.workplace}</span></div>
        </GlassCard>
        <button type="button" className="w-full rounded-2xl g-glass py-3 text-sm font-bold">
          تغییر رمز (دمو)
        </button>
      </div>
    </EmployeePhoneShell>
  );
}
