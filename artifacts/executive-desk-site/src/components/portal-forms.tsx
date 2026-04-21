import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  usePortalData, TaskPriority, TaskStatus, LeadStage, InteractionKind, ServicePlan, ClientTier,
} from "@/lib/portal-data";
import { usePortalAuth } from "@/lib/portal-auth";

// ─── Shared Modal Shell ─────────────────────────────────────────────────────

export function Modal({ open, onClose, title, subtitle, children, width = "max-w-lg" }: {
  open: boolean; onClose: () => void; title: string; subtitle?: string; children: ReactNode; width?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
          onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }} onClick={(e) => e.stopPropagation()}
            className={`bg-[#141414] border border-[#222] rounded-sm w-full ${width} my-8`}
            data-testid="portal-modal">
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#1F1F1F]">
              <div>
                <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Form</p>
                <h3 className="font-serif text-xl text-[#F8F8F6]">{title}</h3>
                {subtitle && <p className="text-[#555] text-sm mt-1">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="text-[#555] hover:text-[#888] transition-colors p-1" data-testid="modal-close">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const INPUT = "w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-sm px-3 py-2 text-[#F8F8F6] text-sm placeholder-[#333] focus:border-[#9B8B5F] focus:outline-none";
const LABEL = "block text-[#9B8B5F] text-[10px] uppercase tracking-widest mb-1.5";
const FOOT  = "flex gap-3 pt-5 mt-5 border-t border-[#1F1F1F]";
const SUBMIT = "flex-1 py-2 text-sm bg-[#9B8B5F]/15 text-[#9B8B5F] border border-[#9B8B5F]/30 rounded-sm hover:bg-[#9B8B5F]/25 transition-colors";
const CANCEL = "px-4 py-2 text-sm text-[#555] hover:text-[#888] transition-colors";

// ─── Initialize Task ────────────────────────────────────────────────────────

export function InitializeTaskModal({ open, onClose, defaultClientId }: { open: boolean; onClose: () => void; defaultClientId?: string }) {
  const { user } = usePortalAuth();
  const { addTask, clients, team } = usePortalData();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState(defaultClientId ?? clients[0]?.id ?? "");
  const [assignedTo, setAssignedTo] = useState(user?.id ?? "u3");
  const [priority, setPriority] = useState<TaskPriority>("Standard");
  const [status, setStatus] = useState<TaskStatus>("Pending");
  const [category, setCategory] = useState("Governance");
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState(8);

  useEffect(() => { if (open) { setTitle(""); setDescription(""); setClientId(defaultClientId ?? clients[0]?.id ?? ""); setPriority("Standard"); setStatus("Pending"); setCategory("Governance"); setDueDate(""); setEstimatedHours(8); } }, [open, defaultClientId, clients]);

  const submit = () => {
    if (!title.trim() || !clientId || !user) return;
    addTask(user.name, { title, description, clientId, assignedTo, priority, status, category, dueDate, estimatedHours });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Initialize Task" subtitle="Codify a tactical directive — anchored to a client account.">
      <div className="space-y-4">
        <div><label className={LABEL}>Title</label><input className={INPUT} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Draft Q3 board pack outline" data-testid="task-title" /></div>
        <div><label className={LABEL}>Description</label><textarea className={INPUT + " resize-none"} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed brief for the directive…" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Client *</label>
            <select className={INPUT} value={clientId} onChange={(e) => setClientId(e.target.value)} data-testid="task-client">
              {clients.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.company}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Assigned To</label>
            <select className={INPUT} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
              {team.filter((m) => m.role !== "client").map((m) => <option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={LABEL}>Priority</label>
            <select className={INPUT} value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
              {(["Low", "Standard", "High", "Urgent"] as TaskPriority[]).map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Category</label>
            <select className={INPUT} value={category} onChange={(e) => setCategory(e.target.value)}>
              {["Governance", "Advisory", "Comms", "Docs", "Legal", "Compliance", "Coord", "Research", "Financial", "Admin"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Status</label>
            <select className={INPUT} value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
              <option>Pending</option><option>In Progress</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={LABEL}>Due Date</label><input type="date" className={INPUT} value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
          <div><label className={LABEL}>Estimated Hours</label><input type="number" min={0} step={0.5} className={INPUT} value={estimatedHours} onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 0)} /></div>
        </div>
        <div className={FOOT}>
          <button onClick={submit} className={SUBMIT} data-testid="submit-task">Initialize</button>
          <button onClick={onClose} className={CANCEL}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Add Lead ───────────────────────────────────────────────────────────────

export function AddLeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = usePortalAuth();
  const { addLead } = usePortalData();
  const [company, setCompany] = useState("");
  const [stakeholder, setStakeholder] = useState("");
  const [stakeholderRole, setStakeholderRole] = useState("");
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("Family Office");
  const [location, setLocation] = useState("UAE");
  const [stage, setStage] = useState<LeadStage>("Initial");
  const [value, setValue] = useState(60000);
  const [temperature, setTemperature] = useState<"hot" | "warm" | "cold">("warm");

  useEffect(() => { if (open) { setCompany(""); setStakeholder(""); setStakeholderRole(""); setEmail(""); setSector("Family Office"); setLocation("UAE"); setStage("Initial"); setValue(60000); setTemperature("warm"); } }, [open]);

  const submit = () => {
    if (!company.trim() || !stakeholder.trim() || !user) return;
    addLead(user.name, { company, stakeholder, stakeholderRole, email, sector, location, stage, value, temperature });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add CRM Lead" subtitle="Capture a new prospect for the new-business pipeline.">
      <div className="space-y-4">
        <div><label className={LABEL}>Company Name *</label><input className={INPUT} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Al-Fardan Ventures" data-testid="lead-company" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={LABEL}>Key Stakeholder *</label><input className={INPUT} value={stakeholder} onChange={(e) => setStakeholder(e.target.value)} placeholder="Hassan Al-Fardan" data-testid="lead-stakeholder" /></div>
          <div><label className={LABEL}>Role / Title</label><input className={INPUT} value={stakeholderRole} onChange={(e) => setStakeholderRole(e.target.value)} placeholder="Managing Director" /></div>
        </div>
        <div><label className={LABEL}>Email (optional)</label><input className={INPUT} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@company.ae" /></div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={LABEL}>Sector</label>
            <select className={INPUT} value={sector} onChange={(e) => setSector(e.target.value)}>
              {["Family Office", "Conglomerate", "Energy", "Real Estate", "Property Dev.", "Private Equity", "Sovereign Investments"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Location</label>
            <select className={INPUT} value={location} onChange={(e) => setLocation(e.target.value)}>
              {["UAE", "KSA", "Qatar", "Bahrain", "Kuwait", "Oman"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Temperature</label>
            <select className={INPUT} value={temperature} onChange={(e) => setTemperature(e.target.value as "hot" | "warm" | "cold")}>
              <option value="hot">Hot</option><option value="warm">Warm</option><option value="cold">Cold</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Stage</label>
            <select className={INPUT} value={stage} onChange={(e) => setStage(e.target.value as LeadStage)}>
              {(["Initial", "Discussion", "Proposal", "Referred", "Negotiation"] as LeadStage[]).map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div><label className={LABEL}>Est. Monthly Value (AED)</label><input type="number" min={0} step={5000} className={INPUT} value={value} onChange={(e) => setValue(parseInt(e.target.value) || 0)} data-testid="lead-value" /></div>
        </div>
        <div className={FOOT}>
          <button onClick={submit} className={SUBMIT} data-testid="submit-lead">Add Lead</button>
          <button onClick={onClose} className={CANCEL}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Log Interaction ────────────────────────────────────────────────────────

export function LogInteractionModal({ open, onClose, defaultLeadId }: { open: boolean; onClose: () => void; defaultLeadId?: string }) {
  const { user } = usePortalAuth();
  const { leads, addCRMActivity, updateLeadStage } = usePortalData();
  const [leadId, setLeadId] = useState(defaultLeadId ?? leads[0]?.id ?? "");
  const [kind, setKind] = useState<InteractionKind>("Call");
  const [activity, setActivity] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [stage, setStage] = useState<LeadStage | "">("");

  useEffect(() => {
    if (open) {
      setLeadId(defaultLeadId ?? leads[0]?.id ?? "");
      setKind("Call"); setActivity(""); setNextStep(""); setStage("");
    }
  }, [open, defaultLeadId, leads]);

  const submit = () => {
    if (!leadId || !activity.trim() || !user) return;
    addCRMActivity(user.name, { leadId, kind, activity, nextStep, stage: (stage || undefined) as LeadStage | undefined });
    if (stage) updateLeadStage(user.name, leadId, stage as LeadStage);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Log Interaction" subtitle="Document a touchpoint with a prospect.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Prospect *</label>
            <select className={INPUT} value={leadId} onChange={(e) => setLeadId(e.target.value)} data-testid="interaction-lead">
              {leads.map((l) => <option key={l.id} value={l.id}>{l.code} — {l.company}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Kind</label>
            <select className={INPUT} value={kind} onChange={(e) => setKind(e.target.value as InteractionKind)}>
              <option>Call</option><option>Meeting</option><option>Email</option><option>Note</option>
            </select>
          </div>
        </div>
        <div><label className={LABEL}>Activity *</label><textarea rows={3} className={INPUT + " resize-none"} value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="What was discussed or shared…" data-testid="interaction-activity" /></div>
        <div><label className={LABEL}>Next Step</label><input className={INPUT} value={nextStep} onChange={(e) => setNextStep(e.target.value)} placeholder="Follow-up call — 2 May" /></div>
        <div>
          <label className={LABEL}>Update Stage (optional)</label>
          <select className={INPUT} value={stage} onChange={(e) => setStage(e.target.value as LeadStage | "")}>
            <option value="">— Keep current —</option>
            {(["Initial", "Discussion", "Proposal", "Referred", "Negotiation", "Won", "Lost"] as LeadStage[]).map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className={FOOT}>
          <button onClick={submit} className={SUBMIT} data-testid="submit-interaction">Log Interaction</button>
          <button onClick={onClose} className={CANCEL}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Add Client (with CRM Pull) ─────────────────────────────────────────────

export function AddClientModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = usePortalAuth();
  const { leads, addClient, promoteLeadHint, updateLeadStage } = usePortalData();
  const activeLeads = leads.filter((l) => l.stage !== "Lost" && l.stage !== "Won");

  const [pullLeadId, setPullLeadId] = useState("");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("Family Office");
  const [country, setCountry] = useState("UAE");
  const [tier, setTier] = useState<ClientTier>("Tier I C-Suite");
  const [servicePlan, setServicePlan] = useState<ServicePlan>("Professional");
  const [hourlyRate, setHourlyRate] = useState(550);
  const [retainerPerMonth, setRetainerPerMonth] = useState(35000);
  const [retainerHours, setRetainerHours] = useState(60);
  const [commsProtocol, setCommsProtocol] = useState("Slack daily, weekly recap email");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setPullLeadId(""); setCompany(""); setName(""); setEmail(""); setSector("Family Office");
      setCountry("UAE"); setTier("Tier I C-Suite"); setServicePlan("Professional");
      setHourlyRate(550); setRetainerPerMonth(35000); setRetainerHours(60);
      setCommsProtocol("Slack daily, weekly recap email"); setNotes("");
    }
  }, [open]);

  const onPull = (id: string) => {
    setPullLeadId(id);
    if (!id) return;
    const hint = promoteLeadHint(id);
    if (hint) {
      setCompany(hint.company ?? ""); setName(hint.name ?? ""); setEmail(hint.email ?? "");
      setSector(hint.sector ?? "Family Office"); setCountry(hint.country ?? "UAE");
      setHourlyRate(hint.hourlyRate ?? 550); setRetainerPerMonth(hint.retainerPerMonth ?? 35000);
      setRetainerHours(hint.retainerHours ?? 60);
    }
  };

  const submit = () => {
    if (!company.trim() || !name.trim() || !user) return;
    addClient(user.name, {
      company, name, email, sector, country, tier, servicePlan,
      hourlyRate, currency: "AED", retainerPerMonth, retainerHours,
      commsProtocol, notes, assignedTeam: [user.id],
    });
    if (pullLeadId) updateLeadStage(user.name, pullLeadId, "Won");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Client" subtitle="Promote a prospect or onboard a new institutional partner." width="max-w-2xl">
      <div className="space-y-4">
        {activeLeads.length > 0 && (
          <div className="p-3 bg-[#9B8B5F]/5 border border-[#9B8B5F]/15 rounded-sm">
            <label className={LABEL}>Pull from Active CRM Lead</label>
            <select className={INPUT} value={pullLeadId} onChange={(e) => onPull(e.target.value)} data-testid="client-pull">
              <option value="">— Manual entry —</option>
              {activeLeads.map((l) => <option key={l.id} value={l.id}>{l.code} — {l.company} ({l.stage})</option>)}
            </select>
            {pullLeadId && <p className="text-[10px] text-[#9B8B5F] mt-2">↳ Form pre-filled. Lead will be marked "Won" on save.</p>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div><label className={LABEL}>Company *</label><input className={INPUT} value={company} onChange={(e) => setCompany(e.target.value)} data-testid="client-company" /></div>
          <div><label className={LABEL}>Principal Contact *</label><input className={INPUT} value={name} onChange={(e) => setName(e.target.value)} data-testid="client-name" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={LABEL}>Email</label><input className={INPUT} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div>
            <label className={LABEL}>Country</label>
            <select className={INPUT} value={country} onChange={(e) => setCountry(e.target.value)}>
              {["UAE", "KSA", "Qatar", "Bahrain", "Kuwait", "Oman"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={LABEL}>Sector</label>
            <select className={INPUT} value={sector} onChange={(e) => setSector(e.target.value)}>
              {["Family Office", "Conglomerate", "Energy", "Real Estate", "Private Equity", "Sovereign Investments"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Tier</label>
            <select className={INPUT} value={tier} onChange={(e) => setTier(e.target.value as ClientTier)}>
              <option>Tier I C-Suite</option><option>Tier II Founder</option><option>Tier III Family Office</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>Service Plan</label>
            <select className={INPUT} value={servicePlan} onChange={(e) => setServicePlan(e.target.value as ServicePlan)}>
              <option>Professional</option><option>Enterprise</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={LABEL}>Hourly Rate (AED)</label><input type="number" className={INPUT} value={hourlyRate} onChange={(e) => setHourlyRate(parseInt(e.target.value) || 0)} /></div>
          <div><label className={LABEL}>Retainer / mo (AED)</label><input type="number" className={INPUT} value={retainerPerMonth} onChange={(e) => setRetainerPerMonth(parseInt(e.target.value) || 0)} /></div>
          <div><label className={LABEL}>Retainer Hours</label><input type="number" className={INPUT} value={retainerHours} onChange={(e) => setRetainerHours(parseInt(e.target.value) || 0)} /></div>
        </div>
        <div><label className={LABEL}>Comms Protocol</label><input className={INPUT} value={commsProtocol} onChange={(e) => setCommsProtocol(e.target.value)} placeholder="Slack daily, WhatsApp urgent only" /></div>
        <div><label className={LABEL}>Strategic Notes</label><textarea rows={2} className={INPUT + " resize-none"} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Institutional knowledge, preferences, sensitivities…" /></div>

        <div className={FOOT}>
          <button onClick={submit} className={SUBMIT} data-testid="submit-client">Onboard Client</button>
          <button onClick={onClose} className={CANCEL}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Log Time Entry ─────────────────────────────────────────────────────────

export function LogTimeEntryModal({ open, onClose, defaultClientId, defaultTaskId }: { open: boolean; onClose: () => void; defaultClientId?: string; defaultTaskId?: string }) {
  const { user } = usePortalAuth();
  const { clients, tasks, addTimeEntry } = usePortalData();
  const [clientId, setClientId] = useState(defaultClientId ?? clients[0]?.id ?? "");
  const [taskId, setTaskId] = useState(defaultTaskId ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [project, setProject] = useState("Governance");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(1.0);
  const [billable, setBillable] = useState(true);

  useEffect(() => {
    if (open) {
      setClientId(defaultClientId ?? clients[0]?.id ?? "");
      setTaskId(defaultTaskId ?? "");
      setDate(new Date().toISOString().slice(0, 10));
      setProject("Governance"); setDescription(""); setHours(1.0); setBillable(true);
    }
  }, [open, defaultClientId, defaultTaskId, clients]);

  const client = clients.find((c) => c.id === clientId);
  const value = client && billable ? Math.round(client.hourlyRate * hours) : 0;
  const clientTasks = tasks.filter((t) => t.clientId === clientId && t.status !== "Completed");

  const submit = () => {
    if (!clientId || !description.trim() || !user) return;
    addTimeEntry(user.name, { clientId, taskId: taskId || undefined, date, project, description, hours, billable, status: "Submitted", loggedBy: user.id });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Log Time Entry" subtitle="Record billable or non-billable time against a client and optional task.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Client *</label>
            <select className={INPUT} value={clientId} onChange={(e) => { setClientId(e.target.value); setTaskId(""); }} data-testid="time-client">
              {clients.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.company}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Linked Task (optional)</label>
            <select className={INPUT} value={taskId} onChange={(e) => setTaskId(e.target.value)}>
              <option value="">— None —</option>
              {clientTasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={LABEL}>Date</label><input type="date" className={INPUT} value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div>
            <label className={LABEL}>Stream</label>
            <select className={INPUT} value={project} onChange={(e) => setProject(e.target.value)}>
              {["Governance", "Advisory", "Comms", "Docs", "Research", "Coord", "Other"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div><label className={LABEL}>Hours *</label><input type="number" min={0.25} step={0.25} className={INPUT} value={hours} onChange={(e) => setHours(parseFloat(e.target.value) || 0)} data-testid="time-hours" /></div>
        </div>
        <div><label className={LABEL}>Description *</label><textarea rows={2} className={INPUT + " resize-none"} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was performed during this period…" data-testid="time-description" /></div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input type="checkbox" checked={billable} onChange={(e) => setBillable(e.target.checked)} className="accent-[#9B8B5F]" />
          <span className="text-[#888] text-sm">Billable to client</span>
        </label>

        {client && (
          <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-sm p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[#9B8B5F] uppercase tracking-widest mb-1">Computed Value</p>
              <p className="text-[#444] text-xs">{client.hourlyRate} {client.currency}/h × {hours}h</p>
            </div>
            <p className="font-serif text-xl text-[#F8F8F6]">
              {billable ? `${client.currency} ${value.toLocaleString()}` : <span className="text-[#444] text-sm">Non-billable</span>}
            </p>
          </div>
        )}

        <div className={FOOT}>
          <button onClick={submit} className={SUBMIT} data-testid="submit-time">Submit Entry</button>
          <button onClick={onClose} className={CANCEL}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Generate Invoice ───────────────────────────────────────────────────────

export function GenerateInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = usePortalAuth();
  const { clients, timeEntries, generateInvoiceFromTime } = usePortalData();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [period, setPeriod] = useState(`${new Date().toLocaleString("en-GB", { month: "long", year: "numeric" })}`);
  const [description, setDescription] = useState("Monthly Retainer + Coordination Services");

  useEffect(() => { if (open) { setClientId(clients[0]?.id ?? ""); setPeriod(`${new Date().toLocaleString("en-GB", { month: "long", year: "numeric" })}`); setDescription("Monthly Retainer + Coordination Services"); } }, [open, clients]);

  const eligibleEntries = timeEntries.filter((te) => te.clientId === clientId && te.status === "Approved" && te.billable);
  const eligibleHours = eligibleEntries.reduce((s, te) => s + te.hours, 0);
  const eligibleAmount = eligibleEntries.reduce((s, te) => s + te.value, 0);
  const client = clients.find((c) => c.id === clientId);

  const submit = () => {
    if (!clientId || !user) return;
    const inv = generateInvoiceFromTime(user.name, clientId, period, description);
    if (inv) onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Generate Invoice" subtitle="Aggregate all approved billable time for a client into a draft invoice.">
      <div className="space-y-4">
        <div>
          <label className={LABEL}>Client *</label>
          <select className={INPUT} value={clientId} onChange={(e) => setClientId(e.target.value)} data-testid="invoice-client">
            {clients.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.company}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={LABEL}>Period</label><input className={INPUT} value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="April 2025" /></div>
          <div><label className={LABEL}>Description</label><input className={INPUT} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        </div>

        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-sm p-4">
          <p className="text-[10px] text-[#9B8B5F] uppercase tracking-widest mb-3">Aggregation Preview</p>
          {client && eligibleEntries.length > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs"><span className="text-[#555]">Approved billable entries</span><span className="text-[#F8F8F6]">{eligibleEntries.length}</span></div>
              <div className="flex justify-between text-xs"><span className="text-[#555]">Total hours</span><span className="text-[#F8F8F6] font-mono">{eligibleHours.toFixed(2)}h</span></div>
              <div className="flex justify-between text-xs"><span className="text-[#555]">Hourly rate</span><span className="text-[#F8F8F6] font-mono">{client.currency} {client.hourlyRate}/h</span></div>
              <div className="flex justify-between pt-2 border-t border-[#1F1F1F] mt-2"><span className="text-[#9B8B5F] text-xs uppercase tracking-widest">Invoice Total</span><span className="font-serif text-xl text-[#F8F8F6]">{client.currency} {eligibleAmount.toLocaleString()}</span></div>
            </div>
          ) : (
            <p className="text-[#444] text-xs">No approved billable time available for this client. Submit and approve time entries first.</p>
          )}
        </div>

        <div className={FOOT}>
          <button onClick={submit} disabled={eligibleEntries.length === 0} className={`${SUBMIT} disabled:opacity-30 disabled:cursor-not-allowed`} data-testid="submit-invoice">Generate Draft</button>
          <button onClick={onClose} className={CANCEL}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Reusable Toolbar Button ────────────────────────────────────────────────

export function ToolbarButton({ onClick, icon: Icon, label, dataTestid }: { onClick: () => void; icon: React.ComponentType<{size?:number; className?:string}>; label: string; dataTestid?: string }) {
  return (
    <button onClick={onClick} data-testid={dataTestid}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-widest bg-[#9B8B5F]/10 text-[#9B8B5F] border border-[#9B8B5F]/30 rounded-sm hover:bg-[#9B8B5F]/20 transition-colors">
      <Icon size={12} />
      {label}
    </button>
  );
}
