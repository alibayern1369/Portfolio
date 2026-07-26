# علی دلاور — نمونه‌کارهای شخصی

یک پورتفولیوی شخصی حرفه‌ای، مدرن و مینیمال ساخته شده با Next.js 15، React 19، TypeScript، Tailwind CSS و Framer Motion.

## 🚀 شروع کار

### پیش‌نیازها

- Node.js 18+
- npm یا yarn

### نصب

```bash
npm install
```

### توسعه

```bash
npm run dev
```

در مرورگر [http://localhost:3000](http://localhost:3000) را باز کنید.

### بیلد

```bash
npm run build
npm start
```

## 🌐 دیپلوی روی Vercel

1. این مخزن را روی گیت‌هاب پوش کنید
2. آن را در [vercel.com/new](https://vercel.com/new) ایمپورت کنید
3. Vercel به طور خودکار Next.js را شناسایی و دیپلوی می‌کند

نیازی به متغیرهای محیطی نیست. نیازی به دیتابیس نیست. کاملاً استاتیک.

## 📝 ویرایش محتوا

تمام محتوا در پوشه `content/` قرار دارد. **نیازی به ویرایش کامپوننت‌های ری‌اکت نیست.**

### اطلاعات پروفایل

فایل `content/profile.json` را ویرایش کنید:

```json
{
  "name": "نام شما",
  "role": "نقش شما",
  "bio": "بیوگرافی شما...",
  "email": "your@email.com",
  "location": "شهر شما",
  "avatar": "/images/profile.jpg"
}
```

### تنظیمات سایت

فایل `content/site.json` را برای متادیتای SEO، آدرس سایت و کلمات کلیدی ویرایش کنید.

### لینک‌های اجتماعی

فایل `content/socials.json` را ویرایش کنید.

### افزودن پروژه جدید

یک فایل `.md` جدید در `content/projects/` ایجاد کنید:

```markdown
---
title: "نام پروژه"
description: "توضیح کوتاه"
image: "/images/projects/my-project.jpg"
tags: ["React", "TypeScript"]
category: "اپلیکیشن وب"
featured: true
liveUrl: "https://example.com"
githubUrl: "https://github.com/you/project"
date: "2024-01-01"
---

## نمای کلی

توضیحات پروژه شما به زبان مارک‌داون...
```

تصویر پروژه را در `public/images/projects/` قرار دهید.

### تجربیات

فایل `content/experience.json` را برای به‌روزرسانی سابقه کاری ویرایش کنید.

### مهارت‌ها

فایل `content/skills.json` را برای به‌روزرسانی دسته‌بندی فناوری‌ها ویرایش کنید.

### نظرات

فایل `content/testimonials.json` را برای به‌روزرسانی نظرات مشتریان و همکاران ویرایش کنید.

### صفحه درباره

فایل `content/about.md` را برای محتوای کامل صفحه درباره من به زبان مارک‌داون ویرایش کنید.

## 🖼️ تعویض تصاویر

تمام تصاویر در `public/images/` هستند:

- `profile.jpg` — عکس پروفایل شما
- `projects/` — اسکرین‌شات پروژه‌ها

فایل‌ها را جایگزین کنید و نام‌های یکسان نگه دارید، یا مسیرها را در فایل‌های محتوا تغییر دهید.

## 🏗️ معماری

```
├── content/           # تمام محتوای قابل ویرایش (JSON + Markdown)
│   ├── site.json
│   ├── profile.json
│   ├── socials.json
│   ├── skills.json
│   ├── experience.json
│   ├── testimonials.json
│   ├── about.md
│   └── projects/
├── public/images/     # تمام تصاویر
├── src/
│   ├── app/           # صفحات App Router نکست
│   ├── components/    # کامپوننت‌های قابل استفاده مجدد
│   ├── lib/           # بارگذاری محتوا، ابزارها
│   └── types/         # تایپ‌های تایپ‌اسکریپت
```

## ✨ ویژگی‌ها

- حالت تاریک/روشن حرفه‌ای با تشخیص ترجیح سیستم
- انیمیشن‌های روان Framer Motion
- جستجو و فیلتر دسته‌بندی پروژه‌ها
- طراحی واکنش‌گرا (موبایل‌محور)
- بهینه‌سازی SEO (متادیتا، Open Graph، نقشه سایت، robots.txt)
- نوار پیشرفت مطالعه
- دکمه بازگشت به بالا
- قابل دسترس با صفحه‌کلید
- تولید استاتیک برای عملکرد بهینه
- معماری محتوامحور
- کاملاً راست‌چین (RTL)
- فونت فارسی Vazirmatn

## 📄 مجوز

MIT
