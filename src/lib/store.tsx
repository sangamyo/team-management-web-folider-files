"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AppState, AuthUser, Health, Member, Priority, Project, Task, TaskStatus } from "./types";

function getApiUrl() {
  let url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  if (!url.startsWith("http")) url = `https://${url}`;
  if (url.endsWith("/")) url = url.slice(0, -1);
  if (url.endsWith("/api")) url = url.slice(0, -4);
  return `${url}/api`;
}
const API_URL = getApiUrl();
const TOKEN_KEY = "quantum-teams-token";
const USER_KEY = "quantum-teams-user";

const ACCENTS = [
  "from-cyan-400 to-blue-500",
  "from-violet-400 to-fuchsia-500",
  "from-emerald-300 to-cyan-400",
  "from-rose-400 to-orange-400",
  "from-sky-400 to-violet-500",
  "from-amber-400 to-orange-500",
];

const INITIAL_STATE: AppState = { projects: [], tasks: [], members: [] };

function initials(name: string | null = "QT") {
  if (!name || typeof name !== "string") return "QT";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "QT";
}

function taskStatusFromApi(task: any): TaskStatus {
  if (task.status === "Completed") return "Completed";
  if (task.status === "Overdue") return "Overdue";
  if (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed") return "Overdue";
  return task.status === "In Progress" ? "In Progress" : "Pending";
}

function progressFor(status: TaskStatus) {
  if (status === "Completed") return 100;
  if (status === "In Progress") return 50;
  if (status === "Overdue") return 20;
  return 0;
}

function normalizeUser(user: any): AuthUser {
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarColor: user.avatarColor,
  };
}

function normalizeMember(user: any, tasks: any[] = []): Member {
  const id = user.id || user._id;
  const assigned = tasks.filter((task) => {
    const assignee = task.assignee?._id || task.assignee?.id || task.assignee;
    return String(assignee) === String(id);
  });
  const completed = assigned.filter((task) => task.status === "Completed").length;

  return {
    id,
    name: user.name,
    email: user.email,
    initials: initials(user.name),
    role: user.role,
    score: assigned.length ? Math.round((completed / assigned.length) * 100) : 80,
    color: user.avatarColor || "cyan",
    tasks: assigned.length,
    completed,
    status: "Online",
  };
}

function normalizeProject(project: any, tasks: any[] = []): Project {
  const id = project.id || project._id;
  const projectTasks = tasks.filter((task) => {
    const taskProject = task.project?._id || task.project?.id || task.project;
    return String(taskProject) === String(id);
  });
  const completed = projectTasks.filter((task) => task.status === "Completed").length;
  const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
  const overdue = projectTasks.some((task) => taskStatusFromApi(task) === "Overdue");
  const health: Health =
    project.status === "Completed" || progress >= 90 ? "Elite" : overdue ? "At Risk" : progress >= 50 ? "On Track" : "Needs Focus";

  return {
    id,
    name: project.name || project.title,
    description: project.description || "",
    owner: project.owner?.name || "Admin",
    progress,
    due: project.deadline ? String(project.deadline).slice(0, 10) : "",
    health,
    accent: ACCENTS[Math.abs(id.split("").reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0)) % ACCENTS.length],
    members: (project.members || []).map((member: any) => (typeof member === "string" ? member : member._id || member.id)),
    tasks: projectTasks.length,
    completed,
    createdAt: project.createdAt || new Date().toISOString(),
  };
}

function normalizeTask(task: any): Task {
  const status = taskStatusFromApi(task);
  const projectId = task.project?._id || task.project?.id || task.project;
  const assignee = task.assignee?._id || task.assignee?.id || task.assignee || "";
  return {
    id: task.id || task._id,
    projectId,
    title: task.title,
    status,
    priority: task.priority,
    assignee,
    due: task.dueDate ? String(task.dueDate).slice(0, 10) : "",
    progress: typeof task.progress === "number" ? task.progress : progressFor(status),
    comments: Array.isArray(task.comments) ? task.comments.length : 0,
    activity: task.activity || [],
    tags: task.tags || [],
    createdAt: task.createdAt || new Date().toISOString(),
  };
}

