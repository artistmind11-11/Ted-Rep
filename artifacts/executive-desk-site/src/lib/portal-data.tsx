import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Disputed";
export type TaskPriority = "Low" | "Standard" | "High" | "Urgent";
export type InvoiceStatus = "Draft" | "Upcoming" | "Paid" | "Overdue" | "Disputed";
export type TimeStatus = "Submitted" | "Approved" | "Disputed" | "Invoiced" | "Paid";
export type LeadStage = "Initial" | "Proposal" | "Discussion" | "Referred" | "Negotiation" | "Won" | "Lost";
export type ApprovalType = "Legal" | "Financial" | "Document" | "Governance";
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";
export type ClientTier = "Tier I C-Suite" | "Tier II Founder" | "Tier III Family Office";
export type InteractionKind = "Call" | "Meeting" | "Email" | "Note";
export type ServicePlan = "Professional" | "Enterprise";

export interface TimeEntry {
  id: string;
  date: string;
  project: string;
  description: string;
  hours: number;
  status: TimeStatus;
  clientId: string;
  taskId?: string;
  loggedBy: string;
  billable: boolean;
  rate: number;
  currency: string;
  value: number;
  disputeReason?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: TaskStatus;
  priority: TaskPriority;
  clientId: string;
  assignedTo: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  disputeReason?: string;
}

export interface ApprovalItem {
  id: string;
  type: ApprovalType;
  title: string;
  subtitle: string;
  status: ApprovalStatus;
  date: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  period: string;
  description: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  disputeNote?: string;
  timeEntryIds?: string[];
}

export interface Client {
  id: string;
  code: string;
  name: string;
  email: string;
  initials: string;
  company: string;
  sector: string;
  tier: ClientTier;
  country: string;
  since: string;
  servicePlan: ServicePlan;
  hourlyRate: number;
  currency: string;
  retainerPerMonth: number;
  retainerHours: number;
  totalInvoiced: number;
  pendingAmount: number;
  assignedTeam: string[];
  onboarding: { label: string; done: boolean }[];
  notes: string;
  commsProtocol: string;
}

export interface Lead {
  id: string;
  code: string;
  initials: string;
  company: string;
  stakeholder: string;
  stakeholderRole: string;
  email?: string;
  sector: string;
  location: string;
  stage: LeadStage;
  value: number;
  temperature: "hot" | "warm" | "cold";
}

export interface CRMActivity {
  id: string;
  date: string;
  leadId: string;
  contact: string;
  kind: InteractionKind;
  activity: string;
  nextStep: string;
  stage: LeadStage;
}

export interface TeamMember {
  id: string;
  name: string;
  role: "admin" | "counsel" | "associate" | "client";
  email: string;
  assignedClients: string[];
  active: boolean;
}

export interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  detail: string;
  category: "Portal Access" | "Vault" | "Documents" | "Financial" | "Approvals" | "Comms" | "Time" | "CRM" | "Tasks" | "Clients";
  important?: boolean;
}

// ─── Seed Data ─────────────────────────────────────────────────────────────

const TIME_ENTRIES: TimeEntry[] = [
  { id: "te1",  date: "2025-04-22", project: "Governance", description: "Board pack preparation — Q2 2025",                 hours: 3.5, status: "Approved",  clientId: "c1", taskId: "t5",  loggedBy: "u3", billable: true, rate: 550, currency: "AED", value: 1925 },
  { id: "te2",  date: "2025-04-21", project: "Advisory",   description: "Strategic alignment — KSA entity expansion",       hours: 2.0, status: "Approved",  clientId: "c1", loggedBy: "u3", billable: true, rate: 550, currency: "AED", value: 1100 },
  { id: "te3",  date: "2025-04-20", project: "Comms",      description: "Investor update drafting — Q1 results narrative",  hours: 1.5, status: "Submitted", clientId: "c2", taskId: "t7",  loggedBy: "u3", billable: true, rate: 600, currency: "AED", value:  900 },
  { id: "te4",  date: "2025-04-19", project: "Docs",       description: "NDA execution coordination — new subsidiary",      hours: 2.5, status: "Submitted", clientId: "c2", loggedBy: "u2", billable: true, rate: 600, currency: "AED", value: 1500 },
  { id: "te5",  date: "2025-04-18", project: "Governance", description: "MISA license renewal documentation",               hours: 4.0, status: "Approved",  clientId: "c2", taskId: "t1",  loggedBy: "u2", billable: true, rate: 600, currency: "AED", value: 2400 },
  { id: "te6",  date: "2025-04-17", project: "Research",   description: "Market intelligence — GCC sovereign wealth",       hours: 3.0, status: "Approved",  clientId: "c1", loggedBy: "u3", billable: true, rate: 550, currency: "AED", value: 1650 },
  { id: "te7",  date: "2025-04-16", project: "Coord",      description: "London board trip logistics — flights, visas",    hours: 2.0, status: "Approved",  clientId: "c1", taskId: "t6",  loggedBy: "u3", billable: false, rate: 550, currency: "AED", value: 0 },
  { id: "te8",  date: "2025-04-15", project: "Advisory",   description: "Cross-border structuring review — Qatar entity",   hours: 3.5, status: "Submitted", clientId: "c3", loggedBy: "u2", billable: true, rate: 700, currency: "AED", value: 2450 },
  { id: "te9",  date: "2025-04-14", project: "Governance", description: "Compliance documentation — AML/KYC refresh",       hours: 2.0, status: "Paid",      clientId: "c3", taskId: "t8",  loggedBy: "u3", billable: true, rate: 700, currency: "AED", value: 1400 },
  { id: "te10", date: "2025-04-12", project: "Other",      description: "Administrative coordination and scheduling",       hours: 1.5, status: "Paid",      clientId: "c1", loggedBy: "u3", billable: false, rate: 550, currency: "AED", value: 0 },
];

