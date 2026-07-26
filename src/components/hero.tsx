"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, Mail, FileText } from "lucide-react";
import { AnimatedBackground } from "./animated-background";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "./icons";
import type { Profile, Social } from "@/types";
import type { ComponentType, SVGProps } from "react";

const socialIconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
};

interface HeroProps {
  profile: Profile;
  socials: Social[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Hero({ profile, socials }: HeroProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <AnimatedBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-6xl px-6 py-32 text-center"
      >
        {/* Avatar */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <div className="relative">
            <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-border shadow-lg">
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={112}
                height={112}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", bounce: 0.5 }}
              className="absolute -bottom-1 -left-1 rounded-full border-2 border-background bg-emerald-500 px-2 py-0.5 text-[10px] font-medium text-white"
            >
              {profile.availability}
            </motion.div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
            {profile.heroHeadline.map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? <span className="gradient-text">{line}</span> : line}
              </span>
            ))}
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed"
        >
          {profile.heroDescription}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-90 hover:scale-105 active:scale-95"
          >
            <Mail className="h-4 w-4" />
            ارتباط با من
          </a>
          <a
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-accent hover:scale-105 active:scale-95"
          >
            <FileText className="h-4 w-4" />
            مشاهده پروژه‌ها
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex items-center justify-center gap-3"
        >
          {socials.slice(0, 3).map((social) => {
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
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex justify-center"
        >
          <motion.a
            href="#about"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
            className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="اسکرول به پایین"
          >
            <span className="text-xs font-medium tracking-wider">
              اسکرول
            </span>
            <ArrowDown className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
