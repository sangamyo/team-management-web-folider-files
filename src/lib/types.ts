/* ─────────────────────────────────────────────
   Shared types for the entire app
───────────────────────────────────────────── */

export type Priority = "Critical" | "High" | "Medium" | "Low";
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";
export type Health = "Elite" | "On Track" | "Needs Focus" | "At Risk";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  due: string;
  progress: number;
  comments: number;
  activity: string[];
  tags: string[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  progress: number;
  due: string;
  health: Health;
  accent: string;
  members: string[];
  tasks: number;
  completed: number;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  initials: string;
  role: "Admin" | "Member";
  score: number;
  color: string;
  tasks: number;
  completed: number;
  status: "Online" | "Away" | "Offline";
  email?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member";
  avatarColor?: string;
}

export interface AppState {
  projects: Project[];
  tasks: Task[];
  members: Member[];
}
