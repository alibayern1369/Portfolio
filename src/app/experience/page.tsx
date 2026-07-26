import type { Metadata } from "next";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { Timeline } from "@/components/timeline";
import { CTA } from "@/components/cta";
import { getExperiences, getProfile } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تجربیات",
  description: "مسیر حرفه‌ای من در صنعت فناوری.",
};

export default async function ExperiencePage() {
  const experiences = await getExperiences();
  const profile = await getProfile();

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle label="سوابق کاری" title="تجربیات حرفه‌ای" description="تایم‌لاین مسیر حرفه‌ای من." />
        <Timeline experiences={experiences} />
      </Section>
      <Section><CTA name={profile.name} /></Section>
    </div>
  );
}
