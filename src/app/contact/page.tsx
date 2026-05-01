"use client";

import { Navbar } from "@/components/Navbar";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";
import { FloatingCard } from "@/components/FloatingCard";
import { ParticleField } from "@/components/ParticleField";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, User } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="aurora-bg min-h-screen pt-16">
      <Navbar />

      <Section eyebrow="Contact" title="Open a direct signal with the builder.">
        <div className="relative">
          <ParticleField count={20} className="opacity-40" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <FloatingCard className="rounded-3xl p-8">
              <form className="space-y-5">
                {[
                  { label: "Name", icon: User, placeholder: "Your name" },
                  { label: "Email", icon: Mail, placeholder: "your@email.com" },
                  { label: "Company", icon: MapPin, placeholder: "Company name" },
                ].map((field) => (
                  <label key={field.label} className="block">
                    <span className="mb-2 block text-sm text-slate-300">{field.label}</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 transition focus-within:border-cyan-300/60 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                      <field.icon className="size-4 text-cyan-200" />
                      <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder={field.placeholder} />
                    </div>
                  </label>
                ))}
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Message</span>
                  <textarea className="min-h-36 w-full rounded-2xl border border-cyan-200/15 bg-white/[0.04] px-4 py-3 text-sm outline-none transition focus:border-cyan-300/60 focus:shadow-[0_0_20px_rgba(34,211,238,0.1)] placeholder:text-slate-500" placeholder="Tell us about your project..." />
                </label>
                <button className="magnetic inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.25)]">
                  <Send className="size-4" /> Send message
                </button>
              </form>
            </FloatingCard>

            <div className="space-y-4">
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-lg font-semibold">Quick Connect</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  This is a demo contact form for the Quantum Teams SaaS showcase. In production,
                  it would connect to an email service or CRM webhook.
                </p>
              </div>
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-lg font-semibold">Response Time</h3>
                <p className="mt-3 text-sm text-slate-300">Typically within 24 hours during business days.</p>
                <div className="mt-4 h-1.5 rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "92%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">92% same-day response rate</p>
              </div>
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-lg font-semibold">Location</h3>
                <p className="mt-3 text-sm text-slate-300">Based in India · Open to remote opportunities worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
