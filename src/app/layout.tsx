import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  metadataBase: new URL("https://quantum-task-manager.railway.app"),
  title: {
    default: "Quantum Teams - Futuristic 3D Team Task Manager",
    template: "%s | Quantum Teams",
  },
  description:
    "A cinematic full-stack task manager SaaS with immersive 3D dashboards, role-based collaboration, kanban workflows, analytics, and JWT-secured REST APIs. Built with Next.js 16, React Three Fiber, Express, and MongoDB.",
  keywords: [
    "Team Task Manager",
    "Next.js SaaS",
    "Three.js dashboard",
    "Kanban app",
    "JWT auth",
    "Railway deployment",
    "React Three Fiber",
    "Full stack project",
  ],
  openGraph: {
    title: "Quantum Teams — Futuristic 3D Team Task Manager",
    description:
      "Immersive 3D team task manager with kanban, analytics, JWT auth, and a recruiter-ready demo layer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col bg-[#040712] text-white"
        style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

