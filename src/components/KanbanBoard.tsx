"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CalendarClock, GripVertical, MessageSquare, Tag } from "lucide-react";
import { tasks as seedTasks } from "@/lib/data";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";

const columns = [
  { id: "Pending", title: "Todo", glow: "border-sky-300/20", dotColor: "bg-slate-400" },
  { id: "In Progress", title: "In Orbit", glow: "border-violet-300/20", dotColor: "bg-violet-400" },
  { id: "Completed", title: "Shipped", glow: "border-emerald-300/20", dotColor: "bg-emerald-400" },
];

export function KanbanBoard() {
  const [items, setItems] = useState(seedTasks);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const grouped = useMemo(
    () => columns.map((col) => ({ ...col, tasks: items.filter((t) => t.status === col.id) })),
    [items],
  );

  function handleDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : "";
    if (!overId) return;
    const targetStatus = columns.find((c) => c.id === overId)?.id;
    if (!targetStatus) return;
    setItems((cur) => cur.map((t) => (t.id === activeId ? { ...t, status: targetStatus } : t)));
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 xl:grid-cols-3">
        {grouped.map((col) => (
          <SortableContext key={col.id} items={col.tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <KanbanColumn column={col} />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
}

function KanbanColumn({ column }: { column: { id: string; title: string; glow: string; dotColor: string; tasks: typeof seedTasks } }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`glass-panel min-h-[520px] rounded-3xl p-4 transition-all duration-200 ${column.glow} ${isOver ? "ring-2 ring-cyan-300/50 shadow-[0_0_40px_rgba(34,211,238,0.15)]" : ""}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`size-2.5 rounded-full ${column.dotColor}`} />
          <h2 className="text-lg font-semibold">{column.title}</h2>
        </div>
        <span className="rounded-full bg-white/8 px-3 py-1 text-sm text-slate-300">{column.tasks.length}</span>
      </div>
      <div className="space-y-3">
        {column.tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: (typeof seedTasks)[number] }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 20 } : undefined;
  const { state } = useApp();
  const member = state.members.find((m) => m.id === task.assignee);
  const assigneeLabel = member ? (member.initials || member.name) : (task.assignee || "-");

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`holo-card cursor-grab rounded-2xl p-4 transition-all ${isDragging ? "opacity-70 shadow-[0_0_40px_rgba(34,211,238,0.2)]" : ""}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{task.title}</p>
          <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
            task.priority === "Critical" ? "badge-critical" :
            task.priority === "High" ? "badge-high" :
            task.priority === "Medium" ? "badge-medium" : "badge-low"
          }`}>
            {task.priority}
          </span>
        </div>
        <GripVertical className="size-4 shrink-0 text-slate-500" />
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-1 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
          style={{ width: `${task.progress}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
        <span className="grid size-6 place-items-center rounded-full bg-cyan-300/10 text-[10px] font-semibold text-cyan-100">{assigneeLabel}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-1">
          <CalendarClock className="size-3" /> {task.due}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-1">
          <MessageSquare className="size-3" /> {task.comments}
        </span>
        {task.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-cyan-300/10 px-2 py-1 text-cyan-100">
            <Tag className="size-2.5" /> {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
