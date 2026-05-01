"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";
import { ExperienceScene } from "@/components/ExperienceScene";
import { FloatingCard } from "@/components/FloatingCard";
import { featureList } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Database, Eye, Layers, Monitor, ShieldCheck } from "lucide-react";

const demoCards = [
  { Icon: Eye, title: "3D UI", copy: "React Three Fiber scene, particles, floating dashboard cards, and responsive motion.", color: "cyan" },
  { Icon: ShieldCheck, title: "JWT Auth", copy: "Login/signup APIs, role middleware, protected route architecture, forgot password.", color: "violet" },
  { Icon: Database, title: "MongoDB", copy: "User, Project, Task models with team relationships, comments, and seed data.", color: "emerald" },
  { Icon: Code2, title: "REST API", copy: "Express 5, Zod validation, error middleware, rate limiting, and CORS config.", color: "sky" },
  { Icon: Monitor, title: "13 Pages", copy: "Landing, auth, dashboard, projects, board, analytics, team, about, contact, demo, submit, 404.", color: "fuchsia" },
  { Icon: Layers, title: "Deploy", copy: "Railway-ready scripts, environment variables, and clean README instructions.", color: "orange" },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } },
};

export default function DemoPage() {
  return (
    <main className="aurora-bg min-h-screen pt-16">
      <Navbar />

      <Section eyebrow="Demo Showcase" title="A guided recruiter walkthrough across product, frontend, backend, and deployment readiness.">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="glass-panel overflow-hidden rounded-3xl p-6">
            <ExperienceScene compact />
            <h3 className="mt-4 text-xl font-semibold">Interactive 3D Experience</h3>
            <p className="mt-2 text-sm text-slate-300">Mouse-responsive scene with orbiting widgets, distorted core mesh, and ambient stars.</p>
          </div>
          <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-3 sm:grid-cols-2">
            {demoCards.map(({ Icon, title, copy }) => (
              <motion.div key={title} variants={stagger.item}>
                <FloatingCard className="rounded-2xl p-5">
                  <Icon className="mb-4 size-5 text-cyan-200" />
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
                </FloatingCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      <Section eyebrow="Feature Map" title="Every capability built into this project.">
        <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featureList.map((f) => (
            <motion.div key={f.title} variants={stagger.item}>
              <FloatingCard className="rounded-2xl p-5">
                <f.icon className="mb-3 size-5 text-cyan-200" />
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{f.desc}</p>
              </FloatingCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="neon-text text-3xl font-semibold sm:text-4xl">Ready to explore the full experience?</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className="magnetic inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.3)]">
              Open Dashboard <ArrowRight className="size-4" />
            </Link>
            {/* Submission page removed - link intentionally omitted */}
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
