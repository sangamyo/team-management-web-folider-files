"use client";

import { Navbar } from "@/components/Navbar";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";
import { ExperienceScene } from "@/components/ExperienceScene";
import { FloatingCard } from "@/components/FloatingCard";
import { featureList, techStack } from "@/lib/data";
import { motion } from "framer-motion";
import { Code2, Rocket } from "lucide-react";

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } },
};

export default function AboutPage() {
  return (
    <main className="aurora-bg min-h-screen pt-16">
      <Navbar />

      <Section eyebrow="About" title="A cinematic SaaS proof-of-work built to show product taste and engineering range.">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel overflow-hidden rounded-3xl p-6">
            <ExperienceScene compact />
          </div>
          <FloatingCard className="rounded-3xl p-6">
            <Rocket className="mb-6 size-8 text-cyan-200" />
            <h3 className="text-2xl font-semibold">Built Different</h3>
            <p className="mt-4 leading-8 text-slate-300">
              Quantum Teams combines a Next.js 16 3D frontend with an Express/MongoDB backend,
              JWT authentication, role-based workflows, drag-and-drop kanban operations, real-time
              analytics dashboards, and Railway deployment documentation.
            </p>
            <p className="mt-4 leading-8 text-slate-300">
              It is structured like a maintainable, scalable product — not a single-page assignment trick.
              Every route, model, and component is production-grade.
            </p>
            <div className="cyber-line my-6" />
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Code2 className="size-4 text-cyan-200" />
              <span>13 pages · 10+ API endpoints · 20+ components · 6 3D scenes</span>
            </div>
          </FloatingCard>
        </div>
      </Section>

      <Section eyebrow="Features" title="Everything a recruiter expects, and more.">
        <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featureList.map((f) => (
            <motion.div key={f.title} variants={stagger.item}>
              <FloatingCard className="rounded-2xl p-5">
                <f.icon className="mb-4 size-6 text-cyan-200" />
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{f.desc}</p>
              </FloatingCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Section eyebrow="Stack" title="Modern tools that top engineering teams ship with.">
        <div className="flex flex-wrap gap-3">
          {techStack.map((tech) => (
            <span key={tech.name} className="rounded-full border border-cyan-200/15 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100">
              {tech.name}
            </span>
          ))}
        </div>
      </Section>

      <Footer />
    </main>
  );
}
