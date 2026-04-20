import { motion } from "framer-motion";
import { Link } from "wouter";
import { Lock, ShieldCheck, ArrowRight, Key } from "lucide-react";
import { useState } from "react";
import logoPath from "@assets/ED_Logo_1776701058230.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" },
  }),
};

export default function Portal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full min-h-[80vh] flex flex-col">
      {/* PORTAL GATEWAY */}
      <section className="flex-1 flex items-center justify-center py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A]" />

        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #9B8B5F 1px, transparent 1px),
              linear-gradient(to bottom, #9B8B5F 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        <div className="container mx-auto px-6 relative z-10 max-w-2xl text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-10"
          >
            <div className="w-20 h-20 rounded-sm overflow-hidden bg-black border border-[#9B8B5F]/30 flex items-center justify-center mx-auto mb-8 shadow-lg">
              <img src={logoPath} alt="The Executive Desk" className="w-16 h-16 object-contain" />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            <span className="text-[#9B8B5F] text-xs uppercase tracking-[0.4em] font-medium mb-6 block">
              Secure Access
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-medium leading-[1.1] mb-6 text-[#F8F8F6]">
              Client Portal
            </h1>
            <p className="text-[#888888] leading-relaxed mb-10 max-w-md mx-auto">
              Secure access for active clients and firm personnel. This portal is restricted to authorized users by invitation only.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="flex flex-col items-center gap-4"
          >
            <button
              onClick={() => setShowModal(true)}
              data-testid="button-access-portal"
              className="bg-[#9B8B5F] text-[#F8F8F6] px-12 py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#8A7A4F] transition-all font-medium inline-flex items-center gap-3 group"
            >
              <Lock size={14} />
              Access Portal
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[#555555] text-xs">
              Not yet a client?{" "}
              <Link href="/contact" className="text-[#9B8B5F] hover:text-[#B8A870] transition-colors underline underline-offset-2">
                Request access
              </Link>
            </p>
          </motion.div>

          {/* Security badges */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-16 flex flex-wrap items-center justify-center gap-6"
          >
            <div className="flex items-center gap-2 text-[#555555] text-xs">
              <ShieldCheck size={14} className="text-[#9B8B5F]" />
              <span>AES-256 Encryption</span>
            </div>
            <div className="w-px h-3 bg-[#333333]" />
            <div className="flex items-center gap-2 text-[#555555] text-xs">
              <Key size={14} className="text-[#9B8B5F]" />
              <span>Two-Factor Authentication</span>
            </div>
            <div className="w-px h-3 bg-[#333333]" />
            <div className="flex items-center gap-2 text-[#555555] text-xs">
              <Lock size={14} className="text-[#9B8B5F]" />
              <span>Secure VPN Routing</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PORTAL INFO STRIP */}
      <div className="bg-[#0D0D0D] border-t border-[#222222] py-8">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-[#9B8B5F] text-xs uppercase tracking-wider font-medium mb-2">
                Role-Based Access
              </p>
              <p className="text-[#666666] text-xs leading-relaxed">
                Four access tiers: Principal, Counsel, Associate, and Client. Each with isolated data visibility.
              </p>
            </div>
            <div>
              <p className="text-[#9B8B5F] text-xs uppercase tracking-wider font-medium mb-2">
                Audit Trail
              </p>
              <p className="text-[#666666] text-xs leading-relaxed">
                Every action is logged and time-stamped in an immutable coordination stream.
              </p>
            </div>
            <div>
              <p className="text-[#9B8B5F] text-xs uppercase tracking-wider font-medium mb-2">
                Invitation Only
              </p>
              <p className="text-[#666666] text-xs leading-relaxed">
                Access is granted exclusively to active clients and authorized firm personnel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ACCESS MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-[#111111] border border-[#333333] rounded-sm p-10 max-w-md w-full z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#9B8B5F]/10 flex items-center justify-center mx-auto mb-6 border border-[#9B8B5F]/20">
                <Lock size={22} className="text-[#9B8B5F]" />
              </div>
              <h2 className="font-serif text-2xl text-[#F8F8F6] mb-3">
                Access by Invitation
              </h2>
              <p className="text-[#888888] text-sm leading-relaxed mb-8">
                Portal access is provided exclusively to active clients following the completion of our onboarding process. To request access or begin an engagement, please contact us directly.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="bg-[#9B8B5F] text-[#F8F8F6] px-8 py-3 text-sm uppercase tracking-wider hover:bg-[#8A7A4F] transition-colors inline-flex items-center justify-center gap-2"
                  data-testid="link-modal-contact"
                >
                  Request Access <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#555555] text-sm hover:text-[#888888] transition-colors"
                  data-testid="button-modal-close"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
