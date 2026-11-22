import type { Metadata } from "next";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { SkillsGrid } from "@/components/skills-grid";
import { Markdown } from "@/components/markdown";
import { CTA } from "@/components/cta";
import { getAbout, getSkills } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "درباره تیم کیش لند وب",
  description: "با تیم کیش لند وب و خدمات طراحی سایت، تجربه کاربری، توسعه نرم‌افزار اختصاصی و اپلیکیشن موبایل آشنا شوید.",
};

export default async function AboutPage() {
  const [about, skills] = await Promise.all([getAbout(), getSkills()]);
  return (
    <div className="pt-24">
      <Section>
        <SectionTitle label="درباره ما" title={about.title} description={about.subtitle} />
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-6 md:p-10"><Markdown content={about.content} /></div>
      </Section>
      <Section>
        <SectionTitle label="تخصص‌ها" title="مهارت‌ها و ابزارهای تیم ما" description="فناوری‌هایی که برای طراحی و توسعه محصولات دیجیتال به کار می‌گیریم." />
        <SkillsGrid categories={skills.categories} />
      </Section>
      <Section><CTA name="کیش لند وب" /></Section>
    </div>
  );
}
