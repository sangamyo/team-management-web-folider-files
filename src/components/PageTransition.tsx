"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode } from "react";

export function PageTransition({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
        transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
