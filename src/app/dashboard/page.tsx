"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FloatingCard } from "@/components/FloatingCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ProgressRing } from "@/components/ProgressRing";
import dynamic from "next/dynamic";

const ExperienceScene = dynamic(() => import("@/components/ExperienceScene").then(m => m.ExperienceScene), { ssr: false });
import { ProjectModal } from "@/components/ProjectModal";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import { ArrowRight, ArrowUpRight, ArrowDownRight, CalendarClock, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

export default function DashboardPage() {
  const { state, isAdmin } = useApp();
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  const totalTasks = state.tasks.length;
  const doneTasks = state.tasks.filter((t) => t.status === "Completed").length;
  const doingTasks = state.tasks.filter((t) => t.status === "In Progress").length;
  const todoTasks = state.tasks.filter((t) => t.status === "Pending").length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
  const totalProjects = state.projects.length;
  const atRiskProjects = state.projects.filter((p) => p.health === "At Risk").length;

  const topStats = [
    { label: "Total Projects", value: totalProjects, icon: CalendarClock, trend: "+1", up: true },
    { label: "Tasks Done", value: doneTasks, icon: ArrowRight, trend: "+4", up: true },
    { label: "In Progress", value: doingTasks, icon: TrendingUp, trend: "", up: true },
    { label: "At Risk", value: atRiskProjects, icon: ArrowDownRight, trend: "", up: false },
  ];

  return (
    <AppShell title="Executive Dashboard">
      <ProjectModal open={projectModalOpen} onClose={() => setProjectModalOpen(false)} />

      {/* ── Top Stats ───────────────────────────── */}
      <motion.div variants={stagger.container} initial="hidden" animate="visible" className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {topStats.map((s) => (
          <motion.div key={s.label} variants={stagger.item}>
            <FloatingCard className="rounded-3xl p-5">
              <s.icon className="size-6 text-cyan-200" />
              <p className="mt-4 text-3xl font-semibold"><AnimatedCounter value={s.value} /></p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-sm text-slate-400">{s.label}</p>
                {s.trend && (
                  <span className={`inline-flex items-center gap-1 text-xs ${s.up ? "text-emerald-300" : "text-rose-300"}`}>
                    {s.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                    {s.trend}
                  </span>
                )}
              </div>
            </FloatingCard>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Completion Ring + 3D Scene ───────────── */}
      <div className="mb-6 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-6">
          <div className="relative">
            <ProgressRing percent={completionRate} size={160} strokeWidth={10} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-semibold"><AnimatedCounter value={completionRate} suffix="%" /></span>
              <span className="text-xs text-slate-400">Completion</span>
            </div>
          </div>
          <div className="mt-6 grid w-full grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white/[0.04] p-3">
              <p className="text-xl font-semibold text-emerald-300">{doneTasks}</p>
              <p className="text-xs text-slate-400">Done</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-3">
              <p className="text-xl font-semibold text-cyan-300">{doingTasks}</p>
              <p className="text-xs text-slate-400">Active</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-3">
              <p className="text-xl font-semibold text-slate-300">{todoTasks}</p>
              <p className="text-xs text-slate-400">Todo</p>
            </div>
          </div>
        </div>

        <div className="glass-panel overflow-hidden rounded-3xl p-5">
          <ExperienceScene compact />
        </div>
      </div>

      {/* ── Projects ─────────────────────────────── */}
      <section className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active Projects</h2>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button onClick={() => setProjectModalOpen(true)} className="magnetic inline-flex items-center gap-1.5 rounded-full bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-300/20 transition">
                <Plus className="size-3.5" /> New
              </button>
            )}
            <Link href="/projects" className="text-sm text-cyan-200 hover:text-cyan-100 transition">View all →</Link>
          </div>
        </div>

        {state.projects.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 text-center">
            <p className="text-slate-400">No projects yet. <button onClick={() => setProjectModalOpen(true)} className="text-cyan-200 hover:underline">Create one →</button></p>
          </div>
        ) : (
          <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {state.projects.map((project) => (
              <motion.div key={project.id} variants={stagger.item}>
                <FloatingCard className="rounded-2xl p-4">
                  <div className={`mb-3 h-1.5 rounded-full bg-gradient-to-r ${project.accent}`} />
                  <h3 className="font-semibold truncate">{project.name}</h3>
                  <p className="mt-1 text-xs text-slate-400 truncate">{project.owner}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-300">{project.completed}/{project.tasks}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      project.health === "Elite" ? "bg-cyan-300/15 text-cyan-200" :
                      project.health === "On Track" ? "bg-emerald-300/15 text-emerald-200" :
                      project.health === "Needs Focus" ? "bg-amber-300/15 text-amber-200" :
                      "bg-rose-300/15 text-rose-200"
                    }`}>{project.health}</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${project.accent}`}
                    />
                  </div>
                </FloatingCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ── Team + Recent Tasks ───────────────────── */}
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="glass-panel rounded-3xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Team Orbs</h2>
            <Link href="/team" className="text-xs text-cyan-200">View all →</Link>
          </div>
          {state.members.length === 0 ? (
            <p className="text-sm text-slate-400">No team members yet.</p>
          ) : (
            <div className="space-y-2">
              {state.members.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-3">
                  <div className="flex items-center gap-3">
                    <span className="glow-orb grid size-10 place-items-center rounded-full bg-cyan-300/15 text-sm font-semibold text-cyan-100">{m.initials}</span>
                    <div>
                      <p className="font-medium text-sm">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-cyan-100">{m.score}</p>
                    <span className={`text-xs ${m.status === "Online" ? "text-emerald-300" : m.status === "Away" ? "text-amber-300" : "text-slate-500"}`}>{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel rounded-3xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Tasks</h2>
            <Link href="/board" className="text-xs text-cyan-200">Board →</Link>
          </div>
          {state.tasks.length === 0 ? (
            <p className="text-sm text-slate-400">No tasks yet. Add tasks from the Projects page.</p>
          ) : (
            <div className="space-y-2">
              {state.tasks.slice(0, 5).map((task) => {
                const project = state.projects.find((p) => p.id === task.projectId);
                return (
                  <div key={task.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
                    <span className={`size-2.5 shrink-0 rounded-full ${task.status === "Completed" ? "bg-emerald-400" : task.status === "In Progress" ? "bg-violet-400" : "bg-slate-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.status === "Completed" ? "line-through text-slate-400" : ""}`}>{task.title}</p>
                      <p className="text-xs text-slate-500 truncate">{project?.name ?? "Unknown Project"}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                      task.priority === "Critical" ? "badge-critical" :
                      task.priority === "High" ? "badge-high" :
                      task.priority === "Medium" ? "badge-medium" : "badge-low"
                    }`}>{task.priority}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
