"use client";

import dynamic from "next/dynamic";

const Comp = dynamic(
  () => import("@/components/demo/gahan/employee-pages").then((m) => m.EmployeeLeaveDemo),
  { ssr: false }
);

export default function Page() {
  return <Comp />;
}
