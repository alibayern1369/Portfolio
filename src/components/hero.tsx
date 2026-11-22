"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowDown } from "lucide-react";
import Link from "next/link";

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4";

function ShinyText({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className="hero-shine block bg-clip-text text-transparent"
      style={{
        backgroundImage: "linear-gradient(100deg, #075985 0%, #0284c7 32%, #ffffff 50%, #0284c7 68%, #075985 100%)",
        backgroundSize: "250% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      animate={reduceMotion ? undefined : { backgroundPosition: ["100% 50%", "-100% 50%"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    >{children}</motion.span>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#f7fbff] pt-28 text-slate-950 md:pt-36" aria-labelledby="hero-title">
      <video className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.13]" src={VIDEO_URL} autoPlay loop muted playsInline preload="none" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/90 via-[#f4faff]/80 to-white" />
      <div className="pointer-events-none absolute -right-40 top-1/4 -z-10 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-cyan-100/70 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl gap-5 px-6 text-sm leading-7 text-slate-600 md:grid-cols-2 md:text-base lg:px-10">
        <p className="max-w-md">ما در تیم کیش لند وب، طراحی سایت، تجربه کاربری و توسعه نرم‌افزار را برای رشد کسب‌وکارها کنار هم می‌آوریم.</p>
        <p className="max-w-md md:justify-self-end md:text-left">از ایده تا محصول دیجیتال؛ همراه شما برای ساخت تجربه‌ای سریع، کاربردی و ماندگار.</p>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-16 text-center lg:px-10">
        <motion.p initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-full border border-sky-200 bg-white/70 px-5 py-2 text-xs font-semibold tracking-wide text-sky-800 shadow-sm md:text-sm">تیم طراحی و توسعه محصولات دیجیتال</motion.p>
        <motion.h1 id="hero-title" initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-6xl text-[clamp(2.8rem,8vw,8rem)] font-bold leading-[1.15] tracking-tight">
          <span className="block">با کیش لند وب</span>
          <ShinyText>دیجیتال رشد کنید.</ShinyText>
        </motion.h1>
        <p className="mt-8 max-w-3xl text-base leading-8 text-slate-700 md:text-xl md:leading-9">طراحی و توسعه وب‌سایت، رابط کاربری، نرم‌افزار اختصاصی و اپلیکیشن موبایل برای برندهایی که به تجربه کاربری و نتیجه اهمیت می‌دهند.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="group inline-flex items-center gap-3 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-colors hover:bg-slate-800 md:px-8 md:py-4">شروع همکاری با ما <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /></Link>
          <Link href="/projects" className="inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-7 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-white md:px-8 md:py-4">دیدن نمونه‌کارها</Link>
        </div>
      </div>
      <Link href="#about" className="mx-auto mb-8 flex items-center gap-2 text-xs text-slate-600 transition-colors hover:text-sky-800">آشنایی بیشتر <ArrowDown className="h-4 w-4" /></Link>
    </section>
  );
}
