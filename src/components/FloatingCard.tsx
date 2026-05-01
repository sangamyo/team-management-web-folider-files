"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

export function FloatingCard({
  children,
  className = "",
  glowColor = "rgba(34, 211, 238, 0.12)",
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, ${glowColor}, transparent 60%), linear-gradient(140deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(8, 14, 34, 0.62)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.background = "";
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`holo-card transition-[box-shadow] duration-300 ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
