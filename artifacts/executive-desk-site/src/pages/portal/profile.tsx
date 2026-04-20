import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData } from "@/lib/portal-data";
import { UserCircle, Mail, Building2, Globe, CheckCircle2, Circle, Shield, Briefcase, User } from "lucide-react";

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<{size?: number; className?: string}> }> = {
  admin: { label: "Principal", color: "text-[#9B8B5F] bg-[#9B8B5F]/10 border-[#9B8B5F]/20", icon: Shield },
  counsel: { label: "Counsel", color: "text-blue-400 bg-blue-400/10 border-blue-400/20", icon: Briefcase },
  associate: { label: "Associate", color: "text-green-400 bg-green-400/10 border-green-400/20", icon: User },
  client: { label: "Client", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: UserCircle },
};

export default function Profile() {
  const { user, can } = usePortalAuth();
  const { clients, tasks, invoices, team } = usePortalData();

  if (!user) return null;

  const cfg = ROLE_CONFIG[user.role];
  const Icon = cfg.icon;

  // Client-specific data
  const myClient = user.clientId ? clients.find((c) => c.id === user.clientId) : null;
  const myTasks = user.role === "client"
    ? tasks.filter((t) => t.clientId === user.clientId)
    : tasks.filter((t) => t.assignedTo === user.id);
  const myInvoices = user.role === "client"
    ? invoices.filter((i) => i.clientId === user.clientId)
    : [];

  // Team member data
  const myTeamEntry = team.find((m) => m.id === user.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-[#F8F8F6]">My Profile</h1>
        <p className="text-[#555555] text-sm mt-0.5">Your account and access information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141414] border border-[#222222] rounded-sm p-6 lg:col-span-1"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#9B8B5F]/10 border border-[#9B8B5F]/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-[#9B8B5F] text-xl font-serif">
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <h2 className="font-serif text-xl text-[#F8F8F6]">{user.name}</h2>
            <p className="text-[#555555] text-sm mt-1">{user.email}</p>
            <div className={`inline-flex items-center gap-1.5 mt-3 text-xs px-3 py-1 rounded-sm border ${cfg.color}`}>
              <Icon size={12} /> {cfg.label}
            </div>
          </div>

          <div className="space-y-3 border-t border-[#1F1F1F] pt-5">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={14} className="text-[#9B8B5F] flex-shrink-0" />
              <span className="text-[#888888] break-all">{user.email}</span>
            </div>
            {myClient && (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 size={14} className="text-[#9B8B5F] flex-shrink-0" />
                  <span className="text-[#888888]">{myClient.company}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe size={14} className="text-[#9B8B5F] flex-shrink-0" />
                  <span className="text-[#888888]">{myClient.country}</span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Right panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="bg-[#141414] border border-[#222222] rounded-sm p-4 text-center">
              <p className="text-[#F8F8F6] text-2xl font-serif">{myTasks.length}</p>
              <p className="text-[#555555] text-xs mt-1">
                {user.role === "client" ? "My Tasks" : "Assigned Tasks"}
              </p>
            </div>
            {user.role === "client" && (
              <>
                <div className="bg-[#141414] border border-[#222222] rounded-sm p-4 text-center">
                  <p className="text-[#F8F8F6] text-2xl font-serif">{myInvoices.length}</p>
                  <p className="text-[#555555] text-xs mt-1">Invoices</p>
                </div>
                <div className="bg-[#141414] border border-[#222222] rounded-sm p-4 text-center">
                  <p className="text-amber-400 text-2xl font-serif">
                    {myInvoices.filter((i) => i.status === "Pending").length}
                  </p>
                  <p className="text-[#555555] text-xs mt-1">Pending</p>
                </div>
              </>
            )}
            {user.role !== "client" && myTeamEntry && (
              <>
                <div className="bg-[#141414] border border-[#222222] rounded-sm p-4 text-center">
                  <p className="text-[#F8F8F6] text-2xl font-serif">{myTeamEntry.assignedClients.length}</p>
                  <p className="text-[#555555] text-xs mt-1">Clients</p>
                </div>
                <div className="bg-[#141414] border border-[#222222] rounded-sm p-4 text-center">
                  <p className="text-green-400 text-2xl font-serif">
                    {myTasks.filter((t) => t.status === "Active").length}
                  </p>
                  <p className="text-[#555555] text-xs mt-1">Active</p>
                </div>
              </>
            )}
          </motion.div>

          {/* Client onboarding */}
          {myClient && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-[#141414] border border-[#222222] rounded-sm p-5"
            >
              <p className="text-[#9B8B5F] text-xs uppercase tracking-wider mb-4">Onboarding Progress</p>
              <div className="space-y-3">
                {myClient.onboarding.map((step) => (
                  <div key={step.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {step.done
                        ? <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                        : <Circle size={14} className="text-[#333333] flex-shrink-0" />}
                      <span className={`text-sm ${step.done ? "text-[#888888]" : "text-[#555555]"}`}>{step.label}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${step.done ? "bg-green-400/10 text-green-400" : "bg-[#1A1A1A] text-[#444444]"}`}>
                      {step.done ? "Complete" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Client: assigned team */}
          {myClient && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#141414] border border-[#222222] rounded-sm p-5"
            >
              <p className="text-[#9B8B5F] text-xs uppercase tracking-wider mb-4">Your Assigned Team</p>
              <div className="space-y-3">
                {myClient.assignedTeam.map((tid) => {
                  const member = team.find((m) => m.id === tid);
                  if (!member) return null;
                  const mcfg = ROLE_CONFIG[member.role];
                  const MIcon = mcfg.icon;
                  return (
                    <div key={tid} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#2A2A2A] flex items-center justify-center">
                          <span className="text-xs text-[#9B8B5F]">
                            {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-[#F8F8F6] text-sm">{member.name}</p>
                          <p className="text-[#444444] text-xs">{member.email}</p>
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

          {/* Permissions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#141414] border border-[#222222] rounded-sm p-5"
          >
            <p className="text-[#9B8B5F] text-xs uppercase tracking-wider mb-4">Access Level</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "View All Clients", granted: can("view_all_clients") },
                { label: "View All Billing", granted: can("view_billing_all") },
                { label: "Manage Team", granted: can("view_team") },
                { label: "Grant/Revoke Access", granted: can("grant_access") },
                { label: "Approve Tasks", granted: can("approve_tasks") },
                { label: "View Audit Log", granted: can("view_audit_log") },
                { label: "Dispute Invoices", granted: can("dispute_invoice") },
                { label: "View KPIs", granted: can("view_kpis") },
              ].map(({ label, granted }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  {granted
                    ? <CheckCircle2 size={12} className="text-green-400 flex-shrink-0" />
                    : <Circle size={12} className="text-[#2A2A2A] flex-shrink-0" />}
                  <span className={granted ? "text-[#888888]" : "text-[#333333]"}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
