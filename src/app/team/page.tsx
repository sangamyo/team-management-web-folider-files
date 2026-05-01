"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FloatingCard } from "@/components/FloatingCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit3, Mail, ShieldCheck, UserPlus, X } from "lucide-react";
import { useApp } from "@/lib/store";
import type { Member } from "@/lib/types";

const COLOR_OPTIONS = ["cyan", "violet", "emerald", "sky", "fuchsia", "amber"];
const colorMap: Record<string, string> = {
  cyan: "from-cyan-400 to-blue-500 shadow-[0_0_40px_rgba(34,211,238,0.3)]",
  violet: "from-violet-400 to-fuchsia-500 shadow-[0_0_40px_rgba(139,92,246,0.3)]",
  emerald: "from-emerald-300 to-cyan-400 shadow-[0_0_40px_rgba(52,211,153,0.3)]",
  sky: "from-sky-400 to-blue-500 shadow-[0_0_40px_rgba(56,189,248,0.3)]",
  fuchsia: "from-fuchsia-400 to-rose-400 shadow-[0_0_40px_rgba(217,70,239,0.3)]",
  amber: "from-amber-400 to-orange-500 shadow-[0_0_40px_rgba(251,191,36,0.3)]",
};

function MemberModal({ open, onClose, editing }: { open: boolean; onClose: () => void; editing?: Member | null }) {
  const { addMember, updateMember } = useApp();
  const [name, setName] = useState(editing?.name ?? "");
  const [email, setEmail] = useState(editing?.email ?? "");
  const [initials, setInitials] = useState(editing?.initials ?? "");
  const [role, setRole] = useState<"Admin" | "Member">(editing?.role ?? "Member");
  const [color, setColor] = useState(editing?.color ?? "cyan");
  const [status, setStatus] = useState<"Online" | "Away" | "Offline">(editing?.status ?? "Online");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(editing?.name ?? "");
    setEmail(editing?.email ?? "");
    setInitials(editing?.initials ?? "");
    setRole(editing?.role ?? "Member");
    setColor(editing?.color ?? "cyan");
    setStatus(editing?.status ?? "Online");
    setError("");
  }, [editing, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Member name is required.");
    if (!email.trim()) return setError("Member email is required.");
    const auto = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    setSubmitting(true);
    setError("");
    try {
      if (editing) {
        await updateMember(editing.id, { name, initials: initials || auto, role, color, status, email });
      } else {
        await addMember({ name, email, role, color });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save member");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editing ? "Edit Member" : "Invite Member"}</h2>
              <button onClick={onClose} className="grid size-8 place-items-center rounded-full border border-white/10 text-slate-400 hover:text-white transition"><X className="size-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm text-slate-300">Full Name *</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/50 transition" placeholder="e.g. Sarah Chen" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-slate-300">Email *</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" disabled={Boolean(editing)} className="w-full rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/50 transition disabled:opacity-60" placeholder="member@company.com" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-slate-300">Initials (auto-generated if blank)</span>
                <input value={initials} onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 2))} maxLength={2} className="w-full rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/50 transition" placeholder="SC" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm text-slate-300">Role</span>
                  <select value={role} onChange={(e) => setRole(e.target.value as "Admin" | "Member")} className="w-full rounded-2xl border border-cyan-200/15 bg-[#0a1428] px-4 py-3 text-sm text-slate-200 outline-none">
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm text-slate-300">Status</span>
                  <select value={status} onChange={(e) => setStatus(e.target.value as "Online" | "Away" | "Offline")} className="w-full rounded-2xl border border-cyan-200/15 bg-[#0a1428] px-4 py-3 text-sm text-slate-200 outline-none">
                    <option>Online</option><option>Away</option><option>Offline</option>
                  </select>
                </label>
              </div>
              <div>
                <span className="mb-2 block text-sm text-slate-300">Avatar Color</span>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button key={c} type="button" onClick={() => setColor(c)} className={`size-8 rounded-full bg-gradient-to-br ${colorMap[c]?.split(" shadow")[0]} ${color === c ? "ring-2 ring-white ring-offset-1 ring-offset-[#0a1428]" : ""} transition`} />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                {error && <p className="mr-auto max-w-48 text-sm text-rose-200">{error}</p>}
                <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={submitting} className="magnetic rounded-full bg-gradient-to-r from-cyan-300 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950">{submitting ? "Saving..." : editing ? "Save Changes" : "Invite Member"}</button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } },
};

