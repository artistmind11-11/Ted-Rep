import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { MONTHLY_DATA, GOAL_PROGRESS, RADAR_DATA } from "@/lib/portal-data";
import {
  ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  BarChart, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { ShieldOff } from "lucide-react";

const GOLD = "#9B8B5F";

const METRICS = [
  { label: "On-Time Delivery", value: "98.2%", note: "Across all deliverables Q1" },
  { label: "Client Satisfaction", value: "9.7/10", note: "Composite NPS — March 2025" },
  { label: "Response Time", value: "1h 24m", note: "Avg. to urgent requests" },
  { label: "Documents Processed", value: "47", note: "Q1 2025 — legal, financial, governance" },
  { label: "Cross-Border Coords", value: "12", note: "UAE · KSA · Qatar · UK" },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string; name: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-sm px-3 py-2 text-xs space-y-1">
      <p className="text-[#9B8B5F] mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span className="text-[#555]">{p.name}</span>
          <span className="text-[#F8F8F6]">{p.dataKey === "revenue" ? `AED ${(p.value / 1000).toFixed(0)}K` : `${p.value}h`}</span>
        </div>
      ))}
    </div>
  );
};

export default function Reports() {
  const { can } = usePortalAuth();

  if (!can("view_kpis")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555] text-sm">Reports require Counsel or Principal access.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Analytics</p>
        <h1 className="font-serif text-2xl text-[#F8F8F6]">Performance Reports</h1>
      </div>

      {/* Revenue vs Hours Dual-Axis Chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#141414] border border-[#222] rounded-sm p-5 mb-8">
        <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Correlation Analysis</p>
        <p className="text-[#F8F8F6] font-serif text-xl mb-1">Revenue vs Hours Logged</p>
        <p className="text-[#444] text-xs mb-6">Jan – May 2025 · Dual-axis comparison</p>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={MONTHLY_DATA}>
            <XAxis dataKey="month" tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `AED ${(v / 1000).toFixed(0)}k`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#333", fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `${v}h`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(155,139,95,0.04)" }} />
            <Legend formatter={(v) => <span style={{ color: "#555", fontSize: 10 }}>{v}</span>} iconSize={8} />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue (AED)" fill="rgba(155,139,95,0.15)" radius={[2, 2, 0, 0]} />
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="" stroke={GOLD} strokeWidth={1.5} dot={{ fill: GOLD, r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="hours" name="Hours Logged" stroke="rgba(155,139,95,0.3)"
              strokeWidth={1} strokeDasharray="3 3" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Strategic Goal Progress + Governance Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-[#141414] border border-[#222] rounded-sm p-5">
          <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Strategic Goal Progress</p>
          <p className="text-[#F8F8F6] font-serif text-lg mb-5">Engagement Objectives</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={GOAL_PROGRESS} barCategoryGap="30%">
              <XAxis dataKey="goal" tick={{ fill: "#555", fontSize: 10, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 110]} tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 2, fontSize: 12 }}
                labelStyle={{ color: "#9B8B5F" }} itemStyle={{ color: "#F8F8F6" }} cursor={{ fill: "rgba(155,139,95,0.04)" }} />
              <Bar dataKey="pct" radius={[2, 2, 0, 0]}>
                {GOAL_PROGRESS.map((_, i) => <Cell key={i} fill={i < 2 ? GOLD : "rgba(155,139,95,0.38)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-[#141414] border border-[#222] rounded-sm p-5">
          <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Governance Health</p>
          <p className="text-[#F8F8F6] font-serif text-lg mb-3">Structure Maturity</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#1F1F1F" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: "rgba(248,248,246,0.32)", fontSize: 10, fontFamily: "Inter" }} />
              <Radar dataKey="score" stroke={GOLD} fill={GOLD} fillOpacity={0.06} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Performance Metrics — typography only */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-[#141414] border border-[#222] rounded-sm p-6 mb-8">
        <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Performance Summary</p>
        <p className="text-[#F8F8F6] font-serif text-xl mb-6">Q1 2025 — Key Indicators</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {METRICS.map(({ label, value, note }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }}>
              <p className="text-[#444] text-[9px] uppercase tracking-widest mb-2">{label}</p>
              <p className="font-serif text-3xl text-[#F8F8F6] font-light mb-1">{value}</p>
              <p className="text-[#333] text-xs leading-relaxed">{note}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Monthly summary table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-[#141414] border border-[#222] rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1F1F1F]">
          <p className="font-serif text-[#F8F8F6] text-lg">Monthly Breakdown</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Month", "Hours Logged", "Retainer (AED)", "Overage (AED)", "Total Revenue", "Utilisation"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[#444] text-xs uppercase tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MONTHLY_DATA.map((row, i) => {
                const util = Math.round((row.hours / 160) * 100);
                const isForecast = row.month === "May";
                return (
                  <tr key={row.month} className={`border-b border-[#1A1A1A] hover:bg-[rgba(255,255,255,0.01)] transition-colors ${isForecast ? "opacity-50" : ""}`}>
                    <td className="px-5 py-3 text-[#F8F8F6] text-sm font-medium">{row.month}{isForecast ? "*" : ""}</td>
                    <td className="px-5 py-3 text-[#9B8B5F] font-mono text-sm">{row.hours}h</td>
                    <td className="px-5 py-3 text-[#888] font-mono text-sm">{row.retainer.toLocaleString()}</td>
                    <td className="px-5 py-3 font-mono text-sm">
                      {row.overage > 0
                        ? <span className="text-amber-400">{row.overage.toLocaleString()}</span>
                        : <span className="text-[#333]">—</span>}
                    </td>
                    <td className="px-5 py-3 text-[#F8F8F6] font-mono text-sm">AED {row.revenue.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-0.5 bg-[#1A1A1A] rounded-full overflow-hidden max-w-[60px]">
                          <div className="h-full bg-[#9B8B5F]" style={{ width: `${Math.min(util, 100)}%` }} />
                        </div>
                        <span className="text-[#555] text-xs">{util}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="px-5 py-3 text-[#333] text-xs border-t border-[#1A1A1A]">* May = forecast</p>
      </motion.div>
    </div>
  );
}
