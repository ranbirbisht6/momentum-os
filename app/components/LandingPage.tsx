"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  LineChart,
  NotebookPen,
  RefreshCcw,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

const features: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "AI Goal Planning", description: "Turn ambition into milestones, targets, and daily action.", icon: Sparkles },
  { title: "Smart Calendar", description: "Plan time blocks, reminders, recurring work, and deadlines.", icon: CalendarDays },
  { title: "Daily Task Management", description: "Keep today's execution clean, focused, and measurable.", icon: CheckCircle2 },
  { title: "Reviews & Reflection", description: "Review wins, lessons, focus, and next-week improvements.", icon: FileText },
  { title: "Journal", description: "Capture plans, reflections, notes, and mental clarity.", icon: NotebookPen },
  { title: "Progress Analytics", description: "Track completion, streaks, score, and long-term movement.", icon: BarChart3 },
  { title: "Recurring Tasks", description: "Regenerate the routines that keep your system alive.", icon: RefreshCcw },
  { title: "Reminders", description: "Attach timely nudges to the work that matters.", icon: Bell },
];

const steps = [
  ["01", "Create a Goal", "Start with an outcome and target date."],
  ["02", "AI breaks it into milestones", "Momentum builds the operating plan."],
  ["03", "Execute daily actions", "Move from intention to scheduled work."],
  ["04", "Review progress and improve", "Close loops, adjust, and build momentum."],
];

const showcases = [
  "Dashboard",
  "Calendar",
  "Goals",
  "AI Planning",
  "Reviews",
];

const comingSoon: { title: string; icon: LucideIcon }[] = [
  { title: "AI Assistant Memory", icon: Brain },
  { title: "Habit Tracker", icon: CheckCircle2 },
  { title: "Focus Mode", icon: Clock3 },
  { title: "Team Workspaces", icon: Users },
  { title: "Smart Insights", icon: LineChart },
  { title: "Mobile App", icon: Zap },
];

