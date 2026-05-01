"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { footerLinks } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative border-t border-cyan-200/10 bg-[#030511]/80 backdrop-blur-xl">
      <div className="cyber-line" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 shadow-[0_0_32px_rgba(34,211,238,0.28)]">
                <Sparkles className="size-5 text-cyan-200" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-50">
                Quantum Teams
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              A cinematic full-stack team task manager SaaS built to dominate hiring assignments and impress recruiters.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {["GitHub", "LinkedIn", "Twitter"].map((social) => (
                <span
                  key={social}
                  className="cursor-pointer rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:border-cyan-300/30 hover:text-cyan-200"
                >
                  {social}
                </span>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-cyan-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="cyber-line mt-12" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Quantum Teams. Built for selection, engineered like a funded SaaS.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-500">Next.js 16</span>
            <span className="text-xs text-slate-500">React Three Fiber</span>
            <span className="text-xs text-slate-500">Express + MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
