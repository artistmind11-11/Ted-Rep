import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData } from "@/lib/portal-data";
import { CheckSquare, Clock, AlertTriangle, TrendingUp, Receipt, Users, Activity } from "lucide-react";
import { Link } from "wouter";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

function StatCard({ label, value, sub, icon: Icon, color, i }: {
  label: string; value: string | number; sub?: string;
  icon: React.ComponentType<{size?: number; className?: string}>; color: string; i: number;
}) {
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={i}
      className="bg-[#141414] border border-[#222222] rounded-sm p-5 hover:border-[#333333] transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-[#666666] text-xs uppercase tracking-wider">{label}</p>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
          <Icon size={15} />
        </div>
      </div>
      <p className="text-[#F8F8F6] text-2xl font-serif font-medium">{value}</p>
      {sub && <p className="text-[#444444] text-xs mt-1">{sub}</p>}
    </motion.div>
  );
}

function statusColor(s: string) {
  return s === "Active" ? "text-green-400 bg-green-400/10"
    : s === "Pending" ? "text-amber-400 bg-amber-400/10"
    : s === "Blocked" ? "text-red-400 bg-red-400/10"
    : s === "Completed" ? "text-[#9B8B5F] bg-[#9B8B5F]/10"
    : "text-[#555555] bg-[#1F1F1F]";
}

function priorityDot(p: string) {
  return p === "High" ? "bg-red-400" : p === "Medium" ? "bg-amber-400" : "bg-[#555555]";
}

export default function Dashboard() {
  const { user, can } = usePortalAuth();
  const { tasks, invoices, clients, auditLog } = usePortalData();

  const myTasks = can("view_tasks_all")
    ? tasks
    : tasks.filter((t) => t.clientId === user?.clientId || t.assignedTo === user?.id);

  const myInvoices = can("view_billing_all")
    ? invoices
    : invoices.filter((inv) => inv.clientId === user?.clientId);

  const activeTasks = myTasks.filter((t) => t.status === "Active").length;
  const pendingTasks = myTasks.filter((t) => t.status === "Pending").length;
  const blockedTasks = myTasks.filter((t) => t.status === "Blocked").length;
  const totalBilled = myInvoices.reduce((s, i) => s + i.amount, 0).toLocaleString();
  const pendingBilled = myInvoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0).toLocaleString();

  const roleLabel = { admin: "Principal", counsel: "Counsel", associate: "Associate", client: "Client" }[user?.role ?? "client"];

  return (
    <div>
      {/* Greeting */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <p className="text-[#9B8B5F] text-xs uppercase tracking-[0.2em] mb-1">{roleLabel} Dashboard</p>
        <h1 className="font-serif text-3xl text-[#F8F8F6]">Welcome, {user?.name.split(" ")[0]}</h1>
        <p className="text-[#555555] text-sm mt-1">
          {new Date().toLocaleDateString("en-AE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Tasks" value={activeTasks} icon={CheckSquare} color="bg-green-400/10 text-green-400" i={0} />
        <StatCard label="Pending Tasks" value={pendingTasks} icon={Clock} color="bg-amber-400/10 text-amber-400" i={1} />
        {can("view_billing_own") && (
          <StatCard label="Total Billed" value={`AED ${totalBilled}`} sub="Across all invoices" icon={Receipt} color="bg-[#9B8B5F]/10 text-[#9B8B5F]" i={2} />
        )}
        {can("view_billing_own") && (
          <StatCard label="Pending Approval" value={`AED ${pendingBilled}`} icon={TrendingUp} color="bg-blue-400/10 text-blue-400" i={3} />
        )}
        {can("view_all_clients") && (
          <StatCard label="Active Clients" value={clients.length} icon={Users} color="bg-purple-400/10 text-purple-400" i={2} />
        )}
        {can("view_all_clients") && (
          <StatCard label="Blocked Tasks" value={blockedTasks} sub="Requires attention" icon={AlertTriangle} color="bg-red-400/10 text-red-400" i={3} />
        )}
      </div>

      <div className={`grid gap-6 ${can("view_audit_log") ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}>
        {/* Recent Tasks */}
        <div className={`${can("view_audit_log") ? "lg:col-span-2" : ""} bg-[#141414] border border-[#222222] rounded-sm overflow-hidden`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1F1F]">
            <h2 className="font-serif text-[#F8F8F6] text-lg">Recent Tasks</h2>
            <Link href="/portal/tasks" className="text-[#9B8B5F] text-xs uppercase tracking-wider hover:text-[#B8A870] transition-colors">
              View All
            </Link>
          </div>
          <div className="divide-y divide-[#1A1A1A]">
            {myTasks.slice(0, 5).map((task) => {
              const client = clients.find((c) => c.id === task.clientId);
              return (
                <div key={task.id} className="px-5 py-4 flex items-center gap-4 hover:bg-[#191919] transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot(task.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F8F8F6] text-sm truncate">{task.title}</p>
                    {can("view_all_clients") && client && (
                      <p className="text-[#444444] text-xs mt-0.5">{client.company}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-sm font-medium flex-shrink-0 ${statusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Log (admin/counsel only) */}
        {can("view_audit_log") && (
          <div className="bg-[#141414] border border-[#222222] rounded-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1F1F]">
              <h2 className="font-serif text-[#F8F8F6] text-lg flex items-center gap-2">
                <Activity size={16} className="text-[#9B8B5F]" /> Activity
              </h2>
              <Link href="/portal/audit" className="text-[#9B8B5F] text-xs uppercase tracking-wider hover:text-[#B8A870] transition-colors">
                Full Log
              </Link>
            </div>
            <div className="divide-y divide-[#1A1A1A]">
              {auditLog.slice(0, 6).map((entry) => (
                <div key={entry.id} className="px-5 py-3">
                  <p className="text-[#9B8B5F] text-xs font-medium">{entry.action}</p>
                  <p className="text-[#666666] text-xs mt-0.5 truncate">{entry.detail}</p>
                  <p className="text-[#333333] text-xs mt-1">{entry.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client's invoice preview */}
        {!can("view_all_clients") && can("view_billing_own") && (
          <div className="bg-[#141414] border border-[#222222] rounded-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1F1F]">
              <h2 className="font-serif text-[#F8F8F6] text-lg">Recent Invoices</h2>
              <Link href="/portal/billing" className="text-[#9B8B5F] text-xs uppercase tracking-wider">View All</Link>
            </div>
            <div className="divide-y divide-[#1A1A1A]">
              {myInvoices.slice(0, 4).map((inv) => (
                <div key={inv.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-[#F8F8F6] text-sm">{inv.description.slice(0, 28)}…</p>
                    <p className="text-[#444444] text-xs mt-0.5">{inv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#F8F8F6] text-sm">AED {inv.amount.toLocaleString()}</p>
                    <span className={`text-xs ${statusColor(inv.status)}`}>{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
