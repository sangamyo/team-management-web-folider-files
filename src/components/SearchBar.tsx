"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, Zap } from "lucide-react";
import { useApp } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface SearchResult {
  id: string;
  title: string;
  type: "task" | "project" | "member";
  description?: string;
  icon?: string;
  path: string;
}

export function SearchBar() {
  const router = useRouter();
  const { state } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Perform search
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setSelectedIndex(-1);
        return;
      }

      const query = searchQuery.toLowerCase();
      const searchResults: SearchResult[] = [];

      // Search in tasks
      state.tasks.forEach((task) => {
        if (
          task.title.toLowerCase().includes(query) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(query))
        ) {
          searchResults.push({
            id: task.id,
            title: task.title,
            type: "task",
            description: `Status: ${task.status} | Priority: ${task.priority}`,
            path: `/dashboard?task=${task.id}`,
          });
        }
      });

      // Search in projects
      state.projects.forEach((project) => {
        if (
          project.name.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query)
        ) {
          searchResults.push({
            id: project.id,
            title: project.name,
            type: "project",
            description: `Owner: ${project.owner} | Progress: ${project.progress}%`,
            path: `/projects/${project.id}`,
          });
        }
      });

      // Search in members
      state.members.forEach((member) => {
        if (
          member.name.toLowerCase().includes(query) ||
          member.email?.toLowerCase().includes(query)
        ) {
          searchResults.push({
            id: member.id,
            title: member.name,
            type: "member",
            description: `Role: ${member.role} | Completed: ${member.completed}/${member.tasks}`,
            path: `/team?member=${member.id}`,
          });
        }
      });

      setResults(searchResults.slice(0, 8)); // Limit to 8 results
      setSelectedIndex(-1);
    },
    [state]
  );

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
    setIsOpen(true);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          router.push(results[selectedIndex].path);
          setIsOpen(false);
          setQuery("");
        } else if (query.trim()) {
          router.push(`/search?q=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setQuery("");
        break;
    }
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: "task" | "project" | "member") => {
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
        return "bg-cyan-300/10 text-cyan-300";
      case "project":
        return "bg-violet-300/10 text-violet-300";
      case "member":
        return "bg-emerald-300/10 text-emerald-300";
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm text-slate-300 focus-within:border-cyan-300/50 focus-within:bg-white/8 transition">
        <Search className="size-4 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search tasks, projects, teams..."
          className="flex-1 bg-transparent outline-none placeholder-slate-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="p-1 hover:bg-white/10 rounded transition"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-cyan-200/10 bg-[#050815]/95 shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden z-50"
          >
            {results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {results.map((result, idx) => (
                  <motion.button
                    key={result.id}
                    onClick={() => {
                      router.push(result.path);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    whileHover={{ x: 4 }}
                    className={clsx(
                      "w-full flex items-start gap-3 px-4 py-3 text-left transition",
                      selectedIndex === idx
                        ? "bg-cyan-300/15 border-l-2 border-cyan-300"
                        : "hover:bg-white/5 border-l-2 border-transparent"
                    )}
                  >
                    {/* Icon/Avatar */}
                    <div
                      className={clsx(
                        "mt-0.5 size-9 rounded-lg flex items-center justify-center shrink-0 font-semibold text-sm",
                        getTypeColor(result.type)
                      )}
                    >
                      {result.type === "member" && result.title
                        ? result.title
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : getIcon(result.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-cyan-50 truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {result.description}
                      </p>
                    </div>

                    {/* Type Badge */}
                    <div
                      className={clsx(
                        "px-2 py-1 rounded text-xs font-medium capitalize shrink-0",
                        getTypeColor(result.type)
                      )}
                    >
                      {result.type}
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="px-4 py-8 text-center">
                <p className="text-slate-400">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="px-4 py-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <Zap className="size-3" />
                  Quick Actions
                </div>
                {[
                  { label: "Search all tasks", path: "/dashboard" },
                  { label: "View all projects", path: "/projects" },
                  { label: "Team members", path: "/team" },
                ].map((action) => (
                  <button
                    key={action.path}
                    onClick={() => {
                      router.push(action.path);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 transition text-left"
                  >
                    <Clock className="size-3" />
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
