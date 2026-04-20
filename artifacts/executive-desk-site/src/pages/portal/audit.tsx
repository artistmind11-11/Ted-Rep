import { useState } from "react";
import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData } from "@/lib/portal-data";
import { Activity, ShieldOff } from "lucide-react";

const CATEGORIES = ["All Events", "Portal Access", "Vault", "Documents", "Financial", "Approvals", "Time", "CRM", "Tasks"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_STYLE: Record<string, string> = {
  "Portal Access": "text-[#9B8B5F] border-[#9B8B5F]/30 bg-[#9B8B5F]/5",
  Vault: "text-purple-400 border-purple-400/30 bg-purple-400/5",
  Documents: "text-blue-400 border-blue-400/30 bg-blue-400/5",
  Financial: "text-green-400 border-green-400/30 bg-green-400/5",
  Approvals: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  Time: "text-cyan-400 border-cyan-400/30 bg-cyan-400/5",
  CRM: "text-pink-400 border-pink-400/30 bg-pink-400/5",
  Tasks: "text-indigo-400 border-indigo-400/30 bg-indigo-400/5",
  Comms: "text-orange-400 border-orange-400/30 bg-orange-400/5",
};

export default function AuditLog() {
  const { can } = usePortalAuth();
  const { auditLog } = usePortalData();
  const [activeFilter, setActiveFilter] = useState<Category>("All Events");

  if (!can("view_audit_log")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555] text-sm">Audit trail access requires Principal clearance.</p>
      </div>
    );
  }

  const filtered = activeFilter === "All Events"
    ? auditLog
    : auditLog.filter((e) => e.category === activeFilter);

  const todayCount = auditLog.filter((e) => e.timestamp.startsWith("Today")).length;
  const vaultToday = auditLog.filter((e) => e.timestamp.startsWith("Today") && e.category === "Vault").length;
  const financialToday = auditLog.filter((e) => e.timestamp.startsWith("Today") && e.category === "Financial").length;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Activity size={18} className="text-[#9B8B5F]" />
          <p className="text-[#9B8B5F] text-xs uppercase tracking-widest">Immutable Record</p>
        </div>
        <h1 className="font-serif text-2xl text-[#F8F8F6]">Audit Trail</h1>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Events Today", value: todayCount },
          { label: "MTD Total", value: auditLog.length },
          { label: "Vault Access Today", value: vaultToday },
          { label: "Security Alerts", value: 0 },
        ].map(({ label, value }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-[#141414] border border-[#222] rounded-sm p-5 group hover:border-[#9B8B5F]/20 transition-colors relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9B8B5F]/0 to-transparent group-hover:via-[#9B8B5F]/30 transition-all duration-500" />
            <p className="text-[#555] text-xs uppercase tracking-widest mb-3">{label}</p>
            <p className={`font-serif text-2xl ${value === 0 && label === "Security Alerts" ? "text-green-400" : "text-[#F8F8F6]"}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const style = cat === "All Events" ? "border-[#9B8B5F]/30" : CATEGORY_STYLE[cat] ?? "border-[#222]";
          const count = cat === "All Events" ? auditLog.length : auditLog.filter((e) => e.category === cat).length;
          return (
            <button key={cat} onClick={() => setActiveFilter(cat)}
              data-testid={`filter-audit-${cat.replace(/\s+/g, "-")}`}
              className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                activeFilter === cat
                  ? cat === "All Events" ? "bg-[#9B8B5F]/15 text-[#9B8B5F] border-[#9B8B5F]/40" : `${style} opacity-100`
                  : "border-[#1F1F1F] text-[#444] hover:border-[#2A2A2A] hover:text-[#666]"
              }`}>
              {cat} <span className="opacity-50 ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[90px] top-0 bottom-0 w-px bg-[#1A1A1A]" />
        <div className="space-y-1">
          {filtered.map((entry, i) => {
            const catStyle = CATEGORY_STYLE[entry.category] ?? "text-[#555] border-[#222]";
            return (
              <motion.div key={entry.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className="flex items-start gap-0"
                data-testid={`audit-${entry.id}`}>
                {/* Timestamp */}
                <div className="w-[90px] flex-shrink-0 pt-3.5 pr-5 text-right">
                  <p className="text-[#333] text-[9px] font-mono leading-tight">
                    {entry.timestamp.split(" · ")[0]}
                  </p>
                  <p className="text-[#444] text-[9px] font-mono">
                    {entry.timestamp.split(" · ")[1]}
                  </p>
                </div>

                {/* Node */}
                <div className="flex-shrink-0 w-3 flex justify-center pt-4 z-10 relative">
                  <div className={`w-2.5 h-2.5 rounded-full ${entry.important ? "bg-[#9B8B5F]" : "bg-[#222]"} border ${entry.important ? "border-[#9B8B5F]/50" : "border-[#2A2A2A]"} flex-shrink-0`} />
                </div>

                {/* Content */}
                <div className="flex-1 ml-4 mb-2">
                  <div className="bg-[#141414] border border-[#1E1E1E] rounded-sm px-4 py-3 hover:border-[#2A2A2A] hover:bg-[#161616] transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <p className="text-[#F8F8F6] text-sm font-light">{entry.action}</p>
                      <span className={`text-[7.5px] px-1.5 py-0.5 rounded-sm border uppercase tracking-widest flex-shrink-0 ${catStyle}`}>
                        {entry.category}
                      </span>
                    </div>
                    <p className="text-[#555] text-xs">{entry.detail}</p>
                    <p className="text-[#2A2A2A] text-[10px] mt-1.5">{entry.user}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
