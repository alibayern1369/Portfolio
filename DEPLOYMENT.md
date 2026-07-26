# 🚀 راهنمای کامل دیپلوی روی GitHub و Vercel

## پیش‌نیازها

- حساب کاربری [GitHub](https://github.com)
- حساب کاربری [Vercel](https://vercel.com) (با GitHub وارد شوید)
- نرم‌افزار [Git](https://git-scm.com/downloads) نصب شده روی کامپیوتر
- نرم‌افزار [Node.js](https://nodejs.org) نسخه ۱۸ یا بالاتر

---

## مرحله ۱: آماده‌سازی پروژه

### ۱.۱ فایل‌ها را روی کامپیوتر خود قرار دهید

پروژه را در یک پوشه (مثلاً `portfolio`) قرار دهید.

### ۱.۲ ترمینال/Command Prompt را باز کنید

**ویندوز:** کلیک راست در پوشه پروژه → "Open in Terminal" یا "Git Bash Here"

**مک/لینوکس:** ترمینال را باز کنید و با `cd` به پوشه بروید

```bash
cd /path/to/portfolio
```

### ۱.۳ نصب پکیج‌ها (اختیاری - برای تست محلی)

```bash
npm install
npm run dev
```

سایت در `http://localhost:3000` قابل مشاهده است.

---

## مرحله ۲: ایجاد مخزن GitHub

### ۲.۱ وارد GitHub شوید

به [github.com](https://github.com) بروید و وارد شوید.

### ۲.۲ مخزن جدید بسازید

1. روی آیکون **+** بالا سمت راست کلیک کنید
2. **New repository** را انتخاب کنید
3. تنظیمات:
   - **Repository name:** `portfolio`
   - **Description:** `نمونه‌کارهای شخصی`
   - گزینه **Public** را انتخاب کنید
   - ❌ هیچ تیکی نزنید (نه README، نه .gitignore، نه license)
4. روی **Create repository** کلیک کنید

### ۲.۳ آدرس مخزن را کپی کنید

چیزی شبیه این: `https://github.com/USERNAME/portfolio.git`

---

## مرحله ۳: آپلود کد به GitHub

در ترمینال، داخل پوشه پروژه این دستورات را اجرا کنید:

```bash
# ۱. شروع Git
git init

# ۲. اضافه کردن همه فایل‌ها
git add .

# ۳. کامیت اول
git commit -m "🚀 Initial commit - Portfolio website"

# ۴. تنظیم branch اصلی
git branch -M main

# ۵. اتصال به GitHub (آدرس خودتان را جایگزین کنید)
git remote add origin https://github.com/USERNAME/portfolio.git

# ۶. آپلود به GitHub
git push -u origin main
```

### اگر خطای احراز هویت گرفتید:

GitHub دیگر از رمز عبور پشتیبانی نمی‌کند. باید **Personal Access Token** بسازید:

1. در GitHub به Settings → Developer settings → Personal access tokens → Tokens (classic) بروید
2. روی **Generate new token (classic)** کلیک کنید
3. نام بدهید (مثلاً `git-access`)
4. تیک **repo** را بزنید
5. **Generate token** کنید
6. توکن را کپی کنید (فقط یکبار نشان داده می‌شود!)
7. وقتی رمز خواست، این توکن را به جای رمز عبور وارد کنید

---

## مرحله ۴: دیپلوی روی Vercel

### ۴.۱ وارد Vercel شوید

1. به [vercel.com](https://vercel.com) بروید
2. روی **Log In** کلیک کنید
3. گزینه **Continue with GitHub** را انتخاب کنید
4. به Vercel اجازه دسترسی به GitHub بدهید

### ۴.۲ پروژه را ایمپورت کنید

1. در داشبورد Vercel، روی **Add New...** → **Project** کلیک کنید
2. در لیست مخزن‌ها، **portfolio** را پیدا کنید
3. روی **Import** کلیک کنید

### ۴.۳ تنظیمات پروژه

Vercel خودکار تشخیص می‌دهد که Next.js است:

- **Framework Preset:** Next.js ✅
- **Root Directory:** `./` ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `.next` ✅

⚠️ **نیازی به تنظیم Environment Variables نیست!** (پروژه دیتابیس ندارد)

### ۴.۴ دیپلوی!

روی **Deploy** کلیک کنید و صبر کنید (حدود ۱-۲ دقیقه).

### ۴.۵ تمام! 🎉

بعد از اتمام:
- آدرس سایت شما: `https://portfolio-USERNAME.vercel.app`
- یا می‌توانید دامنه اختصاصی وصل کنید

---

## مرحله ۵: اتصال دامنه شخصی (اختیاری)

اگر دامنه‌ای مثل `alidelavar.ir` دارید:

1. در داشبورد Vercel روی پروژه کلیک کنید
2. به **Settings** → **Domains** بروید
3. دامنه خود را وارد کنید
4. رکوردهای DNS را طبق راهنما در پنل دامنه‌تان تنظیم کنید:
   - **A Record:** `76.76.19.19`
   - **CNAME:** `cname.vercel-dns.com`

---

## به‌روزرسانی سایت

هر بار که می‌خواهید تغییری بدهید:

```bash
# ۱. فایل‌ها را ویرایش کنید

# ۲. تغییرات را کامیت کنید
git add .
git commit -m "✨ توضیح تغییرات"

# ۳. آپلود به GitHub
git push
```

Vercel **خودکار** متوجه می‌شود و سایت را به‌روزرسانی می‌کند! 🪄

---

## ویرایش محتوا

برای تغییر محتوا، فایل‌های پوشه `content/` را ویرایش کنید:

| فایل | محتوا |
|------|-------|
| `profile.json` | نام، نقش، بیو، ایمیل، آدرس |
| `site.json` | عنوان سایت، توضیحات SEO |
| `experience.json` | سوابق کاری |
| `skills.json` | مهارت‌ها |
| `testimonials.json` | نظرات |
| `about.md` | صفحه درباره من |
| `projects/*.md` | پروژه‌ها |

### افزودن پروژه جدید:

یک فایل `my-project.md` در `content/projects/` بسازید و تصویر را در `public/images/projects/` قرار دهید.

---

## مشکلات رایج

### ❌ خطای "Permission denied"
→ توکن GitHub را بررسی کنید

### ❌ خطای "Build failed" در Vercel
→ لاگ‌ها را بررسی کنید، معمولاً مشکل TypeScript است

### ❌ تصاویر لود نمی‌شوند
→ مسیر تصاویر در فایل‌های محتوا را بررسی کنید

---

## لینک‌های مفید

- [داکیومنت Next.js](https://nextjs.org/docs)
- [داکیومنت Vercel](https://vercel.com/docs)
- [راهنمای Git](https://git-scm.com/doc)

---

موفق باشید! 🚀
