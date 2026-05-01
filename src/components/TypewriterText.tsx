"use client";

import { useEffect, useState } from "react";

export function TypewriterText({
  texts,
  speed = 80,
  pause = 2000,
  className = "",
}: {
  texts: string[];
  speed?: number;
  pause?: number;
  className?: string;
}) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];

    if (!deleting && charIndex < current.length) {
      const timeout = setTimeout(() => setCharIndex((c) => c + 1), speed);
      return () => clearTimeout(timeout);
    }

    if (!deleting && charIndex === current.length) {
      const timeout = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(timeout);
    }

    if (deleting && charIndex > 0) {
      const timeout = setTimeout(() => setCharIndex((c) => c - 1), speed / 2);
      return () => clearTimeout(timeout);
    }

    if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    }
  }, [charIndex, deleting, textIndex, texts, speed, pause]);

  return (
    <span className={className}>
      {texts[textIndex].slice(0, charIndex)}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-cyan-300" style={{ height: "1em" }} />
    </span>
  );
}
