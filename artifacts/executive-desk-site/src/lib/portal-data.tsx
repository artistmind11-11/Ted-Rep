import { createContext, useContext, useState, ReactNode } from "react";

export type TaskStatus = "Pending" | "Active" | "Completed" | "Blocked";
export type TaskPriority = "Low" | "Medium" | "High";
export type InvoiceStatus = "Draft" | "Pending" | "Approved" | "Paid" | "Disputed";
export type LeadStage = "Initial" | "Qualified" | "Proposal" | "Won" | "Lost";
export type OnboardingStep = { label: string; done: boolean };

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  clientId: string;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  description: string;
  date: string;
  dueDate: string;
  disputeNote?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  country: string;
  contact: string;
  email: string;
  assignedTeam: string[];
  onboarding: OnboardingStep[];
  totalInvoiced: number;
  pendingAmount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: "admin" | "counsel" | "associate";
  email: string;
  assignedClients: string[];
  active: boolean;
}

export interface Lead {
  id: string;
  company: string;
  contact: string;
  country: string;
  stage: LeadStage;
  estimatedValue: number;
  notes: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  detail: string;
}

interface DataContextType {
  tasks: Task[];
  invoices: Invoice[];
  clients: Client[];
  team: TeamMember[];
  leads: Lead[];
  auditLog: AuditEntry[];
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus, note?: string) => void;
  addAuditEntry: (entry: Omit<AuditEntry, "id">) => void;
}

const CLIENTS: Client[] = [
  {
    id: "c1",
    name: "Khalid Al-Mansouri",
    company: "Mansouri Capital Group",
    country: "UAE",
    contact: "+971 50 123 4567",
    email: "k.almansouri@mansouricapital.ae",
    assignedTeam: ["u2", "u3"],
    onboarding: [
      { label: "Entity Setup", done: true },
      { label: "AML / KYC Verification", done: true },
      { label: "Bank Account Configuration", done: false },
      { label: "NDA Execution", done: true },
      { label: "Portal Onboarding", done: true },
    ],
    totalInvoiced: 180000,
    pendingAmount: 45000,
  },
  {
    id: "c2",
    name: "Sara Al-Rasheed",
    company: "Reem Holding Co.",
    country: "KSA",
    contact: "+966 55 987 6543",
    email: "s.rasheed@reemholding.sa",
    assignedTeam: ["u2"],
    onboarding: [
      { label: "Entity Setup", done: true },
      { label: "AML / KYC Verification", done: true },
      { label: "Bank Account Configuration", done: true },
      { label: "NDA Execution", done: true },
      { label: "Portal Onboarding", done: false },
    ],
    totalInvoiced: 95000,
    pendingAmount: 0,
  },
  {
    id: "c3",
    name: "Mohammed Al-Thani",
    company: "Gulf Horizon Investments",
    country: "Qatar",
    contact: "+974 55 234 5678",
    email: "m.althani@gulfhorizon.qa",
    assignedTeam: ["u3"],
    onboarding: [
      { label: "Entity Setup", done: true },
      { label: "AML / KYC Verification", done: false },
      { label: "Bank Account Configuration", done: false },
      { label: "NDA Execution", done: true },
      { label: "Portal Onboarding", done: false },
    ],
    totalInvoiced: 55000,
    pendingAmount: 55000,
  },
];

const TASKS: Task[] = [
  {
    id: "t1",
    title: "Q2 Board Pack Preparation",
    description: "Compile and format board pack for Mansouri Capital Group Q2 board meeting. Includes financials, agenda, and pre-read materials.",
    status: "Active",
    priority: "High",
    clientId: "c1",
    assignedTo: "u3",
    dueDate: "2025-05-15",
    createdAt: "2025-04-20",
  },
  {
    id: "t2",
    title: "MISA License Renewal Coordination",
    description: "Coordinate MISA license renewal documentation for Reem Holding Co. KSA entity. Liaise with legal counsel.",
    status: "Pending",
    priority: "High",
    clientId: "c2",
    assignedTo: "u2",
    dueDate: "2025-05-30",
    createdAt: "2025-04-18",
  },
  {
    id: "t3",
    title: "Investor Update Deck — Q1 Results",
    description: "Draft and finalize investor update presentation for Gulf Horizon Investments Q1 results distribution.",
    status: "Completed",
    priority: "Medium",
    clientId: "c3",
    assignedTo: "u3",
    dueDate: "2025-04-30",
    createdAt: "2025-04-10",
  },
  {
    id: "t4",
    title: "Travel Logistics: London Board Trip",
    description: "Coordinate travel logistics for Khalid Al-Mansouri and two board members — Dubai to London, 12–15 May. Hotel, meetings, visas.",
    status: "Active",
    priority: "Medium",
    clientId: "c1",
    assignedTo: "u3",
    dueDate: "2025-05-10",
    createdAt: "2025-04-22",
  },
  {
    id: "t5",
    title: "NDA Review — New Subsidiary",
    description: "Review and prepare NDA for new subsidiary relationship. Client requires mutual NDA with one-way carveout.",
    status: "Blocked",
    priority: "Low",
    clientId: "c2",
    assignedTo: "u2",
    dueDate: "2025-05-20",
    createdAt: "2025-04-15",
  },
];