const TASKS: Task[] = [
  { id: "t1",  title: "MISA License Renewal Filing",       description: "Coordinate end-to-end renewal filing including Saudi liaison", category: "Governance", status: "Pending",     priority: "High",     clientId: "c2", assignedTo: "u2", dueDate: "2025-05-30", estimatedHours: 12, actualHours: 4 },
  { id: "t2",  title: "QFC Entity Structure Review",       description: "Review and recommend optimal entity structure for QFC",        category: "Advisory",   status: "Pending",     priority: "Standard", clientId: "c3", assignedTo: "u2", dueDate: "2025-06-10", estimatedHours: 16, actualHours: 0 },
  { id: "t3",  title: "Annual Report Coordination",        description: "Coordinate annual report drafting and design with vendors",    category: "Docs",       status: "Pending",     priority: "Standard", clientId: "c1", assignedTo: "u3", dueDate: "2025-06-01", estimatedHours: 20, actualHours: 0 },
  { id: "t4",  title: "Cross-border Tax Memo Review",      description: "Review external counsel memo on KSA-UAE tax implications",     category: "Legal",      status: "Pending",     priority: "High",     clientId: "c2", assignedTo: "u2", dueDate: "2025-05-25", estimatedHours: 8,  actualHours: 0 },
  { id: "t5",  title: "Q2 Board Pack Preparation",         description: "Prepare full board pack including financials and minutes",     category: "Governance", status: "In Progress", priority: "Urgent",   clientId: "c1", assignedTo: "u3", dueDate: "2025-05-15", estimatedHours: 14, actualHours: 5.5 },
  { id: "t6",  title: "London Board Trip Logistics",       description: "End-to-end coordination of London board trip",                 category: "Coord",      status: "In Progress", priority: "High",     clientId: "c1", assignedTo: "u3", dueDate: "2025-05-10", estimatedHours: 6,  actualHours: 2 },
  { id: "t7",  title: "Investor Update Deck — Q1",         description: "Draft and refine Q1 investor update presentation",             category: "Comms",      status: "In Progress", priority: "High",     clientId: "c2", assignedTo: "u3", dueDate: "2025-04-30", estimatedHours: 10, actualHours: 1.5 },
  { id: "t8",  title: "KYC Refresh — Gulf Horizon",        description: "Refresh AML/KYC documentation for renewal",                    category: "Compliance", status: "In Progress", priority: "Standard", clientId: "c3", assignedTo: "u2", dueDate: "2025-05-20", estimatedHours: 8,  actualHours: 2 },
  { id: "t9",  title: "Q1 Results Investor Deck",          description: "",                                                              category: "Comms",      status: "Completed",   priority: "Urgent",   clientId: "c3", assignedTo: "u3", dueDate: "2025-04-15", estimatedHours: 12, actualHours: 11 },
  { id: "t10", title: "Entity Setup — Reem Holding",       description: "",                                                              category: "Governance", status: "Completed",   priority: "High",     clientId: "c2", assignedTo: "u2", dueDate: "2025-04-10", estimatedHours: 20, actualHours: 22 },
  { id: "t11", title: "NDA Execution — New Subsidiary",    description: "",                                                              category: "Legal",      status: "Completed",   priority: "Standard", clientId: "c2", assignedTo: "u2", dueDate: "2025-04-12", estimatedHours: 4,  actualHours: 3.5 },
  { id: "t12", title: "March Retainer Invoicing",          description: "",                                                              category: "Financial",  status: "Completed",   priority: "High",     clientId: "c1", assignedTo: "u1", dueDate: "2025-04-01", estimatedHours: 2,  actualHours: 2 },
  { id: "t13", title: "Onboarding — Mansouri Capital",     description: "",                                                              category: "Admin",      status: "Completed",   priority: "Standard", clientId: "c1", assignedTo: "u2", dueDate: "2025-03-15", estimatedHours: 6,  actualHours: 7 },
];

