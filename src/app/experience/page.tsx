import type { Metadata } from "next";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { Timeline } from "@/components/timeline";
import { CTA } from "@/components/cta";
import { getExperiences, getProfile } from "@/lib/content";

export const metadata: Metadata = {
  title: "تجربیات",
  description:
    "مسیر حرفه‌ای من در صنعت فناوری، از فریلنسری تا رهبری تیم‌های مهندسی.",
};

export default function ExperiencePage() {
  const experiences = getExperiences();
  const profile = getProfile();

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle
          label="سوابق کاری"
          title="تجربیات حرفه‌ای"
          description="تایم‌لاین مسیر حرفه‌ای من و تأثیری که در مسیر ایجاد کرده‌ام."
        />
        <Timeline experiences={experiences} />
      </Section>

      <Section>
        <CTA name={profile.name} />
      </Section>
    </div>
  );
}