const INVOICES: Invoice[] = [
  {
    id: "inv1",
    clientId: "c1",
    amount: 45000,
    currency: "AED",
    status: "Pending",
    description: "Monthly Retainer — April 2025 + Board Preparation Services",
    date: "2025-04-01",
    dueDate: "2025-04-30",
  },
  {
    id: "inv2",
    clientId: "c1",
    amount: 35000,
    currency: "AED",
    status: "Paid",
    description: "Monthly Retainer — March 2025",
    date: "2025-03-01",
    dueDate: "2025-03-31",
  },
  {
    id: "inv3",
    clientId: "c2",
    amount: 40000,
    currency: "AED",
    status: "Paid",
    description: "Q1 Strategic Coordination Retainer",
    date: "2025-01-01",
    dueDate: "2025-01-31",
  },
  {
    id: "inv4",
    clientId: "c3",
    amount: 55000,
    currency: "AED",
    status: "Draft",
    description: "Onboarding + Q2 Retainer — Gulf Horizon Investments",
    date: "2025-04-20",
    dueDate: "2025-05-20",
  },
];

const TEAM: TeamMember[] = [
  {
    id: "u1",
    name: "Layla Al-Rashidi",
    role: "admin",
    email: "admin@executivedesk.ae",
    assignedClients: ["c1", "c2", "c3"],
    active: true,
  },
  {
    id: "u2",
    name: "Samir Haddad",
    role: "counsel",
    email: "counsel@executivedesk.ae",
    assignedClients: ["c1", "c2"],
    active: true,
  },
  {
    id: "u3",
    name: "Noor Al-Khalifa",
    role: "associate",
    email: "associate@executivedesk.ae",
    assignedClients: ["c1", "c3"],
    active: true,
  },
];

const LEADS: Lead[] = [
  {
    id: "l1",
    company: "Al-Futtaim Ventures",
    contact: "Ahmed Al-Futtaim",
    country: "UAE",
    stage: "Proposal",
    estimatedValue: 180000,
    notes: "Referred by existing client. Interested in full strategic coordination package.",
    createdAt: "2025-04-10",
  },
  {
    id: "l2",
    company: "Aramco Subsidiaries Ltd",
    contact: "Fahd Al-Qahtani",
    country: "KSA",
    stage: "Qualified",
    estimatedValue: 240000,
    notes: "Requires MISA-specific expertise. Board governance focus.",
    createdAt: "2025-04-05",
  },
  {
    id: "l3",
    company: "Barwa Real Estate",
    contact: "Nasser Al-Thani",
    country: "Qatar",
    stage: "Initial",
    estimatedValue: 120000,
    notes: "QFC entity. Initial interest in governance documentation support.",
    createdAt: "2025-04-18",
  },
  {
    id: "l4",
    company: "Emaar Properties (Family Office)",
    contact: "Reem Alabbar",
    country: "UAE",
    stage: "Won",
    estimatedValue: 300000,
    notes: "Engagement confirmed. Onboarding initiated.",
    createdAt: "2025-03-15",
  },
];

const AUDIT_LOG: AuditEntry[] = [
  { id: "a1", action: "Task Created", user: "Layla Al-Rashidi", timestamp: "2025-04-22 09:14", detail: "Task: Travel Logistics London created for Mansouri Capital Group" },
  { id: "a2", action: "Invoice Generated", user: "Layla Al-Rashidi", timestamp: "2025-04-20 11:32", detail: "Invoice #inv4 drafted for Gulf Horizon Investments — AED 55,000" },
  { id: "a3", action: "Task Updated", user: "Noor Al-Khalifa", timestamp: "2025-04-20 10:05", detail: "Task: Q2 Board Pack status updated → Active" },
  { id: "a4", action: "Client Onboarding", user: "Samir Haddad", timestamp: "2025-04-18 14:22", detail: "Entity Setup completed for Gulf Horizon Investments" },
  { id: "a5", action: "Task Created", user: "Samir Haddad", timestamp: "2025-04-18 09:00", detail: "Task: MISA License Renewal created for Reem Holding Co." },
  { id: "a6", action: "Invoice Paid", user: "System", timestamp: "2025-04-01 00:00", detail: "Invoice #inv3 marked Paid — AED 40,000 from Reem Holding Co." },
];

const DataContext = createContext<DataContextType | null>(null);

export function PortalDataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(AUDIT_LOG);

  const addAuditEntry = (entry: Omit<AuditEntry, "id">) => {
    const newEntry = { ...entry, id: `a${Date.now()}` };
    setAuditLog((prev) => [newEntry, ...prev]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    addAuditEntry({
      action: "Task Updated",
      user: "Current User",
      timestamp: new Date().toLocaleString("en-AE"),
      detail: `Task status updated to ${status}`,
    });
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus, note?: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status, disputeNote: note } : inv
      )
    );
    addAuditEntry({
      action: `Invoice ${status}`,
      user: "Current User",
      timestamp: new Date().toLocaleString("en-AE"),
      detail: `Invoice #${id} status updated to ${status}${note ? ` — Note: ${note}` : ""}`,
    });
  };

  return (
    <DataContext.Provider
      value={{
        tasks,
        invoices,
        clients: CLIENTS,
        team: TEAM,
        leads: LEADS,
        auditLog,
        updateTaskStatus,
        updateInvoiceStatus,
        addAuditEntry,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function usePortalData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("usePortalData must be used within PortalDataProvider");
  return ctx;
}
