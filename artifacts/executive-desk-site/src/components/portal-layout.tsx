import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { usePortalAuth } from "@/lib/portal-auth";
import { ModeToggle } from "./mode-toggle";
import {
  LayoutDashboard, CheckSquare, Users, Receipt, UserCheck, Activity,
  LogOut, Menu, X, ChevronRight, Shield, Briefcase, UserCircle,
  Clock, ThumbsUp, BarChart2, Globe,
} from "lucide-react";
import logoPath from "@assets/ED_Logo_1776701058230.png";

const ROLE_LABELS: Record<string, string> = {
  admin: "Principal", counsel: "Counsel", associate: "Associate", client: "Client",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-[#9B8B5F]/20 text-[#9B8B5F]",
  counsel: "bg-blue-500/10 text-blue-400",
  associate: "bg-green-500/10 text-green-400",
  client: "bg-purple-500/10 text-purple-400",
};

type NavItem = { href: string; label: string; icon: React.ComponentType<{size?: number; className?: string}> };

function navItems(role: string): NavItem[] {
  const dashboard  = { href: "/portal/dashboard",      label: "Dashboard",      icon: LayoutDashboard };
  const tasks      = { href: "/portal/tasks",           label: "Tasks",          icon: CheckSquare };
  const time       = { href: "/portal/time-tracking",   label: "Time Tracking",  icon: Clock };
  const approvals  = { href: "/portal/approvals",       label: "Approvals",      icon: ThumbsUp };
  const billing    = { href: "/portal/billing",         label: "Billing",        icon: Receipt };
  const clients    = { href: "/portal/clients",         label: "Clients",        icon: Briefcase };
  const team       = { href: "/portal/team",            label: "Team",           icon: Users };
  const crm        = { href: "/portal/crm",             label: "CRM",            icon: Globe };
  const reports    = { href: "/portal/reports",         label: "Reports",        icon: BarChart2 };
  const audit      = { href: "/portal/audit",           label: "Audit Log",      icon: Activity };
  const access     = { href: "/portal/access",          label: "Access Control", icon: Shield };
  const profile    = { href: "/portal/profile",         label: "My Profile",     icon: UserCircle };

  if (role === "admin")     return [dashboard, time, tasks, approvals, clients, crm, billing, team, reports, audit, access, profile];
  if (role === "counsel")   return [dashboard, time, tasks, approvals, clients, crm, billing, team, reports, profile];
  if (role === "associate") return [dashboard, time, tasks, profile];
  return [dashboard, billing, profile]; // client
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
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#0D0D0D] border-r border-[#181818] transition-all duration-300
        ${sidebarOpen ? "w-56" : "w-0 lg:w-56"} overflow-hidden`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[#181818] min-h-[64px] flex-shrink-0">
          <div className="w-7 h-7 flex-shrink-0 bg-black rounded-sm overflow-hidden border border-[#333]">
            <img src={logoPath} alt="ED" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-serif text-xs text-[#F8F8F6] whitespace-nowrap leading-tight">The Executive Desk</p>
            <p className="text-[#9B8B5F] text-[9px] tracking-widest uppercase">Secure Portal</p>
          </div>
        </div>

        {/* User badge */}
        <div className="px-3 py-3.5 border-b border-[#181818] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#9B8B5F]/15 flex items-center justify-center flex-shrink-0 border border-[#9B8B5F]/20">
              <span className="text-[#9B8B5F] text-[10px] font-medium">
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-[#F8F8F6] text-xs font-medium truncate">{user.name}</p>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-medium inline-block mt-0.5 ${ROLE_COLORS[user.role]}`}>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
          {items.map((item) => {
            const Icon = item.icon;
            const active = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 mx-2 px-2.5 py-2 rounded-sm mb-0.5 transition-colors group text-sm
                  ${active
                    ? "bg-[#9B8B5F]/10 text-[#9B8B5F] border-l border-[#9B8B5F]"
                    : "text-[#555] hover:text-[#F8F8F6] hover:bg-[#141414]"}`}>
                <Icon size={14} className="flex-shrink-0" />
                <span className="truncate text-xs">{item.label}</span>
                {active && <ChevronRight size={11} className="ml-auto text-[#9B8B5F] flex-shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#181818] p-2.5 space-y-0.5 flex-shrink-0">
          <Link href="/"
            className="flex items-center gap-2 px-2.5 py-2 rounded-sm text-[#444] hover:text-[#666] hover:bg-[#111] transition-colors text-xs">
            <ChevronRight size={12} className="rotate-180 flex-shrink-0" />
            <span>Back to Site</span>
          </Link>
          <button onClick={logout}
            className="flex items-center gap-2 px-2.5 py-2 rounded-sm text-[#444] hover:text-red-400 hover:bg-red-400/5 transition-colors text-xs w-full">
            <LogOut size={12} className="flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-56">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-5 border-b border-[#181818] bg-[#0D0D0D] sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 text-[#555] hover:text-[#F8F8F6] transition-colors rounded-sm hover:bg-[#141414]">
              {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <div>
              <p className="text-[#F8F8F6] text-sm font-medium">
                {items.find((i) => location.startsWith(i.href))?.label ?? "Portal"}
              </p>
              <p className="text-[#333] text-[10px]">The Executive Desk</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <div className={`text-[9px] px-2 py-1 rounded-sm font-medium uppercase tracking-widest ${ROLE_COLORS[user.role]}`}>
              {ROLE_LABELS[user.role]}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
