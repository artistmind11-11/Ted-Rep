import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData, GOAL_PROGRESS, RADAR_DATA, MONTHLY_DATA } from "@/lib/portal-data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, Area, AreaChart,
} from "recharts";
import { Users, CheckSquare, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "wouter";

const GOLD = "#9B8B5F";
const GOLD_DIM = "rgba(155,139,95,0.38)";
const DARK_BG = "#1A1A1A";

const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }) };

function KPICard({ label, value, sub, Icon, i }: { label: string; value: string; sub?: string; Icon: React.ComponentType<{size?: number; className?: string}>; i: number }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={i}
      className="bg-[#141414] border border-[#222] rounded-sm p-5 group hover:border-[#9B8B5F]/30 transition-colors relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9B8B5F]/0 to-transparent group-hover:via-[#9B8B5F]/40 transition-all duration-500" />
      <div className="flex items-start justify-between mb-4">
        <p className="text-[#555] text-xs uppercase tracking-widest">{label}</p>
        <Icon size={15} className="text-[#9B8B5F] opacity-70" />
      </div>
      <p className="font-serif text-2xl text-[#F8F8F6]">{value}</p>
      {sub && <p className="text-[#444] text-xs mt-1.5">{sub}</p>}
    </motion.div>
  );
}

const PRIORITY_DOT: Record<string, string> = {
  Urgent: "bg-red-400",
  High: "bg-[#9B8B5F]",
  Standard: "bg-[#333]",
};

const STATUS_COLOR: Record<string, string> = {
  "In Progress": "text-[#9B8B5F] bg-[#9B8B5F]/10",
  "To Do": "text-amber-400 bg-amber-400/10",
  Completed: "text-green-400 bg-green-400/10",
  Overdue: "text-red-400 bg-red-400/10",
};

const CustomBar = (props: { x?: number; y?: number; width?: number; height?: number; index?: number }) => {
  const { x = 0, y = 0, width = 0, height = 0, index = 0 } = props;
  const isDone = index < 2;
  return <rect x={x} y={y} width={width} height={height} fill={isDone ? GOLD : GOLD_DIM} rx={1} />;
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-sm px-3 py-2">
      <p className="text-[#9B8B5F] text-xs font-medium">{label}</p>
      <p className="text-[#F8F8F6] text-sm">{payload[0]?.value}%</p>
    </div>
  );
};

