"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/AppShell";
import { Mail, Phone, MapPin, Calendar, Award, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { user, ready } = useApp();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready || !user) return null;

  const avatarInitials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const stats = [
    { label: "Projects", value: "12", icon: Briefcase },
    { label: "Tasks Completed", value: "48", icon: Award },
    { label: "Team Members", value: "8", icon: Users },
    { label: "Joined", value: "Mar 2024", icon: Calendar },
  ];

  return (
    <AppShell title="User Profile">
      <div className="space-y-6">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-panel rounded-3xl border border-cyan-200/10 p-8"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="grid size-32 shrink-0 place-items-center rounded-2xl border-2 border-cyan-300/30 bg-linear-to-br from-cyan-400/20 to-violet-400/20 text-3xl font-bold text-cyan-100 shadow-[0_0_32px_rgba(34,211,238,0.3)]"
            >
              {avatarInitials}
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-cyan-50">{user.name}</h1>
              <p className="mt-2 text-lg capitalize text-cyan-200">{user.role}</p>
              <p className="mt-1 text-sm text-slate-400">{user.email || "user@quantumteams.com"}</p>

              {/* Role Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mt-4 inline-block rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-100"
              >
                {user.role === "Admin" ? "Administrator" : "Team Member"}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-panel rounded-2xl border border-cyan-200/10 p-4 text-center"
              >
                <motion.div
                  className="inline-block rounded-lg bg-cyan-300/10 p-2 mb-2"
                  whileHover={{ rotate: 10 }}
                >
                  <Icon className="size-5 text-cyan-300" />
                </motion.div>
                <p className="text-2xl font-bold text-cyan-50">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-panel rounded-3xl border border-cyan-200/10 p-8"
        >
          <h2 className="mb-6 text-xl font-bold text-cyan-50">Contact Information</h2>
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: user.email || "user@quantumteams.com" },
              { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
              { icon: MapPin, label: "Location", value: "San Francisco, CA" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/2 p-4 hover:bg-white/4"
                >
                  <motion.div
                    className="rounded-lg bg-cyan-300/10 p-3"
                    whileHover={{ rotate: 10 }}
                  >
                    <Icon className="size-5 text-cyan-300" />
                  </motion.div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">{item.label}</p>
                    <p className="mt-1 text-slate-100">{item.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="glass-panel rounded-3xl border border-cyan-200/10 p-8"
        >
          <h2 className="mb-6 text-xl font-bold text-cyan-50">Account Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Account Status", value: "Active" },
              { label: "Member Since", value: "March 2024" },
              { label: "Last Login", value: "Today at 2:34 PM" },
              { label: "Account Type", value: user.role === "Admin" ? "Admin Account" : "Standard Account" },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-white/5 bg-white/2 p-4"
              >
                <p className="text-xs uppercase tracking-wider text-slate-400">{item.label}</p>
                <p className="mt-2 font-semibold text-cyan-100">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