const whyMomentum = [
  "Goal-first planning",
  "AI-powered breakdowns",
  "Daily execution system",
  "Long-term progress tracking",
  "Personal operating system",
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#151513] text-[#f6f1e8]">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#151513]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#7fb58f] text-sm font-bold text-[#121411]">
              M
            </span>
            <span className="text-sm font-semibold tracking-tight">Momentum OS</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-white/62 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#how" className="transition hover:text-white">How it works</a>
            <a href="#showcase" className="transition hover:text-white">Product</a>
            <a href="#roadmap" className="transition hover:text-white">Roadmap</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/70 transition hover:text-white sm:inline-flex">
              Login
            </Link>
            <Link href="/signup" className="rounded-full bg-[#7fb58f] px-4 py-2 text-sm font-semibold text-[#11140f] transition hover:bg-[#a3d1ad]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-5 pb-24 pt-20 sm:px-8 lg:pb-32 lg:pt-28">
        <div className="absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#7fb58f]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a3d1ad]">
              Personal productivity OS
            </span>
            <h1 className="mt-7 text-6xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
              Momentum OS
            </h1>
            <p className="mt-5 text-3xl font-semibold tracking-tight text-[#d9d2c5] sm:text-4xl">
              Think Less. Execute More.
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
              An AI-powered productivity operating system that transforms goals into actionable plans, organizes your tasks, tracks progress, and helps you build momentum every day.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#7fb58f] px-6 text-sm font-semibold text-[#11140f] transition hover:bg-[#a3d1ad]">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/app" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]">
                View Demo
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <ProductMockup />
          </motion.div>
        </div>
      </section>

      <Section id="features" eyebrow="Value" title="Everything you need to stay consistent.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <MotionCard key={feature.title} delay={index * 0.04}>
              <feature.icon className="h-5 w-5 text-[#a3d1ad]" />
              <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{feature.description}</p>
            </MotionCard>
          ))}
        </div>
      </Section>

      <Section id="how" eyebrow="How it works" title="Direction first. Execution every day.">
        <div className="relative grid gap-4 lg:grid-cols-4">
          {steps.map(([number, title, description], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <span className="text-xs font-semibold text-[#a3d1ad]">{number}</span>
              <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="showcase" eyebrow="Product showcase" title="A complete workspace, not another task list.">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <ProductMockup compact />
          <div className="grid gap-3">
            {showcases.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <span className="text-lg font-semibold text-white">{item}</span>
                <span className="rounded-full bg-[#7fb58f]/12 px-3 py-1 text-xs font-semibold text-[#a3d1ad]">
                  Screenshot slot
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Why Momentum" title="Most productivity apps track tasks. Momentum creates direction.">
        <div className="grid gap-3 md:grid-cols-5">
          {whyMomentum.map((point) => (
            <div key={point} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-sm font-semibold text-white/78">
              {point}
            </div>
          ))}
        </div>
      </Section>

      <Section id="roadmap" eyebrow="Coming Soon" title="The system keeps getting smarter.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoon.map((item) => (
            <div key={item.title} className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-[#7fb58f]/45 hover:bg-white/[0.055]">
              <item.icon className="h-5 w-5 text-[#a3d1ad]" />
              <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/52">Coming Soon</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="px-5 py-24 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[#7fb58f] p-8 text-center text-[#11140f] sm:p-14"
        >
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Ready to build momentum?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#172016]/75">
            Stop managing tasks. Start building progress.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#11140f] px-6 text-sm font-semibold text-white">
              Create Account
            </Link>
            <Link href="/app" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#11140f]/20 px-6 text-sm font-semibold text-[#11140f]">
              View Demo
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-white">Momentum OS</p>
            <p className="mt-2">Built with Next.js, TypeScript, Supabase and Vercel.</p>
          </div>
          <div className="flex flex-wrap gap-5">
            {["Features", "Roadmap", "GitHub", "Privacy", "Contact"].map((item) => (
              <a key={item} href={item === "Features" ? "#features" : item === "Roadmap" ? "#roadmap" : "#"} className="transition hover:text-white">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-3xl"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a3d1ad]">{eyebrow}</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function MotionCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/10 transition hover:border-[#7fb58f]/45 hover:bg-white/[0.055]"
    >
      {children}
    </motion.div>
  );
}

function ProductMockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-[2rem] border border-white/10 bg-[#202019] p-3 shadow-2xl shadow-black/40 ${compact ? "" : "lg:rotate-1"}`}>
      <div className="rounded-[1.5rem] border border-white/10 bg-[#171713] p-4">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#e27d72]" />
            <span className="h-3 w-3 rounded-full bg-[#d7b96f]" />
            <span className="h-3 w-3 rounded-full bg-[#7fb58f]" />
          </div>
          <span className="text-xs text-white/35">Momentum OS</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-3 rounded-3xl bg-white/[0.035] p-4">
            {["Dashboard", "Goals", "AI Planning", "Reviews"].map((item, index) => (
              <div key={item} className={`rounded-2xl px-3 py-2 text-sm ${index === 0 ? "bg-[#7fb58f]/16 text-[#a3d1ad]" : "text-white/50"}`}>
                {item}
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {["Today", "Goals", "Score"].map((item, index) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-white/40">{item}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{[82, 64, 91][index]}%</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-white">AI Planning Roadmap</p>
                <Sparkles className="h-4 w-4 text-[#a3d1ad]" />
              </div>
              <div className="space-y-3">
                {["Create target", "Break into milestones", "Schedule daily actions"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#11140f] p-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#7fb58f]/16 text-xs text-[#a3d1ad]">{index + 1}</span>
                    <span className="text-sm text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-semibold text-white">Goals</p>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-full w-2/3 rounded-full bg-[#7fb58f]" />
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-semibold text-white">Calendar</p>
                <div className="mt-4 grid grid-cols-5 gap-1">
                  {Array.from({ length: 10 }, (_, index) => (
                    <span key={index} className={`h-7 rounded-lg ${index % 3 === 0 ? "bg-[#7fb58f]/50" : "bg-white/10"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
