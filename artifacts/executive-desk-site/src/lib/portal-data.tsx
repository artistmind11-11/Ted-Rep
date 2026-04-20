import { createContext, useContext, useState, ReactNode } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

export type TaskStatus = "To Do" | "In Progress" | "Completed" | "Overdue";
export type TaskPriority = "Standard" | "High" | "Urgent";
export type InvoiceStatus = "Draft" | "Upcoming" | "Paid" | "Overdue";
export type TimeStatus = "Submitted" | "Approved" | "Disputed" | "Invoiced" | "Paid";
export type LeadStage = "Initial" | "Proposal" | "Discussion" | "Referred" | "Negotiation" | "Won" | "Lost";
export type ApprovalType = "Legal" | "Financial" | "Document" | "Governance";
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";
export type ClientTier = "Tier I C-Suite" | "Tier II Founder" | "Tier III Family Office";

export interface TimeEntry {
  id: string;
  date: string;
  project: string;
  description: string;
  hours: number;
  status: TimeStatus;
  clientId: string;
  loggedBy: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  status: TaskStatus;
  priority: TaskPriority;
  clientId: string;
  assignedTo: string;
  dueDate: string;
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
}

export interface Client {
  id: string;
  code: string;
  name: string;
  initials: string;
  company: string;
  sector: string;
  tier: ClientTier;
  country: string;
  since: string;
  retainerPerMonth: number;
  totalInvoiced: number;
  pendingAmount: number;
  assignedTeam: string[];
  onboarding: { label: string; done: boolean }[];
}

export interface Lead {
  id: string;
  code: string;
  initials: string;
  sector: string;
  location: string;
  stage: LeadStage;
  value: number;
  temperature: "hot" | "warm" | "cold";
}

