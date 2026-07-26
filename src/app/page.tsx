export const dynamic = "force-dynamic";

import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { ProjectGrid } from "@/components/project-grid";
import { Timeline } from "@/components/timeline";
import { SkillsGrid } from "@/components/skills-grid";
import { Testimonials } from "@/components/testimonials";
import { CTA } from "@/components/cta";
import {
  getProfile,
  getSocials,
  getFeaturedProjects,
  getExperiences,
  getSkills,
  getTestimonials,
} from "@/lib/content";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function HomePage() {
  const profile = getProfile();
  const socials = getSocials();
  const featuredProjects = getFeaturedProjects();
  const experiences = getExperiences();
  const skills = getSkills();
  const testimonials = getTestimonials();

  return (
    <>
      <Hero profile={profile} socials={socials} />

      {/* About Preview */}
      <Section id="about">
        <SectionTitle
          label="درباره من"
          title="کمی درباره من"
          description={profile.bio}
        />
        <div className="flex justify-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-accent hover:scale-105"
          >
            بیشتر بدانید
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Featured Projects */}
      <Section id="projects">
        <SectionTitle
          label="پروژه‌ها"
          title="کارهای منتخب"
          description="مجموعه‌ای از پروژه‌هایی که اخیراً روی آن‌ها کار کرده‌ام."
        />
        <ProjectGrid projects={featuredProjects} />
        <div className="mt-10 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-accent hover:scale-105"
          >
            مشاهده همه پروژه‌ها
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Experience */}
      <Section id="experience">
        <SectionTitle
          label="تجربیات"
          title="سابقه کاری من"
          description="مسیر حرفه‌ای من در صنعت فناوری."
        />
        <Timeline experiences={experiences.slice(0, 3)} />
        <div className="mt-10 flex justify-center">
          <Link
            href="/experience"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-accent hover:scale-105"
          >
            تجربیات کامل
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills">
        <SectionTitle
          label="مهارت‌ها"
          title="ابزارهای من"
          description="فناوری‌ها و ابزارهایی که برای زنده کردن ایده‌ها استفاده می‌کنم."
        />
        <SkillsGrid categories={skills.categories} />
      </Section>

      {/* Testimonials */}
      <Section id="testimonials">
        <SectionTitle
          label="نظرات"
          title="نظر دیگران"
          description="بازخورد همکاران و مشتریانی که افتخار همکاری با آن‌ها را داشته‌ام."
        />
        <Testimonials testimonials={testimonials} />
      </Section>

      {/* CTA */}
      <Section>
        <CTA name={profile.name} />
      </Section>
    </>
  );
}
