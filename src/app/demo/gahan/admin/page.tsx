"use client";

import dynamic from "next/dynamic";

const AdminDemoApp = dynamic(
  () => import("@/components/demo/gahan/admin-app").then((m) => m.AdminDemoApp),
  { ssr: false, loading: () => <div className="gahan-demo p-10 text-center text-sm">بارگذاری دموی مدیر…</div> }
);

export default function Page() {
  return <AdminDemoApp />;
}
