"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TaskModal } from "@/components/TaskModal";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { LayoutGrid, List, Plus, Trash2, Edit3, GripVertical, CalendarClock, MessageSquare, Tag } from "lucide-react";
import type { Task, TaskStatus } from "@/lib/types";
import {
  DndContext, DragEndEvent, PointerSensor, useDraggable,
  useDroppable, useSensor, useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const columns: { id: TaskStatus; title: string; dot: string }[] = [
  { id: "Pending", title: "Pending", dot: "bg-slate-400" },
  { id: "In Progress", title: "In Progress", dot: "bg-violet-400" },
  { id: "Completed", title: "Completed", dot: "bg-emerald-400" },
  { id: "Overdue", title: "Overdue", dot: "bg-rose-400" },
];

export default function BoardPage() {
  const { state, moveTask, deleteTask, isAdmin, user } = useApp();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskProjectId, setNewTaskProjectId] = useState<string>("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const filteredTasks = filterProject === "all"
    ? state.tasks
    : state.tasks.filter((t) => t.projectId === filterProject);

  function handleDragEnd(e: DragEndEvent) {
    const taskId = String(e.active.id);
    const targetStatus = e.over?.id ? String(e.over.id) as TaskStatus : null;
    if (targetStatus && columns.find((c) => c.id === targetStatus)) {
      void moveTask(taskId, targetStatus);
    }
  }

  function openNewTask() {
    const pid = filterProject !== "all" ? filterProject : (state.projects[0]?.id ?? "");
    setNewTaskProjectId(pid);
    setEditingTask(null);
    setTaskModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setNewTaskProjectId(task.projectId);
    setTaskModalOpen(true);
  }

  return (
    <AppShell title="Kanban Task Board">
      <TaskModal
        open={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
        projectId={newTaskProjectId}
        editing={editingTask}
      />

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Project filter */}
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-200 outline-none hover:border-cyan-300/30 transition"
        >
          <option value="all">All Projects</option>
          {state.projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <p className="text-sm text-slate-400">{filteredTasks.length} tasks</p>

        <div className="ml-auto flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
            <button onClick={() => setView("kanban")} className={`grid size-8 place-items-center rounded-full transition ${view === "kanban" ? "bg-cyan-300/15 text-cyan-200" : "text-slate-400 hover:text-white"}`}>
              <LayoutGrid className="size-4" />
            </button>
            <button onClick={() => setView("list")} className={`grid size-8 place-items-center rounded-full transition ${view === "list" ? "bg-cyan-300/15 text-cyan-200" : "text-slate-400 hover:text-white"}`}>
              <List className="size-4" />
            </button>
          </div>
          {isAdmin && (
            <button
              onClick={openNewTask}
              disabled={state.projects.length === 0}
              className="magnetic inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-40"
            >
              <Plus className="size-4" /> Add task
            </button>
          )}
        </div>
      </div>

      {state.projects.length === 0 && (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <p className="text-slate-400">Create a project first before adding tasks.</p>
        </div>
      )}

      {/* Kanban View */}
      {view === "kanban" && state.projects.length > 0 && (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid gap-4 xl:grid-cols-3">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.id);
              return (
                <SortableContext key={col.id} items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <KanbanColumn col={col} tasks={colTasks} onEdit={openEdit} onDelete={(id) => void deleteTask(id)} isAdmin={isAdmin} userId={user?.id || ""} />
                </SortableContext>
              );
            })}
          </div>
        </DndContext>
      )}

      {/* List View */}
      {view === "list" && state.projects.length > 0 && (
        <div className="glass-panel rounded-3xl p-4">
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task, i) => {
                const project = state.projects.find((p) => p.id === task.projectId);
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 rounded-2xl bg-white/[0.04] p-4 transition hover:bg-white/[0.06]"
                  >
                    <span className={`size-2.5 shrink-0 rounded-full ${task.status === "Completed" ? "bg-emerald-400" : task.status === "In Progress" ? "bg-violet-400" : task.status === "Overdue" ? "bg-rose-400" : "bg-slate-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${task.status === "Completed" ? "line-through text-slate-400" : ""}`}>{task.title}</p>
                      <p className="text-xs text-slate-500">{project?.name ?? "Unknown"} · {state.members.find((m) => m.id === task.assignee)?.name ?? "Unassigned"} · {task.due || "No due date"}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                      task.priority === "Critical" ? "badge-critical" :
                      task.priority === "High" ? "badge-high" :
                      task.priority === "Medium" ? "badge-medium" : "badge-low"
                    }`}>{task.priority}</span>
                    <div className="hidden h-1.5 w-16 rounded-full bg-white/10 sm:block">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${task.progress}%` }} />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(task)} className="grid size-7 place-items-center rounded-full text-slate-400 hover:text-cyan-200 transition"><Edit3 className="size-3.5" /></button>
                      {(isAdmin || task.assignee === user?.id) && <button onClick={() => void deleteTask(task.id)} className="grid size-7 place-items-center rounded-full text-slate-400 hover:text-rose-300 transition"><Trash2 className="size-3.5" /></button>}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredTasks.length === 0 && (
              <p className="py-8 text-center text-slate-400">No tasks found. Click Add task to get started.</p>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function KanbanColumn({ col, tasks, onEdit, onDelete, isAdmin, userId }: {
  col: { id: TaskStatus; title: string; dot: string };
  tasks: Task[];
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
  userId: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  return (
    <div ref={setNodeRef} className={`glass-panel min-h-[480px] rounded-3xl p-4 transition-all ${isOver ? "ring-2 ring-cyan-300/40 shadow-[0_0_30px_rgba(34,211,238,0.12)]" : ""}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`size-2.5 rounded-full ${col.dot}`} />
          <h2 className="text-lg font-semibold">{col.title}</h2>
        </div>
        <span className="rounded-full bg-white/8 px-3 py-1 text-sm text-slate-300">{tasks.length}</span>
      </div>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div key={task.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
              <KanbanCard task={task} onEdit={onEdit} onDelete={onDelete} isAdmin={isAdmin} userId={userId} />
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-white/10 py-8 text-center text-sm text-slate-500">Drop tasks here</div>
        )}
      </div>
    </div>
  );
}

function KanbanCard({ task, onEdit, onDelete, isAdmin, userId }: { task: Task; onEdit: (t: Task) => void; onDelete: (id: string) => void; isAdmin: boolean; userId: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)`, zIndex: 20 } : undefined;
  const { state } = useApp();
  const member = state.members.find((m) => m.id === task.assignee);
  const assigneeLabel = member ? (member.initials || member.name) : (task.assignee || "-");
  return (
    <div ref={setNodeRef} style={style} {...attributes} className={`holo-card rounded-2xl p-4 ${isDragging ? "opacity-70 shadow-[0_0_40px_rgba(34,211,238,0.2)]" : ""}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="font-medium leading-snug min-w-0 truncate">{task.title}</p>
        <div className="flex shrink-0 gap-1">
          {(isAdmin || task.assignee === userId) && <button onClick={() => onEdit(task)} className="grid size-7 place-items-center rounded-full text-slate-400 hover:text-cyan-200 transition"><Edit3 className="size-3.5" /></button>}
          {(isAdmin || task.assignee === userId) && <button onClick={() => onDelete(task.id)} className="grid size-7 place-items-center rounded-full text-slate-400 hover:text-rose-300 transition"><Trash2 className="size-3.5" /></button>}
          <span className="cursor-grab" {...listeners}><GripVertical className="size-4 text-slate-500" /></span>
        </div>
      </div>
      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${task.priority === "Critical" ? "badge-critical" : task.priority === "High" ? "badge-high" : task.priority === "Medium" ? "badge-medium" : "badge-low"}`}>
        {task.priority}
      </span>
      <div className="mt-3 h-1 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${task.progress}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
  <span className="grid size-6 place-items-center rounded-full bg-cyan-300/10 text-[10px] font-semibold text-cyan-100">{assigneeLabel}</span>
        {task.due && <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-1"><CalendarClock className="size-3" />{task.due}</span>}
        <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-1"><MessageSquare className="size-3" />{task.comments}</span>
        {task.tags?.slice(0, 2).map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-cyan-300/10 px-2 py-1 text-cyan-100"><Tag className="size-2.5" />{t}</span>
        ))}
      </div>
    </div>
  );
}
