"use client";

import dynamic from "next/dynamic";

const EmployeeDemoApp = dynamic(
  () => import("@/components/demo/gahan/employee-app").then((m) => m.EmployeeDemoApp),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        در حال بارگذاری دموی کارمند…
      </div>
    ),
  }
);

export default function GahanEmployeeDemoPage() {
  return <EmployeeDemoApp />;
}
