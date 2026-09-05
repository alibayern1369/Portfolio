"use client";

import { useRef } from "react";
import { Camera, CheckCircle2, Loader2, LogIn, LogOut, MapPin, Upload } from "lucide-react";
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
  const isIn = mode === "in";

  const submit = () => {
    if (isIn) completeCheckIn();
    else completeCheckOut();
  };

  const onFile = (file?: File | null) => {
    if (!file) {
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
      <GlassCard strong className="p-6 text-center">
        <button
          type="button"
          onClick={simulateLocate}
          className={`mx-auto flex size-44 w-full max-w-56 flex-col items-center justify-center rounded-[2rem] font-black text-white shadow-xl ${
            isIn
              ? "bg-gradient-to-bl from-teal-600 to-teal-400 shadow-teal-600/30"
              : "bg-gradient-to-bl from-rose-600 to-orange-500 shadow-rose-600/30"
          }`}
        >
          {isIn ? <LogIn className="mb-2 size-8" /> : <LogOut className="mb-2 size-8" />}
          <span className="text-lg">{isIn ? "ثبت ورود" : "ثبت خروج"}</span>
          <span className="mt-1 text-[11px] font-semibold opacity-90">با تأیید موقعیت + سلفی</span>
        </button>
        <p className="mt-4 text-[11px] g-text-faint">در دمو، موقعیت و دوربین شبیه‌سازی می‌شوند.</p>
      </GlassCard>
    );
  }

  if (phase === "locating" || phase === "submitting") {
    return (
      <GlassCard strong className="flex flex-col items-center py-12">
        <Loader2 className="size-8 animate-spin text-[#6c63f1]" />
        <p className="mt-3 text-sm g-text-secondary">
          {phase === "locating" ? "در حال بررسی موقعیت…" : "در حال ثبت…"}
        </p>
      </GlassCard>
    );
  }

  if (phase === "located") {
    return (
      <GlassCard strong className="p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-teal-500/15 p-2 text-teal-700">
            <MapPin className="size-5" />
          </div>
          <div>
            <h3 className="font-bold">موقعیت تأیید شد</h3>
            <p className="mt-1 text-sm g-text-secondary">
              {DEMO_WORKPLACE.name} · فاصله {faDigits(18)} متر · شعاع {faDigits(DEMO_WORKPLACE.radiusM)} متر
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPhase("camera")}
          className="mt-5 w-full rounded-2xl bg-[#6c63f1] py-3 text-sm font-bold text-white"
        >
          ادامه به سلفی
        </button>
      </GlassCard>
    );
  }

  if (phase === "camera") {
    return (
      <GlassCard strong className="p-5">
        <h3 className="font-bold">سلفی تأیید</h3>
        <p className="mt-2 text-sm g-text-secondary">دوربین واقعی باز نمی‌شود؛ تصویر نمونه انتخاب کنید.</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6c63f1] py-3 text-sm font-bold text-white"
          >
            <Upload className="size-4" /> انتخاب تصویر
          </button>
          <button
            type="button"
            onClick={() => onFile(null)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl g-glass py-3 text-sm font-bold"
          >
            <Camera className="size-4" /> سلفی ساختگی
          </button>
        </div>
      </GlassCard>
    );
  }

  if (phase === "preview" && selfieDataUrl) {
    return (
      <GlassCard strong className="p-5 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={selfieDataUrl} alt="پیش‌نمایش سلفی دمو" className="mx-auto h-48 w-36 rounded-2xl object-cover" />
        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={submit}
            className="rounded-2xl bg-[#6c63f1] py-3 text-sm font-bold text-white"
          >
            تأیید و ثبت {isIn ? "ورود" : "خروج"}
          </button>
          <button type="button" onClick={() => setPhase("camera")} className="rounded-2xl g-glass py-3 text-sm font-bold">
            گرفتن دوباره
          </button>
        </div>
      </GlassCard>
    );
  }

  if (phase === "success") {
    return (
      <GlassCard strong className="p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-teal-500" />
        <h3 className="mt-3 text-lg font-extrabold">{isIn ? "ورود ثبت شد" : "خروج ثبت شد"}</h3>
        <p className="mt-2 text-sm g-text-secondary">{lastMessage}</p>
        <button
          type="button"
          onClick={resetFlow}
          className="mt-5 rounded-2xl bg-[#6c63f1] px-6 py-2.5 text-sm font-bold text-white"
        >
          بازگشت
        </button>
      </GlassCard>
    );
  }

  return null;
}