const APPROVALS: ApprovalItem[] = [
  { id: "ap1", type: "Legal",      title: "NDA — New Subsidiary Agreement",          subtitle: "Mutual NDA with one-way carveout. Prepared by Counsel for Principal authorization.", status: "Pending",  date: "2025-04-22" },
  { id: "ap2", type: "Financial",  title: "Invoice TED-0028 Release — AED 45,000",   subtitle: "Monthly retainer + board preparation services for Mansouri Capital Group, April 2025.", status: "Pending",  date: "2025-04-21" },
  { id: "ap3", type: "Governance", title: "Board Charter Amendment — Reem Holding",  subtitle: "Amendment to governance charter reflecting new KSA subsidiary directors.",            status: "Pending",  date: "2025-04-20" },
  { id: "ap4", type: "Document",   title: "Q1 Investor Update Deck",                 subtitle: "Final version pending Principal review before client distribution — Gulf Horizon.",   status: "Pending",  date: "2025-04-19" },
  { id: "ap5", type: "Legal",      title: "Power of Attorney — MISA Renewal",        subtitle: "Limited PoA for MISA license renewal filing. Valid until 31 December 2025.",          status: "Approved", date: "2025-04-18" },
  { id: "ap6", type: "Financial",  title: "Invoice TED-0027 Release — AED 35,000",   subtitle: "March retainer — Mansouri Capital Group.",                                            status: "Approved", date: "2025-04-01" },
  { id: "ap7", type: "Document",   title: "Entity Incorporation Certificate — Gulf Horizon", subtitle: "QFC registration document — certified copy filed and distributed.",            status: "Approved", date: "2025-03-28" },
  { id: "ap8", type: "Governance", title: "Director Appointment Resolution",         subtitle: "Resolution appointing Nasser Al-Thani as non-executive director — Reem Holding Co.", status: "Rejected", date: "2025-03-20" },
];

const INVOICES: Invoice[] = [
  { id: "inv1", clientId: "c1", period: "April 2025", description: "Monthly Retainer + Board Preparation Services",     amount: 45000, currency: "AED", status: "Upcoming", date: "2025-04-01", dueDate: "2025-04-30" },
  { id: "inv2", clientId: "c1", period: "March 2025", description: "Monthly Retainer — Mansouri Capital Group",         amount: 35000, currency: "AED", status: "Paid",     date: "2025-03-01", dueDate: "2025-03-31" },
  { id: "inv3", clientId: "c1", period: "Feb 2025",   description: "Monthly Retainer + Cross-border Coordination",      amount: 42700, currency: "AED", status: "Paid",     date: "2025-02-01", dueDate: "2025-02-28" },
  { id: "inv4", clientId: "c2", period: "Q1 2025",    description: "Q1 Strategic Coordination Retainer — Reem Holding", amount: 40000, currency: "AED", status: "Paid",     date: "2025-01-01", dueDate: "2025-01-31" },
  { id: "inv5", clientId: "c3", period: "April 2025", description: "Onboarding + Q2 Retainer — Gulf Horizon",            amount: 55000, currency: "AED", status: "Upcoming", date: "2025-04-20", dueDate: "2025-05-20" },
  { id: "inv6", clientId: "c2", period: "March 2025", description: "Monthly Retainer — Reem Holding Co.",                amount: 38000, currency: "AED", status: "Paid",     date: "2025-03-01", dueDate: "2025-03-31" },
];

