import { useState } from "react";
import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData, Task, TaskStatus } from "@/lib/portal-data";
import { CheckSquare, Clock, AlertTriangle, CheckCircle2, Plus, MessageSquare } from "lucide-react";
import { InitializeTaskModal, ToolbarButton } from "@/components/portal-forms";

const PRIORITY_STYLE: Record<string, string> = {
  Urgent:   "text-red-400 bg-red-400/10 border border-red-400/20",
  High:     "text-[#9B8B5F] bg-[#9B8B5F]/10 border border-[#9B8B5F]/20",
  Standard: "text-[#666] bg-[#1A1A1A] border border-[#222]",
  Low:      "text-[#444] bg-[#1A1A1A] border border-[#222]",
};

const PRIORITY_BORDER: Record<string, string> = {
  Urgent:   "border-l-2 border-l-red-400",
  High:     "border-l-2 border-l-[#9B8B5F]",
  Standard: "",
  Low:      "",
};

function TaskCard({ task, canUpdate, canDispute, isClient }: { task: Task; canUpdate: boolean; canDispute: boolean; isClient: boolean }) {
  const { user } = usePortalAuth();
  const { updateTaskStatus, updateTaskHours, clients } = usePortalData();
  const [editingHours, setEditingHours] = useState(false);
  const [hoursDraft, setHoursDraft] = useState(task.actualHours.toString());
  const client = clients.find((c) => c.id === task.clientId);

  const utilPct = task.estimatedHours ? Math.min(100, Math.round((task.actualHours / task.estimatedHours) * 100)) : 0;
  const overBudget = task.actualHours > task.estimatedHours && task.estimatedHours > 0;

  const commitHours = () => {
    const h = parseFloat(hoursDraft);
    if (!isNaN(h) && h >= 0 && h !== task.actualHours) {
      updateTaskHours(user?.name ?? "User", task.id, h);
    }
    setEditingHours(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-[#161616] border border-[#1E1E1E] rounded-sm p-3.5 hover:bg-[#191919] transition-colors mb-2 ${PRIORITY_BORDER[task.priority]} ${task.status === "Completed" ? "opacity-60" : ""} ${task.status === "Disputed" ? "border-orange-400/30" : ""}`}
      data-testid={`task-${task.id}`}>
      <div className="mb-2">
        <p className="text-[#F8F8F6] text-sm font-light leading-snug">{task.title}</p>
        <div className="flex items-center gap-2 mt-1 text-[10px]">
          <span className="text-[#444] uppercase tracking-wider">{task.category}</span>
          {client && <span className="text-[#9B8B5F] font-mono">{client.code}</span>}
        </div>
        {task.description && <p className="text-[#555] text-xs mt-2 leading-snug line-clamp-2">{task.description}</p>}
        {task.disputeReason && (
          <div className="flex items-start gap-1.5 mt-2 p-1.5 bg-orange-400/5 border border-orange-400/20 rounded-sm">
            <MessageSquare size={10} className="text-orange-400 mt-0.5 flex-shrink-0" />
            <p className="text-orange-300 text-[10px] leading-snug">{task.disputeReason}</p>
          </div>
        )}
      </div>

      {task.estimatedHours > 0 && (
        <div className="mb-2.5">
          <div className="flex items-center justify-between mb-1 text-[10px]">
            <span className="text-[#444]">Utilisation</span>
            <span className={overBudget ? "text-red-400" : "text-[#888]"}>
              {editingHours ? (
                <input type="number" autoFocus min={0} step={0.25} value={hoursDraft}
                  onChange={(e) => setHoursDraft(e.target.value)} onBlur={commitHours}
                  onKeyDown={(e) => e.key === "Enter" && commitHours()}
                  data-testid={`hours-input-${task.id}`}
                  className="w-12 bg-[#0F0F0F] border border-[#9B8B5F]/40 text-[#F8F8F6] text-[10px] px-1 py-0 rounded-sm focus:outline-none" />
              ) : (
                <button onClick={() => canUpdate && setEditingHours(true)}
                  data-testid={`hours-display-${task.id}`}
                  className={canUpdate ? "hover:text-[#9B8B5F] cursor-pointer" : "cursor-default"}>
                  {task.actualHours} / {task.estimatedHours}h
                </button>
              )}
            </span>
          </div>
          <div className="h-0.5 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 ${overBudget ? "bg-red-400" : "bg-[#9B8B5F]"}`}
              style={{ width: `${utilPct}%` }} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <p className="text-[#333] text-[10px]">{task.dueDate}</p>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${PRIORITY_STYLE[task.priority]}`}>{task.priority}</span>
          {canUpdate && task.status !== "Completed" && task.status !== "Disputed" && (
            <select value={task.status}
              onChange={(e) => updateTaskStatus(user?.name ?? "User", task.id, e.target.value as TaskStatus)}
              data-testid={`select-task-${task.id}`}
              className="text-[10px] bg-[#1A1A1A] border border-[#222] text-[#666] rounded-sm px-1 py-0.5 focus:outline-none focus:border-[#9B8B5F] cursor-pointer">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}
          {isClient && canDispute && task.status !== "Completed" && task.status !== "Disputed" && (
            <button onClick={() => {
              const r = window.prompt("What is the issue with this directive?") || undefined;
              if (r) updateTaskStatus(user?.name ?? "Client", task.id, "Disputed", r);
            }} data-testid={`dispute-task-${task.id}`}
              className="text-[10px] text-orange-400 hover:text-orange-300 px-1.5 py-0.5 border border-orange-400/20 rounded-sm">
              Dispute
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function KanbanColumn({ title, tasks, status, icon: Icon, canUpdate, canDispute, isClient }: {
  title: string; tasks: Task[]; status: TaskStatus;
  icon: React.ComponentType<{size?: number; className?: string}>;
  canUpdate: boolean; canDispute: boolean; isClient: boolean;
}) {
  const colorMap: Record<TaskStatus, string> = {
    Pending: "text-amber-400",
    "In Progress": "text-[#9B8B5F]",
    Completed: "text-green-400",
    Disputed: "text-orange-400",
  };
  return (
    <div className="flex flex-col min-h-[400px]">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1F1F1F]">
        <Icon size={14} className={colorMap[status]} />
        <p className="text-[#888] text-xs uppercase tracking-widest">{title}</p>
        <span className="ml-auto bg-[#1A1A1A] text-[#444] text-xs px-1.5 py-0.5 rounded-sm">{tasks.length}</span>
      </div>
      <div className="flex-1">
        {tasks.length === 0
          ? <div className="border border-dashed border-[#1A1A1A] rounded-sm h-20 flex items-center justify-center text-[#2A2A2A] text-xs">Empty</div>
          : tasks.map((t) => <TaskCard key={t.id} task={t} canUpdate={canUpdate} canDispute={canDispute} isClient={isClient} />)}
      </div>
    </div>
  );
}

export default function Tasks() {
  const { user, can } = usePortalAuth();
  const { tasks } = usePortalData();
  const [showInit, setShowInit] = useState(false);

  const myTasks = can("view_tasks_all") ? tasks : tasks.filter((t) => t.clientId === user?.clientId || t.assignedTo === user?.id);
  const canUpdate = can("create_tasks") || can("approve_tasks");
  const isClient = user?.role === "client";
  const canDispute = isClient;

  const pending     = myTasks.filter((t) => t.status === "Pending");
  const inProgress  = myTasks.filter((t) => t.status === "In Progress");
  const completed   = myTasks.filter((t) => t.status === "Completed");
  const disputed    = myTasks.filter((t) => t.status === "Disputed");

  const completionRate = myTasks.length ? Math.round((completed.length / myTasks.length) * 100) : 0;

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Kanban Board</p>
          <h1 className="font-serif text-2xl text-[#F8F8F6]">Task Management</h1>
        </div>
        {can("create_tasks") && (
          <ToolbarButton onClick={() => setShowInit(true)} icon={Plus} label="Initialize Task" dataTestid="open-init-task" />
        )}
      </div>
      <InitializeTaskModal open={showInit} onClose={() => setShowInit(false)} defaultClientId={user?.clientId} />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Tasks",  value: myTasks.length, color: "text-[#F8F8F6]" },
          { label: "In Progress",  value: inProgress.length, color: "text-[#9B8B5F]" },
          { label: "Completion",   value: `${completionRate}%`, color: "text-green-400" },
          { label: "Disputed",     value: disputed.length, color: disputed.length > 0 ? "text-orange-400" : "text-[#333]" },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-[#141414] border border-[#222] rounded-sm p-5 group hover:border-[#9B8B5F]/20 transition-colors relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9B8B5F]/0 to-transparent group-hover:via-[#9B8B5F]/30 transition-all duration-500" />
            <p className="text-[#555] text-xs uppercase tracking-widest mb-3">{label}</p>
            <p className={`font-serif text-2xl ${color}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {disputed.length > 0 && (
        <div className="flex items-center gap-2 bg-orange-400/5 border border-orange-400/20 rounded-sm px-4 py-3 mb-6">
          <AlertTriangle size={14} className="text-orange-400" />
          <p className="text-orange-400 text-sm">{disputed.length} disputed directive{disputed.length > 1 ? "s" : ""} — analyst intervention required</p>
        </div>
      )}

      {/* Kanban */}
      <div className={`grid grid-cols-1 ${disputed.length > 0 ? "md:grid-cols-4" : "md:grid-cols-3"} gap-6`}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}
          className="bg-[#141414] border border-[#222] rounded-sm p-5">
          <KanbanColumn title="Pending" tasks={pending} status="Pending" icon={Clock} canUpdate={canUpdate} canDispute={canDispute} isClient={isClient} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}
          className="bg-[#141414] border border-[#222] rounded-sm p-5">
          <KanbanColumn title="In Progress" tasks={inProgress} status="In Progress" icon={CheckSquare} canUpdate={canUpdate} canDispute={canDispute} isClient={isClient} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
          className="bg-[#141414] border border-[#222] rounded-sm p-5">
          <KanbanColumn title="Completed" tasks={completed} status="Completed" icon={CheckCircle2} canUpdate={canUpdate} canDispute={canDispute} isClient={isClient} />
        </motion.div>
        {disputed.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.41 }}
            className="bg-[#141414] border border-orange-400/20 rounded-sm p-5">
            <KanbanColumn title="Disputed" tasks={disputed} status="Disputed" icon={AlertTriangle} canUpdate={canUpdate} canDispute={canDispute} isClient={isClient} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
