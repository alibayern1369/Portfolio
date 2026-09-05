import Link from "next/link";
import { Shield, UserRound } from "lucide-react";

export default function GahanDemoEntryPage() {
  return (
    <div className="gahan-demo">
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 py-16">
        <Link href="/projects/gahan" className="mb-8 inline-flex w-fit text-sm g-text-secondary hover:underline">
          ← بازگشت به صفحه پروژه
        </Link>

        <p className="text-sm font-bold text-[#6c63f1]">گاهان</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">دموی گاهان</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed g-text-secondary">
          تجربه نزدیک به رابط واقعی گاهان، با داده ساختگی و بدون اتصال به پایگاه‌داده یا API تولید.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/demo/gahan/admin"
            className="g-glass-strong rounded-3xl p-6 transition hover:-translate-y-0.5"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#6c63f1]/15 text-[#5d47e4]">
              <Shield className="size-5" />
            </div>
            <h2 className="mt-4 text-lg font-bold">ورود به دمو مدیر</h2>
            <p className="mt-2 text-sm g-text-secondary">
              داشبورد، حضور امروز، کارمندان، گزارش‌ها، محل کار، مرخصی و تنظیمات.
            </p>
          </Link>

          <Link
            href="/demo/gahan/employee"
            className="g-glass-strong rounded-3xl p-6 transition hover:-translate-y-0.5"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-700">
              <UserRound className="size-5" />
            </div>
            <h2 className="mt-4 text-lg font-bold">ورود به دمو کارمند</h2>
            <p className="mt-2 text-sm g-text-secondary">
              قاب موبایل واقعی‌نما با خانه، ورود/خروج، مرخصی، سوابق و حساب.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
