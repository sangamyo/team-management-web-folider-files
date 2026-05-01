"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail, UserRound, Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";

const ExperienceScene = dynamic(() => import("@/components/ExperienceScene").then(m => m.ExperienceScene), { ssr: false });
import { ParticleField } from "@/components/ParticleField";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export function AuthScene({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@quantum.team");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState<"Admin" | "Member">("Admin");
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const { login, signup, loading, error } = useApp();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    try {
      if (isSignup) {
        if (name.trim().length < 2) throw new Error("Name must be at least 2 characters.");
        await signup({ name, email, password, role });
      } else {
        await login(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Authentication failed");
    }
  }

  return (
    <main className="aurora-bg relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      <ParticleField count={35} />
      <ExperienceScene />
      <div className="mesh-grid absolute inset-0 opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="glass-panel animate-border-flow relative z-10 w-full max-w-md rounded-[2rem] p-6"
      >
        <Link href="/" className="text-sm text-cyan-200 transition hover:text-cyan-100">← Quantum Teams</Link>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-4xl font-semibold"
        >
          {isSignup ? "Create command identity" : "Enter command center"}
        </motion.h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {isSignup
            ? "Spin up an Admin or Member workspace with JWT-backed access and protected routes."
            : "Access your holographic sprint cockpit with role-based workspace state."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {isSignup && (
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Name</span>
              <div className="flex items-center gap-3 rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 transition focus-within:border-cyan-300/60 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                <UserRound className="size-4 text-cyan-200" />
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Hariom Kasaundhan" />
              </div>
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 transition focus-within:border-cyan-300/60 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <Mail className="size-4 text-cyan-200" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="admin@quantum.team" />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Password</span>
            <div className="flex items-center gap-3 rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 transition focus-within:border-cyan-300/60 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <LockKeyhole className="size-4 text-cyan-200" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="••••••••" type={showPw ? "text" : "password"} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-cyan-200">
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </label>

          {isSignup && (
            <div>
              <span className="mb-2 block text-sm text-slate-300">Role</span>
              <div className="grid grid-cols-2 gap-3">
                {(["Admin", "Member"] as const).map((item) => (
                  <label key={item} className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 text-sm transition hover:border-cyan-300/40 has-[:checked]:border-cyan-300/60 has-[:checked]:bg-cyan-300/10">
                    <input type="radio" name="role" value={item} checked={role === item} onChange={() => setRole(item)} className="sr-only" />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          )}

          {!isSignup && (
            <Link href="/forgot-password" className="block text-right text-sm text-cyan-200 transition hover:text-cyan-100">
              Forgot password?
            </Link>
          )}

          {(formError || error) && (
            <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {formError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="magnetic flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.25)]"
          >
            {loading ? "Connecting..." : isSignup ? "Launch workspace" : "Login"} <ArrowRight className="size-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {isSignup ? "Already have access? " : "Need a workspace? "}
          <Link href={isSignup ? "/login" : "/signup"} className="text-cyan-200 transition hover:text-cyan-100">
            {isSignup ? "Login" : "Signup"}
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
