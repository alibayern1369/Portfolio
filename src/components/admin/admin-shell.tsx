"use client";

import { AdminSidebar } from "./sidebar";
import { ThemeToggle } from "../theme-toggle";
import type { ReactNode } from "react";

interface AdminShellProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AdminShell({ children, title, description }: AdminShellProps) {
  return (
    <div className="admin-panel min-h-screen bg-background">
      <AdminSidebar />

      <main className="min-w-0 md:mr-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="flex items-start justify-between gap-3 px-4 py-4 pr-14 sm:px-6 md:items-center md:pr-6">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold sm:text-xl">{title}</h1>
              {description && (
                <p className="mt-0.5 break-words text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="min-w-0 p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
