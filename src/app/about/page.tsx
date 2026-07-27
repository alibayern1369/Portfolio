import type { Metadata } from "next";
import Image from "next/image";
import { Download } from "lucide-react";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { SkillsGrid } from "@/components/skills-grid";
import { Markdown } from "@/components/markdown";
import { CTA } from "@/components/cta";
import { getProfile, getAbout, getSkills } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "درباره من",
  description: "بیشتر درباره مسیر، مهارت‌ها و انگیزه‌های من بدانید.",
};

export default async function AboutPage() {
  const profile = await getProfile();
  const about = await getAbout();
  const skills = await getSkills();

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle label="درباره من" title={about.title} description={about.subtitle} />
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="overflow-hidden rounded-2xl border border-border">
                <Image src={profile.avatar} alt={profile.name} width={400} height={400} className="aspect-square w-full object-cover" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">{profile.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{profile.location}</p>
              </div>
              <a href={profile.resumeUrl} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-accent">
                <Download className="h-4 w-4" /> دانلود رزومه
              </a>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-2"><Markdown content={about.content} /></div>
        </div>
      </Section>
      <Section>
        <SectionTitle label="تخصص‌ها" title="مهارت‌ها و ابزارها" description="توانایی‌هایی که در پروژه‌ها و خدمات کسب‌وکار استفاده می‌کنم." />
        <SkillsGrid categories={skills.categories} />
      </Section>
      <Section><CTA name={profile.name} /></Section>
    </div>
  );
}