export default function Dashboard() {
  const { user, can } = usePortalAuth();
  const { tasks, invoices, clients, auditLog } = usePortalData();

  const myTasks = can("view_tasks_all") ? tasks : tasks.filter((t) => t.clientId === user?.clientId);
  const myInvoices = can("view_billing_all") ? invoices : invoices.filter((i) => i.clientId === user?.clientId);

  const active = myTasks.filter((t) => t.status === "In Progress").length;
  const completed = myTasks.filter((t) => t.status === "Completed").length;
  const completionRate = myTasks.length ? Math.round((completed / myTasks.length) * 100) : 0;
  const hoursThisMonth = 124;
  const hoursRetainer = 160;
  const retainerBalance = myInvoices.filter((i) => i.status === "Upcoming").reduce((s, i) => s + i.amount, 0);

  const roleLabel = { admin: "Principal", counsel: "Counsel", associate: "Associate", client: "Client" }[user?.role ?? "client"];

  return (
    <div>
      {/* Greeting */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <p className="text-[#9B8B5F] text-xs uppercase tracking-[0.2em] mb-1">{roleLabel} · Command Overview</p>
        <h1 className="font-serif text-3xl text-[#F8F8F6]">Good {new Date().getHours() < 12 ? "morning" : "afternoon"}, {user?.name.split(" ")[0]}</h1>
        <p className="text-[#555] text-sm mt-1">{new Date().toLocaleDateString("en-AE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </motion.div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {can("view_all_clients") && <KPICard label="Active Engagements" value={`${clients.length} active`} Icon={Users} i={0} />}
        <KPICard label="Tasks Completed" value={`${completionRate}%`} sub={`${completed} of ${myTasks.length} tasks`} Icon={CheckSquare} i={1} />
        {can("view_kpis") && (
          <KPICard label="Hours This Month" value={`${hoursThisMonth}h / ${hoursRetainer}h`}
            sub={`${Math.round((hoursThisMonth / hoursRetainer) * 100)}% retainer utilized`} Icon={Clock} i={2} />
        )}
        {can("view_billing_own") && (
          <KPICard label="Retainer Balance" value={`AED ${(retainerBalance / 1000).toFixed(0)}K`}
            sub="Outstanding — next cycle" Icon={DollarSign} i={3} />
        )}
        {!can("view_all_clients") && <KPICard label="Active Tasks" value={`${active}`} sub="Currently in progress" Icon={TrendingUp} i={0} />}
      </div>

      {/* Hours progress bar */}
      {can("view_kpis") && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="bg-[#141414] border border-[#222] rounded-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#555] text-xs">Retainer Utilisation — April 2025</p>
            <p className="text-[#9B8B5F] text-xs">{hoursThisMonth}h of {hoursRetainer}h</p>
          </div>
          <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(hoursThisMonth / hoursRetainer) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-[#9B8B5F] rounded-full" />
          </div>
        </motion.div>
      )}

      {/* Charts grid */}
      {can("view_kpis") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Goal Progress Bar Chart */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="lg:col-span-2 bg-[#141414] border border-[#222] rounded-sm p-5">
            <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Strategic Goal Progress</p>
            <p className="text-[#F8F8F6] font-serif text-lg mb-5">Engagement Objectives</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={GOAL_PROGRESS} barCategoryGap="30%">
                <XAxis dataKey="goal" tick={{ fill: "#555", fontSize: 10, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 110]} tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(155,139,95,0.04)" }} />
                <Bar dataKey="pct" radius={[2, 2, 0, 0]}>
                  {GOAL_PROGRESS.map((_, i) => <Cell key={i} fill={i < 2 ? GOLD : GOLD_DIM} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Radar Chart */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
            className="bg-[#141414] border border-[#222] rounded-sm p-5">
            <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Governance Health</p>
            <p className="text-[#F8F8F6] font-serif text-lg mb-3">Structure Maturity</p>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#1F1F1F" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "rgba(248,248,246,0.32)", fontSize: 10, fontFamily: "Inter" }} />
                <Radar dataKey="score" stroke={GOLD} fill={GOLD} fillOpacity={0.06} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Activity Chart + Tasks */}
      <div className={`grid gap-6 ${can("view_kpis") ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}>
        {/* Activity Line Chart */}
        {can("view_kpis") && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}
            className="lg:col-span-2 bg-[#141414] border border-[#222] rounded-sm p-5">
            <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Monthly Activity</p>
            <p className="text-[#F8F8F6] font-serif text-lg mb-5">Hours Logged — Actual vs Forecast</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={MONTHLY_DATA}>
                <defs>
                  <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.05} />
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}h`} />
                <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 2, fontSize: 12 }} labelStyle={{ color: "#9B8B5F" }} itemStyle={{ color: "#F8F8F6" }} />
                <Area type="monotone" dataKey="hours" stroke={GOLD} strokeWidth={1.5} fill="url(#goldFill)" dot={{ fill: GOLD, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Active Tasks */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}
          className={`${can("view_kpis") ? "" : ""} bg-[#141414] border border-[#222] rounded-sm overflow-hidden`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1F1F]">
            <p className="font-serif text-[#F8F8F6] text-lg">Active Tasks</p>
            <Link href="/portal/tasks" className="text-[#9B8B5F] text-xs uppercase tracking-wider hover:text-[#B8A870] transition-colors">All</Link>
          </div>
          <div className="divide-y divide-[#1A1A1A]">
            {myTasks.filter((t) => t.status === "In Progress").slice(0, 5).map((task) => (
              <div key={task.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#191919] transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[#F8F8F6] text-sm truncate">{task.title}</p>
                  <p className="text-[#444] text-xs">{task.category} · Due {task.dueDate}</p>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-sm ${STATUS_COLOR[task.status]} flex-shrink-0`}>{task.priority}</span>
              </div>
            ))}
            {myTasks.filter((t) => t.status === "In Progress").length === 0 && (
              <div className="px-5 py-8 text-center text-[#444] text-sm">No active tasks</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Audit (admin only) */}
      {can("view_audit_log") && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={9}
          className="mt-6 bg-[#141414] border border-[#222] rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1F1F]">
            <p className="font-serif text-[#F8F8F6] text-lg">Recent Activity</p>
            <Link href="/portal/audit" className="text-[#9B8B5F] text-xs uppercase tracking-wider">Full Log</Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#1A1A1A]">
            {auditLog.slice(0, 4).map((entry) => (
              <div key={entry.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-[#191919] transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${entry.important ? "bg-[#9B8B5F]" : "bg-[#333]"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[#888] text-sm truncate">{entry.action}</p>
                  <p className="text-[#444] text-xs truncate">{entry.detail}</p>
                </div>
                <p className="text-[#333] text-xs flex-shrink-0">{entry.timestamp.split(" · ")[1]}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
