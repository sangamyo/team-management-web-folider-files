"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";
import { ExperienceScene } from "@/components/ExperienceScene";
import { ParticleField } from "@/components/ParticleField";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send reset signal");
      }

      const data = await res.json();
      setMessage(data.message || "✅ Reset signal sent! In production, check your email for password reset instructions.");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="aurora-bg relative grid min-h-screen place-items-center overflow-hidden px-4">
      <ParticleField count={30} />
      <ExperienceScene />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-panel relative z-10 w-full max-w-md rounded-[2rem] p-6"
      >
        <div className="mb-8 grid size-14 place-items-center rounded-2xl bg-cyan-300/10">
          <MailCheck className="size-7 text-cyan-200" />
        </div>
        <h1 className="text-3xl font-semibold">Reset your access key</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Enter your workspace email and the API will issue a reset token flow in production.
        </p>
        <form onSubmit={handleReset}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-8 w-full rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 text-sm outline-none transition focus:border-cyan-300/60 focus:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
            placeholder="demo@quantum.team"
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          {message && <p className="mt-2 text-sm text-cyan-300">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="magnetic mt-4 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-300 to-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.25)] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Sending..." : "Send reset signal"}
          </button>
        </form>
        <Link href="/login" className="mt-4 block text-center text-sm text-cyan-200 transition hover:text-cyan-100">
          ← Back to login
        </Link>
      </motion.div>
    </main>
  );
}
