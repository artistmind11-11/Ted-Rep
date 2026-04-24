import { motion } from "framer-motion";
import { Link } from "wouter";
import { ShieldCheck, Lock, FileText, Globe, Users, ArrowRight } from "lucide-react";
import heroBg from "@images/Website Images/Cross-border_business_Middle_202604231712.jpeg";
import midBg from "@images/Website Images/Luxury_boardroom_table_202604231712.jpeg";
import ctaBg from "@images/Website Images/Wax_seal_pressed_202604231712.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" },
  }),
};

const securityItems = [
  {
    title: "Technology Protocols",
    points: [
      "Fully encrypted devices and cloud storage",
      "OneDrive for Business with Data Loss Prevention (DLP)",
      "Mandatory two-factor authentication on all systems",
      "Secure VPN routing for all network usage",
      "Automated secure backups with geo-redundancy",
    ],
  },
  {
    title: "Legal Protections",
    points: [
      "Mutual or one-way NDAs based on client preference",
      "AED 500K–1M Professional Indemnity Insurance",
      "Full compliance with UAE data protection regulations",
      "Confidentiality obligations embedded in all service agreements",
    ],
  },
  {
    title: "Operational Segregation",
    points: [
      "Strict client data segregation with isolated folders",
      "Granular access controls per engagement",
      "Zero cross-client information sharing policy",
      "Explicit confidentiality obligations in all agreements",
    ],
  },
];

const coordinationItems = [
  {
    label: "Board Meeting Preparation",
    desc: "Agenda coordination, pack assembly, pre-read distribution, and post-meeting action tracking.",
  },
  {
    label: "Investor Relations",
    desc: "Coordinating updates, preparing decks, and managing communications with precision and discretion.",
  },
  {
    label: "Multi-Entity Complexity",
    desc: "Navigating overlapping governance structures, subsidiaries, and holding companies seamlessly.",
  },
  {
    label: "Strategic Continuity",
    desc: "Ensuring no thread is dropped across executive absences, transitions, or restructuring periods.",
  },
  {
    label: "Stakeholder Alignment",
    desc: "Managing the flow of information between principals, teams, and external partners with intention.",
  },
  {
    label: "Confidential Communications",
    desc: "Drafting, reviewing, and managing sensitive correspondence at board and investor level.",
  },
];

const gccItems = [
  {
    icon: Globe,
    title: "Cross-Border Operations",
    desc: "Fluency navigating UAE free zones, KSA MISA, and Qatar QFC regulatory regimes—alongside complex visa and travel logistics. Generic offshore models lack this context. Local expertise accelerates execution and eliminates operational friction.",
  },
  {
    icon: FileText,
    title: "Governance Expectations",
    desc: "Deep understanding of specific board meeting formats, documentation standards, and regional investor relations practices. Every market in the GCC has its own cadence. We know all of them.",
  },
  {
    icon: Users,
    title: "Cultural Fluency",
    desc: "Mastery of communication styles with senior stakeholders, relationship dynamics in hierarchical organizations, and calendar management aligned with regional holidays and prayer times.",
  },
];

export default function Services() {
  return (
    <div className="w-full">
      {/* PAGE HERO */}
      <section className="relative py-32 overflow-hidden flex items-center min-h-[60vh]">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.55] dark:opacity-[0.30]" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/40 via-background/75 to-background" />
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium mb-6 block">
              What We Deliver
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-medium leading-[1.1] mb-6 text-foreground">
              The Infrastructure Behind<br />
              <span className="text-muted-foreground font-light italic">
                Every Decisive Leader
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Three pillars, one standard: absolute discretion, uncompromising execution, and the GCC context that offshore models simply cannot replicate.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* PILLAR 1: SECURITY */}
      <section className="py-24" id="security">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-primary" />
                </div>
                <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium">
                  Pillar I
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6">
                Uncompromising<br />Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Confidentiality is not a feature—it is the foundation. Every system, every protocol, and every agreement is designed around the singular principle that your information goes nowhere it should not.
              </p>
              <div className="mt-8 p-6 border border-primary/20 bg-primary/5 rounded-sm">
                <p className="font-serif text-foreground text-lg italic leading-relaxed">
                  "Backed by AED 500K–1M in Professional Indemnity Insurance. Compliance with UAE data protection regulations. Zero cross-client information sharing."
                </p>
              </div>
            </motion.div>

            <div className="space-y-8">
              {securityItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.5}
                  className="border border-border rounded-sm p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Lock size={14} className="text-primary" />
                    <h3 className="font-serif text-lg text-foreground">{item.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* PILLAR 2: COORDINATION */}
      <section className="relative py-24 bg-muted/20 overflow-hidden" id="coordination">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.40] dark:opacity-[0.25]" style={{ backgroundImage: `url(${midBg})` }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/20 via-background/60 to-background/80" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium">
                Pillar II
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6">
              Executive-Level<br />
              <span className="text-muted-foreground font-light italic">Coordination</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Strategic continuity across board relationships, governance structures, and multi-entity complexity. What a senior chief of staff would handle—without the headcount, the politics, or the learning curve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coordinationItems.map((item, i) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.3}
                className="bg-card border border-border rounded-sm p-6 hover:border-primary/30 transition-all hover:shadow-sm group"
              >
                <div className="w-6 h-0.5 bg-primary mb-5 group-hover:w-10 transition-all duration-300" />
                <h3 className="font-serif text-lg text-foreground mb-3">{item.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* PILLAR 3: GCC EXPERTISE */}
      <section className="py-24" id="gcc">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-left mb-16"
          >
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium mb-4 block">
              Pillar III
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6">
              Built Specifically<br />
              <span className="text-muted-foreground font-light italic">for the GCC</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Generic offshore models lack context. Local expertise accelerates execution and eliminates operational friction. This is not a global service adapted for the region—it was built here.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {gccItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.4}
                  className="text-left border border-border rounded-sm p-8 hover:border-primary/30 transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 p-8 bg-muted/30 border border-border rounded-sm text-left"
          >
            <p className="text-foreground font-serif text-xl md:text-2xl italic">
              "UAE Free Zones. KSA MISA. Qatar QFC. Regional holiday calendars. Prayer time alignment. Cultural communication protocols. These are not checklists—they are fluencies."
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#111111] relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.30] dark:opacity-[0.25]" style={{ backgroundImage: `url(${ctaBg})` }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#111111]/80 to-[#111111]" />
        <div className="container mx-auto px-6 text-left max-w-2xl relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#F8F8F6] mb-6">
              Let's Discuss Your Needs
            </h2>
            <p className="text-[#888888] leading-relaxed mb-10">
              Every engagement begins with a confidential conversation. Tell us what you're navigating.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-[#9B8B5F] text-[#F8F8F6] px-10 py-4 text-sm uppercase tracking-wider hover:bg-[#8A7A4F] transition-colors"
              data-testid="link-services-contact-cta"
            >
              Request a Consultation <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
