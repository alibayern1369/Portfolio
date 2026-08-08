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
import { getProfile, getSocials, getFeaturedProjects, getServices, getSkills, getTestimonials, getSiteConfig } from "@/lib/content";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  const profile = await getProfile();
  const title = site.title
    ? `${profile.name} | ${site.title} | klandweb | کیش لند وب`
    : `${profile.name} | klandweb | کیش لند وب`;

  return {
    title: { absolute: title },
    description:
      site.description ||
      `${profile.name} (علی دلاور) — کیش لند وب (klandweb). طراحی و توسعه وبسایت، نرم‌افزار و اپلیکیشن.`,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description: site.description,
      url: site.url,
      type: "website",
    },
  };
}

export default async function HomePage() {
  const profile = await getProfile();
  const socials = await getSocials();
  const site = await getSiteConfig();
  const featuredProjects = await getFeaturedProjects(site.homeProjectsCount);
  const services = await getServices();
  const skills = await getSkills();
  const testimonials = await getTestimonials();

  return (
    <>
      <Hero profile={profile} socials={socials} description={site.homeHeroDescription || profile.heroDescription} />
      <Section id="about">
        <SectionTitle
          label="معرفی"
          title={site.homeAboutTitle || "من و کسب‌وکارم"}
          description={site.homeAboutDescription || profile.bio}
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
          title={site.homeServicesTitle || "چی براتون انجام می‌دم"}
          description={site.homeServicesDescription || "از طراحی رابط کاربری تا توسعه وبسایت، نرم‌افزار و اپ موبایل."}
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
          title={site.homeProjectsTitle || "پروژه‌های منتخب"}
          description={site.homeProjectsDescription || "نمونه‌هایی از کارهای انجام‌شده برای مشتریان و پروژه‌های شخصی."}
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
          description={site.homeSkillsDescription || "فناوری‌ها و ابزارهایی که برای ساخت محصول استفاده می‌کنم."}
        />
        <SkillsGrid categories={skills.categories} />
      </Section>
      <Section id="testimonials">
        <SectionTitle
          label="نظرات"
          title={site.homeTestimonialsTitle || "بازخورد مشتریان"}
          description={site.homeTestimonialsDescription || "تجربه همکاری مشتریان و همکاران."}
        />
        <Testimonials testimonials={testimonials} />
      </Section>
      <Section><CTA name={profile.name} title={site.homeCtaTitle} description={site.homeCtaDescription} buttonText={site.homeCtaButtonText} /></Section>
    </>
  );
}