const CLIENTS: Client[] = [
  { id: "c1", code: "MCG-001", name: "Khalid Al-Mansouri", email: "khalid@mansouricapital.ae", initials: "KM", company: "Mansouri Capital Group", sector: "Family Office",        tier: "Tier I C-Suite",       country: "UAE",   since: "Jan 2024", servicePlan: "Enterprise",   hourlyRate: 550, currency: "AED", retainerPerMonth: 35000, retainerHours: 60, totalInvoiced: 180000, pendingAmount: 45000, assignedTeam: ["u2","u3"], notes: "Principal prefers Sunday morning briefings. Critical: KSA expansion timeline.", commsProtocol: "WhatsApp daily, Slack overflow",
    onboarding: [{label:"Entity Setup",done:true},{label:"AML / KYC Verification",done:true},{label:"Bank Account Configuration",done:false},{label:"NDA Execution",done:true},{label:"Portal Onboarding",done:true}] },
  { id: "c2", code: "RHC-002", name: "Sara Al-Rasheed",    email: "sara@reemholding.sa",       initials: "SR", company: "Reem Holding Co.",       sector: "Private Equity",        tier: "Tier II Founder",      country: "KSA",   since: "Mar 2024", servicePlan: "Professional", hourlyRate: 600, currency: "AED", retainerPerMonth: 38000, retainerHours: 50, totalInvoiced:  95000, pendingAmount:     0, assignedTeam: ["u2"],      notes: "Founder is hands-on. Always cc the chief of staff on board comms.", commsProtocol: "Slack #reem-coord, weekly recap email",
    onboarding: [{label:"Entity Setup",done:true},{label:"AML / KYC Verification",done:true},{label:"Bank Account Configuration",done:true},{label:"NDA Execution",done:true},{label:"Portal Onboarding",done:false}] },
  { id: "c3", code: "GHI-003", name: "Mohammed Al-Thani",  email: "m.althani@gulfhorizon.qa",  initials: "MT", company: "Gulf Horizon Investments", sector: "Sovereign Investments", tier: "Tier III Family Office", country: "Qatar", since: "Feb 2025", servicePlan: "Enterprise",   hourlyRate: 700, currency: "AED", retainerPerMonth: 55000, retainerHours: 70, totalInvoiced:  55000, pendingAmount: 55000, assignedTeam: ["u3"],      notes: "Family office, three siblings on the board. Confidentiality is paramount.", commsProtocol: "Encrypted WhatsApp only, no email",
    onboarding: [{label:"Entity Setup",done:true},{label:"AML / KYC Verification",done:false},{label:"Bank Account Configuration",done:false},{label:"NDA Execution",done:true},{label:"Portal Onboarding",done:false}] },
];

const LEADS: Lead[] = [
  { id: "l1", code: "AFV-004", initials: "AF", company: "Al-Fardan Ventures",       stakeholder: "Hassan Al-Fardan",   stakeholderRole: "Managing Director", sector: "Conglomerate",   location: "UAE",   stage: "Negotiation", value: 120000, temperature: "hot"  },
  { id: "l2", code: "ASD-005", initials: "AS", company: "Al-Sabah Energy Holdings", stakeholder: "Yousef Al-Sabah",    stakeholderRole: "Chairman",          sector: "Energy",         location: "KSA",   stage: "Referred",    value: 115000, temperature: "hot"  },
  { id: "l3", code: "BRW-006", initials: "BW", company: "Bin Rashid Wealth",        stakeholder: "Omar Bin Rashid",    stakeholderRole: "CEO",               sector: "Real Estate",    location: "Qatar", stage: "Discussion",  value:  80000, temperature: "warm" },
  { id: "l4", code: "EMP-007", initials: "EM", company: "Emirates Property Group",  stakeholder: "Aisha Al-Maktoum",   stakeholderRole: "Chief of Staff",    sector: "Property Dev.",  location: "UAE",   stage: "Proposal",    value:  60000, temperature: "warm" },
];

const CRM_ACTIVITIES: CRMActivity[] = [
  { id: "ca1", date: "22 Apr", leadId: "l1", contact: "AFV-004", kind: "Meeting", activity: "Term sheet reviewed — fee structure discussion ongoing",      nextStep: "Final pricing call — 25 Apr", stage: "Negotiation" },
  { id: "ca2", date: "20 Apr", leadId: "l2", contact: "ASD-005", kind: "Call",    activity: "Warm introduction via MCG-001 — initial brief received",       nextStep: "Capabilities presentation — 28 Apr", stage: "Referred" },
  { id: "ca3", date: "18 Apr", leadId: "l3", contact: "BRW-006", kind: "Call",    activity: "Discovery call — QFC entity governance needs",                  nextStep: "Scope proposal — 2 May", stage: "Discussion" },
  { id: "ca4", date: "15 Apr", leadId: "l4", contact: "EMP-007", kind: "Email",   activity: "Proposal submitted — family office coordination package",       nextStep: "Awaiting feedback — follow up 30 Apr", stage: "Proposal" },
];

