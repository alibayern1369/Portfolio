"use client";

import dynamic from "next/dynamic";

const AdminDemoApp = dynamic(
  () => import("@/components/demo/gahan/admin-app").then((m) => m.AdminDemoApp),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        در حال بارگذاری دموی مدیر…
      </div>
    ),
  }
);

export default function GahanAdminDemoPage() {
  return <AdminDemoApp />;
}
