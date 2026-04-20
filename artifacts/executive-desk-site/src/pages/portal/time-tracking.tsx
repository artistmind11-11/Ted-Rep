import { useState } from "react";
import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData, TimeStatus, TIME_CATEGORIES } from "@/lib/portal-data";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Clock, TrendingUp, CheckCircle2, ShieldOff } from "lucide-react";

const GOLD_OPACITIES = [0.88, 0.75, 0.62, 0.50, 0.38, 0.25, 0.12];
const STATUS_COLORS: Record<TimeStatus, string> = {
  Submitted: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Approved: "text-green-400 bg-green-400/10 border-green-400/20",
  Disputed: "text-red-400 bg-red-400/10 border-red-400/20",
  Invoiced: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Paid: "text-[#9B8B5F] bg-[#9B8B5F]/10 border-[#9B8B5F]/20",
};

const RETAINER = 160;
const HOURS_USED = 124;

export default function TimeTracking() {
  const { user, can } = usePortalAuth();
  const { timeEntries, updateTimeStatus } = usePortalData();
  const [filterStatus, setFilterStatus] = useState<TimeStatus | "All">("All");

  const myEntries = can("view_tasks_all")
    ? timeEntries
    : timeEntries.filter((e) => e.clientId === user?.clientId || e.loggedBy === user?.id);

  const filtered = filterStatus === "All" ? myEntries : myEntries.filter((e) => e.status === filterStatus);
  const totalHours = myEntries.reduce((s, e) => s + e.hours, 0);
  const approvedHours = myEntries.filter((e) => e.status === "Approved").reduce((s, e) => s + e.hours, 0);
  const submittedHours = myEntries.filter((e) => e.status === "Submitted").reduce((s, e) => s + e.hours, 0);

  const donutData = TIME_CATEGORIES;
  const maxHours = Math.max(...TIME_CATEGORIES.map((c) => c.hours));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { name: string; hours: number } }[] }) => {
    if (!active || !payload?.length) return null;
    const { name, hours } = payload[0]?.payload ?? {};
    return (
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-sm px-3 py-2">
        <p className="text-[#9B8B5F] text-xs">{name}</p>
        <p className="text-[#F8F8F6] text-sm">{hours}h</p>
      </div>
    );
  };

  if (!can("view_tasks_own") && !can("view_tasks_all")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555] text-sm">Time tracking data is not available for your access level.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Retainer Utilisation</p>
        <h1 className="font-serif text-2xl text-[#F8F8F6]">Time Tracking</h1>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Hours Used", value: `${HOURS_USED}h`, sub: `${Math.round((HOURS_USED / RETAINER) * 100)}% of retainer`, icon: Clock },
          { label: "Hours Remaining", value: `${RETAINER - HOURS_USED}h`, sub: `${Math.round(((RETAINER - HOURS_USED) / RETAINER) * 100)}% remaining`, icon: TrendingUp },
          { label: "Avg Daily", value: "5.6h", sub: "↑ from 4.8h last month", icon: Clock },
          { label: "Active Projects", value: "4", sub: "Across 3 clients", icon: CheckCircle2 },
        ].map(({ label, value, sub, icon: Icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-[#141414] border border-[#222] rounded-sm p-5 group hover:border-[#9B8B5F]/30 transition-colors relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9B8B5F]/0 to-transparent group-hover:via-[#9B8B5F]/40 transition-all duration-500" />
            <div className="flex items-start justify-between mb-3">
              <p className="text-[#555] text-xs uppercase tracking-widest">{label}</p>
              <Icon size={14} className="text-[#9B8B5F] opacity-60" />
            </div>
            <p className="font-serif text-2xl text-[#F8F8F6]">{value}</p>
            {i === 0 && (
              <div className="mt-2 h-0.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(HOURS_USED / RETAINER) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-[#9B8B5F] rounded-full" />
              </div>
            )}
            {i !== 0 && sub && <p className="text-[#444] text-xs mt-1">{sub}</p>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Donut Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#141414] border border-[#222] rounded-sm p-5">
          <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Hours by Category</p>
          <p className="text-[#F8F8F6] font-serif text-lg mb-4">Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={donutData.map((d) => ({ name: d.name, hours: d.hours }))} dataKey="hours"
                cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={1}>
                {donutData.map((_, i) => (
                  <Cell key={i} fill={`rgba(155,139,95,${GOLD_OPACITIES[i] ?? 0.1})`} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(v) => <span style={{ color: "#555", fontSize: 10, fontFamily: "Inter" }}>{v}</span>}
                iconType="circle" iconSize={6} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Project Breakdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-[#141414] border border-[#222] rounded-sm p-5">
          <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Project Breakdown</p>
          <p className="text-[#F8F8F6] font-serif text-lg mb-5">Hours by Stream</p>
          <div className="space-y-4">
            {TIME_CATEGORIES.map((cat) => {
              const pct = (cat.hours / maxHours) * 100;
              const retainerPct = Math.round((cat.hours / RETAINER) * 100);
              return (
                <div key={cat.name} className="flex items-center gap-4">
                  <p className="text-[#666] text-xs w-20 flex-shrink-0">{cat.name}</p>
                  <div className="flex-1 h-0.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-[#9B8B5F] rounded-full" />
                  </div>
                  <p className="text-[#888] text-xs w-8 text-right">{cat.hours}h</p>
                  <p className="text-[#444] text-xs w-8 text-right">{retainerPct}%</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Time Log Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-[#141414] border border-[#222] rounded-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#1F1F1F]">
          <p className="font-serif text-[#F8F8F6] text-lg">Time Log</p>
          <div className="flex flex-wrap gap-2">
            {(["All", "Submitted", "Approved", "Disputed", "Paid"] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} data-testid={`filter-time-${s}`}
                className={`text-xs px-2.5 py-1 rounded-sm border transition-colors ${
                  filterStatus === s
                    ? s === "All" ? "bg-[#9B8B5F]/20 text-[#9B8B5F] border-[#9B8B5F]/40" : STATUS_COLORS[s as TimeStatus]
                    : "border-[#222] text-[#555] hover:border-[#333]"
                }`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Date", "Project", "Description", "Hours", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[#444] text-xs uppercase tracking-wider font-normal">{h}</th>
                ))}
                {can("approve_tasks") && <th className="px-5 py-3 text-[#444] text-xs uppercase tracking-wider font-normal">Action</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-[#1A1A1A] hover:bg-[rgba(255,255,255,0.01)] transition-colors" data-testid={`time-row-${entry.id}`}>
                  <td className="px-5 py-3 text-[#555] text-xs">{entry.date}</td>
                  <td className="px-5 py-3 text-[#888] text-xs">{entry.project}</td>
                  <td className="px-5 py-3 text-[#F8F8F6] text-sm">{entry.description}</td>
                  <td className="px-5 py-3 text-[#9B8B5F] font-mono text-sm">{entry.hours}h</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-sm border ${STATUS_COLORS[entry.status]}`}>{entry.status}</span>
                  </td>
                  {can("approve_tasks") && (
                    <td className="px-5 py-3">
                      {entry.status === "Submitted" && (
                        <div className="flex gap-2">
                          <button onClick={() => updateTimeStatus(entry.id, "Approved")}
                            className="text-xs text-green-400 hover:text-green-300 transition-colors">Approve</button>
                          <button onClick={() => updateTimeStatus(entry.id, "Disputed")}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors">Dispute</button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
