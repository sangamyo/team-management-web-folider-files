"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Satellite } from "lucide-react";
import { ExperienceScene } from "@/components/ExperienceScene";
import { ParticleField } from "@/components/ParticleField";

export default function NotFound() {
  return (
    <main className="aurora-bg relative grid min-h-screen place-items-center overflow-hidden px-4 text-center">
      <ParticleField count={40} />
      <ExperienceScene />
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-panel relative z-10 max-w-xl rounded-[2rem] p-8"
      >
        <div className="mx-auto mb-6 grid size-20 place-items-center rounded-full border border-cyan-200/20 bg-cyan-300/10 shadow-[0_0_60px_rgba(34,211,238,0.3)]">
          <Satellite className="size-10 text-cyan-200" />
        </div>
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">404 Signal Lost</p>
        <h1 className="mt-4 text-5xl font-semibold">This orbit is empty.</h1>
        <p className="mt-4 text-slate-300">The route does not exist, but the command center is one jump away.</p>
        <Link
          href="/"
          className="magnetic mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.3)]"
        >
          <Home className="size-4" /> Return home
        </Link>
      </motion.section>
    </main>
  );
}
