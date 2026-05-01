"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, LockKeyhole, Radar, Rocket, Users, Zap, Star } from "lucide-react";
import { ExperienceScene } from "@/components/ExperienceScene";
import { Navbar } from "@/components/Navbar";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";
import { ParticleField } from "@/components/ParticleField";
import { FloatingCard } from "@/components/FloatingCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { TypewriterText } from "@/components/TypewriterText";
import { activity, projects, stats, testimonials, techStack } from "@/lib/data";

const featureCards = [
  { title: "JWT Auth", copy: "Signup, login, protected routes, forgot password UI, and Admin/Member roles.", Icon: LockKeyhole, color: "cyan" },
  { title: "Kanban + Lists", copy: "Drag tasks across statuses, track priorities, deadlines, comments, and progress.", Icon: CheckCircle2, color: "emerald" },
  { title: "Team OS", copy: "Invite members, permission views, holographic avatars, and activity timelines.", Icon: Users, color: "violet" },
  { title: "Analytics", copy: "Completion charts, overdue metrics, productivity scores, and 3D visual summaries.", Icon: BarChart3, color: "fuchsia" },
  { title: "REST API", copy: "Express, MongoDB models, validation, error middleware, rate limits, and seed data.", Icon: Radar, color: "sky" },
  { title: "Deployment", copy: "Railway-ready configs, env examples, README setup, and clean monorepo scripts.", Icon: Rocket, color: "orange" },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } },
};

export function LandingPage() {
  return (
    <main className="aurora-bg min-h-screen overflow-hidden">
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden px-4 pt-28 sm:px-6 lg:px-8">
        <ParticleField count={50} />
        <ExperienceScene />
        <div className="mesh-grid pointer-events-none absolute inset-0 opacity-70" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100"
            >
              <Radar className="size-4 animate-pulse" />
              Built for selection. Engineered like a funded SaaS.
            </motion.div>
            <h1 className="neon-text max-w-5xl text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
              Quantum Teams
            </h1>
            <div className="mt-4 h-12 text-2xl font-medium text-cyan-200/80 sm:text-3xl">
              <TypewriterText
                texts={[
                  "Full-Stack Task Manager",
                  "3D Immersive Dashboard",
                  "JWT-Secured SaaS",
                  "Recruiter-Ready Demo",
                ]}
              />
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A full-stack, JWT-secured, 3D team task manager with kanban workflows,
              role-based collaboration, analytics, and a recruiter-ready product demo layer.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="magnetic inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.3)]"
              >
                Open command center <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-cyan-300/50 hover:bg-white/8"
              >
                View demo showcase
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotateX: 10, y: 30 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel relative rounded-[2rem] p-4"
          >
            <div className="rounded-[1.5rem] border border-cyan-200/10 bg-slate-950/70 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Live velocity</p>
                  <h2 className="mt-1 text-2xl font-semibold">Sprint Orbit</h2>
                </div>
                <div className="animate-pulse-glow rounded-full bg-emerald-300/15 px-3 py-1 text-sm text-emerald-200">
                  Online
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {stats.map((stat) => (
                  <FloatingCard key={stat.label} className="rounded-2xl p-4">
                    <stat.icon className="mb-5 size-5 text-cyan-200" />
                    <p className="text-3xl font-semibold">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                  </FloatingCard>
                ))}
              </div>
              <div className="mt-4 grid gap-3">
                {projects.slice(0, 3).map((project) => (
                  <div key={project.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-200/20 hover:bg-white/[0.06]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-slate-400">{project.owner} · Due {project.due}</p>
                      </div>
                      <span className="text-sm text-cyan-100">{project.progress}%</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${project.accent}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────── */}
      <section className="relative border-y border-cyan-200/10 bg-[#050815]/60 py-12 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { label: "Pages", value: 13 },
            { label: "API Endpoints", value: 10 },
            { label: "3D Scenes", value: 6 },
            { label: "Components", value: 20 },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-4xl font-semibold text-white">
                <AnimatedCounter value={item.value} suffix="+" />
              </p>
              <p className="mt-2 text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <Section eyebrow="Platform" title="The hiring-assignment feature set recruiters expect, rendered like a premium product.">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {featureCards.map(({ title, copy, Icon }) => (
            <motion.div key={title} variants={stagger.item}>
              <FloatingCard className="rounded-2xl p-6">
                <Icon className="mb-8 size-6 text-cyan-200" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              </FloatingCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ── Tech Stack ───────────────────────────────────────────── */}
      <Section eyebrow="Tech Stack" title="Built with the modern tools that top engineering teams ship with.">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap gap-3"
        >
          {techStack.map((tech) => (
            <motion.span
              key={tech.name}
              variants={stagger.item}
              className="rounded-full border border-cyan-200/15 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
            >
              {tech.name}
            </motion.span>
          ))}
        </motion.div>
      </Section>

      {/* ── Activity & 3D Scene ──────────────────────────────────── */}
      <Section eyebrow="Live Ops" title="Ambient intelligence for every sprint, deadline, and stakeholder update.">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel overflow-hidden rounded-3xl p-6">
            <ExperienceScene compact />
          </div>
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {activity.slice(0, 5).map((item) => (
              <motion.div key={item.title} variants={stagger.item} className="holo-card flex items-center gap-4 rounded-2xl p-4 transition hover:border-cyan-200/30">
                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-cyan-300/10 text-cyan-200">
                  <item.icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-slate-400">{item.user} · {item.time}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <Section eyebrow="Social Proof" title="What engineering leaders say about this caliber of work.">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-4 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={stagger.item}>
              <FloatingCard className="rounded-2xl p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-cyan-300 text-cyan-300" />
                  ))}
                </div>
                <p className="text-sm leading-6 text-slate-300">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-slate-400">{t.role}</p>
                </div>
              </FloatingCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative py-24">
        <div className="cyber-line" />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              Ready to explore
            </p>
            <h2 className="neon-text text-4xl font-semibold tracking-tight sm:text-6xl">
              Experience the command center
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Dive into the dashboard, explore the kanban board, review analytics,
              and see how a production-grade SaaS demo is built from the ground up.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="magnetic inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-cyan-400 px-8 py-4 text-lg font-semibold text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.3)]"
              >
                Launch Dashboard <Zap className="size-5" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-lg font-semibold text-white transition hover:border-cyan-300/50 hover:bg-white/8"
              >
                Create Account <ArrowRight className="size-5" />
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="cyber-line" />
      </section>

      <Footer />
    </main>
  );
}
