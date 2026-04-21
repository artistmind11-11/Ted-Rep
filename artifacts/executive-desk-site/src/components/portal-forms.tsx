import { useState, useEffect, useMemo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  usePortalData, TaskPriority, TaskStatus, LeadStage, InteractionKind, ServicePlan, ClientTier,
  ApprovalType, Invoice,
} from "@/lib/portal-data";
import { usePortalAuth, UserRole } from "@/lib/portal-auth";

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
  const { leads, addClient, promoteLeadHint } = usePortalData();
  const wonLeads = leads.filter((l) => l.stage === "Won");

  const COMMS_CHANNELS = ["WhatsApp", "Email", "Phone Call", "Slack", "In-Person", "Other"];
  const COMMS_FREQUENCIES = ["Daily", "Weekly", "Bi-Weekly", "Monthly", "As Needed"];

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
  const [commsChannel, setCommsChannel] = useState("WhatsApp");
  const [commsChannelOther, setCommsChannelOther] = useState("");
  const [commsFrequency, setCommsFrequency] = useState("Weekly");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setPullLeadId(""); setCompany(""); setName(""); setEmail(""); setSector("Family Office");
      setCountry("UAE"); setTier("Tier I C-Suite"); setServicePlan("Professional");
      setHourlyRate(550); setRetainerPerMonth(35000); setRetainerHours(60);
      setCommsChannel("WhatsApp"); setCommsChannelOther(""); setCommsFrequency("Weekly"); setNotes("");
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
    const channelLabel = commsChannel === "Other" && commsChannelOther.trim() ? commsChannelOther.trim() : commsChannel;
    addClient(user.name, {
      company, name, email, sector, country, tier, servicePlan,
      hourlyRate, currency: "AED", retainerPerMonth, retainerHours,
      commsProtocol: `${channelLabel} — ${commsFrequency}`,
      commsChannel: channelLabel, commsFrequency,
      notes, assignedTeam: [user.id],
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Client" subtitle="Promote a Won prospect or onboard a new institutional partner." width="max-w-2xl">
      <div className="space-y-4">
        <div className="p-3 bg-[#9B8B5F]/5 border border-[#9B8B5F]/15 rounded-sm">
          <label className={LABEL}>Pull from Won CRM Lead</label>
          {wonLeads.length > 0 ? (
            <>
              <select className={INPUT} value={pullLeadId} onChange={(e) => onPull(e.target.value)} data-testid="client-pull">
                <option value="">— Manual entry —</option>
                {wonLeads.map((l) => <option key={l.id} value={l.id}>{l.code} — {l.company}</option>)}
              </select>
              {pullLeadId && <p className="text-[10px] text-[#9B8B5F] mt-2">↳ Form pre-filled from Won lead.</p>}
            </>
          ) : (
            <p className="text-[#555] text-xs">No Won leads available. Move a CRM lead to "Won" stage first to enable promotion.</p>
          )}
        </div>

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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Comms Channel</label>
            <select className={INPUT} value={commsChannel} onChange={(e) => setCommsChannel(e.target.value)} data-testid="client-comms-channel">
              {COMMS_CHANNELS.map((c) => <option key={c}>{c}</option>)}
            </select>
            {commsChannel === "Other" && (
              <input className={INPUT + " mt-2"} value={commsChannelOther} onChange={(e) => setCommsChannelOther(e.target.value)} placeholder="Specify channel…" data-testid="client-comms-other" />
            )}
          </div>
          <div>
            <label className={LABEL}>Comms Frequency</label>
            <select className={INPUT} value={commsFrequency} onChange={(e) => setCommsFrequency(e.target.value)} data-testid="client-comms-frequency">
              {COMMS_FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>
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
  const clientTasks = useMemo(() => tasks.filter((t) => t.clientId === clientId), [tasks, clientId]);

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
            <label className={LABEL}>Type</label>
            <select className={INPUT} value={project} onChange={(e) => setProject(e.target.value)} data-testid="time-type">
              {["Governance", "Advisory", "Comms", "Docs", "Research", "Coord", "Legal", "Compliance", "Financial", "Admin", "Other"].map((p) => <option key={p}>{p}</option>)}
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

// ─── Request Approval (Associate / Counsel) ────────────────────────────────

export function RequestApprovalModal({ open, onClose, defaultLinkedTaskId, defaultLinkedClientId, defaultLinkedTimeEntryId, defaultLinkedInvoiceId, defaultRequestedAction }: {
  open: boolean; onClose: () => void;
  defaultLinkedTaskId?: string; defaultLinkedClientId?: string; defaultLinkedTimeEntryId?: string; defaultLinkedInvoiceId?: string;
  defaultRequestedAction?: "delete_invoice" | "general";
}) {
  const { user } = usePortalAuth();
  const { addApproval, clients, tasks, timeEntries, invoices } = usePortalData();
  const [type, setType] = useState<ApprovalType>("Governance");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [linkedClientId, setLinkedClientId] = useState(defaultLinkedClientId ?? "");
  const [linkedTaskId, setLinkedTaskId] = useState(defaultLinkedTaskId ?? "");
  const [linkedTimeEntryId, setLinkedTimeEntryId] = useState(defaultLinkedTimeEntryId ?? "");
  const [linkedInvoiceId, setLinkedInvoiceId] = useState(defaultLinkedInvoiceId ?? "");

  useEffect(() => {
    if (open) {
      setType(defaultRequestedAction === "delete_invoice" ? "Financial" : "Governance");
      setTitle(defaultRequestedAction === "delete_invoice" && defaultLinkedInvoiceId
        ? `Delete invoice ${defaultLinkedInvoiceId.toUpperCase()}` : "");
      setSubtitle("");
      setLinkedClientId(defaultLinkedClientId ?? "");
      setLinkedTaskId(defaultLinkedTaskId ?? "");
      setLinkedTimeEntryId(defaultLinkedTimeEntryId ?? "");
      setLinkedInvoiceId(defaultLinkedInvoiceId ?? "");
    }
  }, [open, defaultLinkedTaskId, defaultLinkedClientId, defaultLinkedTimeEntryId, defaultLinkedInvoiceId, defaultRequestedAction]);

  const submit = () => {
    if (!title.trim() || !user) return;
    addApproval(user.name, {
      type, title: title.trim(), subtitle: subtitle.trim() || `Requested by ${user.name}`,
      requestedBy: user.name, linkedClientId: linkedClientId || undefined,
      linkedTaskId: linkedTaskId || undefined, linkedTimeEntryId: linkedTimeEntryId || undefined,
      linkedInvoiceId: linkedInvoiceId || undefined,
      requestedAction: defaultRequestedAction ?? "general",
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Request Approval" subtitle="Escalate an action to Counsel or Principal for sign-off." width="max-w-xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Approval Type</label>
            <select className={INPUT} value={type} onChange={(e) => setType(e.target.value as ApprovalType)} disabled={defaultRequestedAction === "delete_invoice"}>
              <option>Governance</option><option>Financial</option><option>Legal</option><option>Document</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>Linked Client (optional)</label>
            <select className={INPUT} value={linkedClientId} onChange={(e) => setLinkedClientId(e.target.value)}>
              <option value="">— None —</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.company}</option>)}
            </select>
          </div>
        </div>
        <div><label className={LABEL}>Title *</label><input className={INPUT} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Authorize budget overage on Project X" data-testid="approval-title" /></div>
        <div><label className={LABEL}>Justification</label><textarea rows={3} className={INPUT + " resize-none"} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Reason and context for the request…" /></div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={LABEL}>Linked Task</label>
            <select className={INPUT} value={linkedTaskId} onChange={(e) => setLinkedTaskId(e.target.value)}>
              <option value="">— None —</option>
              {tasks.filter((t) => !linkedClientId || t.clientId === linkedClientId).map((t) => <option key={t.id} value={t.id}>{t.title.slice(0, 30)}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Linked Time Entry</label>
            <select className={INPUT} value={linkedTimeEntryId} onChange={(e) => setLinkedTimeEntryId(e.target.value)}>
              <option value="">— None —</option>
              {timeEntries.filter((te) => !linkedClientId || te.clientId === linkedClientId).slice(0, 30).map((te) => <option key={te.id} value={te.id}>{te.date} — {te.hours}h — {te.project}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Linked Invoice</label>
            <select className={INPUT} value={linkedInvoiceId} onChange={(e) => setLinkedInvoiceId(e.target.value)} disabled={defaultRequestedAction === "delete_invoice"}>
              <option value="">— None —</option>
              {invoices.map((inv) => <option key={inv.id} value={inv.id}>{inv.id.toUpperCase()} — {inv.currency} {inv.amount.toLocaleString()}</option>)}
            </select>
          </div>
        </div>
        <div className={FOOT}>
          <button onClick={submit} className={SUBMIT} data-testid="submit-approval">Submit Request</button>
          <button onClick={onClose} className={CANCEL}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Edit Invoice ───────────────────────────────────────────────────────────

export function EditInvoiceModal({ open, onClose, invoice }: { open: boolean; onClose: () => void; invoice: Invoice | null }) {
  const { user } = usePortalAuth();
  const { editInvoice } = usePortalData();
  const [amount, setAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [description, setDescription] = useState("");
  const [period, setPeriod] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (open && invoice) {
      setAmount(invoice.amount); setDiscount(invoice.discount ?? 0);
      setDescription(invoice.description); setPeriod(invoice.period); setDueDate(invoice.dueDate);
    }
  }, [open, invoice]);

  const net = Math.max(0, amount - discount);

  const submit = () => {
    if (!invoice || !user) return;
    editInvoice(user.name, invoice.id, { amount, discount, description, period, dueDate });
    onClose();
  };

  if (!invoice) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Edit Invoice ${invoice.id.toUpperCase()}`} subtitle="Adjust amount, discount, or descriptive fields.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className={LABEL}>Period</label><input className={INPUT} value={period} onChange={(e) => setPeriod(e.target.value)} /></div>
          <div><label className={LABEL}>Due Date</label><input type="date" className={INPUT} value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
        </div>
        <div><label className={LABEL}>Description</label><input className={INPUT} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={LABEL}>Gross Amount ({invoice.currency})</label><input type="number" className={INPUT} value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} data-testid="edit-invoice-amount" /></div>
          <div><label className={LABEL}>Discount ({invoice.currency})</label><input type="number" className={INPUT} value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} data-testid="edit-invoice-discount" /></div>
        </div>
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-sm p-3 flex items-center justify-between">
          <span className="text-[10px] text-[#9B8B5F] uppercase tracking-widest">Net Total</span>
          <span className="font-serif text-xl text-[#F8F8F6]">{invoice.currency} {net.toLocaleString()}</span>
        </div>
        <div className={FOOT}>
          <button onClick={submit} className={SUBMIT} data-testid="submit-edit-invoice">Save Changes</button>
          <button onClick={onClose} className={CANCEL}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Add Team Member ────────────────────────────────────────────────────────

export function AddTeamMemberModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = usePortalAuth();
  const { clients, addTeamMember } = usePortalData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("associate");
  const [assignedClients, setAssignedClients] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setName(""); setEmail(""); setRole("associate"); setAssignedClients([]);
    }
  }, [open]);

  const toggleClient = (id: string) =>
    setAssignedClients((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const submit = () => {
    if (!name.trim() || !email.trim() || !user) return;
    addTeamMember(user.name, { name: name.trim(), email: email.trim(), role, assignedClients });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Team Member" subtitle="Provision portal access and assign client coverage." width="max-w-xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className={LABEL}>Full Name *</label><input className={INPUT} value={name} onChange={(e) => setName(e.target.value)} placeholder="Sarah El-Khoury" data-testid="member-name" /></div>
          <div><label className={LABEL}>Email *</label><input className={INPUT} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sarah@executivedesk.ae" data-testid="member-email" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Role</label>
            <select className={INPUT} value={role} onChange={(e) => setRole(e.target.value as UserRole)} data-testid="member-role">
              <option value="counsel">Counsel</option>
              <option value="associate">Associate</option>
            </select>
          </div>
        </div>
        <div>
          <label className={LABEL}>Assign Clients ({assignedClients.length} selected)</label>
          <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-sm p-3 max-h-40 overflow-y-auto space-y-1.5">
            {clients.length === 0 && <p className="text-[#444] text-xs">No clients yet.</p>}
            {clients.map((c) => (
              <label key={c.id} className="flex items-center gap-2.5 cursor-pointer text-sm hover:bg-[#141414] px-2 py-1 rounded-sm">
                <input type="checkbox" checked={assignedClients.includes(c.id)} onChange={() => toggleClient(c.id)} className="accent-[#9B8B5F]" />
                <span className="text-[#9B8B5F] font-mono text-xs w-12">{c.code}</span>
                <span className="text-[#F8F8F6]">{c.company}</span>
              </label>
            ))}
          </div>
        </div>
        <div className={FOOT}>
          <button onClick={submit} className={SUBMIT} data-testid="submit-member">Provision Access</button>
          <button onClick={onClose} className={CANCEL}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Resolve Time Dispute ───────────────────────────────────────────────────

export function ResolveDisputeModal({ open, onClose, entryId, currentReason }: { open: boolean; onClose: () => void; entryId: string | null; currentReason?: string }) {
  const { user } = usePortalAuth();
  const { updateTimeStatus } = usePortalData();
  const [resolution, setResolution] = useState("");
  const [outcome, setOutcome] = useState<"Approved" | "Submitted">("Approved");

  useEffect(() => { if (open) { setResolution(""); setOutcome("Approved"); } }, [open]);

  const submit = () => {
    if (!entryId || !resolution.trim() || !user) return;
    updateTimeStatus(user.name, entryId, outcome, undefined, resolution.trim());
    onClose();
  };

  if (!entryId) return null;

  return (
    <Modal open={open} onClose={onClose} title="Resolve Dispute" subtitle="Adjudicate a disputed time entry with a documented resolution.">
      <div className="space-y-4">
        {currentReason && (
          <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-sm">
            <p className="text-[10px] text-rose-300 uppercase tracking-widest mb-1">Original Dispute</p>
            <p className="text-sm text-[#F8F8F6]">{currentReason}</p>
          </div>
        )}
        <div>
          <label className={LABEL}>Resolution Outcome</label>
          <select className={INPUT} value={outcome} onChange={(e) => setOutcome(e.target.value as "Approved" | "Submitted")} data-testid="resolve-outcome">
            <option value="Approved">Approve entry (uphold)</option>
            <option value="Submitted">Return to Submitted (re-review)</option>
          </select>
        </div>
        <div><label className={LABEL}>Resolution Note *</label><textarea rows={3} className={INPUT + " resize-none"} value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="Document the basis for resolution…" data-testid="resolve-note" /></div>
        <div className={FOOT}>
          <button onClick={submit} className={SUBMIT} data-testid="submit-resolve">Mark Resolved</button>
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
