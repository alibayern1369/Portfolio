import type { Metadata } from "next";
import Image from "next/image";
import { Download } from "lucide-react";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { SkillsGrid } from "@/components/skills-grid";
import { Markdown } from "@/components/markdown";
import { CTA } from "@/components/cta";
import { getProfile, getAbout, getSkills } from "@/lib/content";

export const metadata: Metadata = {
  title: "درباره من",
  description: "بیشتر درباره مسیر، مهارت‌ها و انگیزه‌های من به عنوان توسعه‌دهنده و طراح بدانید.",
};

export default function AboutPage() {
  const profile = getProfile();
  const about = getAbout();
  const skills = getSkills();

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle
          label="درباره من"
          title={about.title}
          description={about.subtitle}
        />

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="overflow-hidden rounded-2xl border border-border">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={400}
                  height={400}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">{profile.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {profile.location}
                </p>
              </div>
              <a
                href={profile.resumeUrl}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-accent"
              >
                <Download className="h-4 w-4" />
                دانلود رزومه
              </a>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            <Markdown content={about.content} />
          </div>
        </div>
      </Section>

      {/* Skills */}
      <Section>
        <SectionTitle
          label="مهارت‌ها"
          title="فناوری‌هایی که با آن‌ها کار می‌کنم"
          description="جعبه ابزار من برای ساخت تجربه‌های وب مدرن."
        />
        <SkillsGrid categories={skills.categories} />
      </Section>

      {/* CTA */}
      <Section>
        <CTA name={profile.name} />
      </Section>
    </div>
  );
}
