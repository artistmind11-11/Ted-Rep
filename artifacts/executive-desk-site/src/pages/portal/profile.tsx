import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData } from "@/lib/portal-data";
import { Shield, Briefcase, User, UserCircle, CheckCircle2, Circle, Mail, Building2, Globe } from "lucide-react";

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<{size?: number; className?: string}> }> = {
  admin:     { label: "Principal", color: "text-[#9B8B5F] bg-[#9B8B5F]/10 border-[#9B8B5F]/20", icon: Shield },
  counsel:   { label: "Counsel",   color: "text-blue-400 bg-blue-400/10 border-blue-400/20",     icon: Briefcase },
  associate: { label: "Associate", color: "text-green-400 bg-green-400/10 border-green-400/20",   icon: User },
  client:    { label: "Client",    color: "text-purple-400 bg-purple-400/10 border-purple-400/20",icon: UserCircle },
};

export default function Profile() {
  const { user, can } = usePortalAuth();
  const { clients, tasks, invoices, team } = usePortalData();

  if (!user) return null;

  const cfg = ROLE_CONFIG[user.role];
  const Icon = cfg.icon;

  const myClient = user.clientId ? clients.find((c) => c.id === user.clientId) : null;
  const myTasks = user.role === "client"
    ? tasks.filter((t) => t.clientId === user.clientId)
    : tasks.filter((t) => t.assignedTo === user.id);
  const myInvoices = user.role === "client" ? invoices.filter((i) => i.clientId === user.clientId) : [];
  const myTeamEntry = team.find((m) => m.id === user.id);

  const PERMISSIONS_LIST = [
    { label: "View All Clients",      granted: can("view_all_clients") },
    { label: "View CRM / Leads",      granted: can("view_crm") },
    { label: "View All Billing",       granted: can("view_billing_all") },
    { label: "Grant / Revoke Access",  granted: can("grant_access") },
    { label: "Approve Tasks",          granted: can("approve_tasks") },
    { label: "View Audit Log",         granted: can("view_audit_log") },
    { label: "View KPIs & Reports",    granted: can("view_kpis") },
    { label: "Dispute Invoices",       granted: can("dispute_invoice") },
  ];

  return (
    <div>
      <div className="mb-6">
        <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Account</p>
        <h1 className="font-serif text-2xl text-[#F8F8F6]">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identity card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#141414] border border-[#222] rounded-sm p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#9B8B5F]/10 border border-[#9B8B5F]/20 flex items-center justify-center mx-auto mb-4">
              <span className="font-serif text-[#9B8B5F] text-xl">
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <h2 className="font-serif text-xl text-[#F8F8F6]">{user.name}</h2>
            <p className="text-[#444] text-sm mt-1">{user.email}</p>
            <div className={`inline-flex items-center gap-1.5 mt-3 text-xs px-3 py-1 rounded-sm border ${cfg.color}`}>
              <Icon size={12} /> {cfg.label}
            </div>
          </div>

          <div className="space-y-3 border-t border-[#1F1F1F] pt-5">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={13} className="text-[#9B8B5F] flex-shrink-0" />
              <span className="text-[#666] text-xs break-all">{user.email}</span>
            </div>
            {myClient && (
              <>
                <div className="flex items-center gap-3">
                  <Building2 size={13} className="text-[#9B8B5F] flex-shrink-0" />
                  <span className="text-[#666] text-xs">{myClient.company}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={13} className="text-[#9B8B5F] flex-shrink-0" />
                  <span className="text-[#666] text-xs">{myClient.country}</span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Right panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4">
            <div className="bg-[#141414] border border-[#222] rounded-sm p-4 text-center">
              <p className="font-serif text-2xl text-[#F8F8F6]">{myTasks.length}</p>
              <p className="text-[#444] text-xs mt-1">{user.role === "client" ? "My Tasks" : "Assigned"}</p>
            </div>
            {user.role === "client" ? (
              <>
                <div className="bg-[#141414] border border-[#222] rounded-sm p-4 text-center">
                  <p className="font-serif text-2xl text-[#F8F8F6]">{myInvoices.length}</p>
                  <p className="text-[#444] text-xs mt-1">Invoices</p>
                </div>
                <div className="bg-[#141414] border border-[#222] rounded-sm p-4 text-center">
                  <p className="font-serif text-2xl text-amber-400">{myInvoices.filter((i) => i.status === "Upcoming").length}</p>
                  <p className="text-[#444] text-xs mt-1">Pending</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-[#141414] border border-[#222] rounded-sm p-4 text-center">
                  <p className="font-serif text-2xl text-[#F8F8F6]">{myTeamEntry?.assignedClients.length ?? 0}</p>
                  <p className="text-[#444] text-xs mt-1">Clients</p>
                </div>
                <div className="bg-[#141414] border border-[#222] rounded-sm p-4 text-center">
                  <p className="font-serif text-2xl text-green-400">{myTasks.filter((t) => t.status === "In Progress").length}</p>
                  <p className="text-[#444] text-xs mt-1">Active</p>
                </div>
              </>
            )}
          </motion.div>

          {/* Client onboarding */}
          {myClient && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-[#141414] border border-[#222] rounded-sm p-5">
              <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-4">Onboarding Progress</p>
              <div className="space-y-3">
                {myClient.onboarding.map((step) => (
                  <div key={step.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {step.done ? <CheckCircle2 size={13} className="text-green-400" /> : <Circle size={13} className="text-[#333]" />}
                      <span className={`text-sm ${step.done ? "text-[#888]" : "text-[#444]"}`}>{step.label}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${step.done ? "bg-green-400/10 text-green-400" : "bg-[#1A1A1A] text-[#333]"}`}>
                      {step.done ? "Complete" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Assigned team (for clients) */}
          {myClient && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#141414] border border-[#222] rounded-sm p-5">
              <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-4">Your Assigned Team</p>
              <div className="space-y-3">
                {myClient.assignedTeam.map((tid) => {
                  const member = team.find((m) => m.id === tid);
                  if (!member) return null;
                  const mcfg = ROLE_CONFIG[member.role];
                  const MIcon = mcfg.icon;
                  return (
                    <div key={tid} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#1F1F1F] border border-[#2A2A2A] flex items-center justify-center">
                          <span className="text-[9px] text-[#9B8B5F]">{member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="text-[#F8F8F6] text-sm">{member.name}</p>
                          <p className="text-[#333] text-xs">{member.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-sm border inline-flex items-center gap-1 ${mcfg.color}`}>
                        <MIcon size={10} /> {mcfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Permissions — hidden for clients */}
          {user.role !== "client" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-[#141414] border border-[#222] rounded-sm p-5">
              <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-4">Access Level — {cfg.label}</p>
              <div className="grid grid-cols-2 gap-2">
                {PERMISSIONS_LIST.map(({ label, granted }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    {granted
                      ? <CheckCircle2 size={12} className="text-green-400 flex-shrink-0" />
                      : <Circle size={12} className="text-[#1F1F1F] flex-shrink-0" />}
                    <span className={granted ? "text-[#888]" : "text-[#2A2A2A]"}>{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
