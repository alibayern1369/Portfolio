import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GahanDemoProvider } from "@/data/gahan/demo-store";
import "./gahan-demo.css";

export const metadata: Metadata = {
  title: "دموی گاهان",
  description: "دموی تعاملی و ایزوله سامانه حضور و غیاب گاهان با داده ساختگی فارسی.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/demo/gahan" },
};

export default function GahanDemoLayout({ children }: { children: ReactNode }) {
  return <GahanDemoProvider>{children}</GahanDemoProvider>;
}
