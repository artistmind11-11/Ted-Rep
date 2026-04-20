import { useState } from "react";
import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData, Client } from "@/lib/portal-data";
import { Briefcase, CheckCircle2, Circle, Globe, ChevronDown, ChevronUp, ShieldOff } from "lucide-react";

const COUNTRY_FLAG: Record<string, string> = {
  UAE: "🇦🇪",
  KSA: "🇸🇦",
  Qatar: "🇶🇦",
};

function OnboardingBar({ steps }: { steps: Client["onboarding"] }) {
  const done = steps.filter((s) => s.done).length;
  const pct = Math.round((done / steps.length) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[#555555] text-xs">Onboarding</span>
        <span className="text-[#9B8B5F] text-xs font-medium">{pct}%</span>
      </div>
      <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
        <div className="h-full bg-[#9B8B5F] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ClientCard({ client }: { client: Client }) {
  const [expanded, setExpanded] = useState(false);
  const { team } = usePortalData();
  const assignedMembers = team.filter((m) => client.assignedTeam.includes(m.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#141414] border border-[#222222] rounded-sm hover:border-[#2A2A2A] transition-colors"
      data-testid={`client-card-${client.id}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#9B8B5F]/10 border border-[#9B8B5F]/20 flex items-center justify-center flex-shrink-0">
              <Briefcase size={16} className="text-[#9B8B5F]" />
            </div>
            <div>
              <p className="text-[#F8F8F6] font-medium">{client.name}</p>
              <p className="text-[#888888] text-sm">{client.company}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-[#555555]">
                <span className="flex items-center gap-1">
                  <Globe size={11} />
                  {COUNTRY_FLAG[client.country]} {client.country}
                </span>
                <span>{client.email}</span>
              </div>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-[#9B8B5F] text-sm font-medium">AED {client.totalInvoiced.toLocaleString()}</p>
            <p className="text-[#555555] text-xs">Total invoiced</p>
            {client.pendingAmount > 0 && (
              <p className="text-amber-400 text-xs mt-0.5">AED {client.pendingAmount.toLocaleString()} pending</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <OnboardingBar steps={client.onboarding} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {assignedMembers.map((m) => (
              <div key={m.id} className="w-6 h-6 rounded-full bg-[#1F1F1F] border border-[#333] flex items-center justify-center" title={m.name}>
                <span className="text-[8px] text-[#888888]">{m.name.split(" ").map((n) => n[0]).join("")}</span>
              </div>
            ))}
            <span className="text-[#444444] text-xs">{assignedMembers.length} assigned</span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#555555] hover:text-[#888888] transition-colors text-xs flex items-center gap-1"
            data-testid={`button-expand-${client.id}`}
          >
            Details {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-[#1F1F1F] p-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Onboarding checklist */}
            <div>
              <p className="text-[#9B8B5F] text-xs uppercase tracking-wider mb-3">Onboarding Checklist</p>
              <div className="space-y-2">
                {client.onboarding.map((step) => (
                  <div key={step.label} className="flex items-center gap-2 text-sm">
                    {step.done
                      ? <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                      : <Circle size={14} className="text-[#333333] flex-shrink-0" />}
                    <span className={step.done ? "text-[#888888]" : "text-[#555555]"}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & team */}
            <div>
              <p className="text-[#9B8B5F] text-xs uppercase tracking-wider mb-3">Primary Contact</p>
              <div className="space-y-1 text-sm text-[#888888] mb-5">
                <p>{client.name}</p>
                <p>{client.contact}</p>
                <p>{client.email}</p>
              </div>
              <p className="text-[#9B8B5F] text-xs uppercase tracking-wider mb-3">Assigned Team</p>
              <div className="space-y-1">
                {assignedMembers.map((m) => (
                  <div key={m.id} className="flex items-center justify-between">
                    <p className="text-[#888888] text-sm">{m.name}</p>
                    <span className="text-[#444444] text-xs capitalize">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Clients() {
  const { can } = usePortalAuth();
  const { clients } = usePortalData();

  if (!can("view_all_clients")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555555] text-sm max-w-xs">Client data is restricted to Counsel and Principal access levels.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-[#F8F8F6]">Clients</h1>
          <p className="text-[#555555] text-sm mt-0.5">{clients.length} active engagements</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#141414] border border-[#222222] rounded-sm p-4 text-center">
          <p className="text-[#9B8B5F] text-xl font-serif font-medium">{clients.length}</p>
          <p className="text-[#555555] text-xs mt-1">Active Clients</p>
        </div>
        <div className="bg-[#141414] border border-[#222222] rounded-sm p-4 text-center">
          <p className="text-[#9B8B5F] text-xl font-serif font-medium">
            AED {clients.reduce((s, c) => s + c.totalInvoiced, 0).toLocaleString()}
          </p>
          <p className="text-[#555555] text-xs mt-1">Total Invoiced</p>
        </div>
        <div className="bg-[#141414] border border-[#222222] rounded-sm p-4 text-center">
          <p className="text-amber-400 text-xl font-serif font-medium">
            AED {clients.reduce((s, c) => s + c.pendingAmount, 0).toLocaleString()}
          </p>
          <p className="text-[#555555] text-xs mt-1">Pending</p>
        </div>
      </div>

      <div className="space-y-4">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}
