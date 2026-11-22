"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4";

function ShinyText({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className="block bg-clip-text text-transparent"
      style={{
        backgroundImage: "linear-gradient(100deg, #64CEFB 0%, #64CEFB 35%, #ffffff 50%, #64CEFB 65%, #64CEFB 100%)",
        backgroundSize: "250% 100%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      animate={reduceMotion ? undefined : { backgroundPosition: ["-100% 50%", "100% 50%"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex h-screen min-h-[650px] flex-col overflow-hidden bg-black text-white"
      dir="rtl"
    >
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-black/55" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-4 px-6 pt-28 text-right text-sm leading-7 text-white/80 sm:px-8 lg:grid-cols-2 lg:px-10 lg:pt-36 lg:text-base">
        <p className="max-w-xl">ما در تیم کیش لند وب با طراحی سایت، تجربه کاربری و توسعه نرم‌افزار، ایده‌های کسب‌وکارها را به محصول دیجیتال کاربردی تبدیل می‌کنیم.</p>
        <p className="max-w-md lg:justify-self-end lg:text-left">از طراحی تا راه‌اندازی، همراه رشد دیجیتال کسب‌وکار شما هستیم.</p>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 pb-16 pt-8 text-center sm:px-8 lg:px-10">
        <p className="mb-6 text-xs font-medium tracking-tight text-white/80 md:text-sm">طراحی سایت و محصول دیجیتال با تیم کیش لند وب</p>
        <h1 id="hero-title" className="text-5xl font-medium leading-[0.95] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
          <span className="block text-white">با هم بسازیم</span>
          <ShinyText>آینده دیجیتال.</ShinyText>
        </h1>
        <Link
          href="/contact"
          className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/30 bg-black px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/60 hover:bg-gray-900 md:px-8 md:py-4"
        >
          شروع همکاری با ما
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