export interface CRMActivity {
  id: string;
  date: string;
  contact: string;
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
  category: "Portal Access" | "Vault" | "Documents" | "Financial" | "Approvals" | "Comms" | "Time" | "CRM" | "Tasks";
  important?: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

const TIME_ENTRIES: TimeEntry[] = [
  { id: "te1", date: "2025-04-22", project: "Governance", description: "Board pack preparation — Q2 2025", hours: 3.5, status: "Approved", clientId: "c1", loggedBy: "u3" },
  { id: "te2", date: "2025-04-21", project: "Advisory", description: "Strategic alignment meeting — KSA entity expansion", hours: 2.0, status: "Approved", clientId: "c1", loggedBy: "u3" },
  { id: "te3", date: "2025-04-20", project: "Comms", description: "Investor update drafting — Q1 results narrative", hours: 1.5, status: "Submitted", clientId: "c2", loggedBy: "u3" },
  { id: "te4", date: "2025-04-19", project: "Docs", description: "NDA execution coordination — new subsidiary", hours: 2.5, status: "Submitted", clientId: "c2", loggedBy: "u2" },
  { id: "te5", date: "2025-04-18", project: "Governance", description: "MISA license renewal documentation", hours: 4.0, status: "Approved", clientId: "c2", loggedBy: "u2" },
  { id: "te6", date: "2025-04-17", project: "Research", description: "Market intelligence — GCC sovereign wealth landscape", hours: 3.0, status: "Approved", clientId: "c1", loggedBy: "u3" },
  { id: "te7", date: "2025-04-16", project: "Coord", description: "London board trip logistics — flights, visas, hotels", hours: 2.0, status: "Approved", clientId: "c1", loggedBy: "u3" },
  { id: "te8", date: "2025-04-15", project: "Advisory", description: "Cross-border structuring review — Qatar entity", hours: 3.5, status: "Submitted", clientId: "c3", loggedBy: "u2" },
  { id: "te9", date: "2025-04-14", project: "Governance", description: "Compliance documentation — AML/KYC refresh", hours: 2.0, status: "Paid", clientId: "c3", loggedBy: "u3" },
  { id: "te10", date: "2025-04-12", project: "Other", description: "Administrative coordination and scheduling", hours: 1.5, status: "Paid", clientId: "c1", loggedBy: "u3" },
];

const TASKS: Task[] = [
  // To Do
  { id: "t1", title: "MISA License Renewal Filing", category: "Governance", status: "To Do", priority: "High", clientId: "c2", assignedTo: "u2", dueDate: "2025-05-30" },
  { id: "t2", title: "QFC Entity Structure Review", category: "Advisory", status: "To Do", priority: "Standard", clientId: "c3", assignedTo: "u2", dueDate: "2025-06-10" },
  { id: "t3", title: "Annual Report Coordination", category: "Docs", status: "To Do", priority: "Standard", clientId: "c1", assignedTo: "u3", dueDate: "2025-06-01" },
  { id: "t4", title: "Cross-border Tax Memo Review", category: "Legal", status: "To Do", priority: "High", clientId: "c2", assignedTo: "u2", dueDate: "2025-05-25" },
  // In Progress
  { id: "t5", title: "Q2 Board Pack Preparation", category: "Governance", status: "In Progress", priority: "Urgent", clientId: "c1", assignedTo: "u3", dueDate: "2025-05-15" },
  { id: "t6", title: "London Board Trip Logistics", category: "Coord", status: "In Progress", priority: "High", clientId: "c1", assignedTo: "u3", dueDate: "2025-05-10" },
  { id: "t7", title: "Investor Update Deck — Q1", category: "Comms", status: "In Progress", priority: "High", clientId: "c2", assignedTo: "u3", dueDate: "2025-04-30" },
  { id: "t8", title: "KYC Refresh — Gulf Horizon", category: "Compliance", status: "In Progress", priority: "Standard", clientId: "c3", assignedTo: "u2", dueDate: "2025-05-20" },
  // Completed
  { id: "t9", title: "Q1 Results Investor Deck", category: "Comms", status: "Completed", priority: "Urgent", clientId: "c3", assignedTo: "u3", dueDate: "2025-04-15" },
  { id: "t10", title: "Entity Setup — Reem Holding", category: "Governance", status: "Completed", priority: "High", clientId: "c2", assignedTo: "u2", dueDate: "2025-04-10" },
  { id: "t11", title: "NDA Execution — New Subsidiary", category: "Legal", status: "Completed", priority: "Standard", clientId: "c2", assignedTo: "u2", dueDate: "2025-04-12" },
  { id: "t12", title: "March Retainer Invoicing", category: "Financial", status: "Completed", priority: "High", clientId: "c1", assignedTo: "u1", dueDate: "2025-04-01" },
  { id: "t13", title: "Onboarding — Mansouri Capital", category: "Admin", status: "Completed", priority: "Standard", clientId: "c1", assignedTo: "u2", dueDate: "2025-03-15" },
];

const APPROVALS: ApprovalItem[] = [
  { id: "ap1", type: "Legal", title: "NDA — New Subsidiary Agreement", subtitle: "Mutual NDA with one-way carveout. Prepared by Counsel for Principal authorization.", status: "Pending", date: "2025-04-22" },
  { id: "ap2", type: "Financial", title: "Invoice TED-0028 Release — AED 45,000", subtitle: "Monthly retainer + board preparation services for Mansouri Capital Group, April 2025.", status: "Pending", date: "2025-04-21" },
  { id: "ap3", type: "Governance", title: "Board Charter Amendment — Reem Holding", subtitle: "Amendment to governance charter reflecting new KSA subsidiary directors.", status: "Pending", date: "2025-04-20" },
  { id: "ap4", type: "Document", title: "Q1 Investor Update Deck", subtitle: "Final version pending Principal review before client distribution — Gulf Horizon Investments.", status: "Pending", date: "2025-04-19" },
  { id: "ap5", type: "Legal", title: "Power of Attorney — MISA Renewal", subtitle: "Limited PoA for MISA license renewal filing. Valid until 31 December 2025.", status: "Approved", date: "2025-04-18" },
  { id: "ap6", type: "Financial", title: "Invoice TED-0027 Release — AED 35,000", subtitle: "March retainer — Mansouri Capital Group.", status: "Approved", date: "2025-04-01" },
  { id: "ap7", type: "Document", title: "Entity Incorporation Certificate — Gulf Horizon", subtitle: "QFC registration document — certified copy filed and distributed.", status: "Approved", date: "2025-03-28" },
  { id: "ap8", type: "Governance", title: "Director Appointment Resolution", subtitle: "Resolution appointing Nasser Al-Thani as non-executive director — Reem Holding Co.", status: "Rejected", date: "2025-03-20" },
];

const INVOICES: Invoice[] = [
  { id: "inv1", clientId: "c1", period: "April 2025", description: "Monthly Retainer + Board Preparation Services", amount: 45000, currency: "AED", status: "Upcoming", date: "2025-04-01", dueDate: "2025-04-30" },
  { id: "inv2", clientId: "c1", period: "March 2025", description: "Monthly Retainer — Mansouri Capital Group", amount: 35000, currency: "AED", status: "Paid", date: "2025-03-01", dueDate: "2025-03-31" },
  { id: "inv3", clientId: "c1", period: "Feb 2025", description: "Monthly Retainer + Cross-border Coordination", amount: 42700, currency: "AED", status: "Paid", date: "2025-02-01", dueDate: "2025-02-28" },
  { id: "inv4", clientId: "c2", period: "Q1 2025", description: "Q1 Strategic Coordination Retainer — Reem Holding", amount: 40000, currency: "AED", status: "Paid", date: "2025-01-01", dueDate: "2025-01-31" },
  { id: "inv5", clientId: "c3", period: "April 2025", description: "Onboarding + Q2 Retainer — Gulf Horizon Investments", amount: 55000, currency: "AED", status: "Upcoming", date: "2025-04-20", dueDate: "2025-05-20" },
  { id: "inv6", clientId: "c2", period: "March 2025", description: "Monthly Retainer — Reem Holding Co.", amount: 38000, currency: "AED", status: "Paid", date: "2025-03-01", dueDate: "2025-03-31" },
];

const CLIENTS: Client[] = [
  {
    id: "c1", code: "MCG-001", name: "Khalid Al-Mansouri", initials: "KM",
    company: "Mansouri Capital Group", sector: "Family Office", tier: "Tier I C-Suite",
    country: "UAE", since: "Jan 2024", retainerPerMonth: 35000,
    totalInvoiced: 180000, pendingAmount: 45000,
    assignedTeam: ["u2", "u3"],
    onboarding: [
      { label: "Entity Setup", done: true }, { label: "AML / KYC Verification", done: true },
      { label: "Bank Account Configuration", done: false }, { label: "NDA Execution", done: true },
      { label: "Portal Onboarding", done: true },
    ],
  },
  {
    id: "c2", code: "RHC-002", name: "Sara Al-Rasheed", initials: "SR",
    company: "Reem Holding Co.", sector: "Private Equity", tier: "Tier II Founder",
    country: "KSA", since: "Mar 2024", retainerPerMonth: 38000,
    totalInvoiced: 95000, pendingAmount: 0,
    assignedTeam: ["u2"],
    onboarding: [
      { label: "Entity Setup", done: true }, { label: "AML / KYC Verification", done: true },
      { label: "Bank Account Configuration", done: true }, { label: "NDA Execution", done: true },
      { label: "Portal Onboarding", done: false },
    ],
  },
  {
    id: "c3", code: "GHI-003", name: "Mohammed Al-Thani", initials: "MT",
    company: "Gulf Horizon Investments", sector: "Sovereign Investments", tier: "Tier III Family Office",
    country: "Qatar", since: "Feb 2025", retainerPerMonth: 55000,
    totalInvoiced: 55000, pendingAmount: 55000,
    assignedTeam: ["u3"],
    onboarding: [
      { label: "Entity Setup", done: true }, { label: "AML / KYC Verification", done: false },
      { label: "Bank Account Configuration", done: false }, { label: "NDA Execution", done: true },
      { label: "Portal Onboarding", done: false },
    ],
  },
];

const LEADS: Lead[] = [
  { id: "l1", code: "AFV-004", initials: "AF", sector: "Conglomerate", location: "UAE", stage: "Negotiation", value: 120000, temperature: "hot" },
  { id: "l2", code: "ASD-005", initials: "AS", sector: "Energy", location: "KSA", stage: "Referred", value: 115000, temperature: "hot" },
  { id: "l3", code: "BRW-006", initials: "BW", sector: "Real Estate", location: "Qatar", stage: "Discussion", value: 80000, temperature: "warm" },
  { id: "l4", code: "EMP-007", initials: "EM", sector: "Property Dev.", location: "UAE", stage: "Proposal", value: 60000, temperature: "warm" },
];

const CRM_ACTIVITIES: CRMActivity[] = [
  { id: "ca1", date: "22 Apr", contact: "AFV-004", activity: "Term sheet reviewed — fee structure discussion ongoing", nextStep: "Final pricing call — 25 Apr", stage: "Negotiation" },
  { id: "ca2", date: "20 Apr", contact: "ASD-005", activity: "Warm introduction via MCG-001 — initial brief received", nextStep: "Capabilities presentation — 28 Apr", stage: "Referred" },
  { id: "ca3", date: "18 Apr", contact: "BRW-006", activity: "Discovery call — QFC entity governance needs", nextStep: "Scope proposal — 2 May", stage: "Discussion" },
  { id: "ca4", date: "15 Apr", contact: "EMP-007", activity: "Proposal submitted — family office coordination package", nextStep: "Awaiting feedback — follow up 30 Apr", stage: "Proposal" },
];

const TEAM: TeamMember[] = [
  { id: "u1", name: "Layla Al-Rashidi", role: "admin", email: "admin@executivedesk.ae", assignedClients: ["c1", "c2", "c3"], active: true },
  { id: "u2", name: "Samir Haddad", role: "counsel", email: "counsel@executivedesk.ae", assignedClients: ["c1", "c2"], active: true },
  { id: "u3", name: "Noor Al-Khalifa", role: "associate", email: "associate@executivedesk.ae", assignedClients: ["c1", "c3"], active: true },
];

const AUDIT_LOG: AuditEntry[] = [
  { id: "a1", action: "Portal Access Initiated", user: "Layla Al-Rashidi", timestamp: "Today · 09:14", detail: "Principal session started — IP 92.168.12.45 (Dubai, UAE)", category: "Portal Access", important: true },
  { id: "a2", action: "Invoice Generated", user: "Layla Al-Rashidi", timestamp: "Today · 09:32", detail: "TED-0028 drafted — AED 45,000 — Mansouri Capital Group", category: "Financial", important: true },
  { id: "a3", action: "Approval Action", user: "Layla Al-Rashidi", timestamp: "Today · 09:45", detail: "PoA — MISA Renewal approved and filed", category: "Approvals" },
  { id: "a4", action: "Time Entry Approved", user: "Layla Al-Rashidi", timestamp: "Today · 10:05", detail: "3.5h Governance — Q2 Board Pack (te1) approved", category: "Time" },
  { id: "a5", action: "Document Uploaded", user: "Noor Al-Khalifa", timestamp: "Today · 11:22", detail: "Q1 Investor Update Deck v3 uploaded to Vault — GHI-003", category: "Vault" },
  { id: "a6", action: "Task Status Updated", user: "Noor Al-Khalifa", timestamp: "Today · 12:30", detail: "Q2 Board Pack Preparation → In Progress", category: "Tasks" },
  { id: "a7", action: "CRM Activity Logged", user: "Samir Haddad", timestamp: "Today · 14:15", detail: "Discovery call recorded — BRW-006 — QFC governance scope", category: "CRM" },
  { id: "a8", action: "Portal Access Initiated", user: "Noor Al-Khalifa", timestamp: "Yesterday · 08:55", detail: "Associate session started — IP 85.202.14.77 (Abu Dhabi, UAE)", category: "Portal Access", important: true },
  { id: "a9", action: "Time Entry Submitted", user: "Noor Al-Khalifa", timestamp: "Yesterday · 16:40", detail: "2.0h Advisory — KSA expansion meeting submitted for approval", category: "Time" },
  { id: "a10", action: "Financial Approval", user: "Layla Al-Rashidi", timestamp: "01 Apr · 00:00", detail: "TED-0027 marked Paid — AED 35,000 — Mansouri Capital Group", category: "Financial", important: true },
];

// Monthly performance data
export const MONTHLY_DATA = [
  { month: "Jan", revenue: 60000, hours: 88, retainer: 60000, overage: 0 },
  { month: "Feb", revenue: 102000, hours: 102, retainer: 60000, overage: 42000 },
  { month: "Mar", revenue: 73000, hours: 118, retainer: 60000, overage: 13000 },
  { month: "Apr", revenue: 67700, hours: 124, retainer: 60000, overage: 7700 },
  { month: "May", revenue: 60000, hours: 130, retainer: 60000, overage: 0 },
];

export const GOAL_PROGRESS = [
  { goal: "Governance", pct: 92 }, { goal: "Ops Systems", pct: 87 },
  { goal: "Cross-Border", pct: 64 }, { goal: "Comms", pct: 58 },
  { goal: "Vault", pct: 43 }, { goal: "Advisory", pct: 38 },
];

export const RADAR_DATA = [
  { axis: "Board", score: 88 }, { axis: "Ops", score: 82 },
  { axis: "Comms", score: 78 }, { axis: "Legal", score: 92 },
  { axis: "Advisory", score: 85 },
];

export const TIME_CATEGORIES = [
  { name: "Governance", hours: 34 }, { name: "Advisory", hours: 26 },
  { name: "Comms", hours: 20 }, { name: "Docs", hours: 18 },
  { name: "Research", hours: 12 }, { name: "Coord", hours: 8 },
  { name: "Other", hours: 6 },
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
  updateTimeStatus: (id: string, status: TimeStatus) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateApproval: (id: string, status: "Approved" | "Rejected") => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus, note?: string) => void;
  addAuditEntry: (entry: Omit<AuditEntry, "id">) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function PortalDataProvider({ children }: { children: ReactNode }) {
  const [timeEntries, setTimeEntries] = useState(TIME_ENTRIES);
  const [tasks, setTasks] = useState(TASKS);
  const [approvals, setApprovals] = useState(APPROVALS);
  const [invoices, setInvoices] = useState(INVOICES);
  const [auditLog, setAuditLog] = useState(AUDIT_LOG);

  const addAuditEntry = (entry: Omit<AuditEntry, "id">) =>
    setAuditLog((prev) => [{ ...entry, id: `a${Date.now()}` }, ...prev]);

  const updateTimeStatus = (id: string, status: TimeStatus) => {
    setTimeEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    addAuditEntry({ action: "Time Entry Updated", user: "Current User", timestamp: `Today · ${new Date().toLocaleTimeString("en-AE", { hour: "2-digit", minute: "2-digit" })}`, detail: `Time entry status → ${status}`, category: "Time" });
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    addAuditEntry({ action: "Task Status Updated", user: "Current User", timestamp: `Today · ${new Date().toLocaleTimeString("en-AE", { hour: "2-digit", minute: "2-digit" })}`, detail: `Task → ${status}`, category: "Tasks" });
  };

  const updateApproval = (id: string, status: "Approved" | "Rejected") => {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    addAuditEntry({ action: `Approval ${status}`, user: "Layla Al-Rashidi", timestamp: `Today · ${new Date().toLocaleTimeString("en-AE", { hour: "2-digit", minute: "2-digit" })}`, detail: `Approval item #${id} → ${status}`, category: "Approvals", important: true });
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus, note?: string) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status, disputeNote: note } : inv)));
    addAuditEntry({ action: `Invoice ${status}`, user: "Current User", timestamp: `Today · ${new Date().toLocaleTimeString("en-AE", { hour: "2-digit", minute: "2-digit" })}`, detail: `Invoice #${id} → ${status}${note ? ` — ${note}` : ""}`, category: "Financial", important: true });
  };

  return (
    <DataContext.Provider value={{
      timeEntries, tasks, approvals, invoices, clients: CLIENTS, leads: LEADS,
      crmActivities: CRM_ACTIVITIES, team: TEAM, auditLog,
      updateTimeStatus, updateTaskStatus, updateApproval, updateInvoiceStatus, addAuditEntry,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function usePortalData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("usePortalData must be used within PortalDataProvider");
  return ctx;
}
