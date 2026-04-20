import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { usePortalAuth } from "@/lib/portal-auth";
import { ModeToggle } from "./mode-toggle";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Receipt,
  UserCheck,
  Activity,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Briefcase,
  UserCircle,
} from "lucide-react";
import logoPath from "@assets/ED_Logo_1776701058230.png";

const ROLE_LABELS: Record<string, string> = {
  admin: "Principal",
  counsel: "Counsel",
  associate: "Associate",
  client: "Client",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-[#9B8B5F]/20 text-[#9B8B5F]",
  counsel: "bg-blue-500/10 text-blue-400",
  associate: "bg-green-500/10 text-green-400",
  client: "bg-purple-500/10 text-purple-400",
};

function navItems(role: string) {
  const base = [
    { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/portal/billing", label: "Billing", icon: Receipt },
    { href: "/portal/profile", label: "My Profile", icon: UserCircle },
  ];

  const counselUp = [
    { href: "/portal/clients", label: "Clients", icon: Briefcase },
    { href: "/portal/team", label: "Team", icon: Users },
  ];

  const adminOnly = [
    { href: "/portal/audit", label: "Audit Log", icon: Activity },
    { href: "/portal/access", label: "Access Control", icon: Shield },
  ];

  if (role === "admin") return [...base.slice(0, 2), ...counselUp, base[2], ...adminOnly, base[3]];
  if (role === "counsel") return [...base.slice(0, 2), ...counselUp, base[2], base[3]];
  if (role === "associate") return [base[0], base[1], base[3]];
  return [base[0], base[2], base[3]]; // client
}

export function PortalLayout({ children }: { children: ReactNode }) {
  const { user, logout } = usePortalAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const items = navItems(user.role);

  return (
    <div className="min-h-screen flex bg-[#0F0F0F] text-[#F8F8F6]">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#141414] border-r border-[#222222] transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-16"} lg:w-64`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[#222222] min-h-[64px]">
          <div className="w-8 h-8 flex-shrink-0 bg-black rounded-sm overflow-hidden border border-[#333]">
            <img src={logoPath} alt="ED" className="w-full h-full object-contain" />
          </div>
          <div className={`overflow-hidden transition-all ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 lg:opacity-100 lg:w-auto"}`}>
            <p className="font-serif text-sm text-[#F8F8F6] whitespace-nowrap">The Executive Desk</p>
            <p className="text-[#9B8B5F] text-xs tracking-wider">Portal</p>
          </div>
        </div>

        {/* User badge */}
        <div className={`px-3 py-4 border-b border-[#222222] ${sidebarOpen ? "" : "hidden lg:block"}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#9B8B5F]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#9B8B5F] text-xs font-medium">
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div className={`overflow-hidden ${sidebarOpen ? "" : "hidden lg:block"}`}>
              <p className="text-[#F8F8F6] text-xs font-medium truncate max-w-[130px]">{user.name}</p>
              <span className={`text-xs px-1.5 py-0.5 rounded-sm font-medium ${ROLE_COLORS[user.role]}`}>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const active = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-sm mb-0.5 transition-colors group
                  ${active
                    ? "bg-[#9B8B5F]/15 text-[#9B8B5F] border-l-2 border-[#9B8B5F]"
                    : "text-[#888888] hover:text-[#F8F8F6] hover:bg-[#1F1F1F]"
                  }`}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className={`text-sm whitespace-nowrap overflow-hidden ${sidebarOpen ? "" : "hidden lg:block"}`}>
                  {item.label}
                </span>
                {active && (
                  <ChevronRight size={12} className={`ml-auto text-[#9B8B5F] ${sidebarOpen ? "" : "hidden lg:block"}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#222222] p-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-sm text-[#555555] hover:text-[#888888] hover:bg-[#1A1A1A] transition-colors text-xs"
            data-testid="nav-back-to-site"
          >
            <ChevronRight size={14} className="rotate-180 flex-shrink-0" />
            <span className={`whitespace-nowrap ${sidebarOpen ? "" : "hidden lg:block"}`}>Back to Site</span>
          </Link>
          <button
            onClick={logout}
            data-testid="button-logout"
            className="flex items-center gap-3 px-3 py-2 rounded-sm text-[#555555] hover:text-red-400 hover:bg-red-400/5 transition-colors text-xs w-full"
          >
            <LogOut size={14} className="flex-shrink-0" />
            <span className={`whitespace-nowrap ${sidebarOpen ? "" : "hidden lg:block"}`}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#222222] bg-[#141414] sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-[#888888] hover:text-[#F8F8F6] transition-colors"
              data-testid="button-sidebar-toggle"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <p className="text-[#F8F8F6] text-sm font-medium">
                {items.find((i) => location.startsWith(i.href))?.label ?? "Portal"}
              </p>
              <p className="text-[#555555] text-xs">The Executive Desk — Secure Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <div className={`text-xs px-2 py-1 rounded-sm font-medium ${ROLE_COLORS[user.role]}`}>
              {ROLE_LABELS[user.role]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
