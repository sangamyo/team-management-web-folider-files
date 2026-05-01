"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={clsx(
          "fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-cyan-200/15 bg-[#050815]/88 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            : "border-cyan-200/10 bg-[#050815]/72",
          "backdrop-blur-2xl",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <motion.span
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="grid size-10 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 shadow-[0_0_32px_rgba(34,211,238,0.28)]"
            >
              <Sparkles className="size-5 text-cyan-200" />
            </motion.span>
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-50">
              Quantum Teams
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white",
                  pathname === link.href && "text-cyan-100",
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 -z-10 rounded-full bg-cyan-300/10"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:text-white sm:block"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="magnetic rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              Start demo
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="grid size-10 place-items-center rounded-full border border-white/10 text-slate-200 lg:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-cyan-200/10 bg-[#050815]/95 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/8",
                    pathname === link.href && "bg-cyan-300/10 text-cyan-100",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-center text-sm text-slate-200">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1 rounded-2xl bg-cyan-300 px-4 py-3 text-center text-sm font-semibold text-slate-950">
                  Start demo
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
