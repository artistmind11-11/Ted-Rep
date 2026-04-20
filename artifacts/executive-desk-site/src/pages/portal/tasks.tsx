import { useState } from "react";
import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData, Task, TaskStatus } from "@/lib/portal-data";
import { CheckSquare, AlertCircle, Clock, XCircle, CheckCircle2, Filter } from "lucide-react";

const STATUS_ICONS: Record<TaskStatus, React.ComponentType<{size?: number; className?: string}>> = {
  Active: CheckSquare,
  Pending: Clock,
  Blocked: XCircle,
  Completed: CheckCircle2,
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  Active: "text-green-400 bg-green-400/10 border-green-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Blocked: "text-red-400 bg-red-400/10 border-red-400/20",
  Completed: "text-[#9B8B5F] bg-[#9B8B5F]/10 border-[#9B8B5F]/20",
};

const PRIORITY_COLORS: Record<string, string> = {
  High: "text-red-400 bg-red-400/10",
  Medium: "text-amber-400 bg-amber-400/10",
  Low: "text-[#555555] bg-[#1F1F1F]",
};

function TaskCard({ task, clientName, canUpdate }: { task: Task; clientName?: string; canUpdate: boolean }) {
  const { updateTaskStatus, addAuditEntry } = usePortalData();
  const { user } = usePortalAuth();
  const [open, setOpen] = useState(false);
  const Icon = STATUS_ICONS[task.status];

  const handleStatus = (status: TaskStatus) => {
    updateTaskStatus(task.id, status);
    addAuditEntry({
      action: "Task Updated",
      user: user?.name ?? "User",
      timestamp: new Date().toLocaleString("en-AE"),
      detail: `Task "${task.title}" updated to ${status}`,
    });
    setOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#141414] border border-[#222222] rounded-sm hover:border-[#2A2A2A] transition-colors"
    >
      <div
        className="p-5 cursor-pointer"
        onClick={() => setOpen(!open)}
        data-testid={`task-card-${task.id}`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${STATUS_COLORS[task.status].split(" ")[1]} ${STATUS_COLORS[task.status].split(" ")[2]}`}>
            <Icon size={15} className={STATUS_COLORS[task.status].split(" ")[0]} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-[#F8F8F6] text-sm font-medium leading-snug">{task.title}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-sm ${PRIORITY_COLORS[task.priority]}`}>
                  {task.priority}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-sm border ${STATUS_COLORS[task.status]}`}>
                  {task.status}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[#555555]">
              {clientName && <span>Client: <span className="text-[#888888]">{clientName}</span></span>}
              <span>Due: <span className="text-[#888888]">{task.dueDate}</span></span>
              <span>Created: <span className="text-[#888888]">{task.createdAt}</span></span>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-[#1F1F1F] px-5 py-4"
        >
          <p className="text-[#888888] text-sm leading-relaxed mb-4">{task.description}</p>
          {canUpdate && task.status !== "Completed" && (
            <div className="flex flex-wrap gap-2">
              <p className="text-[#555555] text-xs self-center">Update status:</p>
              {(["Active", "Pending", "Completed", "Blocked"] as TaskStatus[])
                .filter((s) => s !== task.status)
                .map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatus(s)}
                    data-testid={`button-task-status-${s}`}
                    className={`text-xs px-3 py-1 rounded-sm border transition-colors ${STATUS_COLORS[s]} hover:opacity-80`}
                  >
                    {s}
                  </button>
                ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Tasks() {
  const { user, can } = usePortalAuth();
  const { tasks, clients } = usePortalData();
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "All">("All");

  const myTasks = can("view_tasks_all")
    ? tasks
    : tasks.filter((t) => t.clientId === user?.clientId || t.assignedTo === user?.id);

  const filtered = filterStatus === "All" ? myTasks : myTasks.filter((t) => t.status === filterStatus);
  const canUpdate = can("create_tasks") || can("approve_tasks");

  const counts = {
    All: myTasks.length,
    Active: myTasks.filter((t) => t.status === "Active").length,
    Pending: myTasks.filter((t) => t.status === "Pending").length,
    Blocked: myTasks.filter((t) => t.status === "Blocked").length,
    Completed: myTasks.filter((t) => t.status === "Completed").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-[#F8F8F6]">Tasks</h1>
          <p className="text-[#555555] text-sm mt-0.5">
            {can("view_tasks_all") ? "All firm directives" : "Your assigned tasks"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[#555555] text-xs">
          <Filter size={14} />
          <span>Filter</span>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["All", "Active", "Pending", "Blocked", "Completed"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            data-testid={`filter-${s}`}
            className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
              filterStatus === s
                ? s === "All" ? "bg-[#9B8B5F]/20 text-[#9B8B5F] border-[#9B8B5F]/40"
                  : STATUS_COLORS[s as TaskStatus]
                : "border-[#222222] text-[#555555] hover:border-[#333333] hover:text-[#888888]"
            }`}
          >
            {s} <span className="opacity-60 ml-1">({counts[s]})</span>
          </button>
        ))}
      </div>

      {/* Blocked alert */}
      {counts.Blocked > 0 && can("view_tasks_all") && (
        <div className="flex items-center gap-3 bg-red-400/5 border border-red-400/20 rounded-sm px-4 py-3 mb-6">
          <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">
            {counts.Blocked} task{counts.Blocked > 1 ? "s" : ""} blocked — requires attention.
          </p>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#444444]">
            <CheckSquare size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No tasks found</p>
          </div>
        ) : (
          filtered.map((task) => {
            const client = clients.find((c) => c.id === task.clientId);
            return (
              <TaskCard
                key={task.id}
                task={task}
                clientName={can("view_all_clients") ? client?.company : undefined}
                canUpdate={canUpdate}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
