import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Globe, Award, Briefcase, MapPin } from "lucide-react";
import heroBg from "@images/Website Images/Elegant office.png";
import ctaBg from "@images/Website Images/Glass_concrete_building_202604231712.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" },
  }),
};

const sectors = [
  "Real Estate Development",
  "Luxury Retail",
  "F&B Operations",
  "Investment Management (Listed)",
  "Investment Management (Private)",
  "Governance-Driven Environments",
];

const competencies = [
  {
    title: "Stakeholder Coordination",
    description:
      "Complex multi-party alignment across board members, investors, and senior leadership—handled with precision and discretion.",
  },
  {
    title: "Board-Level Documentation",
    description:
      "Confidential governance documentation, board pack preparation, and action tracking built to institutional standards.",
  },
  {
    title: "Cross-Border Travel Logistics",
    description:
      "End-to-end travel coordination across UAE, KSA, Qatar, and international markets—visa, protocol, and timing aligned.",
  },
  {
    title: "Project Management",
    description:
      "Fast-paced, high-stakes project oversight with rigorous accountability and proactive escalation when it matters most.",
  },
];

export default function About() {
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
              The Architect Behind the Counsel
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-medium leading-[1.1] mb-6 text-foreground">
              Earned Over a Decade.<br />
              <span className="text-muted-foreground font-light italic">
                Refined Every Year.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Ten years at the side of C-suite executives and senior leadership across the UAE and Saudi Arabia—navigating complexity so principals can focus on what only they can do.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* EXPERIENCE & PROFILE */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              <div className="aspect-[4/5] bg-muted/40 rounded-sm relative overflow-hidden border border-border">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#111111]/90 to-transparent">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-12 bg-primary" />
                    <div>
                      <p className="text-[#F8F8F6] font-serif text-xl">The Principal</p>
                      <p className="text-[#9B8B5F] text-sm tracking-wide uppercase">UAE-Native. GCC-Expert.</p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground/30 p-12">
                    <Award size={64} className="mx-auto mb-4 text-primary/40" />
                    <p className="font-serif text-2xl">10+ Years</p>
                    <p className="text-sm mt-1">C-Suite Support</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-10">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award size={16} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground">Experience</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  More than a decade supporting C-suite executives and senior leadership directly across the UAE and Saudi Arabia. A track record built not in theory, but in boardrooms, on trade routes, and inside the most complex organizational structures in the GCC.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Briefcase size={16} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground">Sector Expertise</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {sectors.map((s) => (
                    <div
                      key={s}
                      className="flex items-center gap-2 text-sm text-muted-foreground py-1"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={2}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground">Geographic Base</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Natively based in the UAE, serving premium clients across the GCC. Fluent in the operational realities of Dubai, Abu Dhabi, Riyadh, Jeddah, and Doha—and in the nuances that make each market distinct.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* CORE COMPETENCIES */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-left mb-16"
          >
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium mb-4 block">
              What We Do Best
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground">
              Core Competencies
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {competencies.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                className="bg-card border border-border rounded-sm p-8 hover:border-primary/30 transition-colors"
              >
                <div className="w-8 h-0.5 bg-primary mb-6" />
                <h3 className="font-serif text-xl text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* EXPERTISE THAT TRAVELS */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Globe size={20} className="text-primary" />
                <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium">
                  Expertise That Travels
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6">
                From Riyadh to London.<br />
                <span className="text-muted-foreground font-light italic">Same Standard.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Whether your board convenes in Dubai, your investors are in New York, or your next acquisition is in London—coordination that respects time zones, cultures, and confidentiality travels with you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Executive leadership doesn't stay still. Neither does the support infrastructure behind it. The Executive Desk is built for principals who operate across borders, not just offices.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="grid grid-cols-2 gap-4"
            >
              {["Dubai", "Abu Dhabi", "Riyadh", "Jeddah", "Doha", "London", "New York", "Geneva"].map(
                (city, i) => (
                  <motion.div
                    key={city}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    className="border border-border rounded-sm p-4 text-left hover:border-primary/40 hover:bg-muted/30 transition-all"
                  >
                    <p className="font-serif text-foreground">{city}</p>
                  </motion.div>
                )
              )}
            </motion.div>
          </div>
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
              Ready to Work Together?
            </h2>
            <p className="text-[#888888] leading-relaxed mb-10">
              Tell us about your current challenges. We'll respond within one business day.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-[#9B8B5F] text-[#F8F8F6] px-10 py-4 text-sm uppercase tracking-wider hover:bg-[#8A7A4F] transition-colors"
              data-testid="link-contact-cta"
            >
              Start a Conversation <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
