import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePortalAuth, ALL_PERMISSIONS, PERMISSIONS, PermissionAction } from "@/lib/portal-auth";
import { usePortalData } from "@/lib/portal-data";
import { Shield, CheckCircle2, XCircle, ShieldOff, Lock, Info, Plus, Trash2, Users, Sliders } from "lucide-react";
import { AddTeamMemberModal } from "@/components/portal-forms";

const ROLES = [
  { key: "admin", label: "Principal", color: "text-[#9B8B5F]", bg: "bg-[#9B8B5F]/10" },
  { key: "counsel", label: "Counsel", color: "text-blue-400", bg: "bg-blue-400/10" },
  { key: "associate", label: "Associate", color: "text-green-400", bg: "bg-green-400/10" },
  { key: "client", label: "Client", color: "text-purple-400", bg: "bg-purple-400/10" },
] as const;

const PERMISSION_LABELS: Record<PermissionAction, string> = {
  view_all_clients: "View All Clients",
  view_crm: "View CRM / Leads",
  view_billing_all: "View All Billing",
  view_billing_own: "View Own Billing",
  view_team: "View Team",
  manage_users: "Manage Users",
  grant_access: "Grant / Revoke Access",
  revoke_access: "Revoke Access",
  create_tasks: "Create Tasks",
  approve_tasks: "Approve Tasks",
  view_tasks_all: "View All Tasks",
  view_tasks_own: "View Own Tasks",
  view_audit_log: "View Audit Log",
  view_kpis: "View KPIs & Analytics",
  dispute_invoice: "Dispute Invoice",
  view_own_profile: "View Own Profile",
  delete_invoice: "Delete Invoice",
  edit_invoice: "Edit Invoice",
  mark_invoice_paid: "Mark Invoice Paid",
  request_approval: "Request Approval",
  manage_team: "Manage Team",
  assign_clients: "Assign Clients",
  set_custom_perms: "Set Custom Permissions",
};

function AccessCell({ granted }: { granted: boolean }) {
  return (
    <div className="flex justify-center">
      {granted
        ? <CheckCircle2 size={16} className="text-green-400" />
        : <XCircle size={16} className="text-[#2A2A2A]" />}
    </div>
  );
}

