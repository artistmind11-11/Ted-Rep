import { useState } from "react";
import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData, ApprovalType } from "@/lib/portal-data";
import { CheckCircle2, XCircle, Scale, DollarSign, FileText, Building2, ShieldOff, Plus, Link2 } from "lucide-react";
import { RequestApprovalModal, ToolbarButton } from "@/components/portal-forms";

const TYPE_CONFIG: Record<ApprovalType, { icon: React.ComponentType<{size?: number; className?: string}>; color: string }> = {
  Legal: { icon: Scale, color: "text-blue-400 bg-blue-400/10" },
  Financial: { icon: DollarSign, color: "text-[#9B8B5F] bg-[#9B8B5F]/10" },
  Document: { icon: FileText, color: "text-purple-400 bg-purple-400/10" },
  Governance: { icon: Building2, color: "text-amber-400 bg-amber-400/10" },
};

const STATUS_STYLE = {
  Approved: "text-green-400 bg-green-400/10 border-green-400/20",
  Rejected: "text-red-400 bg-red-400/10 border-red-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

export default function Approvals() {
  const { user, can } = usePortalAuth();
  const { approvals, updateApproval, clients, tasks, invoices } = usePortalData();
  const [actioned, setActioned] = useState<Set<string>>(new Set(
    approvals.filter((a) => a.status !== "Pending").map((a) => a.id)
  ));
  const [showRequest, setShowRequest] = useState(false);

  if (!can("approve_tasks") && !can("request_approval")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555] text-sm max-w-xs">The approvals queue requires Principal or Counsel access.</p>
      </div>
    );
  }

  const pending = approvals.filter((a) => a.status === "Pending" && !actioned.has(a.id));
  const recentlyActioned = approvals.filter((a) => a.status !== "Pending" || actioned.has(a.id)).slice(0, 6);

  const handleAction = (id: string, action: "Approved" | "Rejected") => {
    let reason: string | undefined;
    if (action === "Rejected") {
      reason = window.prompt("Reason for rejection? (optional)") || undefined;
    }
    updateApproval(user?.name ?? "Principal", id, action, reason);
    setActioned((prev) => new Set([...prev, id]));
  };

  const renderLinked = (item: typeof approvals[number]) => {
    const links: { label: string; value: string }[] = [];
    if (item.linkedClientId) {
      const c = clients.find((x) => x.id === item.linkedClientId);
      if (c) links.push({ label: "Client", value: c.company });
    }
    if (item.linkedTaskId) {
      const t = tasks.find((x) => x.id === item.linkedTaskId);
      if (t) links.push({ label: "Task", value: t.title });
    }
    if (item.linkedInvoiceId) {
      const inv = invoices.find((x) => x.id === item.linkedInvoiceId);
      if (inv) links.push({ label: "Invoice", value: inv.id.toUpperCase() });
    }
    if (!links.length) return null;
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {links.map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] text-[#9B8B5F]">
            <Link2 size={9} /> {l.label}: <span className="text-[#888]">{l.value}</span>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Decision Queue</p>
          <h1 className="font-serif text-2xl text-[#F8F8F6]">Approvals</h1>
          <p className="text-[#555] text-sm mt-0.5">{pending.length} item{pending.length !== 1 ? "s" : ""} awaiting authorization</p>
        </div>
        {can("request_approval") && (
          <ToolbarButton onClick={() => setShowRequest(true)} icon={Plus} label="Request Approval" dataTestid="open-request-approval" />
        )}
      </div>
      <RequestApprovalModal open={showRequest} onClose={() => setShowRequest(false)} />

      {/* Pending queue */}
      <div className="space-y-3 mb-10">
        {pending.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-[#141414] border border-[#222] rounded-sm px-5 py-12 text-center">
            <CheckCircle2 size={28} className="text-green-400 mx-auto mb-3" />
            <p className="text-[#888] text-sm">All items reviewed — queue is clear</p>
          </motion.div>
        ) : (
          pending.map((item, i) => {
            const cfg = TYPE_CONFIG[item.type];
            const Icon = cfg.icon;
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-[#141414] border border-[#222] rounded-sm p-5 hover:border-[#2A2A2A] transition-colors"
                data-testid={`approval-${item.id}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-[#555] text-xs uppercase tracking-widest w-[76px] flex-shrink-0">{item.type}</p>
                      <p className="text-[#F8F8F6] font-medium text-sm">{item.title}</p>
                    </div>
                    <p className="text-[#555] text-sm leading-relaxed">{item.subtitle}</p>
                    {item.requestedBy && <p className="text-[#444] text-xs mt-1">Requested by {item.requestedBy}</p>}
                    {renderLinked(item)}
                    {can("approve_tasks") && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button onClick={() => handleAction(item.id, "Approved")}
                          data-testid={`button-approve-${item.id}`}
                          className="flex items-center gap-1.5 text-xs px-4 py-1.5 bg-green-400/10 text-green-400 border border-green-400/20 rounded-sm hover:bg-green-400/20 transition-colors">
                          <CheckCircle2 size={13} /> Approve
                        </button>
                        <button onClick={() => handleAction(item.id, "Rejected")}
                          data-testid={`button-reject-${item.id}`}
                          className="flex items-center gap-1.5 text-xs px-4 py-1.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded-sm hover:bg-red-400/20 transition-colors">
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[#333] text-xs flex-shrink-0">{item.date}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Recently Actioned */}
      {recentlyActioned.length > 0 && (
        <div className="bg-[#141414] border border-[#222] rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1F1F1F]">
            <p className="font-serif text-[#F8F8F6] text-lg">Recently Actioned</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1A1A1A]">
                  {["Item", "Type", "Date", "Status", "Notes"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[#444] text-xs uppercase tracking-wider font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentlyActioned.map((item) => {
                  const resolvedStatus = approvals.find((a) => a.id === item.id)?.status ?? item.status;
                  const live = approvals.find((a) => a.id === item.id);
                  return (
                    <tr key={item.id} className="border-b border-[#1A1A1A] hover:bg-[rgba(255,255,255,0.01)]">
                      <td className="px-5 py-3 text-[#F8F8F6] text-sm max-w-[260px]">
                        <p className="truncate">{item.title}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-sm ${TYPE_CONFIG[item.type].color}`}>{item.type}</span>
                      </td>
                      <td className="px-5 py-3 text-[#555] text-xs">{item.date}</td>
                      <td className="px-5 py-3">
                        {resolvedStatus !== "Pending" ? (
                          <span className={`text-xs px-2 py-0.5 rounded-sm border ${STATUS_STYLE[resolvedStatus]}`}>{resolvedStatus}</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-sm border text-amber-400 bg-amber-400/10 border-amber-400/20">Pending</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-[#666] text-xs italic max-w-[240px]">
                        {live?.rejectionReason ? <p className="truncate text-rose-300/70">{live.rejectionReason}</p> : <span className="text-[#333]">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
