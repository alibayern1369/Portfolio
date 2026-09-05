"use client";

import dynamic from "next/dynamic";

const EmployeeDemoApp = dynamic(
  () => import("@/components/demo/gahan/employee-app").then((m) => m.EmployeeDemoApp),
  { ssr: false, loading: () => <div className="gahan-demo p-10 text-center text-sm">بارگذاری دموی کارمند…</div> }
);

export default function Page() {
  return <EmployeeDemoApp />;
}
