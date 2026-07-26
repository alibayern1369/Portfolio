import type { Metadata } from "next";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { ProjectFilters } from "@/components/project-filters";
import { getAllProjects, getProjectCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "پروژه‌ها",
  description:
    "نمونه‌کارهای من در زمینه اپلیکیشن‌های وب، پروژه‌های طراحی و مشارکت‌های متن‌باز.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const categories = getProjectCategories();

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle
          label="نمونه‌کارها"
          title="پروژه‌های من"
          description="مجموعه‌ای از پروژه‌هایی که ساخته‌ام، طراحی کرده‌ام و در آن‌ها مشارکت داشته‌ام."
        />
        <ProjectFilters projects={projects} categories={categories} />
      </Section>
    </div>
  );
}
