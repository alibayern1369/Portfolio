import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  MapPin,
  Camera,
  Shield,
  Smartphone,
  BarChart3,
  Users,
} from "lucide-react";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { GahanGallery } from "@/components/projects/gahan/gallery";
import { GahanFeatureGrid } from "@/components/projects/gahan/feature-grid";
import { GAHAN_PROJECT, GAHAN_TECH } from "@/data/gahan/content";
import { ensureGahanProject } from "@/db/seed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "سامانه حضور و غیاب گاهان",
  description: GAHAN_PROJECT.description,
  keywords: [
    "سامانه حضور و غیاب",
    "نرم افزار حضور و غیاب",
    "سیستم حضور و غیاب تحت وب",
    "ثبت ورود و خروج پرسنل",
    "حضور و غیاب با موقعیت مکانی",
    "حضور و غیاب با عکس سلفی",
    "گاهان",
  ],
  alternates: { canonical: "/projects/gahan" },
  openGraph: {
    title: "سامانه حضور و غیاب گاهان",
    description: GAHAN_PROJECT.description,
    type: "article",
    url: "/projects/gahan",
    images: [{ url: GAHAN_PROJECT.image, alt: "گاهان — سامانه حضور و غیاب" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "سامانه حضور و غیاب گاهان",
    description: GAHAN_PROJECT.description,
    images: [GAHAN_PROJECT.image],
  },
};

export default async function GahanProjectPage() {
  await ensureGahanProject();

  return (
    <div className="pt-24">
      <Section className="!pb-12">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4" /> بازگشت به پروژه‌ها
        </Link>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            {GAHAN_PROJECT.category}
          </span>
          <span className="text-xs text-muted-foreground">نرم‌افزار اختصاصی</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {GAHAN_PROJECT.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {GAHAN_PROJECT.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/demo/gahan"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" /> دموی تعاملی
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-accent"
          >
            سفارش سامانه مشابه
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {GAHAN_PROJECT.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionTitle
          label="محصول"
          title="حضور و غیاب تحت‌وب، بدون پیچیدگی اضافه"
          description="گاهان فرایند ثبت حضور را برای کارمند ساده و برای مدیر قابل‌ردیابی می‌کند."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "موقعیت مکانی",
              text: "ثبت فقط داخل شعاع محل کار تخصیص‌داده‌شده پذیرفته می‌شود.",
            },
            {
              icon: Camera,
              title: "مدرک سلفی",
              text: "عکس سلفی به‌عنوان مدرک بررسی انسانی ذخیره می‌شود؛ بدون ادعای تشخیص چهره.",
            },
            {
              icon: BarChart3,
              title: "گزارش مدیریتی",
              text: "شاخص روزانه، سوابق، فیلتر و خروجی برای منابع انسانی.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
              <item.icon className="mb-4 h-6 w-6 text-foreground" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle
          label="مسئله"
          title="چرا سازمان‌ها به چنین سامانه‌ای نیاز دارند؟"
          description="ثبت دستی، نبود مدرک مکانی و گزارش‌های پراکنده هزینه و خطای منابع انسانی را بالا می‌برد."
        />
        <div className="mx-auto max-w-3xl space-y-4 text-muted-foreground leading-relaxed">
          <p>
            در بسیاری از دفاتر، ورود و خروج هنوز با دفتر کاغذی، پیامک یا ابزارهای ناهمگون انجام می‌شود.
            نتیجه، اختلاف در ساعات کارکرد، دشواری محاسبه تأخیر و نبود مدرک قابل‌اتکا برای حضور در محل است.
          </p>
          <p>
            گاهان این جریان را در یک سامانه وب فارسی جمع می‌کند: کارمند از موبایل یا دسکتاپ ثبت می‌کند،
            سامانه موقعیت و سلفی را ذخیره می‌کند و مدیر همان روز وضعیت تیم را می‌بیند.
          </p>
        </div>
      </Section>

      <Section>
        <SectionTitle
          label="مخاطب"
          title="برای چه کسب‌وکارهایی مناسب است؟"
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            "دفاتر اداری و شرکت‌های خدماتی",
            "فروشگاه‌ها و شعب حضوری",
            "تیم‌های میدانی با محل کار مشخص",
            "سازمان‌هایی با نیاز به گزارش ماهانه",
            "کسب‌وکارهایی که حضور مکانی مهم است",
            "تیم‌هایی که به رابط فارسی و RTL نیاز دارند",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm"
            >
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle label="قابلیت‌ها" title="آنچه واقعاً پیاده‌سازی شده" />
        <GahanFeatureGrid />
      </Section>

      <Section>
        <SectionTitle
          label="تجربه کارمند"
          title="ثبت حضور در چند مرحله شفاف"
          description="خانه کارمند وضعیت جاری، ساعات امروز و دکمه ورود یا خروج را نشان می‌دهد."
        />
        <ul className="mx-auto max-w-3xl space-y-3 text-muted-foreground">
          <li className="rounded-xl border border-border bg-card px-4 py-3">مشاهده وضعیت حضور و آخرین ورود/خروج</li>
          <li className="rounded-xl border border-border bg-card px-4 py-3">شروع جریان ورود یا خروج با بررسی موقعیت</li>
          <li className="rounded-xl border border-border bg-card px-4 py-3">گرفتن سلفی فشرده‌شده به‌عنوان مدرک</li>
          <li className="rounded-xl border border-border bg-card px-4 py-3">مشاهده سوابق و خلاصه ساعات کارکرد</li>
          <li className="rounded-xl border border-border bg-card px-4 py-3">درخواست مرخصی و پیگیری وضعیت تأیید</li>
        </ul>
      </Section>

      <Section>
        <SectionTitle
          label="تجربه مدیر"
          title="از وضعیت امروز تا گزارش ماهانه"
        />
        <ul className="mx-auto max-w-3xl space-y-3 text-muted-foreground">
          <li className="rounded-xl border border-border bg-card px-4 py-3">داشبورد با شاخص حاضر، غایب، تأخیر و میانگین هفته</li>
          <li className="rounded-xl border border-border bg-card px-4 py-3">تابلوی امروز با فیلتر وضعیت و پیش‌نمایش سلفی</li>
          <li className="rounded-xl border border-border bg-card px-4 py-3">جزئیات هر حضور شامل فاصله GPS و زمان‌ها</li>
          <li className="rounded-xl border border-border bg-card px-4 py-3">مدیریت پرسنل، محل‌های کار و شیفت‌ها</li>
          <li className="rounded-xl border border-border bg-card px-4 py-3">گزارش فیلترشده و خروجی CSV / Excel</li>
        </ul>
      </Section>

      <Section>
        <SectionTitle label="گالری" title="اسکرین‌شات واقعی از گاهان" description="تصاویر مستقیماً از رابط واقعی گاهان با Playwright گرفته شده‌اند." />
        <GahanGallery />
      </Section>

      <Section>
        <SectionTitle
          label="امنیت و حریم خصوصی"
          title="طراحی با حداقل داده حساس در لایه نمایش"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <Shield className="mb-3 h-5 w-5" />
            <h3 className="font-semibold">جداسازی نقش‌ها</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              کارمند و مدیر مسیر و سطح دسترسی جدا دارند. سلفی‌ها در فضای ذخیره‌سازی خصوصی نگه داشته می‌شوند و مدیر از مسیر محافظت‌شده آن‌ها را می‌بیند.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Smartphone className="mb-3 h-5 w-5" />
            <h3 className="font-semibold">دموی عمومی ایزوله</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              دموی این سایت به پایگاه‌داده یا API واقعی گاهان وصل نیست و فقط با داده ساختگی فارسی کار می‌کند.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle label="فناوری" title="استک پیاده‌سازی" />
        <div className="flex flex-wrap gap-2">
          {GAHAN_TECH.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-3xl border border-border bg-card px-6 py-10 text-center md:px-12">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">آماده تجربه دمو یا سفارش مشابه؟</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            دموی تعاملی نقش مدیر و کارمند را بدون اطلاعات واقعی نشان می‌دهد. برای پیاده‌سازی اختصاصی هم می‌توانید تماس بگیرید.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/demo/gahan"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
            >
              باز کردن دموی گاهان
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium hover:bg-accent"
            >
              درخواست سامانه مشابه
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
