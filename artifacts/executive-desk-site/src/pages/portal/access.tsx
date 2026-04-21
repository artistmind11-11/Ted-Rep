import { useState } from "react";
import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData } from "@/lib/portal-data";
import { Shield, CheckCircle2, XCircle, ShieldOff, Lock, Info } from "lucide-react";

const PERMISSION_MATRIX = [
  { action: "View All Clients", admin: true, counsel: true, associate: false, client: false },
  { action: "View CRM / Leads", admin: true, counsel: true, associate: false, client: false },
  { action: "View All Billing", admin: true, counsel: true, associate: false, client: false },
  { action: "View Own Billing", admin: true, counsel: true, associate: false, client: true },
  { action: "Dispute Invoice", admin: false, counsel: false, associate: false, client: true },
  { action: "Approve Invoice", admin: true, counsel: true, associate: false, client: false },
  { action: "Mark Invoice Paid", admin: true, counsel: true, associate: false, client: false },
  { action: "View Team", admin: true, counsel: true, associate: false, client: false },
  { action: "Manage Users", admin: true, counsel: false, associate: false, client: false },
  { action: "Grant / Revoke Access", admin: true, counsel: false, associate: false, client: false },
  { action: "Create Tasks", admin: true, counsel: true, associate: true, client: false },
  { action: "Approve Tasks", admin: true, counsel: true, associate: false, client: false },
  { action: "View All Tasks", admin: true, counsel: true, associate: true, client: false },
  { action: "View Own Tasks", admin: true, counsel: true, associate: true, client: true },
  { action: "View Audit Log", admin: true, counsel: false, associate: false, client: false },
  { action: "View KPIs & Analytics", admin: true, counsel: true, associate: false, client: false },
];

const ROLES = [
  { key: "admin", label: "Principal", color: "text-[#9B8B5F]", bg: "bg-[#9B8B5F]/10" },
  { key: "counsel", label: "Counsel", color: "text-blue-400", bg: "bg-blue-400/10" },
  { key: "associate", label: "Associate", color: "text-green-400", bg: "bg-green-400/10" },
  { key: "client", label: "Client", color: "text-purple-400", bg: "bg-purple-400/10" },
] as const;

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
  const { can } = usePortalAuth();
  const { team, addAuditEntry } = usePortalData();
  const { user } = usePortalAuth();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  if (!can("grant_access")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555555] text-sm max-w-xs">Access control management is exclusive to the Principal role.</p>
      </div>
    );
  }

  const handleToggle = (memberId: string, action: "grant" | "revoke") => {
    const member = team.find((m) => m.id === memberId);
    if (!member) return;
    addAuditEntry({
      action: action === "grant" ? "Access Granted" : "Access Revoked",
      user: user?.name ?? "Principal",
      detail: `${action === "grant" ? "Access granted to" : "Access revoked from"} ${member.name} (${member.role})`,
      category: "Portal Access",
      important: true,
    });
    setNotification(`${action === "grant" ? "Access granted to" : "Access revoked from"} ${member.name}`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Shield size={18} className="text-[#9B8B5F]" />
            <h1 className="font-serif text-2xl text-[#F8F8F6]">Access Control</h1>
          </div>
          <p className="text-[#555555] text-sm">Role-based permission matrix and member management</p>
        </div>
        <div className="flex items-center gap-2 bg-[#9B8B5F]/5 border border-[#9B8B5F]/15 rounded-sm px-3 py-2">
          <Lock size={13} className="text-[#9B8B5F]" />
          <span className="text-[#9B8B5F] text-xs">Principal Only</span>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 bg-[#9B8B5F]/10 border border-[#9B8B5F]/30 rounded-sm px-4 py-3"
        >
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
              {PERMISSION_MATRIX.map((row, i) => (
                <tr
                  key={row.action}
                  className={`border-b border-[#1A1A1A] hover:bg-[#191919] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}
                >
                  <td className="px-5 py-3 text-[#888888] text-sm">{row.action}</td>
                  {ROLES.map((r) => (
                    <td key={r.key} className="px-4 py-3">
                      <AccessCell granted={row[r.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Access Management */}
      <div className="bg-[#141414] border border-[#222222] rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1F1F1F]">
          <h2 className="font-serif text-[#F8F8F6] text-lg">Member Access</h2>
          <p className="text-[#555555] text-xs mt-0.5">Grant or revoke portal access for individual team members</p>
        </div>
        <div className="divide-y divide-[#1A1A1A]">
          {team.map((member) => {
            const cfg = ROLES.find((r) => r.key === member.role);
            const isExpanded = selectedMember === member.id;
            return (
              <div
                key={member.id}
                className="px-5 py-4 hover:bg-[#191919] transition-colors cursor-pointer"
                onClick={() => setSelectedMember(isExpanded ? null : member.id)}
                data-testid={`access-member-${member.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
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
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${cfg?.bg} ${cfg?.color}`}>
                      {cfg?.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${member.active ? "bg-green-400" : "bg-red-400"}`} />
                      <span className={`text-xs ${member.active ? "text-green-400" : "text-red-400"}`}>
                        {member.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-[#1F1F1F] flex flex-wrap gap-2"
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggle(member.id, "grant"); }}
                      data-testid={`button-grant-${member.id}`}
                      className="flex items-center gap-1.5 text-xs px-4 py-2 bg-green-400/10 text-green-400 border border-green-400/20 rounded-sm hover:bg-green-400/20 transition-colors"
                    >
                      <CheckCircle2 size={13} /> Grant Access
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggle(member.id, "revoke"); }}
                      data-testid={`button-revoke-${member.id}`}
                      className="flex items-center gap-1.5 text-xs px-4 py-2 bg-red-400/10 text-red-400 border border-red-400/20 rounded-sm hover:bg-red-400/20 transition-colors"
                    >
                      <XCircle size={13} /> Revoke Access
                    </button>
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
