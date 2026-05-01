"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckSquare, Calendar, User, Tag } from "lucide-react";
import { useApp } from "@/lib/store";
import type { Priority, Task, TaskStatus } from "@/lib/types";

const PRIORITY_OPTIONS: Priority[] = ["Critical", "High", "Medium", "Low"];
const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Overdue", label: "Overdue" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
  editing?: Task | null;
}

export function TaskModal({ open, onClose, projectId, editing }: Props) {
  const { addTask, updateTask, state, user, isAdmin } = useApp();

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Pending");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [assignee, setAssignee] = useState("");
  const [due, setDue] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const project = state.projects.find((p) => p.id === projectId);
  const projectMembers = useMemo(
    () => state.members, // Show all members - backend will auto-add them to project
    [state.members],
  );

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setStatus(editing.status);
      setPriority(editing.priority);
      setAssignee(editing.assignee);
      setDue(editing.due);
      setTagsInput(editing.tags.join(", "));
    } else {
      setTitle(""); setStatus("Pending"); setPriority("Medium");
      setAssignee(projectMembers[0]?.id || user?.id || ""); setDue(""); setTagsInput("");
    }
    setError("");
  }, [editing, open, projectMembers, user?.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Task title is required.");
    if (!due) return setError("Due date is required.");
    if (!projectId) return setError("Choose a project before adding tasks.");
    if (!assignee) return setError("Assign this task to a project member.");
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    setSubmitting(true);
    setError("");
    try {
      if (editing) {
        await updateTask(editing.id, { title, status, priority, assignee, due, tags });
      } else {
        await addTask({ projectId, title, status, priority, assignee, due, tags });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-panel fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6 shadow-[0_0_80px_rgba(139,92,246,0.15)]"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-violet-300/10">
                  <CheckSquare className="size-5 text-violet-200" />
                </div>
                <h2 className="text-xl font-semibold">{editing ? "Edit Task" : "Add Task"}</h2>
              </div>
              <button onClick={onClose} className="grid size-9 place-items-center rounded-full border border-white/10 text-slate-400 hover:text-white transition">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm text-slate-300">Task Title *</span>
                <div className="flex items-center gap-3 rounded-2xl border border-violet-200/15 bg-white/[0.04] px-4 py-3 focus-within:border-violet-300/50 transition">
                  <Tag className="size-4 shrink-0 text-violet-200" />
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                    placeholder="e.g. Design landing hero section"
                  />
                </div>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm text-slate-300">Status</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full rounded-2xl border border-violet-200/15 bg-[#0a1428] px-4 py-3 text-sm text-slate-200 outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm text-slate-300">Priority</span>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full rounded-2xl border border-violet-200/15 bg-[#0a1428] px-4 py-3 text-sm text-slate-200 outline-none"
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm text-slate-300">Assignee</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-violet-200/15 bg-white/[0.04] px-4 py-3 focus-within:border-violet-300/50 transition">
                    <User className="size-4 shrink-0 text-violet-200" />
                    <select
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      className="w-full bg-transparent text-sm text-slate-200 outline-none"
                    >
                      {projectMembers.map((m) => (
                        <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                      ))}
                    </select>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm text-slate-300">Due Date</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-violet-200/15 bg-white/[0.04] px-4 py-3 focus-within:border-violet-300/50 transition">
                    <Calendar className="size-4 shrink-0 text-violet-200" />
                    <input
                      type="date"
                      value={due}
                      onChange={(e) => setDue(e.target.value)}
                      className="w-full bg-transparent text-sm text-slate-200 outline-none [color-scheme:dark]"
                    />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm text-slate-300">Tags (comma separated)</span>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full rounded-2xl border border-violet-200/15 bg-white/[0.04] px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-violet-300/50 transition"
                  placeholder="Frontend, API, Design"
                />
              </label>

              {error && <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300 hover:text-white transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || (!isAdmin && editing?.assignee !== user?.id)}
                  className="magnetic rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.25)]"
                >
                  {submitting ? "Saving..." : editing ? "Save Changes" : "Add Task"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
