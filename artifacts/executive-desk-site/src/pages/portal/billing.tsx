import { useState } from "react";
import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData, InvoiceStatus } from "@/lib/portal-data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import { CheckCircle2, MessageSquare, Download, Eye, ShieldOff, Plus } from "lucide-react";
import { MONTHLY_DATA } from "@/lib/portal-data";
import { GenerateInvoiceModal, ToolbarButton } from "@/components/portal-forms";

const RETAINER = 160;
const HOURS_USED = 124;
const GOLD = "#9B8B5F";

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  Draft: "text-[#555] bg-[#1A1A1A] border-[#2A2A2A]",
  Upcoming: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Paid: "text-green-400 bg-green-400/10 border-green-400/20",
  Overdue: "text-red-400 bg-red-400/10 border-red-400/20",
  Disputed: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-sm px-3 py-2 text-xs">
      <p className="text-[#9B8B5F] mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-[#F8F8F6]">AED {p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function Billing() {
  const { user, can } = usePortalAuth();
  const { invoices, clients, updateInvoiceStatus } = usePortalData();
  const [disputeId, setDisputeId] = useState<string | null>(null);
  const [disputeNote, setDisputeNote] = useState("");
  const [showGenerate, setShowGenerate] = useState(false);

  if (!can("view_billing_own") && !can("view_billing_all")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555] text-sm">Billing access is not available for your role.</p>
      </div>
    );
  }

  const myInvoices = can("view_billing_all") ? invoices : invoices.filter((i) => i.clientId === user?.clientId);
  const totalPaid = myInvoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalUpcoming = myInvoices.filter((i) => i.status === "Upcoming").reduce((s, i) => s + i.amount, 0);

  const donutData = [
    { name: "Used", value: HOURS_USED, fill: "rgba(155,139,95,0.78)" },
    { name: "Remaining", value: RETAINER - HOURS_USED, fill: "rgba(255,255,255,0.04)" },
  ];

  const revenueData = MONTHLY_DATA.map((d) => ({ ...d, label: d.month === "May" ? `${d.month}*` : d.month }));

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Financial Suite</p>
          <h1 className="font-serif text-2xl text-[#F8F8F6]">Billing & Invoicing</h1>
        </div>
        {can("view_billing_all") && (
          <ToolbarButton onClick={() => setShowGenerate(true)} icon={Plus} label="Generate Invoice" dataTestid="open-generate-invoice" />
        )}
      </div>
      <GenerateInvoiceModal open={showGenerate} onClose={() => setShowGenerate(false)} />

      {can("view_billing_all") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Retainer Utilisation Donut */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#141414] border border-[#222] rounded-sm p-5">
            <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Retainer Utilisation</p>
            <p className="text-[#F8F8F6] font-serif text-lg mb-4">April 2025</p>
            <div className="flex items-center gap-6">
              <div className="relative flex-shrink-0">
                <PieChart width={120} height={120}>
                  <Pie data={donutData} dataKey="value" cx="50%" cy="50%" innerRadius="74%" outerRadius="90%" paddingAngle={1}>
                    {donutData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="font-serif text-xl text-[#F8F8F6]">{Math.round((HOURS_USED / RETAINER) * 100)}%</p>
                  <p className="text-[#444] text-[9px]">Used</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div><p className="text-[#444]">Hours Used</p><p className="text-[#F8F8F6]">{HOURS_USED}h</p></div>
                <div><p className="text-[#444]">Hours Remaining</p><p className="text-[#F8F8F6]">{RETAINER - HOURS_USED}h</p></div>
                <div><p className="text-[#444]">Overage Rate</p><p className="text-[#9B8B5F]">AED 550/h</p></div>
                <div><p className="text-[#444]">Cycle End</p><p className="text-[#F8F8F6]">30 Apr 2025</p></div>
              </div>
            </div>
          </motion.div>

          {/* Revenue Trend */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-[#141414] border border-[#222] rounded-sm p-5">
            <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Revenue Trend</p>
            <p className="text-[#F8F8F6] font-serif text-lg mb-5">Retainer + Overage — Jan to May</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={revenueData} barCategoryGap="30%">
                <XAxis dataKey="label" tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `AED ${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(155,139,95,0.04)" }} />
                <Bar dataKey="retainer" stackId="a" fill="rgba(155,139,95,0.28)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="overage" stackId="a" fill="rgba(155,139,95,0.72)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Summary figures */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Invoices", value: myInvoices.length, color: "text-[#F8F8F6]" },
          { label: "Paid", value: myInvoices.filter((i) => i.status === "Paid").length, color: "text-green-400" },
          { label: "Total Paid", value: `AED ${(totalPaid / 1000).toFixed(0)}K`, color: "text-green-400" },
          { label: "Outstanding", value: `AED ${(totalUpcoming / 1000).toFixed(0)}K`, color: "text-amber-400" },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-[#141414] border border-[#222] rounded-sm p-5 group hover:border-[#9B8B5F]/20 transition-colors relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9B8B5F]/0 to-transparent group-hover:via-[#9B8B5F]/30 transition-all duration-500" />
            <p className="text-[#555] text-xs uppercase tracking-widest mb-3">{label}</p>
            <p className={`font-serif text-2xl ${color}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Invoice Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-[#141414] border border-[#222] rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1F1F1F]">
          <p className="font-serif text-[#F8F8F6] text-lg">Invoice Register</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Invoice #", "Period", "Description", "Amount", "Status", "Action"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[#444] text-xs uppercase tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myInvoices.map((inv) => {
                const client = clients.find((c) => c.id === inv.clientId);
                return (
                  <tr key={inv.id} className="border-b border-[#1A1A1A] hover:bg-[rgba(255,255,255,0.01)] transition-colors" data-testid={`invoice-${inv.id}`}>
                    <td className="px-5 py-3.5 text-[#9B8B5F] text-xs font-mono">{inv.id.toUpperCase()}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-[#F8F8F6] text-sm">{inv.period}</p>
                      {can("view_billing_all") && client && <p className="text-[#444] text-xs">{client.company}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-[#666] text-sm max-w-[220px]">
                      <p className="truncate">{inv.description}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[#F8F8F6] font-mono text-sm">AED {inv.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-sm border ${STATUS_STYLE[inv.status]}`}>{inv.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {inv.status === "Upcoming" && (
                          <button className="text-[#9B8B5F] text-xs hover:text-[#B8A870] transition-colors flex items-center gap-1">
                            <Eye size={12} /> Preview
                          </button>
                        )}
                        {inv.status === "Paid" && (
                          <button className="text-[#9B8B5F] text-xs hover:text-[#B8A870] transition-colors flex items-center gap-1">
                            <Download size={12} /> Download
                          </button>
                        )}
                        {can("dispute_invoice") && ["Upcoming", "Draft"].includes(inv.status) && (
                          <>
                            <button onClick={() => updateInvoiceStatus(user?.name ?? "Client", inv.id, "Paid")}
                              data-testid={`button-approve-invoice-${inv.id}`}
                              className="text-green-400 text-xs hover:text-green-300 transition-colors flex items-center gap-1">
                              <CheckCircle2 size={12} /> Approve
                            </button>
                            <button onClick={() => setDisputeId(inv.id)}
                              data-testid={`button-dispute-invoice-${inv.id}`}
                              className="text-red-400 text-xs hover:text-red-300 transition-colors flex items-center gap-1">
                              <MessageSquare size={12} /> Dispute
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Dispute modal */}
      {disputeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141414] border border-[#222] rounded-sm p-6 w-full max-w-md">
            <p className="font-serif text-[#F8F8F6] text-lg mb-1">Dispute Invoice</p>
            <p className="text-[#555] text-sm mb-4">Provide details about your dispute for review by our team.</p>
            <textarea value={disputeNote} onChange={(e) => setDisputeNote(e.target.value)}
              placeholder="Describe your dispute…" rows={4}
              className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-sm px-3 py-2 text-[#F8F8F6] text-sm placeholder-[#333] focus:border-[#9B8B5F] focus:outline-none resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { updateInvoiceStatus(user?.name ?? "Client", disputeId, "Disputed", disputeNote); setDisputeId(null); setDisputeNote(""); }}
                className="flex-1 py-2 text-sm bg-red-400/10 text-red-400 border border-red-400/20 rounded-sm hover:bg-red-400/20 transition-colors">
                Submit Dispute
              </button>
              <button onClick={() => setDisputeId(null)}
                className="px-4 py-2 text-sm text-[#555] hover:text-[#888] transition-colors">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
