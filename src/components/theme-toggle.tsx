"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  if (!mounted) {
    return (
      <button
        className="relative h-9 w-9 rounded-full border border-border bg-secondary"
        aria-label="تغییر تم"
      />
    );
  }

  const modes = [
    { key: "light", label: "روشن", icon: Sun },
    { key: "dark", label: "تاریک", icon: Moon },
    { key: "system", label: "سیستم", icon: Monitor },
  ];

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={cn(
          "relative h-9 w-9 rounded-full border border-border",
          "bg-secondary hover:bg-accent transition-all duration-300",
          "flex items-center justify-center",
          "hover:scale-110 active:scale-95"
        )}
        aria-label="تغییر تم"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </button>

      {open && (
        <div
          className="absolute left-0 top-12 z-50 min-w-[140px] rounded-xl border border-border bg-card p-1.5 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {modes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => { setTheme(mode.key); setOpen(false); }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                theme === mode.key
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <mode.icon className="h-4 w-4" />
              {mode.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