async function parseResponse(res: Response) {
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : {};
  if (!res.ok) {
    if (!isJson && res.status >= 500) {
      throw new Error(`Backend server error (${res.status}). It might be waking up or crashing on Render.`);
    }
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

interface AppContextValue {
  state: AppState;
  user: AuthUser | null;
  token: string | null;
  ready: boolean;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string; role: "Admin" | "Member" }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  addProject: (p: { name: string; description?: string; due: string; members: string[]; status?: string }) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project> & { status?: string }) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (t: { projectId: string; title: string; status: TaskStatus; priority: Priority; assignee: string; due: string; tags?: string[] }) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, status: TaskStatus) => Promise<void>;
  addMember: (m: { name: string; email: string; role: "Admin" | "Member"; password?: string; color?: string }) => Promise<void>;
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
      const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
          ...(options.headers || {}),
        },
      });
      return parseResponse(res);
    },
    [token],
  );

  const refresh = useCallback(async () => {
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
    if (!activeToken) {
      setState(INITIAL_STATE);
      setReady(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${activeToken}` };
      const [me, projectsData, tasksData, teamData] = await Promise.all([
        fetch(`${API_URL}/auth/me`, { headers }).then(parseResponse),
        fetch(`${API_URL}/projects`, { headers }).then(parseResponse),
        fetch(`${API_URL}/tasks`, { headers }).then(parseResponse),
        fetch(`${API_URL}/teams`, { headers }).then(parseResponse),
      ]);
      const normalizedUser = normalizeUser(me.user);
      const rawTasks = tasksData.tasks || [];
      const tasks = rawTasks.map(normalizeTask);
      const members = (teamData.members || []).map((member: any) => normalizeMember(member, rawTasks));
      const projects = (projectsData.projects || []).map((project: any) => normalizeProject(project, rawTasks));
      setUser(normalizedUser);
      setToken(activeToken);
      localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
      setState({ projects, tasks, members });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load workspace";
      setError(message);
      if (message.toLowerCase().includes("auth") || message.toLowerCase().includes("token")) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
        setToken(null);
      }
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, [token]);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedToken) setToken(savedToken);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem(USER_KEY);
      }
    }
    refresh();
  }, [refresh]);

  async function authenticate(path: "/auth/login" | "/auth/signup", body: unknown) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(parseResponse);
      const normalizedUser = normalizeUser(data.user);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
      setToken(data.token);
      setUser(normalizedUser);
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const login = (email: string, password: string) => authenticate("/auth/login", { email, password });
  const signup = (payload: { name: string; email: string; password: string; role: "Admin" | "Member" }) =>
    authenticate("/auth/signup", payload);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
    setState(INITIAL_STATE);
  }, []);

  const addProject = async (p: { name: string; description?: string; due: string; members: string[]; status?: string }) => {
    await request("/projects", {
      method: "POST",
      body: JSON.stringify({ name: p.name, description: p.description, deadline: p.due, members: p.members, status: p.status }),
    });
    await refresh();
  };

  const updateProject = async (id: string, updates: Partial<Project> & { status?: string }) => {
    await request(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: updates.name,
        description: updates.description,
        deadline: updates.due,
        members: updates.members,
        status: updates.status,
      }),
    });
    await refresh();
  };

  const deleteProject = async (id: string) => {
    await request(`/projects/${id}`, { method: "DELETE" });
    await refresh();
  };

  const addTask = async (t: { projectId: string; title: string; status: TaskStatus; priority: Priority; assignee: string; due: string; tags?: string[] }) => {
    await request("/tasks", {
      method: "POST",
      body: JSON.stringify({
        project: t.projectId,
        title: t.title,
        status: t.status,
        priority: t.priority,
        assignee: t.assignee,
        dueDate: t.due,
        tags: t.tags || [],
      }),
    });
    await refresh();
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    await request(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: updates.title,
        status: updates.status,
        priority: updates.priority,
        assignee: updates.assignee,
        dueDate: updates.due,
        tags: updates.tags,
      }),
    });
    await refresh();
  };

  const deleteTask = async (id: string) => {
    await request(`/tasks/${id}`, { method: "DELETE" });
    await refresh();
  };

  const moveTask = async (id: string, status: TaskStatus) => {
    await request(`/tasks/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    await refresh();
  };

  const addMember = async (m: { name: string; email: string; role: "Admin" | "Member"; password?: string; color?: string }) => {
    await request("/teams", {
      method: "POST",
      body: JSON.stringify({ ...m, password: m.password || "password123", avatarColor: m.color || "cyan" }),
    });
    await refresh();
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    await request(`/teams/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: updates.name, role: updates.role, avatarColor: updates.color }),
    });
    await refresh();
  };

  const deleteMember = async (id: string) => {
    await request(`/teams/${id}`, { method: "DELETE" });
    await refresh();
  };

  const value: AppContextValue = {
      state,
      user,
      token,
      ready,
      loading,
      error,
      isAdmin: user?.role === "Admin",
      login,
      signup,
      logout,
      refresh,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      addMember,
      updateMember,
      deleteMember,
    };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
