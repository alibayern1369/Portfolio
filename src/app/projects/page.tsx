import type { Metadata } from "next";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { ProjectFilters } from "@/components/project-filters";
import { getAllProjects, getProjectCategories } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پروژه‌ها",
  description: "نمونه‌کارهای تیم کیش لند وب در طراحی سایت، نرم‌افزار و اپلیکیشن.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const categories = await getProjectCategories();

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle label="نمونه‌کارها" title="پروژه‌های ما" description="مجموعه‌ای از پروژه‌های طراحی و توسعه تیم کیش لند وب." />
        <ProjectFilters projects={projects} categories={categories} />
      </Section>
    </div>
  );
}
