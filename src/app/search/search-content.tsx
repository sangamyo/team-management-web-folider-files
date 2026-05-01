"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/AppShell";
import { ArrowRight, Search, Zap, Layers } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";

interface SearchResult {
  id: string;
  title: string;
  type: "task" | "project" | "member";
  description?: string;
  path: string;
  meta?: string;
}

export function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, ready, user } = useApp();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  // Perform search
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search in tasks
    state.tasks.forEach((task) => {
      if (
        task.title.toLowerCase().includes(searchQuery) ||
        task.tags?.some((tag) => tag.toLowerCase().includes(searchQuery))
      ) {
        searchResults.push({
          id: task.id,
          title: task.title,
          type: "task",
          description: task.tags?.join(", "),
          meta: `${task.status} • ${task.priority}`,
          path: `/dashboard?task=${task.id}`,
        });
      }
    });

    // Search in projects
    state.projects.forEach((project) => {
      if (
        project.name.toLowerCase().includes(searchQuery) ||
        project.description?.toLowerCase().includes(searchQuery)
      ) {
        searchResults.push({
          id: project.id,
          title: project.name,
          type: "project",
          description: project.description,
          meta: `${project.progress}% complete • ${project.members?.length || 0} members`,
          path: `/projects/${project.id}`,
        });
      }
    });

    // Search in members
    state.members.forEach((member) => {
      if (
        member.name.toLowerCase().includes(searchQuery) ||
        member.email?.toLowerCase().includes(searchQuery)
      ) {
        searchResults.push({
          id: member.id,
          title: member.name,
          type: "member",
          description: member.email,
          meta: `${member.completed}/${member.tasks} completed • ${member.score}% score`,
          path: `/team?member=${member.id}`,
        });
      }
    });

    return searchResults;
  }, [query, state]);

  const taskCount = results.filter((r) => r.type === "task").length;
  const projectCount = results.filter((r) => r.type === "project").length;
  const memberCount = results.filter((r) => r.type === "member").length;

  const getTypeIcon = (type: "task" | "project" | "member") => {
    switch (type) {
      case "task":
        return "✓";
      case "project":
        return "📁";
      case "member":
        return "👤";
    }
  };

  const getTypeColor = (type: "task" | "project" | "member") => {
    switch (type) {
      case "task":
        return "from-cyan-400/20 to-cyan-600/20 border-cyan-300/20";
      case "project":
        return "from-violet-400/20 to-violet-600/20 border-violet-300/20";
      case "member":
        return "from-emerald-400/20 to-emerald-600/20 border-emerald-300/20";
    }
  };

  const getTypeTextColor = (type: "task" | "project" | "member") => {
    switch (type) {
      case "task":
        return "text-cyan-200";
      case "project":
        return "text-violet-200";
      case "member":
        return "text-emerald-200";
    }
  };

  if (!ready || !user) return null;

  return (
    <AppShell title={`Search Results: "${query}"`}>
      <div className="space-y-8">
        {/* Search Stats */}
        {query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-2xl border border-cyan-200/10 p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Search Results</p>
                <p className="mt-1 text-2xl font-bold text-cyan-50">
                  {results.length} {results.length === 1 ? "result" : "results"} found
                </p>
              </div>

              {/* Stats Pills */}
              <div className="flex flex-wrap gap-2">
                {taskCount > 0 && (
                  <div className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-200">
                    {taskCount} Tasks
                  </div>
                )}
                {projectCount > 0 && (
                  <div className="rounded-full bg-violet-300/10 px-3 py-1 text-sm font-medium text-violet-200">
                    {projectCount} Projects
                  </div>
                )}
                {memberCount > 0 && (
                  <div className="rounded-full bg-emerald-300/10 px-3 py-1 text-sm font-medium text-emerald-200">
                    {memberCount} Members
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results by Type */}
        {results.length > 0 ? (
          <div className="space-y-8">
            {/* Tasks */}
            {taskCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-cyan-300/20 p-2">
                    <Layers className="size-4 text-cyan-300" />
                  </div>
                  <h2 className="text-lg font-semibold text-cyan-50">Tasks</h2>
                  <span className="ml-auto text-sm text-slate-400">
                    {taskCount} result{taskCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {results
                    .filter((r) => r.type === "task")
                    .map((result, idx) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                      >
                        <Link href={result.path}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            className={clsx(
                              "rounded-xl border bg-linear-to-r p-4 transition hover:shadow-lg hover:shadow-cyan-500/20",
                              getTypeColor(result.type)
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 size-9 rounded-lg flex items-center justify-center shrink-0 bg-cyan-300/20 text-sm font-semibold text-cyan-300">
                                {getTypeIcon(result.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-cyan-50 line-clamp-2">
                                  {result.title}
                                </p>
                                {result.description && (
                                  <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                                    {result.description}
                                  </p>
                                )}
                                {result.meta && (
                                  <p className="mt-2 text-xs text-slate-500">
                                    {result.meta}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="size-5 text-slate-500 mt-0.5 shrink-0" />
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Projects */}
            {projectCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-violet-300/20 p-2">
                    <Layers className="size-4 text-violet-300" />
                  </div>
                  <h2 className="text-lg font-semibold text-cyan-50">Projects</h2>
                  <span className="ml-auto text-sm text-slate-400">
                    {projectCount} result{projectCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {results
                    .filter((r) => r.type === "project")
                    .map((result, idx) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.2 + idx * 0.05,
                        }}
                      >
                        <Link href={result.path}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            className={clsx(
                              "rounded-xl border bg-linear-to-r p-4 transition hover:shadow-lg hover:shadow-violet-500/20",
                              getTypeColor(result.type)
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 size-9 rounded-lg flex items-center justify-center shrink-0 bg-violet-300/20 text-sm font-semibold text-violet-300">
                                {getTypeIcon(result.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-cyan-50 line-clamp-2">
                                  {result.title}
                                </p>
                                {result.description && (
                                  <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                                    {result.description}
                                  </p>
                                )}
                                {result.meta && (
                                  <p className="mt-2 text-xs text-slate-500">
                                    {result.meta}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="size-5 text-slate-500 mt-0.5 shrink-0" />
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Members */}
            {memberCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-emerald-300/20 p-2">
                    <Layers className="size-4 text-emerald-300" />
                  </div>
                  <h2 className="text-lg font-semibold text-cyan-50">Team Members</h2>
                  <span className="ml-auto text-sm text-slate-400">
                    {memberCount} result{memberCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {results
                    .filter((r) => r.type === "member")
                    .map((result, idx) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.3 + idx * 0.05,
                        }}
                      >
                        <Link href={result.path}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            className={clsx(
                              "rounded-xl border bg-linear-to-r p-4 transition hover:shadow-lg hover:shadow-emerald-500/20",
                              getTypeColor(result.type)
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 size-9 rounded-lg flex items-center justify-center shrink-0 bg-emerald-300/20 text-xs font-semibold text-emerald-300">
                                {result.title
                                  .split(" ")
                                  .map((part) => part[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-cyan-50 line-clamp-2">
                                  {result.title}
                                </p>
                                {result.description && (
                                  <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                                    {result.description}
                                  </p>
                                )}
                                {result.meta && (
                                  <p className="mt-2 text-xs text-slate-500">
                                    {result.meta}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="size-5 text-slate-500 mt-0.5 shrink-0" />
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : query ? (
          /* No Results State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-2xl border border-cyan-200/10 p-12 text-center"
          >
            <div className="mx-auto mb-4 size-16 rounded-full bg-slate-700/20 flex items-center justify-center">
              <Search className="size-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-cyan-50">No results found</h3>
            <p className="mt-2 text-slate-400">
              No tasks, projects, or members match "{query}"
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/dashboard")}
              className="mt-6 rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Back to Dashboard
            </motion.button>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-2xl border border-cyan-200/10 p-12 text-center"
          >
            <div className="mx-auto mb-4 size-16 rounded-full bg-slate-700/20 flex items-center justify-center">
              <Zap className="size-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-cyan-50">Start Searching</h3>
            <p className="mt-2 text-slate-400">
              Use the search bar to find tasks, projects, and team members
            </p>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
