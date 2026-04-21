import { useState } from "react";
import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData, Client, ClientTier } from "@/lib/portal-data";
import { CheckCircle2, Circle, ShieldOff, Plus } from "lucide-react";
import { AddClientModal, ToolbarButton } from "@/components/portal-forms";

const TIER_STYLE: Record<ClientTier, string> = {
  "Tier I C-Suite": "text-[#9B8B5F] bg-[#9B8B5F]/10 border-[#9B8B5F]/20",
  "Tier II Founder": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Tier III Family Office": "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

const COUNTRY_FLAG: Record<string, string> = { UAE: "🇦🇪", KSA: "🇸🇦", Qatar: "🇶🇦" };

function OnboardingProgress({ steps }: { steps: Client["onboarding"] }) {
  const done = steps.filter((s) => s.done).length;
  const pct = Math.round((done / steps.length) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-0.5 bg-[#1A1A1A] rounded-full overflow-hidden">
        <div className="h-full bg-[#9B8B5F] transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[#9B8B5F] text-xs flex-shrink-0">{pct}%</span>
    </div>
  );
}

export default function Clients() {
  const { user, can } = usePortalAuth();
  const { clients, team, toggleOnboarding } = usePortalData();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  if (!can("view_all_clients")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555] text-sm">Client profiles require Counsel or Principal access.</p>
      </div>
    );
  }

  const totalInvoiced = clients.reduce((s, c) => s + c.totalInvoiced, 0);
  const avgTenure = 14;
  const countryCount = new Set(clients.map((c) => c.country)).size;

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Principal Roster</p>
          <h1 className="font-serif text-2xl text-[#F8F8F6]">Client Management</h1>
        </div>
        {can("manage_users") && (
          <ToolbarButton onClick={() => setShowAdd(true)} icon={Plus} label="Add Client" dataTestid="open-add-client" />
        )}
      </div>
      <AddClientModal open={showAdd} onClose={() => setShowAdd(false)} />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Clients", value: clients.length },
          { label: "Countries", value: countryCount },
          { label: "Avg Tenure", value: `${avgTenure}mo` },
          { label: "Retention", value: "96%" },
        ].map(({ label, value }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-[#141414] border border-[#222] rounded-sm p-5 group hover:border-[#9B8B5F]/20 transition-colors relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9B8B5F]/0 to-transparent group-hover:via-[#9B8B5F]/30 transition-all duration-500" />
            <p className="text-[#555] text-xs uppercase tracking-widest mb-3">{label}</p>
            <p className="font-serif text-2xl text-[#F8F8F6]">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Client Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-[#141414] border border-[#222] rounded-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-[#1F1F1F] flex items-center justify-between">
          <p className="font-serif text-[#F8F8F6] text-lg">Active Engagements</p>
          <p className="text-[#555] text-xs">AED {(totalInvoiced / 1000).toFixed(0)}K total billed</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Client", "Sector", "Tier", "Country", "Since", "Status", "Retainer/mo"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[#444] text-xs uppercase tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}
                  onClick={() => setExpanded(expanded === client.id ? null : client.id)}
                  className="border-b border-[#1A1A1A] hover:bg-[rgba(255,255,255,0.01)] cursor-pointer transition-colors"
                  data-testid={`client-row-${client.id}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#9B8B5F]/10 border border-[#9B8B5F]/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-serif text-[#9B8B5F] text-xs">{client.initials}</span>
                      </div>
                      <div>
                        <p className="text-[#F8F8F6] text-sm">{client.code}</p>
                        <p className="text-[#444] text-xs">{client.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#666] text-sm">{client.sector}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-sm border ${TIER_STYLE[client.tier]}`}>{client.tier}</span>
                  </td>
                  <td className="px-5 py-4 text-[#666] text-sm">{COUNTRY_FLAG[client.country]} {client.country}</td>
                  <td className="px-5 py-4 text-[#555] text-xs">{client.since}</td>
                  <td className="px-5 py-4"><span className="text-xs px-2 py-0.5 rounded-sm text-green-400 bg-green-400/10 border border-green-400/20">Active</span></td>
                  <td className="px-5 py-4 text-[#9B8B5F] font-mono text-sm">AED {client.retainerPerMonth.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Expanded detail */}
      {expanded && (() => {
        const client = clients.find((c) => c.id === expanded);
        if (!client) return null;
        const assignedMembers = team.filter((m) => client.assignedTeam.includes(m.id));
        return (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#141414] border border-[#9B8B5F]/20 rounded-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#9B8B5F]/10 border border-[#9B8B5F]/20 flex items-center justify-center">
                <span className="font-serif text-[#9B8B5F]">{client.initials}</span>
              </div>
              <div>
                <p className="text-[#F8F8F6] font-medium">{client.company}</p>
                <p className="text-[#555] text-sm">{client.name} — {client.email ?? client.code}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-[#9B8B5F] text-xs uppercase tracking-wider mb-3">Onboarding Checklist</p>
                <div className="mb-3"><OnboardingProgress steps={client.onboarding} /></div>
                <div className="space-y-2">
                  {client.onboarding.map((step) => (
                    <button key={step.label}
                      onClick={() => can("manage_users") && toggleOnboarding(user?.name ?? "Principal", client.id, step.label)}
                      disabled={!can("manage_users")}
                      data-testid={`onboard-${client.id}-${step.label}`}
                      className={`flex items-center gap-2 text-sm w-full text-left ${can("manage_users") ? "hover:bg-[#1A1A1A] cursor-pointer" : "cursor-default"} px-1 py-0.5 rounded-sm transition-colors`}>
                      {step.done ? <CheckCircle2 size={13} className="text-green-400 flex-shrink-0" /> : <Circle size={13} className="text-[#333] flex-shrink-0" />}
                      <span className={step.done ? "text-[#888]" : "text-[#444]"}>{step.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[#9B8B5F] text-xs uppercase tracking-wider mb-3">Engagement Terms</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#444]">Service Plan</span><span className="text-[#F8F8F6]">{client.servicePlan}</span></div>
                  <div className="flex justify-between"><span className="text-[#444]">Hourly Rate</span><span className="text-[#F8F8F6] font-mono">{client.currency} {client.hourlyRate}/h</span></div>
                  <div className="flex justify-between"><span className="text-[#444]">Retainer / mo</span><span className="text-[#9B8B5F] font-mono">{client.currency} {client.retainerPerMonth.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-[#444]">Retainer Hours</span><span className="text-[#F8F8F6] font-mono">{client.retainerHours}h</span></div>
                  <div className="flex justify-between"><span className="text-[#444]">Total Invoiced</span><span className="text-[#F8F8F6] font-mono">{client.currency} {client.totalInvoiced.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-[#444]">Outstanding</span><span className={`font-mono ${client.pendingAmount > 0 ? "text-amber-400" : "text-green-400"}`}>{client.currency} {client.pendingAmount.toLocaleString()}</span></div>
                </div>
                {client.commsProtocol && (
                  <div className="mt-3 pt-3 border-t border-[#1F1F1F]">
                    <p className="text-[#444] text-xs mb-1">Comms Protocol</p>
                    <p className="text-[#777] text-xs">{client.commsProtocol}</p>
                  </div>
                )}
                {client.notes && (
                  <div className="mt-3 pt-3 border-t border-[#1F1F1F]">
                    <p className="text-[#444] text-xs mb-1">Strategic Notes</p>
                    <p className="text-[#777] text-xs italic leading-relaxed">{client.notes}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[#9B8B5F] text-xs uppercase tracking-wider mb-3">Assigned Team</p>
                <div className="space-y-2">
                  {assignedMembers.map((m) => (
                    <div key={m.id} className="flex items-center justify-between">
                      <p className="text-[#888] text-sm">{m.name}</p>
                      <span className="text-[#444] text-xs capitalize">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}
    </div>
  );
}
