"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/about", label: "درباره ما" },
  { href: "/services", label: "خدمات" },
  { href: "/projects", label: "نمونه‌کارها" },
  { href: "/#skills", label: "تخصص‌ها" },
  { href: "/#testimonials", label: "نظرات" },
  { href: "/contact", label: "تماس با ما", contact: true },
];

export function Navbar({ logoText }: { logo?: string; logoText?: string }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/85 text-white backdrop-blur-md"
        dir="rtl"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4 sm:px-8 lg:px-10" aria-label="ناوبری اصلی">
          <Link href="/" className="inline-flex shrink-0 items-center gap-3 text-lg font-semibold text-white transition-opacity hover:opacity-80" aria-label="کیش لند وب، صفحه اصلی">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white" aria-hidden="true"><span className="h-3.5 w-3.5 rounded-full bg-white" /></span>
            <span>{logoText || "کیش لند وب"}</span>
          </Link>

          <div className="hidden items-center gap-0.5 rounded-full border border-gray-700 bg-black/45 p-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-white/80 transition-colors duration-300 hover:bg-white/10 hover:text-white xl:px-4"
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
                {link.contact && <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-label={isMobileOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.nav
            id="mobile-navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[73px] z-40 border-b border-gray-700 bg-black/95 px-6 py-4 text-white shadow-xl backdrop-blur-md lg:hidden"
            dir="rtl"
            aria-label="ناوبری موبایل"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                  {link.label}
                  {link.contact && <ArrowLeft className="h-4 w-4" aria-hidden="true" />}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