export default function TeamPage() {
  const { state, deleteMember, isAdmin } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  function handleEdit(m: Member) { setEditingMember(m); setModalOpen(true); }
  function handleClose() { setModalOpen(false); setEditingMember(null); }

  return (
    <AppShell title="Team Management">
      <MemberModal open={modalOpen} onClose={handleClose} editing={editingMember} />

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-400"><span className="font-semibold text-white">{state.members.length}</span> members</p>
        {isAdmin && (
          <button onClick={() => { setEditingMember(null); setModalOpen(true); }} className="magnetic inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950">
            <UserPlus className="size-4" /> Invite member
          </button>
        )}
      </div>

      {state.members.length === 0 && (
        <div className="glass-panel rounded-3xl p-16 text-center">
          <h2 className="mt-4 text-xl font-semibold">No team members yet</h2>
          <p className="mt-2 text-slate-400">Click Invite member to add your first team member.</p>
        </div>
      )}

      <motion.div variants={stagger.container} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {state.members.map((member) => (
            <motion.div key={member.id} variants={stagger.item} layout exit={{ opacity: 0, scale: 0.95 }}>
              <FloatingCard className="rounded-3xl p-6">
                <div className="flex items-start justify-between">
                  <div className={`glow-orb grid size-20 place-items-center rounded-full bg-gradient-to-br ${colorMap[member.color] || colorMap.cyan} text-2xl font-bold text-white`}>
                    {member.initials}
                  </div>
                  {isAdmin && <div className="flex gap-1">
                    <button onClick={() => handleEdit(member)} className="grid size-8 place-items-center rounded-full border border-white/10 text-slate-400 hover:border-cyan-300/40 hover:text-cyan-200 transition"><Edit3 className="size-3.5" /></button>
                    <button onClick={() => void deleteMember(member.id)} className="grid size-8 place-items-center rounded-full border border-white/10 text-slate-400 hover:border-rose-300/40 hover:text-rose-300 transition"><Trash2 className="size-3.5" /></button>
                  </div>}
                </div>

                <h2 className="mt-4 text-xl font-semibold">{member.name}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${member.role === "Admin" ? "bg-cyan-300/15 text-cyan-200" : "bg-white/8 text-slate-300"}`}>{member.role}</span>
                  <span className={`flex items-center gap-1 text-xs ${member.status === "Online" ? "text-emerald-300" : member.status === "Away" ? "text-amber-300" : "text-slate-500"}`}>
                    <span className={`size-1.5 rounded-full ${member.status === "Online" ? "bg-emerald-400" : member.status === "Away" ? "bg-amber-400" : "bg-slate-600"}`} />
                    {member.status}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-white/[0.04] p-3 text-center">
                    <p className="text-xl font-semibold"><AnimatedCounter value={member.score} /></p>
                    <p className="text-[10px] uppercase tracking-wider text-cyan-200">Focus</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] p-3 text-center">
                    <p className="text-xl font-semibold"><AnimatedCounter value={member.tasks} /></p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Tasks</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] p-3 text-center">
                    <p className="text-xl font-semibold"><AnimatedCounter value={member.completed} /></p>
                    <p className="text-[10px] uppercase tracking-wider text-emerald-300">Done</p>
                  </div>
                </div>

                <div className="mt-4 h-1.5 rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: member.tasks > 0 ? `${(member.completed / member.tasks) * 100}%` : "0%" }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${colorMap[member.color]?.split(" shadow")[0] ?? "from-cyan-400 to-blue-500"}`}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="flex items-center gap-1 text-xs text-emerald-200"><ShieldCheck className="size-3.5" /> Permission synced</p>
                  <button className="grid size-7 place-items-center rounded-full bg-white/[0.06] text-slate-400 hover:text-cyan-200 transition"><Mail className="size-3.5" /></button>
                </div>
              </FloatingCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  );
}
