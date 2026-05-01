"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus, Calendar, Users, AlignLeft, Tag, AlertCircle } from "lucide-react";
import { useApp } from "@/lib/store";
import type { Health, Project } from "@/lib/types";

const HEALTH_OPTIONS: Health[] = ["Elite", "On Track", "Needs Focus", "At Risk"];

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: Project | null;
}

export function ProjectModal({ open, onClose, editing }: Props) {
  const { addProject, updateProject, state, user, isAdmin } = useApp();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [health, setHealth] = useState<Health>("On Track");
  const [members, setMembers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setDescription(editing.description);
      setDue(editing.due);
      setHealth(editing.health);
      setMembers(editing.members);
    } else {
      setName(""); setDescription("");
      setDue(""); setHealth("On Track"); setMembers(user?.id ? [user.id] : []);
    }
    setError("");
  }, [editing, open, user?.id]);

  function toggleMember(m: string) {
    setMembers((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAdmin) return setError("Only Admin users can manage projects.");
    if (!name.trim()) return setError("Project name is required.");
    if (!due) return setError("Deadline is required.");
    setSubmitting(true);
    setError("");
    try {
      if (editing) {
        await updateProject(editing.id, { name, description, due, health, members });
      } else {
        await addProject({ name, description, due, members, status: "Active" });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save project");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-panel fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6 shadow-[0_0_80px_rgba(34,211,238,0.15)]"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-cyan-300/10">
                  <FolderPlus className="size-5 text-cyan-200" />
                </div>
                <h2 className="text-xl font-semibold">
                  {editing ? "Edit Project" : "New Project"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="grid size-9 place-items-center rounded-full border border-white/10 text-slate-400 hover:border-cyan-300/30 hover:text-white transition"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isAdmin && (
                <p className="flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                  <AlertCircle className="size-4" /> Members can view assigned projects only.
                </p>
              )}
              {/* Name */}
              <label className="block">
                <span className="mb-1.5 block text-sm text-slate-300">Project Name *</span>
                <div className="flex items-center gap-3 rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 focus-within:border-cyan-300/50 transition">
                  <Tag className="size-4 shrink-0 text-cyan-200" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                    placeholder="e.g. AI Traffic System"
                  />
                </div>
              </label>

              {/* Description */}
              <label className="block">
                <span className="mb-1.5 block text-sm text-slate-300">Description</span>
                <div className="flex items-start gap-3 rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 focus-within:border-cyan-300/50 transition">
                  <AlignLeft className="mt-0.5 size-4 shrink-0 text-cyan-200" />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-slate-500"
                    placeholder="What is this project about?"
                  />
                </div>
              </label>

              {/* Deadline + Owner */}
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm text-slate-300">Deadline</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 focus-within:border-cyan-300/50 transition">
                    <Calendar className="size-4 shrink-0 text-cyan-200" />
                    <input
                      type="date"
                      value={due}
                      onChange={(e) => setDue(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-slate-200 [color-scheme:dark]"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm text-slate-300">Health</span>
                  <select
                    value={health}
                    onChange={(e) => setHealth(e.target.value as Health)}
                    className="w-full rounded-2xl border border-cyan-200/15 bg-[#0a1428] px-4 py-3 text-sm text-slate-200 outline-none"
                  >
                    {HEALTH_OPTIONS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Members */}
              <div>
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <Users className="size-4 text-cyan-200" /> Team Members
                </span>
                <div className="flex flex-wrap gap-2">
                  {state.members.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMember(m.id)}
                      className={`grid size-10 place-items-center rounded-full border text-xs font-semibold transition ${
                        members.includes(m.id)
                          ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.2)]"
                          : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-cyan-200/30"
                      }`}
                      title={m.name}
                    >
                      {m.initials}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p>}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !isAdmin}
                  className="magnetic rounded-full bg-gradient-to-r from-cyan-300 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.25)]"
                >
                  {submitting ? "Saving..." : editing ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
