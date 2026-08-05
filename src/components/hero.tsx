"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { ArrowDown, Mail, FileText, Sparkles } from "lucide-react";
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
  description?: string;
}

/* ───── Floating particles ───── */
function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(${120 + Math.random() * 80}, ${100 + Math.random() * 100}, ${200 + Math.random() * 55}, ${0.3 + Math.random() * 0.3})`,
          }}
          animate={{
            y: [0, -(30 + Math.random() * 60), 0],
            x: [0, (Math.random() - 0.5) * 40, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ───── Orbit rings around avatar ───── */
function OrbitRing({ radius, duration, dotCount, color }: {
  radius: number; duration: number; dotCount: number; color: string;
}) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 rounded-full border"
      style={{
        width: radius * 2,
        height: radius * 2,
        marginTop: -radius,
        marginLeft: -radius,
        borderColor: `${color}`,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {Array.from({ length: dotCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6,
            height: 6,
            background: color.replace("0.1", "0.6"),
            top: "50%",
            left: "50%",
            transform: `rotate(${(360 / dotCount) * i}deg) translateX(${radius}px) translate(-50%, -50%)`,
          }}
        />
      ))}
    </motion.div>
  );
}

/* ───── Typewriter text ───── */
function TypeWriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentWord = words[index];
    if (isDeleting) {
      setText(currentWord.substring(0, text.length - 1));
    } else {
      setText(currentWord.substring(0, text.length + 1));
    }

    if (!isDeleting && text === currentWord) {
      setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
    }
  }, [text, isDeleting, index, words]);

  useEffect(() => {
    const timer = setTimeout(tick, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [tick, isDeleting]);

  return (
    <span className="gradient-text">
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="text-foreground/60"
      >
        |
      </motion.span>
    </span>
  );
}

/* ───── Main Hero ───── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function Hero({ profile, socials }: HeroProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const bgX = useTransform(springX, [0, 1], [-15, 15]);
  const bgY = useTransform(springY, [0, 1], [-15, 15]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  const roleParts = profile.role.split(" و ");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ x: bgX, y: bgY }}
      >
        <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-500/[0.07] via-fuchsia-500/[0.05] to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-cyan-500/[0.07] via-blue-500/[0.05] to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-amber-500/[0.04] to-rose-500/[0.04] blur-3xl" />
      </motion.div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <Particles />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-6xl px-6 py-32"
      >
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20">
          {/* Right side - Text content */}
          <div className="flex-1 text-center lg:text-right">
            {/* Availability badge */}
            <motion.div variants={itemVariants} className="mb-6 inline-flex">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {profile.availability}
                </span>
              </motion.div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[4.2rem] leading-[1.15]">
                <span className="block text-foreground/90">
                  {profile.heroHeadline[0]}
                </span>
                <span className="block mt-2">
                  <TypeWriter words={profile.heroHeadline.slice(1)} />
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed lg:mx-0"
            >
              {profile.heroDescription}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="absolute inset-0 bg-foreground" />
                <Mail className="relative h-4 w-4" />
                <span className="relative">ارتباط با من</span>
              </motion.a>
              <motion.a
                href="/projects"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 backdrop-blur-sm px-7 py-3.5 text-sm font-medium transition-all hover:bg-secondary"
              >
                <FileText className="h-4 w-4" />
                مشاهده پروژه‌ها
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center justify-center gap-2 lg:justify-start"
            >
              {socials.slice(0, 3).map((social, i) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    whileHover={{ scale: 1.15, y: -3 }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background/50 backdrop-blur-sm text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/20"
                    aria-label={social.name}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          {/* Left side - Avatar with orbits */}
          <motion.div
            variants={itemVariants}
            className="relative flex-shrink-0"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              {/* Orbit rings */}
              <OrbitRing radius={140} duration={20} dotCount={4} color="rgba(139,92,246,0.1)" />
              <OrbitRing radius={175} duration={30} dotCount={6} color="rgba(59,130,246,0.08)" />

              {/* Glow behind avatar */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-[15%] rounded-full bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-500/20 blur-2xl"
              />

              {/* Avatar */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[15%]"
              >
                <div className="relative h-full w-full overflow-hidden rounded-3xl border-2 border-border/50 shadow-2xl shadow-violet-500/5">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 200px, 256px"
                  />
                  {/* Overlay shimmer */}
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  />
                </div>
              </motion.div>

              {/* Floating badge - role */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
                transition={{
                  opacity: { delay: 1.5 },
                  scale: { delay: 1.5, type: "spring", bounce: 0.5 },
                  y: { delay: 2, duration: 3, repeat: Infinity },
                }}
                className="absolute -bottom-2 -right-2 sm:bottom-2 sm:right-2 flex items-center gap-1.5 rounded-xl border border-border bg-card/90 backdrop-blur-md px-3 py-2 shadow-lg"
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                <span className="text-xs font-medium">{roleParts[0]}</span>
              </motion.div>

              {/* Floating badge - secondary role */}
              {roleParts[1] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
                  transition={{
                    opacity: { delay: 1.8 },
                    scale: { delay: 1.8, type: "spring", bounce: 0.5 },
                    y: { delay: 2.5, duration: 4, repeat: Infinity },
                  }}
                  className="absolute -top-2 -left-2 sm:top-4 sm:left-0 flex items-center gap-1.5 rounded-xl border border-border bg-card/90 backdrop-blur-md px-3 py-2 shadow-lg"
                >
                  <span className="text-xs">🎨</span>
                  <span className="text-xs font-medium">{roleParts[1]}</span>
                </motion.div>
              )}

              {/* Location badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.1, type: "spring", bounce: 0.5 }}
                className="absolute top-0 right-0 sm:-top-2 sm:-right-6 flex items-center gap-1 rounded-lg border border-border bg-card/90 backdrop-blur-md px-2.5 py-1.5 shadow-lg"
              >
                <span className="text-xs">📍</span>
                <span className="text-[10px] font-medium text-muted-foreground">{profile.location}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-20 flex justify-center"
        >
          <motion.a
            href="#about"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
          >
            <span className="text-[10px] font-medium tracking-widest uppercase">اسکرول</span>
            <ArrowDown className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
