"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { TaskModal } from "@/components/TaskModal";
import { useApp } from "@/lib/store";
import { CalendarClock, Plus, Users } from "lucide-react";
import { useState } from "react";
import type { Task } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, isAdmin } = useApp();
  const [taskOpen, setTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const project = state.projects.find((item) => item.id === params.id);
  const tasks = state.tasks.filter((task) => task.projectId === params.id);
  const members = state.members.filter((member) => project?.members.includes(member.id));

  if (!project) {
    return (
      <AppShell title="Project">
        <div className="glass-panel rounded-3xl p-10 text-center">
          <h2 className="text-xl font-semibold">Project not found</h2>
          <Link href="/projects" className="mt-4 inline-flex text-cyan-200">Back to projects</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={project.name}>
      <TaskModal open={taskOpen} onClose={() => { setTaskOpen(false); setEditingTask(null); }} projectId={project.id} editing={editingTask} />
      <section className="glass-panel rounded-3xl p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Project Workspace</p>
            <h2 className="mt-3 text-3xl font-semibold">{project.name}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{project.description || "No description yet."}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-2">
                <CalendarClock className="size-4 text-cyan-200" /> {project.due || "No deadline"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-2">
                <Users className="size-4 text-cyan-200" /> {members.length} members
              </span>
            </div>
          </div>
          <div className="min-w-48 rounded-2xl bg-white/[0.04] p-5 text-center">
            <p className="text-4xl font-semibold text-cyan-100">{project.progress}%</p>
            <p className="text-sm text-slate-400">Progress</p>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div className={`h-full rounded-full bg-gradient-to-r ${project.accent}`} style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <section className="glass-panel rounded-3xl p-5">
          <h3 className="font-semibold">Project Team</h3>
          <div className="mt-4 space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-cyan-300/10 text-sm font-semibold text-cyan-100">{member.initials}</span>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-3xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Project Tasks</h3>
            {isAdmin && (
              <button onClick={() => setTaskOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950">
                <Plus className="size-4" /> Add task
              </button>
            )}
          </div>
          <div className="space-y-2">
            {tasks.map((task) => (
              <button key={task.id} onClick={() => { setEditingTask(task); setTaskOpen(true); }} className="w-full rounded-2xl bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.07]">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{task.title}</p>
                  <span className="rounded-full bg-cyan-300/10 px-2 py-1 text-xs text-cyan-100">{task.status}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {state.members.find((member) => member.id === task.assignee)?.name ?? "Unassigned"} · {task.priority} · {task.due || "No due date"}
                </p>
              </button>
            ))}
            {tasks.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No tasks in this project yet.</p>}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
