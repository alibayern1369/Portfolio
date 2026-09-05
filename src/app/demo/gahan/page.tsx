import Link from "next/link";
import { ArrowRight, Shield, UserRound } from "lucide-react";
import { DemoBanner } from "@/components/demo/gahan/shell";

export default function GahanDemoEntryPage() {
  return (
    <div className="gahan-demo min-h-screen bg-[#f2f4fa] text-[#101426] dark:bg-[#07090f] dark:text-[#eef1f9]">
      <DemoBanner />
      <div className="mx-auto flex min-h-[calc(100vh-44px)] max-w-3xl flex-col justify-center px-6 py-16">
        <Link
          href="/projects/gahan"
          className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-[#4b5570] hover:text-[#101426] dark:text-[#a7b0c8]"
        >
          <ArrowRight className="h-4 w-4" /> بازگشت به صفحه پروژه
        </Link>

        <p className="text-sm font-medium text-[#6c63f1]">گاهان</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">دموی گاهان</h1>
        <p className="mt-4 max-w-xl text-[#4b5570] dark:text-[#a7b0c8] leading-relaxed">
          یک تجربه سبک و ایزوله از نقش مدیر و کارمند. بدون پایگاه‌داده واقعی، بدون کاربران حقیقی و بدون اتصال به زیرساخت تولید گاهان.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/demo/gahan/admin"
            className="group rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6c63f1]/15 text-[#5d47e4]">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">ورود به دمو مدیر</h2>
            <p className="mt-2 text-sm text-[#4b5570] dark:text-[#a7b0c8]">
              داشبورد، وضعیت امروز، سوابق و خلاصه گزارش با داده ساختگی.
            </p>
          </Link>

          <Link
            href="/demo/gahan/employee"
            className="group rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-700 dark:text-teal-300">
              <UserRound className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">ورود به دمو کارمند</h2>
            <p className="mt-2 text-sm text-[#4b5570] dark:text-[#a7b0c8]">
              وضعیت حضور، جریان ورود/خروج شبیه‌سازی‌شده و سوابق اخیر.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
