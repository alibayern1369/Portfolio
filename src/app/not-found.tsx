import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold tracking-tighter gradient-text">
          ۴۰۴
        </h1>
        <h2 className="mt-4 text-2xl font-semibold">صفحه یافت نشد</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          صفحه‌ای که دنبالش هستید وجود ندارد یا جابه‌جا شده است.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-90"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