export default function AccessControl() {
  const { user, can, customPermissions, setUserCustomPermissions, getEffectivePermissions } = usePortalAuth();
  const { team, clients, removeTeamMember, updateTeamAssignment } = usePortalData();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const matrix = useMemo(() => ALL_PERMISSIONS.map((p) => ({
    action: p,
    label: PERMISSION_LABELS[p],
    admin: PERMISSIONS.admin.includes(p),
    counsel: PERMISSIONS.counsel.includes(p),
    associate: PERMISSIONS.associate.includes(p),
    client: PERMISSIONS.client.includes(p),
  })), []);

  if (!can("grant_access")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555555] text-sm max-w-xs">Access control management is exclusive to the Principal role.</p>
      </div>
    );
  }

  const flash = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(null), 2800); };

  const handleRemove = (id: string, name: string) => {
    if (id === user?.id) { flash("You cannot remove your own access"); return; }
    if (!window.confirm(`Remove ${name} from the team? Their portal access will be revoked.`)) return;
    removeTeamMember(user?.name ?? "Principal", id);
    flash(`${name} removed from team`);
  };

  const handleToggleClient = (memberId: string, clientId: string) => {
    const member = team.find((m) => m.id === memberId);
    if (!member) return;
    const next = member.assignedClients.includes(clientId)
      ? member.assignedClients.filter((c) => c !== clientId)
      : [...member.assignedClients, clientId];
    updateTeamAssignment(user?.name ?? "Principal", memberId, next);
  };

  const handleTogglePerm = (memberId: string, role: typeof team[number]["role"], perm: PermissionAction) => {
    const effective = getEffectivePermissions(memberId, role);
    const next = effective.includes(perm)
      ? effective.filter((p) => p !== perm)
      : [...effective, perm];
    setUserCustomPermissions(memberId, next);
  };

  const resetPerms = (memberId: string) => {
    setUserCustomPermissions(memberId, []);
    flash("Permissions reset to role default");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Shield size={18} className="text-[#9B8B5F]" />
            <h1 className="font-serif text-2xl text-[#F8F8F6]">Access Control</h1>
          </div>
          <p className="text-[#555555] text-sm">Role-based permission matrix and member management</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAdd(true)} data-testid="open-add-team"
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2 bg-[#9B8B5F]/10 text-[#9B8B5F] border border-[#9B8B5F]/20 rounded-sm hover:bg-[#9B8B5F]/20 transition-colors">
            <Plus size={13} /> Add Member
          </button>
          <div className="flex items-center gap-2 bg-[#9B8B5F]/5 border border-[#9B8B5F]/15 rounded-sm px-3 py-2">
            <Lock size={13} className="text-[#9B8B5F]" />
            <span className="text-[#9B8B5F] text-xs">Principal Only</span>
          </div>
        </div>
      </div>
      <AddTeamMemberModal open={showAdd} onClose={() => setShowAdd(false)} />

      {notification && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 bg-[#9B8B5F]/10 border border-[#9B8B5F]/30 rounded-sm px-4 py-3">
          <CheckCircle2 size={15} className="text-[#9B8B5F]" />
          <p className="text-[#9B8B5F] text-sm">{notification}</p>
        </motion.div>
      )}

      {/* Permission Matrix */}
      <div className="bg-[#141414] border border-[#222222] rounded-sm overflow-hidden mb-8">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1F1F1F]">
          <Info size={14} className="text-[#9B8B5F]" />
          <h2 className="font-serif text-[#F8F8F6] text-lg">Permission Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1F1F1F]">
                <th className="text-left px-5 py-3 text-[#555555] text-xs uppercase tracking-wider font-medium">Permission</th>
                {ROLES.map((r) => (
                  <th key={r.key} className="px-4 py-3 text-center">
                    <span className={`text-xs font-medium ${r.color}`}>{r.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={row.action} className={`border-b border-[#1A1A1A] hover:bg-[#191919] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-5 py-3 text-[#888888] text-sm">{row.label}</td>
                  {ROLES.map((r) => (
                    <td key={r.key} className="px-4 py-3"><AccessCell granted={row[r.key]} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Access Management */}
      <div className="bg-[#141414] border border-[#222222] rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1F1F1F] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-[#F8F8F6] text-lg">Member Access</h2>
            <p className="text-[#555555] text-xs mt-0.5">Manage clients, custom permissions, and access for team members</p>
          </div>
          <span className="text-[#444] text-xs">{team.length} member{team.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="divide-y divide-[#1A1A1A]">
          {team.map((member) => {
            const cfg = ROLES.find((r) => r.key === member.role);
            const isExpanded = selectedMember === member.id;
            const hasOverride = !!customPermissions[member.id];
            const effective = getEffectivePermissions(member.id, member.role);
            return (
              <div key={member.id} className="px-5 py-4 hover:bg-[#191919] transition-colors" data-testid={`access-member-${member.id}`}>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setSelectedMember(isExpanded ? null : member.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#2A2A2A] flex items-center justify-center">
                      <span className="text-xs text-[#9B8B5F]">{member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[#F8F8F6] text-sm">{member.name}</p>
                        {hasOverride && <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#9B8B5F]/15 text-[#9B8B5F] border border-[#9B8B5F]/30">custom</span>}
                      </div>
                      <p className="text-[#444444] text-xs">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#444] text-xs">{member.assignedClients.length} client{member.assignedClients.length !== 1 ? "s" : ""}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${cfg?.bg} ${cfg?.color}`}>{cfg?.label}</span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${member.active ? "bg-green-400" : "bg-red-400"}`} />
                      <span className={`text-xs ${member.active ? "text-green-400" : "text-red-400"}`}>{member.active ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="mt-5 pt-5 border-t border-[#1F1F1F] space-y-6">

                    {/* Assigned Clients */}
                    {member.role !== "admin" && member.role !== "client" && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Users size={13} className="text-[#9B8B5F]" />
                          <p className="text-[#9B8B5F] text-xs uppercase tracking-widest">Assigned Clients</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {clients.map((c) => {
                            const checked = member.assignedClients.includes(c.id);
                            return (
                              <label key={c.id} className="flex items-center gap-2 px-3 py-2 bg-[#0F0F0F] border border-[#222] rounded-sm hover:border-[#2A2A2A] cursor-pointer">
                                <input type="checkbox" checked={checked}
                                  onChange={() => handleToggleClient(member.id, c.id)}
                                  data-testid={`assign-${member.id}-${c.id}`}
                                  className="accent-[#9B8B5F]" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[#F8F8F6] text-xs truncate">{c.company}</p>
                                  <p className="text-[#444] text-[10px]">{c.code}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Custom Permissions */}
                    {member.role !== "admin" && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Sliders size={13} className="text-[#9B8B5F]" />
                            <p className="text-[#9B8B5F] text-xs uppercase tracking-widest">Custom Permissions</p>
                          </div>
                          {hasOverride && (
                            <button onClick={() => resetPerms(member.id)}
                              data-testid={`reset-perms-${member.id}`}
                              className="text-[10px] text-[#9B8B5F] hover:text-[#B8A870] transition-colors uppercase tracking-wider">Reset to default</button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {ALL_PERMISSIONS.map((perm) => {
                            const checked = effective.includes(perm);
                            return (
                              <label key={perm} className="flex items-center gap-2 px-2.5 py-1.5 bg-[#0F0F0F] border border-[#1F1F1F] rounded-sm hover:border-[#2A2A2A] cursor-pointer">
                                <input type="checkbox" checked={checked}
                                  onChange={() => handleTogglePerm(member.id, member.role, perm)}
                                  data-testid={`perm-${member.id}-${perm}`}
                                  className="accent-[#9B8B5F]" />
                                <span className={`text-[11px] ${checked ? "text-[#888]" : "text-[#444]"}`}>{PERMISSION_LABELS[perm]}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Danger zone */}
                    <div className="flex justify-end pt-2 border-t border-[#1F1F1F]">
                      <button onClick={(e) => { e.stopPropagation(); handleRemove(member.id, member.name); }}
                        disabled={member.id === user?.id}
                        data-testid={`button-remove-${member.id}`}
                        className="flex items-center gap-1.5 text-xs px-4 py-2 bg-red-400/10 text-red-400 border border-red-400/20 rounded-sm hover:bg-red-400/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <Trash2 size={12} /> Remove from Team
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
