import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData, Task, TaskStatus } from "@/lib/portal-data";
import { CheckSquare, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

const PRIORITY_STYLE: Record<string, string> = {
  Urgent: "text-red-400 bg-red-400/10 border border-red-400/20",
  High: "text-[#9B8B5F] bg-[#9B8B5F]/10 border border-[#9B8B5F]/20",
  Standard: "text-[#444] bg-[#1A1A1A] border border-[#222]",
};

const PRIORITY_BORDER: Record<string, string> = {
  Urgent: "border-l-2 border-l-red-400",
  High: "border-l-2 border-l-[#9B8B5F]",
  Standard: "",
};

const STATUS_ICONS: Record<TaskStatus, React.ComponentType<{size?: number; className?: string}>> = {
  "To Do": Clock,
  "In Progress": CheckSquare,
  Completed: CheckCircle2,
  Overdue: AlertTriangle,
};

function TaskCard({ task, canUpdate }: { task: Task; canUpdate: boolean }) {
  const { updateTaskStatus } = usePortalData();
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-[#161616] border border-[#1E1E1E] rounded-sm p-4 hover:bg-[#191919] transition-colors mb-2 ${PRIORITY_BORDER[task.priority]} ${task.status === "Completed" ? "opacity-50" : ""}`}
      data-testid={`task-${task.id}`}>
      <div className="mb-2">
        <p className="text-[#F8F8F6] text-sm font-light leading-snug">{task.title}</p>
        <p className="text-[#444] text-[10px] mt-0.5 uppercase tracking-wider">{task.category}</p>
      </div>
      <div className="flex items-center justify-between mt-3">
        <p className="text-[#333] text-xs">{task.dueDate}</p>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${PRIORITY_STYLE[task.priority]}`}>
            {task.priority}
          </span>
          {canUpdate && task.status !== "Completed" && (
            <select
              value={task.status}
              onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
              data-testid={`select-task-${task.id}`}
              className="text-[10px] bg-[#1A1A1A] border border-[#222] text-[#555] rounded-sm px-1 py-0.5 focus:outline-none focus:border-[#9B8B5F] cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function KanbanColumn({ title, tasks, status, icon: Icon, canUpdate }: {
  title: string; tasks: Task[]; status: TaskStatus;
  icon: React.ComponentType<{size?: number; className?: string}>; canUpdate: boolean;
}) {
  const colorMap: Record<TaskStatus, string> = {
    "To Do": "text-amber-400",
    "In Progress": "text-[#9B8B5F]",
    Completed: "text-green-400",
    Overdue: "text-red-400",
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
          : tasks.map((t) => <TaskCard key={t.id} task={t} canUpdate={canUpdate} />)}
      </div>
    </div>
  );
}

export default function Tasks() {
  const { user, can } = usePortalAuth();
  const { tasks } = usePortalData();

  const myTasks = can("view_tasks_all") ? tasks : tasks.filter((t) => t.clientId === user?.clientId || t.assignedTo === user?.id);
  const canUpdate = can("create_tasks") || can("approve_tasks");

  const todo = myTasks.filter((t) => t.status === "To Do");
  const inProgress = myTasks.filter((t) => t.status === "In Progress");
  const completed = myTasks.filter((t) => t.status === "Completed");
  const overdue = myTasks.filter((t) => t.status === "Overdue");

  const completionRate = myTasks.length ? Math.round((completed.length / myTasks.length) * 100) : 0;

  return (
    <div>
      <div className="mb-6">
        <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Kanban Board</p>
        <h1 className="font-serif text-2xl text-[#F8F8F6]">Task Management</h1>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Tasks", value: myTasks.length, color: "text-[#F8F8F6]" },
          { label: "In Progress", value: inProgress.length, color: "text-[#9B8B5F]" },
          { label: "Completed", value: `${completionRate}%`, color: "text-green-400" },
          { label: "Overdue", value: overdue.length, color: overdue.length > 0 ? "text-red-400" : "text-[#333]" },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-[#141414] border border-[#222] rounded-sm p-5 group hover:border-[#9B8B5F]/20 transition-colors relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9B8B5F]/0 to-transparent group-hover:via-[#9B8B5F]/30 transition-all duration-500" />
            <p className="text-[#555] text-xs uppercase tracking-widest mb-3">{label}</p>
            <p className={`font-serif text-2xl ${color}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {overdue.length > 0 && (
        <div className="flex items-center gap-2 bg-red-400/5 border border-red-400/20 rounded-sm px-4 py-3 mb-6">
          <AlertTriangle size={14} className="text-red-400" />
          <p className="text-red-400 text-sm">{overdue.length} task{overdue.length > 1 ? "s" : ""} overdue — immediate attention required</p>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#141414] border border-[#222] rounded-sm p-5">
          <KanbanColumn title="To Do" tasks={todo} status="To Do" icon={Clock} canUpdate={canUpdate} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}
          className="bg-[#141414] border border-[#222] rounded-sm p-5">
          <KanbanColumn title="In Progress" tasks={inProgress} status="In Progress" icon={CheckSquare} canUpdate={canUpdate} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
          className="bg-[#141414] border border-[#222] rounded-sm p-5">
          <KanbanColumn title="Completed" tasks={completed} status="Completed" icon={CheckCircle2} canUpdate={canUpdate} />
        </motion.div>
      </div>
    </div>
  );
}