const TEAM: TeamMember[] = [
  { id: "u1", name: "Layla Al-Rashidi", role: "admin",     email: "admin@executivedesk.ae",     assignedClients: ["c1","c2","c3"], active: true },
  { id: "u2", name: "Samir Haddad",     role: "counsel",   email: "counsel@executivedesk.ae",   assignedClients: ["c1","c2"],      active: true },
  { id: "u3", name: "Noor Al-Khalifa",  role: "associate", email: "associate@executivedesk.ae", assignedClients: ["c1","c3"],      active: true },
];

const AUDIT_LOG: AuditEntry[] = [
  { id: "a1",  action: "Portal Access Initiated",  user: "Layla Al-Rashidi",  timestamp: "Today · 09:14",     detail: "Principal session started — IP 92.168.12.45 (Dubai, UAE)",          category: "Portal Access", important: true },
  { id: "a2",  action: "Invoice Generated",        user: "Layla Al-Rashidi",  timestamp: "Today · 09:32",     detail: "TED-0028 drafted — AED 45,000 — Mansouri Capital Group",            category: "Financial",     important: true },
  { id: "a3",  action: "Approval Action",          user: "Layla Al-Rashidi",  timestamp: "Today · 09:45",     detail: "PoA — MISA Renewal approved and filed",                              category: "Approvals" },
  { id: "a4",  action: "Time Entry Approved",      user: "Layla Al-Rashidi",  timestamp: "Today · 10:05",     detail: "3.5h Governance — Q2 Board Pack (te1) approved",                    category: "Time" },
  { id: "a5",  action: "Document Uploaded",        user: "Noor Al-Khalifa",   timestamp: "Today · 11:22",     detail: "Q1 Investor Update Deck v3 uploaded to Vault — GHI-003",            category: "Vault" },
  { id: "a6",  action: "Task Status Updated",      user: "Noor Al-Khalifa",   timestamp: "Today · 12:30",     detail: "Q2 Board Pack Preparation → In Progress",                            category: "Tasks" },
  { id: "a7",  action: "CRM Activity Logged",      user: "Samir Haddad",      timestamp: "Today · 14:15",     detail: "Discovery call recorded — BRW-006 — QFC governance scope",          category: "CRM" },
  { id: "a8",  action: "Portal Access Initiated",  user: "Noor Al-Khalifa",   timestamp: "Yesterday · 08:55", detail: "Associate session started — IP 85.202.14.77 (Abu Dhabi, UAE)",      category: "Portal Access", important: true },
  { id: "a9",  action: "Time Entry Submitted",     user: "Noor Al-Khalifa",   timestamp: "Yesterday · 16:40", detail: "2.0h Advisory — KSA expansion meeting submitted for approval",      category: "Time" },
  { id: "a10", action: "Financial Approval",       user: "Layla Al-Rashidi",  timestamp: "01 Apr · 00:00",    detail: "TED-0027 marked Paid — AED 35,000 — Mansouri Capital Group",        category: "Financial",     important: true },
];

// Static helpers (chart visuals)
export const MONTHLY_DATA = [
  { month: "Jan", revenue:  60000, hours:  88, retainer: 60000, overage: 0     },
  { month: "Feb", revenue: 102000, hours: 102, retainer: 60000, overage: 42000 },
  { month: "Mar", revenue:  73000, hours: 118, retainer: 60000, overage: 13000 },
  { month: "Apr", revenue:  67700, hours: 124, retainer: 60000, overage:  7700 },
  { month: "May", revenue:  60000, hours: 130, retainer: 60000, overage: 0     },
];

export const GOAL_PROGRESS = [
  { goal: "Governance", pct: 92 }, { goal: "Ops Systems",  pct: 87 },
  { goal: "Cross-Border", pct: 64 },{ goal: "Comms",        pct: 58 },
  { goal: "Vault",      pct: 43 }, { goal: "Advisory",     pct: 38 },
];

export const RADAR_DATA = [
  { axis: "Board",    score: 88 }, { axis: "Ops",      score: 82 },
  { axis: "Comms",    score: 78 }, { axis: "Legal",    score: 92 },
  { axis: "Advisory", score: 85 },
];

export const TIME_CATEGORIES = [
  { name: "Governance", hours: 34 }, { name: "Advisory", hours: 26 },
  { name: "Comms",      hours: 20 }, { name: "Docs",     hours: 18 },
  { name: "Research",   hours: 12 }, { name: "Coord",    hours:  8 },
  { name: "Other",      hours:  6 },
];

// ─── Context ────────────────────────────────────────────────────────────────

interface DataContextType {
  timeEntries: TimeEntry[];
  tasks: Task[];
  approvals: ApprovalItem[];
  invoices: Invoice[];
  clients: Client[];
  leads: Lead[];
  crmActivities: CRMActivity[];
  team: TeamMember[];
  auditLog: AuditEntry[];

