import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ExternalLink, Calendar } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { CoverImage } from "@/components/cover-image";
import { Section } from "@/components/section";
import { Markdown } from "@/components/markdown";
import { ProjectGrid } from "@/components/project-grid";
import { SectionTitle } from "@/components/section-title";
import { getAllProjects, getProjectBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      images: project.image ? [{ url: project.image, alt: project.title }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getAllProjects();
  const relatedProjects = allProjects.filter((p) => p.slug !== project.slug && p.category === project.category).slice(0, 2);

  return (
    <div className="pt-24">
      <Section>
        <Link href="/projects" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowRight className="h-4 w-4" /> بازگشت به پروژه‌ها
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">{project.category}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(project.date).toLocaleDateString("fa-IR", { year: "numeric", month: "long" })}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">{project.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-90">
                <ExternalLink className="h-4 w-4" /> نسخه آنلاین
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-accent">
                <GitHubIcon className="h-4 w-4" /> کد منبع
              </a>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground">{tag}</span>
            ))}
          </div>
        </div>

        <div className="mb-12 overflow-hidden rounded-2xl border border-border">
          <CoverImage
            src={project.image}
            alt={project.title}
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>

        <div className="mx-auto max-w-3xl"><Markdown content={project.content} /></div>
      </Section>

      {relatedProjects.length > 0 && (
        <Section>
          <SectionTitle title="پروژه‌های مرتبط" />
          <ProjectGrid projects={relatedProjects} />
        </Section>
      )}
    </div>
  );
}
