import type { Metadata } from "next";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { ContactForm } from "@/components/contact-form";
import { getProfile, getSocials } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تماس",
  description: "برای پرسش‌های پروژه یا همکاری با من در تماس باشید.",
};

export default async function ContactPage() {
  const profile = await getProfile();
  const socials = await getSocials();

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle label="تماس" title="ارتباط با من" description="پروژه‌ای در ذهن دارید یا فقط می‌خواهید گپ بزنیم؟" />
        <ContactForm profile={profile} socials={socials} />
      </Section>
    </div>
  );
}
