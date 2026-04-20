import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData, LeadStage } from "@/lib/portal-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ShieldOff } from "lucide-react";

const STAGE_BADGE: Record<LeadStage, string> = {
  Initial: "text-[#555] bg-[#1A1A1A] border-[#2A2A2A]",
  Proposal: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Discussion: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Referred: "text-[#9B8B5F] bg-[#9B8B5F]/10 border-[#9B8B5F]/20",
  Negotiation: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Won: "text-green-400 bg-green-400/10 border-green-400/20",
  Lost: "text-red-400 bg-red-400/10 border-red-400/20",
};

const TEMP_BADGE: Record<string, string> = {
  hot: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  warm: "text-[#9B8B5F] bg-[#9B8B5F]/10 border-[#9B8B5F]/20",
  cold: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

const PIPELINE_DATA = [
  { stage: "Negotiation", value: 120000 },
  { stage: "Referred", value: 115000 },
  { stage: "Discussion", value: 80000 },
  { stage: "Proposal", value: 60000 },
  { stage: "Initial", value: 45000 },
];

const GOLD_OPACITIES = [0.82, 0.66, 0.50, 0.34, 0.18];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-sm px-3 py-2 text-xs">
      <p className="text-[#9B8B5F] mb-1">{label}</p>
      <p className="text-[#F8F8F6]">AED {(payload[0]?.value / 1000).toFixed(0)}K</p>
    </div>
  );
};

export default function CRM() {
  const { can } = usePortalAuth();
  const { leads, crmActivities } = usePortalData();

  if (!can("view_crm")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555] text-sm">CRM data requires Counsel or Principal access level.</p>
      </div>
    );
  }

  const totalPipeline = leads.reduce((s, l) => s + l.value, 0);

  return (
    <div>
      <div className="mb-6">
        <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">New Business</p>
        <h1 className="font-serif text-2xl text-[#F8F8F6]">CRM & Pipeline</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Prospects", value: leads.length, color: "text-[#F8F8F6]" },
          { label: "Pipeline Value", value: `AED ${(totalPipeline / 1000).toFixed(0)}K`, color: "text-[#9B8B5F]" },
          { label: "In Negotiation", value: leads.filter((l) => l.stage === "Negotiation").length, color: "text-orange-400" },
          { label: "Win Rate", value: "68%", color: "text-green-400" },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-[#141414] border border-[#222] rounded-sm p-5 group hover:border-[#9B8B5F]/20 transition-colors relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9B8B5F]/0 to-transparent group-hover:via-[#9B8B5F]/30 transition-all duration-500" />
            <p className="text-[#555] text-xs uppercase tracking-widest mb-3">{label}</p>
            <p className={`font-serif text-2xl ${color}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pipeline Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#141414] border border-[#222] rounded-sm p-5">
          <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Pipeline by Stage</p>
          <p className="text-[#F8F8F6] font-serif text-lg mb-5">Deal Value Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PIPELINE_DATA} layout="vertical" barCategoryGap="25%">
              <XAxis type="number" tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `AED ${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="stage" width={80} tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(155,139,95,0.04)" }} />
              <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                {PIPELINE_DATA.map((_, i) => (
                  <Cell key={i} fill={`rgba(155,139,95,${GOLD_OPACITIES[i]})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Prospect Directory */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-[#141414] border border-[#222] rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1F1F1F]">
            <p className="font-serif text-[#F8F8F6] text-lg">Prospect Directory</p>
            <p className="text-[#444] text-xs mt-0.5">Confidential — reference codes only</p>
          </div>
          <div className="divide-y divide-[#1A1A1A]">
            {leads.map((lead) => (
              <div key={lead.id} className="px-5 py-4 flex items-center gap-4 hover:bg-[rgba(255,255,255,0.01)] transition-colors"
                data-testid={`lead-${lead.id}`}>
                <div className="w-9 h-9 rounded-full bg-[#9B8B5F]/10 border border-[#9B8B5F]/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-[#9B8B5F] text-xs">{lead.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#F8F8F6] text-sm">{lead.code}</p>
                  <p className="text-[#444] text-xs">{lead.sector} · {lead.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[#9B8B5F] text-sm font-serif">AED {(lead.value / 1000).toFixed(0)}K</p>
                  <div className="flex gap-1 mt-1 justify-end">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border ${STAGE_BADGE[lead.stage]}`}>{lead.stage}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border ${TEMP_BADGE[lead.temperature]} capitalize`}>{lead.temperature}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CRM Activity Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-[#141414] border border-[#222] rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1F1F1F]">
          <p className="font-serif text-[#F8F8F6] text-lg">Activity Log</p>
          <p className="text-[#444] text-xs mt-0.5">Last meaningful interaction per prospect</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Date", "Contact", "Activity", "Next Step", "Stage"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[#444] text-xs uppercase tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {crmActivities.map((act) => (
                <tr key={act.id} className="border-b border-[#1A1A1A] hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                  <td className="px-5 py-3 text-[#555] text-xs">{act.date}</td>
                  <td className="px-5 py-3 text-[#9B8B5F] text-xs font-mono">{act.contact}</td>
                  <td className="px-5 py-3 text-[#F8F8F6] text-sm max-w-[200px]"><p className="truncate">{act.activity}</p></td>
                  <td className="px-5 py-3 text-[#666] text-xs max-w-[180px]"><p className="truncate">{act.nextStep}</p></td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-sm border ${STAGE_BADGE[act.stage]}`}>{act.stage}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
