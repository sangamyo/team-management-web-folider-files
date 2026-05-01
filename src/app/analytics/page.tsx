"use client";

import { AppShell } from "@/components/AppShell";
import { ExperienceScene } from "@/components/ExperienceScene";
import { FloatingCard } from "@/components/FloatingCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ProgressRing } from "@/components/ProgressRing";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { ArrowUpRight, BarChart3, Target, TrendingUp, Users, Zap } from "lucide-react";

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

export default function AnalyticsPage() {
  const { state } = useApp();

  const total = state.tasks.length;
  const done = state.tasks.filter((t) => t.status === "Completed").length;
  const doing = state.tasks.filter((t) => t.status === "In Progress").length;
  const overdue = state.tasks.filter(
    (t) => t.status !== "Completed" && t.due && new Date(t.due) < new Date()
  ).length;
  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

  // Per-project completion
  const projectStats = state.projects.map((p) => ({
    name: p.name,
    percent: p.progress,
    accent: p.accent,
    tasks: p.tasks,
    completed: p.completed,
  }));

  // Days-of-week buckets for tasks created this week
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyBuckets = dayLabels.map((day, i) => {
    const dayIndex = (i + 1) % 7; // Mon=1…Sun=0
    const dayTasks = state.tasks.filter((t) => {
      const d = new Date(t.createdAt);
      return d.getDay() === dayIndex;
    });
    return {
      day,
      tasks: dayTasks.length,
      completed: dayTasks.filter((t) => t.status === "Completed").length,
    };
  });
  const maxBar = Math.max(...weeklyBuckets.map((d) => d.tasks), 1);

  // Sorted leaderboard
  const leaderboard = [...state.members].sort((a, b) => b.score - a.score);

  return (
    <AppShell title="Analytics">
      {/* ── Top Metrics ─────────────────────────── */}
      <motion.div variants={stagger.container} initial="hidden" animate="visible" className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Tasks", value: total, icon: BarChart3, trend: total > 0 ? "+live" : "" },
          { label: "Completed", value: done, icon: Target, trend: completionRate + "% rate" },
          { label: "In Progress", value: doing, icon: Zap, trend: "" },
          { label: "Overdue", value: overdue, icon: TrendingUp, trend: overdue > 0 ? "needs attention" : "all clear" },
        ].map((m) => (
          <motion.div key={m.label} variants={stagger.item}>
            <FloatingCard className="rounded-3xl p-5">
              <m.icon className="mb-4 size-5 text-cyan-200" />
              <p className="text-3xl font-semibold"><AnimatedCounter value={m.value} /></p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-slate-400">{m.label}</p>
                {m.trend && <span className="inline-flex items-center gap-1 text-xs text-emerald-300"><ArrowUpRight className="size-3" />{m.trend}</span>}
              </div>
            </FloatingCard>
          </motion.div>
        ))}
      </motion.div>

      {/* ── 3D Scene + Overall Completion ──────── */}
      <div className="mb-6 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="glass-panel overflow-hidden rounded-3xl p-5">
          <ExperienceScene compact />
          <h2 className="mt-4 text-lg font-semibold">3D Command Field</h2>
          <p className="mt-1 text-sm text-slate-400">Live metrics from your project workspace.</p>
        </div>

        <div className="glass-panel rounded-3xl p-5">
          <h2 className="mb-5 text-xl font-semibold">Completion by Project</h2>
          {projectStats.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-slate-400 text-sm">
              No projects yet — create one to see data here.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {projectStats.slice(0, 6).map((proj) => (
                <div key={proj.name} className="flex flex-col items-center">
                  <div className="relative">
                    <ProgressRing percent={proj.percent} size={90} strokeWidth={7} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-base font-semibold">
                        <AnimatedCounter value={proj.percent} suffix="%" />
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-center text-xs font-medium leading-tight">{proj.name}</p>
                  <p className="text-[10px] text-slate-500">{proj.completed}/{proj.tasks} tasks</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Weekly Bar Chart ─────────────────────── */}
      <div className="mb-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-3xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Weekly Activity</h2>
            <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">This week</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weeklyBuckets.map((day, i) => (
              <div key={day.day} className="rounded-2xl bg-white/[0.04] p-2">
                <div className="flex h-48 items-end gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: maxBar > 0 ? `${(day.tasks / maxBar) * 100}%` : "4%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.07 }}
                    className="flex-1 rounded-md bg-white/10"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: maxBar > 0 ? `${(day.completed / maxBar) * 100}%` : "0%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.07 + 0.1 }}
                    className="flex-1 rounded-md bg-gradient-to-t from-violet-500 to-cyan-300"
                  />
                </div>
                <p className="mt-2 text-center text-[10px] text-slate-400">{day.day}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-white/10" /> Total</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-gradient-to-r from-violet-500 to-cyan-300" /> Completed</span>
          </div>
        </div>

        {/* Priority distribution */}
        <div className="glass-panel rounded-3xl p-5">
          <h2 className="mb-5 text-xl font-semibold">Priority Mix</h2>
          {["Critical", "High", "Medium", "Low"].map((pri) => {
            const count = state.tasks.filter((t) => t.priority === pri).length;
            const pct = total === 0 ? 0 : Math.round((count / total) * 100);
            const color =
              pri === "Critical" ? "from-rose-400 to-red-500" :
              pri === "High" ? "from-orange-400 to-amber-400" :
              pri === "Medium" ? "from-cyan-400 to-blue-400" :
              "from-emerald-400 to-teal-400";
            return (
              <div key={pri} className="mb-4">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-slate-300">{pri}</span>
                  <span className="text-slate-400">{count} tasks ({pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                    className={`h-full rounded-full bg-gradient-to-r ${color}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Team Leaderboard ────────────────────── */}
      <div className="glass-panel rounded-3xl p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Team Leaderboard</h2>
          <Users className="size-5 text-cyan-200" />
        </div>
        {leaderboard.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">Invite team members to see the leaderboard.</p>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 rounded-2xl bg-white/[0.04] p-4 transition hover:bg-white/[0.06]"
              >
                <span className="grid size-8 place-items-center rounded-full bg-cyan-300/15 text-sm font-bold text-cyan-200">
                  #{i + 1}
                </span>
                <span className="glow-orb grid size-10 place-items-center rounded-full bg-cyan-300/15 text-sm font-semibold text-cyan-100">
                  {m.initials}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.role} · {m.completed}/{m.tasks} tasks</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                    />
                  </div>
                  <span className="min-w-[2.5ch] text-right font-semibold text-cyan-100">{m.score}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
