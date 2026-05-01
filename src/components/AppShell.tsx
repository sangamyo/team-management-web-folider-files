"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import clsx from "clsx";
import { sidebarLinks } from "@/lib/data";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { SearchBar } from "./SearchBar";

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? "w-20" : "w-72";

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <main className="aurora-bg grid min-h-screen place-items-center">
        <div className="glass-panel rounded-3xl p-8 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Loading workspace</p>
          <p className="mt-3 text-slate-300">Validating session and syncing database records...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="aurora-bg min-h-screen">
      <div className="mesh-grid fixed inset-0 opacity-50" />

      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          "fixed bottom-0 left-0 top-0 z-40 hidden border-r border-cyan-200/10 bg-[#050815]/78 p-4 backdrop-blur-2xl transition-all duration-300 lg:block",
          sidebarWidth,
        )}
      >
        <Link href="/" className={clsx("mb-8 flex items-center gap-3 rounded-2xl border border-cyan-200/10 bg-cyan-300/8 p-3", collapsed && "justify-center")}>
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cyan-300 text-slate-950">
            <Sparkles className="size-5" />
          </span>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em]">Quantum</p>
              <p className="text-xs text-slate-400">Team OS</p>
            </div>
          )}
        </Link>

        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white",
                collapsed && "justify-center px-0",
                pathname === link.href && "border border-cyan-200/20 bg-cyan-300/10 text-cyan-100",
              )}
            >
              {pathname === link.href && (
                <span className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
              )}
              <link.icon className="size-4 shrink-0" />
              {!collapsed && link.label}
            </Link>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 z-50 grid size-6 -translate-y-1/2 place-items-center rounded-full border border-cyan-200/20 bg-[#0a1428] text-cyan-200 transition hover:bg-cyan-300/20"
        >
          {collapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
        </button>

        {!collapsed && (
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-violet-300/20 bg-violet-400/10 p-4">
            <p className="text-sm font-semibold">Recruiter mode</p>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              Signed in as {user.role}. Data is loaded from the REST API and MongoDB.
            </p>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 top-0 z-50 w-72 border-r border-cyan-200/10 bg-[#050815]/95 p-4 backdrop-blur-2xl lg:hidden"
            >
              <Link href="/" onClick={() => setMobileOpen(false)} className="mb-8 flex items-center gap-3 rounded-2xl border border-cyan-200/10 bg-cyan-300/8 p-3">
                <span className="grid size-11 place-items-center rounded-xl bg-cyan-300 text-slate-950">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]">Quantum</p>
                  <p className="text-xs text-slate-400">Team OS</p>
                </div>
              </Link>
              <nav className="space-y-2">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/8",
                      pathname === link.href && "border border-cyan-200/20 bg-cyan-300/10 text-cyan-100",
                    )}
                  >
                    <link.icon className="size-4" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <section className={clsx("relative z-10 min-h-screen transition-all duration-300", collapsed ? "lg:pl-20" : "lg:pl-72")}>
        <header className="sticky top-0 z-30 border-b border-cyan-200/10 bg-[#050815]/62 backdrop-blur-2xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="grid size-10 place-items-center rounded-full border border-white/10 text-slate-200 lg:hidden"
              >
                <Sparkles className="size-4" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Command Center</p>
                <h1 className="text-lg font-semibold sm:text-2xl">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:block w-80">
                <SearchBar />
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="hidden rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-300/40 hover:text-white sm:block"
              >
                Logout
              </button>
              <button
                onClick={() => router.push("/profile")}
                className="hidden size-10 place-items-center rounded-full border border-cyan-200/20 bg-cyan-300/15 text-sm font-semibold text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition hover:bg-cyan-300/25 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] sm:grid cursor-pointer"
              >
                {user.name ? user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() : "QT"}
              </button>
            </div>
          </div>
        </header>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="px-4 py-6 sm:px-6 lg:px-8"
        >
          {children}
        </motion.div>
      </section>
    </main>
  );
}
