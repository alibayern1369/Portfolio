export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { ProjectGrid } from "@/components/project-grid";
import { ServicesGrid } from "@/components/services-grid";
import { SkillsGrid } from "@/components/skills-grid";
import { Testimonials } from "@/components/testimonials";
import { CTA } from "@/components/cta";
import { getProfile, getFeaturedProjects, getServices, getSkills, getTestimonials, getSiteConfig } from "@/lib/content";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  const title = "کیش لند وب | طراحی سایت، نرم‌افزار و اپلیکیشن";
  const description =
    site.description ||
    "تیم کیش لند وب؛ طراحی سایت، رابط کاربری، نرم‌افزار اختصاصی و اپلیکیشن موبایل برای رشد کسب‌وکارها.";
  const ogImage = site.ogImage || "/images/og.jpg";

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: site.url,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "کیش لند وب — klandweb" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function HomePage() {
  const profile = await getProfile();
  const site = await getSiteConfig();
  const featuredProjects = await getFeaturedProjects(site.homeProjectsCount);
  const services = await getServices();
  const skills = await getSkills();
  const testimonials = await getTestimonials();

  return (
    <>
      <Hero />
      <Section id="about">
        <SectionTitle
          label="معرفی"
          title={site.homeAboutTitle || "کیش لند وب؛ معرفی و خدمات"}
          description={site.homeAboutDescription || profile.bio || "کیش لند وب (klandweb) طراحی و توسعه محصولات دیجیتال برای کسب‌وکارها و برندهای شخصی."}
        />
        <div className="flex justify-center">
          <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-accent hover:scale-105">
            بیشتر بدانید <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Section>
      <Section id="services">
        <SectionTitle
          label="خدمات"
          title={site.homeServicesTitle || "خدمات طراحی و توسعه کیش لند وب"}
          description={site.homeServicesDescription || "کیش لند وب (klandweb) — از طراحی رابط کاربری تا توسعه وبسایت، نرم‌افزار و اپ موبایل."}
        />
        <ServicesGrid services={services.slice(0, 8)} />
        <div className="mt-10 flex justify-center">
          <Link href="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-accent hover:scale-105">
            مشاهده همه خدمات <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Section>
      <Section id="projects">
        <SectionTitle
          label="نمونه‌کارها"
          title={site.homeProjectsTitle || "نمونه کارهای klandweb"}
          description={site.homeProjectsDescription || "نمونه‌هایی از پروژه‌های انجام‌شده توسط کیش لند وب برای مشتریان و پروژه‌های شخصی."}
        />
        <ProjectGrid projects={featuredProjects} />
        <div className="mt-10 flex justify-center">
          <Link href="/projects" className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-accent hover:scale-105">
            مشاهده همه پروژه‌ها <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Section>
      <Section id="skills">
        <SectionTitle
          label="تخصص‌ها"
          title={site.homeSkillsTitle || "ابزارها و مهارت‌ها"}
          description={site.homeSkillsDescription || "فناوری‌ها و ابزارهایی که تیم ما برای ساخت محصول استفاده می‌کند."}
        />
        <SkillsGrid categories={skills.categories} />
      </Section>
      <Section id="testimonials">
        <SectionTitle
          label="نظرات"
          title={site.homeTestimonialsTitle || "بازخورد مشتریان"}
          description={site.homeTestimonialsDescription || "تجربه همکاری مشتریان و همکاران."}
        />
        {testimonials.length > 0 ? <Testimonials testimonials={testimonials} /> : (
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">
            بازخوردهای همکاری پس از انتشار در این بخش نمایش داده می‌شوند.
          </div>
        )}
      </Section>
      <Section><CTA name={profile.name} title={site.homeCtaTitle} description={site.homeCtaDescription} buttonText={site.homeCtaButtonText} /></Section>
    </>
  );
}
