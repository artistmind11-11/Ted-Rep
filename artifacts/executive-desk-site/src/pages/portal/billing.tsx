import { useState } from "react";
import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData, Invoice, InvoiceStatus } from "@/lib/portal-data";
import { Receipt, CheckCircle2, AlertTriangle, MessageSquare, ShieldOff } from "lucide-react";

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  Draft: "text-[#555555] bg-[#1A1A1A] border-[#2A2A2A]",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Approved: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Paid: "text-green-400 bg-green-400/10 border-green-400/20",
  Disputed: "text-red-400 bg-red-400/10 border-red-400/20",
};

function InvoiceCard({
  invoice,
  clientName,
  canDisputeApprove,
  canApproveAll,
}: {
  invoice: Invoice;
  clientName?: string;
  canDisputeApprove: boolean;
  canApproveAll: boolean;
}) {
  const { updateInvoiceStatus, addAuditEntry } = usePortalData();
  const { user } = usePortalAuth();
  const [disputeMode, setDisputeMode] = useState(false);
  const [disputeNote, setDisputeNote] = useState("");

  const handleApprove = () => {
    updateInvoiceStatus(invoice.id, "Approved");
    addAuditEntry({
      action: "Invoice Approved",
      user: user?.name ?? "User",
      timestamp: new Date().toLocaleString("en-AE"),
      detail: `Invoice #${invoice.id} approved — AED ${invoice.amount.toLocaleString()}`,
    });
  };

  const handleDispute = () => {
    if (!disputeNote.trim()) return;
    updateInvoiceStatus(invoice.id, "Disputed", disputeNote);
    addAuditEntry({
      action: "Invoice Disputed",
      user: user?.name ?? "User",
      timestamp: new Date().toLocaleString("en-AE"),
      detail: `Invoice #${invoice.id} disputed — ${disputeNote}`,
    });
    setDisputeMode(false);
    setDisputeNote("");
  };

  const handleMarkPaid = () => {
    updateInvoiceStatus(invoice.id, "Paid");
    addAuditEntry({
      action: "Invoice Paid",
      user: user?.name ?? "User",
      timestamp: new Date().toLocaleString("en-AE"),
      detail: `Invoice #${invoice.id} marked as Paid — AED ${invoice.amount.toLocaleString()}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#141414] border border-[#222222] rounded-sm hover:border-[#2A2A2A] transition-colors"
      data-testid={`invoice-card-${invoice.id}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#9B8B5F]/10 border border-[#9B8B5F]/20 flex items-center justify-center flex-shrink-0">
              <Receipt size={14} className="text-[#9B8B5F]" />
            </div>
            <div>
              <p className="text-[#F8F8F6] text-sm font-medium">{invoice.description}</p>
              {clientName && <p className="text-[#555555] text-xs mt-0.5">{clientName}</p>}
              <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-[#444444]">
                <span>Issued: {invoice.date}</span>
                <span>Due: {invoice.dueDate}</span>
                <span>Ref: {invoice.id.toUpperCase()}</span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[#F8F8F6] text-lg font-serif">
              {invoice.currency} {invoice.amount.toLocaleString()}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-sm border mt-1 inline-block ${STATUS_COLORS[invoice.status]}`}>
              {invoice.status}
            </span>
          </div>
        </div>

        {invoice.disputeNote && (
          <div className="mt-3 flex items-start gap-2 bg-red-400/5 border border-red-400/15 rounded-sm px-3 py-2">
            <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-xs">{invoice.disputeNote}</p>
          </div>
        )}

        {/* Client actions */}
        {canDisputeApprove && ["Pending", "Draft"].includes(invoice.status) && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-[#1F1F1F] pt-4">
            <button
              onClick={handleApprove}
              data-testid={`button-approve-${invoice.id}`}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-400/10 text-green-400 border border-green-400/20 rounded-sm hover:bg-green-400/20 transition-colors"
            >
              <CheckCircle2 size={13} /> Approve
            </button>
            <button
              onClick={() => setDisputeMode(!disputeMode)}
              data-testid={`button-dispute-${invoice.id}`}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded-sm hover:bg-red-400/20 transition-colors"
            >
              <MessageSquare size={13} /> Dispute
            </button>
          </div>
        )}

        {/* Admin actions */}
        {canApproveAll && invoice.status === "Approved" && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-[#1F1F1F] pt-4">
            <button
              onClick={handleMarkPaid}
              data-testid={`button-mark-paid-${invoice.id}`}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#9B8B5F]/10 text-[#9B8B5F] border border-[#9B8B5F]/20 rounded-sm hover:bg-[#9B8B5F]/20 transition-colors"
            >
              <CheckCircle2 size={13} /> Mark as Paid
            </button>
          </div>
        )}

        {disputeMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3"
          >
            <textarea
              value={disputeNote}
              onChange={(e) => setDisputeNote(e.target.value)}
              placeholder="Describe your dispute in detail…"
              data-testid="input-dispute-note"
              rows={3}
              className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-sm px-3 py-2 text-[#F8F8F6] text-sm placeholder-[#444444] focus:border-[#9B8B5F] focus:outline-none resize-none"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleDispute}
                className="text-xs px-4 py-1.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded-sm hover:bg-red-400/20 transition-colors"
              >
                Submit Dispute
              </button>
              <button
                onClick={() => setDisputeMode(false)}
                className="text-xs px-4 py-1.5 text-[#555555] hover:text-[#888888] transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function Billing() {
  const { user, can } = usePortalAuth();
  const { invoices, clients } = usePortalData();
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | "All">("All");

  if (!can("view_billing_own") && !can("view_billing_all")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555555] text-sm">You don't have permission to view billing information.</p>
      </div>
    );
  }

  const myInvoices = can("view_billing_all")
    ? invoices
    : invoices.filter((inv) => inv.clientId === user?.clientId);

  const filtered = filterStatus === "All" ? myInvoices : myInvoices.filter((inv) => inv.status === filterStatus);
  const totalPaid = myInvoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = myInvoices.filter((i) => ["Pending", "Draft"].includes(i.status)).reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-[#F8F8F6]">Billing</h1>
        <p className="text-[#555555] text-sm mt-0.5">
          {can("view_billing_all") ? "All client invoices" : "Your invoice history"}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {(["All", "Pending", "Paid", "Disputed"] as const).map((s) => {
          const count = s === "All" ? myInvoices.length : myInvoices.filter((i) => i.status === s).length;
          return (
            <div key={s} className="bg-[#141414] border border-[#222222] rounded-sm p-4">
              <p className="text-[#555555] text-xs mb-1">{s === "All" ? "Total Invoices" : s}</p>
              <p className="text-[#F8F8F6] text-xl font-serif">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#141414] border border-[#222222] rounded-sm p-4">
          <p className="text-[#555555] text-xs mb-1">Total Paid</p>
          <p className="text-green-400 text-xl font-serif">AED {totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-[#141414] border border-[#222222] rounded-sm p-4">
          <p className="text-[#555555] text-xs mb-1">Outstanding</p>
          <p className="text-amber-400 text-xl font-serif">AED {totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["All", "Draft", "Pending", "Approved", "Paid", "Disputed"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            data-testid={`filter-invoice-${s}`}
            className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
              filterStatus === s
                ? s === "All"
                  ? "bg-[#9B8B5F]/20 text-[#9B8B5F] border-[#9B8B5F]/40"
                  : STATUS_COLORS[s as InvoiceStatus]
                : "border-[#222222] text-[#555555] hover:border-[#333333]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#444444]">
            <Receipt size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No invoices found</p>
          </div>
        ) : (
          filtered.map((inv) => {
            const client = clients.find((c) => c.id === inv.clientId);
            return (
              <InvoiceCard
                key={inv.id}
                invoice={inv}
                clientName={can("view_billing_all") ? client?.company : undefined}
                canDisputeApprove={can("dispute_invoice")}
                canApproveAll={can("view_billing_all")}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
