"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Copy, Mail, MapPin } from "lucide-react";
import { GitHubIcon, LinkedInIcon, TwitterIcon, DribbbleIcon } from "./icons";
import type { Profile, Social } from "@/types";
import type { ComponentType, SVGProps } from "react";

const socialIconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  dribbble: DribbbleIcon,
};

interface ContactFormProps {
  profile: Profile;
  socials: Social[];
}

export function ContactForm({ profile, socials }: ContactFormProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("sent");
    setFormState({ name: "", email: "", message: "" });
    setTimeout(() => setStatus("idle"), 3000);
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* Info */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          بیایید چیز شگفت‌انگیزی بسازیم
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          من همیشه مشتاق بحث درباره پروژه‌های جدید، ایده‌های خلاقانه یا
          فرصت‌هایی هستم که بتوانم بخشی از چشم‌انداز شما باشم.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium" dir="ltr">{profile.email}</p>
              <button
                onClick={copyEmail}
                className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" /> کپی شد!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> کپی ایمیل
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">{profile.location}</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            من را دنبال کنید
          </p>
          <div className="flex gap-3">
            {socials.map((social) => {
              const Icon = socialIconMap[social.icon];
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground hover:scale-110"
                  aria-label={social.name}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form */}
      <div>
        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex h-full flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <Check className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold">پیام ارسال شد!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                ممنون که با من تماس گرفتید. به زودی پاسخ خواهم داد.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  نام
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground focus:border-foreground/20 focus:outline-none"
                  placeholder="نام شما"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  ایمیل
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  dir="ltr"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground focus:border-foreground/20 focus:outline-none text-left"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium"
                >
                  پیام
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground focus:border-foreground/20 focus:outline-none"
                  placeholder="درباره پروژه‌تان بگویید..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-50"
              >
                {status === "sending" ? (
                  "در حال ارسال..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    ارسال پیام
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
