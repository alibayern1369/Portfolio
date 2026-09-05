export const GAHAN_PROJECT = {
  slug: "gahan",
  title: "سامانه حضور و غیاب گاهان",
  description:
    "سامانه تحت‌وب حضور و غیاب پرسنل با ثبت ورود و خروج، تأیید موقعیت مکانی، مدرک سلفی، گزارش‌های مدیریتی و تجربه موبایلی فارسی.",
  image: "/assets/projects/gahan/cover.svg",
  tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "PWA"],
  category: "نرم‌افزار اداری",
  featured: true,
  liveUrl: "/demo/gahan",
  githubUrl: "",
  sortOrder: 0,
  content: `## نمای کلی

گاهان یک سامانه حضور و غیاب تحت‌وب است که برای تیم‌های اداری و سازمان‌های فارسی‌زبان طراحی شده. کارمند می‌تواند ورود و خروج را با موقعیت مکانی و عکس سلفی ثبت کند و مدیر وضعیت روزانه، گزارش‌ها و تنظیمات محل کار را از پنل مدیریت دنبال کند.

## مسئله

ثبت دستی حضور، نبود مدرک قابل‌اتکا و پراکندگی گزارش‌ها باعث خطای انسانی و اتلاف زمان منابع انسانی می‌شود. گاهان این فرایند را در یک جریان واحد وب‌محور جمع می‌کند.

## مخاطب

سازمان‌ها، دفاتر اداری، فروشگاه‌ها و تیم‌هایی که به حضور مکانی پرسنل و گزارش قابل‌خروج نیاز دارند.`,
} as const;

export const GAHAN_GALLERY = [
  {
    src: "/assets/projects/gahan/admin-dashboard.svg",
    alt: "داشبورد مدیریت گاهان با شاخص‌های حضور و نمودار هفتگی",
    caption: "داشبورد مدیر",
  },
  {
    src: "/assets/projects/gahan/employee-home.svg",
    alt: "صفحه اصلی کارمند گاهان با وضعیت حضور و دکمه ثبت",
    caption: "خانه کارمند",
  },
  {
    src: "/assets/projects/gahan/checkin-flow.svg",
    alt: "جریان سه‌مرحله‌ای ثبت ورود شامل موقعیت، سلفی و موفقیت",
    caption: "جریان ورود و خروج",
  },
  {
    src: "/assets/projects/gahan/today-board.svg",
    alt: "تابلوی وضعیت امروز پرسنل در پنل مدیریت",
    caption: "وضعیت امروز",
  },
  {
    src: "/assets/projects/gahan/mobile.svg",
    alt: "نمای موبایلی ثبت حضور گاهان",
    caption: "تجربه موبایل",
  },
] as const;

export const GAHAN_FEATURES = [
  {
    title: "ثبت ورود و خروج",
    description: "جریان مرحله‌ای برای کارمند: بررسی موقعیت، گرفتن سلفی و ثبت نهایی در سرور.",
  },
  {
    title: "موقعیت مکانی و ژئوفنس",
    description: "هر محل کار شعاع مجاز دارد؛ ثبت فقط در محدوده محل‌های تخصیص‌داده‌شده پذیرفته می‌شود.",
  },
  {
    title: "مدرک سلفی",
    description: "عکس سلفی به‌عنوان مدرک انسانی ذخیره می‌شود؛ سامانه تشخیص چهره خودکار ندارد.",
  },
  {
    title: "محاسبه ساعات کار",
    description: "دقایق کارکرد، تأخیر، خروج زودهنگام و اضافه‌کار بر اساس شیفت محاسبه می‌شود.",
  },
  {
    title: "پنل مدیریت",
    description: "شاخص‌های روزانه، تابلوی امروز، جزئیات هر حضور، مدیریت پرسنل و محل کار.",
  },
  {
    title: "گزارش و خروجی",
    description: "فیلتر بازه زمانی و وضعیت، خلاصه آماری و خروجی CSV یا Excel.",
  },
  {
    title: "مرخصی",
    description: "درخواست مرخصی روزانه یا ساعتی توسط کارمند و تأیید یا رد توسط مدیر.",
  },
  {
    title: "فارسی و موبایل",
    description: "رابط RTL، تقویم جلالی، تم روشن/تیره و تجربه موبایل‌محور برای کارمند.",
  },
] as const;

export const GAHAN_TECH = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Supabase Auth",
  "PostgreSQL",
  "Storage خصوصی سلفی",
  "Leaflet / OSM",
  "PWA",
  "Zod",
] as const;
