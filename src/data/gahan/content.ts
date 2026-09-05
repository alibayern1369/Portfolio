export const GAHAN_PROJECT = {
  slug: "gahan",
  title: "سامانه حضور و غیاب گاهان",
  description:
    "سامانه تحت‌وب حضور و غیاب پرسنل با ثبت ورود و خروج، تأیید موقعیت مکانی، مدرک سلفی، گزارش‌های مدیریتی و تجربه موبایلی فارسی.",
  image: "/assets/projects/gahan/admin-dashboard.png",
  tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "PWA"],
  category: "نرم‌افزار اداری",
  featured: true,
  liveUrl: "/demo/gahan",
  githubUrl: "",
  sortOrder: 0,
  content: `## نمای کلی

گاهان یک سامانه حضور و غیاب تحت‌وب است که برای تیم‌های اداری و سازمان‌های فارسی‌زبان طراحی شده. کارمند می‌تواند ورود و خروج را با موقعیت مکانی و عکس سلفی ثبت کند و مدیر وضعیت روزانه، گزارش‌ها و تنظیمات محل کار را از پنل مدیریت دنبال کند.`,
} as const;

export const GAHAN_GALLERY = [
  {
    src: "/assets/projects/gahan/admin-dashboard.png",
    alt: "اسکرین‌شات واقعی داشبورد مدیریت گاهان",
    caption: "داشبورد مدیریت",
  },
  {
    src: "/assets/projects/gahan/admin-today.png",
    alt: "اسکرین‌شات واقعی صفحه حضور امروز گاهان",
    caption: "حضور امروز",
  },
  {
    src: "/assets/projects/gahan/admin-employees.png",
    alt: "اسکرین‌شات واقعی مدیریت کارمندان گاهان",
    caption: "کارمندان",
  },
  {
    src: "/assets/projects/gahan/admin-reports.png",
    alt: "اسکرین‌شات واقعی گزارش‌های گاهان",
    caption: "گزارش‌ها",
  },
  {
    src: "/assets/projects/gahan/admin-workplaces.png",
    alt: "اسکرین‌شات واقعی موقعیت‌های کاری گاهان",
    caption: "موقعیت‌های کاری",
  },
  {
    src: "/assets/projects/gahan/employee-home.png",
    alt: "اسکرین‌شات واقعی خانه کارمند گاهان در موبایل",
    caption: "خانه کارمند",
  },
  {
    src: "/assets/projects/gahan/employee-history.png",
    alt: "اسکرین‌شات واقعی سوابق حضور کارمند",
    caption: "سوابق کارمند",
  },
  {
    src: "/assets/projects/gahan/employee-leave.png",
    alt: "اسکرین‌شات واقعی مرخصی کارمند",
    caption: "مرخصی",
  },
  {
    src: "/assets/projects/gahan/login.png",
    alt: "اسکرین‌شات واقعی صفحه ورود گاهان",
    caption: "ورود",
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
