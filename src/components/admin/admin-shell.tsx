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
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="md:mr-72">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