  // mutators
  addAuditEntry: (entry: Omit<AuditEntry, "id" | "timestamp"> & { timestamp?: string }) => void;
  pulse: (actor: string, action: string, detail: string, category: AuditEntry["category"], important?: boolean) => void;

  addTask:         (actor: string, t: Omit<Task, "id" | "actualHours">) => Task;
  updateTaskStatus:(actor: string, id: string, status: TaskStatus, reason?: string) => void;
  updateTaskHours: (actor: string, id: string, actualHours: number) => void;

  addLead:           (actor: string, l: Omit<Lead, "id" | "code" | "initials">) => Lead;
  updateLeadStage:   (actor: string, id: string, stage: LeadStage) => void;
  addCRMActivity:    (actor: string, a: Omit<CRMActivity, "id" | "date" | "contact" | "stage"> & { stage?: LeadStage }) => CRMActivity;

  addClient:        (actor: string, c: Omit<Client, "id" | "code" | "initials" | "totalInvoiced" | "pendingAmount" | "since" | "onboarding">) => Client;
  promoteLeadHint:  (leadId: string) => Partial<Client> | null;
  toggleOnboarding: (actor: string, clientId: string, label: string) => void;

  addTimeEntry:    (actor: string, e: Omit<TimeEntry, "id" | "value" | "rate" | "currency">) => TimeEntry;
  updateTimeStatus:(actor: string, id: string, status: TimeStatus, reason?: string) => void;

  updateApproval:     (actor: string, id: string, status: "Approved" | "Rejected") => void;
  updateInvoiceStatus:(actor: string, id: string, status: InvoiceStatus, note?: string) => void;
  generateInvoiceFromTime: (actor: string, clientId: string, period: string, description: string) => Invoice | null;
}

const DataContext = createContext<DataContextType | null>(null);

