import type { Metadata } from "next";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { ProjectFilters } from "@/components/project-filters";
import { getAllProjects, getProjectCategories } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پروژه‌ها",
  description: "نمونه‌کارهای من در زمینه اپلیکیشن‌های وب و طراحی.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const categories = await getProjectCategories();

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle label="نمونه‌کارها" title="پروژه‌های من" description="مجموعه‌ای از پروژه‌ها." />
        <ProjectFilters projects={projects} categories={categories} />
      </Section>
    </div>
  );
}
