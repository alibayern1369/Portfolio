"use client";

import { useRef } from "react";
import { Camera, CheckCircle2, Loader2, MapPin, Upload } from "lucide-react";
import { useGahanDemo } from "@/data/gahan/demo-store";
import { DEMO_WORKPLACE, faDigits } from "@/data/gahan/demo-data";
import { GlassCard } from "./shell";

export function AttendanceFlowDemo({ mode }: { mode: "in" | "out" }) {
  const {
    phase,
    selfieDataUrl,
    setPhase,
    setSelfie,
    simulateLocate,
    completeCheckIn,
    completeCheckOut,
    resetFlow,
    lastMessage,
  } = useGahanDemo();
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (mode === "in") completeCheckIn();
    else completeCheckOut();
  };

  const onFile = (file?: File | null) => {
    if (!file) {
      // Simulated avatar placeholder when user cancels / no camera
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400"><rect width="100%" height="100%" fill="#c7d2fe"/><circle cx="160" cy="150" r="60" fill="#6366f1"/><rect x="90" y="230" width="140" height="100" rx="40" fill="#6366f1"/></svg>`;
      setSelfie(`data:image/svg+xml;base64,${btoa(svg)}`);
      setPhase("preview");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSelfie(String(reader.result));
      setPhase("preview");
    };
    reader.readAsDataURL(file);
  };

  if (phase === "idle") {
    return (
      <GlassCard>
        <h3 className="text-lg font-semibold">{mode === "in" ? "ثبت ورود" : "ثبت خروج"}</h3>
        <p className="mt-2 text-sm text-[#4b5570] dark:text-[#a7b0c8]">
          در دمو، موقعیت و سلفی شبیه‌سازی می‌شوند و به سخت‌افزار واقعی دسترسی داده نمی‌شود.
        </p>
        <button
          type="button"
          onClick={simulateLocate}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#6c63f1] px-5 py-2.5 text-sm font-medium text-white"
        >
          <MapPin className="h-4 w-4" /> شروع جریان {mode === "in" ? "ورود" : "خروج"}
        </button>
      </GlassCard>
    );
  }

  if (phase === "locating") {
    return (
      <GlassCard className="flex flex-col items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-[#6c63f1]" />
        <p className="mt-3 text-sm text-[#4b5570] dark:text-[#a7b0c8]">در حال شبیه‌سازی موقعیت…</p>
      </GlassCard>
    );
  }

  if (phase === "located") {
    return (
      <GlassCard>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">موقعیت تأیید شد (شبیه‌سازی)</h3>
            <p className="mt-1 text-sm text-[#4b5570] dark:text-[#a7b0c8]">
              {DEMO_WORKPLACE.name} · فاصله {faDigits(18)} متر از مرکز · شعاع مجاز {faDigits(DEMO_WORKPLACE.radiusM)} متر
            </p>
          </div>
        </div>
        <div className="mt-5 flex h-40 items-center justify-center rounded-xl border border-dashed border-[#6c63f1]/40 bg-[#6c63f1]/5">
          <div className="text-center text-sm text-[#4b5570] dark:text-[#a7b0c8]">
            <div className="mx-auto mb-2 h-16 w-16 rounded-full border-2 border-dashed border-[#6c63f1]" />
            نقشه شبیه‌سازی‌شده محدوده محل کار
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPhase("camera")}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#6c63f1] px-5 py-2.5 text-sm font-medium text-white"
        >
          ادامه به سلفی
        </button>
      </GlassCard>
    );
  }

  if (phase === "camera") {
    return (
      <GlassCard>
        <h3 className="font-semibold">سلفی تأیید (شبیه‌سازی)</h3>
        <p className="mt-2 text-sm text-[#4b5570] dark:text-[#a7b0c8]">
          می‌توانید یک تصویر نمونه انتخاب کنید یا از تصویر ساختگی استفاده کنید. دوربین واقعی فعال نمی‌شود.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full bg-[#6c63f1] px-5 py-2.5 text-sm font-medium text-white"
          >
            <Upload className="h-4 w-4" /> انتخاب تصویر نمونه
          </button>
          <button
            type="button"
            onClick={() => onFile(null)}
            className="inline-flex items-center gap-2 rounded-full border border-[#6c63f1]/30 px-5 py-2.5 text-sm"
          >
            <Camera className="h-4 w-4" /> استفاده از سلفی ساختگی
          </button>
        </div>
      </GlassCard>
    );
  }

  if (phase === "preview" && selfieDataUrl) {
    return (
      <GlassCard>
        <h3 className="font-semibold">پیش‌نمایش سلفی</h3>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selfieDataUrl}
          alt="پیش‌نمایش سلفی دمو"
          className="mt-4 mx-auto h-48 w-40 rounded-2xl object-cover"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-full bg-[#6c63f1] px-5 py-2.5 text-sm font-medium text-white"
          >
            تأیید و ثبت {mode === "in" ? "ورود" : "خروج"}
          </button>
          <button
            type="button"
            onClick={() => setPhase("camera")}
            className="rounded-full border border-[#6c63f1]/30 px-5 py-2.5 text-sm"
          >
            گرفتن دوباره
          </button>
        </div>
      </GlassCard>
    );
  }

  if (phase === "submitting") {
    return (
      <GlassCard className="flex flex-col items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-[#6c63f1]" />
        <p className="mt-3 text-sm">در حال ثبت دمو…</p>
      </GlassCard>
    );
  }

  if (phase === "success") {
    return (
      <GlassCard className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h3 className="mt-3 text-lg font-semibold">{mode === "in" ? "ورود ثبت شد" : "خروج ثبت شد"}</h3>
        <p className="mt-2 text-sm text-[#4b5570] dark:text-[#a7b0c8]">{lastMessage}</p>
        <button
          type="button"
          onClick={resetFlow}
          className="mt-4 rounded-full bg-[#6c63f1] px-5 py-2.5 text-sm font-medium text-white"
        >
          بازگشت
        </button>
      </GlassCard>
    );
  }

  return null;
}
