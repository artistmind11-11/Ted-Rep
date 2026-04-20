import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData } from "@/lib/portal-data";
import { Activity, ShieldOff, Clock } from "lucide-react";

const ACTION_COLORS: Record<string, string> = {
  "Task Created": "text-green-400 bg-green-400/10",
  "Task Updated": "text-blue-400 bg-blue-400/10",
  "Invoice Generated": "text-amber-400 bg-amber-400/10",
  "Invoice Paid": "text-green-400 bg-green-400/10",
  "Invoice Approved": "text-blue-400 bg-blue-400/10",
  "Invoice Disputed": "text-red-400 bg-red-400/10",
  "Client Onboarding": "text-purple-400 bg-purple-400/10",
  "Access Granted": "text-[#9B8B5F] bg-[#9B8B5F]/10",
  "Access Revoked": "text-red-400 bg-red-400/10",
};

export default function AuditLog() {
  const { can } = usePortalAuth();
  const { auditLog } = usePortalData();

  if (!can("view_audit_log")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555555] text-sm max-w-xs">The audit log is restricted to Principal access only.</p>
      </div>
    );
  }

  const actions = [...new Set(auditLog.map((e) => e.action))];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Activity size={18} className="text-[#9B8B5F]" />
          <h1 className="font-serif text-2xl text-[#F8F8F6]">Audit Log</h1>
        </div>
        <p className="text-[#555555] text-sm">{auditLog.length} recorded events — immutable activity trail</p>
      </div>

      {/* Action summary */}
      <div className="flex flex-wrap gap-2 mb-8">
        {actions.map((a) => {
          const count = auditLog.filter((e) => e.action === a).length;
          const color = ACTION_COLORS[a] ?? "text-[#888888] bg-[#1A1A1A]";
          return (
            <span key={a} className={`text-xs px-2 py-1 rounded-sm ${color}`}>
              {a} ({count})
            </span>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-[#1F1F1F]" />
        <div className="space-y-1 ml-8">
          {auditLog.map((entry, i) => {
            const color = ACTION_COLORS[entry.action] ?? "text-[#888888] bg-[#1A1A1A]";
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative bg-[#141414] border border-[#1E1E1E] rounded-sm px-5 py-4 hover:border-[#2A2A2A] transition-colors"
                data-testid={`audit-entry-${entry.id}`}
              >
                {/* Timeline dot */}
                <div className={`absolute -left-[2.2rem] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#141414] ${color.split(" ")[1]}`} />

                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${color}`}>
                        {entry.action}
                      </span>
                    </div>
                    <p className="text-[#888888] text-sm">{entry.detail}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[#555555] text-xs flex items-center gap-1 justify-end">
                      <Clock size={11} /> {entry.timestamp}
                    </p>
                    <p className="text-[#444444] text-xs mt-0.5">{entry.user}</p>
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
