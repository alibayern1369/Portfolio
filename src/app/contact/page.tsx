import type { Metadata } from "next";
import { Section } from "@/components/section";
import { SectionTitle } from "@/components/section-title";
import { ContactForm } from "@/components/contact-form";
import { getProfile, getSocials } from "@/lib/content";

export const metadata: Metadata = {
  title: "تماس",
  description: "برای پرسش‌های پروژه، همکاری یا فقط سلام با من در تماس باشید.",
};

export default function ContactPage() {
  const profile = getProfile();
  const socials = getSocials();

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle
          label="تماس"
          title="ارتباط با من"
          description="پروژه‌ای در ذهن دارید یا فقط می‌خواهید گپ بزنیم؟ خوشحال می‌شوم صدایتان را بشنوم."
        />
        <ContactForm profile={profile} socials={socials} />
      </Section>
    </div>
  );
}
