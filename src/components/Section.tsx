import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
        {eyebrow}
      </p>
      <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
        {title}
      </h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}
