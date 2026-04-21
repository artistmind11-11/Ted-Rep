import { createContext, useContext, useState, useCallback, ReactNode } from "react";

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
  | "view_audit_log" | "view_kpis" | "dispute_invoice" | "view_own_profile"
  | "delete_invoice" | "edit_invoice" | "mark_invoice_paid" | "request_approval"
  | "manage_team" | "assign_clients" | "set_custom_perms";

export const ALL_PERMISSIONS: PermissionAction[] = [
  "view_all_clients", "view_crm", "view_billing_all", "view_billing_own",
  "view_team", "manage_users", "grant_access", "revoke_access",
  "create_tasks", "approve_tasks", "view_tasks_all", "view_tasks_own",
  "view_audit_log", "view_kpis", "dispute_invoice", "view_own_profile",
  "delete_invoice", "edit_invoice", "mark_invoice_paid", "request_approval",
  "manage_team", "assign_clients", "set_custom_perms",
];

const PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  admin: [
    "view_all_clients", "view_crm", "view_billing_all", "view_billing_own",
    "view_team", "manage_users", "grant_access", "revoke_access",
    "create_tasks", "approve_tasks", "view_tasks_all", "view_tasks_own",
    "view_audit_log", "view_kpis", "view_own_profile",
    "delete_invoice", "edit_invoice", "mark_invoice_paid",
    "manage_team", "assign_clients", "set_custom_perms",
  ],
  counsel: [
    "view_all_clients", "view_crm", "view_billing_all", "view_billing_own",
    "view_team", "create_tasks", "approve_tasks", "view_tasks_all",
    "view_tasks_own", "view_kpis", "view_own_profile",
    "edit_invoice", "mark_invoice_paid", "request_approval",
    "manage_team", "assign_clients",
  ],
  associate: [
    "create_tasks", "view_tasks_all", "view_tasks_own", "view_own_profile",
    "request_approval",
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
  customPermissions: Record<string, PermissionAction[]>;
  setUserCustomPermissions: (userId: string, perms: PermissionAction[]) => void;
  getEffectivePermissions: (userId: string, role: UserRole) => PermissionAction[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [customPermissions, setCustomPermissions] = useState<Record<string, PermissionAction[]>>({});

  const login = (userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) setUser(found);
  };

  const logout = () => setUser(null);

  const getEffectivePermissions = useCallback((userId: string, role: UserRole): PermissionAction[] => {
    const base = PERMISSIONS[role] ?? [];
    const overrides = customPermissions[userId];
    if (!overrides) return base;
    const set = new Set<PermissionAction>([...base, ...overrides]);
    return Array.from(set);
  }, [customPermissions]);

  const can = (action: PermissionAction): boolean => {
    if (!user) return false;
    const effective = getEffectivePermissions(user.id, user.role);
    return effective.includes(action);
  };

  const setUserCustomPermissions = useCallback((userId: string, perms: PermissionAction[]) => {
    setCustomPermissions((prev) => ({ ...prev, [userId]: perms }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, can, customPermissions, setUserCustomPermissions, getEffectivePermissions }}>
      {children}
    </AuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return ctx;
}

export { DEMO_USERS, PERMISSIONS };
