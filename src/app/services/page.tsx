import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { ServicesGrid } from "@/components/services-grid";
import { CTA } from "@/components/cta";
import { getProfile, getServices } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "خدمات",
  description: "خدمات طراحی، توسعه وب، نرم‌افزار و اپلیکیشن موبایل.",
};

export default async function ServicesPage() {
  const profile = await getProfile();
  const services = await getServices();

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle
          label="خدمات"
          title="چی براتون انجام می‌دم"
          description="ترکیبی از معرفی تخصص‌ها و خدمات کسب‌وکار؛ از طراحی تا توسعه محصول."
        />
        <ServicesGrid services={services} />
        <div className="mt-10 flex justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium transition-all hover:scale-105 hover:bg-accent"
          >
            درخواست همکاری <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Section>
      <Section>
        <CTA name={profile.name} />
      </Section>
    </div>
  );
}
