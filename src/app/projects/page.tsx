"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FloatingCard } from "@/components/FloatingCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ProjectModal } from "@/components/ProjectModal";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, CalendarClock } from "lucide-react";
import { useApp } from "@/lib/store";
import type { Project } from "@/lib/types";
import Link from "next/link";

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } },
};

export default function ProjectsPage() {
  const { state, deleteProject, isAdmin } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  function handleEdit(p: Project) {
    setEditingProject(p);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingProject(null);
  }

  const healthBadge = (h: string) => {
    if (h === "Elite") return "bg-cyan-300/15 text-cyan-200";
    if (h === "On Track") return "bg-emerald-300/15 text-emerald-200";
    if (h === "Needs Focus") return "bg-amber-300/15 text-amber-200";
    return "bg-rose-300/15 text-rose-200";
  };

  return (
    <AppShell title="Projects">
      <ProjectModal open={modalOpen} onClose={handleCloseModal} editing={editingProject} />

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          <span className="font-semibold text-white">{state.projects.length}</span> active projects
        </p>
        {isAdmin && (
          <button
            onClick={() => { setEditingProject(null); setModalOpen(true); }}
            className="magnetic inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950"
          >
            <Plus className="size-4" /> Create project
          </button>
        )}
      </div>

      {state.projects.length === 0 && (
        <div className="glass-panel rounded-3xl p-16 text-center">
          <h2 className="mt-4 text-xl font-semibold">No projects yet</h2>
          <p className="mt-2 text-slate-400">{isAdmin ? "Click Create project to get started." : "You have not been assigned to a project yet."}</p>
        </div>
      )}

      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="visible"
        className="grid gap-4 lg:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {state.projects.map((project) => (
            <motion.div
              key={project.id}
              variants={stagger.item}
              layout
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            >
              <FloatingCard className="rounded-3xl p-6">
                {/* Banner */}
                <div className={`mb-5 flex h-28 items-end rounded-2xl bg-gradient-to-br ${project.accent} p-4 shadow-[0_0_40px_rgba(34,211,238,0.1)]`}>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${healthBadge(project.health)}`}>
                    {project.health}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/projects/${project.id}`} className="text-xl font-semibold transition hover:text-cyan-200">{project.name}</Link>
                    <p className="mt-1 text-sm text-slate-400 line-clamp-2">{project.description || "No description provided."}</p>
                  </div>
                  {isAdmin && <div className="flex shrink-0 gap-1">
                    <button onClick={() => handleEdit(project)} className="grid size-8 place-items-center rounded-full border border-white/10 text-slate-400 hover:border-cyan-300/40 hover:text-cyan-200 transition">
                      <Edit3 className="size-3.5" />
                    </button>
                    <button onClick={() => void deleteProject(project.id)} className="grid size-8 place-items-center rounded-full border border-white/10 text-slate-400 hover:border-rose-300/40 hover:text-rose-300 transition">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>}
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-white/[0.04] p-3 text-center">
                    <p className="text-lg font-semibold"><AnimatedCounter value={project.tasks} /></p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Tasks</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] p-3 text-center">
                    <p className="text-lg font-semibold text-emerald-300"><AnimatedCounter value={project.completed} /></p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Done</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] p-3 text-center">
                    <p className="text-lg font-semibold text-cyan-200"><AnimatedCounter value={project.progress} suffix="%" /></p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Progress</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${project.accent}`}
                  />
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CalendarClock className="size-3.5" />
                    {project.due ? new Date(project.due).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "No deadline"}
                  </span>
                  <div className="flex items-center gap-1">
                    {project.members.map((m) => (
                      <span key={m} title={state.members.find((member) => member.id === m)?.name} className="grid size-7 place-items-center rounded-full border border-cyan-200/20 bg-cyan-300/10 text-[10px] font-semibold text-cyan-100">
                        {state.members.find((member) => member.id === m)?.initials ?? "U"}
                      </span>
                    ))}
                  </div>
                </div>
              </FloatingCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  );
}
