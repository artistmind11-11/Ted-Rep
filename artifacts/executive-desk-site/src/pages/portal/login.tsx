import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { usePortalAuth, DEMO_USERS, UserRole } from "@/lib/portal-auth";
import { Lock, Shield, Key, Users, Briefcase, UserCircle, ArrowRight } from "lucide-react";
import logoPath from "@assets/No_text_transparent_logo_new.png";

const ROLE_INFO: Record<UserRole, { label: string; subtitle: string; icon: React.ComponentType<{size?: number; className?: string}>; color: string; border: string; description: string }> = {
  admin: {
    label: "Principal",
    subtitle: "Full System Access",
    icon: Shield,
    color: "text-[#9B8B5F]",
    border: "border-[#9B8B5F]/40 hover:border-[#9B8B5F]",
    description: "Complete sovereignty over all clients, billing, team, audit logs, and access control.",
  },
  counsel: {
    label: "Counsel",
    subtitle: "Operational Management",
    icon: Briefcase,
    color: "text-blue-400",
    border: "border-blue-500/30 hover:border-blue-400",
    description: "High-level client and associate coordination, billing visibility, and task management.",
  },
  associate: {
    label: "Associate",
    subtitle: "Task Execution",
    icon: Users,
    color: "text-green-400",
    border: "border-green-500/30 hover:border-green-400",
    description: "Task execution, client-facing deliverables, and assigned workflow management.",
  },
  client: {
    label: "Client",
    subtitle: "Personal View Only",
    icon: UserCircle,
    color: "text-purple-400",
    border: "border-purple-500/30 hover:border-purple-400",
    description: "View your own tasks, invoices, onboarding progress, and assigned team.",
  },
};

export default function PortalLogin() {
  const { login } = usePortalAuth();
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string | null>(null);

  const handleAccess = (userId: string) => {
    login(userId);
    setLocation("/portal/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] px-4 py-16 relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #9B8B5F 1px, transparent 1px),
            linear-gradient(to bottom, #9B8B5F 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-black border border-[#9B8B5F]/30 rounded-sm flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#9B8B5F]/5">
            <img src={logoPath} alt="The Executive Desk" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="font-serif text-3xl text-[#F8F8F6] mb-2">Client Portal</h1>
          <p className="text-[#555555] text-sm">Select your access level to continue</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {(Object.keys(ROLE_INFO) as UserRole[]).map((role, i) => {
            const info = ROLE_INFO[role];
            const user = DEMO_USERS.find((u) => u.role === role);
            const Icon = info.icon;
            const isSelected = selected === role;

            return (
              <motion.button
                key={role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(isSelected ? null : role)}
                data-testid={`button-role-${role}`}
                className={`text-left border rounded-sm p-6 transition-all duration-200 bg-[#141414] ${info.border} ${
                  isSelected ? "bg-[#1A1A1A]" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full bg-[#1F1F1F] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={info.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-serif text-lg ${info.color}`}>{info.label}</p>
                      {isSelected && (
                        <div className={`w-2 h-2 rounded-full ${role === "admin" ? "bg-[#9B8B5F]" : role === "counsel" ? "bg-blue-400" : role === "associate" ? "bg-green-400" : "bg-purple-400"}`} />
                      )}
                    </div>
                    <p className="text-[#666666] text-xs mb-3">{info.subtitle}</p>
                    <p className="text-[#888888] text-xs leading-relaxed">{info.description}</p>
                  </div>
                </div>

                {isSelected && user && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-[#2A2A2A]"
                  >
                    <p className="text-[#555555] text-xs mb-3">Sign in as:</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#F8F8F6] text-sm">{user.name}</p>
                        <p className="text-[#444444] text-xs">{user.email}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAccess(user.id); }}
                        data-testid={`button-login-${role}`}
                        className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider rounded-sm transition-colors
                          ${role === "admin" ? "bg-[#9B8B5F] text-[#F8F8F6] hover:bg-[#8A7A4F]"
                          : role === "counsel" ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                          : role === "associate" ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                          : "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"}`}
                      >
                        Enter Portal <ArrowRight size={12} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Security strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[#444444] text-xs border-t border-[#1F1F1F] pt-6">
          <span className="flex items-center gap-2"><Lock size={12} className="text-[#9B8B5F]" /> AES-256 Encrypted</span>
          <span className="flex items-center gap-2"><Key size={12} className="text-[#9B8B5F]" /> Role-Isolated Data</span>
          <span className="flex items-center gap-2"><Shield size={12} className="text-[#9B8B5F]" /> Audit Logged</span>
        </div>
      </motion.div>
    </div>
  );
}
