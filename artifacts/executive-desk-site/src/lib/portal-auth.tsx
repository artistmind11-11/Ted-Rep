import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "counsel" | "associate" | "client";

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clientId?: string;
}

const DEMO_USERS: PortalUser[] = [
  { id: "u1", name: "Layla Al-Rashidi",  email: "admin@executivedesk.ae",     role: "admin" },
  { id: "u2", name: "Samir Haddad",      email: "counsel@executivedesk.ae",   role: "counsel" },
  { id: "u3", name: "Noor Al-Khalifa",   email: "associate@executivedesk.ae", role: "associate" },
  { id: "u4", name: "Khalid Al-Mansouri",email: "client@executivedesk.ae",    role: "client", clientId: "c1" },
];

export type PermissionAction =
  | "view_all_clients" | "view_crm" | "view_billing_all" | "view_billing_own"
  | "view_team" | "manage_users" | "grant_access" | "revoke_access"
  | "create_tasks" | "approve_tasks" | "view_tasks_all" | "view_tasks_own"
  | "view_audit_log" | "view_kpis" | "dispute_invoice" | "view_own_profile";

const PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  admin: [
    "view_all_clients", "view_crm", "view_billing_all", "view_billing_own",
    "view_team", "manage_users", "grant_access", "revoke_access",
    "create_tasks", "approve_tasks", "view_tasks_all", "view_tasks_own",
    "view_audit_log", "view_kpis", "view_own_profile",
  ],
  counsel: [
    "view_all_clients", "view_crm", "view_billing_all", "view_billing_own",
    "view_team", "create_tasks", "approve_tasks", "view_tasks_all",
    "view_tasks_own", "view_kpis", "view_own_profile",
  ],
  associate: [
    "create_tasks", "view_tasks_all", "view_tasks_own", "view_own_profile",
  ],
  client: [
    "view_billing_own", "view_tasks_own", "dispute_invoice", "view_own_profile",
  ],
};

interface AuthContextType {
  user: PortalUser | null;
  login: (userId: string) => void;
  logout: () => void;
  can: (action: PermissionAction) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);

  const login = (userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) setUser(found);
  };

  const logout = () => setUser(null);

  const can = (action: PermissionAction): boolean => {
    if (!user) return false;
    return PERMISSIONS[user.role].includes(action);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return ctx;
}

export { DEMO_USERS };
