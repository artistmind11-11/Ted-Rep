import { motion } from "framer-motion";
import { usePortalAuth } from "@/lib/portal-auth";
import { usePortalData } from "@/lib/portal-data";
import { Shield, Briefcase, User, CheckCircle2, ShieldOff } from "lucide-react";

const ROLE_CONFIG: Record<string, { label: string; color: string; border: string; icon: React.ComponentType<{size?: number; className?: string}> }> = {
  admin:     { label: "Principal", color: "text-[#9B8B5F]",  border: "border-[#9B8B5F]/20 bg-[#9B8B5F]/10",   icon: Shield },
  counsel:   { label: "Counsel",   color: "text-blue-400",   border: "border-blue-400/20 bg-blue-400/10",      icon: Briefcase },
  associate: { label: "Associate", color: "text-green-400",  border: "border-green-400/20 bg-green-400/10",    icon: User },
};

export default function Team() {
  const { can } = usePortalAuth();
  const { team, clients } = usePortalData();

  if (!can("view_team")) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldOff size={32} className="text-[#333] mb-4" />
        <h2 className="font-serif text-xl text-[#F8F8F6] mb-2">Access Restricted</h2>
        <p className="text-[#555] text-sm">Team management requires Counsel or Principal access.</p>
      </div>
    );
  }

  const byRole = {
    admin:     team.filter((m) => m.role === "admin"),
    counsel:   team.filter((m) => m.role === "counsel"),
    associate: team.filter((m) => m.role === "associate"),
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-[#9B8B5F] text-xs uppercase tracking-widest mb-1">Internal</p>
        <h1 className="font-serif text-2xl text-[#F8F8F6]">Team</h1>
        <p className="text-[#555] text-sm mt-0.5">{team.length} active members</p>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(["admin", "counsel", "associate"] as const).map((role) => {
          const cfg = ROLE_CONFIG[role];
          const Icon = cfg.icon;
          return (
            <motion.div key={role} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className={`bg-[#141414] border rounded-sm p-5 ${cfg.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={13} className={cfg.color} />
                <p className={`text-xs ${cfg.color}`}>{cfg.label}</p>
              </div>
              <p className="font-serif text-2xl text-[#F8F8F6]">{byRole[role].length}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Team member cards */}
      <div className="space-y-3">
        {team.map((member, i) => {
          const cfg = ROLE_CONFIG[member.role];
          const Icon = cfg.icon;
          const assignedClients = clients.filter((c) => member.assignedClients.includes(c.id));

          return (
            <motion.div key={member.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-[#141414] border border-[#222] rounded-sm p-5 hover:border-[#2A2A2A] transition-colors"
              data-testid={`team-card-${member.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#9B8B5F] text-sm font-serif">
                      {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[#F8F8F6] font-medium">{member.name}</p>
                      {member.active && <CheckCircle2 size={12} className="text-green-400" />}
                    </div>
                    <p className="text-[#444] text-xs mb-2">{member.email}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-sm border inline-flex items-center gap-1 ${cfg.color} ${cfg.border}`}>
                      <Icon size={10} /> {cfg.label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#444] text-xs">Clients</p>
                  <p className="font-serif text-xl text-[#F8F8F6]">{assignedClients.length}</p>
                </div>
              </div>

              {assignedClients.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#1A1A1A] flex flex-wrap gap-2">
                  {assignedClients.map((c) => (
                    <span key={c.id} className="text-xs px-2 py-1 bg-[#1A1A1A] text-[#666] border border-[#222] rounded-sm">
                      {c.company}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