const ts = () => `Today · ${new Date().toLocaleTimeString("en-AE", { hour: "2-digit", minute: "2-digit" })}`;
const initials = (s: string) => s.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export function PortalDataProvider({ children }: { children: ReactNode }) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(TIME_ENTRIES);
  const [tasks, setTasks]             = useState<Task[]>(TASKS);
  const [approvals, setApprovals]     = useState<ApprovalItem[]>(APPROVALS);
  const [invoices, setInvoices]       = useState<Invoice[]>(INVOICES);
  const [clients, setClients]         = useState<Client[]>(CLIENTS);
  const [leads, setLeads]             = useState<Lead[]>(LEADS);
  const [crmActivities, setCRMAct]    = useState<CRMActivity[]>(CRM_ACTIVITIES);
  const [auditLog, setAuditLog]       = useState<AuditEntry[]>(AUDIT_LOG);

  const addAuditEntry = useCallback((entry: Omit<AuditEntry, "id" | "timestamp"> & { timestamp?: string }) =>
    setAuditLog((prev) => [{ ...entry, timestamp: entry.timestamp ?? ts(), id: `a${Date.now()}${Math.floor(Math.random()*100)}` }, ...prev]), []);

  const pulse = useCallback((actor: string, action: string, detail: string, category: AuditEntry["category"], important = false) =>
    addAuditEntry({ action, user: actor, detail, category, important }), [addAuditEntry]);

  // ─── Tasks ───
  const addTask = useCallback((actor: string, t: Omit<Task, "id" | "actualHours">) => {
    const task: Task = { ...t, id: `t${Date.now()}`, actualHours: 0 };
    setTasks((prev) => [task, ...prev]);
    const cl = clients.find((c) => c.id === t.clientId);
    pulse(actor, "Task Initialized", `${task.title} — ${cl?.company ?? t.clientId} (${task.priority})`, "Tasks", task.priority === "Urgent");
    return task;
  }, [clients, pulse]);

  const updateTaskStatus = useCallback((actor: string, id: string, status: TaskStatus, reason?: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status, ...(reason ? { disputeReason: reason } : {}) } : t));
    const t = tasks.find((x) => x.id === id);
    pulse(actor, "Task Status Updated", `${t?.title ?? id} → ${status}${reason ? ` — ${reason}` : ""}`, "Tasks", status === "Disputed");
  }, [tasks, pulse]);

  const updateTaskHours = useCallback((actor: string, id: string, actualHours: number) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, actualHours } : t));
    const t = tasks.find((x) => x.id === id);
    pulse(actor, "Task Hours Updated", `${t?.title ?? id} → ${actualHours}h logged`, "Tasks");
  }, [tasks, pulse]);

  // ─── CRM ───
  const addLead = useCallback((actor: string, l: Omit<Lead, "id" | "code" | "initials">) => {
    const id = `l${Date.now()}`;
    const code = `${l.company.replace(/[^A-Z]/gi, "").slice(0, 3).toUpperCase() || "NEW"}-${Math.floor(100 + Math.random() * 899)}`;
    const lead: Lead = { ...l, id, code, initials: initials(l.company) };
    setLeads((prev) => [lead, ...prev]);
    pulse(actor, "CRM Lead Created", `${code} — ${l.company} — AED ${l.value.toLocaleString()} estimated`, "CRM", true);
    return lead;
  }, [pulse]);

  const updateLeadStage = useCallback((actor: string, id: string, stage: LeadStage) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, stage } : l));
    const l = leads.find((x) => x.id === id);
    pulse(actor, "CRM Stage Updated", `${l?.code ?? id} → ${stage}`, "CRM", stage === "Won" || stage === "Negotiation");
  }, [leads, pulse]);

  const addCRMActivity = useCallback((actor: string, a: Omit<CRMActivity, "id" | "date" | "contact" | "stage"> & { stage?: LeadStage }) => {
    const lead = leads.find((l) => l.id === a.leadId);
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    const ca: CRMActivity = { id: `ca${Date.now()}`, date, leadId: a.leadId, contact: lead?.code ?? "—", kind: a.kind, activity: a.activity, nextStep: a.nextStep, stage: a.stage ?? lead?.stage ?? "Initial" };
    setCRMAct((prev) => [ca, ...prev]);
    pulse(actor, "CRM Activity Logged", `${a.kind} — ${lead?.code ?? "?"} — ${a.activity.slice(0, 60)}`, "CRM");
    return ca;
  }, [leads, pulse]);

  // ─── Clients ───
  const promoteLeadHint = useCallback((leadId: string): Partial<Client> | null => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return null;
    const monthly = lead.value / 12;
    const retainerMonthly = Math.round(monthly * 0.35 / 1000) * 1000 || 25000;
    const hourlyRate = lead.location === "Qatar" ? 700 : lead.location === "KSA" ? 600 : 550;
    return {
      company: lead.company,
      name: lead.stakeholder,
      email: lead.email ?? "",
      sector: lead.sector,
      country: lead.location,
      hourlyRate,
      currency: "AED",
      retainerPerMonth: retainerMonthly,
      retainerHours: Math.round(retainerMonthly / hourlyRate),
    };
  }, [leads]);

  const addClient = useCallback((actor: string, c: Omit<Client, "id" | "code" | "initials" | "totalInvoiced" | "pendingAmount" | "since" | "onboarding">) => {
    const id = `c${Date.now()}`;
    const code = `${c.company.replace(/[^A-Z]/gi, "").slice(0, 3).toUpperCase() || "CLT"}-${String(clients.length + 1).padStart(3, "0")}`;
    const since = new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    const client: Client = {
      ...c, id, code, initials: initials(c.name || c.company), totalInvoiced: 0, pendingAmount: 0, since,
      onboarding: [
        { label: "Entity Setup", done: false },
        { label: "AML / KYC Verification", done: false },
        { label: "Bank Account Configuration", done: false },
        { label: "NDA Execution", done: false },
        { label: "Portal Onboarding", done: false },
      ],
    };
    setClients((prev) => [...prev, client]);
    pulse(actor, "Client Created", `${code} — ${c.company} — Onboarding initiated`, "Clients", true);
    return client;
  }, [clients, pulse]);

  const toggleOnboarding = useCallback((actor: string, clientId: string, label: string) => {
    setClients((prev) => prev.map((c) => c.id === clientId
      ? { ...c, onboarding: c.onboarding.map((s) => s.label === label ? { ...s, done: !s.done } : s) }
      : c));
    const c = clients.find((x) => x.id === clientId);
    pulse(actor, "Onboarding Step Toggled", `${c?.code ?? clientId} — "${label}"`, "Clients");
  }, [clients, pulse]);

  // ─── Time ───
  const addTimeEntry = useCallback((actor: string, e: Omit<TimeEntry, "id" | "value" | "rate" | "currency">) => {
    const cl = clients.find((c) => c.id === e.clientId);
    const rate = cl?.hourlyRate ?? 500;
    const currency = cl?.currency ?? "AED";
    const value = e.billable ? Math.round(e.hours * rate) : 0;
    const entry: TimeEntry = { ...e, id: `te${Date.now()}`, rate, currency, value };
    setTimeEntries((prev) => [entry, ...prev]);
    // sync hours back to task if linked
    if (e.taskId) {
      setTasks((prev) => prev.map((t) => t.id === e.taskId ? { ...t, actualHours: t.actualHours + e.hours } : t));
    }
    pulse(actor, "Time Entry Submitted", `${e.hours}h ${e.project} — ${cl?.code ?? e.clientId} — ${e.billable ? `AED ${value.toLocaleString()}` : "Non-billable"}`, "Time");
    return entry;
  }, [clients, pulse]);

  const updateTimeStatus = useCallback((actor: string, id: string, status: TimeStatus, reason?: string) => {
    setTimeEntries((prev) => prev.map((e) => e.id === id ? { ...e, status, ...(reason ? { disputeReason: reason } : {}) } : e));
    const e = timeEntries.find((x) => x.id === id);
    pulse(actor, `Time Entry ${status}`, `${e?.hours ?? "?"}h ${e?.project ?? ""} → ${status}${reason ? ` — ${reason}` : ""}`, "Time", status === "Disputed");
  }, [timeEntries, pulse]);

  // ─── Approvals ───
  const updateApproval = useCallback((actor: string, id: string, status: "Approved" | "Rejected") => {
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    const a = approvals.find((x) => x.id === id);
    pulse(actor, `Approval ${status}`, `${a?.title ?? id} → ${status}`, "Approvals", true);
  }, [approvals, pulse]);

  // ─── Invoices ───
  const updateInvoiceStatus = useCallback((actor: string, id: string, status: InvoiceStatus, note?: string) => {
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status, disputeNote: note } : inv));
    const inv = invoices.find((x) => x.id === id);
    pulse(actor, `Invoice ${status}`, `${inv?.id.toUpperCase() ?? id} — ${inv ? `AED ${inv.amount.toLocaleString()}` : ""} → ${status}${note ? ` — ${note}` : ""}`, "Financial", true);
    // mark linked time entries as Invoiced/Paid where appropriate
    if ((status === "Upcoming" || status === "Paid") && inv?.timeEntryIds?.length) {
      setTimeEntries((prev) => prev.map((te) => inv.timeEntryIds!.includes(te.id) ? { ...te, status: status === "Paid" ? "Paid" : "Invoiced" } : te));
    }
  }, [invoices, pulse]);

  const generateInvoiceFromTime = useCallback((actor: string, clientId: string, period: string, description: string) => {
    const cl = clients.find((c) => c.id === clientId);
    if (!cl) return null;
    const eligible = timeEntries.filter((te) => te.clientId === clientId && te.status === "Approved" && te.billable);
    if (eligible.length === 0) {
      pulse(actor, "Invoice Generation Failed", `${cl.code} — no approved billable time available for ${period}`, "Financial");
      return null;
    }
    const amount = eligible.reduce((s, te) => s + te.value, 0);
    const id = `inv${Date.now()}`;
    const today = new Date();
    const due = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const inv: Invoice = {
      id, clientId, period, description, amount, currency: cl.currency, status: "Draft",
      date: fmt(today), dueDate: fmt(due), timeEntryIds: eligible.map((te) => te.id),
    };
    setInvoices((prev) => [inv, ...prev]);
    setTimeEntries((prev) => prev.map((te) => eligible.some((e) => e.id === te.id) ? { ...te, status: "Invoiced" } : te));
    pulse(actor, "Invoice Generated", `${id.toUpperCase()} drafted — ${cl.currency} ${amount.toLocaleString()} — ${cl.company} — ${eligible.length} entries`, "Financial", true);
    return inv;
  }, [clients, timeEntries, pulse]);

  const value: DataContextType = useMemo(() => ({
    timeEntries, tasks, approvals, invoices, clients, leads, crmActivities, team: TEAM, auditLog,
    addAuditEntry, pulse,
    addTask, updateTaskStatus, updateTaskHours,
    addLead, updateLeadStage, addCRMActivity,
    addClient, promoteLeadHint, toggleOnboarding,
    addTimeEntry, updateTimeStatus,
    updateApproval, updateInvoiceStatus, generateInvoiceFromTime,
  }), [timeEntries, tasks, approvals, invoices, clients, leads, crmActivities, auditLog,
       addAuditEntry, pulse, addTask, updateTaskStatus, updateTaskHours, addLead, updateLeadStage,
       addCRMActivity, addClient, promoteLeadHint, toggleOnboarding, addTimeEntry, updateTimeStatus,
       updateApproval, updateInvoiceStatus, generateInvoiceFromTime]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function usePortalData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("usePortalData must be used within PortalDataProvider");
  return ctx;
}
